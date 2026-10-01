"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  DoorOpen,
  ShieldCheck,
  Check,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Clean Corporate Product UI Previews (Sleek, Minimal, Not AI-Looky)
 * ───────────────────────────────────────────────────────────────────────────── */

/** Slide 1: Sleek Corporate Agenda Scheduler Widget */
function AgendaFeatureWidget() {
  return (
    <div className="w-full max-w-[290px] rounded-2xl bg-[#09090b] border border-neutral-800 p-4 text-white shadow-2xl space-y-3 font-sans select-none">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[11px] font-semibold text-neutral-300 tracking-wide uppercase">
            Schedule Builder
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-neutral-400 font-mono">Day 01</span>
        </div>
      </div>

      {/* Track Session 1 */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-violet-300 font-semibold">10:00 – 11:00 AM</span>
          <span className="px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 font-medium text-[9px] border border-violet-500/25">
            Main Hall
          </span>
        </div>
        <p className="text-xs font-semibold text-white leading-tight">
          Opening Keynote: Cloud Systems
        </p>
        <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
          <span>Capacity: 500 seats</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> No Conflicts
          </span>
        </div>
      </div>

      {/* Track Session 2 */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-neutral-400 font-semibold">11:30 – 12:30 PM</span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium text-[9px] border border-neutral-700">
            Stage 2
          </span>
        </div>
        <p className="text-xs font-semibold text-neutral-200 leading-tight">
          Micro-Frontends &amp; Edge Runtimes
        </p>
        <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
          <span>Capacity: 120 seats</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> Assigned
          </span>
        </div>
      </div>

      {/* Guardrail Footer */}
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Room collision guard active</span>
      </div>
    </div>
  );
}

/** Slide 2: Sleek Corporate Speaker Directory Widget */
function SpeakerFeatureWidget() {
  return (
    <div className="w-full max-w-[290px] rounded-2xl bg-[#09090b] border border-neutral-800 p-4 text-white shadow-2xl space-y-3 font-sans select-none">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-semibold text-neutral-300 tracking-wide uppercase">
            Speaker Directory
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 font-medium text-[9px] border border-blue-500/25">
          Verified
        </span>
      </div>

      {/* Speaker Profile Row */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            EV
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Elena Vance</p>
            <p className="text-[10px] text-neutral-400 truncate">VP of Engineering</p>
          </div>
        </div>

        {/* Assigned Session Info */}
        <div className="rounded-lg bg-neutral-950 p-2 space-y-1 text-[10px] border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Assigned Session</span>
            <span className="text-violet-300 font-mono">10:00 AM</span>
          </div>
          <p className="text-neutral-200 font-medium leading-tight">
            Next-Gen Infrastructure Keynote
          </p>
        </div>
      </div>

      {/* Schedule Verification Badge */}
      <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px]">
        <span className="text-neutral-400">Schedule Status</span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <Check className="w-3 h-3" /> 0 Overlaps
        </span>
      </div>
    </div>
  );
}

/** Slide 3: Sleek Corporate Hall Access & QR Check-In Widget */
function AccessFeatureWidget() {
  return (
    <div className="w-full max-w-[290px] rounded-2xl bg-[#09090b] border border-neutral-800 p-4 text-white shadow-2xl space-y-3 font-sans select-none">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-neutral-300 tracking-wide uppercase">
            Hall Gate Control
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400">0.28s Scan</span>
      </div>

      {/* Pass Scan Record */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-neutral-400">Pass #UP-9021</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold text-[9px] border border-emerald-500/25">
            Checked In
          </span>
        </div>
        <p className="text-xs font-semibold text-white leading-tight">
          Executive Delegate Pass
        </p>
        <p className="text-[10px] text-neutral-400">
          Main Hall Entrance · Verified 10:04 AM
        </p>
      </div>

      {/* Live Occupancy Metric Bar */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-neutral-400">Main Hall Occupancy</span>
          <span className="font-mono font-bold text-white">340 / 500 (68%)</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-[68%]" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Slide Definitions
 * ───────────────────────────────────────────────────────────────────────────── */

interface SlideItem {
  id: string;
  stepNumber: string;
  categoryBadge: string;
  title: string;
  summary: string;
  bullets: string[];
  widget: React.ReactNode;
}

const SLIDES: SlideItem[] = [
  {
    id: "agenda",
    stepNumber: "01",
    categoryBadge: "Agenda & Schedules",
    title: "Multi-Track Agenda Builder",
    summary:
      "Design parallel tracks, configure venue halls, and eliminate scheduling collisions automatically.",
    bullets: [
      "Interactive timeline & calendar grid views",
      "Automated room & hall collision guardrails",
      "Live attendee bookmarks & schedule sync",
    ],
    widget: <AgendaFeatureWidget />,
  },
  {
    id: "speakers",
    stepNumber: "02",
    categoryBadge: "Speakers & Keynotes",
    title: "Keynote & Speaker Directory",
    summary:
      "Manage speaker profiles, affiliations, and session links with real-time double-booking alerts.",
    bullets: [
      "Rich profiles with bio, company & topic tags",
      "Direct session linking across conference stages",
      "Automated speaker schedule collision warning",
    ],
    widget: <SpeakerFeatureWidget />,
  },
  {
    id: "access",
    stepNumber: "03",
    categoryBadge: "Access & Passes",
    title: "Hall Passes & Session Check-In",
    summary:
      "Enforce hall capacity caps and validate delegate passes with your existing UrPass QR codes.",
    bullets: [
      "Validate existing UrPass attendee QR codes instantly",
      "Live room occupancy tracking with overflow caps",
      "Sub-second gate check-in with offline fallback",
    ],
    widget: <AccessFeatureWidget />,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Main Component
 * ───────────────────────────────────────────────────────────────────────────── */

export default function CorporateWhatsNewCard({
  firstEventId,
}: CorporateWhatsNewCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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

  // Keyboard Navigation: ArrowLeft, ArrowRight, Escape
  useEffect(() => {
    if (!isVisible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (e.key === "ArrowRight") {
        setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isMounted || !isVisible) {
    return null;
  }

  const slide = SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === SLIDES.length - 1;

  function handleNext() {
    if (isLastSlide) {
      handleDismiss();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="corporate-modal-title"
    >
      {/* ── Sleek Corporate Landscape Modal Card (Linear / Stripe Style) ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[800px] bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Subtle Close Button in Top Right */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-neutral-400 hover:text-neutral-800 shadow-xs border border-neutral-200/70 flex items-center justify-center transition-all cursor-pointer"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Left Column: Corporate Product Preview Panel ─────────────────── */}
        <div className="w-full md:w-[330px] shrink-0 bg-[#0d0c14] p-6 md:p-7 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-neutral-800/80">
          {/* Active Product Feature Widget */}
          <div className="w-full flex items-center justify-center transition-all duration-200">
            {slide.widget}
          </div>

          {/* Slide Indicator Bar for Mobile */}
          <div className="flex md:hidden items-center gap-1.5 mt-3">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlideIndex ? "w-6 bg-white" : "w-1.5 bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Right Column: Clean Enterprise Copy & Controls ──────────────── */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Step Counter & Category */}
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-md border border-violet-100">
                  {slide.stepNumber} / 03
                </span>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {slide.categoryBadge}
                </span>
              </div>
            </div>

            {/* Title & Subheading */}
            <div className="space-y-1.5">
              <h2
                id="corporate-modal-title"
                className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight leading-snug"
              >
                {slide.title}
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-normal">
                {slide.summary}
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-2 pt-1">
              {slide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-neutral-700 leading-tight font-medium">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer Navigation & Action Buttons ─────────────────────────── */}
          <div className="pt-6 mt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Slide Pagination Dots */}
            <div className="hidden md:flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  type="button"
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlideIndex
                      ? "w-6 bg-neutral-900"
                      : "w-2 bg-neutral-200 hover:bg-neutral-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
              {currentSlideIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  type="button"
                  className="px-3.5 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  onClick={handleDismiss}
                  type="button"
                  className="px-3.5 py-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 text-xs font-medium transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}

              {isLastSlide ? (
                <Link
                  href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>{firstEventId ? "Explore Agenda" : "Create Event"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={handleNext}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
