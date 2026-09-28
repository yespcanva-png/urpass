import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Scanner",
  description: "Select an event to start scanning QR passes at the entrance.",
  robots: { index: false, follow: false },
};
import Link from "next/link";
import {
  ScanLine,
  ArrowLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Ticket,
  QrCode,
} from "lucide-react";

export default async function ScanIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Personal events
  const { data: personalEvents } = await supabase
    .from("events")
    .select("id, name, event_date, venue, status")
    .eq("organizer_id", user.id)
    .eq("status", "active")
    .order("event_date", { ascending: true });

  // Org events: user must be active member with check-in access
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin", "event_manager", "checkin_staff"]);

  const orgIds = (memberships ?? []).map((m) => m.organization_id);
  const { data: orgEvents } = orgIds.length > 0
    ? await supabase
        .from("events")
        .select("id, name, event_date, venue, status")
        .in("organization_id", orgIds)
        .eq("status", "active")
        .order("event_date", { ascending: true })
    : { data: [] };

  // Merge and deduplicate
  const seen = new Set<string>();
  const events = [...(personalEvents ?? []), ...(orgEvents ?? [])].filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  }).sort((a, b) => a.event_date.localeCompare(b.event_date));

  return (
    <div className="min-h-screen bg-neutral-950 page-in">

      {/* ── Dark hero ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-5 pt-8 pb-16">
        <div className="relative max-w-xl mx-auto">
          {/* Back */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>

          {/* Icon badge */}
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
            <QrCode className="w-5 h-5 text-white" />
          </div>

          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
            QR Check-in
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
            Scanner
          </h1>
          <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
            Select an active event below to start scanning passes
          </p>
        </div>
      </div>

      {/* ── White card slides up ────────────────────────────────────── */}
      <div className="bg-neutral-50 rounded-t-2xl -mt-6 min-h-[60vh] border-t border-neutral-200/40">
        <div className="max-w-xl mx-auto px-5 pt-6 pb-12">

          {!events || events.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center text-center py-16">
              <div className="w-12 h-12 bg-white border border-neutral-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Ticket className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-base font-semibold text-neutral-900 mb-1">
                No active events
              </p>
              <p className="text-sm text-neutral-500 mb-6 leading-relaxed max-w-xs">
                Publish an event first. Only active events appear in the scanner.
              </p>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Ticket className="w-3.5 h-3.5" />
                Create an event
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Section label */}
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">
                Active events · {events.length}
              </p>

              {events.map((event, i) => {
                const dateStr = new Date(event.event_date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <Link
                    key={event.id}
                    href={`/scan/${event.id}`}
                    className="group flex items-center gap-3.5 bg-white border border-neutral-200/80 rounded-xl px-4 py-3.5 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all"
                  >
                    {/* Number badge */}
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-700 text-xs font-semibold">
                      {i + 1}
                    </div>

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-neutral-700 transition-colors">
                        {event.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                          <Calendar className="w-3 h-3 shrink-0 text-neutral-400" />
                          {dateStr}
                        </span>
                        {event.venue && (
                          <span className="flex items-center gap-1 text-xs text-neutral-500">
                            <MapPin className="w-3 h-3 shrink-0 text-neutral-400" />
                            <span className="truncate max-w-[140px]">{event.venue}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Scan CTA */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all">
                        <ScanLine className="w-3.5 h-3.5" />
                        Scan
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                    </div>
                  </Link>
                );
              })}

              {/* Footer note */}
              <p className="text-center text-xs text-neutral-400 pt-6">
                Only active events are shown · Draft and ended events are hidden
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
