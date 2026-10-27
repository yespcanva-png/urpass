"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, CheckCircle2, ShieldAlert } from "lucide-react";

interface FreeTrialTopBannerProps {
  isUk?: boolean;
}

export default function FreeTrialTopBanner({ isUk = false }: FreeTrialTopBannerProps) {
  const [dismissed, setDismissed] = useState(true); // start true to prevent SSR hydration flash
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("urpass_free_trial_banner_dismissed");
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem("urpass_free_trial_banner_dismissed", "true");
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  const planPriceText = isUk ? "Paid plans from £15/mo" : "Paid plans from ₹499/mo";
  const currencySymbol = isUk ? "£" : "₹";

  return (
    <>
      {/* ── Sleek Top Announcement Bar ── */}
      <aside
        aria-label="Free Forever Offer"
        className="w-full bg-neutral-950 text-white border-b border-neutral-800/80 px-3 sm:px-6 py-2 text-xs relative z-50 selection:bg-violet-500 selection:text-white"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Left / Center content */}
          <div
            onClick={() => setModalOpen(true)}
            className="flex-1 flex items-center justify-center sm:justify-start flex-wrap gap-x-2.5 gap-y-1 cursor-pointer group"
          >
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>FREE PLAN</span>
            </span>

            <span className="font-medium text-neutral-200 text-center sm:text-left leading-tight">
              <strong className="text-white font-semibold">Free Forever:</strong> Host your first event up to 100 registrations.
              <span className="hidden md:inline text-neutral-400">
                {" "}— Zero platform fee, QR passes & sub-second check-in. No credit card required.
              </span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-300 group-hover:text-violet-200 transition-colors underline-offset-4 group-hover:underline">
              <span>View Details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Right: Quick Action & Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/signup?from=banner&plan=free"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold bg-white text-neutral-950 hover:bg-neutral-100 transition-all shadow-2xs"
            >
              <span>Start Free</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Detailed Plan Offer Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden z-10 transition-all my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-neutral-950 px-6 sm:px-8 py-5 text-white flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300 block">
                    UrPass Event Platform
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Start Free Forever
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors border border-neutral-800"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-5">
              <p className="text-sm text-neutral-700 leading-relaxed">
                Launch your event with zero software costs. UrPass offers a permanent Free tier with up to 100 registrations per month and sub-second QR code door verification. No credit card required.
              </p>

              {/* Inclusions */}
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-4 sm:p-5 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Free Forever Plan Inclusions
                </p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>1 active event with up to 100 registrations per month</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>0% UrPass platform fee (standard gateway processing fees apply)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Digital QR passes with smartphone camera check-in</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>No credit card required to start</span>
                  </li>
                </ul>
              </div>

              {/* Scaling note */}
              <div className="rounded-xl bg-violet-50/80 border border-violet-200/90 p-3 sm:p-3.5 flex items-start gap-2.5 text-[11px] text-violet-900 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Scale as you grow:</strong> Need more attendees or multi-gate scanning? Upgrade to Starter ({currencySymbol === "£" ? "£15/mo" : "₹499/mo"}), Pro ({currencySymbol === "£" ? "£35/mo" : "₹999/mo"}), or Business ({currencySymbol === "£" ? "£79/mo" : "₹2,499/mo"}) with cancel-anytime billing.
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/signup?from=banner-modal&plan=free"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all shadow-sm text-center inline-flex items-center justify-center gap-2 group"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-sm transition-colors text-center"
                >
                  View All Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
