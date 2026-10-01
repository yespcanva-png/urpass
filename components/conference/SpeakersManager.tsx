"use client";

import { useState } from "react";
import {
  User,
  Plus,
  Globe,
  Mail,
  Phone,
  Edit3,
  Trash2,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { EventSpeaker } from "@/types/conference";
import SpeakerModal from "./SpeakerModal";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface SpeakersManagerProps {
  eventId: string;
  eventName: string;
  initialSpeakers: EventSpeaker[];
}

export default function SpeakersManager({
  eventId,
  eventName,
  initialSpeakers,
}: SpeakersManagerProps) {
  const [speakers, setSpeakers] = useState<EventSpeaker[]>(initialSpeakers);
  const [modalOpen, setModalOpen] = useState(false);
  const [speakerToEdit, setSpeakerToEdit] = useState<EventSpeaker | null>(null);

  function handleCreate() {
    setSpeakerToEdit(null);
    setModalOpen(true);
  }

  function handleEdit(speaker: EventSpeaker) {
    setSpeakerToEdit(speaker);
    setModalOpen(true);
  }

  async function handleDelete(speakerId: string) {
    if (!confirm("Are you sure you want to delete this speaker?")) return;
    try {
      const res = await fetch(`/api/events/${eventId}/speakers/${speakerId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSpeakers((prev) => prev.filter((s) => s.id !== speakerId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleSuccess(saved: EventSpeaker) {
    setSpeakers((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      if (exists) {
        return prev.map((s) => (s.id === saved.id ? saved : s));
      }
      return [...prev, saved];
    });
  }

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Speakers & Presenters
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage keynote speakers, panelists, moderators, and workshop instructors.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Speaker
        </button>
      </div>

      {/* ── Speakers Grid ─────────────────────────────────────── */}
      {speakers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-100">
          <User className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-700">No speakers added yet</p>
          <p className="text-xs text-neutral-400 mt-1">
            Add speakers to showcase their profiles and assign them to agenda sessions.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Speaker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {speakers.map((speaker) => {
            const assignedSessions = (speaker as any).session_speakers || [];

            return (
              <div
                key={speaker.id}
                className="bg-white rounded-2xl p-5 border border-neutral-100 hover:border-neutral-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Avatar & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {speaker.photo ? (
                      <img
                        src={speaker.photo}
                        alt={speaker.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-neutral-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-lg font-bold text-neutral-700">
                        {speaker.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(speaker)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Edit speaker"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(speaker.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Delete speaker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <h3 className="text-base font-bold text-neutral-900 leading-tight">
                    {speaker.name}
                  </h3>
                  {(speaker.job_title || speaker.company) && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {speaker.job_title}
                      {speaker.job_title && speaker.company ? " at " : ""}
                      {speaker.company && (
                        <span className="font-semibold text-neutral-700">{speaker.company}</span>
                      )}
                    </p>
                  )}

                  {/* Bio */}
                  {speaker.bio && (
                    <p className="text-xs text-neutral-500 mt-2.5 line-clamp-3 leading-relaxed">
                      {speaker.bio}
                    </p>
                  )}

                  {/* Topics */}
                  {speaker.topics && speaker.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {speaker.topics.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Assigned sessions & social links */}
                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <span>{assignedSessions.length} Assigned {assignedSessions.length === 1 ? "Session" : "Sessions"}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-neutral-400">
                    {speaker.linkedin_url && (
                      <a
                        href={speaker.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:text-blue-600"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {speaker.website_url && (
                      <a
                        href={speaker.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:text-neutral-900"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {speaker.email && (
                      <a href={`mailto:${speaker.email}`} className="p-1 hover:text-neutral-900">
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────── */}
      <SpeakerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
        eventId={eventId}
        speakerToEdit={speakerToEdit}
      />
    </div>
  );
}
