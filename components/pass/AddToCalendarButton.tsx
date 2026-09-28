"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, ExternalLink, Download } from "lucide-react";

interface Props {
  eventName: string;
  description?: string | null;
  venue?: string | null;
  eventDate: string;
  startTime: string;
  endTime?: string | null;
  passToken: string;
  meetingUrl?: string | null;
  isOnline?: boolean;
}

function parseTimeToHoursMinutes(timeStr: string): { hours: number; minutes: number } {
  if (!timeStr) return { hours: 10, minutes: 0 };
  const cleaned = timeStr.trim().toLowerCase();
  const isPm = cleaned.includes("pm");
  const isAm = cleaned.includes("am");
  const match = cleaned.match(/(\d+)(?::(\d+))?/);
  if (!match) return { hours: 10, minutes: 0 };

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;

  if (isPm && hours < 12) hours += 12;
  if (isAm && hours === 12) hours = 0;

  return { hours, minutes };
}

export function computeCalendarDateRange(
  eventDate: string,
  startTime: string,
  endTime?: string | null
): { start: Date; end: Date } {
  const dateParts = eventDate.split("T")[0].split("-");
  let year = new Date().getFullYear();
  let month = 0;
  let day = 1;

  if (dateParts.length === 3) {
    year = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10) - 1;
    day = parseInt(dateParts[2], 10);
  } else {
    const d = new Date(eventDate);
    if (!isNaN(d.getTime())) {
      year = d.getFullYear();
      month = d.getMonth();
      day = d.getDate();
    }
  }

  const { hours: startH, minutes: startM } = parseTimeToHoursMinutes(startTime);
  const startDate = new Date(year, month, day, startH, startM, 0);

  let endDate: Date;
  if (endTime) {
    const { hours: endH, minutes: endM } = parseTimeToHoursMinutes(endTime);
    endDate = new Date(year, month, day, endH, endM, 0);
    // If end time is earlier than start time, assume next day
    if (endDate <= startDate) {
      endDate = new Date(year, month, day + 1, endH, endM, 0);
    }
  } else {
    // Default 2 hour duration
    endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  }

  return { start: startDate, end: endDate };
}

function toGoogleDateString(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d+/g, "");
}

export function buildGoogleCalendarUrl({
  eventName,
  description,
  venue,
  eventDate,
  startTime,
  endTime,
  passToken,
  meetingUrl,
  isOnline,
}: Props): string {
  const { start, end } = computeCalendarDateRange(eventDate, startTime, endTime);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";
  const passUrl = `${appUrl}/pass/${passToken}`;

  const location = isOnline && meetingUrl ? meetingUrl : venue || (isOnline ? "Online Event" : "Venue TBA");
  const details = [
    description ? `${description}\n` : "",
    `Your Digital Entry Pass: ${passUrl}`,
    isOnline && meetingUrl ? `Meeting Link: ${meetingUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventName,
    dates: `${toGoogleDateString(start)}/${toGoogleDateString(end)}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent({
  eventName,
  description,
  venue,
  eventDate,
  startTime,
  endTime,
  passToken,
  meetingUrl,
  isOnline,
}: Props): string {
  const { start, end } = computeCalendarDateRange(eventDate, startTime, endTime);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";
  const passUrl = `${appUrl}/pass/${passToken}`;
  const location = isOnline && meetingUrl ? meetingUrl : venue || (isOnline ? "Online Event" : "Venue TBA");
  const details = `${description ? `${description} ` : ""}Your Digital Entry Pass: ${passUrl}`;

  const startUtc = toGoogleDateString(start);
  const endUtc = toGoogleDateString(end);
  const nowUtc = toGoogleDateString(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//URPASS//Event Pass//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:urpass-${passToken}-${start.getTime()}@urpass.space`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${eventName.replace(/[\r\n]+/g, " ")}`,
    `DESCRIPTION:${details.replace(/[\r\n]+/g, "\\n")}`,
    `LOCATION:${location.replace(/[\r\n]+/g, " ")}`,
    `URL:${passUrl}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function AddToCalendarButton(props: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleDownloadIcs = () => {
    const icsContent = buildIcsContent(props);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.eventName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-event.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const googleUrl = buildGoogleCalendarUrl(props);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-800 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
      >
        <Calendar className="w-4 h-4 text-neutral-600 shrink-0" />
        <span>Add to Calendar</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5 z-20 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Calendar</span>
            </div>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span>Apple Calendar &amp; Outlook (.ics)</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
