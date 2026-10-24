"use client";

import React from "react";
import { WorkflowStep } from "@/lib/seo/types";
import { Calendar, QrCode, ScanLine, ArrowRight } from "lucide-react";

interface EventWorkflowProps {
  title: string;
  steps: WorkflowStep[];
}

const STEP_ICONS = [Calendar, QrCode, ScanLine];

export default function EventWorkflow({ title, steps }: EventWorkflowProps) {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Step-By-Step Execution
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-3">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            A reliable, transparent journey from initial guest registration through gate entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, index) => {
            const Icon = STEP_ICONS[index % STEP_ICONS.length] || Calendar;
            return (
              <div
                key={s.step}
                className="relative rounded-2xl bg-neutral-50/70 border border-neutral-200/80 p-6 flex flex-col justify-between hover:border-violet-300 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-violet-700 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center border border-violet-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {s.title}
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center text-xs font-semibold text-violet-700">
                  <span>Phase {s.step} of 3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
