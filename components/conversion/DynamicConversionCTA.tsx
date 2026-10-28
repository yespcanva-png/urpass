"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Wrench, ShieldCheck, Check, Layers } from "lucide-react";
import { trackConversionEvent } from "@/lib/conversion/tracker";
import { getOrCreateClientSessionId, detectVisitorSegment } from "@/lib/conversion/attribution";
import { getClientCTAConfig } from "@/lib/conversion/cta-engine";
import { assignVariantDeterministic } from "@/lib/conversion/experiments";
import { VisitorSegment, ExperimentVariant } from "@/lib/conversion/types";
import LeadCaptureModal from "@/components/marketing/LeadCaptureModal";

interface DynamicConversionCTAProps {
  pageSlug: string;
  contentCluster?: string;
  position?: "hero" | "mid" | "footer" | "sticky";
  overrideSegment?: VisitorSegment;
  customPrimaryLabel?: string;
  customPrimarySubtext?: string;
  customSecondaryLabel?: string;
  customSecondarySubtext?: string;
  activeExperiment?: {
    id: string;
    experimentKey: string;
    variants: ExperimentVariant[];
  } | null;
  className?: string;
}

export default function DynamicConversionCTA({
  pageSlug,
  contentCluster = "general",
  position = "hero",
  overrideSegment,
  customPrimaryLabel,
  customPrimarySubtext,
  customSecondaryLabel,
  customSecondarySubtext,
  activeExperiment,
  className = "",
}: DynamicConversionCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const segment = overrideSegment || detectVisitorSegment(pageSlug);
  const baseConfig = getClientCTAConfig(segment);

  // Evaluate A/B experiment variant deterministically
  let assignedVariant: any = null;
  if (typeof window !== "undefined" && activeExperiment) {
    const sessionId = getOrCreateClientSessionId();
    assignedVariant = assignVariantDeterministic(sessionId, activeExperiment);
  }

  // Allow variant payload overrides
  const primaryLabel =
    assignedVariant?.payload?.primaryCtaLabel ||
    customPrimaryLabel ||
    baseConfig.primaryCtaLabel;

  const primarySubtext =
    assignedVariant?.payload?.primaryCtaSubtext ||
    customPrimarySubtext ||
    baseConfig.primaryCtaSubtext;

  const secondaryLabel =
    assignedVariant?.payload?.secondaryCtaLabel ||
    customSecondaryLabel ||
    baseConfig.secondaryCtaLabel;

  const secondarySubtext =
    assignedVariant?.payload?.secondaryCtaSubtext ||
    customSecondarySubtext ||
    baseConfig.secondaryCtaSubtext;

  const badgeText =
    assignedVariant?.payload?.badgeText || baseConfig.badgeText;

  useEffect(() => {
    setMounted(true);
    // Track exposure if an experiment is active
    if (activeExperiment && assignedVariant) {
      trackConversionEvent("experiment_exposed", {
        pageSlug,
        contentCluster,
        visitorSegment: segment,
        ctaPosition: position,
        experimentId: activeExperiment.id,
        variantId: assignedVariant.variantId,
        metadata: {
          variantKey: assignedVariant.variantKey,
          isControl: assignedVariant.isControl,
        },
      });
    }
  }, [activeExperiment, assignedVariant, pageSlug, contentCluster, segment, position]);

  const handlePrimaryClick = () => {
    trackConversionEvent("primary_cta_click", {
      pageSlug,
      contentCluster,
      visitorSegment: segment,
      ctaPosition: position,
      experimentId: activeExperiment?.id,
      variantId: assignedVariant?.variantId,
      metadata: {
        label: primaryLabel,
        segment,
      },
    });
  };

  const handleSecondaryClick = () => {
    trackConversionEvent("secondary_cta_click", {
      pageSlug,
      contentCluster,
      visitorSegment: segment,
      ctaPosition: position,
      experimentId: activeExperiment?.id,
      variantId: assignedVariant?.variantId,
      metadata: {
        label: secondaryLabel,
        segment,
      },
    });

    if (baseConfig.secondaryCtaUrl?.includes("contact") || segment === "managed_service") {
      setModalOpen(true);
    }
  };

  const signupUrl = `/signup?from=${encodeURIComponent(pageSlug)}&segment=${segment}&intent=organizer_signup`;

  return (
    <div className={`w-full max-w-3xl ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Primary Organizer Action */}
        <div className="group relative rounded-2xl bg-white border border-neutral-200/90 hover:border-violet-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-neutral-600" /> Organizer Platform
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {badgeText || "Instant Access"}
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 line-clamp-2">
              Create tickets, configure event forms, issue branded passes, and scan guest check-ins with 0% platform fee.
            </p>
          </div>

          <div>
            <Link
              href={signupUrl}
              onClick={handlePrimaryClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-sm group-hover:bg-violet-700"
            >
              <span>{primaryLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {primarySubtext && (
              <p className="text-[11px] text-neutral-600 text-center mt-2">
                {primarySubtext}
              </p>
            )}
          </div>
        </div>

        {/* Secondary / Consultative Action */}
        <div className="group relative rounded-2xl bg-gradient-to-b from-violet-50/60 to-white border border-violet-200/80 hover:border-violet-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Specialist Support
              </span>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-full border border-violet-200">
                Managed or Walkthrough
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 line-clamp-2">
              Need assistance or prefer remote done-for-you event setup by UrPass engineers? We configure everything for you.
            </p>
          </div>

          <div>
            {baseConfig.secondaryCtaUrl?.includes("contact") || segment === "managed_service" ? (
              <button
                type="button"
                onClick={handleSecondaryClick}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all shadow-sm"
              >
                <span>{secondaryLabel}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={baseConfig.secondaryCtaUrl || "/features"}
                onClick={handleSecondaryClick}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all shadow-sm"
              >
                <span>{secondaryLabel}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            {secondarySubtext && (
              <p className="text-[11px] text-neutral-600 text-center mt-2">
                {secondarySubtext}
              </p>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <LeadCaptureModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          pageSlug={pageSlug}
          contentCluster={contentCluster}
        />
      )}
    </div>
  );
}
