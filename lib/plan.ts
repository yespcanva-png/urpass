import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { SELF_SERVICE_PLAN_LIMITS, UNLIMITED_PLAN_LIMIT } from "@/lib/billing/plan-limits";

export type PlanSlug = "free" | "starter" | "pro" | "business" | "campus" | "enterprise" | "founder" | "lifetime" | "managed_enterprise";

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
  | "paid_events"
  | "whatsapp_self_service";

export const ENTITLEMENTS = {
  FREE: {
    eventsPerMonth: 1,
    registrationsPerMonth: 50,
    organizerSeats: 1,
    customFields: 3,
  },
  STARTER: {
    eventsPerMonth: 3,
    registrationsPerMonth: 500,
    organizerSeats: 2,
    customFields: 10,
    csvImport: true,
    csvExport: true,
  },
  PRO: {
    eventsPerMonth: 10,
    registrationsPerMonth: 2500,
    organizerSeats: 5,
    customFields: Infinity,
    customPassDesign: true,
    removeBranding: true,
    advancedAnalytics: true,
    prioritySupport: true,
    sessionAttendance: true,
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
    whatsappSelfService: true,
    sessionAttendance: true,
  },
  FOUNDER: {
    eventsPerMonth: Infinity,
    registrationsPerMonth: Infinity,
    organizerSeats: 50,
    customFields: Infinity,
    customPassDesign: true,
    removeBranding: true,
    advancedAnalytics: true,
    customDomain: true,
    apiAccess: true,
    webhooks: true,
    advancedPermissions: true,
    crossEventAnalytics: true,
    prioritySupport: true,
    csvImport: true,
    csvExport: true,
    whatsappSelfService: true,
  },
  LIFETIME: {
    eventsPerMonth: Infinity,
    registrationsPerMonth: Infinity,
    organizerSeats: 50,
    customFields: Infinity,
    customPassDesign: true,
    removeBranding: true,
    advancedAnalytics: true,
    customDomain: true,
    apiAccess: true,
    webhooks: true,
    advancedPermissions: true,
    crossEventAnalytics: true,
    prioritySupport: true,
    csvImport: true,
    csvExport: true,
    whatsappSelfService: true,
  },
  MANAGED_ENTERPRISE: {
    eventsPerMonth: Infinity,
    registrationsPerMonth: Infinity,
    organizerSeats: 50,
    customFields: Infinity,
    customPassDesign: true,
    removeBranding: true,
    advancedAnalytics: true,
    customDomain: true,
    apiAccess: true,
    webhooks: true,
    advancedPermissions: true,
    crossEventAnalytics: true,
    prioritySupport: true,
    csvImport: true,
    csvExport: true,
    whatsappSelfService: true,
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
  | "crossEventAnalytics"
  | "whatsappSelfService";

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

const UNLIMITED = UNLIMITED_PLAN_LIMIT;

function ent(...keys: EntitlementKey[]): ReadonlySet<EntitlementKey> {
  return new Set(keys);
}

const PLAN_CONFIGS: Record<PlanSlug, PlanConfig> = {
  free: {
    ...SELF_SERVICE_PLAN_LIMITS.free,
    entitlements: ent(),
  },
  starter: {
    ...SELF_SERVICE_PLAN_LIMITS.starter,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "standard_analytics",
      "paid_events",
    ),
  },
  pro: {
    ...SELF_SERVICE_PLAN_LIMITS.pro,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design", "remove_branding",
      "team_permissions_basic",
      "advanced_analytics",
      "priority_support", "paid_events",
    ),
  },
  business: {
    ...SELF_SERVICE_PLAN_LIMITS.business,
    entitlements: ent(
      "csv_import", "csv_export",
      "email_notifications_full",
      "custom_fields_unlimited",
      "custom_pass_design", "remove_branding",
      "team_permissions_basic", "team_permissions_advanced",
      "advanced_analytics", "cross_event_analytics",
      "custom_domain", "api_access", "webhooks",
      "priority_support", "paid_events",
      "whatsapp_self_service",
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
      "whatsapp_self_service",
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
      "whatsapp_self_service",
    ),
  },
  founder: {
    eventsPerMonth: UNLIMITED,
    registrationsPerMonth: UNLIMITED,
    organizerSeats: 50,
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
      "whatsapp_self_service",
    ),
  },
  lifetime: {
    eventsPerMonth: UNLIMITED,
    registrationsPerMonth: UNLIMITED,
    organizerSeats: 50,
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
      "whatsapp_self_service",
    ),
  },
  managed_enterprise: {
    eventsPerMonth: UNLIMITED,
    registrationsPerMonth: UNLIMITED,
    organizerSeats: 50,
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
      "whatsapp_self_service",
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
  canWhatsAppSelfService?: boolean;
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
    canWhatsAppSelfService: c.entitlements.has("whatsapp_self_service"),
  };
}

