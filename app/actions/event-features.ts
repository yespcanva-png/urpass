"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getUserPlan } from "@/lib/plan";
import {
  type FeatureFlagKey,
  type EventFeaturesConfig,
  FEATURE_FLAG_DEFINITIONS,
  validateFeatureEntitlement,
  assertFeatureEnabled,
  mergePersistedFeatureRows,
  isFeatureUsableFromConfig,
  extractModuleConfigsFromEvent as extractModuleConfigsFromEventSync,
  type EventLike,
  type EventFeatureSettingRow,
  type PlatformFeatureFlagRow,
} from "@/lib/feature-flags";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface UpdateFeatureResult {
  success?: boolean;
  error?: string;
  conflict?: boolean;
  config?: EventFeaturesConfig;
  usable?: boolean;
  featureKey?: FeatureFlagKey;
  enabled?: boolean;
}

type EventFeatureEventRow = EventLike & {
  id: string;
  organizer_id: string;
  organization_id?: string | null;
  custom_pass_design?: Record<string, unknown> | null;
};

function isFeatureKey(value: string): value is FeatureFlagKey {
  return value in FEATURE_FLAG_DEFINITIONS;
}

function canManageEventFeatures(event: EventFeatureEventRow, userId: string, memberRole?: string | null) {
  return (
    event.organizer_id === userId ||
    memberRole === "owner" ||
    memberRole === "admin" ||
    memberRole === "event_manager"
  );
}

function canReadEventFeatures(event: EventFeatureEventRow, userId: string, memberRole?: string | null) {
  return event.organizer_id === userId || Boolean(memberRole);
}

async function getEventAndMembership(db: ReturnType<typeof adminClient>, eventId: string, userId: string) {
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return { error: "Event not found." as const };
  }

  let memberRole: string | null = null;
  if (event.organization_id) {
    const { data: member } = await db
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    memberRole = member?.role ?? null;
  }

  return {
    event: event as EventFeatureEventRow,
    memberRole,
  };
}

async function loadPersistedFeatureConfig(
  db: ReturnType<typeof adminClient>,
  event: EventFeatureEventRow
): Promise<EventFeaturesConfig> {
  let settings: EventFeatureSettingRow[] = [];
  let platformFlags: PlatformFeatureFlagRow[] = [];

  try {
    const [{ data: settingsRows }, { data: platformRows }] = await Promise.all([
      db
        .from("event_feature_settings")
        .select("feature_key, enabled, required_config_valid, validation_errors, version, updated_at, updated_by")
        .eq("event_id", event.id),
      db
        .from("platform_feature_flags")
        .select("feature_key, platform_available"),
    ]);

    settings = (settingsRows ?? []) as EventFeatureSettingRow[];
    platformFlags = (platformRows ?? []) as PlatformFeatureFlagRow[];
  } catch {
    // Fresh local environments may not have run migration 087 yet. Legacy JSON remains readable.
  }

  return mergePersistedFeatureRows({ event, settings, platformFlags });
}

function toLegacyFeatureDesign(
  event: EventFeatureEventRow,
  config: EventFeaturesConfig
): Record<string, unknown> {
  const existingDesign = event.custom_pass_design && typeof event.custom_pass_design === "object"
    ? event.custom_pass_design
    : {};

  return {
    ...existingDesign,
    _featureFlags: config,
  };
}

/**
 * Updates a specific feature flag for an event with multi-tenant auth, entitlement checks,
 * and optimistic concurrency control.
 */
