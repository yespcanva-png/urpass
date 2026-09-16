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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserPlan(supabase: any, userId: string): Promise<PlanLimits> {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan:plans(slug)")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  const plan = Array.isArray(sub?.plan) ? sub.plan[0] : sub?.plan;
  const slug = plan?.slug as PlanSlug | undefined;
  if (!slug || !(slug in PLAN_CONFIGS)) return FREE_PLAN;
  return fromSlug(slug);
}
