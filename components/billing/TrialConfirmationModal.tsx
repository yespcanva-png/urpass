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
  Lock,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planSlug: string;
  planName: string;
  userEmail: string;
  userName: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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
  userEmail,
  userName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Reset error when opened
  useEffect(() => {
    if (isOpen) {
      setError("");
      setLoading(false);
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
  const gstAmount = Math.round(info.monthly * 18) / 100;
  const totalMonthlyWithGst = Math.round((info.monthly + gstAmount) * 100) / 100;

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
      const sdkReady = await loadRazorpay();
      if (!sdkReady) {
        setError("Could not load payment gateway SDK. Please check your connection.");
        setLoading(false);
        return;
      }

      // Step 1: Create trial subscription / mandate
      const res = await fetch("/api/razorpay/trial-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not set up trial subscription.");
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay checkout with subscription_id or order_id
      const options: Record<string, unknown> = {
        key: data.keyId,
        name: "URPASS",
        description: `30-Day Free Trial — ${planName} Plan`,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: { color: "#6D28D9" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id?: string;
          razorpay_subscription_id?: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          if (!response?.razorpay_payment_id || !response?.razorpay_signature) {
            setError("AutoPay verification details were incomplete.");
            setLoading(false);
            return;
          }

          // Step 3: Verify AutoPay setup & start 30-day trial clock
          try {
            const verifyRes = await fetch("/api/razorpay/verify-trial", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planSlug,
                subscriptionId: response.razorpay_subscription_id || data.subscriptionId,
                orderId: response.razorpay_order_id || data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              setError(verifyData.error || "Failed to activate trial.");
              setLoading(false);
              return;
            }

            // Redirect to billing with celebration parameter
            onClose();
            router.push(`/billing?trial_activated=true&plan=${encodeURIComponent(planName)}`);
            router.refresh();
          } catch (err) {
            console.error("[trial-activation-error]", err);
            setError("Verification network error. Please refresh and check your billing page.");
            setLoading(false);
          }
        },
      };

      if (data.subscriptionId) {
        options.subscription_id = data.subscriptionId;
      } else if (data.orderId) {
        options.order_id = data.orderId;
        options.amount = data.amount;
        options.currency = data.currency;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("[trial-modal-error]", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto border border-neutral-100">
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
                Full access to all {planName} features. AutoPay setup required.
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

            <div className="h-px bg-neutral-200" />

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-neutral-500">First payment after trial</span>
              <div className="text-right">
                <p className="font-bold text-neutral-900">₹{totalMonthlyWithGst.toLocaleString("en-IN")}/mo</p>
                <p className="text-[11px] text-neutral-400">₹{info.monthly.toLocaleString("en-IN")} + 18% GST on {formattedRenewalDate}</p>
              </div>
            </div>
          </div>

          {/* AutoPay Mandatory Notice */}
          <div className="bg-violet-50/70 border border-violet-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-neutral-700">
              <p className="font-semibold text-neutral-900 mb-1">
                AutoPay setup required &middot; Cancel anytime before renewal
              </p>
              <p className="text-neutral-600">
                You will authorize an AutoPay mandate with Razorpay. <strong>You will not be billed today.</strong> You can cancel anytime before {formattedRenewalDate} under Billing Settings and you will not be charged. One free activation per account.
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
                  Setting up AutoPay...
                </>
              ) : (
                <>
                  Set Up AutoPay &amp; Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Secured by Razorpay &middot; Cancel before {formattedRenewalDate} with zero charge</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
