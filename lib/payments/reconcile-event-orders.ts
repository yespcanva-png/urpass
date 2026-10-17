import { createClient as createAdminClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { resolveEventRazorpayCredentials, getRazorpayCredentials } from "@/lib/razorpay";
import { markReservationPaid, markReservationApproved } from "@/lib/capacity-reservation";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";
import { sendPassEmail } from "@/lib/email";

function adminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for reconciliation.");
  }
  return createAdminClient(getSupabaseUrl(), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface ReconciliationResult {
  checked: number;
  reconciled: number;
  errors: string[];
}

/**
 * Reconciles ticket orders for an event against payment gateway records.
 * Automatically recovers abandoned client checkouts or dropped webhooks where
 * the attendee completed payment on Razorpay but the attendee record / pass was not generated.
 */
export async function reconcileEventTicketOrders(
  eventId: string,
  options?: { limit?: number }
): Promise<ReconciliationResult> {
  const admin = adminClient();
  const result: ReconciliationResult = { checked: 0, reconciled: 0, errors: [] };

  try {
    const { data: event, error: eventErr } = await admin
      .from("events")
      .select("id, name, event_date, venue, organizer_id, organization_id, custom_pass_design")
      .eq("id", eventId)
      .maybeSingle();

    if (eventErr || !event) {
      result.errors.push(eventErr?.message || "Event not found");
      return result;
    }

    // Resolve Razorpay credentials for this specific event / organizer
    let razorpayClient: Razorpay | null = null;
    try {
      const creds = await resolveEventRazorpayCredentials(admin, {
        id: event.id,
        organizer_id: event.organizer_id,
        organization_id: event.organization_id,
      });
      if (creds?.keyId && creds?.keySecret) {
        razorpayClient = new Razorpay({ key_id: creds.keyId, key_secret: creds.keySecret });
      }
    } catch {
      try {
        const fallback = getRazorpayCredentials();
        if (fallback?.keyId && fallback?.keySecret) {
          razorpayClient = new Razorpay({ key_id: fallback.keyId, key_secret: fallback.keySecret });
        }
      } catch {
        // Razorpay not configured
      }
    }

    const maxOrders = options?.limit ?? 50;

    // Fetch candidate orders needing reconciliation:
    // 1. Orders marked "paid" but missing attendee_id
    // 2. Orders marked "created" with razorpay_order_id (potential dropped callbacks)
    const { data: candidateOrders, error: orderErr } = await admin
      .from("ticket_orders")
      .select("*")
      .eq("event_id", event.id)
      .or("and(status.eq.paid,attendee_id.is.null),and(status.eq.created,not.razorpay_order_id.is.null)")
      .order("created_at", { ascending: false })
      .limit(maxOrders);

    if (orderErr) {
      result.errors.push(orderErr.message);
      return result;
    }

    if (!candidateOrders || candidateOrders.length === 0) {
      return result;
    }

    result.checked = candidateOrders.length;

    for (const order of candidateOrders) {
      try {
        let isPaid = order.status === "paid";
        let paymentId: string | null = order.razorpay_payment_id || null;
        let buyerContact: string | null = null;

        // If not already marked paid in DB, check Razorpay directly
        if (!isPaid && order.razorpay_order_id && razorpayClient) {
          try {
            const ro = await razorpayClient.orders.fetch(order.razorpay_order_id);
            if (ro.status === "paid" || (ro.amount_paid && Number(ro.amount_paid) > 0)) {
              const payments = await razorpayClient.orders.fetchPayments(order.razorpay_order_id);
              const captured =
                payments.items.find((p: any) => p.status === "captured") ||
                payments.items.find((p: any) => p.status === "authorized") ||
                payments.items[0];

              if (captured) {
                isPaid = true;
                paymentId = captured.id;
                buyerContact = captured.contact ? String(captured.contact) : null;
              }
            }
          } catch (fetchErr: any) {
            // Non-critical: order may have been created on another key or test mode
            console.warn(`[reconcile] Razorpay order fetch skipped for ${order.razorpay_order_id}:`, fetchErr?.message);
          }
        }

        if (!isPaid) {
          continue;
        }

        const primaryGroupMember = Array.isArray(order.group_members) && order.group_members.length > 0 ? order.group_members[0] : null;
        const resolvedPhone =
          buyerContact ||
          (primaryGroupMember?.phone ? String(primaryGroupMember.phone) : null) ||
          null;

        const isGroupPass = Boolean(
          (order.total_attendee_count && order.total_attendee_count > 1) ||
          (Array.isArray(order.group_members) && order.group_members.length > 1)
        );

        // Check if attendee already exists in DB
        let { data: attendee } = await admin
          .from("attendees")
          .select("id, name, email, phone, pass_type, pass_status")
          .eq("event_id", event.id)
          .eq("email", order.buyer_email)
          .maybeSingle();

        if (!attendee) {
          const { data: newAttendee, error: attInsertErr } = await admin
            .from("attendees")
            .insert({
              event_id: event.id,
              name: order.buyer_name,
              email: order.buyer_email,
              phone: resolvedPhone,
              application_status: "approved",
              pass_type: "participant",
              ticket_type_id: order.ticket_type_id || null,
              custom_responses: {
                group_members: order.group_members || [],
                is_single_group_qr: isGroupPass,
                group_attendee_count: order.total_attendee_count || 1,
                recovered_from_order: order.razorpay_order_id,
              },
            })
            .select("id, name, email, phone, pass_type, pass_status")
            .single();

          if (attInsertErr || !newAttendee) {
            result.errors.push(`Attendee creation failed for order ${order.id}: ${attInsertErr?.message}`);
            continue;
          }
          attendee = newAttendee;
        }

        // Check if pass exists in DB
        let { data: pass } = await admin
          .from("passes")
          .select("id, pass_token, total_guests, is_group_master")
          .eq("attendee_id", attendee.id)
          .maybeSingle();

        if (!pass) {
          const { data: newPass, error: passInsertErr } = await admin
            .from("passes")
            .insert({
              event_id: event.id,
              attendee_id: attendee.id,
              pass_type: attendee.pass_type || "participant",
              ticket_type_id: order.ticket_type_id || null,
              ...(isGroupPass
                ? {
                    is_group_master: true,
                    total_guests: order.total_attendee_count || 1,
                    checked_in_guests: 0,
                  }
                : {}),
            })
            .select("id, pass_token, total_guests, is_group_master")
            .single();

          if (passInsertErr || !newPass) {
            result.errors.push(`Pass creation failed for attendee ${attendee.id}: ${passInsertErr?.message}`);
            continue;
          }
          pass = newPass;

          await admin
            .from("attendees")
            .update({ pass_status: "generated" })
            .eq("id", attendee.id);
        }

        // Update ticket_orders with authoritative financial and attendee linkage
        await admin
          .from("ticket_orders")
          .update({
            status: "paid",
            razorpay_payment_id: paymentId,
            attendee_id: attendee.id,
            group_qr_code: pass.pass_token,
            total_entitlements: order.total_attendee_count || 1,
            admitted_entitlements: 0,
            group_entry_enabled: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        // Update reservations
        if (order.razorpay_order_id) {
          await markReservationPaid(admin, order.razorpay_order_id).catch(() => {});
          await markReservationApproved(admin, order.razorpay_order_id).catch(() => {});
        }

        // Dispatch communications
        const ticketId = formatTicketId(pass.pass_token);
        void communicationService
          .sendTicketCommunications({
            eventId: event.id,
            eventName: event.name,
            eventDate: event.event_date,
            venue: event.venue,
            ticketId,
            passToken: pass.pass_token,
            attendeeId: attendee.id,
            attendeeName: attendee.name,
            email: attendee.email,
            phone: attendee.phone,
            passType: attendee.pass_type,
            ticketUrl: buildTicketUrl(pass.pass_token),
            version: `reconcile_${attendee.id}`,
          })
          .catch((commErr) => {
            console.warn(`[reconcile] Communication dispatch failed for ${attendee.email}:`, commErr);
          });

        if (attendee.email) {
          void sendPassEmail({
            to: attendee.email,
            attendeeName: attendee.name,
            eventName: event.name,
            eventDate: event.event_date,
            venue: event.venue,
            passToken: pass.pass_token,
            passType: attendee.pass_type,
          }).catch(() => {});
        }

        result.reconciled++;
      } catch (orderLoopErr: any) {
        console.error(`[reconcile] Order processing error for ${order.id}:`, orderLoopErr);
        result.errors.push(`Order ${order.id}: ${orderLoopErr?.message}`);
      }
    }
  } catch (err: any) {
    console.error("[reconcile] Unexpected reconciliation error:", err);
    result.errors.push(err?.message || "Unexpected reconciliation failure");
  }

  return result;
}
