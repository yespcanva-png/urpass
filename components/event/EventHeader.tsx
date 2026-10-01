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

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/e/${event.apply_slug || event.id}`;

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

  return (
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
              href={`/e/${event.apply_slug || event.id}`}
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
  );
}
