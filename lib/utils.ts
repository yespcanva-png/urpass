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

