"use client";

import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Smartphone,
  CreditCard,
  Ticket,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateName: string;
  priceINR: number;
  format?: string;
  thumbnailBg?: string;
  isBundle?: boolean;
  onSuccessUnlock?: (templateId: string) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpaySdk(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
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

export default function TemplateCheckoutModal({
  isOpen,
  onClose,
  templateId,
  templateName,
  priceINR,
  format = "digital",
  thumbnailBg = "#18181B",
  isBundle = false,
  onSuccessUnlock,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUnlocked(false);
      setError(null);
      setLoading(false);
      setAuthRequired(false);
      document.body.style.overflow = "hidden";

      // Auto-load email from current Supabase session
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setUserEmail(user.email);
        }
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handlePay() {
    setLoading(true);
    setError(null);
    setAuthRequired(false);

    try {
      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded) {
        throw new Error("Could not load Razorpay payment SDK. Check your internet connection.");
      }

      // 1. Create Order on backend (requires authenticated user)
      const res = await fetch("/api/razorpay/template-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          templateName,
          isBundle,
          userEmail,
        }),
      });

      const orderData = await res.json();
      if (res.status === 401 || orderData.requireAuth) {
        setAuthRequired(true);
        setError("Please sign in or create an organizer account to unlock ticket templates.");
        setLoading(false);
        return;
      }

      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize payment order.");
      }

      // 2. Open native Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "URPASS Studio",
        description: isBundle
          ? "All-Access 12 Ticket Template Pack"
          : `Unlock: ${templateName}`,
        order_id: orderData.orderId,
        prefill: {
          email: orderData.userEmail || userEmail,
        },
        theme: {
          color: "#6D28D9",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3. Verify on backend & persist to profile
            const verifyRes = await fetch("/api/razorpay/verify-template", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                templateId,
                templateName,
                userEmail,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setUnlocked(true);
              if (onSuccessUnlock) {
                onSuccessUnlock(templateId);
              }
            } else {
              setError(verifyData.error || "Payment verification failed.");
            }
          } catch {
            setError("Network error while verifying payment.");
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-violet-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/25 text-violet-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {isBundle ? "Master Template Bundle" : "Instant Template Unlock"}
          </div>

          <h3 className="text-xl font-black tracking-tight">{templateName}</h3>
          <p className="text-xs text-neutral-300 mt-1">
            {isBundle
              ? "Unlock all 12 current and future pro pass templates."
              : "Full commercial license for unlimited events."}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {unlocked ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-neutral-950">Template Unlocked!</h4>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                  You now have lifetime access to <strong>{templateName}</strong> permanently saved to your organizer profile.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href={`/studio?template=${encodeURIComponent(templateId)}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Open in Ticket Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/create-event?template=${encodeURIComponent(templateId)}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <span>Apply to Event</span>
                </Link>
              </div>
            </div>
          ) : authRequired ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800">
                <Lock className="w-4 h-4 text-amber-600" />
                Sign In Required
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Please sign in or create a free organizer account so your unlocked template is permanently bound to your profile across all devices.
              </p>
              <div className="pt-1 flex gap-2">
                <Link
                  href="/login?returnTo=/dashboard/templates"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs text-center transition-all shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?returnTo=/dashboard/templates"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs text-center transition-all"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Pricing & Value Summary */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70 space-y-2.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-700">Total Price:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-neutral-950 font-mono">
                      ₹{priceINR}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">all-inclusive</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex flex-col gap-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Zap className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Instant activation — customize in Ticket Studio right away</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Razorpay Verified UPI (PhonePe, GPay, Paytm) & Cards</span>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Organizer Email for receipt & profile binding
                </label>
                <input
                  type="email"
                  placeholder="organizer@college.edu or email@domain.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening Razorpay Sheet...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Pay ₹{priceINR} via Razorpay UPI / Card</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                🔒 256-bit SSL encrypted. 100% money-back guarantee if dissatisfied.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
