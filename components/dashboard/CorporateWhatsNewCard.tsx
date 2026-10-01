"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  CalendarDays,
  Users,
  QrCode,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { dismissWhatsNewAnnouncement } from "@/app/actions/user-preferences";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
  isDismissedInDb?: boolean | null;
}

export default function CorporateWhatsNewCard({
  firstEventId,
  isDismissedInDb,
}: CorporateWhatsNewCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // If parent passed explicit dismissal status, respect it
    if (isDismissedInDb === true) {
      setIsOpen(false);
      setIsChecked(true);
      return;
    }

    // Check user database metadata directly
    async function checkDbDismissal() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const dismissed = Boolean(
            user.user_metadata?.whats_new_conference_dismissed
          );
          if (!dismissed) {
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Failed to check announcement dismissal in DB:", err);
      } finally {
        setIsChecked(true);
      }
    }

    checkDbDismissal();
  }, [isDismissedInDb]);

  // Permanently update the database so it never shows again
  async function handleDismiss() {
    setIsOpen(false);

    try {
      // 1. Update DB via server action
      dismissWhatsNewAnnouncement("whats_new_conference_dismissed").catch(() => {});

      // 2. Direct API call with keepalive
      fetch("/api/user/dismiss-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureKey: "whats_new_conference_dismissed" }),
        keepalive: true,
      }).catch(() => {});

      // 3. Update active client session cache
      const supabase = createClient();
      supabase.auth.updateUser({
        data: { whats_new_conference_dismissed: true },
      }).catch(() => {});
    } catch (err) {
      console.error("Failed to update dismissal in database:", err);
    }
  }

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isChecked || !isOpen) {
    return null;
  }

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-modal-title"
    >
      {/* ── OpenAI / Zoho Style What's New Card ──────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-150 text-neutral-900"
      >
        {/* Subtle Close Button in Top Right */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-5 right-5 w-8 h-8 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Header: Centered Icon & Typography (OpenAI Style) ───────── */}
        <div className="text-center space-y-2 mb-6 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>

          <div className="space-y-1">
            <h2
              id="whats-new-modal-title"
              className="text-xl font-bold tracking-tight text-neutral-900"
            >
              What&apos;s new in UrPass
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm mx-auto">
              Introducing Conference &amp; Agenda Management for seamless multi-track event operations.
            </p>
          </div>
        </div>

        {/* ── Feature Rows (Zoho & OpenAI Style) ──────────────────────── */}
        <div className="space-y-4 my-6">
          {/* Row 1: Multi-Track Agendas */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0 border border-violet-100 mt-0.5">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900">
                Multi-Track Agenda Builder
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Build parallel tracks, configure halls, and catch timing collisions automatically with timeline &amp; calendar views.
              </p>
            </div>
          </div>

          {/* Row 2: Speaker Directory */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900">
                Keynote &amp; Speaker Directory
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Publish keynote profiles, company bios, and linked talks with automated double-booking warnings.
              </p>
            </div>
          </div>

          {/* Row 3: Hall Passes & QR Check-In */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900">
                Hall Passes &amp; QR Check-In
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Enforce room occupancy caps and scan existing attendee passes instantly in 0.28 seconds.
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions: Full-Width Primary CTA + Dismiss ────────────────── */}
        <div className="pt-4 border-t border-neutral-100 space-y-2">
          <Link
            href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>{firstEventId ? "Explore Conference Agenda" : "Create an Event"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleDismiss}
            type="button"
            className="w-full text-center py-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors font-medium cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
