import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { getEventTicketTypes } from "@/app/actions/ticket-types";
import TicketTypeForm from "../TicketTypeForm";

export const dynamic = "force-dynamic";

export default async function NewTicketTypePage({
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

  const [{ data: event }, plan, ticketTypes] = await Promise.all([
    supabase
      .from("events")
      .select("id, organizer_id, organization_id")
      .eq("id", eventId)
      .single(),
    getUserPlan(supabase, user.id),
    getEventTicketTypes(eventId),
  ]);

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

  // Free plan: only 1 ticket type allowed
  if (plan.slug === "free" && ticketTypes.length >= 1) {
    redirect(`/event/${eventId}/tickets`);
  }

  return <TicketTypeForm eventId={eventId} />;
}
