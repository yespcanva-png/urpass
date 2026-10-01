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
  CheckCircle2,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

/**
 * Charming Canva-style vector illustration representing conference agenda & passes
 */
function ConferenceIllustration() {
  return (
    <div className="relative w-full h-44 bg-gradient-to-b from-[#F6F4FF] via-[#FAF9FF] to-white flex items-center justify-center select-none overflow-hidden border-b border-neutral-100">
      {/* Soft ambient background circles */}
      <div className="absolute w-56 h-56 rounded-full bg-violet-100/60 blur-2xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-44 h-44 rounded-full bg-amber-100/50 blur-xl pointer-events-none -bottom-8 -right-8" />

      {/* Handcrafted Vector Illustration */}
      <svg
        viewBox="0 0 320 160"
        className="w-full h-full max-w-[300px] max-h-[150px] relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft decorative backdrop halo */}
        <circle cx="160" cy="85" r="62" fill="#EDE9FE" opacity="0.65" />
        <circle cx="210" cy="65" r="38" fill="#FEF3C7" opacity="0.75" />

        {/* ── 1. Event Schedule Clipboard (Left) ── */}
        <g filter="drop-shadow(0 6px 14px rgba(109, 40, 217, 0.08))">
          {/* Board base */}
          <rect x="68" y="24" width="94" height="116" rx="10" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
          {/* Top Clipboard Clamp */}
          <rect x="99" y="18" width="32" height="10" rx="3" fill="#6D28D9" />
          <circle cx="115" cy="23" r="2" fill="#FFFFFF" />

          {/* Agenda Header Strip */}
          <rect x="76" y="36" width="78" height="14" rx="4" fill="#F3F0FF" />
          <circle cx="84" cy="43" r="3" fill="#7C3AED" />
          <rect x="91" y="41" width="46" height="4" rx="2" fill="#7C3AED" opacity="0.7" />

          {/* Schedule Row 1: Keynote */}
          <rect x="76" y="58" width="18" height="5" rx="2" fill="#9333EA" />
          <rect x="98" y="58" width="48" height="5" rx="2" fill="#374151" />
          <rect x="98" y="66" width="32" height="4" rx="2" fill="#9CA3AF" />

          {/* Divider */}
          <line x1="76" y1="76" x2="152" y2="76" stroke="#F3F4F6" strokeWidth="1" />

          {/* Schedule Row 2: Breakout Track */}
          <rect x="76" y="83" width="18" height="5" rx="2" fill="#2563EB" />
          <rect x="98" y="83" width="44" height="5" rx="2" fill="#374151" />
          <rect x="98" y="91" width="28" height="4" rx="2" fill="#9CA3AF" />

          {/* Divider */}
          <line x1="76" y1="101" x2="152" y2="101" stroke="#F3F4F6" strokeWidth="1" />

          {/* Schedule Row 3: Workshop */}
          <rect x="76" y="108" width="18" height="5" rx="2" fill="#059669" />
          <rect x="98" y="108" width="40" height="5" rx="2" fill="#374151" />
          <rect x="98" y="116" width="24" height="4" rx="2" fill="#9CA3AF" />
        </g>

        {/* ── 2. Conference VIP Digital Pass (Overlapping Right) ── */}
        <g filter="drop-shadow(0 10px 20px rgba(0, 0, 0, 0.12))">
          {/* Lanyard ribbon strap */}
          <path d="M 188 12 Q 192 34 195 44" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
          <path d="M 204 12 Q 200 34 197 44" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />

          {/* Metal clip */}
          <rect x="190" y="42" width="12" height="7" rx="2" fill="#9CA3AF" />
          <rect x="193" y="49" width="6" height="4" rx="1" fill="#4B5563" />

          {/* Pass Body */}
          <rect x="156" y="52" width="84" height="98" rx="10" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />

          {/* Top header badge */}
          <rect x="156" y="52" width="84" height="20" rx="9" fill="#18112E" />
          <text x="198" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
            CONFERENCE PASS
          </text>

          {/* VIP Access pill */}
          <rect x="166" y="77" width="64" height="12" rx="4" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="0.8" />
          <text x="198" y="86" textAnchor="middle" fill="#B45309" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
            ★ ALL ACCESS VIP
          </text>

          {/* Mini QR Code Vector glyph */}
          <rect x="166" y="94" width="28" height="28" rx="4" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
          <rect x="170" y="98" width="7" height="7" fill="#18112E" />
          <rect x="183" y="98" width="7" height="7" fill="#18112E" />
          <rect x="170" y="111" width="7" height="7" fill="#18112E" />
          <rect x="181" y="108" width="4" height="4" fill="#18112E" />
          <rect x="186" y="113" width="5" height="5" fill="#7C3AED" />

          {/* Attendee details text lines */}
          <rect x="198" y="98" width="34" height="4" rx="2" fill="#111827" />
          <rect x="198" y="105" width="26" height="3" rx="1.5" fill="#6B7280" />
          <rect x="198" y="111" width="30" height="3" rx="1.5" fill="#9CA3AF" />

          {/* Bottom barcode simulation */}
          <line x1="166" y1="133" x2="230" y2="133" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="3 2" />
        </g>

        {/* ── 3. Decorative Canva Sparkles & Accents ── */}
        {/* Top-right gold sparkle */}
        <path d="M 264 36 Q 264 42 270 42 Q 264 42 264 48 Q 264 42 258 42 Q 264 42 264 36" fill="#F59E0B" />
        <circle cx="280" cy="52" r="2.5" fill="#FBBF24" />

        {/* Top-left violet sparkle */}
        <path d="M 52 48 Q 52 54 58 54 Q 52 54 52 60 Q 52 54 46 54 Q 52 54 52 48" fill="#7C3AED" />
        <circle cx="40" cy="38" r="2" fill="#C4B5FD" />

        {/* Bottom floating mint dot */}
        <circle cx="56" cy="120" r="3" fill="#10B981" opacity="0.8" />
        <circle cx="260" cy="125" r="2.5" fill="#8B5CF6" opacity="0.6" />
      </svg>
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

  // Keyboard Escape listener
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-popup-title"
    >
      {/* ── Clean Canva-Style Popup Dialog (max-w-md) ───────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[430px] bg-white rounded-3xl shadow-2xl border border-neutral-150 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Subtle Circular Close Button in Top Right */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-400 hover:text-neutral-800 shadow-xs border border-neutral-200/60 flex items-center justify-center transition-all cursor-pointer"
          title="Dismiss"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Top Vector Illustration Banner ──────────────────────────── */}
        <ConferenceIllustration />

        {/* ── Content Body ────────────────────────────────────────────── */}
        <div className="p-6 pt-5 space-y-4">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold tracking-wider uppercase border border-violet-100">
              <Sparkles className="w-3 h-3 text-violet-600" />
              What&apos;s New in UrPass
            </span>
          </div>

          {/* Headline & Subhead */}
          <div className="space-y-1">
            <h2
              id="whats-new-popup-title"
              className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-snug"
            >
              Conference &amp; Agenda Management
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Plan multi-track schedules, showcase keynote speakers, and validate room entrance passes directly from your dashboard.
            </p>
          </div>

          {/* 3 Clean Canva-style Feature Bullets */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                <CalendarDays className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-neutral-600">
                <strong className="text-neutral-900 font-semibold">Multi-track agendas:</strong> Timeline &amp; calendar views with collision detection.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-neutral-600">
                <strong className="text-neutral-900 font-semibold">Speaker directory:</strong> Keynote bios, topic tags, and session assignments.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <DoorOpen className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-neutral-600">
                <strong className="text-neutral-900 font-semibold">Hall &amp; session check-in:</strong> Room capacity caps with instant QR entry.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-100 space-y-2">
            <Link
              href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
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
