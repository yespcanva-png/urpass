"use client";

import {
  Compass,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Loader2,
} from "lucide-react";
import type {
  ExploreDateFilter,
  ExploreEventItem,
  ExplorePricingFilter,
  ExploreSortOrder,
} from "@/lib/explore/types";
import EventCard from "./EventCard";

interface ExploreEventGridProps {
  events: ExploreEventItem[];
  featuredEvents: ExploreEventItem[];
  totalCount: number;
  isLoading: boolean;
  activeCity: string;
  currentDateFilter: ExploreDateFilter;
  currentPricingFilter: ExplorePricingFilter;
  currentSort: ExploreSortOrder;
  onDateFilterChange: (filter: ExploreDateFilter) => void;
  onPricingFilterChange: (filter: ExplorePricingFilter) => void;
  onSortChange: (sort: ExploreSortOrder) => void;
  onResetFilters: () => void;
}

export default function ExploreEventGrid({
  events,
  featuredEvents,
  totalCount,
  isLoading,
  activeCity,
  currentDateFilter,
  currentPricingFilter,
  currentSort,
  onDateFilterChange,
  onPricingFilterChange,
  onSortChange,
  onResetFilters,
}: ExploreEventGridProps) {
  const hasActiveFilters =
    currentDateFilter !== "all" || currentPricingFilter !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* ── SECTION 1: Curated Featured Events (At most 3-4 items) ── */}
      {featuredEvents.length > 0 && !hasActiveFilters && (
        <section aria-labelledby="featured-events-heading" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 fill-violet-700/20" />
              </div>
              <div>
                <h2
                  id="featured-events-heading"
                  className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight"
                >
                  Featured Events
                </h2>
                <p className="text-xs text-neutral-500">
                  Hand-picked conferences, creative showcases, and headline experiences
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={`featured-${evt.id}`} event={evt} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION 2: Browse Upcoming Events ── */}
      <section aria-labelledby="all-events-heading" className="space-y-6">
        
        {/* Controls Bar: Filters & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          
          {/* Left: Quick Date & Pricing Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onDateFilterChange("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentDateFilter === "all"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              All Dates
            </button>
            <button
              type="button"
              onClick={() => onDateFilterChange("today")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentDateFilter === "today"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onDateFilterChange("this_weekend")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentDateFilter === "this_weekend"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              This Weekend
            </button>
            <button
              type="button"
              onClick={() => onDateFilterChange("this_month")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentDateFilter === "this_month"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              This Month
            </button>

            <div className="h-5 w-px bg-neutral-300 mx-1 hidden sm:block" />

            {/* Pricing Pills */}
            <button
              type="button"
              onClick={() => onPricingFilterChange("free")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentPricingFilter === "free"
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => onPricingFilterChange("paid")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentPricingFilter === "paid"
                  ? "bg-violet-700 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              Paid
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                aria-label="Reset active filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <span className="font-semibold text-neutral-500 whitespace-nowrap">
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-violet-600" />
                  <span>Searching…</span>
                </span>
              ) : (
                <span>
                  {totalCount} {totalCount === 1 ? "event" : "events"} in {activeCity}
                </span>
              )}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="font-medium text-neutral-500 hidden sm:inline">
                Sort:
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={currentSort}
                  onChange={(e) => onSortChange(e.target.value as ExploreSortOrder)}
                  className="appearance-none bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-neutral-800 outline-none cursor-pointer focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="soonest">Soonest</option>
                  <option value="recently_added">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Event Grid ── */}
        {isLoading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-neutral-200/80 bg-white overflow-hidden p-0 shadow-xs animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-neutral-200" />
                <div className="p-5 space-y-3">
                  <div className="w-1/3 h-3 bg-neutral-200 rounded" />
                  <div className="w-4/5 h-4 bg-neutral-200 rounded" />
                  <div className="w-full h-3 bg-neutral-100 rounded" />
                  <div className="w-2/3 h-3 bg-neutral-100 rounded" />
                  <div className="pt-3 border-t border-neutral-100 flex justify-between">
                    <div className="w-1/3 h-3 bg-neutral-200 rounded" />
                    <div className="w-1/4 h-3 bg-neutral-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50/60 p-12 text-center max-w-xl mx-auto space-y-4 my-8">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                No events found matching your criteria
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Try widening your search keywords, switching your location selector, or clearing date filters.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* Event Grid (3-columns desktop, 2-columns tablet, 1-column mobile) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
