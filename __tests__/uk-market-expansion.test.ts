import { describe, it, expect } from "vitest";
import {
  MARKETS,
  resolveMarket,
  isUkMarket,
  detectCountryFromHeaders,
  formatPrice,
  formatAmount,
  convertToSubunits,
  convertSubunitsToMajor,
  isUkTimezone,
  formatEventDateTime,
  eventUtcRange,
  validatePostalCode,
  validatePhoneNumber,
} from "@/lib/markets";
import { calculateInvoiceTaxes, numToWordsGBP } from "@/lib/invoices";
import { shouldShowCookieConsent, isLandingPageRoute } from "@/components/ui/CookieConsentBanner";

describe("UK Market Foundations — Config & Resolution", () => {
  it("defines authoritative UK and India market configs", () => {
    expect(MARKETS.GB.countryCode).toBe("GB");
    expect(MARKETS.GB.currency).toBe("GBP");
    expect(MARKETS.GB.defaultTimezone).toBe("Europe/London");
    expect(MARKETS.GB.locale).toBe("en-GB");
    expect(MARKETS.GB.tax.taxRatePercent).toBe(20);
    expect(MARKETS.GB.paymentsEnabled).toBe(false); // Gated until approved payment provider

    expect(MARKETS.IN.countryCode).toBe("IN");
    expect(MARKETS.IN.currency).toBe("INR");
    expect(MARKETS.IN.defaultTimezone).toBe("Asia/Kolkata");
    expect(MARKETS.IN.locale).toBe("en-IN");
    expect(MARKETS.IN.tax.taxRatePercent).toBe(18); // Indian GST 18%
    expect(MARKETS.IN.paymentsEnabled).toBe(true);
  });

  it("resolves market by country code, currency, and metadata", () => {
    expect(resolveMarket("GB").countryCode).toBe("GB");
    expect(resolveMarket("gb").countryCode).toBe("GB");
    expect(resolveMarket("UK").countryCode).toBe("GB");
    expect(resolveMarket("IN").countryCode).toBe("IN");
    expect(resolveMarket({ currency: "GBP" }).countryCode).toBe("GB");
    expect(resolveMarket({ currency: "INR" }).countryCode).toBe("IN");
    expect(resolveMarket({ timezone: "Europe/London" }).countryCode).toBe("GB");
    expect(resolveMarket({ timezone: "Asia/Kolkata" }).countryCode).toBe("IN");
  });

  it("detects UK vs IN accurately with isUkMarket", () => {
    expect(isUkMarket("GB")).toBe(true);
    expect(isUkMarket("gb")).toBe(true);
    expect(isUkMarket("IN")).toBe(false);
    expect(isUkMarket(null)).toBe(false);
    expect(isUkMarket({ country_code: "GB" })).toBe(true);
    expect(isUkMarket({ currency: "GBP" })).toBe(true);
    expect(isUkMarket({ timezone: "Europe/London" })).toBe(true);
  });

  it("detects country code from various proxy and CDN headers", () => {
    expect(detectCountryFromHeaders({ "x-vercel-ip-country": "GB" })).toBe("GB");
    expect(detectCountryFromHeaders({ "cf-ipcountry": "GB" })).toBe("GB");
    expect(detectCountryFromHeaders({ "x-country-code": "in" })).toBe("IN");
    expect(detectCountryFromHeaders({})).toBe(null);
  });
});

