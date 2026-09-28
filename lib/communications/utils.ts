import { DeliveryChannel } from "./types";
import {
  normalizePhoneInternational,
  isValidE164Phone,
  maskPhoneInternational,
} from "@/lib/country-config";

/**
 * Normalizes phone numbers to standard E.164 format (+[country_code][number]).
 * Supports UK (+44, 07...), India (+91), and international numbers.
 */
export function normalizePhone(raw: string | null | undefined, defaultCountryCode = "91"): string | null {
  return normalizePhoneInternational(raw, defaultCountryCode);
}

export function isValidE164(phone: string): boolean {
  return isValidE164Phone(phone);
}

/**
 * Masks phone numbers for security in organizer dashboards.
 * E.g. +447123456789 -> +44 •••••••789
 *      +919876543210 -> +91 •••••••210
 */
export function maskPhone(phone: string | null | undefined): string {
  return maskPhoneInternational(phone);
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
