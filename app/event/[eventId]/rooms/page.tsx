import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import RoomsManager from "@/components/conference/RoomsManager";
import type { EventRoom } from "@/types/conference";

export const metadata: Metadata = {
  title: "Rooms & Halls — URPASS",
  robots: { index: false, follow: false },
};

export default async function EventRoomsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) notFound();

  const supabase = await createClient();

  const [{ data: event }, { data: rooms }] = await Promise.all([
    supabase.from("events").select("id, name").eq("id", eventId).single(),
    supabase.from("event_rooms").select("*").eq("event_id", eventId).order("name", { ascending: true }),
  ]);

  if (!event) notFound();

  return (
    <RoomsManager
      eventId={eventId}
      eventName={event.name}
      initialRooms={(rooms || []) as EventRoom[]}
    />
  );
}
