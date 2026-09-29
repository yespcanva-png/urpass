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
    paymentGateway: "razorpay",
    supportedGateways: ["razorpay"],
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

/**
 * Automatically detects country code from HTTP request headers.
 * Works seamlessly with Vercel Geo-IP, Cloudflare, AWS CloudFront, and proxy headers.
 */
export function detectCountryFromHeaders(headers: {
  get(name: string): string | null | undefined;
}): SupportedCountryCode {
  // 0. Path / URL check if forwarded via custom headers
  const reqPath = (
    headers.get("x-invoke-path") ||
    headers.get("x-url") ||
    headers.get("next-url") ||
    headers.get("x-pathname") ||
    ""
  ).toLowerCase();
  if (reqPath.startsWith("/uk") || reqPath.includes("-uk")) return "GB";
  if (reqPath.startsWith("/in") || reqPath.includes("-india")) return "IN";

  // 1. Vercel Geo-IP header (injected automatically on Vercel Edge & Serverless)
  const vercelCountry = headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  if (vercelCountry === "IN") return "IN";
  if (vercelCountry === "GB" || vercelCountry === "UK") return "GB";
  if (vercelCountry === "US") return "US";

  // 2. Cloudflare Geo-IP header
  const cfCountry = headers.get("cf-ipcountry")?.trim().toUpperCase();
  if (cfCountry === "IN") return "IN";
  if (cfCountry === "GB" || cfCountry === "UK") return "GB";
  if (cfCountry === "US") return "US";

  // 3. AWS CloudFront viewer country header
  const cfViewer = headers.get("cloudfront-viewer-country")?.trim().toUpperCase();
  if (cfViewer === "IN") return "IN";
  if (cfViewer === "GB" || cfViewer === "UK") return "GB";
  if (cfViewer === "US") return "US";

  // 4. Standard X-Country-Code header
  const xCountry = headers.get("x-country-code")?.trim().toUpperCase();
  if (xCountry === "IN") return "IN";
  if (xCountry === "GB" || xCountry === "UK") return "GB";
  if (xCountry === "US") return "US";

  // 5. Browser Accept-Language header
  const acceptLang = headers.get("accept-language")?.toLowerCase() || "";
  // Check Indian languages first to prevent false UK detection on Indian browsers
  if (
    acceptLang.includes("en-in") ||
    acceptLang.includes("hi-in") ||
    acceptLang.includes("ta-in") ||
    acceptLang.includes("te-in") ||
    acceptLang.includes("hi") ||
    acceptLang.includes("ta")
  ) {
    return "IN";
  }
  if (acceptLang.includes("en-gb")) return "GB";

  return "IN";
}

/**
 * Automatically detects country on the client (browser) without permissions popups.
 * Priority: Pathname -> Query param -> Browser Timezone (IST takes precedence for Indian IP) -> Saved preference -> Browser Language -> Default (IN).
 */
export function detectCountryClient(): "IN" | "GB" {
  if (typeof window === "undefined") return "IN";

  try {
    // 0. Dedicated regional route pathnames strictly dictate market
    const pathname = window.location.pathname.toLowerCase();
    if (
      pathname === "/uk" ||
      pathname.startsWith("/uk/") ||
      pathname.includes("-uk") ||
      pathname.includes("-uk/")
    ) {
      return "GB";
    }
    if (
      pathname === "/in" ||
      pathname.startsWith("/in/") ||
      pathname.includes("-india") ||
      pathname.includes("-india/")
    ) {
      return "IN";
    }

    // 1. Explicit query parameter override (e.g. ?country=GB or ?country=IN)
    const urlParams = new URLSearchParams(window.location.search);
    const qCountry = urlParams.get("country")?.toUpperCase();
    if (qCountry === "GB" || qCountry === "UK") return "GB";
    if (qCountry === "IN") return "IN";

    // 2. Browser system timezone & offset (Instant, 0 latency, 0 permissions)
    // CRITICAL: Check Indian timezone FIRST before checking stale localStorage or languages!
    // If the user's browser is in Indian Standard Time (IST is UTC+5:30 -> offset -330),
    // they are physically on an Indian IP / device and should ALWAYS see Indian pricing (INR ₹).
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const offset = new Date().getTimezoneOffset(); // Indian Standard Time (IST) is UTC+5:30 -> offset is -330
    if (
      tz === "Asia/Kolkata" ||
      tz === "Asia/Calcutta" ||
      tz.includes("Kolkata") ||
      tz.includes("Calcutta") ||
      offset === -330
    ) {
      return "IN";
    }

    // 3. Persistent user choice from localStorage (for non-IST visitors who toggled)
    const stored = window.localStorage.getItem("urpass_country")?.toUpperCase();
    if (stored === "GB" || stored === "UK") return "GB";
    if (stored === "IN") return "IN";

    if (
      tz === "Europe/London" ||
      tz === "Europe/Belfast" ||
      tz === "Europe/Jersey" ||
      tz === "Europe/Guernsey" ||
      tz === "Europe/Isle_of_Man" ||
      tz === "GMT" ||
      tz === "BST"
    ) {
      return "GB";
    }

    // 4. Browser languages
    // Never return GB if timezone offset indicates Indian Standard Time (-330)
    // or if navigator.languages also includes an Indian locale.
    const navLangs = navigator.languages || [navigator.language || ""];
    const hasIndianLang = navLangs.some((l) => {
      const lower = l.toLowerCase();
      return (
        lower === "en-in" ||
        lower.startsWith("en-in") ||
        lower.startsWith("hi") ||
        lower.startsWith("ta") ||
        lower.startsWith("te") ||
        lower.startsWith("kn") ||
        lower.startsWith("mr") ||
        lower.startsWith("bn") ||
        lower.startsWith("gu") ||
        lower.startsWith("ml") ||
        lower.startsWith("pa")
      );
    });

    if (hasIndianLang) {
      return "IN";
    }

    for (const l of navLangs) {
      const lower = l.toLowerCase();
      if (lower === "en-gb" || lower.startsWith("en-gb")) {
        if (offset === -330) return "IN";
        return "GB";
      }
    }
  } catch {
    // Ignore and fallback
  }

  return "IN";
}

