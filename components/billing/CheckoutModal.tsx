"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X, Tag, Check, Loader2, ChevronRight, ShieldCheck, AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { validateCoupon, type ValidatedCoupon } from "@/app/actions/coupons";
import { activatePaidSubscription } from "@/app/actions/billing";
import { validateGstin } from "@/lib/validations/gstin";
import {
  INTRO_OFFER_SCHEDULE,
  type IntroOfferPlanSlug,
} from "@/lib/billing/razorpay-subscription-offers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planSlug: string;
  planName: string;
  billingCycle: "monthly" | "annual" | "lifetime";
  userEmail: string;
  userName: string;
  userPhone?: string;
  currency?: "INR" | "GBP";
  priceMonthly: number;
  annualTotal: number;
  successRedirect?: string;
  introOfferEligible?: boolean;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const INDIA_STATES = [
  { code: "33", name: "Tamil Nadu" },
  { code: "29", name: "Karnataka" },
  { code: "32", name: "Kerala" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "27", name: "Maharashtra" },
  { code: "07", name: "Delhi" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "08", name: "Rajasthan" },
  { code: "19", name: "West Bengal" },
  { code: "06", name: "Haryana" },
  { code: "03", name: "Punjab" },
  { code: "10", name: "Bihar" },
  { code: "21", name: "Odisha" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "22", name: "Chhattisgarh" },
  { code: "20", name: "Jharkhand" },
  { code: "05", name: "Uttarakhand" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "01", name: "Jammu & Kashmir" },
  { code: "30", name: "Goa" },
  { code: "34", name: "Puducherry" },
  { code: "04", name: "Chandigarh" },
  { code: "38", name: "Ladakh" },
  { code: "35", name: "Andaman & Nicobar Islands" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "26", name: "Dadra & Nagar Haveli and Daman & Diu" },
  { code: "31", name: "Lakshadweep" },
  { code: "97", name: "Other Territory" },
];

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

