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
 * Handcrafted Canva-Style Vector Illustrations (1 per slide)
 * ───────────────────────────────────────────────────────────────────────────── */

/** Slide 1: Multi-Track Agenda Illustration */
function AgendaSlideIllustration() {
  return (
    <svg
      viewBox="0 0 240 220"
      className="w-full h-full max-w-[210px] max-h-[190px] drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Glow */}
      <circle cx="120" cy="110" r="75" fill="#EDE9FE" opacity="0.6" />
      <circle cx="170" cy="80" r="45" fill="#FEF3C7" opacity="0.65" />

      {/* Schedule Board Base */}
      <rect x="35" y="25" width="170" height="170" rx="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
      
      {/* Top Header Bar */}
      <rect x="45" y="37" width="150" height="24" rx="6" fill="#F5F3FF" />
      <circle cx="58" cy="49" r="4" fill="#7C3AED" />
      <rect x="68" y="46" width="60" height="6" rx="3" fill="#7C3AED" opacity="0.8" />
      <rect x="160" y="45" width="24" height="8" rx="4" fill="#DDD6FE" />

      {/* Track 1 Block: Main Keynote (Violet) */}
      <g filter="drop-shadow(0 2px 6px rgba(124, 58, 237, 0.12))">
        <rect x="45" y="70" width="150" height="32" rx="7" fill="#FAF5FF" stroke="#DDD6FE" strokeWidth="1" />
        <rect x="45" y="70" width="4" height="32" rx="2" fill="#7C3AED" />
        <rect x="57" y="77" width="55" height="6" rx="3" fill="#1F2937" />
        <rect x="57" y="86" width="38" height="5" rx="2.5" fill="#6B7280" />
        <rect x="145" y="77" width="42" height="16" rx="4" fill="#7C3AED" />
        <text x="166" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
          HALL A
        </text>
      </g>

      {/* Track 2 Block: Breakout (Blue) */}
      <g filter="drop-shadow(0 2px 6px rgba(37, 99, 235, 0.10))">
        <rect x="45" y="108" width="150" height="32" rx="7" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
        <rect x="45" y="108" width="4" height="32" rx="2" fill="#2563EB" />
        <rect x="57" y="115" width="62" height="6" rx="3" fill="#1F2937" />
        <rect x="57" y="124" width="45" height="5" rx="2.5" fill="#6B7280" />
        <rect x="145" y="115" width="42" height="16" rx="4" fill="#2563EB" />
        <text x="166" y="126" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
          STAGE 2
        </text>
      </g>

      {/* Track 3 Block: Workshop (Emerald) */}
      <g filter="drop-shadow(0 2px 6px rgba(5, 150, 105, 0.10))">
        <rect x="45" y="146" width="150" height="32" rx="7" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
        <rect x="45" y="146" width="4" height="32" rx="2" fill="#059669" />
        <rect x="57" y="153" width="50" height="6" rx="3" fill="#1F2937" />
        <rect x="57" y="162" width="35" height="5" rx="2.5" fill="#6B7280" />
        <rect x="145" y="153" width="42" height="16" rx="4" fill="#059669" />
        <text x="166" y="164" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
          LAB 04
        </text>
      </g>

      {/* Sparkles */}
      <path d="M 216 35 Q 216 41 222 41 Q 216 41 216 47 Q 216 41 210 41 Q 216 41 216 35" fill="#F59E0B" />
      <circle cx="28" cy="65" r="3" fill="#7C3AED" opacity="0.7" />
    </svg>
  );
}

