"use client";

import { useState, useTransition, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Crown,
  GraduationCap,
  Clock,
  Layers,
  Shield,
  Mic,
  Tag,
  Loader2,
  AlertCircle,
  Trash2,
  Users,
  Plus,
  Baby,
  Calculator,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  ticketTypeSchema,
  type TicketTypeInput,
  type AgeTierPricing,
  AGE_TIER_PRESETS,
} from "@/lib/validations/ticket-type";
import {
  createTicketType,
  updateTicketType,
  deleteTicketType,
} from "@/app/actions/ticket-types";
import type { TicketTypeWithStats } from "@/app/actions/ticket-types";

interface Props {
  eventId: string;
  initialData?: TicketTypeWithStats;
  ticketTypeId?: string;
}

const inputCls =
  "bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white transition-all w-full placeholder:text-neutral-400";

const labelCls = "text-[10px] font-bold tracking-widest uppercase text-neutral-400";

type Category = TicketTypeInput["category"];

const CATEGORIES: {
  value: Category;
  label: string;
  Icon: React.ElementType;
  cls: string;
}[] = [
  { value: "general",    label: "General",    Icon: Ticket,        cls: "border-neutral-200 text-neutral-600" },
  { value: "vip",        label: "VIP",        Icon: Crown,         cls: "border-amber-200 text-amber-700" },
  { value: "student",    label: "Student",    Icon: GraduationCap, cls: "border-blue-200 text-blue-700" },
  { value: "early_bird", label: "Early Bird", Icon: Clock,         cls: "border-green-200 text-green-700" },
  { value: "workshop",   label: "Workshop",   Icon: Layers,        cls: "border-purple-200 text-purple-700" },
  { value: "staff",      label: "Staff",      Icon: Shield,        cls: "border-slate-200 text-slate-700" },
  { value: "speaker",    label: "Speaker",    Icon: Mic,           cls: "border-rose-200 text-rose-700" },
  { value: "custom",     label: "Custom",     Icon: Tag,           cls: "border-neutral-200 text-neutral-600" },
];

type TicketStatus = "draft" | "on_sale" | "closed";

const STATUSES: { value: TicketStatus; label: string; desc: string; cls: string }[] = [
  { value: "draft",   label: "Draft",   desc: "Not visible to applicants", cls: "border-neutral-200 text-neutral-600" },
  { value: "on_sale", label: "On Sale", desc: "Open for registration",     cls: "border-green-200 text-green-700" },
  { value: "closed",  label: "Closed",  desc: "No longer accepting",       cls: "border-red-200 text-red-600" },
];