const FREE_PLAN = fromSlug("free");

/** Public plan limits used by the event activation flow and publish checks. */
export function getPlanLimitsBySlug(slug: "free" | "starter" | "pro" | "business"): PlanLimits {
  return fromSlug(slug);
}

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

  // Helper to extract plan slug
  function extractSlug(s: Record<string, unknown> | null | undefined): PlanSlug | undefined {
    if (!s) return undefined;
    const planVal = s.plan as { slug?: string } | Array<{ slug?: string }> | undefined;
    const p = Array.isArray(planVal) ? planVal[0] : planVal;
    const rawSlug = p?.slug?.toLowerCase();
    if (rawSlug) {
      if (rawSlug === "founder_lifetime") return "founder";
      if (rawSlug === "managed_service" || rawSlug === "managed") return "managed_enterprise";
      if (rawSlug in PLAN_CONFIGS) return rawSlug as PlanSlug;
    }
    const trialPlan = (s.trial_plan as string | undefined)?.toLowerCase();
    if (trialPlan) {
      if (trialPlan === "founder_lifetime") return "founder";
      if (trialPlan === "managed_service" || trialPlan === "managed") return "managed_enterprise";
      if (trialPlan in PLAN_CONFIGS) return trialPlan as PlanSlug;
    }
    return undefined;
  }

  function isSubscriptionActive(s: Record<string, unknown> | null | undefined): boolean {
    if (!s) return false;
    const status = (s.status as string | undefined)?.toLowerCase();
    const planSlug = extractSlug(s);
    if (planSlug === "founder" || planSlug === "lifetime") return true;

    if (status === "cancelled") {
      const periodEnds = (s as { current_period_end?: string | number | Date | null }).current_period_end;
      if (!periodEnds || new Date(periodEnds).getTime() < Date.now()) return false;
    }
    if (!["active", "trialing", "cancelled", "payment_pending", "past_due", "halted"].includes(status || "")) return false;

    if (s.is_trial || status === "trialing") {
      const trialEnds = (s as { trial_ends_at?: string | number | Date | null }).trial_ends_at;
      return Boolean(trialEnds && new Date(trialEnds).getTime() > Date.now());
    }

    if (planSlug === "free") return status === "active";
    const periodEnds = (s as { current_period_end?: string | number | Date | null }).current_period_end;
    if (periodEnds && new Date(periodEnds).getTime() < Date.now()) {
      return false;
    }
    return true;
  }

  // 1. Try querying with the provided supabase client
  if (supabase && typeof supabase.from === "function") {
    try {
      const query = supabase
        .from("subscriptions")
        .select("plan_id, plan:plans!subscriptions_plan_id_fkey(slug), status, is_trial, trial_plan, trial_ends_at, current_period_end, has_lifetime_access, lifetime_plan_slug")
        .eq("user_id", userId);

      // Support mock clients with or without .in()
      const queryWithIn = typeof query.in === "function"
        ? query.in("status", ["active", "trialing", "cancelled", "payment_pending", "past_due", "halted"])
        : query;

      const res = typeof queryWithIn.maybeSingle === "function"
        ? await queryWithIn.maybeSingle()
        : await queryWithIn.single();

      if (res?.error) {
        console.error("[plan] Subscription plan lookup failed; retrying without the plan relationship", {
          userId,
          code: res.error.code,
          message: res.error.message,
        });
      }
      sub = (res?.data as Record<string, unknown>) ?? null;
    } catch {
      sub = null;
    }
  }

  if ((!sub || !sub.plan) && supabase && typeof supabase.from === "function") {
    try {
      const { data: directSub, error: directError } = await supabase
        .from("subscriptions")
        .select("plan_id, status, is_trial, trial_plan, trial_ends_at, current_period_end, has_lifetime_access, lifetime_plan_slug")
        .eq("user_id", userId)
        .maybeSingle();
      if (directError) {
        console.error("[plan] Direct subscription lookup failed", { userId, code: directError.code, message: directError.message });
      } else if (directSub?.plan_id) {
        const { data: directPlan, error: planError } = await supabase
          .from("plans")
          .select("slug")
          .eq("id", directSub.plan_id)
          .maybeSingle();
        if (planError) {
          console.error("[plan] Direct plan lookup failed", { userId, code: planError.code, message: planError.message });
        } else {
          sub = { ...directSub, plan: directPlan };
        }
      }
    } catch (error) {
      console.error("[plan] Direct subscription lookup threw", { userId, error });
    }
  }

  let slug: PlanSlug | undefined = undefined;
  if (sub && isSubscriptionActive(sub)) {
    slug = extractSlug(sub);
  }

  // 2. If sub not found or slug not active, fallback to admin client
  // (Prevents silent RLS failures, token refresh sync delays, or cross-user lookup blocks)
  const admin = getAdminClientSafe();
  if ((!sub || !slug || slug === "free") && admin) {
    try {
      const { data: adminSub } = await admin
        .from("subscriptions")
        .select("plan_id, plan:plans!subscriptions_plan_id_fkey(slug), status, is_trial, trial_plan, trial_ends_at, current_period_end, has_lifetime_access, lifetime_plan_slug")
        .eq("user_id", userId)
        .maybeSingle();

      if (adminSub) {
        sub = adminSub;
        if (isSubscriptionActive(adminSub)) {
          const adminSlug = extractSlug(adminSub);
          if (adminSlug) {
            slug = adminSlug;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. If sub has plan_id but slug is still not resolved, query plans table directly
  if (!slug && sub?.plan_id && isSubscriptionActive(sub) && admin) {
    try {
      const { data: planRow } = await admin
        .from("plans")
        .select("slug")
        .eq("id", sub.plan_id)
        .maybeSingle();
      if (planRow?.slug) {
        const rowSlug = planRow.slug.toLowerCase();
        const mappedSlug = (rowSlug === "managed_service" || rowSlug === "managed") ? "managed_enterprise" : rowSlug;
        if (mappedSlug in PLAN_CONFIGS) {
          slug = mappedSlug as PlanSlug;
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. LIFETIME CONTINUITY FALLBACK:
  // If user does not have an active upgraded subscription, BUT has lifetime access:
  // Maintain founder lifetime plan entitlements instead of dropping to Free!
  const hasLifetime = Boolean(
    sub?.has_lifetime_access ||
    sub?.lifetime_plan_slug === "founder" ||
    extractSlug(sub) === "founder"
  );

  if ((!slug || slug === "free") && hasLifetime) {
    const rawLifetime = (sub?.lifetime_plan_slug as string)?.toLowerCase();
    const fallbackSlug: PlanSlug = rawLifetime === "founder" || rawLifetime === "lifetime" ? "founder" : "founder";
    return fromSlug(fallbackSlug);
  }

  // 5. Organization membership check: If the user is on free,
  // check if they are an active member of an organization whose creator/owner has a paid plan (Pro/Business/Founder)
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
              .select("plan_id, plan:plans!subscriptions_plan_id_fkey(slug), status, is_trial, trial_plan, trial_ends_at, current_period_end, has_lifetime_access, lifetime_plan_slug")
              .eq("user_id", orgOwnerId)
              .maybeSingle();

            if (ownerSub && isSubscriptionActive(ownerSub)) {
              const ownerSlug = extractSlug(ownerSub);
              if (ownerSlug && ownerSlug !== "free") {
                sub = ownerSub;
                slug = ownerSlug;
                break;
              }
            } else if (ownerSub?.has_lifetime_access || ownerSub?.lifetime_plan_slug === "founder") {
              return fromSlug("founder");
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (!slug || !(slug in PLAN_CONFIGS)) {
    return FREE_PLAN;
  }

  return fromSlug(slug);
}

