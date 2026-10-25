"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ExploreHeader from "@/components/explore/ExploreHeader";
import CategoryShortcuts from "@/components/explore/CategoryShortcuts";
import OrganizerCallout from "@/components/explore/OrganizerCallout";
import Footer from "@/components/landing/Footer";
import EventCard from "@/components/explore/EventCard";

// Ad Placement Components
import HeroPromotionalBanner from "@/components/explore/ads/HeroPromotionalBanner";
import InContentPromotionalBanner from "@/components/explore/ads/InContentPromotionalBanner";
import ExploreNewsletterCard from "@/components/explore/ads/ExploreNewsletterCard";

import type {
  ExploreCategory,
  ExploreDateFilter,
  ExplorePricingFilter,
  ExploreQueryResult,
  ExploreSortOrder,
} from "@/lib/explore/types";
import type { ExploreAdPlacementsBundle } from "@/lib/explore/ads-types";
import { getExploreEventsAction } from "@/app/actions/explore";
import { fetchExplorePlacementsAction } from "@/app/actions/explore-ads";
import { trackExploreEvent } from "@/lib/explore/analytics";
import {
  Sparkles,
  RotateCcw,
  ChevronDown,
  Loader2,
  Compass,
} from "lucide-react";

interface ExploreClientProps {
  initialResult: ExploreQueryResult;
  initialAds?: ExploreAdPlacementsBundle;
}

