/**
 * Internationalisation & Country Configuration Layer
 *
 * Provides a single source of truth for country-specific formatting,
 * currencies, tax rules, phone normalization, payment gateway routing,
 * and campus terminology presets across URPASS.
 */

export type SupportedCountryCode = "IN" | "GB" | "US";
export type SupportedCurrency = "INR" | "GBP" | "USD";
export type SupportedPaymentGateway = "razorpay" | "stripe" | "both";

export interface CampusTerminology {
  readonly institution: string; // "College / Institution" vs "University"
  readonly department: string; // "Department" vs "School / Department"
  readonly studentOrg: string; // "Clubs & Cells" vs "Societies & Sports Clubs"
  readonly studentId: string; // "Roll Number" vs "Student ID Number"
  readonly governingBody: string; // "College Administration" vs "Students' Union (SU)"
  readonly academicTerm: string; // "Semester" vs "Term / Semester"
}

export interface CountryConfig {
  readonly countryCode: SupportedCountryCode;
  readonly countryName: string;
  readonly locale: string;
  readonly currency: SupportedCurrency;
  readonly currencySymbol: string;
  readonly currencyDecimals: number;
  readonly timezone: string;
  readonly phoneCountryCode: string; // e.g. "+91", "+44"
  readonly phoneDigits: number;
  readonly dateFormat: string; // e.g. "DD/MM/YYYY"
  readonly dateLocale: string; // e.g. "en-IN", "en-GB"
  readonly taxType: "GST" | "VAT" | "SALES_TAX" | "NONE";
  readonly taxName: string; // "GST" | "VAT"
  readonly taxRate: number; // e.g. 0.18 for India (18%), 0.20 for UK (20%)
  readonly taxIdLabel: string; // "GSTIN" vs "VAT Registration Number"
  readonly taxIdRegex?: RegExp;
  readonly paymentGateway: SupportedPaymentGateway;
  readonly supportedGateways: readonly ("razorpay" | "stripe")[];
  readonly terminology: CampusTerminology;
}

export const COUNTRIES: Record<SupportedCountryCode, CountryConfig> = {
  IN: {
    countryCode: "IN",
    countryName: "India",
    locale: "en-IN",
    currency: "INR",
    currencySymbol: "₹",
    currencyDecimals: 2,
    timezone: "Asia/Kolkata",
    phoneCountryCode: "+91",
    phoneDigits: 10,
    dateFormat: "DD/MM/YYYY",
    dateLocale: "en-IN",
    taxType: "GST",
    taxName: "GST",
    taxRate: 0.18,
    taxIdLabel: "GSTIN",
    taxIdRegex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    paymentGateway: "razorpay",
    supportedGateways: ["razorpay"],
    terminology: {
      institution: "College / Institution",
      department: "Department",
      studentOrg: "Clubs & Cells",
      studentId: "Roll Number",
      governingBody: "College Administration",
      academicTerm: "Semester",
    },
  },
  GB: {
    countryCode: "GB",
    countryName: "United Kingdom",
    locale: "en-GB",
    currency: "GBP",
    currencySymbol: "£",
    currencyDecimals: 2,
    timezone: "Europe/London",
    phoneCountryCode: "+44",
    phoneDigits: 10,
    dateFormat: "DD/MM/YYYY",
    dateLocale: "en-GB",
    taxType: "VAT",
    taxName: "VAT",
    taxRate: 0.20,
    taxIdLabel: "VAT Number",
    taxIdRegex: /^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/i,
    paymentGateway: "stripe",
    supportedGateways: ["stripe"],
    terminology: {
      institution: "University",
      department: "School / Department",
      studentOrg: "Societies & Sports Clubs",
      studentId: "Student ID",
      governingBody: "Students' Union (SU)",
      academicTerm: "Term / Semester",
    },
  },
  US: {
    countryCode: "US",
    countryName: "United States",
    locale: "en-US",
    currency: "USD",
    currencySymbol: "$",
    currencyDecimals: 2,
    timezone: "America/New_York",
    phoneCountryCode: "+1",
    phoneDigits: 10,
    dateFormat: "MM/DD/YYYY",
    dateLocale: "en-US",
    taxType: "SALES_TAX",
    taxName: "Sales Tax",
    taxRate: 0.0,
    taxIdLabel: "EIN / Tax ID",
    paymentGateway: "stripe",
    supportedGateways: ["stripe"],
    terminology: {
      institution: "College / University",
      department: "Department",
      studentOrg: "Student Clubs & Greek Life",
      studentId: "Student ID",
      governingBody: "Student Government",
      academicTerm: "Semester",
    },
  },
};

/**
 * Resolves country configuration from code, currency, timezone, or phone prefix.
 * Defaults to India (IN) if unspecified or unrecognized.
 */
