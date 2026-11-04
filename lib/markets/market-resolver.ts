import { MarketConfig, CountryCode } from "./types";
import { MARKETS } from "./config";

/**
 * Resolves the appropriate MarketConfig based on an explicit country code,
 * currency, timezone, or event/organisation metadata.
 * Explicit configuration always takes precedence over inferred values.
 */
export function resolveMarket(identifier?: string | null | {
  country_code?: string | null;
  currency?: string | null;
  timezone?: string | null;
}): MarketConfig {
  if (!identifier) return MARKETS.IN;

  if (typeof identifier === "object") {
    if (identifier.country_code) {
      const cc = identifier.country_code.trim().toUpperCase();
      if (cc === "GB" || cc === "UK") return MARKETS.GB;
      if (cc === "IN") return MARKETS.IN;
    }
    if (identifier.currency) {
      const cur = identifier.currency.trim().toUpperCase();
      if (cur === "GBP") return MARKETS.GB;
      if (cur === "INR") return MARKETS.IN;
    }
    if (identifier.timezone) {
      const tz = identifier.timezone.trim().toLowerCase();
      if (tz === "europe/london" || tz.includes("london") || tz === "gmt" || tz === "bst") {
        return MARKETS.GB;
      }
    }
    return MARKETS.IN;
  }

  const clean = identifier.trim().toUpperCase();
  if (clean === "GB" || clean === "UK" || clean === "GBP" || clean.includes("LONDON")) {
    return MARKETS.GB;
  }
  return MARKETS.IN;
}

/**
 * Checks whether an event, country, or currency represents the UK market.
 */
export function isUkMarket(identifier?: string | null | {
  country_code?: string | null;
  currency?: string | null;
  timezone?: string | null;
}): boolean {
  return resolveMarket(identifier).countryCode === "GB";
}

/**
 * Advisory IP geolocation detection from request headers.
 * Rule: Country selection must never be based exclusively on IP geolocation.
 */
export function detectCountryFromHeaders(headers: Headers | Record<string, string | string[] | undefined>): CountryCode | null {
  const getHeader = (name: string): string | null => {
    if ("get" in headers && typeof headers.get === "function") {
      return headers.get(name);
    }
    const val = (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()];
    if (Array.isArray(val)) return val[0] || null;
    return (val as string) || null;
  };

  const raw = (
    getHeader("x-vercel-ip-country") ||
    getHeader("cf-ipcountry") ||
    getHeader("x-country-code") ||
    ""
  ).trim().toUpperCase();

  if (raw === "GB" || raw === "UK") return "GB";
  if (raw === "IN") return "IN";
  return null;
}