/** Slide 2: Speaker Directory Illustration */
function SpeakerSlideIllustration() {
  return (
    <svg
      viewBox="0 0 240 220"
      className="w-full h-full max-w-[210px] max-h-[190px] drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Glow */}
      <circle cx="120" cy="110" r="70" fill="#DBEAFE" opacity="0.65" />
      <circle cx="70" cy="150" r="40" fill="#EDE9FE" opacity="0.7" />

      {/* Speaker Card Base */}
      <rect x="40" y="24" width="160" height="172" rx="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />

      {/* Top Banner */}
      <rect x="40" y="24" width="160" height="42" rx="14" fill="#1E1B4B" />
      <rect x="40" y="52" width="160" height="14" fill="#1E1B4B" />

      {/* Keynote Pill on Top Banner */}
      <rect x="135" y="32" width="55" height="14" rx="4" fill="#FEF3C7" />
      <text x="162" y="42" textAnchor="middle" fill="#B45309" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
        ★ KEYNOTE
      </text>

      {/* Avatar Circle with Ring */}
      <circle cx="120" cy="68" r="28" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
      <circle cx="120" cy="68" r="24" fill="#EDE9FE" />
      {/* Friendly Geometric Avatar */}
      <circle cx="120" cy="62" r="9" fill="#7C3AED" />
      <path d="M 103 82 C 105 74 113 73 120 73 C 127 73 135 74 137 82 Z" fill="#7C3AED" />
      {/* Verified Badge */}
      <circle cx="138" cy="78" r="6" fill="#10B981" />
      <path d="M 135.5 78 L 137.5 80 L 140.5 76.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Speaker Name & Title */}
      <rect x="75" y="104" width="90" height="7" rx="3.5" fill="#111827" />
      <rect x="85" y="115" width="70" height="5" rx="2.5" fill="#6B7280" />

      {/* Assigned Session Pill */}
      <g filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.04))">
        <rect x="52" y="130" width="136" height="28" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="66" cy="144" r="5" fill="#2563EB" />
        <rect x="76" y="138" width="75" height="5" rx="2.5" fill="#1E293B" />
        <rect x="76" y="146" width="55" height="4" rx="2" fill="#94A3B8" />
        <rect x="158" y="137" width="22" height="14" rx="3" fill="#DBEAFE" />
        <text x="169" y="146.5" textAnchor="middle" fill="#1D4ED8" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
          10 AM
        </text>
      </g>

      {/* Topics / Tags Row */}
      <rect x="52" y="166" width="42" height="12" rx="4" fill="#F1F5F9" />
      <text x="73" y="174.5" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
        AI Architecture
      </text>

      <rect x="98" y="166" width="46" height="12" rx="4" fill="#F1F5F9" />
      <text x="121" y="174.5" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
        Cloud Scaling
      </text>

      {/* Sparkles */}
      <path d="M 214 62 Q 214 68 220 68 Q 214 68 214 74 Q 214 68 208 68 Q 214 68 214 62" fill="#2563EB" />
    </svg>
  );
}

