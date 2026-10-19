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
import {
  getEventCommunicationSettings,
  getCommunicationControlPanelData,
} from "@/app/actions/communications";
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

  // Fetch approved & total attendee count and unified control panel data
  const [{ count: approvedCount }, { count: totalAttendees }, logs, settings, controlPanelData] = await Promise.all([
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
    getCommunicationControlPanelData(eventId),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Corporate Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Events</span>
            <span>/</span>
            <span className="font-medium text-neutral-800 truncate max-w-[200px] sm:max-w-xs">{event.name}</span>
            <span>/</span>
            <span className="font-semibold text-neutral-950">Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Communications Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Centralized notification command center: default transactional email, Business-plan Self-Service WhatsApp, and UrPass Managed WhatsApp services.
          </p>
        </div>

        {/* Corporate Audience Metric */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="px-5 py-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left min-w-[200px]">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Approved Audience</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-neutral-900">{approvedCount || 0}</span>
              <span className="text-xs font-medium text-neutral-400">/ {totalAttendees || 0} registered</span>
            </div>
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
        controlPanelData={controlPanelData}
      />
    </div>
  );
}
