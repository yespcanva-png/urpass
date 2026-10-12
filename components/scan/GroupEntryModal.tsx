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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] animate-in fade-in duration-150 sm:items-center sm:p-4">
      <div className="relative w-full max-h-[92svh] overflow-y-auto rounded-t-lg bg-white text-slate-950 shadow-2xl animate-in slide-in-from-bottom-3 duration-150 sm:max-w-md sm:rounded-lg sm:border sm:border-slate-200 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300 sm:hidden" />
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-slate-200 px-4 py-4 pr-14 sm:px-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold leading-tight text-slate-950">Group Entry Check-in</h3>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Valid
                </span>
              </div>
              <p className="mt-1 truncate text-xs font-medium text-slate-500">
                {gateName}{scannerStaffName ? ` · ${scannerStaffName}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Booking reference</span>
                  <h4 className="mt-0.5 truncate text-sm font-bold text-slate-950">{buyerName}</h4>
                </div>
                <span className="max-w-[46%] shrink-0 truncate rounded border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] font-semibold text-slate-600">
                  {bookingReference}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{ticketCategory}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md border border-slate-200 bg-white p-2.5 text-center">
                <p className="text-xl font-bold tabular-nums text-slate-950">{totalEntitlements}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Total</p>
              </div>
              <div className="rounded-md border border-blue-200 bg-blue-50 p-2.5 text-center">
                <p className="text-xl font-bold tabular-nums text-blue-800">{previouslyAdmitted}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">Admitted</p>
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-center">
                <p className="text-xl font-bold tabular-nums text-emerald-800">{remainingEntries}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Remaining</p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Admit now
              </label>
              <div className="grid grid-cols-[44px_1fr_44px] gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || loading || remainingEntries <= 0}
                className="flex h-12 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease admission quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="relative flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
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
                  className="w-16 bg-transparent text-center text-2xl font-bold tabular-nums text-slate-950 outline-none disabled:text-slate-400"
                />
                <span className="ml-1 text-xs font-semibold text-slate-500">People</span>
              </div>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(remainingEntries, q + 1))}
                disabled={quantity >= remainingEntries || loading || remainingEntries <= 0}
                className="flex h-12 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                      className={`min-h-9 rounded-md border px-2 text-xs font-bold transition-colors disabled:opacity-50 ${
                        quantity === n
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      {n === remainingEntries ? `All ${n}` : `${n}`}
                    </button>
                  ))}
              </div>
            )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || remainingEntries <= 0}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                <span>{remainingEntries <= 0 ? "No Entries" : `Admit ${quantity}`}</span>
              </button>
            </div>
          </form>

          <div className="border-t border-slate-200 pt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Recent batches
            </span>
              <span className="font-mono text-[10px] text-slate-500">
                {history.length} {history.length === 1 ? "batch" : "batches"}
            </span>
            </div>

            {history.length === 0 ? (
              <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-500">
                No previous entry batches recorded.
              </p>
            ) : (
              <div className="max-h-28 space-y-1.5 overflow-y-auto pr-1">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-2 text-[11px]"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span className="shrink-0 font-bold text-slate-950">+{h.admittedCount}</span>
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
