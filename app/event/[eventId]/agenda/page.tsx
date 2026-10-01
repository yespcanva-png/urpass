import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import AgendaDashboard from "@/components/conference/AgendaDashboard";
import type { EventSession, EventTrack, EventRoom, EventSpeaker } from "@/types/conference";

export const metadata: Metadata = {
  title: "Agenda Management — URPASS",
  robots: { index: false, follow: false },
};

export default async function EventAgendaPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) notFound();

  const supabase = await createClient();

  const [
    { data: event },
    { data: tracks },
    { data: rooms },
    { data: sessionsRaw },
    { data: speakers },
    { data: website },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, event_date, start_time, end_time, status, apply_slug")
      .eq("id", eventId)
      .single(),

    supabase
      .from("event_tracks")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true }),

    supabase
      .from("event_rooms")
      .select("*")
      .eq("event_id", eventId)
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
      .eq("event_id", eventId)
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true }),

    supabase
      .from("event_speakers")
      .select("*")
      .eq("event_id", eventId)
      .order("display_order", { ascending: true }),

    supabase
      .from("event_websites")
      .select("slug")
      .eq("event_id", eventId)
      .maybeSingle(),
  ]);

  if (!event) notFound();

  const formattedDate = new Date(event.event_date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const sessions = ((sessionsRaw || []) as any[]).map((s) => {
    const reservation_count = (s.reservations || []).filter(
      (r: any) => r.status === "reserved" || r.status === "attended"
    ).length;
    const { reservations, ...rest } = s;
    return { ...rest, reservation_count } as EventSession;
  });

  return (
    <AgendaDashboard
      eventId={eventId}
      eventName={event.name}
      eventDates={{
        start: event.event_date,
        end: event.event_date,
        formatted: formattedDate,
      }}
      eventStatus={event.status}
      websiteSlug={website?.slug || event.apply_slug || event.id}
      initialTracks={(tracks || []) as EventTrack[]}
      initialRooms={(rooms || []) as EventRoom[]}
      initialSessions={sessions}
      initialSpeakers={(speakers || []) as EventSpeaker[]}
    />
  );
}
