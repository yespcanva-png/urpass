"use server";

import { revalidatePath } from "next/cache";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import {
  checkRoomConflict,
  checkSpeakerConflicts,
  timeStringToMinutes,
  checkAttendeeScheduleConflict,
} from "@/lib/conference/conflict-detection";
import { slugify } from "@/lib/conference/helpers";
import type { EventSession } from "@/types/conference";
import { createClient } from "@/lib/supabase/server";

// ── TRACK ACTIONS ─────────────────────────────────────────────

export async function createTrackAction(eventId: string, formData: FormData) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const colour = (formData.get("colour") as string)?.trim() || "#6C63FF";
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
  const visibility = (formData.get("visibility") as string) || "public";

  if (!name) return { error: "Track name is required." };

  const { data, error } = await auth.supabase
    .from("event_tracks")
    .insert({ event_id: eventId, name, description, colour, sort_order, visibility })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath(`/event/${eventId}/agenda`);
  return { success: true, data };
}

export async function deleteTrackAction(eventId: string, trackId: string) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase
    .from("event_tracks")
    .delete()
    .eq("id", trackId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };
  revalidatePath(`/event/${eventId}/agenda`);
  return { success: true };
}

// ── ROOM ACTIONS ──────────────────────────────────────────────

export async function createRoomAction(eventId: string, formData: FormData) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const floor = (formData.get("floor") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const capacity = parseInt(formData.get("capacity") as string, 10) || 100;
  const checkin_enabled = formData.get("checkin_enabled") !== "false";

  if (!name) return { error: "Room name is required." };

  const { data, error } = await auth.supabase
    .from("event_rooms")
    .insert({ event_id: eventId, name, description, floor, location, capacity, checkin_enabled })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath(`/event/${eventId}/agenda`);
  revalidatePath(`/event/${eventId}/rooms`);
  return { success: true, data };
}

export async function deleteRoomAction(eventId: string, roomId: string) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase
    .from("event_rooms")
    .delete()
    .eq("id", roomId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };
  revalidatePath(`/event/${eventId}/agenda`);
  revalidatePath(`/event/${eventId}/rooms`);
  return { success: true };
}

// ── SPEAKER ACTIONS ───────────────────────────────────────────

export async function createSpeakerAction(eventId: string, data: any) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

  const {
    name,
    photo,
    job_title,
    company,
    bio,
    linkedin_url,
    website_url,
    email,
    phone,
    country,
    city,
    topics = [],
    display_order = 0,
    visibility = "public",
  } = data;

  if (!name?.trim()) return { error: "Speaker name is required." };

  const { data: speaker, error } = await auth.supabase
    .from("event_speakers")
    .insert({
      event_id: eventId,
      name: name.trim(),
      photo: photo?.trim() || null,
      job_title: job_title?.trim() || null,
      company: company?.trim() || null,
      bio: bio?.trim() || null,
      linkedin_url: linkedin_url?.trim() || null,
      website_url: website_url?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      country: country?.trim() || null,
      city: city?.trim() || null,
      topics,
      display_order,
      visibility,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath(`/event/${eventId}/speakers`);
  return { success: true, data: speaker };
}

export async function deleteSpeakerAction(eventId: string, speakerId: string) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase
    .from("event_speakers")
    .delete()
    .eq("id", speakerId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };
  revalidatePath(`/event/${eventId}/speakers`);
  return { success: true };
}

// ── SESSION ACTIONS ───────────────────────────────────────────

export async function createSessionAction(eventId: string, payload: any) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

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
    tags = [],
    speakers = [],
    override_conflicts = false,
  } = payload;

  if (!title?.trim() || !session_date || !start_time || !end_time) {
    return { error: "Title, session date, start time, and end time are required." };
  }

  const startMins = timeStringToMinutes(start_time);
  const endMins = timeStringToMinutes(end_time);
  if (endMins <= startMins) {
    return { error: "Session end time must be after start time." };
  }

  // Conflict detection
  if (!override_conflicts) {
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
        { room_id, session_date, start_time, end_time },
        existingSessions
      );
      if (roomConflict) {
        return { error: roomConflict.message, conflict: roomConflict, conflictType: "ROOM_CONFLICT" };
      }
    }

    const speakerIds = speakers.map((s: any) => s.speakerId).filter(Boolean);
    if (speakerIds.length > 0) {
      const speakerConflicts = checkSpeakerConflicts(
        { session_date, start_time, end_time },
        speakerIds,
        existingSessions
      );
      if (speakerConflicts.length > 0) {
        return { error: speakerConflicts[0].message, conflicts: speakerConflicts, conflictType: "SPEAKER_CONFLICT" };
      }
    }
  }

  // Unique slug
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

  const { data: session, error } = await auth.supabase
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
      tags,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  if (speakers.length > 0) {
    const speakerInserts = speakers.map((sp: any, idx: number) => ({
      session_id: session.id,
      speaker_id: sp.speakerId,
      role: sp.role || "speaker",
      sort_order: typeof sp.sortOrder === "number" ? sp.sortOrder : idx,
    }));
    await auth.supabase.from("session_speakers").insert(speakerInserts);
  }

  revalidatePath(`/event/${eventId}/agenda`);
  revalidatePath(`/event/${eventId}/sessions`);
  return { success: true, data: session };
}

export async function deleteSessionAction(eventId: string, sessionId: string) {
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase
    .from("event_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };
  revalidatePath(`/event/${eventId}/agenda`);
  revalidatePath(`/event/${eventId}/sessions`);
  return { success: true };
}

// ── ATTENDEE AGENDA & RESERVATION ACTIONS ──────────────────────

export async function reserveSessionAction(sessionId: string, attendeeIdOrPassToken: string) {
  const supabase = await createClient();

  // Call the reservation API endpoint logic directly
  const { data: session } = await supabase
    .from("event_sessions")
    .select("id, event_id, title, session_date, start_time, end_time, capacity, allow_waitlist")
    .eq("id", sessionId)
    .single();

  if (!session) return { error: "Session not found." };

  // Resolve attendee
  let attendeeId = attendeeIdOrPassToken;
  if (attendeeIdOrPassToken.length > 32) {
    const { data: pass } = await supabase
      .from("passes")
      .select("attendee_id")
      .eq("pass_token", attendeeIdOrPassToken)
      .maybeSingle();
    if (pass) attendeeId = pass.attendee_id;
  }

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
    .eq("attendee_id", attendeeId)
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
    return { error: conflict.message, conflict };
  }

  const { data: res, error } = await supabase
    .from("session_reservations")
    .upsert({
      session_id: sessionId,
      attendee_id: attendeeId,
      status: "reserved",
      reserved_at: new Date().toISOString(),
    }, { onConflict: "session_id,attendee_id" })
    .select()
    .single();

  if (error) return { error: error.message };

  await supabase
    .from("attendee_agenda")
    .upsert({
      event_id: session.event_id,
      attendee_id: attendeeId,
      session_id: sessionId,
    }, { onConflict: "attendee_id,session_id" });

  return { success: true, data: res };
}
