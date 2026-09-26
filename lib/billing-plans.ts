export type BillingTier = "STARTER" | "PRO" | "BUSINESS";
export type BillingInterval = "MONTHLY" | "YEARLY";

export interface BillingPlanDefinition {
  readonly tier: BillingTier;
  readonly interval: BillingInterval;
  readonly price: number; // in INR rupees
  readonly pricePaise: number;
  readonly razorpayPlanId: string;
  readonly planSlug: "starter" | "pro" | "business";
  readonly displayName: string;
}

export const BILLING_PLANS: Record<string, BillingPlanDefinition> = {
  STARTER_MONTHLY: {
    tier: "STARTER",
    interval: "MONTHLY",
    price: 499,
    pricePaise: 49900,
    razorpayPlanId:
      process.env.RAZORPAY_STARTER_MONTHLY_PLAN_ID || "plan_TgkC27ktwiBn8b",
    planSlug: "starter",
    displayName: "Starter Monthly",
  },

  STARTER_YEARLY: {
    tier: "STARTER",
    interval: "YEARLY",
    price: 4999,
    pricePaise: 499900,
    razorpayPlanId:
      process.env.RAZORPAY_STARTER_YEARLY_PLAN_ID || "plan_TgkCnLPoiw44QA",
    planSlug: "starter",
    displayName: "Starter Yearly",
  },

  PRO_MONTHLY: {
    tier: "PRO",
    interval: "MONTHLY",
    price: 999,
    pricePaise: 99900,
    razorpayPlanId:
      process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || "plan_TgkEXl5vWzIhTS",
    planSlug: "pro",
    displayName: "Pro Monthly",
  },

  PRO_YEARLY: {
    tier: "PRO",
    interval: "YEARLY",
    price: 9999,
    pricePaise: 999900,
    razorpayPlanId:
      process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || "plan_TgkGA4nSLn91s2",
    planSlug: "pro",
    displayName: "Pro Yearly",
  },

  BUSINESS_MONTHLY: {
    tier: "BUSINESS",
    interval: "MONTHLY",
    price: 2499,
    pricePaise: 249900,
    razorpayPlanId:
      process.env.RAZORPAY_BUSINESS_MONTHLY_PLAN_ID || "plan_TgkEzt9SACX9bc",
    planSlug: "business",
    displayName: "Business Monthly",
  },

  BUSINESS_YEARLY: {
    tier: "BUSINESS",
    interval: "YEARLY",
    price: 24999,
    pricePaise: 2499900,
    razorpayPlanId:
      process.env.RAZORPAY_BUSINESS_YEARLY_PLAN_ID || "plan_TgkIV32JgsrRgg",
    planSlug: "business",
    displayName: "Business Yearly",
  },
} as const;

export type BillingPlanKey = keyof typeof BILLING_PLANS;

export function getBillingPlan(planKey: string): BillingPlanDefinition | null {
  const normalizedKey = planKey?.toUpperCase()?.replace("-", "_");
  if (normalizedKey in BILLING_PLANS) {
    return BILLING_PLANS[normalizedKey as BillingPlanKey];
  }

  // Also support slug + interval matching (e.g., planSlug="pro", interval="monthly")
  for (const plan of Object.values(BILLING_PLANS)) {
    if (plan.planSlug === planKey.toLowerCase()) {
      return plan;
    }
  }

  return null;
}

export function resolveBillingPlanKey(
  planSlug: string,
  cycle: "monthly" | "annual" | "yearly" = "monthly"
): BillingPlanKey {
  const isYearly = cycle === "annual" || cycle === "yearly";
  const slug = planSlug.toLowerCase();

  if (slug === "starter") {
    return isYearly ? "STARTER_YEARLY" : "STARTER_MONTHLY";
  }
  if (slug === "business") {
    return isYearly ? "BUSINESS_YEARLY" : "BUSINESS_MONTHLY";
  }
  return isYearly ? "PRO_YEARLY" : "PRO_MONTHLY";
}
