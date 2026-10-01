"use client";

import { useMemo } from "react";
import type { EventSession, EventRoom } from "@/types/conference";
import { formatTime12h, formatSessionTimeRange } from "@/lib/conference/conflict-detection";
import { SESSION_TYPE_CONFIG } from "@/lib/conference/helpers";
import { Edit3, Clock, Users } from "lucide-react";

interface CalendarViewProps {
  sessions: EventSession[];
  rooms: EventRoom[];
  onEditSession: (session: EventSession) => void;
}

export default function CalendarView({
  sessions,
  rooms,
  onEditSession,
}: CalendarViewProps) {
  // If no rooms configured yet, create a default "Main Stage" column
  const effectiveRooms = useMemo(() => {
    if (rooms.length > 0) return rooms;
    return [{ id: "unassigned", name: "Main Stage / Unassigned", capacity: 100, checkin_enabled: true } as EventRoom];
  }, [rooms]);

  // Extract distinct hours from sessions or default 9:00 to 18:00
  const timeSlots = useMemo(() => {
    let minHour = 9;
    let maxHour = 18;

    for (const s of sessions) {
      const hStart = parseInt(s.start_time.split(":")[0], 10);
      const hEnd = parseInt(s.end_time.split(":")[0], 10);
      if (!isNaN(hStart)) minHour = Math.min(minHour, hStart);
      if (!isNaN(hEnd)) maxHour = Math.max(maxHour, hEnd + 1);
    }

    const slots: string[] = [];
    for (let h = minHour; h <= maxHour; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return slots;
  }, [sessions]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header row: Rooms */}
        <div
          className="grid border-b border-neutral-100 bg-neutral-50/70"
          style={{
            gridTemplateColumns: `100px repeat(${effectiveRooms.length}, minmax(200px, 1fr))`,
          }}
        >
          <div className="p-3 text-xs font-bold text-neutral-400 uppercase tracking-wider text-center border-r border-neutral-100">
            Time
          </div>
          {effectiveRooms.map((room) => (
            <div
              key={room.id}
              className="p-3 text-xs font-bold text-neutral-800 border-r border-neutral-100 last:border-r-0 truncate"
            >
              <span>{room.name}</span>
              {room.capacity > 0 && (
                <span className="text-[11px] font-normal text-neutral-400 ml-1.5">
                  ({room.capacity} cap)
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Time Rows */}
        <div className="divide-y divide-neutral-100">
          {timeSlots.map((slot) => {
            const slotHour = parseInt(slot.split(":")[0], 10);

            return (
              <div
                key={slot}
                className="grid min-h-[90px]"
                style={{
                  gridTemplateColumns: `100px repeat(${effectiveRooms.length}, minmax(200px, 1fr))`,
                }}
              >
                {/* Time label */}
                <div className="p-3 text-xs font-mono font-medium text-neutral-400 border-r border-neutral-100 text-center select-none bg-neutral-50/30">
                  {formatTime12h(slot)}
                </div>

                {/* Rooms cells */}
                {effectiveRooms.map((room) => {
                  // Find sessions that start in this hour
                  const cellSessions = sessions.filter((s) => {
                    const matchesRoom =
                      room.id === "unassigned" ? !s.room_id : s.room_id === room.id;
                    const sHour = parseInt(s.start_time.split(":")[0], 10);
                    return matchesRoom && sHour === slotHour;
                  });

                  return (
                    <div
                      key={room.id}
                      className="p-2 border-r border-neutral-100 last:border-r-0 flex flex-col gap-2 relative min-h-[90px]"
                    >
                      {cellSessions.map((session) => {
                        const typeCfg =
                          SESSION_TYPE_CONFIG[session.session_type] ||
                          SESSION_TYPE_CONFIG.presentation;
                        const track = session.track;

                        return (
                          <div
                            key={session.id}
                            onClick={() => onEditSession(session)}
                            className="group p-2.5 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-900 shadow-2xs hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
                            style={{
                              borderLeftWidth: "4px",
                              borderLeftColor: track?.colour || "#6C63FF",
                            }}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}
                                >
                                  {typeCfg.label}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-400">
                                  {formatSessionTimeRange(session.start_time, session.end_time)}
                                </span>
                              </div>

                              <p className="text-xs font-bold text-neutral-900 leading-tight line-clamp-2">
                                {session.title}
                              </p>
                            </div>

                            {/* Footer info */}
                            <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-100 text-[11px] text-neutral-400">
                              <span className="truncate">
                                {session.speakers?.map((s) => s.speaker?.name).join(", ") ||
                                  "No speaker"}
                              </span>
                              <Edit3 className="w-3 h-3 text-neutral-300 group-hover:text-neutral-900 shrink-0 ml-1" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
