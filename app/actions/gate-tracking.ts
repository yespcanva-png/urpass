"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  type GateScanRequest,
  type GateScanResult,
  type GateTrackingConfig,
  type VenuePresenceSummary,
  getGateTrackingConfig,
  processGateScan,
  computeVenuePresenceSummary,
} from "@/lib/gate-tracking";
import { updateEventFeatureFlag } from "@/app/actions/event-features";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Server action to process a gate scan operation.
 */
export async function recordGateScanAction(
  request: GateScanRequest
): Promise<GateScanResult> {
  const db = adminClient();

  // 1. Fetch Event
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, custom_pass_design")
    .eq("id", request.eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      status: "INVALID_CREDENTIAL",
      operationMode: request.operationMode,
      presenceState: "OUTSIDE",
      serverTimestamp: new Date().toISOString(),
      scanEventId: "unknown",
      error: "EVENT_NOT_FOUND",
      message: "Event not found.",
    };
  }

  // 2. Fetch Pass & Attendee
  const { data: pass } = await db
    .from("passes")
    .select("id, pass_token, status, attendee_id, event_id, pass_type")
    .eq("pass_token", request.credentialToken.trim())
    .maybeSingle();

  let attendee = null;
  if (pass) {
    const { data: att } = await db
      .from("attendees")
      .select("id, name, email, phone, pass_status, custom_responses")
      .eq("id", pass.attendee_id)
      .maybeSingle();
    attendee = att;
  }

  // 3. Current Presence State
  const currentPresence =
    attendee?.pass_status === "checked_in" ? "INSIDE" : "OUTSIDE";

  const scanOutcome = processGateScan({
    event,
    request,
    attendee: attendee
      ? {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          ticketTier: pass?.pass_type,
          pass_status: attendee.pass_status,
        }
      : null,
    passRecord: pass,
    currentPresence,
  });

  // 4. Update Database on Success
  if (scanOutcome.result.success && attendee) {
    const nextPassStatus =
      scanOutcome.nextPresence === "INSIDE" ? "checked_in" : "approved";

    try {
      await db
        .from("attendees")
        .update({ pass_status: nextPassStatus, updated_at: new Date().toISOString() })
        .eq("id", attendee.id);

      await db
        .from("passes")
        .update({ status: nextPassStatus })
        .eq("id", pass!.id);

      if (scanOutcome.newScanRecord) {
        await db.from("check_ins").insert({
          pass_id: pass!.id,
          event_id: request.eventId,
          attendee_id: attendee.id,
          checked_in_by: request.operatorId,
          check_in_method: request.operationMode,
          gate_id: request.gateId,
        });
      }
    } catch {
      // Mock / fallback
    }
  }

  return scanOutcome.result;
}

/**
 * Retrieves the event gate tracking configuration and venue summary.
 */
export async function getEventGateTrackingConfigAction(
  eventId: string
): Promise<{
  config: GateTrackingConfig;
  summary?: VenuePresenceSummary;
  error?: string;
}> {
  const db = adminClient();
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      config: getGateTrackingConfig(null),
      error: "EVENT_NOT_FOUND",
    };
  }

  const config = getGateTrackingConfig(event);
  return { config };
}

/**
 * Updates event gate tracking configuration (gates, zones, policies, staff permissions).
 */
export async function updateEventGateTrackingConfigAction({
  eventId,
  config,
}: {
  eventId: string;
  config: Partial<GateTrackingConfig>;
}): Promise<{ success: boolean; config?: GateTrackingConfig; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const db = adminClient();
  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (!event || event.organizer_id !== user.id) {
    return { success: false, error: "Unauthorized to update gate tracking configuration." };
  }

  if (typeof config.enabled === "boolean") {
    await updateEventFeatureFlag(eventId, "advanced_entry_tracking", config.enabled);
  }

  const existingDesign =
    event.custom_pass_design && typeof event.custom_pass_design === "object"
      ? event.custom_pass_design
      : {};

  const currentConfig = getGateTrackingConfig(event);
  const updatedConfig: GateTrackingConfig = {
    ...currentConfig,
    ...config,
  };

  const updatedDesign = {
    ...existingDesign,
    _gateTrackingConfig: updatedConfig,
  };

  const { error } = await db
    .from("events")
    .update({
      custom_pass_design: updatedDesign,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath(`/event/${eventId}/checkins`);
  return { success: true, config: updatedConfig };
}
