"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ChevronDown,
  Search,
  X,
  Ticket,
  Check,
  Compass,
  Loader2,
  LogOut,
  UserRound,
} from "lucide-react";
import { EXPLORE_CITIES, type ExploreEventItem } from "@/lib/explore/types";
import { autoDetectExploreCity } from "@/lib/explore/geolocation";
import { createClient } from "@/lib/supabase/client";
import { getExploreEventsAction } from "@/app/actions/explore";
import ExploreAuthPopup from "./ExploreAuthPopup";
import LiveSearchDropdown from "./LiveSearchDropdown";
import type { User } from "@supabase/supabase-js";

interface ExploreHeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function ExploreHeader({
  currentCity,
  onCityChange,
  searchQuery = "",
  onSearch,
}: ExploreHeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Live search state
  const [liveResults, setLiveResults] = useState<ExploreEventItem[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);
  const [isMac, setIsMac] = useState(true);

  // Detect OS for keyboard shortcuts (⌘K on Mac, Ctrl K on Windows/Linux)
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform));
    }
  }, []);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync when parent searchQuery changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounced live search
  useEffect(() => {
    const q = localQuery.trim();
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
          city: currentCity !== "All Cities" ? currentCity : undefined,
          limit: 6,
        });
        setLiveResults(res.events || []);
      } catch (err) {
        console.error("Live search fetch error:", err);
      } finally {
        setIsLiveLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [localQuery, currentCity]);

  // Supabase Auth listener
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!mobileDropdownRef.current || !mobileDropdownRef.current.contains(target))
      ) {
        setCityDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        (!mobileSearchContainerRef.current ||
          !mobileSearchContainerRef.current.contains(target))
      ) {
        setShowLiveDropdown(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut listener (Cmd+K or / to focus search, Escape to close)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement !== inputRef.current &&
        document.activeElement !== mobileInputRef.current
      ) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          if (window.innerWidth < 640) {
            mobileInputRef.current?.focus();
          } else {
            inputRef.current?.focus();
          }
        }
      }
      if (e.key === "Escape") {
        setCityDropdownOpen(false);
        setShowLiveDropdown(false);
        setProfileDropdownOpen(false);
        inputRef.current?.blur();
        mobileInputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectCity = (city: string) => {
    onCityChange(city);
    setCityDropdownOpen(false);
    setLocationError(null);
  };

  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    try {
      const res = await autoDetectExploreCity();
      if (res.success && res.city) {
        onCityChange(res.city);
        setCityDropdownOpen(false);
      } else {
        setLocationError(res.error || "Location detection failed.");
      }
    } catch {
      setLocationError("Could not access browser location.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLiveDropdown(false);
    onSearch?.(localQuery.trim());
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    setShowLiveDropdown(false);
    onSearch?.("");
    if (window.innerWidth < 640) {
      mobileInputRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfileDropdownOpen(false);
  };

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  // Shared City Dropdown Menu component
  const renderCityMenu = (isMobile = false) => (
    <div
      className={`absolute right-0 ${
        isMobile ? "mt-2 w-64 max-w-[calc(100vw-32px)]" : "mt-3 w-64"
      } rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.16)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
    >
      <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between border-b border-neutral-100 mb-2">
        <span>Location</span>
        <span className="text-[10px] font-semibold text-neutral-400">
          {EXPLORE_CITIES.length} cities
        </span>
      </div>

      {/* Auto-detect Location CTA */}
      <button
        type="button"
        onClick={handleAutoDetectLocation}
        disabled={isDetectingLocation}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors mb-2 cursor-pointer disabled:opacity-60 touch-manipulation"
      >
        {isDetectingLocation ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
        ) : (
          <Compass className="w-3.5 h-3.5 text-violet-600" />
        )}
        <span>
          {isDetectingLocation ? "Detecting nearby city…" : "Auto-detect location"}
        </span>
      </button>

      {locationError && (
        <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800 leading-tight">
          {locationError}
        </div>
      )}

      <div className="max-h-56 sm:max-h-60 overflow-y-auto py-0.5 space-y-0.5">
        {EXPLORE_CITIES.map((city) => {
          const isSelected = currentCity.toLowerCase() === city.toLowerCase();
          return (
            <button
              key={city}
              type="button"
              onClick={() => handleSelectCity(city)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all duration-150 text-left cursor-pointer touch-manipulation min-h-[36px] ${
                isSelected
                  ? "bg-violet-50 text-violet-900 font-bold shadow-2xs"
                  : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-medium"
              }`}
            >
              <span>{city}</span>
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-neutral-200/70 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2.5 sm:gap-6">
            {/* Left: Explore Logo */}
            <Link
              href="/explore"
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none shrink-0 touch-manipulation"
              aria-label="Explore Marketplace"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 -rotate-12" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-neutral-950 tracking-tight">
                  Explore
                </span>
              </div>
            </Link>

            {/* Center / Right for Tablet & Desktop (Hidden on Mobile < sm) */}
            <div
              ref={searchContainerRef}
              className="hidden sm:flex relative flex-1 max-w-xl mx-auto items-center justify-end"
            >
              <div
                className={`w-full flex items-center rounded-full border transition-all duration-200 bg-neutral-50/80 hover:bg-neutral-100/70 ${
                  isFocused || showLiveDropdown
                    ? "bg-white border-violet-500/50 shadow-[0_4px_20px_-2px_rgba(109,40,217,0.12)] ring-4 ring-violet-500/10"
                    : "border-neutral-200/80 hover:border-neutral-300 shadow-2xs"
                }`}
              >
                {/* Search Input */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-1 flex items-center min-w-0 pl-3.5 pr-2 py-1.5 sm:py-2"
                >
                  <Search
                    className={`w-4 h-4 shrink-0 transition-colors duration-200 mr-2 sm:mr-2.5 ${
                      isFocused ? "text-violet-600" : "text-neutral-400"
                    }`}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={localQuery}
                    onFocus={() => {
                      setIsFocused(true);
                      if (localQuery.trim()) {
                        setShowLiveDropdown(true);
                      }
                    }}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search events, artists, venues…"
                    className="w-full text-base sm:text-sm font-medium bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none truncate"
                    aria-label="Search events"
                  />
                  {localQuery ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors shrink-0 ml-1 cursor-pointer"
                      aria-label="Clear search input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 bg-white border border-neutral-200/80 rounded-md shrink-0 ml-1.5 shadow-2xs">
                      {isMac ? "⌘K" : "Ctrl K"}
                    </kbd>
                  )}
                </form>

                {/* Subtle Divider */}
                <div className="h-5 w-px bg-neutral-200/90 shrink-0 mx-0.5" />

                {/* Location Selector (Tablet & Desktop) */}
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                    className={`flex items-center gap-1.5 pl-2.5 pr-3 sm:pr-3.5 py-1.5 sm:py-2 rounded-r-full text-xs font-semibold transition-colors duration-150 outline-none cursor-pointer ${
                      cityDropdownOpen
                        ? "text-violet-900 bg-violet-100/70"
                        : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/50"
                    }`}
                    aria-expanded={cityDropdownOpen}
                    aria-label={`Select city. Currently ${currentCity}`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span className="truncate max-w-[80px] sm:max-w-[130px] font-semibold text-neutral-800">
                      {currentCity}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        cityDropdownOpen ? "rotate-180 text-violet-600" : ""
                      }`}
                    />
                  </button>

                  {cityDropdownOpen && renderCityMenu(false)}
                </div>
              </div>

              {/* Tablet & Desktop Live Search Dropdown */}
              <LiveSearchDropdown
                isOpen={showLiveDropdown}
                query={localQuery}
                results={liveResults}
                isLoading={isLiveLoading}
                onSelectEvent={() => setShowLiveDropdown(false)}
                onViewAll={() => {
                  setShowLiveDropdown(false);
                  onSearch?.(localQuery.trim());
                }}
              />
            </div>

            {/* Right Side: Location Button on Mobile + Profile / Log In */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile Location Selector Button (Visible < sm only) */}
              <div className="relative sm:hidden" ref={mobileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 outline-none cursor-pointer touch-manipulation min-h-[34px] ${
                    cityDropdownOpen
                      ? "text-violet-900 bg-violet-50 border-violet-300 ring-2 ring-violet-500/20"
                      : "text-neutral-700 bg-neutral-100/80 hover:bg-neutral-200/70 border-neutral-200/90"
                  }`}
                  aria-expanded={cityDropdownOpen}
                  aria-label={`Select city. Currently ${currentCity}`}
                >
                  <MapPin className="w-3 h-3 text-violet-600 shrink-0" />
                  <span className="truncate max-w-[82px] font-semibold text-neutral-800">
                    {currentCity}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      cityDropdownOpen ? "rotate-180 text-violet-600" : ""
                    }`}
                  />
                </button>

                {cityDropdownOpen && renderCityMenu(true)}
              </div>

              {/* Attendee Profile / Log In Button */}
              {user ? (
                <div className="relative shrink-0" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-violet-400 transition-all cursor-pointer touch-manipulation"
                    aria-label="Account profile menu"
                  >
                    {userInitial}
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {user.user_metadata?.full_name || "Explore Attendee"}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/explore/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-xl transition-colors touch-manipulation min-h-[36px]"
                      >
                        <UserRound className="w-3.5 h-3.5 text-neutral-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/explore/my-tickets"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-xl transition-colors touch-manipulation min-h-[36px]"
                      >
                        <Ticket className="w-3.5 h-3.5 text-neutral-400" />
                        <span>My Tickets</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer mt-1 touch-manipulation min-h-[36px]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthPopupOpen(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold text-neutral-800 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 transition-all shrink-0 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px]"
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          {/* Dedicated Full-Width Mobile Search Bar (< sm) */}
          <div
            className="sm:hidden pb-3 pt-0.5 relative"
            ref={mobileSearchContainerRef}
          >
            <div
              className={`w-full flex items-center rounded-2xl border transition-all duration-200 bg-neutral-50/90 ${
                isFocused || showLiveDropdown
                  ? "bg-white border-violet-500/50 shadow-[0_4px_20px_-2px_rgba(109,40,217,0.12)] ring-3 ring-violet-500/10"
                  : "border-neutral-200/80 shadow-2xs"
              }`}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 flex items-center min-w-0 px-3.5 py-2"
              >
                <Search
                  className={`w-4 h-4 shrink-0 mr-2.5 transition-colors ${
                    isFocused ? "text-violet-600" : "text-neutral-400"
                  }`}
                />
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={localQuery}
                  onFocus={() => {
                    setIsFocused(true);
                    if (localQuery.trim()) {
                      setShowLiveDropdown(true);
                    }
                  }}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search events, artists, venues…"
                  className="w-full text-base font-medium bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none truncate"
                  aria-label="Search events"
                />
                {localQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors shrink-0 ml-1 cursor-pointer touch-manipulation"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Mobile Live Search Dropdown */}
            <LiveSearchDropdown
              isOpen={showLiveDropdown}
              query={localQuery}
              results={liveResults}
              isLoading={isLiveLoading}
              onSelectEvent={() => setShowLiveDropdown(false)}
              onViewAll={() => {
                setShowLiveDropdown(false);
                onSearch?.(localQuery.trim());
              }}
            />
          </div>
        </div>
      </header>

      {/* Explore Auth Popup */}
      <ExploreAuthPopup
        isOpen={authPopupOpen}
        onClose={() => setAuthPopupOpen(false)}
      />
    </>
  );
}
