"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  MapPin,
  Loader2,
  CheckCircle2,
  Mail,
  Ticket,
  User,
  Phone,
  AlertCircle,
  ShieldCheck,
  Video,
  Users,
  Sparkles,
  Lock,
  ChevronDown,
  ArrowRight,
  Clock,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { attendeeSchema, type AttendeeInput } from "@/lib/validations/attendee";
import { submitApplication } from "@/app/actions/attendees";
import type { ApplyTicketType } from "./page";
import type { CustomFieldDefinition } from "@/types";
import EventImageCarousel from "@/components/events/EventImageCarousel";

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
  event_images?: string[];
}

interface Branding {
  showUrpassBranding: boolean;
  orgName: string | null;
  brandColor: string;
  orgLogoUrl: string | null;
}

type SuccessState = { type: "pending" | "waitlisted"; attendeeName: string };

const inputCls =
  "w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 hover:border-neutral-300";

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
    if (typeof window === "undefined") return resolve(false);
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
  eventImages = [],
}: {
  event: EventInfo;
  branding: Branding;
  staffScanLink?: string | null;
  ticketTypes?: ApplyTicketType[];
  hasPaymentGateway?: boolean;
  eventImages?: string[];
}) {
  const router = useRouter();
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [serverError, setServerError] = useState("");
  const [paymentPending, setPaymentPending] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Available tickets filter
  const available = useMemo(
    () =>
      ticketTypes.filter(
        (t) => !t.isUpcoming && !t.isEnded && (t.remaining == null || t.remaining > 0)
      ),
    [ticketTypes]
  );

  const defaultTicketTypeId =
    (!hasPaymentGateway && available.some((t) => t.price === 0)
      ? available.find((t) => t.price === 0)
      : available[0]
    )?.id ?? ticketTypes[0]?.id ?? null;

  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(defaultTicketTypeId);
  const [customResponses, setCustomResponses] = useState<Record<string, unknown>>({});

  // Duration filter tab (All, 1 Day, 3 Days, etc.)
  const availableDurations = useMemo(() => {
    const set = new Set<string>();
    ticketTypes.forEach((t) => {
      if (t.duration_label) set.add(t.duration_label.trim());
      else if (t.duration_days) set.add(`${t.duration_days} Day${t.duration_days > 1 ? "s" : ""}`);
    });
    return Array.from(set);
  }, [ticketTypes]);

  const [selectedDurationFilter, setSelectedDurationFilter] = useState<string>("all");

  const filteredTickets = useMemo(() => {
    if (selectedDurationFilter === "all") return ticketTypes;
    return ticketTypes.filter((t) => {
      const label = t.duration_label?.trim() || (t.duration_days ? `${t.duration_days} Day${t.duration_days > 1 ? "s" : ""}` : "");
      return label.toLowerCase() === selectedDurationFilter.toLowerCase();
    });
  }, [ticketTypes, selectedDurationFilter]);

  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketTypeId) ?? null;
  const [peopleCount, setPeopleCount] = useState<number>(() => selectedTicket?.included_guests || 1);
  const [memberNames, setMemberNames] = useState<string[]>([]);

  // Sync people count whenever ticket selection changes
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
    getValues,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<AttendeeInput>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: { pass_type: "participant" },
  });

  const handleFloatingBookClick = () => {
    const values = getValues();
    if (!values.name || !values.email) {
      const detailsSection = document.getElementById("attendee-details-section");
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (!values.name) {
        setFocus("name");
      } else if (!values.email) {
        setFocus("email");
      }
      handleSubmit(onSubmit)();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isOnline = event.event_type === "online";
  const isHybrid = event.event_type === "hybrid";

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
      setServerError("Payment service is temporarily unreachable. Please check your connection and try again.");
      setPaymentPending(false);
      return;
    }

    const groupMembers = [
      { name: data.name, email: data.email, phone: data.phone, role: "primary" },
      ...memberNames.filter((n) => n.trim().length > 0).map((n) => ({ name: n.trim(), role: "member" })),
    ];

    try {
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
        setServerError(order.error ?? `Failed to initiate payment (${res.status}).`);
        setPaymentPending(false);
        return;
      }

      if (!order.orderId || !order.keyId || !order.amount || !order.currency) {
        setServerError("Payment setup response was incomplete. Please refresh and try again.");
        setPaymentPending(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: branding.orgName || "URPASS",
        description: `${selectedTicket?.name || "Pass"} — ${event.name}`,
        order_id: order.orderId,
        prefill: { name: data.name, email: data.email, contact: data.phone ?? "" },
        theme: { color: branding.brandColor || "#6D28D9" },
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
            setServerError(err instanceof Error ? err.message : "Failed to confirm pass registration.");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentPending(false);
            setServerError("Payment cancelled. Your reserved spot has been released.");
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
    } catch {
      setPaymentPending(false);
      setServerError("Network error initializing payment gateway.");
    }
  }

  async function onSubmit(data: AttendeeInput) {
    if (ticketTypes.length > 0 && !selectedTicketTypeId) {
      setServerError("Please select a pass tier to continue.");
      return;
    }
    if (selectedTicket?.isUpcoming) {
      setServerError("Sales for this pass tier have not started yet.");
      return;
    }
    if (selectedTicket?.isEnded) {
      setServerError("Sales for this pass tier have concluded.");
      return;
    }
    if (selectedTicket?.remaining !== null && selectedTicket?.remaining !== undefined && selectedTicket.remaining <= 0) {
      setServerError("This pass tier is sold out. Please select another tier.");
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
      setServerError(err instanceof Error ? err.message : "Failed to submit pass registration.");
    }
  }

  // ── Waitlisted Screen ───────────────────────────────────────────────────────
  if (success?.type === "waitlisted") {
    return (
      <div className="min-h-screen bg-neutral-50/60 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/80 p-7 sm:p-9 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">You&apos;re on the Waitlist</h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
            Hi {success.attendeeName}, this event is currently at full capacity. We&apos;ve reserved your priority queue position and will notify you via email as soon as a spot opens.
          </p>
          <div className="bg-neutral-50 rounded-xl p-4 text-left border border-neutral-100 text-xs text-neutral-600 space-y-2">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <CalendarDays className="w-4 h-4 text-brand shrink-0" />
              <span>{formattedDate} · {event.start_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand shrink-0" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending Approval Screen ─────────────────────────────────────────────────
  if (success?.type === "pending") {
    return (
      <div className="min-h-screen bg-neutral-50/60 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/80 p-7 sm:p-9 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Registration Received</h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
            Hi {success.attendeeName}, your application for <strong className="text-neutral-800">{event.name}</strong> has been submitted. The organizers will review your registration and email your pass credential shortly.
          </p>
          <div className="bg-neutral-50 rounded-xl p-4 text-left border border-neutral-100 text-xs text-neutral-600 space-y-2">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <CalendarDays className="w-4 h-4 text-brand shrink-0" />
              <span>{formattedDate} · {event.start_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand shrink-0" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Corporate Registration Page ──────────────────────────────────────
  return (
    <div className={`min-h-screen bg-[#fafafa] text-neutral-900 ${selectedTicket ? "pb-28 sm:pb-32" : "pb-20"} ${staffScanLink ? "pt-16" : "pt-4 sm:pt-8"}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Top Corporate Brand Header */}
        <header className="flex items-center justify-between py-4 border-b border-neutral-200/70 mb-6">
          <div className="flex items-center gap-2.5">
            {branding.orgLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.orgLogoUrl} alt="Logo" className="w-6 h-6 rounded-md object-cover border border-neutral-200" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black text-xs">
                <Ticket className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-neutral-900 uppercase">
                {branding.orgName || "URPASS EVENT"}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">Official Event Registration</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Entry</span>
          </div>
        </header>

        {/* Event Summary Card */}
        <section className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-7 shadow-xs mb-6 overflow-hidden">
          {eventImages && eventImages.length > 0 && (
            <div className="mb-5 -mx-5 -mt-5 sm:-mx-7 sm:-mt-7">
              <EventImageCarousel images={eventImages} eventName={event.name} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
              <Sparkles className="w-3 h-3" />
              {isOnline ? "Virtual Event" : isHybrid ? "Hybrid Event" : "In-Person Event"}
            </span>
            {event.auto_approve && !event.is_paid_event && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                ⚡ Instant Pass Issue
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
              Zero Booking Fees
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-3 leading-snug">
            {event.name}
          </h1>

          {event.description && (
            <div className="mb-4">
              <div
                className={`text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap break-words font-normal ${
                  showFullDescription ? "" : "line-clamp-4"
                }`}
              >
                {event.description}
              </div>
              {event.description.length > 200 && (
                <button
                  type="button"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-xs font-semibold text-brand hover:underline mt-1.5 cursor-pointer"
                >
                  {showFullDescription ? "Show less" : "Read full description"}
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-neutral-100 text-xs text-neutral-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-neutral-50 border border-neutral-200/80 flex items-center justify-center shrink-0">
                <CalendarDays className="w-3.5 h-3.5 text-neutral-500" />
              </div>
              <div className="truncate">
                <span className="font-semibold text-neutral-900">{formattedDate}</span>
                <span className="text-neutral-500 ml-1.5">· {event.start_time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-neutral-50 border border-neutral-200/80 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              </div>
              <div className="truncate font-medium text-neutral-800">
                {event.venue}
              </div>
            </div>
          </div>
        </section>

        {/* Step 1: Select Pass Tier */}
        {ticketTypes.length > 0 && (
          <section className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-7 shadow-xs mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                  Step 1 of 2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                  Select Pass & Duration
                </h2>
              </div>

              {selectedTicket && (
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Selected</span>
                  <span className="text-xs font-bold text-neutral-900">{selectedTicket.name}</span>
                </div>
              )}
            </div>

            {/* Duration Filter Switcher (if event has 1 Day / 3 Days etc) */}
            {availableDurations.length > 1 && (
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl mb-4 text-xs font-semibold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedDurationFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    selectedDurationFilter === "all"
                      ? "bg-white text-neutral-900 shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  All Passes ({ticketTypes.length})
                </button>
                {availableDurations.map((dur) => {
                  const count = ticketTypes.filter((t) => {
                    const l = t.duration_label?.trim() || (t.duration_days ? `${t.duration_days} Day${t.duration_days > 1 ? "s" : ""}` : "");
                    return l.toLowerCase() === dur.toLowerCase();
                  }).length;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDurationFilter(dur)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                        selectedDurationFilter.toLowerCase() === dur.toLowerCase()
                          ? "bg-white text-neutral-900 shadow-2xs"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {dur} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Pass Cards List */}
            <div className="space-y-3">
              {filteredTickets.map((tt) => {
                const isSoldOut = tt.remaining !== null && tt.remaining <= 0;
                const isUpcoming = !!tt.isUpcoming;
                const isEnded = !!tt.isEnded;
                const isAvailable = !isUpcoming && !isEnded && !isSoldOut;
                const isPaymentUnavailable = tt.price > 0 && !hasPaymentGateway;
                const isSelected = selectedTicketTypeId === tt.id;
                const isDisabled = !isAvailable || (isPaymentUnavailable && tt.price > 0);

                const durationTag = tt.duration_label || (tt.duration_days ? `${tt.duration_days} Day${tt.duration_days > 1 ? "s" : ""}` : null);
                const peopleTag = tt.included_guests && tt.included_guests > 1
                  ? tt.allow_extra_guests
                    ? `Includes ${tt.included_guests} people · +₹${tt.extra_guest_price || 100}/extra`
                    : `Valid for ${tt.included_guests} people`
                  : "Single person entry";

                return (
                  <label
                    key={tt.id}
                    onClick={() => !isDisabled && handleSelectTicket(tt.id)}
                    className={`block rounded-xl border p-4 sm:p-5 transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-brand bg-purple-50/20 ring-1.5 ring-brand shadow-xs"
                        : isDisabled
                        ? "border-neutral-200 bg-neutral-50/60 opacity-60 cursor-not-allowed"
                        : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-2xs"
                    }`}
                  >
                    <input
                      type="radio"
                      name="ticket_type_selection"
                      value={tt.id}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => handleSelectTicket(tt.id)}
                      className="sr-only"
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          {durationTag && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              isSelected ? "bg-brand text-white" : "bg-neutral-100 text-neutral-700"
                            }`}>
                              {durationTag}
                            </span>
                          )}
                          <span className="text-[11px] font-medium text-neutral-500">
                            {peopleTag}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                          {tt.name}
                        </h3>

                        {tt.description && (
                          <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed whitespace-pre-wrap break-words">
                            {tt.description}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end">
                        <div className="text-lg sm:text-xl font-extrabold text-neutral-900 tabular-nums">
                          {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                        </div>
                        <span className={`w-4 h-4 rounded-full border-2 mt-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-brand bg-brand"
                            : "border-neutral-300 bg-white"
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                    </div>

                    {/* Direct Buy Now / Instant Select Action inside Pass Card */}
                    <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-neutral-500 font-medium truncate">
                        {isAvailable ? (
                          isSelected ? (
                            <span className="text-purple-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selected Pass
                            </span>
                          ) : (
                            <span>Tap card or button to select</span>
                          )
                        ) : isSoldOut ? (
                          <span className="text-red-500 font-semibold">Sold Out</span>
                        ) : isUpcoming ? (
                          <span className="text-amber-600 font-semibold">Coming Soon</span>
                        ) : (
                          <span className="text-neutral-400">Unavailable</span>
                        )}
                      </div>

                      {isAvailable && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelected) {
                              handleSelectTicket(tt.id);
                            }
                            handleFloatingBookClick();
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                            isSelected
                              ? "bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs active:scale-[0.98]"
                              : "bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200"
                          }`}
                        >
                          <span>{tt.price === 0 ? "Claim Pass" : isSelected ? "Buy Now" : "Select & Buy"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Guest Count Stepper (if selected pass is Family/Group or allows extra attendees) */}
            {selectedTicket && (selectedTicket.allow_extra_guests || (selectedTicket.included_guests && selectedTicket.included_guests > 1)) && (
              <div className="mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/90 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-brand" />
                      <span>Number of People Covered</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {selectedTicket.allow_extra_guests
                        ? `Pass covers ${selectedTicket.included_guests} people. Extra guests charged at ₹${selectedTicket.extra_guest_price || 100}/person.`
                        : `Fixed group capacity: ${selectedTicket.included_guests} people`}
                    </div>
                  </div>

                  {selectedTicket.allow_extra_guests ? (
                    <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-1 shadow-2xs">
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
                        className="w-7 h-7 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-neutral-800 transition-colors cursor-pointer text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-neutral-900">{peopleCount}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const maxG = selectedTicket.max_guests || 12;
                          if (peopleCount < maxG) {
                            const next = peopleCount + 1;
                            setPeopleCount(next);
                            if (next > 1 && memberNames.length < next - 1) {
                              setMemberNames((prev) => [...prev, ""]);
                            }
                          }
                        }}
                        disabled={peopleCount >= (selectedTicket.max_guests || 12)}
                        className="w-7 h-7 rounded bg-brand hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-white transition-colors cursor-pointer text-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-xs font-bold text-neutral-800">
                      {selectedTicket.included_guests} People
                    </span>
                  )}
                </div>

                {/* Additional Member Names Roster */}
                {peopleCount > 1 && (
                  <div className="pt-2 border-t border-neutral-200/70 space-y-2">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                      Group Member Names (Optional for Fast Entry)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.from({ length: peopleCount - 1 }).map((_, idx) => (
                        <div key={idx} className="relative">
                          <input
                            type="text"
                            placeholder={`Member ${idx + 2} Name`}
                            value={memberNames[idx] || ""}
                            onChange={(e) => {
                              const updated = [...memberNames];
                              updated[idx] = e.target.value;
                              setMemberNames(updated);
                            }}
                            className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 outline-none focus:border-brand"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Step 2: Primary Attendee Details Form */}
        <section
          id="attendee-details-section"
          className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-7 shadow-xs mb-6 scroll-mt-6"
        >
          <div className="mb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
              Step 2 of 2
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              Primary Pass Holder Details
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Your digital QR pass and tax invoice will be sent here.
            </p>
          </div>

          <form id="apply-attendee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Srinithin"
                  className={`${inputCls} pl-10`}
                  autoComplete="name"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="srinithin@example.com"
                  className={`${inputCls} pl-10`}
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* WhatsApp / Phone Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  WhatsApp / Mobile Number
                </label>
                <span className="text-[10px] text-neutral-400">For instant QR ticket delivery</span>
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={`${inputCls} pl-10`}
                  autoComplete="tel"
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Custom Organizer Fields */}
            {event.custom_fields && event.custom_fields.length > 0 && (
              <div className="pt-3 border-t border-neutral-100 space-y-3.5">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Event Specific Details
                </span>
                {event.custom_fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
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
                      <label className="flex items-center gap-2 cursor-pointer py-1 text-xs text-neutral-700 font-medium">
                        <input
                          type="checkbox"
                          checked={!!customResponses[field.id]}
                          onChange={(e) =>
                            setCustomResponses({ ...customResponses, [field.id]: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-brand border-neutral-300 focus:ring-brand"
                        />
                        <span>Confirm / Accept</span>
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

            {/* Order Ledger & Summary */}
            <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <div className="flex justify-between text-xs text-neutral-600">
                <span>{selectedTicket?.name || "Base Pass"} {selectedTicket?.duration_label ? `(${selectedTicket.duration_label})` : ""}</span>
                <span className="font-semibold text-neutral-900">
                  {baseTicketPrice === 0 ? "Free" : `₹${baseTicketPrice.toLocaleString("en-IN")}`}
                </span>
              </div>

              {extraGuestsCount > 0 && (
                <div className="flex justify-between text-xs text-violet-700 font-medium">
                  <span>Additional Guests ({extraGuestsCount} × ₹{extraPrice})</span>
                  <span>+₹{extraGuestsTotal.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-emerald-700 font-medium">
                <span>Booking & Payment Gateway Fee</span>
                <span className="font-bold">₹0 (Waived)</span>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold">
                <span className="text-sm text-neutral-900">Total Amount</span>
                <span className="text-xl font-extrabold text-neutral-900">
                  {effectiveTicketPrice === 0 ? "Free" : `₹${effectiveTicketPrice.toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="text-[11px] text-neutral-400 pt-1 flex justify-between border-t border-neutral-100">
                <span>Pass Coverage: <strong className="text-neutral-700">{peopleCount} Attendee{peopleCount !== 1 ? "s" : ""}</strong></span>
                <span>Security: <strong className="text-neutral-700">256-Bit Encrypted</strong></span>
              </div>
            </div>

            {serverError && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{serverError}</span>
              </div>
            )}

            {paymentBlocked && (
              <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Payment gateway is currently being connected by the event organizer. Please check back shortly.</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || paymentPending || paymentBlocked}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {(isSubmitting || paymentPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {paymentPending
                ? "Opening secure checkout…"
                : isSubmitting
                ? "Submitting registration…"
                : effectivelyPaid
                ? `Pay ₹${effectiveTicketPrice.toLocaleString("en-IN")} & Get QR Pass`
                : "Complete Free Registration"}
              {!isSubmitting && !paymentPending && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-1">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3" /> SSL Encrypted
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Instant Pass Delivery
              </span>
            </div>
          </form>
        </section>

        {/* Corporate Trust & Powered By Footer */}
        {branding.showUrpassBranding && (
          <footer className="mt-8 text-center text-xs text-neutral-400 space-y-2">
            <p>
              Secured & Powered by{" "}
              <a
                href="https://urpass.space"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-neutral-700 hover:text-neutral-900 underline underline-offset-2"
              >
                URPASS
              </a>{" "}
              · Verified Gate Pass & Event Operating Infrastructure
            </p>
          </footer>
        )}
      </div>

      {/* Floating Sticky Bottom Bar for Instant Booking */}
      {selectedTicket && (
        <aside
          aria-label="Checkout action bar"
          className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-3 px-4 sm:px-6 transition-all"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                  {selectedTicket.name}
                </span>
                {selectedTicket.duration_label && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-100 text-neutral-700 shrink-0">
                    {selectedTicket.duration_label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                <span className="text-sm sm:text-base font-extrabold text-neutral-900 tabular-nums">
                  {effectiveTicketPrice === 0 ? "Free" : `₹${effectiveTicketPrice.toLocaleString("en-IN")}`}
                </span>
                <span className="text-[11px] text-neutral-500 truncate">
                  · {peopleCount} {peopleCount === 1 ? "person" : "people"} covered
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFloatingBookClick}
              disabled={isSubmitting || paymentPending || paymentBlocked}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isSubmitting || paymentPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing…</span>
                </>
              ) : paymentBlocked ? (
                <span>Setup Required</span>
              ) : (
                <>
                  <span>
                    {effectivelyPaid
                      ? `Book Now · ₹${effectiveTicketPrice.toLocaleString("en-IN")}`
                      : "Book Free Pass"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </>
              )}
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
