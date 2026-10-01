import type { EventSession, ScheduleConflict } from "@/types/conference";

/**
 * Converts "HH:MM" or "HH:MM:SS" into minutes from 00:00
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Formats time string (HH:MM or HH:MM:SS) to 12-hour format e.g. "9:30 AM"
 */
export function formatTime12h(timeStr: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  const m = parts[1] ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/**
 * Formats time range e.g. "9:30 AM – 10:30 AM"
 */
export function formatSessionTimeRange(startTime: string, endTime: string): string {
  return `${formatTime12h(startTime)} – ${formatTime12h(endTime)}`;
}

/**
 * Checks if two session time intervals overlap on the same date.
 * Times overlap if: startA < endB && endA > startB
 */
export function doSessionsOverlap(
  dateA: string,
  startA: string,
  endA: string,
  dateB: string,
  startB: string,
  endB: string
): boolean {
  if (dateA !== dateB) return false;
  const aStart = timeStringToMinutes(startA);
  const aEnd = timeStringToMinutes(endA);
  const bStart = timeStringToMinutes(startB);
  const bEnd = timeStringToMinutes(endB);

  return aStart < bEnd && aEnd > bStart;
}

/**
 * Detects Room conflicts:
 * Another session is scheduled in the same room at the same time.
 */
export function checkRoomConflict(
  targetSession: {
    id?: string;
    room_id?: string | null;
    session_date: string;
    start_time: string;
    end_time: string;
  },
  existingSessions: EventSession[],
  roomNameMap?: Record<string, string>
): ScheduleConflict | null {
  if (!targetSession.room_id) return null;

  for (const session of existingSessions) {
    if (targetSession.id && session.id === targetSession.id) continue;
    if (session.status === "cancelled") continue;
    if (session.room_id !== targetSession.room_id) continue;

    if (
      doSessionsOverlap(
        targetSession.session_date,
        targetSession.start_time,
        targetSession.end_time,
        session.session_date,
        session.start_time,
        session.end_time
      )
    ) {
      const roomName = roomNameMap?.[targetSession.room_id] || session.room?.name || "Selected Room";
      return {
        type: "room",
        conflictingSessionId: session.id,
        conflictingSessionTitle: session.title,
        conflictingTime: formatSessionTimeRange(session.start_time, session.end_time),
        targetName: roomName,
        message: `Room Conflict: ${roomName} is already occupied by "${session.title}" (${formatSessionTimeRange(
          session.start_time,
          session.end_time
        )}).`,
      };
    }
  }

  return null;
}

/**
 * Detects Speaker conflicts:
 * One of the assigned speakers is already booked in another session at the same time.
 */
export function checkSpeakerConflicts(
  targetSession: {
    id?: string;
    session_date: string;
    start_time: string;
    end_time: string;
  },
  speakerIds: string[],
  existingSessions: EventSession[],
  speakerNameMap?: Record<string, string>
): ScheduleConflict[] {
  if (!speakerIds.length) return [];

  const conflicts: ScheduleConflict[] = [];

  for (const session of existingSessions) {
    if (targetSession.id && session.id === targetSession.id) continue;
    if (session.status === "cancelled") continue;

    const overlaps = doSessionsOverlap(
      targetSession.session_date,
      targetSession.start_time,
      targetSession.end_time,
      session.session_date,
      session.start_time,
      session.end_time
    );

    if (!overlaps) continue;

    const assignedInSession = (session.speakers ?? []).map((s) => s.speaker_id || s.speaker?.id).filter(Boolean);

    for (const speakerId of speakerIds) {
      if (assignedInSession.includes(speakerId)) {
        const speakerName =
          speakerNameMap?.[speakerId] ||
          session.speakers?.find((s) => (s.speaker_id || s.speaker?.id) === speakerId)?.speaker?.name ||
          "Speaker";

        conflicts.push({
          type: "speaker",
          conflictingSessionId: session.id,
          conflictingSessionTitle: session.title,
          conflictingTime: formatSessionTimeRange(session.start_time, session.end_time),
          targetName: speakerName,
          message: `Speaker Conflict: ${speakerName} is already assigned to "${session.title}" (${formatSessionTimeRange(
            session.start_time,
            session.end_time
          )}).`,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Detects Attendee schedule conflict when reserving or adding to My Agenda:
 * Checks if the attendee already reserved another session overlapping with this one.
 */
export function checkAttendeeScheduleConflict(
  candidateSession: {
    id: string;
    session_date: string;
    start_time: string;
    end_time: string;
    title: string;
  },
  reservedSessions: Array<{
    id: string;
    session_date: string;
    start_time: string;
    end_time: string;
    title: string;
  }>
): ScheduleConflict | null {
  for (const res of reservedSessions) {
    if (res.id === candidateSession.id) continue;

    if (
      doSessionsOverlap(
        candidateSession.session_date,
        candidateSession.start_time,
        candidateSession.end_time,
        res.session_date,
        res.start_time,
        res.end_time
      )
    ) {
      return {
        type: "attendee",
        conflictingSessionId: res.id,
        conflictingSessionTitle: res.title,
        conflictingTime: formatSessionTimeRange(res.start_time, res.end_time),
        message: `Schedule Conflict: You already have another session during this time: "${res.title}" (${formatSessionTimeRange(
          res.start_time,
          res.end_time
        )}).`,
      };
    }
  }

  return null;
}
