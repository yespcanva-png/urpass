import type {
  EventSession,
  SessionType,
  SpeakerRole,
  ConferenceAnalytics,
  EventRoom,
} from "@/types/conference";
import { formatTime12h } from "./conflict-detection";

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SESSION_TYPE_CONFIG: Record<
  SessionType,
  { label: string; bg: string; text: string; border: string; icon?: string }
> = {
  keynote: {
    label: "Keynote",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  presentation: {
    label: "Presentation",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  panel: {
    label: "Panel Discussion",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  workshop: {
    label: "Workshop",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  networking: {
    label: "Networking",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  break: {
    label: "Break",
    bg: "bg-neutral-100",
    text: "text-neutral-600",
    border: "border-neutral-200",
  },
  lunch: {
    label: "Lunch",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  registration: {
    label: "Registration",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  entertainment: {
    label: "Entertainment",
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  custom: {
    label: "Special",
    bg: "bg-neutral-50",
    text: "text-neutral-700",
    border: "border-neutral-200",
  },
};

export const SPEAKER_ROLE_CONFIG: Record<
  SpeakerRole,
  { label: string; badgeCls: string }
> = {
  speaker: { label: "Speaker", badgeCls: "bg-neutral-100 text-neutral-700" },
  moderator: { label: "Moderator", badgeCls: "bg-purple-100 text-purple-700" },
  panelist: { label: "Panelist", badgeCls: "bg-blue-100 text-blue-700" },
  host: { label: "Host", badgeCls: "bg-emerald-100 text-emerald-700" },
  mc: { label: "MC", badgeCls: "bg-pink-100 text-pink-700" },
  trainer: { label: "Trainer", badgeCls: "bg-amber-100 text-amber-700" },
  guest: { label: "Special Guest", badgeCls: "bg-indigo-100 text-indigo-700" },
};

/**
 * Groups sessions by session_date (sorted ascending)
 */
export function groupSessionsByDate(
  sessions: EventSession[]
): Array<{ date: string; formattedDate: string; sessions: EventSession[] }> {
  const map = new Map<string, EventSession[]>();

  for (const session of sessions) {
    const d = session.session_date;
    if (!map.has(d)) {
      map.set(d, []);
    }
    map.get(d)!.push(session);
  }

  // Sort dates
  const sortedDates = Array.from(map.keys()).sort();

  return sortedDates.map((date) => {
    const list = map.get(date)!;
    // Sort sessions in date by start_time
    list.sort((a, b) => a.start_time.localeCompare(b.start_time));

    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

    return {
      date,
      formattedDate,
      sessions: list,
    };
  });
}

/**
 * Computes live conference analytics
 */
export function computeConferenceAnalytics(
  sessions: EventSession[],
  rooms: EventRoom[],
  speakersCount: number,
  tracksCount: number,
  reservations: Array<{ session_id: string; status: string }>,
  checkIns: Array<{ session_id: string; checkin_time: string }>
): ConferenceAnalytics {
  const totalSessions = sessions.length;
  const totalRooms = rooms.length;
  const totalTracks = tracksCount;
  const totalSpeakers = speakersCount;

  const validReservations = reservations.filter((r) => r.status === "reserved" || r.status === "attended");
  const totalReservations = validReservations.length;
  const totalCheckIns = checkIns.length;

  const averageSessionAttendance =
    totalSessions > 0 ? Math.round((totalCheckIns / totalSessions) * 10) / 10 : 0;

  // No show rate = (reserved - checked_in) / reserved
  const noShowRate =
    totalReservations > 0
      ? Math.max(0, Math.round(((totalReservations - totalCheckIns) / totalReservations) * 100))
      : 0;

  // Session popularity
  const sessionCheckInMap = new Map<string, number>();
  for (const c of checkIns) {
    sessionCheckInMap.set(c.session_id, (sessionCheckInMap.get(c.session_id) || 0) + 1);
  }

  const sessionResMap = new Map<string, number>();
  for (const r of validReservations) {
    sessionResMap.set(r.session_id, (sessionResMap.get(r.session_id) || 0) + 1);
  }

  let mostPopularSession: ConferenceAnalytics["mostPopularSession"] = null;
  let leastAttendedSession: ConferenceAnalytics["leastAttendedSession"] = null;

  if (sessions.length > 0) {
    const scoredSessions = sessions.map((s) => ({
      id: s.id,
      title: s.title,
      reservations: sessionResMap.get(s.id) || 0,
      checkIns: sessionCheckInMap.get(s.id) || 0,
    }));

    scoredSessions.sort((a, b) => b.checkIns - a.checkIns || b.reservations - a.reservations);
    mostPopularSession = scoredSessions[0];
    leastAttendedSession = scoredSessions[scoredSessions.length - 1];
  }

  // Room utilisation
  const roomUtilisation = rooms.map((room) => {
    const roomSessions = sessions.filter((s) => s.room_id === room.id);
    const totalOccupancyPct = roomSessions.reduce((acc, s) => {
      const checked = sessionCheckInMap.get(s.id) || 0;
      const effectiveCap = s.capacity || room.capacity || 1;
      return acc + Math.min(100, Math.round((checked / effectiveCap) * 100));
    }, 0);

    const averageOccupancyPercent =
      roomSessions.length > 0 ? Math.round(totalOccupancyPct / roomSessions.length) : 0;

    return {
      roomId: room.id,
      roomName: room.name,
      capacity: room.capacity,
      sessionsCount: roomSessions.length,
      averageOccupancyPercent,
    };
  });

  // Peak entry times (15-min buckets)
  const timeBuckets = new Map<string, number>();
  for (const c of checkIns) {
    if (!c.checkin_time) continue;
    const date = new Date(c.checkin_time);
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = Math.floor(date.getMinutes() / 15) * 15;
    const minuteStr = minute.toString().padStart(2, "0");
    const slot = `${hour}:${minuteStr}`;
    timeBuckets.set(slot, (timeBuckets.get(slot) || 0) + 1);
  }

  const peakEntryTimes = Array.from(timeBuckets.entries())
    .map(([timeSlot, count]) => ({
      timeSlot: formatTime12h(timeSlot),
      count,
    }))
    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  return {
    totalSessions,
    totalSpeakers,
    totalRooms,
    totalTracks,
    totalReservations,
    totalCheckIns,
    averageSessionAttendance,
    noShowRate,
    mostPopularSession,
    leastAttendedSession,
    roomUtilisation,
    peakEntryTimes,
  };
}
