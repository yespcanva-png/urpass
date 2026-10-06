"use client";

import { useState, useMemo, useEffect } from "react";
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
  Clock,
  ExternalLink,
  Info,
  Check,
  ChevronRight,
  Flame,
  Zap,
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
  "w-full bg-neutral-900/60 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20 hover:border-neutral-600";

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
        theme: { color: branding.brandColor || "#E11D48" },
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
              finalResponses
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

  // Success Confirmation Screen
  if (success) {
    return (
      <div className="min-h-screen bg-[#0d0e15] text-white flex flex-col items-center justify-center p-5">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            {success.type === "waitlisted" ? "Waitlist Confirmed" : "Registration Received"}
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            {success.type === "waitlisted" ? "You're on the waitlist!" : "Application Submitted!"}
          </h1>

          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            Thank you, <strong className="text-white">{success.attendeeName}</strong>. We have sent the pass confirmation and booking details to your email address.
          </p>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-left text-neutral-300 space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-neutral-500">Event</span>
              <span className="font-semibold text-white">{event.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Date</span>
              <span className="font-semibold text-white">{formattedSchedule.dateText}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Venue</span>
              <span className="font-semibold text-white">{event.venue}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500">
            Pass verification will be conducted at the venue via digital QR scanner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0c0d14] text-neutral-100 selection:bg-red-500 selection:text-white ${selectedTicket ? "pb-32" : "pb-20"} ${staffScanLink ? "pt-14" : ""}`}>
      
      {/* ── Top Navigation Bar (BookMyShow Dark Style) ── */}
      <nav className="sticky top-0 z-40 bg-[#0c0d14]/90 backdrop-blur-xl border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {branding.orgLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.orgLogoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-neutral-700 shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-red-600/30">
                <Ticket className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white uppercase truncate block">
                {branding.orgName || "URPASS EVENTS"}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Official Box Office
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTickets}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-600/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Book Passes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Showcase Section (Cinematic BMS Backdrop) ── */}
      <section className="relative overflow-hidden border-b border-neutral-800/80 bg-gradient-to-b from-[#161726] via-[#0f101a] to-[#0c0d14]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Event Poster / Image Showcase */}
            <div className="lg:col-span-5">
              {eventImages && eventImages.length > 0 ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-neutral-900">
                  <EventImageCarousel images={eventImages} eventName={event.name} />
                </div>
              ) : (
                <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Official Event Pass</span>
                  <h3 className="text-xl font-bold text-white max-w-xs">{event.name}</h3>
                </div>
              )}
            </div>

            {/* Right: Event Information & Key Metadata */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  {isOnline ? "Online Live Event" : isHybrid ? "Hybrid Experience" : "Live Event & Fest"}
                </span>
                
                {availableDurations.length > 1 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Multi-Day Schedule
                  </span>
                )}

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5" />
                  Zero Platform Fees
                </span>
              </div>

              {/* Event Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
                {event.name}
              </h1>

              {/* Price & Venue Callout Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-6">
                
                {/* Date & Time Pill */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                  <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 mt-0.5">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-400">Date & Show Timings</div>
                    <div className="text-sm font-bold text-white truncate">{formattedSchedule.dateText}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{formattedSchedule.timeText}</div>
                  </div>
                </div>

                {/* Venue & Location Pill */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-400">Venue & City</div>
                    <div className="text-sm font-bold text-white truncate">{event.venue}</div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium mt-0.5"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="flex flex-wrap items-center gap-4 w-full pt-4 border-t border-white/[0.08]">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold">Passes From</span>
                  <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                    {minStartingPrice === 0 ? "Free Entry" : `₹${minStartingPrice.toLocaleString("en-IN")}`}
                    {minStartingPrice > 0 && <span className="text-xs font-normal text-neutral-400 ml-1.5">onwards</span>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToTickets}
                  className="ml-auto px-7 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Select Passes & Register</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Main Two-Column Layout (Content on Left, Booking Box on Right) ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (7 cols on Desktop): Tabs & Information */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Section Tab Bar */}
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === "about"
                    ? "bg-white text-neutral-950 shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                About The Event
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === "tickets"
                    ? "bg-white text-neutral-950 shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Pass Categories ({ticketTypes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("venue")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === "venue"
                    ? "bg-white text-neutral-950 shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Venue Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("terms")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === "terms"
                    ? "bg-white text-neutral-950 shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Entry Guidelines
              </button>
            </div>

            {/* Tab: About The Event */}
            {activeTab === "about" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 sm:p-7">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-red-500" />
                    About The Experience
                  </h2>

                  {event.description ? (
                    <div className="space-y-3">
                      <div
                        className={`text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap break-words ${
                          showFullDescription ? "" : "line-clamp-6"
                        }`}
                      >
                        {event.description}
                      </div>

                      {event.description.length > 300 && (
                        <button
                          type="button"
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors pt-1 cursor-pointer"
                        >
                          {showFullDescription ? "Show less" : "Read full overview →"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400">
                      Join us for {event.name}. Secure your verified digital pass for seamless check-in at the gate.
                    </p>
                  )}
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-center">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Instant QR Entry</h4>
                    <p className="text-[11px] text-neutral-400 mt-1">Direct scan at gates without ticket queues</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Zero Convenience Fee</h4>
                    <p className="text-[11px] text-neutral-400 mt-1">100% transparent pricing directly from organizer</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2">
                      <Mail className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Digital Pass Delivery</h4>
                    <p className="text-[11px] text-neutral-400 mt-1">Instant delivery via Email, SMS & WhatsApp</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Passes Summary */}
            {activeTab === "tickets" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 sm:p-7">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Available Pass Categories
                  </h2>
                  <p className="text-xs text-neutral-400 mb-6">
                    Select a tier on the booking panel on the right to reserve your spot.
                  </p>

                  <div className="space-y-3">
                    {ticketTypes.map((tt) => (
                      <div
                        key={tt.id}
                        className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{tt.name}</h4>
                            {tt.duration_label && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300">
                                {tt.duration_label}
                              </span>
                            )}
                          </div>
                          {tt.description && (
                            <p className="text-xs text-neutral-400 mt-1">{tt.description}</p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-extrabold text-white tabular-nums">
                            {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectTicket(tt.id);
                              scrollToTickets();
                            }}
                            className="text-xs font-bold text-red-400 hover:underline mt-1 cursor-pointer"
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
                <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 sm:p-7">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Venue & Location
                  </h2>
                  <p className="text-sm text-neutral-300 font-medium mb-4">{event.venue}</p>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="text-xs text-neutral-400">
                      Show your QR pass on your mobile phone at the gate scanners for express validation.
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Entry Guidelines */}
            {activeTab === "terms" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 sm:p-7 space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Terms & Entry Guidelines
                  </h2>
                  <ul className="space-y-2.5 text-xs text-neutral-300 leading-relaxed list-disc list-inside">
                    <li>Entry is permitted only with a valid digital QR pass generated through the official portal.</li>
                    <li>Each pass contains a cryptographically signed one-time QR code. Duplicated or forwarded scans will be flagged at the gate.</li>
                    <li>Please carry a valid government photo ID matching the primary pass holder name.</li>
                    <li>Organizers reserve the right of admission in accordance with local safety and venue capacity regulations.</li>
                    <li>Passes once booked are non-transferable unless permitted by the event organizer.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Right Column (5 cols on Desktop): BookMyShow Interactive Pass Selector & Checkout Card */}
          <div id="tickets-booking-section" className="lg:col-span-5 scroll-mt-20">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl sticky top-20">
              
              {/* Step 1 Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-0.5">
                    Step 1 of 2
                  </span>
                  <h2 className="text-lg font-bold text-white">Select Your Pass</h2>
                </div>

                {selectedTicket && (
                  <span className="text-xs font-bold text-neutral-400">
                    {ticketTypes.length} Available
                  </span>
                )}
              </div>

              {/* Multi-Day Date Selector (BookMyShow Horizontal Date Chips) */}
              {availableEventDates.length > 1 && (
                <div className="mb-5 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-red-500" />
                      {isSingleDayPass ? "Select Show Date" : "Festival Dates Included"}
                    </span>

                    {isSingleDayPass ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                        1 Day Access
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        All Days Pass
                      </span>
                    )}
                  </div>

                  {isSingleDayPass ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                      {availableEventDates.map((opt) => {
                        const isDaySelected = selectedDate === opt.date;
                        return (
                          <button
                            key={opt.date}
                            type="button"
                            onClick={() => setSelectedDate(opt.date)}
                            className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isDaySelected
                                ? "bg-gradient-to-br from-red-600 to-rose-600 text-white border-transparent shadow-md shadow-red-600/30 ring-2 ring-red-500/50 font-bold"
                                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 font-medium"
                            }`}
                          >
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDaySelected ? "text-white/90" : "text-neutral-500"}`}>
                              {opt.dayName}
                            </span>
                            <span className="text-xs font-extrabold mt-0.5">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">
                      Pass covers all {availableEventDates.length} days:{" "}
                      <strong className="text-white">
                        {availableEventDates.map((d) => d.label).join(" · ")}
                      </strong>
                    </p>
                  )}
                </div>
              )}

              {/* Pass Category Radio Cards */}
              <div className="space-y-3 mb-6">
                {filteredTickets.map((tt) => {
                  const isSoldOut = tt.remaining !== null && tt.remaining <= 0;
                  const isUpcoming = !!tt.isUpcoming;
                  const isEnded = !!tt.isEnded;
                  const isAvailable = !isUpcoming && !isEnded && !isSoldOut;
                  const isSelected = selectedTicketTypeId === tt.id;
                  const isDisabled = !isAvailable || (tt.price > 0 && !hasPaymentGateway);

                  const durationTag = tt.duration_label || (tt.duration_days ? `${tt.duration_days} Day${tt.duration_days > 1 ? "s" : ""}` : null);
                  const peopleTag = tt.included_guests && tt.included_guests > 1
                    ? `Valid for ${tt.included_guests} people`
                    : "Single pass";

                  return (
                    <div
                      key={tt.id}
                      onClick={() => !isDisabled && handleSelectTicket(tt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "border-red-500 bg-red-950/20 ring-1.5 ring-red-500/60 shadow-lg shadow-red-500/10"
                          : isDisabled
                          ? "border-neutral-800 bg-neutral-950/40 opacity-50 cursor-not-allowed"
                          : "border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 hover:bg-neutral-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            {durationTag && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                                isSelected ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-300"
                              }`}>
                                {durationTag}
                              </span>
                            )}
                            <span className="text-[11px] text-neutral-400 font-medium">
                              {peopleTag}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white tracking-tight">
                            {tt.name}
                          </h3>

                          {tt.description && (
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              {tt.description}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end">
                          <div className="text-lg font-black text-white tabular-nums">
                            {tt.price === 0 ? "Free" : `₹${(tt.price / 100).toLocaleString("en-IN")}`}
                          </div>
                          <span className={`w-4 h-4 rounded-full border-2 mt-2 flex items-center justify-center transition-colors ${
                            isSelected ? "border-red-500 bg-red-500" : "border-neutral-700 bg-neutral-900"
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </div>

                      {/* Remaining / Status Tag */}
                      <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                        {isAvailable ? (
                          tt.remaining && tt.remaining <= 15 ? (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <Flame className="w-3 h-3" /> Only {tt.remaining} passes left
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Available
                            </span>
                          )
                        ) : isSoldOut ? (
                          <span className="text-red-400 font-semibold">Sold Out</span>
                        ) : (
                          <span className="text-neutral-500">Unavailable</span>
                        )}

                        <span className={`font-bold ${isSelected ? "text-red-400" : "text-neutral-500"}`}>
                          {isSelected ? "Selected" : "Tap to Select"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Group Pass Stepper (if selected pass is group or allows extra people) */}
              {selectedTicket && (selectedTicket.allow_extra_guests || (selectedTicket.included_guests && selectedTicket.included_guests > 1)) && (
                <div className="mb-6 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-red-400" />
                        <span>People Covered</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {selectedTicket.allow_extra_guests
                          ? `Pass covers ${selectedTicket.included_guests} guests. +₹${selectedTicket.extra_guest_price || 100}/extra.`
                          : `Fixed capacity: ${selectedTicket.included_guests} guests.`}
                      </div>
                    </div>

                    {selectedTicket.allow_extra_guests ? (
                      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg p-1">
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
                          className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 flex items-center justify-center font-bold text-white text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-white">{peopleCount}</span>
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
                          className="w-7 h-7 rounded bg-red-600 hover:bg-red-500 disabled:opacity-30 flex items-center justify-center font-bold text-white text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-xs font-bold text-white">
                        {selectedTicket.included_guests} Guests
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Attendee Details Form */}
              <div id="attendee-details-section" className="pt-5 border-t border-neutral-800 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-0.5">
                    Step 2 of 2
                  </span>
                  <h3 className="text-base font-bold text-white">Primary Pass Holder</h3>
                  <p className="text-xs text-neutral-400">Digital pass and QR verification code will be sent here.</p>
                </div>

                <form id="apply-attendee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Srinithin S"
                        className={`${inputCls} pl-10`}
                        autoComplete="name"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="srinithin@example.com"
                        className={`${inputCls} pl-10`}
                        autoComplete="email"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>

                  {/* WhatsApp / Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      WhatsApp / Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
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
                    <div className="pt-3 border-t border-neutral-800 space-y-3">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Registration Details
                      </span>
                      {event.custom_fields.map((field) => (
                        <div key={field.id}>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                            {field.label} {field.required && <span className="text-red-400">*</span>}
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
                                  <option key={opt} value={opt} className="bg-neutral-900 text-white">
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          ) : field.type === "checkbox" ? (
                            <label className="flex items-center gap-2 cursor-pointer py-1 text-xs text-neutral-300 font-medium">
                              <input
                                type="checkbox"
                                checked={!!customResponses[field.id]}
                                onChange={(e) =>
                                  setCustomResponses({ ...customResponses, [field.id]: e.target.checked })
                                }
                                className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-red-600 focus:ring-red-500"
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

                  {/* Payment Summary Ledger (BMS Style) */}
                  <div className="mt-5 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-300">
                      <span>{selectedTicket?.name || "Standard Pass"} {selectedTicket?.duration_label ? `(${selectedTicket.duration_label})` : ""}</span>
                      <span className="font-bold text-white tabular-nums">
                        {baseTicketPrice === 0 ? "Free" : `₹${baseTicketPrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    {availableEventDates.length > 1 && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Show Date</span>
                        <span className="font-semibold text-red-400">
                          {isSingleDayPass
                            ? availableEventDates.find((d) => d.date === selectedDate)?.label || selectedDate
                            : "All Days"}
                        </span>
                      </div>
                    )}

                    {extraGuestsCount > 0 && (
                      <div className="flex justify-between text-red-400 font-medium">
                        <span>Extra Attendees ({extraGuestsCount} × ₹{extraPrice})</span>
                        <span>+₹{extraGuestsTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Convenience & Booking Fee</span>
                      <span>₹0 (Waived)</span>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline font-bold">
                      <span className="text-sm text-white">Total Amount</span>
                      <span className="text-xl font-black text-white tabular-nums">
                        {effectiveTicketPrice === 0 ? "Free" : `₹${effectiveTicketPrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>

                  {serverError && (
                    <div className="flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {paymentBlocked && (
                    <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>Payment gateway is currently being initialized by the organizer.</span>
                    </div>
                  )}

                  {/* Big BookMyShow CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || paymentPending || paymentBlocked}
                    className="w-full py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-red-600/30 hover:shadow-2xl hover:shadow-red-600/40 flex items-center justify-center gap-2 cursor-pointer mt-2"
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

                  <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-400 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Secured
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-red-400" /> Instant QR Pass
                    </span>
                  </div>
                </form>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Mobile Sticky Floating Action Bar (BMS Style) ── */}
      {selectedTicket && (
        <aside
          aria-label="Booking bar"
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0c0d14]/95 backdrop-blur-xl border-t border-neutral-800 shadow-2xl py-3 px-4 transition-all"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-bold text-white truncate">
                  {selectedTicket.name}
                </span>
                {selectedTicket.duration_label && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-800 text-neutral-300 shrink-0">
                    {selectedTicket.duration_label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-white tabular-nums">
                  {effectiveTicketPrice === 0 ? "Free" : `₹${effectiveTicketPrice.toLocaleString("en-IN")}`}
                </span>
                <span className="text-[11px] text-neutral-400">
                  · {peopleCount} {peopleCount === 1 ? "guest" : "guests"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFloatingBookClick}
              disabled={isSubmitting || paymentPending || paymentBlocked}
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
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
