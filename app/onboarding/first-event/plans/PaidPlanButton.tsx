"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activatePaidSubscription } from "@/app/actions/billing";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Plan = { slug: string; name: string; amountPaise: number; taxRatePercent: number };

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export default function PaidPlanButton({ plan, draftId, userEmail, userName }: {
  plan: Plan; draftId: string; userEmail: string; userName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [stateName, setStateName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function payOnce() {
    if (!address.trim() || !stateName.trim() || stateCode.length !== 2) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: plan.slug,
          billingCycle: "monthly",
          currency: "INR",
          billingDetails: {
            companyName: userName,
            billingAddress: address.trim(),
            state: stateName.trim(),
            stateCode,
          },
        }),
      });
      const order = await response.json();
      if (!response.ok || !order.orderId || !order.keyId) {
        throw new Error(order.error || "Could not prepare payment.");
      }
      await loadCheckout();
      const razorpay = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "UrPass",
        description: `${plan.name} — one month, one-time payment`,
        prefill: { name: userName, email: userEmail },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (result: Record<string, string>) => {
          try {
            if (!result.razorpay_order_id || !result.razorpay_payment_id || !result.razorpay_signature) {
              throw new Error("Payment verification details are missing.");
            }
            const activated = await activatePaidSubscription(plan.slug, {
              orderId: result.razorpay_order_id,
              paymentId: result.razorpay_payment_id,
              signature: result.razorpay_signature,
            }, "monthly", undefined, {
              companyName: userName,
              billingAddress: address.trim(),
              state: stateName.trim(),
              stateCode,
            });
            if (activated && "error" in activated && activated.error) throw new Error(activated.error);
            router.push(`/event/${draftId}/settings`);
            router.refresh();
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Payment could not be verified.");
          } finally {
            setLoading(false);
          }
        },
      });
      razorpay.open();
    } catch (cause) {
      setLoading(false);
      setError(cause instanceof Error ? cause.message : "Could not open payment checkout.");
    }
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="mt-5 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white">Choose {plan.name}</button>
    {open && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-8" role="dialog" aria-modal="true" aria-label={`${plan.name} one-time payment`}>
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex justify-between gap-4">
          <h3 className="text-xl font-bold">{plan.name} · One month</h3>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close checkout">✕</button>
        </div>
        <p className="mt-3 text-sm text-neutral-700">Pay ₹{(plan.amountPaise / 100).toFixed(2)} plus {plan.taxRatePercent}% GST for one month. No automatic renewal or AutoPay mandate will be created. Choose any payment method Razorpay offers at checkout.</p>
        <div className="mt-5 space-y-3">
          <label className="block text-sm font-medium">Billing address
            <input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 w-full rounded-lg border p-2" required /></label>
          <label className="block text-sm font-medium">Billing state
            <input value={stateName} onChange={(event) => setStateName(event.target.value)} className="mt-1 w-full rounded-lg border p-2" required /></label>
          <label className="block text-sm font-medium">GST state code
            <input value={stateCode} onChange={(event) => setStateCode(event.target.value.replace(/\D/g, "").slice(0, 2))} className="mt-1 w-full rounded-lg border p-2" inputMode="numeric" required /></label>
          <button type="button" onClick={payOnce} disabled={loading || !address.trim() || !stateName.trim() || stateCode.length !== 2}
            className="w-full rounded-lg bg-violet-700 p-3 font-semibold text-white disabled:opacity-50">{loading ? "Opening Razorpay…" : "Pay once for one month"}</button>
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      </div>
    </div>}
  </>;
}
