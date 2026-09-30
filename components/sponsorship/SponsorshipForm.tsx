"use client";

import { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Loader2,
  Calendar,
  Users,
  Mail,
  Phone,
  Globe,
  Building,
  AlertCircle,
} from "lucide-react";

export default function SponsorshipForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    collegeName: "",
    expectedAttendees: "500",
    eventDate: "",
    studentName: "",
    email: "",
    phone: "",
    websiteOrSocial: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sponsorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Submission failed. Please check inputs.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-8 sm:p-10 text-center shadow-xl">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900">Application Submitted!</h3>
        <p className="text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for applying. We are reviewing your event details for <strong>{formData.eventName}</strong> at <strong>{formData.collegeName}</strong>.
        </p>
        <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700 max-w-sm mx-auto">
          <p className="font-semibold text-neutral-900">What happens next?</p>
          <p className="mt-1 text-neutral-500">
            Our campus partnership team will activate your Pro event sponsor pass and email your coordinator dashboard link to <strong>{formData.email}</strong> within 12 hours.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-xs font-semibold text-violet-600 hover:text-violet-700 underline underline-offset-2 cursor-pointer"
        >
          Submit another event
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-2 rounded-xl bg-violet-100 text-violet-700">
          <GraduationCap className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Apply for Free College Sponsorship</h3>
          <p className="text-xs text-neutral-500">100% free Pro tier upgrade for student fests, symposiums & hackathons.</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Event Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HackVIT 2026 / TechSymposium"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              College / University *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. IIT Madras, PSG Tech, BITS Pilani"
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Student Lead Name *
            </label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Student / Official Email *
            </label>
            <input
              type="email"
              required
              placeholder="lead@college.ac.in or gmail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              WhatsApp / Phone
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Expected Attendees
            </label>
            <select
              value={formData.expectedAttendees}
              onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="100-300">100 – 300 Attendees</option>
              <option value="300-600">300 – 600 Attendees</option>
              <option value="600-1500">600 – 1,500 Attendees</option>
              <option value="1500+">1,500+ Attendees</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Approx Event Date
            </label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
            Fest Website, Instagram, or Registration Link
          </label>
          <input
            type="text"
            placeholder="https://instagram.com/yourfest or website"
            value={formData.websiteOrSocial}
            onChange={(e) => setFormData({ ...formData, websiteOrSocial: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Apply for Free Event Sponsorship →</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-neutral-400">
          Instant sponsorship voucher delivered to approved student coordinators within 12 hours.
        </p>
      </form>
    </div>
  );
}
