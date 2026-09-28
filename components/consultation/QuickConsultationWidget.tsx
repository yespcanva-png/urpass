"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
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
    try {
      if (sessionStorage.getItem("founder_consultation_dismissed") === "true") {
        setHasDismissed(true);
      }
    } catch {
      // sessionStorage not available
    }

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
      text: "Hi Srinithin, I want to claim one of the remaining 6 Founder Lifetime spots on URPASS (₹19,999).",
    },
    {
      title: "Set up event landing page on urpass.space",
      text: "Hi Srinithin, I want to set up our custom event landing page on urpass.space with lifetime feature lock.",
    },
    {
      title: "College fest / conference setup question",
      text: "Hi Srinithin, I have a few questions about ticketing and multi-gate scanning for our upcoming event.",
    },
  ];

  return (
    <>
      {/* ── Corporate Floating Launcher ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm border border-neutral-700 shadow-xl transition-all duration-200 hover:border-neutral-500 active:scale-95"
            aria-label="Quick WhatsApp Consultation with URPASS Founder"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat with Founder</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
              {remaining} Left
            </span>
          </button>
        )}
      </div>

      {/* ── Clean Corporate Consultation Modal ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="URPASS Founder Quick Consultation"
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2.5rem)] sm:w-[400px] max-w-full rounded-2xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Executive Header */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-semibold text-neutral-200 text-sm tracking-wide shrink-0">
                YS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    Srinithin Somasundaram
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                    Founder
                  </span>
                </div>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3 h-3 text-neutral-500" />
                  <span>Direct Hotline ({founderPhoneDisplay})</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close consultation modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Allocation & Lifetime Lock Status */}
          <div className="mt-4 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
            <div className="flex items-center justify-between text-neutral-300 font-medium mb-2">
              <span>{claimedCount} of {totalCount} Founder Accounts Claimed</span>
              <span className="text-neutral-400">{remaining} spots left</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mb-2.5">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Term 2125 Lifetime Lock
              </span>
              <span className="font-semibold text-neutral-200">₹19,999 One-Time</span>
            </div>
          </div>

          {/* Domain Deployment Callout */}
          <div className="mt-3 p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed">
            <div className="flex items-center gap-1.5 font-medium text-white mb-1">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>Host your event page on urpass.space</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Launch your custom event landing page at{" "}
              <code className="text-neutral-200 font-mono bg-neutral-800 px-1 py-0.5 rounded text-[10px]">
                urpass.space/apply/[your-event]
              </code>{" "}
              with Ticket Studio, zero platform commission, and full features locked for life.
            </p>
          </div>

          {/* Question Selector */}
          <div className="mt-4 space-y-1.5">
            <p className="text-[11px] font-medium text-neutral-400 px-0.5">
              Pick a question to open on WhatsApp:
            </p>
            {quickMessages.map((qm, i) => (
              <a
                key={i}
                href={`https://wa.me/${founderWhatsApp}?text=${encodeURIComponent(qm.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/90 border border-neutral-800/80 hover:border-neutral-700 text-xs text-neutral-200 hover:text-white transition-colors"
              >
                <span className="font-medium line-clamp-1">{qm.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-200 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>

          {/* Corporate Action CTAs */}
          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-2">
            <a
              href={`https://wa.me/${founderWhatsApp}?text=${encodeURIComponent(
                "Hi Srinithin, I would like to consult on the URPASS Founder Lifetime Deal and enterprise event setup."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open WhatsApp Chat</span>
            </a>

            <a
              href={`mailto:${founderEmail}?subject=URPASS%20Founder%20Consultation`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Founder</span>
            </a>
          </div>

          <p className="text-[10px] text-center text-neutral-500 mt-2.5">
            Direct founder communication · Fast response
          </p>
        </div>
      )}
    </>
  );
}
