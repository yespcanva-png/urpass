"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Calendar,
  X,
  Sparkles,
  ChevronDown,
  Check,
  Flame,
  Compass,
  Loader2,
} from "lucide-react";
import {
  EXPLORE_CITIES,
  type ExploreCity,
  type ExploreDateFilter,
  type ExploreEventItem,
} from "@/lib/explore/types";
import { autoDetectExploreCity } from "@/lib/explore/geolocation";
import { getExploreEventsAction } from "@/app/actions/explore";
import LiveSearchDropdown from "@/components/explore/LiveSearchDropdown";

interface ExploreHeroSearchProps {
  initialQuery?: string;
  currentCity: string;
  currentDateFilter: ExploreDateFilter;
  onSearch: (params: {
    query: string;
    city: string;
    dateFilter: ExploreDateFilter;
  }) => void;
}

const DATE_OPTIONS: {
  key: ExploreDateFilter;
  label: string;
  hint: string;
}[] = [
  { key: "all", label: "Any Date", hint: "All upcoming verified events" },
  { key: "today", label: "Today", hint: "Events happening today" },
  { key: "this_weekend", label: "This Weekend", hint: "Saturday & Sunday" },
  { key: "this_month", label: "This Month", hint: "Events in the next 30 days" },
];

const POPULAR_CITIES = [
  "All Cities",
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Online",
];

const TRENDING_TAGS = [
  "Tech & AI",
  "Indie Music",
  "Startup Mixers",
  "Design Workshops",
];

