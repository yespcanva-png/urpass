"use client";

import { useState } from "react";
import { Users, CheckCircle2, AlertCircle, X, Clock, DoorOpen, ShieldAlert } from "lucide-react";

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
  const [quantity, setQuantity] = useState<number>(() => Math.max(1, Math.min(6, remainingEntries)));
  const [errorMsg, setErrorMsg] = useState("");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0D0F17] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-left text-white animate-in zoom-in-95 duration-150 my-auto">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header / Scanner Location */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300">
              <span>UrPass One</span>
              <span>·</span>
              <span>{gateName} · Group QR Scan</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5" /> Valid Pass
              </span>
            </div>
          </div>
        </div>

        {/* Booking Card & Entitlement Summary */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Booking ID</span>
              <span className="text-xs font-mono font-bold text-purple-300">{bookingReference}</span>
            </div>
            <h4 className="text-base font-extrabold text-white mt-1">{buyerName}</h4>
            <p className="text-xs text-white/50">{ticketCategory}</p>
          </div>

          {/* KPI Triad: Purchased / Admitted / Remaining */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/[0.08]">
            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-white/[0.05]">
              <p className="text-xl font-black text-white">{totalEntitlements}</p>
              <p className="text-[10px] text-white/40 uppercase font-semibold mt-0.5">Purchased</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
              <p className="text-xl font-black text-purple-400">{previouslyAdmitted}</p>
              <p className="text-[10px] text-purple-300/60 uppercase font-semibold mt-0.5">Admitted</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
              <p className="text-xl font-black text-emerald-400">{remainingEntries}</p>
              <p className="text-[10px] text-emerald-300/60 uppercase font-semibold mt-0.5">Remaining</p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/70 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quantity Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">
              How many people are entering now?
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || loading}
                className="w-12 h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] disabled:opacity-30 text-xl font-bold flex items-center justify-center border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                -
              </button>
              <div className="flex-1 relative flex items-center justify-center bg-white/[0.06] border border-white/20 rounded-2xl focus-within:border-purple-400 h-12">
                <input
                  type="number"
                  min={1}
                  max={remainingEntries}
                  value={quantity}
                  disabled={loading}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setQuantity(Math.max(1, Math.min(remainingEntries, val)));
                  }}
                  className="w-16 text-center text-2xl font-black bg-transparent outline-none tabular-nums text-white"
                />
                <span className="text-xs font-semibold text-white/40 ml-1">People</span>
              </div>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(remainingEntries, q + 1))}
                disabled={quantity >= remainingEntries || loading}
                className="w-12 h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] disabled:opacity-30 text-xl font-bold flex items-center justify-center border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Quick-Pick Selection Pills */}
            {remainingEntries > 1 && (
              <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto py-0.5 scrollbar-none">
                <span className="text-[10px] text-white/40 uppercase font-semibold tracking-wider">Quick:</span>
                {[1, 2, Math.min(remainingEntries, 4), Math.min(remainingEntries, 6), remainingEntries]
                  .filter((v, i, a) => a.indexOf(v) === i && v <= remainingEntries)
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      disabled={loading}
                      onClick={() => setQuantity(n)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        quantity === n
                          ? "bg-purple-600 text-white border-purple-400 shadow-sm"
                          : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {n === remainingEntries ? `All ${n}` : `${n}`}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || remainingEntries <= 0}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-lg shadow-purple-900/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? "Confirming Entry..." : `Confirm Entry for ${quantity} ${quantity === 1 ? "Person" : "People"}`}</span>
          </button>
        </form>

        {/* Recent Entry History (batches) */}
        <div className="mt-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Recent entry history
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              {history.length} {history.length === 1 ? "confirmation" : "confirmations"}
            </span>
          </div>

          {history.length === 0 ? (
            <p className="text-[11px] text-white/40 italic py-1">
              No previous entry batches recorded for this booking.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">+{h.admittedCount} admitted</span>
                    {h.gateName && <span className="text-white/40">at {h.gateName}</span>}
                  </div>
                  <span className="font-mono text-white/40 text-[10px]">
                    {new Date(h.admittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
