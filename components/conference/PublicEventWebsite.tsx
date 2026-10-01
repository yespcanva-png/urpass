"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
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
  ArrowRight,
  Star,
  Info,
  Building2,
  CalendarDays,
  ShieldCheck,
  Compass,
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
    <div className="min-h-screen bg-slate-50/50 text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased">
      {/* ── Conflict Alert Modal / Toast ──────────────────────── */}
      {conflictAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-amber-200 rounded-2xl p-6 max-w-md w-full shadow-xl text-left space-y-3">
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
              Schedule Conflict Detected
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {conflictAlert.message}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setConflictAlert(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Attendee Credentials Prompt Modal ─────────────────── */}
      {attendeeInputModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-neutral-900" />
                <h3 className="text-sm font-bold text-neutral-900">Attendee Verification</h3>
              </div>
              <button
                onClick={() => setAttendeeInputModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Enter your registered event email or pass token to reserve seats and sync your personal agenda.
            </p>

            <form onSubmit={handleAttendeePromptSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Registration Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Or Pass Token / ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="UP-XXXX or token"
                  value={passToken}
                  onChange={(e) => setPassToken(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAttendeeInputModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-neutral-600 hover:text-neutral-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-xs transition-colors"
                >
                  Confirm & Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── HERO SECTION (Clean Editorial Corporate Aesthetic) ─── */}
      {sections.hero?.enabled !== false && (
        <section className="relative overflow-hidden pt-14 pb-16 px-4 sm:px-6 bg-white border-b border-neutral-200">
          <div className="relative max-w-4xl mx-auto text-center space-y-4">
            {event.logo_url && (
              <div className="flex justify-center mb-1">
                <img
                  src={event.logo_url}
                  alt={event.name}
                  className="w-14 h-14 rounded-xl object-contain border border-neutral-200 shadow-2xs"
                />
              </div>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
              Official Conference Schedule & Passes
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
              {event.name}
            </h1>

            {event.description && (
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Date & Venue Corporate Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs text-neutral-700 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {formattedEventDate}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {event.venue}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {passToken ? (
                <Link
                  href={`/pass/${passToken}`}
                  className="px-6 py-3 text-sm font-semibold text-neutral-800 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 shadow-2xs transition-all inline-flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-neutral-700" />
                  View My Pass
                </Link>
              ) : (
                <Link
                  href={registerUrl}
                  className="px-6 py-3 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
                >
                  {website.cta_text || "Register Now"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={() => setActiveTab("my_agenda")}
                className="px-5 py-3 text-sm font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl shadow-2xs transition-all inline-flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                My Agenda ({myAgendaSessions.length})
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT AREA WITH TABS ─────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Universal Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-xl mb-8 overflow-x-auto text-xs font-semibold shadow-2xs">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "agenda"
                ? "bg-neutral-900 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => setActiveTab("speakers")}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "speakers"
                ? "bg-neutral-900 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Speakers ({speakers.length})
          </button>
          <button
            onClick={() => setActiveTab("venue")}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "venue"
                ? "bg-neutral-900 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Venue & Access
          </button>
          <button
            onClick={() => setActiveTab("my_agenda")}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "my_agenda"
                ? "bg-neutral-900 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            My Agenda
            {myAgendaSessions.length > 0 && (
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  activeTab === "my_agenda"
                    ? "bg-white text-neutral-900"
                    : "bg-neutral-900 text-white"
                }`}
              >
                {myAgendaSessions.length}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB 1: AGENDA VIEW ──────────────────────────────── */}
        {activeTab === "agenda" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Conference Schedule
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Browse keynotes, executive sessions, workshops, and reserve your seats.
                </p>
              </div>

              {/* Day switcher (Pill control) */}
              {uniqueDates.length > 1 && (
                <div className="flex items-center gap-1.5 p-1 bg-neutral-100 border border-neutral-200/80 rounded-xl">
                  {uniqueDates.map((date, idx) => {
                    const active = selectedDate === date;
                    const d = new Date(date + "T00:00:00");
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          active
                            ? "bg-white text-neutral-900 shadow-2xs"
                            : "text-neutral-600 hover:text-neutral-900"
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
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <button
                  onClick={() => setSelectedTrackId("all")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
                    selectedTrackId === "all"
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  All Tracks
                </button>
                {tracks.map((t) => {
                  const isSelected = selectedTrackId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrackId(t.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 border ${
                        isSelected
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                          : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: t.colour }}
                      />
                      {t.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sessions List */}
            {filteredSessions.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                <CalendarDays className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">No sessions match current filters</p>
                <p className="text-xs text-neutral-400 mt-0.5">Try selecting another track or day above.</p>
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
                      className="bg-white hover:border-neutral-300 border border-neutral-200/90 rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          {/* Tags row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                              {typeCfg.label}
                            </span>

                            {track && (
                              <span
                                className="text-[11px] font-medium px-2.5 py-0.5 rounded-md text-neutral-800 bg-neutral-50 border border-neutral-200 inline-flex items-center gap-1.5"
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: track.colour }}
                                />
                                {track.name}
                              </span>
                            )}

                            {session.registration_required && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                                Reservation Required
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <Link
                            href={`/e/${website.slug || event.id}/session/${session.slug || session.id}`}
                            className="text-base sm:text-lg font-bold text-neutral-900 hover:text-neutral-600 transition-colors block"
                          >
                            {session.title}
                          </Link>

                          {/* Description */}
                          {session.description && (
                            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                              {session.description}
                            </p>
                          )}

                          {/* Meta Details: Time, Room, Capacity */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500 pt-1">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-700">
                              <Clock className="w-3.5 h-3.5 text-neutral-500" />
                              {formatSessionTimeRange(session.start_time, session.end_time)}
                            </span>

                            {room && (
                              <span className="inline-flex items-center gap-1.5 text-neutral-600">
                                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                {room.name} {room.floor ? `(${room.floor})` : ""}
                              </span>
                            )}

                            {(session.capacity || room?.capacity) && (
                              <span className="inline-flex items-center gap-1.5 text-neutral-500">
                                <Users className="w-3.5 h-3.5 text-neutral-400" />
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
                                  className="flex items-center gap-2 group text-left"
                                >
                                  {sp.photo ? (
                                    <img
                                      src={sp.photo}
                                      alt={sp.name}
                                      className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-bold text-white">
                                      {sp.name.charAt(0)}
                                    </div>
                                  )}
                                  <span className="text-xs font-semibold text-neutral-800 group-hover:text-neutral-950 transition-colors">
                                    {sp.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interactive Action Buttons */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                          {session.registration_required && (
                            <button
                              onClick={() => handleReserveSeat(session)}
                              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 ${
                                isReserved
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs"
                              }`}
                            >
                              {isReserved ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Seat Reserved
                                </>
                              ) : (
                                "Reserve Seat"
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleMyAgenda(session)}
                            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all inline-flex items-center gap-1.5 shadow-2xs ${
                              isSavedInAgenda
                                ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100/70"
                                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                            }`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                isSavedInAgenda ? "fill-amber-500 text-amber-500" : "text-neutral-400"
                              }`}
                            />
                            {isSavedInAgenda ? "In My Agenda" : "Add to My Agenda"}
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
            <div className="pb-2 border-b border-neutral-200/80">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Featured Speakers & Presenters
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Learn from world-class industry experts, practitioners, and leaders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  onClick={() => setSelectedSpeaker(speaker)}
                  className="bg-white hover:border-neutral-300 border border-neutral-200 rounded-2xl p-5 cursor-pointer transition-all shadow-xs hover:shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      {speaker.photo ? (
                        <img
                          src={speaker.photo}
                          alt={speaker.name}
                          className="w-14 h-14 rounded-xl object-cover border border-neutral-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center text-lg font-bold text-white shadow-2xs">
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-neutral-900 leading-tight">
                          {speaker.name}
                        </h3>
                        {speaker.job_title && (
                          <p className="text-xs font-semibold text-neutral-600 mt-0.5">{speaker.job_title}</p>
                        )}
                        {speaker.company && (
                          <p className="text-xs text-neutral-400 font-medium">{speaker.company}</p>
                        )}
                      </div>
                    </div>

                    {speaker.bio && (
                      <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                        {speaker.bio}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-500">
                    <span>View Profile & Sessions</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: VENUE & DIRECTIONS ────────────────────────── */}
        {activeTab === "venue" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="pb-2 border-b border-neutral-200/80">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Venue & Access Information
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Everything you need to reach the venue and navigate conference halls.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{event.venue}</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Present your digital UrPass QR at the main entrance gate for contactless badge printing and access.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Rooms list */}
            {rooms.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Conference Halls & Rooms
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1 shadow-2xs"
                    >
                      <p className="text-sm font-bold text-neutral-900">{room.name}</p>
                      {room.floor && <p className="text-xs font-semibold text-neutral-600">{room.floor}</p>}
                      {room.location && <p className="text-xs text-neutral-500">{room.location}</p>}
                      <p className="text-[11px] text-neutral-400 pt-1 font-medium">Capacity: {room.capacity} seats</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  My Personal Agenda
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Your customized conference schedule. One attendee. One QR code.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {passToken && (
                  <Link
                    href={`/pass/${passToken}`}
                    className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    Open My UrPass QR
                  </Link>
                )}
              </div>
            </div>

            {myAgendaSessions.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                <Star className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-800">Your itinerary is currently empty</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Explore the Agenda tab and click "Add to My Agenda" or "Reserve Seat" on talks you wish to attend.
                </p>
                <button
                  onClick={() => setActiveTab("agenda")}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs"
                >
                  Browse Agenda
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myAgendaSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-600">
                          {session.session_date} • {formatSessionTimeRange(session.start_time, session.end_time)}
                        </span>
                        {myReservedSessionIds.has(session.id) && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Seat Reserved
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-neutral-900">{session.title}</h3>
                      {session.room && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          {session.room.name}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleMyAgenda(session)}
                      className="px-3.5 py-1.5 text-xs text-neutral-500 hover:text-red-600 rounded-lg border border-neutral-200 hover:border-red-200 hover:bg-red-50/50 transition-colors self-start sm:self-auto font-medium"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              {selectedSpeaker.photo ? (
                <img
                  src={selectedSpeaker.photo}
                  alt={selectedSpeaker.name}
                  className="w-16 h-16 rounded-xl object-cover border border-neutral-200 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-neutral-900 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-2xs">
                  {selectedSpeaker.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-neutral-900">{selectedSpeaker.name}</h3>
                {selectedSpeaker.job_title && (
                  <p className="text-xs font-semibold text-neutral-600">{selectedSpeaker.job_title}</p>
                )}
                {selectedSpeaker.company && (
                  <p className="text-xs text-neutral-400 font-medium">{selectedSpeaker.company}</p>
                )}
              </div>
            </div>

            {selectedSpeaker.bio && (
              <p className="text-xs text-neutral-600 leading-relaxed pt-2 border-t border-neutral-100">
                {selectedSpeaker.bio}
              </p>
            )}

            {/* Speaking Sessions */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
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
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1"
                    >
                      <p className="font-bold text-neutral-900">{s.title}</p>
                      <p className="text-neutral-500 text-[11px] font-medium">
                        {s.session_date} • {formatSessionTimeRange(s.start_time, s.end_time)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER (Corporate Clean Style) ────────────────────── */}
      <footer className="mt-20 border-t border-neutral-200 bg-white py-10 text-center text-xs text-neutral-500">
        <p>{website.footer_text || `© ${new Date().getFullYear()} ${event.name}. Powered by UrPass.`}</p>
      </footer>
    </div>
  );
}
