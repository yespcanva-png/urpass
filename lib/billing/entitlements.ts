import { adminClient } from "@/lib/supabase/admin";
import { SELF_SERVICE_PLANS, SelfServicePlan } from "./catalog";

export interface AccountEntitlementContext {
  planSlug: "free" | "starter" | "pro" | "business";
  isSubscriptionActive: boolean;
  status: string;
  hasManagedEventOverride?: boolean;
  managedEventMaxAttendees?: number;
}

/**
 * Resolves current authoritative subscription and plan for a user or organization.
 */
export async function getAccountEntitlementContext(
  userId: string,
  eventId?: string
): Promise<AccountEntitlementContext> {
  const admin = adminClient();

  // 1. Fetch user subscription
  const { data: sub } = await admin
    .from("subscriptions")
    .select("status, is_trial, current_period_end, plans(slug)")
    .eq("user_id", userId)
    .maybeSingle();

  let planSlug: "free" | "starter" | "pro" | "business" = "free";
  let isSubscriptionActive = false;
  let status = sub?.status || "free";

  if (sub) {
    const rawSlug = (sub.plans as any)?.slug?.toLowerCase();
    if (["starter", "pro", "business"].includes(rawSlug)) {
      planSlug = rawSlug as "starter" | "pro" | "business";
    }

    const isPeriodValid = sub.current_period_end
      ? new Date(sub.current_period_end) > new Date()
      : false;

    isSubscriptionActive =
      (sub.status === "active" || sub.status === "trialing" || sub.status === "grace") &&
      isPeriodValid;
  }

  // Fallback to free if subscription is expired or cancelled past end
  if (!isSubscriptionActive && planSlug !== "free") {
    planSlug = "free";
  }

  // 2. Check if event has an active Managed Service Order override
  let hasManagedEventOverride = false;
  let managedEventMaxAttendees: number | undefined;

  if (eventId) {
    const { data: managedOrder } = await admin
      .from("managed_service_orders")
      .select("status, estimated_attendees, extra_attendees_purchased")
      .eq("event_id", eventId)
      .not("status", "in", '("cancelled","refunded")')
      .maybeSingle();

    if (managedOrder) {
      hasManagedEventOverride = true;
      managedEventMaxAttendees =
        (managedOrder.estimated_attendees || 0) +
        (managedOrder.extra_attendees_purchased || 0);
    }
  }

  return {
    planSlug,
    isSubscriptionActive,
    status,
    hasManagedEventOverride,
    managedEventMaxAttendees,
  };
}

/**
 * 1. canCreateEvent — Checks if organizer has reached their active events limit.
 */
export async function canCreateEvent(userId: string): Promise<{ allowed: boolean; reason?: string; limit: number }> {
  const ctx = await getAccountEntitlementContext(userId);
  const plan = SELF_SERVICE_PLANS.find((p) => p.slug === ctx.planSlug) || SELF_SERVICE_PLANS[0];
  const maxEvents = plan.limits.activeEvents;

  if (maxEvents === "unlimited") {
    return { allowed: true, limit: 999999 };
  }

  const admin = adminClient();
  const { count, error } = await admin
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("organizer_id", userId)
    .not("status", "in", '("archived","deleted","cancelled")');

  const currentCount = count || 0;

  if (currentCount >= maxEvents) {
    return {
      allowed: false,
      limit: maxEvents,
      reason: `You have reached the maximum of ${maxEvents} active event(s) for the ${plan.name} plan. Upgrade to launch more events simultaneously.`,
    };
  }

  return { allowed: true, limit: maxEvents };
}

/**
 * 2. canCreatePaidEvent — Paid tickets require Starter or higher.
 */
export async function canCreatePaidEvent(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const ctx = await getAccountEntitlementContext(userId);
  if (ctx.planSlug === "free") {
    return {
      allowed: false,
      reason: "Paid ticket sales are only available on Starter, Pro, and Business plans with 0% platform commission.",
    };
  }
  return { allowed: true };
}

