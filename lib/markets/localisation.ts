import { CountryCode } from "./types";

/**
 * Validates telephone numbers for the supported market.
 * UK: E.164 (+44...) or national UK format (07... mobile, 01/02 landline).
 * India: E.164 (+91...) or standard 10-digit mobile starting 6-9.
 */
export function validatePhoneNumber(phone: string, country: CountryCode = "IN"): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (!cleaned) return false;

  if (country === "GB") {
    return /^(\+44[1-9]\d{8,9}|0[1-9]\d{8,9})$/.test(cleaned);
  }

  // India
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Normalizes a phone number to standard E.164-compatible format with market prefix.
 */
export function normalizePhoneNumber(phone: string, country: CountryCode = "IN"): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("+")) return cleaned;

  if (country === "GB") {
    if (cleaned.startsWith("0")) {
      return `+44${cleaned.slice(1)}`;
    }
    return `+44${cleaned}`;
  }

  // India
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return cleaned;
}

/**
 * Validates postal codes / PIN codes.
 */
export function validatePostalCode(code: string, country: CountryCode = "IN"): boolean {
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) return false;

  if (country === "GB") {
    // UK Postcode Regex (standard royal mail format)
    return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(cleaned);
  }

  // India 6-digit PIN code
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * Validates tax identification numbers where applicable.
 */
export function validateTaxId(taxId: string, country: CountryCode = "IN"): boolean {
  const cleaned = taxId.trim().toUpperCase();
  if (!cleaned) return false;

  if (country === "GB") {
    // UK VAT format (9 digits or 12 digits for branches, with optional GB prefix)
    return /^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/i.test(cleaned);
  }

  // Indian 15-character GSTIN
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleaned);
}

