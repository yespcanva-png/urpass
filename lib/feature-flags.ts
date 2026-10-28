import { canUseFeature, type EntitlementFeature } from "@/lib/plan";

export type FeatureFlagKey =
  | "ai_agenda"
  | "face_checkin"
  | "sponsor_deliverables"
  | "b2b_matchmaking"
  | "custom_domain"
  | "advanced_analytics"
  | "webhooks"
  | "sms_reminders"
  | "custom_pass_design"
  | "white_label_portal"
  | "offline_mesh_sync"
  | "waitlist_priority_queue"
  | "bulk_ticket_booking"
  | "ticket_distribution"
  | "member_registration_forms"
  | "serial_number_validation"
  | "advanced_entry_tracking"
  | "session_attendance"
  | "csv_management"
  | "google_sheets"
  | "ticket_reassignment"
  | "offline_scanning"
  | "group_entry"
  | "ticket_cancellation";

export type CoreFeatureKey =
  | "public_registration"
  | "pass_issuance"
  | "standard_checkin"
  | "basic_ticketing"
  | "core_analytics";

export interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  moduleCode?: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  requiredEntitlement?: EntitlementFeature | null;
  requiredFeatureKeys?: FeatureFlagKey[];
  migrationPolicy?: (event: EventLike) => boolean;
}

export interface EventFeaturesConfig {
  features: Partial<Record<FeatureFlagKey, boolean>>;
  platformAvailable?: Partial<Record<FeatureFlagKey, boolean>>;
  configValid?: Partial<Record<FeatureFlagKey, boolean>>;
  validationErrors?: Partial<Record<FeatureFlagKey, string[]>>;
  version: number;
  updatedAt: string;
  updatedBy?: string;
}

export interface EventFeatureSettingRow {
  feature_key: string;
  enabled: boolean;
  required_config_valid?: boolean | null;
  validation_errors?: unknown;
  version?: number | null;
  updated_at?: string | null;
  updated_by?: string | null;
}

export interface PlatformFeatureFlagRow {
  feature_key: string;
  platform_available?: boolean | null;
}

