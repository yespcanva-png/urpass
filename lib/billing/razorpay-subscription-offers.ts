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

const DEFAULT_INTRO_OFFER_IDS: Partial<Record<IntroOfferPlanSlug, string>> = {
  starter: "offer_TnVgsI4LM5e5tB",
  pro: "offer_TnVjl4FlJDxvBr",
  business: "offer_TnVkl8l7VXDxHz",
};

export function isIntroOfferPlan(planSlug: string): planSlug is IntroOfferPlanSlug {
  return ["starter", "pro", "business"].includes(planSlug);
}

export function getMonthlyRazorpayPlanId(planSlug: IntroOfferPlanSlug): string | null {
  const key = resolveBillingPlanKey(planSlug, "monthly");
  return BILLING_PLANS[key]?.razorpayPlanId || null;
}

export function getIntroOfferId(planSlug: IntroOfferPlanSlug): string | null {
  const envKey = `RAZORPAY_${planSlug.toUpperCase()}_INTRO_OFFER_ID`;
  return (process.env[envKey] || DEFAULT_INTRO_OFFER_IDS[planSlug] || "").trim() || null;
}

export function getIntroOfferDisclosure(planSlug: IntroOfferPlanSlug) {
  const expected = INTRO_OFFER_EXPECTED[planSlug];
  return {
    introAmountPaise: expected.introAmountPaise,
    regularAmountPaise: expected.regularAmountPaise,
    discountPaise: expected.discountPaise,
    cycles: 2,
    taxRatePercent: 18,
    currency: "INR" as const,
  };
}
