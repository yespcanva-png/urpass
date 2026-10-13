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

  // Rule: UK GBP direct plans follow standard UK pricing unless specific regional campaign
  if (currency === "GBP") {
    return {
      isEligibleForIntroOffer: false,
      reason: "₹29 introductory offer is specific to INR billing.",
    };
  }

  const admin = getAdmin();

  // 1. Check legacy/existing subscriptions table for trial or paid history
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, status, trial_used, is_trial, trial_ends_at, has_lifetime_access, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingSub) {
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

    if (existingSub.status === "active" && !["free", "none"].includes(existingSub.status)) {
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

  // 3. Check legacy Free users: Calculate 30-day expiration from original user signup
  const { data: authUser } = await admin.auth.admin.getUserById(userId);
  if (authUser?.user?.created_at) {
    const createdAt = new Date(authUser.user.created_at);
    const freeExpiresAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const isFreeExpired = freeExpiresAt.getTime() < Date.now();
    const daysRemaining = Math.max(0, Math.ceil((freeExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    // If account was created more than 1 hour ago and has previous free usage
    const accountAgeDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (accountAgeDays > 1 && !existingSub?.status) {
      // Existing free user
      return {
        isEligibleForIntroOffer: false,
        reason: "Existing Free users continue for 30 days from signup, then migrate to regular pricing.",
        legacyFreeStatus: {
          isLegacyFree: true,
          expiresAt: freeExpiresAt.toISOString(),
          isExpired: isFreeExpired,
          daysRemaining,
        },
      };
    }
  }

  // Eligible! Return ₹29 for Months 1 & 2
  return {
    isEligibleForIntroOffer: true,
    introOffer: {
      code: "INTRO29",
      introPricePaise: 2900, // ₹29
      cyclesCount: 2,
      currency: "INR",
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
