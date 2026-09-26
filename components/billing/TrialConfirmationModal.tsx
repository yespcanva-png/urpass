"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { activateFreeTrial } from "@/app/actions/billing";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planSlug: string;
  planName: string;
  userEmail: string;
  userName: string;
}

const PLAN_INFO: Record<
  string,
  {
    monthly: number;
    features: string[];
  }
> = {
  starter: {
    monthly: 499,
    features: [
      "10 events per month",
      "500 registrations per month",
      "2 organizer seats",
      "CSV import & export",
      "10 custom registration fields",
      "Standard analytics & email passes",
    ],
  },
  pro: {
    monthly: 999,
    features: [
      "Unlimited events",
      "2,500 registrations per month",
      "5 organizer seats",
      "Custom pass design & branding",
      "Remove URPASS branding",
      "Advanced analytics & priority support",
    ],
  },
  business: {
    monthly: 2499,
    features: [
      "Unlimited events",
      "10,000 registrations per month",
      "15 organizer seats",
      "Custom domain, API & webhooks",
      "Advanced team permissions",
      "Cross-event analytics & dedicated support",
    ],
  },
};

export default function TrialConfirmationModal({
  isOpen,
  onClose,
  planSlug,
  planName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Reset error and loading when opened
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setError("");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const info = PLAN_INFO[planSlug] ?? PLAN_INFO.pro;

  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 30);
  const formattedRenewalDate = trialEndDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleStartTrial() {
    setLoading(true);
    setError("");

    try {
      const res = await activateFreeTrial(planSlug);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      onClose();
      router.push(`/billing?trial_activated=true&plan=${encodeURIComponent(planName)}`);
      router.refresh();
    } catch (err) {
      console.error("[trial-activation-error]", err);
      setError("Failed to start trial. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand text-[11px] font-bold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                30-Day Free Trial
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                Try {planName} free for 30 days
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Full access to all {planName} features. No credit card or AutoPay required.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors shrink-0 disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pricing breakdown tile */}
          <div className="bg-neutral-50 border border-neutral-150 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-neutral-600 font-medium">Due today</span>
              <span className="text-lg font-bold text-emerald-600">₹0.00 (Free)</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Trial duration
              </span>
              <span className="font-semibold text-neutral-900">30 days</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Credit Card / Payment
              </span>
              <span className="font-semibold text-emerald-600">None required (₹0)</span>
            </div>

            <div className="h-px bg-neutral-200" />

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-neutral-500">After 30 days</span>
              <div className="text-right">
                <p className="font-semibold text-neutral-900">Optional subscription</p>
                <p className="text-[11px] text-neutral-400">Upgrade anytime or revert to Free</p>
              </div>
            </div>
          </div>

          {/* Zero commitment Notice */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-neutral-700">
              <p className="font-semibold text-neutral-900 mb-1">
                Zero commitment · No automatic charges
              </p>
              <p className="text-neutral-600">
                You will immediately unlock 30 days of full {planName} access. No payment information is collected. When your trial ends on {formattedRenewalDate}, your account simply reverts to the Free tier unless you choose to subscribe.
              </p>
            </div>
          </div>

          {/* Unlocked plan features */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2.5">
              Everything unlocked in this trial:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {info.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-neutral-700">
                  <span className="w-4 h-4 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-brand" />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={handleStartTrial}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #1e1035 0%, #6D28D9 100%)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Activating Free Trial...
                </>
              ) : (
                <>
                  Start 30-Day Free Trial
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Instant activation · No credit card or AutoPay required</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
