export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  GBP: "£",
  USD: "$",
  EUR: "€",
  AED: "AED ",
  CAD: "CA$",
  AUD: "AU$",
  SGD: "SG$",
};

export function getCurrencySymbol(currency: string = "INR"): string {
  const norm = (currency || "INR").toUpperCase();
  return CURRENCY_SYMBOLS[norm] || `${norm} `;
}

export const CURRENCY_LOCALES: Record<string, string> = {
  INR: "en-IN",
  GBP: "en-GB",
  USD: "en-US",
  EUR: "en-IE",
  CAD: "en-CA",
  AUD: "en-AU",
  SGD: "en-SG",
};

export function getCurrencyLocale(currency: string = "INR"): string {
  const norm = (currency || "INR").toUpperCase();
  return CURRENCY_LOCALES[norm] || "en-GB";
}

/**
 * Formats monetary amounts given in smallest integer minor units (Paise for INR, Pence for GBP).
 * Never performs floating point money calculations.
 */
export function formatPrice(amountInSmallestUnit: number, currency: string = "INR"): string {
  if (!amountInSmallestUnit || amountInSmallestUnit === 0) return "Free";
  const safeUnits = Math.round(Number(amountInSmallestUnit) || 0);
  const norm = (currency || "INR").toUpperCase();
  const locale = getCurrencyLocale(norm);
  const isWhole = safeUnits % 100 === 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: norm,
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(safeUnits / 100);
}

/**
 * Formats major currency amounts (e.g. 999 INR, 15 GBP).
 */
export function formatAmount(amountMajor: number, currency: string = "INR"): string {
  if (amountMajor === 0) return "Free";
  const norm = (currency || "INR").toUpperCase();
  const symbol = getCurrencySymbol(norm);
  const locale = getCurrencyLocale(norm);
  const formatted = amountMajor.toLocaleString(locale, {
    minimumFractionDigits: Number.isInteger(amountMajor) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

/**
 * Decimal-safe string conversion to minor units (Paise / Pence) without floating-point inaccuracies.
 * Converts 29.99 -> 2999, 15 -> 1500, 0.5 -> 50.
 */
export function convertToSubunits(amountMajor: number | string): number {
  if (typeof amountMajor === "number" && !Number.isFinite(amountMajor)) {
    throw new Error("Amount must be finite.");
  }
  const text = amountMajor.toString().trim();
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(text)) {
    throw new Error("Amount must have at most two decimal places.");
  }
  const negative = text.startsWith("-");
  const [whole, fraction = ""] = (negative ? text.slice(1) : text).split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(minor)) {
    throw new Error("Amount exceeds safe integer range.");
  }
  return negative ? -minor : minor;
}

/**
 * Converts minor subunits back to major units.
 */
export function convertSubunitsToMajor(subunits: number): number {
  if (!Number.isSafeInteger(subunits)) {
    throw new Error("Subunits must be an integer.");
  }
  return subunits / 100;
}
