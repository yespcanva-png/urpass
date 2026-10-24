"use client";

import React from "react";
import { ServiceComparison as ServiceComparisonType } from "@/lib/seo/types";
import { Check, Wrench, Sparkles, Shield, AlertCircle } from "lucide-react";

interface ServiceComparisonProps {
  comparison: ServiceComparisonType;
}

export default function ServiceComparison({ comparison }: ServiceComparisonProps) {
  return (
    <section className="py-16 md:py-20 bg-neutral-50/50 border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Delivery Models
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-3">
            {comparison.headline}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            Choose the operational model that matches your team bandwidth and technical comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Self-Service Model */}
          <div className="rounded-3xl bg-white border border-neutral-200/90 p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                  <Wrench className="w-3.5 h-3.5" /> Self-Service Platform
                </span>
                <span className="text-xs font-bold text-neutral-900">From ₹499/mo</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                You build and manage using UrPass tools
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-normal">
                Ideal for tech-savvy organizers, small committees, or recurring meetups who prefer direct control over every configuration.
              </p>

              <div className="space-y-3">
                {comparison.selfServicePoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
              Responsibility: Organizer manages dashboard, sets ticket tiers, and configures gate PINs directly.
            </div>
          </div>

          {/* Remote Managed Service Model */}
          <div className="rounded-3xl bg-gradient-to-b from-violet-50/70 via-white to-white border border-violet-300 p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/30 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Remote Managed Service
                </span>
                <span className="text-xs font-bold text-violet-800">From ₹1,000/event</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                UrPass engineers remotely configure everything
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-normal">
                Ideal for corporate HR teams, busy festival directors, and organizations that want guaranteed error-free technical setup.
              </p>

              <div className="space-y-3">
                {comparison.managedServicePoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-violet-100 text-xs text-violet-900/80">
              Responsibility: UrPass handles all technical setup remotely. Organizer provides gate staff, venue facilities, and scanner phones.
            </div>
          </div>
        </div>

        {/* Operational Boundary Notice */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-neutral-200 flex items-start sm:items-center gap-3 text-xs text-neutral-600">
          <AlertCircle className="w-4 h-4 text-violet-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Service Boundary Transparency:</strong> All UrPass managed services are delivered remotely by our cloud engineers. We do not provide physical venue security, statutory badge printing, or on-site gate staff.
          </span>
        </div>
      </div>
    </section>
  );
}
