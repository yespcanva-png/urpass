"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  DoorOpen,
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ScanLine,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

interface SlideItem {
  tag: string;
  title: string;
  description: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  artwork: {
    bgGradient: string;
    glowColor: string;
    pillText: string;
    pillColor: string;
    liveDot: boolean;
    cardTitle: string;
    cardMeta: string;
    badgeText: string;
    avatarInitials: string;
    avatarName: string;
  };
}

const SLIDES: SlideItem[] = [
  {
    tag: "Multi-Track Schedule",
    title: "Parallel Agendas & Halls",
    description: "Build multi-track conference timelines with calendar views and automatic room collision detection.",
    accentBg: "bg-violet-50",
    accentText: "text-violet-700",
    accentBorder: "border-violet-100",
    artwork: {
      bgGradient: "from-[#F7F5FF] via-[#FAF9FF] to-[#EDE9FE]",
      glowColor: "bg-violet-200/50",
      pillText: "Track 1 · Main Auditorium",
      pillColor: "bg-violet-100 text-violet-700",
      liveDot: true,
      cardTitle: "Creative Tech & AI Keynote",
      cardMeta: "10:00 AM – 11:30 AM · Hall A",
      badgeText: "340 / 500 Seats",
      avatarInitials: "PS",
      avatarName: "Priya Sharma",
    },
  },
  {
    tag: "Speaker Directory",
    title: "Keynote Profiles & Topics",
    description: "Showcase keynote speakers, publish rich biographies, and link presenters directly to agenda sessions.",
    accentBg: "bg-blue-50",
    accentText: "text-blue-700",
    accentBorder: "border-blue-100",
    artwork: {
      bgGradient: "from-[#F0F9FF] via-[#F8FAFC] to-[#E0F2FE]",
      glowColor: "bg-blue-200/50",
      pillText: "Keynote Speaker",
      pillColor: "bg-blue-100 text-blue-700",
      liveDot: false,
      cardTitle: "Dr. Elena Rostova",
      cardMeta: "VP of Product · Design Systems",
      badgeText: "2 Sessions Assigned",
      avatarInitials: "ER",
      avatarName: "Elena Rostova",
    },
  },
  {
    tag: "Session Passes",
    title: "Door QR Check-In",
    description: "Scan attendee passes at room entrances with real-time room capacity limits and rapid check-in validation.",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-700",
    accentBorder: "border-emerald-100",
    artwork: {
      bgGradient: "from-[#ECFDF5] via-[#F8FAFC] to-[#D1FAE5]",
      glowColor: "bg-emerald-200/50",
      pillText: "Door Scanner · Room 2",
      pillColor: "bg-emerald-100 text-emerald-700",
      liveDot: true,
      cardTitle: "Pass Verified · VIP Access",
      cardMeta: "Rapid camera validation (<0.28s)",
      badgeText: "Access Approved",
      avatarInitials: "AR",
      avatarName: "Alex Rivera",
    },
  },
];

export default function CorporateWhatsNewCard({
  firstEventId,
}: CorporateWhatsNewCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Keyboard controls: Escape to close, Left/Right arrows to slide
  useEffect(() => {
    if (!isVisible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isMounted || !isVisible) {
    return null;
  }

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;
  const isFirst = currentSlide === 0;

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-slider-title"
    >
      {/* ── Wide Landscape Rectangle Card (Canva Style) ──────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl sm:max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-150/80 overflow-hidden flex flex-col sm:flex-row animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Subtle Close Button in Top Right */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-400 hover:text-neutral-800 shadow-xs border border-neutral-200/60 flex items-center justify-center transition-all cursor-pointer"
          title="Dismiss update"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── LEFT COLUMN: Canva-style Pastel Artwork Preview ────────── */}
        <div
          className={`sm:w-5/12 min-h-[170px] sm:min-h-full bg-gradient-to-br ${slide.artwork.bgGradient} p-5 sm:p-6 flex items-center justify-center relative select-none overflow-hidden border-b sm:border-b-0 sm:border-r border-neutral-100 transition-colors duration-500`}
        >
          {/* Ambient blur glow */}
          <div
            className={`absolute w-36 h-36 rounded-full ${slide.artwork.glowColor} blur-2xl pointer-events-none transition-colors duration-500`}
          />

          {/* Minimal Grid Dots */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="canva-dots-sm" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#000" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#canva-dots-sm)" />
          </svg>

          {/* Clean Figma-grade preview card */}
          <div className="relative z-10 w-full bg-white rounded-2xl p-3.5 shadow-[0_6px_24px_rgb(0,0,0,0.06)] border border-neutral-150/80 space-y-2 transition-all duration-300">
            {/* Card Header */}
            <div className="flex items-center justify-between gap-1 pb-2 border-b border-neutral-100">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slide.artwork.pillColor}`}
              >
                {slide.artwork.pillText}
              </span>
              {slide.artwork.liveDot && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>

            {/* Card Title & Meta */}
            <div>
              <p className="text-xs font-bold text-neutral-900 leading-snug truncate">
                {slide.artwork.cardTitle}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5 truncate">
                {slide.artwork.cardMeta}
              </p>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-1.5 border-t border-neutral-100 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-neutral-100 text-neutral-700 font-bold flex items-center justify-center text-[8px]">
                  {slide.artwork.avatarInitials}
                </div>
                <span className="font-semibold text-neutral-600 truncate max-w-[90px]">
                  {slide.artwork.avatarName}
                </span>
              </div>
              <span className="font-semibold text-neutral-500 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-150">
                {slide.artwork.badgeText}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Slider Content & Actions ─────────────────── */}
        <div className="sm:w-7/12 p-6 sm:p-7 flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Micro Badge & Step Counter */}
            <div className="flex items-center justify-between gap-2 pr-6">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${slide.accentBg} ${slide.accentText} ${slide.accentBorder} border text-[10px] font-bold uppercase tracking-wider transition-colors duration-300`}
              >
                <Sparkles className="w-3 h-3" />
                {slide.tag}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 font-semibold">
                {currentSlide + 1} / {SLIDES.length}
              </span>
            </div>

            {/* Title & Concise 1-Sentence Description */}
            <div className="space-y-1.5 pt-1">
              <h2
                id="whats-new-slider-title"
                className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-snug"
              >
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed min-h-[40px]">
                {slide.description}
              </p>
            </div>
          </div>

          {/* Bottom Navigation & Controls */}
          <div className="pt-6 sm:pt-8 flex items-center justify-between gap-3 border-t border-neutral-100 mt-4">
            {/* Interactive Dot Indicators */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 cursor-pointer ${
                    currentSlide === idx
                      ? "w-5 h-1.5 bg-neutral-900 rounded-full"
                      : "w-1.5 h-1.5 bg-neutral-200 rounded-full hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Buttons Group */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={() => setCurrentSlide((prev) => prev - 1)}
                  type="button"
                  className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
                  title="Previous slide"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )}

              {isLast ? (
                <Link
                  href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Explore Agenda</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={() => setCurrentSlide((prev) => prev + 1)}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleDismiss}
                type="button"
                className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors font-medium cursor-pointer"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