/**
 * Saves user market choice across both localStorage and Cookie so both
 * server components (Next.js headers/cookies) and client components stay in sync.
 * Also dispatches a browser custom event so active UI components update reactively.
 */
export function persistCountryPreference(country: "IN" | "GB"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("urpass_country", country);
    document.cookie = `urpass_country=${country}; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(
      new CustomEvent("urpass_country_changed", { detail: { country } })
    );
  } catch {
    // Ignore
  }
}

/**
 * Validates UK postcode format against Royal Mail standard rules.
 * Accepts formats like: SW1A 1AA, EC1A 1BB, W1A 0AX, M1 1AE, B1 1BB, EH1 1YZ, etc.
 * Handles with or without internal whitespace.
 */
export function isValidUkPostcode(postcode: string | null | undefined): boolean {
  if (!postcode) return false;
  const cleaned = postcode.trim().toUpperCase();
  // Standard UK outward + inward postcode regex
  // Outward: 1-2 letters + 1-2 digits or digit+letter (e.g. W1A, SW1A, M1, EC1A)
  // Inward: 1 digit + 2 letters (e.g. 1AA, 0AX)
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
  return ukPostcodeRegex.test(cleaned);
}

/**
 * Standardizes a valid UK postcode with proper Royal Mail spacing (e.g., "sw1a1aa" -> "SW1A 1AA").
 */
export function formatUkPostcode(postcode: string): string {
  const cleaned = postcode.trim().toUpperCase().replace(/\s+/g, "");
  if (cleaned.length < 5 || cleaned.length > 7) return postcode.trim().toUpperCase();
  // Inward code is always the last 3 characters (e.g., "1AA")
  const outward = cleaned.slice(0, -3);
  const inward = cleaned.slice(-3);
  return `${outward} ${inward}`;
}

export interface RegistrationFieldPreset {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "email" | "tel";
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

/**
 * Returns country-tuned registration field presets for campus, conferences, and student events.
 */
export function getRegistrationFieldPresets(countryCode: SupportedCountryCode = "IN"): RegistrationFieldPreset[] {
  if (countryCode === "GB") {
    return [
      {
        id: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "e.g. Oliver Smith",
      },
      {
        id: "email",
        label: "University / Work Email",
        type: "email",
        required: true,
        placeholder: "oliver.smith@ucl.ac.uk",
      },
      {
        id: "student_id",
        label: "Student ID Number",
        type: "text",
        required: false,
        placeholder: "e.g. 21084920",
        helpText: "Required for student union & society members",
      },
      {
        id: "institution",
        label: "University / Organisation",
        type: "text",
        required: true,
        placeholder: "e.g. University of Manchester",
      },
      {
        id: "course_department",
        label: "Course / Department",
        type: "text",
        required: false,
        placeholder: "e.g. BSc Computer Science, Year 2",
      },
      {
        id: "dietary_requirements",
        label: "Dietary Requirements",
        type: "select",
        required: false,
        options: ["None", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free", "Other"],
      },
    ];
  }

  if (countryCode === "US") {
    return [
      {
        id: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "e.g. John Doe",
      },
      {
        id: "email",
        label: "College / Work Email",
        type: "email",
        required: true,
        placeholder: "johndoe@nyu.edu",
      },
      {
        id: "student_id",
        label: "Student ID",
        type: "text",
        required: false,
        placeholder: "e.g. N12345678",
      },
      {
        id: "institution",
        label: "College / University",
        type: "text",
        required: true,
        placeholder: "e.g. NYU Stern",
      },
      {
        id: "major_department",
        label: "Major / Department",
        type: "text",
        required: false,
        placeholder: "e.g. Computer Science",
      },
    ];
  }

  // Default: India (IN)
  return [
    {
      id: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "e.g. Aarav Sharma",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "aarav@gmail.com",
    },
    {
      id: "phone",
      label: "WhatsApp Phone Number",
      type: "tel",
      required: true,
      placeholder: "9876543210",
      helpText: "For instant QR ticket delivery via WhatsApp",
    },
    {
      id: "roll_number",
      label: "Roll Number / USN",
      type: "text",
      required: false,
      placeholder: "e.g. 1RV21CS001",
    },
    {
      id: "college_name",
      label: "College / Institution Name",
      type: "text",
      required: true,
      placeholder: "e.g. RV College of Engineering",
    },
    {
      id: "department",
      label: "Department & Year",
      type: "text",
      required: false,
      placeholder: "e.g. CSE, 3rd Year",
    },
  ];
}

