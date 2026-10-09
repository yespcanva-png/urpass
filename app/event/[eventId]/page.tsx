import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventOverview from "./EventOverview";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/event/${eventId}`);

  const { data: event } = await supabase
    .from("events")
    .select("id, name, application_enabled, attendee_limit, status, apply_slug, organizer_id, organization_id")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) redirect("/dashboard");
  if (event.organizer_id !== user.id) {
    if (!event.organization_id) {
      redirect(`/events/${event.apply_slug || event.id}`);
    }
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    if (!member) {
      redirect(`/events/${event.apply_slug || event.id}`);
    }
  }

  // Attendees are fetched client-side inside EventOverview (instant render)
  return <EventOverview event={event} />;
}
