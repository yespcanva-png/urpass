import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createInvoiceForPayment } from "@/lib/invoices";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { notifyOwnerPaymentSuccess, sendUserPaymentSuccessEmail } from "@/lib/email";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";

export const dynamic = "force-dynamic";

// Use service-role client — webhook runs outside user session
function adminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type BillingCycle = "monthly" | "annual";

function getBillingCycle(value: unknown): BillingCycle {
  return value === "annual" ? "annual" : "monthly";
}

function addBillingPeriod(start: Date, cycle: BillingCycle) {
  const end = new Date(start);
  if (cycle === "annual") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

const processedWebhookEvents = new Set<string>();

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // Verify HMAC-SHA256 signature
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  // timingSafeEqual requires equal-length buffers; a length mismatch is itself
  // proof of an invalid signature so we can short-circuit safely.
  const expectedBuf = Buffer.from(expected, "hex");
  const sigBuf = Buffer.from(signature, "hex");
  const valid =
    expectedBuf.length === sigBuf.length &&
    crypto.timingSafeEqual(expectedBuf, sigBuf);

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  // Webhook event deduplication / idempotency
  const eventId = event.event_id || req.headers.get("x-razorpay-event-id") || "";
  if (eventId) {
    if (processedWebhookEvents.has(eventId)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    processedWebhookEvents.add(eventId);
    if (processedWebhookEvents.size > 5000) {
      const first = processedWebhookEvents.values().next().value;
      if (first) processedWebhookEvents.delete(first);
    }
  }

  const eventType = event.event;
  const supabase = adminClient();

  // 1. Subscription Mandate & Lifecycle Events
  if (typeof eventType === "string" && eventType.startsWith("subscription.")) {
    const subscription = event.payload?.subscription?.entity;
    if (!subscription) return NextResponse.json({ received: true });

    const notes = subscription.notes ?? {};
    const userId = notes.user_id;
    const planSlug = (notes.tier || notes.plan_slug || notes.plan_key || "pro").toString().toLowerCase();

    // Look up plan
    let planId = null;
    const { data: planRow } = await supabase
      .from("plans")
      .select("id")
      .eq("slug", planSlug)
      .maybeSingle();
    if (planRow?.id) planId = planRow.id;

    if (eventType === "subscription.authenticated") {
      // AutoPay authorization confirmed
      const now = new Date();
      const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (userId) {
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan_id: planId,
            status: "trialing",
            provider: "razorpay",
            billing_cycle: subscription.period || "monthly",
            provider_subscription_id: subscription.id,
            current_period_start: now.toISOString(),
            current_period_end: trialEndsAt.toISOString(),
            cancel_at_period_end: false,
            trial_used: true,
            trial_used_at: now.toISOString(),
            is_trial: true,
            trial_plan: planSlug,
            trial_starts_at: now.toISOString(),
            trial_ends_at: trialEndsAt.toISOString(),
            autopay_mandate_id: subscription.id,
            autopay_status: "active",
            updated_at: now.toISOString(),
          },
          { onConflict: "user_id" }
        );
      }
      return NextResponse.json({ received: true, event: eventType });
    }

    if (eventType === "subscription.activated") {
      if (userId) {
        await supabase
          .from("subscriptions")
          .update({
            autopay_status: "active",
            provider_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
      return NextResponse.json({ received: true, event: eventType });
    }

    if (eventType === "subscription.charged") {
      // First charge after trial or renewal charge
      const payment = event.payload?.payment?.entity;
      const currentStart = subscription.current_start
        ? new Date(subscription.current_start * 1000).toISOString()
        : new Date().toISOString();
      const currentEnd = subscription.current_end
        ? new Date(subscription.current_end * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      if (userId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            is_trial: false,
            autopay_status: "active",
            current_period_start: currentStart,
            current_period_end: currentEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (payment) {
          void notifyOwnerPaymentSuccess({
            kind: "subscription",
            buyerName: notes.customer_name || payment.email,
            buyerEmail: notes.customer_email || payment.email,
            itemName: `${planSlug.toUpperCase()} Plan Renewal`,
            amountPaise: payment.amount,
            paymentId: payment.id,
          }).catch(() => {});
        }
      }
      return NextResponse.json({ received: true, event: eventType });
    }

    if (eventType === "subscription.pending") {
      // Payment failed — enter grace period without deleting customer data
      if (userId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "payment_pending",
            autopay_status: "pending",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
      return NextResponse.json({ received: true, event: eventType });
    }

    if (eventType === "subscription.halted") {
      if (userId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "halted",
            autopay_status: "halted",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
      return NextResponse.json({ received: true, event: eventType });
    }

    if (eventType === "subscription.cancelled") {
      if (userId) {
        const { data: currentSub } = await supabase
          .from("subscriptions")
          .select("is_trial, trial_ends_at")
          .eq("user_id", userId)
          .maybeSingle();

        const inTrial = Boolean(
          currentSub?.is_trial &&
            currentSub.trial_ends_at &&
            new Date(currentSub.trial_ends_at) > new Date()
        );

        await supabase
          .from("subscriptions")
          .update({
            cancel_at_period_end: true,
            status: inTrial ? "trialing" : "cancelled",
            autopay_status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
      return NextResponse.json({ received: true, event: eventType });
    }

    return NextResponse.json({ received: true, event: eventType });
  }

  // 2. Existing Payment.captured handling
  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment) return NextResponse.json({ received: true });

  const notes = payment.notes ?? {};

  // Ticket payment
  if (notes.type === "ticket") {
    const razorpayOrderId: string = payment.order_id;
    if (!razorpayOrderId) return NextResponse.json({ received: true });

    const { data: existingOrder } = await supabase
      .from("ticket_orders")
      .select("id, event_id, ticket_type_id, buyer_name, buyer_email, amount, attendee_id")
      .eq("razorpay_order_id", razorpayOrderId)
      .maybeSingle();

    const { data: paidOrders, error } = await supabase
      .from("ticket_orders")
      .update({
        status: "paid",
        razorpay_payment_id: payment.id,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpayOrderId)
      .select("id, event_id, ticket_type_id, buyer_name, buyer_email, amount, attendee_id");

    if (error) {
      console.error("ticket_orders update failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const paidOrder = paidOrders?.[0] ?? existingOrder;
    if (paidOrder) {
      void notifyOwnerPaymentSuccess({
        kind: "ticket",
        buyerName: paidOrder.buyer_name,
        buyerEmail: paidOrder.buyer_email,
        itemName: notes.ticket_name || "Paid event ticket",
        amountPaise: paidOrder.amount,
        paymentId: payment.id,
        orderId: razorpayOrderId,
      }).catch((err: unknown) => console.error("[email]", err));

      // Fallback recovery: if attendee was not created by the client before drop-off
      if (!paidOrder.attendee_id) {
        try {
          const { data: eventData } = await supabase
            .from("events")
            .select("id, name, event_date, venue, organizer_id")
            .eq("id", paidOrder.event_id)
            .single();

          if (eventData) {
            const { data: existingAttendee } = await supabase
              .from("attendees")
              .select("id, pass_type")
              .eq("event_id", paidOrder.event_id)
              .eq("email", paidOrder.buyer_email)
              .maybeSingle();

            let attendeeId = existingAttendee?.id;
            let passType = existingAttendee?.pass_type ?? "standard";

            if (!attendeeId) {
              const { data: newAttendee } = await supabase
                .from("attendees")
                .insert({
                  event_id: paidOrder.event_id,
                  name: paidOrder.buyer_name,
                  email: paidOrder.buyer_email,
                  application_status: "approved",
                  ticket_type_id: paidOrder.ticket_type_id ?? null,
                  pass_type: "standard",
                })
                .select("id, pass_type")
                .single();

              if (newAttendee) {
                attendeeId = newAttendee.id;
                passType = newAttendee.pass_type;
              }
            }

            if (attendeeId) {
              await supabase
                .from("ticket_orders")
                .update({ attendee_id: attendeeId })
                .eq("id", paidOrder.id);

              const { data: existingPass } = await supabase
                .from("passes")
                .select("pass_token")
                .eq("attendee_id", attendeeId)
                .maybeSingle();

              let passToken = existingPass?.pass_token;

              if (!passToken) {
                const { data: newPass } = await supabase
                  .from("passes")
                  .insert({
                    event_id: paidOrder.event_id,
                    attendee_id: attendeeId,
                    pass_type: passType,
                    ticket_type_id: paidOrder.ticket_type_id ?? null,
                  })
                  .select("pass_token")
                  .single();

                if (newPass) {
                  passToken = newPass.pass_token;
                  await supabase
                    .from("attendees")
                    .update({ pass_status: "generated" })
                    .eq("id", attendeeId);
                }
              }

              if (passToken) {
                const phone = notes.phone || notes.buyer_phone || payment.contact || null;
                void communicationService.sendTicketCommunications({
                  eventId: paidOrder.event_id,
                  eventName: eventData.name,
                  eventDate: eventData.event_date,
                  venue: eventData.venue,
                  ticketId: formatTicketId(passToken),
                  passToken,
                  attendeeId,
                  attendeeName: paidOrder.buyer_name,
                  email: paidOrder.buyer_email,
                  phone,
                  passType,
                  ticketUrl: buildTicketUrl(passToken),
                  version: `order_${paidOrder.id}`,
                }).catch((err: unknown) => console.error("[communications]", err));
              }
            }
          }
        } catch (recoverErr) {
          console.error("[webhook ticket recovery error]", recoverErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  }

  // Event Pass payment
  if (notes.pass_type) {
    const userId: string = notes.user_id;
    const passType: string = notes.pass_type;
    const regLimit = Number(notes.registration_limit) || 250;
    const basePaise = Number(notes.base_paise) || (payment.amount ? Math.round(payment.amount / 1.18) : 29900);
    const priceRupees = Math.round(basePaise / 100);

    const { data: existingPass } = await supabase
      .from("event_passes")
      .select("id")
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (!existingPass) {
      await supabase.from("event_passes").insert({
        user_id: userId,
        pass_type: passType,
        registration_limit: regLimit,
        price_rupees: priceRupees,
        payment_id: payment.id,
        status: "available",
      });

      const itemName = `Event Pass (${passType.replace("_", " ").toUpperCase()})`;
      void Promise.allSettled([
        notifyOwnerPaymentSuccess({
          kind: "event_pass",
          buyerName: notes.customer_name,
          buyerEmail: notes.customer_email || payment.email,
          itemName,
          amountPaise: payment.amount,
          paymentId: payment.id,
          orderId: payment.order_id,
        }),
        (notes.customer_email || payment.email)
          ? sendUserPaymentSuccessEmail({
              to: notes.customer_email || payment.email,
              name: notes.customer_name,
              itemName,
              amountPaise: payment.amount,
              kind: "event_pass",
            })
          : Promise.resolve(),
      ]).catch((err: unknown) => console.error("[email]", err));
    }

    void createInvoiceForPayment({
      userId,
      paymentId: payment.id,
      description: `Event Pass (${passType.replace("_", " ").toUpperCase()})`,
      baseAmountRupees: priceRupees,
      discountRupees: 0,
      customerEmail: payment.email,
      customerName: notes.customer_name,
    });

    return NextResponse.json({ received: true });
  }

  // Subscription payment
  const userId: string = notes.user_id;
  const planId: string = notes.plan_id;
  const billingCycle = getBillingCycle(notes.billing_cycle);

  if (!userId || !planId) {
    return NextResponse.json({ error: "Missing notes" }, { status: 400 });
  }

  const now = new Date();
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id, provider_subscription_id, current_period_start, current_period_end, registrations_used")
    .eq("user_id", userId)
    .maybeSingle();

  const isDuplicatePayment = existingSubscription?.provider_subscription_id === payment.id;
  const existingPeriodEnd = existingSubscription?.current_period_end
    ? new Date(existingSubscription.current_period_end)
    : null;
  const periodStart = isDuplicatePayment && existingSubscription?.current_period_start
    ? new Date(existingSubscription.current_period_start)
    : existingPeriodEnd && existingPeriodEnd > now
      ? existingPeriodEnd
      : now;
  const periodEnd = isDuplicatePayment && existingPeriodEnd
    ? existingPeriodEnd
    : addBillingPeriod(periodStart, billingCycle);

  const { data: updatedSub, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan_id: planId,
        status: "active",
        provider: "razorpay",
        billing_cycle: billingCycle,
        provider_subscription_id: payment.id,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        registrations_used: isDuplicatePayment
          ? (existingSubscription?.registrations_used ?? 0)
          : 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("subscription update failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Issue invoice for subscription payment
  const basePaise = notes.base_amount
    ? Number(notes.base_amount)
    : payment.amount
      ? Math.round(payment.amount / 1.18)
      : 0;
  const discountPaise = notes.discount_paise ? Number(notes.discount_paise) : 0;

  void createInvoiceForPayment({
    userId,
    subscriptionId: updatedSub?.id ?? existingSubscription?.id ?? null,
    paymentId: payment.id,
    description: `${(notes.plan_slug || "Subscription").toString().toUpperCase()} Plan (${billingCycle})`,
    baseAmountRupees: basePaise / 100,
    discountRupees: discountPaise / 100,
    customerEmail: payment.email,
    customerName: notes.customer_name,
    billingPeriodStart: periodStart,
    billingPeriodEnd: periodEnd,
  });

  if (!isDuplicatePayment) {
    const itemName = `${(notes.plan_slug || "Subscription").toString().toUpperCase()} Plan (${billingCycle})`;
    void Promise.allSettled([
      notifyOwnerPaymentSuccess({
        kind: "subscription",
        buyerName: notes.customer_name,
        buyerEmail: notes.customer_email || payment.email,
        itemName,
        amountPaise: payment.amount,
        paymentId: payment.id,
        orderId: payment.order_id,
      }),
      (notes.customer_email || payment.email)
        ? sendUserPaymentSuccessEmail({
            to: notes.customer_email || payment.email,
            name: notes.customer_name,
            itemName,
            amountPaise: payment.amount,
            kind: "subscription",
          })
        : Promise.resolve(),
    ]).catch((err: unknown) => console.error("[email]", err));
  }

  return NextResponse.json({ received: true });
}
