"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, ChevronRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { activateEventPass } from "@/app/actions/event-passes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  passType: string;
  passName: string;
  priceRupees: number;
  registrationLimit: number;
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

export default function EventPassCheckoutModal({
  isOpen, onClose,
  passType, passName, priceRupees, registrationLimit,
  userEmail, userName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const router = useRouter();

  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setLoading(false);
      setError("");
    }
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const gst   = Math.round(priceRupees * 18) / 100;
  const total = Math.round((priceRupees + gst) * 100) / 100;

  async function handlePay() {
    setLoading(true);
    setError("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Could not load payment SDK.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/razorpay/event-pass-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ passType }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create order.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        "URPASS",
        description: passName,
        order_id:    data.orderId,
        prefill:     { name: userName, email: userEmail },
        theme:       { color: "#0a0a0a" },
        modal:       { ondismiss: () => setLoading(false) },
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
            setError("Payment verification details are missing.");
            setLoading(false);
            return;
          }

          const result = await activateEventPass(passType, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          setLoading(false);
          if (result?.error) {
            setError(result.error);
            return;
          }
          router.push("/billing?pass=purchased");
        },
      });

      rzp.open();
    } catch {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 pb-6 pt-5 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">
                One-Event Purchase
              </p>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">{passName}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Up to {registrationLimit.toLocaleString("en-IN")} registrations · 1 event
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Price breakdown */}
          <div className="bg-neutral-50 rounded-2xl p-4 flex flex-col gap-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">{passName}</span>
              <span className="font-medium text-neutral-900">₹{fmt(priceRupees)}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>GST (18%)</span>
              <span>₹{fmt(gst)}</span>
            </div>
            <div className="h-px bg-neutral-200" />
            <div className="flex items-center justify-between font-semibold">
              <span className="text-neutral-900">Total</span>
              <span className="text-xl font-bold text-neutral-900">₹{fmt(total)}</span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 text-center -mt-2">
            One-time payment · No subscription · Attach to any event
          </p>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #1a0840, #6D28D9)" }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Pay ₹{fmt(total)} securely
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 justify-center -mt-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 -mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
            <p className="text-xs text-neutral-400">Secured by Razorpay · Includes GST</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
