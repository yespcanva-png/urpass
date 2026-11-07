"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  CreditCard,
  Percent,
  Sparkles,
  Info,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import { simulateSmartOffers } from "@/lib/smart-offers/simulator";

export default function SmartOfferSimulator() {
  const [impressions, setImpressions] = useState<number>(1000);
  const [acceptanceRate, setAcceptanceRate] = useState<number>(12);
  const [acceptedToPaidRate, setAcceptedToPaidRate] = useState<number>(20);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(749);
  const [controlBaselineRate, setControlBaselineRate] = useState<number>(1.0);

  const result = useMemo(() => {
    return simulateSmartOffers({
      impressions,
      acceptanceRate,
      acceptedToPaidRate,
      avgOrderValueInr: avgOrderValue,
      controlBaselineRate,
    });
  }, [impressions, acceptanceRate, acceptedToPaidRate, avgOrderValue, controlBaselineRate]);

  return (
    <div className="w-full rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          Smart Offer Impact Simulator
        </div>
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
          Measure true conversion lift vs no-offer control group
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500">
          Attribution alone does not prove incremental revenue. UrPass isolates a 10% holdout control group to separate organic conversions from offer-driven lift.
        </p>
      </div>

      {/* Input Sliders / Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Slider 1: Impressions */}
        <div className="p-4 rounded-xl border border-neutral-200/70 bg-neutral-50/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <span>Eligible offer impressions</span>
            <span className="font-bold text-neutral-950 font-mono">
              {impressions.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={impressions}
            onChange={(e) => setImpressions(Number(e.target.value))}
            className="w-full accent-violet-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>100</span>
            <span>5,000</span>
            <span>10,000</span>
          </div>
        </div>

        {/* Slider 2: Acceptance Rate */}
        <div className="p-4 rounded-xl border border-neutral-200/70 bg-neutral-50/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <span>Offer acceptance rate</span>
            <span className="font-bold text-violet-700 font-mono">{acceptanceRate}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={acceptanceRate}
            onChange={(e) => setAcceptanceRate(Number(e.target.value))}
            className="w-full accent-violet-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>1%</span>
            <span>20%</span>
            <span>40%</span>
          </div>
        </div>

        {/* Slider 3: Accepted to Paid Rate */}
        <div className="p-4 rounded-xl border border-neutral-200/70 bg-neutral-50/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <span>Accepted → Paid rate</span>
            <span className="font-bold text-emerald-700 font-mono">{acceptedToPaidRate}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={acceptedToPaidRate}
            onChange={(e) => setAcceptedToPaidRate(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>1%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Calculated Output Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {/* Metric 1: Offer Acceptances */}
        <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Offer acceptances
            </span>
            <Users className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-mono">
            #{result.acceptances.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {acceptanceRate}% acceptance on {impressions.toLocaleString()} views
          </p>
        </div>

        {/* Metric 2: Purchases Attributed */}
        <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Purchases attributed
            </span>
            <CreditCard className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-violet-700 tracking-tight font-mono">
            #{result.attributedPurchases.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            ₹{result.attributedRevenueInr.toLocaleString("en-IN")} gross attributed
          </p>
        </div>

        {/* Metric 3: Control Group Baseline */}
        <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Control Baseline
            </span>
            <Scale className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-700 tracking-tight font-mono">
            #{result.controlBaselinePurchases.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {controlBaselineRate}% organic conversion without offer
          </p>
        </div>

        {/* Metric 4: True Incremental Lift */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Incremental Lift
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight font-mono">
            +{result.incrementalPurchases.toLocaleString()}
          </p>
          <p className="text-[11px] font-bold text-emerald-800 mt-1">
            +₹{result.incrementalRevenueInr.toLocaleString("en-IN")} net lift (+{result.incrementalLiftPct}%)
          </p>
        </div>
      </div>

      {/* Methodology Explainer */}
      <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong>Why control groups matter:</strong> Simple attribution claims every purchase following an offer was caused by that offer. UrPass maintains a holdout control group to guarantee that revenue reported is <strong>genuinely incremental</strong> and not cannibalizing organic purchases.
        </p>
      </div>
    </div>
  );
}
