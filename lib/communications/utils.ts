import { DeliveryChannel } from "./types";

/**
 * Normalizes phone numbers to standard E.164 format (+[country_code][number]).
 * Defaults to India (+91) for standard 10-digit mobile numbers.
 */
export function normalizePhone(raw: string | null | undefined, defaultCountryCode = "91"): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Remove non-digit chars except leading plus
  let cleaned = trimmed.replace(/[^\d+]/g, "");
  if (!cleaned) return null;

  if (cleaned.startsWith("+")) {
    const digitsOnly = cleaned.slice(1).replace(/\D/g, "");
    if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
      return `+${digitsOnly}`;
    }
    return null;
  }

  // Remove leading 0 if present (e.g. 09876543210)
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  // 10-digit mobile number -> default to +91
  if (cleaned.length === 10) {
    return `+${defaultCountryCode}${cleaned}`;
  }

  // 12-digit number starting with 91 -> prepend +
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned}`;
  }

  // Fallback for valid international numbers without plus
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return `+${cleaned}`;
  }

  return null;
}

export function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{9,14}$/.test(phone);
}

/**
 * Masks phone numbers for security in organizer dashboards.
 * E.g. +919876543210 -> +91 •••••••210
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const normalized = normalizePhone(phone) || phone;
  if (normalized.length < 7) return "••••••";

  const prefix = normalized.slice(0, 3); // e.g. +91
  const suffix = normalized.slice(-3); // e.g. 210
  return `${prefix} •••••••${suffix}`;
}

/**
 * Generates the secure mobile ticket URL
 */
export function buildTicketUrl(passToken: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  return `${baseUrl.replace(/\/$/, "")}/pass/${passToken}`;
}

/**
 * Formats a clean human-readable ticket code e.g. URP-84721
 */
export function formatTicketId(passToken: string): string {
  if (!passToken) return "URP-PASS";
  return `URP-${passToken.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}`;
}

/**
 * Standard transactional ticket confirmation message format matching Indian DLT specs.
 */
export function buildTicketSmsText(eventName: string, ticketId: string, ticketUrl: string): string {
  return `URPASS: Your ticket for ${eventName} is confirmed.\nTicket: ${ticketId}\nView ticket: ${ticketUrl}`;
}

/**
 * Idempotency key prevents duplicate SMS notifications on repeated webhooks
 */
export function generateIdempotencyKey(
  ticketId: string,
  channel: DeliveryChannel,
  version = "v1"
): string {
  return `${ticketId}_${channel}_${version}`;
}
