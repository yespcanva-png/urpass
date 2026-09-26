import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

export type PlanSlug = "free" | "starter" | "pro" | "business" | "campus" | "enterprise";

export type EntitlementKey =
  | "csv_import"
  | "csv_export"
  | "email_notifications_full"
  | "custom_fields_unlimited"
  | "custom_pass_design"
  | "remove_branding"
  | "team_permissions_basic"
  | "team_permissions_advanced"
  | "custom_domain"
  | "api_access"
  | "webhooks"
  | "priority_support"
  | "advanced_analytics"
  | "standard_analytics"
  | "cross_event_analytics"
  | "paid_events";

export const ENTITLEMENTS = {
  FREE: {
    eventsPerMonth: 2,
    registrationsPerMonth: 100,
    organizerSeats: 1,
    customFields: 3,
  },
  STARTER: {
    eventsPerMonth: 10,
    registrationsPerMonth: 500,
    organizerSeats: 2,
    customFields: 10,
    csvImport: true,
    csvExport: true,
  },
  PRO: {
    eventsPerMonth: Infinity,
    registrationsPerMonth: 2500,
    organizerSeats: 5,
    customFields: Infinity,
    customPassDesign: true,
    removeBranding: true,
    advancedAnalytics: true,
    prioritySupport: true,
  },
  BUSINESS: {
    eventsPerMonth: Infinity,
    registrationsPerMonth: 10000,
    organizerSeats: 15,
    customFields: Infinity,
    customPassDesign: true,
    removeBranding: true,
    advancedAnalytics: true,
    customDomain: true,
    apiAccess: true,
    webhooks: true,
    advancedPermissions: true,
    crossEventAnalytics: true,
  },
} as const;

export type EntitlementFeature =
  | "csvImport"
  | "csvExport"
  | "customPassDesign"
  | "removeBranding"
  | "advancedAnalytics"
  | "prioritySupport"
  | "customDomain"
  | "apiAccess"
  | "webhooks"
  | "advancedPermissions"
  | "crossEventAnalytics";

export function canUseFeature(
  tierOrPlan: string | PlanLimits | { slug?: string; tier?: string } | null | undefined,
  feature: EntitlementFeature
): boolean {
  if (!tierOrPlan) return false;
  let tierKey = "FREE";

  if (typeof tierOrPlan === "string") {
    tierKey = tierOrPlan.toUpperCase();
  } else if ("slug" in tierOrPlan && tierOrPlan.slug) {
    tierKey = tierOrPlan.slug.toUpperCase();
  } else if ("tier" in tierOrPlan && tierOrPlan.tier) {
    tierKey = String(tierOrPlan.tier).toUpperCase();
  }

  const tierEntitlements = (ENTITLEMENTS as Record<string, Record<string, unknown>>)[tierKey];
  if (!tierEntitlements) return false;

  return Boolean(tierEntitlements[feature]);
}

export type LimitKey =
  | "events_per_month"
  | "registrations_per_month"
  | "organizer_seats"
  | "custom_fields";

interface PlanConfig {
  eventsPerMonth: number;
  registrationsPerMonth: number;
  organizerSeats: number;
  customFields: number;
  entitlements: ReadonlySet<EntitlementKey>;
}

const UNLIMITED = 999_999;

function ent(...keys: EntitlementKey[]): ReadonlySet<EntitlementKey> {
  return new Set(keys);
}

const PLAN_CONFIGS: Record<PlanSlug, PlanConfig> = {
  free: {
    eventsPerMonth: 2,
    registrationsPerMonth: 100,
    organizerSeats: 1,
    customFields: 3,
    entitlements: ent(),
  },
  starter: {
    eventsPerMonth: 10,
    registrationsPerMonth: 500,
    organizerSeats: 2,
    customFields: 10,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "standard_analytics",
      "paid_events",
    ),
  },
  pro: {
    eventsPerMonth: UNLIMITED,
    registrationsPerMonth: 2_500,
    organizerSeats: 5,
    customFields: UNLIMITED,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design", "remove_branding",
      "team_permissions_basic",
      "advanced_analytics",
      "api_access", "webhooks",
      "priority_support", "paid_events",
    ),
  },
  business: {
    eventsPerMonth: UNLIMITED,
    registrationsPerMonth: 10_000,
    organizerSeats: 15,
    customFields: UNLIMITED,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design", "remove_branding",
      "team_permissions_basic", "team_permissions_advanced",
      "advanced_analytics", "cross_event_analytics",
      "custom_domain", "api_access", "webhooks",
      "priority_support", "paid_events",
    ),
  },
  campus: {
    eventsPerMonth: UNLIMITED,
    registrationsPerMonth: UNLIMITED,
    organizerSeats: UNLIMITED,
    customFields: UNLIMITED,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design", "remove_branding",
      "team_permissions_basic", "team_permissions_advanced",
      "advanced_analytics", "cross_event_analytics",
      "api_access", "webhooks",
      "priority_support", "paid_events",
    ),
  },
  enterprise: {
    eventsPerMonth: UNLIMITED,
    registrationsPerMonth: UNLIMITED,
    organizerSeats: UNLIMITED,
    customFields: UNLIMITED,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design", "remove_branding",
      "team_permissions_basic", "team_permissions_advanced",
      "advanced_analytics", "cross_event_analytics",
      "custom_domain", "api_access", "webhooks",
      "priority_support", "paid_events",
    ),
  },
};

export interface PlanLimits {
  slug: PlanSlug;
  canUse: (feature: EntitlementKey) => boolean;
  getLimit: (key: LimitKey) => number;
  // Legacy compat — prefer canUse/getLimit for new code
  maxEvents: number;
  maxAttendees: number;
  unlimited: boolean;
  canCSV: boolean;
  canExport: boolean;
  canRemoveBranding: boolean;
  canUseAPI: boolean;
  canCreatePaidEvents: boolean;
  canCreateOrganizations: boolean;
}

