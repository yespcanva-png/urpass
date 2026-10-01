"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Share2,
  Ticket,
  Video,
  X,
  Sparkles,
  ArrowRight,
  Star,
  Info,
} from "lucide-react";
import type {
  EventSession,
  EventTrack,
  EventRoom,
  EventSpeaker,
  EventWebsite,
} from "@/types/conference";
import { formatSessionTimeRange } from "@/lib/conference/conflict-detection";
import { SESSION_TYPE_CONFIG } from "@/lib/conference/helpers";

interface PublicEventWebsiteProps {
  event: {
    id: string;
    name: string;
    description: string | null;
    event_date: string;
    start_time: string;
    end_time: string;
    venue: string;
    status: string;
    apply_slug?: string | null;
    banner_url?: string | null;
    logo_url?: string | null;
    is_paid_event?: boolean;
    ticket_price?: number;
  };
  website: EventWebsite;
  tracks: EventTrack[];
  rooms: EventRoom[];
  sessions: EventSession[];
  speakers: EventSpeaker[];
  initialPassToken?: string | null;
}

export default function PublicEventWebsite({
  event,
  website,
  tracks,
  rooms,
  sessions,
  speakers,
  initialPassToken,
}: PublicEventWebsiteProps) {
  // Navigation & active tab
  const [activeTab, setActiveTab] = useState<"agenda" | "speakers" | "venue" | "my_agenda">("agenda");

  // Track filter
  const [selectedTrackId, setSelectedTrackId] = useState<string>("all");

  // Multi-day selector
  const uniqueDates = useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) {
      if (s.session_date) set.add(s.session_date);
    }
    if (set.size === 0 && event.event_date) {
      set.add(event.event_date);
    }
    return Array.from(set).sort();
  }, [sessions, event.event_date]);

  const [selectedDate, setSelectedDate] = useState<string>(uniqueDates[0] || event.event_date);

  // Attendee state (Pass token or email for reservations & My Agenda)
  const [passToken, setPassToken] = useState(initialPassToken || "");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeeInputModalOpen, setAttendeeInputModalOpen] = useState(false);
  const [pendingActionSession, setPendingActionSession] = useState<{
    session: EventSession;
    type: "reserve" | "agenda";
  } | null>(null);

  // Local saved agenda & reservations (stored in localStorage for fast UX)
  const [myAgendaSessionIds, setMyAgendaSessionIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem(`urpass_agenda_${event.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [myReservedSessionIds, setMyReservedSessionIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem(`urpass_reservations_${event.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Conflict state alert
  const [conflictAlert, setConflictAlert] = useState<{
    message: string;
    conflictingSessionTitle?: string;
  } | null>(null);

  // Speaker Detail Modal
  const [selectedSpeaker, setSelectedSpeaker] = useState<EventSpeaker | null>(null);

  // FAQ Accordion state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Sections configuration
  const sections = website.sections_config || {
    hero: { enabled: true, order: 1 },
    about: { enabled: true, order: 2 },
    agenda: { enabled: true, order: 3 },
    speakers: { enabled: true, order: 4 },
    venue: { enabled: true, order: 5 },
    faq: { enabled: true, order: 7 },
    tickets: { enabled: true, order: 8 },
    contact: { enabled: true, order: 9 },
  };

  const primaryColour = website.primary_colour || "#6C63FF";

  // Filtered sessions for Agenda tab
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchDate = s.session_date === selectedDate;
      const matchTrack = selectedTrackId === "all" || s.track_id === selectedTrackId;
      return matchDate && matchTrack;
    });
  }, [sessions, selectedDate, selectedTrackId]);

  // Attendee's personalized agenda sessions
  const myAgendaSessions = useMemo(() => {
    return sessions
      .filter((s) => myAgendaSessionIds.has(s.id) || myReservedSessionIds.has(s.id))
      .sort((a, b) => {
        if (a.session_date !== b.session_date) {
          return a.session_date.localeCompare(b.session_date);
        }
        return a.start_time.localeCompare(b.start_time);
      });
  }, [sessions, myAgendaSessionIds, myReservedSessionIds]);

  // Handle "Add to My Agenda"
  async function handleToggleMyAgenda(session: EventSession) {
    const isSaved = myAgendaSessionIds.has(session.id);
    if (isSaved) {
      // Remove
      setMyAgendaSessionIds((prev) => {
        const next = new Set(prev);
        next.delete(session.id);
        try {
          localStorage.setItem(`urpass_agenda_${event.id}`, JSON.stringify(Array.from(next)));
        } catch {}
        return next;
      });
      return;
    }

    // Attempt to add -> check conflict against attendee's already selected sessions
    const conflict = myAgendaSessions.find((s) => {
      if (s.id === session.id) return false;
      if (s.session_date !== session.session_date) return false;
      return s.start_time < session.end_time && s.end_time > session.start_time;
    });

    if (conflict) {
      setConflictAlert({
        message: `Schedule Conflict: You already have another session during this time: "${conflict.title}" (${formatSessionTimeRange(
          conflict.start_time,
          conflict.end_time
        )}).`,
        conflictingSessionTitle: conflict.title,
      });
      return;
    }

    setMyAgendaSessionIds((prev) => {
      const next = new Set(prev);
      next.add(session.id);
      try {
        localStorage.setItem(`urpass_agenda_${event.id}`, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });

    // If pass token or email is already known, sync with server in background
    if (passToken || attendeeEmail) {
      fetch(`/api/sessions/${session.id}/agenda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passToken, email: attendeeEmail }),
      }).catch(() => {});
    }
  }

  // Handle "Reserve Seat"
  async function handleReserveSeat(session: EventSession) {
    if (!passToken && !attendeeEmail) {
      setPendingActionSession({ session, type: "reserve" });
      setAttendeeInputModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/sessions/${session.id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passToken, email: attendeeEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.conflict) {
          setConflictAlert({
            message: data.message || "Schedule Conflict detected.",
            conflictingSessionTitle: data.conflict.conflictingSessionTitle,
          });
          return;
        }
        alert(data.error || "Failed to reserve session.");
        return;
      }

      setMyReservedSessionIds((prev) => {
        const next = new Set(prev);
        next.add(session.id);
        try {
          localStorage.setItem(`urpass_reservations_${event.id}`, JSON.stringify(Array.from(next)));
        } catch {}
        return next;
      });

      setMyAgendaSessionIds((prev) => {
        const next = new Set(prev);
        next.add(session.id);
        return next;
      });

      alert(data.message || "Seat reserved successfully!");
    } catch (err: any) {
      alert(err.message || "Reservation failed");
    }
  }

  function handleAttendeePromptSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!attendeeEmail.trim() && !passToken.trim()) return;
    setAttendeeInputModalOpen(false);

    if (pendingActionSession) {
      if (pendingActionSession.type === "reserve") {
        handleReserveSeat(pendingActionSession.session);
      } else {
        handleToggleMyAgenda(pendingActionSession.session);
      }
      setPendingActionSession(null);
    }
  }

  const registerUrl = `/apply/${event.apply_slug || event.id}`;
  const passUrl = passToken ? `/pass/${passToken}` : registerUrl;

  const formattedEventDate = new Date(event.event_date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0e0c16] text-white selection:bg-purple-600 selection:text-white font-sans antialiased">
      {/* ── Conflict Alert Modal / Toast ──────────────────────── */}
      {conflictAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Schedule Conflict Detected
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              {conflictAlert.message}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setConflictAlert(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-200 transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Attendee Credentials Prompt Modal ─────────────────── */}
      {attendeeInputModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Attendee Verification</h3>
              </div>
              <button
                onClick={() => setAttendeeInputModalOpen(false)}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Enter your registered event email or pass token to reserve seats and sync your personal agenda.
            </p>

            <form onSubmit={handleAttendeePromptSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Registration Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Or Pass Token / ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="UP-XXXX or token"
                  value={passToken}
                  onChange={(e) => setPassToken(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-hidden focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAttendeeInputModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-white/60 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-xs transition-colors"
                >
                  Confirm & Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Navigation Bar ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0e0c16]/80 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {event.logo_url ? (
              <img src={event.logo_url} alt={event.name} className="w-8 h-8 rounded-lg object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                {event.name.charAt(0)}
              </div>
            )}
            <span className="font-bold text-sm sm:text-base text-white truncate max-w-[180px] sm:max-w-xs">
              {event.name}
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-white/70">
            <button
              onClick={() => setActiveTab("agenda")}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === "agenda" ? "bg-white/10 text-white" : "hover:text-white"
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setActiveTab("speakers")}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === "speakers" ? "bg-white/10 text-white" : "hover:text-white"
              }`}
            >
              Speakers ({speakers.length})
            </button>
            <button
              onClick={() => setActiveTab("venue")}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === "venue" ? "bg-white/10 text-white" : "hover:text-white"
              }`}
            >
              Venue
            </button>
            <button
              onClick={() => setActiveTab("my_agenda")}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                activeTab === "my_agenda"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "hover:text-white text-purple-300"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              My Agenda
              {myAgendaSessions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-neutral-900 text-[10px] flex items-center justify-center font-bold">
                  {myAgendaSessions.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-2">
            {passToken ? (
              <Link
                href={`/pass/${passToken}`}
                className="px-4 py-2 text-xs font-semibold text-purple-200 bg-purple-950/80 border border-purple-500/40 rounded-xl hover:bg-purple-900 transition-colors inline-flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                View My Pass
              </Link>
            ) : (
              <Link
                href={registerUrl}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                {website.cta_text || "Register Now"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      {sections.hero?.enabled !== false && (
        <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 border-b border-white/[0.08]">
          {/* Background art / glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 30%, ${primaryColour} 0%, transparent 60%)`,
            }}
          />

          <div className="relative max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Official Conference Website
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {event.name}
            </h1>

            {event.description && (
              <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Date & Venue chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {formattedEventDate}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                {event.venue}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href={registerUrl}
                className="px-6 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
              >
                {website.cta_text || "Register Now"}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setActiveTab("my_agenda")}
                className="px-5 py-3 text-sm font-semibold text-white/80 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl transition-all inline-flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-purple-400" />
                My Agenda ({myAgendaSessions.length})
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT AREA WITH TABS ─────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden items-center justify-between p-1 bg-white/[0.05] rounded-xl mb-6 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === "agenda" ? "bg-white/10 text-white" : "text-white/60"
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => setActiveTab("speakers")}
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === "speakers" ? "bg-white/10 text-white" : "text-white/60"
            }`}
          >
            Speakers
          </button>
          <button
            onClick={() => setActiveTab("venue")}
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === "venue" ? "bg-white/10 text-white" : "text-white/60"
            }`}
          >
            Venue
          </button>
          <button
            onClick={() => setActiveTab("my_agenda")}
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === "my_agenda" ? "bg-purple-600 text-white" : "text-purple-300"
            }`}
          >
            My Agenda ({myAgendaSessions.length})
          </button>
        </div>

        {/* ── TAB 1: AGENDA VIEW ──────────────────────────────── */}
        {activeTab === "agenda" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Conference Schedule
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Browse keynotes, breakout tracks, workshops, and reserve your seats.
                </p>
              </div>

              {/* Day switcher */}
              {uniqueDates.length > 1 && (
                <div className="flex items-center gap-1.5 p-1 bg-white/[0.05] rounded-xl">
                  {uniqueDates.map((date, idx) => {
                    const active = selectedDate === date;
                    const d = new Date(date + "T00:00:00");
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          active
                            ? "bg-purple-600 text-white shadow-xs"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        Day {idx + 1} ({d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Track Filter Pills */}
            {tracks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-3">
                <button
                  onClick={() => setSelectedTrackId("all")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    selectedTrackId === "all"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "bg-white/[0.06] text-white/70 hover:bg-white/[0.1]"
                  }`}
                >
                  All Tracks
                </button>
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTrackId(t.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
                      selectedTrackId === t.id
                        ? "text-white shadow-sm"
                        : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:bg-white/[0.08]"
                    }`}
                    style={{
                      backgroundColor: selectedTrackId === t.id ? t.colour : undefined,
                      borderColor: selectedTrackId === t.id ? t.colour : undefined,
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}

            {/* Sessions Timeline List */}
            {filteredSessions.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
                <p className="text-sm font-semibold text-white/70">No sessions match current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => {
                  const typeCfg =
                    SESSION_TYPE_CONFIG[session.session_type] || SESSION_TYPE_CONFIG.presentation;
                  const track = session.track;
                  const room = session.room;
                  const sessionSpeakers = (session.speakers || [])
                    .map((s) => s.speaker)
                    .filter(Boolean);

                  const isSavedInAgenda = myAgendaSessionIds.has(session.id);
                  const isReserved = myReservedSessionIds.has(session.id);

                  return (
                    <div
                      key={session.id}
                      className="bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-5 transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          {/* Tags row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                              {typeCfg.label}
                            </span>

                            {track && (
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white"
                                style={{ backgroundColor: track.colour }}
                              >
                                {track.name}
                              </span>
                            )}

                            {session.registration_required && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Reservation Required
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <Link
                            href={`/e/${website.slug || event.id}/session/${session.slug || session.id}`}
                            className="text-base sm:text-lg font-bold text-white hover:text-purple-300 transition-colors block"
                          >
                            {session.title}
                          </Link>

                          {/* Description */}
                          {session.description && (
                            <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                              {session.description}
                            </p>
                          )}

                          {/* Meta: Time, Room, Capacity */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 pt-1">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-white/80">
                              <Clock className="w-3.5 h-3.5 text-purple-400" />
                              {formatSessionTimeRange(session.start_time, session.end_time)}
                            </span>

                            {room && (
                              <span className="inline-flex items-center gap-1.5 text-white/60">
                                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                                {room.name} {room.floor ? `(${room.floor})` : ""}
                              </span>
                            )}

                            {(session.capacity || room?.capacity) && (
                              <span className="inline-flex items-center gap-1.5 text-white/50">
                                <Users className="w-3.5 h-3.5 text-white/30" />
                                {session.capacity || room?.capacity} Seats
                              </span>
                            )}
                          </div>

                          {/* Speakers */}
                          {sessionSpeakers.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              {sessionSpeakers.map((sp: any) => (
                                <button
                                  type="button"
                                  key={sp.id}
                                  onClick={() => setSelectedSpeaker(sp)}
                                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                  {sp.photo ? (
                                    <img
                                      src={sp.photo}
                                      alt={sp.name}
                                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                                      {sp.name.charAt(0)}
                                    </div>
                                  )}
                                  <span className="text-xs font-semibold text-white/90">
                                    {sp.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                          {session.registration_required && (
                            <button
                              onClick={() => handleReserveSeat(session)}
                              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 ${
                                isReserved
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
                              }`}
                            >
                              {isReserved ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Seat Reserved
                                </>
                              ) : (
                                "Reserve Seat"
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleMyAgenda(session)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all inline-flex items-center gap-1.5 ${
                              isSavedInAgenda
                                ? "bg-white/10 text-white border-white/20"
                                : "bg-transparent text-white/60 border-white/10 hover:bg-white/[0.06]"
                            }`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                isSavedInAgenda ? "fill-purple-400 text-purple-400" : ""
                              }`}
                            />
                            {isSavedInAgenda ? "Saved" : "Add to My Agenda"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: SPEAKERS DIRECTORY ────────────────────────── */}
        {activeTab === "speakers" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Keynote Speakers & Presenters
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Learn from world-class industry experts, practitioners, and leaders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  onClick={() => setSelectedSpeaker(speaker)}
                  className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] rounded-2xl p-5 cursor-pointer transition-all hover:border-purple-500/40 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      {speaker.photo ? (
                        <img
                          src={speaker.photo}
                          alt={speaker.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-white/20"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-lg font-bold text-white">
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {speaker.name}
                        </h3>
                        {speaker.job_title && (
                          <p className="text-xs text-purple-300 mt-0.5">{speaker.job_title}</p>
                        )}
                        {speaker.company && (
                          <p className="text-xs text-white/50">{speaker.company}</p>
                        )}
                      </div>
                    </div>

                    {speaker.bio && (
                      <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                        {speaker.bio}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40">
                    <span>View Profile & Sessions</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: VENUE & DIRECTIONS ────────────────────────── */}
        {activeTab === "venue" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Venue & Access Information
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Everything you need to reach the venue and navigate conference halls.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-white">{event.venue}</h3>
                  <p className="text-xs text-white/60 mt-1">
                    Present your digital UrPass QR at the main entrance gate for contactless badge printing and access.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Rooms list */}
            {rooms.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Conference Halls & Rooms
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1"
                    >
                      <p className="text-sm font-bold text-white">{room.name}</p>
                      {room.floor && <p className="text-xs text-purple-300">{room.floor}</p>}
                      {room.location && <p className="text-xs text-white/50">{room.location}</p>}
                      <p className="text-[11px] text-white/40 pt-1">Capacity: {room.capacity} seats</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: MY AGENDA ─────────────────────────────────── */}
        {activeTab === "my_agenda" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Star className="w-6 h-6 text-purple-400 fill-current" />
                  My Personal Agenda
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Your customized conference schedule. One attendee. One QR code.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {passToken && (
                  <Link
                    href={`/pass/${passToken}`}
                    className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    Open My UrPass QR
                  </Link>
                )}
              </div>
            </div>

            {myAgendaSessions.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
                <Star className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white/70">Your itinerary is currently empty</p>
                <p className="text-xs text-white/40 mt-1">
                  Explore the Agenda tab and click "Add to My Agenda" or "Reserve Seat" on talks you wish to attend.
                </p>
                <button
                  onClick={() => setActiveTab("agenda")}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl"
                >
                  Browse Agenda
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myAgendaSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-purple-300">
                          {session.session_date} • {formatSessionTimeRange(session.start_time, session.end_time)}
                        </span>
                        {myReservedSessionIds.has(session.id) && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Seat Reserved
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white">{session.title}</h3>
                      {session.room && (
                        <p className="text-xs text-white/50 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400" />
                          {session.room.name}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleMyAgenda(session)}
                      className="px-3.5 py-1.5 text-xs text-white/50 hover:text-red-400 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors self-start sm:self-auto"
                    >
                      Remove from My Agenda
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Speaker Detail Modal ──────────────────────────────── */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              {selectedSpeaker.photo ? (
                <img
                  src={selectedSpeaker.photo}
                  alt={selectedSpeaker.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {selectedSpeaker.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{selectedSpeaker.name}</h3>
                {selectedSpeaker.job_title && (
                  <p className="text-xs text-purple-300">{selectedSpeaker.job_title}</p>
                )}
                {selectedSpeaker.company && (
                  <p className="text-xs text-white/50">{selectedSpeaker.company}</p>
                )}
              </div>
            </div>

            {selectedSpeaker.bio && (
              <p className="text-xs text-white/70 leading-relaxed pt-2 border-t border-white/[0.08]">
                {selectedSpeaker.bio}
              </p>
            )}

            {/* Speaking Sessions */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Scheduled Sessions
              </h4>
              <div className="space-y-2">
                {sessions
                  .filter((s) =>
                    (s.speakers || []).some(
                      (sp) => (sp.speaker_id || sp.speaker?.id) === selectedSpeaker.id
                    )
                  )
                  .map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs space-y-1"
                    >
                      <p className="font-bold text-white">{s.title}</p>
                      <p className="text-purple-300 text-[11px]">
                        {s.session_date} • {formatSessionTimeRange(s.start_time, s.end_time)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-white/[0.08] py-8 text-center text-xs text-white/40">
        <p>{website.footer_text || `© ${new Date().getFullYear()} ${event.name}. Powered by UrPass.`}</p>
      </footer>
    </div>
  );
}
