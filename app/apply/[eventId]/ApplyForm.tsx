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
  Users,
  Sparkles,
  Lock,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Info,
  Check,
  ChevronRight,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { attendeeSchema, type AttendeeInput } from "@/lib/validations/attendee";
import { submitApplication } from "@/app/actions/attendees";
import type { ApplyTicketType } from "./page";
import type { CustomFieldDefinition } from "@/types";
import EventImageCarousel from "@/components/events/EventImageCarousel";
import { getEventDateRange, formatEventTimeWithOvernight } from "@/lib/utils";

interface EventInfo {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  end_date?: string | null;
  start_time: string;
  end_time?: string | null;
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
  "w-full bg-neutral-50/80 border border-neutral-200/90 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 font-medium placeholder:text-neutral-400 placeholder:font-normal outline-none transition-all duration-150 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10 hover:border-neutral-300";

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
  const [activeTab, setActiveTab] = useState<"about" | "tickets" | "venue" | "terms">("about");

  const brandColor = branding.brandColor || "#6D28D9";

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

  // Duration filter tab (All, 1 Day, Season Pass, etc.)
  const availableDurations = useMemo(() => {
    const set = new Set<string>();
    ticketTypes.forEach((t) => {
      if (t.duration_label) set.add(t.duration_label.trim());
      else if (t.duration_days) set.add(`${t.duration_days} Day${t.duration_days > 1 ? "s" : ""}`);
    });
    return Array.from(set);
  }, [ticketTypes]);

  const [selectedDurationFilter] = useState<string>("all");

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

  // Calculate event date range for multi-day events
  const maxTicketDurationDays = useMemo(() => {
    let maxD = 1;
    ticketTypes.forEach((t) => {
      if (t.duration_days && t.duration_days > maxD) {
        maxD = t.duration_days;
      }
    });
    return maxD;
  }, [ticketTypes]);

  const availableEventDates = useMemo(() => {
    return getEventDateRange(event.event_date, event.end_date, maxTicketDurationDays);
  }, [event.event_date, event.end_date, maxTicketDurationDays]);

  const [selectedDate, setSelectedDate] = useState<string>(
    () => availableEventDates[0]?.date || event.event_date
  );

  const isSingleDayPass = useMemo(() => {
    if (!selectedTicket) return false;
    const durLabel = (selectedTicket.duration_label || "").toLowerCase();
    return (
      selectedTicket.duration_days === 1 ||
      durLabel.includes("1 day") ||
      durLabel.includes("single day") ||
      durLabel === "1d"
    );
  }, [selectedTicket]);

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

