"use client";

import React from "react";
import DualConversionCTA from "./DualConversionCTA";
import { Sparkles, ShieldCheck, Zap, Users, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  badge: string;
  h1: string;
  valueProposition: string;
  openingAnswer: string;
  pageSlug: string;
  contentCluster?: string;
  audience?: string;
}

export default function HeroSection({
  badge,
  h1,
  valueProposition,
  openingAnswer,
  pageSlug,
  contentCluster,
  audience,
}: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-neutral-100 bg-gradient-to-b from-violet-50/40 via-white to-white">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-violet-200/30 via-indigo-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-violet-100/80 text-violet-800 border border-violet-200/60 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>{badge}</span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 max-w-4xl leading-[1.15] mb-6">
          {h1}
        </h1>

        {/* Value Proposition */}
        <p className="text-lg sm:text-xl text-neutral-700 max-w-2xl font-normal leading-relaxed mb-6">
          {valueProposition}
        </p>

        {/* Opening Direct Answer Box (AI-Search & GEO Optimized) */}
        <div className="w-full max-w-3xl bg-white rounded-2xl border border-violet-200/80 p-5 sm:p-6 text-left shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-600" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700 mb-2">
            <CheckCircle2 className="w-4 h-4 text-violet-600" />
            <span>How UrPass Solves This For Event Organizers</span>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed font-normal">
            {openingAnswer}
          </p>
          {audience && (
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Target Audience: <strong className="text-neutral-700">{audience}</strong></span>
              <span>Execution: <strong className="text-violet-700">Self-Service or Remote Managed</strong></span>
            </div>
          )}
        </div>

        {/* Dual Conversion CTA */}
        <DualConversionCTA
          pageSlug={pageSlug}
          contentCluster={contentCluster}
          position="hero"
          eventTypeName={h1}
        />
      </div>
    </section>
  );
}
