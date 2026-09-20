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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { createGate, deleteGate } from "@/app/actions/scanner-gates";
import { manualCheckIn } from "@/app/actions/manual-checkin";

type PassType = "participant" | "vip" | "speaker" | "organizer";

interface Attendee {
  id: string;
  name: string;
  email: string;
  pass_type: PassType;
  pass_status: string;
  application_status: string;
}

interface Checkin {
  id: string;
  attendee_id: string;
  checked_in_at: string;
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

  const checkinSet = new Set(checkins.map((c) => c.attendee_id));
  const checkedInCount = checkins.length;
  const totalApproved = attendees.length;
  const pct = totalApproved > 0 ? Math.round((checkedInCount / totalApproved) * 100) : 0;

  const byType = attendees.reduce<Record<string, { total: number; checkedIn: number }>>((acc, a) => {
    if (!acc[a.pass_type]) acc[a.pass_type] = { total: 0, checkedIn: 0 };
    acc[a.pass_type].total++;
    if (checkinSet.has(a.id)) acc[a.pass_type].checkedIn++;
    return acc;
  }, {});

  const recentFeed = checkins.slice(0, 20).map((c) => {
    const att = attendees.find((a) => a.id === c.attendee_id);
    return { ...c, attendee: att };
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
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => { supabase.removeChannel(channel); };
  }, [event.id]);

