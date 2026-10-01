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
  CheckCircle2,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

/**
 * Clean Canva-style illustration artwork
 * Modern pastel palette, generous white space, and crisp vector UI
 */
function CanvaCorporateArtwork() {
  return (
    <div className="relative w-full h-48 bg-gradient-to-b from-[#F7F5FF] via-[#FAF9FF] to-white flex items-center justify-center p-6 select-none overflow-hidden border-b border-neutral-100">
      {/* Soft ambient pastel shapes */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-violet-100/60 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-fuchsia-100/50 blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-32 bg-indigo-50/70 rounded-full blur-xl pointer-events-none" />

      {/* Subtle modern geometric background lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="canva-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#000" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#canva-dots)" />
      </svg>

      {/* Main Focus: Crisp, beautifully typeset Agenda Schedule Card */}
      <div className="relative z-10 w-full max-w-[340px] bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-150/80">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" />
            <span className="text-[11px] font-bold text-neutral-800 tracking-tight">
              Main Hall · Track A
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Session
          </span>
        </div>

        {/* Card Title & Time */}
        <div className="pt-2.5 pb-2">
          <p className="text-xs font-bold text-neutral-900 leading-snug">
            Future of Creative Technology &amp; AI
          </p>
          <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-400" />
            10:00 AM – 11:30 AM · Auditorium 1
          </p>
        </div>

        {/* Card Footer: Speaker chip & seats badge */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100/80 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-[9px] shrink-0">
              PS
            </div>
            <span className="font-semibold text-neutral-700 truncate max-w-[120px]">
              Priya Sharma
            </span>
          </div>

          <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-150">
            340 / 500 Seats
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CorporateWhatsNewCard({
  firstEventId,
}: CorporateWhatsNewCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  // Escape key handler
  useEffect(() => {
    if (!isVisible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-title"
    >
      {/* Modal Dialog (Canva Clean Aesthetic) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-100 flex flex-col animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Subtle Close Button */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-400 hover:text-neutral-700 shadow-xs border border-neutral-200/60 flex items-center justify-center transition-all cursor-pointer"
          title="Dismiss"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Artwork Illustration Banner ─────────────────────────────── */}
        <CanvaCorporateArtwork />

        {/* ── Content Body ────────────────────────────────────────────── */}
        <div className="p-6 sm:p-7 pt-5 space-y-4">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold tracking-wider uppercase border border-violet-100/80">
              <Sparkles className="w-3 h-3 text-violet-600" />
              What&apos;s New
            </span>
          </div>

          {/* Headline & Subhead */}
          <div className="space-y-1">
            <h2
              id="whats-new-title"
              className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-snug"
            >
              Conference &amp; Agenda Management
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Design multi-track conference schedules, manage keynote speakers, and validate room entry with single-pass QR check-ins.
            </p>
          </div>

          {/* Canva-style Vertical Feature Highlights */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 leading-none">
                  Multi-Track Scheduling
                </p>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">
                  Organize parallel sessions by tracks, halls, and time blocks with conflict detection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 leading-none">
                  Speaker Directory
                </p>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">
                  Highlight keynote speakers, link biographies, and assign them directly to sessions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <DoorOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 leading-none">
                  Hall Capacities &amp; Check-In
                </p>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">
                  Set venue limits, reserve seats, and scan attendee QR badges at hall entrance doors.
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-neutral-100 space-y-2">
            <Link
              href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{firstEventId ? "Explore Conference Agenda" : "Create an Event"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleDismiss}
              type="button"
              className="w-full text-center py-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors font-medium cursor-pointer"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
