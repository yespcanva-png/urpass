import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import {
  checkRoomConflict,
  checkSpeakerConflicts,
  timeStringToMinutes,
} from "@/lib/conference/conflict-detection";
import { slugify } from "@/lib/conference/helpers";
import type { EventSession } from "@/types/conference";

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

  // Fetch sessions with track, room, and speakers
  const { data: sessions, error } = await auth.supabase
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
      reservations:session_reservations(id, status),
      checkins:session_checkins(id)
    `)
    .eq("event_id", eventId)
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map counts
  const mappedSessions = (sessions || []).map((s: any) => {
    const reservation_count = (s.reservations || []).filter(
      (r: any) => r.status === "reserved" || r.status === "attended"
    ).length;
    const checked_in_count = (s.checkins || []).length;
    const { reservations, checkins, ...rest } = s;
    return {
      ...rest,
      reservation_count,
      checked_in_count,
    };
  });

  return NextResponse.json({ data: mappedSessions });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.title?.trim() || !body.session_date || !body.start_time || !body.end_time) {
    return NextResponse.json(
      { error: "Title, session date, start time, and end time are required." },
      { status: 400 }
    );
  }

  const {
    title,
    track_id,
    room_id,
    session_type = "presentation",
    session_date,
    start_time,
    end_time,
    capacity,
    allow_waitlist = true,
    registration_required = false,
    checkin_enabled = true,
    require_checkout = false,
    visibility = "public",
    status = "published",
    description,
    cover_image,
    tags,
    external_streaming_url,
    meeting_url,
    resources,
    speakers = [], // Array<{ speakerId: string; role?: string; sortOrder?: number }>
    override_conflicts = false,
  } = body;

  // Validation: end_time must be after start_time
  const startMins = timeStringToMinutes(start_time);
  const endMins = timeStringToMinutes(end_time);
  if (endMins <= startMins) {
    return NextResponse.json(
      { error: "Session end time must be after start time." },
      { status: 400 }
    );
  }

  // Fetch existing sessions for conflict detection
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

  // Check room conflict
  if (room_id) {
    const roomConflict = checkRoomConflict(
      { room_id, session_date, start_time, end_time },
      existingSessions
    );
    if (roomConflict && !override_conflicts) {
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

  // Check speaker conflicts
  const speakerIds = speakers.map((s: any) => s.speakerId).filter(Boolean);
  if (speakerIds.length > 0) {
    const speakerConflicts = checkSpeakerConflicts(
      { session_date, start_time, end_time },
      speakerIds,
      existingSessions
    );
    if (speakerConflicts.length > 0 && !override_conflicts) {
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

  // Generate unique slug
  let baseSlug = slugify(title);
  if (!baseSlug) baseSlug = "session";
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data: existing } = await auth.supabase
      .from("event_sessions")
      .select("id")
      .eq("event_id", eventId)
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  // Insert session
  const { data: session, error: insertError } = await auth.supabase
    .from("event_sessions")
    .insert({
      event_id: eventId,
      track_id: track_id || null,
      room_id: room_id || null,
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      session_type,
      session_date,
      start_time,
      end_time,
      capacity: capacity ? Number(capacity) : null,
      allow_waitlist: Boolean(allow_waitlist),
      registration_required: Boolean(registration_required),
      checkin_enabled: checkin_enabled !== false,
      require_checkout: Boolean(require_checkout),
      visibility,
      status,
      cover_image: cover_image?.trim() || null,
      tags: Array.isArray(tags) ? tags : [],
      external_streaming_url: external_streaming_url?.trim() || null,
      meeting_url: meeting_url?.trim() || null,
      resources: Array.isArray(resources) ? resources : [],
    })
    .select(`
      *,
      track:event_tracks (*),
      room:event_rooms (*)
    `)
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Insert speaker assignments
  if (speakers.length > 0) {
    const speakerInserts = speakers.map((sp: any, idx: number) => ({
      session_id: session.id,
      speaker_id: sp.speakerId,
      role: sp.role || "speaker",
      sort_order: typeof sp.sortOrder === "number" ? sp.sortOrder : idx,
    }));

    await auth.supabase.from("session_speakers").insert(speakerInserts);
  }

  return NextResponse.json({ data: session }, { status: 201 });
}