export interface EventLike {
  id: string;
  organizer_id: string;
  organization_id?: string | null;
  created_at?: string;
  custom_pass_design?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export const CORE_FEATURES: Record<CoreFeatureKey, { name: string; description: string }> = {
  public_registration: {
    name: "Public Registration",
    description: "Public registration and ticket booking workflow.",
  },
  pass_issuance: {
    name: "Pass Issuance",
    description: "Generation and email delivery of attendee QR passes.",
  },
  standard_checkin: {
    name: "Standard QR Check-in",
    description: "Scanning and validating passes at entry gates.",
  },
  basic_ticketing: {
    name: "Basic Ticketing",
    description: "Free and paid ticket tier sales.",
  },
  core_analytics: {
    name: "Core Analytics",
    description: "Turnout and attendance velocity metrics.",
  },
};

export const FEATURE_FLAG_DEFINITIONS: Record<FeatureFlagKey, FeatureFlagDefinition> = {
  ai_agenda: {
    key: "ai_agenda",
    moduleCode: "M12",
    name: "AI Agenda & Schedule Optimizer",
    description: "AI-assisted multi-track conference agenda builder.",
    defaultEnabled: false,
    requiredEntitlement: "advancedPermissions",
  },
  face_checkin: {
    key: "face_checkin",
    moduleCode: "M13",
    name: "Facial Recognition Check-in",
    description: "Biometric zero-touch check-in at physical gates.",
    defaultEnabled: false,
    requiredEntitlement: "advancedPermissions",
  },
  sponsor_deliverables: {
    key: "sponsor_deliverables",
    moduleCode: "M16",
    name: "Sponsor Deliverables & ROI Tracker",
    description: "Sponsor booth management, branding assets, and lead tracking.",
    defaultEnabled: false,
    requiredEntitlement: "advancedAnalytics",
  },
  b2b_matchmaking: {
    key: "b2b_matchmaking",
    moduleCode: "M17",
    name: "B2B Matchmaking & 1:1 Meetings",
    description: "Attendee matchmaking and meeting slot booking.",
    defaultEnabled: false,
    requiredEntitlement: "advancedPermissions",
  },
  custom_domain: {
    key: "custom_domain",
    moduleCode: "M18",
    name: "Custom Event Domain",
    description: "Host event portals under your organization custom domain.",
    defaultEnabled: false,
    requiredEntitlement: "customDomain",
  },
  advanced_analytics: {
    key: "advanced_analytics",
    moduleCode: "M11",
    name: "Advanced Operational Analytics",
    description: "Cross-gate velocity curves, dwell time, and cohort heatmaps.",
    defaultEnabled: false,
    requiredEntitlement: "advancedAnalytics",
  },
  webhooks: {
    key: "webhooks",
    moduleCode: "M19",
    name: "Real-time Event Webhooks",
    description: "Dispatch webhooks on registration and gate check-in events.",
    defaultEnabled: false,
    requiredEntitlement: "webhooks",
  },
  sms_reminders: {
    key: "sms_reminders",
    moduleCode: "M20",
    name: "SMS Alerts & Reminders",
    description: "Automated DLT-compliant SMS notifications for attendees.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  custom_pass_design: {
    key: "custom_pass_design",
    moduleCode: "M21",
    name: "Custom Pass Designer",
    description: "Visual pass styling, category badges, and custom branding.",
    defaultEnabled: false,
    requiredEntitlement: "customPassDesign",
  },
  white_label_portal: {
    key: "white_label_portal",
    moduleCode: "M22",
    name: "White-Label Attendee Portal",
    description: "Remove UrPass branding and apply custom theme styles.",
    defaultEnabled: false,
    requiredEntitlement: "removeBranding",
  },
  offline_mesh_sync: {
    key: "offline_mesh_sync",
    moduleCode: "M23",
    name: "Offline Multi-Gate Mesh Sync",
    description: "Peer-to-peer scanner synchronization in zero-connectivity venues.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  waitlist_priority_queue: {
    key: "waitlist_priority_queue",
    moduleCode: "M24",
    name: "Automated Waitlist Priority Queue",
    description: "Auto-promotes waitlisted attendees when capacity opens up.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  bulk_ticket_booking: {
    key: "bulk_ticket_booking",
    moduleCode: "M01",
    name: "Bulk Ticket Booking",
    description: "Purchase multiple tickets in a single order with atomic capacity reservations.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  ticket_distribution: {
    key: "ticket_distribution",
    moduleCode: "M02",
    name: "Bulk Ticket Distribution & Claiming",
    description: "Distribute bulk purchased tickets to individual members with secure claim links.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  member_registration_forms: {
    key: "member_registration_forms",
    moduleCode: "M03",
    name: "Member Registration Forms",
    description: "Collect detailed attendee profile fields with ticket category targeting and server-side validation.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  serial_number_validation: {
    key: "serial_number_validation",
    moduleCode: "M04",
    name: "Serial Number Validation",
    description: "Support manual, auto-generated sequence, or verified whitelist serial number assignment with uniqueness enforcement.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  advanced_entry_tracking: {
    key: "advanced_entry_tracking",
    moduleCode: "M06",
    name: "Advanced Entry, Exit & Multi-Gate Tracking",
    description: "Multi-gate zone routing, entry/exit state tracking, staff gate assignment, and anti-passback controls.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  session_attendance: {
    key: "session_attendance",
    moduleCode: "M07",
    name: "Session-Wise Attendance & Scanning",
    description: "Track session-level attendance, multi-track capacities, check-in/checkout duration, and eligibility.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  csv_management: {
    key: "csv_management",
    moduleCode: "M08",
    name: "CSV Import & Export Management",
    description: "Downloadable CSV templates, staged validation import pipelines, and formula-sanitized exports.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  ticket_reassignment: {
    key: "ticket_reassignment",
    moduleCode: "M05",
    name: "Ticket Reassignment & Revocation",
    description: "Allow ticket purchasers or organizers to revoke and reassign unused tickets to new attendees.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  offline_scanning: {
    key: "offline_scanning",
    moduleCode: "M10",
    name: "Offline Scanning & Synchronization",
    description: "Capture, encrypt, queue, and reconcile offline check-in scans when internet connectivity is intermittent.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  google_sheets: {
    key: "google_sheets",
    moduleCode: "M09",
    name: "Google Sheets Integration",
    description: "Optional one-way sync of registration, distribution, scan, and attendance data to organizer-owned Google Sheets.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
  group_entry: {
    key: "group_entry",
    moduleCode: "M14",
    name: "Group QR Partial Entry",
    description: "One QR code representing multiple tickets with partial admission and real-time remaining balance tracking.",
    defaultEnabled: true,
    requiredEntitlement: null,
    migrationPolicy: () => true,
  },
  ticket_cancellation: {
    key: "ticket_cancellation",
    moduleCode: "M15",
    name: "Ticket Cancellation",
    description: "Optional attendee self-service ticket cancellations with cutoffs, organizer approval, and refund policies.",
    defaultEnabled: false,
    requiredEntitlement: null,
  },
};

/**
 * Extracts or initializes the feature flags configuration from an event record.
 * Handles legacy events without feature flags gracefully with backward compatibility.
 */
export function getEventFeaturesConfig(event?: EventLike | null): EventFeaturesConfig {
  if (!event || !event.custom_pass_design) {
    return {
      features: {},
      platformAvailable: {},
      configValid: {},
      validationErrors: {},
      version: 1,
      updatedAt: new Date(0).toISOString(),
    };
  }

  const rawConfig = (event.custom_pass_design as Record<string, unknown>)?._featureFlags;
  if (rawConfig && typeof rawConfig === "object") {
    const cfg = rawConfig as Partial<EventFeaturesConfig>;
    return {
      features: (cfg.features && typeof cfg.features === "object") ? cfg.features : {},
      platformAvailable: (cfg.platformAvailable && typeof cfg.platformAvailable === "object") ? cfg.platformAvailable : {},
      configValid: (cfg.configValid && typeof cfg.configValid === "object") ? cfg.configValid : {},
      validationErrors: (cfg.validationErrors && typeof cfg.validationErrors === "object") ? cfg.validationErrors : {},
      version: typeof cfg.version === "number" ? cfg.version : 1,
      updatedAt: typeof cfg.updatedAt === "string" ? cfg.updatedAt : new Date().toISOString(),
      updatedBy: typeof cfg.updatedBy === "string" ? cfg.updatedBy : undefined,
    };
  }

  return {
    features: {},
    platformAvailable: {},
    configValid: {},
    validationErrors: {},
    version: 1,
    updatedAt: new Date(0).toISOString(),
  };
}

export function isAdvancedModuleFeature(featureKey: FeatureFlagKey): boolean {
  return Boolean(FEATURE_FLAG_DEFINITIONS[featureKey]?.moduleCode);
}

function coerceValidationErrors(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function mergePersistedFeatureRows({
  event,
  settings,
  platformFlags,
}: {
  event?: EventLike | null;
  settings?: EventFeatureSettingRow[] | null;
  platformFlags?: PlatformFeatureFlagRow[] | null;
}): EventFeaturesConfig {
  const legacy = getEventFeaturesConfig(event);
  const features = { ...legacy.features };
  const platformAvailable = { ...(legacy.platformAvailable ?? {}) };
  const configValid = { ...(legacy.configValid ?? {}) };
  const validationErrors = { ...(legacy.validationErrors ?? {}) };
  let version = legacy.version;
  let updatedAt = legacy.updatedAt;
  let updatedBy = legacy.updatedBy;

  for (const flag of platformFlags ?? []) {
    if (flag.feature_key in FEATURE_FLAG_DEFINITIONS) {
      platformAvailable[flag.feature_key as FeatureFlagKey] = flag.platform_available !== false;
    }
  }

  for (const row of settings ?? []) {
    if (!(row.feature_key in FEATURE_FLAG_DEFINITIONS)) continue;
    const key = row.feature_key as FeatureFlagKey;
    features[key] = Boolean(row.enabled);
    configValid[key] = row.required_config_valid !== false;
    validationErrors[key] = coerceValidationErrors(row.validation_errors);
    version = Math.max(version, row.version ?? 1);
    if (row.updated_at && row.updated_at > updatedAt) updatedAt = row.updated_at;
    if (row.updated_by) updatedBy = row.updated_by;
  }

  return {
    features,
    platformAvailable,
    configValid,
    validationErrors,
    version,
    updatedAt,
    updatedBy,
  };
}

export function isFeatureUsableFromConfig(
  config: EventFeaturesConfig,
  featureKey: FeatureFlagKey,
  planOrSlug?: string | { slug?: string; tier?: string } | null
): { usable: boolean; reason?: string } {
  const def = FEATURE_FLAG_DEFINITIONS[featureKey];
  if (!def) return { usable: false, reason: `Unknown feature: ${featureKey}` };

  if (config.platformAvailable?.[featureKey] === false) {
    return { usable: false, reason: `${def.name} is not available on the platform yet.` };
  }

  const entitlement = validateFeatureEntitlement(planOrSlug ?? "free", featureKey);
  if (!entitlement.valid) return { usable: false, reason: entitlement.error };

  if (config.features[featureKey] !== true) {
    return { usable: false, reason: `${def.name} is disabled for this event.` };
  }

  if (config.configValid?.[featureKey] === false) {
    return { usable: false, reason: `${def.name} has incomplete required configuration.` };
  }

  return { usable: true };
}

/**
 * Checks whether a specific feature is enabled for an event.
 * - Core features are always enabled (true) to ensure existing workflows continue unimpeded.
 * - Newly introduced features are disabled (false) by default unless explicitly configured or enabled via migration policy.
 */
export function isFeatureEnabled(
  event: EventLike | null | undefined,
  featureKey: FeatureFlagKey | CoreFeatureKey | string
): boolean {
  // 1. Core platform features always remain active
  if (featureKey in CORE_FEATURES) {
    return true;
  }

  const def = FEATURE_FLAG_DEFINITIONS[featureKey as FeatureFlagKey];
  if (!def) {
    return false;
  }

  const config = getEventFeaturesConfig(event);
  const explicitSetting = config.features[def.key];
  const platformAvailable = config.platformAvailable?.[def.key];
  const configValid = config.configValid?.[def.key];

  if (platformAvailable === false || configValid === false) {
    return false;
  }

  // 2. Explicit configuration overrides defaults
  if (typeof explicitSetting === "boolean") {
    return explicitSetting;
  }

  // 3. Optional migration policy evaluation
  if (event && def.migrationPolicy) {
    try {
      return Boolean(def.migrationPolicy(event));
    } catch {
      return def.defaultEnabled;
    }
  }

  // 4. Initial default for new features (false)
  return def.defaultEnabled;
}

/**
 * Validates whether the user's plan/entitlements permit activating a restricted feature.
 */
export function validateFeatureEntitlement(
  planOrSlug: string | { slug?: string; tier?: string } | null | undefined,
  featureKey: FeatureFlagKey
): { valid: boolean; error?: string } {
  const def = FEATURE_FLAG_DEFINITIONS[featureKey];
  if (!def) {
    return { valid: false, error: `Unknown feature: ${featureKey}` };
  }

  if (!def.requiredEntitlement) {
    return { valid: true };
  }

  const permitted = canUseFeature(planOrSlug, def.requiredEntitlement);
  if (!permitted) {
    return {
      valid: false,
      error: `Feature "${def.name}" requires an upgraded plan with the "${def.requiredEntitlement}" entitlement.`,
    };
  }

  return { valid: true };
}

/**
 * Guard assertion for mutation endpoints: throws or returns an error if feature is disabled.
 */
export function assertFeatureEnabled(
  event: EventLike | null | undefined,
  featureKey: FeatureFlagKey
): { error?: string; enabled: boolean } {
  const enabled = isFeatureEnabled(event, featureKey);
  if (!enabled) {
    const def = FEATURE_FLAG_DEFINITIONS[featureKey];
    const name = def ? def.name : featureKey;
    return {
      enabled: false,
      error: `FEATURE_DISABLED: "${name}" is currently disabled for this event. Direct mutations are blocked.`,
    };
  }
  return { enabled: true };
}

/**
 * Extracts and normalizes modular configurations from an event's custom_pass_design.
 */
export function extractModuleConfigsFromEvent(
  event?: EventLike | null
): Record<string, Record<string, unknown>> {
  const design =
    event?.custom_pass_design && typeof event.custom_pass_design === "object"
      ? (event.custom_pass_design as Record<string, unknown>)
      : {};

  const unified =
    design._moduleConfigs && typeof design._moduleConfigs === "object"
      ? (design._moduleConfigs as Record<string, Record<string, unknown>>)
      : {};

  return {
    bulk_ticket_booking: {
      ...((design._bulkBookingSettings as Record<string, unknown>) || {}),
      ...(unified.bulk_ticket_booking || {}),
    },
    ticket_distribution: {
      ...((design._distributionSettings as Record<string, unknown>) || {}),
      ...(unified.ticket_distribution || {}),
    },
    member_registration_forms: {
      ...((design._memberFormConfig as Record<string, unknown>) || {}),
      ...(unified.member_registration_forms || {}),
    },
    serial_number_validation: {
      ...((design._serialNumberConfig as Record<string, unknown>) || {}),
      ...(unified.serial_number_validation || {}),
    },
    ticket_reassignment: {
      ...((design._ticketReassignmentConfig as Record<string, unknown>) || {}),
      ...(unified.ticket_reassignment || {}),
    },
    advanced_entry_tracking: {
      ...((design._gateTrackingConfig as Record<string, unknown>) || {}),
      ...(unified.advanced_entry_tracking || {}),
    },
    session_attendance: {
      ...((design._sessionAttendanceConfig as Record<string, unknown>) || {}),
      ...(unified.session_attendance || {}),
    },
    csv_management: {
      ...((design._csvManagementConfig as Record<string, unknown>) || {}),
      ...(unified.csv_management || {}),
    },
    offline_scanning: {
      ...((design._offlineScanningConfig as Record<string, unknown>) || {}),
      ...(unified.offline_scanning || {}),
    },
    advanced_analytics: {
      ...((design._advancedAnalyticsConfig as Record<string, unknown>) || {}),
      ...(unified.advanced_analytics || {}),
    },
    group_entry: {
      ...((design._groupEntryConfig as Record<string, unknown>) || {}),
      ...(unified.group_entry || {}),
    },
    ticket_cancellation: {
      ...((design._cancellationConfig as Record<string, unknown>) || {}),
      ...(unified.ticket_cancellation || {}),
    },
    ...unified,
  };
}

