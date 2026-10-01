"use client";

import { Edit3, Trash2, ExternalLink, Users, Clock, MapPin } from "lucide-react";
import type { EventSession } from "@/types/conference";
import { formatSessionTimeRange } from "@/lib/conference/conflict-detection";
import { SESSION_TYPE_CONFIG } from "@/lib/conference/helpers";

interface ListViewProps {
  sessions: EventSession[];
  onEditSession: (session: EventSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function ListView({
  sessions,
  onEditSession,
  onDeleteSession,
}: ListViewProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-100">
        <p className="text-sm font-semibold text-neutral-700">No sessions match current filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Session</th>
              <th className="py-3 px-4">Time & Date</th>
              <th className="py-3 px-4">Track</th>
              <th className="py-3 px-4">Room</th>
              <th className="py-3 px-4">Speakers</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700">
            {sessions.map((session) => {
              const typeCfg =
                SESSION_TYPE_CONFIG[session.session_type] ||
                SESSION_TYPE_CONFIG.presentation;
              const track = session.track;
              const room = session.room;
              const speakers = (session.speakers || [])
                .map((s) => s.speaker?.name)
                .filter(Boolean);

              return (
                <tr key={session.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900 max-w-[240px]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}
                      >
                        {typeCfg.label}
                      </span>
                      {session.registration_required && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          Reserved
                        </span>
                      )}
                    </div>
                    <span className="line-clamp-1">{session.title}</span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-800">
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
                      <span className="text-neutral-400">Not set</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 max-w-[160px] truncate">
                    {speakers.length > 0 ? (
                      <span className="text-neutral-700">{speakers.join(", ")}</span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-neutral-700 font-medium">
                      <Users className="w-3 h-3 text-neutral-400" />
                      <span>{session.reservation_count ?? 0}</span>
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
                      <button
                        onClick={() => onEditSession(session)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                        title="Edit session"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSession(session.id)}
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
    </div>
  );
}
