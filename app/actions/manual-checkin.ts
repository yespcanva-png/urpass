"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function manualCheckIn(
  attendeeId: string,
  eventId: string,
  gateId?: string
): Promise<{ success?: boolean; alreadyCheckedIn?: boolean; error?: string; status?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify caller is event organizer or org member with check-in role
  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id, attendee_limit")
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

  // Enforce Event Capacity Limit
  if (event.attendee_limit && event.attendee_limit > 0) {
    const { count: currentCheckins } = await supabase
      .from("check_ins")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId);

    if ((currentCheckins ?? 0) >= event.attendee_limit) {
      return {
        error: "Event capacity reached",
        status: "EVENT_CAPACITY_REACHED",
      };
    }
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

  // Mark attendee as checked_in with scan count & history
  const nowIso = new Date().toISOString();
  const { data: currentAtt } = await supabase
    .from("attendees")
    .select("custom_responses")
    .eq("id", attendeeId)
    .single();

  const cr = (currentAtt?.custom_responses as Record<string, any>) || {};
  const history = Array.isArray(cr.scan_history) ? [...cr.scan_history] : [];
  history.push({
    scan_number: history.length + 1,
    scanned_at: nowIso,
    gate_id: gateId ?? null,
    gate_name: "Manual Check-in Desk",
    scanned_by: user.id,
    method: "manual",
  });

  await supabase
    .from("attendees")
    .update({
      pass_status: "checked_in",
      last_gate_scanned_at: nowIso,
      custom_responses: {
        ...cr,
        scan_count: history.length,
        first_scanned_at: cr.first_scanned_at || nowIso,
        last_scanned_at: nowIso,
        scan_history: history,
      },
    })
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

export async function exportAttendeeCheckinReportCSV(
  eventId: string
): Promise<{ csv?: string; error?: string; totalAttendees?: number }> {
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
    return { error: "Not authorized to export report for this event." };
  }

  // Fetch all approved attendees with their custom_responses and checkin history
  const { data: attendees } = await supabase
    .from("attendees")
    .select("id, name, email, phone, pass_type, pass_status, application_status, custom_responses, last_gate_scanned_at, created_at")
    .eq("event_id", eventId)
    .eq("application_status", "approved")
    .order("name", { ascending: true });

  if (!attendees || attendees.length === 0) {
    return { csv: "", totalAttendees: 0 };
  }

  // Fetch all check_ins records for gate & timestamp mapping
  const { data: checkins } = await supabase
    .from("check_ins")
    .select("id, attendee_id, checked_in_at, check_in_method, gate:scanner_gates(name)")
    .eq("event_id", eventId)
    .order("checked_in_at", { ascending: true });

  const checkinsByAttendee: Record<string, Array<{ checked_in_at: string; method?: string; gate_name?: string }>> = {};
  for (const ci of checkins || []) {
    if (!checkinsByAttendee[ci.attendee_id]) checkinsByAttendee[ci.attendee_id] = [];
    checkinsByAttendee[ci.attendee_id].push({
      checked_in_at: ci.checked_in_at,
      method: ci.check_in_method || "qr",
      gate_name: (ci.gate as unknown as { name?: string } | null)?.name || "Main Gate",
    });
  }

  const headers = [
    "Attendee Name",
    "Email",
    "Phone",
    "Pass Type",
    "Check-in Status",
    "Total Times Checked In",
    "First Check-in Timestamp",
    "First Gate",
    "Latest Check-in Timestamp",
    "Latest Gate",
    "Check-in Method",
    "Complete Check-in Timestamps Log",
    "Registration Date",
  ];

  const rows = attendees.map((a) => {
    const cr = (a.custom_responses as Record<string, any>) || {};
    const attCiList = checkinsByAttendee[a.id] || [];

    const history: Array<{
      scan_number?: number;
      scanned_at: string;
      gate_name?: string | null;
      method?: string;
    }> = Array.isArray(cr.scan_history) && cr.scan_history.length > 0
      ? cr.scan_history
      : attCiList.map((ci, idx) => ({
          scan_number: idx + 1,
          scanned_at: ci.checked_in_at,
          gate_name: ci.gate_name || "Main Gate",
          method: ci.method || "qr",
        }));

    const isCheckedIn = a.pass_status === "checked_in" || history.length > 0 || attCiList.length > 0;
    const totalScans = Number(cr.scan_count || history.length || (isCheckedIn ? 1 : 0));

    const firstTimeIso = cr.first_scanned_at || history[0]?.scanned_at || attCiList[0]?.checked_in_at || null;
    const lastTimeIso = cr.last_scanned_at || history[history.length - 1]?.scanned_at || attCiList[attCiList.length - 1]?.checked_in_at || a.last_gate_scanned_at || null;

    const firstTimeFormatted = firstTimeIso ? new Date(firstTimeIso).toLocaleString("en-IN") : "—";
    const lastTimeFormatted = lastTimeIso ? new Date(lastTimeIso).toLocaleString("en-IN") : "—";

    const firstGate = history[0]?.gate_name || attCiList[0]?.gate_name || (isCheckedIn ? "Main Gate" : "—");
    const lastGate = history[history.length - 1]?.gate_name || attCiList[attCiList.length - 1]?.gate_name || (isCheckedIn ? "Main Gate" : "—");

    const method = history[history.length - 1]?.method || attCiList[attCiList.length - 1]?.method || (isCheckedIn ? "qr" : "—");

    const detailedTimeline = history.length > 0
      ? history
          .map((h, idx) => {
            const num = h.scan_number || idx + 1;
            const timeStr = h.scanned_at ? new Date(h.scanned_at).toLocaleString("en-IN") : "";
            const gateStr = h.gate_name ? ` at ${h.gate_name}` : "";
            const methodStr = h.method ? ` (${h.method})` : "";
            return `[Scan #${num}: ${timeStr}${gateStr}${methodStr}]`;
          })
          .join(" | ")
      : isCheckedIn && firstTimeIso
      ? `[Scan #1: ${new Date(firstTimeIso).toLocaleString("en-IN")} at ${firstGate} (${method})]`
      : "Not checked in";

    const regDate = a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN") : "—";

    return [
      a.name || "Unknown",
      a.email || "",
      a.phone || "",
      a.pass_type || "General",
      isCheckedIn ? "Checked In" : "Not Arrived",
      totalScans,
      firstTimeFormatted,
      firstGate,
      lastTimeFormatted,
      lastGate,
      method,
      detailedTimeline,
      regDate,
    ];
  });

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return { csv, totalAttendees: attendees.length };
}

