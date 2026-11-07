"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Clock, Check, X, ArrowRight, Copy } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

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

  const copyCoupon = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(DIWALI_COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!isVisible || remainingMs <= 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diwali-sale-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* ── Soft Non-Intrusive Backdrop with Click-to-Dismiss ── */}
      <div
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* ── Modern, Clean Modal Card ── */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-neutral-200/90 text-neutral-900 p-6 sm:p-8 text-center overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle Top Warm Gradient Accent */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500"
        />

        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-amber-400/10 blur-3xl pointer-events-none rounded-full"
        />

        {/* Accessible Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close Diwali sale offer"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/80"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Festive Campaign Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider mb-2.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Special Diwali Campaign</span>
        </div>

        {/* Headline */}
        <h2
          id="diwali-sale-title"
          className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 leading-tight"
        >
          <span className="text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg mr-1.5 inline-block">
            70% OFF
          </span>
          all UrPass plans
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-neutral-600">
          48 hours only &middot; Valid on your first payment
        </p>

        {/* ── Live Countdown Timer (Server Verified) ── */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-b from-amber-50/70 to-orange-50/30 border border-amber-200/80 max-w-sm mx-auto shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-900 font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Offer Ends in (Server Verified)</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {/* Days */}
            <div className="bg-white border border-amber-200/70 rounded-xl py-2 px-1 shadow-2xs">
              <span className="block text-lg sm:text-xl font-mono font-black text-neutral-950 tabular-nums leading-none">
                {String(countdown.days).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mt-1">Days</span>
            </div>

            {/* Hours */}
            <div className="bg-white border border-amber-200/70 rounded-xl py-2 px-1 shadow-2xs">
              <span className="block text-lg sm:text-xl font-mono font-black text-neutral-950 tabular-nums leading-none">
                {String(countdown.hours).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mt-1">Hours</span>
            </div>

            {/* Minutes */}
            <div className="bg-white border border-amber-200/70 rounded-xl py-2 px-1 shadow-2xs">
              <span className="block text-lg sm:text-xl font-mono font-black text-neutral-950 tabular-nums leading-none">
                {String(countdown.minutes).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mt-1">Mins</span>
            </div>

            {/* Seconds */}
            <div className="bg-white border border-amber-200/70 rounded-xl py-2 px-1 shadow-2xs">
              <span className="block text-lg sm:text-xl font-mono font-black text-amber-600 tabular-nums leading-none">
                {String(countdown.seconds).padStart(2, "0")}
              </span>
              <span className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mt-1">Secs</span>
            </div>
          </div>
        </div>

        {/* ── 3-Tier Discount Matrix (Clean & Interactive) ── */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-2.5 text-left">
          {/* Starter */}
          <button
            type="button"
            onClick={() => setSelectedPlan("starter")}
            className={`rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between transition-all cursor-pointer text-left ${
              selectedPlan === "starter"
                ? "bg-amber-50/70 border-2 border-amber-500 shadow-sm ring-2 ring-amber-500/20"
                : "bg-neutral-50/80 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/60"
            }`}
          >
            <div>
              <p className="text-[11px] font-bold text-neutral-700">Starter</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-neutral-950">₹149</span>
                <span className="text-[10px] text-neutral-400 line-through">₹499</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                <span>Save ₹350</span>
              </span>
            </div>
          </button>

          {/* Pro (Highlighted / Popular) */}
          <button
            type="button"
            onClick={() => setSelectedPlan("pro")}
            className={`rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between transition-all cursor-pointer text-left relative ${
              selectedPlan === "pro"
                ? "bg-amber-50/80 border-2 border-amber-500 shadow-sm ring-2 ring-amber-500/20"
                : "bg-neutral-50/80 border border-neutral-200 hover:border-amber-300 hover:bg-neutral-100/60"
            }`}
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-950 text-white shadow-xs">
              POPULAR
            </span>
            <div>
              <p className="text-[11px] font-bold text-amber-900">Pro</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-neutral-950">₹299</span>
                <span className="text-[10px] text-neutral-400 line-through">₹999</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                <span>Save ₹700</span>
              </span>
            </div>
          </button>

          {/* Business */}
          <button
            type="button"
            onClick={() => setSelectedPlan("business")}
            className={`rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between transition-all cursor-pointer text-left ${
              selectedPlan === "business"
                ? "bg-amber-50/70 border-2 border-amber-500 shadow-sm ring-2 ring-amber-500/20"
                : "bg-neutral-50/80 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/60"
            }`}
          >
            <div>
              <p className="text-[11px] font-bold text-neutral-700">Business</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-neutral-950">₹749</span>
                <span className="text-[10px] text-neutral-400 line-through">₹2,499</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                <span>Save ₹1,750</span>
              </span>
            </div>
          </button>
        </div>

        {/* ── Renewal & Terms Notice with One-Click Coupon Copy ── */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-left flex items-center justify-between gap-2">
          <p className="text-[11px] text-neutral-600 leading-snug">
            Discount applies to your <strong>first payment</strong> with coupon code{" "}
            <strong className="text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100/80 border border-amber-300">
              {DIWALI_COUPON_CODE}
            </strong>
          </p>
          <button
            type="button"
            onClick={copyCoupon}
            className="text-[10px] font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-2 py-1 rounded shadow-2xs hover:bg-neutral-50 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            aria-label="Copy coupon code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-2 text-[10px] sm:text-[11px] text-neutral-500 leading-tight">
          Standard renewal pricing applies on subsequent cycles.
        </p>

        {/* ── Action Buttons ── */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleClaim(selectedPlan)}
            className="w-full py-3.5 px-6 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] group"
          >
            <span>Claim My 70% Discount</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors py-1 cursor-pointer font-medium"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
