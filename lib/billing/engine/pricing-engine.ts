import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  BillingPlan,
  BillingPlanPrice,
  BillingOffer,
  CurrencyCode,
  BillingCycle,
  PlanSlug,
  EligibilityResult,
} from "../types/subscription";

function getAdmin() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Fallback catalog in-memory to ensure zero-downtime if DB is warming up
export const STATIC_V2_PLANS: Record<PlanSlug, { name: string; desc: string; inrMonthly: number; inrAnnual: number; gbpMonthly: number; gbpAnnual: number }> = {
  starter: {
    name: "Starter",
    desc: "For individual organizers and small event teams.",
    inrMonthly: 49900,
    inrAnnual: 499000,
    gbpMonthly: 1500,
    gbpAnnual: 12000,
  },
  pro: {
    name: "Pro",
    desc: "For growing event teams, colleges and professional organizers.",
    inrMonthly: 99900,
    inrAnnual: 999000,
    gbpMonthly: 3500,
    gbpAnnual: 30000,
  },
  business: {
    name: "Business",
    desc: "For organizations managing events at scale.",
    inrMonthly: 249900,
    inrAnnual: 2499000,
    gbpMonthly: 7900,
    gbpAnnual: 69900,
  },
  campus: {
    name: "Campus",
    desc: "Enterprise multi-department platform for institutions.",
    inrMonthly: 999900,
    inrAnnual: 999900,
    gbpMonthly: 9900,
    gbpAnnual: 9900,
  },
  founder: {
    name: "Founder Lifetime",
    desc: "Permanent access for founding partners.",
    inrMonthly: 1999900,
    inrAnnual: 1999900,
    gbpMonthly: 24900,
    gbpAnnual: 24900,
  },
  free: {
    name: "Free Forever",
    desc: "Genuine free plan for 1 active event up to 100 registrations/month with QR passes and mobile scanning.",
    inrMonthly: 0,
    inrAnnual: 0,
    gbpMonthly: 0,
    gbpAnnual: 0,
  },
  managed_enterprise: {
    name: "Managed Service",
    desc: "Single Event License with Dedicated Managed Support, Custom Branding & Enterprise Features.",
    inrMonthly: 600000,
    inrAnnual: 600000,
    gbpMonthly: 6000,
    gbpAnnual: 6000,
  },
};

/**
 * Check if a user or organization qualifies for the ₹29 Introductory Offer:
 * - Must be a NEW user (no previous paid subscriptions, no active/historical trials, no redemptions).
 * - Must be selecting a MONTHLY cycle on Starter, Pro, or Business.
 * - Annual, Lifetime, Campus, existing trials, and existing paid users are EXCLUDED.
 */
export async function evaluateOfferEligibility(params: {
  userId: string;
  organizationId?: string | null;
  planSlug: PlanSlug;
  billingCycle: BillingCycle;
  currency?: CurrencyCode;
}): Promise<EligibilityResult> {
  void params;
  // ₹29 introductory promotion is officially retired as part of the transparent SaaS pricing model.
  return {
    isEligibleForIntroOffer: false,
    introOffer: null,
    reason: "The ₹29 introductory promotion has been retired. Standard transparent subscriptions are active.",
  };
}

/**
 * Resolves the precise price to charge for an order/checkout intent
 */
export async function resolveCheckoutPrice(params: {
  userId: string;
  organizationId?: string | null;
  planSlug: PlanSlug;
  billingCycle: BillingCycle;
  currency?: CurrencyCode;
}): Promise<{
  planSlug: PlanSlug;
  billingCycle: BillingCycle;
  currency: CurrencyCode;
  amountPaise: number;
  isIntroCycle: boolean;
  cyclesRemaining: number;
  regularPricePaise: number;
}> {
  const { userId, organizationId, planSlug, billingCycle, currency = "INR" } = params;
  const staticData = STATIC_V2_PLANS[planSlug] ?? STATIC_V2_PLANS.starter;

  const isUk = currency === "GBP";
  const regularPricePaise = isUk
    ? (billingCycle === "annual" ? staticData.gbpAnnual : staticData.gbpMonthly)
    : (billingCycle === "annual" ? staticData.inrAnnual : staticData.inrMonthly);

  // Evaluate ₹29 eligibility
  const eligibility = await evaluateOfferEligibility({
    userId,
    organizationId,
    planSlug,
    billingCycle,
    currency,
  });

  if (eligibility.isEligibleForIntroOffer && eligibility.introOffer) {
    return {
      planSlug,
      billingCycle,
      currency,
      amountPaise: eligibility.introOffer.introPricePaise, // 2900 paise = ₹29
      isIntroCycle: true,
      cyclesRemaining: 2,
      regularPricePaise,
    };
  }

  return {
    planSlug,
    billingCycle,
    currency,
    amountPaise: regularPricePaise,
    isIntroCycle: false,
    cyclesRemaining: 0,
    regularPricePaise,
  };
}
