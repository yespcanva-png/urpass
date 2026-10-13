"use client";

import Link from "next/link";
import { Check, CreditCard, Lock, ShieldCheck, Ticket, Zap } from "lucide-react";
import CheckoutButton from "@/components/billing/CheckoutButton";

const PLANS = [
  {
    slug: "starter",
    name: "Starter",
    renewalInr: 499,
    gbp: 15,
    line: "For individual organizers and small teams.",
    features: ["10 events/month", "500 registrations/month", "2 organizer seats", "CSV import & export"],
  },
  {
    slug: "pro",
    name: "Pro",
    renewalInr: 999,
    gbp: 35,
    line: "For colleges, conferences, and growing teams.",
    features: ["Unlimited events", "2,500 registrations/month", "5 organizer seats", "Custom pass design", "Advanced analytics"],
    recommended: true,
  },
  {
    slug: "business",
    name: "Business",
    renewalInr: 2499,
    gbp: 79,
    line: "For organizations managing events at scale.",
    features: ["Unlimited events", "10,000 registrations/month", "15 organizer seats", "Custom domain", "API & webhooks"],
  },
];

interface Props {
  country: "IN" | "GB";
  userEmail: string;
  userName: string;
  accessState: string;
  introOfferEligible: boolean;
}

export default function SubscriptionOnboardingClient({
  country,
  userEmail,
  userName,
  accessState,
  introOfferEligible,
}: Props) {
  const isUk = country === "GB";

  return (
    <main className="min-h-screen bg-[#0f0820] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6D28D9_0%,transparent_38%),linear-gradient(180deg,rgba(15,8,32,0)_0%,#0f0820_72%)] opacity-70" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6D28D9] shadow-lg shadow-violet-950/30">
              <Ticket className="h-4 w-4" />
            </span>
            <span className="text-sm font-black tracking-[0.22em]">URPASS</span>
          </Link>
          <Link href="/support" className="text-xs font-semibold text-white/55 hover:text-white">
            Support
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-violet-100">
              <Lock className="h-3.5 w-3.5" />
              Paid onboarding required
            </div>
            <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
              Welcome to UrPass. Activate your workspace to continue.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              Choose a subscription, authorize payment through Razorpay, and unlock event creation, QR pass generation,
              gate scanning, analytics, and organizer operations.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-white/75">
              {[
                "Server-verified payment before access is granted",
                isUk ? "Direct UK monthly activation" : "₹29/month introductory billing for 2 paid cycles",
                "Cancel renewal anytime without losing paid-through access",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {accessState !== "onboarding_required" && (
              <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-xs leading-6 text-amber-50">
                Your previous entitlement is no longer active. Select a paid plan below to restore organizer access.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-200">Subscription Plans</p>
                <h2 className="text-xl font-bold">Select your plan</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                Monthly
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {PLANS.map((plan) => {
                const todayPrice = isUk ? `£${plan.gbp}` : introOfferEligible ? "₹29" : `₹${plan.renewalInr}`;
                const renewal = isUk ? `£${plan.gbp}/month +VAT` : `then ₹${plan.renewalInr.toLocaleString("en-IN")}/month +GST`;
                return (
                  <div
                    key={plan.slug}
                    className={`relative flex flex-col rounded-2xl border p-5 ${
                      plan.recommended
                        ? "border-violet-300 bg-white text-neutral-950 shadow-xl"
                        : "border-white/10 bg-[#160d2b] text-white"
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-2.5 left-4 rounded-full bg-[#6D28D9] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                        Recommended
                      </span>
                    )}
                    <p className={`text-[10px] font-black uppercase tracking-widest ${plan.recommended ? "text-violet-700" : "text-violet-200"}`}>
                      {plan.name}
                    </p>
                    <p className={`mt-2 min-h-10 text-xs leading-5 ${plan.recommended ? "text-neutral-500" : "text-white/55"}`}>
                      {plan.line}
                    </p>
                    <div className="mt-4">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-black tracking-tight">{todayPrice}</span>
                        <span className={`pb-1 text-xs ${plan.recommended ? "text-neutral-500" : "text-white/45"}`}>/month</span>
                      </div>
                      <p className={`mt-1 text-[11px] font-semibold ${plan.recommended ? "text-emerald-700" : "text-emerald-300"}`}>
                        {isUk ? "Direct activation" : introOfferEligible ? `First 2 months · ${renewal}` : renewal}
                      </p>
                    </div>
                    <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className={`flex items-start gap-2 text-xs ${plan.recommended ? "text-neutral-700" : "text-white/70"}`}>
                          <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${plan.recommended ? "text-[#6D28D9]" : "text-violet-200"}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <CheckoutButton
                      planSlug={plan.slug}
                      planName={plan.name}
                      billingCycle="monthly"
                      userEmail={userEmail}
                      userName={userName}
                      currency={isUk ? "GBP" : "INR"}
                      successRedirect="/dashboard"
                      className={`mt-6 w-full rounded-xl px-4 py-3 text-xs font-black transition ${
                        plan.recommended
                          ? "bg-neutral-950 text-white hover:bg-neutral-800"
                          : "bg-white text-neutral-950 hover:bg-violet-50"
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>{isUk ? `Choose ${plan.name}` : "Activate for ₹29"}</span>
                    </CheckoutButton>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-white/60 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span>Payment is verified server-side before dashboard access.</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-200" />
                <span>Annual and campus plans are available after activation.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
