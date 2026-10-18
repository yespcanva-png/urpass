import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  EntitlementKey,
  QuotaResourceKey,
  PlanSlug,
} from "../types/subscription";

function getAdmin() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Plan limits definition map
export const V2_PLAN_LIMITS: Record<
  PlanSlug,
  {
    eventsPerMonth: number;
    registrationsPerMonth: number;
    organizerSeats: number;
    features: Set<EntitlementKey>;
  }
> = {
  starter: {
    eventsPerMonth: 10,
    registrationsPerMonth: 500,
    organizerSeats: 2,
    features: new Set<EntitlementKey>([
      "csv_import",
      "csv_export",
      "email_notifications_full",
      "standard_analytics",
      "paid_events",
    ]),
  },
  pro: {
    eventsPerMonth: 999999, // Unlimited
    registrationsPerMonth: 2500,
    organizerSeats: 5,
    features: new Set<EntitlementKey>([
      "csv_import",
      "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design",
      "remove_branding",
      "team_permissions_basic",
      "advanced_analytics",
      "api_access",
      "webhooks",
      "priority_support",
      "paid_events",
    ]),
  },
  business: {
    eventsPerMonth: 999999, // Unlimited
    registrationsPerMonth: 10000,
    organizerSeats: 15,
    features: new Set<EntitlementKey>([
      "csv_import",
      "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design",
      "remove_branding",
      "team_permissions_basic",
      "team_permissions_advanced",
      "advanced_analytics",
      "cross_event_analytics",
      "custom_domain",
      "api_access",
      "webhooks",
      "priority_support",
      "paid_events",
    ]),
  },
  campus: {
    eventsPerMonth: 999999,
    registrationsPerMonth: 999999,
    organizerSeats: 999999,
    features: new Set<EntitlementKey>([
      "csv_import",
      "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design",
      "remove_branding",
      "team_permissions_basic",
      "team_permissions_advanced",
      "advanced_analytics",
      "cross_event_analytics",
      "api_access",
      "webhooks",
      "priority_support",
      "paid_events",
    ]),
  },
  founder: {
    eventsPerMonth: 999999,
    registrationsPerMonth: 999999,
    organizerSeats: 50,
    features: new Set<EntitlementKey>([
      "csv_import",
      "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design",
      "remove_branding",
      "team_permissions_basic",
      "team_permissions_advanced",
      "advanced_analytics",
      "cross_event_analytics",
      "custom_domain",
      "api_access",
      "webhooks",
      "priority_support",
      "paid_events",
    ]),
  },
  free: {
    eventsPerMonth: 2,
    registrationsPerMonth: 100,
    organizerSeats: 1,
    features: new Set<EntitlementKey>([]),
  },
  managed_enterprise: {
    eventsPerMonth: 999999,
    registrationsPerMonth: 999999,
    organizerSeats: 50,
    features: new Set<EntitlementKey>([
      "csv_import",
      "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design",
      "remove_branding",
      "team_permissions_basic",
      "team_permissions_advanced",
      "advanced_analytics",
      "cross_event_analytics",
      "custom_domain",
      "api_access",
      "webhooks",
      "priority_support",
      "paid_events",
    ]),
  },
};

/**
 * Checks if an organization (or user) is authorized to use a specific feature key.
 */
export async function canUseFeature(
  organizationIdOrUserId: string,
  feature: EntitlementKey
): Promise<boolean> {
  const admin = getAdmin();

  // 1. Try querying organization_subscriptions
  const { data: orgSub } = await admin
    .from("organization_subscriptions")
    .select("plan_id, lifecycle_state, has_lifetime_access, plan:billing_plans(slug)")
    .eq("organization_id", organizationIdOrUserId)
    .maybeSingle();

  let activeSlug: PlanSlug = "free";

  if (orgSub) {
    // If lifetime access is active, grant founder entitlements
    if (orgSub.has_lifetime_access) {
      return V2_PLAN_LIMITS.founder.features.has(feature);
    }

    if (["active", "trialing", "grace"].includes(orgSub.lifecycle_state)) {
      const planVal = orgSub.plan as { slug?: string } | null;
      activeSlug = (planVal?.slug as PlanSlug) || "starter";
    }
  } else {
    // Fallback: check legacy subscriptions by user_id
    const { data: userSub } = await admin
      .from("subscriptions")
      .select("status, has_lifetime_access, is_trial, trial_ends_at, plan:plans(slug)")
      .eq("user_id", organizationIdOrUserId)
      .maybeSingle();

    if (userSub?.has_lifetime_access) {
      return V2_PLAN_LIMITS.founder.features.has(feature);
    }

    if (userSub && (userSub.status === "active" || userSub.status === "trialing")) {
      const p = userSub.plan as { slug?: string } | null;
      activeSlug = (p?.slug as PlanSlug) || "free";
    }
  }

  const limits = V2_PLAN_LIMITS[activeSlug] ?? V2_PLAN_LIMITS.free;
  return limits.features.has(feature);
}

/**
 * Checks remaining quota for a given resource (registrations, events, seats)
 */
export async function getRemainingQuota(
  organizationId: string,
  resource: QuotaResourceKey
): Promise<{ remaining: number; allocated: number; consumed: number; unlimited: boolean }> {
  const admin = getAdmin();

  // Call the atomic postgres function or query organization_usage
  const now = new Date();
  const { data: usage } = await admin
    .from("organization_usage")
    .select("allocated_limit, consumed_count")
    .eq("organization_id", organizationId)
    .eq("resource_key", resource)
    .lte("period_start", now.toISOString())
    .gte("period_end", now.toISOString())
    .maybeSingle();

  if (!usage) {
    return { remaining: 999999, allocated: 999999, consumed: 0, unlimited: true };
  }

  const allocated = Number(usage.allocated_limit);
  const consumed = Number(usage.consumed_count);

  if (allocated >= 999999) {
    return { remaining: 999999, allocated: 999999, consumed, unlimited: true };
  }

  return {
    remaining: Math.max(0, allocated - consumed),
    allocated,
    consumed,
    unlimited: false,
  };
}

/**
 * Atomically reserves/commits quota to prevent race conditions during ticket sales or bulk operations
 */
export async function reserveQuota(
  organizationId: string,
  resource: QuotaResourceKey,
  count = 1
): Promise<{ allowed: boolean; remaining: number }> {
  const admin = getAdmin();

  // Try calling the atomic SQL procedure
  const { data, error } = await admin.rpc("reserve_organization_quota", {
    p_org_id: organizationId,
    p_resource_key: resource,
    p_count: count,
  });

  if (!error && data) {
    return {
      allowed: Boolean(data.allowed),
      remaining: Number(data.remaining ?? 0),
    };
  }

  // Graceful fallback if RPC is not yet executed on client database
  return { allowed: true, remaining: 999999 };
}
