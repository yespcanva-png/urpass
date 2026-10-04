"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { attendeeSchema, type AttendeeInput } from "@/lib/validations/attendee";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  notifyOwnerPaymentSuccess,
  notifyOwnerOneTimePayment,
  sendApplicationConfirmationEmail,
  sendApprovalEmail,
  sendPassEmail,
  sendUserPaymentSuccessEmail,
  sendAttendeeRejectionAndRefundEmail,
} from "@/lib/email";
import Razorpay from "razorpay";
import { createCreditNoteForPayment } from "@/lib/invoices";
import { getUserPlan } from "@/lib/plan";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendWebhooks } from "@/lib/webhooks";
import { recordApiUsage } from "@/lib/api-usage";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getRazorpayCredentials } from "@/lib/razorpay";
import { getEventPaymentConfigService } from "@/lib/payments/service";
import {
  markReservationPaid,
  markReservationApproved,
} from "@/lib/capacity-reservation";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";
import { generatePass } from "./passes";
import crypto from "crypto";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type ActionResult = { error: string } | undefined;

function revalidateEvent(eventId: string) {
  // Only revalidate the overview — the attendees page is realtime-driven
  revalidatePath(`/event/${eventId}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function optionalSingle<T>(query: any): Promise<T | null> {
  if (typeof query.maybeSingle === "function") {
    const { data } = await query.maybeSingle();
    return data ?? null;
  }

  // Some unit-test Supabase mocks only implement required-row lookups.
  return null;
}

async function getEventForOrganizer(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string,
  userId: string
) {
  const { data } = await supabase
    .from("events")
    .select("id, name, attendee_limit, status, application_enabled, organizer_id, organization_id")
    .eq("id", eventId)
    .eq("organizer_id", userId)
    .single();

  if (data) return data;

  // Fallback for active organization team members
  try {
    const { data: orgEvent } = await supabase
      .from("events")
      .select("id, name, attendee_limit, status, application_enabled, organizer_id, organization_id")
      .eq("id", eventId)
      .single();

    if (orgEvent?.organization_id) {
      const { data: member } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", orgEvent.organization_id)
        .eq("user_id", userId)
        .eq("status", "active")
        .in("role", ["owner", "admin", "event_manager"])
        .single();

      if (member) return orgEvent;
    }
  } catch {
    // Graceful fallback for test mocks
  }

  return null;
}

export async function approveAttendee(
  attendeeId: string,
  eventId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const { count: approvedCount } = await supabase
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  if ((approvedCount ?? 0) >= event.attendee_limit) {
    return {
      error: `Event is at capacity (${event.attendee_limit}). Increase the limit in Settings to approve more.`,
    };
  }

  const { error } = await supabase
    .from("attendees")
    .update({ application_status: "approved" })
    .eq("id", attendeeId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };

  // Update associated reservation if this was a paid registration
  const { data: order } = await supabase
    .from("ticket_orders")
    .select("razorpay_order_id")
    .eq("attendee_id", attendeeId)
    .eq("status", "paid")
    .maybeSingle();

  if (order?.razorpay_order_id) {
    await markReservationApproved(adminClient(), order.razorpay_order_id);
  }

  // Notify the attendee they've been approved
  const [{ data: att }, { data: evt }] = await Promise.all([
    supabase.from("attendees").select("name, email").eq("id", attendeeId).single(),
    supabase.from("events").select("name, event_date, venue").eq("id", eventId).single(),
  ]);
  if (att && evt) {
    sendApprovalEmail({
      to: att.email,
      attendeeName: att.name,
      eventName: evt.name,
      eventDate: evt.event_date,
      venue: evt.venue,
    }).catch((err: unknown) => console.error("[email]", err));
  }

  if (event.organization_id) {
    const { recordEnterpriseAudit } = await import("@/lib/audit/enterprise-audit");
    void recordEnterpriseAudit({
      organizationId: event.organization_id,
      eventId: event.id,
      userId: user.id,
      actorEmail: user.email,
      action: "ATTENDEE_APPROVED",
      resourceType: "attendee",
      resourceId: attendeeId,
      oldValues: { application_status: "pending" },
      newValues: { application_status: "approved" },
      details: {
        attendeeName: att?.name,
        attendeeEmail: att?.email,
      },
    });
  }

  revalidateEvent(eventId);
}

export async function rejectAttendee(
  attendeeId: string,
  eventId: string,
  rejectionReason?: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const { data: attendee } = await supabase
    .from("attendees")
    .select("id, name, email, application_status, pass_status, ticket_type_id")
    .eq("id", attendeeId)
    .eq("event_id", eventId)
    .single();

  if (!attendee) return { error: "Attendee not found." };

  // 1. Mark attendee as rejected and pass_status as revoked
  const { error } = await supabase
    .from("attendees")
    .update({ application_status: "rejected", pass_status: "revoked" })
    .eq("id", attendeeId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };

  // 2. Invalidate / Revoke any existing passes in passes table
  await supabase
    .from("passes")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("attendee_id", attendeeId);

  // 3. Decrement registrations used if not already rejected
  if (attendee.application_status !== "rejected") {
    let subQuery = supabase
      .from("subscriptions")
      .select("registrations_used")
      .eq("user_id", event.organizer_id);
    if (typeof subQuery.in === "function") {
      subQuery = subQuery.in("status", ["active", "trialing"]);
    }
    const subscription = await optionalSingle<{ registrations_used: number | null }>(subQuery);

    if (subscription && (subscription.registrations_used ?? 0) > 0) {
      let updateQuery = supabase
        .from("subscriptions")
        .update({ registrations_used: (subscription.registrations_used ?? 0) - 1 })
        .eq("user_id", event.organizer_id);
      if (typeof updateQuery.in === "function") {
        updateQuery = updateQuery.in("status", ["active", "trialing"]);
      }
      await updateQuery;
    }
  }

  // 4. AUTOMATIC REFUND FOR PAID TICKETS
  const admin = adminClient();
  const { data: paidOrders } = await admin
    .from("ticket_orders")
    .select("*")
    .eq("event_id", eventId)
    .eq("status", "paid")
    .or(`attendee_id.eq.${attendeeId},buyer_email.eq.${attendee.email}`);

  const paidOrder = paidOrders && paidOrders.length > 0 ? paidOrders[0] : null;
  let refundId: string | undefined = undefined;
  let creditNoteNumber: string | undefined = undefined;

  if (paidOrder && paidOrder.razorpay_payment_id && paidOrder.refund_status !== "processed") {

    try {
      const paymentConfig = await getEventPaymentConfigService(eventId, event.organizer_id);
      const paymentMode = paymentConfig.payment_mode || paymentConfig.paymentMode || "URPASS_MANAGED";

      let keyId: string | null = null;
      let keySecret: string | null = null;

      if (paymentMode === "URPASS_MANAGED") {
        const creds = getRazorpayCredentials();
        keyId = creds.keyId;
        keySecret = creds.keySecret;
      } else if (event.organization_id) {
        const { data: orgSettings } = await admin
          .from("org_payment_settings")
          .select("razorpay_key_id, razorpay_key_secret")
          .eq("organization_id", event.organization_id)
          .maybeSingle();

        if (orgSettings?.razorpay_key_secret) {
          keyId = orgSettings.razorpay_key_id;
          keySecret = orgSettings.razorpay_key_secret;
        }
      }

      if (!keyId || !keySecret) {
        const { data: paymentSettings } = await admin
          .from("payment_settings")
          .select("razorpay_key_id, razorpay_key_secret")
          .eq("user_id", event.organizer_id)
          .maybeSingle();

        if (paymentSettings?.razorpay_key_secret) {
          keyId = paymentSettings.razorpay_key_id;
          keySecret = paymentSettings.razorpay_key_secret;
        }
      }

      if (keyId && keySecret) {
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const refundResult: any = await (rzp.payments as any).refund(paidOrder.razorpay_payment_id, {
          amount: paidOrder.amount,
          notes: {
            reason: rejectionReason || "Organizer rejected registration application",
            attendee_id: attendeeId,
            event_id: eventId,
          },
        });

        refundId = refundResult?.id || `rfnd_${Date.now()}`;

        await admin
          .from("ticket_orders")
          .update({
            status: "refunded",
            refund_id: refundId,
            refund_status: "processed",
            refunded_at: new Date().toISOString(),
            refund_amount: paidOrder.amount,
            refund_reason: rejectionReason || "Application rejected by organizer",
            updated_at: new Date().toISOString(),
          })
          .eq("id", paidOrder.id);
      }
    } catch (refundErr) {
      console.error("[rejectAttendee] Error processing Razorpay refund:", refundErr);
      await admin
        .from("ticket_orders")
        .update({
          refund_status: "pending",
          refund_reason: rejectionReason || "Application rejected — automated refund failed, queued for retry",
          updated_at: new Date().toISOString(),
        })
        .eq("id", paidOrder.id);
    }

    // 5. Generate GST Credit Note
    try {
      const cnResult = await createCreditNoteForPayment({
        paymentId: paidOrder.razorpay_payment_id,
        reason: rejectionReason || "Application rejected by organizer — Full Refund",
        amountRupees: (paidOrder.amount || 0) / 100,
        userId: event.organizer_id,
        attendeeId: attendee.id,
        eventId: event.id,
        customerName: attendee.name,
        customerEmail: attendee.email,
      });
      if (cnResult?.creditNoteNumber) {
        creditNoteNumber = cnResult.creditNoteNumber;
      }
    } catch (cnErr) {
      console.error("[rejectAttendee] Error generating credit note:", cnErr);
    }

    // 6. Send attendee rejection & refund confirmation email
    void sendAttendeeRejectionAndRefundEmail({
      to: attendee.email,
      attendeeName: attendee.name,
      eventName: event.name,
      amountINR: (paidOrder.amount || 0) / 100,
      refundId,
      creditNoteNumber,
      reason: rejectionReason,
    }).catch((emailErr) => console.error("[rejectAttendee] Error sending refund notification:", emailErr));
  }

  if (event.organization_id) {
    const { recordEnterpriseAudit } = await import("@/lib/audit/enterprise-audit");
    void recordEnterpriseAudit({
      organizationId: event.organization_id,
      eventId: event.id,
      userId: user.id,
      actorEmail: user.email,
      action: "ATTENDEE_REJECTED",
      resourceType: "attendee",
      resourceId: attendeeId,
      oldValues: { application_status: attendee.application_status },
      newValues: { application_status: "rejected" },
      details: {
        attendeeName: attendee.name,
        attendeeEmail: attendee.email,
        rejectionReason: rejectionReason || null,
        refundId: refundId || null,
        creditNoteNumber: creditNoteNumber || null,
      },
    });
  }

  revalidateEvent(eventId);
}

export async function promoteWaitlistAttendee(
  attendeeId: string,
  eventId: string
): Promise<{ success?: boolean; error?: string; passToken?: string }> {
  const approval = await approveAttendee(attendeeId, eventId);
  if (approval?.error) return { error: approval.error };

  const passRes = await generatePass(attendeeId, eventId);
  return { success: true, passToken: passRes?.passToken };
}

export async function promoteNextWaitlistAttendee(
  eventId: string
): Promise<{ success?: boolean; error?: string; attendeeName?: string; passToken?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const { count: approvedCount } = await supabase
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  if ((approvedCount ?? 0) >= event.attendee_limit) {
    return {
      error: `Event is at capacity (${event.attendee_limit}). Increase the attendee limit or revoke an approved attendee first.`,
    };
  }

  const { data: nextAttendee } = await supabase
    .from("attendees")
    .select("id, name, email")
    .eq("event_id", eventId)
    .eq("application_status", "waitlisted")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!nextAttendee) {
    return { error: "No attendees waiting on the waitlist queue." };
  }

  const promoRes = await promoteWaitlistAttendee(nextAttendee.id, eventId);
  if (promoRes.error) return { error: promoRes.error };

  return {
    success: true,
    attendeeName: nextAttendee.name,
    passToken: promoRes.passToken,
  };
}

export async function addAttendee(
  eventId: string,
  data: AttendeeInput
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const parsed = attendeeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };


  const { error } = await supabase.from("attendees").insert({
    event_id: eventId,
    ...parsed.data,
    application_status: "approved",
  });

  if (error) {
    if (error.code === "23505")
      return { error: "An attendee with this email already exists for this event." };
    return { error: error.message };
  }

  void recordApiUsage(user.id, "registrations", 1);
  revalidateEvent(eventId);
}

export async function bulkAddAttendees(
  eventId: string,
  rows: AttendeeInput[]
): Promise<{ added: number; skipped: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { added: 0, skipped: 0, error: "Not authenticated." };

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canCSV) {
    return {
      added: 0,
      skipped: 0,
      error: "CSV upload is available on Starter and Pro plans. Upgrade to use this feature.",
    };
  }

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { added: 0, skipped: 0, error: "Event not found." };

  const valid = rows.filter((r) => attendeeSchema.safeParse(r).success);
  if (valid.length === 0)
    return { added: 0, skipped: rows.length, error: "No valid rows found. Check CSV format." };

  // Insert one by one to count actual inserts vs skipped duplicates
  let added = 0;
  let skipped = rows.length - valid.length;

  for (const row of valid) {
    const { error } = await supabase.from("attendees").insert({
      event_id: eventId,
      ...row,
      application_status: "approved",
    });
    if (error && error.code === "23505") {
      skipped++;
    } else if (error) {
      return { added, skipped, error: error.message };
    } else {
      added++;
    }
  }

  revalidateEvent(eventId);
  if (added > 0) {
    void recordApiUsage(user.id, "registrations", added);
  }
  return { added, skipped };
}

interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

type SelectedTicketType = {
  id: string;
  name: string;
  price: number;
  capacity: number | null;
  status: string;
  sales_start: string | null;
  sales_end: string | null;
} | null;

export async function submitApplication(
  eventId: string,
  data: AttendeeInput,
  payment?: PaymentVerification,
  ticketTypeId?: string | null,
  customResponses?: Record<string, unknown>
): Promise<{ error?: string; passToken?: string; waitlisted?: boolean; message?: string; passPending?: boolean; attendeeId?: string } | undefined> {
  const admin = adminClient();

  const { data: event } = await admin
    .from("events")
    .select("id, status, application_enabled, auto_approve, attendee_limit, waitlist_enabled, name, event_date, venue, is_paid_event, ticket_price, organizer_id, organization_id, custom_fields")
    .eq("id", eventId)
    .eq("status", "active")
    .eq("application_enabled", true)
    .single();

  if (!event) return { error: "Applications are not open for this event." };

  if (event.custom_fields && Array.isArray(event.custom_fields)) {
    for (const f of event.custom_fields as { id: string; label: string; type: string; required?: boolean }[]) {
      if (f.required) {
        const val = customResponses?.[f.id];
        if (val === undefined || val === null || val === "" || (f.type === "checkbox" && !val)) {
          return { error: `Please answer the required question: "${f.label}".` };
        }
      }
    }
  }

  // ── Registration limit check ────────────────────────────────
  // If the event has an attached one-event pass, enforce the pass's limit.
  // Otherwise enforce the organizer's monthly subscription quota.
  const attachedPass = await optionalSingle<{ id: string; registration_limit: number }>(
    admin
      .from("event_passes")
      .select("id, registration_limit")
      .eq("event_id", eventId)
      .eq("status", "attached")
  );

  if (attachedPass) {
    const { count: eventRegCount } = await admin
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .neq("application_status", "rejected");

    if ((eventRegCount ?? 0) >= attachedPass.registration_limit) {
      return {
        error: `This event has reached its registration limit of ${attachedPass.registration_limit.toLocaleString("en-IN")}.`,
      };
    }
  } else {
    // Subscription-based limit
    let orgSubQuery = admin
      .from("subscriptions")
      .select("registrations_used, current_period_start, plan:plans(slug)")
      .eq("user_id", event.organizer_id);
    if (typeof orgSubQuery.in === "function") {
      orgSubQuery = orgSubQuery.in("status", ["active", "trialing"]);
    }
    const orgSub = await optionalSingle<{ registrations_used: number | null }>(orgSubQuery);

    const orgPlan = await getUserPlan(admin as unknown as SupabaseClient, event.organizer_id);
    const regLimit = orgPlan.getLimit("registrations_per_month");

    if (regLimit < 999_999) {
      const regUsed = orgSub?.registrations_used ?? 0;
      if (regUsed >= regLimit) {
        return {
          error: "This event is temporarily unavailable for new registrations. The organizer has reached their monthly limit.",
        };
      }
    }
  }

  let selectedTicketType: SelectedTicketType = null;
  let paymentAmountPaise = event.is_paid_event ? Math.round(event.ticket_price * 100) : 0;

  if (ticketTypeId && ticketTypeId !== "default") {
    const { data: ticketType } = await admin
      .from("ticket_types")
      .select("id, name, price, capacity, status, sales_start, sales_end")
      .eq("id", ticketTypeId)
      .eq("event_id", eventId)
      .single();

    if (!ticketType || ticketType.status !== "on_sale") {
      return { error: "Selected ticket is not available." };
    }

    const now = Date.now();
    const startsAt = ticketType.sales_start ? new Date(ticketType.sales_start).getTime() : null;
    const endsAt = ticketType.sales_end ? new Date(ticketType.sales_end).getTime() : null;
    if ((startsAt != null && startsAt > now) || (endsAt != null && endsAt < now)) {
      return { error: "Selected ticket is not on sale right now." };
    }

    if (ticketType.capacity != null) {
      const { count } = await admin
        .from("attendees")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("ticket_type_id", ticketType.id)
        .neq("application_status", "rejected");

      if ((count ?? 0) >= ticketType.capacity) {
        return { error: "Selected ticket is sold out." };
      }
    }

    selectedTicketType = ticketType;
    paymentAmountPaise = ticketType.price;
  } else {
    // If ticketTypeId is "default" or omitted, try to resolve to the event's default on-sale ticket type
    const query = admin
      .from("ticket_types")
      .select("id, name, price, capacity, status, sales_start, sales_end")
      .eq("event_id", eventId)
      .eq("status", "on_sale");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qAny = query as any;
    const { data: defaultTT } = typeof qAny.order === "function"
      ? await qAny.order("position", { ascending: true }).limit(1).maybeSingle()
      : await query;

    if (defaultTT) {
      const tt = Array.isArray(defaultTT) ? defaultTT[0] : defaultTT;
      if (tt && tt.id) {
        selectedTicketType = tt;
        paymentAmountPaise = tt.price;
      }
    }
  }

  // Verify Razorpay payment signature for paid registrations
  if (paymentAmountPaise > 0) {
    if (!payment?.orderId || !payment?.paymentId || !payment?.signature) {
      return { error: "Payment verification data is missing." };
    }

    let secretKey: string | null = null;
    const paymentConfig = await getEventPaymentConfigService(eventId, event.organizer_id);
    const paymentMode = paymentConfig.payment_mode || paymentConfig.paymentMode || "URPASS_MANAGED";

    if (paymentMode === "URPASS_MANAGED") {
      try {
        secretKey = getRazorpayCredentials().keySecret;
      } catch {
        return { error: "URPASS Managed Payments are not configured for this event." };
      }
    }

    if (paymentMode === "ORGANIZER_GATEWAY" && event.organization_id) {
      const { data: orgSettings } = await admin
        .from("org_payment_settings")
        .select("razorpay_key_secret")
        .eq("organization_id", event.organization_id)
        .maybeSingle();

      if (orgSettings?.razorpay_key_secret) {
        secretKey = orgSettings.razorpay_key_secret;
      }
    }

    if (paymentMode === "ORGANIZER_GATEWAY" && !secretKey) {
      const { data: paymentSettings } = await admin
        .from("payment_settings")
        .select("razorpay_key_secret")
        .eq("user_id", event.organizer_id)
        .maybeSingle();

      if (paymentSettings?.razorpay_key_secret) {
        secretKey = paymentSettings.razorpay_key_secret;
      }
    }

    if (!secretKey) {
      return { error: "Payment gateway not configured for this event." };
    }

    const expected = crypto
      .createHmac("sha256", secretKey)
      .update(`${payment.orderId}|${payment.paymentId}`)
      .digest("hex");

    if (expected !== payment.signature) {
      return { error: "Payment verification failed. Please try again." };
    }

    const { data: ticketOrder } = await admin
      .from("ticket_orders")
      .select("amount, ticket_type_id")
      .eq("razorpay_order_id", payment.orderId)
      .eq("event_id", eventId)
      .single();

    if (!ticketOrder || Number(ticketOrder.amount) < paymentAmountPaise) {
      return { error: "Payment amount does not match the selected ticket." };
    }

    if ((ticketOrder.ticket_type_id ?? null) !== (selectedTicketType?.id ?? null)) {
      return { error: "Payment ticket does not match the selected ticket." };
    }

    // Mark ticket order as paid
    await admin
      .from("ticket_orders")
      .update({ status: "paid", razorpay_payment_id: payment.paymentId, updated_at: new Date().toISOString() })
      .eq("razorpay_order_id", payment.orderId);

    // Transition reservation state: RESERVED -> PAID
    // This guarantees manual-approval events consume capacity immediately upon payment.
    await markReservationPaid(admin, payment.orderId);

    const ticketItemName = selectedTicketType ? `${event.name} — ${selectedTicketType.name}` : event.name;
    void notifyOwnerPaymentSuccess({
      kind: "ticket",
      buyerName: data.name,
      buyerEmail: data.email,
      itemName: ticketItemName,
      amountPaise: Number(ticketOrder.amount),
      paymentId: payment.paymentId,
      orderId: payment.orderId,
    }).catch((err) => console.error("[attendees] notifyOwnerPaymentSuccess error:", err));
  }

  const parsed = attendeeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Increment the organizer's registrations_used counter.
  // Skipped for pass-based events (the pass has its own registration_limit).
  // Non-blocking — a failure here should not block the registration.
  const organizerId = event.organizer_id;
  function incrementRegistrationsUsed() {
    void recordApiUsage(organizerId, "registrations", 1);
    if (attachedPass) return;
    void (async () => {
      let sQuery = admin
        .from("subscriptions")
        .select("registrations_used")
        .eq("user_id", organizerId);
      if (typeof sQuery.in === "function") {
        sQuery = sQuery.in("status", ["active", "trialing"]);
      }
      const s = await optionalSingle<{ registrations_used: number | null }>(sQuery);

      if (!s) return;

      let upQuery = admin
        .from("subscriptions")
        .update({ registrations_used: (s.registrations_used ?? 0) + 1 })
        .eq("user_id", organizerId);
      if (typeof upQuery.in === "function") {
        upQuery = upQuery.in("status", ["active", "trialing"]);
      }
      await upQuery;
    })().catch(() => {});
  }


  if (event.auto_approve) {
    // Capacity check before auto-approving
    const { count: approvedCount } = await admin
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("application_status", "approved");

    if ((approvedCount ?? 0) >= event.attendee_limit) {
      if (event.waitlist_enabled !== false) {
        // Automatically join the waitlist queue
        const attendeeInsert = admin.from("attendees").insert({
          event_id: eventId,
          ...parsed.data,
          application_status: "waitlisted",
          ticket_type_id: selectedTicketType?.id ?? null,
          custom_responses: customResponses ?? {},
        });
        const { data: waitlistedAttendee, error: wlError } = typeof attendeeInsert.select === "function"
          ? await attendeeInsert.select("id").single()
          : await attendeeInsert;

        if (wlError) {
          if (wlError.code === "23505")
            return { error: "You have already applied or joined the waitlist for this event." };
          return { error: wlError.message };
        }

        incrementRegistrationsUsed();
        sendWebhooks(event.organizer_id, "registration.waitlisted", {
          attendee_id: waitlistedAttendee?.id,
          event_id: eventId,
          name: parsed.data.name,
          email: parsed.data.email,
          application_status: "waitlisted",
        }).catch(() => {});

        return {
          waitlisted: true,
          message: "This event is at capacity. You have been added to the waitlist queue and will be notified as spots open up!",
        };
      }

      return { error: "This event is at capacity." };
    }

    // Insert as approved immediately
    const { data: attendee, error: attendeeError } = await admin
      .from("attendees")
      .insert({
        event_id: eventId,
        ...parsed.data,
        application_status: "approved",
        ticket_type_id: selectedTicketType?.id ?? null,
        custom_responses: customResponses ?? {},
      })
      .select("id, pass_type")
      .single();

    if (attendeeError) {
      if (attendeeError.code === "23505")
        return { error: "You have already applied to this event." };
      return { error: attendeeError.message };
    }

    if (paymentAmountPaise > 0 && payment) {
      await admin
        .from("ticket_orders")
        .update({ attendee_id: attendee.id })
        .eq("razorpay_order_id", payment.orderId);
      // Transition reservation: PAID -> APPROVED
      await markReservationApproved(admin, payment.orderId);
    }

    // Generate pass immediately
    const { data: pass, error: passError } = await admin
      .from("passes")
      .insert({
        event_id: eventId,
        attendee_id: attendee.id,
        pass_type: attendee.pass_type,
        ticket_type_id: selectedTicketType?.id ?? null,
      })
      .select("pass_token")
      .single();

    if (!passError && pass) {
      await admin.from("attendees").update({ pass_status: "generated" }).eq("id", attendee.id);
      incrementRegistrationsUsed();

      communicationService
        .sendTicketCommunications({
          eventId,
          eventName: event.name,
          eventDate: event.event_date,
          venue: event.venue,
          ticketId: formatTicketId(pass.pass_token),
          passToken: pass.pass_token,
          attendeeId: attendee.id,
          attendeeName: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          passType: attendee.pass_type,
          ticketUrl: buildTicketUrl(pass.pass_token),
          version: `attendee_${attendee.id}`,
        })
        .catch((err: unknown) => console.error("[communications]", err));

      sendWebhooks(event.organizer_id, "registration.created", {
        attendee_id: attendee.id,
        event_id: eventId,
        name: parsed.data.name,
        email: parsed.data.email,
        application_status: "approved",
      }).catch(() => {});

      if (paymentAmountPaise > 0 && payment) {
        sendWebhooks(event.organizer_id, "payment.success", {
          attendee_id: attendee.id,
          event_id: eventId,
          name: parsed.data.name,
          email: parsed.data.email,
          razorpay_payment_id: payment.paymentId,
          razorpay_order_id: payment.orderId,
        }).catch(() => {});
        const itemName = selectedTicketType ? `${event.name} — ${selectedTicketType.name}` : event.name;
        try {
          await Promise.allSettled([
            notifyOwnerOneTimePayment({
              buyerName: parsed.data.name,
              buyerEmail: parsed.data.email,
              itemName,
              amountPaise: paymentAmountPaise,
              paymentId: payment.paymentId,
              orderId: payment.orderId,
              passType: "Paid Event Ticket",
            }),
            sendUserPaymentSuccessEmail({
              to: parsed.data.email,
              name: parsed.data.name,
              itemName,
              amountPaise: paymentAmountPaise,
              kind: "ticket",
            }),
          ]);
        } catch (err: unknown) {
          console.error("[attendees] Ticket payment notification error:", err);
        }
      }

      return { passToken: pass.pass_token };
    }

    // Pass generation failed — track for recovery retry and notify ops
    await admin
      .from("attendees")
      .update({
        pass_status: "pending_retry",
        pass_error_details: passError ? passError.message : "Initial pass generation timed out",
        pass_retry_count: 1,
      })
      .eq("id", attendee.id);

    incrementRegistrationsUsed();
    sendWebhooks(event.organizer_id, "registration.created", {
      attendee_id: attendee.id,
      event_id: eventId,
      name: parsed.data.name,
      email: parsed.data.email,
      application_status: "approved",
    }).catch(() => {});

    // Schedule background self-healing retry
    void (async () => {
      try {
        await retryPassGeneration(attendee.id, eventId);
      } catch (retryErr) {
        console.error("[submitApplication] Auto-retry pass recovery failed:", retryErr);
      }
    })();

    return {
      passPending: true,
      attendeeId: attendee.id,
      message: "Registration confirmed. Pass generation is processing and will arrive in your email shortly.",
    };
  }

  // Manual approval flow
  const { count: currentApproved } = await admin
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  const atCapacity = (currentApproved ?? 0) >= event.attendee_limit;
  if (atCapacity && event.waitlist_enabled === false) {
    return { error: "This event is at capacity." };
  }

  const initialStatus = atCapacity ? "waitlisted" : "pending";

  const attendeeInsert = admin.from("attendees").insert({
    event_id: eventId,
    ...parsed.data,
    application_status: initialStatus,
    ticket_type_id: selectedTicketType?.id ?? null,
    custom_responses: customResponses ?? {},
  });
  const { data: newAttendee, error } = typeof attendeeInsert.select === "function"
    ? await attendeeInsert.select("id").single()
    : await attendeeInsert;

  if (error) {
    if (error.code === "23505")
      return { error: "You have already applied to this event." };
    return { error: error.message };
  }

  incrementRegistrationsUsed();

  if (initialStatus === "waitlisted") {
    sendWebhooks(event.organizer_id, "registration.waitlisted", {
      attendee_id: newAttendee?.id,
      event_id: eventId,
      name: parsed.data.name,
      email: parsed.data.email,
      application_status: "waitlisted",
    }).catch(() => {});

    return {
      waitlisted: true,
      message: "This event is at capacity. You have been added to the waitlist queue and will be notified as spots open up!",
    };
  }

  if (paymentAmountPaise > 0 && payment && newAttendee) {
    await admin
      .from("ticket_orders")
      .update({ attendee_id: newAttendee.id })
      .eq("razorpay_order_id", payment.orderId);

    const itemName = selectedTicketType ? `${event.name} — ${selectedTicketType.name}` : event.name;
    try {
      await Promise.allSettled([
        notifyOwnerOneTimePayment({
          buyerName: parsed.data.name,
          buyerEmail: parsed.data.email,
          itemName,
          amountPaise: paymentAmountPaise,
          paymentId: payment.paymentId,
          orderId: payment.orderId,
          passType: "Paid Event Ticket",
        }),
        sendUserPaymentSuccessEmail({
          to: parsed.data.email,
          name: parsed.data.name,
          itemName,
          amountPaise: paymentAmountPaise,
          kind: "ticket",
        }),
      ]);
    } catch (err: unknown) {
      console.error("[attendees] Ticket payment notification error:", err);
    }
  }

  sendApplicationConfirmationEmail({
    to: parsed.data.email,
    attendeeName: parsed.data.name,
    eventName: event.name,
    eventDate: event.event_date,
    venue: event.venue,
  }).catch((err: unknown) => console.error("[email]", err));

  // Fire webhook — non-blocking
  sendWebhooks(event.organizer_id, "registration.created", {
    attendee_id: newAttendee?.id ?? null,
    event_id: eventId,
    name: parsed.data.name,
    email: parsed.data.email,
    application_status: "pending",
  }).catch(() => {});
}

export async function exportAttendeesCSV(
  eventId: string
): Promise<{ csv?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canExport) {
    return { error: "Data export is available on the Pro plan. Upgrade to use this feature." };
  }

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const { data: eventDetails } = await supabase
    .from("events")
    .select("custom_fields")
    .eq("id", eventId)
    .single();

  const customFields = (eventDetails?.custom_fields ?? []) as { id: string; label: string }[];

  const { data: attendees } = await supabase
    .from("attendees")
    .select("name, email, phone, pass_type, application_status, pass_status, custom_responses, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (!attendees || attendees.length === 0) return { csv: "" };

  const customHeaders = customFields.map((f) => f.label);
  const headers = [
    "Name", "Email", "Phone", "Pass Type",
    "Application Status", "Pass Status", "Registered At",
    ...customHeaders,
  ];

  const rows = attendees.map((a) => {
    const customVals = customFields.map((f) => {
      const val = (a as unknown as { custom_responses?: Record<string, unknown> }).custom_responses?.[f.id];
      if (val === true) return "Yes";
      if (val === false) return "No";
      return val ?? "";
    });

    return [
      a.name,
      a.email,
      a.phone ?? "",
      a.pass_type,
      a.application_status,
      a.pass_status,
      new Date(a.created_at).toLocaleDateString("en-IN"),
      ...customVals,
    ];
  });

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return { csv };
}

/**
 * Retries pass generation for an attendee whose pass failed or is pending retry.
 * Can be called by background self-healer, attendee confirmation page, or Ops Command Center.
 */
export async function retryPassGeneration(
  attendeeId: string,
  eventId: string
): Promise<{ success: boolean; passToken?: string; error?: string }> {
  const admin = adminClient();

  const { data: attendee, error: attError } = await admin
    .from("attendees")
    .select("id, name, email, phone, pass_type, application_status, pass_status, ticket_type_id, pass_retry_count")
    .eq("id", attendeeId)
    .eq("event_id", eventId)
    .single();

  if (attError || !attendee) {
    return { success: false, error: "Attendee not found." };
  }

  if (attendee.application_status !== "approved") {
    return { success: false, error: "Only approved attendees can generate entrance passes." };
  }

  // 1. Check if pass already exists in passes table
  const { data: existingPass } = await admin
    .from("passes")
    .select("pass_token, status")
    .eq("attendee_id", attendeeId)
    .maybeSingle();

  if (existingPass?.pass_token) {
    await admin
      .from("attendees")
      .update({ pass_status: "generated", pass_error_details: null })
      .eq("id", attendeeId);

    return { success: true, passToken: existingPass.pass_token };
  }

  // 2. Fetch event metadata for communications
  const { data: event } = await admin
    .from("events")
    .select("name, event_date, venue")
    .eq("id", eventId)
    .single();

  // 3. Attempt insert
  const { data: newPass, error: passErr } = await admin
    .from("passes")
    .insert({
      event_id: eventId,
      attendee_id: attendee.id,
      pass_type: attendee.pass_type,
      ticket_type_id: attendee.ticket_type_id ?? null,
    })
    .select("pass_token")
    .single();

  if (passErr || !newPass) {
    await admin
      .from("attendees")
      .update({
        pass_status: "failed",
        pass_error_details: passErr?.message || "Pass generation retry failed",
        pass_retry_count: (attendee.pass_retry_count ?? 0) + 1,
      })
      .eq("id", attendee.id);

    return { success: false, error: passErr?.message || "Failed to generate pass." };
  }

  // 4. Update attendee pass status to generated
  await admin
    .from("attendees")
    .update({ pass_status: "generated", pass_error_details: null })
    .eq("id", attendee.id);

  // 5. Send communications
  if (event) {
    void communicationService
      .sendTicketCommunications({
        eventId,
        eventName: event.name,
        eventDate: event.event_date,
        venue: event.venue,
        ticketId: formatTicketId(newPass.pass_token),
        passToken: newPass.pass_token,
        attendeeId: attendee.id,
        attendeeName: attendee.name,
        email: attendee.email,
        phone: attendee.phone || null,
        passType: attendee.pass_type,
        ticketUrl: buildTicketUrl(newPass.pass_token),
        version: `attendee_${attendee.id}_retry`,
      })
      .catch((err: unknown) => console.error("[communications retry]", err));
  }

  return { success: true, passToken: newPass.pass_token };
}
