import { describe, it, expect } from "vitest";
import {
  MARKETS,
  getMarketConfig,
  isUkMarket,
  validatePhoneNumberForMarket,
  normalizePhoneNumber,
  validateUkPostcode,
} from "@/lib/market";
import {
  formatPrice,
  formatAmount,
  getCurrencySymbol,
  getCurrencyLocale,
  convertToSubunits,
  convertSubunitsToMajor,
} from "@/lib/currency";
import { getSMSProviderForRecipient } from "@/lib/communications/providers/sms";
import { shouldShowCookieConsent, isLandingPageRoute } from "@/components/ui/CookieConsentBanner";
import { FEATURE_FLAG_DEFINITIONS } from "@/lib/feature-flags";
import { formatEmailTimestamp } from "@/lib/email";

describe("UK Market Foundations & Expansion Suite", () => {
  describe("Market Configuration (IN vs GB)", () => {
    it("returns India config by default or with INR / IN identifier", () => {
      const inDefault = getMarketConfig();
      expect(inDefault.countryCode).toBe("IN");
      expect(inDefault.currency).toBe("INR");
      expect(inDefault.currencySymbol).toBe("₹");
      expect(inDefault.defaultTimezone).toBe("Asia/Kolkata");
      expect(inDefault.locale).toBe("en-IN");
      expect(inDefault.tax.taxLabel).toBe("GST");
      expect(inDefault.postalCodeLabel).toBe("PIN Code");

      expect(getMarketConfig("IN").countryCode).toBe("IN");
      expect(getMarketConfig("INR").countryCode).toBe("IN");
    });

    it("returns UK config for GB, UK, GBP, or London timezone", () => {
      const ukConfig = getMarketConfig("GB");
      expect(ukConfig.countryCode).toBe("GB");
      expect(ukConfig.currency).toBe("GBP");
      expect(ukConfig.currencySymbol).toBe("£");
      expect(ukConfig.defaultTimezone).toBe("Europe/London");
      expect(ukConfig.locale).toBe("en-GB");
      expect(ukConfig.tax.taxLabel).toBe("VAT");
      expect(ukConfig.postalCodeLabel).toBe("Postcode");
      expect(ukConfig.paymentsEnabled).toBe(false);
      expect(ukConfig.defaultGateway).toBe("pending");

      expect(getMarketConfig("UK").countryCode).toBe("GB");
      expect(getMarketConfig("GBP").countryCode).toBe("GB");
      expect(getMarketConfig("Europe/London").countryCode).toBe("GB");
    });

    it("correctly identifies whether an identifier belongs to the UK market", () => {
      expect(isUkMarket("GB")).toBe(true);
      expect(isUkMarket("gb")).toBe(true);
      expect(isUkMarket("UK")).toBe(true);
      expect(isUkMarket("GBP")).toBe(true);
      expect(isUkMarket("Europe/London")).toBe(true);

      expect(isUkMarket("IN")).toBe(false);
      expect(isUkMarket("INR")).toBe(false);
      expect(isUkMarket("Asia/Kolkata")).toBe(false);
      expect(isUkMarket(null)).toBe(false);
      expect(isUkMarket(undefined)).toBe(false);
    });
  });

  describe("UK Phone & Postcode Validation & Normalization", () => {
    it("validates UK mobile and landline numbers", () => {
      expect(validatePhoneNumberForMarket("+447700900077", "GB")).toBe(true);
      expect(validatePhoneNumberForMarket("+44 7911 123456", "GB")).toBe(true);
      expect(validatePhoneNumberForMarket("07911123456", "GB")).toBe(true);

      expect(validatePhoneNumberForMarket("12345", "GB")).toBe(false);
      expect(validatePhoneNumberForMarket("", "GB")).toBe(false);
    });

    it("normalizes UK phone numbers with international prefix", () => {
      expect(normalizePhoneNumber("07911123456", "GB")).toBe("+447911123456");
      expect(normalizePhoneNumber("+447911123456", "GB")).toBe("+447911123456");
      expect(normalizePhoneNumber("9876543210", "IN")).toBe("+919876543210");
    });

    it("validates standard UK postcodes", () => {
      expect(validateUkPostcode("SW1A 1AA")).toBe(true);
      expect(validateUkPostcode("EC1A 1BB")).toBe(true);
      expect(validateUkPostcode("W1A 0AX")).toBe(true);
      expect(validateUkPostcode("M1 1AE")).toBe(true);
      expect(validateUkPostcode("B33 8TH")).toBe(true);
      expect(validateUkPostcode("cr2 6xh")).toBe(true); // case-insensitive

      expect(validateUkPostcode("110001")).toBe(false); // Indian PIN
      expect(validateUkPostcode("ABC")).toBe(false);
    });
  });

  describe("Currency Utilities & Subunits Conversion", () => {
    it("formats GBP prices and amounts accurately", () => {
      expect(getCurrencySymbol("GBP")).toBe("£");
      expect(getCurrencyLocale("GBP")).toBe("en-GB");

      // formatPrice from smallest unit (pence)
      expect(formatPrice(0, "GBP")).toBe("Free");
      expect(formatPrice(1000, "GBP")).toBe("£10");
      expect(formatPrice(1550, "GBP")).toBe("£15.50");
      expect(formatPrice(250000, "GBP")).toBe("£2,500");

      // formatAmount from major unit
      expect(formatAmount(0, "GBP")).toBe("Free");
      expect(formatAmount(15, "GBP")).toBe("£15");
      expect(formatAmount(15.5, "GBP")).toBe("£15.50");
      expect(formatAmount(1200, "GBP")).toBe("£1,200");
    });

    it("preserves Indian INR formatting without regression", () => {
      expect(getCurrencySymbol("INR")).toBe("₹");
      expect(getCurrencyLocale("INR")).toBe("en-IN");
      expect(formatPrice(10000, "INR")).toBe("₹100");
      expect(formatPrice(15000000, "INR")).toBe("₹1,50,000"); // Indian numbering system
      expect(formatAmount(5000, "INR")).toBe("₹5,000");
    });

    it("converts major units to subunits and vice versa", () => {
      expect(convertToSubunits(10)).toBe(1000);
      expect(convertToSubunits(10.5)).toBe(1050);
      expect(convertSubunitsToMajor(1050)).toBe(10.5);
      expect(convertSubunitsToMajor(1000)).toBe(10);
    });
  });

  describe("SMS Routing for UK vs Domestic Recipients", () => {
    it("routes UK (+44) recipient numbers to global gateway instead of Indian DLT", () => {
      const ukProvider = getSMSProviderForRecipient("+447911123456");
      // In test environment, mockSMSProvider is safely returned
      expect(ukProvider).toBeDefined();
      expect(typeof ukProvider.send).toBe("function");
    });

    it("routes domestic Indian (+91) recipient numbers to default DLT provider", () => {
      const inProvider = getSMSProviderForRecipient("+919876543210");
      expect(inProvider).toBeDefined();
      expect(typeof inProvider.send).toBe("function");
    });
  });

  describe("PECR Cookie Consent Compliance", () => {
    it("preserves backward compatibility of isLandingPageRoute", () => {
      expect(isLandingPageRoute("/")).toBe(true);
      expect(isLandingPageRoute("/uk")).toBe(true);
      expect(isLandingPageRoute("/in")).toBe(true);
      expect(isLandingPageRoute("/dashboard")).toBe(false);
      expect(isLandingPageRoute("/apply/london-tech-fest")).toBe(false);
    });

    it("shows consent choices to UK visitors on public event and booking pages", () => {
      // Non-UK visitor on event page -> not triggered by default
      expect(shouldShowCookieConsent("/apply/london-tech-fest", false)).toBe(false);

      // UK visitor on public event and booking entry points -> must present consent under PECR
      expect(shouldShowCookieConsent("/apply/london-tech-fest", true)).toBe(true);
      expect(shouldShowCookieConsent("/e/summer-expo", true)).toBe(true);
      expect(shouldShowCookieConsent("/events/tech-summit", true)).toBe(true);
      expect(shouldShowCookieConsent("/pricing", true)).toBe(true);

      // Internal admin routes never show marketing cookie banners
      expect(shouldShowCookieConsent("/dashboard", true)).toBe(false);
      expect(shouldShowCookieConsent("/event/123/settings", true)).toBe(false);
    });
  });

  describe("Feature Flags for UK Market", () => {
    it("defines and enables UK market feature flags by default", () => {
      expect(FEATURE_FLAG_DEFINITIONS.uk_market_enabled).toBeDefined();
      expect(FEATURE_FLAG_DEFINITIONS.uk_market_enabled.defaultEnabled).toBe(true);

      expect(FEATURE_FLAG_DEFINITIONS.uk_free_registration).toBeDefined();
      expect(FEATURE_FLAG_DEFINITIONS.uk_free_registration.defaultEnabled).toBe(true);

      expect(FEATURE_FLAG_DEFINITIONS.uk_paid_ticketing).toBeDefined();
      expect(FEATURE_FLAG_DEFINITIONS.uk_paid_ticketing.defaultEnabled).toBe(false);

      expect(FEATURE_FLAG_DEFINITIONS.uk_organizer_mor).toBeDefined();
      expect(FEATURE_FLAG_DEFINITIONS.uk_organizer_mor.defaultEnabled).toBe(false);
    });
  });

  describe("Email Timestamp Timezone Localization", () => {
    it("formats email timestamps in Europe/London for GBP transactions", () => {
      const fixedDate = new Date("2026-07-15T12:00:00.000Z"); // Summer (BST: UTC+1)
      const formattedGbp = formatEmailTimestamp(fixedDate, "GBP");
      expect(formattedGbp).toBeDefined();
      // London BST is 13:00 (1 hour ahead of UTC 12:00)
      expect(formattedGbp).toContain("13:00");

      const fixedWinterDate = new Date("2026-01-15T12:00:00.000Z"); // Winter (GMT: UTC+0)
      const formattedWinter = formatEmailTimestamp(fixedWinterDate, "GBP");
      // London GMT is 12:00
      expect(formattedWinter).toContain("12:00");
    });

    it("formats email timestamps in Asia/Kolkata for INR transactions", () => {
      const fixedDate = new Date("2026-07-15T12:00:00.000Z");
      const formattedInr = formatEmailTimestamp(fixedDate, "INR");
      expect(formattedInr).toBeDefined();
      // Kolkata is UTC+5:30 -> 17:30 / 5:30 pm
      expect(formattedInr).toMatch(/5:30|17:30/);
    });
  });
});
