"use client";

import { Clock, MapPin, Users, Edit3, Trash2, Video, Sparkles } from "lucide-react";
import type { EventSession, EventTrack } from "@/types/conference";
import { formatSessionTimeRange } from "@/lib/conference/conflict-detection";
import { SESSION_TYPE_CONFIG } from "@/lib/conference/helpers";

interface TimelineViewProps {
  sessions: EventSession[];
  tracks: EventTrack[];
  onEditSession: (session: EventSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function TimelineView({
  sessions,
  tracks,
  onEditSession,
  onDeleteSession,
}: TimelineViewProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-100">
        <Sparkles className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-neutral-700">No sessions scheduled for this day</p>
        <p className="text-xs text-neutral-400 mt-1">
          Click "Add Session" to add talks, workshops, keynotes, or breaks.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-neutral-200">
      {sessions.map((session) => {
        const typeCfg =
          SESSION_TYPE_CONFIG[session.session_type] || SESSION_TYPE_CONFIG.presentation;
        const track = session.track;
        const room = session.room;
        const speakers = (session.speakers || []).map((s) => s.speaker).filter(Boolean);

        return (
          <div key={session.id} className="relative group">
            {/* Timeline dot */}
            <div
              className="absolute -left-6 sm:-left-8 top-3.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-125"
              style={{ backgroundColor: track?.colour || "#6C63FF" }}
            />

            {/* Session Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-100 hover:border-neutral-200 shadow-xs hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  {/* Tags row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}
                    >
                      {typeCfg.label}
                    </span>

                    {track && (
                      <span
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white shadow-2xs"
                        style={{ backgroundColor: track.colour }}
                      >
                        {track.name}
                      </span>
                    )}

                    {session.registration_required && (
                      <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        Reserved Only
                      </span>
                    )}

                    {session.status === "cancelled" && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                        Cancelled
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-neutral-900 leading-snug">
                    {session.title}
                  </h3>

                  {/* Description snippet */}
                  {session.description && (
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  )}

                  {/* Time, Room, Capacity metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-neutral-800">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {formatSessionTimeRange(session.start_time, session.end_time)}
                    </span>

                    {room && (
                      <span className="inline-flex items-center gap-1 text-neutral-600">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {room.name} {room.floor ? `(${room.floor})` : ""}
                      </span>
                    )}

                    {(session.capacity || room?.capacity) && (
                      <span className="inline-flex items-center gap-1 text-neutral-500">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        {session.capacity || room?.capacity} capacity
                        {session.reservation_count !== undefined && (
                          <span className="text-neutral-400">
                            • {session.reservation_count} reserved
                          </span>
                        )}
                      </span>
                    )}

                    {session.external_streaming_url && (
                      <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                        <Video className="w-3.5 h-3.5" />
                        Live stream
                      </span>
                    )}
                  </div>

                  {/* Speakers display */}
                  {speakers.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {speakers.map((sp: any) => (
                        <div key={sp.id} className="flex items-center gap-2">
                          {sp.photo ? (
                            <img
                              src={sp.photo}
                              alt={sp.name}
                              className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-700">
                              {sp.name.charAt(0)}
                            </div>
                          )}
                          <div className="text-xs">
                            <span className="font-semibold text-neutral-800">{sp.name}</span>
                            {sp.company && (
                              <span className="text-neutral-400 text-[11px] ml-1">
                                ({sp.company})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => onEditSession(session)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                    title="Edit session"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
