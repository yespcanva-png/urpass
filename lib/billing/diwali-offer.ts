/**
 * UrPass Diwali Flash Sale & Campaign Configuration
 *
 * Campaign: 70% OFF all UrPass paid plans for 48 hours
 * Window: November 7, 2026, 12:00 PM IST to November 9, 2026, 12:00 PM IST (48 hours)
 */

export const DIWALI_COUPON_CODE = "DIWALI70";
export const DIWALI_DISCOUNT_PERCENT = 70;

// ISO 8601 timestamps in IST (+05:30)
// Nov 7, 2026 12:00 PM IST -> 2026-11-07T06:30:00.000Z
// Nov 9, 2026 12:00 PM IST -> 2026-11-09T06:30:00.000Z
export const DIWALI_CAMPAIGN_START = "2026-11-07T12:00:00+05:30";
export const DIWALI_CAMPAIGN_END = "2026-11-09T12:00:00+05:30";

// Base plan prices in INR for 70% calculation
export const DIWALI_PLAN_PRICING = {
  starter: {
    original: 499,
    discounted: 149.7, // 70% off (rounded to ₹150 for clean display)
    displayDiscounted: 149,
    savings: 350,
  },
  pro: {
    original: 999,
    discounted: 299.7, // 70% off
    displayDiscounted: 299,
    savings: 700,
  },
  business: {
    original: 2499,
    discounted: 749.7, // 70% off
    displayDiscounted: 749,
    savings: 1750,
  },
} as const;

/**
 * Checks if the Diwali flash sale campaign is currently active based on server time.
 * Allows override via process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED ("true" | "false").
 */
export function isDiwaliCampaignActive(now: Date = new Date()): boolean {
  if (process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED === "false") {
    return false;
  }
  if (process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED === "true") {
    return true;
  }

  const start = new Date(DIWALI_CAMPAIGN_START);
  const end = new Date(DIWALI_CAMPAIGN_END);

  return now.getTime() >= start.getTime() && now.getTime() <= end.getTime();
}

/**
 * Calculates remaining milliseconds until the fixed server-side expiry.
 * Returns 0 if expired.
 */
export function getDiwaliRemainingMs(now: Date = new Date()): number {
  const end = new Date(DIWALI_CAMPAIGN_END);
  return Math.max(0, end.getTime() - now.getTime());
}

/**
 * Validates whether a plan slug is eligible for the 70% Diwali discount.
 */
export function isDiwaliEligiblePlan(planSlug?: string | null): boolean {
  if (!planSlug) return false;
  const normalized = planSlug.toLowerCase().trim();
  return ["starter", "pro", "business"].includes(normalized);
}

/**
 * Computes verified 70% discount amounts for checkout backend validation.
 */
export function computeDiwaliDiscountAmounts(
  baseAmountRupees: number,
  planSlug: string,
  billingCycle: "monthly" | "annual" | "lifetime" = "monthly"
) {
  const discountAmount = Math.round((baseAmountRupees * DIWALI_DISCOUNT_PERCENT) / 100 * 100) / 100;
  const discountedAmount = Math.round(Math.max(0, baseAmountRupees - discountAmount) * 100) / 100;
  const gst = Math.round(discountedAmount * 18) / 100;
  const total = Math.round((discountedAmount + gst) * 100) / 100;

  const renewalBase = baseAmountRupees;
  const renewalGst = Math.round(renewalBase * 18) / 100;
  const renewalTotal = Math.round((renewalBase + renewalGst) * 100) / 100;

  return {
    valid: true,
    code: DIWALI_COUPON_CODE,
    discountType: "percentage" as const,
    discountValue: DIWALI_DISCOUNT_PERCENT,
    durationMonths: 1, // 70% off the first payment / billing cycle
    label: "70% off first billing cycle (Diwali Flash Sale)",
    baseAmountRupees,
    discountAmountRupees: discountAmount,
    discountedAmountRupees: discountedAmount,
    gstRupees: gst,
    totalRupees: total,
    renewalTotalRupees: renewalTotal,
  };
}