export function getCountryConfig(identifier?: string | null): CountryConfig {
  if (!identifier) return COUNTRIES.IN;

  const normalized = identifier.trim().toUpperCase();

  // Match by Country Code (e.g. "IN", "GB", "UK", "US")
  if (normalized === "IN" || normalized === "INDIA") return COUNTRIES.IN;
  if (normalized === "GB" || normalized === "UK" || normalized === "UNITED KINGDOM" || normalized === "GREAT BRITAIN") {
    return COUNTRIES.GB;
  }
  if (normalized === "US" || normalized === "USA" || normalized === "UNITED STATES") {
    return COUNTRIES.US;
  }

  // Match by Currency
  if (normalized === "INR") return COUNTRIES.IN;
  if (normalized === "GBP") return COUNTRIES.GB;
  if (normalized === "USD") return COUNTRIES.US;

  // Match by Phone Prefix
  if (normalized === "+91" || normalized === "91") return COUNTRIES.IN;
  if (normalized === "+44" || normalized === "44") return COUNTRIES.GB;
  if (normalized === "+1" || normalized === "1") return COUNTRIES.US;

  // Match by Timezone
  if (normalized.includes("KOLKATA") || normalized.includes("CALCUTTA") || normalized.includes("INDIA")) {
    return COUNTRIES.IN;
  }
  if (normalized.includes("LONDON") || normalized.includes("EUROPE/LONDON") || normalized === "GMT" || normalized === "BST") {
    return COUNTRIES.GB;
  }
  if (normalized.includes("NEW_YORK") || normalized.includes("CHICAGO") || normalized.includes("LOS_ANGELES")) {
    return COUNTRIES.US;
  }

  return COUNTRIES.IN;
}

/**
 * Formats monetary amounts according to country currency rules.
 * Handles minor units (paise/pence) or whole currency units.
 */
export function formatCurrency(
  amount: number | null | undefined,
  countryOrCurrency?: string | null,
  isMinorUnit = true
): string {
  if (amount == null || Number.isNaN(amount)) return "—";

  const config = getCountryConfig(countryOrCurrency);
  const majorAmount = isMinorUnit ? amount / 100 : amount;

  return `${config.currencySymbol}${majorAmount.toLocaleString(config.locale, {
    minimumFractionDigits: config.currencyDecimals,
    maximumFractionDigits: config.currencyDecimals,
  })}`;
}

/**
 * Formats dates adhering to the specified country's locale and timezone.
 */
export function formatDateForCountry(
  date: Date | string | number,
  countryOrTz?: string | null,
  options?: Intl.DateTimeFormatOptions
): string {
  const config = getCountryConfig(countryOrTz);
  const dateObj = typeof date === "object" ? date : new Date(date);

  if (Number.isNaN(dateObj.getTime())) return String(date);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: config.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  };

  return dateObj.toLocaleDateString(config.dateLocale, defaultOptions);
}

/**
 * Formats date and time adhering to the specified country's locale and timezone.
 */
export function formatDateTimeForCountry(
  date: Date | string | number,
  countryOrTz?: string | null
): string {
  const config = getCountryConfig(countryOrTz);
  const dateObj = typeof date === "object" ? date : new Date(date);

  if (Number.isNaN(dateObj.getTime())) return String(date);

  return dateObj.toLocaleString(config.dateLocale, {
    timeZone: config.timezone,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Normalizes phone numbers to standard E.164 format.
 * Supports UK (+44, 07...), India (+91), and international numbers.
 * Respects configured country or event context.
 */
export function normalizePhoneInternational(
  raw: string | null | undefined,
  defaultCountryOrCode: string = "IN"
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Remove non-digit chars except leading plus
  let cleaned = trimmed.replace(/[^\d+]/g, "");
  if (!cleaned) return null;

  // 1. E.164 format provided explicitly with '+'
  if (cleaned.startsWith("+")) {
    const digitsOnly = cleaned.slice(1).replace(/\D/g, "");
    if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
      return `+${digitsOnly}`;
    }
    return null;
  }

  // Resolve config for default context
  const config = getCountryConfig(defaultCountryOrCode);

  // 2. UK Specific Number Detection
  // UK mobile numbers start with 07 and have 11 digits (e.g. 07123 456789)
  if (cleaned.startsWith("07") && cleaned.length === 11) {
    return `+44${cleaned.slice(1)}`;
  }
  // UK international without plus (e.g. 447123456789 or 442079460000)
  if (cleaned.startsWith("44") && (cleaned.length === 12 || cleaned.length === 13)) {
    return `+${cleaned}`;
  }

  // If default country is UK (GB) and starts with leading 0 (e.g. 020 7946 0000)
  if (config.countryCode === "GB" && cleaned.startsWith("0") && cleaned.length >= 10 && cleaned.length <= 11) {
    return `+44${cleaned.slice(1)}`;
  }

  // 3. India Specific Number Detection
  // 12-digit number starting with 91 (e.g. 919876543210) -> prepend +
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned}`;
  }
  // Remove trunk 0 for Indian numbers (e.g. 09876543210 -> 9876543210)
  if (config.countryCode === "IN" && cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  // Standard 10-digit mobile number in India
  if (config.countryCode === "IN" && cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // 4. Default country fallback for 10-digit numbers
  if (cleaned.length === 10) {
    const prefix = config.phoneCountryCode.replace(/\D/g, "");
    return `+${prefix}${cleaned}`;
  }

  // 5. Fallback for valid international numbers without plus
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return `+${cleaned}`;
  }

  return null;
}

/**
 * Validates E.164 compliance (+[country_code][number]).
 */
export function isValidE164Phone(phone: string): boolean {
  return /^\+[1-9]\d{8,14}$/.test(phone);
}

/**
 * Masks phone numbers securely for dashboards.
 * E.g. +447123456789 -> +44 •••••••789
 *      +919876543210 -> +91 •••••••210
 */
export function maskPhoneInternational(phone: string | null | undefined): string {
  if (!phone) return "—";
  const normalized = normalizePhoneInternational(phone) || phone;
  if (normalized.length < 7) return "••••••";

  const isPlus = normalized.startsWith("+");
  const prefixLength = isPlus ? 3 : 2; // e.g. +44 or +91
  const prefix = normalized.slice(0, prefixLength);
  const suffix = normalized.slice(-3);

  return `${prefix} •••••••${suffix}`;
}
