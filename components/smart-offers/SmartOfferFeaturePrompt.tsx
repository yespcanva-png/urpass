"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Ticket, Zap } from "lucide-react";
import { isEventPassProFeature } from "@/lib/billing/event-passes";

interface Props {
  featureKey: string;
  featureName: string;
  isOneTimeEligible?: boolean;
  onSelectPass?: () => void;
  className?: string;
}

export default function SmartOfferFeaturePrompt({
  featureKey,
  featureName,
  isOneTimeEligible = true,
  onSelectPass,
  className = "",
}: Props) {
  const isSingleEventPassApplicable =
    isOneTimeEligible && isEventPassProFeature(featureKey);

  return (
    <div
      className={`rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/80 via-white to-purple-50/50 p-5 shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-violet-600 text-white shrink-0 mt-0.5">
          <Zap className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-2 py-0.5 rounded">
              Feature Unlocked With
            </span>
          </div>
          <h4 className="text-sm font-bold text-neutral-900">
            {featureName} is available on Pro &amp; Single-Event Passes
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Running just one event? You don&apos;t need an ongoing monthly subscription. You can unlock {featureName} for your upcoming event with a single ₹299 Event Pass.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {isSingleEventPassApplicable && (
          <button
            type="button"
            onClick={onSelectPass}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Unlock with Event Pass (₹299)</span>
          </button>
        )}

        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
        >
          <span>Compare All Plans</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1 border-t border-violet-100">
        <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
        <span>0% platform commission · No recurring subscription locked in</span>
      </div>
    </div>
  );
}
