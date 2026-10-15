"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Store,
  MapPin,
  Calendar,
  User,
  PhoneCall,
  ShieldCheck,
  Clock,
  Zap,
} from "lucide-react";

interface ManagedSetupLeadFormProps {
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ManagedSetupLeadForm({
  id = "managed-setup-form",
  title = "Request Managed Event Setup",
  subtitle = "Submit your event parameters below. Our operations team will follow up with you promptly.",
  className = "",
}: ManagedSetupLeadFormProps) {
  const [eventType, setEventType] = useState("Conference / Corporate Event");
  const [expectedAttendees, setExpectedAttendees] = useState("500–2,000");
  const [city, setCity] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("managed_setup_view"));
    }

    const onPlanSelected = (e: Event) => {
      const custom = e as CustomEvent<{ attendees: string; plan?: string }>;
      if (custom.detail?.attendees) {
        setExpectedAttendees(custom.detail.attendees);
      }
      if (custom.detail?.plan) {
        setSelectedPlan(custom.detail.plan);
      }
    };
    window.addEventListener("urpass_select_setup_plan", onPlanSelected);
    return () => window.removeEventListener("urpass_select_setup_plan", onPlanSelected);
  }, []);

  const triggerStartedEvent = () => {
    if (!hasStartedTyping && typeof window !== "undefined") {
      setHasStartedTyping(true);
      window.dispatchEvent(new CustomEvent("quote_request_started"));
    }
  };

  const eventTypeOptions = [
    {
      id: "Conference / Corporate Event",
      title: "Conference / Corporate Event",
      subtitle: "Summits, Keynotes & Galas",
      icon: Briefcase,
    },
    {
      id: "College Fest / University",
      title: "College Fest / University",
      subtitle: "Symposiums & Hackathons",
      icon: GraduationCap,
    },
    {
      id: "Exhibition / Trade Show",
      title: "Exhibition / Trade Show",
      subtitle: "Expos, B2B Booths & Fairs",
      icon: Store,
    },
    {
      id: "Other Event",
      title: "Other Event",
      subtitle: "Workshops, Private & Community",
      icon: Sparkles,
    },
  ];

  const attendeeOptions = [
    { range: "Under 500", label: "Compact" },
    { range: "500–2,000", label: "Standard" },
    { range: "2,000–10,000", label: "Large" },
    { range: "10,000+", label: "Enterprise" },
  ];

  const quickCities = ["Bangalore", "Mumbai", "Delhi", "London", "Chennai"];

  const getSummaryText = () => {
    return [
      `UrPass Managed Event Setup Enquiry:`,
      selectedPlan ? `• Selected Package: ${selectedPlan}` : null,
      `• Event Type: ${eventType}`,
      `• Expected Attendees: ${expectedAttendees}`,
      `• Event City: ${city || "Not specified"}`,
      `• Event Date: ${eventDate || "To be confirmed"}`,
      `• Organizer Name: ${name || "Not provided"}`,
      `• Email / Phone: ${emailOrPhone || "Not provided"}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(getSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrPhone.trim()) {
      setErrorMsg("Please provide your phone number or email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/request-event-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Event Organizer",
          emailOrPhone: emailOrPhone.trim(),
          phoneNumber: emailOrPhone.trim(),
          eventType,
          expectedAttendees,
          city: city.trim() || "Not specified",
          eventDate: eventDate || "To be confirmed",
          eventName: `${eventType} in ${city || "Venue"}${selectedPlan ? ` (${selectedPlan} Package)` : ""}`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setIsSuccess(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quote_request_submitted"));
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id={id}
      className={`bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden relative ${className}`}
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 w-full" />

      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-100/40 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="p-6 sm:p-10 lg:p-12 relative z-10">
        {isSuccess ? (
          <div className="text-center py-8 sm:py-12 px-4 max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Request Submitted Successfully
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                We&apos;re On It!
              </h3>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Our event operations engineers have received your details. We will review your event scope and contact you within <strong className="text-neutral-900">2–4 business hours</strong> with a customized quote and launch plan.
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 text-left text-xs sm:text-sm space-y-2 text-neutral-700">
              {selectedPlan && (
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Selected Package:</span>
                  <span className="font-semibold text-violet-700">{selectedPlan} Setup</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-500">Event Type:</span>
                <span className="font-semibold text-neutral-900">{eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-500">Expected Scale:</span>
                <span className="font-semibold text-neutral-900">{expectedAttendees}</span>
              </div>
              {city && (
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">City:</span>
                  <span className="font-semibold text-neutral-900">{city}</span>
                </div>
              )}
              {eventDate && (
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Event Date:</span>
                  <span className="font-semibold text-neutral-900">{eventDate}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Contact:</span>
                <span className="font-semibold text-neutral-900">{emailOrPhone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyDetails}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Enquiry Details"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setEmailOrPhone("");
                  setCity("");
                  setEventDate("");
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700 hover:text-white bg-violet-50 hover:bg-violet-600 border border-violet-200 hover:border-violet-600 px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-50 text-violet-700 border border-violet-200/80 mb-3 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                <span>CUSTOM EVENT SCOPE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                {title}
              </h2>
              <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
              {selectedPlan && (
                <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-800">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Selected Package: <strong>{selectedPlan} Setup</strong></span>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("")}
                    className="ml-1 text-violet-500 hover:text-violet-900 text-[10px] underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3.5 text-xs sm:text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ── 1. Event Type ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Event Type
                </label>
                <span className="text-[11px] text-neutral-400 font-medium">Select one</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eventTypeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = eventType === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        setEventType(opt.id);
                        triggerStartedEvent();
                      }}
                      className={`relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-violet-50/70 border-violet-600 text-neutral-950 ring-2 ring-violet-500/20 shadow-xs"
                          : "bg-white hover:bg-neutral-50/80 border-neutral-200/90 text-neutral-700 hover:border-neutral-300 shadow-2xs"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-violet-600 text-white"
                            : "bg-neutral-100 text-neutral-600 group-hover:bg-violet-50 group-hover:text-violet-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-xs sm:text-sm font-bold text-neutral-950 truncate">
                          {opt.title}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                          {opt.subtitle}
                        </p>
                      </div>
                      <div
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-violet-600 border-violet-600 text-white"
                            : "border-neutral-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 2. Expected Attendees ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Expected Attendees
                </label>
                <span className="text-[11px] text-neutral-400 font-medium">Estimated scale</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {attendeeOptions.map((opt) => {
                  const isSelected = expectedAttendees === opt.range;
                  return (
                    <button
                      type="button"
                      key={opt.range}
                      onClick={() => {
                        setExpectedAttendees(opt.range);
                        triggerStartedEvent();
                      }}
                      className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-neutral-950 text-white border-neutral-950 font-bold shadow-xs"
                          : "bg-white hover:bg-neutral-50 border-neutral-200/90 text-neutral-700 shadow-2xs"
                      }`}
                    >
                      <span className="block text-xs sm:text-sm font-bold">{opt.range}</span>
                      <span
                        className={`block text-[10px] mt-0.5 ${
                          isSelected ? "text-neutral-400" : "text-neutral-500"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 3. City & Date ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Event City */}
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                  Event City
                </label>
                <div className="relative rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-2xs">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <MapPin className="w-4 h-4 text-violet-600" />
                  </div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      triggerStartedEvent();
                    }}
                    placeholder="e.g. Bangalore, Mumbai, London"
                    className="w-full text-sm pl-10 pr-4 py-3 bg-transparent rounded-2xl text-neutral-950 focus:outline-hidden placeholder:text-neutral-400 font-medium"
                  />
                </div>
                {/* Quick chip suggestions */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                  <span className="text-[10px] text-neutral-400 font-medium">Popular:</span>
                  {quickCities.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setCity(c);
                        triggerStartedEvent();
                      }}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-pointer text-[10px] font-medium"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                  Event Date
                </label>
                <div className="relative rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-2xs">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <Calendar className="w-4 h-4 text-violet-600" />
                  </div>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => {
                      setEventDate(e.target.value);
                      triggerStartedEvent();
                    }}
                    className="w-full text-sm pl-10 pr-4 py-3 bg-transparent rounded-2xl text-neutral-950 focus:outline-hidden font-medium cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-2">
                  Approximate or tentative date is fine
                </p>
              </div>
            </div>

            {/* ── 4. Organizer Name & Email or Phone ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <div className="relative rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-2xs">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <User className="w-4 h-4 text-violet-600" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      triggerStartedEvent();
                    }}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full text-sm pl-10 pr-4 py-3 bg-transparent rounded-2xl text-neutral-950 focus:outline-hidden placeholder:text-neutral-400 font-medium"
                  />
                </div>
              </div>

              {/* Email or Phone */}
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                  Email or Phone Number <span className="text-violet-600">*</span>
                </label>
                <div className="relative rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-2xs">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <PhoneCall className="w-4 h-4 text-violet-600" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      triggerStartedEvent();
                    }}
                    placeholder="organizer@event.com or +91 98765 43210"
                    className="w-full text-sm pl-10 pr-4 py-3 bg-transparent rounded-2xl text-neutral-950 focus:outline-hidden placeholder:text-neutral-400 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* ── 5. Action Row ── */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm sm:text-base py-4 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Custom Setup Quote</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/90 px-5 py-4 rounded-2xl transition-all cursor-pointer shrink-0 shadow-2xs"
                  title="Copy current form details to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-neutral-500" />
                      <span>Copy Enquiry Details</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-5 pt-5 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free scoping call</span>
                </span>
                <span className="text-neutral-300">·</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-violet-600" />
                  <span>No commitment required</span>
                </span>
                <span className="text-neutral-300">·</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Connects directly to UrPass sales &amp; support engineering</span>
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
