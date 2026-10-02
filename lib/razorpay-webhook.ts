import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createInvoiceForPayment } from "@/lib/invoices";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  notifyOwnerPaymentSuccess,
  notifyOwnerTrialActivated,
  notifyOwnerPaidSubscription,
  notifyOwnerOneTimePayment,
  sendUserPaymentSuccessEmail,
} from "@/lib/email";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";
import { recordLiveOpsEvent } from "@/lib/ops/events";

// Use service-role client — webhook runs outside user session
function adminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type BillingCycle = "monthly" | "annual" | "lifetime";

function getBillingCycle(value: unknown): BillingCycle {
  if (value === "lifetime") return "lifetime";
  return value === "annual" ? "annual" : "monthly";
}

function addBillingPeriod(start: Date, cycle: BillingCycle) {
  if (cycle === "lifetime") {
    return new Date("2125-01-01T00:00:00.000Z");
  }
  const end = new Date(start);
  if (cycle === "annual") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

const processedWebhookEvents = new Set<string>();

/**
 * Resolves candidate webhook secrets from environment variables.
 * Checks both RAZORPAY_WEBHOOK_SECRET and RAZORPAY_KEY_SECRET (which is frequently
 * pasted into Razorpay Dashboard as the webhook secret).
 */
export function getRazorpayWebhookCandidateSecrets(): string[] {
  const secrets = [
    process.env.RAZORPAY_WEBHOOK_SECRET?.trim(),
    process.env.RAZORPAY_KEY_SECRET?.trim(),
    process.env.RAZORPAY_SECRET?.trim(),
  ];
  return secrets.filter(
    (s): s is string => Boolean(s && s !== "your_webhook_secret" && s !== "your_key_secret")
  );
}

/**
 * Validates HMAC-SHA256 signature against candidate secrets with constant-time equality.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string | null | undefined
): boolean {
  if (!signature) return false;

  const candidateSecrets = getRazorpayWebhookCandidateSecrets();
  if (candidateSecrets.length === 0) {
    console.error(
      "[razorpay-webhook] CRITICAL: Neither RAZORPAY_WEBHOOK_SECRET nor RAZORPAY_KEY_SECRET is configured. Please add RAZORPAY_WEBHOOK_SECRET in Vercel environment variables."
    );
    return false;
  }

  const cleanSig = signature.trim();
  let sigBuf: Buffer;
  try {
    sigBuf = Buffer.from(cleanSig, "hex");
    if (sigBuf.length === 0) return false;
  } catch {
    return false;
  }

  for (const secret of candidateSecrets) {
    try {
      const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
      const expectedBuf = Buffer.from(expected, "hex");

      if (
        expectedBuf.length === sigBuf.length &&
        crypto.timingSafeEqual(expectedBuf, sigBuf)
      ) {
        return true;
      }
    } catch {
      // Continue to next candidate secret
    }
  }

  return false;
}

/**
 * Health check handler for GET requests on the webhook endpoint.
 */
export function handleWebhookGet() {
  return NextResponse.json(
    {
      status: "active",
      endpoint: "razorpay-webhook",
      timestamp: new Date().toISOString(),
      methods: ["POST", "GET", "HEAD"],
    },
    { status: 200 }
  );
}

/**
 * Reachability handler for HEAD requests.
 */
export function handleWebhookHead() {
  return new Response(null, {
    status: 200,
    headers: {
      "x-endpoint-status": "active",
    },
  });
}

/**
 * Core Razorpay Webhook Event Processor
 */
export async function handleRazorpayWebhook(req: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    const candidateSecrets = getRazorpayWebhookCandidateSecrets();
    if (candidateSecrets.length === 0) {
      console.error(
        "[razorpay-webhook] Webhook secret not configured in environment variables. Set RAZORPAY_WEBHOOK_SECRET in Vercel."
      );
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
      console.warn(
        "[razorpay-webhook] Invalid signature received. Check that RAZORPAY_WEBHOOK_SECRET matches the Secret in Razorpay Dashboard."
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error("[razorpay-webhook] Invalid JSON payload:", parseErr);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Webhook event deduplication / idempotency
    const eventId = event.event_id || req.headers.get("x-razorpay-event-id") || "";
    if (eventId) {
      if (processedWebhookEvents.has(eventId)) {
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
      }
      processedWebhookEvents.add(eventId);
      if (processedWebhookEvents.size > 5000) {
        const first = processedWebhookEvents.values().next().value;
        if (first) processedWebhookEvents.delete(first);
      }
    }

    const eventType = event.event;
    const supabase = adminClient();

    // ─── 1. Subscription Mandate & Lifecycle Events ──────────────────────────
    if (typeof eventType === "string" && eventType.startsWith("subscription.")) {
      const subscription = event.payload?.subscription?.entity;
      if (!subscription) return NextResponse.json({ received: true }, { status: 200 });

      const notes = subscription.notes ?? {};
      const userId = notes.user_id;
      const planSlug = (notes.tier || notes.plan_slug || notes.plan_key || "pro").toString().toLowerCase();

      // Look up plan
      let planId = null;
      try {
        const { data: planRow } = await supabase
          .from("plans")
          .select("id")
          .eq("slug", planSlug)
          .maybeSingle();
        if (planRow?.id) planId = planRow.id;
      } catch (err) {
        console.error("[razorpay-webhook] Plan lookup error:", err);
      }

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

          // Non-blocking notification
          void notifyOwnerTrialActivated({
            buyerName: notes.customer_name || null,
            buyerEmail: notes.customer_email || null,
            planName: planSlug.toUpperCase(),
            billingInterval: subscription.period || "monthly",
            subscriptionId: subscription.id,
            paymentId: event.payload?.payment?.entity?.id || null,
            trialEndsAt: trialEndsAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          }).catch((err) => console.error("[email] Error notifying owner of trial activation:", err));

          recordLiveOpsEvent({
            level: "SUCCESS",
            category: "BILLING",
            message: `Free trial activated: ${planSlug.toUpperCase()} for user [${(userId || "").slice(0, 8)}] (${notes.customer_email || "user"})`,
            details: { userId, plan: planSlug, subId: subscription.id },
          });
        }
        return NextResponse.json({ received: true, event: eventType }, { status: 200 });
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
        return NextResponse.json({ received: true, event: eventType }, { status: 200 });
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
            void notifyOwnerPaidSubscription({
              buyerName: notes.customer_name || payment.email,
              buyerEmail: notes.customer_email || payment.email,
              planName: `${planSlug.toUpperCase()} Plan (Renewal/Charge)`,
              billingCycle: subscription.period || "monthly",
              amountPaise: payment.amount,
              paymentId: payment.id,
              orderId: payment.order_id,
              subscriptionId: subscription.id,
            }).catch((err) => console.error("[email] Error notifying owner of subscription charge:", err));

            recordLiveOpsEvent({
              level: "SUCCESS",
              category: "BILLING",
              message: `Paid subscription active: ${planSlug.toUpperCase()} (₹${payment ? Math.round(payment.amount / 100) : 0}) for user [${(userId || "").slice(0, 8)}]`,
              details: { userId, plan: planSlug, amountPaise: payment?.amount },
            });
          }
        }
        return NextResponse.json({ received: true, event: eventType }, { status: 200 });
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
        return NextResponse.json({ received: true, event: eventType }, { status: 200 });
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
        return NextResponse.json({ received: true, event: eventType }, { status: 200 });
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
        return NextResponse.json({ received: true, event: eventType }, { status: 200 });
      }

      return NextResponse.json({ received: true, event: eventType }, { status: 200 });
    }

    // ─── 2. Payment Captured Handling ─────────────────────────────────────────
    if (event.event !== "payment.captured") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) return NextResponse.json({ received: true }, { status: 200 });

    const notes = payment.notes ?? {};

    // ── 2A. Ticket payment ──
    if (notes.type === "ticket") {
      const razorpayOrderId: string = payment.order_id;
      if (!razorpayOrderId) return NextResponse.json({ received: true }, { status: 200 });

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
        console.error("[razorpay-webhook] ticket_orders update failed:", error.message);
        // Acknowledge receipt with 200 so Razorpay does not retry endlessly
        return NextResponse.json({ received: true, error: error.message }, { status: 200 });
      }

      const paidOrder = paidOrders?.[0] ?? existingOrder;
      if (paidOrder) {
        void notifyOwnerOneTimePayment({
          buyerName: paidOrder.buyer_name,
          buyerEmail: paidOrder.buyer_email,
          itemName: notes.ticket_name || "Paid event ticket",
          amountPaise: paidOrder.amount,
          paymentId: payment.id,
          orderId: razorpayOrderId,
        }).catch((err) => console.error("[email] Error notifying owner of ticket order:", err));

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
                  void communicationService
                    .sendTicketCommunications({
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
                    })
                    .catch((err: unknown) => console.error("[communications]", err));
                }
              }
            }
          } catch (recoverErr) {
            console.error("[webhook ticket recovery error]", recoverErr);
          }
        }
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // ── 2B. Event Pass payment ──
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
          notifyOwnerOneTimePayment({
            buyerName: notes.customer_name,
            buyerEmail: notes.customer_email || payment.email,
            itemName,
            amountPaise: payment.amount,
            paymentId: payment.id,
            orderId: payment.order_id,
            passType,
            registrationLimit: regLimit,
          }),
          notes.customer_email || payment.email
            ? sendUserPaymentSuccessEmail({
                to: notes.customer_email || payment.email,
                name: notes.customer_name,
                itemName,
                amountPaise: payment.amount,
                kind: "event_pass",
              })
            : Promise.resolve(),
        ]).catch((err) => console.error("[email] Error notifying owner of event pass payment:", err));
      }

      void createInvoiceForPayment({
        userId,
        paymentId: payment.id,
        description: `Event Pass (${passType.replace("_", " ").toUpperCase()})`,
        baseAmountRupees: priceRupees,
        discountRupees: 0,
        docType: "TKT",
        customerEmail: payment.email,
        customerName: notes.customer_name,
      });

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // ── 2C. Subscription payment ──
    let userId: string = notes.user_id;
    let planId: string = notes.plan_id;
    const billingCycle = getBillingCycle(notes.billing_cycle);

    // Fallback: If notes are missing, try resolving user by email
    if (!userId) {
      const email = notes.customer_email || payment.email;
      if (email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        if (profile?.id) {
          userId = profile.id;
        }
      }
    }

    if (!userId || !planId) {
      console.warn(
        `[razorpay-webhook] Payment ${payment.id} received without user_id or plan_id notes. Acknowledged with 200 OK to prevent delivery retries.`
      );
      return NextResponse.json(
        { received: true, ignored: true, reason: "Missing notes" },
        { status: 200 }
      );
    }

    const now = new Date();
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("id, provider_subscription_id, current_period_start, current_period_end, registrations_used, has_lifetime_access, lifetime_plan_slug")
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

    const rawSlug = (notes.plan_slug || "Subscription").toString().toLowerCase();
    const isFounder = rawSlug === "founder" || rawSlug === "lifetime" || billingCycle === "lifetime";

    const hasLifetimeAccess = isFounder || Boolean(existingSubscription?.has_lifetime_access);
    const lifetimePlanSlug = isFounder
      ? "founder"
      : (existingSubscription?.lifetime_plan_slug || (existingSubscription?.has_lifetime_access ? "founder" : null));

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
          has_lifetime_access: hasLifetimeAccess,
          lifetime_plan_slug: lifetimePlanSlug,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[razorpay-webhook] subscription update failed:", error.message);
      return NextResponse.json({ received: true, error: error.message }, { status: 200 });
    }

    // Issue invoice for subscription payment
    const basePaise = notes.base_amount
      ? Number(notes.base_amount)
      : payment.amount
        ? Math.round(payment.amount / 1.18)
        : 0;
    const discountPaise = notes.discount_paise ? Number(notes.discount_paise) : 0;

    const invoiceDesc = isFounder
      ? "URPASS Founder Lifetime Access (One-Time)"
      : `${rawSlug.toUpperCase()} Plan (${billingCycle})`;

    void createInvoiceForPayment({
      userId,
      subscriptionId: updatedSub?.id ?? existingSubscription?.id ?? null,
      paymentId: payment.id,
      description: invoiceDesc,
      baseAmountRupees: basePaise / 100,
      discountRupees: discountPaise / 100,
      docType: "SUB",
      customerEmail: payment.email,
      customerName: notes.customer_name,
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEnd,
    });

    if (!isDuplicatePayment) {
      const itemName = isFounder
        ? "URPASS Founder Lifetime Access (One-Time)"
        : `${rawSlug.toUpperCase()} Plan (${billingCycle})`;
      const planDisplayName = isFounder
        ? "Founder Lifetime Plan"
        : `${rawSlug.toUpperCase()} Plan`;

      void Promise.allSettled([
        notifyOwnerPaidSubscription({
          buyerName: notes.customer_name,
          buyerEmail: notes.customer_email || payment.email,
          planName: planDisplayName,
          billingCycle,
          amountPaise: payment.amount,
          paymentId: payment.id,
          orderId: payment.order_id,
          subscriptionId: payment.subscription_id,
        }),
        notes.customer_email || payment.email
          ? sendUserPaymentSuccessEmail({
              to: notes.customer_email || payment.email,
              name: notes.customer_name,
              itemName,
              amountPaise: payment.amount,
              kind: "subscription",
            })
          : Promise.resolve(),
      ]).catch((err) => console.error("[email] Error notifying owner of subscription payment:", err));
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (fatalErr) {
    console.error("[razorpay-webhook] Unexpected error in webhook processing:", fatalErr);
    // Always acknowledge 200 to Razorpay so it does not disable the webhook
    return NextResponse.json({ received: true, error: "Internal processing error logged" }, { status: 200 });
  }
}
