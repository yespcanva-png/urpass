import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import {
  checkRoomConflict,
  checkSpeakerConflicts,
  timeStringToMinutes,
} from "@/lib/conference/conflict-detection";
import type { EventSession } from "@/types/conference";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; sessionId: string }> }
) {
  const { eventId, sessionId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data: session, error } = await auth.supabase
    .from("event_sessions")
    .select(`
      *,
      track:event_tracks (*),
      room:event_rooms (*),
      speakers:session_speakers (
        id,
        role,
        sort_order,
        speaker:event_speakers (*)
      ),
      reservations:session_reservations (
        id,
        status,
        reserved_at,
        attendee:attendees (
          id,
          name,
          email,
          phone,
          pass_type
        )
      ),
      checkins:session_checkins (
        id,
        checkin_time,
        checkout_time,
        checkin_source,
        attendee:attendees (
          id,
          name,
          email
        )
      )
    `)
    .eq("id", sessionId)
    .eq("event_id", eventId)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ data: session });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; sessionId: string }> }
) {
  const { eventId, sessionId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  // Fetch current session
  const { data: currentSession, error: fetchErr } = await auth.supabase
    .from("event_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("event_id", eventId)
    .single();

  if (fetchErr || !currentSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const session_date = body.session_date ?? currentSession.session_date;
  const start_time = body.start_time ?? currentSession.start_time;
  const end_time = body.end_time ?? currentSession.end_time;
  const room_id = body.room_id !== undefined ? body.room_id : currentSession.room_id;

  // Validation: end_time must be after start_time
  const startMins = timeStringToMinutes(start_time);
  const endMins = timeStringToMinutes(end_time);
  if (endMins <= startMins) {
    return NextResponse.json(
      { error: "Session end time must be after start time." },
      { status: 400 }
    );
  }

  // Conflict detection if time/room/speakers changed
  if (!body.override_conflicts) {
    const { data: existingSessionsRaw } = await auth.supabase
      .from("event_sessions")
      .select(`
        id,
        title,
        room_id,
        session_date,
        start_time,
        end_time,
        status,
        room:event_rooms(id, name),
        speakers:session_speakers(
          speaker_id,
          speaker:event_speakers(id, name)
        )
      `)
      .eq("event_id", eventId)
      .eq("session_date", session_date);

    const existingSessions = (existingSessionsRaw || []) as unknown as EventSession[];

    if (room_id) {
      const roomConflict = checkRoomConflict(
        { id: sessionId, room_id, session_date, start_time, end_time },
        existingSessions
      );
      if (roomConflict) {
        return NextResponse.json(
          {
            error: roomConflict.message,
            conflict: roomConflict,
            conflictType: "ROOM_CONFLICT",
          },
          { status: 409 }
        );
      }
    }

    if (Array.isArray(body.speakers)) {
      const speakerIds = body.speakers.map((s: any) => s.speakerId).filter(Boolean);
      if (speakerIds.length > 0) {
        const speakerConflicts = checkSpeakerConflicts(
          { id: sessionId, session_date, start_time, end_time },
          speakerIds,
          existingSessions
        );
        if (speakerConflicts.length > 0) {
          return NextResponse.json(
            {
              error: speakerConflicts[0].message,
              conflicts: speakerConflicts,
              conflictType: "SPEAKER_CONFLICT",
            },
            { status: 409 }
          );
        }
      }
    }
  }

  // Build updates
  const updates: Record<string, any> = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.track_id !== undefined) updates.track_id = body.track_id || null;
  if (body.room_id !== undefined) updates.room_id = body.room_id || null;
  if (body.session_type !== undefined) updates.session_type = body.session_type;
  if (body.session_date !== undefined) updates.session_date = body.session_date;
  if (body.start_time !== undefined) updates.start_time = body.start_time;
  if (body.end_time !== undefined) updates.end_time = body.end_time;
  if (body.capacity !== undefined) updates.capacity = body.capacity ? Number(body.capacity) : null;
  if (body.allow_waitlist !== undefined) updates.allow_waitlist = Boolean(body.allow_waitlist);
  if (body.registration_required !== undefined) updates.registration_required = Boolean(body.registration_required);
  if (body.checkin_enabled !== undefined) updates.checkin_enabled = Boolean(body.checkin_enabled);
  if (body.require_checkout !== undefined) updates.require_checkout = Boolean(body.require_checkout);
  if (body.visibility !== undefined) updates.visibility = body.visibility;
  if (body.status !== undefined) updates.status = body.status;
  if (body.description !== undefined) updates.description = body.description?.trim() || null;
  if (body.cover_image !== undefined) updates.cover_image = body.cover_image?.trim() || null;
  if (body.tags !== undefined) updates.tags = Array.isArray(body.tags) ? body.tags : [];
  if (body.external_streaming_url !== undefined) updates.external_streaming_url = body.external_streaming_url?.trim() || null;
  if (body.meeting_url !== undefined) updates.meeting_url = body.meeting_url?.trim() || null;
  if (body.resources !== undefined) updates.resources = Array.isArray(body.resources) ? body.resources : [];

  const { data: updatedSession, error: updateErr } = await auth.supabase
    .from("event_sessions")
    .update(updates)
    .eq("id", sessionId)
    .eq("event_id", eventId)
    .select(`
      *,
      track:event_tracks (*),
      room:event_rooms (*)
    `)
    .single();

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Update speakers if supplied
  if (Array.isArray(body.speakers)) {
    await auth.supabase.from("session_speakers").delete().eq("session_id", sessionId);

    if (body.speakers.length > 0) {
      const speakerInserts = body.speakers.map((sp: any, idx: number) => ({
        session_id: sessionId,
        speaker_id: sp.speakerId,
        role: sp.role || "speaker",
        sort_order: typeof sp.sortOrder === "number" ? sp.sortOrder : idx,
      }));
      await auth.supabase.from("session_speakers").insert(speakerInserts);
    }
  }

  return NextResponse.json({ data: updatedSession });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; sessionId: string }> }
) {
  const { eventId, sessionId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { error } = await auth.supabase
    .from("event_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("event_id", eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
