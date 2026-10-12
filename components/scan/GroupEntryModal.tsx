"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle2, AlertCircle, X, Clock, Minus, Plus, Loader2 } from "lucide-react";

export interface GroupAdmissionBatchHistory {
  id: string;
  admittedCount: number;
  remainingAfter: number;
  gateName?: string;
  admittedAt: string;
}

export interface GroupEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingReference: string;
  buyerName: string;
  ticketCategory?: string;
  totalEntitlements: number;
  previouslyAdmitted: number;
  remainingEntries: number;
  gateName?: string;
  scannerStaffName?: string;
  history?: GroupAdmissionBatchHistory[];
  onConfirmAdmission: (quantity: number) => Promise<void>;
  loading?: boolean;
}

export default function GroupEntryModal({
  isOpen,
  onClose,
  bookingReference,
  buyerName,
  ticketCategory = "General Admission · Group Booking",
  totalEntitlements,
  previouslyAdmitted,
  remainingEntries,
  gateName = "Gate A",
  scannerStaffName,
  history = [],
  onConfirmAdmission,
  loading = false,
}: GroupEntryModalProps) {
  const [quantity, setQuantity] = useState<number>(() => (remainingEntries > 0 ? Math.max(1, Math.min(6, remainingEntries)) : 0));
  const [errorMsg, setErrorMsg] = useState("");

  const isFullyAdmitted = remainingEntries <= 0 && previouslyAdmitted >= totalEntitlements;

  useEffect(() => {
    setQuantity((current) => {
      if (remainingEntries <= 0) return 0;
      return Math.max(1, Math.min(current || 1, remainingEntries));
    });
  }, [remainingEntries]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (quantity <= 0) {
      setErrorMsg("Quantity must be at least 1.");
      return;
    }

    if (quantity > remainingEntries) {
      setErrorMsg(`Cannot admit ${quantity} attendees. Only ${remainingEntries} entitlement(s) remain.`);
      return;
    }

    try {
      await onConfirmAdmission(quantity);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to admit group attendees.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Corporate Modal Card / Mobile Bottom Sheet */}
      <div className="relative w-full max-h-[92svh] overflow-y-auto rounded-t-2xl sm:rounded-xl border-t sm:border border-slate-200/80 bg-white text-slate-900 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 sm:max-w-lg sm:slide-in-from-bottom-0 sm:zoom-in-95">
        {/* Mobile Grab Bar */}
        <div className="pt-2.5 pb-1 sm:hidden flex justify-center">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Corporate Header */}
        <div className={`border-b px-5 py-4 pr-14 ${isFullyAdmitted ? "bg-amber-50/50 border-amber-200/80" : "bg-white border-slate-200"}`}>
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                isFullyAdmitted
                  ? "border-amber-200 bg-amber-100 text-amber-800"
                  : "border-slate-200 bg-slate-100 text-slate-700"
              }`}
            >
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold tracking-tight text-slate-900">
                  {isFullyAdmitted ? "Group Entry Summary" : "Group Entry Check-in"}
                </h3>
                {isFullyAdmitted ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    <AlertCircle className="h-3 w-3 text-amber-700" /> Already Admitted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> Valid
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-xs font-medium text-slate-500">
                {gateName}{scannerStaffName ? ` · Staff: ${scannerStaffName}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          {/* Prominent Corporate Alert Banner for Already Admitted */}
          {isFullyAdmitted && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-950 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
              <div className="min-w-0 space-y-1">
                <p className="font-semibold text-amber-900">
                  All Entitlements Already Admitted
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  All {totalEntitlements} attendee pass entitlement(s) for this booking have already entered the venue. No remaining entries are available for admission.
                </p>
              </div>
            </div>
          )}

          {/* Booking Summary Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking holder</span>
                <h4 className="mt-0.5 truncate text-sm font-semibold text-slate-900">{buyerName}</h4>
                <p className="truncate text-xs text-slate-500 mt-0.5">{ticketCategory}</p>
              </div>
              <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700">
                {bookingReference}
              </span>
            </div>

            {/* Corporate Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-center shadow-xs">
                <p className="text-xl font-bold tabular-nums text-slate-900">{totalEntitlements}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-center shadow-xs">
                <p className={`text-xl font-bold tabular-nums ${isFullyAdmitted ? "text-amber-800" : "text-slate-800"}`}>
                  {previouslyAdmitted}
                </p>
                <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-wider ${isFullyAdmitted ? "text-amber-700" : "text-slate-500"}`}>
                  Admitted
                </p>
              </div>
              <div className={`rounded-lg border p-2.5 text-center shadow-xs ${
                remainingEntries > 0
                  ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                  : "border-slate-200 bg-slate-100 text-slate-400"
              }`}>
                <p className={`text-xl font-bold tabular-nums ${remainingEntries > 0 ? "text-emerald-700" : "text-slate-500"}`}>
                  {remainingEntries}
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Remaining
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form / Admission Controls or Closed State */}
          {!isFullyAdmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Admit Attendees Now
                </label>
                <div className="grid grid-cols-[48px_1fr_48px] gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || loading || remainingEntries <= 0}
                    className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease admission quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="relative flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-100">
                    <input
                      type="number"
                      min={remainingEntries > 0 ? 1 : 0}
                      max={remainingEntries}
                      value={quantity}
                      disabled={loading || remainingEntries <= 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setQuantity(remainingEntries > 0 ? Math.max(1, Math.min(remainingEntries, val)) : 0);
                      }}
                      className="w-16 bg-transparent text-center text-2xl font-bold tabular-nums text-slate-900 outline-none disabled:text-slate-400"
                    />
                    <span className="ml-1 text-xs font-semibold text-slate-500">Guests</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(remainingEntries, q + 1))}
                    disabled={quantity >= remainingEntries || loading || remainingEntries <= 0}
                    className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase admission quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {remainingEntries > 1 && (
                  <div className="mt-3 grid grid-cols-5 gap-1.5">
                    {[1, 2, Math.min(remainingEntries, 4), Math.min(remainingEntries, 6), remainingEntries]
                      .filter((v, i, a) => a.indexOf(v) === i && v <= remainingEntries)
                      .map((n) => (
                        <button
                          key={n}
                          type="button"
                          disabled={loading}
                          onClick={() => setQuantity(n)}
                          className={`min-h-10 rounded-lg border px-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${
                            quantity === n
                              ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {n === remainingEntries ? `All ${n}` : `${n}`}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || remainingEntries <= 0}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>{remainingEntries <= 0 ? "No Entries" : `Admit ${quantity} Guests`}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-slate-900 text-white text-xs font-semibold transition-colors hover:bg-slate-800 active:scale-95"
              >
                Close &amp; Scan Next Pass
              </button>
            </div>
          )}

          {/* Admission History Log */}
          <div className="border-t border-slate-200 pt-3.5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Previous Admission History
              </span>
              <span className="font-mono text-[10px] text-slate-500 font-medium">
                {history.length} {history.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            {history.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[11px] font-medium text-slate-500">
                No previous entry batches recorded for this booking.
              </p>
            ) : (
              <div className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-2.5 text-[11px] shadow-2xs"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                      <span className="shrink-0 font-bold text-slate-900">+{h.admittedCount} Guests</span>
                      {h.gateName && <span className="truncate text-slate-500">at {h.gateName}</span>}
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-slate-500">
                      {new Date(h.admittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
