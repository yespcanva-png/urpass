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

export function formatEventTimeWithOvernight(startTime: string, endTime: string): string {
  if (!startTime) return "";
  if (!endTime) return startTime;

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
        return `${startTime} – ${endTime} (Next Day · Overnight)`;
      }
    }
  }
  return `${startTime} – ${endTime}`;
}

