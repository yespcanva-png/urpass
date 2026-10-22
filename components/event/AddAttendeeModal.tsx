"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { manualAttendeeSchema, type ManualAttendeeInput, PASS_TYPES } from "@/lib/validations/attendee";
import { addAttendee } from "@/app/actions/attendees";

const inputCls =
  "border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors w-full bg-white placeholder:text-slate-400 text-slate-900";

interface Props {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAttendeeModal({ eventId, onClose, onSuccess }: Props) {
  const [serverError, setServerError] = useState("");
  const [mounted, setMounted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ManualAttendeeInput>({
    resolver: zodResolver(manualAttendeeSchema),
    defaultValues: { email: "", pass_type: "participant" },
  });

  useEffect(() => {
    setMounted(true);
    firstInputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function onSubmit(data: ManualAttendeeInput) {
    setServerError("");
    try {
      const result = await addAttendee(eventId, data);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to add attendee");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Add attendee</h2>
            <p className="text-xs text-slate-500">Add an individual registration manually.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Full name</label>
            <input
              type="text"
              placeholder="Attendee name"
              className={inputCls}
              {...register("name")}
              ref={(el) => {
                register("name").ref(el);
                (firstInputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
              }}
            />
            {errors.name && <p className="text-xs text-rose-600 font-medium">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Email <span className="text-slate-400 font-normal">(optional)</span></label>
            <input
              type="email"
              placeholder="attendee@example.com"
              className={inputCls}
              {...register("email")}
            />
            <p className="text-xs text-slate-500">Leave blank to generate an address using the phone number, or an assigned number, at event.urpass.space.</p>
            {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className={inputCls}
              {...register("phone")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Pass type</label>
            <select className={inputCls} {...register("pass_type")}>
              {PASS_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            {errors.pass_type && <p className="text-xs text-rose-600 font-medium">{errors.pass_type.message}</p>}
          </div>

          {serverError && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200/80 rounded-md px-3 py-2 font-medium">
              {serverError}
            </p>
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 bg-white rounded-md py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white rounded-md py-2 text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSubmitting ? "Adding…" : "Add attendee"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
