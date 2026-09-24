"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
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
} from "lucide-react";
import { ticketTypeSchema, type TicketTypeInput } from "@/lib/validations/ticket-type";
import { createTicketType, updateTicketType, deleteTicketType } from "@/app/actions/ticket-types";
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

export default function TicketTypeForm({ eventId, initialData, ticketTypeId }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isFree, setIsFree] = useState(
    initialData ? initialData.price === 0 : true
  );
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
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
            ? initialData.sales_start.slice(0, 16)
            : undefined,
          sales_end: initialData.sales_end
            ? initialData.sales_end.slice(0, 16)
            : undefined,
          max_per_person: initialData.max_per_person,
          status: initialData.status as TicketStatus,
        }
      : {
          name: "",
          description: "",
          category: "general",
          price: 0,
          max_per_person: 1,
          status: "on_sale",
        },
  });

  const selectedCategory = watch("category");
  const selectedStatus = watch("status");

  async function onSubmit(data: TicketTypeInput) {
    setServerError("");
    const payload = { ...data, price: isFree ? 0 : data.price };

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

  return (
    <div className="max-w-2xl mx-auto page-in">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-neutral-900">
          {ticketTypeId ? "Edit ticket type" : "New ticket type"}
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure pricing, capacity, and access for this ticket tier
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* ── 1. Basic info ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className={labelCls}>Basic info</p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600">Name</label>
            <input
              type="text"
              placeholder="e.g. General Admission"
              className={inputCls}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600">
              Description{" "}
              <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="What's included with this ticket?"
              className={`${inputCls} resize-none`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Category selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-neutral-600">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(({ value, label, Icon, cls }) => {
                    const active = field.value === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all text-xs font-semibold ${
                          active
                            ? `${cls} bg-white shadow-sm`
                            : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>

        {/* ── 2. Pricing ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className={labelCls}>Pricing</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFree(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                isFree
                  ? "border-brand bg-brand-50 text-brand"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => setIsFree(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                !isFree
                  ? "border-brand bg-brand-50 text-brand"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
              }`}
            >
              Paid
            </button>
          </div>

          {!isFree && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">
                Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-400">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="0"
                  className={`${inputCls} pl-8`}
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>
          )}
        </div>

        {/* ── 3. Capacity & limits ──────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className={labelCls}>Capacity & limits</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">
                Capacity{" "}
                <span className="text-neutral-400 font-normal">(blank = unlimited)</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 100"
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
              <label className="text-xs font-medium text-neutral-600">
                Max per person
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

        {/* ── 4. Sales window ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className={labelCls}>Sales window</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">
                Sales start{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                className={inputCls}
                {...register("sales_start")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">
                Sales end{" "}
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

        {/* ── 5. Status ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
          <p className={labelCls}>Status</p>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-3">
                {STATUSES.map(({ value, label, desc, cls }) => {
                  const active = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex flex-col gap-0.5 p-3 rounded-xl border text-left transition-all ${
                        active
                          ? `${cls} bg-white shadow-sm`
                          : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                      }`}
                    >
                      <span className="text-xs font-bold">{label}</span>
                      <span className="text-[11px] leading-tight">{desc}</span>
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
        <div className="flex items-center gap-3 pb-8">
          {ticketTypeId && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2 mr-auto">
                  <span className="text-xs text-red-600 font-medium">Delete this ticket type?</span>
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
            className="flex items-center gap-2 bg-brand text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {ticketTypeId ? "Save changes" : "Create ticket type"}
          </button>
        </div>
      </form>

      {/* Suppress unused variable lint warnings */}
      <span className="hidden">{selectedCategory}{selectedStatus}</span>
    </div>
  );
}
