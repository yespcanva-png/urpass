"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  QrCode,
  CheckCircle2,
  Clock,
  UserPlus,
  XCircle,
  Wifi,
  ScanLine,
  Ticket,
  Plus,
  BarChart3,
  TrendingUp,
  Download,
  ArrowUpRight,
  LifeBuoy,
} from "lucide-react";
import CopyLinkButton from "@/components/event/CopyLinkButton";
import { createClient } from "@/lib/supabase/client";
import EventCommunicationsCard from "@/components/event/EventCommunicationsCard";
import EventAttendeeFeedbackCard from "@/components/event/EventAttendeeFeedbackCard";

type PassStatus = "not_generated" | "generated" | "checked_in";
type AppStatus = "pending" | "approved" | "rejected";

interface Attendee {
  id: string;
  name: string;
  email: string;
  pass_type: string;
  application_status: AppStatus;
  pass_status: PassStatus;
  created_at: string;
}

interface CheckinRecord {
  id: string;
  attendee_id: string;
  checked_in_at: string;
  gate_id: string | null;
  check_in_method: string | null;
  gate?: { name: string } | { name: string }[] | null;
}

interface ScannerGateRecord {
  id: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
  application_enabled: boolean;
  attendee_limit: number;
  status: string;
  apply_slug: string | null;
}

interface Props {
  event: Event;
  initialAttendees?: Attendee[];
}

