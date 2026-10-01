"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Layers,
  DoorOpen,
  ExternalLink,
  SlidersHorizontal,
  CalendarDays,
  List,
  Columns,
  Share2,
  Sparkles,
} from "lucide-react";
import type {
  EventSession,
  EventTrack,
  EventRoom,
  EventSpeaker,
} from "@/types/conference";
import TimelineView from "./TimelineView";
import CalendarView from "./CalendarView";
import ListView from "./ListView";
import SessionModal from "./SessionModal";
import TrackModal from "./TrackModal";
import RoomModal from "./RoomModal";

interface AgendaDashboardProps {
  eventId: string;
  eventName: string;
  eventDates: {
    start: string;
    end: string;
    formatted: string;
  };
  eventStatus: string;
  websiteSlug?: string;
  initialTracks: EventTrack[];
  initialRooms: EventRoom[];
  initialSessions: EventSession[];
  initialSpeakers: EventSpeaker[];
}

type ViewMode = "timeline" | "calendar" | "list";

export default function AgendaDashboard({
  eventId,
  eventName,
  eventDates,
  eventStatus,
  websiteSlug,
  initialTracks,
  initialRooms,
  initialSessions,
  initialSpeakers,
}: AgendaDashboardProps) {
  const [tracks, setTracks] = useState<EventTrack[]>(initialTracks);
  const [rooms, setRooms] = useState<EventRoom[]>(initialRooms);
  const [sessions, setSessions] = useState<EventSession[]>(initialSessions);
  const [speakers, setSpeakers] = useState<EventSpeaker[]>(initialSpeakers);

  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [selectedTrackId, setSelectedTrackId] = useState<string>("all");

  // Modals
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<EventSession | null>(null);

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  // Distinct sorted dates
  const uniqueDates = useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) {
      if (s.session_date) set.add(s.session_date);
    }
    // Also include event start date if empty
    if (set.size === 0 && eventDates.start) {
      set.add(eventDates.start);
    }
    return Array.from(set).sort();
  }, [sessions, eventDates.start]);

  const [selectedDate, setSelectedDate] = useState<string>(uniqueDates[0] || eventDates.start);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchDate = viewMode === "list" || !selectedDate ? true : s.session_date === selectedDate;
      const matchTrack = selectedTrackId === "all" ? true : s.track_id === selectedTrackId;
      return matchDate && matchTrack;
    });
  }, [sessions, selectedDate, selectedTrackId, viewMode]);

  // Handlers
  function handleOpenCreateSession() {
    setSessionToEdit(null);
    setSessionModalOpen(true);
  }

  function handleEditSession(session: EventSession) {
    setSessionToEdit(session);
    setSessionModalOpen(true);
  }

  async function handleDeleteSession(sessionId: string) {
    if (!confirm("Are you sure you want to delete this session?")) return;
    try {
      const res = await fetch(`/api/events/${eventId}/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleSessionSaved(savedSession: EventSession) {
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === savedSession.id);
      if (exists) {
        return prev.map((s) => (s.id === savedSession.id ? savedSession : s));
      }
      return [...prev, savedSession];
    });
  }

  function handleTrackSaved(savedTrack: EventTrack) {
    setTracks((prev) => {
      const exists = prev.some((t) => t.id === savedTrack.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTrack.id ? savedTrack : t));
      }
      return [...prev, savedTrack];
    });
  }

  function handleRoomSaved(savedRoom: EventRoom) {
    setRooms((prev) => {
      const exists = prev.some((r) => r.id === savedRoom.id);
      if (exists) {
        return prev.map((r) => (r.id === savedRoom.id ? savedRoom : r));
      }
      return [...prev, savedRoom];
    });
  }

  const previewUrl = websiteSlug ? `/e/${websiteSlug}` : `/e/${eventId}`;

  return (
    <div className="space-y-6">
      {/* ── Agenda Header ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-100 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Conference Agenda
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                  eventStatus === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {eventStatus}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {eventName} Schedule
            </h1>
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {eventDates.formatted} • {sessions.length} Sessions • {tracks.length} Tracks •{" "}
              {rooms.length} Halls
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTrackModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              Add Track
            </button>

            <button
              onClick={() => setRoomModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <DoorOpen className="w-3.5 h-3.5 text-neutral-500" />
              Manage Rooms
            </button>

            <Link
              href={previewUrl}
              target="_blank"
              className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Preview Agenda
            </Link>

            <button
              onClick={handleOpenCreateSession}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Session
            </button>
          </div>
        </div>

        {/* ── Subheader Controls (Day Switcher, Track Filter, View Toggles) ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-5 border-t border-neutral-100">
          {/* Day switcher tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {uniqueDates.map((date, idx) => {
              const active = selectedDate === date;
              const dateObj = new Date(date + "T00:00:00");
              const label = `Day ${idx + 1} (${dateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })})`;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                    active
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right controls: Track filter & View modes */}
          <div className="flex items-center gap-3">
            {/* Track Filter */}
            {tracks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-400 font-medium">Track:</span>
                <select
                  value={selectedTrackId}
                  onChange={(e) => setSelectedTrackId(e.target.value)}
                  className="text-xs font-medium px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden"
                >
                  <option value="all">All Tracks</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* View Switcher: Timeline / Calendar / List */}
            <div className="flex items-center p-0.5 bg-neutral-100 rounded-xl">
              <button
                onClick={() => setViewMode("timeline")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "timeline"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="Timeline View"
              >
                <CalendarDays className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "calendar"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="Calendar Grid View"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="Table List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active View Rendering ─────────────────────────────────── */}
      <div>
        {viewMode === "timeline" && (
          <TimelineView
            sessions={filteredSessions}
            tracks={tracks}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {viewMode === "calendar" && (
          <CalendarView
            sessions={filteredSessions}
            rooms={rooms}
            onEditSession={handleEditSession}
          />
        )}

        {viewMode === "list" && (
          <ListView
            sessions={filteredSessions}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
          />
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────── */}
      <SessionModal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        onSuccess={handleSessionSaved}
        eventId={eventId}
        defaultDate={selectedDate}
        sessionToEdit={sessionToEdit}
        tracks={tracks}
        rooms={rooms}
        speakers={speakers}
        allSessions={sessions}
      />

      <TrackModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        onSuccess={handleTrackSaved}
        eventId={eventId}
      />

      <RoomModal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        onSuccess={handleRoomSaved}
        eventId={eventId}
      />
    </div>
  );
}
