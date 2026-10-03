"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  verifyRazorpaySignature,
  verifyRazorpaySubscriptionSignature,
  getRazorpayClient,
  type PaymentVerificationInput,
} from "@/lib/razorpay";
import { createInvoiceForPayment } from "@/lib/invoices";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  notifyOwnerPaymentSuccess,
  notifyOwnerTrialActivated,
  notifyOwnerPaidSubscription,
  notifyOwnerOneTimePayment,
  sendUserPaymentSuccessEmail,
  sendTrialStartedEmail,
} from "@/lib/email";

type ActionResult = { error?: string; success?: boolean } | undefined;
type BillingCycle = "monthly" | "annual" | "lifetime";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function revalidateBillingPaths() {
  revalidatePath("/billing");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

function periodEnd(cycle: BillingCycle): Date {
  const d = new Date();
  if (cycle === "lifetime") {
    return new Date("2125-01-01T00:00:00.000Z");
  } else if (cycle === "annual") {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d;
}

export async function cancelSubscription(): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();
  const { error } = await admin
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      autopay_status: "cancelled",
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidateBillingPaths();
}

export async function revertToLifetimePlan(): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("has_lifetime_access, lifetime_plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingSub?.has_lifetime_access) {
    return { error: "No lifetime plan associated with this account." };
  }

  const lifetimeSlug = existingSub.lifetime_plan_slug || "founder";
  const { data: founderPlan } = await admin
    .from("plans")
    .select("id, slug")
    .eq("slug", lifetimeSlug)
    .maybeSingle();

  if (!founderPlan) {
    return { error: "Lifetime plan definition not found." };
  }

  const { error } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: user.id,
        plan_id: founderPlan.id,
        status: "active",
        provider: "razorpay",
        billing_cycle: "lifetime",
        current_period_end: "2125-01-01T00:00:00.000Z",
        cancel_at_period_end: false,
        has_lifetime_access: true,
        lifetime_plan_slug: lifetimeSlug,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) return { error: error.message };
  revalidateBillingPaths();
}

