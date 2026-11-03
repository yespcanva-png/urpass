import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createInvoiceForPayment } from "@/lib/invoices";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  notifyOwnerPaymentSuccess,
  notifyOwnerPaidSubscription,
  notifyOwnerOneTimePayment,
  sendUserPaymentSuccessEmail,
  sendUserSubscriptionActivatedEmail,
  sendSubscriptionRenewalSuccessEmail,
  sendSubscriptionRenewalFailedEmail,
} from "@/lib/email";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";
import { recordLiveOpsEvent } from "@/lib/ops/events";
import { reconcileEventTicketOrders } from "@/lib/payments/reconcile-event-orders";
import { recordFirstEventConversion } from "@/lib/conversion/first-event";

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

/**
 * Resolves candidate webhook secrets from environment variables.
 * Checks both RAZORPAY_WEBHOOK_SECRET and RAZORPAY_KEY_SECRET (which is frequently
 * pasted into Razorpay Dashboard as the webhook secret).
 */
export function getRazorpayWebhookCandidateSecrets(): string[] {
  const secrets = [
    process.env.RAZORPAY_WEBHOOK_SECRET?.trim(),
    process.env.RAZORPAY_WEBHOOK_SECRET_PREVIOUS?.trim(),
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
  let currentEventId: string | null = null;
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

    const eventType = (event?.event || "unknown").toString();
    const supabase = adminClient();

    // Reserve the event in PostgreSQL before processing it.
    const eventId =
      event.event_id ||
      req.headers.get("x-razorpay-event-id") ||
      (event.payload?.payment?.entity?.id ? `${eventType}_${event.payload.payment.entity.id}` : null) ||
      (event.payload?.subscription?.entity?.id ? `${eventType}_${event.payload.subscription.entity.id}` : null) ||
      crypto.createHash("sha256").update(rawBody).digest("hex");

    const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

    const { data: claim, error: claimError } = await supabase.rpc("claim_razorpay_webhook", {
      p_event_id: eventId,
      p_event_type: eventType,
      p_payload_hash: payloadHash,
      p_raw_body: rawBody,
      p_signature: signature,
    });
    if (claimError || !claim || claim === "mismatch") {
      console.error("[razorpay-webhook] claim failed", { eventId, eventType, error: claimError?.message, claim });
      return NextResponse.json({ error: "Webhook storage unavailable" }, { status: 503 });
    }
    if (claim === "completed") return NextResponse.json({ received: true, duplicate: true });
    if (claim === "busy") return NextResponse.json({ received: true, processing: true });
    currentEventId = eventId;
    console.info("[razorpay-webhook] claimed", { eventId, eventType });

    const respondSuccess = async (body: Record<string, unknown> = { received: true }) => {
      if (currentEventId) {
        const { error } = await supabase.from("processed_webhook_events")
          .update({ status: "completed", completed_at: new Date().toISOString(), lease_until: null })
          .eq("provider", "razorpay").eq("event_id", currentEventId);
        if (error) throw error;
      }
      return NextResponse.json(body, { status: 200 });
    };

    // ─── 1. Subscription Mandate & Lifecycle Events ──────────────────────────
    if (typeof eventType === "string" && eventType.startsWith("subscription.")) {
      const subscription = event.payload?.subscription?.entity;
      if (!subscription) return respondSuccess({ received: true });

      const notes = subscription.notes ?? {};
      const userId = notes.user_id;
      const planSlug = (notes.tier || notes.plan_slug || notes.plan_key || "pro").toString().toLowerCase();
      if (notes.checkout_intent_id) {
        const { data: linkedIntent } = await supabase.from("subscription_checkout_intents")
          .select("id, user_id, plan_slug")
          .eq("id", notes.checkout_intent_id)
          .eq("provider_subscription_id", subscription.id).maybeSingle();
        if (!linkedIntent || linkedIntent.user_id !== userId || linkedIntent.plan_slug !== planSlug) {
          return respondSuccess({ received: true, ignored: true, reason: "Checkout identity mismatch" });
        }
      }

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
        // Authentication alone is not a paid period. The checkout intent tracks
        // this stage without replacing any current organizer entitlement.
        if (userId) {
          recordLiveOpsEvent({
            level: "SUCCESS",
            category: "BILLING",
            message: `Subscription mandate authenticated: ${planSlug.toUpperCase()} for user [${(userId || "").slice(0, 8)}] (${notes.customer_email || "user"})`,
            details: { userId, plan: planSlug, subId: subscription.id },
          });
        }
        return respondSuccess({ received: true, event: eventType });
      }

      if (eventType === "subscription.activated") {
        // Access is granted by a captured charge, not by this lifecycle event.
        return respondSuccess({ received: true, event: eventType });
      }

      if (eventType === "subscription.charged") {
        // Renewal charge or first cycle after auth
        const payment = event.payload?.payment?.entity;
        if (!payment || payment.subscription_id !== subscription.id ||
            String(payment.status).toLowerCase() !== "captured" ||
            String(subscription.status).toLowerCase() !== "active") {
          throw new Error("Subscription charge has not been confirmed by Razorpay");
        }
        if (!userId || !planId) throw new Error("Charged subscription has no verified user or plan");
        if (!subscription.current_start || !subscription.current_end ||
            subscription.current_end <= subscription.current_start ||
            subscription.current_end * 1000 <= Date.now()) {
          throw new Error("Charged subscription has no valid current period");
        }
        const currentStart = new Date(subscription.current_start * 1000).toISOString();
        const currentEnd = new Date(subscription.current_end * 1000).toISOString();

        if (userId) {
          // Check for pending plan downgrade
          const { data: existingSub } = await supabase
            .from("subscriptions")
            .select("id, provider_subscription_id, current_period_start, pending_plan_id, pending_plan_slug, pending_plan_effective_at")
            .eq("user_id", userId)
            .maybeSingle();

          if (existingSub?.provider_subscription_id && existingSub.provider_subscription_id !== subscription.id &&
              existingSub.provider_subscription_id.startsWith("sub_")) {
            console.error("[razorpay-webhook] charge for non-current subscription", {
              eventId, userId, subscriptionId: subscription.id, currentId: existingSub.provider_subscription_id,
            });
            return respondSuccess({ received: true, event: eventType, reconciliationRequired: true });
          }
          if (existingSub?.provider_subscription_id === subscription.id &&
              existingSub?.current_period_start && existingSub.current_period_start > currentStart) {
            return respondSuccess({ received: true, event: eventType, olderPeriodIgnored: true });
          }

          let resolvedPlanId = planId;
          if (existingSub?.pending_plan_id) {
            resolvedPlanId = existingSub.pending_plan_id;
          }

          const updateData: Record<string, any> = {
            user_id: userId,
            status: "active",
            provider: "razorpay",
            billing_cycle: subscription.period || "monthly",
            provider_subscription_id: subscription.id,
            autopay_mandate_id: subscription.id,
            is_trial: false,
            autopay_status: "active",
            cancellation_state: "none",
            cancellation_error: null,
            current_period_start: currentStart,
            current_period_end: currentEnd,
            registrations_used: existingSub?.current_period_start === currentStart
              ? undefined : 0,
            next_billing_date: currentEnd,
            pending_plan_id: null,
            pending_plan_slug: null,
            pending_plan_effective_at: null,
            updated_at: new Date().toISOString(),
          };
          if (resolvedPlanId) {
            updateData.plan_id = resolvedPlanId;
          }

          const { error: activationError } = await supabase
            .from("subscriptions")
            .upsert(updateData, { onConflict: "user_id" });
          if (activationError) throw activationError;

          try {
            const { recordServerConversion } = await import("@/lib/conversion/server");
            await recordServerConversion({
              eventName: "subscription_started",
              userId,
              pageSlug: "/billing",
              idempotencyKey: `sub_started:${subscription.id}`,
              metadata: {
                provider_subscription_id: subscription.id,
                plan_slug: planSlug,
                billing_cycle: subscription.period || "monthly",
              },
            });
          } catch {}

          if (notes.checkout_intent_id) {
            await supabase.from("subscription_checkout_intents")
              .update({ status: "authorized", updated_at: new Date().toISOString() })
              .eq("id", notes.checkout_intent_id).eq("user_id", userId)
              .eq("provider_subscription_id", subscription.id);
            const { data: onboardingDraft } = await supabase.from("events").select("id")
              .eq("organizer_id", userId).eq("is_onboarding_draft", true)
              .eq("status", "draft").limit(1).maybeSingle();
            if (onboardingDraft) {
              await recordFirstEventConversion({ userId, eventId: onboardingDraft.id,
                eventName: "autopay_authorized", idempotencyKey: `autopay:${subscription.id}`,
                planSlug, billingCycle: subscription.period || "monthly" });
              await recordFirstEventConversion({ userId, eventId: onboardingDraft.id,
                eventName: "subscription_activated", idempotencyKey: `subscription-active:${subscription.id}`,
                planSlug, billingCycle: subscription.period || "monthly" });
            }
          }

          if (payment) {
            // Generate renewal tax invoice
            let invoiceRecord: any = null;
            try {
              const basePaise = payment.amount ? Math.round(payment.amount / 1.18) : 0;
              invoiceRecord = await createInvoiceForPayment({
                userId,
                subscriptionId: existingSub?.id ?? null,
                paymentId: payment.id,
                description: `${planSlug.toUpperCase()} Plan (Renewal)`,
                baseAmountRupees: basePaise / 100,
                discountRupees: 0,
                currency: (payment.currency || "INR").toUpperCase() as "INR" | "GBP",
                docType: "SUB",
                customerEmail: payment.email || notes.customer_email,
                customerName: notes.customer_name || payment.email,
                customerAddress: notes.billing_address || null,
                customerGstin: notes.customer_gstin || null,
                customerState: notes.billing_state || null,
                customerStateCode: notes.billing_state_code || null,
                billingPeriodStart: new Date(currentStart),
                billingPeriodEnd: new Date(currentEnd),
              });
            } catch (invErr) {
              console.error("[razorpay-webhook] Renewal invoice generation error:", invErr);
            }

            const formattedNext = new Date(currentEnd).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            const targetCustomerEmail = payment.email || notes.customer_email;
            if (targetCustomerEmail) {
              void sendSubscriptionRenewalSuccessEmail({
                to: targetCustomerEmail,
                userName: notes.customer_name || payment.email?.split("@")[0],
                planName: `${planSlug.toUpperCase()} Plan`,
                amountMinor: payment.amount,
                currency: payment.currency || "INR",
                invoiceNumber: invoiceRecord?.invoice_number || null,
                nextBillingDate: formattedNext,
              }).catch(() => null);
            }

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
        return respondSuccess({ received: true, event: eventType });
      }

      if (eventType === "subscription.pending") {
        // Payment failed — enter grace period without deleting customer data
        if (userId) {
          const { data: current } = await supabase.from("subscriptions")
            .select("provider_subscription_id, current_period_end").eq("user_id", userId).maybeSingle();
          if (current?.provider_subscription_id !== subscription.id) {
            return respondSuccess({ received: true, event: eventType, existingAccessPreserved: true });
          }
          const paidThrough = Boolean(current?.current_period_end && new Date(current.current_period_end).getTime() > Date.now());
          await supabase
            .from("subscriptions")
            .update({
              status: paidThrough ? "active" : "payment_pending",
              autopay_status: "failing",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId).eq("provider_subscription_id", subscription.id);

          if (notes.customer_email) {
            const gracePeriodEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            void sendSubscriptionRenewalFailedEmail({
              to: notes.customer_email,
              userName: notes.customer_name,
              planName: `${planSlug.toUpperCase()} Plan`,
              gracePeriodEndsAt: gracePeriodEnd,
            }).catch(() => null);
          }
        }
        return respondSuccess({ received: true, event: eventType });
      }

      if (eventType === "subscription.halted") {
        if (userId) {
          const { data: current } = await supabase.from("subscriptions")
            .select("provider_subscription_id, current_period_end").eq("user_id", userId).maybeSingle();
          if (current?.provider_subscription_id !== subscription.id) {
            return respondSuccess({ received: true, event: eventType, existingAccessPreserved: true });
          }
          const paidThrough = Boolean(current?.current_period_end && new Date(current.current_period_end).getTime() > Date.now());
          await supabase
            .from("subscriptions")
            .update({
              status: paidThrough ? "active" : "halted",
              autopay_status: "halted",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId).eq("provider_subscription_id", subscription.id);
        }
        return respondSuccess({ received: true, event: eventType });
      }

      if (eventType === "subscription.cancelled") {
        if (notes.checkout_intent_id && userId) {
          await supabase.from("subscription_checkout_intents")
            .update({ status: "cancelled", updated_at: new Date().toISOString() })
            .eq("id", notes.checkout_intent_id).eq("user_id", userId)
            .eq("provider_subscription_id", subscription.id);
        }
        if (userId) {
          const { data: currentSub } = await supabase
            .from("subscriptions")
            .select("is_trial, trial_ends_at, current_period_end, provider_subscription_id")
            .eq("user_id", userId)
            .maybeSingle();
          if (currentSub?.provider_subscription_id !== subscription.id) {
            return respondSuccess({ received: true, event: eventType, existingAccessPreserved: true });
          }

          const inTrial = Boolean(
            currentSub?.is_trial &&
              currentSub.trial_ends_at &&
              new Date(currentSub.trial_ends_at) > new Date()
          );

          const hasFuturePaidPeriod = currentSub?.current_period_end && new Date(currentSub.current_period_end) > new Date();

          await supabase
            .from("subscriptions")
            .update({
              cancel_at_period_end: true,
              cancellation_state: hasFuturePaidPeriod ? "cancellation_scheduled" : "cancellation_confirmed",
              cancellation_confirmed_at: new Date().toISOString(),
              status: inTrial ? "trialing" : hasFuturePaidPeriod ? "active" : "cancelled",
              autopay_status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId).eq("provider_subscription_id", subscription.id);
        }
        return respondSuccess({ received: true, event: eventType });
      }

      return respondSuccess({ received: true, event: eventType });
    }

    // ─── 2. Payment Captured Handling ─────────────────────────────────────────
    if (event.event !== "payment.captured") {
      return respondSuccess({ received: true });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) return respondSuccess({ received: true });

    // Subscription charges are handled by subscription.charged. Never turn one
    // into a one-time period merely because its payment carries plan notes.
    if (payment.subscription_id) {
      return respondSuccess({ received: true, ignored: true, reason: "Subscription payment" });
    }

    const notes = payment.notes ?? {};

    // ── 2A. Ticket payment ──
    if (notes.type === "ticket") {
      const razorpayOrderId: string = payment.order_id;
      if (!razorpayOrderId) return respondSuccess({ received: true });

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
        throw error;
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

        // Fallback recovery: ensure attendee, pass, and group entitlements are fully provisioned
        if (!paidOrder.attendee_id) {
          try {
            await reconcileEventTicketOrders(paidOrder.event_id);
          } catch (recoverErr) {
            console.error("[webhook ticket recovery error]", recoverErr);
          }
        }
      }

      return respondSuccess({ received: true });
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

      return respondSuccess({ received: true });
    }

    // ── 2C. Subscription payment ──
    let userId: string = notes.user_id;
    let planId: string = notes.plan_id;
    const billingCycle = getBillingCycle(notes.billing_cycle);

    if (!userId || !planId || (notes.kind && notes.kind !== "urpass_plan_order")) {
      console.warn(
        `[razorpay-webhook] Payment ${payment.id} received without user_id or plan_id notes. Acknowledged with 200 OK to prevent delivery retries.`
      );
      return respondSuccess({ received: true, ignored: true, reason: "Missing notes" });
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
          next_billing_date: null,
          cancel_at_period_end: false,
          autopay_status: "none",
          autopay_mandate_id: null,
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
      throw error;
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

    await createInvoiceForPayment({
      userId,
      subscriptionId: updatedSub?.id ?? existingSubscription?.id ?? null,
      paymentId: payment.id,
      description: invoiceDesc,
      baseAmountRupees: basePaise / 100,
      discountRupees: discountPaise / 100,
      currency: (payment.currency || "INR").toUpperCase() as "INR" | "GBP",
      docType: "SUB",
      customerEmail: payment.email,
      customerName: notes.customer_name,
      customerAddress: notes.billing_address || null,
      customerGstin: notes.customer_gstin || null,
      customerState: notes.billing_state || null,
      customerStateCode: notes.billing_state_code || null,
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

      const formattedAmount = payment.amount ? `₹${(payment.amount / 100).toLocaleString("en-IN")}` : null;
      const formattedPaidThrough = periodEnd.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const recipientEmail = notes.customer_email || payment.email;

      void Promise.allSettled([
        notifyOwnerPaidSubscription({
          buyerName: notes.customer_name,
          buyerEmail: recipientEmail,
          planName: planDisplayName,
          billingCycle,
          amountPaise: payment.amount,
          paymentId: payment.id,
          orderId: payment.order_id,
          subscriptionId: payment.subscription_id,
        }),
        recipientEmail
          ? sendUserSubscriptionActivatedEmail({
              to: recipientEmail,
              name: notes.customer_name,
              planName: planDisplayName,
              amountFormatted: formattedAmount,
              billingCycle: isFounder ? "lifetime" : billingCycle,
              renewalDate: isFounder ? "Lifetime Access" : formattedPaidThrough,
              oneTime: true,
              isTrial: false,
            })
          : Promise.resolve(),
      ]).catch((err) => console.error("[email] Error notifying owner or user of subscription payment:", err));
    }

    return respondSuccess({ received: true });
  } catch (fatalErr) {
    console.error("[razorpay-webhook] Unexpected error in webhook processing:", fatalErr);
    if (currentEventId) {
      try {
        const supabase = adminClient();
        await supabase
          .from("processed_webhook_events")
          .update({
            status: "failed",
            error_message: fatalErr instanceof Error ? fatalErr.message : String(fatalErr),
            lease_until: null,
          })
          .eq("provider", "razorpay")
          .eq("event_id", currentEventId);
      } catch {}
    }
    return NextResponse.json({ error: "Webhook processing failed; retry required" }, { status: 503 });
  }
}
