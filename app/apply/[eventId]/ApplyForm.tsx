"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  MapPin,
  Loader2,
  CheckCircle,
  Mail,
  Ticket,
  User,
  Phone,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { attendeeSchema, type AttendeeInput } from "@/lib/validations/attendee";
import { submitApplication } from "@/app/actions/attendees";
import type { ApplyTicketType } from "./page";

interface EventInfo {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string;
  venue: string;
  auto_approve: boolean;
  is_paid_event: boolean;
  ticket_price: number;
}

interface Branding {
  showUrpassBranding: boolean;
  orgName: string | null;
  brandColor: string;
  orgLogoUrl: string | null;
}

type SuccessState = { type: "pending"; attendeeName: string };

const BG = "radial-gradient(ellipse 100% 50% at 50% -10%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)";

const inputCls =
  "bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white transition-all w-full placeholder:text-neutral-400";

function Wordmark({ branding }: { branding: Branding }) {
  if (!branding.showUrpassBranding && !branding.orgName) return null;
  return (
    <div className="flex items-center gap-1.5 mb-8 apply-in-1">
      {branding.orgLogoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={branding.orgLogoUrl} alt="logo" className="w-5 h-5 rounded object-cover" />
      ) : (
        <Ticket className="w-4 h-4" style={{ color: branding.brandColor }} />
      )}
      <span className="text-sm font-bold tracking-widest uppercase text-neutral-900">
        {branding.orgName ?? "URPASS"}
      </span>
    </div>
  );
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ApplyForm({
  event,
  branding,
  staffScanLink,
  ticketTypes = [],
  hasPaymentGateway = true,
}: {
  event: EventInfo;
  branding: Branding;
  staffScanLink?: string | null;
  ticketTypes?: ApplyTicketType[];
  hasPaymentGateway?: boolean;
}) {
  const router = useRouter();
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [serverError, setServerError] = useState("");
  const [paymentPending, setPaymentPending] = useState(false);
  // Pre-select: prefer first available free ticket when no payment gateway, otherwise first available
  const available = ticketTypes.filter((t) => t.remaining == null || t.remaining > 0);
  const defaultTicketTypeId =
    (!hasPaymentGateway && available.some((t) => t.price === 0)
      ? available.find((t) => t.price === 0)
      : available[0]
    )?.id ?? null;
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(defaultTicketTypeId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AttendeeInput>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: { pass_type: "participant" },
  });

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketTypeId) ?? null;
  const effectiveTicketPrice = selectedTicket
    ? selectedTicket.price / 100
    : event.is_paid_event
      ? event.ticket_price
      : 0;
  const effectivelyPaid = selectedTicket ? selectedTicket.price > 0 : event.is_paid_event;
  const paymentBlocked = effectivelyPaid && !hasPaymentGateway;

  async function handlePaidSubmit(data: AttendeeInput) {
    setServerError("");
    setPaymentPending(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setServerError("Payment service unavailable. Please try again.");
      setPaymentPending(false);
      return;
    }

    const res = await fetch("/api/razorpay/ticket-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        ticketTypeId: selectedTicketTypeId,
        buyerName: data.name,
        buyerEmail: data.email,
      }),
    });
    const order = await res.json();
    if (!res.ok) {
      setServerError(order.error ?? "Failed to create payment order");
      setPaymentPending(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "URPASS",
      description: `Ticket — ${order.eventName}`,
      order_id: order.orderId,
      prefill: { name: data.name, email: data.email, contact: data.phone ?? "" },
      theme: { color: "#6D28D9" },
      handler: async (response: RazorpayResponse) => {
        const result = await submitApplication(
          event.id,
          data,
          {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          },
          selectedTicketTypeId
        );
        setPaymentPending(false);
        if (result?.error) {
          setServerError(result.error);
          return;
        }
        if (result?.passToken) {
          router.push(`/pass/${result.passToken}`);
        } else {
          setSuccess({ type: "pending", attendeeName: data.name });
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentPending(false);
          setServerError("Payment was cancelled. Please try again.");
        },
      },
    });
    rzp.open();
  }

  async function onSubmit(data: AttendeeInput) {
    if (ticketTypes.length > 0 && !selectedTicketTypeId) {
      setServerError("Select a ticket type to continue.");
      return;
    }
    if (selectedTicket?.remaining !== null && selectedTicket?.remaining !== undefined && selectedTicket.remaining <= 0) {
      setServerError("That ticket type is sold out. Please choose another ticket.");
      return;
    }

    if (effectivelyPaid) {
      return handlePaidSubmit(data);
    }
    setServerError("");
    const result = await submitApplication(event.id, data, undefined, selectedTicketTypeId);
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    if (result?.passToken) {
      router.push(`/pass/${result.passToken}`);
    } else {
      setSuccess({ type: "pending", attendeeName: data.name });
    }
  }

  // ── Pending ───────────────────────────────────────────────────────────────
  if (success?.type === "pending") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-5"
        style={{ background: BG }}
      >
        <Wordmark branding={branding} />

        <div className="pass-scale-in w-full max-w-sm">
          <div
            className="bg-white rounded-3xl border border-neutral-100 p-8 text-center"
            style={{ boxShadow: "0 8px 40px 0 rgba(109,40,217,0.10)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe" }}
            >
              <CheckCircle className="w-7 h-7 text-brand" />
            </div>

            <h1 className="text-xl font-bold text-neutral-900 mb-2">
              You&apos;re on the list
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              Hi {success.attendeeName}, your application for{" "}
              <span className="font-medium text-neutral-700">{event.name}</span> has been
              received. We&apos;ll email you once it&apos;s reviewed.
            </p>

            <div className="bg-neutral-50 rounded-2xl p-4 text-left border border-neutral-100">
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                <CalendarDays className="w-3.5 h-3.5 shrink-0 text-brand" />
                <span>
                  {formattedDate} · {event.start_time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-brand" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {branding.showUrpassBranding && (
          <p className="text-xs text-neutral-300 mt-8 pass-in-2">Powered by URPASS</p>
        )}
      </div>
    );
  }

  // ── Application form ──────────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen flex flex-col items-center p-5 pb-16 ${staffScanLink ? "pt-20" : "pt-10"}`}
      style={{ background: BG }}
    >
      <div className="w-full max-w-[480px]">
        <Wordmark branding={branding} />

        {/* Event info */}
        <div className="mb-5 apply-in-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2 leading-tight">
            {event.name}
          </h1>
          {event.description && (
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
              {event.description}
            </p>
          )}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <CalendarDays className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>
                {formattedDate} · {event.start_time}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-2 mb-6 apply-in-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Open
          </span>
          {event.auto_approve && !event.is_paid_event && (
            <span className="text-xs font-medium text-brand bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
              Instant pass
            </span>
          )}
          {effectivelyPaid && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              <IndianRupee className="w-3 h-3" />
              ₹{effectiveTicketPrice.toLocaleString("en-IN")} ticket
            </span>
          )}
        </div>

        {/* Ticket selector — uses radio inputs so native click handling bypasses any CSS stacking issues */}
        {ticketTypes.length > 0 && (
          <div
            className="bg-white rounded-3xl border border-neutral-100 p-6 apply-in-3 mb-4 relative z-10"
            style={{ boxShadow: "0 4px 32px 0 rgba(109,40,217,0.08)" }}
          >
            <h2 className="text-base font-semibold text-neutral-900 mb-4">Select a ticket</h2>
            <div className="flex flex-col gap-2">
              {ticketTypes.map((tt) => {
                const isSoldOut = tt.remaining !== null && tt.remaining <= 0;
                const isPaymentUnavailable = tt.price > 0 && !hasPaymentGateway;
                const isSelected = selectedTicketTypeId === tt.id;
                return (
                  <label
                    key={tt.id}
                    className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand bg-brand-50"
                        : isSoldOut
                        ? "border-neutral-100 bg-neutral-50 opacity-60 cursor-not-allowed"
                        : "border-neutral-200 hover:border-brand/40 hover:bg-neutral-50"
                    }`}
                  >
                    {/* Native radio — hidden but drives selection */}
                    <input
                      type="radio"
                      name="ticket_type"
                      value={tt.id}
                      disabled={isSoldOut}
                      checked={isSelected}
                      onChange={() => setSelectedTicketTypeId(tt.id)}
                      className="sr-only"
                    />

                    {/* Custom radio dot */}
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-brand bg-brand"
                          : isSoldOut
                          ? "border-neutral-200"
                          : "border-neutral-300"
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900 truncate">
                          {tt.name}
                        </span>
                        {isSoldOut && (
                          <span className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full shrink-0">
                            Sold out
                          </span>
                        )}
                        {isPaymentUnavailable && !isSoldOut && (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full shrink-0">
                            Payment unavailable
                          </span>
                        )}
                      </div>
                      {tt.description && (
                        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          {tt.description}
                        </p>
                      )}
                      {tt.remaining !== null && !isSoldOut && (
                        <p className="text-[11px] text-neutral-400 mt-1">
                          {tt.remaining} spot{tt.remaining !== 1 ? "s" : ""} left
                        </p>
                      )}
                    </div>

                    <span className="text-sm font-bold text-neutral-900 shrink-0 mt-0.5">
                      {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Form card */}
        <div
          className="bg-white rounded-3xl border border-neutral-100 p-6 apply-in-4 relative z-0"
          style={{ boxShadow: "0 4px 32px 0 rgba(109,40,217,0.08)" }}
        >
          <h2 className="text-base font-semibold text-neutral-900 mb-5">Your details</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Your full name"
                  className={`${inputCls} pl-10`}
                  autoComplete="name"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`${inputCls} pl-10`}
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Phone{" "}
                <span className="normal-case font-normal text-neutral-400">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={`${inputCls} pl-10`}
                  autoComplete="tel"
                  {...register("phone")}
                />
              </div>
            </div>

            <input type="hidden" value="participant" {...register("pass_type")} />

            {serverError && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                {serverError}
              </div>
            )}

            {paymentBlocked && (
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                Payment is not yet configured for this event. The organizer needs to connect a payment gateway before registrations can be accepted.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || paymentPending || paymentBlocked}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ background: "#6D28D9" }}
            >
              {(isSubmitting || paymentPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {paymentPending
                ? "Processing payment…"
                : isSubmitting
                ? event.auto_approve
                  ? "Generating your pass…"
                  : "Submitting…"
                : effectivelyPaid
                ? `Pay ₹${effectiveTicketPrice.toLocaleString("en-IN")} & Apply`
                : "Apply to attend"}
            </button>
            {effectivelyPaid && !paymentBlocked && (
              <p className="text-xs text-center text-neutral-400 mt-1">
                Secure payment via Razorpay · Your pass is issued after payment
              </p>
            )}
          </form>
        </div>

        {branding.showUrpassBranding && (
          <p className="text-center text-xs text-neutral-300 mt-6">Powered by URPASS</p>
        )}
      </div>
    </div>
  );
}