describe("UK Currency Formatting & Math (Pence / Pounds)", () => {
  it("formats GBP minor units (pence) correctly", () => {
    expect(formatPrice(0, "GBP")).toBe("Free");
    expect(formatPrice(1500, "GBP")).toBe("£15");
    expect(formatPrice(3550, "GBP")).toBe("£35.50");
    expect(formatPrice(7900, "GBP")).toBe("£79");
    expect(formatPrice(24900, "GBP")).toBe("£249");
  });

  it("formats INR minor units (paise) correctly without regression", () => {
    expect(formatPrice(0, "INR")).toBe("Free");
    expect(formatPrice(14900, "INR")).toBe("₹149");
    expect(formatPrice(99900, "INR")).toBe("₹999");
    expect(formatPrice(1999900, "INR")).toBe("₹19,999");
  });

  it("converts between decimal and integer minor units safely", () => {
    expect(convertToSubunits(15)).toBe(1500);
    expect(convertToSubunits("35.50")).toBe(3550);
    expect(convertToSubunits(149)).toBe(14900);

    expect(convertSubunitsToMajor(1500)).toBe(15);
    expect(convertSubunitsToMajor(3550)).toBe(35.5);
    expect(convertSubunitsToMajor(14900)).toBe(149);
  });

  it("formats major units with formatAmount", () => {
    expect(formatAmount(0, "GBP")).toBe("Free");
    expect(formatAmount(15, "GBP")).toBe("£15");
    expect(formatAmount(35.5, "GBP")).toBe("£35.50");
    expect(formatAmount(149, "INR")).toBe("₹149");
  });
});

describe("UK Timezone & British Summer Time (BST / GMT)", () => {
  it("identifies UK timezones correctly", () => {
    expect(isUkTimezone("Europe/London")).toBe(true);
    expect(isUkTimezone("GMT")).toBe(true);
    expect(isUkTimezone("BST")).toBe(true);
    expect(isUkTimezone("Asia/Kolkata")).toBe(false);
  });

  it("handles GMT (winter) and BST (summer) clock changes properly", () => {
    // Winter (GMT, UTC+0)
    const winterIso = "2026-01-15T14:00:00.000Z";
    const winterFormatted = formatEventDateTime(winterIso, "Europe/London", "en-GB");
    expect(winterFormatted).toContain("15 Jan 2026");
    expect(winterFormatted).toContain("14:00");
    expect(winterFormatted).toContain("GMT");

    // Summer (BST, UTC+1)
    const summerIso = "2026-07-15T13:00:00.000Z"; // 13:00 UTC = 14:00 BST
    const summerFormatted = formatEventDateTime(summerIso, "Europe/London", "en-GB");
    expect(summerFormatted).toContain("15 Jul 2026");
    expect(summerFormatted).toContain("14:00");
    expect(summerFormatted).toContain("BST");

    // Test UTC range conversion
    const range = eventUtcRange({
      event_date: "2026-07-15",
      start_time: "10:00",
      end_time: "18:00",
      timezone: "Europe/London",
    });
    expect(range.startsAtUtc).toBeDefined();
    expect(range.endsAtUtc).toBeDefined();
    // In BST (UTC+1), 10:00 BST should be 09:00 UTC
    expect(range.startsAtUtc).toBe("2026-07-15T09:00:00.000Z");
    expect(range.endsAtUtc).toBe("2026-07-15T17:00:00.000Z");
  });
});

describe("UK Localisation — Postcodes & Phone numbers", () => {
  it("validates UK postcodes accurately", () => {
    expect(validatePostalCode("SW1A 1AA", "GB")).toBe(true);
    expect(validatePostalCode("EC1A 1BB", "GB")).toBe(true);
    expect(validatePostalCode("W1A 0AX", "GB")).toBe(true);
    expect(validatePostalCode("M1 1AE", "GB")).toBe(true);
    expect(validatePostalCode("B33 8TH", "GB")).toBe(true);
    expect(validatePostalCode("CR2 6XH", "GB")).toBe(true);
    expect(validatePostalCode("INVALID_POSTCODE", "GB")).toBe(false);
  });

  it("validates Indian PIN codes accurately", () => {
    expect(validatePostalCode("600001", "IN")).toBe(true);
    expect(validatePostalCode("560001", "IN")).toBe(true);
    expect(validatePostalCode("110001", "IN")).toBe(true);
    expect(validatePostalCode("123", "IN")).toBe(false);
  });

  it("validates UK and Indian phone numbers", () => {
    expect(validatePhoneNumber("+447911123456", "GB")).toBe(true);
    expect(validatePhoneNumber("07911123456", "GB")).toBe(true);
    expect(validatePhoneNumber("+919876543210", "IN")).toBe(true);
    expect(validatePhoneNumber("9876543210", "IN")).toBe(true);
  });
});

