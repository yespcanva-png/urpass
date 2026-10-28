"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveQuickFirstEventDraft } from "@/app/actions/first-event";

export default function QuickFirstEventForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [expectedRegistrations, setExpectedRegistrations] = useState(100);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await saveQuickFirstEventDraft({ name, expectedRegistrations });
      if (result.error || !result.eventId) {
        setError(result.error || "Could not save your draft.");
        return;
      }
      router.push(`/onboarding/first-event/plans?draft=${result.eventId}`);
    } catch {
      setError("Could not save your draft. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-12 text-neutral-900">
      <div className="mx-auto max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-sm font-semibold text-violet-700">Step 1 of 5 · First event</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">What are you planning?</h1>
        <p className="mt-2 text-sm text-neutral-600">Save a draft now. Add your date, venue and registration details before publishing.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="rounded-xl bg-violet-50 p-4 text-sm text-violet-900">
            Corporate event · Collect registrations
          </div>
          <label className="block text-sm font-semibold" htmlFor="first-event-name">Event name</label>
          <input id="first-event-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={160}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-violet-600 focus:outline-none" placeholder="e.g. Annual team summit" />
          <label className="block text-sm font-semibold" htmlFor="first-event-capacity">Expected registrations</label>
          <input id="first-event-capacity" type="number" min={1} max={100000} value={expectedRegistrations}
            onChange={(e) => setExpectedRegistrations(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-violet-600 focus:outline-none" />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Saving draft…" : "Save draft and continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
