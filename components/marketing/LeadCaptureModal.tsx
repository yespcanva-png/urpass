"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, CheckCircle2, Loader2, ShieldCheck, Clock, Check } from "lucide-react";
import { trackConversion, getClientTrackingContext } from "@/lib/seo/analytics";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSlug: string;
  contentCluster?: string;
  eventTypeName?: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  pageSlug,
  contentCluster = "general",
  eventTypeName,
}: LeadCaptureModalProps) {
  const [organizerName, setOrganizerName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [eventType, setEventType] = useState(eventTypeName || "Conference / Corporate Event");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [expectedAttendees, setExpectedAttendees] = useState("500–2,000");
  const [eventPricingType, setEventPricingType] = useState<"free" | "paid" | "private">("free");
  const [preferredPackage, setPreferredPackage] = useState<"essential" | "pro" | "premium" | "enterprise">("pro");
  const [supportRequirements, setSupportRequirements] = useState("");
  const [comments, setComments] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleStartTyping = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackConversion("managed_service_form_started", {
        pageSlug,
        contentCluster,
        serviceModel: "managed_service",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!organizerName.trim() || !businessEmail.trim() || !phoneNumber.trim()) {
      setErrorMessage("Please fill in your name, business email, and phone number.");
      return;
    }

    if (!consentGiven) {
      setErrorMessage("Please confirm consent to receive our setup proposal.");
      return;
    }

    setIsSubmitting(true);
    const trackingCtx = getClientTrackingContext(pageSlug, contentCluster);

    try {
      const res = await fetch("/api/managed-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizerName: organizerName.trim(),
          businessEmail: businessEmail.trim(),
          phoneNumber: phoneNumber.trim(),
          eventType: eventType.trim(),
          eventDate: eventDate.trim() || undefined,
          city: city.trim() || undefined,
          expectedAttendees: expectedAttendees.trim() || undefined,
          eventPricingType,
          preferredPackage,
          supportRequirements: supportRequirements.trim() || undefined,
          comments: comments.trim() || undefined,
          consentGiven,
          pageSlug,
          contentCluster,
          utmSource: trackingCtx.utmSource,
          utmMedium: trackingCtx.utmMedium,
          utmCampaign: trackingCtx.utmCampaign,
          utmContent: trackingCtx.utmContent,
          referrer: trackingCtx.referrer,
          websiteUrlHoneypot: honeypot,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit inquiry.");
      }

      setIsSuccess(true);
      trackConversion("managed_service_form_submitted", {
        pageSlug,
        contentCluster,
        serviceModel: "managed_service",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-700 p-6 text-white flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Remote Managed Service
            </span>
            <h3 className="text-xl font-bold tracking-tight">Request Done-For-You Event Setup</h3>
            <p className="text-xs text-violet-100 mt-1">
              Let UrPass engineers remotely configure your registration forms, ticket tiers, branded passes, and scanner access.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-neutral-900">Setup Request Received</h4>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Thank you, <span className="font-semibold text-neutral-900">{organizerName}</span>! Our technical operations team will review your event parameters and contact you via WhatsApp / email within 4 business hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} onFocus={handleStartTyping} className="p-6 sm:p-8 space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                {errorMessage}
              </div>
            )}

            {/* Anti-spam honeypot */}
            <input
              type="text"
              name="websiteUrlHoneypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Organizer or Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Tech Summit / Jane Doe"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Event Type *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. College Fest, NYE Party, Corporate Summit"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Target City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Chennai, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Event Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24 Dec 2026 / TBD"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Estimated Attendees
                </label>
                <select
                  value={expectedAttendees}
                  onChange={(e) => setExpectedAttendees(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none bg-white"
                >
                  <option value="Under 500">Under 500</option>
                  <option value="500–2,000">500 to 2,000</option>
                  <option value="2,000–5,000">2,000 to 5,000</option>
                  <option value="5,000–15,000">5,000 to 15,000</option>
                  <option value="15,000+">15,000+ (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Ticketing Model
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["free", "paid", "private"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setEventPricingType(tier)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        eventPricingType === tier
                          ? "bg-violet-50 border-violet-600 text-violet-700"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {tier === "free" ? "Free RSVP" : tier === "paid" ? "Paid Tickets" : "Private Invite"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Preferred Remote Package
                </label>
                <select
                  value={preferredPackage}
                  onChange={(e) => setPreferredPackage(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none bg-white"
                >
                  <option value="essential">Essential (₹1,000 / event — up to 1,000 guests)</option>
                  <option value="pro">Pro (₹5,000 / event — up to 5,000 guests)</option>
                  <option value="premium">Premium (₹15,000 / event — up to 15,000 guests)</option>
                  <option value="enterprise">Enterprise (Custom scope / multi-event)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Specific Setup Requirements / Comments (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Need WhatsApp delivery, custom pass design with college logo, 4 gate scanning test."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 text-sm outline-none resize-none"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="consentCheckbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 rounded text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="consentCheckbox" className="text-xs text-neutral-500">
                I agree to let UrPass contact me with a technical setup quotation. UrPass provides remote technical services only; on-site facilities, devices, and gate operators are provided by the organizer.
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-sm font-semibold hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-semibold text-sm transition-all shadow-sm shadow-violet-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Setup Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
