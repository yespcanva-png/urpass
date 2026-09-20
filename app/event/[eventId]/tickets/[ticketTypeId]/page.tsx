import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEventTicketTypes } from "@/app/actions/ticket-types";
import TicketTypeForm from "../TicketTypeForm";

export const dynamic = "force-dynamic";

export default async function EditTicketTypePage({
  params,
}: {
  params: Promise<{ eventId: string; ticketTypeId: string }>;
}) {
  const { eventId, ticketTypeId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) notFound();
  if (event.organizer_id !== user.id) {
    if (!event.organization_id) notFound();
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin"])
      .maybeSingle();
    if (!member) notFound();
  }

  const ticketTypes = await getEventTicketTypes(eventId);
  const ticketType = ticketTypes.find((t) => t.id === ticketTypeId);
  if (!ticketType) notFound();

  return (
    <TicketTypeForm
      eventId={eventId}
      initialData={ticketType}
      ticketTypeId={ticketTypeId}
    />
  );
}
