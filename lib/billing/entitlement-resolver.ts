export type SubscriptionAccessState =
  | "onboarding_required"
  | "legacy_trial_active"
  | "legacy_free_active"
  | "subscription_active"
  | "subscription_cancelled_but_valid"
  | "payment_pending"
  | "subscription_expired"
  | "payment_failed";

type SupabaseLike = {
  from: (table: string) => any;
};

type UserLike = {
  id: string;
  created_at?: string | null;
};

type SubscriptionRow = {
  status?: string | null;
  provider?: string | null;
  billing_cycle?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  trial_used?: boolean | null;
  is_trial?: boolean | null;
  trial_ends_at?: string | null;
  autopay_status?: string | null;
  has_lifetime_access?: boolean | null;
  lifetime_plan_slug?: string | null;
  plan?: { slug?: string | null } | Array<{ slug?: string | null }> | null;
};

export interface SubscriptionAccessResolution {
  state: SubscriptionAccessState;
  hasOrganizerAccess: boolean;
  shouldRedirectToSubscriptionOnboarding: boolean;
  shouldRedirectToBilling: boolean;
  planSlug: string;
  expiresAt: string | null;
  isNewUser: boolean;
  introOfferEligible: boolean;
  reason: string;
}

const DEFAULT_PAID_ONBOARDING_EFFECTIVE_AT = "2026-10-13T00:00:00.000Z";

export function getPaidOnboardingEffectiveAt() {
  const raw = process.env.PAID_ONBOARDING_EFFECTIVE_AT || DEFAULT_PAID_ONBOARDING_EFFECTIVE_AT;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date(DEFAULT_PAID_ONBOARDING_EFFECTIVE_AT) : parsed;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function planSlugFromSub(sub: SubscriptionRow | null | undefined) {
  const plan = Array.isArray(sub?.plan) ? sub?.plan[0] : sub?.plan;
  return (plan?.slug || "free").toLowerCase();
}

function isFuture(value: string | null | undefined, now: Date) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() >= now.getTime();
}

export async function resolveUserSubscriptionAccess(params: {
  supabase: SupabaseLike;
  user: UserLike;
  now?: Date;
}): Promise<SubscriptionAccessResolution> {
  const { supabase, user, now = new Date() } = params;
  const effectiveAt = getPaidOnboardingEffectiveAt();

  let createdAt: Date = user.created_at ? new Date(user.created_at) : now;
  if (!user.created_at) {
    try {
      const { data: prof } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (prof?.created_at) {
        createdAt = new Date(prof.created_at);
      }
    } catch {
      // fallback
    }
  }

  const isNewUser = createdAt.getTime() >= effectiveAt.getTime();

  let sub: SubscriptionRow | null = null;
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select(
        "status, provider, billing_cycle, current_period_end, cancel_at_period_end, trial_used, is_trial, trial_ends_at, autopay_status, has_lifetime_access, lifetime_plan_slug, plan:plans(slug)"
      )
      .eq("user_id", user.id)
      .maybeSingle();
    sub = (data as SubscriptionRow | null) ?? null;
  } catch {
    sub = null;
  }

  const planSlug = planSlugFromSub(sub);
  const status = (sub?.status || "").toLowerCase();
  const hasLifetime = Boolean(
    sub?.has_lifetime_access ||
    sub?.lifetime_plan_slug === "founder" ||
    planSlug === "founder" ||
    planSlug === "lifetime"
  );

  if (hasLifetime) {
    return {
      state: "subscription_active",
      hasOrganizerAccess: true,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: false,
      planSlug: "founder",
      expiresAt: null,
      isNewUser,
      introOfferEligible: false,
      reason: "Founder lifetime entitlement is active.",
    };
  }

  const trialEndsAt = sub?.trial_ends_at || null;
  if (!isNewUser && (sub?.is_trial || status === "trialing") && isFuture(trialEndsAt, now)) {
    return {
      state: "legacy_trial_active",
      hasOrganizerAccess: true,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: false,
      planSlug: planSlug === "free" ? (sub?.billing_cycle ? "starter" : "free") : planSlug,
      expiresAt: trialEndsAt,
      isNewUser: false,
      introOfferEligible: false,
      reason: "Legacy trial remains valid until its stored expiration.",
    };
  }

  const paidPeriodValid = planSlug !== "free" && isFuture(sub?.current_period_end, now);
  if (paidPeriodValid && (sub?.cancel_at_period_end || sub?.autopay_status === "cancelled")) {
    return {
      state: "subscription_cancelled_but_valid",
      hasOrganizerAccess: true,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: false,
      planSlug,
      expiresAt: sub?.current_period_end || null,
      isNewUser: false,
      introOfferEligible: false,
      reason: "Paid subscription was cancelled but the paid-through period is still valid.",
    };
  }

  if (paidPeriodValid && ["active", "trialing"].includes(status)) {
    return {
      state: "subscription_active",
      hasOrganizerAccess: true,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: false,
      planSlug,
      expiresAt: sub?.current_period_end || null,
      isNewUser: false,
      introOfferEligible: false,
      reason: "Paid subscription period is active.",
    };
  }

  if (["pending", "created"].includes(status) || sub?.autopay_status === "pending") {
    return {
      state: "payment_pending",
      hasOrganizerAccess: false,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: true,
      planSlug,
      expiresAt: sub?.current_period_end || null,
      isNewUser,
      introOfferEligible: false,
      reason: "Payment or mandate activation is pending.",
    };
  }

  if (["past_due", "failed"].includes(status) || sub?.autopay_status === "failing") {
    return {
      state: "payment_failed",
      hasOrganizerAccess: false,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: true,
      planSlug,
      expiresAt: sub?.current_period_end || null,
      isNewUser,
      introOfferEligible: false,
      reason: "Payment failed or subscription is past due.",
    };
  }

  const legacyFreeExpiresAt = addDays(createdAt, 30);
  const hasOnlyFreeOrNoSubscription = !sub || planSlug === "free" || sub.provider === "free";
  if (!isNewUser && hasOnlyFreeOrNoSubscription && legacyFreeExpiresAt.getTime() >= now.getTime()) {
    return {
      state: "legacy_free_active",
      hasOrganizerAccess: true,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: false,
      planSlug: "free",
      expiresAt: legacyFreeExpiresAt.toISOString(),
      isNewUser: false,
      introOfferEligible: false,
      reason: "Legacy Free access is valid until 30 days after the user's signup date.",
    };
  }

  if (isNewUser && hasOnlyFreeOrNoSubscription) {
    return {
      state: "onboarding_required",
      hasOrganizerAccess: false,
      shouldRedirectToSubscriptionOnboarding: true,
      shouldRedirectToBilling: false,
      planSlug: "none",
      expiresAt: null,
      isNewUser: true,
      introOfferEligible: true,
      reason: "New user must activate a paid subscription before accessing organizer features.",
    };
  }

  return {
    state: "subscription_expired",
    hasOrganizerAccess: false,
    shouldRedirectToSubscriptionOnboarding: false,
    shouldRedirectToBilling: true,
    planSlug,
    expiresAt: sub?.current_period_end || trialEndsAt || legacyFreeExpiresAt.toISOString(),
    isNewUser,
    introOfferEligible: false,
    reason: "No valid paid, legacy trial, or legacy Free entitlement is active.",
  };
}

