"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, X, ArrowRight, HelpCircle, CheckCircle } from "lucide-react";
import { trackConversionEvent } from "@/lib/conversion/tracker";
import { VisitorSegment } from "@/lib/conversion/types";

interface SignupAssistanceModalProps {
  segment?: VisitorSegment;
  hasStartedForm?: boolean;
}

export default function SignupAssistanceModal({
  segment = "general",
  hasStartedForm = false,
}: SignupAssistanceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Check session storage so modal is shown at most once per session
    try {
      if (sessionStorage.getItem("urpass_recovery_shown")) {
        setDismissed(true);
        return;
      }
    } catch {}

    // 1. Exit intent on desktop (cursor leaves top of viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && hasStartedForm && !dismissed) {
        triggerAssistance();
      }
    };

    // 2. Inactivity timer (45 seconds on page if form was touched)
    let inactivityTimer: NodeJS.Timeout;
    if (hasStartedForm) {
      inactivityTimer = setTimeout(() => {
        if (!dismissed) triggerAssistance();
      }, 45000);
    }

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [hasStartedForm, dismissed]);

  const triggerAssistance = () => {
    setIsOpen(true);
    try {
      sessionStorage.setItem("urpass_recovery_shown", "true");
    } catch {}
    trackConversionEvent("recovery_modal_shown", {
      pageSlug: "/signup",
      visitorSegment: segment,
      metadata: { trigger: "exit_intent_or_inactivity" },
    });
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setDismissed(true);
    trackConversionEvent("recovery_dismissed", {
      pageSlug: "/signup",
      visitorSegment: segment,
    });
  };

  const handleCtaClick = (destination: string) => {
    trackConversionEvent("recovery_cta_clicked", {
      pageSlug: "/signup",
      visitorSegment: segment,
      metadata: { destination },
    });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const segmentCopy = {
    college: {
      title: "Hosting a College Fest or Symposium?",
      subtext: "Free Forever tier supports up to 100 passes at 0% platform fee. Need multiple gates or fast pass designs? We can guide your student committee.",
      secondaryText: "Talk to Student Fest Team",
      secondaryHref: "/contact?segment=college",
    },
    corporate: {
      title: "Planning an Enterprise or Multi-Day Event?",
      subtext: "Start with our Free tier or let our enterprise specialists provide an SLA-backed walkthrough with GST billing and corporate SSO.",
      secondaryText: "Request Enterprise Demo",
      secondaryHref: "/contact?segment=corporate",
    },
    ticketing: {
      title: "Looking for 0% Commission Ticketing?",
      subtext: "Every rupee you collect goes directly to your Razorpay/bank account. No hidden platform cuts. Setup takes under 2 minutes.",
      secondaryText: "Calculate Savings",
      secondaryHref: "/ticket-fee-calculator",
    },
    managed_service: {
      title: "Prefer Done-For-You Remote Setup?",
      subtext: "Our engineers can configure your registration forms, ticket tiers, branded passes, and scanner manifest remotely from ₹1,000/event.",
      secondaryText: "Request Managed Setup",
      secondaryHref: "/contact?segment=managed_service",
    },
    general: {
      title: "Need Help Getting Your Event Live?",
      subtext: "Create unlimited free passes or sell tickets with 0% platform commission. Sub-second QR scanning works on any smartphone with no app install.",
      secondaryText: "Contact UrPass Team",
      secondaryHref: "/contact",
    },
  }[segment] || {
    title: "Need Help Getting Your Event Live?",
    subtext: "Create unlimited free passes or sell tickets with 0% platform commission. Sub-second QR scanning works on any smartphone with no app install.",
    secondaryText: "Contact UrPass Team",
    secondaryHref: "/contact",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recovery-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={handleDismiss}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200/60 flex items-center justify-center text-violet-700 mb-4">
          <Sparkles className="w-5 h-5" />
        </div>

        <h3 id="recovery-title" className="text-base font-bold text-neutral-900 tracking-tight">
          {segmentCopy.title}
        </h3>
        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
          {segmentCopy.subtext}
        </p>

        <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-700 space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Free Forever plan with no credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>0% Per-Ticket platform commission</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Scan QR passes in &lt;0.3s on any phone</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleDismiss}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
          >
            Continue Organizer Setup
          </button>
          <Link
            href={segmentCopy.secondaryHref}
            onClick={() => handleCtaClick(segmentCopy.secondaryHref)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{segmentCopy.secondaryText}</span>
            <ArrowRight className="w-3 h-3 text-neutral-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
