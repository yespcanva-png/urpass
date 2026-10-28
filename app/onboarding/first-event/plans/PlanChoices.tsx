"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaidPlanButton from "./PaidPlanButton";
import { selectFreePlan } from "@/app/actions/billing";

type Plan = {
  slug: string; name: string; description: string; amountPaise: number;
  taxInclusive: boolean; taxRatePercent: number; registrations: number;
  events: number; seats: number; features: string[];
};

export default function PlanChoices({ draftId, eventName, expectedRegistrations, plans,
  catalogError, userEmail, userName }: {
  draftId: string; eventName: string; expectedRegistrations: number; plans: Plan[];
  catalogError: boolean; userEmail: string; userName: string;
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

  return <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-violet-700">Step 2 of 5 · Subscription</p>
      <h1 className="mt-3 text-3xl font-bold">Choose a plan for {eventName}</h1>
      <p className="mt-2 text-neutral-600">You expect {expectedRegistrations.toLocaleString("en-IN")} registrations. Choose the plan that suits your billing period. No paid plan is selected for you.</p>
      <p className="mt-2 text-sm text-neutral-600">Monthly plans renew automatically after authorization. You can cancel future renewals in Billing. Upgrades are available there too. Free needs no payment method.</p>
      {!recommended && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Your expected registrations exceed the current self-service plans. Reduce event capacity or contact UrPass for a larger plan before publishing.</p>}
      {catalogError && <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Some paid plans are unavailable while billing configuration is checked.</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const fits = plan.registrations >= expectedRegistrations;
          return <article key={plan.slug} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2"><h2 className="text-xl font-bold">{plan.name}</h2>
              {plan.slug === recommended && <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-800">Fits your event</span>}
            </div>
            <p className="mt-2 min-h-12 text-sm text-neutral-600">{plan.description}</p>
            <p className="mt-4 text-3xl font-bold">₹{(plan.amountPaise / 100).toLocaleString("en-IN")}<span className="text-sm font-normal text-neutral-500">{plan.slug === "free" ? " forever" : " / month"}</span></p>
            <p className="mt-1 text-xs text-neutral-600">{plan.slug === "free" ? "No tax or renewal charge" : `${plan.taxInclusive ? "Includes" : "Plus"} ${plan.taxRatePercent}% GST · monthly renewal`}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-neutral-700">
              <li>{plan.registrations.toLocaleString("en-IN")} registrations per billing month</li>
              <li>{plan.events >= 999999 ? "Unlimited" : plan.events} events per billing month</li>
              <li>{plan.seats} team {plan.seats === 1 ? "seat" : "seats"}</li>
              {plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
            </ul>
            {!fits && <p className="mt-4 text-xs text-amber-800">Reduce your event capacity or choose a higher plan before publishing.</p>}
            {plan.slug === "free" ? <button type="button" onClick={activateFree} disabled={freeLoading}
              className="mt-5 rounded-xl border border-violet-700 px-4 py-3 text-sm font-semibold text-violet-800 disabled:opacity-50">
              {freeLoading ? "Activating…" : "Continue with Free"}
            </button> : <PaidPlanButton plan={plan} draftId={draftId} userEmail={userEmail} userName={userName} />}
          </article>;
        })}
      </div>
    </div>
  </main>;
}
