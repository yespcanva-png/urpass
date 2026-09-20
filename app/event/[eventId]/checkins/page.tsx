import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckinDashboard from "./CheckinDashboard";

type Checkin = {
  id: string;
  attendee_id: string;
  checked_in_at: string;
  gate?: { name: string } | null;
};

type ScannerGate = {
  id: string;
  name: string;
  zone_id: string | null;
  zone: { name: string } | null;
};

export default async function CheckinsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, name, status, attendee_limit, organizer_id, organization_id")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) notFound();
  if (event.organizer_id !== user.id) {
    if (!event.organization_id) notFound();
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager", "checkin_staff"])
      .maybeSingle();
    if (!member) notFound();
  }

  const [
    { data: attendees },
    { data: checkins },
    { data: gates },
    { data: zones },
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("id, name, email, pass_type, pass_status, application_status")
      .eq("event_id", eventId)
      .eq("application_status", "approved")
      .order("name", { ascending: true }),
    supabase
      .from("check_ins")
      .select("id, attendee_id, checked_in_at, gate:scanner_gates(name)")
      .eq("event_id", eventId)
      .order("checked_in_at", { ascending: false }),
    supabase
      .from("scanner_gates")
      .select("id, name, zone_id, zone:event_zones(name)")
      .eq("event_id", eventId)
      .order("position"),
    supabase
      .from("event_zones")
      .select("id, name")
      .eq("event_id", eventId)
      .order("position"),
  ]);

  return (
    <CheckinDashboard
      event={event}
      initialAttendees={attendees ?? []}
      initialCheckins={(checkins ?? []) as unknown as Checkin[]}
      initialGates={(gates ?? []) as unknown as ScannerGate[]}
      zones={zones ?? []}
    />
  );
}
