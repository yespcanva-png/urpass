"use client";

import { useEffect, useState, useTransition } from "react";
import {
  CheckCircle2,
  Clock,
  Users,
  Wifi,
  ScanLine,
  XCircle,
  TrendingUp,
  Search,
  Plus,
  Copy,
  Trash2,
  Loader2,
  RotateCcw,
  Download,
  FileText,
  Calendar,
  MapPin,
  X,
  Eye,
  Filter,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { createGate, deleteGate } from "@/app/actions/scanner-gates";
import {
  manualCheckIn,
  undoCheckIn,
  exportCheckinsCSV,
  exportAttendeeCheckinReportCSV,
} from "@/app/actions/manual-checkin";
import SessionAttendanceSection from "@/components/conference/SessionAttendanceSection";

type PassType = "participant" | "vip" | "speaker" | "organizer";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  pass_type: PassType;
  pass_status: string;
  application_status: string;
  custom_responses?: Record<string, any> | null;
  last_gate_scanned_at?: string | null;
  created_at?: string | null;
}

export interface Checkin {
  id: string;
  attendee_id: string;
  checked_in_at: string;
  check_in_method?: string | null;
  gate?: { name: string } | null;
}

interface ScannerGate {
  id: string;
  name: string;
  zone_id: string | null;
  zone: { name: string } | null;
}

interface Zone {
  id: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
  status: string;
  attendee_limit: number;
}

export interface AttendeeScanMeta {
  isCheckedIn: boolean;
  scanCount: number;
  firstScannedAt: string | null;
  lastScannedAt: string | null;
  firstGate: string;
  latestGate: string;
  history: Array<{
    scan_number: number;
    scanned_at: string;
    gate_name?: string | null;
    method?: string;
  }>;
}

export function getAttendeeScanMeta(attendee: Attendee, allCheckins: Checkin[]): AttendeeScanMeta {
  const cr = (attendee.custom_responses as Record<string, any>) || {};
  const attCheckins = allCheckins.filter((c) => c.attendee_id === attendee.id);

  let history: Array<{
    scan_number: number;
    scanned_at: string;
    gate_name?: string | null;
    method?: string;
  }> =
    Array.isArray(cr.scan_history) && cr.scan_history.length > 0
      ? cr.scan_history
      : attCheckins.map((c, idx) => ({
          scan_number: idx + 1,
          scanned_at: c.checked_in_at,
          gate_name: c.gate?.name || "Main Gate",
          method: c.check_in_method || "qr",
        }));

  const isCheckedIn =
    attendee.pass_status === "checked_in" ||
    history.length > 0 ||
    attCheckins.length > 0;

  const scanCount = Math.max(
    Number(cr.scan_count || 0),
    history.length,
    attCheckins.length,
    isCheckedIn ? 1 : 0
  );

  const firstScannedAt =
    cr.first_scanned_at ||
    history[0]?.scanned_at ||
    attCheckins[attCheckins.length - 1]?.checked_in_at ||
    null;

  const lastScannedAt =
    cr.last_scanned_at ||
    history[history.length - 1]?.scanned_at ||
    attCheckins[0]?.checked_in_at ||
    attendee.last_gate_scanned_at ||
    firstScannedAt;

  const firstGate =
    history[0]?.gate_name ||
    attCheckins[attCheckins.length - 1]?.gate?.name ||
    (isCheckedIn ? "Main Gate" : "—");

  const latestGate =
    history[history.length - 1]?.gate_name ||
    attCheckins[0]?.gate?.name ||
    (isCheckedIn ? "Main Gate" : "—");

  return {
    isCheckedIn,
    scanCount,
    firstScannedAt,
    lastScannedAt,
    firstGate,
    latestGate,
    history,
  };
}

const PASS_TYPE_LABEL: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  organizer: "Organizer",
};

