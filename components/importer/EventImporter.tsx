"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link2,
  Percent,
  ScanLine,
  ShieldCheck,
  Check,
} from "lucide-react";

interface ImportedEvent {
  platform: string;
  name: string;
  description: string;
  url: string;
}

export default function EventImporter() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState<ImportedEvent | null>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/import-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Could not parse event URL");
      }

      setImported(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import event");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickSample(sampleUrl: string) {
    setUrlInput(sampleUrl);
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Link2 className="w-3.5 h-3.5" />
          1-Click Migration Engine
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Switch to URPASS in Under 30 Seconds
        </h2>
        <p className="text-neutral-300 text-xs sm:text-sm mt-1">
          Paste your existing Eventbrite, Luma, Google Form, or Townscript link to eliminate ticket commissions.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Form Bar */}
        <form onSubmit={handleImport} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Paste event link (e.g. eventbrite.com/e/... or lu.ma/... or forms.gle/...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Import Event</span>
                </>
              )}
            </button>
          </div>

          {/* Quick sample pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-400">Supported Platforms:</span>
            <button
              type="button"
              onClick={() => handleQuickSample("https://www.eventbrite.com/e/tech-summit-tickets-123456")}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer"
            >
              Eventbrite
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample("https://lu.ma/founder-demo-night")}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer"
            >
              Luma
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample("https://forms.gle/sampleCollegeFestForm")}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer"
            >
              Google Forms
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample("https://www.townscript.com/e/hackathon-2026")}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer"
            >
              Townscript
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Imported Event Result Card */}
        {imported && (
          <div className="mt-8 p-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    {imported.platform} Detected
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Ready for 0% Commission
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{imported.name}</h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {imported.description}
                </p>
              </div>

              <Link
                href={`/signup?ref=importer&eventName=${encodeURIComponent(imported.name)}`}
                className="py-3 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md group shrink-0 cursor-pointer"
              >
                <span>Launch on URPASS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Included Upgrades Grid */}
            <div className="mt-6 pt-5 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-700">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                <Percent className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>0% Ticket Commission</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                <ScanLine className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sub-0.3s Browser Camera Scanner</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Anti-Screenshot Duplicate Lock</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
