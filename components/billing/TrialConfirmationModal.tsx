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
  userEmail?: string;
  userName?: string;
}

export default function TrialConfirmationModal({
  isOpen,
  onClose,
  planSlug,
  planName,
  cycle = "monthly",
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

  // Calculate dates
  const today = new Date();
  const trialEnd = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const firstPaymentDate = new Date(trialEnd.getTime() + 24 * 60 * 60 * 1000);
  const nextYearRenewal = new Date(firstPaymentDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  const startDayMonth = today.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const endDayMonth = trialEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const firstPaymentFormatted = firstPaymentDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const nextRenewalFormatted = nextYearRenewal.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const priceFormatted = `₹${planDef.price.toLocaleString("en-IN")}`;

  async function handleActivateAutoPay() {
    setLoading(true);
    setError("");

    try {
      const sdkReady = await loadRazorpay();
      if (!sdkReady) {
        setError("Unable to load Razorpay Checkout. Please check your network connection.");
        setLoading(false);
        return;
      }

      // 1. Create Razorpay subscription with start_at = Today + 30 days
      const res = await fetch("/api/billing/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to initialize free trial subscription.");
        setLoading(false);
        return;
      }

      if (!data.subscriptionId || !data.keyId) {
        setError("Invalid response received from billing server.");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout for AutoPay recurring mandate authorization
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "URPASS",
        description: `${planName} 30-Day Free Trial AutoPay Authorization`,
        image: "/icon.png",
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#0a0a0a",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (resp: {
          razorpay_payment_id?: string;
          razorpay_subscription_id?: string;
          razorpay_signature?: string;
        }) => {
          if (!resp.razorpay_payment_id || !resp.razorpay_subscription_id || !resp.razorpay_signature) {
            setError("AutoPay verification details are missing from gateway response.");
            setLoading(false);
            return;
          }

          try {
            const verifyRes = await fetch("/api/billing/subscriptions/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan: planKey,
                subscriptionId: resp.razorpay_subscription_id,
                paymentId: resp.razorpay_payment_id,
                signature: resp.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              setError(verifyData.error || "AutoPay authorization verification failed.");
              setLoading(false);
              return;
            }

            onClose();
            router.push(`/billing?trial_activated=true&plan=${encodeURIComponent(planName)}`);
            router.refresh();
          } catch (err: unknown) {
            console.error("[verify-error]", err);
            setError("Failed to verify authorization. Please contact support.");
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      console.error("[activate-trial-error]", err);
      setError("An unexpected error occurred. Please try again.");
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
                {priceFormatted}{isYearly ? "/year" : "/month"} + GST
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
              <span className="text-xl font-extrabold text-neutral-900">₹0</span>
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
                {priceFormatted} + GST
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
                  Then {priceFormatted}/month + GST until cancelled.
                </>
              )}
            </p>
          </div>

          {/* AutoPay Requirement Notice */}
          <div className="bg-neutral-100/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>
              AutoPay authorization is required. Cancel anytime before your first payment.
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
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting to Razorpay...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Activate AutoPay & Start Trial
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-neutral-400">
              Encrypted & secured by Razorpay · ₹0 charged today · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
