import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  getRazorpayClient,
  verifyRazorpaySubscriptionSignature,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { createInvoiceForPayment } from "@/lib/invoices";
import { getIntroOfferDisclosure, getIntroOfferId, isIntroOfferPlan } from "@/lib/billing/razorpay-subscription-offers";
import { recordFirstEventConversion } from "@/lib/conversion/first-event";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function oneMonthFromNow() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const planSlug = String(body?.planSlug || "").toLowerCase().trim();
  const subscriptionId = String(body?.subscriptionId || "").trim();
  const paymentId = String(body?.paymentId || "").trim();
  const signature = String(body?.signature || "").trim();

  if (!isIntroOfferPlan(planSlug)) {
    return NextResponse.json({ error: "Invalid subscription plan." }, { status: 400 });
  }
  if (!subscriptionId || !paymentId || !signature) {
    return NextResponse.json(
      { error: "Subscription verification failed: subscription ID, payment ID, and signature are required." },
      { status: 400 }
    );
  }

  const isValidSig = verifyRazorpaySubscriptionSignature(subscriptionId, paymentId, signature);
  if (!isValidSig) {
    return NextResponse.json({ error: "Subscription verification failed: invalid signature." }, { status: 400 });
  }

  const admin = adminClient();
  const { data: checkoutIntent, error: intentError } = await admin
    .from("subscription_checkout_intents")
    .select("id, status, amount_paise")
    .eq("user_id", user.id).eq("plan_slug", planSlug)
    .eq("provider_subscription_id", subscriptionId).maybeSingle();
  if (intentError || !checkoutIntent || !["pending", "authorized"].includes(checkoutIntent.status)) {
    return NextResponse.json({ error: "This subscription is not linked to your checkout session." }, { status: 403 });
  }
  const { data: plan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (!plan) {
    return NextResponse.json({ error: `Plan '${planSlug}' not found in database.` }, { status: 400 });
  }

  try {
    const razorpay = getRazorpayClient();
    type ProviderSubscription = { status?: string; notes?: Record<string, string>; offer_id?: string | null;
      current_start?: number; current_end?: number };
    type ProviderPayment = { status?: string; amount?: number; currency?: string;
      subscription_id?: string };
    const subscriptionsApi = razorpay.subscriptions as unknown as {
      fetch: (id: string) => Promise<ProviderSubscription> };
    const paymentsApi = razorpay.payments as unknown as {
      fetch: (id: string) => Promise<ProviderPayment>;
      capture: (id: string, amount: number | undefined, currency: string) => Promise<unknown>;
    };
    const [subscription, payment] = await Promise.all([
      subscriptionsApi.fetch(subscriptionId),
      paymentsApi.fetch(paymentId).catch(() => null),
    ]);

    if (!payment) {
      return NextResponse.json(
        { error: "First payment confirmation failed: payment record was not found on Razorpay. Subscription can only be activated after successful payment confirmation." },
        { status: 400 }
      );
    }

    let paymentStatus = String(payment.status || "").toLowerCase();
    if (paymentStatus !== "captured" && paymentStatus !== "authorized") {
      return NextResponse.json(
        {
          error: `First payment confirmation failed (payment status: ${paymentStatus}). Your subscription can only be activated after successful payment confirmation of ₹34.22.`,
        },
        { status: 400 }
      );
    }

    if (subscription.offer_id && subscription.offer_id !== getIntroOfferId(planSlug)) {
      return NextResponse.json({ error: "Subscription offer does not match the authorized checkout." }, { status: 400 });
    }
    const minimumCharge = subscription.offer_id
      ? getIntroOfferDisclosure(planSlug).introAmountPaise
      : Number(checkoutIntent.amount_paise);
    if (String(payment.currency || "INR").toUpperCase() !== "INR" ||
        !Number.isFinite(payment.amount) || Number(payment.amount) < minimumCharge) {
      return NextResponse.json({ error: "First charge differs from the verified subscription offer." }, { status: 400 });
    }

    if (paymentStatus === "authorized") {
      try {
        await paymentsApi.capture(paymentId, payment.amount, payment.currency || "INR");
      } catch {
        // Auto-capture in progress or handled by subscription
      }
      const captured = await paymentsApi.fetch(paymentId);
      paymentStatus = String(captured?.status || "").toLowerCase();
      if (paymentStatus !== "captured") {
        return NextResponse.json({ error: "Payment capture is pending. Your access will activate after Razorpay confirms it." }, { status: 202 });
      }
    }

    if (String(subscription?.status || "").toLowerCase() !== "active") {
      return NextResponse.json({ error: "AutoPay authorization is pending. Your plan will activate after Razorpay confirms the subscription." }, { status: 202 });
    }
    if (payment.subscription_id && payment.subscription_id !== subscriptionId) {
      return NextResponse.json({ error: "Payment does not belong to this subscription." }, { status: 403 });
    }

    const notes = (subscription?.notes ?? {}) as Record<string, string>;
    if (notes.user_id !== user.id || notes.checkout_intent_id !== checkoutIntent.id) {
      return NextResponse.json({ error: "Subscription does not belong to the authenticated user." }, { status: 403 });
    }
    if (notes.plan_slug && notes.plan_slug !== planSlug) {
      return NextResponse.json({ error: "Subscription plan does not match checkout plan." }, { status: 400 });
    }

    const currentStart = subscription?.current_start
      ? new Date(Number(subscription.current_start) * 1000)
      : new Date();
    const currentEnd = subscription?.current_end
      ? new Date(Number(subscription.current_end) * 1000)
      : oneMonthFromNow();
    const appStatus = "active";

    const { data: existing } = await admin
      .from("subscriptions")
      .select("id, provider_subscription_id, has_lifetime_access, lifetime_plan_slug")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing?.provider_subscription_id === subscriptionId) {
      await admin.from("subscription_checkout_intents").update({ status: "authorized", updated_at: new Date().toISOString() }).eq("id", checkoutIntent.id);
      return NextResponse.json({ success: true, subscriptionId, idempotent: true });
    }

    const { data: updatedSub, error } = await admin
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan_id: plan.id,
          status: appStatus,
          provider: "razorpay",
          billing_cycle: "monthly",
          provider_subscription_id: subscriptionId,
          current_period_start: currentStart.toISOString(),
          current_period_end: currentEnd.toISOString(),
          cancel_at_period_end: false,
          registrations_used: 0,
          is_trial: false,
          autopay_mandate_id: subscriptionId,
          autopay_status: "active",
          free_event_trial_active: false,
          free_event_trial_consumed: false,
          has_lifetime_access: Boolean(existing?.has_lifetime_access),
          lifetime_plan_slug: existing?.lifetime_plan_slug ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await admin.from("subscription_checkout_intents").update({ status: "authorized", updated_at: new Date().toISOString() }).eq("id", checkoutIntent.id);
    const { data: onboardingDraft } = await admin.from("events").select("id")
      .eq("organizer_id", user.id).eq("is_onboarding_draft", true).eq("status", "draft")
      .limit(1).maybeSingle();
    if (onboardingDraft) {
      await recordFirstEventConversion({ userId: user.id, eventId: onboardingDraft.id,
        eventName: "autopay_authorized", idempotencyKey: `autopay:${subscriptionId}`,
        planSlug, billingCycle: "monthly" });
      await recordFirstEventConversion({ userId: user.id, eventId: onboardingDraft.id,
        eventName: "subscription_activated", idempotencyKey: `subscription-active:${subscriptionId}`,
        planSlug, billingCycle: "monthly" });
    }

    const regularPlanPaise = planSlug === "starter" ? 49900 : planSlug === "pro" ? 99900 : 249900;
    const paymentAmount = Number(payment?.amount ?? regularPlanPaise);
    const paymentCurrency = String(payment?.currency || "INR").toUpperCase() as "INR" | "GBP";
    const baseAmountPaise = paymentAmount ? Math.round(paymentAmount / 1.18) : regularPlanPaise;

    await createInvoiceForPayment({
      userId: user.id,
      subscriptionId: updatedSub?.id ?? null,
      paymentId,
      description: `${plan.name} Plan — Monthly AutoPay Subscription`,
      baseAmountRupees: baseAmountPaise / 100,
      discountRupees: 0,
      currency: paymentCurrency,
      docType: "SUB",
      customerEmail: user.email,
      customerName: notes.company_name || user.user_metadata?.full_name,
      customerAddress: notes.billing_address || null,
      customerGstin: notes.customer_gstin || null,
      customerState: notes.billing_state || null,
      customerStateCode: notes.billing_state_code || null,
      billingPeriodStart: currentStart,
      billingPeriodEnd: currentEnd,
    });

    return NextResponse.json({
      success: true,
      subscriptionId,
      paymentId,
      status: appStatus,
      currentPeriodEnd: currentEnd.toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gateway subscription lookup failed.";
    console.error("[api/billing/subscriptions/verify] error:", err);
    return NextResponse.json({ error: `Subscription verification failed: ${message}` }, { status: 502 });
  }
}
