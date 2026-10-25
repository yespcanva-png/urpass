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

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowLiveDropdown(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
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
        document.activeElement !== inputRef.current
      ) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      if (e.key === "Escape") {
        setCityDropdownOpen(false);
        setShowLiveDropdown(false);
        setProfileDropdownOpen(false);
        inputRef.current?.blur();
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
    inputRef.current?.focus();
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

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Explore Logo (original violet ticket icon + Explore text) */}
          <Link
            href="/explore"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            aria-label="Explore Marketplace"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Ticket className="w-4 h-4 -rotate-12" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-lg text-neutral-950 tracking-tight">
                Explore
              </span>
            </div>
          </Link>

          {/* Center / Right: Unified Luxury Search & Location Pill */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-xl ml-auto flex items-center justify-end gap-2.5"
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
                  className="w-full text-xs sm:text-sm font-medium bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none truncate"
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
                    ⌘K
                  </kbd>
                )}
              </form>

              {/* Subtle Divider */}
              <div className="h-5 w-px bg-neutral-200/90 shrink-0 mx-0.5" />

              {/* Location Selector */}
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

                {/* Modern City Dropdown Menu */}
                {cityDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.14)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors mb-2 cursor-pointer disabled:opacity-60"
                    >
                      {isDetectingLocation ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
                      ) : (
                        <Compass className="w-3.5 h-3.5 text-violet-600" />
                      )}
                      <span>
                        {isDetectingLocation
                          ? "Detecting nearby city…"
                          : "Auto-detect location"}
                      </span>
                    </button>

                    {locationError && (
                      <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800 leading-tight">
                        {locationError}
                      </div>
                    )}

                    <div className="max-h-60 overflow-y-auto py-0.5 space-y-0.5">
                      {EXPLORE_CITIES.map((city) => {
                        const isSelected =
                          currentCity.toLowerCase() === city.toLowerCase();
                        return (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleSelectCity(city)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all duration-150 text-left cursor-pointer ${
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
                )}
              </div>
            </div>

            {/* Live Search Dropdown for Events */}
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

            {/* Attendee Profile / Log In Button */}
            {user ? (
              <div className="relative shrink-0" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-violet-400 transition-all cursor-pointer"
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
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-xl transition-colors"
                    >
                      <UserRound className="w-3.5 h-3.5 text-neutral-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/explore/my-tickets"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-xl transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5 text-neutral-400" />
                      <span>My Tickets</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer mt-1"
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
                className="px-3 sm:px-4 py-2 rounded-full text-xs font-bold text-neutral-800 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                Log In
              </button>
            )}
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
