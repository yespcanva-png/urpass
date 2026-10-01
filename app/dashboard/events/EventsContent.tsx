"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  MapPin,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Copy,
  Loader2,
  Camera,
  UploadCloud,
  Sparkles,
  ExternalLink,
  ScanLine,
  Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { duplicateEvent, updateEventPhoto, updateDashboardBanner } from "@/app/actions/events";

interface Event {
  id: string;
  name: string;
  venue: string;
  event_date: string;
  status: string;
  banner_url?: string | null;
  logo_url?: string | null;
  apply_slug?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  active: {
    label: "Active · Published",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    cls: "bg-neutral-100 text-neutral-600 border border-neutral-200",
    dot: "bg-neutral-400",
  },
  completed: {
    label: "Completed",
    cls: "bg-blue-50 text-blue-700 border border-blue-200/80",
    dot: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border border-red-200/80",
    dot: "bg-red-500",
  },
};

const FILTERS = ["all", "active", "draft", "completed"] as const;
type Filter = (typeof FILTERS)[number];

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200 shadow-2xs">
      <div className="skeleton w-20 h-20 sm:w-24 sm:h-20 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-4 rounded w-52" />
        <div className="skeleton h-3 rounded w-36" />
      </div>
      <div className="skeleton h-5 w-20 rounded-full" />
      <div className="skeleton w-6 h-6 rounded" />
    </div>
  );
}

