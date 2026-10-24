/**
 * UrPass Production Tax & GST Calculation Engine
 * Complies with Indian Goods and Services Tax (GST) at 18.00%.
 * Supports exact paise integer calculations and GSTIN formatting.
 */

export const STANDARD_GST_RATE = 0.18; // 18%

export interface TaxCalculationResult {
  baseAmountPaise: number;
  baseAmountInr: number;
  taxRatePercent: number;
  taxAmountPaise: number;
  taxAmountInr: number;
  totalAmountPaise: number;
  totalAmountInr: number;
  isGstExempt: boolean;
  cgstPaise?: number;
  sgstPaise?: number;
  igstPaise?: number;
}

export interface BillingAddress {
  legalName: string;
  companyName?: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstin?: string;
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function isValidGstin(gstin: string | null | undefined): boolean {
  if (!gstin) return false;
  const clean = gstin.trim().toUpperCase();
  return GSTIN_REGEX.test(clean);
}

export function getStateCodeFromGstin(gstin: string | null | undefined): string | null {
  if (!isValidGstin(gstin)) return null;
  return gstin!.trim().substring(0, 2);
}

/**
 * Calculates exact tax for any base amount in integer paise.
 * For inter-state transactions, IGST applies.
 * For intra-state transactions (Tamil Nadu / merchant state), CGST 9% + SGST 9% applies.
 */
export function calculateGst(
  baseAmountPaise: number,
  options?: {
    isExempt?: boolean;
    customerStateCode?: string;
    merchantStateCode?: string; // Default: '33' (Tamil Nadu)
  }
): TaxCalculationResult {
  if (baseAmountPaise <= 0 || options?.isExempt) {
    const baseInr = Math.round(baseAmountPaise) / 100;
    return {
      baseAmountPaise,
      baseAmountInr: baseInr,
      taxRatePercent: 0,
      taxAmountPaise: 0,
      taxAmountInr: 0,
      totalAmountPaise: baseAmountPaise,
      totalAmountInr: baseInr,
      isGstExempt: true,
    };
  }

  const taxAmountPaise = Math.round(baseAmountPaise * STANDARD_GST_RATE);
  const totalAmountPaise = baseAmountPaise + taxAmountPaise;

  const baseAmountInr = baseAmountPaise / 100;
  const taxAmountInr = taxAmountPaise / 100;
  const totalAmountInr = totalAmountPaise / 100;

  const merchantState = options?.merchantStateCode || "33"; // Tamil Nadu
  const customerState = options?.customerStateCode || merchantState;
  const isIntraState = customerState === merchantState;

  let cgstPaise: number | undefined;
  let sgstPaise: number | undefined;
  let igstPaise: number | undefined;

  if (isIntraState) {
    cgstPaise = Math.floor(taxAmountPaise / 2);
    sgstPaise = taxAmountPaise - cgstPaise;
  } else {
    igstPaise = taxAmountPaise;
  }

  return {
    baseAmountPaise,
    baseAmountInr,
    taxRatePercent: 18.0,
    taxAmountPaise,
    taxAmountInr,
    totalAmountPaise,
    totalAmountInr,
    isGstExempt: false,
    cgstPaise,
    sgstPaise,
    igstPaise,
  };
}

export function formatInr(amountInRupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: amountInRupees % 1 === 0 ? 0 : 2,
  }).format(amountInRupees);
}

export function formatPaise(amountInPaise: number): string {
  return formatInr(amountInPaise / 100);
}
