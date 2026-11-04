/**
 * Backward compatibility bridge for lib/market.ts
 * Re-exports the centralized lib/markets system.
 */
export * from "./markets";

import { MARKETS as CENTRAL_MARKETS, resolveMarket, isUkMarket as centralIsUkMarket } from "./markets";
import { validatePhoneNumber, normalizePhoneNumber as centralNormalize, validatePostalCode } from "./markets/localisation";

export const MARKETS = CENTRAL_MARKETS;

export function getMarketConfig(identifier?: string | null) {
  return resolveMarket(identifier);
}

export function isUkMarket(identifier?: string | null): boolean {
  return centralIsUkMarket(identifier);
}

export function validatePhoneNumberForMarket(phone: string, countryCode: string = "IN"): boolean {
  const isUk = countryCode === "GB" || countryCode === "UK" || isUkMarket(countryCode);
  return validatePhoneNumber(phone, isUk ? "GB" : "IN");
}

export function normalizePhoneNumber(phone: string, defaultCountry: string = "IN"): string {
  const isUk = defaultCountry === "GB" || defaultCountry === "UK" || isUkMarket(defaultCountry);
  return centralNormalize(phone, isUk ? "GB" : "IN");
}

export function validateUkPostcode(postcode: string): boolean {
  return validatePostalCode(postcode, "GB");
}
