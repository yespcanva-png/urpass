"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ScanLine,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Share2,
  HelpCircle,
  X,
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  Radio,
  Store,
  CreditCard,
  ArrowRight,
  Sparkles,
  Globe,
} from "lucide-react";
import EventSubNav from "./EventSubNav";
import { cn } from "@/lib/utils";

interface EventHeaderProps {
  event: {
    id: string;
    name: string;
    status: string;
    event_date: string;
    start_time: string;
    end_time: string;
    venue: string;
    apply_slug?: string | null;
  };
  org?: {
    name: string;
    slug: string;
  } | null;
}

type StatusKey = "active" | "draft" | "completed" | "cancelled";

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; dot: string; cls: string }
> = {
  active: {
    label: "Active · Published",
    dot: "bg-emerald-500",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  draft: {
    label: "Draft",
    dot: "bg-neutral-400",
    cls: "bg-neutral-100 text-neutral-600 border-neutral-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-500",
    cls: "bg-blue-50 text-blue-700 border-blue-200/80",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-500",
    cls: "bg-red-50 text-red-600 border-red-200/80",
  },
};

function formatTime(t: string) {
  if (!t) return "";
  const parts = t.split(":");
  const h = parseInt(parts[0], 10);
  const m = parts[1] ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function EventHeader({ event, org }: EventHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);

  const statusKey = (
    event.status in STATUS_CONFIG ? event.status : "draft"
  ) as StatusKey;
  const statusCfg = STATUS_CONFIG[statusKey];

  const formattedDate = new Date(
    event.event_date + "T00:00:00"
  ).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : "https://urpass.space"}/events/${event.apply_slug || event.id}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const guideModules = [
    {
      icon: LayoutDashboard,
      title: "1. Overview & Live Stats",
      summary: "Monitor live turnout, attendance velocity, acceptance rates, duplicate event, and publish/unpublish.",
      link: `/event/${event.id}`,
    },
    {
      icon: CalendarDays,
      title: "2. Program & Multi-Track Agenda",
      summary: "Build multi-track schedules, manage speaker profiles, assign conference rooms, and detect schedule conflicts.",
      link: `/event/${event.id}/agenda`,
    },
    {
      icon: Ticket,
      title: "3. Registration & Ticket Tiers",
      summary: "Create free or paid ticket tiers, capacity caps, sales windows, GST settings, and customize passes in Ticket Studio.",
      link: `/event/${event.id}/tickets`,
    },
    {
      icon: Users,
      title: "4. Attendees & Waitlists",
      summary: "Review applicants, promote waitlist queue, import/export CSVs, generate passes in bulk, and send broadcast alerts.",
      link: `/event/${event.id}/attendees`,
    },
    {
      icon: Radio,
      title: "5. Operations & Live Ops",
      summary: "Monitor live occupancy, scan passes, check in walk-in attendees at onsite desk, and dispatch badge printing.",
      link: `/event/${event.id}/operations`,
    },
    {
      icon: Store,
      title: "6. Commercial (Exhibitors & Sponsors)",
      summary: "Allocate trade show booths, self-service exhibitor portals, lead retrieval QR capture, and sponsor deliverables.",
      link: `/event/${event.id}/exhibitors-sponsors`,
    },
    {
      icon: Sparkles,
      title: "7. Communications & Broadcasts",
      summary: "Automate transactional pass delivery, 24-hour reminder broadcasts, post-event surveys, and delivery logs.",
      link: `/event/${event.id}/communications`,
    },
    {
      icon: Globe,
      title: "8. Experience & Event Website",
      summary: "Custom event landing page, public registration URL (/e/[slug]), SEO metadata, agenda view, and branding.",
      link: `/event/${event.id}/website`,
    },
  ];

  return (
    <>
      {/* ── How to Use Guide Modal ───────────────────────────────────── */}
      {howToUseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                    How to Use URPASS Event Console
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Step-by-step walkthrough of features, workflows, and operational capabilities.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHowToUseOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {guideModules.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={idx}
                    href={mod.link}
                    onClick={() => setHowToUseOpen(false)}
                    className="group p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-violet-300 hover:shadow-xs transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-neutral-900 group-hover:text-violet-900 transition-colors">
                        <Icon className="w-4 h-4 text-violet-600" />
                        <span>{mod.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      {mod.summary}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-100">
              <Link
                href="/docs"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 hover:underline"
              >
                <span>Read Full Documentation &amp; REST API Reference</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setHowToUseOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-xs transition-colors"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-neutral-200/90 shadow-2xs">
        {/* ── 1. Top Executive Breadcrumbs & Quick Action Controls ────────── */}
        <div className="border-b border-neutral-150/70 px-4 lg:px-8 py-2.5 bg-neutral-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Breadcrumb Hierarchy */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium overflow-x-auto scrollbar-none"
            >
              {org ? (
                <>
                  <Link
                    href={`/org/${org.slug}`}
                    className="hover:text-neutral-900 transition-colors truncate max-w-[140px]"
                  >
                    {org.name}
                  </Link>
                  <ChevronRight className="w-3 h-3 text-neutral-300 shrink-0" />
                </>
              ) : null}

              <Link
                href="/dashboard/events"
                className="hover:text-neutral-900 transition-colors shrink-0"
              >
                Events
              </Link>
              <ChevronRight className="w-3 h-3 text-neutral-300 shrink-0" />

              <span className="font-semibold text-neutral-900 truncate max-w-[200px] sm:max-w-xs">
                {event.name}
              </span>
            </nav>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* How to Use Guide Button */}
              <button
                onClick={() => setHowToUseOpen(true)}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200/80 transition-colors cursor-pointer shadow-2xs"
                title="Event Quickstart & How to Use Guide"
              >
                <HelpCircle className="w-3.5 h-3.5 text-violet-600" />
                <span>How to Use</span>
              </button>

              {/* Copy Public Link */}
              <button
                onClick={handleCopyLink}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
                title="Copy event public registration link"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied Link</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-neutral-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              {/* Live Gate Scanner */}
              <Link
                href="/scan"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-colors"
                title="Open Entrance & Session Scanner"
              >
                <ScanLine className="w-3 h-3 text-neutral-400" />
                <span className="hidden sm:inline">Scanner</span>
              </Link>

              {/* Public Event Page */}
              <a
                href={`/events/${event.apply_slug || event.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors shadow-2xs"
              >
                <span>Live Page</span>
                <ExternalLink className="w-3 h-3 text-neutral-300" />
              </a>
            </div>
          </div>
        </div>

        {/* ── 2. Event Sub-Header (Identity & Contextual Metadata) ────────── */}
        <div className="px-4 lg:px-8 pt-5 pb-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
            <div className="min-w-0 flex-1 space-y-2">
              {/* Title & Status */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
                  {event.name}
                </h1>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0",
                    statusCfg.cls
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      statusCfg.dot,
                      statusKey === "active" ? "animate-pulse" : ""
                    )}
                  />
                  {statusCfg.label}
                </span>
              </div>

              {/* Clean Corporate Metadata Strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500 font-medium">
                <span className="inline-flex items-center gap-1.5 text-neutral-700">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{formattedDate}</span>
                </span>

                {event.start_time && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {formatTime(event.start_time)}
                      {event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
                    </span>
                  </span>
                )}

                {event.venue && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate max-w-[260px] sm:max-w-none">
                      {event.venue}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── 3. Pinned Tab Navigation ──────────────────────────────────── */}
          <EventSubNav eventId={event.id} />
        </div>
      </div>
    </>
  );
}
