"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  verifyRazorpaySignature,
  getRazorpayClient,
  type PaymentVerificationInput,
} from "@/lib/razorpay";
import { createInvoiceForPayment } from "@/lib/invoices";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { notifyOwnerPaymentSuccess, sendUserPaymentSuccessEmail } from "@/lib/email";

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
    .update({ cancel_at_period_end: true })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
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
      notifyOwnerPaymentSuccess({
        kind: "subscription",
        buyerName: user.user_metadata?.full_name,
        buyerEmail: user.email,
        itemName,
        amountPaise: orderAmountPaise,
        paymentId: verifiedPaymentId,
        orderId: typeof payment === "object" ? payment.orderId : undefined,
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
