import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import TicketDesigner from "@/components/pass/TicketDesigner";

export const metadata: Metadata = {
  title: "Design your ticket",
  description: "Create the pass your attendees will receive. Keep it simple and on brand.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EventPassDesignPage({
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

  const [{ data: event }, userPlan] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, event_date, start_time, end_time, venue, organizer_id, custom_pass_design")
      .eq("id", eventId)
      .single(),
    getUserPlan(supabase, user.id),
  ]);

  if (!event) notFound();

  // Verify ownership or org role
  if (event.organizer_id !== user.id) {
    const { data: orgMember } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin"])
      .maybeSingle();

    if (!orgMember) notFound();
  }

  // If event organizer differs from current user, check organizer's plan too
  let organizerPlan = null;
  if (event.organizer_id && event.organizer_id !== user.id) {
    organizerPlan = await getUserPlan(supabase, event.organizer_id);
  }

  // Fetch organizer profile defaults if any
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_name, org_logo_url, brand_color, custom_pass_design")
    .eq("user_id", event.organizer_id)
    .single();

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  const isPro =
    userPlan.canUse("custom_pass_design") ||
    (organizerPlan?.canUse("custom_pass_design") ?? false);

  return (
    <TicketDesigner
      initialConfig={event.custom_pass_design || profile?.custom_pass_design}
      isPro={isPro}
      eventId={event.id}
      eventName={event.name}
      eventDate={`${formattedDate} | ${event.start_time || "10:00 AM"}`}
      venue={event.venue || "Venue TBD"}
      backHref={`/event/${event.id}`}
    />
  );
}
