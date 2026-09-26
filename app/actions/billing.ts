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

type ActionResult = { error: string } | undefined;
type BillingCycle = "monthly" | "annual";

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
  if (cycle === "annual") {
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

export async function activateFreeTrial(planSlug: string): Promise<ActionResult> {
  if (!planSlug || !["starter", "pro", "business"].includes(planSlug)) {
    return { error: "Free trial is only available on Starter, Pro, or Business plans." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();

  // Check if trial has already been used
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, trial_used")
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

  if (user.email) {
    void sendTrialStartedEmail({
      to: user.email,
      userName: user.user_metadata?.full_name,
      planName: targetPlan.name,
      monthlyPricePaise: pricePaiseMap[planSlug] ?? 49900,
      trialEndsAt: formattedEndDate,
    }).catch((err) => console.error("[email] Trial started email error:", err));
  }

  void notifyOwnerTrialActivated({
    buyerName: user.user_metadata?.full_name,
    buyerEmail: user.email,
    planName: targetPlan.name,
    billingInterval: "monthly",
    futurePricePaise: pricePaiseMap[planSlug] ?? 49900,
    trialEndsAt: formattedEndDate,
  }).catch((err) => console.error("[email] Trial started owner notification error:", err));

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

  // Check if trial has already been used
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, trial_used")
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

  if (user.email) {
    void sendTrialStartedEmail({
      to: user.email,
      userName: user.user_metadata?.full_name,
      planName: targetPlan.name,
      monthlyPricePaise: pricePaiseMap[planSlug] ?? 49900,
      trialEndsAt: formattedEndDate,
    }).catch((err) => console.error("[email] Trial started email error:", err));
  }

  void notifyOwnerTrialActivated({
    buyerName: user.user_metadata?.full_name,
    buyerEmail: user.email,
    planName: targetPlan.name,
    billingInterval: "monthly",
    futurePricePaise: pricePaiseMap[planSlug] ?? 49900,
    subscriptionId: verification.subscriptionId,
    paymentId: verification.paymentId,
    trialEndsAt: formattedEndDate,
  }).catch((err) => console.error("[email] Trial notify error:", err));

  revalidateBillingPaths();
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

export async function activatePaidSubscription(
  planSlug: string,
  payment?: PaymentVerificationInput | { orderId?: string; paymentId?: string; signature?: string } | string,
  cycle: BillingCycle = "monthly",
  couponRedemption?: CouponRedemptionData
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();
  const { data: targetPlan } = await admin
    .from("plans")
    .select("id, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .single();

  if (!targetPlan) return { error: "Plan not found." };

  let verifiedPaymentId: string | null = null;
  let orderBasePaise = 0;
  let orderDiscountPaise = 0;
  let orderAmountPaise = 0;

  if (planSlug !== "free") {
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
      if (notes.plan_slug && notes.plan_slug !== planSlug) {
        return { error: "Order plan does not match target subscription plan." };
      }

      orderBasePaise = notes.base_amount
        ? Number(notes.base_amount)
        : (order.amount ? Math.round(Number(order.amount) / 1.18) : 0);
      orderDiscountPaise = notes.discount_paise ? Number(notes.discount_paise) : 0;
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

  const periodStart = new Date();
  const { data: updatedSub, error } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: user.id,
        plan_id: targetPlan.id,
        status: "active",
        provider: "razorpay",
        billing_cycle: cycle,
        provider_subscription_id: verifiedPaymentId,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd(cycle).toISOString(),
        cancel_at_period_end: false,
        registrations_used: 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Issue invoice for paid activation
  if (verifiedPaymentId && planSlug !== "free") {
    void createInvoiceForPayment({
      userId: user.id,
      subscriptionId: updatedSub?.id ?? null,
      paymentId: verifiedPaymentId,
      description: `${planSlug.toUpperCase()} Plan (${cycle})`,
      baseAmountRupees: orderBasePaise / 100,
      discountRupees: orderDiscountPaise / 100,
      customerEmail: user.email,
      customerName: user.user_metadata?.full_name,
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEnd(cycle),
    });

    const itemName = `${planSlug.toUpperCase()} Plan (${cycle})`;
    void Promise.allSettled([
      notifyOwnerPaidSubscription({
        buyerName: user.user_metadata?.full_name,
        buyerEmail: user.email,
        planName: `${planSlug.toUpperCase()} Plan`,
        billingCycle: cycle,
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
    ]).catch((err: unknown) => console.error("[email]", err));
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
