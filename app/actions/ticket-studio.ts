"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserPlan } from "@/lib/plan";
import type { StudioDesign } from "@/lib/studio/types";
import { validateStudioDesign } from "@/lib/studio/resolver";
import { DUMMY_ATTENDEES } from "@/lib/studio/dummy-attendees";

export type ActionResult<T = unknown> = {
  error?: string;
  success?: boolean;
  data?: T;
};

/**
 * Saves or publishes a visual StudioDesign for an event or profile default.
 */
export async function saveStudioDesign(
  eventId: string | null,
  design: StudioDesign,
  publish: boolean = false
): Promise<ActionResult<StudioDesign>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userPlan = await getUserPlan(supabase, user.id);
  const userCanDesign = userPlan.canUse("custom_pass_design");

  if (!userCanDesign && !eventId) {
    return {
      error: "Ticket Studio is exclusive to Pro and higher tier plans.",
    };
  }

  // QR Safety & Canvas Validation
  const validation = validateStudioDesign(design);
  if (publish && !validation.valid) {
    return {
      error: `Cannot publish pass design: ${validation.errors.join("; ")}`,
    };
  }

  const updatedDesign: StudioDesign = {
    ...design,
    version: 2,
    isPublished: publish,
    updatedAt: new Date().toISOString(),
  };

  if (eventId) {
    // Verify event ownership or organizer permissions
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, organizer_id")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return { error: "Event not found or access denied." };
    }

    if (!userCanDesign && event.organizer_id) {
      const orgPlan = await getUserPlan(supabase, event.organizer_id);
      if (!orgPlan.canUse("custom_pass_design")) {
        return {
          error: "Ticket Studio is exclusive to Pro and higher tier plans.",
        };
      }
    }

    if (event.organizer_id !== user.id) {
      const { data: orgMember } = await supabase
        .from("organization_members")
        .select("role")
        .eq("user_id", user.id)
        .eq("status", "active")
        .in("role", ["owner", "admin"])
        .maybeSingle();

      if (!orgMember) {
        return { error: "You do not have permission to edit this event." };
      }
    }

    const { error: updateErr } = await supabase
      .from("events")
      .update({
        custom_pass_design: updatedDesign,
      })
      .eq("id", eventId);

    if (updateErr) return { error: updateErr.message };

    revalidatePath(`/studio/${eventId}`);
    revalidatePath(`/event/${eventId}/pass-design`);
    revalidatePath(`/event/${eventId}`);
    revalidatePath("/pass/[passId]", "page");
  } else {
    // Save to organizer profile
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        custom_pass_design: updatedDesign,
      })
      .eq("user_id", user.id);

    if (profileErr) return { error: profileErr.message };

    revalidatePath("/studio");
    revalidatePath("/dashboard/ticket-design");
    revalidatePath("/dashboard/branding");
    revalidatePath("/pass/[passId]", "page");
  }

  return { success: true, data: updatedDesign };
}

/**
 * Fetches distinct ticket types for an event to support per-ticket-type styling.
 */
export async function getEventTicketTypes(eventId: string): Promise<Array<{ id: string; name: string }>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ticket_types")
    .select("id, name")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  return data || [];
}

/**
 * Generates an actual test pass payload with realistic attendee attributes.
 */
export async function generateTestPassAction(
  eventId: string | null,
  attendeeId: string = "att-standard"
): Promise<{
  passToken: string;
  attendee: (typeof DUMMY_ATTENDEES)[0];
  verifiedAt: string;
}> {
  const attendee = DUMMY_ATTENDEES.find((a) => a.id === attendeeId) || DUMMY_ATTENDEES[0];
  const passToken = `TEST-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  return {
    passToken,
    attendee,
    verifiedAt: new Date().toISOString(),
  };
}
