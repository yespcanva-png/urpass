"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Smartphone,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ScanLine,
  CheckCircle2,
  ExternalLink,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { createOrganization } from "@/app/actions/organizations";
import { createEvent } from "@/app/actions/events";

interface Props {
  firstName: string;
  canCreateOrg: boolean;
  planSlug: string;
}

type WizardStep = "org" | "gateway" | "event" | "pass" | "scan";

const STEPS: Array<{ key: WizardStep; label: string; number: number }> = [
  { key: "org", label: "Organization", number: 1 },
  { key: "gateway", label: "Gateway", number: 2 },
  { key: "event", label: "First Event", number: 3 },
  { key: "pass", label: "Pass Studio", number: 4 },
  { key: "scan", label: "Test Scan", number: 5 },
];

export default function OnboardingClient({ firstName, canCreateOrg }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>("org");

  // Step 1: Org State
  const [orgType, setOrgType] = useState<"personal" | "org">("personal");
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [orgBrandColor, setOrgBrandColor] = useState("#6D28D9");

  // Step 2: Gateway State
  const [gatewayMode, setGatewayMode] = useState<"free" | "razorpay_managed" | "razorpay_custom">("free");
  const [razorpayKey, setRazorpayKey] = useState("");

  // Step 3: First Event State
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("17:00");
  const [eventType, setEventType] = useState<"physical" | "online">("physical");
  const [venue, setVenue] = useState("");
  const [attendeeLimit, setAttendeeLimit] = useState(200);

  // Step 4: Pass Style State
  const [passFormat, setPassFormat] = useState<"digital" | "badge" | "printable">("digital");
  const [passAccentColor, setPassAccentColor] = useState("#6D28D9");

  // Step 5: Test Scan Simulator State
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const testPassToken = "TEST-PASS-URPASS-ONBOARDING-SAMPLE";

  async function handleCompleteOnboarding() {
    // If organization was chosen, create org
    if (orgType === "org" && orgName.trim()) {
      try {
        await createOrganization({
          name: orgName,
          brand_color: orgBrandColor,
        });
      } catch {}
    }

    // Create the event if a title was provided
    if (eventName.trim()) {
      try {
        const res = await createEvent({
          name: eventName,
          description: null,
          event_date: eventDate,
          start_time: startTime,
          end_time: endTime,
          venue: eventType === "physical" ? (venue.trim() || "Main Venue") : "Online",
          event_type: eventType,
          meeting_url: eventType === "online" ? "https://meet.google.com/sample" : null,
          meeting_platform: null,
          attendee_limit: attendeeLimit,
          status: "draft",
          application_enabled: true,
          auto_approve: true,
          is_paid_event: gatewayMode !== "free",
          ticket_price: gatewayMode !== "free" ? 499 : 0,
          workspace_id: null,
          location_id: null,
          currency: "INR",
          timezone: "Asia/Kolkata",
        });
        if (res && res.eventId) {
          router.push(`/event/${res.eventId}`);
          return;
        }
      } catch {}
    }

    router.push("/dashboard");
  }

  function simulateScan() {
    setScanStatus("scanning");
    setTimeout(() => {
      setScanStatus("success");
    }, 900);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 bg-white sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-xs">
            <Ticket className="w-4 h-4" />
          </div>
          <span className="text-sm font-black tracking-wider uppercase text-neutral-900">URPASS</span>
        </Link>

        {/* Stepper Progress */}
        <div className="hidden md:flex items-center gap-2">
          {STEPS.map((s, idx) => {
            const isCurrent = s.key === currentStep;
            const isCompleted = STEPS.findIndex((st) => st.key === currentStep) > idx;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-neutral-900 text-white shadow-xs"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]">
                      {s.number}
                    </span>
                  )}
                  <span>{s.label}</span>
                </button>
                {idx < STEPS.length - 1 && <span className="text-neutral-300">/</span>}
              </div>
            );
          })}
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Skip to Dashboard →
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          {/* STEP 1: ORGANIZATION SETUP */}
          {currentStep === "org" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 1 of 5: Workspace</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Welcome to UrPass, {firstName}!
                </h1>
                <p className="text-neutral-500 text-sm mt-1">
                  How will you be using UrPass? Choose personal or team organization workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrgType("personal")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    orgType === "personal"
                      ? "border-neutral-900 bg-neutral-50/70 shadow-xs ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400 bg-white"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
                    <Ticket className="w-5 h-5 text-neutral-800" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">Personal Workspace</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    For individual creators, meetup hosts, or single organizers with 0% platform fee.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrgType("org")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    orgType === "org"
                      ? "border-neutral-900 bg-neutral-50/70 shadow-xs ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400 bg-white"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-purple-700" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">Team / Organization</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    For colleges, societies, enterprises, and teams managing multiple gates & collaborators.
                  </p>
                </button>
              </div>

              {orgType === "org" && (
                <div className="space-y-4 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => {
                        setOrgName(e.target.value);
                        if (!orgSlug) {
                          setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                        }
                      }}
                      placeholder="e.g. Oxford Tech Society or PSG College of Technology"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                        Org URL Handle
                      </label>
                      <div className="flex items-center rounded-xl border border-neutral-200 px-3 bg-neutral-50 text-neutral-500 text-xs">
                        <span>urpass.space/org/</span>
                        <input
                          type="text"
                          value={orgSlug}
                          onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          placeholder="tech-society"
                          className="bg-transparent py-2.5 text-neutral-900 font-bold outline-none flex-1 ml-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                        Brand Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={orgBrandColor}
                          onChange={(e) => setOrgBrandColor(e.target.value)}
                          className="w-9 h-9 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                        />
                        <span className="text-xs font-mono font-bold text-neutral-700">{orgBrandColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("gateway")}
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <span>Continue to Gateway Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GATEWAY SETUP */}
          {currentStep === "gateway" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Step 2 of 5: Payments</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Configure Payments & Ticketing
                </h1>
                <p className="text-neutral-500 text-sm mt-1">
                  Choose how attendees will register or pay for tickets. You can change this anytime per event.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setGatewayMode("free")}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                    gatewayMode === "free"
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-neutral-900">Free Events & Registrations</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Zero Setup Required
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      No payment gateway needed. Perfect for conferences, hackathons, college fests, and free workshops.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGatewayMode("razorpay_managed")}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                    gatewayMode === "razorpay_managed"
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CreditCard className="w-5 h-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-neutral-900">UrPass Managed Payments (UPI + Cards)</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        Instant Activation
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Start selling paid tickets immediately via UPI, credit/debit cards, and NetBanking with automated payouts.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGatewayMode("razorpay_custom")}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                    gatewayMode === "razorpay_custom"
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ExternalLink className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-neutral-900">Connect Own Razorpay Account</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Direct settlements into your own bank account using your Razorpay Key ID and Secret.
                    </p>
                  </div>
                </button>
              </div>

              {gatewayMode === "razorpay_custom" && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    value={razorpayKey}
                    onChange={(e) => setRazorpayKey(e.target.value)}
                    placeholder="rzp_live_xxxxxxxxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none"
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("org")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("event")}
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <span>Continue to Event Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FIRST EVENT SETUP */}
          {currentStep === "event" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Step 3 of 5: First Event</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Draft your first event
                </h1>
                <p className="text-neutral-500 text-sm mt-1">
                  Enter event basics. You can edit registration forms and ticket tiers later.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. AI & Product Summit 2026 or Annual Tech Fest"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Event Format
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as "physical" | "online")}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none bg-white"
                    >
                      <option value="physical">Physical (In-Person Venue)</option>
                      <option value="online">Online (Virtual / Hybrid)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Expected Capacity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50000}
                      value={attendeeLimit}
                      onChange={(e) => setAttendeeLimit(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 outline-none"
                    />
                  </div>
                </div>

                {eventType === "physical" && (
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Venue Location
                    </label>
                    <div className="flex items-center rounded-xl border border-neutral-200 px-3 py-2 focus-within:border-neutral-900">
                      <MapPin className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="Auditorium Hall, Main Campus, Bangalore"
                        className="w-full text-sm outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("gateway")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("pass")}
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <span>Continue to Pass Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PASS STUDIO SETUP */}
          {currentStep === "pass" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Step 4 of 5: Pass Design</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Design attendee QR passes
                </h1>
                <p className="text-neutral-500 text-sm mt-1">
                  Choose your ticket format. UrPass generates high-contrast, sub-second readable digital passes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPassFormat("digital")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    passFormat === "digital"
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 shadow-xs"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-neutral-800 mb-2" />
                  <p className="text-xs font-bold text-neutral-900">Digital Mobile Pass</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Apple/Google Wallet & Web link</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPassFormat("badge")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    passFormat === "badge"
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 shadow-xs"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-neutral-800 mb-2" />
                  <p className="text-xs font-bold text-neutral-900">Event Badge</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Conference laminate & lanyard format</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPassFormat("printable")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    passFormat === "printable"
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 shadow-xs"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <Ticket className="w-5 h-5 text-neutral-800 mb-2" />
                  <p className="text-xs font-bold text-neutral-900">Printable Ticket</p>
                  <p className="text-[11px] text-neutral-400 mt-1">A4 / PDF print format with tear stub</p>
                </button>
              </div>

              {/* Pass Visual Preview Box */}
              <div className="bg-neutral-900 rounded-2xl p-6 text-white flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                <div
                  className="w-64 rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center space-y-3 shadow-2xl relative"
                  style={{
                    backgroundColor: "#0F172A",
                    borderTop: `4px solid ${passAccentColor}`,
                  }}
                >
                  <div className="text-[10px] font-black tracking-widest uppercase text-neutral-400">
                    {eventName || "TECH SUMMIT 2026"}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {firstName} (VIP Pass)
                  </div>

                  <div className="bg-white p-2.5 rounded-xl shadow-md">
                    <QRCodeSVG
                      value={`https://urpass.space/pass/${testPassToken}`}
                      size={110}
                      level="M"
                    />
                  </div>
                  <div className="text-[9px] font-mono text-neutral-400 uppercase">
                    PASS: #URP-SAMPLE-01
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Accent Color:</span>
                  {["#6D28D9", "#2563EB", "#059669", "#DC2626", "#D97706"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPassAccentColor(color)}
                      className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${
                        passAccentColor === color ? "scale-125 ring-2 ring-white" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("event")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("scan")}
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <span>Continue to Test Scan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: TEST SCAN SIMULATOR */}
          {currentStep === "scan" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Step 5 of 5: Test Scanner</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Verify Event-Day Scanner Ready
                </h1>
                <p className="text-neutral-500 text-sm mt-1">
                  Run a simulated scan of your QR ticket pass to test sub-second verification and sound feedback.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Generated QR Pass Preview */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Sample Attendee Pass
                  </span>
                  <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
                    <QRCodeSVG
                      value={`https://urpass.space/pass/${testPassToken}`}
                      size={130}
                      level="M"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{firstName} (Sample Attendee)</p>
                    <p className="text-[10px] font-mono text-neutral-500">GATE 1 · MAIN ENTRANCE</p>
                  </div>
                </div>

                {/* Interactive Scanner Viewport */}
                <div className="border border-neutral-800 bg-neutral-950 rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden min-h-[220px]">
                  {scanStatus === "idle" && (
                    <>
                      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <ScanLine className="w-6 h-6 animate-pulse text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Scanner Viewfinder Ready</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">Click below to simulate gate check-in</p>
                      </div>
                      <button
                        type="button"
                        onClick={simulateScan}
                        className="bg-brand hover:bg-brand/90 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
                      >
                        Simulate QR Scan
                      </button>
                    </>
                  )}

                  {scanStatus === "scanning" && (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-bold text-neutral-300">Validating pass token in database...</p>
                    </div>
                  )}

                  {scanStatus === "success" && (
                    <div className="flex flex-col items-center justify-center space-y-2 animate-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                        ADMITTED · VALID PASS
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Latency: 142ms · Check-in recorded at Gate 1
                      </p>
                      <button
                        type="button"
                        onClick={() => setScanStatus("idle")}
                        className="text-[11px] text-neutral-400 underline hover:text-white pt-1"
                      >
                        Scan Again
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Completion Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-emerald-900">
                    You are ready to launch your event on UrPass!
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your workspace, gateway, first event, and scanner configurations have been prepared.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("pass")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-xs"
                >
                  <span>Finish & Enter Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