function fromSlug(slug: PlanSlug): PlanLimits {
  const c = PLAN_CONFIGS[slug];
  const unlimitedEvents = c.eventsPerMonth >= UNLIMITED;
  return {
    slug,
    canUse: (feature) => c.entitlements.has(feature),
    getLimit: (key) => {
      if (key === "events_per_month")       return c.eventsPerMonth;
      if (key === "registrations_per_month") return c.registrationsPerMonth;
      if (key === "custom_fields")           return c.customFields;
      return c.organizerSeats;
    },
    // Legacy compat
    maxEvents: c.eventsPerMonth,
    maxAttendees: c.registrationsPerMonth,
    unlimited: unlimitedEvents,
    canCSV: c.entitlements.has("csv_import"),
    canExport: c.entitlements.has("csv_export"),
    canRemoveBranding: c.entitlements.has("remove_branding"),
    canUseAPI: c.entitlements.has("api_access"),
    canCreatePaidEvents: c.entitlements.has("paid_events"),
    canCreateOrganizations: slug !== "free",
  };
}

const FREE_PLAN = fromSlug("free");

function getAdminClientSafe() {
  if (typeof process === "undefined" || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  try {
    const admin = createAdminClient(
      getSupabaseUrl(),
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    if (admin && typeof admin.from === "function") {
      return admin;
    }
    return null;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserPlan(supabase: any, userId: string): Promise<PlanLimits> {
  if (!userId) return FREE_PLAN;

  let sub: Record<string, unknown> | null = null;

  // 1. Try querying with the provided supabase client
  if (supabase && typeof supabase.from === "function") {
    try {
      const query = supabase
        .from("subscriptions")
        .select("plan_id, plan:plans(slug), status, is_trial, trial_plan, trial_ends_at")
        .eq("user_id", userId);

      const filteredQuery = typeof query.in === "function"
        ? query.in("status", ["active", "trialing"])
        : query;

      const res = typeof filteredQuery.maybeSingle === "function"
        ? await filteredQuery.maybeSingle()
        : await filteredQuery.single();

      sub = (res?.data as Record<string, unknown>) ?? null;
    } catch {
      sub = null;
    }
  }

  function extractSlug(s: Record<string, unknown> | null | undefined): PlanSlug | undefined {
    if (!s) return undefined;
    const planVal = s.plan as { slug?: string } | Array<{ slug?: string }> | undefined;
    const p = Array.isArray(planVal) ? planVal[0] : planVal;
    if (p?.slug && (p.slug in PLAN_CONFIGS)) return p.slug as PlanSlug;
    const trialPlan = s.trial_plan as string | undefined;
    if (trialPlan && (trialPlan in PLAN_CONFIGS)) return trialPlan as PlanSlug;
    return undefined;
  }

  let slug = extractSlug(sub);

  // 2. If sub not found or slug not resolved, fallback to admin client
  // (Prevents silent RLS failures, token refresh sync delays, or cross-user lookup blocks)
  const admin = getAdminClientSafe();
  if ((!sub || !slug || slug === "free") && admin) {
    try {
      const { data: adminSub } = await admin
        .from("subscriptions")
        .select("plan_id, plan:plans(slug), status, is_trial, trial_plan, trial_ends_at")
        .eq("user_id", userId)
        .in("status", ["active", "trialing"])
        .maybeSingle();

      if (adminSub) {
        const adminSlug = extractSlug(adminSub);
        if (adminSlug) {
          sub = adminSub;
          slug = adminSlug;
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. If sub has plan_id but slug is still not resolved, query plans table directly
  if (!slug && sub?.plan_id && admin) {
    try {
      const { data: planRow } = await admin
        .from("plans")
        .select("slug")
        .eq("id", sub.plan_id)
        .maybeSingle();
      if (planRow?.slug && (planRow.slug in PLAN_CONFIGS)) {
        slug = planRow.slug as PlanSlug;
      }
    } catch {
      // ignore
    }
  }

  // 4. Organization membership check: If the user is on free,
  // check if they are an active member of an organization whose creator/owner has a paid plan (Pro/Business)
  if ((!slug || slug === "free") && admin) {
    try {
      const { data: memberships } = await admin
        .from("organization_members")
        .select("organization:organizations(created_by)")
        .eq("user_id", userId)
        .eq("status", "active");

      if (memberships && memberships.length > 0) {
        for (const m of memberships) {
          const org = m.organization as { created_by?: string } | Array<{ created_by?: string }> | null | undefined;
          const orgOwnerId = Array.isArray(org) ? org[0]?.created_by : org?.created_by;
          if (orgOwnerId && orgOwnerId !== userId) {
            const { data: ownerSub } = await admin
              .from("subscriptions")
              .select("plan_id, plan:plans(slug), status, is_trial, trial_plan, trial_ends_at")
              .eq("user_id", orgOwnerId)
              .in("status", ["active", "trialing"])
              .maybeSingle();

            const ownerSlug = extractSlug(ownerSub);
            if (ownerSlug && ownerSlug !== "free") {
              sub = ownerSub;
              slug = ownerSlug;
              break;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (!sub || !slug || !(slug in PLAN_CONFIGS)) return FREE_PLAN;

  // If on trial, verify that trial has not expired
  if (sub.is_trial || sub.status === "trialing") {
    const trialEnds = (sub as { trial_ends_at?: string | number | Date | null }).trial_ends_at;
    if (trialEnds && new Date(trialEnds) < new Date()) {
      return FREE_PLAN;
    }
  }

  return fromSlug(slug);
}

