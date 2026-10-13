"use client";

import Link from "next/link";
import { Check, ShieldCheck, Ticket, Zap, RefreshCw, LogOut } from "lucide-react";
import CheckoutButton from "@/components/billing/CheckoutButton";

const PLANS = [
  {
    slug: "starter",
    name: "Starter",
    renewalInr: 499,
    gbp: 15,
    description: "For individual organizers and small events",
    features: [
      "10 events / month",
      "500 registrations / month",
      "2 organizer seats",
      "Digital QR passes & scanner",
      "CSV attendee import & export",
      "Standard email notifications",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    renewalInr: 999,
    gbp: 35,
    description: "For conferences, college fests & growing teams",
    recommended: true,
    features: [
      "Unlimited events",
      "2,500 registrations / month",
      "5 organizer seats",
      "Custom pass design & branding",
      "Session-wise check-ins & single QR",
      "Real-time scan analytics",
      "Priority email support",
    ],
  },
  {
    slug: "business",
    name: "Business",
    renewalInr: 2499,
    gbp: 79,
    description: "For organizations managing events at scale",
    features: [
      "Unlimited events",
      "10,000 registrations / month",
      "15 organizer seats",
      "Dedicated custom domain",
      "API access & webhooks",
      "Advanced team permissions",
      "Dedicated priority support",
    ],
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
    <div
      className="min-h-screen text-neutral-900 flex flex-col justify-between"
      style={{
        background:
          "radial-gradient(ellipse 100% 50% at 50% -5%, #ede9fe 0%, #f7f6fc 35%, #ffffff 75%)",
      }}
    >
      {/* Top Header */}
      <header className="border-b border-neutral-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6D28D9] text-white shadow-sm shadow-violet-300/40">
              <Ticket className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-extrabold tracking-widest text-neutral-900">URPASS</span>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            {userEmail && (
              <span className="hidden text-neutral-500 sm:inline">
                Signed in as <strong className="font-semibold text-neutral-800">{userEmail}</strong>
              </span>
            )}
            <a
              href="/auth/signout"
              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
              title="Sign out of current account"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex-1 w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50/90 px-3.5 py-1 text-xs font-semibold text-violet-800 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600 animate-pulse" />
            {isUk
              ? "Simple Monthly Plans · Cancel anytime"
              : introOfferEligible
              ? "Special Intro Offer · ₹29/month for your first 2 months"
              : "Simple Monthly Plans · Cancel anytime"}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Choose your plan
          </h1>
          <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
            Select a plan to activate your workspace and start creating events, issuing digital QR passes, and scanning attendees.
          </p>

          {accessState !== "onboarding_required" && (
            <div className="mt-5 inline-block rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-800">
              Your previous subscription is inactive. Select a plan below to restore instant workspace access.
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch max-w-5xl mx-auto">
          {PLANS.map((plan) => {
            const todayPrice = isUk
              ? `£${plan.gbp}`
              : introOfferEligible
              ? "₹29"
              : `₹${plan.renewalInr.toLocaleString("en-IN")}`;

            const renewalText = isUk
              ? "Billed monthly + VAT"
              : introOfferEligible
              ? `First 2 months · then ₹${plan.renewalInr.toLocaleString("en-IN")}/mo + GST`
              : `then ₹${plan.renewalInr.toLocaleString("en-IN")}/mo + GST`;

            const isPro = plan.recommended;

            return (
              <div
                key={plan.slug}
                className={`relative flex flex-col justify-between rounded-2xl bg-white p-7 transition-all ${
                  isPro
                    ? "border-2 border-[#6D28D9] shadow-xl shadow-violet-100/70"
                    : "border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300"
                }`}
              >
                {/* Popular pill */}
                {isPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#6D28D9] px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Recommended
                  </span>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                      {plan.name}
                    </h2>
                    {isPro && (
                      <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-neutral-500 leading-normal min-h-[32px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-5 pb-5 border-b border-neutral-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
                        {todayPrice}
                      </span>
                      <span className="text-xs font-medium text-neutral-500">/ month</span>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-emerald-700">
                      {renewalText}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-neutral-700 leading-tight">
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          isPro ? "bg-violet-100 text-violet-700" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Checkout CTA */}
                <div className="mt-8 pt-2">
                  <CheckoutButton
                    planSlug={plan.slug}
                    planName={plan.name}
                    billingCycle="monthly"
                    userEmail={userEmail}
                    userName={userName}
                    currency={isUk ? "GBP" : "INR"}
                    successRedirect="/dashboard"
                    className={`w-full rounded-xl py-3 px-4 text-xs font-bold transition-all ${
                      isPro
                        ? "bg-[#6D28D9] text-white hover:bg-violet-800 shadow-md shadow-violet-200"
                        : "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 shadow-sm"
                    }`}
                  >
                    <span>{isUk ? `Choose ${plan.name}` : `Activate for ${todayPrice}`}</span>
                  </CheckoutButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & Guarantee Strip */}
        <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-neutral-200/80 bg-white/70 p-4 sm:p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left text-xs text-neutral-600">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Secure Razorpay checkout</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <Zap className="h-4 w-4 text-violet-600 shrink-0" />
              <span>Instant dashboard access</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <RefreshCw className="h-4 w-4 text-neutral-500 shrink-0" />
              <span>Cancel renewal anytime</span>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-neutral-200/60 py-6 text-center text-xs text-neutral-500 bg-white/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} URPASS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-neutral-800 transition-colors">
              Compare all features
            </Link>
            <span className="text-neutral-300">·</span>
            <Link href="/support" className="hover:text-neutral-800 transition-colors">
              Help & Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
