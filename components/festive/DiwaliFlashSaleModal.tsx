"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Clock, Check, X, ArrowRight } from "lucide-react";
import {
  DIWALI_COUPON_CODE,
  isDiwaliCampaignActive,
  getDiwaliRemainingMs,
} from "@/lib/billing/diwali-offer";
import { trackLifecycleEvent } from "@/lib/analytics/client";

interface DiwaliFlashSaleModalProps {
  onClose: () => void;
}

type EligiblePlan = "starter" | "pro" | "business";

export default function DiwaliFlashSaleModal({ onClose }: DiwaliFlashSaleModalProps) {
  const router = useRouter();
  const [remainingMs, setRemainingMs] = useState<number>(() => getDiwaliRemainingMs());
  const [isVisible, setIsVisible] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<EligiblePlan>("pro");

  // Initialize and check active window
  useEffect(() => {
    if (!isDiwaliCampaignActive()) {
      setIsVisible(false);
      onClose();
      return;
    }

    trackLifecycleEvent("diwali_sale_popup_shown", {
      coupon: DIWALI_COUPON_CODE,
      discount: "70%",
    });

    const interval = setInterval(() => {
      const ms = getDiwaliRemainingMs();
      setRemainingMs(ms);
      if (ms <= 0) {
        clearInterval(interval);
        setIsVisible(false);
        onClose();
      }
    }, 1000);

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const countdown = useMemo(() => {
    if (remainingMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }, [remainingMs]);

  const handleDismiss = () => {
    trackLifecycleEvent("diwali_sale_popup_dismissed");
    try {
      sessionStorage.setItem("urpass_diwali_sale_dismissed", "1");
    } catch {}
    setIsVisible(false);
    onClose();
  };

  const handleClaim = (plan?: EligiblePlan) => {
    const targetPlan = plan || selectedPlan;
    trackLifecycleEvent("diwali_sale_popup_clicked", {
      coupon: DIWALI_COUPON_CODE,
      discount: "70%",
      plan: targetPlan,
    });
    try {
      sessionStorage.setItem("urpass_diwali_sale_dismissed", "1");
    } catch {}
    setIsVisible(false);
    onClose();
    router.push(`/pricing?coupon=${DIWALI_COUPON_CODE}&plan=${targetPlan}`);
  };

  if (!isVisible || remainingMs <= 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diwali-sale-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* ── Modal Card Container ── */}
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-950/95 border border-amber-500/30 p-6 sm:p-8 text-white shadow-[0_25px_60px_-15px_rgba(245,158,11,0.2)] text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Subtle Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/15 blur-3xl pointer-events-none rounded-full"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close Diwali sale offer"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Festive Campaign Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Special Diwali Campaign</span>
        </div>

        {/* Headline */}
        <h2
          id="diwali-sale-title"
          className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400">
            70% OFF
          </span>{" "}
          all UrPass plans
        </h2>
        <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-400">
          48 hours only &middot; Valid on your first payment
        </p>

        {/* ── Live Countdown Timer (Server Verified) ── */}
        <div className="mt-5 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 max-w-sm mx-auto shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400/90 font-medium mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Offer Ends in (Server Verified)</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {/* Days */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl py-2 px-1">
              <span className="block text-lg sm:text-xl font-mono font-extrabold text-white tabular-nums">
                {String(countdown.days).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Days</span>
            </div>

            {/* Hours */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl py-2 px-1">
              <span className="block text-lg sm:text-xl font-mono font-extrabold text-amber-300 tabular-nums">
                {String(countdown.hours).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Hours</span>
            </div>

            {/* Minutes */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl py-2 px-1">
              <span className="block text-lg sm:text-xl font-mono font-extrabold text-amber-300 tabular-nums">
                {String(countdown.minutes).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Mins</span>
            </div>

            {/* Seconds */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl py-2 px-1">
              <span className="block text-lg sm:text-xl font-mono font-extrabold text-yellow-400 tabular-nums">
                {String(countdown.seconds).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Secs</span>
            </div>
          </div>
        </div>

        {/* ── 3-Tier Discount Matrix (Clean & Interactive) ── */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 text-left">
          {/* Starter */}
          <button
            type="button"
            onClick={() => setSelectedPlan("starter")}
            className={`rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer text-left ${
              selectedPlan === "starter"
                ? "bg-amber-500/[0.08] border-2 border-amber-400/80 shadow-md ring-1 ring-amber-400/30"
                : "bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700"
            }`}
          >
            <div>
              <p className="text-[11px] font-bold text-neutral-400">Starter</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-extrabold text-white">₹149</span>
                <span className="text-[10px] text-neutral-500 line-through">₹499</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" />
                <span>Save ₹350</span>
              </span>
            </div>
          </button>

          {/* Pro (Highlighted / Popular) */}
          <button
            type="button"
            onClick={() => setSelectedPlan("pro")}
            className={`rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer text-left relative ${
              selectedPlan === "pro"
                ? "bg-amber-500/[0.12] border-2 border-amber-400 shadow-md ring-1 ring-amber-400/50"
                : "bg-neutral-900/80 border border-amber-500/40 hover:border-amber-400/60"
            }`}
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-xs">
              POPULAR
            </span>
            <div>
              <p className="text-[11px] font-bold text-amber-300">Pro</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-extrabold text-amber-300">₹299</span>
                <span className="text-[10px] text-neutral-500 line-through">₹999</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" />
                <span>Save ₹700</span>
              </span>
            </div>
          </button>

          {/* Business */}
          <button
            type="button"
            onClick={() => setSelectedPlan("business")}
            className={`rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer text-left ${
              selectedPlan === "business"
                ? "bg-amber-500/[0.08] border-2 border-amber-400/80 shadow-md ring-1 ring-amber-400/30"
                : "bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700"
            }`}
          >
            <div>
              <p className="text-[11px] font-bold text-neutral-400">Business</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-extrabold text-white">₹749</span>
                <span className="text-[10px] text-neutral-500 line-through">₹2,499</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" />
                <span>Save ₹1,750</span>
              </span>
            </div>
          </button>
        </div>

        {/* Renewal & Terms Notice */}
        <p className="mt-4 text-[11px] text-neutral-400 leading-snug">
          Discount applies to your <strong>first payment</strong> with coupon code{" "}
          <strong className="text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
            DIWALI70
          </strong>
          . Standard renewal pricing applies on subsequent cycles.
        </p>

        {/* ── Primary Action Button ── */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleClaim(selectedPlan)}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-neutral-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Claim My 70% Discount</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs text-neutral-400 hover:text-white transition-colors py-1 cursor-pointer font-medium"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