  const filtered = attendees.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });

  async function handleCreateGate() {
    if (!newGateName.trim()) return;
    setGateError("");
    startGateTransition(async () => {
      const result = await createGate(event.id, newGateName.trim(), newGateZoneId || undefined);
      if (result.error) {
        setGateError(result.error);
        return;
      }
      // Optimistically add the new gate to local state
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
    });
  }

  async function handleDeleteGate(gateId: string) {
    if (!window.confirm("Delete this gate? The scanner link will stop working.")) return;
    setDeletingGateId(gateId);
    const result = await deleteGate(gateId);
    setDeletingGateId(null);
    if (!result.error) {
      setGates((prev) => prev.filter((g) => g.id !== gateId));
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
    const result = await manualCheckIn(attendee.id, event.id);
    setCheckingInId(null);

    if (result.success || result.alreadyCheckedIn) {
      // Update local state optimistically
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === attendee.id ? { ...a, pass_status: "checked_in" } : a
        )
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto page-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Check-in Dashboard</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Real-time entry tracking for {event.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            {live ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 font-medium">Live</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-neutral-300 animate-pulse" />
                <span className="text-neutral-400">Connecting…</span>
              </>
            )}
          </div>
          <Link
            href={`/scan/${event.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "#6D28D9" }}
          >
            <ScanLine className="w-3.5 h-3.5" />
            Open Scanner
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{checkedInCount}</p>
          <p className="text-xs text-neutral-400 mt-0.5">Checked in</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{totalApproved - checkedInCount}</p>
          <p className="text-xs text-neutral-400 mt-0.5">Not arrived</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-brand" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{totalApproved}</p>
          <p className="text-xs text-neutral-400 mt-0.5">Approved passes</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{pct}%</p>
          <p className="text-xs text-neutral-400 mt-0.5">Check-in rate</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
        <div className="flex items-start justify-between mb-3 gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Check-in progress</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {pct === 100
                ? "All approved attendees have checked in!"
                : `${totalApproved - checkedInCount} attendee${totalApproved - checkedInCount === 1 ? "" : "s"} still to arrive`}
            </p>
          </div>
          <p className="text-sm font-bold tabular-nums shrink-0">
            {checkedInCount}
            <span className="text-neutral-400 font-normal"> / {totalApproved}</span>
          </p>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? "linear-gradient(90deg, #10b981, #059669)"
                : "linear-gradient(90deg, #6D28D9, #8B5CF6)",
            }}
          />
        </div>
      </div>

      {/* Scanner Gates */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-neutral-900">Scanner Gates</p>
          <button
            onClick={() => { setGateFormOpen((o) => !o); setGateError(""); }}
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
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            )}
            {gateError && (
              <p className="text-xs text-red-500">{gateError}</p>
            )}
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
                onClick={() => { setGateFormOpen(false); setNewGateName(""); setNewGateZoneId(""); setGateError(""); }}
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Gate list */}
        {gates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center mb-2">
              <ScanLine className="w-5 h-5 text-neutral-200" />
            </div>
            <p className="text-sm text-neutral-400">No gates yet</p>
            <p className="text-xs text-neutral-300 mt-1">Add gates to assign scanners to specific entry points</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gates.map((gate) => {
              const scannerUrl = `/scan/${event.id}?gate=${gate.id}`;
              const isCopied = copiedGateId === gate.id;
              const isDeleting = deletingGateId === gate.id;
              return (
                <div key={gate.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 flex flex-col gap-3">
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
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
          <p className="text-sm font-semibold text-neutral-900 mb-4">By pass type</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(byType).map(([type, { total, checkedIn }]) => {
              const typePct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
              return (
                <div key={type} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PASS_TYPE_COLOR[type] ?? "bg-neutral-50 text-neutral-600 border-neutral-200"}`}>
                      {PASS_TYPE_LABEL[type] ?? type}
                    </span>
                    <span className="text-xs text-neutral-500 tabular-nums font-medium">{checkedIn}/{total}</span>
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

      {/* Two-column: feed + attendee list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Live feed */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-50">
            <p className="text-xs font-semibold text-neutral-700">Recent check-ins</p>
            <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {checkedInCount} total
            </span>
          </div>
          <div className="divide-y divide-neutral-50 max-h-96 overflow-y-auto">
            {recentFeed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center mb-3">
                  <ScanLine className="w-5 h-5 text-neutral-200" />
                </div>
                <p className="text-sm text-neutral-400">No check-ins yet</p>
                <p className="text-xs text-neutral-300 mt-1">Scans will appear here in real-time</p>
              </div>
            ) : (
              recentFeed.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/60 transition-colors"
                  style={{ opacity: Math.max(0.5, 1 - i * 0.04) }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {entry.attendee?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {entry.attendee?.email ?? ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-2 gap-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${PASS_TYPE_COLOR[entry.attendee?.pass_type ?? ""] ?? "bg-neutral-50 text-neutral-500 border-neutral-200"}`}>
                      {PASS_TYPE_LABEL[entry.attendee?.pass_type ?? ""] ?? "—"}
                    </span>
                    <span className="text-[10px] text-neutral-300">{formatTime(entry.checked_in_at)}</span>
                    {entry.gate?.name && (
                      <span className="text-[10px] text-neutral-300">{entry.gate.name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attendee list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-neutral-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search attendees…"
                className="w-full pl-8 pr-3 text-xs bg-neutral-50 border border-neutral-100 rounded-xl py-2 outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>
          <div className="divide-y divide-neutral-50 max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-neutral-200" />
                </div>
                <p className="text-sm text-neutral-400">No attendees found</p>
              </div>
            ) : (
              filtered.map((a) => {
                const isIn = checkinSet.has(a.id) || a.pass_status === "checked_in";
                const isChecking = checkingInId === a.id;
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isIn ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-neutral-200 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{a.name}</p>
                        <p className="text-xs text-neutral-400 truncate">{a.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${PASS_TYPE_COLOR[a.pass_type] ?? "bg-neutral-50 text-neutral-500 border-neutral-200"}`}>
                          {PASS_TYPE_LABEL[a.pass_type] ?? a.pass_type}
                        </span>
                        <span className={`text-[10px] font-semibold ${isIn ? "text-emerald-500" : "text-neutral-300"}`}>
                          {isIn ? "Checked in" : "Not arrived"}
                        </span>
                      </div>
                      {!isIn && (
                        <button
                          onClick={() => handleManualCheckIn(a)}
                          disabled={isChecking}
                          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-brand/5 text-brand border border-brand/20 hover:bg-brand/10 transition-colors disabled:opacity-50 shrink-0"
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
    </div>
  );
}
