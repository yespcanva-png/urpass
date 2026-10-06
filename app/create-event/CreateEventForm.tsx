"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Lock, Building2, MapPin, Wifi, LayoutGrid, Link2, AlertCircle, CheckCircle2, Globe } from "lucide-react";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { createEvent } from "@/app/actions/events";
import { detectCountryClient } from "@/lib/country-config";
import { slugify } from "@/lib/utils";
import EventImageUploader from "@/components/events/EventImageUploader";
import EventImageCarousel from "@/components/events/EventImageCarousel";

type OrgOption = { id: string; slug: string; name: string; brand_color: string; role: string };

interface Props {
  maxAttendees: number;
  activeEventCount: number;
  maxEvents: number;
  unlimited: boolean;
  canCreatePaidEvents: boolean;
  organizationId?: string;
  organizationName?: string;
  orgs?: OrgOption[];
  workspaces?: import("@/types").Workspace[];
  locations?: import("@/types").Location[];
}

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-800">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls =
  "border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors bg-white placeholder:text-neutral-300";

const EVENT_TYPES = [
  {
    value: "physical" as const,
    label: "Physical",
    description: "In-person venue, QR check-in",
    Icon: MapPin,
  },
  {
    value: "online" as const,
    label: "Online",
    description: "Webinar, livestream, virtual event",
    Icon: Wifi,
  },
  {
    value: "hybrid" as const,
    label: "Hybrid",
    description: "Both in-person and online",
    Icon: LayoutGrid,
  },
] as const;

const PLATFORMS = [
  { value: "zoom" as const, label: "Zoom", short: "Z" },
  { value: "google_meet" as const, label: "Google Meet", short: "G" },
  { value: "teams" as const, label: "Teams", short: "T" },
  { value: "custom" as const, label: "Custom", short: "⚙" },
] as const;

