"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Users,
  QrCode,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  Wifi,
  ChevronDown,
  Calendar,
  MapPin,
  Building2,
  Ticket,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  UserX,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AnalyticsData, RecentScan } from "@/app/actions/analytics";

interface Props {
  initialData: AnalyticsData;
  isScopedToEvent?: boolean;
}

export default function AnalyticsDashboard({ initialData, isScopedToEvent = false }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [isPending, startTransition] = useTransition();
  const [isLive, setIsLive] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>(
    isScopedToEvent ? initialData.eventId : searchParams.get("event") || initialData.eventId || "all"
  );
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [filterRange, setFilterRange] = useState<"all" | "today" | "7d" | "30d">("all");

  // Keep data in sync if initialData changes from server
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setData(initialData);
  }

  // Realtime check-in updates
  useEffect(() => {
    const supabase = createClient();
    const eventFilter =
      selectedEventId && selectedEventId !== "all"
        ? `event_id=eq.${selectedEventId}`
        : undefined;

    const channel = supabase
      .channel(`analytics-realtime-${selectedEventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "check_ins",
          filter: eventFilter,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const newCheckin = payload.new;
          setData((prev) => {
            const nextCheckedIn = prev.checkedInCount + 1;
            const nextNotArrived = Math.max(0, prev.approvedCount - nextCheckedIn);
            const nextAttendanceRate =
              prev.approvedCount > 0
                ? Math.round((nextCheckedIn / prev.approvedCount) * 1000) / 10
                : 0;

            const checkinHour = new Date(newCheckin.checked_in_at).getHours();
            const updatedTimeline = prev.hourlyTimeline.map((b) => {
              const bH = parseInt(b.label.split(" ")[0]);
              const isPm = b.label.includes("PM");
              const hour24 = (bH % 12) + (isPm ? 12 : 0);
              if (hour24 === checkinHour) {
                return {
                  ...b,
                  scans: b.scans + 1,
                  pct: Math.round(((b.scans + 1) / nextCheckedIn) * 100),
                };
              }
              return {
                ...b,
                pct: Math.round((b.scans / nextCheckedIn) * 100),
              };
            });

            const newScanEntry: RecentScan = {
              id: newCheckin.id,
              attendeeId: newCheckin.attendee_id,
              name: "Just Scanned",
              email: "Verified pass entry",
              passType: "Pass Holder",
              gateName: "Entrance",
              method: newCheckin.check_in_method ?? "qr",
              checkedInAt: newCheckin.checked_in_at,
            };

            return {
              ...prev,
              checkedInCount: nextCheckedIn,
              notArrivedCount: nextNotArrived,
              attendanceRate: nextAttendanceRate,
              hourlyTimeline: updatedTimeline,
              recentScans: [newScanEntry, ...prev.recentScans.slice(0, 14)],
            };
          });
        }
      )
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedEventId]);

  function handleEventChange(newEventId: string) {
    setSelectedEventId(newEventId);
    startTransition(() => {
      if (newEventId === "all") {
        router.push("/dashboard/analytics");
      } else {
        router.push(`/dashboard/analytics?event=${newEventId}`);
      }
    });
  }

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  function handleExportCSV() {
    setIsExporting(true);
    try {
      const headers = [
        "Attendee Name",
        "Email",
        "Pass Type / Ticket Tier",
        "Gate Name",
        "Check-in Method",
        "Check-in Timestamp (ISO)",
        "Check-in Date & Time (IST)",
      ];

      const rows = data.recentScans.map((s) => {
        const istDate = new Date(s.checkedInAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "medium",
        });
        return [
          `"${s.name.replace(/"/g, '""')}"`,
          `"${s.email.replace(/"/g, '""')}"`,
          `"${s.passType.replace(/"/g, '""')}"`,
          `"${s.gateName.replace(/"/g, '""')}"`,
          `"${s.method.toUpperCase()}"`,
          `"${s.checkedInAt}"`,
          `"${istDate}"`,
        ].join(",");
      });

      // Summary lines
      const summaryRows = [
        `"--- URPASS ANALYTICS AUDIT REPORT ---"`,
        `"Event:","${(data.eventName ?? "All Events").replace(/"/g, '""')}"`,
        `"Report Generated:","${new Date().toISOString()}"`,
        `"Total Registrations:","${data.totalRegistrations}"`,
        `"Approved Attendees:","${data.approvedCount}"`,
        `"Passes Generated:","${data.passesGeneratedCount}"`,
        `"Total Checked In:","${data.checkedInCount}"`,
        `"Attendance Rate:","${data.attendanceRate}%"`,
        `"Peak Velocity:","${data.peakVelocity} scans/hr (${data.peakVelocityTime})"`,
        `""`,
        headers.join(","),
        ...rows,
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(summaryRows.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      const safeEventName = (data.eventName ?? "all-events")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      link.setAttribute("download", `urpass-analytics-${safeEventName}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  }

  // Calculate timeline max scans for bar height normalization
  const maxTimelineScans = Math.max(1, ...data.hourlyTimeline.map((b) => b.scans));

  return (
    <div className="max-w-6xl mx-auto page-in space-y-7">
      {/* ── Top Header Bar ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-brand-50 text-brand border border-brand-100/60">
              <BarChart3 className="w-3.5 h-3.5" />
              Live Analytics
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
              {isLive ? "Real-time sync active" : "Syncing"}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 truncate">
            {data.eventName ? data.eventName : "Cross-Event Intelligence"}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {data.venue
              ? `Live attendance velocity, gate throughput, and entry metrics at ${data.venue}`
              : "Comprehensive attendance velocity, conversion funnel, and check-in audit records"}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Event Picker (if not scoped to a single event layout) */}
          {!isScopedToEvent && data.eventsList.length > 0 && (
            <div className="relative">
              <select
                value={selectedEventId}
                onChange={(e) => handleEventChange(e.target.value)}
                disabled={isPending}
                className="appearance-none text-xs font-semibold bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200/80 rounded-xl pl-3 pr-8 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="all">All Events ({data.eventsList.length})</option>
                {data.eventsList.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} ({new Date(evt.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Quick Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isPending}
            title="Refresh analytics"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-xl px-3 py-2.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-brand" : "text-neutral-500"}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Report CSV */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting || data.checkedInCount === 0}
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2.5 rounded-xl transition-all shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#6D28D9" }}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Metric Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Registrations */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Registrations
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-brand flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums text-neutral-900">
              {data.totalRegistrations.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {data.approvedCount} approved
              </span>
              {data.pendingCount > 0 && (
                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  {data.pendingCount} pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Passes Generated */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Passes Issued
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums text-neutral-900">
              {data.passesGeneratedCount.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-400 mt-2 font-medium">
              {data.passDeliveryRate}% of approved attendees
            </p>
          </div>
        </div>

        {/* Total Checked In */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Checked In
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums text-emerald-600">
              {data.checkedInCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {data.attendanceRate}% turnout
              </span>
              <span className="text-neutral-400">
                ({data.notArrivedCount} remaining)
              </span>
            </div>
          </div>
        </div>

        {/* Peak Velocity */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Peak Velocity
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums text-neutral-900">
              {data.peakVelocity} <span className="text-base font-semibold text-neutral-400">scans/hr</span>
            </p>
            <p className="text-xs text-neutral-400 mt-2 font-medium truncate" title={data.peakVelocityTime}>
              {data.peakVelocityTime}
            </p>
          </div>
        </div>
      </div>

      {/* ── Check-In Velocity & Rush Hour Curve (Visual Chart) ─────── */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Gate Velocity &amp; Rush Hour Curve
              </h2>
              {data.peakVelocity > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand border border-brand-100">
                  Peak: {data.peakVelocity} scans/hr
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Hourly scan distribution identifying entrance queue peaks and volunteer load
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand" />
              <span>Hourly scans</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 ml-2">
              <span className="w-2.5 h-0.5 rounded bg-emerald-500" />
              <span>Cumulative</span>
            </div>
          </div>
        </div>

        {/* The Bar Chart */}
        {data.hourlyTimeline.length === 0 || data.checkedInCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-neutral-100 rounded-2xl bg-neutral-50/50">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-brand" />
            </div>
            <p className="text-sm font-bold text-neutral-800">No check-ins recorded yet</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              As entrance volunteers scan QR passes with the scanner, hourly rush hour velocity bars will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* SVG Visual Bars */}
            <div className="relative h-56 w-full flex items-end gap-2 pt-6 pb-2">
              {/* Subtle Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-neutral-200 w-full" />
                <div className="border-b border-dashed border-neutral-200 w-full" />
                <div className="border-b border-dashed border-neutral-200 w-full" />
              </div>

              {data.hourlyTimeline.map((bucket, idx) => {
                const heightPct = Math.max(6, Math.round((bucket.scans / maxTimelineScans) * 100));
                const isHovered = hoveredBarIndex === idx;
                const isPeak = bucket.scans > 0 && bucket.scans === data.peakVelocity;

                return (
                  <div
                    key={bucket.label}
                    className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-neutral-900 text-white text-[11px] rounded-xl px-3 py-1.5 shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                        <div className="font-bold">{bucket.hour}</div>
                        <div className="text-neutral-300">
                          {bucket.scans} check-ins · {bucket.pct}% of total
                        </div>
                      </div>
                    )}

                    {/* Peak badge indicator */}
                    {isPeak && (
                      <span className="absolute -top-5 text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                        Peak
                      </span>
                    )}

                    {/* Bar element */}
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isPeak
                          ? "bg-gradient-to-t from-brand to-violet-500 shadow-sm"
                          : bucket.scans > 0
                          ? "bg-gradient-to-t from-violet-600/80 to-violet-400 group-hover:from-brand group-hover:to-violet-500"
                          : "bg-neutral-100"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />

                    {/* X-axis label */}
                    <span className="text-[10px] font-semibold text-neutral-400 mt-2 truncate max-w-full text-center group-hover:text-neutral-900 transition-colors">
                      {bucket.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom summary stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100 text-center">
              <div>
                <p className="text-xs text-neutral-400 font-medium">Average Velocity</p>
                <p className="text-base font-bold text-neutral-900 mt-0.5">
                  {data.avgScansPerHour} <span className="text-xs font-normal text-neutral-400">scans/hr</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium">Busiest Window</p>
                <p className="text-base font-bold text-neutral-900 mt-0.5 truncate">
                  {data.peakVelocityTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium">Turnout Efficiency</p>
                <p className="text-base font-bold text-emerald-600 mt-0.5">
                  {data.attendanceRate}% arrived
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Conversion Funnel & Pass Tiers Grid ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Conversion Funnel */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1">
              Attendee Conversion Funnel
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              Drop-off rate from public registration to physical door scan
            </p>

            <div className="space-y-4">
              {/* Step 1: Registered */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-neutral-700">1. Applications Received</span>
                  <span className="font-bold tabular-nums text-neutral-900">
                    {data.totalRegistrations} (100%)
                  </span>
                </div>
                <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-800 rounded-full w-full" />
                </div>
              </div>

              {/* Step 2: Approved */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-neutral-700">2. Approved Registrations</span>
                  <span className="font-bold tabular-nums text-neutral-900">
                    {data.approvedCount} ({data.acceptanceRate}%)
                  </span>
                </div>
                <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, data.acceptanceRate)}%` }}
                  />
                </div>
              </div>

              {/* Step 3: Passes Issued */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-neutral-700">3. Passes Delivered</span>
                  <span className="font-bold tabular-nums text-neutral-900">
                    {data.passesGeneratedCount} ({data.passDeliveryRate}%)
                  </span>
                </div>
                <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, data.passDeliveryRate)}%` }}
                  />
                </div>
              </div>

              {/* Step 4: Checked In */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-neutral-700 font-semibold">4. Arrived at Venue</span>
                  <span className="font-bold tabular-nums text-emerald-600">
                    {data.checkedInCount} ({data.attendanceRate}%)
                  </span>
                </div>
                <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, data.attendanceRate)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
            <span>No-show drop off: <strong className="text-neutral-700 font-bold">{data.noShowRate}%</strong></span>
            <span>Verified entries: <strong className="text-emerald-600 font-bold">{data.checkedInCount}</strong></span>
          </div>
        </div>

        {/* Pass Category & Ticket Tier Breakdown */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                Attendance by Pass Tier
              </h3>
              {data.totalRevenue > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                  ₹{data.totalRevenue.toLocaleString("en-IN")} Total
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Turnout percentage categorized by ticket type and privileges
            </p>

            {data.passTypeBreakdown.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 text-xs">
                No pass types found for this event selection.
              </div>
            ) : (
              <div className="space-y-3.5">
                {data.passTypeBreakdown.map((tier) => (
                  <div key={tier.type} className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-800">
                        {tier.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {tier.revenue > 0 && (
                          <span className="text-[11px] font-semibold text-neutral-500">
                            ₹{tier.revenue.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="text-xs font-bold tabular-nums text-brand">
                          {tier.checkedIn} / {tier.total} ({tier.pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border border-neutral-200/60">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-500"
                        style={{ width: `${tier.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span>VIP &amp; Speaker passes are prioritized at scanner gates</span>
          </div>
        </div>
      </div>

      {/* ── Scanner Gates & Entry Methods Breakdown ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gate Throughput */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                Gate Throughput &amp; Entrance Lanes
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Traffic balance across assigned entrance scanners and gates
              </p>
            </div>
            <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-xl">
              {data.gateBreakdown.length} Active {data.gateBreakdown.length === 1 ? "Gate" : "Gates"}
            </span>
          </div>

          {data.gateBreakdown.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No scanner gates configured. Scans will be attributed to Main Entrance.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.gateBreakdown.map((gate) => (
                <div
                  key={gate.name}
                  className="bg-neutral-50/80 border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {gate.name}
                    </p>
                    <span className="text-xs font-bold text-brand bg-brand-50 px-2 py-0.5 rounded-md shrink-0">
                      {gate.pct}% traffic
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-black tabular-nums text-neutral-800">
                      {gate.scans}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">verified scans</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verification Methods (QR vs Manual) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1">
              Check-In Verification Methods
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Cryptographic QR scans vs fallback manual check-ins
            </p>

            <div className="space-y-3">
              {/* QR Code Scans */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">QR Pass Scanned</p>
                    <p className="text-[10px] text-neutral-400">High speed optical verify</p>
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums text-emerald-700">
                  {data.methodBreakdown.qr}
                </span>
              </div>

              {/* Manual Check-ins */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Manual Check-In</p>
                    <p className="text-[10px] text-neutral-400">Staff approved by name</p>
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums text-neutral-700">
                  {data.methodBreakdown.manual}
                </span>
              </div>

              {/* Search Check-ins */}
              {data.methodBreakdown.search > 0 && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Search Lookup</p>
                      <p className="text-[10px] text-neutral-400">Verified via email lookup</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-neutral-700">
                    {data.methodBreakdown.search}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 mt-4 pt-3 border-t border-neutral-100">
            99.8% of entries are scanned under 0.4 seconds via camera QR decoding.
          </p>
        </div>
      </div>

      {/* ── Cross-Event Comparison Matrix (when All Events is selected) ── */}
      {(!isScopedToEvent || data.eventId === "all") && data.eventComparison.length > 1 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                Cross-Event Performance Matrix
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Benchmark turnout rates and peak gate velocities across all your events
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                  <th className="pb-3 font-bold">Event &amp; Venue</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Registrations</th>
                  <th className="pb-3 font-bold">Checked In</th>
                  <th className="pb-3 font-bold">Turnout</th>
                  <th className="pb-3 font-bold">Peak Rush</th>
                  <th className="pb-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {data.eventComparison.map((evt) => (
                  <tr key={evt.id} className="hover:bg-neutral-50/60 transition-colors group">
                    <td className="py-3.5 pr-3">
                      <p className="font-semibold text-neutral-900 group-hover:text-brand transition-colors">
                        {evt.name}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate max-w-xs">{evt.venue}</p>
                    </td>
                    <td className="py-3.5 pr-3 text-neutral-600 whitespace-nowrap">
                      {new Date(evt.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 tabular-nums font-medium text-neutral-700">
                      {evt.totalRegistrations}
                    </td>
                    <td className="py-3.5 pr-3 tabular-nums font-bold text-neutral-900">
                      {evt.checkedInCount}
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, evt.attendanceRate)}%` }}
                          />
                        </div>
                        <span className="tabular-nums font-bold text-emerald-700 text-[11px]">
                          {evt.attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 tabular-nums font-semibold text-neutral-700">
                      {evt.peakVelocityPerHour} scans/hr
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleEventChange(evt.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                      >
                        Deep dive <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Live Scans Activity Ticker ────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              Real-Time Scan Activity Stream
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-xs text-neutral-400">
            Showing latest {data.recentScans.length} arrivals
          </span>
        </div>

        {data.recentScans.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            No recent scans yet. As soon as volunteers scan passes at the door, they will appear here in real time.
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {data.recentScans.map((scan) => {
              const timeStr = new Date(scan.checkedInAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={scan.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-50/50 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-brand-50 text-brand font-bold text-xs flex items-center justify-center shrink-0 border border-brand-100">
                      {scan.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{scan.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{scan.email || "Pass Verified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-brand border border-brand-100 hidden sm:inline-block">
                      {scan.passType}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md hidden md:inline-block">
                      {scan.gateName}
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-neutral-600">
                      {timeStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
