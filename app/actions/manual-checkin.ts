"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function manualCheckIn(
  attendeeId: string,
  eventId: string,
  gateId?: string
): Promise<{ success?: boolean; alreadyCheckedIn?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify caller is event organizer or org member with check-in role
  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) return { error: "Event not found." };

  const isOrganizer = event.organizer_id === user.id;
  let hasOrgAccess = false;
  if (!isOrganizer && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return { error: "Not authorized to check in attendees for this event." };
  }

  // Fetch pass for attendee + event
  const { data: pass } = await supabase
    .from("passes")
    .select("id, status, pass_type")
    .eq("attendee_id", attendeeId)
    .eq("event_id", eventId)
    .single();

  if (!pass) return { error: "No pass found for this attendee." };

  if (pass.status === "checked_in") {
    return { alreadyCheckedIn: true };
  }

  // Insert check_in with method 'manual'
  const { error: ciError } = await supabase.from("check_ins").insert({
    pass_id: pass.id,
    event_id: eventId,
    attendee_id: attendeeId,
    checked_in_by: user.id,
    check_in_method: "manual",
    gate_id: gateId ?? null,
  });

  if (ciError) {
    // Unique constraint violation — already checked in concurrently
    if (ciError.code === "23505") {
      return { alreadyCheckedIn: true };
    }
    return { error: ciError.message };
  }

  // Mark pass as checked_in
  await supabase
    .from("passes")
    .update({ status: "checked_in" })
    .eq("id", pass.id);

  // Mark attendee as checked_in
  await supabase
    .from("attendees")
    .update({ pass_status: "checked_in" })
    .eq("id", attendeeId);

  revalidatePath(`/event/${eventId}/checkins`);
  return { success: true };
}
