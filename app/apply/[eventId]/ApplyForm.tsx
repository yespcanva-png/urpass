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
  ChevronDown,
  ShieldCheck,
  Video,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { attendeeSchema, type AttendeeInput } from "@/lib/validations/attendee";
import { submitApplication } from "@/app/actions/attendees";
import type { ApplyTicketType } from "./page";
import type { CustomFieldDefinition } from "@/types";

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
  event_type: string;
  custom_fields?: CustomFieldDefinition[];
}

interface Branding {
  showUrpassBranding: boolean;
  orgName: string | null;
  brandColor: string;
  orgLogoUrl: string | null;
}

type SuccessState = { type: "pending" | "waitlisted"; attendeeName: string };

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

type TicketOrderResponse = {
  error?: string;
  code?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  eventName?: string;
  reservationId?: string;
};

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
  const available = ticketTypes.filter(
    (t) => !t.isUpcoming && !t.isEnded && (t.remaining == null || t.remaining > 0)
  );
  const defaultTicketTypeId =
    (!hasPaymentGateway && available.some((t) => t.price === 0)
      ? available.find((t) => t.price === 0)
      : available[0]
    )?.id ?? null;
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(defaultTicketTypeId);
  const [customResponses, setCustomResponses] = useState<Record<string, unknown>>({});

  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketTypeId) ?? null;
  const [peopleCount, setPeopleCount] = useState<number>(() => selectedTicket?.included_guests || 1);
  const [memberNames, setMemberNames] = useState<string[]>([]);

  // Keep people count in sync when selected ticket type changes
  const handleSelectTicket = (id: string) => {
    setSelectedTicketTypeId(id);
    const tt = ticketTypes.find((t) => t.id === id);
    const inc = tt?.included_guests || 1;
    setPeopleCount(inc);
    setMemberNames([]);
  };

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
  const isOnline = event.event_type === "online";
  const isHybrid = event.event_type === "hybrid";
  const attendanceLabel = isOnline ? "Virtual access" : isHybrid ? "Hybrid access" : "Venue access";
  const attendanceDetail = isOnline
    ? "Secure join link after approval"
    : isHybrid
    ? "Join online or attend in person"
    : "QR entry at venue";

  const baseTicketPrice = selectedTicket
    ? selectedTicket.price / 100
    : event.is_paid_event
      ? event.ticket_price
      : 0;

  const allowExtra = Boolean(selectedTicket?.allow_extra_guests);
  const includedGuests = Number(selectedTicket?.included_guests || 1);
  const extraPrice = Number(selectedTicket?.extra_guest_price || 0);
  const extraGuestsCount = allowExtra ? Math.max(0, peopleCount - includedGuests) : 0;
  const extraGuestsTotal = extraGuestsCount * extraPrice;
  const effectiveTicketPrice = baseTicketPrice + extraGuestsTotal;

  const effectivelyPaid = selectedTicket ? selectedTicket.price > 0 || extraGuestsTotal > 0 : event.is_paid_event;
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

    const groupMembers = [
      { name: data.name, email: data.email, phone: data.phone, role: "primary" },
      ...memberNames.filter((n) => n.trim().length > 0).map((n) => ({ name: n.trim(), role: "member" })),
    ];

    const res = await fetch("/api/razorpay/ticket-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        ticketTypeId: selectedTicketTypeId,
        buyerName: data.name,
        buyerEmail: data.email,
        guestCount: peopleCount,
        groupMembers,
      }),
    });
    const order = (await res.json().catch(() => ({}))) as TicketOrderResponse;
    if (!res.ok) {
      setServerError(order.error ?? `Failed to create payment order (${res.status}).`);
      setPaymentPending(false);
      return;
    }

    if (!order.orderId || !order.keyId || !order.amount || !order.currency) {
      setServerError("Payment order response was incomplete. Please refresh and try again.");
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
        try {
          const result = await submitApplication(
            event.id,
            data,
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            selectedTicketTypeId,
            customResponses
          );
          setPaymentPending(false);
          if (result?.error) {
            setServerError(result.error);
            return;
          }
          if (result?.passToken) {
            router.push(`/pass/${result.passToken}`);
          } else if (result?.waitlisted) {
            setSuccess({ type: "waitlisted", attendeeName: data.name });
          } else {
            setSuccess({ type: "pending", attendeeName: data.name });
          }
        } catch (err) {
          setPaymentPending(false);
          setServerError(err instanceof Error ? err.message : "Failed to confirm registration.");
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentPending(false);
          setServerError("Payment was cancelled. Your reserved slot has been released.");
          if (order.reservationId || order.orderId) {
            fetch("/api/razorpay/ticket-order", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reservationId: order.reservationId,
                orderId: order.orderId,
              }),
            }).catch(() => {});
          }
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
    if (selectedTicket?.isUpcoming) {
      setServerError("Sales for this ticket tier have not started yet.");
      return;
    }
    if (selectedTicket?.isEnded) {
      setServerError("Sales for this ticket tier have ended.");
      return;
    }
    if (selectedTicket?.remaining !== null && selectedTicket?.remaining !== undefined && selectedTicket.remaining <= 0) {
      setServerError("That ticket type is sold out. Please choose another ticket.");
      return;
    }

    if (event.custom_fields && event.custom_fields.length > 0) {
      for (const field of event.custom_fields) {
        if (field.required) {
          const val = customResponses[field.id];
          if (val === undefined || val === null || val === "" || (field.type === "checkbox" && !val)) {
            setServerError(`Please answer the required question: "${field.label}".`);
            return;
          }
        }
      }
    }

    if (effectivelyPaid) {
      return handlePaidSubmit(data);
    }
    setServerError("");
    try {
      const result = await submitApplication(event.id, data, undefined, selectedTicketTypeId, customResponses);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      if (result?.passToken) {
        router.push(`/pass/${result.passToken}`);
      } else if (result?.waitlisted) {
        setSuccess({ type: "waitlisted", attendeeName: data.name });
      } else {
        setSuccess({ type: "pending", attendeeName: data.name });
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to submit registration.");
    }
  }

  // ── Waitlisted ────────────────────────────────────────────────────────────
  if (success?.type === "waitlisted") {
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
              style={{ background: "#faf5ff", border: "1.5px solid #e9d5ff" }}
            >
              <Ticket className="w-7 h-7 text-purple-600" />
            </div>

            <h1 className="text-xl font-bold text-neutral-900 mb-2">
              You&apos;re on the waitlist!
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              Hi {success.attendeeName}, this event is currently at full capacity. We&apos;ve added you to the waitlist queue and will notify you by email as soon as a spot opens up!
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
            className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 apply-in-3 mb-4 relative z-10 overflow-hidden"
            style={{ boxShadow: "0 18px 55px -34px rgba(15,23,42,0.35)" }}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-neutral-950" />
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-neutral-400 mb-1">
                  Ticket Portfolio
                </p>
                <h2 className="text-lg font-bold tracking-tight text-neutral-950">
                  Select your access tier
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-bold text-neutral-700 shrink-0">
                {isOnline ? <Video className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                {attendanceLabel}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {ticketTypes.map((tt) => {
                const isSoldOut = tt.remaining !== null && tt.remaining <= 0;
                const isUpcoming = !!tt.isUpcoming;
                const isEnded = !!tt.isEnded;
                const isAvailable = !isUpcoming && !isEnded && !isSoldOut;
                const isPaymentUnavailable = tt.price > 0 && !hasPaymentGateway;
                const isSelected = selectedTicketTypeId === tt.id;
                const isDisabled = !isAvailable || (isPaymentUnavailable && tt.price > 0);
                const capacityLabel =
                  tt.remaining === null
                    ? "Open capacity"
                    : `${tt.remaining} seat${tt.remaining !== 1 ? "s" : ""} left`;
                const statusLabel = isUpcoming
                  ? tt.sales_start
                    ? `Opens ${new Date(tt.sales_start).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}`
                    : "Coming soon"
                  : isEnded
                  ? "Sales ended"
                  : isSoldOut
                  ? "Sold out"
                  : isPaymentUnavailable
                  ? "Payment unavailable"
                  : "Available";

                return (
                  <label
                    key={tt.id}
                    className={`group relative overflow-hidden rounded-2xl border transition-all ${
                      isSelected
                        ? "border-neutral-950 bg-neutral-950 text-white shadow-xl shadow-neutral-950/15 cursor-pointer"
                        : isDisabled
                        ? "border-neutral-100 bg-neutral-50/80 opacity-70 cursor-not-allowed"
                        : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-lg hover:shadow-neutral-900/5 cursor-pointer"
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 w-1"
                      style={{ backgroundColor: isSelected ? branding.brandColor : "#d4d4d8" }}
                    />
                    {/* Native radio — hidden but drives selection */}
                    <input
                      type="radio"
                      name="ticket_type"
                      value={tt.id}
                      disabled={isDisabled}
                      checked={isSelected}
                      onChange={() => handleSelectTicket(tt.id)}
                      className="sr-only"
                    />

                    <div className="grid grid-cols-[1fr_auto] gap-4 p-4 sm:p-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              isSelected
                                ? "bg-white/10 text-white"
                                : isAvailable
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {statusLabel}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isSelected ? "text-white/50" : "text-neutral-400"
                            }`}
                          >
                            {tt.category.replace(/_/g, " ")}
                          </span>
                        </div>
                        <h3
                          className={`mt-2 text-base font-bold tracking-tight truncate ${
                            isSelected ? "text-white" : "text-neutral-950"
                          }`}
                        >
                          {tt.name}
                        </h3>
                        {tt.description && (
                          <p
                            className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
                              isSelected ? "text-white/65" : "text-neutral-500"
                            }`}
                          >
                            {tt.description}
                          </p>
                        )}
                        <div
                          className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold ${
                            isSelected ? "text-white/70" : "text-neutral-500"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {isOnline ? <Video className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                            {attendanceDetail}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {capacityLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-4 text-right">
                        <div>
                          <p
                            className={`text-[10px] font-black uppercase tracking-widest ${
                              isSelected ? "text-white/45" : "text-neutral-400"
                            }`}
                          >
                            Price
                          </p>
                          <p
                            className={`text-xl font-black tabular-nums ${
                              isSelected ? "text-white" : "text-neutral-950"
                            }`}
                          >
                            {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                          </p>
                        </div>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-white bg-white"
                              : isDisabled
                              ? "border-neutral-200 bg-neutral-100"
                              : "border-neutral-300 group-hover:border-neutral-500"
                          }`}
                        >
                          {isSelected && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: branding.brandColor }}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <p className="text-[11px] font-semibold leading-relaxed text-neutral-600">
                {isOnline
                  ? "Your approved pass unlocks the online event join button. Meeting details stay protected until registration is confirmed."
                  : isHybrid
                  ? "Your approved pass works for venue check-in and includes online joining instructions where enabled."
                  : "Your approved pass includes a verifiable QR credential for venue entry."}
              </p>
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

            {/* Group & Family Pass: Number of People Stepper */}
            {selectedTicket && (selectedTicket.allow_extra_guests || (selectedTicket.included_guests && selectedTicket.included_guests > 1)) && (
              <div className="pt-2 border-t border-neutral-100 flex flex-col gap-3">
                <div className="bg-violet-50/70 border border-violet-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand" />
                      <span>Number of people</span>
                    </div>
                    <div className="text-xs text-neutral-600 mt-0.5">
                      {selectedTicket.allow_extra_guests
                        ? `Includes up to ${selectedTicket.included_guests} people. ₹${selectedTicket.extra_guest_price || 100} for each additional person`
                        : `Includes exactly ${selectedTicket.included_guests} people`}
                    </div>
                  </div>

                  {selectedTicket.allow_extra_guests ? (
                    <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => {
                          const minG = selectedTicket.min_guests || selectedTicket.included_guests || 1;
                          if (peopleCount > minG) {
                            const next = peopleCount - 1;
                            setPeopleCount(next);
                            setMemberNames((prev) => prev.slice(0, Math.max(0, next - 1)));
                          }
                        }}
                        disabled={peopleCount <= (selectedTicket.min_guests || selectedTicket.included_guests || 1)}
                        className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-neutral-800 transition-colors cursor-pointer text-base"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-neutral-900">{peopleCount}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const maxG = selectedTicket.max_guests || 10;
                          if (peopleCount < maxG) {
                            const next = peopleCount + 1;
                            setPeopleCount(next);
                            if (next > 1 && memberNames.length < next - 1) {
                              setMemberNames((prev) => [...prev, ""]);
                            }
                          }
                        }}
                        disabled={peopleCount >= (selectedTicket.max_guests || 10)}
                        className="w-8 h-8 rounded-lg bg-brand hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-white transition-colors cursor-pointer text-base"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-white border border-neutral-200 font-bold text-xs text-neutral-900">
                      {selectedTicket.included_guests} Guests
                    </span>
                  )}
                </div>

                {/* Additional Member Names Input Roster */}
                {peopleCount > 1 && (
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Additional Group Members ({peopleCount - 1})
                    </p>
                    {Array.from({ length: peopleCount - 1 }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400 w-6 text-center shrink-0">#{idx + 2}</span>
                        <input
                          type="text"
                          placeholder={`Member ${idx + 2} Name`}
                          value={memberNames[idx] || ""}
                          onChange={(e) => {
                            const updated = [...memberNames];
                            updated[idx] = e.target.value;
                            setMemberNames(updated);
                          }}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Ledger */}
            {extraGuestsCount > 0 && (
              <div className="bg-neutral-50 rounded-2xl p-4 text-xs space-y-1.5 border border-neutral-200/80">
                <div className="flex justify-between text-neutral-600">
                  <span>Pass Price ({selectedTicket?.name})</span>
                  <span className="font-semibold text-neutral-900">₹{baseTicketPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-violet-700 font-medium">
                  <span>Extra Guests ({extraGuestsCount} × ₹{extraPrice})</span>
                  <span className="font-semibold">+₹{extraGuestsTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-neutral-900 font-bold border-t border-neutral-200 pt-2 text-sm">
                  <span>Total Amount</span>
                  <span className="text-base text-brand">₹{effectiveTicketPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-[11px] text-neutral-400 flex justify-between pt-1">
                  <span>Pass Capacity: <strong className="text-neutral-700">{peopleCount} Attendees</strong></span>
                  <span>Ticket Quantity: <strong className="text-neutral-700">1 Pass</strong></span>
                </div>
              </div>
            )}

            {/* Custom registration fields */}
            {event.custom_fields && event.custom_fields.length > 0 && (
              <div className="pt-2 border-t border-neutral-100 flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Additional Details
                </p>
                {event.custom_fields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {field.label}{" "}
                      {field.required ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        <span className="normal-case font-normal text-neutral-400">(optional)</span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          value={(customResponses[field.id] as string) ?? ""}
                          onChange={(e) =>
                            setCustomResponses({ ...customResponses, [field.id]: e.target.value })
                          }
                          className={`${inputCls} appearance-none pr-9`}
                        >
                          <option value="">Select an option...</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    ) : field.type === "checkbox" ? (
                      <label className="flex items-center gap-2.5 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={!!customResponses[field.id]}
                          onChange={(e) =>
                            setCustomResponses({ ...customResponses, [field.id]: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-brand border-neutral-300 focus:ring-brand"
                        />
                        <span className="text-sm text-neutral-700">Yes, confirm</span>
                      </label>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={(customResponses[field.id] as string | number) ?? ""}
                        onChange={(e) =>
                          setCustomResponses({ ...customResponses, [field.id]: e.target.value })
                        }
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className={inputCls}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

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
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <a
              href="https://urpass.space/signup?ref=apply-form"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100/80 border border-violet-100 text-violet-700 text-xs font-medium transition-all shadow-2xs"
            >
              <span>Hosting your own event?</span>
              <span className="font-bold underline underline-offset-2">Create free on URPASS →</span>
            </a>
            <p className="text-[11px] text-neutral-400">
              Powered by{" "}
              <a
                href="https://urpass.space?ref=apply-footer"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
              >
                URPASS
              </a>{" "}
              · Zero commission ticketing & fast QR check-in
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