export async function activateFreeTrial(planSlug: string): Promise<ActionResult> {
  if (!planSlug || !["starter", "pro", "business"].includes(planSlug)) {
    return { error: "Free trial is only available on Starter, Pro, or Business plans." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();

  // Check if trial has already been used and preserve lifetime status
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, trial_used, has_lifetime_access, lifetime_plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingSub?.trial_used) {
    return { error: "Your account has already used its one free 30-day trial." };
  }

  const { data: targetPlan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .single();

  if (!targetPlan) return { error: "Plan not found." };

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const { error: updateError } = await admin.from("subscriptions").upsert(
    {
      user_id: user.id,
      plan_id: targetPlan.id,
      status: "trialing",
      provider: "none",
      billing_cycle: "monthly",
      current_period_start: now.toISOString(),
      current_period_end: trialEndsAt.toISOString(),
      cancel_at_period_end: false,
      registrations_used: 0,
      trial_used: true,
      is_trial: true,
      trial_plan: planSlug,
      trial_starts_at: now.toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
      autopay_mandate_id: null,
      autopay_status: "none",
      has_lifetime_access: existingSub?.has_lifetime_access ?? false,
      lifetime_plan_slug: existingSub?.lifetime_plan_slug ?? null,
      reminded_7_days: false,
      reminded_3_days: false,
      reminded_1_day: false,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (updateError) {
    return { error: updateError.message };
  }

  const pricePaiseMap: Record<string, number> = {
    starter: 49900,
    pro: 99900,
    business: 249900,
  };

  const formattedEndDate = trialEndsAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    await Promise.allSettled([
      user.email
        ? sendTrialStartedEmail({
            to: user.email,
            userName: user.user_metadata?.full_name,
            planName: targetPlan.name,
            monthlyPricePaise: pricePaiseMap[planSlug] ?? 49900,
            trialEndsAt: formattedEndDate,
          })
        : Promise.resolve(),
      notifyOwnerTrialActivated({
        buyerName: user.user_metadata?.full_name,
        buyerEmail: user.email,
        planName: targetPlan.name,
        billingInterval: "monthly",
        futurePricePaise: pricePaiseMap[planSlug] ?? 49900,
        trialEndsAt: formattedEndDate,
      }),
    ]);
  } catch (err) {
    console.error("[email] Trial started notification error:", err);
  }

  revalidateBillingPaths();
  return undefined;
}

export async function activateTrialSubscription(
  planSlug: string,
  verification?: {
    subscriptionId?: string;
    orderId?: string;
    paymentId?: string;
    signature?: string;
  }
): Promise<ActionResult> {
  if (!planSlug || !["starter", "pro", "business"].includes(planSlug)) {
    return { error: "Free trial is only available on Starter, Pro, or Business plans." };
  }

  // If no verification is provided, activate free trial directly without AutoPay
  if (!verification || !verification.paymentId || !verification.signature) {
    return activateFreeTrial(planSlug);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();

  // Check if trial has already been used and preserve lifetime status
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, trial_used, has_lifetime_access, lifetime_plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingSub?.trial_used) {
    return { error: "Your account has already used its one free 30-day trial." };
  }

  // Verify HMAC signature
  let isValid = false;
  if (verification.subscriptionId) {
    isValid = verifyRazorpaySubscriptionSignature(
      verification.subscriptionId,
      verification.paymentId,
      verification.signature
    );
  } else if (verification.orderId) {
    isValid = verifyRazorpaySignature(
      verification.orderId,
      verification.paymentId,
      verification.signature
    );
  }

  if (!isValid) {
    return { error: "AutoPay verification failed: invalid signature." };
  }

  const { data: targetPlan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .single();

  if (!targetPlan) return { error: "Plan not found." };

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const mandateId = verification.subscriptionId || verification.paymentId;

  const { error: updateError } = await admin.from("subscriptions").upsert(
    {
      user_id: user.id,
      plan_id: targetPlan.id,
      status: "trialing",
      provider: "razorpay",
      billing_cycle: "monthly",
      provider_subscription_id: mandateId,
      current_period_start: now.toISOString(),
      current_period_end: trialEndsAt.toISOString(),
      cancel_at_period_end: false,
      registrations_used: 0,
      trial_used: true,
      is_trial: true,
      trial_plan: planSlug,
      trial_starts_at: now.toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
      autopay_mandate_id: mandateId,
      autopay_status: "active",
      has_lifetime_access: existingSub?.has_lifetime_access ?? false,
      lifetime_plan_slug: existingSub?.lifetime_plan_slug ?? null,
      reminded_7_days: false,
      reminded_3_days: false,
      reminded_1_day: false,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (updateError) {
    return { error: updateError.message };
  }

  const pricePaiseMap: Record<string, number> = {
    starter: 49900,
    pro: 99900,
    business: 249900,
  };

  const formattedEndDate = trialEndsAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    await Promise.allSettled([
      user.email
        ? sendTrialStartedEmail({
            to: user.email,
            userName: user.user_metadata?.full_name,
            planName: targetPlan.name,
            monthlyPricePaise: pricePaiseMap[planSlug] ?? 49900,
            trialEndsAt: formattedEndDate,
          })
        : Promise.resolve(),
      notifyOwnerTrialActivated({
        buyerName: user.user_metadata?.full_name,
        buyerEmail: user.email,
        planName: targetPlan.name,
        billingInterval: "monthly",
        futurePricePaise: pricePaiseMap[planSlug] ?? 49900,
        subscriptionId: verification.subscriptionId,
        paymentId: verification.paymentId,
        trialEndsAt: formattedEndDate,
      }),
    ]);
  } catch (err) {
    console.error("[email] Trial activation notification error:", err);
  }

  revalidateBillingPaths();
}

export async function activateUkFreeTrial(planSlug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, trial_used, has_lifetime_access, lifetime_plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingSub?.trial_used) {
    return { error: "Your account has already used its one free 30-day trial." };
  }

  const { data: targetPlan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .single();

  if (!targetPlan) return { error: "Plan not found." };

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const ukReferenceId = `UK_TRIAL_${Date.now().toString(36).toUpperCase()}`;

  const { error: updateError } = await admin.from("subscriptions").upsert(
    {
      user_id: user.id,
      plan_id: targetPlan.id,
      status: "trialing",
      provider: "uk_direct",
      billing_cycle: "monthly",
      provider_subscription_id: ukReferenceId,
      current_period_start: now.toISOString(),
      current_period_end: trialEndsAt.toISOString(),
      cancel_at_period_end: false,
      registrations_used: 0,
      trial_used: true,
      is_trial: true,
      trial_plan: planSlug,
      trial_starts_at: now.toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
      autopay_mandate_id: ukReferenceId,
      autopay_status: "active",
      has_lifetime_access: existingSub?.has_lifetime_access ?? false,
      lifetime_plan_slug: existingSub?.lifetime_plan_slug ?? null,
      reminded_7_days: false,
      reminded_3_days: false,
      reminded_1_day: false,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (updateError) {
    return { error: updateError.message };
  }

  const ukMonthlyPenceMap: Record<string, number> = {
    starter: 1500, // £15
    pro: 3500,     // £35
    business: 7900,// £79
  };

  const formattedEndDate = trialEndsAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    await Promise.allSettled([
      user.email
        ? sendTrialStartedEmail({
            to: user.email,
            userName: user.user_metadata?.full_name,
            planName: `${targetPlan.name} (UK Trial)`,
            monthlyPricePaise: ukMonthlyPenceMap[planSlug] ?? 3500,
            trialEndsAt: formattedEndDate,
          })
        : Promise.resolve(),
      notifyOwnerTrialActivated({
        buyerName: user.user_metadata?.full_name,
        buyerEmail: user.email,
        planName: `${targetPlan.name} (UK Direct — £0 Trial)`,
        billingInterval: "monthly",
        futurePricePaise: ukMonthlyPenceMap[planSlug] ?? 3500,
        subscriptionId: ukReferenceId,
        paymentId: "UK_NO_GATEWAY_DIRECT",
        trialEndsAt: formattedEndDate,
      }),
    ]);
  } catch (err: unknown) {
    console.error("[billing] UK trial activation notification error:", err);
  }

  revalidateBillingPaths();
  return { success: true };
}

export async function activateUkPlan(
  planSlug: string,
  cycle: "monthly" | "annual" | "lifetime" = "monthly"
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, has_lifetime_access, lifetime_plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  const isFounder = planSlug === "founder" || planSlug === "lifetime" || cycle === "lifetime";
  const normalizedSlug = isFounder ? "founder" : planSlug;

  const { data: targetPlan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", normalizedSlug)
    .eq("is_active", true)
    .single();

  if (!targetPlan) return { error: "Plan not found." };

  const now = new Date();
  const resolvedCycle = isFounder ? "lifetime" : cycle;
  const periodEndDate = isFounder ? new Date("2125-01-01T00:00:00.000Z") : periodEnd(resolvedCycle);
  const ukReferenceId = `UK_DIRECT_${Date.now().toString(36).toUpperCase()}`;

  const { error: updateError } = await admin.from("subscriptions").upsert(
    {
      user_id: user.id,
      plan_id: targetPlan.id,
      status: "active",
      provider: "uk_direct",
      billing_cycle: resolvedCycle,
      provider_subscription_id: ukReferenceId,
      current_period_start: now.toISOString(),
      current_period_end: periodEndDate.toISOString(),
      cancel_at_period_end: false,
      registrations_used: 0,
      is_trial: false,
      autopay_mandate_id: ukReferenceId,
      autopay_status: "active",
      has_lifetime_access: isFounder ? true : (existingSub?.has_lifetime_access ?? false),
      lifetime_plan_slug: isFounder ? "founder" : (existingSub?.lifetime_plan_slug ?? null),
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (updateError) {
    return { error: updateError.message };
  }

  const ukPrices: Record<string, { monthly: number; annual: number }> = {
    starter: { monthly: 1500, annual: 12000 },
    pro: { monthly: 3500, annual: 30000 },
    business: { monthly: 7900, annual: 69900 },
    founder: { monthly: 24900, annual: 24900 },
  };
  const amountPence = isFounder
    ? 24900
    : resolvedCycle === "annual"
    ? (ukPrices[normalizedSlug]?.annual ?? 30000)
    : (ukPrices[normalizedSlug]?.monthly ?? 3500);

  try {
    await Promise.allSettled([
      notifyOwnerPaidSubscription({
        buyerName: user.user_metadata?.full_name,
        buyerEmail: user.email,
        planName: `${targetPlan.name} (UK)`,
        billingCycle: resolvedCycle,
        amountPaise: amountPence,
        paymentId: ukReferenceId,
        orderId: ukReferenceId,
        subscriptionId: ukReferenceId,
        currency: "GBP",
      }),
      user.email
        ? sendUserPaymentSuccessEmail({
            to: user.email,
            name: user.user_metadata?.full_name,
            itemName: `${targetPlan.name} Plan (${resolvedCycle}) [GBP]`,
            amountPaise: amountPence,
            kind: "subscription",
          })
        : Promise.resolve(),
    ]);
  } catch (notifyErr) {
    console.error("[billing] UK plan activation notification error:", notifyErr);
  }

  revalidateBillingPaths();
  return { success: true };
}

export async function switchPlan(
  planSlug: string
): Promise<ActionResult> {
  // Only the free plan can be switched to directly without payment verification.
  // All paid plans must go through activatePaidSubscription with Razorpay verification.
  if (planSlug !== "free") {
    return { error: "Paid plans require payment verification. Please use the checkout flow." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, has_lifetime_access, lifetime_plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  // If user has lifetime access, reverting from an upgraded plan restores Lifetime Founder Plan
  if (existingSub?.has_lifetime_access) {
    return revertToLifetimePlan();
  }

  const { data: targetPlan } = await admin
    .from("plans")
    .select("id, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .single();

  if (!targetPlan) return { error: "Plan not found." };

  const periodStart = new Date();
  const { error } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: user.id,
        plan_id: targetPlan.id,
        status: "active",
        provider: "free",
        billing_cycle: null,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd("monthly").toISOString(),
        cancel_at_period_end: false,
        registrations_used: 0,
        has_lifetime_access: false,
        lifetime_plan_slug: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) return { error: error.message };
  revalidateBillingPaths();
}

interface CouponRedemptionData {
  couponCode: string;
  originalAmountRupees: number;
  discountAmountRupees: number;
  finalAmountRupees: number;
  billingCyclesRemaining: number | null;
}

interface CheckoutBillingDetails {
  companyName?: string | null;
  billingAddress?: string | null;
  gstin?: string | null;
  state?: string | null;
  stateCode?: string | null;
}

export async function activatePaidSubscription(
  planSlug: string,
  payment?: PaymentVerificationInput | { orderId?: string; paymentId?: string; signature?: string } | string,
  cycle: BillingCycle = "monthly",
  couponRedemption?: CouponRedemptionData,
  checkoutBillingDetails?: CheckoutBillingDetails
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const rawSlug = String(planSlug).toLowerCase().trim();
  let normalizedSlug = rawSlug
    .replace("_monthly", "")
    .replace("_yearly", "")
    .replace("_annual", "")
    .replace("_lifetime", "");

  if (normalizedSlug === "founder_lifetime" || normalizedSlug === "lifetime") {
    normalizedSlug = "founder";
  }

  const isFounder = normalizedSlug === "founder";
  const effectiveCycle: BillingCycle = isFounder ? "lifetime" : cycle;

  const admin = adminClient();
  const planQuery = admin
    .from("plans")
    .select("id, slug, name")
    .eq("slug", normalizedSlug)
    .eq("is_active", true);

  const planRes = typeof planQuery.maybeSingle === "function"
    ? await planQuery.maybeSingle()
    : await planQuery.single();

  let targetPlan = planRes?.data;

  if (!targetPlan && isFounder) {
    const { data: seededFounder } = await admin
      .from("plans")
      .upsert(
        {
          name: "Founder Lifetime",
          slug: "founder",
          price_monthly: 1999900,
          price_yearly: 1999900,
          max_events: 999999,
          max_attendees: 999999,
          features: ["all_access", "lifetime"],
          is_active: true,
        },
        { onConflict: "slug" }
      )
      .select("id, slug, name")
      .single();
    targetPlan = seededFounder;
  }

  if (!targetPlan) return { error: "Plan not found." };

  let verifiedPaymentId: string | null = null;
  let orderBasePaise = 0;
  let orderDiscountPaise = 0;
  let orderAmountPaise = 0;
  let orderBillingDetails: CheckoutBillingDetails | undefined = checkoutBillingDetails;

  if (normalizedSlug !== "free") {
    if (!payment || typeof payment === "string" || !payment.orderId || !payment.paymentId || !payment.signature) {
      return {
        error: "Payment verification failed: Razorpay order ID, payment ID, and signature are required.",
      };
    }

    const isValidSig = verifyRazorpaySignature(
      payment.orderId,
      payment.paymentId,
      payment.signature
    );

    if (!isValidSig) {
      return { error: "Payment verification failed: invalid signature." };
    }

    // Verify order on Razorpay
    try {
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.fetch(payment.orderId);
      if (!order) {
        return { error: "Payment verification failed: order not found on gateway." };
      }
      orderAmountPaise = Number(order.amount ?? 0);

      const notes = (order.notes ?? {}) as Record<string, string>;
      if (notes.user_id && notes.user_id !== user.id) {
        return { error: "Order does not belong to the authenticated user." };
      }
      if (notes.plan_slug && notes.plan_slug !== normalizedSlug && notes.plan_slug !== planSlug) {
        return { error: "Order plan does not match target subscription plan." };
      }

      orderBasePaise = notes.base_amount
        ? Number(notes.base_amount)
        : (order.amount ? Math.round(Number(order.amount) / 1.18) : 0);
      orderDiscountPaise = notes.discount_amount ? Number(notes.discount_amount) : 0;
      orderBillingDetails = {
        companyName: checkoutBillingDetails?.companyName ?? notes.company_name ?? null,
        billingAddress: checkoutBillingDetails?.billingAddress ?? notes.billing_address ?? null,
        gstin: checkoutBillingDetails?.gstin ?? notes.customer_gstin ?? null,
        state: checkoutBillingDetails?.state ?? notes.billing_state ?? null,
        stateCode: checkoutBillingDetails?.stateCode ?? notes.billing_state_code ?? null,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gateway order lookup failed";
      return { error: `Payment verification failed: ${msg}` };
    }

    verifiedPaymentId = payment.paymentId;
  }

  // Idempotency: Check if already activated with this paymentId
  if (verifiedPaymentId) {
    const { data: alreadyActive } = await admin
      .from("subscriptions")
      .select("id")
      .eq("provider_subscription_id", verifiedPaymentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (alreadyActive) {
      revalidateBillingPaths();
      return;
    }
  }

  // Preserve lifetime access status if a lifetime user subscribes to an upgraded plan
  const { data: currentSub } = await admin
    .from("subscriptions")
    .select("id, has_lifetime_access, lifetime_plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  const hasLifetimeAccess = isFounder || Boolean(currentSub?.has_lifetime_access);
  const lifetimePlanSlug = isFounder
    ? "founder"
    : (currentSub?.lifetime_plan_slug || (currentSub?.has_lifetime_access ? "founder" : null));

  const periodStart = new Date();
  const periodEndTime = periodEnd(effectiveCycle);
  const { data: updatedSub, error } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: user.id,
        plan_id: targetPlan.id,
        status: "active",
        provider: "razorpay",
        billing_cycle: effectiveCycle,
        provider_subscription_id: verifiedPaymentId,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEndTime.toISOString(),
        cancel_at_period_end: false,
        registrations_used: 0,
        has_lifetime_access: hasLifetimeAccess,
        lifetime_plan_slug: lifetimePlanSlug,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Issue invoice for paid activation
  if (verifiedPaymentId && normalizedSlug !== "free") {
    const companyName = orderBillingDetails?.companyName?.trim() || undefined;
    const billingAddress = orderBillingDetails?.billingAddress?.trim() || undefined;
    const gstin = orderBillingDetails?.gstin?.trim().toUpperCase() || undefined;
    const state = orderBillingDetails?.state?.trim() || undefined;
    const stateCode = orderBillingDetails?.stateCode?.trim() || undefined;

    if (billingAddress || gstin || companyName) {
      const profileUpdates: Record<string, string | null> = {};
      if (companyName) profileUpdates.company_name = companyName;
      if (billingAddress) profileUpdates.billing_address = billingAddress;
      if (orderBillingDetails?.gstin !== undefined) profileUpdates.gstin = gstin ?? null;

      await admin
        .from("profiles")
        .update(profileUpdates)
        .eq("user_id", user.id);
    }

    const invoiceDescription = isFounder
      ? "URPASS Founder Lifetime Access (One-Time)"
      : `${normalizedSlug.toUpperCase()} Plan (${effectiveCycle})`;

    void createInvoiceForPayment({
      userId: user.id,
      subscriptionId: updatedSub?.id ?? null,
      paymentId: verifiedPaymentId,
      description: invoiceDescription,
      baseAmountRupees: orderBasePaise / 100,
      discountRupees: orderDiscountPaise / 100,
      docType: "SUB",
      customerEmail: user.email,
      customerName: companyName || user.user_metadata?.full_name,
      customerAddress: billingAddress,
      customerGstin: gstin,
      customerState: state,
      customerStateCode: stateCode,
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEndTime,
    });

    const planDisplayName = isFounder ? "Founder Lifetime Plan" : `${normalizedSlug.toUpperCase()} Plan`;
    const itemName = isFounder
      ? "URPASS Founder Lifetime Access"
      : `${normalizedSlug.toUpperCase()} Plan (${effectiveCycle})`;
    try {
      await Promise.allSettled([
        notifyOwnerPaidSubscription({
          buyerName: user.user_metadata?.full_name,
          buyerEmail: user.email,
          planName: planDisplayName,
          billingCycle: effectiveCycle,
          amountPaise: orderAmountPaise,
          paymentId: verifiedPaymentId,
          orderId: typeof payment === "object" ? payment.orderId : undefined,
          subscriptionId: verifiedPaymentId,
        }),
        user.email
          ? sendUserPaymentSuccessEmail({
              to: user.email,
              name: user.user_metadata?.full_name,
              itemName,
              amountPaise: orderAmountPaise,
              kind: "subscription",
            })
          : Promise.resolve(),
      ]);
    } catch (err: unknown) {
      console.error("[billing] Paid subscription notification error:", err);
    }
  }

  // Record coupon redemption
  if (couponRedemption) {
    const { data: coupon } = await admin
      .from("coupons")
      .select("id")
      .eq("code", couponRedemption.couponCode.toUpperCase())
      .single();

    if (coupon) {
      await admin.from("coupon_redemptions").insert({
        coupon_id: coupon.id,
        user_id: user.id,
        plan_slug: planSlug,
        billing_cycle: cycle,
        original_amount_rupees: couponRedemption.originalAmountRupees,
        discount_amount_rupees: couponRedemption.discountAmountRupees,
        final_amount_rupees: couponRedemption.finalAmountRupees,
        billing_cycles_remaining: couponRedemption.billingCyclesRemaining,
      });
    }
  }

  revalidateBillingPaths();
}
