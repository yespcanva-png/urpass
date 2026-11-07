"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const field = "mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-violet-600 focus:outline-none";

export default function LeadForm({ market }: { market: "IN" | "GB" }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const params = new URLSearchParams(window.location.search);
    const response = await fetch("/api/sales/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        market,
        estimatedRegistrations: values.estimatedRegistrations || undefined,
        expectedBudgetInr: values.expectedBudgetInr || undefined,
        consentToContact: values.consentToContact === "on",
        marketingOptIn: values.marketingOptIn === "on",
        sourcePage: window.location.pathname,
        utmSource: params.get("utm_source") || undefined,
        utmMedium: params.get("utm_medium") || undefined,
        utmCampaign: params.get("utm_campaign") || undefined,
      }),
    }).catch(() => null);
    setBusy(false);
    if (!response?.ok) {
      setError("We couldn't save your request. Please try again.");
      return;
    }
    setDone(true);
  }

  if (done) return <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-950"><h2 className="text-xl font-bold">Demo request received</h2><p className="mt-2 text-sm">Our team will review your event requirements and contact you by email.</p><Link className="mt-4 inline-block text-sm font-semibold underline" href="/">Return home</Link></div>;

  return <form onSubmit={submit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">Organisation or college *<input name="organisationName" required minLength={2} maxLength={120} className={field} /></label>
      <label className="text-sm font-medium">Your name *<input name="contactName" required minLength={2} maxLength={100} className={field} /></label>
      <label className="text-sm font-medium">Work email *<input name="email" required type="email" className={field} /></label>
      <label className="text-sm font-medium">Phone<input name="phone" type="tel" className={field} /></label>
      <label className="text-sm font-medium">Event type<input name="eventType" placeholder="Conference, college fest…" className={field} /></label>
      <label className="text-sm font-medium">Event date<input name="eventDate" type="date" className={field} /></label>
      <label className="text-sm font-medium">Expected registrations<input name="estimatedRegistrations" type="number" min="1" className={field} /></label>
      {market === "IN" && <label className="text-sm font-medium">Approximate software budget (₹)<input name="expectedBudgetInr" type="number" min="0" className={field} /></label>}
    </div>
    <label className="block text-sm font-medium">What do you need?<textarea name="requirements" rows={4} maxLength={1500} placeholder="Multiple gate teams, branded passes, integrations…" className={field} /></label>
    <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="flex gap-2 text-sm"><input name="consentToContact" type="checkbox" required />I agree to be contacted about this request. *</label>
    <label className="flex gap-2 text-sm"><input name="marketingOptIn" type="checkbox" />Send me occasional UrPass product updates.</label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="rounded-xl bg-violet-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Sending…" : "Request a demo"}</button>
  </form>;
}
