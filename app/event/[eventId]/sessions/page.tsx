import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import SessionsManager from "@/components/conference/SessionsManager";
import type { EventSession, EventTrack, EventRoom, EventSpeaker } from "@/types/conference";

export const metadata: Metadata = {
  title: "Sessions Management — URPASS",
  robots: { index: false, follow: false },
};

export default async function EventSessionsPage({
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
    { data: ticketTypesRaw },
  ] = await Promise.all([
    supabase.from("events").select("id, name").eq("id", eventId).single(),
    supabase.from("event_tracks").select("*").eq("event_id", eventId).order("sort_order", { ascending: true }),
    supabase.from("event_rooms").select("*").eq("event_id", eventId).order("name", { ascending: true }),
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
        reservations:session_reservations (id, status),
        checkins:session_checkins (id)
      `)
      .eq("event_id", eventId)
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true }),
    supabase.from("event_speakers").select("*").eq("event_id", eventId).order("display_order", { ascending: true }),
    supabase.from("ticket_types").select("id, name, price").eq("event_id", eventId).order("created_at", { ascending: true }),
  ]);

  if (!event) notFound();

  const sessions = ((sessionsRaw || []) as any[]).map((s) => {
    const reservation_count = (s.reservations || []).filter(
      (r: any) => r.status === "reserved" || r.status === "attended"
    ).length;
    const checked_in_count = (s.checkins || []).length;
    const { reservations, checkins, ...rest } = s;
    return { ...rest, reservation_count, checked_in_count } as EventSession;
  });

  return (
    <SessionsManager
      eventId={eventId}
      eventName={event.name}
      initialSessions={sessions}
      tracks={(tracks || []) as EventTrack[]}
      rooms={(rooms || []) as EventRoom[]}
      speakers={(speakers || []) as EventSpeaker[]}
      ticketTypes={(ticketTypesRaw || []) as Array<{ id: string; name: string; price?: number }>}
    />
  );
}
