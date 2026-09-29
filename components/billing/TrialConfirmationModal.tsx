"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BILLING_PLANS,
  resolveBillingPlanKey,
} from "@/lib/billing-plans";
import { activateFreeTrial, activateUkFreeTrial } from "@/app/actions/billing";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planSlug: string;
  planName: string;
  cycle?: "monthly" | "annual" | "yearly";
  country?: "IN" | "GB";
  userEmail?: string;
  userName?: string;
}

export default function TrialConfirmationModal({
  isOpen,
  onClose,
  planSlug,
  planName,
  cycle = "monthly",
  country = "IN",
  userEmail = "",
  userName = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isYearly = cycle === "annual" || cycle === "yearly";
  const planKey = resolveBillingPlanKey(planSlug, cycle);
  const planDef = BILLING_PLANS[planKey] || BILLING_PLANS.PRO_MONTHLY;

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

  // Country-aware calculations
  const isUk = country === "GB";
  const dateLocale = isUk ? "en-GB" : "en-IN";

  // Calculate dates
  const today = new Date();
  const trialEnd = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const firstPaymentDate = new Date(trialEnd.getTime() + 24 * 60 * 60 * 1000);
  const nextYearRenewal = new Date(firstPaymentDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  const startDayMonth = today.toLocaleDateString(dateLocale, { day: "numeric", month: "short" });
  const endDayMonth = trialEnd.toLocaleDateString(dateLocale, { day: "numeric", month: "short" });
  const firstPaymentFormatted = firstPaymentDate.toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const nextRenewalFormatted = nextYearRenewal.toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const ukPrices: Record<string, { monthly: number; annual: number }> = {
    starter: { monthly: 15, annual: 120 },
    pro: { monthly: 35, annual: 300 },
    business: { monthly: 79, annual: 699 },
  };

  const ukPlanPrice = ukPrices[planSlug.toLowerCase()] ?? { monthly: 35, annual: 300 };
  const priceFormatted = isUk
    ? `£${isYearly ? ukPlanPrice.annual : ukPlanPrice.monthly}`
    : `₹${planDef.price.toLocaleString("en-IN")}`;

  async function handleActivateAutoPay() {
    setLoading(true);
    setError("");

    try {
      if (isUk) {
        const result = await activateUkFreeTrial(planSlug);
        if (result && "error" in result && result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }
        onClose();
        router.push(`/billing?activated=true&plan=${encodeURIComponent(planName)}`);
        router.refresh();
        return;
      }

      // India: AutoPay mandate creation via Razorpay
      const res = await fetch("/api/billing/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug, cycle }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // If an explicit error was returned by the subscription API
        setError(data?.error || "Failed to initiate AutoPay subscription.");
        setLoading(false);
        return;
      }

      // Fallback if gateway merchant account does not have subscriptions enabled
      if (data?.fallbackToDirectTrial) {
        const result = await activateFreeTrial(planSlug);
        if (result && "error" in result && result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }
        onClose();
        router.push(`/billing?activated=true&plan=${encodeURIComponent(planName)}`);
        router.refresh();
        return;
      }

      if (!data?.subscriptionId || !data?.keyId) {
        setError("Invalid subscription configuration returned from server.");
        setLoading(false);
        return;
      }

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded || !window.Razorpay) {
        setError("Could not load payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "URPASS by Yesp",
        description: `${planName} - 30-Day Free Trial (AutoPay)`,
        prefill: {
          name: userName || "",
          email: userEmail || "",
        },
        notes: {
          planSlug,
          cycle,
          is_trial: "true",
        },
        theme: {
          color: "#0a0a0a",
        },
        handler: async function (response: {
          razorpay_payment_id?: string;
          razorpay_subscription_id?: string;
          razorpay_signature?: string;
        }) {
          try {
            setLoading(true);
            const verifyRes = await fetch("/api/billing/subscriptions/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planSlug,
                cycle,
                subscriptionId: response.razorpay_subscription_id || data.subscriptionId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json().catch(() => null);
            if (!verifyRes.ok) {
              setError(verifyData?.error || "AutoPay mandate verification failed.");
              setLoading(false);
              return;
            }

            onClose();
            router.push(`/billing?activated=true&plan=${encodeURIComponent(planName)}`);
            router.refresh();
          } catch (verifyErr: unknown) {
            const msg = verifyErr instanceof Error ? verifyErr.message : "AutoPay verification failed.";
            setError(msg);
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to activate 30-day free trial.";
      setError(msg);
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
                START YOUR {planName.toUpperCase()} FREE TRIAL
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                {planName} {isYearly ? "— Yearly" : ""}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {priceFormatted}{isYearly ? "/year" : "/month"} {isUk ? "+ VAT" : "+ GST"}
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

          {/* Pricing schedule breakdown matching specification */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3.5">
            {/* TODAY */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                TODAY
              </span>
              <span className="text-xl font-extrabold text-neutral-900">{isUk ? "£0" : "₹0"}</span>
            </div>

            <div className="h-px bg-neutral-200/60" />

            {/* 30-DAY FREE TRIAL */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                30-DAY FREE TRIAL
              </span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {startDayMonth} – {endDayMonth}
              </span>
            </div>

            <div className="h-px bg-neutral-200/60" />

            {/* FIRST PAYMENT */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider">
                  FIRST PAYMENT
                </span>
                <span className="text-neutral-700 font-medium mt-0.5">
                  {firstPaymentFormatted}
                </span>
              </div>
              <span className="font-bold text-neutral-900 text-sm">
                {priceFormatted} {isUk ? "+ VAT" : "+ GST"}
              </span>
            </div>

            {/* Renewal Note */}
            <p className="text-[11px] text-neutral-500 leading-relaxed pt-1 border-t border-neutral-200/60">
              {isYearly ? (
                <>
                  Next renewal: <span className="font-semibold text-neutral-700">{nextRenewalFormatted}</span>.
                </>
              ) : (
                <>
                  Then {priceFormatted}/month {isUk ? "+ VAT" : "+ GST"} until cancelled.
                </>
              )}
            </p>
          </div>

          {/* Requirement Notice */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isUk
                ? "30-Day Free Trial · Direct instant access · Full access to all features."
                : "30-Day Free Trial · AutoPay mandate (₹0 today) · Full access to all features."}
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={handleActivateAutoPay}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUk ? "Activating 30-Day Free Trial..." : "Setting up AutoPay mandate..."}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {isUk
                    ? "Start 30-Day Free Trial (£0)"
                    : "Authorize AutoPay & Start Trial (₹0)"}
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-neutral-400">
              {isUk
                ? "30 days free · Direct access · Full feature unlock · Cancel anytime"
                : `₹0 charged today · AutoPay renews at ${priceFormatted}/mo after 30 days · Cancel anytime`}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
