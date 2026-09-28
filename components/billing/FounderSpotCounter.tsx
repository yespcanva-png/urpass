"use client";

import React from "react";
import { Lock, CheckCircle2, ShieldCheck } from "lucide-react";

interface Props {
  claimedCount?: number;
  totalCount?: number;
  variant?: "dark" | "gradient" | "compact";
  showFeaturesLock?: boolean;
  className?: string;
}

export default function FounderSpotCounter({
  claimedCount = 14,
  totalCount = 20,
  variant = "dark",
  showFeaturesLock = true,
  className = "",
}: Props) {
  const remaining = Math.max(0, totalCount - claimedCount);
  const percentage = Math.min(100, Math.round((claimedCount / totalCount) * 100));

  if (variant === "compact") {
    return (
      <div className={`space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-neutral-200 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>{claimedCount} of {totalCount} Founder Spots Claimed</span>
          </span>
          <span className="text-neutral-400 font-medium">Only {remaining} left</span>
        </div>
        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700/60">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showFeaturesLock && (
          <div className="flex items-center justify-between text-[11px] text-neutral-400 gap-2 pt-1 border-t border-neutral-800/80">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Landing page on urpass.space
            </span>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              Lifetime locked (2125)
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-neutral-800 p-4 sm:p-5 bg-neutral-900 text-white shadow-xs transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            <span className="text-neutral-400">Founder Allocation:</span>
            <span className="text-white font-bold">{claimedCount} of {totalCount} Claimed</span>
          </p>
        </div>

        <span className="inline-flex items-center self-start sm:self-auto gap-1.5 text-[11px] font-semibold tracking-wider text-neutral-300 bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Only {remaining} spots remaining</span>
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 rounded-full bg-neutral-800 p-0.5 overflow-hidden mb-2.5 border border-neutral-700/60">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>0 claimed</span>
        <span className="text-neutral-300 font-medium">Cohort closes permanently at 20</span>
        <span>20 max</span>
      </div>

      {showFeaturesLock && (
        <div className="mt-3.5 pt-3.5 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Create landing pages on <strong>urpass.space</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>Features locked in for lifetime (Term 2125)</span>
          </div>
        </div>
      )}
    </div>
  );
}