export default function CreateEventForm({
  maxAttendees,
  activeEventCount,
  maxEvents,
  unlimited,
  canCreatePaidEvents,
  organizationId,
  organizationName,
  workspaces = [],
  locations = [],
}: Props) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [submitMode, setSubmitMode] = useState<"active" | "draft">("active");
  const [selectedPlatform, setSelectedPlatform] = useState<"zoom" | "google_meet" | "teams" | "custom" | null>(null);
  const [country, setCountry] = useState<"IN" | "GB">("IN");
  const [eventImages, setEventImages] = useState<string[]>([]);
  const [showCustomSlug, setShowCustomSlug] = useState(false);

  const atLimit = !unlimited && activeEventCount >= maxEvents;

  // Tomorrow as default date in YYYY-MM-DD format
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventInput, unknown, EventInput>({
    resolver: zodResolver(eventSchema) as never,
    defaultValues: {
      status: "active",
      application_enabled: true,
      auto_approve: false,
      attendee_limit: Math.min(100, maxAttendees),
      is_paid_event: false,
      ticket_price: 0,
      currency: "INR",
      timezone: "Asia/Kolkata",
      event_type: "physical",
      meeting_url: null,
      meeting_platform: null,
      venue: "",
      event_date: tomorrow,
      start_time: "10:00",
      end_time: "12:00",
    },
  });

  useEffect(() => {
    const detected = detectCountryClient();
    setCountry(detected);
    if (detected === "GB") {
      setValue("currency", "GBP");
      setValue("timezone", "Europe/London");
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const template = params.get("template");
      if (template === "college-fest" || template === "college_fest") {
        setValue("name", "Annual College Cultural & Tech Fest 2026");
        setValue("description", "Inter-college technical and cultural festival featuring competitive events, keynote sessions, and hackathon sprints.");
        setValue("venue", "University Main Auditorium & Tech Campus");
        setValue("auto_approve", true);
        setValue("event_type", "physical");
      } else if (template === "corporate-conference" || template === "conference") {
        setValue("name", "Global Leadership & Tech Summit 2026");
        setValue("description", "Enterprise leaders, engineers, and product visionaries gathering for keynotes, high-level panel debates, and VIP networking.");
        setValue("venue", "Convention Center & Grand Ballroom, Bangalore");
        setValue("auto_approve", true);
        setValue("event_type", "physical");
      } else if (template === "rsvp-event") {
        setValue("name", "Private Wedding Reception & Gala Dinner");
        setValue("description", "Join us for an intimate celebration, dinner, and cocktails. Private RSVP pass required for entry.");
        setValue("venue", "The Glass House Gardens, Bangalore");
        setValue("auto_approve", false);
        setValue("event_type", "physical");
      } else if (template === "workshop") {
        setValue("name", "Hands-on Masterclass & Technical Workshop");
        setValue("description", "Deep-dive practical training workshop with live interactive demos and verifiable pass credentials.");
        setValue("venue", "WeWork Labs Arena, Bangalore");
        setValue("auto_approve", false);
        setValue("attendee_limit", 40);
        setValue("event_type", "physical");
      } else if (template === "exhibition") {
        setValue("name", "Clean Energy International Trade Expo 2026");
        setValue("description", "International B2B industrial expo with 350+ exhibitor pavilions, buyer matchmaking, and plenary sessions.");
        setValue("venue", "Pragati Maidan, Hall 4-7, New Delhi");
        setValue("auto_approve", true);
        setValue("event_type", "physical");
      } else if (template === "networking-meetup") {
        setValue("name", "SaaS Founders & Builders Mixer");
        setValue("description", "Casual evening of conversations, product demos, and founder stories with instant mobile pass entry.");
        setValue("venue", "Third Wave Roasters, Indiranagar, Bangalore");
        setValue("auto_approve", true);
        setValue("event_type", "physical");
      } else if (template === "product-launch") {
        setValue("name", "ORION V2 Global Product Reveal & Keynote");
        setValue("description", "Next-generation compute architecture reveal with live hardware keynotes and press briefing.");
        setValue("venue", "Auditorium Hall A, Aerocity, New Delhi");
        setValue("auto_approve", false);
        setValue("event_type", "physical");
      } else if (template === "vip-invitation") {
        setValue("name", "Annual Leadership Fellows & Trustee Gala");
        setValue("description", "Black-tie awards evening honoring global philanthropic trustees. Secret VIP access code required.");
        setValue("venue", "The Oberoi Grand Ballroom, Mumbai");
        setValue("auto_approve", false);
        setValue("event_type", "physical");
      } else if (template === "paid-event") {
        setValue("name", "Echoes Live Music & Arts Festival 2026");
        setValue("description", "2 Days, 3 stages, 24 live artists. Tiered festival ticketing with instant UPI check-in.");
        setValue("venue", "JLN Stadium Amphitheatre, New Delhi");
        setValue("is_paid_event", true);
        setValue("ticket_price", 999);
        setValue("event_type", "physical");
      } else if (template === "hackathon") {
        setValue("name", "HackNation 2026: 36H National Buildathon");
        setValue("description", "Over 500 hackers building autonomous agents and cloud primitives. Team mentor review and meal tokens.");
        setValue("venue", "Tech Innovation Hub, IIT Madras Research Park");
        setValue("auto_approve", false);
        setValue("event_type", "physical");
      } else if (template === "sports-tournament") {
        setValue("name", "Bangalore City 10K & Half Marathon");
        setValue("description", "Official timed athletic running event with dynamic bib numbers, locker zone permissions, and finish timing.");
        setValue("venue", "Kanteerava Stadium, Bangalore");
        setValue("is_paid_event", true);
        setValue("ticket_price", 499);
        setValue("event_type", "physical");
      } else if (template === "employee-event") {
        setValue("name", "Acme Global Annual Summit & Offsite 2026");
        setValue("description", "Internal team celebration, annual milestones, townhall address, and team innovation awards.");
        setValue("venue", "Leela Palace Grand Ballroom & Lawn, Bangalore");
        setValue("auto_approve", true);
        setValue("event_type", "physical");
      }

      const paramName = params.get("eventName") || params.get("name") || params.get("event_name");
      if (paramName) {
        setValue("name", paramName);
      }
      const paramVenue = params.get("venue");
      if (paramVenue) {
        setValue("venue", paramVenue);
      }
    }
  }, [setValue]);

  const applicationEnabled = watch("application_enabled");
  const autoApprove = watch("auto_approve");
  const isPaidEvent = watch("is_paid_event");
  const eventType = watch("event_type");
  const currency = watch("currency");
  const eventName = watch("name");
  const customSlug = watch("custom_slug");
  const eventDate = watch("event_date");
  const endDate = watch("end_date");
  const startTime = watch("start_time");
  const endTime = watch("end_time");

  const isOvernight = (() => {
    if (!startTime || !endTime) return false;
    const startParts = startTime.split(":");
    const endParts = endTime.split(":");
    if (startParts.length >= 2 && endParts.length >= 2) {
      const s = parseInt(startParts[0], 10) * 60 + (parseInt(startParts[1], 10) || 0);
      const e = parseInt(endParts[0], 10) * 60 + (parseInt(endParts[1], 10) || 0);
      return e < s;
    }
    return false;
  })();

  const previewSlug = (customSlug?.trim() ? slugify(customSlug) : slugify(eventName || "")) || "your-event-name";

  function handleEventTypeChange(type: "physical" | "online" | "hybrid") {
    setValue("event_type", type);
    if (type === "online") {
      setValue("venue", "Online");
    } else if (type === "physical" || type === "hybrid") {
      // Reset venue for re-entry unless hybrid keeping their value
      if (eventType === "online") setValue("venue", "");
    }
  }

  function handlePlatformSelect(platform: "zoom" | "google_meet" | "teams" | "custom") {
    setSelectedPlatform(platform);
    setValue("meeting_platform", platform);
  }

  const router = useRouter();

  const onInvalid = (formErrors: typeof errors) => {
    const errorList = Object.entries(formErrors)
      .map(([field, err]) => `${field.replace(/_/g, " ")}: ${err?.message}`)
      .filter(Boolean);
    const message =
      errorList.length > 0
        ? `Please fix the following: ${errorList.join(" • ")}`
        : "Please complete all required fields.";
    setServerError(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function onSubmit(data: EventInput) {
    setServerError("");
    setSuccessMessage("");
    setIsNavigating(false);
    try {
      const payload: EventInput = { ...data, status: submitMode, event_images: eventImages };
      const result = await createEvent(payload, organizationId);
      if (result?.error) {
        setServerError(`Could not create event: ${result.error}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (result?.eventId) {
        const actionLabel = submitMode === "active" ? "Event published and live!" : "Event saved as draft!";
        setSuccessMessage(`${actionLabel} Opening your event dashboard...`);
        setIsNavigating(true);
        router.push(`/event/${result.eventId}`);
      } else {
        setServerError("Could not create event: Server did not return an event ID.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: unknown) {
      const digest = (err as { digest?: string })?.digest;
      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        setSuccessMessage("Event created! Opening event dashboard...");
        setIsNavigating(true);
        return;
      }
      setServerError(`Error creating event: ${err instanceof Error ? err.message : String(err)}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Events
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create event</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Fill in the details. You can edit these later.
            </p>
          </div>
          {/* Event usage pill */}
          <div className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-500 bg-white">
            {activeEventCount} / {unlimited ? "∞" : maxEvents} events
          </div>
        </div>

        {/* Org context banner */}
        {organizationName && (
          <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-2">
            <Building2 className="w-4 h-4 text-brand shrink-0" />
            <p className="text-sm text-brand font-medium">
              Creating under <strong>{organizationName}</strong>
            </p>
          </div>
        )}

        {/* Limit banner */}
        {atLimit && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Event limit reached</p>
              <p className="text-xs text-amber-600 mt-0.5">
                You&apos;ve used all {maxEvents} event slots on your current plan.{" "}
                <Link href="/billing" className="underline font-medium">
                  Upgrade to create more.
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Top error / success banner */}
        {serverError && (
          <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-red-900 shadow-sm mb-4 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900">Event could not be created</h3>
              <p className="text-xs text-red-800 mt-1 font-medium">{serverError}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-emerald-900 shadow-sm mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-emerald-900">Success!</h3>
              <p className="text-xs text-emerald-800 mt-1 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-6">
          {/* Event type selector — first */}
          <fieldset disabled={atLimit} className="contents">
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-neutral-800">Event type</h2>
              <div className="grid grid-cols-3 gap-3">
                {EVENT_TYPES.map(({ value, label, description, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleEventTypeChange(value)}
                    className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-center transition-all ${
                      eventType === value
                        ? "border-brand bg-brand-50"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${eventType === value ? "text-brand" : "text-neutral-400"}`}
                    />
                    <div>
                      <p className={`text-xs font-semibold ${eventType === value ? "text-brand" : "text-neutral-700"}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Event details */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-sm font-semibold text-neutral-800">Event details</h2>

              {workspaces.length > 0 && (
                <Field label="Department / Workspace" hint="Assign to a specific division or committee">
                  <select
                    className={inputCls}
                    {...register("workspace_id")}
                  >
                    <option value="">General (Default Organization Workspace)</option>
                    {workspaces.map((ws) => (
                      <option key={ws.id} value={ws.id}>
                        {ws.name} {ws.is_default ? "· (Default)" : ""}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <div>
                <Field label="Event name" error={errors.name?.message}>
                  <input
                    type="text"
                    placeholder="Pilani Grand Garba Night 2026"
                    className={inputCls}
                    {...register("name")}
                  />
                </Field>

                {/* Live SEO URL Preview & Optional Customization */}
                <div className="mt-2.5 bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 truncate min-w-0">
                      <Globe className="w-3.5 h-3.5 text-brand shrink-0" />
                      <span className="font-mono text-neutral-400 shrink-0">urpass.space/events/</span>
                      <span className="font-mono font-bold text-neutral-900 truncate">{previewSlug}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (showCustomSlug) {
                          setValue("custom_slug", null);
                        }
                        setShowCustomSlug(!showCustomSlug);
                      }}
                      className="text-[11px] font-semibold text-brand hover:underline shrink-0 cursor-pointer"
                    >
                      {showCustomSlug ? "Use Auto URL" : "Customize URL"}
                    </button>
                  </div>

                  {showCustomSlug && (
                    <div className="pt-2 border-t border-neutral-200/70 flex flex-col gap-1.5 animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400 bg-white border border-neutral-200 px-2.5 py-2 rounded-lg shrink-0">
                          /events/
                        </span>
                        <input
                          type="text"
                          placeholder="custom-event-slug"
                          className={`${inputCls} font-mono text-xs py-2`}
                          {...register("custom_slug", {
                            onChange: (e) => {
                              const val = slugify(e.target.value);
                              setValue("custom_slug", val);
                            },
                          })}
                        />
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Letters, numbers, and hyphens only. Automatically optimized for SEO.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Field
                label="Description"
                error={errors.description?.message}
                hint="Paragraphs, line breaks, and formatting are preserved automatically on your registration page."
              >
                <textarea
                  rows={6}
                  placeholder="What's this event about? Share the agenda, highlights, speaker bios, and pass perks..."
                  className={`${inputCls} min-h-[140px] sm:min-h-[180px] resize-y leading-relaxed font-normal`}
                  {...register("description")}
                />
              </Field>

              {/* Event Photos & Gallery */}
              <div className="flex flex-col gap-2 pt-1 border-t border-neutral-100">
                <div>
                  <label className="text-sm font-medium text-neutral-800">Event Photos & Posters</label>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Add 1 to 4 photos or posters. They appear in a swipeable horizontal carousel on your event page.
                  </p>
                </div>
                <EventImageUploader
                  images={eventImages}
                  onChange={setEventImages}
                  maxImages={4}
                />
                {eventImages.length > 0 && (
                  <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                      Live Carousel Preview
                    </span>
                    <EventImageCarousel images={eventImages} />
                  </div>
                )}
              </div>

              {/* Venue — hidden for pure online events */}
              {eventType !== "online" && (
                <div className="flex flex-col gap-3">
                  {locations.length > 0 && (
                    <Field label="Select Pre-Configured Location" hint="Choose a saved campus auditorium or venue">
                      <select
                        className={inputCls}
                        onChange={(e) => {
                          const locId = e.target.value;
                          setValue("location_id", locId || null);
                          const chosen = locations.find((l) => l.id === locId);
                          if (chosen) {
                            setValue("venue", chosen.name + (chosen.city ? `, ${chosen.city}` : ""));
                          }
                        }}
                      >
                        <option value="">Custom Venue (Enter below)...</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} {loc.city ? `(${loc.city})` : ""} {loc.capacity ? `· ${loc.capacity} cap` : ""}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field label="Venue address / name" error={errors.venue?.message}>
                    <input
                      type="text"
                      placeholder="SRM Institute, Chennai"
                      className={inputCls}
                      {...register("venue")}
                    />
                  </Field>
                </div>
              )}

              {/* Meeting details for online / hybrid */}
              {(eventType === "online" || eventType === "hybrid") && (
                <>
                  <Field label="Meeting platform" error={errors.meeting_platform?.message}>
                    <div className="flex gap-2 flex-wrap">
                      {PLATFORMS.map(({ value, label, short }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handlePlatformSelect(value)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                            selectedPlatform === value
                              ? "border-brand bg-brand-50 text-brand"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          <span className="text-sm">{short}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field
                    label="Meeting URL"
                    error={errors.meeting_url?.message}
                    hint="The link attendees will use to join. Shown on their pass after approval."
                  >
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        type="url"
                        placeholder="https://zoom.us/j/123456789"
                        className={`${inputCls} pl-9`}
                        {...register("meeting_url")}
                      />
                    </div>
                  </Field>
                </>
              )}
            </div>

            {/* Date & time */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col gap-5">
              <div>
                <h2 className="text-sm font-semibold text-neutral-800">Date &amp; time</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Set event schedule. Overnight events continuing past midnight (e.g. 7:00 PM → 1:00 AM) are fully supported.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Start date" error={errors.event_date?.message}>
                  <input type="date" className={inputCls} {...register("event_date")} />
                </Field>

                <Field
                  label="End date (Optional for multi-day)"
                  error={errors.end_date?.message}
                  hint="Leave blank if single-day or overnight event"
                >
                  <input
                    type="date"
                    min={eventDate || undefined}
                    className={inputCls}
                    {...register("end_date")}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start time" error={errors.start_time?.message}>
                  <input type="time" className={inputCls} {...register("start_time")} />
                </Field>
                <Field
                  label={isOvernight ? "End time (Next day)" : "End time"}
                  error={errors.end_time?.message}
                  hint={isOvernight ? "✨ Continues past midnight into the next day" : undefined}
                >
                  <div className="relative">
                    <input type="time" className={inputCls} {...register("end_time")} />
                    {isOvernight && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded pointer-events-none">
                        Next Day
                      </span>
                    )}
                  </div>
                </Field>
              </div>

              <Field
                label="Event timezone"
                error={errors.timezone?.message}
                hint="Check-in schedules, ticket studio passes, and attendee notifications adhere to this timezone."
              >
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <select className={`${inputCls} pl-9`} {...register("timezone")}>
                    <option value="Europe/London">Europe/London (GMT/BST · United Kingdom)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30 · India)</option>
                    <option value="America/New_York">America/New_York (EST/EDT · US Eastern)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                  </select>
                </div>
              </Field>
            </div>

            {/* Capacity & settings */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-sm font-semibold text-neutral-800">Capacity &amp; settings</h2>

              <Field
                label="Attendee limit"
                error={errors.attendee_limit?.message}
                hint={`Maximum approved attendees · your plan allows up to ${maxAttendees}`}
              >
                <input
                  type="number"
                  min={1}
                  max={maxAttendees}
                  className={inputCls}
                  {...register("attendee_limit", { valueAsNumber: true })}
                />
              </Field>

              <Field label="Initial status" error={errors.status?.message}>
                <select className={inputCls} {...register("status")}>
                  <option value="draft">Draft — not visible to applicants yet</option>
                  <option value="active">Active — open for applications</option>
                </select>
              </Field>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Public application form</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Let anyone apply via a public link
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={applicationEnabled}
                  onClick={() => setValue("application_enabled", !applicationEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors ${
                    applicationEnabled ? "bg-neutral-900" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      applicationEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {applicationEnabled && (
                <div className="flex items-start justify-between gap-4 pl-5 border-l-2 border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Auto-approve</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Instantly approve and generate passes on submission
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoApprove}
                    onClick={() => setValue("auto_approve", !autoApprove)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors ${
                      autoApprove ? "bg-brand" : "bg-neutral-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        autoApprove ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
            {/* Paid event */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800">Ticket payment</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Charge attendees via Razorpay</p>
                </div>
                {!canCreatePaidEvents && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                    <Lock className="w-3 h-3" />
                    Starter+
                  </span>
                )}
              </div>

              {canCreatePaidEvents ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-800">Paid event</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Require attendees to pay before registering
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPaidEvent}
                      onClick={() => setValue("is_paid_event", !isPaidEvent)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors ${
                        isPaidEvent ? "bg-neutral-900" : "bg-neutral-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          isPaidEvent ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {isPaidEvent && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                          label={`Ticket price (${currency === "GBP" ? "£" : currency === "USD" ? "$" : "₹"})`}
                          error={errors.ticket_price?.message}
                          hint={
                            currency === "GBP"
                              ? "Amount in British Pounds (£). Attendees pay this before their application is submitted."
                              : currency === "USD"
                              ? "Amount in US Dollars ($). Attendees pay this before their application is submitted."
                              : "Amount in Indian Rupees (₹). Attendees pay this before their application is submitted."
                          }
                        >
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400 pointer-events-none">
                              {currency === "GBP" ? "£" : currency === "USD" ? "$" : "₹"}
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={currency === "GBP" || currency === "USD" ? 5000 : 100000}
                              placeholder={currency === "GBP" ? "15" : "499"}
                              className={`${inputCls} pl-9`}
                              {...register("ticket_price", {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        </Field>

                        <Field label="Billing currency" error={errors.currency?.message}>
                          <select className={inputCls} {...register("currency")}>
                            <option value="GBP">GBP (£) — United Kingdom</option>
                            <option value="INR">INR (₹) — India</option>
                            <option value="USD">USD ($) — United States</option>
                          </select>
                        </Field>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-neutral-400">
                  Upgrade to Starter or Pro to charge for tickets.{" "}
                  <Link href="/billing" className="text-brand underline">
                    Upgrade
                  </Link>
                </p>
              )}
            </div>
          </fieldset>

          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-900 shadow-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-900">Event could not be created</h3>
                <p className="text-xs text-red-800 mt-1 font-medium">{serverError}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-emerald-900 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-emerald-900">Success!</h3>
                <p className="text-xs text-emerald-800 mt-1 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 justify-end pb-8">
            <Link
              href="/dashboard/events"
              className="w-full sm:w-auto text-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors px-4 py-2.5"
            >
              Cancel
            </Link>
            <button
              type="submit"
              onClick={() => {
                setSubmitMode("draft");
                setValue("status", "draft");
              }}
              disabled={isSubmitting || isNavigating || atLimit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50 shadow-2xs"
            >
              {isSubmitting && submitMode === "draft" && <Loader2 className="w-4 h-4 animate-spin" />}
              Save as Draft
            </button>
            <button
              type="submit"
              onClick={() => {
                setSubmitMode("active");
                setValue("status", "active");
              }}
              disabled={isSubmitting || isNavigating || atLimit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {(isSubmitting && submitMode === "active") || isNavigating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {isNavigating
                ? "Opening event…"
                : isSubmitting && submitMode === "active"
                ? "Publishing event…"
                : "Publish & Make Live"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
