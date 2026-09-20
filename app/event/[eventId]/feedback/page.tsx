import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEventFeedbackData } from "@/app/actions/event-feedback";
import EventFeedbackManager from "@/components/feedback/EventFeedbackManager";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("name")
    .eq("id", eventId)
    .single();

  return {
    title: event ? `Feedback & Reviews — ${event.name}` : "Event Feedback",
    description: "Manage attendee feedback form, questions, and responses.",
  };
}

export default async function EventFeedbackAdminPage({
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
    .select("id, name, apply_slug, organizer_id")
    .eq("id", eventId)
    .single();

  if (!event) notFound();

  // Get approved attendees count for response rate calculation
  const { count: approvedCount } = await supabase
    .from("attendees")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  // Fetch feedback configuration, responses, and metrics
  const feedbackData = await getEventFeedbackData(eventId);

  return (
    <div className="max-w-6xl mx-auto py-4">
      <EventFeedbackManager
        eventId={event.id}
        eventName={event.name}
        applySlug={event.apply_slug}
        initialForm={feedbackData.form}
        initialResponses={feedbackData.responses}
        initialStats={feedbackData.stats}
        approvedCount={approvedCount ?? 0}
      />
    </div>
  );
}