export default function ExploreHeroSearch({
  initialQuery = "",
  currentCity,
  currentDateFilter,
  onSearch,
}: ExploreHeroSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(currentCity);
  const [dateFilter, setDateFilter] = useState<ExploreDateFilter>(currentDateFilter);

  const [locationOpen, setLocationOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Live search state
  const [liveResults, setLiveResults] = useState<ExploreEventItem[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Sync state when props change
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCity(currentCity);
  }, [currentCity]);

  useEffect(() => {
    setDateFilter(currentDateFilter);
  }, [currentDateFilter]);

  // Debounced live search
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setLiveResults([]);
      setIsLiveLoading(false);
      setShowLiveDropdown(false);
      return;
    }

    setIsLiveLoading(true);
    setShowLiveDropdown(true);

    const timer = setTimeout(async () => {
      try {
        const res = await getExploreEventsAction({
          query: q,
          city: city !== "All Cities" ? city : undefined,
          limit: 6,
        });
        setLiveResults(res.events || []);
      } catch (err) {
        console.error("Hero live search error:", err);
      } finally {
        setIsLiveLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, city]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateOpen(false);
      }
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowLiveDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut listener (Escape closes dropdowns)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLocationOpen(false);
        setDateOpen(false);
        setShowLiveDropdown(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocationOpen(false);
    setDateOpen(false);
    setShowLiveDropdown(false);
    onSearch({ query: query.trim(), city, dateFilter });
  };

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setLocationOpen(false);
    setLocationError(null);
    onSearch({ query: query.trim(), city: selectedCity, dateFilter });
  };

  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    try {
      const res = await autoDetectExploreCity();
      if (res.success && res.city) {
        setCity(res.city);
        setLocationOpen(false);
        onSearch({ query: query.trim(), city: res.city, dateFilter });
      } else {
        setLocationError(res.error || "Location detection failed.");
      }
    } catch {
      setLocationError("Could not access browser location.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSelectDate = (selectedDate: ExploreDateFilter) => {
    setDateFilter(selectedDate);
    setDateOpen(false);
    onSearch({ query: query.trim(), city, dateFilter: selectedDate });
  };

  const handleTrendingClick = (tag: string) => {
    setQuery(tag);
    setShowLiveDropdown(false);
    onSearch({ query: tag, city, dateFilter });
    inputRef.current?.focus();
  };

  const handleClearQuery = () => {
    setQuery("");
    setLiveResults([]);
    setShowLiveDropdown(false);
    inputRef.current?.focus();
    onSearch({ query: "", city, dateFilter });
  };

  const activeDateLabel =
    DATE_OPTIONS.find((d) => d.key === dateFilter)?.label || "Any Date";

  return (
    <section className="relative overflow-visible bg-gradient-to-b from-violet-50/70 via-neutral-50/40 to-white pt-10 pb-10 sm:pt-14 sm:pb-14 border-b border-neutral-100">
      {/* Ambient decorative floating background orbs */}
      <div
        className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-violet-400/15 blur-3xl pointer-events-none explore-orb-1"
        aria-hidden="true"
      />
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-fuchsia-400/10 blur-3xl pointer-events-none explore-orb-2"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Headline & Subtitle ────────────────────────────────────────── */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="explore-fade-up explore-delay-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/90 border border-violet-200/80 text-violet-800 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
            <span>UrPass Explore Marketplace</span>
          </div>

          <h1 className="explore-fade-up explore-delay-2 text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.08]">
            Find events you’ll love.
          </h1>

          <p className="explore-fade-up explore-delay-3 text-sm sm:text-base text-neutral-600 mt-3.5 font-normal max-w-2xl leading-relaxed">
            Discover verified conferences, creative workshops, concerts, and
            exclusive community gatherings with direct guest booking and digital QR
            passes.
          </p>
        </div>

        {/* ── Professional UX Search Console ────────────────────────────── */}
        <div className="explore-fade-up explore-delay-4 max-w-4xl">
          {/* Desktop & Tablet Segmented Capsule */}
          <form
            onSubmit={handleSubmit}
            className="hidden md:flex items-center bg-white/95 backdrop-blur-xl rounded-full border border-neutral-200/90 p-2 shadow-[0_10px_36px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_44px_-8px_rgba(109,40,217,0.12)] transition-all duration-300 focus-within:border-violet-400/80 focus-within:ring-4 focus-within:ring-violet-500/10"
          >
            {/* Segment 1: Search / Keyword */}
            <div
              ref={desktopSearchRef}
              className="relative flex-1 min-w-0"
            >
              <div
                onClick={() => {
                  inputRef.current?.focus();
                  if (query.trim()) setShowLiveDropdown(true);
                }}
                className="flex flex-col justify-center min-w-0 px-5 py-2 rounded-full hover:bg-neutral-50/90 transition-colors cursor-text group"
              >
                <label
                  htmlFor="hero-search-input"
                  className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 group-hover:text-violet-600 transition-colors cursor-text"
                >
                  Search Events
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Search className="w-4 h-4 text-violet-600 shrink-0" />
                  <input
                    id="hero-search-input"
                    ref={inputRef}
                    type="text"
                    value={query}
                    onFocus={() => {
                      if (query.trim()) setShowLiveDropdown(true);
                    }}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by event, artist, venue, or keyword…"
                    className="w-full text-xs sm:text-sm font-semibold bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none truncate"
                    aria-label="Search by event, artist, venue, or keyword"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearQuery();
                      }}
                      className="p-1 rounded-full hover:bg-neutral-200/70 text-neutral-400 hover:text-neutral-700 active:scale-90 transition-all shrink-0 cursor-pointer"
                      aria-label="Clear search input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Search Dropdown */}
              <LiveSearchDropdown
                isOpen={showLiveDropdown}
                query={query}
                results={liveResults}
                isLoading={isLiveLoading}
                onSelectEvent={() => setShowLiveDropdown(false)}
                onViewAll={() => {
                  setShowLiveDropdown(false);
                  handleSubmit();
                }}
                className="w-[calc(100%+80px)] sm:w-[calc(100%+120px)] max-w-xl"
              />
            </div>

            <div className="h-9 w-px bg-neutral-200/90 shrink-0 my-auto" />

            {/* Segment 2: Location */}
            <div ref={locationRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setLocationOpen((prev) => !prev);
                  setDateOpen(false);
                }}
                className={`flex flex-col justify-center px-5 py-2 rounded-full transition-colors cursor-pointer text-left ${
                  locationOpen ? "bg-neutral-100/90" : "hover:bg-neutral-50/90"
                }`}
                aria-haspopup="listbox"
                aria-expanded={locationOpen}
                aria-label={`Location: ${city}`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Where
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate max-w-[130px]">
                    {city}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      locationOpen ? "rotate-180 text-violet-600" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Location Popover Menu */}
              {locationOpen && (
                <div className="absolute left-0 mt-3 w-72 rounded-3xl bg-white/95 backdrop-blur-2xl border border-neutral-200/90 shadow-[0_18px_44px_-10px_rgba(0,0,0,0.18)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Auto-detect Location Button */}
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={isDetectingLocation}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-violet-50 hover:bg-violet-100/90 text-violet-800 text-xs font-bold transition-all mb-2.5 cursor-pointer disabled:opacity-60"
                  >
                    {isDetectingLocation ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
                    ) : (
                      <Compass className="w-3.5 h-3.5 text-violet-600" />
                    )}
                    <span>
                      {isDetectingLocation
                        ? "Detecting location…"
                        : "Auto-detect location"}
                    </span>
                  </button>

                  {locationError && (
                    <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800 leading-tight">
                      {locationError}
                    </div>
                  )}

                  <div className="px-2 pb-2 mb-2 border-b border-neutral-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                      Popular Cities
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {POPULAR_CITIES.map((c) => (
                        <button
                          key={`pop-${c}`}
                          type="button"
                          onClick={() => handleSelectCity(c)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            city.toLowerCase() === c.toLowerCase()
                              ? "bg-violet-600 text-white shadow-2xs"
                              : "bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                    All Locations
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-0.5 py-1">
                    {EXPLORE_CITIES.map((c) => {
                      const isSelected = city.toLowerCase() === c.toLowerCase();
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleSelectCity(c)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors text-left cursor-pointer ${
                            isSelected
                              ? "bg-violet-50 text-violet-900 font-bold"
                              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{c}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-violet-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="h-9 w-px bg-neutral-200/90 shrink-0 my-auto" />

            {/* Segment 3: When / Date */}
            <div ref={dateRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setDateOpen((prev) => !prev);
                  setLocationOpen(false);
                }}
                className={`flex flex-col justify-center px-5 py-2 rounded-full transition-colors cursor-pointer text-left ${
                  dateOpen ? "bg-neutral-100/90" : "hover:bg-neutral-50/90"
                }`}
                aria-haspopup="listbox"
                aria-expanded={dateOpen}
                aria-label={`Date: ${activeDateLabel}`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  When
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Calendar className="w-4 h-4 text-violet-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate max-w-[130px]">
                    {activeDateLabel}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      dateOpen ? "rotate-180 text-violet-600" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Date Popover Menu */}
              {dateOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-white/95 backdrop-blur-2xl border border-neutral-200/90 shadow-[0_18px_44px_-10px_rgba(0,0,0,0.18)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2 mb-1">
                    Event Timing
                  </div>
                  <div className="space-y-1 py-1">
                    {DATE_OPTIONS.map((opt) => {
                      const isSelected = dateFilter === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectDate(opt.key)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-2xl transition-colors text-left cursor-pointer ${
                            isSelected
                              ? "bg-violet-50 text-violet-900 font-bold"
                              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50"
                          }`}
                        >
                          <div>
                            <div className="font-bold">{opt.label}</div>
                            <div className="text-[11px] text-neutral-400 font-normal">
                              {opt.hint}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-violet-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action CTA */}
            <button
              type="submit"
              className="ml-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all duration-200 shadow-md shadow-violet-600/30 hover:shadow-violet-600/40 cursor-pointer shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              }}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Mobile Clean Card (< md) */}
          <form
            onSubmit={handleSubmit}
            className="md:hidden bg-white/95 backdrop-blur-xl rounded-3xl border border-neutral-200/90 p-4 shadow-xl shadow-neutral-950/5 space-y-3"
          >
            {/* Search Input Row */}
            <div ref={mobileSearchRef} className="relative">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 focus-within:border-violet-500 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-violet-600 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onFocus={() => {
                    if (query.trim()) setShowLiveDropdown(true);
                  }}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by event, artist, venue, or keyword…"
                  className="w-full text-xs font-semibold bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none"
                  aria-label="Search by event, artist, venue, or keyword"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Live Search Dropdown */}
              <LiveSearchDropdown
                isOpen={showLiveDropdown}
                query={query}
                results={liveResults}
                isLoading={isLiveLoading}
                onSelectEvent={() => setShowLiveDropdown(false)}
                onViewAll={() => {
                  setShowLiveDropdown(false);
                  handleSubmit();
                }}
              />
            </div>

            {/* Quick Pickers Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Location Select (Native for optimal mobile touch UX) */}
              <div className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <select
                  value={city}
                  onChange={(e) => handleSelectCity(e.target.value)}
                  className="w-full text-xs font-bold text-neutral-900 bg-transparent outline-none cursor-pointer appearance-none truncate pr-4"
                  aria-label="Filter by location"
                >
                  {EXPLORE_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
              </div>

              {/* Date Select (Native for optimal mobile touch UX) */}
              <div className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <Calendar className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <select
                  value={dateFilter}
                  onChange={(e) =>
                    handleSelectDate(e.target.value as ExploreDateFilter)
                  }
                  className="w-full text-xs font-bold text-neutral-900 bg-transparent outline-none cursor-pointer appearance-none truncate pr-4"
                  aria-label="Filter by date"
                >
                  {DATE_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition-all shadow-md shadow-violet-600/30"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              }}
            >
              <Search className="w-4 h-4" />
              <span>Search Events</span>
            </button>
          </form>

          {/* ── Trending Tags Discovery Micro-Bar ──────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 mt-4 px-2 sm:px-3 text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 shrink-0">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Trending:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTrendingClick(tag)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-600 bg-white/80 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 border border-neutral-200/70 shadow-2xs transition-all duration-150 cursor-pointer active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
