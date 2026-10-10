"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Plus,
  Download,
  Edit3,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Layers,
} from "lucide-react";
import type {
  EventSession,
  EventTrack,
  EventRoom,
  EventSpeaker,
} from "@/types/conference";
import { formatSessionTimeRange } from "@/lib/conference/conflict-detection";
import { SESSION_TYPE_CONFIG } from "@/lib/conference/helpers";
import SessionModal from "./SessionModal";

interface SessionsManagerProps {
  eventId: string;
  eventName: string;
  initialSessions: EventSession[];
  tracks: EventTrack[];
  rooms: EventRoom[];
  speakers: EventSpeaker[];
  ticketTypes?: Array<{ id: string; name: string; price?: number }>;
}

export default function SessionsManager({
  eventId,
  eventName,
  initialSessions,
  tracks,
  rooms,
  speakers,
  ticketTypes = [],
}: SessionsManagerProps) {
  const [sessions, setSessions] = useState<EventSession[]>(initialSessions);
  const [search, setSearch] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<EventSession | null>(null);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase());
      const matchTrack = selectedTrack === "all" || s.track_id === selectedTrack;
      const matchRoom = selectedRoom === "all" || s.room_id === selectedRoom;
      const matchType = selectedType === "all" || s.session_type === selectedType;
      return matchSearch && matchTrack && matchRoom && matchType;
    });
  }, [sessions, search, selectedTrack, selectedRoom, selectedType]);

  // Aggregate stats
  const totalReservations = useMemo(() => {
    return sessions.reduce((acc, s) => acc + (s.reservation_count || 0), 0);
  }, [sessions]);

  const totalCheckIns = useMemo(() => {
    return sessions.reduce((acc, s) => acc + (s.checked_in_count || 0), 0);
  }, [sessions]);

  function handleCreate() {
    setSessionToEdit(null);
    setModalOpen(true);
  }

  function handleEdit(session: EventSession) {
    setSessionToEdit(session);
    setModalOpen(true);
  }

  async function handleDelete(sessionId: string) {
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

  function handleSuccess(saved: EventSession) {
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      if (exists) {
        return prev.map((s) => (s.id === saved.id ? saved : s));
      }
      return [...prev, saved];
    });
  }

  function handleExportCsv() {
    const headers = [
      "Session Title",
      "Type",
      "Date",
      "Start Time",
      "End Time",
      "Track",
      "Room",
      "Capacity",
      "Reservations",
      "Status",
    ];

    const rows = filtered.map((s) => [
      `"${s.title.replace(/"/g, '""')}"`,
      s.session_type,
      s.session_date,
      s.start_time,
      s.end_time,
      `"${s.track?.name || ""}"`,
      `"${s.room?.name || ""}"`,
      s.capacity || s.room?.capacity || "Unlimited",
      s.reservation_count ?? 0,
      s.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${eventName.replace(/\s+/g, "_")}_sessions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Sessions
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage all conference presentations, keynotes, workshops, and panels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 rounded-xl transition-colors inline-flex items-center gap-1.5"
            title="Export session agenda list"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            Agenda CSV
          </button>
          <a
            href={`/api/events/${eventId}/sessions/export-csv`}
            download
            className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-xl transition-colors inline-flex items-center gap-1.5"
            title="Export full session attendance, reservation, and check-in audit records"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Attendance CSV
          </a>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Session
          </button>
        </div>
      </div>

      {/* ── Summary Stats Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
          <p className="text-xs font-semibold text-neutral-400">Total Sessions</p>
          <p className="text-xl font-bold text-neutral-900 mt-1">{sessions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
          <p className="text-xs font-semibold text-neutral-400">Total Reservations</p>
          <p className="text-xl font-bold text-purple-600 mt-1">{totalReservations}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
          <p className="text-xs font-semibold text-neutral-400">Total Check-Ins</p>
          <p className="text-xl font-bold text-green-600 mt-1">{totalCheckIns}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
          <p className="text-xs font-semibold text-neutral-400">Active Rooms</p>
          <p className="text-xl font-bold text-neutral-900 mt-1">{rooms.length}</p>
        </div>
      </div>

      {/* ── Filter Controls ───────────────────────────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-xs flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sessions by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        {/* Track Filter */}
        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white focus:outline-hidden"
        >
          <option value="all">All Tracks</option>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Room Filter */}
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white focus:outline-hidden"
        >
          <option value="all">All Rooms</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white focus:outline-hidden capitalize"
        >
          <option value="all">All Types</option>
          {Object.entries(SESSION_TYPE_CONFIG).map(([typeKey, cfg]) => (
            <option key={typeKey} value={typeKey}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Sessions Table ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700">No sessions found</p>
            <p className="text-xs text-neutral-400 mt-1">
              Try adjusting your search criteria or create a new session.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Session Title</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Speakers</th>
                  <th className="py-3 px-4">Reservations</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {filtered.map((session) => {
                  const typeCfg =
                    SESSION_TYPE_CONFIG[session.session_type] ||
                    SESSION_TYPE_CONFIG.presentation;
                  const track = session.track;
                  const room = session.room;
                  const speakersList = (session.speakers || [])
                    .map((s) => s.speaker?.name)
                    .filter(Boolean);

                  return (
                    <tr key={session.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 max-w-[260px]">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}
                          >
                            {typeCfg.label}
                          </span>
                          {session.registration_required && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                              Reserved Only
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-1">{session.title}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-800">
                          {formatSessionTimeRange(session.start_time, session.end_time)}
                        </div>
                        <div className="text-[11px] text-neutral-400">{session.session_date}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {track ? (
                          <span
                            className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: track.colour }}
                          >
                            {track.name}
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {room ? (
                          <span className="font-medium text-neutral-800">{room.name}</span>
                        ) : (
                          <span className="text-neutral-400">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-[150px] truncate">
                        {speakersList.length > 0 ? (
                          <span className="text-neutral-700">{speakersList.join(", ")}</span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900">
                            {session.reservation_count ?? 0}
                          </span>
                          <span className="text-neutral-400">
                            / {session.capacity || room?.capacity || "∞"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-full capitalize ${
                            session.status === "published"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : session.status === "draft"
                              ? "bg-neutral-100 text-neutral-600 border border-neutral-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/scan/${eventId}?session=${session.id}`}
                            className="p-1.5 text-neutral-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                            title="Open doorway scanner for this session"
                            target="_blank"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleEdit(session)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                            title="Edit session"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────── */}
      <SessionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
        eventId={eventId}
        sessionToEdit={sessionToEdit}
        tracks={tracks}
        rooms={rooms}
        speakers={speakers}
        allSessions={sessions}
        ticketTypes={ticketTypes}
      />
    </div>
  );
}
