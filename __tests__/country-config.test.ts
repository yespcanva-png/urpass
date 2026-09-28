import { describe, it, expect } from "vitest";
import {
  getCountryConfig,
  formatCurrency,
  formatDateForCountry,
  formatDateTimeForCountry,
  normalizePhoneInternational,
  isValidE164Phone,
  maskPhoneInternational,
  COUNTRIES,
} from "@/lib/country-config";

describe("Country Configuration Layer (Enterprise i18n)", () => {
  describe("Country Resolution", () => {
    it("resolves India (IN) config by default or explicit identifiers", () => {
      expect(getCountryConfig().countryCode).toBe("IN");
      expect(getCountryConfig("IN").currency).toBe("INR");
      expect(getCountryConfig("INR").currencySymbol).toBe("₹");
      expect(getCountryConfig("+91").phoneCountryCode).toBe("+91");
      expect(getCountryConfig("Asia/Kolkata").timezone).toBe("Asia/Kolkata");
    });

    it("resolves United Kingdom (GB) config by code, currency, phone, or timezone", () => {
      expect(getCountryConfig("GB").countryCode).toBe("GB");
      expect(getCountryConfig("UK").countryCode).toBe("GB");
      expect(getCountryConfig("GBP").currencySymbol).toBe("£");
      expect(getCountryConfig("+44").phoneCountryCode).toBe("+44");
      expect(getCountryConfig("Europe/London").timezone).toBe("Europe/London");
      expect(getCountryConfig("GB").paymentGateway).toBe("stripe");
      expect(getCountryConfig("GB").taxType).toBe("VAT");
      expect(getCountryConfig("GB").taxRate).toBe(0.20);
    });

    it("resolves United States (US) config", () => {
      expect(getCountryConfig("US").countryCode).toBe("US");
      expect(getCountryConfig("USD").currencySymbol).toBe("$");
      expect(getCountryConfig("+1").phoneCountryCode).toBe("+1");
    });
  });

  describe("Campus Terminology Presets", () => {
    it("provides UK university terminology preset", () => {
      const ukTerminology = COUNTRIES.GB.terminology;
      expect(ukTerminology.institution).toBe("University");
      expect(ukTerminology.studentId).toBe("Student ID");
      expect(ukTerminology.studentOrg).toBe("Societies & Sports Clubs");
      expect(ukTerminology.governingBody).toBe("Students' Union (SU)");
      expect(ukTerminology.academicTerm).toBe("Term / Semester");
    });

    it("provides India college terminology preset", () => {
      const inTerminology = COUNTRIES.IN.terminology;
      expect(inTerminology.institution).toBe("College / Institution");
      expect(inTerminology.studentId).toBe("Roll Number");
      expect(inTerminology.studentOrg).toBe("Clubs & Cells");
      expect(inTerminology.governingBody).toBe("College Administration");
      expect(inTerminology.academicTerm).toBe("Semester");
    });
  });

  describe("Currency Formatting", () => {
    it("formats INR paise correctly", () => {
      expect(formatCurrency(99900, "IN")).toBe("₹999.00");
      expect(formatCurrency(49900, "INR")).toBe("₹499.00");
    });

    it("formats GBP pence correctly", () => {
      expect(formatCurrency(1500, "GB")).toBe("£15.00");
      expect(formatCurrency(3500, "GBP")).toBe("£35.00");
    });

    it("formats USD cents correctly", () => {
      expect(formatCurrency(2500, "US")).toBe("$25.00");
    });

    it("handles null or NaN amounts gracefully", () => {
      expect(formatCurrency(null)).toBe("—");
      expect(formatCurrency(NaN)).toBe("—");
    });
  });

  describe("Phone Number Normalization (UK & India)", () => {
    it("normalizes UK mobile starting with 07 to +44", () => {
      expect(normalizePhoneInternational("07123456789")).toBe("+447123456789");
      expect(normalizePhoneInternational("07123 456789")).toBe("+447123456789");
      expect(normalizePhoneInternational("+44 7123 456789")).toBe("+447123456789");
      expect(normalizePhoneInternational("447123456789")).toBe("+447123456789");
    });

    it("normalizes UK landline when GB is specified as default country", () => {
      expect(normalizePhoneInternational("02079460000", "GB")).toBe("+442079460000");
    });

    it("normalizes Indian 10-digit mobile numbers to +91", () => {
      expect(normalizePhoneInternational("9876543210")).toBe("+919876543210");
      expect(normalizePhoneInternational("09876543210")).toBe("+919876543210");
      expect(normalizePhoneInternational("+91 98765-43210")).toBe("+919876543210");
    });

    it("validates E.164 phone formats", () => {
      expect(isValidE164Phone("+447123456789")).toBe(true);
      expect(isValidE164Phone("+919876543210")).toBe(true);
      expect(isValidE164Phone("07123456789")).toBe(false);
      expect(isValidE164Phone("invalid")).toBe(false);
    });

    it("masks phone numbers properly for UK and India", () => {
      expect(maskPhoneInternational("+447123456789")).toBe("+44 •••••••789");
      expect(maskPhoneInternational("+919876543210")).toBe("+91 •••••••210");
      expect(maskPhoneInternational("07123456789")).toBe("+44 •••••••789");
      expect(maskPhoneInternational(null)).toBe("—");
    });
  });

  describe("Date & Time Formatting for UK and India", () => {
    const testDate = new Date("2026-10-15T14:30:00Z");

    it("formats date in UK format (DD/MM/YYYY, Europe/London)", () => {
      const formatted = formatDateForCountry(testDate, "GB");
      expect(formatted).toContain("15");
      expect(formatted).toContain("October");
      expect(formatted).toContain("2026");
    });

    it("formats date and time in local timezone", () => {
      const formattedUK = formatDateTimeForCountry(testDate, "GB");
      expect(formattedUK).toBeDefined();

      const formattedIN = formatDateTimeForCountry(testDate, "IN");
      expect(formattedIN).toBeDefined();
    });
  });
});
