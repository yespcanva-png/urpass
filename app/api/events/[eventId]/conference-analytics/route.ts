import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import { computeConferenceAnalytics } from "@/lib/conference/helpers";
import type { EventSession, EventRoom } from "@/types/conference";

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

  // Fetch all sessions, rooms, speakers, tracks, reservations, checkins
  const { data: sessionsRaw } = await auth.supabase
    .from("event_sessions")
    .select("id, title, room_id, capacity, session_date, start_time, end_time, status")
    .eq("event_id", eventId);

  const sessionIds = ((sessionsRaw || []) as Array<{ id: string }>).map((s) => s.id);

  const [
    { data: roomsRaw },
    { count: speakersCount },
    { count: tracksCount },
    { data: reservationsRaw },
    { data: checkinsRaw },
  ] = await Promise.all([
    auth.supabase
      .from("event_rooms")
      .select("id, name, capacity")
      .eq("event_id", eventId),

    auth.supabase
      .from("event_speakers")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId),

    auth.supabase
      .from("event_tracks")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId),

    sessionIds.length > 0
      ? auth.supabase
          .from("session_reservations")
          .select("session_id, status")
          .in("session_id", sessionIds)
      : Promise.resolve({ data: [] }),

    auth.supabase
      .from("session_checkins")
      .select("session_id, checkin_time, checkout_time, duration_minutes, attendee:attendees(pass_type)")
      .eq("event_id", eventId),
  ]);

  const sessions = (sessionsRaw || []) as unknown as EventSession[];
  const rooms = (roomsRaw || []) as unknown as EventRoom[];
  const reservations = (reservationsRaw || []) as Array<{ session_id: string; status: string }>;
  const checkins = (checkinsRaw || []) as Array<{ session_id: string; checkin_time: string }>;

  const analytics = computeConferenceAnalytics(
    sessions,
    rooms,
    speakersCount || 0,
    tracksCount || 0,
    reservations,
    checkins
  );

  return NextResponse.json({ data: analytics });
}
