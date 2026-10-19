"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Users,
  Smartphone,
  ExternalLink,
  Upload,
  RotateCcw,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCheck,
  Info,
  Filter,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import WhatsAppLogo from "@/components/icons/WhatsAppLogo";
import {
  getBulkWhatsAppAudience,
  sendBulkWhatsAppInvitations,
  type BulkWhatsAppAudienceItem,
  type BulkWhatsAppAudienceReport,
  type SendBulkWhatsAppResult,
} from "@/app/actions/bulk-whatsapp";

interface Props {
  eventId: string;
  eventName: string;
  eventDate?: string | null;
  venue?: string | null;
}

export default function WhatsAppBulkInviteCard({
  eventId,
  eventName,
  eventDate,
  venue,
}: Props) {
  const [data, setData] = useState<BulkWhatsAppAudienceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection & filtering state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"eligible" | "all" | "sent" | "failed" | "invalid">("eligible");

  // Preview modal & drawer toggle
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Dispatch state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [singleDispatchingId, setSingleDispatchingId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SendBulkWhatsAppResult | null>(null);

  async function loadAudience() {
    setLoading(true);
    setError(null);
    try {
      const res = await getBulkWhatsAppAudience(eventId);
      if ("error" in res) {
        setError(res.error);
      } else {
        setData(res);
        // Default selection: select all eligible recipients
        const eligibleIds = new Set(res.audience.filter((a) => a.eligible).map((a) => a.id));
        setSelectedIds(eligibleIds);
      }
    } catch {
      setError("Failed to load audience for WhatsApp broadcast.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAudience();
  }, [eventId]);

  const audience = data?.audience || [];
  const summary = data?.summary || {
    totalAttendees: 0,
    eligibleCount: 0,
    alreadySentCount: 0,
    failedCount: 0,
    invalidPhoneCount: 0,
    duplicatePhoneCount: 0,
  };

  // Filtered audience
  const filteredList = useMemo(() => {
    return audience.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        const matchName = (a.name || "").toLowerCase().includes(q);
        const matchPhone = (a.phone || "").toLowerCase().includes(q);
        const matchEmail = (a.email || "").toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail) return false;
      }

      if (filterTab === "eligible") return a.eligible;
      if (filterTab === "sent") return ["SENT", "DELIVERED", "READ"].includes(a.deliveryStatus);
      if (filterTab === "failed") return a.deliveryStatus === "FAILED";
      if (filterTab === "invalid") return !a.isValidPhone;
      return true;
    });
  }, [audience, search, filterTab]);

  const allFilteredEligibleSelected = useMemo(() => {
    const eligibleInView = filteredList.filter((a) => a.eligible);
    return eligibleInView.length > 0 && eligibleInView.every((a) => selectedIds.has(a.id));
  }, [filteredList, selectedIds]);

  function toggleSelectAllEligible() {
    const eligibleInView = filteredList.filter((a) => a.eligible);
    const newSet = new Set(selectedIds);
    if (allFilteredEligibleSelected) {
      eligibleInView.forEach((a) => newSet.delete(a.id));
    } else {
      eligibleInView.forEach((a) => newSet.add(a.id));
    }
    setSelectedIds(newSet);
  }

  function toggleSelect(id: string) {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  }

  async function handleDispatch(forceRetry = false) {
    setConfirmOpen(false);
    setDispatching(true);
    setLastResult(null);

    const idsToSend = forceRetry
      ? audience.filter((a) => a.deliveryStatus === "FAILED").map((a) => a.id)
      : Array.from(selectedIds);

    try {
      const res = await sendBulkWhatsAppInvitations({
        eventId,
        recipientAttendeeIds: idsToSend,
        forceRetry,
      });

      setLastResult(res);
      await loadAudience();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to execute WhatsApp broadcast");
    } finally {
      setDispatching(false);
    }
  }

  async function handleSendSingle(attendeeId: string) {
    setSingleDispatchingId(attendeeId);
    try {
      const res = await sendBulkWhatsAppInvitations({
        eventId,
        recipientAttendeeIds: [attendeeId],
        forceRetry: true,
      });
      setLastResult(res);
      await loadAudience();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to dispatch WhatsApp ticket to attendee");
    } finally {
      setSingleDispatchingId(null);
    }
  }

  const deliveryRate = summary.totalAttendees > 0
    ? Math.round((summary.alreadySentCount / summary.totalAttendees) * 100)
    : 0;

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Confirmed on Pass";

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all">
      {/* ── Top Corporate Banner Header ── */}
      <div className="p-6 border-b border-neutral-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-emerald-50/50 via-white to-neutral-50/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
            <WhatsAppLogo size={28} variant="white" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">
                Meta WhatsApp Direct Pass Dispatch
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Cloud API Gateway
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              Official WhatsApp Business Cloud API integration. Delivers tamper-proof mobile QR passes directly to attendee WhatsApp inboxes using approved Meta message templates.
            </p>
          </div>
        </div>

        {/* Corporate Controls / Badges */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="h-9 px-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs hover:border-neutral-300 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Preview Template</span>
          </button>

          <Link
            href={`/event/${eventId}/attendees`}
            className="h-9 px-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs hover:border-neutral-300"
          >
            <Upload className="w-4 h-4 text-neutral-500" />
            <span>Import CSV</span>
          </Link>

          <button
            type="button"
            onClick={loadAudience}
            disabled={loading || dispatching}
            className="h-9 w-9 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 flex items-center justify-center transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Refresh audience and delivery status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-neutral-100 border-b border-neutral-100 bg-neutral-50/30 text-left">
        <div className="p-4">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Registered Guests</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">{summary.totalAttendees}</span>
            <span className="text-xs text-neutral-400">total</span>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/20">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Ready to Send
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-emerald-700">{summary.eligibleCount}</span>
            <span className="text-xs text-emerald-600 font-medium">guests</span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
            Delivered Passes
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">{summary.alreadySentCount}</span>
            <span className="text-xs text-neutral-400">({deliveryRate}%)</span>
          </div>
        </div>

        <div className={`p-4 ${summary.failedCount > 0 ? "bg-amber-50/40" : ""}`}>
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
            Failed / Actionable
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold tracking-tight ${summary.failedCount > 0 ? "text-amber-700" : "text-neutral-900"}`}>
              {summary.failedCount}
            </span>
            {summary.failedCount > 0 && (
              <span className="text-xs font-semibold text-amber-600">retry ready</span>
            )}
          </div>
        </div>

        <div className="p-4 col-span-2 md:col-span-1">
          <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">Invalid Phone</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-red-600">{summary.invalidPhoneCount}</span>
            <span className="text-xs text-red-400">cannot send</span>
          </div>
        </div>
      </div>

      {/* ── Dynamic Result Banner ── */}
      {lastResult && (
        <div
          className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            lastResult.failedCount === 0
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
              : "bg-amber-50/80 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-start gap-3">
            {lastResult.failedCount === 0 ? (
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <div>
              <p className="font-bold text-sm">
                WhatsApp Dispatch Completed: {lastResult.sentCount} invitation{lastResult.sentCount === 1 ? "" : "s"} sent
              </p>
              <p className="text-xs opacity-90 mt-0.5">
                {lastResult.failedCount > 0 && `${lastResult.failedCount} failed delivery. `}
                {lastResult.skippedCount > 0 && `${lastResult.skippedCount} skipped (already delivered or duplicates). `}
                Meta Cloud API message receipts recorded.
              </p>
              {lastResult.failedCount > 0 && (
                <p className="text-[11px] font-mono mt-1 text-amber-950 bg-amber-100/70 px-2 py-0.5 rounded-md inline-block">
                  Detail: {lastResult.results.find((r) => r.status === "FAILED")?.error || "Provider rejected delivery"}
                </p>
              )}
            </div>
          </div>

          {lastResult.failedCount > 0 && (
            <button
              type="button"
              onClick={() => handleDispatch(true)}
              disabled={dispatching}
              className="h-8 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry {lastResult.failedCount} Failed</span>
            </button>
          )}
        </div>
      )}

      {/* ── Audience Controls: Tabs & Search ── */}
      <div className="p-4 border-b border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFilterTab("eligible")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === "eligible"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            <span>Ready to Send</span>
            <span className={`px-2 py-0.5 leading-none rounded-full text-[10px] font-bold ${
              filterTab === "eligible" ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
            }`}>
              {summary.eligibleCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === "all"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            <span>All Guests</span>
            <span className={`px-2 py-0.5 leading-none rounded-full text-[10px] font-bold ${
              filterTab === "all" ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
            }`}>
              {summary.totalAttendees}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("sent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === "sent"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            <span>Delivered</span>
            <span className={`px-2 py-0.5 leading-none rounded-full text-[10px] font-bold ${
              filterTab === "sent" ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
            }`}>
              {summary.alreadySentCount}
            </span>
          </button>

          {summary.failedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab("failed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === "failed"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <span>Failed</span>
              <span className={`px-2 py-0.5 leading-none rounded-full text-[10px] font-bold ${
                filterTab === "failed" ? "bg-white/20 text-white" : "bg-amber-200/80 text-amber-900"
              }`}>
                {summary.failedCount}
              </span>
            </button>
          )}

          {summary.invalidPhoneCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab("invalid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === "invalid"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <span>Invalid Phone</span>
              <span className={`px-2 py-0.5 leading-none rounded-full text-[10px] font-bold ${
                filterTab === "invalid" ? "bg-white/20 text-white" : "bg-red-200 text-red-900"
              }`}>
                {summary.invalidPhoneCount}
              </span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-8 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Corporate Batch Dispatch Toolbar ── */}
      <div className="px-6 py-3.5 bg-neutral-50/70 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSelectAllEligible}
            className="flex items-center gap-2 font-semibold text-xs text-neutral-800 hover:text-emerald-700 cursor-pointer select-none"
          >
            {allFilteredEligibleSelected ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-neutral-400" />
            )}
            <span>Select All in View</span>
          </button>
          <span className="text-neutral-300">|</span>
          <span className="text-xs text-neutral-500">
            <strong className="text-neutral-900 font-semibold">{selectedIds.size}</strong> guest{selectedIds.size === 1 ? "" : "s"} selected
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {summary.failedCount > 0 && (
            <button
              type="button"
              onClick={() => handleDispatch(true)}
              disabled={dispatching}
              className="h-9 px-3.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry {summary.failedCount} Failed</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={dispatching || selectedIds.size === 0}
            className="w-full sm:w-auto h-9.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-emerald-500/25 hover:shadow-emerald-500/35"
          >
            {dispatching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Sending via Meta Cloud API...</span>
              </>
            ) : (
              <>
                <WhatsAppLogo size={16} variant="white" />
                <span>Send WhatsApp Invitations ({selectedIds.size})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── In-Flight Dispatch Indicator ── */}
      {dispatching && (
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3 animate-in fade-in">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-950">
              Active WhatsApp Dispatch in Progress...
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Connecting to Meta Cloud API gateway with rate-limit pacing. Delivery receipts will be updated in real time.
            </p>
            <div className="h-1 bg-emerald-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      {/* ── Audience Table Directory ── */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600 mx-auto mb-2.5" />
          <p className="text-xs font-semibold text-neutral-700">Auditing WhatsApp Recipient Eligibility...</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Verifying E.164 phone formats and credential tokens</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-400 bg-neutral-50/20">
          <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="font-semibold text-neutral-700">No guests found in this filter view</p>
          <p className="text-[11px] text-neutral-400 mt-1">Try switching tabs or adjusting your search query</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[480px] divide-y divide-neutral-100">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-neutral-50/95 backdrop-blur-md z-10 border-b border-neutral-200/80">
              <tr className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4 w-12 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-3 px-3">Guest Details</th>
                <th className="py-3 px-3">WhatsApp Number</th>
                <th className="py-3 px-3">Digital Pass Link</th>
                <th className="py-3 px-3">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredList.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const isDelivered = ["SENT", "DELIVERED", "READ"].includes(item.deliveryStatus);
                const isFailed = item.deliveryStatus === "FAILED";
                const isSendingThis = singleDispatchingId === item.id;

                return (
                  <tr
                    key={item.id}
                    onClick={() => item.eligible && toggleSelect(item.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? "bg-emerald-50/40" : "hover:bg-neutral-50/80"
                    } ${!item.eligible && !isFailed ? "opacity-60 cursor-default bg-neutral-50/20" : ""}`}
                  >
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!item.eligible && !isFailed}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 uppercase shadow-2xs">
                          {item.name ? item.name.slice(0, 2) : "G"}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{item.name || "Guest"}</p>
                          <p className="text-[11px] text-neutral-400 font-normal">{item.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {item.phone ? (
                        <div className="flex items-center gap-2">
                          <WhatsAppLogo size={14} variant="brand" />
                          <span className={`font-mono text-[11px] ${item.isValidPhone ? "text-neutral-800 font-medium" : "text-red-600 font-semibold"}`}>
                            {item.normalizedPhone || item.phone}
                          </span>
                          {!item.isValidPhone && (
                            <span className="text-[9px] font-bold text-red-700 bg-red-100 border border-red-200 px-1.5 py-0.5 leading-none rounded-md">
                              Invalid Format
                            </span>
                          )}
                          {item.isDuplicatePhone && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 leading-none rounded-md">
                              Duplicate
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic text-[11px]">No phone number</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {item.passToken ? (
                        <Link
                          href={`/pass/${item.passToken}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-violet-700 hover:text-violet-900 hover:underline bg-violet-50/70 border border-violet-200/60 px-2 py-0.5 rounded-md"
                        >
                          <span>{item.passToken.slice(0, 8)}...</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      ) : (
                        <span className="text-neutral-400 text-[11px] italic">Pending generation</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {isDelivered ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                          <CheckCheck className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Delivered</span>
                        </span>
                      ) : isFailed ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full"
                          title={item.failureReason || "Failed to deliver WhatsApp message"}
                        >
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>Failed</span>
                        </span>
                      ) : item.eligible ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Ready to Send</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                          {item.ineligibilityReason || "Ineligible"}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleSendSingle(item.id)}
                        disabled={!item.isValidPhone || !item.passToken || isSendingThis || dispatching}
                        className="h-7 px-2.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 text-[11px] font-semibold inline-flex items-center gap-1 transition-all shadow-2xs disabled:opacity-40 cursor-pointer"
                        title="Send ticket pass directly via WhatsApp"
                      >
                        {isSendingThis ? (
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                        ) : (
                          <WhatsAppLogo size={13} variant="brand" />
                        )}
                        <span>{isDelivered ? "Resend" : "Send Pass"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── WhatsApp Phone Simulator / Preview Modal ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#ECE5DD] border border-neutral-300 shadow-2xl overflow-hidden flex flex-col font-sans">
            {/* Phone Header (WhatsApp Top Bar) */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <WhatsAppLogo size={22} variant="brand" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-xs tracking-tight">UrPass Ticketing</p>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <p className="text-[10px] text-emerald-100">Official Business Account</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 min-h-[340px] flex flex-col justify-end">
              <div className="self-center px-3 py-1 rounded-lg bg-white/70 backdrop-blur-xs text-[10px] font-semibold text-neutral-600 shadow-2xs">
                TODAY · META APPROVED UTILITY
              </div>

              {/* Speech Bubble */}
              <div className="self-start max-w-[90%] bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-neutral-200/50 space-y-2.5 text-neutral-900 text-xs">
                <p className="leading-relaxed font-normal">
                  Hi <strong className="font-semibold text-neutral-950">Dr. Priya Sharma</strong>,
                </p>

                <p className="leading-relaxed">
                  Your registration for <strong className="font-bold text-neutral-950">*{eventName}*</strong> has been confirmed!
                </p>

                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1 text-[11px] font-medium text-neutral-700">
                  <p>📅 <strong className="text-neutral-900">Date:</strong> {formattedDate}</p>
                  <p>⏰ <strong className="text-neutral-900">Time:</strong> Confirmed on Pass</p>
                  <p>📍 <strong className="text-neutral-900">Venue:</strong> {venue || "Confirmed on Pass"}</p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Template: <code className="text-emerald-700 font-mono">urpass_ticket</code></span>
                  <span className="flex items-center gap-1">
                    11:42 AM
                    <CheckCheck className="w-3.5 h-3.5 text-[#25D366]" />
                  </span>
                </div>

                {/* Interactive Meta URL Button */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="w-full py-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#25D366]/20 transition-colors shadow-2xs">
                    <ExternalLink className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>View Mobile Ticket</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Close Bar */}
            <div className="p-3 bg-white border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Template: <strong className="text-neutral-800">urpass_ticket (en_US)</strong></span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal ── */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <WhatsAppLogo size={22} variant="brand" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Confirm WhatsApp Invitation Dispatch
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  You are about to dispatch approved WhatsApp invitations to{" "}
                  <strong className="text-neutral-900 font-semibold">{selectedIds.size} guests</strong> for{" "}
                  <strong className="text-neutral-900 font-semibold">{eventName}</strong>.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5 text-neutral-600">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Uses approved Meta template: <code className="text-emerald-700 font-mono font-bold">urpass_ticket</code></span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Language strictly set to <code className="text-emerald-700 font-mono font-bold">en_US</code></span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Each guest receives their unique digital QR pass link</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Atomic idempotency prevents duplicate notifications</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-9 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDispatch(false)}
                className="h-9 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-500/25 transition-all"
              >
                <WhatsAppLogo size={16} variant="white" />
                <span>Confirm & Dispatch ({selectedIds.size})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
