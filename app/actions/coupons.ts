"use server";

import { createClient } from "@/lib/supabase/server";

// Plan prices in rupees — must stay in sync with billing/page.tsx PLANS constant
const PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  starter:  { monthly: 499,  annual: 4990 },
  pro:      { monthly: 999,  annual: 9990 },
  business: { monthly: 2499, annual: 24990 },
};

export interface ValidatedCoupon {
  couponId: string;
  code: string;
  discountType: "percentage" | "fixed" | "free_months";
  discountValue: number;
  durationMonths: number | null;
  label: string;
  // Amounts in rupees (for display in checkout modal)
  baseAmountRupees: number;
  discountAmountRupees: number;
  discountedAmountRupees: number;
  gstRupees: number;
  totalRupees: number;
  // Renewal amounts (full price, with GST)
  renewalTotalRupees: number;
}

export type CouponResult =
  | { error: string }
  | { valid: true; coupon: ValidatedCoupon };

export async function validateCoupon(
  code: string,
  planSlug: string,
  billingCycle: "monthly" | "annual"
): Promise<CouponResult> {
  const trimmedCode = code.trim().toUpperCase();
  if (!trimmedCode) return { error: "Enter a coupon code." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const prices = PLAN_PRICES[planSlug];
  if (!prices) return { error: "Invalid plan." };

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", trimmedCode)
    .eq("is_active", true)
    .single();

  if (!coupon) return { error: "Coupon not found or expired." };

  // Temporal checks
  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    return { error: "This coupon has expired." };
  }
  if (coupon.start_date && new Date(coupon.start_date) > new Date()) {
    return { error: "This coupon is not yet active." };
  }

  // Product check
  if (coupon.applicable_products && !coupon.applicable_products.includes("subscription")) {
    return { error: "This coupon is only valid for event passes." };
  }

  // Plan check
  if (coupon.applicable_plans && !coupon.applicable_plans.includes(planSlug)) {
    const planList = coupon.applicable_plans.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
    return { error: `This coupon only applies to: ${planList}.` };
  }

  // Billing cycle check
  if (coupon.billing_cycle && coupon.billing_cycle !== billingCycle) {
    return { error: `This coupon is only valid for ${coupon.billing_cycle} billing.` };
  }

  // Total redemption limit
  if (coupon.total_redemption_limit !== null) {
    const { count } = await supabase
      .from("coupon_redemptions")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", coupon.id);
    if ((count ?? 0) >= coupon.total_redemption_limit) {
      return { error: "This coupon has reached its usage limit." };
    }
  }

  // Per-customer limit
  const { count: userCount } = await supabase
    .from("coupon_redemptions")
    .select("*", { count: "exact", head: true })
    .eq("coupon_id", coupon.id)
    .eq("user_id", user.id);
  if ((userCount ?? 0) >= coupon.per_customer_limit) {
    return { error: "You've already used this coupon." };
  }

  // New customers only
  if (coupon.new_customers_only) {
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("plan:plans(slug)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();
    const existingSlug = (existingSub?.plan as { slug?: string } | null)?.slug;
    if (existingSlug && existingSlug !== "free") {
      return { error: "This coupon is only available to new customers." };
    }
  }

  // Calculate discount
  const baseAmount = billingCycle === "annual" ? prices.annual : prices.monthly;
  const fullMonthlyPrice = prices.monthly;

  let discountAmount = 0;
  let label = "";

  if (coupon.discount_type === "percentage") {
    discountAmount = Math.round((baseAmount * coupon.discount_value) / 100 * 100) / 100;
    if (coupon.max_discount_amount) {
      discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
    }
    const durLabel = coupon.duration_months
      ? ` for ${coupon.duration_months} month${coupon.duration_months === 1 ? "" : "s"}`
      : "";
    label = `${coupon.discount_value}% off${durLabel}`;
  } else if (coupon.discount_type === "fixed") {
    discountAmount = Math.min(coupon.discount_value, baseAmount);
    label = `₹${coupon.discount_value.toLocaleString("en-IN")} off`;
  } else {
    // free_months: discount_value = number of months free
    discountAmount = Math.min(fullMonthlyPrice * coupon.discount_value, baseAmount);
    label = `${coupon.discount_value} month${coupon.discount_value === 1 ? "" : "s"} free`;
  }

  const discountedAmount = Math.max(0, baseAmount - discountAmount);
  const gst = Math.round(discountedAmount * 18) / 100;
  const total = Math.round((discountedAmount + gst) * 100) / 100;

  const renewalBase = baseAmount;
  const renewalGst = Math.round(renewalBase * 18) / 100;
  const renewalTotal = Math.round((renewalBase + renewalGst) * 100) / 100;

  return {
    valid: true,
    coupon: {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      durationMonths: coupon.duration_months ?? null,
      label,
      baseAmountRupees: baseAmount,
      discountAmountRupees: discountAmount,
      discountedAmountRupees: discountedAmount,
      gstRupees: gst,
      totalRupees: total,
      renewalTotalRupees: renewalTotal,
    },
  };
}
