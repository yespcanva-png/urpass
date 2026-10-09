"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getUserPlan } from "@/lib/plan";
import {
  type FeatureFlagKey,
  type EventFeaturesConfig,
  FEATURE_FLAG_DEFINITIONS,
  getEventFeaturesConfig,
  isFeatureEnabled,
  validateFeatureEntitlement,
  assertFeatureEnabled,
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
  featureKey?: FeatureFlagKey;
  enabled?: boolean;
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  // 1. Fetch Event with Admin Client to verify permissions safely
  const db = adminClient();
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return { error: "Event not found." };
  }

  // 2. Multi-Tenant Authorization Check (Organizer A cannot alter Organizer B's features)
  let isAuthorized = event.organizer_id === user.id;

  if (!isAuthorized && event.organization_id) {
    const { data: member } = await db
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (member && (member.role === "owner" || member.role === "admin" || member.role === "event_manager")) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
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
  const currentConfig = getEventFeaturesConfig(event);

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

  const nextVersion = currentConfig.version + 1;
  const now = new Date().toISOString();

  const nextConfig: EventFeaturesConfig = {
    features: updatedFeatures,
    version: nextVersion,
    updatedAt: now,
    updatedBy: user.id,
  };

  const existingDesign = (event.custom_pass_design && typeof event.custom_pass_design === "object")
    ? event.custom_pass_design
    : {};

  const updatedDesign = {
    ...existingDesign,
    _featureFlags: nextConfig,
  };

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
}> {
  const db = adminClient();
  const { data: event, error } = await db
    .from("events")
    .select("id, organizer_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (error || !event) {
    return { error: "Event not found." };
  }

  const config = getEventFeaturesConfig(event);
  const resolvedFeatures = Object.keys(FEATURE_FLAG_DEFINITIONS).reduce<Record<FeatureFlagKey, boolean>>(
    (acc, key) => {
      const flagKey = key as FeatureFlagKey;
      acc[flagKey] = isFeatureEnabled(event, flagKey);
      return acc;
    },
    {} as Record<FeatureFlagKey, boolean>
  );

  return {
    config,
    features: resolvedFeatures,
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
