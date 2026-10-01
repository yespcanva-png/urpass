import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAttendeeScheduleConflict } from "@/lib/conference/conflict-detection";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const body = await req.json().catch(() => null);
  const { passToken, attendeeId, email } = body ?? {};

  // Fetch session
  const { data: session, error: sessionErr } = await supabase
    .from("event_sessions")
    .select("id, event_id, title, session_date, start_time, end_time, status")
    .eq("id", sessionId)
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  // Resolve attendee
  let attendeeRecord: any = null;
  if (passToken) {
    let cleanToken = passToken.trim();
    if (cleanToken.includes("/pass/")) {
      cleanToken = cleanToken.split("/pass/")[1].split("?")[0];
    }
    const { data: pass } = await supabase
      .from("passes")
      .select("attendee_id")
      .eq("pass_token", cleanToken)
      .eq("event_id", session.event_id)
      .maybeSingle();

    if (pass) {
      const { data: att } = await supabase
        .from("attendees")
        .select("id, name, email")
        .eq("id", pass.attendee_id)
        .single();
      attendeeRecord = att;
    }
  } else if (attendeeId) {
    const { data: att } = await supabase
      .from("attendees")
      .select("id, name, email")
      .eq("id", attendeeId)
      .eq("event_id", session.event_id)
      .maybeSingle();
    attendeeRecord = att;
  } else if (email) {
    const { data: att } = await supabase
      .from("attendees")
      .select("id, name, email")
      .eq("email", email.trim().toLowerCase())
      .eq("event_id", session.event_id)
      .maybeSingle();
    attendeeRecord = att;
  }

  if (!attendeeRecord) {
    return NextResponse.json(
      { error: "Attendee not found. Please register for the event first." },
      { status: 404 }
    );
  }

  // Check attendee conflicts in personal agenda
  const { data: currentAgenda } = await supabase
    .from("attendee_agenda")
    .select(`
      session_id,
      session:event_sessions (
        id,
        title,
        session_date,
        start_time,
        end_time
      )
    `)
    .eq("attendee_id", attendeeRecord.id);

  const existingAgendaSessions = (currentAgenda || [])
    .map((a: any) => a.session)
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
    existingAgendaSessions
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

  const { data: agendaEntry, error: insertErr } = await supabase
    .from("attendee_agenda")
    .upsert(
      {
        event_id: session.event_id,
        attendee_id: attendeeRecord.id,
        session_id: sessionId,
      },
      { onConflict: "attendee_id,session_id" }
    )
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({
    data: agendaEntry,
    message: "Added to My Agenda!",
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
      { error: "Attendee ID or pass token required." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("attendee_agenda")
    .delete()
    .eq("session_id", sessionId)
    .eq("attendee_id", targetAttendeeId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Removed from My Agenda." });
}
