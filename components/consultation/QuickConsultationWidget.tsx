"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Lock,
  Mail,
  Flame,
  PhoneCall,
} from "lucide-react";

interface Props {
  claimedCount?: number;
  totalCount?: number;
  defaultOpen?: boolean;
}

export default function QuickConsultationWidget({
  claimedCount = 14,
  totalCount = 20,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasDismissed, setHasDismissed] = useState(false);
  const remaining = Math.max(0, totalCount - claimedCount);
  const progressPercent = Math.min(100, Math.round((claimedCount / totalCount) * 100));

  const exitIntentTriggered = useRef(false);

  useEffect(() => {
    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem("founder_consultation_dismissed") === "true") {
        setHasDismissed(true);
      }
    } catch {
      // sessionStorage not available
    }

    // Exit intent detection (cursor moves to the top edge of viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 12 && !exitIntentTriggered.current && !hasDismissed) {
        exitIntentTriggered.current = true;
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasDismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
    try {
      sessionStorage.setItem("founder_consultation_dismissed", "true");
    } catch {
      // ignore
    }
  };

  const founderWhatsApp = "919001270298";
  const founderPhoneDisplay = "+91 90012 70298";
  const founderEmail = "srinithin@yespstudio.com";

  const quickMessages = [
    {
      title: "Claim 1 of 6 Founder Spots (₹19,999)",
      badge: "Urgent",
      text: "Hi Srinithin, I want to claim one of the remaining 6 Founder Lifetime spots on URPASS (₹19,999).",
    },
    {
      title: "Set up event landing page on urpass.space",
      badge: "Feature",
      text: "Hi Srinithin, I want to set up our custom event landing page on urpass.space with lifetime feature lock.",
    },
    {
      title: "College fest / conference setup question",
      badge: "Inquiry",
      text: "Hi Srinithin, I have a few questions about ticketing and multi-gate scanning for our upcoming event.",
    },
  ];

  return (
    <>
      {/* ── Floating Trigger Button (Always accessible) ── */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-[0_8px_30px_rgba(5,150,105,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-400/30 backdrop-blur-md"
            aria-label="Quick WhatsApp Consultation with URPASS Founder"
          >
            {/* Pulsing online badge */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>

            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span className="hidden sm:inline">Chat with Founder</span>
            <span className="sm:hidden">Chat</span>

            {/* Scarcity chip inside button */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-neutral-950 uppercase tracking-tight">
              {remaining} Left
            </span>
          </button>
        )}
      </div>

      {/* ── Slide-up Consultation Card ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="URPASS Founder Quick Consultation"
          className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] max-w-full rounded-3xl bg-neutral-950/95 border border-white/15 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 sm:p-6 animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand to-emerald-500 flex items-center justify-center font-black text-white text-sm shadow-md">
                  YS
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-neutral-950"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">Srinithin Somasundaram</h4>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand/20 text-brand-light border border-brand/30">
                    Founder
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span>Direct Hotline ({founderPhoneDisplay})</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close consultation modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Live Scarcity & Progress Indicator */}
          <div className="mt-4 p-3 rounded-2xl bg-white/[0.04] border border-amber-500/25">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-amber-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                {claimedCount} of {totalCount} Founder Accounts Claimed
              </span>
              <span className="text-neutral-400 font-medium">{remaining} spots left</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand via-purple-500 to-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Term 2125 Lifetime Lock
              </span>
              <span>₹19,999 One-Time</span>
            </div>
          </div>

          {/* Value Prop Callout: Custom Landing Page on urpass.space */}
          <div className="mt-3 p-3 rounded-2xl bg-brand/10 border border-brand/20 text-[11px] leading-relaxed text-neutral-300">
            <div className="flex items-center gap-1.5 font-bold text-white mb-1">
              <Globe className="w-3.5 h-3.5 text-brand-light" />
              <span>Host your event page on urpass.space</span>
            </div>
            Launch your custom event landing page at{" "}
            <code className="text-brand-light font-mono px-1 py-0.5 rounded bg-black/40">
              urpass.space/apply/[your-event]
            </code>{" "}
            with Ticket Studio, zero platform commission, and full features locked for life.
          </div>

          {/* Instant Quick-Chat Prompts */}
          <div className="mt-3.5 space-y-1.5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-1">
              Pick a question to open on WhatsApp:
            </p>
            {quickMessages.map((qm, i) => (
              <a
                key={i}
                href={`https://wa.me/${founderWhatsApp}?text=${encodeURIComponent(qm.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 text-xs transition-all text-neutral-200 hover:text-white"
              >
                <span className="text-left font-medium leading-snug line-clamp-1">
                  {qm.title}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2">
            <a
              href={`https://wa.me/${founderWhatsApp}?text=${encodeURIComponent(
                "Hi Srinithin, I want to talk about URPASS Founder Lifetime Deal and setting up our event page."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.4)]"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Open WhatsApp Chat</span>
            </a>

            <a
              href={`mailto:${founderEmail}?subject=URPASS%20Founder%20Deal%20Consultation`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Founder</span>
            </a>
          </div>

          <p className="text-[10px] text-center text-neutral-500 mt-2.5">
            Replies within minutes · Direct founder access · No bot
          </p>
        </div>
      )}
    </>
  );
}
