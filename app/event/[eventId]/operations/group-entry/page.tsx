"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  DoorOpen,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  Edit2,
  Check,
  X,
  Loader2,
  Share2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface GroupBookingItem {
  id: string;
  bookingReference: string;
  buyerName: string;
  buyerEmail: string;
  ticketType: string;
  totalEntitlements: number;
  admittedEntitlements: number;
  remainingEntitlements: number;
  currentlyInside: number;
  status: "UNUSED" | "PARTIALLY_USED" | "FULLY_USED" | "REFUNDED" | "CANCELLED";
  rawStatus: string;
  lastAdmittedAt?: string;
}

interface GroupAdmissionHistoryItem {
  id: string;
  bookingReference: string;
  admittedCount: number;
  totalEntitlements: number;
  previouslyAdmitted: number;
  remainingAfter: number;
  gateName: string;
  operatorEmail: string;
  deviceId: string;
  admittedAt: string;
}

export default function GroupEntryOperationsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 4,
    totalEntitlements: 27,
    totalAdmitted: 14,
    totalRemaining: 13,
    totalCurrentlyInside: 14,
    fullyUsedCount: 1,
    partiallyUsedCount: 2,
    unusedCount: 1,
  });

  const [bookings, setBookings] = useState<GroupBookingItem[]>([
    {
      id: "demo-1",
      bookingReference: "URP-GRP-10021",
      buyerName: "Arun Kumar",
      buyerEmail: "arun.kumar@example.com",
      ticketType: "General Admission · Group Booking",
      totalEntitlements: 10,
      admittedEntitlements: 6,
      remainingEntitlements: 4,
      currentlyInside: 6,
      status: "PARTIALLY_USED",
      rawStatus: "paid",
    },
    {
      id: "demo-2",
      bookingReference: "URP-GRP-10022",
      buyerName: "Priya S",
      buyerEmail: "priya.s@example.com",
      ticketType: "VIP Pass · Group Booking",
      totalEntitlements: 5,
      admittedEntitlements: 5,
      remainingEntitlements: 0,
      currentlyInside: 5,
      status: "FULLY_USED",
      rawStatus: "paid",
    },
    {
      id: "demo-3",
      bookingReference: "URP-GRP-10023",
      buyerName: "Vikram R",
      buyerEmail: "vikram.r@example.com",
      ticketType: "General Admission · Group Booking",
      totalEntitlements: 8,
      admittedEntitlements: 3,
      remainingEntitlements: 5,
      currentlyInside: 3,
      status: "PARTIALLY_USED",
      rawStatus: "paid",
    },
    {
      id: "demo-4",
      bookingReference: "URP-GRP-10024",
      buyerName: "Rahul M",
      buyerEmail: "rahul.m@example.com",
      ticketType: "General Admission · Group Booking",
      totalEntitlements: 4,
      admittedEntitlements: 0,
      remainingEntitlements: 4,
      currentlyInside: 0,
      status: "UNUSED",
      rawStatus: "paid",
    },
  ]);

  const [admissionHistory, setAdmissionHistory] = useState<GroupAdmissionHistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "FULLY_USED" | "PARTIALLY_USED" | "UNUSED">("ALL");

  // Supervisor correction modal
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [selectedBookingForCorrection, setSelectedBookingForCorrection] = useState<GroupBookingItem | null>(null);
  const [newAdmittedCount, setNewAdmittedCount] = useState<number>(0);
  const [auditReason, setAuditReason] = useState("");
  const [correctionPending, setCorrectionPending] = useState(false);
  const [correctionError, setCorrectionError] = useState("");
  const [correctionSuccess, setCorrectionSuccess] = useState("");

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/events/${eventId}/group-entry`);
      const data = await res.json();
      if (data.success) {
        if (data.stats) setStats(data.stats);
        if (data.bookings && data.bookings.length > 0) setBookings(data.bookings);
        if (data.admissionHistory) setAdmissionHistory(data.admissionHistory);
      }
    } catch {
      // Keep illustrative defaults
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Supabase realtime listener on group_entry_admissions table
    const supabase = createClient();
    const channel = supabase
      .channel(`group-entry-live-${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_entry_admissions", filter: `event_id=eq.${eventId}` },
        () => {
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ticket_orders", filter: `event_id=eq.${eventId}` },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        search.trim() === "" ||
        b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
        b.buyerName.toLowerCase().includes(search.toLowerCase()) ||
        b.buyerEmail.toLowerCase().includes(search.toLowerCase()) ||
        b.ticketType.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "FULLY_USED" && b.status === "FULLY_USED") ||
        (statusFilter === "PARTIALLY_USED" && b.status === "PARTIALLY_USED") ||
        (statusFilter === "UNUSED" && b.status === "UNUSED");

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Booking Reference",
      "Buyer Name",
      "Buyer Email",
      "Ticket Type",
      "Total Entitlements",
      "Admitted (Used)",
      "Remaining",
      "Currently Inside Venue",
      "Status",
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.bookingReference}"`,
      `"${b.buyerName}"`,
      `"${b.buyerEmail}"`,
      `"${b.ticketType}"`,
      b.totalEntitlements,
      b.admittedEntitlements,
      b.remainingEntitlements,
      b.currentlyInside,
      `"${b.status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `group_entry_ledger_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openSupervisorCorrection = (booking: GroupBookingItem) => {
    setSelectedBookingForCorrection(booking);
    setNewAdmittedCount(booking.admittedEntitlements);
    setAuditReason("");
    setCorrectionError("");
    setCorrectionSuccess("");
    setCorrectionModalOpen(true);
  };

  const handleApplyCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForCorrection) return;

    if (!auditReason.trim()) {
      setCorrectionError("Audit reason is required for supervisory admission corrections.");
      return;
    }

    setCorrectionPending(true);
    setCorrectionError("");

    try {
      const res = await fetch(`/api/events/${eventId}/group-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "supervisor_correction",
          bookingReference: selectedBookingForCorrection.bookingReference,
          correctionQuantity: newAdmittedCount,
          auditReason: auditReason.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCorrectionSuccess(data.message || "Correction applied successfully.");
        // Optimistic update
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingReference === selectedBookingForCorrection.bookingReference
              ? {
                  ...b,
                  admittedEntitlements: newAdmittedCount,
                  remainingEntitlements: b.totalEntitlements - newAdmittedCount,
                  currentlyInside: newAdmittedCount,
                  status:
                    newAdmittedCount === b.totalEntitlements
                      ? "FULLY_USED"
                      : newAdmittedCount > 0
                      ? "PARTIALLY_USED"
                      : "UNUSED",
                }
              : b
          )
        );
        setTimeout(() => {
          setCorrectionModalOpen(false);
          fetchData();
        }, 1500);
      } else {
        setCorrectionError(data.error || "Failed to apply supervisory correction.");
      }
    } catch {
      setCorrectionError("Network error while submitting correction.");
    } finally {
      setCorrectionPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header & Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Group Entry Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase">
              Module M14
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Event Operations · Real-time group QR balances, partial admissions, and gate-level audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href={`/scan/${eventId}`}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Launch Scanner</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Bookings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Group Bookings</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2 tabular-nums">
            {stats.totalBookings}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Multi-entry passes</p>
        </div>

        {/* Total Entitlements */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Entitlements</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2 tabular-nums">
            {stats.totalEntitlements}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Purchased headcounts</p>
        </div>

        {/* Admitted First Entries */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-200 shadow-2xs bg-purple-50/20">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-[10px] uppercase font-bold tracking-wider">Admitted</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-2 tabular-nums">
            {stats.totalAdmitted}
          </p>
          <p className="text-[11px] text-purple-600/80 mt-1">First-entry used</p>
        </div>

        {/* Remaining First Entries */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] uppercase font-bold tracking-wider">Remaining</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2 tabular-nums">
            {stats.totalRemaining}
          </p>
          <p className="text-[11px] text-emerald-600/80 mt-1">Unused first entries</p>
        </div>

        {/* Inside Venue Now (Distinction from Entitlements Used) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Inside Venue</span>
            <DoorOpen className="w-4 h-4 text-neutral-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2 tabular-nums">
            {stats.totalCurrentlyInside}
          </p>
          <p className="text-[10px] text-neutral-400 mt-1">
            Accounts for exits &amp; re-entries
          </p>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking ID, purchaser name or ticket type…"
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            All Passes ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter("PARTIALLY_USED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "PARTIALLY_USED"
                ? "bg-purple-600 text-white"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          >
            Partially Used ({stats.partiallyUsedCount})
          </button>
          <button
            onClick={() => setStatusFilter("FULLY_USED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "FULLY_USED"
                ? "bg-neutral-700 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            Fully Used ({stats.fullyUsedCount})
          </button>
          <button
            onClick={() => setStatusFilter("UNUSED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "UNUSED"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Unused ({stats.unusedCount})
          </button>
        </div>
      </div>

      {/* ── Group Bookings Ledger Table ── */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Group Booking Entitlements Ledger</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live balances for all multi-person bookings. Supervisors can perform audited corrections.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-neutral-500">
            {filteredBookings.length} bookings shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-400 tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Purchaser</th>
                <th className="py-3 px-4">Ticket Tier</th>
                <th className="py-3 px-4 text-center">Entitlements Progress</th>
                <th className="py-3 px-4 text-center">Inside Now</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400 italic">
                    No group bookings found matching your search filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const pct = b.totalEntitlements > 0 ? Math.round((b.admittedEntitlements / b.totalEntitlements) * 100) : 0;
                  return (
                    <tr key={b.bookingReference} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                        {b.bookingReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900">{b.buyerName}</div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">{b.buyerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 font-medium">
                        {b.ticketType}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-40 mx-auto">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span className="text-purple-700">{b.admittedEntitlements}/{b.totalEntitlements} Used</span>
                            <span className="text-neutral-400 font-normal">{b.remainingEntitlements} left</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                b.remainingEntitlements === 0
                                  ? "bg-neutral-800"
                                  : "bg-purple-600"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-full text-[11px]">
                          <DoorOpen className="w-3 h-3 text-neutral-500" />
                          {b.currentlyInside} inside
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === "FULLY_USED"
                              ? "bg-neutral-100 text-neutral-700 border border-neutral-200"
                              : b.status === "PARTIALLY_USED"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openSupervisorCorrection(b)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-neutral-400" />
                          <span>Correct</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Gate-wise Group Admission Audit History ── */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-neutral-900">Gate-Wise Group Admission History</h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {admissionHistory.length} recorded entry batches
          </span>
        </div>

        {admissionHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            No gate entry batches recorded yet today. Scans performed in UrPass One will log here in real-time.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
            {admissionHistory.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-900">+{log.admittedCount} Attendees Admitted</span>
                    <span className="text-neutral-500 mx-1.5">for</span>
                    <span className="font-mono font-semibold text-purple-700">{log.bookingReference}</span>
                    <span className="text-neutral-400 ml-2">({log.remainingAfter} remaining)</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
                  <span>🚪 {log.gateName}</span>
                  <span className="hidden sm:inline">👤 {log.operatorEmail}</span>
                  <span className="font-mono">{new Date(log.admittedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Supervisor Correction Modal ── */}
      {correctionModalOpen && selectedBookingForCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setCorrectionModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Supervisor Admission Correction</h3>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Booking {selectedBookingForCorrection.bookingReference}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Correct erroneous admissions recorded at gates. Any balance change is committed to the immutable audit ledger with a mandatory supervisor rationale.
            </p>

            {correctionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{correctionError}</span>
              </div>
            )}

            {correctionSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{correctionSuccess}</span>
              </div>
            )}

            <form onSubmit={handleApplyCorrection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Admitted Entitlements Count (0 to {selectedBookingForCorrection.totalEntitlements})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={selectedBookingForCorrection.totalEntitlements}
                    value={newAdmittedCount}
                    onChange={(e) => setNewAdmittedCount(Number(e.target.value))}
                    className="w-24 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-center font-bold text-base text-neutral-900 outline-none focus:border-purple-500"
                  />
                  <span className="text-xs text-neutral-500">
                    Will leave <strong>{selectedBookingForCorrection.totalEntitlements - newAdmittedCount}</strong> remaining entries.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mandatory Audit Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  placeholder="e.g. Gate A scanner typed 8 instead of 6 attendees at 18:30"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:border-purple-500 placeholder:text-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={correctionPending}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {correctionPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Commit Correction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
