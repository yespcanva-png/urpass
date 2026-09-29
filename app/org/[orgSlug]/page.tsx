import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Briefcase,
  MapPin,
  ShieldCheck,
  Building2,
  TrendingUp,
  ScanLine,
  Lock,
  Layers,
  ChevronRight,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/app/actions/organizations";
import { getWorkspaces } from "@/app/actions/workspaces";

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  active: {
    label: "Live Scanning",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs",
    dot: "bg-emerald-500 animate-pulse",
  },
  draft: {
    label: "Draft",
    cls: "bg-neutral-100 text-neutral-600 border border-neutral-200",
    dot: "bg-neutral-400",
  },
  completed: {
    label: "Completed",
    cls: "bg-blue-50 text-blue-700 border border-blue-200/80",
    dot: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-rose-50 text-rose-700 border border-rose-200/80",
    dot: "bg-rose-500",
  },
};

export default async function OrgPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await getOrganization(orgSlug);
  if (!result) notFound();
  const { org, userRole } = result;
  if (!userRole) redirect("/dashboard/organizations");

  const [{ data: events }, { count: memberCount }, workspaces] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, venue, event_date, start_time, end_time, status, attendee_limit, event_type, created_at")
      .eq("organization_id", org.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("organization_members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .eq("status", "active"),
    getWorkspaces(org.id),
  ]);

  const eventIds = (events ?? []).map((e) => e.id);
  const [{ count: passCount }, { count: checkinCount }] = await Promise.all([
    eventIds.length
      ? supabase.from("passes").select("*", { count: "exact", head: true }).in("event_id", eventIds)
      : Promise.resolve({ count: 0 }),
    eventIds.length
      ? supabase.from("check_ins").select("*", { count: "exact", head: true }).in("event_id", eventIds)
      : Promise.resolve({ count: 0 }),
  ]);

  const canCreateEvent = userRole === "owner" || userRole === "admin" || userRole === "event_manager";
  const totalEvents = events?.length ?? 0;
  const activeEvents = events?.filter((e) => e.status === "active").length ?? 0;
  const completedEvents = events?.filter((e) => e.status === "completed").length ?? 0;
  const totalPasses = passCount ?? 0;
  const totalCheckins = checkinCount ?? 0;
  const checkinRate = totalPasses > 0 ? Math.round((totalCheckins / totalPasses) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* ── Executive KPI Dashboard Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Corporate Events */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                Corporate Events
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-neutral-900 tracking-tight">
                {totalEvents}
              </span>
              {activeEvents > 0 ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeEvents} live
                </span>
              ) : (
                <span className="text-xs font-medium text-neutral-400">Total hosted</span>
              )}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>{completedEvents} completed</span>
            <span className="text-neutral-300">•</span>
            <span>{totalEvents - completedEvents - activeEvents} draft/scheduled</span>
          </div>
        </div>

        {/* Card 2: Passes & Check-in Throughput */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                Passes Issued
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-neutral-900 tracking-tight">
                {totalPasses.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-blue-600 font-mono">
                {checkinRate}% check-in
              </span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-neutral-100 space-y-1.5">
            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, checkinRate))}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-400 text-right font-medium">
              {totalCheckins} verified admissions
            </p>
          </div>
        </div>

        {/* Card 3: Gate Scans Throughput */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                Verified Check-ins
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-neutral-900 tracking-tight">
                {totalCheckins.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600 font-mono">SUB-300MS</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
              Multi-Gate Active
            </span>
            <span className="text-[10px] text-neutral-400">Offline resilient</span>
          </div>
        </div>

        {/* Card 4: Team & RBAC Roster */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                Team & Governance
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-neutral-900 tracking-tight">
                {memberCount ?? 1}
              </span>
              <span className="text-xs font-medium text-neutral-500">Active seats</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBAC Enforced
            </span>
            <Link
              href={`/org/${orgSlug}/members`}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Manage →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Corporate Quick Launchpad ── */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Enterprise Operations Launchpad</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Rapid access to corporate event provisioning, team permissions, and entrance hardware.
            </p>
          </div>
          {canCreateEvent && (
            <Link
              href={`/create-event?org=${org.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-95 transition-opacity shrink-0"
              style={{ background: "#6D28D9" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Corporate Event
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Link
            href={`/org/${orgSlug}/workspaces`}
            className="p-4 rounded-xl border border-neutral-200/70 hover:border-purple-200 hover:bg-purple-50/30 transition-all flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 group-hover:text-purple-700 transition-colors">
                Department Workspaces
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                Partition events by business units like Engineering, HR, Sales, and Leadership.
              </p>
            </div>
          </Link>

          <Link
            href={`/org/${orgSlug}/locations`}
            className="p-4 rounded-xl border border-neutral-200/70 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">
                Campuses & Venues
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                Manage physical corporate auditoriums, regional offices, and virtual event links.
              </p>
            </div>
          </Link>

          <Link
            href={`/org/${orgSlug}/settings/security`}
            className="p-4 rounded-xl border border-neutral-200/70 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                SAML SSO & Security
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                Configure Okta / Azure AD Single Sign-On and audit session logs.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Corporate Events Management Section ── */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900">Corporate Events Directory</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                {totalEvents}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Track attendance, digital pass distribution, and real-time gate scanner activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/org/${orgSlug}/events`}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 transition-colors"
            >
              View All Corporate Events →
            </Link>
          </div>
        </div>

        {!events || events.length === 0 ? (
          <div className="border border-dashed border-neutral-200 rounded-2xl p-12 text-center bg-neutral-50/50">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800 mb-1">No corporate events provisioned yet</h3>
            <p className="text-xs text-neutral-500 mb-5 max-w-sm mx-auto leading-relaxed">
              Launch your first corporate all-hands, hackathon, conference, or client summit under {org.name}.
            </p>
            {canCreateEvent && (
              <Link
                href={`/create-event?org=${org.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-95 transition-opacity"
                style={{ background: "#6D28D9" }}
              >
                <Plus className="w-4 h-4" />
                <span>Create Corporate Event</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-semibold text-[11px] uppercase tracking-wider bg-neutral-50/70">
                  <th className="py-3 px-4 rounded-l-xl">Event Schedule</th>
                  <th className="py-3 px-4">Event Details</th>
                  <th className="py-3 px-4">Capacity & Type</th>
                  <th className="py-3 px-4">Scanner Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {events.map((event) => {
                  const cfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.draft;
                  const eventDate = new Date(event.event_date);
                  const dateStr = eventDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={event.id}
                      className="group hover:bg-neutral-50/80 transition-colors"
                    >
                      {/* Date tile */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center justify-center shrink-0 group-hover:border-purple-300 transition-colors">
                            <span className="text-[9px] font-bold text-purple-700 uppercase leading-none">
                              {eventDate.toLocaleDateString("en-GB", { month: "short" })}
                            </span>
                            <span className="text-sm font-black text-purple-950 leading-none mt-0.5">
                              {eventDate.getDate()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-800">{dateStr}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">
                              {event.start_time ? String(event.start_time).slice(0, 5) : "All Day"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Event name & venue */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <Link
                          href={`/event/${event.id}`}
                          className="font-bold text-sm text-neutral-900 group-hover:text-purple-700 transition-colors block truncate"
                        >
                          {event.name}
                        </Link>
                        <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span>{event.venue || "Corporate Main Venue"}</span>
                        </p>
                      </td>

                      {/* Capacity & Event Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-neutral-800">
                            {event.attendee_limit ? `${event.attendee_limit.toLocaleString()} attendees` : "Unlimited"}
                          </span>
                          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                            {event.event_type || "Physical Event"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Operations buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/event/${event.id}`}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                          >
                            Manage
                          </Link>
                          <Link
                            href={`/scan/${event.id}`}
                            className="p-1.5 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                            title="Open Gate Scanner"
                          >
                            <ScanLine className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Corporate Infrastructure & Security Architecture ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Department Workspaces Breakdown */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-neutral-900">Corporate Workspaces</h3>
              </div>
              <Link
                href={`/org/${orgSlug}/workspaces`}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900"
              >
                Configure Units →
              </Link>
            </div>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Business divisions within {org.name} with dedicated attendee allocations and permissions.
            </p>

            <div className="space-y-2.5">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/60 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ background: ws.color || "#6D28D9" }}
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-800">{ws.name}</span>
                      {ws.is_default && (
                        <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-neutral-200 text-neutral-700">
                          PRIMARY
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    /{ws.slug}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Granular RBAC per department</span>
            <Link
              href={`/org/${orgSlug}/workspaces`}
              className="font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
            >
              <span>Manage {workspaces.length} Workspaces</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Enterprise Governance, Security & Compliance */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-neutral-900">Governance & Security Posture</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Standardized identity verification, attendee duplicate protection, and audit controls.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-100 bg-neutral-50/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-800">Anti-Duplicate Pass Verification</p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Sub-300ms gate scanning prevents reused QR passes across physical and virtual gates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-100 bg-neutral-50/60">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-800">Role-Based Access Control (RBAC)</p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Multi-tier permissions across Owners, Admins, Event Managers, and Check-in Staff.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-100 bg-neutral-50/60">
                <Building2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-800">SAML 2.0 & Enterprise SSO</p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Okta, Azure AD, and Google Workspace corporate authentication support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>UK GDPR & ISO/IEC 27001 Ready</span>
            <Link
              href={`/org/${orgSlug}/settings/security`}
              className="font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
            >
              <span>Security Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
