"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Wrench, ShieldCheck, Check } from "lucide-react";
import { trackConversion } from "@/lib/seo/analytics";
import LeadCaptureModal from "./LeadCaptureModal";

interface DualConversionCTAProps {
  pageSlug: string;
  contentCluster?: string;
  position?: "hero" | "mid" | "footer" | "sticky";
  selfServiceLabel?: string;
  managedServiceLabel?: string;
  selfServiceSubtext?: string;
  managedServiceSubtext?: string;
  className?: string;
  eventTypeName?: string;
}

export default function DualConversionCTA({
  pageSlug,
  contentCluster = "general",
  position = "hero",
  selfServiceLabel = "Create Your Event",
  managedServiceLabel = "Let UrPass Manage It",
  selfServiceSubtext = "Self-Service · Free Forever Plan Available · 0% Ticket Commission",
  managedServiceSubtext = "Remote Managed Service · From ₹1,000/event · Remote Setup by UrPass Engineers",
  className = "",
  eventTypeName,
}: DualConversionCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelfServiceClick = () => {
    trackConversion("self_service_cta_click", {
      pageSlug,
      contentCluster,
      ctaPosition: position,
      serviceModel: "self_service",
    });
  };

  const handleManagedClick = () => {
    trackConversion("managed_service_cta_click", {
      pageSlug,
      contentCluster,
      ctaPosition: position,
      serviceModel: "managed_service",
    });
    setModalOpen(true);
  };

  return (
    <div className={`w-full max-w-3xl ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Self-Service Path */}
        <div className="group relative rounded-2xl bg-white border border-neutral-200/90 hover:border-violet-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-neutral-600" /> Self-Service Setup
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Instant Access
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 line-clamp-2">
              Sign up, configure your event forms, connect Razorpay, and issue QR passes independently.
            </p>
          </div>

          <div>
            <Link
              href={`/signup?from=${encodeURIComponent(pageSlug)}&intent=self_service`}
              onClick={handleSelfServiceClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-sm group-hover:bg-violet-700"
            >
              <span>{selfServiceLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="text-[11px] text-neutral-600 text-center mt-2">
              {selfServiceSubtext}
            </p>
          </div>
        </div>

        {/* Remote Managed Service Path */}
        <div className="group relative rounded-2xl bg-gradient-to-b from-violet-50/60 to-white border border-violet-200/80 hover:border-violet-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Remote Managed Service
              </span>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-full border border-violet-200">
                Done-For-You
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 line-clamp-2">
              Our engineers remotely configure your registration forms, ticket tiers, branded passes, and scanner access.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleManagedClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-semibold text-sm transition-all shadow-sm shadow-violet-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>{managedServiceLabel}</span>
            </button>
            <p className="text-[11px] text-neutral-600 text-center mt-2">
              {managedServiceSubtext}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-neutral-600">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 0% Platform Commission
        </span>
        <span className="text-neutral-400">•</span>
        <span className="inline-flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-violet-600" /> Remote Technical Support Only
        </span>
      </div>

      {modalOpen && (
        <LeadCaptureModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          pageSlug={pageSlug}
          contentCluster={contentCluster}
          eventTypeName={eventTypeName}
        />
      )}
    </div>
  );
}
