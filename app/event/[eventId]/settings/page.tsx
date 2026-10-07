"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2, Trash2, AlertTriangle, IndianRupee,
  FileText, CalendarDays, Users, CreditCard,
  Radio, CheckCircle2, AlertCircle, Wifi, Link2, Ticket, Image as ImageIcon,
  Globe, Copy, Check, ExternalLink, Sparkles, Palette, Upload, ArrowRight, Lock,
} from "lucide-react";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { updateEvent, updateEventStatus, deleteEvent, updateEventImagesAction, updateEventSlugAction } from "@/app/actions/events";
import { setTicketTypeStatus, createDefaultTicketType } from "@/app/actions/ticket-types";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import CustomFieldsBuilder from "@/components/event/CustomFieldsBuilder";
import EventImageUploader from "@/components/events/EventImageUploader";
import EventImageCarousel from "@/components/events/EventImageCarousel";
import TrialConfirmationModal from "@/components/billing/TrialConfirmationModal";
import type { CustomFieldDefinition } from "@/types";

const PRESET_COLORS = [
  { label: "Imperial Purple", hex: "#6D28D9" },
  { label: "Royal Blue", hex: "#2563EB" },
  { label: "Emerald Green", hex: "#059669" },
  { label: "Crimson Red", hex: "#DC2626" },
  { label: "Amber Gold", hex: "#D97706" },
  { label: "Obsidian", hex: "#0F172A" },
];

const inputCls =
  "border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all bg-white placeholder:text-neutral-300 w-full";

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-50">
        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-violet-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 leading-none">{title}</h2>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors duration-200 disabled:opacity-50 ${
        checked ? "bg-brand" : "bg-neutral-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  indent,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  indent?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${indent ? "pl-5 border-l-2 border-neutral-100" : ""}`}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-800">{label}</p>
        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

const STATUS_CONFIG = {
  draft:     { label: "Draft",     dot: "bg-neutral-400", bg: "bg-neutral-50",  text: "text-neutral-600",  border: "border-neutral-200" },
  active:    { label: "Active",    dot: "bg-green-500",   bg: "bg-green-50",    text: "text-green-700",    border: "border-green-200" },
  completed: { label: "Completed", dot: "bg-blue-400",    bg: "bg-blue-50",     text: "text-blue-700",     border: "border-blue-200" },
  cancelled: { label: "Cancelled", dot: "bg-red-400",     bg: "bg-red-50",      text: "text-red-700",      border: "border-red-200" },
} as const;

const EVENT_TYPE_OPTIONS = [
  { value: "physical" as const, label: "Physical" },
  { value: "online" as const, label: "Online" },
  { value: "hybrid" as const, label: "Hybrid" },
];

const PLATFORM_OPTIONS = [
  { value: "zoom" as const, label: "Zoom" },
  { value: "google_meet" as const, label: "Google Meet" },
  { value: "teams" as const, label: "Teams" },
  { value: "custom" as const, label: "Custom" },
];

type EventRow = {
  id: string; name: string; description: string | null;
  event_date: string; start_time: string; end_time: string;
  venue: string; attendee_limit: number; status: string;
  application_enabled: boolean; auto_approve: boolean;
  is_paid_event: boolean; ticket_price: number;
  event_type: string; meeting_url: string | null; meeting_platform: string | null;
  sms_enabled?: boolean; whatsapp_enabled?: boolean; email_enabled?: boolean;
  sms_fallback_enabled?: boolean; sms_sender_id?: string | null;
  sms_dlt_entity_id?: string | null; sms_dlt_template_id?: string | null;
  sms_provider?: string | null;
  custom_fields?: CustomFieldDefinition[];
  apply_slug?: string | null;
};

