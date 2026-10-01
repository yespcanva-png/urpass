"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  DoorOpen,
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  Maximize2,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

interface EnterpriseFeatureTab {
  id: string;
  tabNumber: string;
  label: string;
  headline: string;
  summary: string;
  specs: string[];
}

const TABS: EnterpriseFeatureTab[] = [
  {
    id: "agenda",
    tabNumber: "01",
    label: "Multi-Track Agenda Engine",
    headline: "Parallel Conference Tracks & Conflict Prevention",
    summary:
      "Orchestrate complex multi-day schedules across parallel halls. Features timeline, calendar, and list views with built-in collision detection to eliminate double-booked venues.",
    specs: [
      "Parallel room & track visualization",
      "Automatic collision guard engine",
      "Public agenda publishing & bookmarks",
    ],
  },
  {
    id: "speakers",
    tabNumber: "02",
    label: "Speaker & Keynote Directory",
    headline: "Verified Presenter Rosters & Session Linking",
    summary:
      "Manage keynote speakers, panelists, and moderators from a unified directory. Showcase executive bios, topics, and assign speakers to sessions with double-booking prevention.",
    specs: [
      "Keynote profiles with verified bio links",
      "Automated speaker collision prevention",
      "Public presenter showcase on event site",
    ],
  },
  {
    id: "checkin",
    tabNumber: "03",
    label: "Session QR & Capacity Gate",
    headline: "Door-Level Session Verification & Room Limits",
    summary:
      "Transform volunteer phones into sub-second session scanners. Monitor live hall capacities, handle seat pre-reservations, and track attendance velocity per session in real time.",
    specs: [
      "Sub-0.28s in-browser QR validation",
      "Live hall capacity & waitlist caps",
      "Unified single-pass check-in audit trail",
    ],
  },
];

