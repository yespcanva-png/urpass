"use client";

import React from "react";
import { Sparkles, Users, Lock, CheckCircle2, ShieldCheck } from "lucide-react";

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
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {claimedCount} of {totalCount} Founder Spots Claimed
          </span>
          <span className="text-white/70 font-medium">Only {remaining} left</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand via-purple-500 to-amber-400 transition-all duration-1000 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showFeaturesLock && (
          <div className="flex items-center justify-between text-[11px] text-neutral-300 gap-2 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              Landing page on urpass.space
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <Lock className="w-3 h-3 shrink-0" />
              Lifetime locked (2125)
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-md transition-all ${
        variant === "gradient"
          ? "bg-gradient-to-r from-brand/15 via-purple-900/20 to-amber-500/10 border-amber-400/30 shadow-[0_4px_24px_rgba(124,58,237,0.15)]"
          : "bg-white/[0.04] border-white/10"
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <p className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>Founder Allocation:</span>
            <span className="text-amber-300 font-extrabold">{claimedCount} of {totalCount} Claimed</span>
          </p>
        </div>

        <span className="inline-flex items-center self-start sm:self-auto gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Only {remaining} spots remaining</span>
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-3 rounded-full bg-white/10 p-0.5 overflow-hidden mb-3 border border-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand via-purple-500 to-amber-400 transition-all duration-1000 shadow-[0_0_16px_rgba(251,191,36,0.6)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>0 claimed</span>
        <span className="text-amber-200/90 font-medium">Cohort closes permanently at 20</span>
        <span>20 max</span>
      </div>

      {showFeaturesLock && (
        <div className="mt-3.5 pt-3.5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Create landing pages on <strong>urpass.space</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Features locked in for lifetime (Term 2125)</span>
          </div>
        </div>
      )}
    </div>
  );
}
