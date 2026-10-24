export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  GBP: "£",
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

export function formatPrice(amountInSmallestUnit: number, currency: string = "INR"): string {
  if (amountInSmallestUnit === 0) return "Free";
  const norm = (currency || "INR").toUpperCase();
  const symbol = getCurrencySymbol(norm);
  const isINR = norm === "INR";
  const major = amountInSmallestUnit / 100;
  const formatted = major.toLocaleString(isINR ? "en-IN" : "en-US", {
    minimumFractionDigits: amountInSmallestUnit % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function formatAmount(amountMajor: number, currency: string = "INR"): string {
  if (amountMajor === 0) return "Free";
  const norm = (currency || "INR").toUpperCase();
  const symbol = getCurrencySymbol(norm);
  const isINR = norm === "INR";
  const formatted = amountMajor.toLocaleString(isINR ? "en-IN" : "en-US", {
    minimumFractionDigits: Number.isInteger(amountMajor) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}