const APP_STATUS_CONFIG: Record<AppStatus, { label: string; cls: string }> = {
  approved: { label: "Approved", cls: "bg-green-50 text-green-700 border border-green-100" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-600 border border-red-100" },
  pending:  { label: "Pending",  cls: "bg-amber-50 text-amber-700 border border-amber-100" },
};

const PASS_STATUS_CONFIG: Record<PassStatus, { label: string; cls: string }> = {
  checked_in:    { label: "Checked in",    cls: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
  generated:     { label: "Pass issued",   cls: "bg-blue-50 text-blue-600 border border-blue-100" },
  not_generated: { label: "No pass",       cls: "bg-neutral-100 text-neutral-500 border border-neutral-100" },
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function EventOverview({ event, initialAttendees = [] }: Props) {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [gates, setGates] = useState<ScannerGateRecord[]>([]);
  const [live, setLive] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<{id: string; name: string; price: number; status: string}[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("attendees")
      .select("id, name, email, pass_type, application_status, pass_status, created_at")
      .eq("event_id", event.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setAttendees(data); });

    supabase
      .from("ticket_types")
      .select("id, name, price, status")
      .eq("event_id", event.id)
      .order("position", { ascending: true })
      .then(({ data }) => { if (data) setTicketTypes(data); });

    supabase
      .from("check_ins")
      .select("id, attendee_id, checked_in_at, gate_id, check_in_method, gate:scanner_gates(name)")
      .eq("event_id", event.id)
      .order("checked_in_at", { ascending: false })
      .then(({ data }) => { if (data) setCheckins((data ?? []) as unknown as CheckinRecord[]); });

    supabase
      .from("scanner_gates")
      .select("id, name")
      .eq("event_id", event.id)
      .then(({ data }) => { if (data) setGates(data ?? []); });
  }, [event.id]);

  useEffect(() => {
    const supabase = createClient();
    const attendeeChannel = supabase
      .channel(`event-overview-${event.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendees", filter: `event_id=eq.${event.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAttendees((prev) => [payload.new as Attendee, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setAttendees((prev) =>
              prev.map((a) => (a.id === payload.new.id ? { ...a, ...(payload.new as Attendee) } : a))
            );
          } else if (payload.eventType === "DELETE") {
            setAttendees((prev) => prev.filter((a) => a.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    const checkinChannel = supabase
      .channel(`event-overview-checkins-${event.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "check_ins", filter: `event_id=eq.${event.id}` },
        (payload) => {
          const entry = payload.new as CheckinRecord;
          setCheckins((prev) => [entry, ...prev]);
          setAttendees((prev) =>
            prev.map((a) => (a.id === entry.attendee_id ? { ...a, pass_status: "checked_in" as const } : a))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attendeeChannel);
      supabase.removeChannel(checkinChannel);
    };
  }, [event.id]);

  const total = attendees.length;
  const approved = attendees.filter((a) => a.application_status === "approved").length;
  const pending = attendees.filter((a) => a.application_status === "pending").length;
  const rejected = attendees.filter((a) => a.application_status === "rejected").length;
  const passesGenerated = attendees.filter(
    (a) => a.pass_status === "generated" || a.pass_status === "checked_in"
  ).length;
  const checkedIn = Math.max(attendees.filter((a) => a.pass_status === "checked_in").length, checkins.length);

  const capacityPct = event.attendee_limit > 0
    ? Math.min(100, Math.round((approved / event.attendee_limit) * 100))
    : 0;
  const atCapacity = event.attendee_limit > 0 && approved >= event.attendee_limit;

  // Key Analytics Calculations
  const turnoutRate = approved > 0 ? Math.round((checkedIn / approved) * 100) : 0;
  const noShowRate = approved > 0 ? Math.max(0, 100 - turnoutRate) : 0;
  const acceptanceRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  const passDeliveryRate = approved > 0 ? Math.round((passesGenerated / approved) * 100) : 0;

  // Hourly velocity curve
  const hourCounts = new Map<number, number>();
  let minHour = 9;
  let maxHour = 18;
  if (checkins.length > 0) {
    const hours = checkins.map((c) => new Date(c.checked_in_at).getHours());
    minHour = Math.max(0, Math.min(...hours) - 1);
    maxHour = Math.min(23, Math.max(...hours) + 1);
  }
  for (let h = minHour; h <= maxHour; h++) {
    hourCounts.set(h, 0);
  }
  checkins.forEach((c) => {
    const h = new Date(c.checked_in_at).getHours();
    hourCounts.set(h, (hourCounts.get(h) ?? 0) + 1);
  });

  let peakVelocity = 0;
  let peakHour = minHour;
  const sortedHours = Array.from(hourCounts.keys()).sort((a, b) => a - b);
  const hourlyBars = sortedHours.map((h) => {
    const count = hourCounts.get(h) ?? 0;
    if (count > peakVelocity) {
      peakVelocity = count;
      peakHour = h;
    }
    const h12 = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    const nextH = (h + 1) % 24;
    const nextH12 = nextH % 12 || 12;
    const nextAmpm = nextH >= 12 ? "PM" : "AM";
    return {
      hour: h,
      label: `${h12} ${ampm}`,
      range: `${h12}:00 ${ampm} – ${nextH12}:00 ${nextAmpm}`,
      count,
      pct: checkedIn > 0 ? Math.round((count / checkedIn) * 100) : 0,
    };
  });

  const peakH12 = peakHour % 12 || 12;
  const peakAmpm = peakHour >= 12 ? "PM" : "AM";
  const nextPeakH = (peakHour + 1) % 24;
  const nextPeakH12 = nextPeakH % 12 || 12;
  const nextPeakAmpm = nextPeakH >= 12 ? "PM" : "AM";
  const peakTimeLabel = `${peakH12}:00 ${peakAmpm} – ${nextPeakH12}:00 ${nextPeakAmpm}`;
  const maxBarScans = Math.max(1, ...hourlyBars.map((b) => b.count));

  // Pass tier breakdown
  const checkinAttendeeIds = new Set(checkins.map((c) => c.attendee_id));
  const passTypeStats = attendees.reduce<Record<string, { total: number; checkedIn: number }>>((acc, a) => {
    const pt = a.pass_type || "participant";
    if (!acc[pt]) acc[pt] = { total: 0, checkedIn: 0 };
    acc[pt].total++;
    if (checkinAttendeeIds.has(a.id) || a.pass_status === "checked_in") {
      acc[pt].checkedIn++;
    }
    return acc;
  }, {});

  // Method breakdown
  const methodStats = { qr: 0, manual: 0, search: 0 };
  checkins.forEach((c) => {
    const m = (c.check_in_method ?? "qr") as "qr" | "manual" | "search";
    if (m === "manual") methodStats.manual++;
    else if (m === "search") methodStats.search++;
    else methodStats.qr++;
  });

  function handleExportCSV() {
    setIsExporting(true);
    try {
      const headers = [
        "Attendee Name",
        "Email",
        "Pass Type",
        "Application Status",
        "Pass Status",
        "Checked In",
        "Check-in Time (IST)",
        "Check-in Method",
      ];
      const checkinMap = new Map<string, CheckinRecord>();
      checkins.forEach((c) => checkinMap.set(c.attendee_id, c));

      const rows = attendees.map((a) => {
        const c = checkinMap.get(a.id);
        const checkinTime = c
          ? new Date(c.checked_in_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          : "N/A";
        return [
          `"${a.name.replace(/"/g, '""')}"`,
          `"${a.email.replace(/"/g, '""')}"`,
          `"${a.pass_type.replace(/"/g, '""')}"`,
          `"${a.application_status}"`,
          `"${a.pass_status}"`,
          c ? "Yes" : "No",
          `"${checkinTime}"`,
          c?.check_in_method ? c.check_in_method.toUpperCase() : "N/A",
        ].join(",");
      });

      const csvContent =
        "data:text/csv;charset=utf-8," +
        encodeURIComponent([headers.join(","), ...rows].join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute(
        "download",
        `analytics-${event.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  }

  const previewAttendees = attendees.slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto page-in">

      {/* ── Action bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {event.application_enabled && event.apply_slug && (
            <CopyLinkButton applySlug={event.apply_slug} />
          )}
          <Link
            href={`/event/${event.id}/attendees`}
            className="flex items-center gap-2 bg-white border border-neutral-200 shadow-sm rounded-xl px-4 py-2 text-sm font-medium hover:shadow-md transition-shadow"
          >
            <UserPlus className="w-4 h-4" />
            Add attendee
          </Link>
          <Link
            href={`/event/${event.id}/checkins`}
            className="flex items-center gap-2 bg-white border border-neutral-200 shadow-sm rounded-xl px-4 py-2 text-sm font-medium hover:shadow-md transition-shadow"
          >
            <ScanLine className="w-4 h-4" />
            Check-ins
          </Link>
          <Link
            href={`/event/${event.id}/analytics`}
            className="flex items-center gap-2 bg-white border border-neutral-200 shadow-sm rounded-xl px-4 py-2 text-sm font-medium text-brand hover:border-brand/40 hover:shadow-md transition-all"
          >
            <BarChart3 className="w-4 h-4 text-brand" />
            Analytics
          </Link>
          <a
            href="#event-support-form"
            className="flex items-center gap-2 bg-white border border-neutral-200 shadow-sm rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-300 hover:shadow-md transition-all"
          >
            <LifeBuoy className="w-4 h-4 text-neutral-500" />
            Creator Support
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {live ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 font-medium">Live</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-neutral-400">Connecting…</span>
            </>
          )}
        </div>
      </div>

      {/* ── Primary stats (3 big) ───────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Total */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Total</span>
            <div className="w-7 h-7 rounded-xl bg-neutral-100 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-neutral-500" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight tabular-nums text-neutral-900">{total}</p>
          <p className="text-xs text-neutral-400">Registrations</p>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Approved</span>
            <div className="w-7 h-7 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight tabular-nums text-neutral-900">{approved}</p>
          <p className="text-xs text-neutral-400">
            {total > 0 ? `${Math.round((approved / total) * 100)}% acceptance` : "No applications yet"}
          </p>
        </div>

        {/* Checked in */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Checked in</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight tabular-nums text-neutral-900">{checkedIn}</p>
          <p className="text-xs text-neutral-400">
            {approved > 0 ? `${Math.round((checkedIn / approved) * 100)}% check-in rate` : "No approved attendees"}
          </p>
        </div>
      </div>

      {/* ── Secondary stats (3 small inline) ───────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-neutral-900">{passesGenerated}</p>
            <p className="text-[11px] text-neutral-400 leading-none mt-0.5">Passes issued</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-neutral-900">{pending}</p>
            <p className="text-[11px] text-neutral-400 leading-none mt-0.5">Pending review</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-neutral-900">{rejected}</p>
            <p className="text-[11px] text-neutral-400 leading-none mt-0.5">Rejected</p>
          </div>
        </div>
      </div>

      {/* ── Event Attendance Analytics & Gate Velocity ──────────── */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-5 border border-neutral-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0 border border-brand-100/60">
              <BarChart3 className="w-4 h-4 text-brand" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  Attendance Analytics &amp; Velocity
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                  {live ? "Live sync active" : "Syncing"}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time door arrival curve, rush hour peaks, and attendee conversion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={isExporting || total === 0}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 px-3.5 py-2 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Download audit-ready CSV of all attendees and check-in records"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              Export CSV
            </button>
            <Link
              href={`/event/${event.id}/analytics`}
              className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl transition-all shadow-sm hover:opacity-90 active:scale-95"
              style={{ background: "#6D28D9" }}
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Gate Velocity & Rush Hour Curve */}
        <div className="mb-5 bg-neutral-50/70 rounded-2xl p-4.5 border border-neutral-100/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-brand" />
                Gate Arrival Velocity &amp; Rush Timeline
              </span>
              {peakVelocity > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand border border-brand-100">
                  Peak Rush: {peakVelocity} scans/hr ({peakTimeLabel})
                </span>
              )}
            </div>
            <span className="text-xs font-semibold tabular-nums text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {checkedIn} verified {checkedIn === 1 ? "arrival" : "arrivals"}
            </span>
          </div>

          {checkedIn === 0 ? (
            <div className="text-center py-8 text-xs text-neutral-400">
              No attendees scanned at the entrance yet. As volunteers scan passes with the QR scanner, hourly rush-hour bars will rise here in real time.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-36 w-full flex items-end gap-1.5 sm:gap-2 pt-5 pb-1">
                {hourlyBars.map((bucket, idx) => {
                  const heightPct = Math.max(8, Math.round((bucket.count / maxBarScans) * 100));
                  const isHovered = hoveredBarIndex === idx;
                  const isPeak = bucket.count > 0 && bucket.count === peakVelocity;
                  return (
                    <div
                      key={bucket.label}
                      className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {isHovered && (
                        <div className="absolute -top-11 z-20 bg-neutral-900 text-white text-[11px] font-bold rounded-xl px-2.5 py-1 shadow-xl whitespace-nowrap pointer-events-none">
                          {bucket.range}: {bucket.count} scans ({bucket.pct}%)
                        </div>
                      )}
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isPeak
                            ? "bg-gradient-to-t from-brand to-violet-500 shadow-sm"
                            : bucket.count > 0
                            ? "bg-violet-400 group-hover:bg-brand"
                            : "bg-neutral-200/60"
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[9px] font-semibold text-neutral-400 mt-1.5 truncate max-w-full group-hover:text-neutral-900 transition-colors">
                        {bucket.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/50">
                <span>Peak entry window: <strong className="text-neutral-700 font-bold">{peakTimeLabel}</strong></span>
                <span>Turnout efficiency: <strong className="text-emerald-700 font-bold">{turnoutRate}% arrived</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Analytics: Conversion Funnel & Pass Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Conversion Funnel */}
          <div className="p-4.5 rounded-2xl bg-neutral-50/70 border border-neutral-100/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-neutral-900">Attendance Conversion Funnel</p>
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-200/60 px-2 py-0.5 rounded-md">
                  {turnoutRate}% conversion
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3.5">
                Drop-off rates from public application to physical gate entry
              </p>

              <div className="space-y-3">
                {/* 1. Applications */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-neutral-600">1. Applications Received</span>
                    <span className="font-bold tabular-nums text-neutral-900">{total} (100%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200/70 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-800 rounded-full w-full" />
                  </div>
                </div>

                {/* 2. Approved */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-neutral-600">2. Approved Registrations</span>
                    <span className="font-bold tabular-nums text-neutral-900">{approved} ({acceptanceRate}%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200/70 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${Math.min(100, acceptanceRate)}%` }} />
                  </div>
                </div>

                {/* 3. Passes Delivered */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-neutral-600">3. Passes Delivered</span>
                    <span className="font-bold tabular-nums text-neutral-900">{passesGenerated} ({passDeliveryRate}%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200/70 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(100, passDeliveryRate)}%` }} />
                  </div>
                </div>

                {/* 4. Arrived */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-neutral-800">4. Verified at Gate</span>
                    <span className="font-bold tabular-nums text-emerald-600">{checkedIn} ({turnoutRate}%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200/70 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, turnoutRate)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
              <span>No-show drop off: <strong className="text-neutral-700 font-bold">{noShowRate}%</strong></span>
              <span>Pending arrival: <strong className="text-neutral-700 font-bold">{Math.max(0, approved - checkedIn)}</strong></span>
            </div>
          </div>

          {/* Pass Tier / Category Breakdown */}
          <div className="p-4.5 rounded-2xl bg-neutral-50/70 border border-neutral-100/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-neutral-900">Attendance by Pass Category</p>
                <span className="text-[10px] font-bold text-brand bg-brand-50 px-2 py-0.5 rounded-md">
                  {Object.keys(passTypeStats).length} {Object.keys(passTypeStats).length === 1 ? "Tier" : "Tiers"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3.5">
                Check-in distribution and turnout percentage per ticket type
              </p>

              {Object.keys(passTypeStats).length === 0 ? (
                <div className="text-center py-6 text-[11px] text-neutral-400">
                  No attendees registered yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {Object.entries(passTypeStats).map(([type, stats]) => {
                    const pct = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;
                    const label = PASS_STATUS_CONFIG[type as PassStatus]?.label || type.charAt(0).toUpperCase() + type.slice(1);
                    return (
                      <div key={type} className="bg-white rounded-xl p-2.5 border border-neutral-200/60 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-bold text-neutral-800 capitalize">{label}</span>
                          <span className="font-bold tabular-nums text-brand">
                            {stats.checkedIn} / {stats.total} ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
              <span>QR Scans: <strong className="text-emerald-700 font-bold">{methodStats.qr}</strong></span>
              <span>Manual Approvals: <strong className="text-neutral-700 font-bold">{methodStats.manual}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ticket types ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-3">
        <div className="flex items-center justify-between mb-1 gap-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-brand shrink-0" />
            <p className="text-sm font-semibold text-neutral-900">Ticket types</p>
          </div>
          <Link
            href={`/event/${event.id}/tickets`}
            className="text-xs font-semibold text-brand hover:underline underline-offset-2 shrink-0"
          >
            Manage →
          </Link>
        </div>
        {ticketTypes.length === 0 ? (
          <div className="flex items-center justify-between mt-3 bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100">
            <p className="text-xs text-neutral-500">No ticket types yet — create types for tiered registration (VIP, General, etc.)</p>
            <Link
              href={`/event/${event.id}/tickets/new`}
              className="ml-4 flex items-center gap-1 text-xs font-bold text-brand shrink-0 hover:opacity-80"
            >
              <Plus className="w-3.5 h-3.5" />
              Add type
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-3">
            {ticketTypes.map((tt) => (
              <span
                key={tt.id}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                  tt.status === "on_sale" ? "bg-green-50 text-green-700 border-green-100" :
                  tt.status === "closed"  ? "bg-red-50 text-red-600 border-red-100" :
                  "bg-neutral-100 text-neutral-500 border-neutral-200"
                }`}
              >
                {tt.name}
                <span className="opacity-60">·</span>
                {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Capacity ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-3 gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Capacity</p>
            <p className="text-xs text-neutral-400 mt-0.5">Approved registrations vs limit</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold tabular-nums text-neutral-900">
              {approved}
              <span className="text-sm font-normal text-neutral-400"> / {event.attendee_limit}</span>
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {atCapacity
                ? "At full capacity"
                : `${event.attendee_limit - approved} spots remaining`}
            </p>
          </div>
        </div>
        <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${capacityPct}%`,
              background: atCapacity
                ? "linear-gradient(90deg, #dc2626, #ef4444)"
                : "linear-gradient(90deg, #6D28D9, #8B5CF6)",
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs font-medium ${atCapacity ? "text-red-500" : "text-neutral-400"}`}>
            {capacityPct}% filled
          </p>
          {atCapacity && (
            <p className="text-xs text-amber-600 font-medium">Applications may be turned off</p>
          )}
        </div>
      </div>

      {/* ── Attendee Engagement & Communications ─────────────────── */}
      <EventCommunicationsCard
        eventId={event.id}
        eventName={event.name}
        applySlug={event.apply_slug}
        approvedCount={approved}
      />

      {/* ── Event Attendee Feedback & Post-Event Reviews ───────── */}
      <EventAttendeeFeedbackCard
        eventId={event.id}
        eventName={event.name}
        applySlug={event.apply_slug}
        approvedCount={approved}
      />

      {/* ── Recent attendees ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-50">
          <h2 className="text-sm font-semibold text-neutral-900">Recent registrations</h2>
          <Link
            href={`/event/${event.id}/attendees`}
            className="text-xs font-medium text-brand hover:underline underline-offset-2"
          >
            View all {total > 10 ? `(${total})` : ""}
          </Link>
        </div>

        {previewAttendees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-neutral-300" />
            </div>
            <p className="text-sm font-semibold text-neutral-600 mb-1">No registrations yet</p>
            {event.application_enabled && event.apply_slug ? (
              <p className="text-xs text-neutral-400">
                Share your application link to start collecting registrations.
              </p>
            ) : (
              <Link
                href={`/event/${event.id}/attendees`}
                className="text-xs text-brand font-semibold hover:underline mt-1"
              >
                Add attendees manually →
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-neutral-50">
            {previewAttendees.map((a) => {
              const appCfg  = APP_STATUS_CONFIG[a.application_status];
              const passCfg = PASS_STATUS_CONFIG[a.pass_status];
              const ini     = initials(a.name);
              const avCls   = avatarColor(a.name);
              return (
                <li
                  key={a.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50/60 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${avCls}`}
                  >
                    {ini}
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{a.name}</p>
                    <p className="text-xs text-neutral-400 truncate">{a.email}</p>
                  </div>

                  {/* Pass type */}
                  <span className="hidden sm:inline text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full capitalize font-medium shrink-0">
                    {a.pass_type}
                  </span>

                  {/* Application status */}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${appCfg.cls}`}>
                    {appCfg.label}
                  </span>

                  {/* Pass status */}
                  <span className={`hidden md:inline text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${passCfg.cls}`}>
                    {passCfg.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
