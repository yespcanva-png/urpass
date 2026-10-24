import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "apply",
  "auth",
  "billing",
  "compare",
  "contact",
  "create-event",
  "dashboard",
  "discover",
  "e",
  "event",
  "events",
  "guides",
  "in",
  "legal",
  "login",
  "mcp",
  "onboarding",
  "ops",
  "org",
  "pass",
  "pricing",
  "privacy",
  "scan",
  "settings",
  "signup",
  "status",
  "studio",
  "support",
  "terms",
  "tickets",
  "uk",
  "verify",
  "portal",
  "checkout",
  "help",
  "whats-new",
]);

export function isReservedSlug(slug?: string | null): boolean {
  if (!slug) return false;
  const clean = slugify(slug);
  return RESERVED_SLUGS.has(clean);
}

// Generates an SEO-friendly URL-safe slug from event name (e.g. "Pilani Grand Garba Night 2026" -> "pilani-grand-garba-night-2026")
// Falls back to a clean random 8-character string if no name is provided
export function generateApplySlug(eventName?: string): string {
  if (eventName && eventName.trim()) {
    const slug = slugify(eventName);
    if (slug.length >= 2) {
      return slug.slice(0, 80).replace(/-+$/, "");
    }
  }

  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const bytes = randomBytes(8);
  const part = (offset: number) =>
    Array.from({ length: 4 }, (_, i) => alpha[bytes[offset + i] % 26]).join("");
  return `${part(0)}-${part(4)}`;
}

export interface EventDateOption {
  date: string; // ISO YYYY-MM-DD
  label: string; // "13 Oct"
  fullLabel: string; // "Fri, 13 Oct 2026"
  dayIndex: number; // 1, 2, 3
  dayName: string; // "Day 1"
}

export function getEventDateRange(
  startDateStr: string,
  endDateStr?: string | null,
  maxDurationDays?: number
): EventDateOption[] {
  if (!startDateStr) return [];
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return [];

  const daysCount = (() => {
    if (endDateStr) {
      const end = new Date(endDateStr);
      if (!isNaN(end.getTime()) && end >= start) {
        const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return Math.min(Math.max(diffDays, 1), 30);
      }
    }
    if (maxDurationDays && maxDurationDays > 1) {
      return Math.min(maxDurationDays, 30);
    }
    return 1;
  })();

  const dates: EventDateOption[] = [];
  for (let i = 0; i < daysCount; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const iso = current.toISOString().split("T")[0];
    const dayMonth = current.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const full = current.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    dates.push({
      date: iso,
      label: dayMonth,
      fullLabel: full,
      dayIndex: i + 1,
      dayName: `Day ${i + 1}`,
    });
  }

  return dates;
}

/**
 * Formats a 24-hour time string ("11:00:00", "11:00", "14:30") into a clean 12-hour AM/PM string ("11:00 AM", "2:30 PM").
 * Preserves already-formatted 12-hour strings (e.g., "11:00 AM", "11:00 AM – 1:00 PM").
 */
export function formatTimeWithAmPm(timeStr?: string | null): string {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (!trimmed) return "";

  // If already contains AM or PM, normalize casing
  if (/am|pm/i.test(trimmed)) {
    return trimmed.replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
  }

  // Handle single time string (HH:MM or HH:MM:SS)
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    const h = parseInt(match[1], 10);
    const m = match[2];
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  // Handle range e.g. "11:00 - 13:00" or "11:00:00 - 13:00:00"
  if (trimmed.includes("–") || trimmed.includes("-")) {
    const parts = trimmed.split(/[-–]/).map((p) => p.trim());
    if (parts.length === 2) {
      return `${formatTimeWithAmPm(parts[0])} – ${formatTimeWithAmPm(parts[1])}`;
    }
  }

  return trimmed;
}

export function formatEventTimeWithOvernight(startTime: string, endTime: string): string {
  if (!startTime) return "";
  const startFmt = formatTimeWithAmPm(startTime);
  if (!endTime) return startFmt;
  const endFmt = formatTimeWithAmPm(endTime);

  const startParts = startTime.split(":");
  const endParts = endTime.split(":");
  if (startParts.length >= 2 && endParts.length >= 2) {
    const startH = parseInt(startParts[0], 10);
    const endH = parseInt(endParts[0], 10);
    const startM = parseInt(startParts[1], 10);
    const endM = parseInt(endParts[1], 10);
    if (!isNaN(startH) && !isNaN(endH)) {
      const startTotal = startH * 60 + (isNaN(startM) ? 0 : startM);
      const endTotal = endH * 60 + (isNaN(endM) ? 0 : endM);
      if (endTotal < startTotal) {
        return `${startFmt} – ${endFmt} (Next Day · Overnight)`;
      }
    }
  }
  return `${startFmt} – ${endFmt}`;
}

