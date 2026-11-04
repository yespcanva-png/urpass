"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Layers } from "lucide-react";
import { saveQuickFirstEventDraft } from "@/app/actions/first-event";

interface QuickFirstEventFormProps {
  initialName?: string;
  initialCapacity?: number;
  initialTemplate?: string;
  initialCategory?: string;
  initialIntent?: string;
}

export default function QuickFirstEventForm({
  initialName = "",
  initialCapacity = 100,
  initialTemplate,
  initialCategory,
  initialIntent,
}: QuickFirstEventFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [expectedRegistrations, setExpectedRegistrations] = useState(initialCapacity);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const bannerText = useMemo(() => {
    if (initialTemplate === "badge") {
      return "Conference Badge Designer · Formatted for Avery sheets & thermal prints";
    }
    if (initialTemplate === "scanner") {
      return "Gate Control & Offline Scanner · IndexedDB cache & sub-0.28s scanning";
    }
    if (initialTemplate === "college_fest") {
      return "College Fest & Campus Events · Dynamic anti-screenshot passes & duplicate blocking";
    }
    if (initialTemplate === "workshop") {
      return "Paid Workshop & Masterclass · Strict seat cap, instant UPI payouts & GST tax invoices";
    }
    if (initialTemplate === "vip_access") {
      return "VIP Access Control · Zone clearance, host alerts & anti-passback";
    }
    if (initialTemplate === "conference") {
      return "Conference & Summit · Multi-track agenda & QR badge check-in ready";
    }
    if (initialTemplate === "product_launch") {
      return "Product Launch · Invite-only approval queue & branded VIP passes";
    }
    if (initialTemplate === "pitch_day") {
      return "Startup Pitch & Demo Day · Investor badges, RSVP approvals & fast entry";
    }
    if (initialTemplate === "alumni") {
      return "Alumni Reunion · Batch year tags, ticket tiers & family guest passes";
    }
    if (initialTemplate === "networking") {
      return "Business Networking · vCard QR exchange & verified professional credentials";
    }
    if (initialIntent) {
      return `Preconfigured setup · ${initialIntent}`;
    }
    return "Corporate event · Collect registrations & generate digital passes";
  }, [initialTemplate, initialIntent]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await saveQuickFirstEventDraft({
        name,
        expectedRegistrations,
        category: initialCategory,
        template: initialTemplate,
      });
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
          <div className="rounded-xl bg-violet-50/80 border border-violet-200/60 p-4 text-xs sm:text-sm text-violet-950 font-medium flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
            <span>{bannerText}</span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-800" htmlFor="first-event-name">
              Event name
            </label>
            <input
              id="first-event-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={160}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-violet-600 focus:outline-none transition-colors"
              placeholder="e.g. Annual team summit"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-800" htmlFor="first-event-capacity">
              Expected registrations
            </label>
            <input
              id="first-event-capacity"
              type="number"
              min={1}
              max={100000}
              value={expectedRegistrations}
              onChange={(e) => setExpectedRegistrations(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-violet-600 focus:outline-none transition-colors"
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-violet-700 hover:bg-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            {saving ? "Saving draft…" : "Save draft and continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
