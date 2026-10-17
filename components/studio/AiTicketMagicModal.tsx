"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Wand2,
  Dice5,
  Loader2,
  Check,
  ArrowRight,
  QrCode,
  Tag,
  Layers,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Building2,
} from "lucide-react";
import type { TicketDesignConfig } from "@/lib/pass-design";
import {
  AI_MAGIC_VIBE_PRESETS,
  type AiMagicResult,
} from "@/lib/ai/ticket-magic";

interface AiTicketMagicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (generatedConfig: TicketDesignConfig) => void;
  eventName?: string;
  venue?: string;
  eventDate?: string;
  ticketCategories?: Array<{ id: string; name: string }>;
}

const SURPRISE_PROMPTS = [
  "Executive Healthcare Leadership Summit with clinical teal accents and clean credentials",
  "Annual Corporate Tech Summit & Developer Keynote with high-contrast QR badges",
  "Luxury Black-Tie Awards Gala at Taj West End with champagne gold accents",
  "University Innovation Forum with vibrant amber and volunteer gate QR",
  "Startup Demo Day & Investor Forum with venture indigo and deal room access",
  "Institutional Annual General Meeting & Shareholder Convention in Mumbai",
  "All-Day Athletic Marathon & Championship with high-contrast crimson bib badges",
];

export default function AiTicketMagicModal({
  isOpen,
  onClose,
  onApply,
  eventName = "ANNUAL ENTERPRISE SUMMIT 2026",
  venue = "Main Convention Center, Hall 4",
  eventDate = "24 OCT 2026 | 09:30 AM",
  ticketCategories = [],
}: AiTicketMagicModalProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<string>("executive_summit");
  const [isGenerating, setIsGenerating] = useState(false);
  const [magicResult, setMagicResult] = useState<AiMagicResult | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && !magicResult) {
      handleGenerate(selectedVibe, prompt);
    }
  }, [isOpen]);

  const handleSurpriseMe = () => {
    const random = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(random);
    handleGenerate(undefined, random);
  };

  const handleGenerate = async (vibeId?: string, customPrompt?: string) => {
    setIsGenerating(true);
    setAppliedSuccess(false);

    try {
      const res = await fetch("/api/studio/ai-magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt !== undefined ? customPrompt : prompt,
          vibe: vibeId || selectedVibe,
          eventName,
          venue,
          eventDate,
          categories: ticketCategories,
        }),
      });

      const data = await res.json();
      if (data.ok && data.result) {
        setMagicResult(data.result);
      }
    } catch (err) {
      console.error("[AiTicketMagicModal] Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!magicResult) return;
    setAppliedSuccess(true);
    onApply(magicResult.config);
    setTimeout(() => {
      onClose();
      setAppliedSuccess(false);
    }, 400);
  };

  if (!isOpen) return null;

  const currentConfig = magicResult?.config;
  const isDark = currentConfig?.template === "dark";
  const primaryColor = currentConfig?.primaryColor || "#18181B";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Corporate Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-neutral-200/90 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 text-neutral-900 font-sans">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-200/90 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-800 shrink-0">
              <Sparkles className="w-4 h-4 text-violet-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-950 tracking-tight">
                  AI Ticket Magic
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-200">
                  BETA
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-normal">
                Intelligent pass generator with WCAG contrast calibration and multi-tier badge styling.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-50/50">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 flex flex-col gap-5 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
            {/* Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Event Theme or Design Directive</span>
                </label>
                <button
                  type="button"
                  onClick={handleSurpriseMe}
                  className="text-xs text-violet-700 hover:text-violet-900 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5" />
                  <span>Surprise Me</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Executive Summit with obsidian background, champagne gold VIP badges, and quiet-zone gate QR..."
                  className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900 transition-all resize-none font-medium leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleGenerate();
                    }
                  }}
                />
              </div>
            </div>

            {/* Vibe Archetypes */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Corporate Archetypes
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AI_MAGIC_VIBE_PRESETS.map((v) => {
                  const isSelected = selectedVibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVibe(v.id);
                        handleGenerate(v.id);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                          : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.color }}
                        />
                        <span
                          className={`text-[9px] font-mono uppercase ${
                            isSelected ? "text-neutral-400" : "text-neutral-400"
                          }`}
                        >
                          {v.badge.split(" ")[0]}
                        </span>
                      </div>
                      <span className="font-semibold text-[11px] leading-tight truncate">
                        {v.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Action Button */}
            <div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full py-3 px-5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    <span>Analyzing &amp; Harmonizing Theme...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span>Generate AI Pass Theme</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Design Rationale Card */}
            {magicResult && (
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-600 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-neutral-500" />
                    <span>Design Specifications</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-neutral-700 border border-neutral-200 shadow-2xs">
                    {magicResult.colorPaletteName}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  {magicResult.designRationale}
                </p>

                {/* Swatches */}
                <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Harmonized Palette:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {magicResult.accentColors.map((hex, i) => (
                      <span
                        key={i}
                        title={hex}
                        className="w-4 h-4 rounded-full border border-neutral-300 shadow-2xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Pass Preview */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
                    LIVE PASS PREVIEW
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {magicResult?.vibeName || "Executive"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  {currentConfig?.template} · {currentConfig?.shape}
                </span>
              </div>

              {/* Card Container */}
              <div className="flex justify-center items-center py-2">
                <div
                  className={`w-full max-w-[280px] rounded-2xl border shadow-md p-4 transition-all duration-300 ${
                    isDark
                      ? "bg-neutral-950 border-neutral-800 text-white"
                      : "bg-white border-neutral-200 text-neutral-900"
                  }`}
                  style={{
                    borderTop: `4px solid ${primaryColor}`,
                  }}
                >
                  {/* Pass Header */}
                  <div className="text-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-widest block mb-0.5"
                      style={{ color: primaryColor }}
                    >
                      OFFICIAL ADMISSION PASS
                    </span>
                    <h4 className="text-sm font-bold tracking-tight truncate">
                      {eventName}
                    </h4>
                    <p className="text-[10px] opacity-60 truncate mt-0.5">
                      {venue}
                    </p>
                  </div>

                  {/* QR Centerpiece */}
                  <div className="py-4 flex flex-col items-center justify-center">
                    <div
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center ${
                        currentConfig?.showQrBorder
                          ? "border-neutral-200 bg-white"
                          : "border-transparent bg-white"
                      }`}
                    >
                      <QrCode className="w-24 h-24 text-neutral-950 stroke-[1.5]" />
                      <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-600 mt-1">
                        #URP-92041
                      </span>
                    </div>
                  </div>

                  {/* Attendee Details */}
                  <div className="pt-2 space-y-1.5 text-center border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                      <p className="text-xs font-bold">Aarav Mehta</p>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase mt-0.5 text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        VIP DELEGATE
                      </span>
                    </div>

                    <p className="text-[10px] opacity-60 leading-tight">
                      {eventDate}
                    </p>

                    {currentConfig?.customMessage && (
                      <p className="text-[9px] font-medium opacity-75 italic pt-1">
                        "{currentConfig.customMessage}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Badges Preview */}
              {currentConfig?.categoryColors && (
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Tier Color Mapping:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(currentConfig.categoryColors).map(([cat, color]) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-2xs"
                        style={{ backgroundColor: color }}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        <span>{cat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-5 mt-4 border-t border-neutral-100 flex items-center gap-3">
              <button
                type="button"
                onClick={handleApply}
                disabled={!magicResult || appliedSuccess}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {appliedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>Applied to Pass!</span>
                  </>
                ) : (
                  <>
                    <span>Apply to Studio Design</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
