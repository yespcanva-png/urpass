"use client";

import { useState } from "react";
import {
  X,
  Send,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  ShieldCheck,
} from "lucide-react";
import { bulkBroadcastPasses } from "@/app/actions/passes";

interface Props {
  eventId: string;
  approvedCount: number;
  unissuedCount: number;
  onClose: () => void;
  onBroadcastComplete?: () => void;
}

export default function BulkBroadcastModal({
  eventId,
  approvedCount,
  unissuedCount,
  onClose,
  onBroadcastComplete,
}: Props) {
  const [target, setTarget] = useState<"all_approved" | "unclaimed">("all_approved");
  const [channel, setChannel] = useState<"EMAIL" | "WHATSAPP">("EMAIL");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultMsg, setResultMsg] = useState<{ sent: number; failed: number } | null>(null);

  const issuedCount = Math.max(0, approvedCount - unissuedCount);

  async function handleBroadcast() {
    setIsSending(true);
    setErrorMsg("");
    setResultMsg(null);

    try {
      const res = await bulkBroadcastPasses(eventId, target, channel);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setResultMsg({ sent: res.sent, failed: res.failed });
        if (onBroadcastComplete) onBroadcastComplete();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to broadcast passes");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-950">Broadcast Pass Delivery</h2>
              <p className="text-xs text-slate-500 mt-0.5">Send digital pass links to attendees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-600">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resultMsg && (
            <div className="p-3.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Broadcast Completed</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Successfully delivered <strong>{resultMsg.sent}</strong> {resultMsg.sent === 1 ? "pass" : "passes"}
                {resultMsg.failed > 0 && ` (${resultMsg.failed} delivery failures)`}.
              </p>
            </div>
          )}

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Target Audience</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTarget("all_approved")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  target === "all_approved"
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 text-slate-900"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">All Approved</span>
                  <Users className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  {issuedCount} passes issued
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTarget("unclaimed")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  target === "unclaimed"
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 text-slate-900"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">Unchecked-in</span>
                  <ShieldCheck className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Attendees not yet scanned
                </p>
              </button>
            </div>
          </div>

          {/* Delivery Channel */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Delivery Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel("EMAIL")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  channel === "EMAIL"
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 text-slate-900"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="font-semibold text-xs">Email</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Direct ticket delivery with QR link
                </p>
              </button>

              <button
                type="button"
                onClick={() => setChannel("WHATSAPP")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  channel === "WHATSAPP"
                    ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-emerald-950"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-xs">WhatsApp</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Instant mobile message
                </p>
              </button>
            </div>
          </div>

          {unissuedCount > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-800 text-[11px]">
              <strong>Note:</strong> {unissuedCount} approved {unissuedCount === 1 ? "attendee does" : "attendees do"} not have passes generated yet. Generate their passes first before broadcasting.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            {resultMsg ? "Close" : "Cancel"}
          </button>
          {!resultMsg && (
            <button
              type="button"
              disabled={isSending || issuedCount === 0}
              onClick={handleBroadcast}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-sm"
            >
              {isSending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSending ? "Broadcasting…" : "Send Broadcast Now"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
