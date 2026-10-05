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
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-200/80">
                07. Communications
              </span>
              <span className="text-xs text-neutral-400 font-medium">Domain OS</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
              Attendee Communications & Broadcasts
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Automated transactional passes, pre-event reminders, post-event thank yous, and custom email/WhatsApp notifications.
            </p>
          </div>

          {/* KPI Mini-Pills */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 shadow-2xs text-left">
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Approved Audience</p>
              <p className="text-lg font-bold text-neutral-900">{approvedCount || 0} <span className="text-xs font-normal text-neutral-400">/ {totalAttendees || 0}</span></p>
            </div>
          </div>
        </div>
      </div>

      <CommunicationsClient
        eventId={eventId}
        eventName={event.name}
        approvedCount={approvedCount || 0}
        initialLogs={logs}
        settings={settings}
      />
    </div>
  );
}
