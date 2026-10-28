"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordFirstEventCheckoutState, cancelPendingFirstEventCheckout } from "@/app/actions/first-event";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Plan = { slug: string; name: string; amountPaise: number; taxRatePercent: number };
type Checkout = { subscriptionId: string; keyId: string; firstChargePaise: number;
  regularAmountPaise: number; estimatedTotalWithGst?: number; todayAmountWithGst?: number;
  nextBillingDate: string | null; error?: string };

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
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState<Checkout | null>(null);

  async function prepare() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/billing/subscriptions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: plan.slug, billingCycle: "monthly", currency: "INR", requireStandardPricing: true,
          billingDetails: { companyName: userName, billingAddress: address,
            state: stateName, stateCode } }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not prepare checkout.");
      if (Number(data.regularAmountPaise) !== plan.amountPaise) {
        throw new Error("Plan price changed. Reload this page before authorizing AutoPay.");
      }
      setCheckout(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not prepare checkout.");
    } finally { setLoading(false); }
  }

  async function authorize() {
    if (!checkout || !consent) return;
    setLoading(true); setError("");
    try {
      await recordFirstEventCheckoutState({ draftId, subscriptionId: checkout.subscriptionId,
        state: "autopay_authorization_started" });
      await loadCheckout();
      const razorpay = new window.Razorpay({
        key: checkout.keyId, subscription_id: checkout.subscriptionId,
        name: "UrPass", description: `${plan.name} monthly subscription`,
        prefill: { name: userName, email: userEmail },
        modal: { ondismiss: () => { setLoading(false); setError("Authorization was interrupted. You can resume this checkout."); } },
        handler: async (result: Record<string, string>) => {
          try {
            const response = await fetch("/api/billing/subscriptions/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ planSlug: plan.slug,
                subscriptionId: result.razorpay_subscription_id,
                paymentId: result.razorpay_payment_id,
                signature: result.razorpay_signature }),
            });
            const verified = await response.json();
            if (!response.ok || !verified.success) throw new Error(verified.error || "Authorization is pending verification.");
            router.push(`/event/${draftId}/settings`);
            router.refresh();
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Authorization could not be verified.");
            void recordFirstEventCheckoutState({ draftId, subscriptionId: checkout.subscriptionId, state: "checkout_failed" });
          } finally { setLoading(false); }
        },
      });
      razorpay.open();
    } catch (cause) {
      setLoading(false);
      setError(cause instanceof Error ? cause.message : "Could not open checkout.");
    }
  }

  async function cancelCheckout() {
    if (!checkout) return;
    setLoading(true); setError("");
    const result = await cancelPendingFirstEventCheckout(checkout.subscriptionId);
    setLoading(false);
    if (result.error) setError(result.error);
    else { setCheckout(null); setConsent(false); setOpen(false); }
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="mt-5 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white">Choose {plan.name}</button>
    {open && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-8" role="dialog" aria-modal="true" aria-label={`${plan.name} AutoPay authorization`}>
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex justify-between gap-4"><h3 className="text-xl font-bold">{plan.name} AutoPay</h3>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close checkout">✕</button></div>
        <p className="mt-3 text-sm text-neutral-700">₹{(plan.amountPaise / 100).toFixed(2)} per month plus {plan.taxRatePercent}% GST. Renewal is monthly until cancelled in Billing.</p>
        {!checkout ? <div className="mt-5 space-y-3">
          <label className="block text-sm font-medium">Billing address
            <input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 w-full rounded-lg border p-2" required /></label>
          <label className="block text-sm font-medium">Billing state
            <input value={stateName} onChange={(event) => setStateName(event.target.value)} className="mt-1 w-full rounded-lg border p-2" required /></label>
          <label className="block text-sm font-medium">GST state code
            <input value={stateCode} onChange={(event) => setStateCode(event.target.value.replace(/\D/g, "").slice(0, 2))} className="mt-1 w-full rounded-lg border p-2" inputMode="numeric" required /></label>
          <button type="button" onClick={prepare} disabled={loading || !address.trim() || !stateName.trim() || stateCode.length !== 2}
            className="w-full rounded-lg bg-violet-700 p-3 font-semibold text-white disabled:opacity-50">{loading ? "Preparing…" : "Review authorization"}</button>
        </div> : <div className="mt-5 space-y-3 text-sm">
          <p>First charge: ₹{(checkout.firstChargePaise / 100).toFixed(2)} before GST.</p>
          <p>Estimated first total with GST: ₹{(checkout.todayAmountWithGst ?? checkout.estimatedTotalWithGst ?? 0).toFixed(2)}. Razorpay shows the final authorization amount.</p>
          <p>Recurring base: ₹{(checkout.regularAmountPaise / 100).toFixed(2)} monthly plus GST.</p>
          <p>Next billing date: {checkout.nextBillingDate ? new Date(checkout.nextBillingDate).toLocaleDateString("en-IN") : "Shown by Razorpay during authorization"}.</p>
          <p>Mandate limit: shown by Razorpay during authorization.</p>
          <label className="flex gap-2"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />I authorize this recurring monthly subscription.</label>
          <button type="button" onClick={authorize} disabled={!consent || loading}
            className="w-full rounded-lg bg-violet-700 p-3 font-semibold text-white disabled:opacity-50">{loading ? "Opening Razorpay…" : "Authorize AutoPay with Razorpay"}</button>
          <button type="button" onClick={cancelCheckout} disabled={loading}
            className="w-full rounded-lg border p-3 font-semibold disabled:opacity-50">Cancel pending checkout</button>
        </div>}
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      </div>
    </div>}
  </>;
}
