"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X, Tag, Check, Loader2, ChevronRight, ShieldCheck, AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { validateCoupon, type ValidatedCoupon } from "@/app/actions/coupons";
import { activatePaidSubscription } from "@/app/actions/billing";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planSlug: string;
  planName: string;
  billingCycle: "monthly" | "annual";
  userEmail: string;
  userName: string;
  priceMonthly: number;
  annualTotal: number;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function fmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CheckoutModal({
  isOpen, onClose,
  planSlug, planName, billingCycle,
  userEmail, userName,
  priceMonthly, annualTotal,
}: Props) {
  const [couponInput, setCouponInput]       = useState("");
  const [couponLoading, setCouponLoading]   = useState(false);
  const [couponError, setCouponError]       = useState("");
  const [coupon, setCoupon]                 = useState<ValidatedCoupon | null>(null);
  const [payLoading, setPayLoading]         = useState(false);
  const [payError, setPayError]             = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Reset on open
  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setCouponInput("");
      setCouponError("");
      setCoupon(null);
      setPayError("");
      setPayLoading(false);
    }
  }

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const baseAmount = billingCycle === "annual" ? annualTotal : priceMonthly;
  const baseGst    = Math.round(baseAmount * 18) / 100;
  const baseTotal  = Math.round((baseAmount + baseGst) * 100) / 100;

  const subtotal    = coupon ? coupon.discountedAmountRupees : baseAmount;
  const gstDisplay  = coupon ? coupon.gstRupees              : baseGst;
  const totalToday  = coupon ? coupon.totalRupees            : baseTotal;

  async function applyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    setCoupon(null);

    const result = await validateCoupon(code, planSlug, billingCycle);
    setCouponLoading(false);

    if ("error" in result) {
      setCouponError(result.error);
    } else {
      setCoupon(result.coupon);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput("");
    setCouponError("");
  }

  async function handlePay() {
    setPayLoading(true);
    setPayError("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setPayError("Could not load payment SDK. Check your connection.");
        setPayLoading(false);
        return;
      }

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          billingCycle,
          couponCode: coupon?.code ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPayError(data.error ?? "Could not create order.");
        setPayLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "URPASS",
        description: `${planName} — ${billingCycle}`,
        order_id: data.orderId,
        prefill: { name: userName, email: userEmail },
        theme: { color: "#0a0a0a" },
        modal: { ondismiss: () => setPayLoading(false) },
        handler: async (response: {
          razorpay_payment_id?: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          if (
            !response?.razorpay_payment_id ||
            !response?.razorpay_order_id ||
            !response?.razorpay_signature
          ) {
            setPayError("Payment verification details are missing.");
            setPayLoading(false);
            return;
          }

          const result = await activatePaidSubscription(
            planSlug,
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            billingCycle,
            coupon
              ? {
                  couponCode: coupon.code,
                  originalAmountRupees: coupon.baseAmountRupees,
                  discountAmountRupees: coupon.discountAmountRupees,
                  finalAmountRupees: coupon.discountedAmountRupees,
                  billingCyclesRemaining: coupon.durationMonths,
                }
              : undefined
          );
          setPayLoading(false);
          if (result?.error) {
            setPayError(result.error);
            return;
          }
          router.push(`/billing?upgraded=true&plan=${encodeURIComponent(planName)}`);
        },
      });

      rzp.open();
    } catch {
      setPayError("Payment failed. Please try again.");
      setPayLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="px-6 pb-6 pt-5 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">
                Checkout
              </p>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">
                {planName}
                <span className="text-neutral-400 font-normal">
                  {" "}— {billingCycle === "annual" ? "Annual" : "Monthly"}
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Coupon input */}
          {coupon ? (
            <div className="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-800 font-mono tracking-wider">{coupon.code}</p>
                  <p className="text-[11px] text-green-600">{coupon.label}</p>
                </div>
              </div>
              <button
                onClick={removeCoupon}
                className="text-[11px] font-semibold text-green-700 hover:text-green-900 shrink-0"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") applyCoupon(); }}
                    placeholder="Coupon code"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 placeholder:text-neutral-400 font-mono tracking-wider uppercase"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                </button>
              </div>
              {couponError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {couponError}
                </div>
              )}
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-neutral-50 rounded-2xl p-4 flex flex-col gap-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">
                {planName} ({billingCycle === "annual" ? "12 months" : "1 month"})
              </span>
              <span className="font-medium text-neutral-900">₹{fmt(baseAmount)}</span>
            </div>

            {coupon && (
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">
                  {coupon.code}
                  <span className="font-normal text-green-600 ml-1">({coupon.label})</span>
                </span>
                <span className="font-semibold text-green-700">− ₹{fmt(coupon.discountAmountRupees)}</span>
              </div>
            )}

            <div className="h-px bg-neutral-200" />

            <div className="flex items-center justify-between text-neutral-500">
              <span>Subtotal</span>
              <span>₹{fmt(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>GST (18%)</span>
              <span>₹{fmt(gstDisplay)}</span>
            </div>

            <div className="h-px bg-neutral-200" />

            <div className="flex items-center justify-between font-semibold">
              <span className="text-neutral-900">Total today</span>
              <span className="text-xl font-bold text-neutral-900">₹{fmt(totalToday)}</span>
            </div>
          </div>

          {/* Renewal disclosure */}
          {coupon?.durationMonths ? (
            <p className="text-[11px] text-neutral-400 text-center -mt-2">
              Renews at ₹{fmt(coupon.renewalTotalRupees)}/{billingCycle === "annual" ? "yr" : "mo"} after{" "}
              {coupon.durationMonths} month{coupon.durationMonths === 1 ? "" : "s"}.
            </p>
          ) : billingCycle === "annual" ? (
            <p className="text-[11px] text-neutral-400 text-center -mt-2">
              Billed annually. Equivalent to ₹{fmt(Math.round(priceMonthly * 10 / 12))}/mo.
            </p>
          ) : null}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={payLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #1a0840, #6D28D9)" }}
          >
            {payLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Pay ₹{fmt(totalToday)} securely
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {payError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 justify-center -mt-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {payError}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 -mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
            <p className="text-xs text-neutral-400">Secured by Razorpay · Prices include GST</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
