import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  getRazorpayClient,
  verifyRazorpaySubscriptionSignature,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { createInvoiceForPayment } from "@/lib/invoices";
import {
  getIntroOfferDisclosure,
  isIntroOfferPlan,
} from "@/lib/billing/razorpay-subscription-offers";
import type { IntroOfferPlanSlug } from "@/lib/billing/razorpay-subscription-offers";

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
    const [subscription, payment] = await Promise.all([
      (razorpay.subscriptions as any).fetch(subscriptionId),
      (razorpay.payments as any).fetch(paymentId).catch(() => null),
    ]);

    if (!payment) {
      return NextResponse.json(
        { error: "First payment confirmation failed: payment record was not found on Razorpay. Subscription can only be activated after successful payment confirmation." },
        { status: 400 }
      );
    }

    const paymentStatus = String(payment.status || "").toLowerCase();
    if (paymentStatus !== "captured" && paymentStatus !== "authorized") {
      return NextResponse.json(
        {
          error: `First payment confirmation failed (payment status: ${paymentStatus}). Your subscription can only be activated after successful payment confirmation of ₹34.22.`,
        },
        { status: 400 }
      );
    }

    if (paymentStatus === "authorized") {
      try {
        await (razorpay.payments as any).capture(paymentId, payment.amount, payment.currency || "INR");
      } catch {
        // Auto-capture in progress or handled by subscription
      }
    }

    const notes = (subscription?.notes ?? {}) as Record<string, string>;
    if (notes.user_id && notes.user_id !== user.id) {
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
    const disclosure = getIntroOfferDisclosure(planSlug as IntroOfferPlanSlug);

    const { data: existing } = await admin
      .from("subscriptions")
      .select("id, provider_subscription_id, has_lifetime_access, lifetime_plan_slug")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing?.provider_subscription_id === subscriptionId) {
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

    const regularPlanPaise = planSlug === "starter" ? 49900 : planSlug === "pro" ? 99900 : 249900;
    const paymentAmount = Number(payment?.amount ?? regularPlanPaise);
    const paymentCurrency = String(payment?.currency || "INR").toUpperCase() as "INR" | "GBP";
    const baseAmountPaise = paymentAmount ? Math.round(paymentAmount / 1.18) : regularPlanPaise;
    const discountPaise = notes.expected_discount ? Number(notes.expected_discount) : 0;

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
