"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  DoorOpen,
  Globe,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

function WhatsNewArtwork() {
  return (
    <div className="relative w-full h-44 sm:h-52 bg-gradient-to-br from-[#1e1b4b] via-[#1a0f37] to-[#0b0819] overflow-hidden select-none">
      {/* Ambient radial glows */}
      <div className="absolute -top-16 -left-16 w-60 h-60 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-10 w-52 h-52 bg-fuchsia-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-48 h-48 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative Grid Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Floating Canvas UI Cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Floating Left: Agenda Card */}
        <div className="absolute left-3 sm:left-6 top-5 sm:top-7 w-40 sm:w-48 p-2.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-xl -rotate-6 transform hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
              Track 1 · Hall A
            </span>
          </div>
          <p className="text-[11px] font-bold text-white leading-tight truncate">
            Opening Keynote Address
          </p>
          <p className="text-[9px] text-white/60 mt-0.5">10:00 AM – 11:00 AM</p>
        </div>

        {/* Center: Digital Pass Card with QR */}
        <div className="relative z-10 w-44 sm:w-52 p-3 rounded-2xl bg-gradient-to-b from-white/[0.22] to-white/[0.08] backdrop-blur-xl border border-white/30 shadow-2xl rotate-2 transform hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-violet-600 flex items-center justify-center font-bold text-[9px] text-white">
                UP
              </div>
              <span className="text-[10px] font-bold tracking-tight text-white">
                Conference Pass
              </span>
            </div>
            <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/25 text-amber-300 border border-amber-400/30">
              VIP Access
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mini vector QR code */}
            <div className="w-11 h-11 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-full h-full text-neutral-900 fill-current">
                <path d="M2 2h8v8H2zm2 2v4h4V4zm-2 8h8v8H2zm2 2v4h4v-4zm10-12h8v8h-8zm2 2v4h4V4zm2 10h-2v2h2zm-2 2h-2v4h4v-2h-2zm4 2h2v2h-2zm-2 2h2v-2h-2zm4-4h2v2h-2zm0 2h-2v2h2zm-2-4h2v-2h-2zm-4 0h2v2h-2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white truncate">Elena Rostova</p>
              <p className="text-[9px] text-white/70 truncate">Keynote Speaker</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-[8px] font-mono text-violet-300">PASS #9042</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Right: Speaker Badge */}
        <div className="absolute right-3 sm:right-6 bottom-5 sm:bottom-6 w-36 sm:w-44 p-2.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-xl rotate-6 transform hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-violet-500 p-0.5 shrink-0">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-bold text-white">
                SC
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white truncate">Sarah Chen</p>
              <p className="text-[8px] text-violet-300 font-semibold uppercase tracking-wider">
                Keynote Speaker
              </p>
            </div>
          </div>
        </div>

        {/* Ambient floating sparkles */}
        <div className="absolute top-4 right-16 text-amber-300/80 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-4 left-12 text-violet-300/80 animate-pulse delay-300">
          <Sparkles className="w-3.5 h-3.5" />
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

  // Keyboard shortcut: Escape to close
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-title"
    >
      {/* Modal Dialog Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg sm:max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-100 flex flex-col animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Floating Close Button */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-black/35 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
          title="Dismiss and don't show again"
          aria-label="Close update announcement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Top Art Work Illustration Banner ────────────────────────── */}
        <WhatsNewArtwork />

        {/* ── Modal Content Body ───────────────────────────────────────── */}
        <div className="p-6 sm:p-7 space-y-4">
          {/* Header Row: Badge & Subtitle */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-violet-600" />
              What&apos;s New
            </span>
            <span className="text-[11px] font-semibold text-neutral-400">
              Stage 1 · Conference &amp; Session Management
            </span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-1">
            <h2
              id="whats-new-title"
              className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight leading-snug"
            >
              Introducing Multi-Track Conference &amp; Agenda Management
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Scale beyond basic ticketing into full conference operations. Organize parallel session tracks, manage speakers, configure venue halls, and scan session QR passes seamlessly.
            </p>
          </div>

          {/* Feature Highlights Grid (4 Canva / Zoho Backstage style cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                <CalendarDays className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">Multi-Track Agenda</p>
                <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                  Timeline, calendar grid &amp; track collision prevention
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">Speaker Directory</p>
                <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                  Keynote profiles, bio linking &amp; double-booking alerts
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <DoorOpen className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">Halls &amp; Session Passes</p>
                <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                  Seat reservations, room limits &amp; QR check-ins
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">Public Event Website</p>
                <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                  Live branded landing page with My Agenda bookmarks
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <Link
                href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
                onClick={handleDismiss}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <span>{firstEventId ? "Explore Conference Agenda" : "Create a Conference"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleDismiss}
                type="button"
                className="px-3.5 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-medium transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            </div>

            <span className="text-[11px] text-neutral-400">
              Dismissed updates will not be shown again
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
