"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, CheckCircle2, Ticket, HelpCircle } from "lucide-react";
import PaidPlanButton from "./PaidPlanButton";
import { selectFreePlan } from "@/app/actions/billing";

type Plan = {
  slug: string;
  name: string;
  description: string;
  amountPaise: number;
  taxInclusive: boolean;
  taxRatePercent: number;
  registrations: number;
  events: number;
  seats: number;
  features: string[];
};

export default function PlanChoices({
  draftId,
  eventName,
  expectedRegistrations,
  plans,
  catalogError,
  userEmail,
  userName,
}: {
  draftId: string;
  eventName: string;
  expectedRegistrations: number;
  plans: Plan[];
  catalogError: boolean;
  userEmail: string;
  userName: string;
}) {
  const router = useRouter();
  const [freeLoading, setFreeLoading] = useState(false);
  const [error, setError] = useState("");
  const recommended = plans.find((plan) => plan.registrations >= expectedRegistrations)?.slug;

  async function activateFree() {
    setFreeLoading(true);
    setError("");
    const result = await selectFreePlan().catch(() => ({ error: "Could not activate Free. Try again." }));
    if (result?.error) {
      setError(result.error);
      setFreeLoading(false);
      return;
    }
    router.push(`/event/${draftId}/settings`);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-violet-700">Step 2 of 5 · Subscription</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Choose a plan for {eventName}</h1>
        <p className="mt-2 text-neutral-600">
          You expect {expectedRegistrations.toLocaleString("en-IN")} registrations. Choose the plan that suits your billing period. No paid plan is selected for you.
        </p>

        {/* Trust & Zero Commission Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-violet-50 via-purple-50 to-emerald-50/50 border border-violet-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">
                0% UrPass Platform Ticketing Fee Guarantee
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">
                Ticket revenue deposits directly to your Razorpay or Stripe account. No per-ticket commissions deducted by UrPass.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-700">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1-Month Access · No Auto-Renew
            </span>
            <span className="flex items-center gap-1.5 text-violet-700">
              <CheckCircle2 className="w-4 h-4 text-violet-600" />
              Instant Activation
            </span>
          </div>
        </div>

        {!recommended && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 border border-amber-200">
            Your expected registrations exceed the current self-service plans. Reduce event capacity or contact UrPass for a larger enterprise quota before publishing.
          </p>
        )}
        {catalogError && (
          <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 border border-amber-200">
            Some paid plans are unavailable while billing configuration is checked.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200">
            {error}
          </p>
        )}

        {/* Pricing Cards Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const fits = plan.registrations >= expectedRegistrations;
            const isRec = plan.slug === recommended;

            return (
              <article
                key={plan.slug}
                className={`flex flex-col rounded-2xl border p-5 shadow-sm transition-all relative ${
                  isRec
                    ? "border-violet-400 bg-white ring-2 ring-violet-500/20 shadow-md"
                    : "border-neutral-200 bg-white"
                }`}
              >
                {isRec && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-violet-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-sm uppercase tracking-wider">
                      Fits your event
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mt-1">
                  <h2 className="text-xl font-bold text-neutral-900">{plan.name}</h2>
                </div>

                <p className="mt-2 min-h-12 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {plan.description}
                </p>

                <p className="mt-4 text-3xl font-extrabold text-neutral-900">
                  ₹{(plan.amountPaise / 100).toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-neutral-500">
                    {plan.slug === "free" ? " forever" : " / month"}
                  </span>
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {plan.slug === "free"
                    ? "No payment method required"
                    : `${plan.taxInclusive ? "Includes" : "Plus"} ${plan.taxRatePercent}% GST · pay once for 1 month`}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 text-xs sm:text-sm text-neutral-700">
                  <li className="font-semibold text-neutral-900">
                    ✓ {plan.registrations.toLocaleString("en-IN")} registrations / billing month
                  </li>
                  <li>
                    ✓ {plan.events >= 999999 ? "Unlimited" : plan.events} active events
                  </li>
                  <li>
                    ✓ {plan.seats} team {plan.seats === 1 ? "seat" : "seats"}
                  </li>
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-neutral-600">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>

                {!fits && (
                  <p className="mt-4 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                    Reduce event capacity or choose a higher plan before publishing.
                  </p>
                )}

                {plan.slug === "free" ? (
                  <button
                    type="button"
                    onClick={activateFree}
                    disabled={freeLoading}
                    className="mt-6 rounded-xl border-2 border-violet-700 hover:bg-violet-50 px-4 py-3 text-sm font-bold text-violet-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {freeLoading ? "Activating…" : "Continue with Free"}
                  </button>
                ) : (
                  <div className="mt-6">
                    <PaidPlanButton
                      plan={plan}
                      draftId={draftId}
                      userEmail={userEmail}
                      userName={userName}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Occasional / One-Time Event Organizers Callout */}
        <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-700">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Hosting a one-time event?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                  You do not need an ongoing subscription for one-off seminars, fests or weddings. Start with <strong>Free</strong> now, and purchase a <strong>One-Time Event Pass (₹299 for up to 500 attendees)</strong> or <strong>24h Concierge Setup (₹4,999)</strong> anytime directly inside your Billing settings.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={activateFree}
              disabled={freeLoading}
              className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-xs sm:text-sm font-semibold text-neutral-800 transition-colors shrink-0"
            >
              Start Free &amp; Decide Later
            </button>
          </div>
        </div>

        {/* Trust & Security Footnote */}
        <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500 space-y-1">
          <p>
            GST tax invoices generated automatically. Direct payment gateway integration powered by Razorpay &amp; Stripe.
          </p>
          <p>
            Need enterprise invoices, PO billing, or custom attendee limits? Contact{" "}
            <a href="mailto:support@urpass.space" className="text-violet-600 underline font-medium">
              support@urpass.space
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
