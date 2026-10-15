"use client";

import { useEffect, useState, useTransition } from "react";
import {
  MessageSquare,
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
} from "lucide-react";
import Link from "next/link";
import {
  getBulkWhatsAppAudience,
  sendBulkWhatsAppInvitations,
  retryFailedWhatsAppInvitations,
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

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "eligible" | "sent" | "failed" | "invalid">("eligible");

  // Preview toggle
  const [showPreview, setShowPreview] = useState(false);

  // Dispatch state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState<{ processed: number; total: number; sent: number; failed: number } | null>(null);
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
  const filteredList = audience.filter((a) => {
    // Search query
    if (search) {
      const q = search.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchPhone = (a.phone || "").toLowerCase().includes(q);
      const matchEmail = a.email.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail) return false;
    }

    if (filterTab === "eligible") return a.eligible;
    if (filterTab === "sent") return a.deliveryStatus === "SENT" || a.deliveryStatus === "DELIVERED" || a.deliveryStatus === "READ";
    if (filterTab === "failed") return a.deliveryStatus === "FAILED";
    if (filterTab === "invalid") return !a.isValidPhone;
    return true;
  });

  const allFilteredEligibleSelected =
    filteredList.length > 0 &&
    filteredList.filter((a) => a.eligible).every((a) => selectedIds.has(a.id));

  function toggleSelectAllEligible() {
    if (allFilteredEligibleSelected) {
      // Unselect all in current view
      const newSet = new Set(selectedIds);
      filteredList.forEach((a) => newSet.delete(a.id));
      setSelectedIds(newSet);
    } else {
      // Select all eligible in current view
      const newSet = new Set(selectedIds);
      filteredList.filter((a) => a.eligible).forEach((a) => newSet.add(a.id));
      setSelectedIds(newSet);
    }
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

    setDispatchProgress({
      processed: 0,
      total: idsToSend.length,
      sent: 0,
      failed: 0,
    });

    try {
      const res = await sendBulkWhatsAppInvitations({
        eventId,
        recipientAttendeeIds: idsToSend,
        forceRetry,
      });

      setLastResult(res);
      // Reload audience data to reflect updated statuses
      await loadAudience();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to execute WhatsApp broadcast");
    } finally {
      setDispatching(false);
      setDispatchProgress(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
      {/* Top Header Banner */}
      <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/40 via-white to-white">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900">
                WhatsApp Bulk Guest Invitations
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                One-Click
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Send personalized invitations with digital QR pass links to 100–150 guests via WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/event/${eventId}/attendees`}
            className="h-8 px-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-500" />
            <span>Import CSV</span>
          </Link>

          <button
            type="button"
            onClick={loadAudience}
            disabled={loading || dispatching}
            className="h-8 w-8 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 flex items-center justify-center transition-colors disabled:opacity-50"
            title="Refresh audience list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-neutral-100 border-b border-neutral-100 bg-neutral-50/40 text-center">
        <div className="p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Guests</p>
          <p className="text-lg font-bold text-neutral-900 mt-0.5">{summary.totalAttendees}</p>
        </div>
        <div className="p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Eligible to Send</p>
          <p className="text-lg font-bold text-emerald-700 mt-0.5">{summary.eligibleCount}</p>
        </div>
        <div className="p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Already Delivered</p>
          <p className="text-lg font-bold text-neutral-800 mt-0.5">{summary.alreadySentCount}</p>
        </div>
        <div className="p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Failed / Retryable</p>
          <p className="text-lg font-bold text-amber-700 mt-0.5">{summary.failedCount}</p>
        </div>
        <div className="p-3.5 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">Invalid Phone</p>
          <p className="text-lg font-bold text-red-600 mt-0.5">{summary.invalidPhoneCount}</p>
        </div>
      </div>

      {/* Result feedback notification toast */}
      {lastResult && (
        <div className={`p-4 border-b text-xs flex items-center justify-between gap-3 ${
          lastResult.failedCount === 0 ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"
        }`}>
          <div className="flex items-center gap-2">
            {lastResult.failedCount === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>
              <strong>Campaign Completed:</strong> Dispatched {lastResult.sentCount} WhatsApp invitation{lastResult.sentCount === 1 ? "" : "s"}.
              {lastResult.failedCount > 0 && ` ${lastResult.failedCount} failed.`}
              {lastResult.skippedCount > 0 && ` ${lastResult.skippedCount} skipped.`}
            </span>
          </div>
          {lastResult.failedCount > 0 && (
            <button
              type="button"
              onClick={() => handleDispatch(true)}
              disabled={dispatching}
              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Failed ({lastResult.failedCount})</span>
            </button>
          )}
        </div>
      )}

      {/* Message Preview Accordion */}
      <div className="border-b border-neutral-100 bg-neutral-50/20 px-6 py-3">
        <button
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          className="flex items-center justify-between w-full text-xs font-semibold text-neutral-700 hover:text-neutral-900"
        >
          <span className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            Preview WhatsApp Template Message
          </span>
          {showPreview ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {showPreview && (
          <div className="mt-3 p-4 rounded-xl border border-neutral-200 bg-emerald-50/30 text-xs space-y-2 max-w-lg font-sans">
            <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">Live WhatsApp Template Preview</p>
            <div className="p-3.5 rounded-lg bg-white border border-neutral-200/80 shadow-2xs text-neutral-800 leading-relaxed space-y-2 whitespace-pre-line font-mono text-[11px]">
              {`Hello Dr. Priya Sharma,

You are invited to the ${eventName}!

Your event pass: https://urpass.space/pass/URP-847219

Please present your QR pass at the entrance.

We look forward to welcoming you!`}
            </div>
            <p className="text-[10px] text-neutral-400">
              * Guest name, ticket ID, and personalized pass token URL are dynamically generated per recipient.
            </p>
          </div>
        )}
      </div>

      {/* Audience Controls: Search & Tabs */}
      <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterTab("eligible")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "eligible"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            Eligible ({summary.eligibleCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            All ({summary.totalAttendees})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("sent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "sent"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            Delivered ({summary.alreadySentCount})
          </button>
          {summary.failedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab("failed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterTab === "failed"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Failed ({summary.failedCount})
            </button>
          )}
          {summary.invalidPhoneCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab("invalid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterTab === "invalid"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Invalid Phone ({summary.invalidPhoneCount})
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Action Trigger Bar */}
      <div className="px-6 py-3.5 bg-neutral-50/80 border-b border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <button
            type="button"
            onClick={toggleSelectAllEligible}
            className="flex items-center gap-1.5 font-semibold text-neutral-800 hover:text-emerald-700 cursor-pointer"
          >
            {allFilteredEligibleSelected ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-neutral-400" />
            )}
            <span>Select All Eligible</span>
          </button>
          <span className="text-neutral-300">·</span>
          <span>{selectedIds.size} recipient{selectedIds.size === 1 ? "" : "s"} selected</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {summary.failedCount > 0 && (
            <button
              type="button"
              onClick={() => handleDispatch(true)}
              disabled={dispatching}
              className="h-9 px-3.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Failed ({summary.failedCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={dispatching || selectedIds.size === 0}
            className="w-full sm:w-auto h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-200"
          >
            {dispatching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending Invitations...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp Invitations ({selectedIds.size})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      {dispatching && (
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-900">
              Dispatching invitations... Please keep this page open.
            </p>
            <div className="h-1.5 bg-emerald-200 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Audience List Table */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-neutral-500">Auditing attendee WhatsApp eligibility...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-12 text-center text-xs text-neutral-400">
          No guests found matching the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-neutral-100/90 backdrop-blur-xs z-10 border-b border-neutral-200">
              <tr className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-2.5 px-4 w-10">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-2.5 px-3">Guest Name & Email</th>
                <th className="py-2.5 px-3">Phone Number</th>
                <th className="py-2.5 px-3">Pass Token</th>
                <th className="py-2.5 px-3">WhatsApp Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredList.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => item.eligible && toggleSelect(item.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? "bg-emerald-50/30" : "hover:bg-neutral-50/60"
                    } ${!item.eligible ? "opacity-60 cursor-not-allowed bg-neutral-50/30" : ""}`}
                  >
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!item.eligible && item.deliveryStatus !== "FAILED"}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-[11px] text-neutral-400">{item.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      {item.phone ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-[11px] ${item.isValidPhone ? "text-neutral-700" : "text-red-500 font-semibold"}`}>
                            {item.normalizedPhone || item.phone}
                          </span>
                          {!item.isValidPhone && (
                            <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                              Invalid
                            </span>
                          )}
                          {item.isDuplicatePhone && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                              Duplicate
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">No phone provided</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {item.passToken ? (
                        <Link
                          href={`/pass/${item.passToken}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-violet-700 hover:underline"
                        >
                          <span>{item.passToken.slice(0, 10)}...</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      ) : (
                        <span className="text-neutral-400 italic text-[11px]">Not generated</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {item.deliveryStatus === "SENT" || item.deliveryStatus === "DELIVERED" || item.deliveryStatus === "READ" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Delivered
                        </span>
                      ) : item.deliveryStatus === "FAILED" ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full"
                          title={item.failureReason || "Delivery failed"}
                        >
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          Failed
                        </span>
                      ) : item.eligible ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          Ready to Send
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                          {item.ineligibilityReason || "Ineligible"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Confirm WhatsApp Invitation Broadcast
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  You are about to dispatch personalized invitation passes to{" "}
                  <strong>{selectedIds.size} guests</strong> via WhatsApp for <strong>{eventName}</strong>.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1 text-neutral-600">
              <p>• Each guest receives their unique digital QR pass URL.</p>
              <p>• Dispatches are throttled to respect WhatsApp provider throughput.</p>
              <p>• Duplicate phone numbers are automatically deduplicated.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-9 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDispatch(false)}
                className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-200"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Send ({selectedIds.size})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
