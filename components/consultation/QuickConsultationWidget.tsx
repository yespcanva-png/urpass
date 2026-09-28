"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  ArrowUpRight,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { detectCountryClient } from "@/lib/country-config";

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
  const [customMessage, setCustomMessage] = useState("");
  const [isUk, setIsUk] = useState(false);
  const remaining = Math.max(0, totalCount - claimedCount);

  const exitIntentTriggered = useRef(false);

  useEffect(() => {
    setIsUk(detectCountryClient() === "GB");

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
  const priceDisplay = isUk ? "£249" : "₹19,999";

  const quickMessages = [
    {
      title: `Claim 1 of 6 Founder Spots (${priceDisplay})`,
      text: `Hi Srinithin, I want to claim one of the remaining 6 Founder Lifetime spots on URPASS (${priceDisplay}).`,
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

  const handleSendCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const messageToSend = customMessage.trim() || `Hi Srinithin, I want to talk about URPASS Founder Lifetime Deal (${priceDisplay}).`;
    window.open(`https://wa.me/${founderWhatsApp}?text=${encodeURIComponent(messageToSend)}`, "_blank");
    setCustomMessage("");
  };

  return (
    <>
      {/* ── Chatbot Floating Launcher ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm border border-neutral-700 shadow-xl transition-all duration-200 hover:border-neutral-500 active:scale-95"
            aria-label="Quick WhatsApp Consultation with URPASS Founder"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat with Founder</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
              {remaining} Left
            </span>
          </button>
        )}
      </div>

      {/* ── Conversational Chatbot Window ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="URPASS Founder Quick Consultation"
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-full rounded-2xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        >
          {/* Chatbot Header */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-200 text-xs">
                  YS
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-white">Srinithin Somasundaram</h4>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                    Founder
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Direct Hotline ({founderPhoneDisplay})</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close consultation modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chatbot Message Stream */}
          <div className="p-3.5 space-y-3 overflow-y-auto flex-1 bg-neutral-950">
            {/* Timestamp / Context Pill */}
            <div className="text-center">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800/80 text-[10px] text-neutral-400 font-medium">
                {claimedCount} of {totalCount} Founder Accounts Claimed · {remaining} spots left
              </span>
            </div>

            {/* Bubble 1 from Founder */}
            <div className="flex items-start gap-2 max-w-[90%]">
              <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[9px] font-bold text-neutral-300 shrink-0 mt-0.5">
                YS
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 leading-relaxed space-y-1">
                <p>
                  Hey! I&apos;m Srinithin. We have <span className="font-semibold text-white">{remaining} spots left</span> for the Founder Lifetime Deal ({priceDisplay} one-time lock).
                </p>
              </div>
            </div>

            {/* Bubble 2 from Founder */}
            <div className="flex items-start gap-2 max-w-[90%]">
              <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[9px] font-bold text-neutral-300 shrink-0 mt-0.5">
                YS
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 leading-relaxed">
                <p>
                  <strong className="text-white block font-medium mb-0.5">Host your event page on urpass.space</strong>
                  Custom branding, zero ticketing commission, and lifetime feature lock. What can I help with?
                </p>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="pt-1 space-y-1.5 pl-8">
              <p className="text-[10px] font-medium text-neutral-500">Pick a question to open on WhatsApp:</p>
              {quickMessages.map((qm, i) => (
                <a
                  key={i}
                  href={`https://wa.me/${founderWhatsApp}?text=${encodeURIComponent(qm.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-all text-left"
                >
                  <span className="line-clamp-1 text-[11px]">{qm.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Chatbot Interactive Input & Actions */}
          <div className="p-3 bg-neutral-900/60 border-t border-neutral-800 space-y-2">
            <form onSubmit={handleSendCustom} className="flex items-center gap-1.5">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ask Srinithin anything..."
                className="flex-1 bg-neutral-900 border border-neutral-750 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center shrink-0"
                aria-label="Send WhatsApp message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-800/60 text-neutral-400">
              <a
                href={`https://wa.me/${founderWhatsApp}?text=${encodeURIComponent(
                  `Hi Srinithin, I would like to consult on the URPASS Founder Lifetime Deal (${priceDisplay}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Open WhatsApp Chat</span>
              </a>

              <a
                href={`mailto:${founderEmail}?subject=URPASS%20Founder%20Consultation`}
                className="hover:text-neutral-200 flex items-center gap-1 transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>Email Founder</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
