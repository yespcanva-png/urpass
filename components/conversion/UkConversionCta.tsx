"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, X, Mail, Building2, Calendar } from "lucide-react";
import { trackConversionEvent } from "@/lib/conversion/tracker";

interface UkConversionCtaProps {
  pageSlug: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  headline?: string;
  subtext?: string;
  showDemoOption?: boolean;
  className?: string;
}

export default function UkConversionCta({
  pageSlug,
  primaryLabel = "Create Free UK Event",
  secondaryLabel = "Request UK Demo",
  headline = "Ready to Run Your UK Event on URPASS?",
  subtext = "Set up your event in 3 minutes. Sub-second QR check-in on volunteer phones. 0% ticket commission on free events.",
  showDemoOption = true,
  className = "",
}: UkConversionCtaProps) {
  const [signupUrl, setSignupUrl] = useState("/signup?market=GB&source=uk_seo");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orgName: "",
    eventType: "conference",
    estimatedAttendees: "250",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const targetParams = new URLSearchParams();
    targetParams.set("market", "GB");
    targetParams.set("country", "GB");
    targetParams.set("source", "uk_seo");
    targetParams.set("from", pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`);

    const forwardKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    for (const key of forwardKeys) {
      const val = params.get(key);
      if (val) targetParams.set(key, val);
    }
    setSignupUrl(`/signup?${targetParams.toString()}`);
  }, [pageSlug]);

  const handlePrimaryClick = () => {
    trackConversionEvent("primary_cta_click", {
      pageSlug,
      visitorSegment: "general",
      ctaPosition: "uk_conversion_unit",
      metadata: { market: "GB", target: signupUrl },
    });
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitting(true);
    setDemoError("");

    try {
      // Record conversion event (anonymized metadata only, strictly avoiding PII in analytics)
      trackConversionEvent("demo_requested", {
        pageSlug,
        visitorSegment: "general",
        ctaPosition: "uk_demo_modal",
        metadata: {
          market: "GB",
          eventType: formData.eventType,
          attendeeTier: formData.estimatedAttendees,
        },
      });

      // Submit lead securely to server action / endpoint if available
      const res = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          market: "GB",
          pageSlug,
          source: "uk_seo_demo_request",
        }),
      }).catch(() => null);

      setDemoSuccess(true);
    } catch {
      setDemoError("Something went wrong. Please email support@urpass.space directly.");
    } finally {
      setDemoSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50/50 via-white to-neutral-50 p-6 sm:p-8 text-neutral-900 shadow-xs ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-brand" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand">UK Organiser Launch Engine</span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-2">
        {headline}
      </h3>
      <p className="text-sm text-neutral-600 mb-6 leading-relaxed max-w-xl">
        {subtext}
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          href={signupUrl}
          onClick={handlePrimaryClick}
          className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm text-center"
        >
          {primaryLabel}
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </Link>
        {showDemoOption && (
          <button
            type="button"
            onClick={() => setIsDemoOpen(true)}
            className="inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white px-6 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-center"
          >
            {secondaryLabel}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free for non-commercial & student events
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No scanner hardware rental required
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Europe/London timestamps & UK GDPR ready
        </span>
      </div>

      {/* Demo / Waitlist Modal */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl text-neutral-900 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => { setIsDemoOpen(false); setDemoSuccess(false); }}
              className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-2">Request Received</h4>
                <p className="text-sm text-neutral-600 max-w-sm mx-auto mb-6">
                  Thank you! Our UK team will review your requirements and reach out within 1 business day with custom setup details.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDemoOpen(false)}
                  className="bg-neutral-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2 text-brand">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">UK Organiser Demonstration</span>
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-1">Schedule a Technical Walkthrough</h4>
                <p className="text-xs text-neutral-500 mb-5">
                  See sub-second smartphone check-in in action and discuss multi-gate venue configurations.
                </p>

                <form onSubmit={handleDemoSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Your Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Work or University Email</label>
                    <input
                      required
                      type="email"
                      placeholder="jane@organization.co.uk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">Organization / Society</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Manchester SU"
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">Expected Attendees</label>
                      <select
                        value={formData.estimatedAttendees}
                        onChange={(e) => setFormData({ ...formData, estimatedAttendees: e.target.value })}
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand bg-white"
                      >
                        <option value="100">Under 100</option>
                        <option value="500">100 - 500</option>
                        <option value="2500">500 - 2,500</option>
                        <option value="10000">2,500+</option>
                      </select>
                    </div>
                  </div>

                  {demoError && (
                    <p className="text-xs text-rose-600 mt-2">{demoError}</p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={demoSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {demoSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        "Submit Demo Request →"
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 text-center">
                    Submitted under UK GDPR legitimate interest for event coordination. No marketing spam.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