describe("Invoicing & Tax Compliance — No Fake UK VAT", () => {
  it("calculates Indian GST (18%) properly for INR", () => {
    const intraState = calculateInvoiceTaxes({
      taxableAmount: 1000,
      currency: "INR",
      customerStateCode: "33", // Tamil Nadu (Intra-state with Yesp Corp)
    });
    expect(intraState.cgstRate).toBe(9);
    expect(intraState.cgstAmount).toBe(90);
    expect(intraState.sgstRate).toBe(9);
    expect(intraState.sgstAmount).toBe(90);
    expect(intraState.igstRate).toBe(0);
    expect(intraState.totalAmount).toBe(1180);

    const interState = calculateInvoiceTaxes({
      taxableAmount: 1000,
      currency: "INR",
      customerStateCode: "29", // Karnataka (Inter-state)
    });
    expect(interState.cgstRate).toBe(0);
    expect(interState.sgstRate).toBe(0);
    expect(interState.igstRate).toBe(18);
    expect(interState.igstAmount).toBe(180);
    expect(interState.totalAmount).toBe(1180);
  });

  it("emits exempt/non-registered 0% tax for GBP without fake VAT injection", () => {
    const ukTaxes = calculateInvoiceTaxes({
      taxableAmount: 100,
      currency: "GBP",
    });
    expect(ukTaxes.placeOfSupply).toBe("United Kingdom");
    expect(ukTaxes.stateCode).toBe("GB");
    expect(ukTaxes.cgstRate).toBe(0);
    expect(ukTaxes.cgstAmount).toBe(0);
    expect(ukTaxes.sgstRate).toBe(0);
    expect(ukTaxes.sgstAmount).toBe(0);
    expect(ukTaxes.igstRate).toBe(0);
    expect(ukTaxes.igstAmount).toBe(0);
    expect(ukTaxes.totalAmount).toBe(100); // No synthetic 20% VAT added!
  });

  it("converts GBP amounts to words properly", () => {
    expect(numToWordsGBP(15)).toBe("Pounds Fifteen Only");
    expect(numToWordsGBP(35.5)).toBe("Pounds Thirty Five and Fifty Pence Only");
    expect(numToWordsGBP(249)).toBe("Pounds Two Hundred Forty Nine Only");
  });
});

describe("Cookie Consent & PECR Compliance Routes", () => {
  it("shows consent banner on landing routes", () => {
    expect(isLandingPageRoute("/")).toBe(true);
    expect(isLandingPageRoute("/uk")).toBe(true);
    expect(isLandingPageRoute("/in")).toBe(true);
    expect(isLandingPageRoute("/dashboard")).toBe(false);
  });

  it("shows consent banner for UK visitors on public entry points", () => {
    expect(shouldShowCookieConsent("/apply/test-event-id", true)).toBe(true);
    expect(shouldShowCookieConsent("/e/my-uk-conference", true)).toBe(true);
    expect(shouldShowCookieConsent("/explore", true)).toBe(true);
    expect(shouldShowCookieConsent("/solutions/custom-qr-ticket-designer", true)).toBe(true);
    expect(shouldShowCookieConsent("/privacy", true)).toBe(true);
    expect(shouldShowCookieConsent("/terms", true)).toBe(true);
  });

  it("suppresses consent banner on organizer dashboard routes", () => {
    expect(shouldShowCookieConsent("/dashboard", true)).toBe(false);
    expect(shouldShowCookieConsent("/dashboard/events", true)).toBe(false);
    expect(shouldShowCookieConsent("/admin/orders", true)).toBe(false);
  });
});