function toLocalInputString(isoString?: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toISOStringOrNull(val?: string | null): string | null {
  if (!val || typeof val !== "string" || !val.trim()) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default function TicketTypeForm({ eventId, initialData, ticketTypeId }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isFree, setIsFree] = useState(
    initialData ? initialData.price === 0 && !initialData.age_pricing_enabled : true
  );
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Simulation test state for live corporate preview
  const [simAgeTierIndex, setSimAgeTierIndex] = useState(0);
  const [simExtraMembers, setSimExtraMembers] = useState(0);

  const initialAgeTiers: AgeTierPricing[] = useMemo(() => {
    if (initialData?.age_tiers && Array.isArray(initialData.age_tiers) && initialData.age_tiers.length > 0) {
      return initialData.age_tiers.map((t) => ({
        id: t.id || `tier-${Math.random().toString(36).substring(2, 7)}`,
        label: t.label,
        min_age: t.min_age ?? null,
        max_age: t.max_age ?? null,
        price: Number(t.price || 0) / 100, // paise → rupees for editing
        description: t.description ?? "",
        is_free: Boolean(t.is_free || t.price === 0),
        badge_label: t.badge_label ?? t.label.split(" ")[0].toUpperCase(),
      }));
    }
    return [
      { id: "adult", label: "Adult (18–59 yrs)", min_age: 18, max_age: 59, price: 499, is_free: false, badge_label: "ADULT" },
      { id: "child", label: "Child (5–12 yrs)", min_age: 5, max_age: 12, price: 199, is_free: false, badge_label: "CHILD" },
      { id: "senior", label: "Senior (60+ yrs)", min_age: 60, max_age: null, price: 299, is_free: false, badge_label: "SENIOR" },
      { id: "infant", label: "Infant (<5 yrs)", min_age: 0, max_age: 4, price: 0, is_free: true, badge_label: "FREE" },
    ];
  }, [initialData]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<TicketTypeInput, any, TicketTypeInput>({
    resolver: zodResolver(ticketTypeSchema) as never,
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? "",
          category: initialData.category as Category,
          price: initialData.price / 100, // paise → rupees for display
          capacity: initialData.capacity ?? undefined,
          sales_start: initialData.sales_start
            ? toLocalInputString(initialData.sales_start)
            : undefined,
          sales_end: initialData.sales_end
            ? toLocalInputString(initialData.sales_end)
            : undefined,
          max_per_person: initialData.max_per_person,
          status: initialData.status as TicketStatus,
          age_pricing_enabled: Boolean(initialData.age_pricing_enabled),
          age_tiers: initialAgeTiers,
          is_group_pass: Boolean(initialData.is_group_pass),
          included_guests: initialData.included_guests ?? 1,
          min_guests: initialData.min_guests ?? 1,
          max_guests: initialData.max_guests ?? 1,
          allow_extra_guests: Boolean(initialData.allow_extra_guests),
          extra_guest_price: initialData.extra_guest_price ?? 0,
          max_extra_guests: initialData.max_extra_guests ?? 0,
          extra_member_pricing_mode: initialData.extra_member_pricing_mode || "flat",
          duration_label: initialData.duration_label ?? "1 Day",
          duration_days: initialData.duration_days ?? 1,
        }
      : {
          name: "",
          description: "",
          category: "general",
          price: 0,
          max_per_person: 1,
          status: "on_sale",
          age_pricing_enabled: false,
          age_tiers: initialAgeTiers,
          is_group_pass: false,
          included_guests: 1,
          min_guests: 1,
          max_guests: 1,
          allow_extra_guests: false,
          extra_guest_price: 0,
          max_extra_guests: 4,
          extra_member_pricing_mode: "flat",
          duration_label: "1 Day",
          duration_days: 1,
        },
  });

  const { fields: ageTierFields, append: appendAgeTier, remove: removeAgeTier, replace: replaceAgeTiers } =
    useFieldArray({
      control,
      name: "age_tiers",
    });

  const agePricingEnabled = watch("age_pricing_enabled");
  const allowExtraGuests = watch("allow_extra_guests");
  const watchedBasePrice = watch("price") || 0;
  const watchedExtraPrice = watch("extra_guest_price") || 0;
  const watchedAgeTiers = watch("age_tiers") || [];
  const watchedIncludedGuests = watch("included_guests") || 1;
  const watchedExtraPricingMode = watch("extra_member_pricing_mode") || "flat";

  function applyPreset(presetId: string) {
    const preset = AGE_TIER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const base = isFree ? 0 : watchedBasePrice || 500;
    const populated = preset.tiers.map((t) => {
      let price = base;
      if (t.is_free) price = 0;
      else if (t.id === "child" || t.id === "kid") price = Math.round(base * 0.5);
      else if (t.id === "senior") price = Math.round(base * 0.7);
      else if (t.id === "teen") price = Math.round(base * 0.8);
      else if (t.id === "student" || t.id === "school") price = Math.round(base * 0.6);
      return { ...t, price };
    });
    replaceAgeTiers(populated);
  }

  async function onSubmit(data: TicketTypeInput) {
    setServerError("");
    const sanitizedSalesStart = toISOStringOrNull(data.sales_start);
    const sanitizedSalesEnd = toISOStringOrNull(data.sales_end);

    if (sanitizedSalesStart && sanitizedSalesEnd) {
      if (new Date(sanitizedSalesEnd).getTime() <= new Date(sanitizedSalesStart).getTime()) {
        setServerError("Sales end date must be after sales start date.");
        return;
      }
    }

    const payload: TicketTypeInput = {
      ...data,
      price: isFree && !data.age_pricing_enabled ? 0 : data.price,
      sales_start: sanitizedSalesStart,
      sales_end: sanitizedSalesEnd,
      is_group_pass: Boolean(data.allow_extra_guests || (data.included_guests && data.included_guests > 1)),
    };

    startTransition(async () => {
      try {
        let result: { error?: string; id?: string } | { error?: string };
        if (ticketTypeId) {
          result = await updateTicketType(ticketTypeId, payload);
        } else {
          result = await createTicketType(eventId, payload);
        }

        if (result?.error) {
          setServerError(result.error);
          return;
        }
        router.push(`/event/${eventId}/tickets`);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Failed to save ticket tier");
      }
    });
  }

  async function handleDelete() {
    if (!ticketTypeId) return;
    setIsDeleting(true);
    startTransition(async () => {
      try {
        const result = await deleteTicketType(ticketTypeId);
        if (result?.error) {
          setServerError(result.error);
          setIsDeleting(false);
          return;
        }
        router.push(`/event/${eventId}/tickets`);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Failed to delete ticket tier");
        setIsDeleting(false);
      }
    });
  }

  const busy = isSubmitting || isPending;

  // Compute live simulated price
  const simulatedPrimaryPrice = useMemo(() => {
    if (agePricingEnabled && watchedAgeTiers.length > 0) {
      const selected = watchedAgeTiers[simAgeTierIndex] || watchedAgeTiers[0];
      return selected?.is_free ? 0 : Number(selected?.price || 0);
    }
    return isFree ? 0 : watchedBasePrice;
  }, [agePricingEnabled, watchedAgeTiers, simAgeTierIndex, isFree, watchedBasePrice]);

  const simulatedExtraMembersTotal = useMemo(() => {
    if (!allowExtraGuests || simExtraMembers <= 0) return 0;
    if (watchedExtraPricingMode === "flat") {
      return simExtraMembers * Number(watchedExtraPrice || 0);
    }
    // Age-based simulation assumes default adult price for extra members
    return simExtraMembers * simulatedPrimaryPrice;
  }, [allowExtraGuests, simExtraMembers, watchedExtraPricingMode, watchedExtraPrice, simulatedPrimaryPrice]);

  const simulatedTotalPayable = simulatedPrimaryPrice + simulatedExtraMembersTotal;

  return (
    <div className="max-w-3xl mx-auto page-in pb-12">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            Tier Designer
          </span>
          {agePricingEnabled && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              Age Pricing Active
            </span>
          )}
          {allowExtraGuests && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Extra Members Enabled
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-neutral-900">
          {ticketTypeId ? "Edit ticket tier" : "New corporate ticket tier"}
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure multi-age brackets, extra accompanying member rules, capacity limits, and pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* ── 1. Basic Info ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100 flex flex-col gap-4">
          <p className={labelCls}>Tier Identity & Classification</p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">Tier Name</label>
            <input
              type="text"
              placeholder="e.g. VIP All-Access Pass, Delegate Registration, Family Pass"
              className={inputCls}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Description{" "}
              <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Specify inclusions, delegate badge access, meal vouchers, workshop tracks..."
              className={`${inputCls} resize-none`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Category selector */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-semibold text-neutral-700">Category Tag</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(({ value, label, Icon, cls }) => {
                    const active = field.value === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-left transition-all text-xs font-semibold ${
                          active
                            ? `${cls} bg-white shadow-2xs ring-1 ring-neutral-300 font-bold`
                            : "border-neutral-200/80 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50/60"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>

        {/* ── 2. Standard Pricing vs Age-Wise Pricing ─────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <p className={labelCls}>Pricing Structure</p>
              <h3 className="text-sm font-bold text-neutral-900 mt-0.5">Tier Admission & Rates</h3>
            </div>
            
            {/* Free vs Paid Toggle */}
            <div className="inline-flex rounded-xl p-1 bg-neutral-100/90 border border-neutral-200/60">
              <button
                type="button"
                onClick={() => {
                  setIsFree(true);
                  setValue("price", 0);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isFree && !agePricingEnabled
                    ? "bg-white text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFree(false);
                  if (watchedBasePrice === 0) setValue("price", 499);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  !isFree || agePricingEnabled
                    ? "bg-white text-neutral-900 shadow-2xs font-bold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Paid
              </button>
            </div>
          </div>

          {/* Flat Standard Price Input (if age-pricing disabled) */}
          {!agePricingEnabled && !isFree && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-150">
              <label className="text-xs font-semibold text-neutral-700">
                Standard Price per Attendee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="499"
                  className={`${inputCls} pl-8 font-semibold`}
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>
          )}

          {/* ── Age-Wise Pricing Switcher ── */}
          <div className="pt-3 border-t border-neutral-100">
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100/80">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Baby className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-neutral-900">Age-Wise Pricing System</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                      Multi-Bracket
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Define distinct prices and free entry rules based on attendee age (e.g. Adult, Child, Senior, Infant).
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("age_pricing_enabled")}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            {/* Age Brackets Manager */}
            {agePricingEnabled && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Presets Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand" />
                    Load Preset:
                  </span>
                  {AGE_TIER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-neutral-200 hover:border-brand hover:text-brand transition-all shadow-2xs"
                    >
                      {preset.name.split(" (")[0]}
                    </button>
                  ))}
                </div>

                {/* Age Tiers List */}
                <div className="space-y-2.5">
                  {ageTierFields.map((field, index) => {
                    const isTierFree = watch(`age_tiers.${index}.is_free`);
                    return (
                      <div
                        key={field.id}
                        className="p-4 rounded-xl border border-neutral-200/90 bg-white hover:border-neutral-300 transition-all shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 font-bold text-[10px] flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-xs font-bold text-neutral-800">
                              Age Bracket #{index + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                className="rounded border-neutral-300 text-brand focus:ring-brand"
                                {...register(`age_tiers.${index}.is_free`)}
                              />
                              <span className="text-xs font-semibold text-emerald-700">Free Admission</span>
                            </label>

                            {ageTierFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeAgeTier(index)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          {/* Label */}
                          <div className="sm:col-span-4 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Bracket Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Adult (18–59 yrs)"
                              className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-medium w-full"
                              {...register(`age_tiers.${index}.label`)}
                            />
                          </div>

                          {/* Min Age */}
                          <div className="sm:col-span-2 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Min Age</label>
                            <input
                              type="number"
                              min={0}
                              max={120}
                              placeholder="18"
                              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs font-medium w-full text-center"
                              {...register(`age_tiers.${index}.min_age`, {
                                setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                              })}
                            />
                          </div>

                          {/* Max Age */}
                          <div className="sm:col-span-2 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Max Age</label>
                            <input
                              type="number"
                              min={0}
                              max={120}
                              placeholder="59"
                              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs font-medium w-full text-center"
                              {...register(`age_tiers.${index}.max_age`, {
                                setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                              })}
                            />
                          </div>

                          {/* Price */}
                          <div className="sm:col-span-2 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Price (₹)</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                                ₹
                              </span>
                              <input
                                type="number"
                                min={0}
                                disabled={isTierFree}
                                placeholder="499"
                                className={`bg-neutral-50 border border-neutral-200 rounded-lg pl-6 pr-2 py-2 text-xs font-bold w-full ${
                                  isTierFree ? "opacity-40 bg-neutral-100" : ""
                                }`}
                                {...register(`age_tiers.${index}.price`, { valueAsNumber: true })}
                              />
                            </div>
                          </div>

                          {/* Badge Label */}
                          <div className="sm:col-span-2 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Pass Badge</label>
                            <input
                              type="text"
                              placeholder="ADULT"
                              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs font-bold uppercase w-full"
                              {...register(`age_tiers.${index}.badge_label`)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    appendAgeTier({
                      id: `tier-${Math.random().toString(36).substring(2, 7)}`,
                      label: "New Bracket",
                      min_age: null,
                      max_age: null,
                      price: 299,
                      is_free: false,
                      badge_label: "ATTENDEE",
                    })
                  }
                  className="w-full py-2.5 rounded-xl border border-dashed border-neutral-300 text-xs font-bold text-neutral-600 hover:border-brand hover:text-brand hover:bg-brand-50/40 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Age Bracket</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Extra Accompanying Member Support ───────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className={labelCls}>Group & Accompanying Attendees</p>
                <h3 className="text-sm font-bold text-neutral-900 mt-0.5">Extra Member Support</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Allow registrants to add accompanying family members, partners, or team members under a single ticket.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register("allow_extra_guests")}
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {allowExtraGuests && (
            <div className="pt-4 border-t border-neutral-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Included Members in Base Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Included Members in Base Price
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className={inputCls}
                    {...register("included_guests", { valueAsNumber: true })}
                  />
                  <span className="text-[11px] text-neutral-400">e.g. 1 for Individual, 2 for Couple, 4 for Family</span>
                </div>

                {/* Extra Member Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Price per Extra Member (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="100"
                      className={`${inputCls} pl-8 font-semibold`}
                      {...register("extra_guest_price", { valueAsNumber: true })}
                    />
                  </div>
                  <span className="text-[11px] text-neutral-400">Additional fee per extra person</span>
                </div>

                {/* Max Extra Members Allowed */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Max Extra Members Allowed
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    placeholder="6"
                    className={inputCls}
                    {...register("max_extra_guests", { valueAsNumber: true })}
                  />
                  <span className="text-[11px] text-neutral-400">Cap on additional guests per booking</span>
                </div>
              </div>

              {/* Extra Member Pricing Mode */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-neutral-700">Extra Member Rate Calculation:</span>
                <Controller
                  name="extra_member_pricing_mode"
                  control={control}
                  render={({ field }) => (
                    <div className="inline-flex rounded-lg p-0.5 bg-white border border-neutral-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => field.onChange("flat")}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                          field.value === "flat"
                            ? "bg-emerald-50 text-emerald-800 font-bold"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        Flat Fee (₹{watchedExtraPrice}/person)
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("age_based")}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                          field.value === "age_based"
                            ? "bg-purple-50 text-purple-800 font-bold"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        Age-Bracket Rate
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── 4. Live Corporate Pricing Simulator ────────────────── */}
        <div className="bg-neutral-900 text-white rounded-2xl shadow-md p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-brand-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Live Pricing Simulation Preview
              </h4>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              Corporate Ledger Preview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
            {/* Interactive controls */}
            <div className="space-y-3">
              {agePricingEnabled && watchedAgeTiers.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Primary Attendee Age Tier:
                  </label>
                  <select
                    value={simAgeTierIndex}
                    onChange={(e) => setSimAgeTierIndex(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-brand"
                  >
                    {watchedAgeTiers.map((t, idx) => (
                      <option key={idx} value={idx}>
                        {t.label} — {t.is_free ? "Free" : `₹${t.price}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {allowExtraGuests && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Simulate Extra Members (+):
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSimExtraMembers(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          simExtraMembers === num
                            ? "bg-brand text-white border-brand"
                            : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                        }`}
                      >
                        +{num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Receipt calculation summary */}
            <div className="bg-neutral-950/60 rounded-xl p-3.5 border border-neutral-800 flex flex-col justify-between">
              <div className="space-y-1.5 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Primary Attendee:</span>
                  <span className="font-semibold text-white">
                    {simulatedPrimaryPrice === 0 ? "Free (£0 / ₹0)" : `₹${simulatedPrimaryPrice}`}
                  </span>
                </div>
                {allowExtraGuests && simExtraMembers > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>{simExtraMembers} Extra Member(s):</span>
                    <span>+₹{simulatedExtraMembersTotal}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200">Total Calculated:</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {simulatedTotalPayable === 0 ? "FREE" : `₹${simulatedTotalPayable}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Capacity & Limits ──────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100 flex flex-col gap-4">
          <p className={labelCls}>Capacity & Order Limits</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Capacity Limit{" "}
                <span className="text-neutral-400 font-normal">(blank = unlimited)</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 500"
                className={inputCls}
                {...register("capacity", {
                  setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                })}
              />
              {errors.capacity && (
                <p className="text-xs text-red-500">{errors.capacity.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Max Passes per Order
              </label>
              <input
                type="number"
                min={1}
                max={20}
                step={1}
                className={inputCls}
                {...register("max_per_person", { valueAsNumber: true })}
              />
              {errors.max_per_person && (
                <p className="text-xs text-red-500">{errors.max_per_person.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── 6. Sales Window ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100 flex flex-col gap-4">
          <p className={labelCls}>Sales Schedule Window</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Sales Start{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                className={inputCls}
                {...register("sales_start")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Sales End{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                className={inputCls}
                {...register("sales_end")}
              />
            </div>
          </div>
        </div>

        {/* ── 7. Status ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100 flex flex-col gap-3">
          <p className={labelCls}>Tier Status</p>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STATUSES.map(({ value, label, desc, cls }) => {
                  const active = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex flex-col gap-0.5 p-3.5 rounded-xl border text-left transition-all ${
                        active
                          ? `${cls} bg-white shadow-2xs ring-1 ring-neutral-300`
                          : "border-neutral-200/80 text-neutral-400 hover:border-neutral-300"
                      }`}
                    >
                      <span className="text-xs font-bold">{label}</span>
                      <span className="text-[11px] leading-tight text-neutral-500">{desc}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {serverError && (
          <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
            {serverError}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {ticketTypeId && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2 mr-auto">
                  <span className="text-xs text-red-600 font-medium">Delete this tier?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting || busy}
                    className="text-xs font-bold text-red-600 border border-red-200 rounded-xl px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs font-medium text-neutral-500 border border-neutral-200 rounded-xl px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mr-auto flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-100 rounded-xl px-3 py-2 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => router.push(`/event/${eventId}/tickets`)}
            className="ml-auto border border-neutral-200 rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 bg-brand text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 shadow-2xs"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {ticketTypeId ? "Save changes" : "Create ticket tier"}
          </button>
        </div>
      </form>
    </div>
  );
}
