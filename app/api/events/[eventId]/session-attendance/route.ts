import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = auth.supabase;

  // 1. Fetch Sessions with Room and Track
  const { data: sessionsRaw, error: sErr } = await supabase
    .from("event_sessions")
    .select(`
      id,
      title,
      description,
      session_type,
      session_date,
      start_time,
      end_time,
      capacity,
      registration_required,
      checkin_enabled,
      status,
      eligible_ticket_type_ids,
      room:event_rooms (id, name, capacity),
      track:event_tracks (id, name, colour)
    `)
    .eq("event_id", eventId)
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (sErr) {
    return NextResponse.json({ error: sErr.message }, { status: 500 });
  }

  const sessions = sessionsRaw || [];
  const sessionIds = sessions.map((s) => s.id);

  // 2. Fetch Check-ins, Reservations, and Attendees concurrently
  const [
    { data: checkinsRaw, error: cErr },
    { data: reservationsRaw, error: rErr },
    { data: approvedAttendees, error: aErr },
  ] = await Promise.all([
    supabase
      .from("session_checkins")
      .select(`
        id,
        session_id,
        attendee_id,
        checkin_time,
        checkout_time,
        admitted_guests,
        checkin_source,
        attendee:attendees (id, name, email, pass_type, ticket_type_id)
      `)
      .eq("event_id", eventId)
      .order("checkin_time", { ascending: false }),

    sessionIds.length > 0
      ? supabase
          .from("session_reservations")
          .select("id, session_id, attendee_id, status")
          .in("session_id", sessionIds)
          .in("status", ["reserved", "attended"])
      : Promise.resolve({ data: [], error: null }),

    supabase
      .from("attendees")
      .select("id, ticket_type_id, pass_type, application_status")
      .eq("event_id", eventId)
      .eq("application_status", "approved"),
  ]);

  if (cErr || rErr || aErr) {
    return NextResponse.json(
      { error: (cErr || rErr || aErr)?.message || "Failed to query attendance data" },
      { status: 500 }
    );
  }

  const checkins = checkinsRaw || [];
  const reservations = reservationsRaw || [];
  const attendeesList = approvedAttendees || [];
  const totalApproved = attendeesList.length;

  let totalSessionCheckins = 0;

  const sessionStats = sessions.map((s: any) => {
    const roomData = Array.isArray(s.room) ? s.room[0] : s.room;
    const trackData = Array.isArray(s.track) ? s.track[0] : s.track;

    const sCheckins = checkins.filter((c: any) => c.session_id === s.id);
    const checkedInCount = sCheckins.reduce(
      (sum: number, c: any) => sum + (c.admitted_guests || 1),
      0
    );
    totalSessionCheckins += checkedInCount;

    const sReservations = reservations.filter((r: any) => r.session_id === s.id);

    // Compute registered attendees count:
    // 1. If explicit reservations exist or registration is required, use valid reservation count
    // 2. If ticket tier restrictions exist, count approved attendees holding eligible ticket types
    // 3. Otherwise, all approved attendees are registered/eligible for this session
    let registeredCount = totalApproved;
    if (s.registration_required || sReservations.length > 0) {
      registeredCount = Math.max(sReservations.length, checkedInCount);
    } else if (
      Array.isArray(s.eligible_ticket_type_ids) &&
      s.eligible_ticket_type_ids.length > 0
    ) {
      const eligibleSet = new Set(s.eligible_ticket_type_ids);
      const eligibleAttendees = attendeesList.filter((a: any) =>
        eligibleSet.has(a.ticket_type_id)
      ).length;
      registeredCount = Math.max(eligibleAttendees, checkedInCount);
    } else {
      registeredCount = Math.max(totalApproved, checkedInCount);
    }

    const effectiveCapacity = s.capacity || roomData?.capacity || null;
    const turnoutRate =
      registeredCount > 0
        ? Math.min(100, Math.round((checkedInCount / registeredCount) * 100))
        : 0;

    const capacityUtilization =
      effectiveCapacity && effectiveCapacity > 0
        ? Math.min(100, Math.round((checkedInCount / effectiveCapacity) * 100))
        : null;

    const recentCheckins = sCheckins.slice(0, 15).map((c: any) => {
      const attendeeObj = Array.isArray(c.attendee) ? c.attendee[0] : c.attendee;
      return {
        id: c.id,
        attendeeId: c.attendee_id,
        attendeeName: attendeeObj?.name || "Unknown Attendee",
        attendeeEmail: attendeeObj?.email || "",
        passType: attendeeObj?.pass_type || "participant",
        checkinTime: c.checkin_time,
        checkoutTime: c.checkout_time,
        admittedGuests: c.admitted_guests || 1,
        source: c.checkin_source || "qr",
      };
    });

    return {
      id: s.id,
      title: s.title,
      description: s.description,
      sessionType: s.session_type || "presentation",
      sessionDate: s.session_date,
      startTime: s.start_time,
      endTime: s.end_time,
      status: s.status,
      roomName: roomData?.name || "Main Venue",
      trackName: trackData?.name || null,
      trackColor: trackData?.colour || null,
      capacity: effectiveCapacity,
      checkedInCount,
      registeredCount,
      turnoutRate,
      capacityUtilization,
      recentCheckins,
    };
  });

  const overallTurnoutRate =
    totalApproved > 0
      ? Math.min(100, Math.round((totalSessionCheckins / (totalApproved * (sessions.length || 1))) * 100))
      : 0;

  return NextResponse.json({
    success: true,
    data: {
      eventId,
      sessions: sessionStats,
      totalSessions: sessions.length,
      totalSessionCheckins,
      totalRegisteredAttendees: totalApproved,
      overallTurnoutRate,
    },
  });
}
