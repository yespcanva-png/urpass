"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, LogOut, ShieldCheck, Ticket, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import CheckoutButton from "@/components/billing/CheckoutButton";
import { detectCountryClient, persistCountryPreference } from "@/lib/country-config";
import { selectFreePlan } from "@/app/actions/billing";

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

type Cycle = "monthly" | "annual";

const PLANS = [
  {
    slug: "free",
    name: "Free Forever",
    renewalInr: 0,
    annualInr: 0,
    annualInrPerMo: 0,
    gbp: 0,
    annualGbp: 0,
    annualGbpPerMo: 0,
    description: "For individuals, student groups, and community meetups.",
    features: [
      "1 active event at a time",
      "Up to 100 registrations per event",
      "1 organizer seat",
      "Digital QR passes & scanner",
      "0% platform commission",
    ],
  },
  {
    slug: "starter",
    name: "Starter",
    renewalInr: 499,
    annualInr: 4990,
    annualInrPerMo: 415,
    gbp: 15,
    annualGbp: 120,
    annualGbpPerMo: 10,
    description: "For small teams starting with QR event operations.",
    features: ["10 events / month", "500 registrations / month", "2 organizer seats", "QR passes and scanner", "CSV import and export"],
  },
  {
    slug: "pro",
    name: "Pro",
    renewalInr: 999,
    annualInr: 9990,
    annualInrPerMo: 832,
    gbp: 35,
    annualGbp: 300,
    annualGbpPerMo: 25,
    description: "For conferences, campuses and active organizer teams.",
    recommended: true,
    features: ["Unlimited events", "2,500 registrations / month", "5 organizer seats", "Custom pass branding", "Session-wise check-ins", "Live scan analytics"],
  },
  {
    slug: "business",
    name: "Business",
    renewalInr: 2499,
    annualInr: 24990,
    annualInrPerMo: 2082,
    gbp: 79,
    annualGbp: 699,
    annualGbpPerMo: 58,
    description: "For organizations managing higher-volume events.",
    features: ["Unlimited events", "10,000 registrations / month", "15 organizer seats", "Custom domain", "API access and webhooks", "Advanced permissions"],
  },
];

interface Props {
  country: "IN" | "GB";
  userEmail: string;
  userName: string;
  userPhone?: string;
  accessState: string;
  introOfferEligible: boolean;
  freeTrialEligible?: boolean;
}

