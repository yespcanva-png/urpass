"use client";

import { useState } from "react";
import { Users, CheckCircle2, AlertCircle, X, Sparkles, ArrowRight } from "lucide-react";

export interface GroupEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingReference: string;
  buyerName: string;
  totalEntitlements: number;
  previouslyAdmitted: number;
  remainingEntries: number;
  onConfirmAdmission: (quantity: number) => Promise<void>;
  loading?: boolean;
}

export default function GroupEntryModal({
  isOpen,
  onClose,
  bookingReference,
  buyerName,
  totalEntitlements,
  previouslyAdmitted,
  remainingEntries,
  onConfirmAdmission,
  loading = false,
}: GroupEntryModalProps) {
  const [quantity, setQuantity] = useState<number>(() => Math.min(1, remainingEntries));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-neutral-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative text-left text-white animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Group Entry — Gate Scanner</h3>
            <p className="text-[11px] text-purple-300/80 font-mono">Booking {bookingReference}</p>
          </div>
        </div>

        {/* Card info */}
        <div className="my-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-3">
          <div>
            <p className="text-xs font-bold text-white">{buyerName}'s Group Pass</p>
            <p className="text-[11px] text-white/50">One QR · {totalEntitlements} entry entitlements</p>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
            <div className="p-2 rounded-xl bg-neutral-800/80">
              <p className="text-lg font-black text-white">{totalEntitlements}</p>
              <p className="text-[10px] text-white/40 uppercase font-semibold">Total</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/20">
              <p className="text-lg font-black text-purple-400">{previouslyAdmitted}</p>
              <p className="text-[10px] text-purple-300/60 uppercase font-semibold">Used</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20">
              <p className="text-lg font-black text-emerald-400">{remainingEntries}</p>
              <p className="text-[10px] text-emerald-300/60 uppercase font-semibold">Remaining</p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input & Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">
              How many attendees are entering now?
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] text-lg font-bold flex items-center justify-center border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={remainingEntries}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setQuantity(val);
                }}
                className="flex-1 h-12 text-center text-xl font-black bg-white/[0.06] border border-white/20 rounded-2xl focus:border-purple-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(remainingEntries, q + 1))}
                className="w-12 h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] text-lg font-bold flex items-center justify-center border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                +
              </button>
            </div>
            {remainingEntries > 1 && (
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto py-1">
                <span className="text-[10px] text-white/40">Quick:</span>
                {[1, 2, Math.min(remainingEntries, 4), remainingEntries].filter((v, i, a) => a.indexOf(v) === i && v <= remainingEntries).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQuantity(n)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                      quantity === n
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white"
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
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? "Admitting..." : `Confirm ${quantity} ${quantity === 1 ? "Entry" : "Entries"}`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
