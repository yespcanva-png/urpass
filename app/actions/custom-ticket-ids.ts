"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CustomTicketIdConfig, ContinuationStats } from "@/types/custom-ticket-id";
import {
  DEFAULT_TICKET_ID_CONFIG,
  formatCustomTicketId,
  generateContinuationBatch,
  resolveNextTicketSequence,
  sanitizePrefix,
} from "@/lib/tickets/custom-id";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyOrganizer(supabase: any, user: { id: string }, eventId: string) {
  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .single();

  if (!event) return null;
  if (event.organizer_id === user.id) return event;

  if (event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();

    if (member) return event;
  }

  return null;
}

/**
 * Retrieves the event's custom ticket ID configuration and current continuation statistics.
 */
export async function getEventTicketIdConfig(eventId: string): Promise<{
  config: CustomTicketIdConfig;
  stats: ContinuationStats;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyOrganizer(supabase, user, eventId);
  if (!event) {
    return {
      config: DEFAULT_TICKET_ID_CONFIG,
      stats: {
        enabled: false,
        prefix: "URP-",
        startNumber: 1,
        digitPadding: 4,
        continuationOffset: 0,
        totalGenerated: 0,
        nextSequenceNumber: 1,
        nextTicketIdPreview: "URP-0001",
        sampleBatch: ["URP-0001", "URP-0002", "URP-0003"],
      },
      error: "Event not found or unauthorized.",
    };
  }

  const existingConfig: CustomTicketIdConfig =
    event.custom_pass_design?.ticketIdConfig || DEFAULT_TICKET_ID_CONFIG;

  const { nextSequence, customTicketId } = await resolveNextTicketSequence(
    supabase,
    eventId,
    existingConfig
  );

  const sampleBatch = generateContinuationBatch(existingConfig, nextSequence, 3);

  const stats: ContinuationStats = {
    enabled: Boolean(existingConfig.enabled),
    prefix: existingConfig.prefix || "URP-",
    startNumber: existingConfig.startNumber || 1,
    digitPadding: existingConfig.digitPadding || 4,
    continuationOffset: existingConfig.continuationOffset || 0,
    totalGenerated: Math.max(0, nextSequence - (existingConfig.startNumber || 1) - (existingConfig.continuationOffset || 0)),
    nextSequenceNumber: nextSequence,
    nextTicketIdPreview: customTicketId,
    sampleBatch,
  };

  return { config: existingConfig, stats };
}

/**
 * Updates the custom ticket ID and continuation configuration for an event.
 */
export async function updateEventTicketIdConfig(
  eventId: string,
  newConfig: Partial<CustomTicketIdConfig>
): Promise<{ success: boolean; config?: CustomTicketIdConfig; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyOrganizer(supabase, user, eventId);
  if (!event) {
    return { success: false, error: "Event not found or unauthorized." };
  }

  const sanitized: CustomTicketIdConfig = {
    enabled: Boolean(newConfig.enabled),
    prefix: sanitizePrefix(newConfig.prefix || "URP-"),
    suffix: (newConfig.suffix || "").trim().toUpperCase(),
    digitPadding: Math.max(1, Math.min(8, Number(newConfig.digitPadding) || 4)),
    startNumber: Math.max(1, Number(newConfig.startNumber) || 1),
    continuationOffset: Math.max(0, Number(newConfig.continuationOffset) || 0),
    includeTierCode: Boolean(newConfig.includeTierCode),
    pattern: newConfig.pattern ? String(newConfig.pattern).trim() : undefined,
  };

  const updatedDesign = {
    ...(event.custom_pass_design || {}),
    ticketIdConfig: sanitized,
  };

  const { error } = await supabase
    .from("events")
    .update({ custom_pass_design: updatedDesign })
    .eq("id", eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/event/${eventId}/tickets`);
  revalidatePath(`/event/${eventId}/settings`);
  return { success: true, config: sanitized };
}

/**
 * Syncs / sets the continuation offset for resuming sequence numbering.
 * E.g., setting offset to 500 when resuming after 500 offline tickets.
 */
export async function syncEventContinuationOffset(
  eventId: string,
  newOffset: number
): Promise<{ success: boolean; nextSequence?: number; nextTicketId?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyOrganizer(supabase, user, eventId);
  if (!event) {
    return { success: false, error: "Event not found or unauthorized." };
  }

  const existingConfig: CustomTicketIdConfig =
    event.custom_pass_design?.ticketIdConfig || DEFAULT_TICKET_ID_CONFIG;

  const updatedConfig: CustomTicketIdConfig = {
    ...existingConfig,
    continuationOffset: Math.max(0, Math.floor(newOffset)),
  };

  const updatedDesign = {
    ...(event.custom_pass_design || {}),
    ticketIdConfig: updatedConfig,
  };

  const { error } = await supabase
    .from("events")
    .update({ custom_pass_design: updatedDesign })
    .eq("id", eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  const { nextSequence, customTicketId } = await resolveNextTicketSequence(
    supabase,
    eventId,
    updatedConfig
  );

  revalidatePath(`/event/${eventId}/tickets`);
  revalidatePath(`/event/${eventId}/settings`);
  return { success: true, nextSequence, nextTicketId: customTicketId };
}
