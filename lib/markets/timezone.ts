/** Resolve an event wall-clock time to one unique instant. No timezone suffix is guessed. */
export function localEventTimeToUtc(date: string, time: string, timeZone: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    throw new Error("Enter a valid local event date and time.");
  }
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second = 0] = time.split(":").map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hour, minute, second);
  if (!Number.isFinite(wallClock) || new Date(wallClock).toISOString().slice(0, 10) !== date || hour > 23 || minute > 59 || second > 59) {
    throw new Error("Enter a valid local event date and time.");
  }
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    });
  } catch {
    throw new Error("Unsupported event timezone.");
  }
  const matches: number[] = [];
  // All supported UTC offsets are multiples of 15 minutes. The two UK DST
  // occurrences each yield either zero (gap) or two (fold) matches.
  for (let offsetMinutes = -14 * 60; offsetMinutes <= 14 * 60; offsetMinutes += 15) {
    const candidate = wallClock - offsetMinutes * 60_000;
    const parts = Object.fromEntries(formatter.formatToParts(candidate).map((part) => [part.type, part.value]));
    if (Number(parts.year) === year && Number(parts.month) === month && Number(parts.day) === day &&
        Number(parts.hour) === hour && Number(parts.minute) === minute && Number(parts.second) === second) {
      matches.push(candidate);
    }
  }
  if (matches.length === 0) throw new Error("This local time does not exist in the event timezone.");
  if (matches.length > 1) throw new Error("This local time occurs twice; choose an unambiguous time.");
  return new Date(matches[0]).toISOString();
}

export function eventUtcRange(input: { event_date: string; end_date?: string | null; start_time: string; end_time: string; timezone: string }) {
  const startsAtUtc = localEventTimeToUtc(input.event_date, input.start_time, input.timezone);
  let endDate = input.end_date || input.event_date;
  if (!input.end_date && input.end_time < input.start_time) {
    const [year, month, day] = input.event_date.split("-").map(Number);
    endDate = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  }
  const endsAtUtc = localEventTimeToUtc(endDate, input.end_time, input.timezone);
  if (endsAtUtc <= startsAtUtc) throw new Error("Event end must be after its start.");
  return { startsAtUtc, endsAtUtc };
}

export function isUkTimezone(timezone?: string | null): boolean {
  if (!timezone) return false;
  const tz = timezone.trim().toLowerCase();
  return tz === "europe/london" || tz === "gmt" || tz === "bst" || tz.includes("london");
}

export function formatEventDateTime(
  utcInstantOrDate: string | Date,
  timezone: string = "Europe/London",
  locale: string = "en-GB"
): string {
  const dateObj = typeof utcInstantOrDate === "string" ? new Date(utcInstantOrDate) : utcInstantOrDate;
  if (isNaN(dateObj.getTime())) return "";

  try {
    return dateObj.toLocaleString(locale, {
      timeZone: timezone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return dateObj.toISOString();
  }
}
