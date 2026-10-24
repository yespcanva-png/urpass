import { BILLING_PLANS, resolveBillingPlanKey } from "@/lib/billing-plans";
import type { PlanSlug } from "@/lib/billing/types/subscription";

export type IntroOfferPlanSlug = Extract<PlanSlug, "starter" | "pro" | "business">;

export const INTRO_OFFER_EXPECTED = {
  starter: { introAmountPaise: 2900, regularAmountPaise: 49900, discountPaise: 47000 },
  pro: { introAmountPaise: 2900, regularAmountPaise: 99900, discountPaise: 97000 },
  business: { introAmountPaise: 2900, regularAmountPaise: 249900, discountPaise: 247000 },
} as const satisfies Record<IntroOfferPlanSlug, {
  introAmountPaise: number;
  regularAmountPaise: number;
  discountPaise: number;
}>;

export const INTRO_OFFER_SCHEDULE = {
  starter: {
    todayAmountWithGst: 34.22,
    month2AmountWithGst: 34.22,
    month3OnwardAmountWithGst: 588.82,
    regularMonthlyBase: 499,
  },
  pro: {
    todayAmountWithGst: 34.22,
    month2AmountWithGst: 34.22,
    month3OnwardAmountWithGst: 1178.82,
    regularMonthlyBase: 999,
  },
  business: {
    todayAmountWithGst: 34.22,
    month2AmountWithGst: 34.22,
    month3OnwardAmountWithGst: 2948.82,
    regularMonthlyBase: 2499,
  },
} as const satisfies Record<IntroOfferPlanSlug, {
  todayAmountWithGst: number;
  month2AmountWithGst: number;
  month3OnwardAmountWithGst: number;
  regularMonthlyBase: number;
}>;

export function isIntroOfferPlan(planSlug: string): planSlug is IntroOfferPlanSlug {
  return ["starter", "pro", "business"].includes(planSlug);
}

export function getMonthlyRazorpayPlanId(planSlug: IntroOfferPlanSlug): string | null {
  const key = resolveBillingPlanKey(planSlug, "monthly");
  return BILLING_PLANS[key]?.razorpayPlanId || null;
}

export function getIntroOfferId(planSlug: IntroOfferPlanSlug): string | null {
  const envKey = `RAZORPAY_${planSlug.toUpperCase()}_INTRO_OFFER_ID`;
  if (process.env[envKey]) {
    return process.env[envKey] as string;
  }
  // ₹29 introductory promotion is retired by default
  return null;
}

export function getIntroOfferSchedule(planSlug: IntroOfferPlanSlug) {
  return INTRO_OFFER_SCHEDULE[planSlug];
}

export function getIntroOfferDisclosure(planSlug: IntroOfferPlanSlug) {
  const expected = INTRO_OFFER_EXPECTED[planSlug];
  const schedule = INTRO_OFFER_SCHEDULE[planSlug];
  return {
    introAmountPaise: expected.introAmountPaise,
    regularAmountPaise: expected.regularAmountPaise,
    discountPaise: expected.discountPaise,
    todayAmountWithGst: schedule.todayAmountWithGst,
    month2AmountWithGst: schedule.month2AmountWithGst,
    month3OnwardAmountWithGst: schedule.month3OnwardAmountWithGst,
    cycles: 2,
    taxRatePercent: 18,
    currency: "INR" as const,
  };
}