export default function EventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Banner State
  const [dashboardBanner, setDashboardBanner] = useState<string | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Event Photo Uploading State
  const [uploadingEventId, setUploadingEventId] = useState<string | null>(null);

  const router = useRouter();

  async function handleDuplicate(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setDuplicatingId(id);
    try {
      const res = await duplicateEvent(id);
      if (res?.error) {
        alert(res.error);
        setDuplicatingId(null);
      } else if (res?.newEventId) {
        router.push(`/event/${res.newEventId}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to duplicate event");
      setDuplicatingId(null);
    }
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Load user's saved dashboard banner if set
      if (user.user_metadata?.events_dashboard_banner) {
        setDashboardBanner(user.user_metadata.events_dashboard_banner);
      } else {
        const local = localStorage.getItem("urpass_events_banner");
        if (local) setDashboardBanner(local);
      }

      const { data } = await supabase
        .from("events")
        .select("id, name, venue, event_date, status, banner_url, logo_url, apply_slug")
        .eq("organizer_id", user.id)
        .order("created_at", { ascending: false });

      setEvents(data ?? []);
      setLoaded(true);
    }
    load();
  }, []);

  // Upload Image Helper
  async function uploadImageFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/studio/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error || "Failed to upload image");
    }
    return data.url;
  }

  // Handle Banner Upload
  async function handleBannerFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const url = await uploadImageFile(file);
      setDashboardBanner(url);
      try {
        localStorage.setItem("urpass_events_banner", url);
      } catch {}
      await updateDashboardBanner(url);
    } catch (err: any) {
      alert(err.message || "Failed to upload banner photo");
    } finally {
      setIsUploadingBanner(false);
      e.target.value = "";
    }
  }

  // Handle Event Photo Upload
  async function handleEventPhotoChange(
    e: React.ChangeEvent<HTMLInputElement>,
    eventId: string
  ) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEventId(eventId);
    try {
      const url = await uploadImageFile(file);
      setEvents((prev) =>
        prev.map((evt) => (evt.id === eventId ? { ...evt, banner_url: url } : evt))
      );
      await updateEventPhoto(eventId, url, "banner");
    } catch (err: any) {
      alert(err.message || "Failed to upload event photo");
    } finally {
      setUploadingEventId(null);
      e.target.value = "";
    }
  }

  const filtered = events.filter((e) => {
    const matchFilter = filter === "all" || e.status === filter;
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f] = f === "all" ? events.length : events.filter((e) => e.status === f).length;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto page-in pb-12">
      {/* ── Executive Corporate Header Banner (Uploadable Cover) ── */}
      <div className="relative w-full h-52 sm:h-64 rounded-3xl overflow-hidden mb-8 border border-neutral-200/90 shadow-2xs group bg-neutral-950">
        {/* Banner Background Image or Sophisticated Corporate Ambient Wash */}
        {dashboardBanner ? (
          <img
            src={dashboardBanner}
            alt="Events Dashboard Banner"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-neutral-950 via-slate-900 to-neutral-900 relative">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 40%),
                                  radial-gradient(circle at 85% 75%, rgba(147, 51, 234, 0.45) 0%, transparent 50%)`,
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          </div>
        )}

        {/* High-Contrast Gradient Readability Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/45 to-black/20 pointer-events-none" />

        {/* Top-Right "Change Banner" Action */}
        <div className="absolute top-4 right-4 z-10">
          <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/45 hover:bg-black/70 text-white text-xs font-semibold backdrop-blur-md cursor-pointer border border-white/20 transition-all shadow-xs">
            {isUploadingBanner ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            <span>{dashboardBanner ? "Change Banner" : "Upload Banner"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              disabled={isUploadingBanner}
              onChange={handleBannerFileChange}
            />
          </label>
        </div>

        {/* Banner Content (Bottom Layout) */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-semibold backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Event Operations & Dispatch
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              All Events & Deployments
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed">
              Enterprise event lifecycle management, registration flows, gate scanners, and production schedules.
            </p>
          </div>

          {/* Quick Metrics & New Event Action */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-2 mr-1">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-medium">
                {counts.all} Total
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                {counts.active} Active
              </span>
            </div>

            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:shadow-lg"
            >
              <Plus className="w-4 h-4 text-neutral-900" />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Search + Filter Bar (Corporate Style) ──────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or venue…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 shadow-2xs rounded-xl text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 bg-white border border-neutral-200 shadow-2xs rounded-xl p-1.5 overflow-x-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 mx-1.5 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize whitespace-nowrap cursor-pointer ${
                filter === f
                  ? "bg-neutral-900 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              {f === "all" ? "All" : f}
              {loaded && (
                <span
                  className={`ml-1.5 tabular-nums ${
                    filter === f ? "text-white/70" : "text-neutral-400"
                  }`}
                >
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Event List (Corporate Cards with Uploadable Photos) ──── */}
      {!loaded ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-xs border border-neutral-200 content-in">
          <div className="w-14 h-14 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Calendar className="w-6 h-6 text-neutral-700" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">No events created yet</h3>
          <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto leading-relaxed">
            Launch your first conference, summit, or meetup with custom ticketing and QR access control.
          </p>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Event
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center shadow-xs border border-neutral-200">
          <Search className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-neutral-700">No events match your search</p>
          <button
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
            className="text-xs text-neutral-900 font-semibold mt-2 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 content-in">
          {filtered.map((event) => {
            const cfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.cancelled;
            const dateStr = new Date(event.event_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const eventMonth = new Date(event.event_date).toLocaleDateString("en-IN", {
              month: "short",
            });
            const eventDay = new Date(event.event_date).getDate();
            const photoUrl = event.banner_url || event.logo_url;

            return (
              <div
                key={event.id}
                className="bg-white hover:border-neutral-300 border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left Side: Uploadable Event Photo & Identity */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Uploadable Event Photo / Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden relative shrink-0 border border-neutral-200 bg-neutral-100 flex items-center justify-center group/photo">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform group-hover/photo:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 text-neutral-600">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 leading-none">
                          {eventMonth}
                        </span>
                        <span className="text-lg font-black text-neutral-900 leading-tight mt-0.5">
                          {eventDay}
                        </span>
                      </div>
                    )}

                    {/* Upload Photo Overlay Trigger */}
                    <label
                      title="Upload or change event cover photo"
                      className="absolute inset-0 bg-neutral-950/65 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer gap-1 p-1 text-center backdrop-blur-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {uploadingEventId === event.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                      <span>{uploadingEventId === event.id ? "Saving..." : "Change Photo"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        disabled={uploadingEventId === event.id}
                        onChange={(e) => handleEventPhotoChange(e, event.id)}
                      />
                    </label>
                  </div>

                  {/* Event Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/event/${event.id}`}
                        className="text-base font-bold text-neutral-900 hover:text-neutral-600 transition-colors truncate block"
                      >
                        {event.name}
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate max-w-[180px] sm:max-w-xs">{event.venue}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-neutral-500">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{dateStr}</span>
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div className="pt-0.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${cfg.cls}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action Shortcuts */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 w-full sm:w-auto justify-end">
                  {/* Public Page Shortcut */}
                  <a
                    href={`/e/${event.apply_slug || event.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Public Event Page"
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 bg-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Gate Scanner Shortcut */}
                  <Link
                    href={`/scan/${event.id}`}
                    title="Open Gate Scanner"
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 bg-white"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                  </Link>

                  {/* Duplicate Button */}
                  <button
                    type="button"
                    title="Duplicate Event"
                    disabled={duplicatingId === event.id}
                    onClick={(e) => handleDuplicate(e, event.id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 bg-white disabled:opacity-50 cursor-pointer"
                  >
                    {duplicatingId === event.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Open Event Management Dashboard Button */}
                  <Link
                    href={`/event/${event.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-2xs"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loaded && filtered.length > 0 && (
        <p className="text-center text-xs text-neutral-400 mt-8 font-medium">
          Showing {filtered.length} of {events.length} {events.length === 1 ? "event" : "events"}
        </p>
      )}
    </div>
  );
}
