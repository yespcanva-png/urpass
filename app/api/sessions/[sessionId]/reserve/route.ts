import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAttendeeScheduleConflict } from "@/lib/conference/conflict-detection";
import type { EventSession } from "@/types/conference";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const { data: reservations, error } = await supabase
    .from("session_reservations")
    .select(`
      id,
      session_id,
      attendee_id,
      status,
      reserved_at,
      cancelled_at,
      attendee:attendees (
        id,
        name,
        email,
        phone,
        pass_type
      )
    `)
    .eq("session_id", sessionId)
    .order("reserved_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: reservations });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const body = await req.json().catch(() => null);
  const { passToken, attendeeId, email } = body ?? {};

  if (!passToken && !attendeeId && !email) {
    return NextResponse.json(
      { error: "Pass token, attendee ID, or email is required to reserve a session." },
      { status: 400 }
    );
  }

  // 1. Fetch Session details
  const { data: session, error: sessionErr } = await supabase
    .from("event_sessions")
    .select(`
      id,
      event_id,
      title,
      session_date,
      start_time,
      end_time,
      capacity,
      allow_waitlist,
      registration_required,
      status,
      room:event_rooms (capacity)
    `)
    .eq("id", sessionId)
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  if (session.status === "cancelled") {
    return NextResponse.json({ error: "This session has been cancelled." }, { status: 400 });
  }

  // 2. Identify Attendee & Pass
  let attendeeRecord: any = null;
  let passRecord: any = null;

  if (passToken) {
    // If token is a URL, strip to clean token
    let cleanToken = passToken.trim();
    if (cleanToken.includes("/pass/")) {
      cleanToken = cleanToken.split("/pass/")[1].split("?")[0];
    }

    const { data: pass } = await supabase
      .from("passes")
      .select("id, pass_token, attendee_id, event_id, status")
      .eq("pass_token", cleanToken)
      .eq("event_id", session.event_id)
      .maybeSingle();

    if (pass) {
      passRecord = pass;
      const { data: att } = await supabase
        .from("attendees")
        .select("id, name, email, phone, pass_type, application_status")
        .eq("id", pass.attendee_id)
        .single();
      attendeeRecord = att;
    }
  } else if (attendeeId) {
    const { data: att } = await supabase
      .from("attendees")
      .select("id, name, email, phone, pass_type, application_status")
      .eq("id", attendeeId)
      .eq("event_id", session.event_id)
      .maybeSingle();
    attendeeRecord = att;
  } else if (email) {
    const { data: att } = await supabase
      .from("attendees")
      .select("id, name, email, phone, pass_type, application_status")
      .eq("email", email.trim().toLowerCase())
      .eq("event_id", session.event_id)
      .maybeSingle();
    attendeeRecord = att;
  }

  if (!attendeeRecord) {
    return NextResponse.json(
      { error: "Valid attendee registration for this event was not found. Please register for the event first." },
      { status: 404 }
    );
  }

  if (attendeeRecord.application_status === "rejected") {
    return NextResponse.json(
      { error: "Your event registration was rejected. You cannot reserve sessions." },
      { status: 403 }
    );
  }

  // 3. Attendee Schedule Conflict Detection
  // Fetch existing reservations for this attendee in this event
  const { data: attendeeReservations } = await supabase
    .from("session_reservations")
    .select(`
      session_id,
      status,
      session:event_sessions (
        id,
        title,
        session_date,
        start_time,
        end_time
      )
    `)
    .eq("attendee_id", attendeeRecord.id)
    .in("status", ["reserved", "waitlisted"]);

  const reservedSessions = (attendeeReservations || [])
    .map((r: any) => r.session)
    .filter(Boolean) as Array<{
      id: string;
      title: string;
      session_date: string;
      start_time: string;
      end_time: string;
    }>;

  const conflict = checkAttendeeScheduleConflict(
    {
      id: session.id,
      title: session.title,
      session_date: session.session_date,
      start_time: session.start_time,
      end_time: session.end_time,
    },
    reservedSessions
  );

  if (conflict) {
    return NextResponse.json(
      {
        error: "Schedule Conflict",
        message: conflict.message,
        conflict,
      },
      { status: 409 }
    );
  }

  // 4. Session Capacity Check
  const roomData = Array.isArray(session.room) ? session.room[0] : (session.room as any);
  const effectiveCapacity =
    session.capacity !== null && session.capacity !== undefined
      ? session.capacity
      : roomData?.capacity || null;

  let reservationStatus = "reserved";

  if (effectiveCapacity !== null && effectiveCapacity > 0) {
    const { count: activeReservationsCount } = await supabase
      .from("session_reservations")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId)
      .eq("status", "reserved");

    if ((activeReservationsCount || 0) >= effectiveCapacity) {
      if (session.allow_waitlist) {
        reservationStatus = "waitlisted";
      } else {
        return NextResponse.json(
          { error: "SESSION FULL: This session has reached maximum capacity and does not accept waitlists." },
          { status: 400 }
        );
      }
    }
  }

  // 5. Upsert Reservation
  const { data: reservation, error: upsertErr } = await supabase
    .from("session_reservations")
    .upsert(
      {
        session_id: sessionId,
        attendee_id: attendeeRecord.id,
        registration_id: passRecord?.id || attendeeRecord.id,
        status: reservationStatus,
        reserved_at: new Date().toISOString(),
        cancelled_at: null,
      },
      { onConflict: "session_id,attendee_id" }
    )
    .select()
    .single();

  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  // Also add to personal agenda automatically when reserved
  await supabase
    .from("attendee_agenda")
    .upsert(
      {
        event_id: session.event_id,
        attendee_id: attendeeRecord.id,
        session_id: sessionId,
      },
      { onConflict: "attendee_id,session_id" }
    );

  return NextResponse.json({
    data: reservation,
    status: reservationStatus,
    message:
      reservationStatus === "waitlisted"
        ? "Session is full. You have been added to the waitlist."
        : "Seat reserved successfully!",
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const body = await req.json().catch(() => null);
  const { attendeeId, passToken } = body ?? {};

  let targetAttendeeId = attendeeId;

  if (!targetAttendeeId && passToken) {
    let cleanToken = passToken.trim();
    if (cleanToken.includes("/pass/")) {
      cleanToken = cleanToken.split("/pass/")[1].split("?")[0];
    }
    const { data: pass } = await supabase
      .from("passes")
      .select("attendee_id")
      .eq("pass_token", cleanToken)
      .maybeSingle();
    targetAttendeeId = pass?.attendee_id;
  }

  if (!targetAttendeeId) {
    return NextResponse.json(
      { error: "Attendee ID or pass token is required to cancel reservation." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("session_reservations")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId)
    .eq("attendee_id", targetAttendeeId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Reservation cancelled." });
}
