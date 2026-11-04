import { MarketConfig, CountryCode, countryCodeSchema } from "./types";

export type { CountryCode, MarketConfig };
export { countryCodeSchema };

export const MARKETS: Record<CountryCode, MarketConfig> = {
  IN: {
    countryCode: "IN",
    countryName: "India",
    currency: "INR",
    currencySymbol: "₹",
    defaultTimezone: "Asia/Kolkata",
    locale: "en-IN",
    phonePrefix: "+91",
    phoneDigits: 10,
    postalCodeLabel: "PIN Code",
    tax: {
      taxType: "GST",
      taxLabel: "GST",
      taxRatePercent: 18,
      taxIdLabel: "GSTIN",
      taxIdRegex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    },
    defaultGateway: "razorpay",
    paymentsEnabled: true,
    privacyFramework: "DPDP_ACT_2023",
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
    currency: "GBP",
    currencySymbol: "£",
    defaultTimezone: "Europe/London",
    locale: "en-GB",
    phonePrefix: "+44",
    phoneDigits: 10,
    postalCodeLabel: "Postcode",
    tax: {
      taxType: "VAT",
      taxLabel: "VAT",
      taxRatePercent: 20,
      taxIdLabel: "VAT Number",
      taxIdRegex: /^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/i,
    },
    defaultGateway: "pending",
    // CRITICAL: UK payments remain disabled until approved merchant/connected-account provider is configured
    paymentsEnabled: false,
    privacyFramework: "UK_GDPR_PECR",
    terminology: {
      institution: "University",
      department: "School / Department",
      studentOrg: "Societies & Sports Clubs",
      studentId: "Student ID",
      governingBody: "Students' Union (SU)",
      academicTerm: "Term / Semester",
    },
  },
};

export function marketForCountry(country?: string | null): MarketConfig {
  if (!country) return MARKETS.IN;
  const clean = country.trim().toUpperCase();
  if (clean === "GB" || clean === "UK") return MARKETS.GB;
  if (clean === "IN") return MARKETS.IN;
  return MARKETS.IN;
}

export function parseCountryCode(value: unknown): CountryCode {
  const parsed = countryCodeSchema.safeParse(value);
  if (parsed.success) return parsed.data;
  return "IN";
}

export function isPaidMarketAvailable(currency: string): boolean {
  const norm = (currency || "").toUpperCase();
  if (norm === "INR") return true;
  // GBP paid ticketing remains false until authorized provider is connected
  return false;
}
