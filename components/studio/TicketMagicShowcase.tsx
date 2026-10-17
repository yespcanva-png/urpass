"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  Sparkles,
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
  Smartphone,
  Zap,
  Sliders,
  Copy,
  Building2,
  FileCheck2,
  ScanLine,
} from "lucide-react";
import {
  AI_MAGIC_VIBE_PRESETS,
  type AiMagicResult,
} from "@/lib/ai/ticket-magic";

const DEMO_PROMPTS = [
  "Executive Healthcare Leadership Summit with clinical teal accents and clean credentials",
  "Annual Corporate Tech Summit & Developer Keynote with high-contrast QR badges",
  "Luxury Black-Tie Awards Gala at Taj West End with champagne gold accents",
  "University Innovation Forum with vibrant amber and volunteer gate QR",
  "Startup Demo Day & Investor Forum with venture indigo and deal room access",
  "Institutional Annual General Meeting & Shareholder Convention in Mumbai",
  "All-Day Athletic Marathon & Championship with high-contrast crimson bib badges",
];

export default function TicketMagicShowcase() {
  const [prompt, setPrompt] = useState(DEMO_PROMPTS[0]);
  const [selectedVibe, setSelectedVibe] = useState<string>("executive_summit");
  const [isGenerating, setIsGenerating] = useState(false);
  const [magicResult, setMagicResult] = useState<AiMagicResult | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const fetchMagic = async (vibeId?: string, customPrompt?: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/studio/ai-magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt !== undefined ? customPrompt : prompt,
          vibe: vibeId || selectedVibe,
          eventName: "GLOBAL ENTERPRISE SUMMIT 2026",
          venue: "Silicon Convention Hall, Bengaluru",
          eventDate: "24 OCT 2026 | 09:30 AM",
          categories: [
            { id: "1", name: "C-Suite VIP" },
            { id: "2", name: "Keynote Speaker" },
            { id: "3", name: "Delegate" },
            { id: "4", name: "Press" },
          ],
        }),
      });

      const data = await res.json();
      if (data.ok && data.result) {
        setMagicResult(data.result);
      }
    } catch (err) {
      console.error("[TicketMagicShowcase] Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchMagic(selectedVibe, prompt);
  }, []);

  const handleSurpriseMe = () => {
    const random = DEMO_PROMPTS[Math.floor(Math.random() * DEMO_PROMPTS.length)];
    setPrompt(random);
    fetchMagic(undefined, random);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const currentConfig = magicResult?.config;
  const isDark = currentConfig?.template === "dark";
  const primaryColor = currentConfig?.primaryColor || "#18181B";

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white font-sans">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* ── CORPORATE HERO HEADER ── */}
        <AnimateIn>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-200/90 mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>URPASS AI TICKET MAGIC</span>
              <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-violet-200/80 text-violet-900">
                BETA
              </span>
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08] mb-5">
              Pass Design with{" "}
              <span className="text-neutral-900 underline decoration-violet-500/30 underline-offset-8">
                Intelligent Styling
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Type your event directive or choose an archetype. UrPass AI calculates WCAG contrast-compliant color palettes, calibrated QR quiet zones, and multi-tier badge styling in milliseconds.
            </p>
          </div>
        </AnimateIn>

        {/* ── INTERACTIVE CORPORATE SANDBOX CARD ── */}
        <AnimateIn delay={100} from="up">
          <div className="rounded-3xl bg-white border border-neutral-200/90 shadow-xl p-6 sm:p-8 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Directive & Archetype Controls */}
              <div className="lg:col-span-7 flex flex-col gap-6">
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
                      placeholder="e.g. Executive Summit with obsidian canvas, champagne gold VIP badges, and quiet-zone gate QR..."
                      className="w-full p-4 text-sm rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900 transition-all resize-none font-medium leading-relaxed"
                    />
                  </div>
                </div>

                {/* Archetype Grid */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                    Select Event Archetype
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {AI_MAGIC_VIBE_PRESETS.map((v) => {
                      const isSelected = selectedVibe === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedVibe(v.id);
                            fetchMagic(v.id);
                          }}
                          className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                              : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
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
                          <span className="font-bold text-xs leading-tight truncate">
                            {v.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => fetchMagic()}
                    disabled={isGenerating}
                    className="w-full py-3.5 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                        <span>Analyzing &amp; Harmonizing Theme...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span>Synthesize AI Pass Theme</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Design Specifications Card */}
                {magicResult && (
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200/90 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-700 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-neutral-500" />
                        <span>AI Design Specifications</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white text-neutral-800 border border-neutral-200 shadow-2xs">
                        {magicResult.colorPaletteName}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      {magicResult.designRationale}
                    </p>

                    <div className="pt-3 border-t border-neutral-200 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                        Harmonized Swatches:
                      </span>
                      <div className="flex items-center gap-2">
                        {magicResult.accentColors.map((hex, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleCopyHex(hex)}
                            title={`Click to copy: ${hex}`}
                            className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 transition-all text-[11px] font-mono text-neutral-700 cursor-pointer shadow-2xs"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-neutral-300 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span>{hex}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Simulated Corporate Pass */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-neutral-50/80 border border-neutral-200/80">
                <div className="w-full max-w-[300px]">
                  {/* Top Bar Preview Meta */}
                  <div className="flex items-center justify-between mb-4 text-[11px] text-neutral-500 font-mono">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-neutral-800 border border-neutral-200 shadow-2xs">
                      {magicResult?.vibeName || "Executive"}
                    </span>
                    <span className="uppercase">
                      {currentConfig?.template} · {currentConfig?.shape}
                    </span>
                  </div>

                  {/* Physical Pass Card */}
                  <div
                    className={`rounded-2xl border shadow-xl p-5 transition-all duration-300 ${
                      isDark
                        ? "bg-neutral-950 border-neutral-800 text-white"
                        : "bg-white border-neutral-200 text-neutral-900"
                    }`}
                    style={{
                      borderTop: `5px solid ${primaryColor}`,
                    }}
                  >
                    {/* Header */}
                    <div className="text-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
                      <span
                        className="text-[9px] font-extrabold uppercase tracking-widest block mb-0.5"
                        style={{ color: primaryColor }}
                      >
                        OFFICIAL ADMISSION PASS
                      </span>
                      <h4 className="text-sm font-bold tracking-tight truncate">
                        GLOBAL ENTERPRISE SUMMIT
                      </h4>
                      <p className="text-[10px] opacity-60 truncate mt-0.5">
                        Silicon Convention Hall, Bengaluru
                      </p>
                    </div>

                    {/* QR Code Centerpiece */}
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center ${
                          currentConfig?.showQrBorder
                            ? "border-neutral-200 bg-white"
                            : "border-transparent bg-white"
                        }`}
                      >
                        <QrCode className="w-28 h-28 text-neutral-950 stroke-[1.5]" />
                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-700 mt-1">
                          #URP-92041
                        </span>
                      </div>
                    </div>

                    {/* Attendee Details */}
                    <div className="pt-2.5 space-y-1.5 text-center border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        <p className="text-xs font-bold">Aarav Mehta</p>
                        <span
                          className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase mt-0.5 text-white shadow-2xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          C-SUITE VIP
                        </span>
                      </div>

                      <p className="text-[10px] opacity-60 leading-tight">
                        24 OCT 2026 | 09:30 AM
                      </p>

                      {currentConfig?.customMessage && (
                        <p className="text-[9px] font-medium opacity-75 italic pt-1">
                          "{currentConfig.customMessage}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category Accent Badges */}
                  {currentConfig?.categoryColors && (
                    <div className="mt-4 pt-3 border-t border-neutral-200/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
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

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-neutral-200 flex flex-col gap-2.5">
                    <Link
                      href="/studio?magic=open"
                      className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs text-center transition-all shadow-xs flex items-center justify-center gap-2 group"
                    >
                      <span>Open in Ticket Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href="/create-event"
                      className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-xs text-center transition-colors shadow-2xs"
                    >
                      Create Event with this Theme
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* ── 3 ENTERPRISE PILLARS ── */}
        <section className="py-12 border-t border-neutral-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
                <Palette className="w-5 h-5 text-violet-700" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">WCAG AA Contrast Calibration</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Automatically calculates contrast ratios that satisfy accessibility standards while preserving rich visual prestige on OLED attendee displays.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
                <ScanLine className="w-5 h-5 text-violet-700" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">Sub-0.3s Camera Ingress Optimization</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Applies calibrated quiet zones and border framing around QR codes so smartphone scanner gates verify admissions in under 300 milliseconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
                <Building2 className="w-5 h-5 text-violet-700" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">Multi-Tier Security Clearance</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Maps distinct yet unified color signatures across VIPs, Keynote Speakers, and Delegates so entrance marshals visually verify access clearance immediately.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
