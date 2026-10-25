"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Sparkles,
  ChevronRight,
  Loader2,
  Search,
  Compass,
} from "lucide-react";
import type { ExploreEventItem } from "@/lib/explore/types";
import { formatPrice } from "@/lib/currency";

interface LiveSearchDropdownProps {
  isOpen: boolean;
  query: string;
  results: ExploreEventItem[];
  isLoading: boolean;
  onSelectEvent?: (event: ExploreEventItem) => void;
  onViewAll?: () => void;
  className?: string;
}

function formatShortDate(dateStr: string, timeStr?: string): string {
  try {
    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.getDate();
    let text = `${dayName}, ${monthName} ${day}`;
    if (timeStr) {
      const [h, m] = timeStr.split(":");
      const hours = parseInt(h, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedH = hours % 12 || 12;
      text += ` • ${formattedH}:${m} ${ampm}`;
    }
    return text;
  } catch {
    return dateStr;
  }
}

export default function LiveSearchDropdown({
  isOpen,
  query,
  results,
  isLoading,
  onSelectEvent,
  onViewAll,
  className = "",
}: LiveSearchDropdownProps) {
  if (!isOpen || !query.trim()) return null;

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 rounded-3xl bg-white/95 backdrop-blur-2xl border border-neutral-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden ${className}`}
      role="listbox"
      aria-label="Live search event results"
    >
      {/* Header Bar */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-neutral-100 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Search className="w-3 h-3 text-violet-600" />
          <span>Events Matching &ldquo;{query}&rdquo;</span>
        </span>
        {isLoading ? (
          <span className="flex items-center gap-1 text-violet-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Searching…</span>
          </span>
        ) : (
          <span>
            {results.length} {results.length === 1 ? "match" : "matches"}
          </span>
        )}
      </div>

      {/* Loading state skeleton when initially typing */}
      {isLoading && results.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 text-xs text-neutral-400">
          <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
          <span>Finding matching events…</span>
        </div>
      ) : results.length === 0 ? (
        /* Empty State */
        <div className="py-7 px-4 text-center flex flex-col items-center justify-center space-y-1.5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-1">
            <Compass className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-neutral-800">
            No events found matching &ldquo;{query}&rdquo;
          </p>
          <p className="text-[11px] text-neutral-400 max-w-xs">
            Try searching by another artist, keyword, venue or city.
          </p>
        </div>
      ) : (
        /* Matching Events List */
        <div className="max-h-64 sm:max-h-80 overflow-y-auto py-1 space-y-1 overscroll-y-contain">
          {results.map((event) => {
            const priceLabel =
              event.isFree || event.minPricePaise === 0
                ? "Free"
                : `From ${formatPrice(event.minPricePaise, event.currency)}`;

            const eventUrl = `/explore/event/${encodeURIComponent(event.slug)}`;

            return (
              <Link
                key={`live-${event.id}`}
                href={eventUrl}
                onClick={() => onSelectEvent?.(event)}
                className="group flex items-center justify-between p-2 rounded-2xl hover:bg-violet-50/70 transition-colors cursor-pointer touch-manipulation min-h-[44px]"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* Thumbnail / Category Badge */}
                  <div className="relative w-12 h-12 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-100 shadow-2xs">
                    {event.bannerUrl ? (
                      <Image
                        src={event.bannerUrl}
                        alt={event.name}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-800 to-indigo-950 text-white">
                        <Sparkles className="w-4 h-4 text-violet-300" />
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-violet-700 transition-colors truncate">
                      {event.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500 truncate">
                      <span className="flex items-center gap-1 font-semibold text-violet-700 shrink-0">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>
                          {formatShortDate(event.eventDate, event.startTime)}
                        </span>
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1 truncate font-medium">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">
                          {event.venue || event.city}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Navigation Arrow */}
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      event.isFree || event.minPricePaise === 0
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-100 text-neutral-900 border border-neutral-200/80"
                    }`}
                  >
                    {priceLabel}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Footer View All CTA */}
      {onViewAll && results.length > 0 && (
        <div className="pt-1.5 border-t border-neutral-100 mt-1">
          <button
            type="button"
            onClick={onViewAll}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-violet-700 hover:bg-violet-50 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation min-h-[40px]"
          >
            <span>View all search results for &ldquo;{query}&rdquo;</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
