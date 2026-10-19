import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Mail,
  MessageSquare,
  Send,
  Radio,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  Bell,
  Sparkles,
  Phone,
} from "lucide-react";
import {
  broadcastEventReminders,
  broadcastPostEventThankYou,
  getEventCommunications,
} from "@/app/actions/event-engagement";
import { getEventCommunicationSettings } from "@/app/actions/communications";
import CommunicationsClient from "./CommunicationsClient";

export const dynamic = "force-dynamic";

export default async function EventCommunicationsPage({
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
    .select("id, name, event_date, start_time, end_time, venue, event_type, organizer_id, organization_id, status")
    .eq("id", eventId)
    .single();

  if (!event) notFound();

  // Verify access
  if (event.organizer_id !== user.id) {
    if (event.organization_id) {
      const { data: member } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", event.organization_id)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (!member) notFound();
    } else {
      notFound();
    }
  }

  // Fetch approved & total attendee count
  const [{ count: approvedCount }, { count: totalAttendees }, logs, settings] = await Promise.all([
    supabase
      .from("attendees")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("application_status", "approved"),
    supabase
      .from("attendees")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId),
    getEventCommunications(eventId),
    getEventCommunicationSettings(eventId),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Corporate Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-neutral-500">
            <span>Events</span>
            <span>/</span>
            <span className="font-medium text-neutral-800 truncate max-w-[200px] sm:max-w-xs">{event.name}</span>
            <span>/</span>
            <span className="font-semibold text-neutral-950">Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Communications Command Center
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
            Direct Meta WhatsApp Cloud API gateway, digital QR pass issuance, transactional emails, and automated audience broadcasts.
          </p>
        </div>

        {/* Corporate Audience Metric */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Approved Audience</p>
            <p className="text-lg font-bold tracking-tight text-neutral-900 mt-0.5">
              {approvedCount || 0} <span className="text-xs font-normal text-neutral-400">/ {totalAttendees || 0} registered</span>
            </p>
          </div>
        </div>
      </div>

      <CommunicationsClient
        eventId={eventId}
        eventName={event.name}
        eventDate={event.event_date}
        venue={event.venue}
        approvedCount={approvedCount || 0}
        initialLogs={logs}
        settings={settings}
      />
    </div>
  );
}
