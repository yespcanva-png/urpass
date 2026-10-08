"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, ChevronRight, ShieldCheck, AlertCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { activateEventPass } from "@/app/actions/event-passes";
import PayUWordmark from "@/components/payments/PayUWordmark";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  passType: string;
  passName: string;
  priceRupees: number;
  registrationLimit: number;
  userEmail: string;
  userName: string;
  currency?: "INR" | "GBP";
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

function fmtVal(n: number, isUk: boolean) {
  return isUk
    ? n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function EventPassCheckoutModal({
  isOpen, onClose,
  passType, passName, priceRupees, registrationLimit,
  userEmail, userName,
  currency = "INR",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [gateway, setGateway] = useState<"PAYU" | "RAZORPAY">("PAYU");
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

  const isUk = (currency || "").toUpperCase() === "GBP";
  const sym = isUk ? "£" : "₹";
  const taxName = isUk ? "VAT (20%)" : "GST (18%)";
  const taxRate = isUk ? 0.20 : 0.18;
  const fmt = (n: number) => fmtVal(n, isUk);

  const gst   = Math.round(priceRupees * taxRate * 100) / 100;
  const total = Math.round((priceRupees + gst) * 100) / 100;

  async function handlePayWithPayU() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payu/event-pass-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passType }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.actionUrl || !data.fields) {
        setError(data.error || "Could not initiate PayU order. Please try again.");
        setLoading(false);
        return;
      }

      // Build hidden POST form for PayU redirect
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.actionUrl;
      form.style.display = "none";

      Object.entries(data.fields as Record<string, string>).forEach(([key, val]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(val);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "PayU checkout failed.");
      setLoading(false);
    }
  }

  async function handlePayWithRazorpay() {
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
        body:    JSON.stringify({ passType, currency: isUk ? "GBP" : "INR" }),
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

          try {
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
            onClose();
            router.push(`/billing?pass=purchased&plan=${encodeURIComponent(passName)}`);
            router.refresh();
          } catch (err) {
            setLoading(false);
            setError(err instanceof Error ? err.message : "Failed to activate event pass.");
          }
        },
      });

      rzp.open();
    } catch {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  }

  function handlePay() {
    if (!isUk && gateway === "PAYU") {
      return handlePayWithPayU();
    }
    return handlePayWithRazorpay();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 pb-6 pt-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">
                Single Event Quota
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

          {/* Gateway Selector (INR only) */}
          {!isUk && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-600 block">
                Select Payment Gateway
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGateway("PAYU")}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    gateway === "PAYU"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-2xs"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <PayUWordmark className="h-3.5 w-auto" />
                    {gateway === "PAYU" && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-600 font-medium">
                    UPI · Cards · NetBanking
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGateway("RAZORPAY")}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    gateway === "RAZORPAY"
                      ? "border-neutral-900 bg-neutral-50 shadow-2xs"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-tight text-neutral-900">Razorpay</span>
                    {gateway === "RAZORPAY" && (
                      <span className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    Standard Gateway
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-neutral-50 rounded-2xl p-4 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600">{passName}</span>
              <span className="font-medium text-neutral-900">{sym}{fmt(priceRupees)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>{taxName}</span>
              <span>{sym}{fmt(gst)}</span>
            </div>
            <div className="h-px bg-neutral-200" />
            <div className="flex items-center justify-between font-semibold">
              <span className="text-neutral-900">Total Payable</span>
              <span className="text-lg font-bold text-neutral-900">{sym}{fmt(total)}</span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 text-center -mt-1">
            One-time single event quota · No recurring subscription
          </p>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 active:scale-[0.98] shadow-sm cursor-pointer"
            style={{
              background: !isUk && gateway === "PAYU"
                ? "linear-gradient(135deg, #059669, #10B981)"
                : "linear-gradient(135deg, #1a0840, #6D28D9)",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Pay {sym}{fmt(total)} via {!isUk && gateway === "PAYU" ? "PayU" : "Razorpay"}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 justify-center -mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 -mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <p className="text-[11px] text-neutral-500">
              256-bit Encrypted Checkout · {isUk ? "Includes 20% VAT" : "Includes 18% GST"}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
