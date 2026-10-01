"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  Users,
  DoorOpen,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

interface SlideData {
  id: string;
  stepNumber: string;
  tag: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: {
    bg: string;
    border: string;
    text: string;
    lightPill: string;
  };
}

const SLIDES: SlideData[] = [
  {
    id: "agenda",
    stepNumber: "01",
    tag: "Schedule Operations",
    title: "Multi-Track Agenda Builder",
    description:
      "Design parallel tracks, configure venue halls, and eliminate scheduling collisions automatically.",
    features: [
      "Interactive timeline and calendar grid views",
      "Automated room & hall collision guardrails",
      "Live attendee bookmarks & schedule synchronization",
    ],
    icon: CalendarDays,
    accentColor: {
      bg: "bg-violet-50",
      border: "border-violet-150",
      text: "text-violet-700",
      lightPill: "bg-violet-50 text-violet-700 border-violet-100",
    },
  },
  {
    id: "speakers",
    stepNumber: "02",
    tag: "Speaker Directory",
    title: "Keynote & Speaker Profiles",
    description:
      "Publish speaker bios, company affiliations, and linked session agendas with automated double-booking warnings.",
    features: [
      "Rich profiles with bio, company & topic tags",
      "Direct session linking across conference stages",
      "Automated speaker schedule collision warning",
    ],
    icon: Users,
    accentColor: {
      bg: "bg-blue-50",
      border: "border-blue-150",
      text: "text-blue-700",
      lightPill: "bg-blue-50 text-blue-700 border-blue-100",
    },
  },
  {
    id: "access",
    stepNumber: "03",
    tag: "Access & Capacity",
    title: "Hall Passes & Session Check-In",
    description:
      "Enforce hall capacity caps and validate delegate passes with your existing UrPass QR codes.",
    features: [
      "Validate existing UrPass attendee QR codes instantly",
      "Live room occupancy tracking with overflow caps",
      "0.28-second gate check-in with offline fallback",
    ],
    icon: DoorOpen,
    accentColor: {
      bg: "bg-emerald-50",
      border: "border-emerald-150",
      text: "text-emerald-700",
      lightPill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  },
];

export default function CorporateWhatsNewCard({
  firstEventId,
}: CorporateWhatsNewCardProps) {
  // Pure in-memory React state — no localStorage or session DB used
  const [isOpen, setIsOpen] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Keyboard navigation: Escape to close, Arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowRight") {
        setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const slide = SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === SLIDES.length - 1;
  const SlideIcon = slide.icon;

  function handleNext() {
    if (isLastSlide) {
      setIsOpen(false);
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
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-title"
    >
      {/* ── Simple, Sleek, Unified Corporate Modal Card ───────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[660px] bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden p-6 sm:p-9 flex flex-col justify-between animate-in zoom-in-95 duration-150 text-neutral-900"
      >
        {/* Top-Right Circular Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          type="button"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Header Row ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pr-10">
          <div
            className={`w-12 h-12 rounded-2xl ${slide.accentColor.bg} ${slide.accentColor.text} flex items-center justify-center shrink-0 border border-neutral-150 transition-colors duration-200`}
          >
            <SlideIcon className="w-6 h-6" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                {slide.stepNumber} / 03
              </span>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                {slide.tag}
              </span>
            </div>
            <span className="text-xs text-neutral-400 font-medium mt-0.5">
              UrPass Conference Updates
            </span>
          </div>
        </div>

        {/* ── Slide Content ───────────────────────────────────────────── */}
        <div className="my-6 space-y-4">
          <div className="space-y-1.5">
            <h2
              id="whats-new-title"
              className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug"
            >
              {slide.title}
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              {slide.description}
            </p>
          </div>

          {/* 3 Crisp Feature Checkmarks */}
          <div className="space-y-2 pt-2">
            {slide.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-150/70"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-neutral-800">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer Navigation & Actions ─────────────────────────────── */}
        <div className="pt-4 border-t border-neutral-150 flex items-center justify-between gap-4">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                type="button"
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  i === currentSlideIndex
                    ? "w-7 bg-neutral-900"
                    : "w-2 bg-neutral-200 hover:bg-neutral-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2.5">
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
                onClick={() => setIsOpen(false)}
                type="button"
                className="px-3.5 py-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 text-xs font-medium transition-colors cursor-pointer"
              >
                Skip
              </button>
            )}

            {isLastSlide ? (
              <Link
                href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-xs"
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
  );
}
