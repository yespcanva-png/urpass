import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import SpeakersManager from "@/components/conference/SpeakersManager";
import type { EventSpeaker } from "@/types/conference";

export const metadata: Metadata = {
  title: "Speakers Management — URPASS",
  robots: { index: false, follow: false },
};

export default async function EventSpeakersPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) notFound();

  const supabase = await createClient();

  const [{ data: event }, { data: speakers }] = await Promise.all([
    supabase.from("events").select("id, name").eq("id", eventId).single(),
    supabase
      .from("event_speakers")
      .select(`
        *,
        session_speakers (
          id,
          role,
          sort_order,
          session:event_sessions (
            id,
            title,
            slug,
            session_date,
            start_time,
            end_time
          )
        )
      `)
      .eq("event_id", eventId)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (!event) notFound();

  return (
    <SpeakersManager
      eventId={eventId}
      eventName={event.name}
      initialSpeakers={(speakers || []) as EventSpeaker[]}
    />
  );
}
