import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { groupSessionsByDate } from "@/lib/conference/helpers";
import type { EventSession } from "@/types/conference";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const supabase = await createClient();

  // Support lookup by eventId or slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);

  const eventQuery = supabase
    .from("events")
    .select("id, name, description, event_date, start_time, end_time, venue, status, banner_url, logo_url, apply_slug");

  const { data: event, error: eventErr } = await (isUuid
    ? eventQuery.eq("id", eventId)
    : eventQuery.eq("apply_slug", eventId)
  ).maybeSingle();

  if (eventErr || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const resolvedEventId = event.id;

  // Parallel fetch: tracks, rooms, sessions, speakers, website
  const [
    { data: tracks },
    { data: rooms },
    { data: sessionsRaw },
    { data: speakers },
    { data: website },
  ] = await Promise.all([
    supabase
      .from("event_tracks")
      .select("*")
      .eq("event_id", resolvedEventId)
      .eq("visibility", "public")
      .order("sort_order", { ascending: true }),

    supabase
      .from("event_rooms")
      .select("*")
      .eq("event_id", resolvedEventId)
      .order("name", { ascending: true }),

    supabase
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
        reservations:session_reservations (id, status)
      `)
      .eq("event_id", resolvedEventId)
      .eq("visibility", "public")
      .neq("status", "cancelled")
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true }),

    supabase
      .from("event_speakers")
      .select("*")
      .eq("event_id", resolvedEventId)
      .eq("visibility", "public")
      .order("display_order", { ascending: true }),

    supabase
      .from("event_websites")
      .select("*")
      .eq("event_id", resolvedEventId)
      .maybeSingle(),
  ]);

  const mappedSessions = ((sessionsRaw || []) as any[]).map((s) => {
    const reservation_count = (s.reservations || []).filter(
      (r: any) => r.status === "reserved" || r.status === "attended"
    ).length;
    const { reservations, ...rest } = s;
    return {
      ...rest,
      reservation_count,
    } as EventSession;
  });

  const groupedDays = groupSessionsByDate(mappedSessions);

  return NextResponse.json({
    data: {
      event,
      tracks: tracks || [],
      rooms: rooms || [],
      speakers: speakers || [],
      sessions: mappedSessions,
      days: groupedDays,
      website: website || null,
    },
  });
}
