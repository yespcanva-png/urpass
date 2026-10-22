export type SubscriptionAccessState =
  | "onboarding_required"
  | "autopay_trial_active"
  | "autopay_trial_completed"
  | "legacy_trial_active"
  | "legacy_free_active"
  | "free_forever_active"
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
  free_event_trial_active?: boolean | null;
  free_event_trial_consumed?: boolean | null;
  free_event_trial_id?: string | null;
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
  isTrial?: boolean;
  freeEventTrialConsumed?: boolean;
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
  let appIdentityMissing = !user.created_at;
  try {
    const { data: prof } = await supabase
      .from("profiles")
      .select("id, created_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (prof?.created_at) {
      createdAt = new Date(prof.created_at);
      appIdentityMissing = false;
    }
  } catch {
    // profile table missing or empty, fall back to user.created_at
  }

  const isNewUser = appIdentityMissing || createdAt.getTime() >= effectiveAt.getTime();

  let sub: SubscriptionRow | null = null;
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select(
        "status, provider, billing_cycle, current_period_end, cancel_at_period_end, trial_used, is_trial, trial_ends_at, autopay_status, has_lifetime_access, lifetime_plan_slug, free_event_trial_active, free_event_trial_consumed, free_event_trial_id, plan:plans(slug)"
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

  // 1 Free Event Trial with AutoPay
  const isAutopayTrial = Boolean(
    sub?.autopay_status === "active" &&
    (sub?.free_event_trial_active || sub?.is_trial || status === "trialing")
  );

  if (isAutopayTrial) {
    let hasConsumedTrialEvent = Boolean(sub?.free_event_trial_consumed);

    if (!hasConsumedTrialEvent) {
      try {
        const { data: trialEvent } = await supabase
          .from("user_trial_events")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (trialEvent) {
          hasConsumedTrialEvent = true;
        }
      } catch {
        // user_trial_events check fallback
      }
    }

    if (!hasConsumedTrialEvent) {
      return {
        state: "autopay_trial_active",
        hasOrganizerAccess: true,
        shouldRedirectToSubscriptionOnboarding: false,
        shouldRedirectToBilling: false,
        planSlug: "pro",
        expiresAt: sub?.trial_ends_at || null,
        isNewUser: false,
        introOfferEligible: false,
        isTrial: true,
        freeEventTrialConsumed: false,
        reason: "1 Free Event Trial with active AutoPay mandate is available.",
      };
    } else {
      // Free trial event has been consumed!
      // Check if user has upgraded to an active paid subscription
      const paidPeriodValid = planSlug !== "free" && isFuture(sub?.current_period_end, now) && !sub?.is_trial && !sub?.free_event_trial_active;
      if (paidPeriodValid && status === "active") {
        return {
          state: "subscription_active",
          hasOrganizerAccess: true,
          shouldRedirectToSubscriptionOnboarding: false,
          shouldRedirectToBilling: false,
          planSlug,
          expiresAt: sub?.current_period_end || null,
          isNewUser: false,
          introOfferEligible: false,
          isTrial: false,
          reason: "Paid subscription is active.",
        };
      }

      // Check if their single created trial event is still active / upcoming
      let isEventStillActive = false;
      try {
        const todayStr = now.toISOString().split("T")[0];
        let eventQuery = supabase
          .from("events")
          .select("id, event_date, status");

        if (sub?.free_event_trial_id) {
          eventQuery = eventQuery.eq("id", sub.free_event_trial_id);
        } else {
          eventQuery = eventQuery.eq("organizer_id", user.id);
        }

        const { data: eventRow } = await eventQuery.maybeSingle();

        // Also check if trial event was recorded as deleted in user_trial_events
        let wasDeleted = false;
        try {
          const { data: ute } = await supabase
            .from("user_trial_events")
            .select("event_deleted")
            .eq("user_id", user.id)
            .maybeSingle();
          if (ute?.event_deleted) {
            wasDeleted = true;
          }
        } catch {
          // Fallback
        }

        if (!wasDeleted && eventRow && eventRow.status !== "cancelled" && eventRow.status !== "completed") {
          if (!eventRow.event_date || eventRow.event_date >= todayStr) {
            isEventStillActive = true;
          }
        }
      } catch {
        // Fallback
      }

      if (isEventStillActive) {
        // Allow access to manage the single ongoing event, scan attendees, and view analytics
        return {
          state: "autopay_trial_active",
          hasOrganizerAccess: true,
          shouldRedirectToSubscriptionOnboarding: false,
          shouldRedirectToBilling: false,
          planSlug: "pro",
          expiresAt: sub?.trial_ends_at || null,
          isNewUser: false,
          introOfferEligible: false,
          isTrial: true,
          freeEventTrialConsumed: true,
          reason: "1 Free Event Trial is active for managing your single event.",
        };
      }

      // If event has concluded or was deleted, require payment to continue
      return {
        state: "autopay_trial_completed",
        hasOrganizerAccess: false,
        shouldRedirectToSubscriptionOnboarding: false,
        shouldRedirectToBilling: true,
        planSlug: "pro",
        expiresAt: sub?.trial_ends_at || null,
        isNewUser: false,
        introOfferEligible: false,
        isTrial: true,
        freeEventTrialConsumed: true,
        reason: "Your 1 free trial event is completed. Please activate a paid subscription to continue.",
      };
    }
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
      isTrial: Boolean(sub?.is_trial),
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

  const hasOnlyFreeOrNoSubscription = !sub || planSlug === "free" || sub.provider === "free";
  if (hasOnlyFreeOrNoSubscription) {
    return {
      state: "free_forever_active",
      hasOrganizerAccess: true,
      shouldRedirectToSubscriptionOnboarding: false,
      shouldRedirectToBilling: false,
      planSlug: "free",
      expiresAt: null,
      isNewUser: false,
      introOfferEligible: false,
      reason: "Free Forever plan is active (1 active event, 100 registrations/month).",
    };
  }

  return {
    state: "subscription_expired",
    hasOrganizerAccess: false,
    shouldRedirectToSubscriptionOnboarding: false,
    shouldRedirectToBilling: true,
    planSlug,
    expiresAt: sub?.current_period_end || trialEndsAt || null,
    isNewUser,
    introOfferEligible: false,
    reason: "No valid paid, legacy trial, or legacy Free entitlement is active.",
  };
}
