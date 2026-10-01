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
      // In case localStorage is blocked or private mode
      setIsVisible(true);
    }
  }, []);

  function handleDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setIsVisible(false);
  }

  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-neutral-200/90 shadow-xs hover:shadow-sm transition-all p-5 sm:p-6 text-neutral-900">
      {/* Subtle Canva / Zoho inspired ambient illumination */}
      <div
        className="absolute -right-12 -top-12 w-72 h-72 rounded-full pointer-events-none opacity-40 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)",
        }}
      />

      {/* Header Row: Badge, Subtitle & Dismiss Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-violet-600" />
            What&apos;s New
          </span>
          <span className="text-[11px] font-semibold text-neutral-400">
            Stage 1 · Conference &amp; Session Management
          </span>
        </div>

        <button
          onClick={handleDismiss}
          type="button"
          className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Dismiss and don't show again"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Headline & Description */}
      <div className="mt-3.5 space-y-1.5">
        <h2 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight leading-snug">
          Introducing Multi-Track Conference &amp; Agenda Management
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-3xl leading-relaxed">
          Scale beyond basic ticketing into full conference operations. Organize parallel session tracks, manage speakers, configure venue halls, and scan session QR passes seamlessly.
        </p>
      </div>

      {/* Feature Highlights Grid (4 Canva / Zoho Backstage style cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4 pt-1">
        <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100/90 flex items-start gap-2.5">
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

        <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100/90 flex items-start gap-2.5">
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

        <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100/90 flex items-start gap-2.5">
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

        <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100/90 flex items-start gap-2.5">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <Link
            href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>{firstEventId ? "Open Conference Agenda" : "Create a Conference"}</span>
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
          Dismissed cards will not be shown again
        </span>
      </div>
    </div>
  );
}
