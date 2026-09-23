import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/scan/manifest?eventId=[eventId]
 *
 * Downloads approved passes and gate configuration for local offline scanning.
 * Accessible to event organizers and authorized organization check-in staff.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  // Verify access permissions for event
  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 });
  }

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
    return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 });
  }

  // 1. Fetch gates
  const { data: gates } = await supabase
    .from("scanner_gates")
    .select("id, name, zone_id, zone:event_zones(name)")
    .eq("event_id", eventId)
    .order("position");

  // 2. Fetch ticket zone accesses
  const { data: zoneAccessRows } = await supabase
    .from("ticket_zone_access")
    .select("ticket_type_id, zone_id");

  const ticketZoneMap = new Map<string, string[]>();
  if (zoneAccessRows) {
    for (const r of zoneAccessRows) {
      if (r.ticket_type_id && r.zone_id) {
        const existing = ticketZoneMap.get(r.ticket_type_id) || [];
        existing.push(r.zone_id);
        ticketZoneMap.set(r.ticket_type_id, existing);
      }
    }
  }

  // 3. Fetch approved attendees and passes
  const { data: attendees } = await supabase
    .from("attendees")
    .select("id, name, email, pass_type, application_status, pass_status")
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  if (!attendees || attendees.length === 0) {
    return NextResponse.json({
      eventId,
      eventName: event.name,
      cachedAt: new Date().toISOString(),
      totalPasses: 0,
      passes: [],
      gates: gates ?? [],
    });
  }

  const attendeeIds = attendees.map((a) => a.id);
  const { data: passes } = await supabase
    .from("passes")
    .select("id, pass_token, pass_type, status, attendee_id, ticket_type_id")
    .eq("event_id", eventId)
    .in("attendee_id", attendeeIds);

  const passMap = new Map<string, NonNullable<typeof passes>[number]>();
  if (passes) {
    for (const p of passes) {
      passMap.set(p.attendee_id, p);
    }
  }

  // 4. Fetch existing check-ins to flag already checked-in attendees
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("pass_id, checked_in_at")
    .eq("event_id", eventId);

  const checkInMap = new Map<string, string>();
  if (checkIns) {
    for (const ci of checkIns) {
      checkInMap.set(ci.pass_id, ci.checked_in_at);
    }
  }

  // Construct compact manifest
  const manifestPasses = attendees
    .map((att) => {
      const p = passMap.get(att.id);
      if (!p) return null;

      const checkedInAt = checkInMap.get(p.id) || null;
      const isCheckedIn = p.status === "checked_in" || att.pass_status === "checked_in" || !!checkedInAt;
      const allowedZoneIds = p.ticket_type_id ? ticketZoneMap.get(p.ticket_type_id) ?? [] : [];

      return {
        passId: p.id,
        passToken: p.pass_token,
        attendeeId: att.id,
        name: att.name,
        email: att.email,
        passType: p.pass_type || att.pass_type,
        ticketTypeId: p.ticket_type_id || null,
        allowedZoneIds,
        checkedIn: isCheckedIn,
        checkedInAt: isCheckedIn ? checkedInAt : null,
      };
    })
    .filter(Boolean);

  return NextResponse.json({
    eventId,
    eventName: event.name,
    cachedAt: new Date().toISOString(),
    totalPasses: manifestPasses.length,
    passes: manifestPasses,
    gates: gates ?? [],
  });
}
