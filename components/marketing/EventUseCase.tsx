"use client";

import React from "react";
import { PracticalScenario } from "@/lib/seo/types";
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from "lucide-react";

interface EventUseCaseProps {
  scenario: PracticalScenario;
}

export default function EventUseCase({ scenario }: EventUseCaseProps) {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Real-World Scenario
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-3">
            {scenario.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Problem */}
          <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-amber-950 mb-2">The Operational Challenge</h3>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed font-normal">
                {scenario.problem}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/50 text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              Before UrPass
            </div>
          </div>

          {/* Solution */}
          <div className="rounded-2xl bg-violet-50/60 border border-violet-200/80 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center border border-violet-200 mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-violet-950 mb-2">The UrPass Approach</h3>
              <p className="text-xs sm:text-sm text-violet-900/80 leading-relaxed font-normal">
                {scenario.solution}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-violet-200/50 text-[11px] font-bold text-violet-800 uppercase tracking-wide">
              Workflow Solution
            </div>
          </div>

          {/* Outcome */}
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-emerald-950 mb-2">Verified Result</h3>
              <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed font-normal">
                {scenario.outcome}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/50 text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
              Measurable Outcome
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