/**
 * 3. canAddAttendees — Checks attendee limits per event, respecting any Managed Service order capacity.
 */
export async function canAddAttendees(
  userId: string,
  eventId: string,
  additionalCount: number = 1
): Promise<{ allowed: boolean; reason?: string; currentAttendees: number; maxAllowed: number }> {
  const ctx = await getAccountEntitlementContext(userId, eventId);
  const plan = SELF_SERVICE_PLANS.find((p) => p.slug === ctx.planSlug) || SELF_SERVICE_PLANS[0];

  let maxAllowed = plan.limits.attendeesPerEvent === "unlimited" ? 999999 : plan.limits.attendeesPerEvent;

  // Managed Service Order capacity overrides base subscription limit for this event
  if (ctx.hasManagedEventOverride && ctx.managedEventMaxAttendees) {
    maxAllowed = Math.max(maxAllowed, ctx.managedEventMaxAttendees);
  }

  const admin = adminClient();
  const { count } = await admin
    .from("attendees")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .not("status", "eq", "cancelled");

  const currentAttendees = count || 0;

  if (currentAttendees + additionalCount > maxAllowed) {
    return {
      allowed: false,
      currentAttendees,
      maxAllowed,
      reason: `Adding ${additionalCount} attendee(s) would exceed the maximum capacity limit of ${maxAllowed} attendees for this event. Upgrade your plan or purchase an attendee add-on.`,
    };
  }

  return { allowed: true, currentAttendees, maxAllowed };
}

/**
 * 4. canImportGuests — Bulk CSV import requires Starter or above.
 */
export async function canImportGuests(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const ctx = await getAccountEntitlementContext(userId);
  if (ctx.planSlug === "free") {
    return {
      allowed: false,
      reason: "Bulk CSV guest imports require a Starter or Pro subscription.",
    };
  }
  return { allowed: true };
}

/**
 * 5. canUseGroupQR — Group QR & partial redemption requires Pro or Business.
 */
export async function canUseGroupQR(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const ctx = await getAccountEntitlementContext(userId);
  if (ctx.planSlug === "free" || ctx.planSlug === "starter") {
    return {
      allowed: false,
      reason: "Group QR passes and partial gate admission are available on Pro and Business plans.",
    };
  }
  return { allowed: true };
}

/**
 * 6. canConfigureMultipleGates — Multi-gate check-in requires Pro or Business.
 */
export async function canConfigureMultipleGates(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const ctx = await getAccountEntitlementContext(userId);
  if (ctx.planSlug === "free" || ctx.planSlug === "starter") {
    return {
      allowed: false,
      reason: "Multi-gate entry routing and gate captain controls require a Pro or Business plan.",
    };
  }
  return { allowed: true };
}

/**
 * 7. canAddTeamMember — Verifies team seats limit.
 */
export async function canAddTeamMember(userId: string, currentTeamCount: number): Promise<{ allowed: boolean; reason?: string; limit: number }> {
  const ctx = await getAccountEntitlementContext(userId);
  const plan = SELF_SERVICE_PLANS.find((p) => p.slug === ctx.planSlug) || SELF_SERVICE_PLANS[0];
  const limit = plan.limits.teamSeats;

  if (currentTeamCount >= limit) {
    return {
      allowed: false,
      limit,
      reason: `Your ${plan.name} plan includes up to ${limit} team seat(s). Upgrade to Pro or Business to invite more team members.`,
    };
  }

  return { allowed: true, limit };
}

/**
 * 8. canUseCustomBranding — White-label branding requires Pro or Business.
 */
export async function canUseCustomBranding(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const ctx = await getAccountEntitlementContext(userId);
  if (ctx.planSlug === "free" || ctx.planSlug === "starter") {
    return {
      allowed: false,
      reason: "Custom pass designs, brand color customization, and removing UrPass badges are available on Pro and Business plans.",
    };
  }
  return { allowed: true };
}
