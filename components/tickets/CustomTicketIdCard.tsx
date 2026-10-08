"use client";

import React, { useState, useTransition } from "react";
import {
  Hash,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import type { CustomTicketIdConfig, ContinuationStats } from "@/types/custom-ticket-id";
import { formatCustomTicketId, generateContinuationBatch } from "@/lib/tickets/custom-id";
import {
  updateEventTicketIdConfig,
  syncEventContinuationOffset,
} from "@/app/actions/custom-ticket-ids";

interface Props {
  eventId: string;
  initialConfig: CustomTicketIdConfig;
  initialStats: ContinuationStats;
}

export default function CustomTicketIdCard({
  eventId,
  initialConfig,
  initialStats,
}: Props) {
  const [config, setConfig] = useState<CustomTicketIdConfig>(initialConfig);
  const [stats, setStats] = useState<ContinuationStats>(initialStats);
  const [offsetInput, setOffsetInput] = useState<number>(
    initialConfig.continuationOffset || 0
  );
  const [isPending, startTransition] = useTransition();
  const [isOffsetPending, startOffsetTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [offsetSuccess, setOffsetSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedSample, setCopiedSample] = useState<string | null>(null);

  // Live previews calculated on the fly
  const liveNextTicketId = formatCustomTicketId(
    config,
    (config.startNumber || 1) + (config.continuationOffset || 0) + (stats.totalGenerated || 0),
    { tierCode: config.includeTierCode ? "VIP" : undefined }
  );

  const sampleBatch = generateContinuationBatch(
    config,
    config.startNumber || 1,
    3,
    { tierCode: config.includeTierCode ? "VIP" : undefined }
  );

  function handleCopy(sample: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(sample);
      setCopiedSample(sample);
      setTimeout(() => setCopiedSample(null), 2000);
    }
  }

  function handleSaveConfig() {
    setErrorMsg("");
    setSaveSuccess(false);

    startTransition(async () => {
      const res = await updateEventTicketIdConfig(eventId, config);
      if (res.success && res.config) {
        setConfig(res.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg(res.error || "Failed to save custom ticket ID configuration.");
      }
    });
  }

  function handleSyncOffset() {
    setErrorMsg("");
    setOffsetSuccess(false);

    startOffsetTransition(async () => {
      const res = await syncEventContinuationOffset(eventId, offsetInput);
      if (res.success) {
        setConfig((prev) => ({ ...prev, continuationOffset: offsetInput }));
        setStats((prev) => ({
          ...prev,
          continuationOffset: offsetInput,
          nextSequenceNumber: res.nextSequence ?? prev.nextSequenceNumber,
          nextTicketIdPreview: res.nextTicketId ?? prev.nextTicketIdPreview,
        }));
        setOffsetSuccess(true);
        setTimeout(() => setOffsetSuccess(false), 3000);
      } else {
        setErrorMsg(res.error || "Failed to update continuation offset.");
      }
    });
  }

  return (
    <div
      className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-xs"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50 bg-gradient-to-r from-violet-50/50 via-white to-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <Hash className="w-4 h-4 text-brand" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 leading-none">
              Custom Ticket IDs & Continuation System
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Configure customized prefixes, zero-padded numbering, and sequential continuation offsets
            </p>
          </div>
        </div>

        {/* Master Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" />
        </label>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Preview Bar */}
        <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Live Ticket ID Preview
            </div>
            <span className="text-[11px] text-neutral-500">
              Next in line: <strong className="font-mono text-neutral-900">{liveNextTicketId}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {sampleBatch.map((sample, idx) => (
              <button
                key={sample}
                type="button"
                onClick={() => handleCopy(sample)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-violet-200/60 shadow-2xs hover:border-brand hover:shadow-xs transition-all text-left group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                    {idx === 0 ? "First Ticket" : idx === 1 ? "Second Ticket" : "Third Ticket"}
                  </span>
                  <span className="font-mono font-bold text-xs text-neutral-800 tracking-wide">
                    {sample}
                  </span>
                </div>
                <div className="text-neutral-300 group-hover:text-brand transition-colors">
                  {copiedSample === sample ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Config Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Prefix */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1.5">
              Prefix
            </label>
            <input
              type="text"
              value={config.prefix}
              onChange={(e) => setConfig({ ...config, prefix: e.target.value.toUpperCase() })}
              placeholder="e.g. TECH26-"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-brand focus:bg-white transition-all uppercase"
            />
            <p className="text-[10px] text-neutral-400 mt-1">E.g. TECH26-, EUPH-, VIP-</p>
          </div>

          {/* Digit Padding */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1.5">
              Digit Padding
            </label>
            <select
              value={config.digitPadding}
              onChange={(e) => setConfig({ ...config, digitPadding: Number(e.target.value) })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:bg-white transition-all"
            >
              <option value={3}>3 digits (001)</option>
              <option value={4}>4 digits (0001)</option>
              <option value={5}>5 digits (00001)</option>
              <option value={6}>6 digits (000001)</option>
            </select>
            <p className="text-[10px] text-neutral-400 mt-1">Leading zero padding</p>
          </div>

          {/* Starting Number */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1.5">
              Start Number
            </label>
            <input
              type="number"
              min={1}
              value={config.startNumber}
              onChange={(e) => setConfig({ ...config, startNumber: Math.max(1, Number(e.target.value)) })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-brand focus:bg-white transition-all"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Default 1 or 1001</p>
          </div>

          {/* Optional Suffix */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1.5">
              Suffix (Optional)
            </label>
            <input
              type="text"
              value={config.suffix || ""}
              onChange={(e) => setConfig({ ...config, suffix: e.target.value.toUpperCase() })}
              placeholder="e.g. -PASS"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-brand focus:bg-white transition-all uppercase"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Appended to the end</p>
          </div>
        </div>

        {/* Tier Code & Formatting Options */}
        <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.includeTierCode)}
              onChange={(e) => setConfig({ ...config, includeTierCode: e.target.checked })}
              className="rounded border-neutral-300 text-brand focus:ring-brand w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-neutral-800">
                Include Ticket Tier / Category Code
              </span>
              <p className="text-[11px] text-neutral-400">
                Automatically inserts category tag (e.g. <code className="font-mono text-neutral-600">TECH26-VIP-0001</code>)
              </p>
            </div>
          </label>

          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            {isPending ? "Saving..." : saveSuccess ? "Config Saved!" : "Save Custom ID Config"}
          </button>
        </div>

        {/* ── Continuation System Sub-Card ── */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Continuation System & Offline Migration
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-700">
              <Layers className="w-3 h-3" />
              Sequence Counter Active
            </span>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            Need to resume digital ticket numbering after selling physical passes or importing an existing batch? Set a continuation offset so new registrations pick up seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={offsetInput}
                  onChange={(e) => setOffsetInput(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 500"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:border-brand transition-all"
                />
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Current total registered: <strong>{stats.totalGenerated}</strong> · Current offset: <strong>{config.continuationOffset || 0}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleSyncOffset}
              disabled={isOffsetPending}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-900 transition-colors disabled:opacity-50 shrink-0"
            >
              {isOffsetPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : offsetSuccess ? (
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              ) : (
                <ArrowRight className="w-3 h-3" />
              )}
              {isOffsetPending ? "Syncing..." : offsetSuccess ? "Offset Synced!" : "Apply Continuation Offset"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