export default function EventSettingsPage() {
  const params  = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const router  = useRouter();

  const [event, setEvent]                       = useState<EventRow | null>(null);
  const [loading, setLoading]                   = useState(true);
  const [saveError, setSaveError]               = useState("");
  const [saveSuccess, setSaveSuccess]           = useState(false);
  const [statusLoading, setStatusLoading]       = useState(false);
  const [deleteConfirm, setDeleteConfirm]       = useState(false);
  const [deleteLoading, setDeleteLoading]       = useState(false);
  const [hasPaymentGateway, setHasPaymentGateway] = useState<boolean | null>(null);
  const [ticketTypes, setTicketTypes]           = useState<{id: string; name: string; price: number; status: string}[]>([]);
  const [creatingDefault, setCreatingDefault]   = useState(false);
  const [customFieldsLimit, setCustomFieldsLimit] = useState<{ max: number; isUnlimited: boolean }>({ max: 3, isUnlimited: false });
  const [eventImages, setEventImages]           = useState<string[]>([]);
  const [imagesSaving, setImagesSaving]         = useState(false);

  // Event & Pass Branding State
  const [brandColor, setBrandColor]             = useState("#6D28D9");
  const [logoUrl, setLogoUrl]                   = useState("");
  const [hideBranding, setHideBranding]         = useState(false);
  const [canRemoveBranding, setCanRemoveBranding] = useState(false);
  const [isPro, setIsPro]                       = useState(false);
  const [isTrialActive, setIsTrialActive]       = useState(false);
  const [uploadingLogo, setUploadingLogo]       = useState(false);
  const [logoUploadError, setLogoUploadError]   = useState("");
  const [trialModalOpen, setTrialModalOpen]     = useState(false);
  const [userEmail, setUserEmail]               = useState("");
  const [userName, setUserName]                 = useState("");

  // SEO URL & Custom Slug state
  const [slugValue, setSlugValue]               = useState("");
  const [slugSaving, setSlugSaving]             = useState(false);
  const [slugError, setSlugError]               = useState("");
  const [slugSuccess, setSlugSuccess]           = useState(false);
  const [copiedUrl, setCopiedUrl]               = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EventInput, unknown, EventInput>({ resolver: zodResolver(eventSchema) as never });

  const applicationEnabled = watch("application_enabled");
  const autoApprove        = watch("auto_approve");
  const isPaidEvent        = watch("is_paid_event");
  const eventType          = watch("event_type");
  const eventDate          = watch("event_date");
  const endDate            = watch("end_date");
  const startTime          = watch("start_time");
  const endTime            = watch("end_time");

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

  function handleEventTypeChange(type: "physical" | "online" | "hybrid") {
    setValue("event_type", type, { shouldDirty: true, shouldValidate: true });
    if (type === "online") {
      setValue("venue", "Online", { shouldDirty: true, shouldValidate: true });
      if (!watch("meeting_platform")) {
        setValue("meeting_platform", "google_meet", { shouldDirty: true });
      }
    } else if (type === "physical") {
      if (watch("venue") === "Online") {
        setValue("venue", "", { shouldDirty: true });
      }
      setValue("meeting_url", null, { shouldDirty: true });
      setValue("meeting_platform", null, { shouldDirty: true });
    } else if (type === "hybrid") {
      if (watch("venue") === "Online") {
        setValue("venue", "", { shouldDirty: true });
      }
      if (!watch("meeting_platform")) {
        setValue("meeting_platform", "google_meet", { shouldDirty: true });
      }
    }
  }

  const onInvalid = (formErrors: typeof errors) => {
    const errorEntries = Object.entries(formErrors);
    if (errorEntries.length > 0) {
      const [field, err] = errorEntries[0];
      setSaveError(`${field.replace(/_/g, " ")}: ${err?.message || "Please check this field"}`);
    } else {
      setSaveError("Please check all required fields and try again.");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function handleImagesChange(newImages: string[]) {
    setEventImages(newImages);
    setImagesSaving(true);
    await updateEventImagesAction(eventId, newImages);
    setImagesSaving(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoUploadError("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError("Image size must be under 5MB.");
      return;
    }

    setLogoUploadError("");
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setLogoUrl(data.url);
        setValue("event_logo_url", data.url, { shouldDirty: true });
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setLogoUrl(ev.target.result as string);
            setValue("event_logo_url", ev.target.result as string, { shouldDirty: true });
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setLogoUrl(ev.target.result as string);
          setValue("event_logo_url", ev.target.result as string, { shouldDirty: true });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSaveSlug() {
    setSlugSaving(true);
    setSlugError("");
    setSlugSuccess(false);

    const clean = slugify(slugValue);
    if (!clean || clean.length < 2) {
      setSlugError("Event URL slug must be at least 2 characters long.");
      setSlugSaving(false);
      return;
    }

    const res = await updateEventSlugAction(eventId, clean);
    setSlugSaving(false);

    if (res?.error) {
      setSlugError(res.error);
    } else if (res?.slug) {
      setSlugValue(res.slug);
      setValue("custom_slug", res.slug);
      setEvent((prev) => (prev ? { ...prev, apply_slug: res.slug! } : null));
      setSlugSuccess(true);
      setTimeout(() => setSlugSuccess(false), 3000);
    }
  }

  function handleRegenerateSlug() {
    const currentName = watch("name") || event?.name || "";
    if (currentName) {
      const generated = slugify(currentName);
      setSlugValue(generated);
      setSlugError("");
    }
  }

  async function handleCopySlugUrl() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://urpass.space";
    const fullUrl = `${origin}/events/${slugValue || event?.apply_slug || eventId}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Fallback
    }
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data }, { data: { user } }] = await Promise.all([
        supabase.from("events")
          .select("id,name,description,event_date,start_time,end_time,venue,attendee_limit,status,application_enabled,auto_approve,is_paid_event,ticket_price,event_type,meeting_url,meeting_platform,sms_enabled,whatsapp_enabled,email_enabled,sms_fallback_enabled,sms_sender_id,sms_dlt_entity_id,sms_dlt_template_id,sms_provider,custom_fields,custom_pass_design,apply_slug")
          .eq("id", eventId).single(),
        supabase.auth.getUser(),
      ]);
      if (data) {
        setEvent(data as unknown as EventRow);
        setSlugValue(data.apply_slug || "");
        const design = (data.custom_pass_design as Record<string, unknown> | null) ?? {};
        if (design.event_images && Array.isArray(design.event_images)) {
          setEventImages(design.event_images as string[]);
        }
        reset({
          name: data.name, description: data.description ?? "",
          event_date: data.event_date,
          end_date: (design.end_date as string | null) ?? null,
          start_time: data.start_time, end_time: data.end_time,
          venue: data.venue ?? "", attendee_limit: data.attendee_limit,
          status: data.status as "draft" | "active",
          application_enabled: data.application_enabled, auto_approve: data.auto_approve,
          is_paid_event: data.is_paid_event, ticket_price: data.ticket_price,
          event_type: (data.event_type as "physical" | "online" | "hybrid") ?? "physical",
          meeting_url: data.meeting_url ?? null,
          meeting_platform: (data.meeting_platform as "zoom" | "google_meet" | "teams" | "custom" | null) ?? null,
        });
      }
      if (user) {
        setUserEmail(user.email || "");
        setUserName(user.user_metadata?.full_name || "");
        const [{ data: ps }, { data: sub }, { data: profile }] = await Promise.all([
          supabase.from("payment_settings").select("razorpay_key_id").eq("user_id", user.id).single(),
          supabase
            .from("subscriptions")
            .select("plan:plans(slug), status, is_trial, trial_plan, trial_ends_at")
            .eq("user_id", user.id)
            .in("status", ["active", "trialing"])
            .maybeSingle(),
          supabase
            .from("profiles")
            .select("org_name, brand_color, org_logo_url, hide_urpass_branding")
            .eq("user_id", user.id)
            .maybeSingle(),
        ]);
        setHasPaymentGateway(!!(ps?.razorpay_key_id));
        const planRaw = sub?.plan as unknown as { slug?: string } | { slug?: string }[] | undefined;
        const rawSlug = Array.isArray(planRaw) ? planRaw[0]?.slug : planRaw?.slug;
        const isTrial = Boolean(sub?.is_trial || sub?.status === "trialing");
        const effectiveSlug = (rawSlug || (isTrial ? (sub?.trial_plan as string) : undefined) || "free").toLowerCase();

        const isProTier = ["pro", "business", "campus", "founder", "lifetime", "enterprise"].includes(effectiveSlug);
        setIsPro(isProTier);
        const canHide = effectiveSlug !== "free";
        setCanRemoveBranding(canHide);
        setIsTrialActive(isTrial);

        const design = data ? ((data.custom_pass_design as Record<string, unknown> | null) ?? {}) : {};
        const resolvedBrandColor =
          (design.primaryColor as string) ||
          (design.brand_color as string) ||
          profile?.brand_color ||
          "#6D28D9";
        const resolvedLogoUrl =
          (design.logoUrl as string) ||
          (design.org_logo_url as string) ||
          profile?.org_logo_url ||
          "";
        const resolvedHideBranding =
          typeof design.hide_branding === "boolean"
            ? (design.hide_branding as boolean)
            : (profile?.hide_urpass_branding ?? false);

        setBrandColor(resolvedBrandColor);
        setLogoUrl(resolvedLogoUrl);
        setHideBranding(resolvedHideBranding);

        if (effectiveSlug === "starter") {
          setCustomFieldsLimit({ max: 10, isUnlimited: false });
        } else if (effectiveSlug && effectiveSlug !== "free") {
          setCustomFieldsLimit({ max: 999999, isUnlimited: true });
        } else {
          setCustomFieldsLimit({ max: 3, isUnlimited: false });
        }
      }
      const { data: ttRows } = await supabase
        .from("ticket_types")
        .select("id, name, price, status")
        .eq("event_id", eventId)
        .order("position", { ascending: true });
      setTicketTypes(ttRows ?? []);
      setLoading(false);
    }
    load();
  }, [eventId, reset]);

  async function onSubmit(data: EventInput) {
    setSaveError(""); setSaveSuccess(false);
    const payload: EventInput = {
      ...data,
      custom_slug: slugValue ? slugify(slugValue) : undefined,
      event_brand_color: brandColor,
      event_logo_url: logoUrl || null,
      hide_branding: hideBranding,
    };
    const result = await updateEvent(eventId, payload);
    if (result?.error) {
      setSaveError(result.error);
    } else {
      if (slugValue) {
        const clean = slugify(slugValue);
        setSlugValue(clean);
        setEvent((prev) => (prev ? { ...prev, apply_slug: clean } : null));
      }
      reset(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }

  async function handleStatusChange(newStatus: "draft" | "active" | "completed" | "cancelled") {
    setStatusLoading(true);
    const result = await updateEventStatus(eventId, newStatus);
    if (result?.error) { setSaveError(result.error); }
    else {
      router.refresh();
      setEvent((e) => (e ? { ...e, status: newStatus } : e));
    }
    setStatusLoading(false);
  }

  async function handleTicketTypeToggle(ticketTypeId: string, currentStatus: string) {
    const newStatus = currentStatus === "on_sale" ? "draft" : "on_sale";
    setTicketTypes((prev) =>
      prev.map((t) => (t.id === ticketTypeId ? { ...t, status: newStatus } : t))
    );
    const result = await setTicketTypeStatus(ticketTypeId, newStatus as "on_sale" | "draft");
    if (result?.error) {
      setTicketTypes((prev) =>
        prev.map((t) => (t.id === ticketTypeId ? { ...t, status: currentStatus } : t))
      );
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    const result = await deleteEvent(eventId);
    if (result?.error) { setSaveError(result.error); setDeleteLoading(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
      </div>
    );
  }
  if (!event) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-neutral-400">Event not found</p>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.draft;

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-0 py-6 pb-28">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-5">

        {/* ── Event details ── */}
        <SectionCard icon={FileText} title="Event details" subtitle="Basic information about your event">
          <Field label="Event type" error={errors.event_type?.message}>
            <div className="flex gap-2">
              {EVENT_TYPE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleEventTypeChange(value)}
                  className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    eventType === value
                      ? "border-brand bg-brand-50 text-brand shadow-xs"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Event name" error={errors.name?.message}>
            <input type="text" className={inputCls} placeholder="My Awesome Event" {...register("name")} />
          </Field>
          <Field
            label="Description"
            error={errors.description?.message}
            hint="Spaces, bullet points, and paragraph breaks are preserved on your public registration page."
          >
            <textarea
              rows={6}
              className={`${inputCls} min-h-[140px] sm:min-h-[180px] resize-y leading-relaxed font-sans`}
              placeholder="What's this event about? Describe key attractions, schedules, eligibility, guidelines..."
              {...register("description")}
            />
          </Field>
          {eventType !== "online" && (
            <Field label="Venue" error={errors.venue?.message}>
              <input type="text" className={inputCls} placeholder="Venue name or address" {...register("venue")} />
            </Field>
          )}

          {/* Meeting details for online / hybrid right inside Event details */}
          {(eventType === "online" || eventType === "hybrid") && (
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-4">
              <Field label="Meeting platform" error={errors.meeting_platform?.message}>
                <div className="flex gap-2 flex-wrap">
                  {PLATFORM_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("meeting_platform", value, { shouldDirty: true, shouldValidate: true })}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        watch("meeting_platform") === value
                          ? "border-brand bg-brand-50 text-brand shadow-xs"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label="Meeting URL"
                error={errors.meeting_url?.message}
                hint="Attendees will be redirected here when they click 'Join Event' on their pass."
              >
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xyz-abcd-efg or https://zoom.us/j/..."
                    className={`${inputCls} pl-9`}
                    {...register("meeting_url")}
                  />
                </div>
              </Field>
            </div>
          )}
        </SectionCard>

        {/* ── Event URL & SEO Slug ── */}
        <SectionCard
          icon={Globe}
          title="Event URL & SEO Slug"
          subtitle="Clean, professional URL for search engine optimization and sharing"
        >
          <div className="flex flex-col gap-4">
            {/* Live URL Link Banner */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Public Event Link
                </span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-900 font-mono font-semibold truncate">
                  <span className="text-neutral-400">https://urpass.space/events/</span>
                  <span className="text-brand font-bold truncate">{slugValue || event.apply_slug || eventId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySlugUrl}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`/events/${slugValue || event.apply_slug || eventId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Open live public event page"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Preview</span>
                </a>
              </div>
            </div>

            {/* Editable Slug Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Customize URL Slug
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono text-neutral-400 pointer-events-none select-none">
                    /events/
                  </span>
                  <input
                    type="text"
                    value={slugValue}
                    onChange={(e) => {
                      setSlugValue(slugify(e.target.value));
                      setSlugError("");
                      setSlugSuccess(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveSlug();
                      }
                    }}
                    placeholder="pilani-grand-garba-night-2026"
                    className={`${inputCls} pl-[68px] font-mono text-xs`}
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Auto-generate clean slug from current event name"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                    <span>From Name</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSlug}
                    disabled={slugSaving || !slugValue.trim() || slugValue === event.apply_slug}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {slugSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save URL</span>
                  </button>
                </div>
              </div>

              {slugError && (
                <div className="flex items-start gap-1.5 text-xs text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{slugError}</span>
                </div>
              )}

              {slugSuccess && (
                <div className="flex items-start gap-1.5 text-xs text-emerald-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Event URL updated successfully! Public link is live.</span>
                </div>
              )}

              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                By default, URPASS automatically generates this SEO-friendly URL from your event name. You can customize it anytime.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Event & Pass Branding ── */}
        <SectionCard
          icon={Palette}
          title="Event & Pass Branding"
          subtitle="Customize event brand palette, logo, and white-label pass appearance"
        >
          <div className="flex flex-col gap-5">
            {/* White-Label / Hide URPASS Branding Toggle */}
            <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-900">White-Label Passes (Remove URPASS Watermark)</p>
                  {canRemoveBranding ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Pro Unlocked
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Pro Feature
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  When enabled, &ldquo;Powered by URPASS&rdquo; watermarks, logos, and badges are completely hidden from all attendee passes and public registration pages.
                </p>
                {hideBranding && canRemoveBranding && (
                  <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    White-label active — attendees see 100% clean event branding
                  </p>
                )}
              </div>
              <Toggle
                checked={hideBranding}
                onChange={() => {
                  setHideBranding(!hideBranding);
                  setValue("hide_branding", !hideBranding, { shouldDirty: true });
                }}
                disabled={!canRemoveBranding}
              />
            </div>

            {/* If Free tier: Pro Trial Upgrade Callout */}
            {!canRemoveBranding && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-900 via-purple-900 to-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-200" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Start 30-Day Pro Free Trial (£0 / ₹0)</h3>
                    <p className="text-[11px] text-purple-200/80 mt-0.5">
                      Unlock custom brand colors, logo upload, watermark removal, and full Ticket Studio.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTrialModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  Start Pro Trial
                </button>
              </div>
            )}

            {/* Event Brand Color */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-neutral-400" />
                Event Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-11 h-10 rounded-xl border border-neutral-200 cursor-pointer p-1 bg-white disabled:opacity-50"
                  value={brandColor}
                  onChange={(e) => {
                    setBrandColor(e.target.value);
                    setValue("event_brand_color", e.target.value, { shouldDirty: true });
                  }}
                  disabled={!isPro}
                />
                <input
                  type="text"
                  className={`${inputCls} font-mono uppercase w-36`}
                  value={brandColor}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                      setBrandColor(val);
                      setValue("event_brand_color", val, { shouldDirty: true });
                    }
                  }}
                  maxLength={7}
                  disabled={!isPro}
                />
              </div>

              {/* Preset Swatches */}
              {isPro && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-neutral-400 font-medium mr-1">Presets:</span>
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => {
                        setBrandColor(preset.hex);
                        setValue("event_brand_color", preset.hex, { shouldDirty: true });
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        brandColor.toLowerCase() === preset.hex.toLowerCase()
                          ? "border-neutral-900 bg-neutral-100 font-bold text-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ background: preset.hex }}
                      />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-neutral-400">
                Applied to registration headers, pass badges, buttons, and QR pass backgrounds.
              </p>
            </div>

            {/* Event Logo */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                Event Logo / Header Badge
                <span className="text-neutral-400 font-normal lowercase">(optional)</span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  className={inputCls}
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setValue("event_logo_url", e.target.value, { shouldDirty: true });
                  }}
                  disabled={!isPro || uploadingLogo}
                />

                {isPro && (
                  <label className="shrink-0 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
                    {uploadingLogo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-neutral-500" />
                    )}
                    <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {logoUploadError && (
                <p className="text-xs text-red-500">{logoUploadError}</p>
              )}

              {logoUrl && (
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="w-8 h-8 rounded-lg object-contain bg-white border border-neutral-200 p-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-800 truncate">Logo active</p>
                    <p className="text-[10px] text-neutral-400 truncate">{logoUrl}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrl("");
                      setValue("event_logo_url", "", { shouldDirty: true });
                    }}
                    className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Quick Links to Ticket Studio & Org Branding */}
            <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/studio/${eventId}`}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 group-hover:text-purple-700 transition-colors">
                      Ticket Studio
                    </p>
                    <p className="text-[11px] text-neutral-400">Design 3D glassmorphic passes</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              </Link>

              <Link
                href="/dashboard/branding"
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors">
                      Organization Branding
                    </p>
                    <p className="text-[11px] text-neutral-400">Set account-wide brand defaults</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              </Link>
            </div>
          </div>
        </SectionCard>

        {/* ── Event Photos & Gallery ── */}
        <SectionCard
          icon={ImageIcon}
          title="Event Photos & Gallery"
          subtitle="Showcase venue photos, posters, and past highlights in a mobile swipeable carousel"
        >
          <div className="flex flex-col gap-4">
            <EventImageUploader
              images={eventImages}
              onChange={handleImagesChange}
              maxImages={4}
            />
            {imagesSaving && (
              <p className="text-xs text-brand font-medium flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving photos…
              </p>
            )}
            {eventImages.length > 0 && (
              <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Public Registration Live Preview (Horizontal Swipe Carousel)
                </span>
                <EventImageCarousel images={eventImages} eventName={watch("name") || "Event"} />
              </div>
            )}
          </div>
        </SectionCard>


        {/* ── Date & time ── */}
        <SectionCard icon={CalendarDays} title="Date & time" subtitle="Schedule and event duration">
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
              hint={isOvernight ? "✨ Event continues past midnight into the next day" : undefined}
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
        </SectionCard>

        {/* ── Capacity & settings ── */}
        <SectionCard icon={Users} title="Capacity & registrations" subtitle="Control who can attend and how">
          <Field label="Attendee limit" error={errors.attendee_limit?.message} hint="Maximum number of approved attendees">
            <input type="number" min={1} className={inputCls} {...register("attendee_limit", { valueAsNumber: true })} />
          </Field>
          <div className="h-px bg-neutral-50" />
          <ToggleRow
            label="Public application form"
            description="Let anyone apply via a public link"
            checked={!!applicationEnabled}
            onChange={() => setValue("application_enabled", !applicationEnabled, { shouldDirty: true })}
          />
          {applicationEnabled && (
            <ToggleRow
              label="Auto-approve"
              description="Instantly approve and generate passes on submission"
              checked={!!autoApprove}
              onChange={() => setValue("auto_approve", !autoApprove, { shouldDirty: true })}
              indent
            />
          )}
        </SectionCard>

        {/* ── Custom registration questions ── */}
        <CustomFieldsBuilder
          eventId={eventId}
          initialFields={event?.custom_fields ?? []}
          maxFields={customFieldsLimit.max}
          isUnlimited={customFieldsLimit.isUnlimited}
        />

        {/* ── Ticket payment / types ── */}
        {ticketTypes.length > 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-50">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-neutral-900 leading-none">Ticket types</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {ticketTypes.length} type{ticketTypes.length !== 1 ? "s" : ""} configured — pricing managed per type
                </p>
              </div>
              <Link
                href={`/event/${eventId}/tickets`}
                className="text-xs font-semibold text-brand hover:underline underline-offset-2 shrink-0"
              >
                Manage →
              </Link>
            </div>
            <div className="px-6 py-4 flex flex-col gap-0">
              {ticketTypes.map((tt, idx) => (
                <div
                  key={tt.id}
                  className={`flex items-center justify-between gap-4 py-3.5 ${
                    idx < ticketTypes.length - 1 ? "border-b border-neutral-50" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">{tt.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                      {tt.status === "closed" && (
                        <span className="ml-1.5 text-red-500">· Closed</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`text-[11px] font-semibold ${
                      tt.status === "on_sale" ? "text-green-600" : "text-neutral-400"
                    }`}>
                      {tt.status === "on_sale" ? "On" : "Off"}
                    </span>
                    <Toggle
                      checked={tt.status === "on_sale"}
                      onChange={() => handleTicketTypeToggle(tt.id, tt.status)}
                      disabled={tt.status === "closed"}
                    />
                  </div>
                </div>
              ))}
              {hasPaymentGateway === false && ticketTypes.some((t) => t.price > 0) && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mt-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">Payment gateway not connected</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Attendees can&apos;t pay until you connect Razorpay.{" "}
                      <a href="/dashboard/settings" className="font-bold underline">Connect now →</a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <SectionCard icon={CreditCard} title="Ticket payment" subtitle="Charge attendees via Razorpay">
            {isPaidEvent && hasPaymentGateway === false && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">Payment gateway not connected</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Attendees can&apos;t pay until you connect Razorpay.{" "}
                    <a href="/dashboard/settings" className="font-bold underline">Connect now →</a>
                  </p>
                </div>
              </div>
            )}
            <ToggleRow
              label="Paid event"
              description="Require attendees to pay before registering"
              checked={!!isPaidEvent}
              onChange={() => setValue("is_paid_event", !isPaidEvent, { shouldDirty: true })}
            />
            {isPaidEvent && (
              <Field label="Ticket price (₹)" error={errors.ticket_price?.message} hint="Amount in rupees">
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="number" min={1} max={100000}
                    className={`${inputCls} pl-9`}
                    {...register("ticket_price", { valueAsNumber: true })}
                  />
                </div>
              </Field>
            )}
            {/* No ticket types yet — offer to create the default one */}
            <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <div className="min-w-0 mr-3">
                <p className="text-xs font-semibold text-amber-800">No ticket types configured</p>
                <p className="text-xs text-amber-700 mt-0.5">Ticket selector won&apos;t appear on the apply page until you add one.</p>
              </div>
              <button
                type="button"
                disabled={creatingDefault}
                onClick={async () => {
                  setCreatingDefault(true);
                  const res = await createDefaultTicketType(eventId);
                  if (!res?.error) {
                    const supabase = createClient();
                    const { data: ttRows } = await supabase
                      .from("ticket_types")
                      .select("id, name, price, status")
                      .eq("event_id", eventId)
                      .order("position", { ascending: true });
                    setTicketTypes(ttRows ?? []);
                  }
                  setCreatingDefault(false);
                }}
                className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors px-3 py-1.5 rounded-lg disabled:opacity-50"
              >
                {creatingDefault && <Loader2 className="w-3 h-3 animate-spin" />}
                Add default
              </button>
            </div>
            <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-neutral-700">Need multiple ticket tiers?</p>
                <p className="text-xs text-neutral-400 mt-0.5">VIP, Early Bird, Student, and more</p>
              </div>
              <Link
                href={`/event/${eventId}/tickets`}
                className="text-xs font-semibold text-brand hover:underline underline-offset-2 shrink-0"
              >
                Set up ticket types →
              </Link>
            </div>
          </SectionCard>
        )}

        {/* Alerts */}
        {saveError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{saveError}</p>
          </div>
        )}
        {saveSuccess && (
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            <p className="text-sm text-green-700 font-medium">Changes saved successfully.</p>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#6D28D9" }}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      {/* ── Event status ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden mt-5"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-50">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-neutral-900 leading-none">Event status</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Control whether your event is public</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>
        <div className="px-6 py-5 flex flex-wrap gap-2">
          {event.status === "draft" && (
            <button onClick={() => handleStatusChange("active")} disabled={statusLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#6D28D9" }}>
              {statusLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Publish event
            </button>
          )}
          {event.status === "active" && (
            <>
              <button onClick={() => handleStatusChange("completed")} disabled={statusLoading}
                className="flex items-center gap-2 border border-neutral-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50">
                Mark as completed
              </button>
              <button onClick={() => handleStatusChange("cancelled")} disabled={statusLoading}
                className="flex items-center gap-2 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                Cancel event
              </button>
            </>
          )}
          {(event.status === "completed" || event.status === "cancelled") && (
            <button onClick={() => handleStatusChange("draft")} disabled={statusLoading}
              className="flex items-center gap-2 border border-neutral-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50">
              Revert to draft
            </button>
          )}
        </div>
      </div>



      {/* ── Danger zone ── */}
      <div className="mt-5 rounded-2xl border border-red-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-50 bg-red-50/40">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-700 leading-none">Danger zone</h2>
            <p className="text-xs text-red-400 mt-0.5">Irreversible actions</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs text-neutral-500 mb-4">
            Deleting this event is permanent — all attendees, passes, and check-in records will be removed.
          </p>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 border border-red-200 text-red-600 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
              Delete event
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-start gap-2.5 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-700">Are you absolutely sure? This cannot be undone.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDelete} disabled={deleteLoading}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                  {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Yes, delete permanently
                </button>
                <button onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 30-Day Free Trial Modal */}
      <TrialConfirmationModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        planSlug="pro"
        planName="Pro"
        userEmail={userEmail}
        userName={userName}
      />
    </div>
  );
}