export default function ExploreClient({ initialResult, initialAds }: ExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state initialization
  const urlQuery = searchParams.get("q") || "";
  const urlCity = searchParams.get("city") || initialResult.activeCity || "All Cities";
  const urlCategory = (searchParams.get("category") as ExploreCategory) || "all";
  const urlDate = (searchParams.get("date") as ExploreDateFilter) || "all";
  const urlPricing = (searchParams.get("pricing") as ExplorePricingFilter) || "all";
  const urlSort = (searchParams.get("sort") as ExploreSortOrder) || "soonest";

  const [query, setQuery] = useState(urlQuery);
  const [city, setCity] = useState(urlCity);
  const [category, setCategory] = useState<ExploreCategory>(urlCategory);
  const [dateFilter, setDateFilter] = useState<ExploreDateFilter>(urlDate);
  const [pricingFilter, setPricingFilter] = useState<ExplorePricingFilter>(urlPricing);
  const [sort, setSort] = useState<ExploreSortOrder>(urlSort);

  const [result, setResult] = useState<ExploreQueryResult>(initialResult);
  const [ads, setAds] = useState<ExploreAdPlacementsBundle>(
    initialAds || {
      hero: [],
      topSidebar: null,
      inContent: null,
      bottomSidebar: null,
    }
  );
  const [isPending, startTransition] = useTransition();

  // Track initial page view
  useEffect(() => {
    trackExploreEvent("explore_view", {
      city: urlCity,
      category: urlCategory,
      totalEvents: initialResult.totalCount,
    });
  }, [initialResult.totalCount, urlCategory, urlCity]);

  // Sync results when filters or city change
  const updateResults = useCallback(
    (nextState: {
      q?: string;
      city?: string;
      category?: ExploreCategory;
      date?: ExploreDateFilter;
      pricing?: ExplorePricingFilter;
      sort?: ExploreSortOrder;
    }) => {
      const q = nextState.q !== undefined ? nextState.q : query;
      const c = nextState.city !== undefined ? nextState.city : city;
      const cat = nextState.category !== undefined ? nextState.category : category;
      const d = nextState.date !== undefined ? nextState.date : dateFilter;
      const p = nextState.pricing !== undefined ? nextState.pricing : pricingFilter;
      const s = nextState.sort !== undefined ? nextState.sort : sort;

      // Update URL query params without scroll
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (c && c !== "All Cities") params.set("city", c);
      if (cat && cat !== "all") params.set("category", cat);
      if (d && d !== "all") params.set("date", d);
      if (p && p !== "all") params.set("pricing", p);
      if (s && s !== "soonest") params.set("sort", s);

      const basePath = q ? "/explore/search" : "/explore";
      const nextUrl = params.toString() ? `${basePath}?${params.toString()}` : basePath;
      router.replace(nextUrl, { scroll: false });

      // Fetch filtered results and ads
      startTransition(async () => {
        try {
          const [eventRes, adsRes] = await Promise.all([
            getExploreEventsAction({
              query: q,
              city: c,
              category: cat,
              dateFilter: d,
              pricing: p,
              sort: s,
            }),
            nextState.city !== undefined ? fetchExplorePlacementsAction(c) : Promise.resolve(null),
          ]);
          setResult(eventRes);
          if (adsRes) {
            setAds(adsRes);
          }
        } catch (err) {
          console.error("Explore fetch error:", err);
        }
      });
    },
    [query, city, category, dateFilter, pricingFilter, sort, router]
  );

  // Search submission from Header
  const handleHeaderSearch = (newQuery: string) => {
    setQuery(newQuery);
    trackExploreEvent("search", { query: newQuery, city, date: dateFilter });
    updateResults({ q: newQuery });
  };

  // City change from Header dropdown
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    trackExploreEvent("filter_applied", { filterType: "city", value: newCity });
    updateResults({ city: newCity });
  };

  // Category chip selection
  const handleCategoryChange = (newCategory: ExploreCategory) => {
    setCategory(newCategory);
    trackExploreEvent("filter_applied", { filterType: "category", value: newCategory });
    updateResults({ category: newCategory });
  };

  // Date filter pill selection
  const handleDateFilterChange = (newDateFilter: ExploreDateFilter) => {
    setDateFilter(newDateFilter);
    trackExploreEvent("filter_applied", { filterType: "date", value: newDateFilter });
    updateResults({ date: newDateFilter });
  };

  // Pricing filter selection
  const handlePricingFilterChange = (newPricingFilter: ExplorePricingFilter) => {
    setPricingFilter(newPricingFilter);
    trackExploreEvent("filter_applied", { filterType: "pricing", value: newPricingFilter });
    updateResults({ pricing: newPricingFilter });
  };

  // Sort change
  const handleSortChange = (newSort: ExploreSortOrder) => {
    setSort(newSort);
    trackExploreEvent("filter_applied", { filterType: "sort", value: newSort });
    updateResults({ sort: newSort });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setQuery("");
    setCategory("all");
    setDateFilter("all");
    setPricingFilter("all");
    setSort("soonest");
    trackExploreEvent("filter_applied", { filterType: "reset" });
    updateResults({
      q: "",
      category: "all",
      date: "all",
      pricing: "all",
      sort: "soonest",
    });
  };

  const hasActiveFilters = dateFilter !== "all" || pricingFilter !== "all";

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased selection:bg-violet-100 selection:text-violet-900">
      {/* 1. Header with Explore Logo, Search Bar & Location Selector Only */}
      <ExploreHeader
        searchQuery={query}
        onSearch={handleHeaderSearch}
        currentCity={city}
        onCityChange={handleCityChange}
      />

      {/* Main Discovery Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 w-full">
        {/* 2. Placement 1 — Hero Promotional Banner (Carousel Slider) */}
        {ads.hero && ads.hero.length > 0 && (
          <HeroPromotionalBanner campaigns={ads.hero} activeCity={city} />
        )}

        {/* 3. Category Shortcuts */}
        <div className="mt-4 sm:mt-6">
          <CategoryShortcuts
            selectedCategory={category}
            onSelectCategory={handleCategoryChange}
          />
        </div>

        {/* 5. Full-Width Events Discovery Feed */}
        <div className="mt-8 sm:mt-10 w-full">
          <main className="space-y-8 sm:space-y-10 w-full">
            {/* Curated Featured Events (At most 3-4 items) */}
            {result.featuredEvents.length > 0 && !hasActiveFilters && (
              <section aria-labelledby="featured-events-heading" className="explore-fade-up space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-violet-700/20 animate-pulse" />
                    </div>
                    <div>
                      <h2
                        id="featured-events-heading"
                        className="text-base sm:text-lg md:text-xl font-black text-neutral-950 tracking-tight"
                      >
                        Featured Events
                      </h2>
                      <p className="text-xs text-neutral-500">
                        Hand-picked headliners, tech conferences, and curated gatherings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {result.featuredEvents.slice(0, 4).map((evt, idx) => (
                    <EventCard key={`featured-${evt.id}`} event={evt} featured index={idx} />
                  ))}
                </div>
              </section>
            )}

            {/* Placement 3 — In-Content Promotional Banner */}
            {ads.inContent && (
              <div className="explore-fade-up">
                <InContentPromotionalBanner
                  campaign={ads.inContent}
                  activeCity={city}
                />
              </div>
            )}

            {/* ── Trending / Upcoming Events Section ── */}
            <section aria-labelledby="all-events-heading" className="explore-fade-up space-y-5 sm:space-y-6">
              {/* Controls Bar: Filters & Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-neutral-200">
                {/* Date & Pricing Filter Pills (Horizontal swipe on mobile, wrap on tablet/desktop) */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 overscroll-x-contain touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleDateFilterChange("all")}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] shrink-0 ${
                      dateFilter === "all"
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    All Dates
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateFilterChange("today")}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] shrink-0 ${
                      dateFilter === "today"
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateFilterChange("this_weekend")}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] shrink-0 ${
                      dateFilter === "this_weekend"
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    This Weekend
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateFilterChange("this_month")}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] shrink-0 ${
                      dateFilter === "this_month"
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    This Month
                  </button>

                  <div className="h-5 w-px bg-neutral-300 mx-0.5 hidden sm:block shrink-0" />

                  {/* Pricing Pills */}
                  <button
                    type="button"
                    onClick={() => handlePricingFilterChange("free")}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] shrink-0 ${
                      pricingFilter === "free"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricingFilterChange("paid")}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] shrink-0 ${
                      pricingFilter === "paid"
                        ? "bg-violet-700 text-white shadow-xs shadow-violet-700/20"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    Paid
                  </button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="group flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 active:scale-95 transition-all duration-150 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] shrink-0"
                      aria-label="Reset active filters"
                    >
                      <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* Results Count & Sort Dropdown */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs w-full sm:w-auto pt-1 sm:pt-0">
                  <span className="font-semibold text-neutral-500 whitespace-nowrap">
                    {isPending ? (
                      <span className="inline-flex items-center gap-1.5 text-violet-700 font-semibold animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin text-violet-600" />
                        <span>Searching…</span>
                      </span>
                    ) : (
                      <span>
                        {result.totalCount} {result.totalCount === 1 ? "event" : "events"}
                      </span>
                    )}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <label htmlFor="sort-select" className="font-medium text-neutral-500 hidden sm:inline">
                      Sort:
                    </label>
                    <div className="relative">
                      <select
                        id="sort-select"
                        value={sort}
                        onChange={(e) => handleSortChange(e.target.value as ExploreSortOrder)}
                        className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer shadow-2xs transition-all duration-150 touch-manipulation min-h-[36px]"
                      >
                        <option value="soonest">Soonest</option>
                        <option value="recently_added">Recently Added</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Cards Grid */}
              {isPending ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="rounded-2xl sm:rounded-3xl border border-neutral-100 bg-white p-3 space-y-3 shadow-xs overflow-hidden"
                    >
                      <div className="w-full aspect-[16/10] explore-card-skeleton rounded-2xl" />
                      <div className="space-y-2.5 px-2 py-1">
                        <div className="h-4 explore-card-skeleton rounded-lg w-3/4" />
                        <div className="h-3 explore-card-skeleton rounded-lg w-1/2" />
                        <div className="h-4 explore-card-skeleton rounded-lg w-1/3 pt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : result.events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center rounded-2xl sm:rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50">
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3.5 explore-bounce-subtle shadow-xs">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1">
                    No matching events found
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mb-5">
                    We couldn&apos;t find events matching your exact criteria in {city}. Try broadening your search or resetting filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm hover:shadow-md hover:shadow-violet-600/20 active:scale-95 transition-all duration-200 cursor-pointer touch-manipulation min-h-[38px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {result.events.map((evt, idx) => (
                    <EventCard key={evt.id} event={evt} index={idx} />
                  ))}
                </div>
              )}
            </section>

            {/* Newsletter Subscription */}
            <div className="explore-fade-up pt-8 max-w-2xl mx-auto w-full">
              <ExploreNewsletterCard currentCity={city} />
            </div>
          </main>
        </div>
      </div>

      {/* 6. Organizer Callout */}
      <OrganizerCallout />

      {/* 7. Standard Footer */}
      <Footer />
    </div>
  );
}
