"use client";

import React from "react";
import { FeatureItem } from "@/lib/seo/types";
import {
  QrCode,
  ShieldCheck,
  CreditCard,
  Users,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Smartphone,
  BarChart3,
  Clock,
  Sparkles,
} from "lucide-react";

interface FeatureExplanationProps {
  features: FeatureItem[];
  h1: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  qr: QrCode,
  shield: ShieldCheck,
  card: CreditCard,
  users: Users,
  zap: Zap,
  check: CheckCircle2,
  lock: Lock,
  layers: Layers,
  mobile: Smartphone,
  chart: BarChart3,
  clock: Clock,
  sparkles: Sparkles,
};

export default function FeatureExplanation({ features, h1 }: FeatureExplanationProps) {
  return (
    <section className="py-16 md:py-20 bg-neutral-50/50 border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Tailored Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-3">
            Built Specifically For This Event Workflow
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            Engineered to eliminate entry chaos, prevent unauthorized sharing, and save organizing hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = ICON_MAP[feat.icon] || CheckCircle2;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-neutral-200/80 p-6 flex flex-col justify-between hover:border-violet-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center border border-violet-100 mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-4">
                    {feat.desc}
                  </p>

                  {feat.bullets && feat.bullets.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-neutral-100">
                      {feat.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-xs text-neutral-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
