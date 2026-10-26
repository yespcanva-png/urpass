"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Share2,
  Check,
  ChevronRight,
  ExternalLink,
  Users,
  Building2,
  Briefcase,
  Mail,
  Phone,
  User,
  Ticket,
  Lock,
  Loader2,
  ArrowRight,
  Download,
  AlertCircle,
  HelpCircle,
  Award,
} from "lucide-react";
import { submitApplication } from "@/app/actions/attendees";

export interface CorporateEventData {
  id: string;
  name: string;
  description: string;
  eventDate: string;
  endDate?: string | null;
  startTime: string;
  endTime?: string | null;
  venue: string;
  venueAddress?: string;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  city: string;
  category: string;
  categoryLabel: string;
  attendeeLimit: number;
  slug: string;
  organizerName: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    description?: string | null;
    price: number;
    capacity?: number | null;
    status: string;
  }>;
}

interface CorporateEventPageProps {
  event: CorporateEventData;
}

function formatFullDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr?: string | null): string {
  if (!timeStr) return "";
  try {
    const [h, m] = timeStr.split(":");
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedH = hours % 12 || 12;
    return `${formattedH}:${m} ${ampm} IST`;
  } catch {
    return timeStr;
  }
}

export default function CorporateEventPage({ event }: CorporateEventPageProps) {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Registration Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [designation, setDesignation] = useState("");

  const defaultTicket = event.ticketTypes[0] || null;
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    defaultTicket?.id || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState<{
    passToken?: string;
    message?: string;
  } | null>(null);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.name);
    const details = encodeURIComponent(
      `${event.description}\n\nVenue: ${event.venue}\nOfficial Pass by UrPass: https://urpass.space/events/${event.slug}`
    );
    const location = encodeURIComponent(`${event.venue}, ${event.city}`);

    // Dates format: YYYYMMDDTHHmmssZ
    const cleanDate = event.eventDate.replace(/-/g, "");
    const startTime = (event.startTime || "18:30:00").replace(/:/g, "").slice(0, 4);
    const endTime = (event.endTime || "21:30:00").replace(/:/g, "").slice(0, 4);

    const dates = `${cleanDate}T${startTime}00Z/${cleanDate}T${endTime}00Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  const downloadIcsFile = () => {
    const cleanDate = event.eventDate.replace(/-/g, "");
    const startTime = (event.startTime || "18:30:00").replace(/:/g, "").slice(0, 4);
    const endTime = (event.endTime || "21:30:00").replace(/:/g, "").slice(0, 4);

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//UrPass//Event Calendar//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
      `LOCATION:${event.venue}, ${event.city}`,
      `DTSTART:${cleanDate}T${startTime}00Z`,
      `DTEND:${cleanDate}T${endTime}00Z`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Please enter your full legal or professional name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please enter a valid business email address.");
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setFormError("Please enter a valid mobile number for WhatsApp pass delivery.");
      return;
    }
    if (!organization.trim()) {
      setFormError("Please enter your company, startup, or fund name.");
      return;
    }
    if (!designation.trim()) {
      setFormError("Please enter your professional designation or role.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitApplication(
        event.id,
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          pass_type: "participant",
          whatsapp_consent: true,
        },
        undefined,
        selectedTicketId || undefined,
        {
          organization: organization.trim(),
          designation: designation.trim(),
        }
      );

      if (res?.error) {
        setFormError(res.error);
      } else if (res?.passToken) {
        setRegisteredSuccess({ passToken: res.passToken });
        router.push(`/pass/${res.passToken}`);
      } else {
        setRegisteredSuccess({
          message:
            "Your registration has been submitted and is under executive host review.",
        });
      }
    } catch {
      setFormError("Registration could not be completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTicket =
    event.ticketTypes.find((t) => t.id === selectedTicketId) || defaultTicket;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans antialiased selection:bg-violet-100 selection:text-violet-900">
      {/* ── Top Executive Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              <span>Explore Marketplace</span>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-neutral-300" />

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Corporate Host</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 transition-all cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Quick Register Anchor */}
            <a
              href="#register"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-600/30 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              }}
            >
              <span>Get Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ── Executive Hero Showcase Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/60 via-neutral-50/30 to-white pt-10 pb-12 border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-violet-100 text-violet-800 border border-violet-200/80">
              <Sparkles className="w-3 h-3 text-violet-600" />
              <span>{event.categoryLabel}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200/80">
              <Users className="w-3.5 h-3.5 text-neutral-500" />
              <span>Flagship Conference</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{event.organizerName} Official</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.08] max-w-4xl">
            {event.name}
          </h1>

          {/* Editorial Subheading */}
          <p className="text-base sm:text-lg text-neutral-600 font-normal mt-4 max-w-3xl leading-relaxed">
            {event.description}
          </p>

          {/* Key Metadata Pill Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
            {/* 1. Date & Time */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Date &amp; Time
                </p>
                <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5 truncate">
                  {formatFullDate(event.eventDate)}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {formatTime(event.startTime)} – {formatTime(event.endTime)}
                </p>
              </div>
            </div>

            {/* 2. Venue & City */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Venue &amp; Location
                </p>
                <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5 truncate">
                  {event.venue}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${event.venue}, ${event.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-violet-700 hover:underline font-semibold mt-0.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* 3. Pass Pricing */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Pass Access
                </p>
                <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5">
                  Complimentary Entry
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Includes Mixer &amp; Demos
                </p>
              </div>
            </div>

            {/* 4. Host & Trust */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Organized By
                </p>
                <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5 truncate">
                  {event.organizerName}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Verified Host Network
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Two-Column Corporate Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ── Left Column (Content & Experience) ── */}
          <div className="lg:col-span-7 space-y-10">
            {/* 1. Hero Event Banner Visual */}
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-200/80 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)]">
              {event.bannerUrl ? (
                <Image
                  src={event.bannerUrl}
                  alt={event.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-900 via-indigo-950 to-neutral-950 text-white p-8 text-center">
                  <Sparkles className="w-12 h-12 text-violet-400 mb-3" />
                  <h2 className="text-2xl font-black">{event.name}</h2>
                </div>
              )}

              {/* Verified Pass Badge Pill Overlay */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Instant QR Entry Pass</span>
              </div>
            </div>

            {/* 2. Executive Overview */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                About the Gathering
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                The <strong>{event.name}</strong> brings together active founders, CTOs, AI
                practitioners, and venture partners for an evening of high-signal discussions,
                practical architectural insights, and closed-door relationship building.
              </p>

              {/* Feature Grid Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs mb-2.5">
                    01
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Curated Peer Founders
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Closed-door attendance strictly vetted for venture-backed founders and technology leaders.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2.5">
                    02
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Deeptech &amp; AI Showcases
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Live product demos and architectural insights from teams building autonomous agents and infrastructure.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2.5">
                    03
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Zero Booth Spam
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    No vendor booths or aggressive pitch decks — strictly high-signal peer networking and discussions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-2.5">
                    04
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Instant Digital Pass
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Digital QR pass delivered directly to WhatsApp &amp; Email with 1-second entrance check-in.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Event Schedule & Agenda Timeline */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                    Event Schedule
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Timeline subject to minor updates on event day
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 font-bold text-[11px] border border-violet-200">
                  IST (UTC+5:30)
                </span>
              </div>

              <div className="space-y-4">
                {/* Slot 1 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
                  <div className="w-20 text-xs font-black text-violet-700 shrink-0 pt-0.5">
                    6:30 PM
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Guest Check-in &amp; Welcome Drinks
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Fast contactless QR pass check-in at Gate 1, badge collection, and informal mixer.
                    </p>
                  </div>
                </div>

                {/* Slot 2 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
                  <div className="w-20 text-xs font-black text-violet-700 shrink-0 pt-0.5">
                    7:00 PM
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Fireside Session: Scaling AI Systems from India to Global Enterprise
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Pragmatic breakdown on latency, token costs, evaluation harnesses, and enterprise procurement.
                    </p>
                  </div>
                </div>

                {/* Slot 3 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
                  <div className="w-20 text-xs font-black text-violet-700 shrink-0 pt-0.5">
                    7:45 PM
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Founder Lightning Demos &amp; Architecture Breakdowns
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Four rapid 5-minute technical demos highlighting production LLM and agent stacks.
                    </p>
                  </div>
                </div>

                {/* Slot 4 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
                  <div className="w-20 text-xs font-black text-violet-700 shrink-0 pt-0.5">
                    8:30 PM
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Curated Mixer, Cocktails &amp; Dinner
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Full open networking on the private rooftop lounge with drinks and chef-curated canapés.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Venue & Directions */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mb-2">
                Venue Location
              </h2>
              <p className="text-xs text-neutral-500 mb-5">
                {event.venueAddress || `${event.venue}, ${event.city}`}
              </p>

              <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-neutral-900">
                      {event.venue}
                    </p>
                    <p className="text-[11px] text-neutral-600">
                      Valet parking available at venue entrance
                    </p>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${event.venue}, ${event.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shrink-0 shadow-xs"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 5. FAQs */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    How do I receive my pass?
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Your digital pass is automatically generated and sent to both your email and WhatsApp number. You can also save it directly to Apple Wallet or your phone gallery.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Is there an entry fee?
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    No, admission to this session is complimentary for approved attendees, supported by our ecosystem partners and UrPass Zero Fee ticketing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Can I bring a team member?
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Due to room capacity restrictions, all attendees must register individually with their company email address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column (Sticky Executive Pass Booking Console) ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div
              id="register"
              className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-[0_16px_50px_-8px_rgba(0,0,0,0.08)] space-y-6"
            >
              {/* Header */}
              <div className="border-b border-neutral-100 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
                    Executive Pass
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Free Entry
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mt-2.5">
                  Reserve Your Pass
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Instant digital QR pass issued to WhatsApp &amp; Work Email
                </p>
              </div>

              {/* Success Message Banner */}
              {registeredSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Registration Confirmed!</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your digital pass has been issued. Redirecting you to your pass...
                  </p>
                </div>
              )}

              {/* Form Error Banner */}
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Corporate Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="attendee-name"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="attendee-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs sm:text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label
                    htmlFor="attendee-email"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5"
                  >
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="attendee-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vikram@yourstartup.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs sm:text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="attendee-phone"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5"
                  >
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="attendee-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs sm:text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Your QR pass will be messaged to this number on registration.
                  </p>
                </div>

                {/* Company / Startup Name */}
                <div>
                  <label
                    htmlFor="attendee-org"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5"
                  >
                    Company / Fund <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="attendee-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Apex Labs / VenturePeak"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs sm:text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Designation / Role */}
                <div>
                  <label
                    htmlFor="attendee-role"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5"
                  >
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="attendee-role"
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Co-Founder &amp; CTO"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs sm:text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit Action CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.99] transition-all shadow-md shadow-violet-600/30 hover:shadow-violet-600/40 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Issuing Digital Pass…</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Trust & Guarantee Badges */}
              <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Enterprise 256-bit SSL encryption. Private data.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant contactless QR check-in powered by UrPass.</span>
                </div>
              </div>

              {/* Add to Calendar Dropdown */}
              <div className="relative pt-2">
                <button
                  type="button"
                  onClick={() => setCalendarOpen((prev) => !prev)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-violet-600" />
                  <span>Add to Calendar</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      calendarOpen ? "rotate-90 text-violet-600" : ""
                    }`}
                  />
                </button>

                {calendarOpen && (
                  <div className="absolute left-0 right-0 mt-2 p-2 rounded-2xl bg-white border border-neutral-200 shadow-xl z-20 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <a
                      href={generateGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-violet-600" />
                      <span>Google Calendar</span>
                    </a>
                    <button
                      type="button"
                      onClick={downloadIcsFile}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Apple iCal / Outlook (.ics)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Corporate Footer ── */}
      <footer className="border-t border-neutral-200/80 bg-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            <div className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center text-[10px] font-black">
              U
            </div>
            <span>UrPass Official Event Experience</span>
          </div>
          <p>© {new Date().getFullYear()} UrPass. Zero commission event infrastructure.</p>
        </div>
      </footer>
    </div>
  );
}
