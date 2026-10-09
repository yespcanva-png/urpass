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
      return { error: `Failed to persist feature settings: ${upsertErr.message}` };
    }

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
  } catch {
    // Keep the legacy mirror as a compatibility fallback in local/test environments.
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
 * Retrieves the complete feature flags state for an event.
 */
export async function getEventFeatureFlagsState(eventId: string): Promise<{
  error?: string;
  config?: EventFeaturesConfig;
  features?: Record<FeatureFlagKey, boolean>;
  usable?: Record<FeatureFlagKey, boolean>;
  platformAvailable?: Record<FeatureFlagKey, boolean>;
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