export default function CheckoutModal({
  isOpen, onClose,
  planSlug, planName, billingCycle,
  userEmail, userName, userPhone,
  currency = "INR",
  priceMonthly, annualTotal,
  successRedirect,
  introOfferEligible = false,
}: Props) {
  const [couponInput, setCouponInput]       = useState("");
  const [couponLoading, setCouponLoading]   = useState(false);
  const [couponError, setCouponError]       = useState("");
  const [coupon, setCoupon]                 = useState<ValidatedCoupon | null>(null);
  const [payLoading, setPayLoading]         = useState(false);
  const [payError, setPayError]             = useState("");
  const [companyName, setCompanyName]       = useState(userName || "");
  const [phone, setPhone]                   = useState(userPhone || "");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingStateCode, setBillingStateCode] = useState("33");
  const [gstin, setGstin]                   = useState("");
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
      setCompanyName(userName || "");
      setPhone(userPhone || "");
      setBillingAddress("");
      setBillingStateCode("33");
      setGstin("");
    }
  }

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isUk = (currency || "").toUpperCase() === "GBP";
  const sym = isUk ? "£" : "₹";
  const taxName = isUk ? "VAT (20%)" : "GST (18%)";
  const fmt = (n: number) => fmtVal(n, isUk);

  const isLifetime = billingCycle === "lifetime" || planSlug === "founder" || planSlug === "lifetime";
  const defaultFounder = isUk ? 249 : 19999;
  const isAutopaySubscription =
    !isUk &&
    !isLifetime &&
    billingCycle === "monthly" &&
    ["starter", "pro", "business"].includes(planSlug);
  const isIntroOffer = isAutopaySubscription;
  const introSchedule = !isUk && ["starter", "pro", "business"].includes(planSlug)
    ? INTRO_OFFER_SCHEDULE[planSlug as IntroOfferPlanSlug]
    : null;
  const introAmount = isUk ? 2 : 29;
  const baseAmount = isLifetime
    ? (annualTotal || priceMonthly || defaultFounder)
    : billingCycle === "annual"
    ? annualTotal
    : isAutopaySubscription
    ? 29
    : priceMonthly;
  const baseTax    = Math.round(baseAmount * (isUk ? 20 : 18)) / 100;
  const baseTotal  = Math.round((baseAmount + baseTax) * 100) / 100;

  const subtotal    = coupon && !isAutopaySubscription ? coupon.discountedAmountRupees : baseAmount;
  const taxDisplay  = coupon && !isAutopaySubscription ? coupon.gstRupees              : baseTax;
  const totalToday  = coupon && !isAutopaySubscription ? coupon.totalRupees            : baseTotal;
  const regularRenewalTotal = Math.round(priceMonthly * (isUk ? 1.2 : 1.18) * 100) / 100;
  const month3OnwardTotal = introSchedule
    ? introSchedule.month3OnwardAmountWithGst
    : regularRenewalTotal;

  async function applyCoupon() {
    if (isAutopaySubscription) {
      setCouponError("Coupon codes cannot be applied to AutoPay subscription activations.");
      return;
    }
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
      const trimmedCompany = companyName.trim();
      const trimmedAddress = billingAddress.trim();
      const trimmedGstin = gstin.trim().toUpperCase();
      const selectedState = INDIA_STATES.find((state) => state.code === billingStateCode);

      const cleanPhone = phone.replace(/[^\d]/g, "");
      if (!isUk && cleanPhone.length < 10) {
        setPayError("A valid 10-digit mobile number is required for AutoPay mandate setup.");
        setPayLoading(false);
        return;
      }

      if (!isUk && !trimmedAddress) {
        setPayError("Billing address is required before payment.");
        setPayLoading(false);
        return;
      }

      if (!isUk && !billingStateCode) {
        setPayError("Select the billing state for GST.");
        setPayLoading(false);
        return;
      }

      if (!isUk && trimmedGstin && !validateGstin(trimmedGstin)) {
        setPayError("Invalid GSTIN format. Leave it blank if the customer is not GST registered.");
        setPayLoading(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        setPayError("Could not load payment SDK. Check your connection.");
        setPayLoading(false);
        return;
      }

      if (isAutopaySubscription) {
        if (coupon) {
          setPayError("Coupon codes are not supported on AutoPay subscription checkout.");
          setPayLoading(false);
          return;
        }

        const mandateRes = await fetch("/api/billing/autopay/mandate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planSlug,
            billingCycle,
            isFreeTrial: false,
            phone: cleanPhone,
            billingDetails: {
              companyName: trimmedCompany || userName,
              phone: cleanPhone,
              contact: cleanPhone,
              billingAddress: trimmedAddress,
              gstin: trimmedGstin || null,
              state: selectedState?.name || "",
              stateCode: billingStateCode,
            },
          }),
        });

        const mandateData = await mandateRes.json();
        if (!mandateRes.ok) {
          setPayError(mandateData.error ?? "Could not create AutoPay mandate.");
          setPayLoading(false);
          return;
        }

        const rzp = new window.Razorpay({
          key: mandateData.keyId,
          order_id: mandateData.orderId,
          customer_id: mandateData.customerId,
          recurring: "1",
          amount: mandateData.amount,
          currency: mandateData.currency || "INR",
          name: "URPASS",
          description: `${planName} AutoPay — ₹34.22 first payment, then ₹${(mandateData.maxAmountPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month`,
          prefill: { name: userName, email: userEmail, contact: cleanPhone },
          theme: { color: "#6D28D9" },
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
              setPayError("AutoPay verification details are missing.");
              setPayLoading(false);
              return;
            }

            try {
              const verifyRes = await fetch("/api/billing/autopay/mandate/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  customerId: mandateData.customerId,
                }),
              });
              const verifyData = await verifyRes.json();
              setPayLoading(false);

              if (!verifyRes.ok) {
                setPayError(verifyData.error ?? "Failed to verify AutoPay mandate.");
                return;
              }

              onClose();
              router.push(successRedirect || `/billing?upgraded=true&autopay=active&plan=${encodeURIComponent(planName)}`);
              router.refresh();
            } catch (err) {
              setPayLoading(false);
              setPayError(err instanceof Error ? err.message : "Failed to verify AutoPay mandate.");
            }
          },
        });

        rzp.open();
        return;
      }

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          billingCycle,
          currency: isUk ? "GBP" : "INR",
          couponCode: coupon?.code ?? null,
          billingDetails: isUk
            ? undefined
            : {
                companyName: trimmedCompany || userName,
                billingAddress: trimmedAddress,
                gstin: trimmedGstin || null,
                state: selectedState?.name || "",
                stateCode: billingStateCode,
              },
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
        description: isLifetime ? `${planName} — Lifetime Access` : `${planName} — ${billingCycle}`,
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

          try {
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
              ,
              isUk
                ? undefined
                : {
                    companyName: trimmedCompany || userName,
                    billingAddress: trimmedAddress,
                    gstin: trimmedGstin || null,
                    state: selectedState?.name || "",
                    stateCode: billingStateCode,
                  }
            );
            setPayLoading(false);
            if (result?.error) {
              setPayError(result.error);
              return;
            }
            onClose();
            router.push(
              successRedirect ||
                (isLifetime
                  ? "/billing?upgraded=true&plan=Founder%20Lifetime"
                  : `/billing?upgraded=true&plan=${encodeURIComponent(planName)}`)
            );
            router.refresh();
          } catch (err) {
            setPayLoading(false);
            setPayError(err instanceof Error ? err.message : "Failed to activate subscription.");
          }
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
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="px-6 pb-6 pt-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-500 mb-1">
                Checkout
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                {planName}
                <span className="text-neutral-500 font-normal">
                  {" "}— {isLifetime ? "Lifetime Access" : billingCycle === "annual" ? "Annual" : "Monthly"}
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Introductory checkout message */}
          {isIntroOffer && !isUk && (
            <div className="rounded-xl border border-violet-200 bg-violet-50/80 p-4 space-y-1.5">
              <h3 className="text-sm font-bold text-violet-950">
                Activate {planName} for ₹29/month
              </h3>
              <p className="text-xs font-semibold text-violet-900">
                ₹29/month for your first 2 months, then ₹{priceMonthly.toLocaleString("en-IN")}/month + GST.
              </p>
              <p className="text-[11px] leading-relaxed text-violet-700">
                AutoPay authorization is required. Your first ₹34.22 payment will be collected upon activation. You can cancel future renewals anytime.
              </p>
            </div>
          )}

          {/* Coupon input */}
          {isAutopaySubscription ? (
            <div className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2.5 text-xs font-medium text-violet-800">
              AutoPay monthly plans include introductory ₹29 pricing. Additional coupon codes cannot be applied to AutoPay activations.
            </div>
          ) : coupon ? (
            <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
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
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-900/10 placeholder:text-neutral-400 font-mono tracking-wider uppercase"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1.5"
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
          {!isUk && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-neutral-950">Tax invoice details</p>
                <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">India GST</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-neutral-600">Billing name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Legal name or company name"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-900/10"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-neutral-600">
                    Mobile number <span className="text-red-500">*</span>
                    <span className="text-[10px] text-neutral-400 ml-1">(Required for AutoPay)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className="w-full rounded-lg border border-neutral-300 pl-11 pr-3 py-2.5 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-900/10 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-neutral-600">Billing address</label>
                <textarea
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Registered billing address"
                  rows={2}
                  required
                  className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-neutral-600">State</label>
                  <select
                    value={billingStateCode}
                    onChange={(e) => setBillingStateCode(e.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-950 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-900/10 bg-white"
                  >
                    {INDIA_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-neutral-600">GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="Optional"
                    maxLength={15}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-900/10 font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex flex-col gap-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-700 font-medium">
                {planName} ({isLifetime ? "Lifetime License · One-Time" : billingCycle === "annual" ? "12 months" : "1 month"})
              </span>
              <span className="font-semibold text-neutral-950">{sym}{fmt(baseAmount)}</span>
            </div>

            {coupon && (
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 font-medium">
                  {coupon.code}
                  <span className="font-normal text-emerald-600 ml-1">({coupon.label})</span>
                </span>
                <span className="font-semibold text-emerald-700">− {sym}{fmt(coupon.discountAmountRupees)}</span>
              </div>
            )}

            <div className="h-px bg-neutral-200" />

            <div className="flex items-center justify-between text-neutral-500">
              <span>Subtotal</span>
              <span>{sym}{fmt(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>{taxName}</span>
              <span>{sym}{fmt(taxDisplay)}</span>
            </div>

            <div className="h-px bg-neutral-200" />

            <div className="flex items-center justify-between font-semibold">
              <span className="text-neutral-950">Total</span>
              <span className="text-xl font-semibold text-neutral-950">{sym}{fmt(totalToday)}</span>
            </div>
          </div>

          {/* Renewal disclosure */}
          {isLifetime ? (
            <p className="text-[11px] text-emerald-600 font-medium text-center -mt-2">
              One-time payment · Zero renewal fees · Valid for the lifetime of URPASS
            </p>
          ) : isAutopaySubscription ? (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-3.5 flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">UrPass AutoPay Billing Schedule</span>
                <span className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Incl. 18% GST
                </span>
              </div>
              <div className="rounded-md border border-neutral-200 bg-white overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase font-semibold text-neutral-500">
                    <tr>
                      <th className="px-3 py-2">Billing Cycle</th>
                      <th className="px-3 py-2 text-right">Amount (incl. 18% GST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    <tr>
                      <td className="px-3 py-2 font-medium">Today (Month 1)</td>
                      <td className="px-3 py-2 text-right font-semibold text-neutral-950">₹34.22</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium">Month 2</td>
                      <td className="px-3 py-2 text-right font-semibold text-neutral-950">₹34.22</td>
                    </tr>
                    <tr className="bg-neutral-50/50">
                      <td className="px-3 py-2 font-medium">Month 3 onward</td>
                      <td className="px-3 py-2 text-right font-semibold text-neutral-950">
                        ₹{month3OnwardTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-600">
                AutoPay authorization is required. Your first ₹34.22 payment will be collected upon activation. You can cancel future renewals anytime.
              </p>
            </div>
          ) : isIntroOffer && isUk ? (
            <p className="text-[11px] text-brand-700 font-semibold text-center -mt-2">
              Introductory offer: £2/month for first 2 months. Subsequent regular renewal is £{priceMonthly}/month +VAT. Cancel renewal anytime.
            </p>
          ) : coupon?.durationMonths ? (
            <p className="text-[11px] text-neutral-400 text-center -mt-2">
              Renews at {sym}{fmt(coupon.renewalTotalRupees)}/{billingCycle === "annual" ? "yr" : "mo"} after{" "}
              {coupon.durationMonths} month{coupon.durationMonths === 1 ? "" : "s"}.
            </p>
          ) : billingCycle === "annual" ? (
            <p className="text-[11px] text-neutral-400 text-center -mt-2">
              Billed annually. Equivalent to {sym}{fmt(Math.round(priceMonthly * 10 / 12))}/mo.
            </p>
          ) : null}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={payLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-neutral-950 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-50 active:scale-[0.98]"
          >
            {payLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isAutopaySubscription
                  ? `Authorize AutoPay · ₹34.22 today`
                  : `Pay ${sym}${fmt(totalToday)}`}
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
            <p className="text-xs text-neutral-400">
              Razorpay secure checkout · Prices exclude {isUk ? "20% VAT" : "18% GST"}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
