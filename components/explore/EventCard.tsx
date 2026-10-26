"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  Ticket,
  ArrowRight,
  Share2,
  Check,
} from "lucide-react";
import type { ExploreEventItem } from "@/lib/explore/types";
import { formatPrice } from "@/lib/currency";
import { trackExploreEvent } from "@/lib/explore/analytics";

interface EventCardProps {
  event: ExploreEventItem;
  featured?: boolean;
  index?: number;
  onActionClick?: (
    event: ExploreEventItem,
    actionType: "get_tickets" | "apply"
  ) => void;
}

function formatEventDisplayDate(dateStr: string, timeStr?: string): string {
  try {
    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const dayNum = d.getDate();
    const year = d.getFullYear();
    let display = `${dayName}, ${monthName} ${dayNum}, ${year}`;

    if (timeStr) {
      const [hours, minutes] = timeStr.split(":");
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const formattedHours = h % 12 || 12;
      display += ` • ${formattedHours}:${minutes} ${ampm} IST`;
    }

    return display;
  } catch {
    return dateStr;
  }
}

export default function EventCard({
  event,
  featured = false,
  index,
  onActionClick,
}: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const priceLabel =
    event.isFree || event.minPricePaise === 0
      ? "Free"
      : `From ${formatPrice(event.minPricePaise, event.currency)}`;

  const eventUrl = `/explore/event/${encodeURIComponent(event.slug)}`;
  const actionLabel = event.approvalRequired
    ? "Request to Attend"
    : event.isFree || event.minPricePaise === 0
      ? "Register Free"
      : "Get Tickets";

  const actionType: "get_tickets" | "apply" = event.approvalRequired
    ? "apply"
    : "get_tickets";

  const availabilityHint =
    event.isFree || event.minPricePaise === 0 ? "Free Entry" : "Instant QR Pass";

  const handleCardClick = () => {
    trackExploreEvent("event_card_opened", {
      eventId: event.eventId,
      eventName: event.name,
      category: event.category,
      city: event.city,
      isFree: event.isFree,
    });
  };

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCardClick();
    if (onActionClick) {
      onActionClick(event, actionType);
    } else {
      window.location.href = eventUrl;
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${eventUrl}` : eventUrl;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Check out ${event.name} on UrPass Explore:`,
          url: fullUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const animationDelay =
    index !== undefined ? `${Math.min(index * 50, 400)}ms` : undefined;

  return (
    <article
      className="explore-scale-fade group relative flex flex-col rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-violet-950/6 hover:-translate-y-1.5 transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-violet-500/20 h-full"
      style={animationDelay ? { animationDelay } : undefined}
      aria-label={event.name}
    >
      {/* Clickable Full-Card Link */}
      <Link
        href={eventUrl}
        onClick={handleCardClick}
        className="absolute inset-0 z-10 focus:outline-none"
        aria-label={`View details and register for ${event.name}`}
      >
        <span className="sr-only">View event details</span>
      </Link>

      {/* Media Image / Fallback Container (16:10 Ratio) */}
      <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden shrink-0">
        {event.bannerUrl && !imageError ? (
          <Image
            src={event.bannerUrl}
            alt={event.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
            priority={featured}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-violet-900 via-indigo-950 to-neutral-950 text-white select-none">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/10 transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="w-6 h-6 text-violet-300" />
            </div>
            <p className="text-sm font-bold text-center text-white/90 line-clamp-1">
              {event.name}
            </p>
            <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider mt-1">
              {event.categoryLabel}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none z-10" />

        {/* Category Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-neutral-900/80 backdrop-blur-md text-white border border-white/20 shadow-sm">
            {event.categoryLabel}
          </span>
        </div>

        {/* Top Right: Featured Badge + Share Button */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 flex items-center gap-1.5">
          {featured && (
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-400 text-neutral-950 shadow-sm">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Featured</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this event"
            title="Share this event"
            className="w-7 h-7 rounded-full bg-neutral-900/80 hover:bg-neutral-900 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-sm active:scale-90"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-neutral-200" />
            )}
          </button>
        </div>

        {/* Availability Hint (Bottom Left over Image) */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-xs">
            <Ticket className="w-2.5 h-2.5 text-violet-300" />
            <span>{availabilityHint}</span>
          </span>
        </div>

        {/* Price Pill (Bottom Right over Image) */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black shadow-md ${
              event.isFree || event.minPricePaise === 0
                ? "bg-emerald-500 text-white"
                : "bg-white/95 backdrop-blur-md text-neutral-950 border border-neutral-200/60"
            }`}
          >
            {priceLabel}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          {/* Schedule Date & Time */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatEventDisplayDate(event.eventDate, event.startTime)}</span>
          </div>

          {/* Event Title */}
          <h3 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight leading-snug group-hover:text-violet-700 transition-colors line-clamp-2">
            {event.name}
          </h3>

          {/* Organizer Attribution */}
          <p className="text-[11px] font-medium text-neutral-500 flex items-center gap-1">
            <span>By {event.organizerName || "Verified Host"}</span>
            <ShieldCheck className="w-3 h-3 text-violet-600 inline shrink-0" />
          </p>

          {/* Description snippet */}
          {event.description && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* Footer: Venue & Action Button (Register Free / Get Tickets / Apply) */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate font-medium">{event.venue || event.city}</span>
          </div>

          {/* Clear Register Free or Get Tickets Button with 36px touch height */}
          <button
            type="button"
            onClick={handleAction}
            className="z-20 relative inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-600/20 cursor-pointer shrink-0 touch-manipulation min-h-[36px]"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