const PASS_TYPE_COLOR: Record<string, string> = {
  participant: "bg-purple-50 text-purple-700 border-purple-200",
  vip: "bg-amber-50 text-amber-700 border-amber-200",
  speaker: "bg-blue-50 text-blue-700 border-blue-200",
  organizer: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatFullDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function CheckinDashboard({
  event,
  initialAttendees,
  initialCheckins,
  initialGates,
  zones,
}: {
  event: Event;
  initialAttendees: Attendee[];
  initialCheckins: Checkin[];
  initialGates: ScannerGate[];
  zones: Zone[];
}) {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [checkins, setCheckins] = useState<Checkin[]>(initialCheckins);
  const [gates, setGates] = useState<ScannerGate[]>(initialGates);
  const [live, setLive] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "checked_in" | "multi_scan" | "not_arrived">("all");

  // Selected Attendee for detailed timestamps modal
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  // Full Report Modal State
  const [showFullReportModal, setShowFullReportModal] = useState(false);
  const [reportSearch, setReportSearch] = useState("");

  // Gate management form state
  const [newGateName, setNewGateName] = useState("");
  const [newGateZoneId, setNewGateZoneId] = useState("");
  const [gateFormOpen, setGateFormOpen] = useState(false);
  const [gateFormPending, startGateTransition] = useTransition();
  const [gateError, setGateError] = useState("");
  const [deletingGateId, setDeletingGateId] = useState<string | null>(null);
  const [copiedGateId, setCopiedGateId] = useState<string | null>(null);

  // Manual check-in state per attendee
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [undoingId, setUndoingId] = useState<string | null>(null);

  const checkinSet = new Set(checkins.map((c) => c.attendee_id));
  const checkedInCount = checkins.length;
  const totalApproved = attendees.length;
  const pct = totalApproved > 0 ? Math.round((checkedInCount / totalApproved) * 100) : 0;

  // Compute total checkin scans and multi-scans
  const attendeeMetaMap = new Map<string, AttendeeScanMeta>();
  let totalScansCount = 0;
  let multiScanCount = 0;

  for (const a of attendees) {
    const meta = getAttendeeScanMeta(a, checkins);
    attendeeMetaMap.set(a.id, meta);
    if (meta.isCheckedIn) {
      totalScansCount += meta.scanCount;
      if (meta.scanCount > 1) {
        multiScanCount++;
      }
    }
  }

  const byType = attendees.reduce<Record<string, { total: number; checkedIn: number }>>((acc, a) => {
    if (!acc[a.pass_type]) acc[a.pass_type] = { total: 0, checkedIn: 0 };
    acc[a.pass_type].total++;
    if (checkinSet.has(a.id)) acc[a.pass_type].checkedIn++;
    return acc;
  }, {});

  const recentFeed = checkins.slice(0, 25).map((c) => {
    const att = attendees.find((a) => a.id === c.attendee_id);
    const meta = att ? attendeeMetaMap.get(att.id) : null;
    return { ...c, attendee: att, scanCount: meta?.scanCount || 1 };
  });

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`checkin-dashboard-${event.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "check_ins", filter: `event_id=eq.${event.id}` },
        (payload) => {
          const entry = payload.new as Checkin;
          setCheckins((prev) => [entry, ...prev]);
          setAttendees((prev) =>
            prev.map((a) =>
              a.id === entry.attendee_id ? { ...a, pass_status: "checked_in" } : a
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "check_ins", filter: `event_id=eq.${event.id}` },
        (payload) => {
          const removed = payload.old as Partial<Checkin>;
          if (removed?.attendee_id) {
            setCheckins((prev) => prev.filter((c) => c.attendee_id !== removed.attendee_id));
            setAttendees((prev) =>
              prev.map((a) =>
                a.id === removed.attendee_id ? { ...a, pass_status: "generated" } : a
              )
            );
          }
        }
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id]);

  const filtered = attendees.filter((a) => {
    const meta = attendeeMetaMap.get(a.id);
    const isChecked = meta?.isCheckedIn ?? false;
    const isMulti = (meta?.scanCount ?? 0) > 1;

    if (statusFilter === "checked_in" && !isChecked) return false;
    if (statusFilter === "multi_scan" && !isMulti) return false;
    if (statusFilter === "not_arrived" && isChecked) return false;

    if (!search) return true;
    const q = search.toLowerCase().trim();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.phone && a.phone.includes(q)) ||
      a.pass_type.toLowerCase().includes(q) ||
      a.pass_status.toLowerCase().includes(q)
    );
  });

  async function handleCreateGate() {
    if (!newGateName.trim()) return;
    setGateError("");
    startGateTransition(async () => {
      try {
        const result = await createGate(event.id, newGateName.trim(), newGateZoneId || undefined);
        if (result.error) {
          setGateError(result.error);
          return;
        }
        if (result.id) {
          const zone = zones.find((z) => z.id === newGateZoneId);
          setGates((prev) => [
            ...prev,
            {
              id: result.id!,
              name: newGateName.trim(),
              zone_id: newGateZoneId || null,
              zone: zone ? { name: zone.name } : null,
            },
          ]);
        }
        setNewGateName("");
        setNewGateZoneId("");
        setGateFormOpen(false);
      } catch (err) {
        setGateError(err instanceof Error ? err.message : "Failed to create gate");
      }
    });
  }

  async function handleDeleteGate(gateId: string) {
    if (!window.confirm("Delete this gate? The scanner link will stop working.")) return;
    setDeletingGateId(gateId);
    try {
      const result = await deleteGate(gateId);
      setDeletingGateId(null);
      if (!result.error) {
        setGates((prev) => prev.filter((g) => g.id !== gateId));
      }
    } catch {
      setDeletingGateId(null);
    }
  }

  function handleCopyGateLink(gateId: string) {
    const url = `${window.location.origin}/scan/${event.id}?gate=${gateId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedGateId(gateId);
      setTimeout(() => setCopiedGateId(null), 2000);
    });
  }

  async function handleManualCheckIn(attendee: Attendee) {
    if (checkingInId) return;
    setCheckingInId(attendee.id);
    try {
      const result = await manualCheckIn(attendee.id, event.id);
      setCheckingInId(null);

      if (result.success || result.alreadyCheckedIn) {
        setAttendees((prev) =>
          prev.map((a) =>
            a.id === attendee.id ? { ...a, pass_status: "checked_in" } : a
          )
        );
      }
    } catch {
      setCheckingInId(null);
    }
  }

  async function handleUndoCheckIn(attendee: Attendee) {
    if (undoingId) return;
    setUndoingId(attendee.id);
    try {
      const result = await undoCheckIn(attendee.id, event.id);
      setUndoingId(null);
      if (result.success) {
        setAttendees((prev) =>
          prev.map((a) =>
            a.id === attendee.id ? { ...a, pass_status: "generated" } : a
          )
        );
        setCheckins((prev) => prev.filter((c) => c.attendee_id !== attendee.id));
      }
    } catch {
      setUndoingId(null);
    }
  }

  const [exportingReport, setExportingReport] = useState(false);
  const [exportingLog, setExportingLog] = useState(false);

  async function handleExportAttendeeReport() {
    setExportingReport(true);
    try {
      const res = await exportAttendeeCheckinReportCSV(event.id);
      setExportingReport(false);
      if (res?.error) {
        alert(res.error);
        return;
      }
      if (!res?.csv) {
        alert("No attendees to export.");
        return;
      }
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendee-checkin-report-${event.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportingReport(false);
      alert(err instanceof Error ? err.message : "Failed to export report");
    }
  }

  async function handleExportCheckinLog() {
    setExportingLog(true);
    try {
      const res = await exportCheckinsCSV(event.id);
      setExportingLog(false);
      if (res?.error) {
        alert(res.error);
        return;
      }
      if (!res?.csv) {
        alert("No check-ins recorded yet to export.");
        return;
      }
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `checkin-log-${event.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportingLog(false);
      alert(err instanceof Error ? err.message : "Failed to export log");
    }
  }

  const selectedMeta = selectedAttendee ? attendeeMetaMap.get(selectedAttendee.id) : null;

  return (
    <div className="max-w-5xl mx-auto page-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Gate Check-in & Attendance</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time entry verification, QR check-in counts & timestamp audit for {event.name}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200">
            {live ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-semibold text-[11px]">Live Sync</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-neutral-300 animate-pulse" />
                <span className="text-neutral-400 text-[11px]">Connecting…</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFullReportModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 px-3 py-2 rounded-xl transition-all hover:bg-neutral-50 shadow-2xs hover:border-neutral-300 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Full Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportAttendeeReport}
            disabled={exportingReport}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 px-3 py-2 rounded-xl transition-all hover:bg-neutral-50 shadow-2xs hover:border-neutral-300 disabled:opacity-50 cursor-pointer"
            title="Download complete report with total times checked in and all timestamps per attendee"
          >
            {exportingReport ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
            ) : (
              <Download className="w-3.5 h-3.5 text-brand" />
            )}
            <span>Export Report (CSV)</span>
          </button>

          <Link
            href={`/scan/${event.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl transition-all shadow-sm hover:opacity-95"
            style={{ background: "#6D28D9" }}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Open Scanner</span>
          </Link>
        </div>
      </div>

      {/* Primary Stat cards with QR Scan Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-5">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center mb-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{checkedInCount}</p>
          <p className="text-xs font-medium text-neutral-400 mt-0.5">Checked-in Guests</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center mb-2.5">
            <ScanLine className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-700 tabular-nums">{totalScansCount}</p>
          <p className="text-xs font-medium text-neutral-400 mt-0.5">Total QR Scans</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center mb-2.5">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{totalApproved - checkedInCount}</p>
          <p className="text-xs font-medium text-neutral-400 mt-0.5">Not Arrived</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center mb-2.5">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{totalApproved}</p>
          <p className="text-xs font-medium text-neutral-400 mt-0.5">Approved Passes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mb-2.5">
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{pct}%</p>
          <p className="text-xs font-medium text-neutral-400 mt-0.5">Attendance Rate</p>
        </div>
      </div>

      {/* Progress bar with multi-scan footnote */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 mb-5">
        <div className="flex items-start justify-between mb-3 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-neutral-900">Venue Attendance Progress</p>
              {multiScanCount > 0 && (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  {multiScanCount} Multi-Scanned
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {pct === 100
                ? "All approved attendees have checked in!"
                : `${totalApproved - checkedInCount} attendee${totalApproved - checkedInCount === 1 ? "" : "s"} still to arrive`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold tabular-nums">
              {checkedInCount}
              <span className="text-neutral-400 font-normal"> / {totalApproved} ({pct}%)</span>
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {totalScansCount} total QR gate check-in events
            </p>
          </div>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background:
                pct === 100
                  ? "linear-gradient(90deg, #10b981, #059669)"
                  : "linear-gradient(90deg, #6D28D9, #8B5CF6)",
            }}
          />
        </div>
      </div>

      {/* Multi-Session Attendance Section */}
      <SessionAttendanceSection
        eventId={event.id}
        eventName={event.name}
        approvedAttendeesCount={totalApproved}
        className="mb-5"
      />

      {/* Scanner Gates */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Scanner Entrance Gates</p>
            <p className="text-xs text-neutral-400 mt-0.5">Assign gates to monitor check-ins across multiple venue entrances</p>
          </div>
          <button
            onClick={() => {
              setGateFormOpen((o) => !o);
              setGateError("");
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add gate
          </button>
        </div>

        {/* Add gate form */}
        {gateFormOpen && (
          <div className="mb-4 p-3 bg-neutral-50 border border-neutral-100 rounded-xl flex flex-col gap-2.5">
            <input
              type="text"
              value={newGateName}
              onChange={(e) => setNewGateName(e.target.value)}
              placeholder="Gate name (e.g. Gate 1, VIP Entrance)"
              className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-brand transition-colors"
            />
            {zones.length > 0 && (
              <select
                value={newGateZoneId}
                onChange={(e) => setNewGateZoneId(e.target.value)}
                className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-brand transition-colors text-neutral-600"
              >
                <option value="">No zone restriction</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            )}
            {gateError && <p className="text-xs text-red-500">{gateError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleCreateGate}
                disabled={gateFormPending || !newGateName.trim()}
                className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#6D28D9" }}
              >
                {gateFormPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                Create
              </button>
              <button
                onClick={() => {
                  setGateFormOpen(false);
                  setNewGateName("");
                  setNewGateZoneId("");
                  setGateError("");
                }}
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Gate list */}
        {gates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center mb-2">
              <ScanLine className="w-5 h-5 text-neutral-300" />
            </div>
            <p className="text-sm text-neutral-500 font-medium">No custom gates configured</p>
            <p className="text-xs text-neutral-400 mt-0.5">Scans will be labeled as "Main Gate" by default</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gates.map((gate) => {
              const scannerUrl = `/scan/${event.id}?gate=${gate.id}`;
              const isCopied = copiedGateId === gate.id;
              const isDeleting = deletingGateId === gate.id;
              return (
                <div
                  key={gate.id}
                  className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{gate.name}</p>
                      {gate.zone && (
                        <p className="text-xs text-neutral-400 mt-0.5">Zone: {gate.zone.name}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteGate(gate.id)}
                      disabled={isDeleting}
                      className="shrink-0 p-1.5 text-neutral-300 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete gate"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={scannerUrl}
                      className="flex-1 text-center text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-brand border border-brand/20 bg-brand/5 hover:bg-brand/10 transition-colors truncate"
                    >
                      Open Scanner
                    </Link>
                    <button
                      onClick={() => handleCopyGateLink(gate.id)}
                      className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      {isCopied ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pass type breakdown */}
      {Object.keys(byType).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 mb-5">
          <p className="text-sm font-semibold text-neutral-900 mb-4">Attendance by Pass Type</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(byType).map(([type, { total, checkedIn }]) => {
              const typePct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
              return (
                <div key={type} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        PASS_TYPE_COLOR[type] ?? "bg-neutral-50 text-neutral-600 border-neutral-200"
                      }`}
                    >
                      {PASS_TYPE_LABEL[type] ?? type}
                    </span>
                    <span className="text-xs text-neutral-500 tabular-nums font-medium">
                      {checkedIn}/{total} ({typePct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${typePct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two-column: live feed + attendee checkin list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-neutral-800 uppercase tracking-wide">Live Check-in Feed</p>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {totalScansCount} scans
              </span>
            </div>
            <button
              onClick={handleExportCheckinLog}
              disabled={exportingLog}
              className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3 text-neutral-400" />
              <span>Export Log</span>
            </button>
          </div>
          <div className="divide-y divide-neutral-50 max-h-[520px] overflow-y-auto">
            {recentFeed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center mb-3">
                  <ScanLine className="w-5 h-5 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-500 font-medium">No check-ins yet</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Scanned passes will appear here in real-time with exact timestamp and gate name
                </p>
              </div>
            ) : (
              recentFeed.map((entry, i) => (
                <div
                  key={entry.id}
                  onClick={() => entry.attendee && setSelectedAttendee(entry.attendee)}
                  className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                  style={{ opacity: Math.max(0.5, 1 - i * 0.02) }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-brand transition-colors">
                          {entry.attendee?.name ?? "Guest Pass"}
                        </p>
                        {entry.scanCount > 1 && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-mono">
                            Scan #{entry.scanCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate">
                        {entry.attendee?.email ?? "QR Verified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-2 gap-0.5">
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                        PASS_TYPE_COLOR[entry.attendee?.pass_type ?? ""] ??
                        "bg-neutral-50 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      {PASS_TYPE_LABEL[entry.attendee?.pass_type ?? ""] ?? "General"}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {formatTime(entry.checked_in_at)}
                    </span>
                    {entry.gate?.name && (
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {entry.gate.name}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attendee Check-in List & Scans Per Attendee */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search attendee name, email, or phone…"
                className="w-full pl-8 pr-3 text-xs bg-white border border-neutral-200 rounded-xl py-2 outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* Quick status filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors shrink-0 ${
                  statusFilter === "all"
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                All ({attendees.length})
              </button>
              <button
                onClick={() => setStatusFilter("checked_in")}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors shrink-0 ${
                  statusFilter === "checked_in"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Checked In ({checkedInCount})
              </button>
              <button
                onClick={() => setStatusFilter("multi_scan")}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors shrink-0 ${
                  statusFilter === "multi_scan"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Multi-Scanned ({multiScanCount})
              </button>
              <button
                onClick={() => setStatusFilter("not_arrived")}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors shrink-0 ${
                  statusFilter === "not_arrived"
                    ? "bg-amber-600 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Not Arrived ({totalApproved - checkedInCount})
              </button>
            </div>
          </div>

          <div className="divide-y divide-neutral-50 max-h-[520px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-500 font-medium">No attendees match your search</p>
                <p className="text-xs text-neutral-400 mt-1">Try resetting the filter or search query</p>
              </div>
            ) : (
              filtered.map((a) => {
                const meta = attendeeMetaMap.get(a.id);
                const isIn = meta?.isCheckedIn ?? false;
                const isChecking = checkingInId === a.id;
                const scanCount = meta?.scanCount ?? 0;

                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/70 transition-colors"
                  >
                    <div
                      onClick={() => setSelectedAttendee(a)}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1 group"
                    >
                      {isIn ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-neutral-300 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-brand transition-colors">
                            {a.name}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              PASS_TYPE_COLOR[a.pass_type] ??
                              "bg-neutral-50 text-neutral-600 border-neutral-200"
                            }`}
                          >
                            {PASS_TYPE_LABEL[a.pass_type] ?? a.pass_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                          <span className="truncate">{a.email}</span>
                          {isIn && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-emerald-600">
                                {scanCount} {scanCount === 1 ? "check-in" : "check-ins"}
                              </span>
                              {meta?.lastScannedAt && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-[11px] text-neutral-400">
                                    {formatTime(meta.lastScannedAt)}
                                  </span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <button
                        onClick={() => setSelectedAttendee(a)}
                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg text-neutral-600 hover:text-brand hover:bg-brand/5 border border-neutral-200 transition-colors cursor-pointer"
                        title="View timestamps and check-in audit"
                      >
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>Timestamps</span>
                      </button>

                      {isIn ? (
                        <button
                          onClick={() => handleUndoCheckIn(a)}
                          disabled={undoingId === a.id}
                          title="Undo check-in (allow re-entry)"
                          className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 border border-neutral-200 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                        >
                          {undoingId === a.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3 h-3" />
                          )}
                          <span className="hidden sm:inline">Undo</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleManualCheckIn(a)}
                          disabled={isChecking}
                          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-brand/5 text-brand border border-brand/20 hover:bg-brand/10 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                        >
                          {isChecking ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          <span className="hidden sm:inline">Check in</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. Attendee Detail & Timestamps Modal */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedAttendee && selectedMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/70">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900 truncate">
                    {selectedAttendee.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      PASS_TYPE_COLOR[selectedAttendee.pass_type] ??
                      "bg-neutral-50 text-neutral-600 border-neutral-200"
                    }`}
                  >
                    {PASS_TYPE_LABEL[selectedAttendee.pass_type] ?? selectedAttendee.pass_type}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{selectedAttendee.email}</p>
                {selectedAttendee.phone && (
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{selectedAttendee.phone}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedAttendee(null)}
                className="p-1 rounded-xl hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Highlight summary cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Total Times Checked In
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-indigo-900 font-mono">
                      {selectedMeta.scanCount}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600">
                      {selectedMeta.scanCount === 1 ? "Check-in" : "Check-ins"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Entry Status
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selectedMeta.isCheckedIn ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-700">Admitted</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-bold text-neutral-500">Not Arrived</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* First & Latest Scan Info */}
              {selectedMeta.isCheckedIn && (
                <div className="p-3 rounded-2xl bg-white border border-neutral-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 font-medium">First Check-in</span>
                    <span className="font-semibold text-neutral-800 font-mono">
                      {selectedMeta.firstScannedAt ? formatFullDateTime(selectedMeta.firstScannedAt) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 font-medium">Entrance Gate</span>
                    <span className="font-semibold text-neutral-800">{selectedMeta.firstGate}</span>
                  </div>
                  {selectedMeta.scanCount > 1 && (
                    <>
                      <div className="border-t border-neutral-100 my-1" />
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 font-medium">Latest Check-in</span>
                        <span className="font-semibold text-indigo-700 font-mono">
                          {selectedMeta.lastScannedAt ? formatFullDateTime(selectedMeta.lastScannedAt) : "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 font-medium">Latest Gate</span>
                        <span className="font-semibold text-indigo-700">{selectedMeta.latestGate}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Complete Chronological Timestamps Log */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    Complete Check-in Timestamps Log
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    {selectedMeta.history.length} record{selectedMeta.history.length === 1 ? "" : "s"}
                  </span>
                </div>

                {selectedMeta.history.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-neutral-200 text-center text-xs text-neutral-400">
                    No check-in timestamp records recorded yet.
                  </div>
                ) : (
                  <div className="rounded-xl border border-neutral-100 divide-y divide-neutral-50 overflow-hidden text-xs">
                    {selectedMeta.history.map((record, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] flex items-center justify-center font-mono">
                            {record.scan_number || idx + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-neutral-800">
                              Scan #{record.scan_number || idx + 1}
                              {record.gate_name ? ` · ${record.gate_name}` : ""}
                            </p>
                            <p className="text-[10px] text-neutral-400 capitalize">
                              Method: {record.method || "QR Scanner"}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-neutral-600">
                          {formatFullDateTime(record.scanned_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              {selectedMeta.isCheckedIn ? (
                <button
                  onClick={() => {
                    handleUndoCheckIn(selectedAttendee);
                    setSelectedAttendee(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Check-in</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleManualCheckIn(selectedAttendee);
                    setSelectedAttendee(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-white bg-brand hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Manual Check In Now</span>
                </button>
              )}

              <button
                onClick={() => setSelectedAttendee(null)}
                className="text-xs font-semibold px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-200/50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. Full Attendee Check-in Report Modal */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showFullReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand" />
                  Attendee Gate Check-in & Timestamps Audit Report
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Complete report showing scan counts and timestamp logs for all {attendees.length} attendees
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportAttendeeReport}
                  disabled={exportingReport}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand text-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {exportingReport ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={() => setShowFullReportModal(false)}
                  className="p-1.5 rounded-xl hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-neutral-100 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  placeholder="Filter attendees in report…"
                  className="w-full pl-8 pr-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl py-2 outline-none focus:border-brand transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                <span>Total Checked In: <strong className="text-emerald-600">{checkedInCount}</strong></span>
                <span>•</span>
                <span>Total Scans: <strong className="text-indigo-600">{totalScansCount}</strong></span>
                <span>•</span>
                <span>Multi-scans: <strong className="text-purple-600">{multiScanCount}</strong></span>
              </div>
            </div>

            {/* Report Table */}
            <div className="overflow-x-auto overflow-y-auto flex-1 divide-y divide-neutral-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-neutral-50 sticky top-0 text-[10px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100">
                  <tr>
                    <th className="py-2.5 px-4">Attendee Name</th>
                    <th className="py-2.5 px-4">Pass Type</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-center">Check-in Count</th>
                    <th className="py-2.5 px-4">First Check-in Time</th>
                    <th className="py-2.5 px-4">Latest Check-in Time</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {attendees
                    .filter((a) => {
                      if (!reportSearch) return true;
                      const q = reportSearch.toLowerCase().trim();
                      return (
                        a.name.toLowerCase().includes(q) ||
                        a.email.toLowerCase().includes(q) ||
                        (a.phone && a.phone.includes(q))
                      );
                    })
                    .map((a) => {
                      const meta = attendeeMetaMap.get(a.id);
                      const isChecked = meta?.isCheckedIn ?? false;
                      const scanCount = meta?.scanCount ?? 0;

                      return (
                        <tr key={a.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="py-2.5 px-4">
                            <p className="font-semibold text-neutral-900">{a.name}</p>
                            <p className="text-[11px] text-neutral-400">{a.email}</p>
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                PASS_TYPE_COLOR[a.pass_type] ??
                                "bg-neutral-50 text-neutral-600 border-neutral-200"
                              }`}
                            >
                              {PASS_TYPE_LABEL[a.pass_type] ?? a.pass_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            {isChecked ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Checked In
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-neutral-400">
                                Not Arrived
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {isChecked ? (
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[11px] font-mono ${
                                  scanCount > 1
                                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {scanCount} {scanCount === 1 ? "time" : "times"}
                              </span>
                            ) : (
                              <span className="text-neutral-300 font-mono">0</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-600">
                            {meta?.firstScannedAt ? (
                              <div>
                                <p>{formatFullDateTime(meta.firstScannedAt)}</p>
                                <p className="text-[10px] text-neutral-400 font-sans">{meta.firstGate}</p>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-600">
                            {meta?.lastScannedAt ? (
                              <div>
                                <p>{formatFullDateTime(meta.lastScannedAt)}</p>
                                <p className="text-[10px] text-neutral-400 font-sans">{meta.latestGate}</p>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedAttendee(a);
                              }}
                              className="text-[11px] font-semibold text-brand hover:underline cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Total Attendees Listed: {attendees.length}
              </span>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