  const scrollToTickets = () => {
    const el = document.getElementById("tickets-booking-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  const formattedSchedule = useMemo(() => {
    const startDateFormatted = new Date(event.event_date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    let dateText = startDateFormatted;
    if (event.end_date && event.end_date !== event.event_date) {
      const endDateFormatted = new Date(event.end_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      dateText = `${new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${endDateFormatted}`;
    }

    const timeText = formatEventTimeWithOvernight(event.start_time, event.end_time || "");
    return { dateText, timeText };
  }, [event.event_date, event.end_date, event.start_time, event.end_time]);

  const isOnline = event.event_type === "online";
  const isHybrid = event.event_type === "hybrid";

  const minStartingPrice = useMemo(() => {
    if (ticketTypes.length === 0) return event.ticket_price || 0;
    const prices = ticketTypes.map((t) => t.price / 100);
    return Math.min(...prices);
  }, [ticketTypes, event.ticket_price]);

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
      setServerError("Payment gateway is temporarily unreachable. Please check your internet connection and try again.");
      setPaymentPending(false);
      return;
    }

    const groupMembers = [
      { name: data.name, email: data.email, phone: data.phone, role: "primary" },
      ...memberNames.filter((n) => n.trim().length > 0).map((n) => ({ name: n.trim(), role: "member" })),
    ];

    const finalResponses = {
      ...customResponses,
      ...(availableEventDates.length > 1
        ? {
            attendance_date: selectedDate,
            selected_date: selectedDate,
            attendance_day_label: availableEventDates.find((d) => d.date === selectedDate)?.label || selectedDate,
          }
        : {}),
    };

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
          selectedDate: availableEventDates.length > 1 ? selectedDate : undefined,
        }),
      });
      const order = (await res.json().catch(() => ({}))) as TicketOrderResponse;
      if (!res.ok) {
        setServerError(order.error ?? `Failed to initiate payment (${res.status}).`);
        setPaymentPending(false);
        return;
      }

      if (!order.orderId || !order.keyId || !order.amount || !order.currency) {
        setServerError("Payment configuration error. Please refresh the page and try again.");
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
        theme: { color: brandColor },
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
              {
                ...finalResponses,
                guest_count: peopleCount,
                group_members: groupMembers,
              }
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
            setServerError("Payment was cancelled. Your selected pass is still held.");
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
      setServerError("Network error communicating with payment gateway.");
    }
  }

  async function onSubmit(data: AttendeeInput) {
    if (ticketTypes.length > 0 && !selectedTicketTypeId) {
      setServerError("Please select a pass tier before continuing.");
      scrollToTickets();
      return;
    }
    if (selectedTicket?.isUpcoming) {
      setServerError("Ticket sales for this tier have not started yet.");
      return;
    }
    if (selectedTicket?.isEnded) {
      setServerError("Ticket sales for this tier have concluded.");
      return;
    }
    if (selectedTicket?.remaining !== null && selectedTicket?.remaining !== undefined && selectedTicket.remaining <= 0) {
      setServerError("This pass category is sold out.");
      return;
    }

    if (effectivelyPaid) {
      await handlePaidSubmit(data);
      return;
    }

    setServerError("");
    const groupMembers = [
      { name: data.name, email: data.email, phone: data.phone, role: "primary" },
      ...memberNames.filter((n) => n.trim().length > 0).map((n) => ({ name: n.trim(), role: "member" })),
    ];

    const finalResponses = {
      ...customResponses,
      ...(availableEventDates.length > 1
        ? {
            attendance_date: selectedDate,
            selected_date: selectedDate,
            attendance_day_label: availableEventDates.find((d) => d.date === selectedDate)?.label || selectedDate,
          }
        : {}),
    };

    try {
      const result = await submitApplication(
        event.id,
        data,
        undefined,
        selectedTicketTypeId,
        {
          ...finalResponses,
          guest_count: peopleCount,
          group_members: groupMembers,
        }
      );

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
      setServerError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  }

  // ── Success Confirmation Screen ──
  if (success) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-5 font-[family-name:var(--font-geist)]"
        style={{
          background: "radial-gradient(ellipse 100% 50% at 50% -10%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)",
        }}
      >
        <div className="max-w-md w-full bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.06)] animate-in zoom-in-95 duration-300">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2.5">
            {success.type === "waitlisted" ? "Waitlist Confirmed" : "Registration Received"}
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-[-0.02em] text-neutral-900 mb-2">
            {success.type === "waitlisted" ? "You're on the waitlist!" : "Pass Confirmed!"}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5 font-normal">
            Thank you, <strong className="text-neutral-900 font-semibold">{success.attendeeName}</strong>. Your verified digital pass and barcode entry credentials have been issued and emailed.
          </p>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 text-xs text-left text-neutral-700 space-y-2.5 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Event</span>
              <span className="font-semibold text-neutral-900 truncate max-w-[180px] sm:max-w-none">{event.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Schedule</span>
              <span className="font-semibold text-neutral-900">{formattedSchedule.dateText}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Venue</span>
              <span className="font-semibold text-neutral-900 truncate max-w-[180px] sm:max-w-[200px]">{event.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
            <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digital QR Check-In Enabled at Gate</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#fafafa] text-neutral-900 font-[family-name:var(--font-geist)] antialiased ${
        selectedTicket ? "pb-28 sm:pb-32" : "pb-16 sm:pb-20"
      } ${staffScanLink ? "pt-12 sm:pt-14" : ""}`}
      style={{
        backgroundImage: "radial-gradient(ellipse 100% 45% at 50% -5%, #ede9fe 0%, #f5f3ff 35%, #fafafa 70%)",
      }}
    >
      {/* ── Top Mobile & Desktop Navigation Bar ── */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {branding.orgLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={branding.orgLogoUrl}
                alt="Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-neutral-200/80 shrink-0 shadow-2xs"
              />
            ) : (
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs"
                style={{ background: brandColor }}
              >
                <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 uppercase truncate block">
                {branding.orgName || "URPASS"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToTickets}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer hover:opacity-95"
              style={{ background: brandColor }}
            >
              <span>Select Pass</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Corporate Hero Showcase Section (Optimized for Mobile & Desktop) ── */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left: Event Visual Showcase */}
            <div className="lg:col-span-5">
              {eventImages && eventImages.length > 0 ? (
                <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] ring-1 ring-neutral-200/80 bg-neutral-100">
                  <EventImageCarousel images={eventImages} eventName={event.name} />
                </div>
              ) : (
                <div className="relative aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-neutral-50 border border-violet-100 flex flex-col items-center justify-center p-5 sm:p-6 text-center shadow-xs">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2.5 sm:mb-3.5 border border-violet-200 shadow-2xs"
                    style={{ background: "#f5f3ff", color: brandColor }}
                  >
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-brand mb-1">Official Event Pass</span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 max-w-xs">{event.name}</h3>
                </div>
              )}
            </div>

            {/* Right: Event Information & Key Metadata */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              {/* Badges Row (Horizontal Scroll on Mobile) */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 overflow-x-auto max-w-full scrollbar-none pb-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200/80 shrink-0">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                  {isOnline ? "Online Live" : isHybrid ? "Hybrid" : "In-Person"}
                </span>
                
                {availableDurations.length > 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                    <CalendarDays className="w-3 h-3 text-blue-600" />
                    Multi-Day
                  </span>
                )}

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  Zero Added Fees
                </span>
              </div>

              {/* Event Title */}
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-neutral-900 mb-3 sm:mb-4 leading-snug">
                {event.name}
              </h1>

              {/* Date & Venue Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full mb-4 sm:mb-6">
                
                {/* Date & Time Card */}
                <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-50 border border-violet-100/80 flex items-center justify-center shrink-0 text-violet-600 mt-0.5 shadow-2xs">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Date & Schedule</div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900 truncate tracking-tight">{formattedSchedule.dateText}</div>
                    <div className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 font-medium">{formattedSchedule.timeText}</div>
                  </div>
                </div>

                {/* Venue & Location Card */}
                <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center shrink-0 text-emerald-600 mt-0.5 shadow-2xs">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Venue & Gate</div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900 truncate tracking-tight">{event.venue}</div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-brand hover:underline font-medium mt-0.5"
                    >
                      <span>Google Maps Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Banner (Mobile & Desktop) */}
              <div className="flex items-center justify-between gap-3 w-full pt-3 sm:pt-4 border-t border-neutral-200/80">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-[0.08em] block font-bold">Passes From</span>
                  <div className="text-xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums tracking-tight">
                    {minStartingPrice === 0 ? "Free Entry" : `₹${minStartingPrice.toLocaleString("en-IN")}`}
                    {minStartingPrice > 0 && <span className="text-[11px] sm:text-xs font-medium text-neutral-500 ml-1">onwards</span>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToTickets}
                  className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-95 active:scale-[0.98]"
                  style={{ background: brandColor }}
                >
                  <span>Select Passes</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Main Two-Column Layout (Optimized for Small & Large Screens) ── */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column (7 cols on Desktop): Tabs & Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Sleek Segmented Tab Bar with Touch Horizontal Scroll */}
            <div className="flex p-1 bg-neutral-100/90 rounded-2xl border border-neutral-200/80 gap-1 overflow-x-auto max-w-full scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === "about"
                    ? "bg-white text-neutral-900 shadow-xs font-bold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === "tickets"
                    ? "bg-white text-neutral-900 shadow-xs font-bold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Passes ({ticketTypes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("venue")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === "venue"
                    ? "bg-white text-neutral-900 shadow-xs font-bold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Venue
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("terms")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === "terms"
                    ? "bg-white text-neutral-900 shadow-xs font-bold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Guidelines
              </button>
            </div>

            {/* Tab: About The Event */}
            {activeTab === "about" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
                  <h2 className="text-sm sm:text-lg font-bold tracking-tight text-neutral-900 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-brand" />
                    About The Experience
                  </h2>

                  {event.description ? (
                    <div className="space-y-3">
                      <div
                        className={`text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal whitespace-pre-wrap break-words ${
                          showFullDescription ? "" : "line-clamp-6"
                        }`}
                      >
                        {event.description}
                      </div>

                      {event.description.length > 300 && (
                        <button
                          type="button"
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-xs font-bold text-brand hover:underline transition-colors pt-1 cursor-pointer"
                        >
                          {showFullDescription ? "Show less" : "Read full overview →"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                      Join us for {event.name}. Secure your verified digital pass for seamless check-in at the gate.
                    </p>
                  )}
                </div>

                {/* Highlights Grid (3 cards on Desktop, 1 card on Mobile or Compact Grid) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 text-center shadow-2xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 sm:mb-2 border border-emerald-100/80">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h4 className="text-[11px] sm:text-xs font-bold text-neutral-900">Instant QR Entry</h4>
                    <p className="hidden sm:block text-[11px] text-neutral-500 mt-1 font-normal">Gate scanning in under 0.3s</p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 text-center shadow-2xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-1.5 sm:mb-2 border border-violet-100/80">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h4 className="text-[11px] sm:text-xs font-bold text-neutral-900">Zero Added Fees</h4>
                    <p className="hidden sm:block text-[11px] text-neutral-500 mt-1 font-normal">Direct organizer pricing</p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 text-center shadow-2xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5 sm:mb-2 border border-blue-100/80">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h4 className="text-[11px] sm:text-xs font-bold text-neutral-900">Direct Pass</h4>
                    <p className="hidden sm:block text-[11px] text-neutral-500 mt-1 font-normal">Instant email delivery</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Passes Summary */}
            {activeTab === "tickets" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
                  <h2 className="text-sm sm:text-lg font-bold tracking-tight text-neutral-900 mb-1">
                    Available Pass Categories
                  </h2>
                  <p className="text-xs text-neutral-500 mb-4 font-normal">
                    Select a tier below or on the booking box to reserve your pass.
                  </p>

                  <div className="space-y-2.5">
                    {ticketTypes.map((tt) => (
                      <div
                        key={tt.id}
                        className="p-3.5 sm:p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight">{tt.name}</h4>
                            {tt.duration_label && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-700">
                                {tt.duration_label}
                              </span>
                            )}
                          </div>
                          {tt.description && (
                            <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 font-normal line-clamp-2">{tt.description}</p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-extrabold text-neutral-900 tabular-nums">
                            {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectTicket(tt.id);
                              scrollToTickets();
                            }}
                            className="text-xs font-bold text-brand hover:underline mt-0.5 cursor-pointer"
                          >
                            Select →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Venue Details */}
            {activeTab === "venue" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
                  <h2 className="text-sm sm:text-lg font-bold tracking-tight text-neutral-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand" />
                    Venue & Location
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-800 font-semibold mb-3">{event.venue}</p>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-2.5">
                    <div className="text-xs text-neutral-600 font-normal leading-relaxed">
                      Present your digital QR pass on your phone at check-in gates for express scanning.
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-2xs"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Entry Guidelines */}
            {activeTab === "terms" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-7 space-y-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
                  <h2 className="text-sm sm:text-lg font-bold tracking-tight text-neutral-900 mb-2">
                    Entry Guidelines & Terms
                  </h2>
                  <ul className="space-y-2 text-xs text-neutral-600 leading-relaxed list-disc list-inside font-normal">
                    <li>Entry is permitted strictly with a verified digital QR pass.</li>
                    <li>Each pass includes a cryptographically signed QR token. Duplicate scans will be flagged.</li>
                    <li>Please carry a valid photo ID matching the primary pass holder name.</li>
                    <li>Admission is subject to organizer terms and venue capacity guidelines.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sleek Corporate Pass Selector & Checkout Terminal */}
          <div id="tickets-booking-section" className="lg:col-span-5 scroll-mt-16 sm:scroll-mt-20">
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-4 sm:p-7 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.05)] sticky top-16 sm:top-20">
              
              {/* Step 1 Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand block mb-0.5">
                    Step 1 of 2
                  </span>
                  <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900">Select Your Pass</h2>
                </div>

                {selectedTicket && (
                  <span className="text-[11px] sm:text-xs font-bold text-neutral-400">
                    {ticketTypes.length} Available
                  </span>
                )}
              </div>

              {/* Multi-Day Date Selector (Horizontal Touch Scroll Date Chips on Mobile) */}
              {availableEventDates.length > 1 && (
                <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-brand" />
                      {isSingleDayPass ? "Select Show Date" : "Festival Dates Included"}
                    </span>

                    {isSingleDayPass ? (
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 border border-violet-200/80">
                        1 Day Access
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                        All Days Pass
                      </span>
                    )}
                  </div>

                  {isSingleDayPass ? (
                    <div className="flex sm:grid sm:grid-cols-4 gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x">
                      {availableEventDates.map((opt) => {
                        const isDaySelected = selectedDate === opt.date;
                        return (
                          <button
                            key={opt.date}
                            type="button"
                            onClick={() => setSelectedDate(opt.date)}
                            className={`py-2 px-2.5 sm:px-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 min-w-[74px] sm:min-w-0 snap-start active:scale-95 ${
                              isDaySelected
                                ? "bg-neutral-900 text-white border-neutral-900 shadow-xs font-bold ring-1 ring-neutral-900"
                                : "bg-white text-neutral-800 border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50 font-medium"
                            }`}
                          >
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isDaySelected ? "text-neutral-300" : "text-neutral-400"}`}>
                              {opt.dayName}
                            </span>
                            <span className="text-xs font-extrabold mt-0.5 tabular-nums">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-600 font-normal">
                      Pass covers all {availableEventDates.length} days:{" "}
                      <strong className="text-neutral-900 font-semibold">
                        {availableEventDates.map((d) => d.label).join(" · ")}
                      </strong>
                    </p>
                  )}
                </div>
              )}

              {/* Pass Category Radio Cards */}
              <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                {filteredTickets.map((tt) => {
                  const isSoldOut = tt.remaining !== null && tt.remaining <= 0;
                  const isUpcoming = !!tt.isUpcoming;
                  const isEnded = !!tt.isEnded;
                  const isAvailable = !isUpcoming && !isEnded && !isSoldOut;
                  const isSelected = selectedTicketTypeId === tt.id;
                  const isDisabled = !isAvailable || (tt.price > 0 && !hasPaymentGateway);

                  const durationTag = tt.duration_label || (tt.duration_days ? `${tt.duration_days} Day${tt.duration_days > 1 ? "s" : ""}` : null);
                  const peopleTag = tt.included_guests && tt.included_guests > 1
                    ? `Valid for ${tt.included_guests} guests`
                    : "Single entry";

                  return (
                    <div
                      key={tt.id}
                      onClick={() => !isDisabled && handleSelectTicket(tt.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative active:scale-[0.99] ${
                        isSelected
                          ? "border-brand bg-brand-50/20 ring-1.5 ring-brand shadow-xs"
                          : isDisabled
                          ? "border-neutral-200 bg-neutral-50/60 opacity-50 cursor-not-allowed"
                          : "border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                            {durationTag && (
                              <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                                isSelected ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"
                              }`}>
                                {durationTag}
                              </span>
                            )}
                            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">
                              {peopleTag}
                            </span>
                          </div>

                          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight">
                            {tt.name}
                          </h3>

                          {tt.description && (
                            <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 leading-relaxed font-normal">
                              {tt.description}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end">
                          <div className="text-sm sm:text-base font-extrabold text-neutral-900 tabular-nums">
                            {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border-2 mt-1.5 sm:mt-2 flex items-center justify-center transition-colors ${
                              isSelected ? "border-brand bg-brand" : "border-neutral-300 bg-white"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </div>

                      {/* Remaining / Status Tag */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] sm:text-[11px]">
                        {isAvailable ? (
                          tt.remaining && tt.remaining <= 15 ? (
                            <span className="text-amber-600 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Only {tt.remaining} left
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Available
                            </span>
                          )
                        ) : isSoldOut ? (
                          <span className="text-red-500 font-semibold">Sold Out</span>
                        ) : (
                          <span className="text-neutral-400">Unavailable</span>
                        )}

                        <span className={`font-bold ${isSelected ? "text-brand" : "text-neutral-400"}`}>
                          {isSelected ? "Selected" : "Tap to Select"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Group Pass Capacity Stepper */}
              {selectedTicket && (selectedTicket.allow_extra_guests || (selectedTicket.included_guests && selectedTicket.included_guests > 1)) && (
                <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-brand" />
                        <span>Pass Capacity</span>
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 font-normal">
                        {selectedTicket.allow_extra_guests
                          ? `Covers ${selectedTicket.included_guests} guests. +₹${selectedTicket.extra_guest_price || 100}/extra.`
                          : `Fixed capacity: ${selectedTicket.included_guests} attendees.`}
                      </div>
                    </div>

                    {selectedTicket.allow_extra_guests ? (
                      <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl p-1 shadow-2xs">
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
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 flex items-center justify-center font-bold text-neutral-800 text-sm cursor-pointer active:scale-95"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-xs sm:text-sm text-neutral-900 tabular-nums">{peopleCount}</span>
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
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand text-white hover:opacity-90 disabled:opacity-30 flex items-center justify-center font-bold text-sm cursor-pointer active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-bold text-neutral-800">
                        {selectedTicket.included_guests} Guests
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Attendee Details Form */}
              <div id="attendee-details-section" className="pt-4 sm:pt-5 border-t border-neutral-200/80 space-y-3.5 sm:space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand block mb-0.5">
                    Step 2 of 2
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900">Primary Pass Holder</h3>
                  <p className="text-xs text-neutral-500 font-normal">Your verified QR pass will be issued to this email.</p>
                </div>

                <form id="apply-attendee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-600 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Srinithin S"
                        className={`${inputCls} pl-10`}
                        autoComplete="name"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-600 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="srinithin@example.com"
                        className={`${inputCls} pl-10`}
                        autoComplete="email"
                        inputMode="email"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
                  </div>

                  {/* WhatsApp / Phone */}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-600 mb-1">
                      WhatsApp / Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className={`${inputCls} pl-10`}
                        autoComplete="tel"
                        inputMode="tel"
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  {/* Additional Group Members (if capacity > 1) */}
                  {peopleCount > 1 && (
                    <div className="pt-2.5 border-t border-neutral-100 space-y-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                        Additional Guests ({peopleCount - 1})
                      </span>
                      {Array.from({ length: peopleCount - 1 }).map((_, idx) => (
                        <div key={idx} className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                          <input
                            type="text"
                            placeholder={`Guest #${idx + 2} Full Name`}
                            value={memberNames[idx] || ""}
                            onChange={(e) => {
                              const updated = [...memberNames];
                              updated[idx] = e.target.value;
                              setMemberNames(updated);
                            }}
                            className={`${inputCls} pl-9 text-xs`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom Organizer Questions */}
                  {event.custom_fields && event.custom_fields.length > 0 && (
                    <div className="pt-2.5 border-t border-neutral-100 space-y-2.5">
                      <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                        Registration Details
                      </span>
                      {event.custom_fields.map((field) => (
                        <div key={field.id}>
                          <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-600 mb-1">
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
                                <option value="">Select option...</option>
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
                                className="w-4 h-4 rounded bg-white border-neutral-300 text-brand focus:ring-brand"
                              />
                              <span>Confirm and Agree</span>
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

                  {/* Payment Summary Ledger */}
                  <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-700">
                      <span className="truncate max-w-[180px] sm:max-w-none">{selectedTicket?.name || "Standard Pass"} {selectedTicket?.duration_label ? `(${selectedTicket.duration_label})` : ""}</span>
                      <span className="font-bold text-neutral-900 tabular-nums shrink-0">
                        {baseTicketPrice === 0 ? "Free" : `₹${baseTicketPrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    {availableEventDates.length > 1 && (
                      <div className="flex justify-between text-neutral-600">
                        <span>Show Date</span>
                        <span className="font-semibold text-brand">
                          {isSingleDayPass
                            ? availableEventDates.find((d) => d.date === selectedDate)?.label || selectedDate
                            : "All Days"}
                        </span>
                      </div>
                    )}

                    {extraGuestsCount > 0 && (
                      <div className="flex justify-between text-brand font-medium">
                        <span>Extra Attendees ({extraGuestsCount} × ₹{extraPrice})</span>
                        <span className="tabular-nums">+₹{extraGuestsTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Convenience & Booking Fee</span>
                      <span>₹0 (Waived)</span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold">
                      <span className="text-xs sm:text-sm text-neutral-900 font-bold">Total Amount</span>
                      <span className="text-lg sm:text-xl font-black text-neutral-900 tabular-nums">
                        {effectiveTicketPrice === 0 ? "Free" : `₹${effectiveTicketPrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>

                  {serverError && (
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {paymentBlocked && (
                    <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>Payment gateway is currently being initialized by the organizer.</span>
                    </div>
                  )}

                  {/* Corporate UrPass CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || paymentPending || paymentBlocked}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: brandColor }}
                  >
                    {(isSubmitting || paymentPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                    {paymentPending
                      ? "Opening Razorpay Checkout…"
                      : isSubmitting
                      ? "Confirming Registration…"
                      : effectivelyPaid
                      ? `Proceed to Pay ₹${effectiveTicketPrice.toLocaleString("en-IN")}`
                      : "Claim Free Pass Now"}
                    {!isSubmitting && !paymentPending && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center justify-center gap-2.5 text-[10px] sm:text-[11px] text-neutral-500 pt-1">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3 h-3 text-brand" /> Instant QR Pass
                    </span>
                  </div>
                </form>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Mobile Sticky Floating Action Bar (Clean White with Safe Area Inset) ── */}
      {selectedTicket && (
        <aside
          aria-label="Booking bar"
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-200/90 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] py-2.5 px-4 transition-all"
          style={{ paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-bold text-neutral-900 truncate">
                  {selectedTicket.name}
                </span>
                {selectedTicket.duration_label && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-100 text-neutral-700 shrink-0">
                    {selectedTicket.duration_label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-neutral-900 tabular-nums">
                  {effectiveTicketPrice === 0 ? "Free" : `₹${effectiveTicketPrice.toLocaleString("en-IN")}`}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  · {peopleCount} {peopleCount === 1 ? "guest" : "guests"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFloatingBookClick}
              disabled={isSubmitting || paymentPending || paymentBlocked}
              className="inline-flex items-center justify-center gap-1.5 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0 hover:opacity-95 active:scale-[0.97]"
              style={{ background: brandColor }}
            >
              {isSubmitting || paymentPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  <span>{effectivelyPaid ? `Book · ₹${effectiveTicketPrice.toLocaleString("en-IN")}` : "Get Pass"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </aside>
      )}

    </div>
  );
}