export default function SubscriptionOnboardingClient({
  country,
  userEmail,
  userName,
  userPhone,
  accessState,
  introOfferEligible,
  freeTrialEligible = false,
}: Props) {
  const router = useRouter();
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialError, setTrialError] = useState("");
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeError, setFreeError] = useState("");
  const [phone, setPhone] = useState("");
  const [billingCycle, setBillingCycle] = useState<Cycle>("monthly");
  const [activeCountry, setActiveCountry] = useState<"IN" | "GB">(() => {
    if (typeof window !== "undefined") {
      return detectCountryClient() || country || "IN";
    }
    return country || "IN";
  });

  async function handleSelectFreePlan() {
    setFreeLoading(true);
    setFreeError("");
    try {
      const res = await selectFreePlan();
      if (res?.error) {
        setFreeError(res.error);
        setFreeLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setFreeLoading(false);
      setFreeError(err instanceof Error ? err.message : "Failed to activate Free Forever plan.");
    }
  }

  useEffect(() => {
    const detected = detectCountryClient();
    if (detected && detected !== activeCountry) setActiveCountry(detected);
  }, [activeCountry]);

  function switchCountry(next: "IN" | "GB") {
    setActiveCountry(next);
    persistCountryPreference(next);
  }

  async function handleStartFreeEventTrial() {
    setTrialLoading(true);
    setTrialError("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        setTrialError("Could not load payment gateway. Please check your internet connection.");
        setTrialLoading(false);
        return;
      }

      const contactNumber = (phone || userPhone || "").replace(/[^\d]/g, "").slice(-10);
      if (contactNumber.length < 10) {
        setTrialError("Please enter your 10-digit mobile number below to authorize the AutoPay mandate.");
        setTrialLoading(false);
        return;
      }

      const res = await fetch("/api/billing/autopay/mandate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: "pro",
          billingCycle: "monthly",
          isFreeTrial: true,
          phone: contactNumber,
          billingDetails: {
            phone: contactNumber,
            contact: contactNumber,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTrialError(data.error || "Failed to create AutoPay mandate.");
        setTrialLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        customer_id: data.customerId,
        recurring: "1",
        amount: data.amount,
        currency: data.currency,
        name: "URPASS",
        description: "1 Free Event Trial - AutoPay Mandate Authorization (₹1)",
        prefill: { name: userName, email: userEmail, contact: contactNumber },
        theme: { color: "#6D28D9" },
        modal: { ondismiss: () => setTrialLoading(false) },
        handler: async (response: {
          razorpay_payment_id?: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          if (!response?.razorpay_payment_id || !response?.razorpay_order_id || !response?.razorpay_signature) {
            setTrialError("Mandate details missing from payment authorization.");
            setTrialLoading(false);
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
                customerId: data.customerId,
              }),
            });
            const verifyData = await verifyRes.json();
            setTrialLoading(false);

            if (!verifyRes.ok) {
              setTrialError(verifyData.error || "Failed to verify AutoPay mandate.");
              return;
            }

            router.push(verifyData.redirect || "/create-event");
            router.refresh();
          } catch (err) {
            setTrialLoading(false);
            setTrialError(err instanceof Error ? err.message : "Failed to verify AutoPay mandate.");
          }
        },
      });

      (rzp as typeof rzp & { on: (event: string, handler: (response: { error?: { description?: string; reason?: string } }) => void) => void }).on("payment.failed", (failure) => {
        setTrialLoading(false);
        setTrialError(failure.error?.description || failure.error?.reason ||
          "UPI AutoPay authorization failed. Try another UPI app or bank account.");
      });
      rzp.open();
    } catch (err) {
      setTrialLoading(false);
      setTrialError(err instanceof Error ? err.message : "Failed to initiate AutoPay trial.");
    }
  }

  const isUk = activeCountry === "GB";
  const isAnnual = billingCycle === "annual";
  const showIntroOffer = false;

  return (
    <div className="min-h-screen bg-[#f7f7fb] text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6D28D9] text-white">
              <Ticket className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold tracking-widest">URPASS</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden text-xs text-neutral-500 md:block">{userEmail}</div>
            <a
              href="/auth/signout"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D28D9]">Subscription required</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Choose your UrPass plan</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Activate a paid plan to create events, generate passes, run QR check-ins and access your organizer dashboard.
            </p>
            {accessState !== "onboarding_required" && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                Your previous entitlement is inactive. Select a plan to restore workspace access.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => switchCountry("IN")}
                className={`rounded-md px-3 py-2 ${!isUk ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-950"}`}
              >
                INR
              </button>
              <button
                type="button"
                onClick={() => switchCountry("GB")}
                className={`rounded-md px-3 py-2 ${isUk ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-950"}`}
              >
                GBP
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-md px-3 py-2 ${!isAnnual ? "bg-[#6D28D9] text-white" : "text-neutral-600 hover:text-neutral-950"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`rounded-md px-3 py-2 ${isAnnual ? "bg-[#6D28D9] text-white" : "text-neutral-600 hover:text-neutral-950"}`}
              >
                Annual
              </button>
            </div>
          </div>
        </section>

        {!isUk && freeTrialEligible && (
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-[#6D28D9] bg-gradient-to-br from-violet-950 via-purple-900 to-neutral-950 p-6 sm:p-7 text-white shadow-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-2.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-400/20 px-3 py-1 text-xs font-bold text-violet-300 border border-violet-400/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free Trial Offer
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Try 1 Event for Free with AutoPay</h2>
                <p className="text-sm text-violet-200 leading-relaxed">
                  Experience UrPass with full Pro features for 1 full event. Authorize a ₹1 UPI AutoPay mandate today to verify your payment method. The first recurring plan charge begins after your event concludes.
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-violet-300/90 pt-1">
                  <span>✓ 1 event with full Pro tier access</span>
                  <span>✓ Zero platform commission on tickets</span>
                  <span>✓ Digital QR badges &amp; scanner gates</span>
                </div>
                <p className="text-[11px] text-violet-300/60 pt-0.5">
                  * Anti-abuse policy: 1 event lifetime quota. Deleting or recreating events is strictly prohibited under trial.
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-3 shrink-0 w-full sm:w-auto">
                <div className="w-full sm:w-72 space-y-1.5">
                  <label className="text-[11px] font-semibold text-violet-200 block">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setTrialError("");
                        setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10));
                      }}
                      placeholder=""
                      maxLength={10}
                      className="w-full rounded-xl border border-violet-400/40 bg-white pl-11 pr-3 py-2.5 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400 font-mono shadow-inner"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartFreeEventTrial}
                  disabled={trialLoading}
                  className="w-full sm:w-72 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-neutral-950 shadow-md transition-all hover:bg-neutral-100 disabled:opacity-50 active:scale-[0.98]"
                >
                  {trialLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#6D28D9]" />
                      Authorizing AutoPay...
                    </>
                  ) : (
                    <>
                      Activate AutoPay &amp; Try 1 Event Free
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <span className="text-[11px] text-violet-300">₹1 mandate authorization · Pay after 1 event</span>
                {trialError && (
                  <p className="text-xs text-rose-300 font-medium max-w-xs">{trialError}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50/80 p-4 text-xs sm:text-sm text-violet-950">
          {isAnnual ? (
            <span>Annual plans are billed upfront. Taxes are added at checkout.</span>
          ) : (
            <span>Monthly plans renew automatically after payment authorization. Taxes are added at checkout.</span>
          )}
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const isFree = plan.slug === "free";
            const todayPrice = isFree
              ? isUk ? "£0" : "₹0"
              : isAnnual
              ? isUk
                ? `£${plan.annualGbp}`
                : `₹${plan.annualInr.toLocaleString("en-IN")}`
              : isUk
                ? `£${plan.gbp}`
                : `₹${plan.renewalInr.toLocaleString("en-IN")}`;
            const period = isFree ? "forever" : isAnnual ? "/ year" : "/ month";
            const renewalText = isFree
              ? "Zero payment or autopay required"
              : isAnnual
              ? isUk
                ? `Equivalent £${plan.annualGbpPerMo}/mo + VAT`
                : `Equivalent ₹${plan.annualInrPerMo.toLocaleString("en-IN")}/mo + GST`
              : isUk
                ? `Renews at £${plan.gbp}/mo + VAT`
                : `Renews at ₹${plan.renewalInr.toLocaleString("en-IN")}/mo + GST`;

            return (
              <article
                key={plan.slug}
                className={`flex min-h-[500px] flex-col rounded-xl border bg-white p-5 ${
                  plan.recommended ? "border-[#6D28D9] shadow-sm ring-1 ring-[#6D28D9]" : "border-neutral-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{plan.name}</h2>
                    <p className="mt-2 min-h-[42px] text-sm leading-5 text-neutral-600">{plan.description}</p>
                  </div>
                  {plan.recommended && (
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-[#6D28D9]">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-6 border-y border-neutral-100 py-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-neutral-950">{todayPrice}</span>
                    <span className="text-sm font-medium text-neutral-500">{period}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-neutral-600">{renewalText}</p>
                </div>

                <ul className="mt-5 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6D28D9]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isFree ? (
                  <div className="mt-6 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={handleSelectFreePlan}
                      disabled={freeLoading}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xs"
                    >
                      {freeLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-[#6D28D9]" />
                          <span>Activating Free Plan...</span>
                        </>
                      ) : (
                        <span>Select Free Forever</span>
                      )}
                    </button>
                    {freeError && <p className="text-[11px] text-rose-500 font-medium">{freeError}</p>}
                  </div>
                ) : (
                  <CheckoutButton
                    planSlug={plan.slug}
                    planName={plan.name}
                    billingCycle={billingCycle}
                    userEmail={userEmail}
                    userName={userName}
                    userPhone={phone || userPhone}
                    currency={isUk ? "GBP" : "INR"}
                    successRedirect="/dashboard"
                    introOfferEligible={false}
                    className={`mt-6 w-full rounded-lg px-4 py-3 text-sm font-bold ${
                      plan.recommended
                        ? "bg-[#6D28D9] text-white hover:bg-violet-800"
                        : "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    Continue with {plan.name}
                  </CheckoutButton>
                )}
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-xs text-neutral-600 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#6D28D9]" />
            Razorpay verified payment
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#6D28D9]" />
            Dashboard unlocks after server verification
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#6D28D9]" />
            Existing subscriptions stay unchanged
          </div>
        </section>
      </main>
    </div>
  );
}