/** Slide 3: Hall Access & QR Check-In Illustration */
function AccessSlideIllustration() {
  return (
    <svg
      viewBox="0 0 240 220"
      className="w-full h-full max-w-[210px] max-h-[190px] drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Glow */}
      <circle cx="120" cy="115" r="75" fill="#D1FAE5" opacity="0.6" />
      <circle cx="175" cy="70" r="45" fill="#EDE9FE" opacity="0.7" />

      {/* Lanyard Ribbon */}
      <path d="M 112 12 Q 115 32 118 42" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
      <path d="M 128 12 Q 125 32 122 42" stroke="#6D28D9" strokeWidth="4" strokeLinecap="round" />
      <rect x="114" y="40" width="12" height="8" rx="2" fill="#9CA3AF" />

      {/* VIP Pass Card Base */}
      <rect x="45" y="46" width="150" height="152" rx="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />

      {/* Header Strip */}
      <rect x="45" y="46" width="150" height="26" rx="14" fill="#0F172A" />
      <rect x="45" y="60" width="150" height="12" fill="#0F172A" />
      <text x="120" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
        CONFERENCE ALL-ACCESS
      </text>

      {/* Verified Status Pill */}
      <rect x="58" y="78" width="124" height="14" rx="4" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="0.8" />
      <text x="120" y="88" textAnchor="middle" fill="#047857" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
        ● PASS VALIDATED · 0.28s SCAN
      </text>

      {/* QR Code Container */}
      <g filter="drop-shadow(0 2px 8px rgba(0,0,0,0.08))">
        <rect x="58" y="98" width="56" height="56" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        {/* QR glyph dots */}
        <rect x="66" y="106" width="14" height="14" rx="2" fill="#0F172A" />
        <rect x="69" y="109" width="8" height="8" rx="1" fill="#FFFFFF" />
        <rect x="92" y="106" width="14" height="14" rx="2" fill="#0F172A" />
        <rect x="95" y="109" width="8" height="8" rx="1" fill="#FFFFFF" />
        <rect x="66" y="132" width="14" height="14" rx="2" fill="#0F172A" />
        <rect x="69" y="135" width="8" height="8" rx="1" fill="#FFFFFF" />
        <rect x="88" y="127" width="8" height="8" rx="1" fill="#7C3AED" />
        <rect x="98" y="137" width="8" height="8" rx="1" fill="#10B981" />
      </g>

      {/* Pass Holder Details */}
      <rect x="122" y="102" width="60" height="6" rx="3" fill="#0F172A" />
      <rect x="122" y="112" width="46" height="5" rx="2.5" fill="#64748B" />
      <rect x="122" y="121" width="52" height="4" rx="2" fill="#94A3B8" />

      {/* Capacity & Gate Indicator */}
      <rect x="122" y="133" width="60" height="18" rx="4" fill="#F1F5F9" />
      <text x="152" y="142" textAnchor="middle" fill="#334155" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
        HALL CAP: 350 / 500
      </text>
      <text x="152" y="148" textAnchor="middle" fill="#059669" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">
        ROOM CHECK-IN OK
      </text>

      {/* Barcode dash footer */}
      <line x1="58" y1="172" x2="182" y2="172" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 2.5" />

      {/* Sparkles */}
      <path d="M 218 95 Q 218 101 224 101 Q 218 101 218 107 Q 218 101 212 101 Q 218 101 218 95" fill="#10B981" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Slide Data Definition
 * ───────────────────────────────────────────────────────────────────────────── */

interface SlideItem {
  id: string;
  stepNumber: string;
  categoryBadge: string;
  title: string;
  headline: string;
  summary: string;
  bullets: string[];
  illustration: React.ReactNode;
  accentBg: string;
}

const SLIDES: SlideItem[] = [
  {
    id: "agenda",
    stepNumber: "01",
    categoryBadge: "Agenda & Tracks",
    title: "Multi-Track Agenda Builder",
    headline: "Zero-collision conference schedules",
    summary:
      "Design parallel tracks, schedule keynotes and workshops, and automatically catch room or speaker timing collisions.",
    bullets: [
      "Interactive timeline & calendar grid views",
      "Automated room & hall collision guardrails",
      "Synchronized attendee bookmarks & live updates",
    ],
    illustration: <AgendaSlideIllustration />,
    accentBg: "from-[#F6F4FF] via-[#FAF9FF] to-white",
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
    illustration: <SpeakerSlideIllustration />,
    accentBg: "from-[#EFF6FF] via-[#F8FAFC] to-white",
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
    illustration: <AccessSlideIllustration />,
    accentBg: "from-[#ECFDF5] via-[#F6FBF9] to-white",
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="corporate-modal-title"
    >
      {/* ── Landscape Rectangular Modal Card (Canva / Zoho / Stripe Style) ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[760px] bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Subtle Close Button in Top Right */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-neutral-400 hover:text-neutral-800 shadow-xs border border-neutral-200/70 flex items-center justify-center transition-all cursor-pointer"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Left Column: Clean Vector Illustration Area ──────────────────── */}
        <div
          className={`w-full md:w-[310px] shrink-0 bg-gradient-to-b ${slide.accentBg} p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-neutral-100 transition-colors duration-300`}
        >
          {/* Subtle Stage Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 text-neutral-700 text-[10px] font-bold tracking-wider uppercase border border-neutral-200/60 shadow-2xs">
              <Sparkles className="w-3 h-3 text-violet-600" />
              UrPass Stage 1
            </span>
          </div>

          {/* Active Vector Illustration */}
          <div className="w-full flex items-center justify-center pt-5 pb-2 md:py-4 transition-all duration-300">
            {slide.illustration}
          </div>

          {/* Slide Indicator Bar for Mobile */}
          <div className="flex md:hidden items-center gap-1.5 mt-2">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlideIndex ? "w-5 bg-neutral-900" : "w-1.5 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Right Column: Corporate Multi-Page Content ───────────────────── */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Step Counter & Category */}
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                  {slide.stepNumber} / 03
                </span>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {slide.categoryBadge}
                </span>
              </div>
            </div>

            {/* Title & Subheading */}
            <div className="space-y-1">
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
                  <span className="text-xs text-neutral-700 leading-tight font-medium">
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
                  className="px-3 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  onClick={handleDismiss}
                  type="button"
                  className="px-3 py-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 text-xs font-medium transition-colors cursor-pointer"
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
