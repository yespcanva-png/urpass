"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  Users,
  QrCode,
  ScanLine,
  TrendingUp,
  Clock,
  MapPin,
  ExternalLink,
  Wifi,
  Download,
  RefreshCw,
  Sparkles,
  BarChart3,
  Calendar,
  ChevronRight,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface SessionData {
  id: string;
  title: string;
  description?: string | null;
  sessionType: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  roomName: string;
  trackName: string | null;
  trackColor: string | null;
  capacity: number | null;
  checkedInCount: number;
  registeredCount: number;
  turnoutRate: number;
  capacityUtilization: number | null;
  recentCheckins: Array<{
    id: string;
    attendeeId: string;
    attendeeName: string;
    attendeeEmail: string;
    passType: string;
    checkinTime: string;
    checkoutTime?: string | null;
    admittedGuests: number;
    source: string;
  }>;
}

interface SessionAttendanceSectionProps {
  eventId: string;
  eventName?: string;
  initialSessions?: SessionData[];
  approvedAttendeesCount?: number;
  className?: string;
  showScannerLink?: boolean;
}

function formatTime12(timeStr?: string | null) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let h = parseInt(parts[0], 10);
  const m = parts[1];
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export default function SessionAttendanceSection({
  eventId,
  eventName,
  initialSessions,
  approvedAttendeesCount,
  className = "",
  showScannerLink = true,
}: SessionAttendanceSectionProps) {
  const [sessions, setSessions] = useState<SessionData[]>(initialSessions || []);
  const [loading, setLoading] = useState(!initialSessions || initialSessions.length === 0);
  const [live, setLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<SessionData | null>(null);
  const [hoveredBarId, setHoveredBarId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "active" | "high_turnout">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch Authoritative Session Attendance Data
  const fetchSessionAttendance = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/events/${eventId}/session-attendance`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data.sessions)) {
          setSessions(json.data.sessions);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error("Error fetching session attendance:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSessionAttendance();
  }, [fetchSessionAttendance]);

  // Real-time listener on session_checkins
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`session-attendance-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_checkins",
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          // Immediately re-fetch authoritative breakdown upon any QR scan
          fetchSessionAttendance(true);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_sessions",
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchSessionAttendance(true);
        }
      )
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
      });

    // Fallback polling every 12 seconds to ensure 100% data freshness
    const pollInterval = setInterval(() => {
      fetchSessionAttendance(true);
    }, 12000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [eventId, fetchSessionAttendance]);

  // Aggregate metrics
  const totalSessions = sessions.length;
  const totalSessionCheckins = useMemo(
    () => sessions.reduce((sum, s) => sum + s.checkedInCount, 0),
    [sessions]
  );
  const totalRegisteredCapacity = useMemo(
    () => sessions.reduce((sum, s) => sum + s.registeredCount, 0),
    [sessions]
  );
  const avgTurnoutRate =
    totalRegisteredCapacity > 0
      ? Math.round((totalSessionCheckins / totalRegisteredCapacity) * 100)
      : 0;

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    if (filterMode === "active") {
      return sessions.filter((s) => s.status === "published" || s.checkedInCount > 0);
    }
    if (filterMode === "high_turnout") {
      return [...sessions].sort((a, b) => b.turnoutRate - a.turnoutRate);
    }
    return sessions;
  }, [sessions, filterMode]);

  // Max checkins across all sessions for relative comparison chart scaling
  const maxCheckin = useMemo(() => {
    const counts = sessions.map((s) => s.checkedInCount);
    return Math.max(1, ...counts);
  }, [sessions]);

  // CSV Export for Session Attendance
  function handleExportSessionCsv() {
    const headers = [
      "Session Title",
      "Room",
      "Date",
      "Start Time",
      "End Time",
      "Checked-In Attendees",
      "Registered Attendees",
      "Turnout Rate (%)",
      "Capacity",
      "Status",
    ];

    const rows = sessions.map((s) => [
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.roomName.replace(/"/g, '""')}"`,
      s.sessionDate,
      s.startTime,
      s.endTime,
      s.checkedInCount,
      s.registeredCount,
      `${s.turnoutRate}%`,
      s.capacity ?? "Unlimited",
      s.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent([headers.join(","), ...rows.map((r) => r.join(","))].join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute(
      "download",
      `session-attendance-${eventId.slice(0, 8)}-${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // If loading and no sessions
  if (loading && sessions.length === 0) {
    return (
      <div className={`bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm animate-pulse space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-neutral-100 rounded-lg" />
          <div className="h-6 w-24 bg-neutral-100 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-neutral-50 rounded-2xl border border-neutral-100/80" />
          ))}
        </div>
      </div>
    );
  }

  // If no conference sessions exist for this event, omit cleanly
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-neutral-100 p-5 sm:p-6 space-y-6 ${className}`}>
      {/* ── Section Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                Session-Wise Attendance
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span
                  className={`w-2 h-2 rounded-full ${
                    live ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"
                  }`}
                />
                {live ? "Live Sync Active" : "Syncing"}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Real-time check-in counts, registered attendee capacity, and multi-session turnout comparison
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => fetchSessionAttendance()}
            disabled={isRefreshing}
            className="p-2 text-neutral-500 hover:text-neutral-800 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-xl transition-colors shadow-2xs"
            title="Refresh session attendance"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
          </button>

          <button
            onClick={handleExportSessionCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-xl transition-all shadow-2xs active:scale-95"
            title="Download audit CSV of session check-ins"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {showScannerLink && (
            <Link
              href={`/scan/${eventId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs active:scale-95"
            >
              <ScanLine className="w-3.5 h-3.5 text-white" />
              <span>Session Scanner</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Top Summary Counters ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-100">
          <p className="text-xs font-semibold text-neutral-500">Tracked Sessions</p>
          <p className="text-xl font-bold tabular-nums text-neutral-900 mt-1">{totalSessions}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Active schedule tracks</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100/90">
          <p className="text-xs font-semibold text-emerald-700">Total Checked In</p>
          <p className="text-xl font-bold tabular-nums text-emerald-900 mt-1">{totalSessionCheckins}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">
            {totalSessions > 0 ? `${(totalSessionCheckins / totalSessions).toFixed(1)} avg / session` : "No scans"}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/80">
          <p className="text-xs font-semibold text-purple-700">Registered Attendees</p>
          <p className="text-xl font-bold tabular-nums text-purple-900 mt-1">
            {approvedAttendeesCount ?? sessions[0]?.registeredCount ?? totalRegisteredCapacity}
          </p>
          <p className="text-[11px] text-purple-600 mt-0.5">Eligible per session</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80">
          <p className="text-xs font-semibold text-indigo-700">Turnout Efficiency</p>
          <p className="text-xl font-bold tabular-nums text-indigo-900 mt-1">{avgTurnoutRate}%</p>
          <p className="text-[11px] text-indigo-600 mt-0.5">Overall session conversion</p>
        </div>
      </div>

      {/* ── Visual Comparison Graph / Bar Chart ───────────────── */}
      <div className="bg-neutral-50/70 rounded-2xl p-4 sm:p-5 border border-neutral-100/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Attendance Comparison Across Sessions
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-600 inline-block" />
              Checked-in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-neutral-200 inline-block" />
              Registered
            </span>
          </div>
        </div>

        {/* Visual Comparison Horizontal Bars */}
        <div className="space-y-3 pt-1">
          {sessions.map((session) => {
            const isHovered = hoveredBarId === session.id;
            const checkedPct = session.registeredCount > 0
              ? Math.min(100, (session.checkedInCount / session.registeredCount) * 100)
              : 0;
            // Relative bar length compared to session with max check-ins (min 6% width for visibility if > 0)
            const relativeBarPct = session.checkedInCount > 0
              ? Math.max(6, Math.round((session.checkedInCount / maxCheckin) * 100))
              : 0;

            const timeRange = `${formatTime12(session.startTime)} – ${formatTime12(session.endTime)}`;

            return (
              <div
                key={session.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredBarId(session.id)}
                onMouseLeave={() => setHoveredBarId(null)}
                onClick={() => setSelectedSessionForModal(session)}
              >
                {/* Session label + metrics header */}
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-neutral-900 truncate">
                      {session.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 shrink-0 hidden sm:inline">
                      ({session.roomName} • {timeRange})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold tabular-nums text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {session.checkedInCount} checked in
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-neutral-500">
                      / {session.registeredCount} reg ({session.turnoutRate}%)
                    </span>
                  </div>
                </div>

                {/* Comparative Dual Progress Bar */}
                <div className="relative h-4 bg-neutral-200/70 rounded-lg overflow-hidden flex items-center">
                  <div
                    className={`h-full transition-all duration-500 rounded-lg flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                      session.checkedInCount > 0
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs"
                        : "bg-transparent"
                    }`}
                    style={{ width: `${Math.max(session.checkedInCount > 0 ? 8 : 0, checkedPct)}%` }}
                  >
                    {session.checkedInCount > 0 && checkedPct >= 10 && (
                      <span className="drop-shadow-xs">{session.checkedInCount}</span>
                    )}
                  </div>
                </div>

                {/* Hover Tooltip Card */}
                {isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-16 z-30 bg-neutral-900 text-white text-xs rounded-xl p-2.5 shadow-xl pointer-events-none whitespace-nowrap space-y-0.5">
                    <p className="font-bold text-white">{session.title}</p>
                    <p className="text-[11px] text-neutral-300">
                      Checked in: <strong className="text-emerald-400">{session.checkedInCount}</strong> / {session.registeredCount} registered ({session.turnoutRate}% turnout)
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Pending arrival: {Math.max(0, session.registeredCount - session.checkedInCount)} attendees
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Separate Session Attendance Cards Grid (Autism, ADHD, etc.) ── */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            Individual Session Cards
          </h4>
          <span className="text-xs text-neutral-400">
            Click any session card to view attendee check-in ledger
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const timeRange = `${formatTime12(session.startTime)} – ${formatTime12(session.endTime)}`;
            const pendingArrival = Math.max(0, session.registeredCount - session.checkedInCount);
            const isCompleted = session.status === "completed";

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-purple-300 transition-all duration-200 relative group"
              >
                {/* Card Top: Title & Badges */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        {session.sessionType || "Session"}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 mt-1.5 leading-snug break-words">
                        {session.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 border ${
                        session.checkedInCount > 0
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      {session.checkedInCount > 0 ? "Active" : session.status}
                    </span>
                  </div>

                  {/* Metadata pills */}
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {timeRange}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {session.roomName}
                    </span>
                  </div>

                  {/* Primary Numbers: Checked-In vs Registered */}
                  <div className="grid grid-cols-2 gap-2 bg-neutral-50/90 rounded-xl p-3 border border-neutral-100/90 mb-3.5">
                    <div>
                      <p className="text-[11px] font-semibold text-neutral-500">Checked In</p>
                      <p className="text-2xl font-bold tabular-nums text-emerald-700 mt-0.5">
                        {session.checkedInCount}
                      </p>
                      <p className="text-[10px] font-medium text-emerald-600 mt-0.5">
                        {session.turnoutRate}% turnout
                      </p>
                    </div>

                    <div className="border-l border-neutral-200/60 pl-3">
                      <p className="text-[11px] font-semibold text-neutral-500">Registered</p>
                      <p className="text-2xl font-bold tabular-nums text-neutral-900 mt-0.5">
                        {session.registeredCount}
                      </p>
                      <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
                        {pendingArrival} pending
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[11px] font-medium text-neutral-500">
                      <span>Turnout Progress</span>
                      <span className="font-bold tabular-nums text-neutral-800">
                        {session.checkedInCount} / {session.registeredCount}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, session.turnoutRate)}%` }}
                      />
                    </div>
                    {session.capacity && (
                      <p className="text-[10px] text-neutral-400 pt-0.5">
                        Room capacity: {session.capacity} spots ({session.capacityUtilization ?? 0}% utilized)
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setSelectedSessionForModal(session)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-neutral-500" />
                    <span>View Attendees ({session.checkedInCount})</span>
                  </button>

                  <Link
                    href={`/scan/${eventId}?session=${session.id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl transition-all shadow-2xs"
                    title={`Scan tickets directly into ${session.title}`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-purple-700" />
                    <span>Scan</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal: Checked-In Attendees for Session ────────────── */}
      {selectedSessionForModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-100 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  Session Attendance Ledger
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-1">
                  {selectedSessionForModal.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {selectedSessionForModal.checkedInCount} verified check-in
                  {selectedSessionForModal.checkedInCount === 1 ? "" : "s"} • {selectedSessionForModal.roomName}
                </p>
              </div>

              <button
                onClick={() => setSelectedSessionForModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal List */}
            <div className="overflow-y-auto p-5 flex-1">
              {selectedSessionForModal.recentCheckins.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto text-neutral-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-600">No attendees checked in yet</p>
                  <p className="text-[11px] text-neutral-400">
                    Use the QR scanner or manual checkin to admit attendees to this session.
                  </p>
                  <Link
                    href={`/scan/${eventId}?session=${selectedSessionForModal.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    Launch Scanner for {selectedSessionForModal.title}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {selectedSessionForModal.recentCheckins.map((entry) => (
                    <li key={entry.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {entry.attendeeName
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate">
                            {entry.attendeeName}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {entry.attendeeEmail}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          Checked in
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          {new Date(entry.checkinTime).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">
                Live updates synced automatically
              </span>
              <button
                onClick={() => setSelectedSessionForModal(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
