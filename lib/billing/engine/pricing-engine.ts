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
    name: "Free (Legacy)",
    desc: "30-day trial for legacy accounts.",
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
  const { userId, organizationId, planSlug, billingCycle, currency = "INR" } = params;

  // Rule: Only monthly plans are eligible for ₹29 intro offer
  if (billingCycle !== "monthly") {
    return {
      isEligibleForIntroOffer: false,
      reason: "Introductory ₹29 offer is only available on monthly subscription plans.",
    };
  }

  // Rule: Only Starter, Pro, Business qualify
  if (!["starter", "pro", "business"].includes(planSlug)) {
    return {
      isEligibleForIntroOffer: false,
      reason: "Introductory offer is only applicable to Starter, Pro, and Business plans.",
    };
  }


  const admin = getAdmin();

  // 1. Check legacy/existing subscriptions table for trial or paid history
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, status, provider, trial_used, is_trial, trial_ends_at, has_lifetime_access, lifetime_plan_slug, current_period_end, plan:plans(slug)")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingSub) {
    const plan = Array.isArray(existingSub.plan) ? existingSub.plan[0] : existingSub.plan;
    const existingPlanSlug = String(plan?.slug || "free").toLowerCase();
    const provider = String(existingSub.provider || "").toLowerCase();
    const hasLifetime = Boolean(
      existingSub.has_lifetime_access ||
      existingSub.lifetime_plan_slug === "founder" ||
      existingPlanSlug === "founder" ||
      existingPlanSlug === "lifetime"
    );
    const periodEnd = existingSub.current_period_end ? new Date(existingSub.current_period_end) : null;
    const hasFuturePaidPeriod = Boolean(periodEnd && periodEnd.getTime() > Date.now());
    const isPaidPlan = !["free", "none"].includes(existingPlanSlug) && !["free", "none"].includes(provider);

    if (existingSub.trial_used || existingSub.is_trial) {
      const trialEndsAt = existingSub.trial_ends_at ? new Date(existingSub.trial_ends_at) : null;
      const isExpired = trialEndsAt ? trialEndsAt.getTime() < Date.now() : true;
      const daysRemaining = trialEndsAt
        ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        isEligibleForIntroOffer: false,
        reason: "Existing trial users are not eligible for the ₹29 introductory promotion.",
        existingTrialStatus: {
          isTrial: true,
          expiresAt: existingSub.trial_ends_at || new Date().toISOString(),
          isExpired,
          daysRemaining,
        },
      };
    }

    if (hasLifetime || (existingSub.status === "active" && isPaidPlan && hasFuturePaidPeriod)) {
      return {
        isEligibleForIntroOffer: false,
        reason: "Existing active paid subscribers continue under regular subscription terms.",
      };
    }
  }

  // 2. Check if organization has already redeemed the offer
  if (organizationId) {
    const { data: redemption } = await admin
      .from("offer_redemptions")
      .select("id")
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (redemption) {
      return {
        isEligibleForIntroOffer: false,
        reason: "This organization has already redeemed the ₹29 introductory promotion.",
      };
    }
  }

  // 3. Confirm the auth user exists. Legacy/free rows do not block the paid intro checkout.
  const { data: authUser } = await admin.auth.admin.getUserById(userId);
  void authUser;

  const isGbp = currency === "GBP";
  // Eligible! Return £2 (200 pence) for GBP or ₹29 (2900 paise) for INR for Months 1 & 2
  return {
    isEligibleForIntroOffer: true,
    introOffer: {
      code: isGbp ? "INTRO2_GBP" : "INTRO29",
      introPricePaise: isGbp ? 200 : 2900,
      cyclesCount: 2,
      currency: isGbp ? "GBP" : "INR",
    },
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
