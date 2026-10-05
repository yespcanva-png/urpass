import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getPaymentProvider } from "@/lib/payments/providers";
import type { PaymentProvider } from "@/lib/payments/types";
import { communicationService, buildTicketUrl } from "@/lib/communications";
import { recordLiveOpsEvent } from "@/lib/ops/events";

// Admin service-role client
function getAdminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Memory cache for in-flight webhook replay protection
const processedWebhookIds = new Set<string>();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  const provider = (rawProvider.toUpperCase() === "CASHFREE" ? "CASHFREE" : "RAZORPAY") as PaymentProvider;

  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-razorpay-signature") ||
      req.headers.get("x-webhook-signature") ||
      "";

    const paymentAdapter = getPaymentProvider(provider);

    // 1. Authoritative Signature Verification
    const isSignatureValid = paymentAdapter.verifyWebhookSignature(rawBody, signature);
    if (!isSignatureValid && process.env.NODE_ENV === "production") {
      console.error(`[Webhook] Signature verification failed for ${provider}`);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `${provider}_${Date.now()}`;

    // 2. Replay Protection / Idempotency
    if (processedWebhookIds.has(eventId)) {
      return NextResponse.json({ status: "already_processed", eventId }, { status: 200 });
    }
    processedWebhookIds.add(eventId);
    if (processedWebhookIds.size > 2000) {
      processedWebhookIds.clear();
    }

    // 3. Normalize Event
    const normalizedEvent = paymentAdapter.normalizeWebhookEvent(payload);
    if (!normalizedEvent) {
      return NextResponse.json({ status: "ignored_unhandled_event" }, { status: 200 });
    }

    const supabase = getAdminClient();

    // ── CASE A: PAYMENT_CAPTURED ──
    if (normalizedEvent.eventType === "PAYMENT_CAPTURED") {
      const { providerOrderId, providerPaymentId, amount, paymentMethod } = normalizedEvent;

      // Lookup Ticket Order
      const { data: order, error: orderErr } = await supabase
        .from("ticket_orders")
        .select("*, events:event_id(id, name, organizer_id, organization_id)")
        .or(`provider_order_id.eq.${providerOrderId},id.eq.${providerOrderId}`)
        .maybeSingle();

      if (!order) {
        console.warn(`[Webhook] Order not found for providerOrderId: ${providerOrderId}`);
        return NextResponse.json({ status: "order_not_found" }, { status: 200 });
      }

      // Idempotency: If already confirmed, return success
      if (order.order_status === "CONFIRMED") {
        return NextResponse.json({ status: "order_already_confirmed" }, { status: 200 });
      }

      // Record Payment Transaction
      await supabase.from("payment_transactions").insert({
        order_id: order.id,
        provider,
        provider_payment_id: providerPaymentId || `pay_${order.id}`,
        amount: amount || order.total_amount,
        currency: order.currency,
        status: "CAPTURED",
        payment_method: paymentMethod || "upi",
        captured_at: new Date().toISOString(),
        raw_provider_reference: payload,
      });

      // Split Transfer for URPASS_MANAGED
      let transferId: string | null = null;
      if (order.payment_mode === "URPASS_MANAGED" && order.organization_id) {
        // Fetch organization linked account
        const { data: orgAccount } = await supabase
          .from("organization_payment_accounts")
          .select("provider_vendor_id")
          .eq("organization_id", order.organization_id)
          .eq("provider", provider)
          .maybeSingle();

        if (orgAccount?.provider_vendor_id) {
          const transferRes = await paymentAdapter.createSplitTransfer({
            paymentId: providerPaymentId || "",
            linkedAccountId: orgAccount.provider_vendor_id,
            amountINR: order.organizer_share,
            currency: order.currency,
            notes: {
              order_id: order.id,
              order_number: order.order_number,
            },
          });
          transferId = transferRes.providerTransferId;

          await supabase.from("payment_transfers").insert({
            order_id: order.id,
            payment_id: providerPaymentId || "",
            organization_id: order.organization_id,
            provider,
            linked_account_id: orgAccount.provider_vendor_id,
            gross_amount: order.subtotal,
            platform_fee: order.platform_fee,
            organizer_share: order.organizer_share,
            provider_transfer_id: transferId,
            status: "PROCESSED",
          });
        }
      }

      // 4. Create / Confirm Attendee Record
      const { data: attendee, error: attendeeErr } = await supabase
        .from("attendees")
        .upsert(
          {
            event_id: order.event_id,
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            pass_type: "paid_delegate",
            application_status: "approved",
            pass_status: "generated",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "event_id,email" }
        )
        .select()
        .single();

      // 5. Generate Authoritative Pass with Opaque Token
      let passToken = "";
      if (attendee) {
        const { data: pass } = await supabase
          .from("passes")
          .upsert(
            {
              event_id: order.event_id,
              attendee_id: attendee.id,
              pass_type: "paid_delegate",
              status: "generated",
              ticket_status: "VALID",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "attendee_id,event_id" }
          )
          .select("pass_token")
          .single();

        passToken = pass?.pass_token || "";
      }

      // 6. Update Ticket Order to CONFIRMED
      await supabase
        .from("ticket_orders")
        .update({
          payment_status: "CAPTURED",
          order_status: "CONFIRMED",
          attendee_id: attendee?.id || null,
          provider_payment_id: providerPaymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      // 7. Confirm Inventory Reservation if present
      if (order.reservation_id) {
        await supabase
          .from("ticket_reservations")
          .update({
            status: "PAID",
            order_id: order.order_number,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.reservation_id);
      }

      // 8. Log Ops Event
      recordLiveOpsEvent({
        level: "SUCCESS",
        category: "BILLING",
        message: `Paid ticket confirmed: ${order.customer_name} (₹${order.total_amount})`,
        details: {
          orderNumber: order.order_number,
          providerOrderId,
          providerPaymentId,
          transferId,
          organizerShare: order.organizer_share,
        },
      });

      // 9. Dispatch Email & WhatsApp with Ticket
      if (passToken) {
        const ticketUrl = buildTicketUrl(passToken);
        communicationService
          .sendTicketEmail({
            eventId: order.event_id,
            eventName: order.events?.name || "Your Event",
            ticketId: order.order_number,
            passToken,
            attendeeId: attendee?.id || order.attendee_id || "",
            attendeeName: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone || undefined,
            ticketUrl,
          })
          .catch(() => {});
      }

      return NextResponse.json({
        status: "success",
        orderNumber: order.order_number,
        message: "Payment captured, split transferred, and ticket issued.",
      });
    }

    // ── CASE B: REFUND_PROCESSED ──
    if (normalizedEvent.eventType === "REFUND_PROCESSED") {
      const { providerPaymentId, providerRefundId, amount } = normalizedEvent;

      const { data: order } = await supabase
        .from("ticket_orders")
        .select("id, attendee_id")
        .eq("provider_payment_id", providerPaymentId)
        .maybeSingle();

      if (order) {
        await supabase
          .from("ticket_orders")
          .update({
            payment_status: "REFUNDED",
            order_status: "REFUNDED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        if (order.attendee_id) {
          // CRITICAL: Invalidate pass for gate camera scanners
          await supabase
            .from("passes")
            .update({
              ticket_status: "REFUNDED",
              updated_at: new Date().toISOString(),
            })
            .eq("attendee_id", order.attendee_id);
        }
      }

      return NextResponse.json({ status: "refund_processed", providerRefundId, amount });
    }

    return NextResponse.json({ status: "processed", event: normalizedEvent.eventType });
  } catch (err) {
    console.error("[Webhook Error]:", err);
    return NextResponse.json({ error: "Internal webhook processing error" }, { status: 500 });
  }
}