export default function CorporateWhatsNewCard({
  firstEventId,
}: CorporateWhatsNewCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  function handleDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setIsVisible(false);
  }

  // Keyboard navigation: Escape to dismiss, Arrow keys to switch tabs
  useEffect(() => {
    if (!isVisible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (e.key === "ArrowRight") {
        setActiveTabIdx((prev) => (prev < TABS.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setActiveTabIdx((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isMounted || !isVisible) {
    return null;
  }

  const activeTab = TABS[activeTabIdx];
  const isLast = activeTabIdx === TABS.length - 1;

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-neutral-950/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enterprise-whats-new-title"
    >
      {/* ── EXPANSIVE ENTERPRISE MODAL CARD (max-w-5xl) ─────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto lg:overflow-visible bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-neutral-200/90 flex flex-col lg:flex-row animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Subtle Close Button */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 border border-neutral-200/80 flex items-center justify-center transition-all cursor-pointer"
          title="Dismiss update"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── LEFT COLUMN: Enterprise Narrative & Interactive Tabs ──── */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-100">
          <div>
            {/* Enterprise Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 text-white text-[10px] font-mono font-bold uppercase tracking-widest shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                UrPass Enterprise
              </span>
              <span className="text-[11px] font-semibold text-neutral-400">
                Release 2.4 · Conference Suite
              </span>
            </div>

            {/* Main Headline */}
            <h2
              id="enterprise-whats-new-title"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight mb-2.5"
            >
              Conference &amp; Multi-Track Operations
            </h2>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
              Orchestrate high-capacity conferences with parallel session schedules, verified speaker rosters, and door-level QR validation.
            </p>

            {/* Enterprise Interactive Slider Tabs */}
            <div className="space-y-2 mb-6">
              {TABS.map((tab, idx) => {
                const isActive = activeTabIdx === idx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabIdx(idx)}
                    type="button"
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50/70 hover:bg-neutral-100/70 border-neutral-200/60 text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-neutral-200/70 text-neutral-600"
                          }`}
                        >
                          {tab.tabNumber}
                        </span>
                        <span className="text-xs font-bold tracking-tight">
                          {tab.label}
                        </span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Feature Summary & Bullet Specs */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-2.5">
              <p className="text-xs font-bold text-neutral-900 leading-tight">
                {activeTab.headline}
              </p>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {activeTab.summary}
              </p>
              <div className="pt-2 border-t border-neutral-200/60 space-y-1.5">
                {activeTab.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
                onClick={handleDismiss}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs"
              >
                <span>{firstEventId ? "Open Conference Suite" : "Create Conference"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleDismiss}
                type="button"
                className="px-3.5 py-2.5 rounded-xl text-neutral-400 hover:text-neutral-800 text-xs font-medium transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            {/* Slide Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTabIdx((prev) => Math.max(0, prev - 1))}
                disabled={activeTabIdx === 0}
                className="p-2 rounded-lg border border-neutral-200 disabled:opacity-30 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                title="Previous tab"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTabIdx((prev) => Math.min(TABS.length - 1, prev + 1))}
                disabled={isLast}
                className="p-2 rounded-lg border border-neutral-200 disabled:opacity-30 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                title="Next tab"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: High-Fidelity Enterprise Software UI Window ── */}
        <div className="w-full lg:w-1/2 bg-neutral-950 p-6 sm:p-8 lg:p-9 flex flex-col justify-between text-white relative overflow-hidden select-none">
          {/* Subtle Ambient Studio Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Software Window Chrome */}
          <div className="relative z-10 w-full rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-4 sm:p-5 flex flex-col justify-between h-full font-sans">
            {/* Window Header Bar */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-3 py-1 rounded-md border border-neutral-800/80 truncate max-w-[210px]">
                urpass.space/conference/agenda
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* Window Interior Content: Changes with active Tab */}
            <div className="space-y-3.5 flex-1">
              {/* TAB 01: Multi-Track Agenda Grid Preview */}
              {activeTabIdx === 0 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-200">
                      Day 1 Schedule · 3 Parallel Halls
                    </span>
                    <span className="text-[10px] font-mono text-violet-400 bg-violet-950/60 border border-violet-800/50 px-2 py-0.5 rounded">
                      Timeline View
                    </span>
                  </div>

                  {/* Hall Lanes Mockup */}
                  <div className="space-y-2">
                    {/* Lane 1 */}
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-violet-300 bg-violet-950/80 px-1.5 py-0.2 rounded border border-violet-800/50">
                            Hall A · Main Auditorium
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            09:00 – 10:30 AM
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">
                          Opening Keynote: Creative Intelligence &amp; AI
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60 shrink-0">
                        500 / 500 Capacity (Full)
                      </span>
                    </div>

                    {/* Lane 2 */}
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-800/50">
                            Hall B · Breakout Stage
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            11:00 – 12:30 PM
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">
                          Enterprise Cloud Infrastructure Panel
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 shrink-0">
                        240 / 300 Reserved
                      </span>
                    </div>

                    {/* Lane 3 */}
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/50">
                            Workshop Room 3
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            02:00 – 03:30 PM
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">
                          Hands-on Developer Security Masterclass
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 shrink-0">
                        48 / 50 Reserved
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 02: Speaker Directory Preview */}
              {activeTabIdx === 1 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-200">
                      Speaker Roster · 12 Confirmed
                    </span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
                      Directory View
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 font-bold text-xs flex items-center justify-center text-white shrink-0">
                          ER
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Dr. Elena Rostova</p>
                          <p className="text-[10px] text-neutral-400">VP Research · Synthetix AI</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-violet-300 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/50">
                        Keynote Speaker
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 font-bold text-xs flex items-center justify-center text-white shrink-0">
                          MV
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Marcus Vance</p>
                          <p className="text-[10px] text-neutral-400">Principal Architect · CloudScale</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                        Panel Moderator
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 font-bold text-xs flex items-center justify-center text-white shrink-0">
                          PS
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Priya Sharma</p>
                          <p className="text-[10px] text-neutral-400">Head of Product · Apex Security</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                        Workshop Instructor
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 03: Session Check-In & Scanner Preview */}
              {activeTabIdx === 2 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-200">
                      Live Door Scanner · Hall A
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      Scanner HUD Active
                    </span>
                  </div>

                  {/* Room Capacity Meter */}
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Auditorium Room Occupancy</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        384 / 500 (76.8%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[76.8%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400 pt-0.5">
                      <span>116 seats remaining</span>
                      <span>Enforcing Seat Cap: ON</span>
                    </div>
                  </div>

                  {/* Live Scan Stream */}
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-neutral-950 border border-emerald-800/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-white">Alex Rivera</span>
                        <span className="text-[10px] text-neutral-400">(VIP Pass)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300">0.21s · Verified</span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-950 border border-emerald-800/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-white">Sarah Chen</span>
                        <span className="text-[10px] text-neutral-400">(Speaker Pass)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300">0.18s · Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Software Window Footer */}
            <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Schedule Collisions
              </span>
              <span>Sub-0.28s Validation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
