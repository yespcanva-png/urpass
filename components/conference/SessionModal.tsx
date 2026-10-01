"use client";

import { useState, useMemo } from "react";
import {
  X,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  AlertTriangle,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import type {
  EventSession,
  EventTrack,
  EventRoom,
  EventSpeaker,
  SessionType,
  SpeakerRole,
  SessionVisibility,
  SessionStatus,
} from "@/types/conference";
import {
  checkRoomConflict,
  checkSpeakerConflicts,
  timeStringToMinutes,
} from "@/lib/conference/conflict-detection";
import { SESSION_TYPE_CONFIG, SPEAKER_ROLE_CONFIG } from "@/lib/conference/helpers";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: EventSession) => void;
  eventId: string;
  defaultDate?: string;
  sessionToEdit?: EventSession | null;
  tracks: EventTrack[];
  rooms: EventRoom[];
  speakers: EventSpeaker[];
  allSessions: EventSession[];
}

export default function SessionModal({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  defaultDate,
  sessionToEdit,
  tracks,
  rooms,
  speakers,
  allSessions,
}: SessionModalProps) {
  const [title, setTitle] = useState(sessionToEdit?.title || "");
  const [description, setDescription] = useState(sessionToEdit?.description || "");
  const [sessionType, setSessionType] = useState<SessionType>(sessionToEdit?.session_type || "presentation");
  const [sessionDate, setSessionDate] = useState(
    sessionToEdit?.session_date || defaultDate || new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(sessionToEdit?.start_time?.slice(0, 5) || "10:00");
  const [endTime, setEndTime] = useState(sessionToEdit?.end_time?.slice(0, 5) || "11:00");
  const [trackId, setTrackId] = useState(sessionToEdit?.track_id || "");
  const [roomId, setRoomId] = useState(sessionToEdit?.room_id || "");
  const [capacity, setCapacity] = useState(
    sessionToEdit?.capacity !== null && sessionToEdit?.capacity !== undefined
      ? String(sessionToEdit.capacity)
      : ""
  );
  const [registrationRequired, setRegistrationRequired] = useState(sessionToEdit?.registration_required || false);
  const [allowWaitlist, setAllowWaitlist] = useState(sessionToEdit?.allow_waitlist ?? true);
  const [checkinEnabled, setCheckinEnabled] = useState(sessionToEdit?.checkin_enabled ?? true);
  const [requireCheckout, setRequireCheckout] = useState(sessionToEdit?.require_checkout ?? false);
  const [visibility, setVisibility] = useState<SessionVisibility>(sessionToEdit?.visibility || "public");
  const [status, setStatus] = useState<SessionStatus>(sessionToEdit?.status || "published");
  const [coverImage, setCoverImage] = useState(sessionToEdit?.cover_image || "");
  const [tagsStr, setTagsStr] = useState(sessionToEdit?.tags?.join(", ") || "");
  const [streamingUrl, setStreamingUrl] = useState(sessionToEdit?.external_streaming_url || "");
  const [meetingUrl, setMeetingUrl] = useState(sessionToEdit?.meeting_url || "");

  // Speaker assignments: array of { speakerId, role, sortOrder }
  const [assignedSpeakers, setAssignedSpeakers] = useState<
    Array<{ speakerId: string; role: SpeakerRole; sortOrder: number }>
  >(() => {
    if (sessionToEdit?.speakers && sessionToEdit.speakers.length > 0) {
      return sessionToEdit.speakers.map((s, idx) => ({
        speakerId: s.speaker_id || s.speaker?.id || "",
        role: s.role,
        sortOrder: s.sort_order ?? idx,
      }));
    }
    return [];
  });

  const [overrideConflicts, setOverrideConflicts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live Conflict Checking
  const roomConflict = useMemo(() => {
    if (!roomId || !sessionDate || !startTime || !endTime) return null;
    return checkRoomConflict(
      {
        id: sessionToEdit?.id,
        room_id: roomId,
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
      },
      allSessions
    );
  }, [sessionToEdit?.id, roomId, sessionDate, startTime, endTime, allSessions]);

  const speakerConflicts = useMemo(() => {
    if (!assignedSpeakers.length || !sessionDate || !startTime || !endTime) return [];
    const speakerIds = assignedSpeakers.map((s) => s.speakerId).filter(Boolean);
    return checkSpeakerConflicts(
      {
        id: sessionToEdit?.id,
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
      },
      speakerIds,
      allSessions
    );
  }, [sessionToEdit?.id, assignedSpeakers, sessionDate, startTime, endTime, allSessions]);

  const hasConflicts = Boolean(roomConflict || speakerConflicts.length > 0);

  if (!isOpen) return null;

  function handleAddSpeaker() {
    // Pick first unassigned speaker
    const available = speakers.find((sp) => !assignedSpeakers.some((as) => as.speakerId === sp.id));
    if (available) {
      setAssignedSpeakers((prev) => [
        ...prev,
        { speakerId: available.id, role: "speaker", sortOrder: prev.length },
      ]);
    } else if (speakers.length > 0) {
      setAssignedSpeakers((prev) => [
        ...prev,
        { speakerId: speakers[0].id, role: "speaker", sortOrder: prev.length },
      ]);
    }
  }

  function handleRemoveSpeaker(index: number) {
    setAssignedSpeakers((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSpeakerChange(index: number, key: "speakerId" | "role", value: string) {
    setAssignedSpeakers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Session title is required.");
      return;
    }

    if (timeStringToMinutes(endTime) <= timeStringToMinutes(startTime)) {
      setError("End time must be strictly after start time.");
      return;
    }

    if (roomId && capacity) {
      const selectedRoom = rooms.find((r) => r.id === roomId);
      if (selectedRoom && Number(capacity) > selectedRoom.capacity && !overrideConflicts) {
        setError(`Warning: Session capacity (${capacity}) exceeds the room capacity of "${selectedRoom.name}" (${selectedRoom.capacity}). Check "Override conflicts" below to publish anyway.`);
        return;
      }
    }

    if (hasConflicts && !overrideConflicts) {
      setError("Please resolve scheduling conflicts or enable 'Override conflicts' to proceed.");
      return;
    }

    setLoading(true);
    setError("");

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const url = sessionToEdit
        ? `/api/events/${eventId}/sessions/${sessionToEdit.id}`
        : `/api/events/${eventId}/sessions`;
      const method = sessionToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          session_type: sessionType,
          session_date: sessionDate,
          start_time: startTime,
          end_time: endTime,
          track_id: trackId || null,
          room_id: roomId || null,
          capacity: capacity ? Number(capacity) : null,
          registration_required: registrationRequired,
          allow_waitlist: allowWaitlist,
          checkin_enabled: checkinEnabled,
          require_checkout: requireCheckout,
          visibility,
          status,
          cover_image: coverImage.trim() || null,
          tags,
          external_streaming_url: streamingUrl.trim() || null,
          meeting_url: meetingUrl.trim() || null,
          speakers: assignedSpeakers,
          override_conflicts: overrideConflicts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save session");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-neutral-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 leading-tight">
                {sessionToEdit ? "Edit Session" : "Create New Session"}
              </h2>
              <p className="text-xs text-neutral-400">Configure schedule, track, room & speakers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Conflict Warning Alerts */}
          {hasConflicts && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Scheduling Conflict Detected
              </div>
              {roomConflict && (
                <p className="text-xs text-amber-800 pl-6">{roomConflict.message}</p>
              )}
              {speakerConflicts.map((sc, i) => (
                <p key={i} className="text-xs text-amber-800 pl-6">
                  {sc.message}
                </p>
              ))}
              <div className="pt-2 pl-6 border-t border-amber-200/60">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideConflicts}
                    onChange={(e) => setOverrideConflicts(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                  />
                  <span className="text-xs font-semibold text-amber-900">
                    Allow overlap and override scheduling conflicts
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Session Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Session Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Opening Keynote: The Future of Intelligence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Session Type *
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as SessionType)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 bg-white capitalize"
              >
                {Object.entries(SESSION_TYPE_CONFIG).map(([typeKey, cfg]) => (
                  <option key={typeKey} value={typeKey}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What is this session about? Outline key takeaways, prerequisites..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                End Time *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          {/* Track & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Track
              </label>
              <select
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 bg-white"
              >
                <option value="">No Track (General)</option>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Room / Hall
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 bg-white"
              >
                <option value="">No Room Assigned</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (Cap: {r.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Speakers Section */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-500" />
                Assigned Speakers
              </label>
              <button
                type="button"
                onClick={handleAddSpeaker}
                className="text-xs font-medium text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Speaker
              </button>
            </div>

            {assignedSpeakers.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-2">
                No speakers assigned yet. Click "Add Speaker" to assign presenters.
              </p>
            ) : (
              <div className="space-y-2">
                {assignedSpeakers.map((as, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-neutral-50 rounded-xl border border-neutral-200/70"
                  >
                    <select
                      value={as.speakerId}
                      onChange={(e) => handleSpeakerChange(idx, "speakerId", e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-hidden"
                    >
                      {speakers.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} {sp.company ? `(${sp.company})` : ""}
                        </option>
                      ))}
                    </select>

                    <select
                      value={as.role}
                      onChange={(e) => handleSpeakerChange(idx, "role", e.target.value)}
                      className="text-xs px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-hidden"
                    >
                      {Object.entries(SPEAKER_ROLE_CONFIG).map(([roleKey, cfg]) => (
                        <option key={roleKey} value={roleKey}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(idx)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-200/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Capacity & Reservation Settings */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Registration & Capacity Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Custom Session Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Defaults to room capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                />
                {roomId && capacity && Number(capacity) > (rooms.find((r) => r.id === roomId)?.capacity || 0) && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    Exceeds room capacity ({rooms.find((r) => r.id === roomId)?.capacity})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SessionStatus)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 bg-white capitalize"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registrationRequired}
                  onChange={(e) => setRegistrationRequired(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800 block">
                    Reserved Session
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Attendees must explicitly reserve their seat in advance.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowWaitlist}
                  onChange={(e) => setAllowWaitlist(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800 block">
                    Allow Waitlist
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Accept waitlist entries when capacity is full.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkinEnabled}
                  onChange={(e) => setCheckinEnabled(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800 block">
                    Session Check-In Enabled
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Allow gate staff to scan attendees into this session.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireCheckout}
                  onChange={(e) => setRequireCheckout(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800 block">
                    Check-In + Check-Out
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Track exit times for workshops & certifications.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Optional links & tags */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Session Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Keynote, AI, Deep Learning, Cloud"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  External Streaming URL
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/live/..."
                  value={streamingUrl}
                  onChange={(e) => setStreamingUrl(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Virtual Meeting URL
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {sessionToEdit ? "Update Session" : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
