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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Abstract Corporate Color Artwork (Color Illus) — No Clipart Drawings
 * ───────────────────────────────────────────────────────────────────────────── */

/** Slide 1: Abstract Violet / Indigo Color Artwork (Agenda) */
function AgendaColorArtwork() {
  return (
    <div className="relative w-full h-full min-h-[220px] md:min-h-[280px] flex items-center justify-center overflow-hidden p-6 select-none">
      {/* Soft Ambient Radial Mesh Glows */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-violet-400/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-indigo-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-fuchsia-300/20 blur-2xl pointer-events-none" />

      {/* Modern Abstract Geometric Color Composition */}
      <div className="relative w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
        {/* Layer 1: Background Angled Gradient Slab */}
        <div className="absolute w-48 h-32 rounded-2xl bg-gradient-to-br from-violet-200/80 via-purple-150 to-indigo-100/60 rotate-[-8deg] -translate-x-4 -translate-y-2 border border-white/60 shadow-lg backdrop-blur-xs transition-transform duration-500 hover:rotate-[-6deg]" />

        {/* Layer 2: Radiant Floating Color Orb */}
        <div className="absolute top-2 right-4 w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-[0_8px_24px_rgba(109,40,217,0.35)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/40" />
        </div>

        {/* Layer 3: Hero Foreground Translucent Color Card */}
        <div className="relative z-10 w-52 h-34 rounded-2xl bg-gradient-to-br from-white/95 via-white/85 to-violet-50/90 border border-white shadow-xl backdrop-blur-md p-4 flex flex-col justify-between rotate-[3deg] transition-transform duration-500 hover:rotate-[1deg]">
          {/* Color Bars representing multi-track flow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shadow-xs" />
              <span className="w-10 h-2 rounded-full bg-violet-200" />
            </div>
            <span className="w-6 h-2 rounded-full bg-neutral-200" />
          </div>

          <div className="space-y-2 my-auto">
            {/* Track 1 Bar */}
            <div className="w-full h-4 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 flex items-center px-2 shadow-xs">
              <span className="w-8 h-1.5 rounded-full bg-white/70" />
            </div>
            {/* Track 2 Bar */}
            <div className="w-4/5 h-3.5 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center px-2 shadow-2xs">
              <span className="w-6 h-1 rounded-full bg-white/70" />
            </div>
            {/* Track 3 Bar */}
            <div className="w-3/5 h-3 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 flex items-center px-2">
              <span className="w-5 h-1 rounded-full bg-white/70" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="w-12 h-1.5 rounded-full bg-neutral-200" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-xs" />
          </div>
        </div>

        {/* Layer 4: Accent Color Chip Floating Bottom Left */}
        <div className="absolute -bottom-2 -left-2 z-20 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 text-white text-[10px] font-semibold tracking-wide shadow-lg border border-white/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Timeline
        </div>
      </div>
    </div>
  );
}

/** Slide 2: Abstract Cobalt / Sunset Amber Color Artwork (Speakers) */
function SpeakerColorArtwork() {
  return (
    <div className="relative w-full h-full min-h-[220px] md:min-h-[280px] flex items-center justify-center overflow-hidden p-6 select-none">
      {/* Soft Ambient Radial Mesh Glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-400/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-blue-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-rose-300/20 blur-2xl pointer-events-none" />

      {/* Modern Abstract Geometric Color Composition */}
      <div className="relative w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
        {/* Layer 1: Background Angled Gradient Slab */}
        <div className="absolute w-48 h-32 rounded-2xl bg-gradient-to-br from-amber-100/90 via-rose-100/60 to-blue-100/70 rotate-[7deg] translate-x-3 -translate-y-2 border border-white/60 shadow-lg backdrop-blur-xs transition-transform duration-500 hover:rotate-[5deg]" />

        {/* Layer 2: Glowing Sunset Color Sphere */}
        <div className="absolute -top-1 -left-1 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-rose-500 to-blue-600 shadow-[0_8px_24px_rgba(245,158,11,0.35)] flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-white/25 backdrop-blur-xs border border-white/40" />
        </div>

        {/* Layer 3: Hero Foreground Translucent Color Card */}
        <div className="relative z-10 w-52 h-34 rounded-2xl bg-gradient-to-br from-white/95 via-white/90 to-blue-50/80 border border-white shadow-xl backdrop-blur-md p-4 flex flex-col justify-between rotate-[-3deg] transition-transform duration-500 hover:rotate-[-1deg]">
          {/* Header row with avatar orb and badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                ★
              </div>
              <div className="space-y-1">
                <span className="block w-14 h-2 rounded-full bg-neutral-800" />
                <span className="block w-9 h-1.5 rounded-full bg-neutral-300" />
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
              KEYNOTE
            </span>
          </div>

          {/* Session Tag Color Blocks */}
          <div className="space-y-1.5 my-auto">
            <div className="w-full h-4 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 flex items-center px-2 shadow-xs">
              <span className="w-16 h-1.5 rounded-full bg-white/80" />
            </div>
            <div className="w-3/4 h-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 flex items-center px-2 shadow-2xs">
              <span className="w-10 h-1 rounded-full bg-white/80" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1">
              <span className="w-8 h-2 rounded-md bg-blue-100" />
              <span className="w-10 h-2 rounded-md bg-purple-100" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
          </div>
        </div>

        {/* Layer 4: Accent Color Chip Floating Bottom Right */}
        <div className="absolute -bottom-2 -right-2 z-20 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[10px] font-semibold tracking-wide shadow-lg border border-white/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
          Verified Profiles
        </div>
      </div>
    </div>
  );
}

/** Slide 3: Abstract Emerald / Cyan Color Artwork (Passes & Check-In) */
function AccessColorArtwork() {
  return (
    <div className="relative w-full h-full min-h-[220px] md:min-h-[280px] flex items-center justify-center overflow-hidden p-6 select-none">
      {/* Soft Ambient Radial Mesh Glows */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-emerald-400/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-teal-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none" />

      {/* Modern Abstract Geometric Color Composition */}
      <div className="relative w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
        {/* Layer 1: Background Angled Gradient Slab */}
        <div className="absolute w-48 h-32 rounded-2xl bg-gradient-to-br from-emerald-150/80 via-teal-100/60 to-cyan-150/70 rotate-[-6deg] -translate-x-3 -translate-y-2 border border-white/60 shadow-lg backdrop-blur-xs transition-transform duration-500 hover:rotate-[-4deg]" />

        {/* Layer 2: Glowing Emerald & Cyan Gradient Sphere */}
        <div className="absolute top-1 right-2 w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_8px_24px_rgba(16,185,129,0.35)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-xs border border-white/40" />
        </div>

        {/* Layer 3: Hero Foreground Translucent Color Card */}
        <div className="relative z-10 w-52 h-34 rounded-2xl bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/80 border border-white shadow-xl backdrop-blur-md p-4 flex flex-col justify-between rotate-[3deg] transition-transform duration-500 hover:rotate-[1deg]">
          {/* Header row with badge and verification indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
              <span className="w-12 h-2 rounded-full bg-emerald-200" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
              0.28s SCAN
            </span>
          </div>

          {/* Abstract Pass Matrix Bar */}
          <div className="flex items-center gap-3 my-auto">
            {/* Color Matrix Glyph */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-800 p-1.5 flex flex-wrap gap-1 shadow-md">
              <span className="w-3 h-3 rounded-xs bg-emerald-400" />
              <span className="w-3 h-3 rounded-xs bg-white/80" />
              <span className="w-3 h-3 rounded-xs bg-white/80" />
              <span className="w-3 h-3 rounded-xs bg-teal-400" />
            </div>
            {/* Capacity bars */}
            <div className="space-y-1.5 flex-1">
              <div className="w-full h-3 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 shadow-2xs" />
              <div className="w-3/4 h-2.5 rounded-md bg-neutral-200" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="w-14 h-1.5 rounded-full bg-neutral-200" />
            <span className="text-[9px] font-bold text-emerald-700">PASS VALID</span>
          </div>
        </div>

        {/* Layer 4: Accent Color Chip Floating Bottom Left */}
        <div className="absolute -bottom-2 -left-2 z-20 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-semibold tracking-wide shadow-lg border border-white/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          Capacity Guard
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
  headline: string;
  summary: string;
  bullets: string[];
  colorArtwork: React.ReactNode;
  accentBg: string;
}

const SLIDES: SlideItem[] = [
  {
    id: "agenda",
    stepNumber: "01",
    categoryBadge: "Agenda & Schedules",
    title: "Multi-Track Agenda Builder",
    headline: "Zero-collision conference schedules",
    summary:
      "Build multi-track schedules, map hall stages, and automatically detect room and speaker timing collisions in real time.",
    bullets: [
      "Interactive timeline & calendar grid views",
      "Automated room & hall collision guardrails",
      "Synchronized attendee bookmarks & live updates",
    ],
    colorArtwork: <AgendaColorArtwork />,
    accentBg: "from-[#F7F5FF] via-[#FAF9FF] to-white",
  },
  {
    id: "speakers",
    stepNumber: "02",
    categoryBadge: "Speakers & Keynotes",
    title: "Keynote & Speaker Directory",
    headline: "Showcase leaders & track assignments",
    summary:
      "Publish speaker bios, company affiliations, and linked session agendas with automated double-booking warnings.",
    bullets: [
      "Rich profiles with bio, company & topic tags",
      "Direct linking to agenda sessions & halls",
      "Instant warning if a speaker is double-booked",
    ],
    colorArtwork: <SpeakerColorArtwork />,
    accentBg: "from-[#F0F5FF] via-[#F8FAFC] to-white",
  },
  {
    id: "access",
    stepNumber: "03",
    categoryBadge: "Access & Passes",
    title: "Hall Passes & Session Check-In",
    headline: "Fast gate validation with existing passes",
    summary:
      "Cap room capacities, manage attendee seat reservations, and validate hall entrances using existing UrPass QR codes.",
    bullets: [
      "Scan existing UrPass attendee QR codes seamlessly",
      "Live hall capacity tracking & overflow rejection",
      "Sub-second gate check-in with offline fallback",
    ],
    colorArtwork: <AccessColorArtwork />,
    accentBg: "from-[#EDFDF5] via-[#F6FBF9] to-white",
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="corporate-modal-title"
    >
      {/* ── Large Rectangular Modal Card (Increased Size: max-w-[880px]) ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[880px] bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 text-neutral-900"
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

        {/* ── Left Column: Spacious Color Artwork Panel (md:w-[380px]) ──────── */}
        <div
          className={`w-full md:w-[380px] shrink-0 bg-gradient-to-b ${slide.accentBg} p-6 md:p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-neutral-100 transition-colors duration-500`}
        >
          {/* Pure Color Artwork Viewport */}
          <div className="w-full flex items-center justify-center transition-all duration-300">
            {slide.colorArtwork}
          </div>

          {/* Slide Indicator Bar for Mobile */}
          <div className="flex md:hidden items-center gap-1.5 mt-3">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlideIndex ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Right Column: Enterprise Multi-Page Content ─────────────────── */}
        <div className="flex-1 p-7 md:p-10 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Step Counter & Category */}
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-100">
                  {slide.stepNumber} / 03
                </span>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {slide.categoryBadge}
                </span>
              </div>
            </div>

            {/* Title & Subheading */}
            <div className="space-y-2">
              <h2
                id="corporate-modal-title"
                className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight leading-snug"
              >
                {slide.title}
              </h2>
              <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-normal">
                {slide.summary}
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-2.5 pt-1">
              {slide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-neutral-700 leading-tight font-medium">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer Navigation & Action Buttons ─────────────────────────── */}
          <div className="pt-8 mt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Slide Pagination Dots */}
            <div className="hidden md:flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  type="button"
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlideIndex
                      ? "w-8 bg-neutral-900"
                      : "w-2.5 bg-neutral-200 hover:bg-neutral-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              {currentSlideIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  type="button"
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  onClick={handleDismiss}
                  type="button"
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 text-xs md:text-sm font-medium transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}

              {isLastSlide ? (
                <Link
                  href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs md:text-sm font-semibold transition-colors shadow-xs"
                >
                  <span>{firstEventId ? "Explore Agenda" : "Create Event"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleNext}
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs md:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
