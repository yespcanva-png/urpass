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
      .in("role", ["owner", "admin", "event_manager", "gate_manager", "checkin_staff"])
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

export async function undoCheckIn(
  attendeeId: string,
  eventId: string
): Promise<{ success?: boolean; error?: string }> {
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
      .in("role", ["owner", "admin", "event_manager", "gate_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return { error: "Not authorized to reset check-in for this event." };
  }

  // Fetch pass for attendee + event
  const { data: pass } = await supabase
    .from("passes")
    .select("id, status")
    .eq("attendee_id", attendeeId)
    .eq("event_id", eventId)
    .single();

  if (!pass) return { error: "No pass found for this attendee." };

  // Delete check_in records for this pass/event
  await supabase
    .from("check_ins")
    .delete()
    .eq("pass_id", pass.id)
    .eq("event_id", eventId);

  await supabase
    .from("check_ins")
    .delete()
    .eq("attendee_id", attendeeId)
    .eq("event_id", eventId);

  // Revert pass status to generated
  await supabase
    .from("passes")
    .update({ status: "generated" })
    .eq("id", pass.id);

  // Revert attendee pass_status to generated
  await supabase
    .from("attendees")
    .update({ pass_status: "generated" })
    .eq("id", attendeeId);

  revalidatePath(`/event/${eventId}/checkins`);
  revalidatePath(`/event/${eventId}/attendees`);
  revalidatePath(`/scan/${eventId}`);
  return { success: true };
}

export async function undoCheckInByToken(
  passToken: string,
  eventId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
      .in("role", ["owner", "admin", "event_manager", "gate_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return { error: "Not authorized to reset check-in for this event." };
  }

  const { data: pass } = await supabase
    .from("passes")
    .select("id, attendee_id")
    .eq("pass_token", passToken.trim())
    .eq("event_id", eventId)
    .single();

  if (!pass) return { error: "Pass not found." };

  return undoCheckIn(pass.attendee_id, eventId);
}

export async function exportCheckinsCSV(
  eventId: string
): Promise<{ csv?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id, name")
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
      .in("role", ["owner", "admin", "event_manager", "gate_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return { error: "Not authorized to export check-ins for this event." };
  }

  const { data: checkins } = await supabase
    .from("check_ins")
    .select(`
      id,
      checked_in_at,
      check_in_method,
      gate:scanner_gates(name),
      attendee:attendees(name, email, phone, pass_type)
    `)
    .eq("event_id", eventId)
    .order("checked_in_at", { ascending: false });

  if (!checkins || checkins.length === 0) {
    return { csv: "" };
  }

  const headers = [
    "Attendee Name",
    "Email",
    "Phone",
    "Pass Type",
    "Checked In At",
    "Gate",
    "Method",
  ];

  const rows = checkins.map((c) => {
    const att = (c as unknown as { attendee?: { name?: string; email?: string; phone?: string; pass_type?: string } | null }).attendee;
    const gateObj = (c as unknown as { gate?: { name?: string } | null }).gate;

    const checkedInAt = c.checked_in_at
      ? new Date(c.checked_in_at).toLocaleString("en-IN")
      : "";

    return [
      att?.name ?? "Unknown",
      att?.email ?? "",
      att?.phone ?? "",
      att?.pass_type ?? "General",
      checkedInAt,
      gateObj?.name ?? "Main Entrance",
      c.check_in_method ?? "qr",
    ];
  });

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return { csv };
}