export async function updateEventFeatureFlag(
  eventId: string,
  featureKey: FeatureFlagKey,
  enabled: boolean,
  expectedVersion?: number
): Promise<UpdateFeatureResult> {
  if (!isFeatureKey(featureKey)) {
    return { error: `Unknown feature: ${featureKey}` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const db = adminClient();
  const eventResult = await getEventAndMembership(db, eventId, user.id);
  if ("error" in eventResult) return { error: eventResult.error };

  const { event, memberRole } = eventResult;
  if (!canManageEventFeatures(event, user.id, memberRole)) {
    return { error: "Unauthorized: You do not have permission to modify this event's feature flags." };
  }

  // 3. Feature Entitlement Validation (Subscription check when enabling restricted features)
  if (enabled) {
    const userPlan = await getUserPlan(supabase, user.id);
    const entitlementCheck = validateFeatureEntitlement(userPlan, featureKey);
    if (!entitlementCheck.valid) {
      return { error: entitlementCheck.error };
    }
  }

  // 4. Current Feature Configuration & Concurrency Control
  const currentConfig = await loadPersistedFeatureConfig(db, event);

  if (expectedVersion !== undefined && currentConfig.version !== expectedVersion) {
    return {
      error: "Conflict: Event feature settings were modified by another session. Please reload and try again.",
      conflict: true,
      config: currentConfig,
    };
  }

  // 5. Update Feature Flags Object (Modularity: other features remain unchanged)
  const updatedFeatures = {
    ...currentConfig.features,
    [featureKey]: enabled,
  };
  const updatedConfigValid = {
    ...(currentConfig.configValid ?? {}),
    [featureKey]: currentConfig.configValid?.[featureKey] !== false,
  };

  const nextVersion = currentConfig.version + 1;
  const now = new Date().toISOString();

  const nextConfig: EventFeaturesConfig = {
    features: updatedFeatures,
    platformAvailable: currentConfig.platformAvailable ?? {},
    configValid: updatedConfigValid,
    validationErrors: currentConfig.validationErrors ?? {},
    version: nextVersion,
    updatedAt: now,
    updatedBy: user.id,
  };

  const usability = isFeatureUsableFromConfig(nextConfig, featureKey, enabled ? await getUserPlan(supabase, user.id) : "free");
  if (enabled && !usability.usable) {
    return { error: usability.reason ?? "Feature cannot be enabled until requirements are met." };
  }

  const previousRow = {
    enabled: currentConfig.features[featureKey] === true,
    required_config_valid: currentConfig.configValid?.[featureKey] !== false,
    validation_errors: currentConfig.validationErrors?.[featureKey] ?? [],
    version: currentConfig.version,
  };

  try {
    // 1. Ensure the feature key exists in platform_feature_flags to satisfy FK constraint
    const flagDef = FEATURE_FLAG_DEFINITIONS[featureKey];
    await db
      .from("platform_feature_flags")
      .upsert(
        {
          feature_key: featureKey,
          module_code: flagDef?.moduleCode || `MOD_${featureKey.toUpperCase()}`,
          name: flagDef?.name || featureKey,
          platform_available: true,
        },
        { onConflict: "feature_key" }
      );

    const { error: upsertErr } = await db
      .from("event_feature_settings")
      .upsert(
        {
          event_id: eventId,
          feature_key: featureKey,
          enabled,
          required_config_valid: updatedConfigValid[featureKey],
          validation_errors: nextConfig.validationErrors?.[featureKey] ?? [],
          version: nextVersion,
          updated_by: user.id,
          updated_at: now,
        },
        { onConflict: "event_id,feature_key" }
      );

    if (upsertErr) {
      console.warn(`[updateEventFeatureFlag] Warning: failed to upsert into event_feature_settings (${upsertErr.message}). Continuing with events.custom_pass_design.`);
    } else {
      await db.from("event_feature_audit_logs").insert({
        event_id: eventId,
        feature_key: featureKey,
        actor_id: user.id,
        action: enabled ? "enabled" : "disabled",
        old_value: previousRow,
        new_value: {
          enabled,
          required_config_valid: updatedConfigValid[featureKey],
          validation_errors: nextConfig.validationErrors?.[featureKey] ?? [],
          version: nextVersion,
        },
      });
    }
  } catch (err) {
    // Keep the legacy mirror as a compatibility fallback in local/test environments.
    console.warn("[updateEventFeatureFlag] Exception persisting feature setting row:", err);
  }

  const updatedDesign = toLegacyFeatureDesign(event, nextConfig);

  // 6. Non-Destructive Update (Updates flags in place without deleting any historical attendees/passes/checkins)
  const { error: updateErr } = await db
    .from("events")
    .update({
      custom_pass_design: updatedDesign,
      updated_at: now,
    })
    .eq("id", eventId);

  if (updateErr) {
    return { error: `Failed to update feature settings: ${updateErr.message}` };
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);

  return {
    success: true,
    featureKey,
    enabled,
    usable: !enabled || usability.usable,
    config: nextConfig,
  };
}

/**
 * Server Action: Extracts and normalizes modular configurations from an event.
 */
export async function extractModuleConfigsFromEvent(
  event: EventFeatureEventRow
): Promise<Record<string, Record<string, unknown>>> {
  return extractModuleConfigsFromEventSync(event);
}

/**
 * Retrieves the complete feature flags state for an event.
 */
export async function getEventFeatureFlagsState(eventId: string): Promise<{
  error?: string;
  config?: EventFeaturesConfig;
  features?: Record<FeatureFlagKey, boolean>;
  usable?: Record<FeatureFlagKey, boolean>;
  platformAvailable?: Record<FeatureFlagKey, boolean>;
  moduleConfigs?: Record<string, Record<string, unknown>>;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const db = adminClient();
  const eventResult = await getEventAndMembership(db, eventId, user.id);
  if ("error" in eventResult) return { error: eventResult.error };

  const { event, memberRole } = eventResult;
  if (!canReadEventFeatures(event, user.id, memberRole)) {
    return { error: "Unauthorized: You do not have access to this event's feature flags." };
  }

  const [config, userPlan] = await Promise.all([
    loadPersistedFeatureConfig(db, event),
    getUserPlan(supabase, user.id),
  ]);
  const resolvedFeatures = Object.keys(FEATURE_FLAG_DEFINITIONS).reduce<Record<FeatureFlagKey, boolean>>(
    (acc, key) => {
      const flagKey = key as FeatureFlagKey;
      acc[flagKey] =
        config.platformAvailable?.[flagKey] !== false &&
        config.configValid?.[flagKey] !== false &&
        config.features[flagKey] === true;
      return acc;
    },
    {} as Record<FeatureFlagKey, boolean>
  );
  const usable = Object.keys(FEATURE_FLAG_DEFINITIONS).reduce<Record<FeatureFlagKey, boolean>>(
    (acc, key) => {
      const flagKey = key as FeatureFlagKey;
      acc[flagKey] = isFeatureUsableFromConfig(config, flagKey, userPlan).usable;
      return acc;
    },
    {} as Record<FeatureFlagKey, boolean>
  );
  const platformAvailable = Object.keys(FEATURE_FLAG_DEFINITIONS).reduce<Record<FeatureFlagKey, boolean>>(
    (acc, key) => {
      const flagKey = key as FeatureFlagKey;
      acc[flagKey] = config.platformAvailable?.[flagKey] !== false;
      return acc;
    },
    {} as Record<FeatureFlagKey, boolean>
  );

  return {
    config,
    features: resolvedFeatures,
    usable,
    platformAvailable,
    moduleConfigs: extractModuleConfigsFromEventSync(event),
  };
}

/**
 * Saves configuration rules for a specific event module and ensures the feature flag is activated.
 */
export async function saveEventModuleConfig(
  eventId: string,
  featureKey: FeatureFlagKey,
  settings: Record<string, unknown>,
  autoEnable = true
): Promise<{
  success: boolean;
  config?: EventFeaturesConfig;
  settings?: Record<string, unknown>;
  error?: string;
}> {
  if (!isFeatureKey(featureKey)) {
    return { success: false, error: `Unknown feature: ${featureKey}` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const db = adminClient();
  const eventResult = await getEventAndMembership(db, eventId, user.id);
  if ("error" in eventResult) return { success: false, error: eventResult.error };

  const { event, memberRole } = eventResult;
  if (!canManageEventFeatures(event, user.id, memberRole)) {
    return {
      success: false,
      error: "Unauthorized: You do not have permission to configure this event's features.",
    };
  }

  let updatedFeatureConfig: EventFeaturesConfig | undefined = undefined;

  if (autoEnable) {
    const flagResult = await updateEventFeatureFlag(eventId, featureKey, true);
    if (flagResult.error) {
      return { success: false, error: flagResult.error };
    }
    updatedFeatureConfig = flagResult.config;
  }

  // Reload current event custom_pass_design after potential flag update
  const { data: freshEvent } = await db
    .from("events")
    .select("custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  const existingDesign =
    freshEvent?.custom_pass_design && typeof freshEvent.custom_pass_design === "object"
      ? (freshEvent.custom_pass_design as Record<string, unknown>)
      : {};

  const currentUnified =
    existingDesign._moduleConfigs && typeof existingDesign._moduleConfigs === "object"
      ? (existingDesign._moduleConfigs as Record<string, Record<string, unknown>>)
      : {};

  const updatedUnified = {
    ...currentUnified,
    [featureKey]: {
      ...(currentUnified[featureKey] || {}),
      ...settings,
    },
  };

  const updatedDesign: Record<string, unknown> = {
    ...existingDesign,
    _moduleConfigs: updatedUnified,
  };

  if (featureKey === "bulk_ticket_booking") {
    updatedDesign._bulkBookingSettings = {
      ...((existingDesign._bulkBookingSettings as Record<string, unknown>) || {}),
      ...settings,
      maxQuantityPerOrder: Number(settings.max_per_order) || 10,
    };
  } else if (featureKey === "ticket_distribution") {
    updatedDesign._distributionSettings = {
      ...((existingDesign._distributionSettings as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "member_registration_forms") {
    updatedDesign._memberFormConfig = {
      ...((existingDesign._memberFormConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "serial_number_validation") {
    updatedDesign._serialNumberConfig = {
      ...((existingDesign._serialNumberConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "ticket_reassignment") {
    updatedDesign._ticketReassignmentConfig = {
      ...((existingDesign._ticketReassignmentConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "advanced_entry_tracking") {
    const reEntryPolicy = (settings.re_entry_policy as string) || "allowed";
    const duplicatePolicy = (settings.duplicate_policy as string) || "reject";
    const antiPassback = Number(settings.anti_passback_seconds) || 60;
    updatedDesign._gateTrackingConfig = {
      ...((existingDesign._gateTrackingConfig as Record<string, unknown>) || {}),
      ...settings,
      allowReEntry: reEntryPolicy === "allowed" || reEntryPolicy === "staff_override",
      duplicateEntryPolicy: duplicatePolicy,
      duplicateWindowSeconds: antiPassback,
    };
  } else if (featureKey === "session_attendance") {
    updatedDesign._sessionAttendanceConfig = {
      ...((existingDesign._sessionAttendanceConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "csv_management") {
    updatedDesign._csvManagementConfig = {
      ...((existingDesign._csvManagementConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "offline_scanning") {
    updatedDesign._offlineScanningConfig = {
      ...((existingDesign._offlineScanningConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "advanced_analytics") {
    updatedDesign._advancedAnalyticsConfig = {
      ...((existingDesign._advancedAnalyticsConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  } else if (featureKey === "group_entry") {
    updatedDesign._groupEntryConfig = {
      ...((existingDesign._groupEntryConfig as Record<string, unknown>) || {}),
      ...settings,
      allow_reset: settings.re_entry === "identity_verified",
      partial_entry: Boolean(settings.partial_entry !== false),
    };
  } else if (featureKey === "ticket_cancellation") {
    updatedDesign._cancellationConfig = {
      ...((existingDesign._cancellationConfig as Record<string, unknown>) || {}),
      ...settings,
    };
  }

  const { error: updateErr } = await db
    .from("events")
    .update({
      custom_pass_design: updatedDesign,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (updateErr) {
    return { success: false, error: `Failed to save configuration: ${updateErr.message}` };
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath(`/scan/${eventId}`);

  return {
    success: true,
    config: updatedFeatureConfig,
    settings: updatedUnified[featureKey],
  };
}

/**
 * Example protected mutation endpoint that enforces server-side feature enablement.
 */
export async function executeFeatureGuardedMutation(
  eventId: string,
  featureKey: FeatureFlagKey,
  mutationPayload: Record<string, unknown>
): Promise<{ success?: boolean; error?: string; result?: unknown }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const db = adminClient();
  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return { error: "Event not found." };
  }

  // 1. Enforce Server-Side Feature Gate (Reject mutations if feature is disabled)
  const guard = assertFeatureEnabled(event, featureKey);
  if (!guard.enabled) {
    return { error: guard.error };
  }

  // 2. Perform protected mutation logic
  return {
    success: true,
    result: {
      action: `Executed mutation for feature: ${featureKey}`,
      payload: mutationPayload,
      timestamp: new Date().toISOString(),
    },
  };
}
