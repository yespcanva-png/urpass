import type { FeeBearer, FeeCalculationResult } from "./types";

export interface FeeCalculationParams {
  basePrice: number;
  feeBearer: FeeBearer;
  platformFeePercent?: number; // default 2.0%
  platformFeeFixedINR?: number; // default 0.00
  gatewayFeePercent?: number; // default 2.0%
  gatewayFeeFixedINR?: number; // default 0.00
  currency?: string;
}

/**
 * Authoritative Fee Calculation Engine
 * Computes attendee total payable amount and organizer net split share.
 */
export function calculateTicketFees({
  basePrice,
  feeBearer,
  platformFeePercent = 2.0,
  platformFeeFixedINR = 0,
  gatewayFeePercent = 2.0,
  gatewayFeeFixedINR = 0,
  currency = "INR",
}: FeeCalculationParams): FeeCalculationResult {
  const safeBase = Math.max(0, Number(basePrice) || 0);

  // If ticket is free, fees are 0
  if (safeBase === 0) {
    return {
      basePrice: 0,
      feeBearer,
      platformFee: 0,
      gatewayFee: 0,
      attendeeTotalPayable: 0,
      organizerNetShare: 0,
      currency,
    };
  }

  // 1. Calculate URPASS Platform Fee
  const calculatedPlatformFee = Number(
    ((safeBase * platformFeePercent) / 100 + platformFeeFixedINR).toFixed(2)
  );

  // 2. Calculate Gateway Processing Fee
  const calculatedGatewayFee = Number(
    ((safeBase * gatewayFeePercent) / 100 + gatewayFeeFixedINR).toFixed(2)
  );

  let attendeeTotalPayable = safeBase;
  let organizerNetShare = safeBase;

  switch (feeBearer) {
    case "ORGANIZER":
      // Model A — Organizer absorbs all processing & platform fees
      // Attendee pays exact base ticket price
      attendeeTotalPayable = safeBase;
      // Organizer net is reduced by both fees
      organizerNetShare = Number(
        Math.max(0, safeBase - calculatedPlatformFee - calculatedGatewayFee).toFixed(2)
      );
      break;

    case "ATTENDEE":
      // Model B — Attendee pays service/platform and processing fees
      // Customer pays base ticket + platform fee + gateway fee
      attendeeTotalPayable = Number(
        (safeBase + calculatedPlatformFee + calculatedGatewayFee).toFixed(2)
      );
      // Organizer receives 100% of their base ticket price
      organizerNetShare = safeBase;
      break;

    case "SPLIT":
      // Model C — Split fees: Attendee pays platform service fee, organizer absorbs gateway fee
      attendeeTotalPayable = Number((safeBase + calculatedPlatformFee).toFixed(2));
      organizerNetShare = Number(
        Math.max(0, safeBase - calculatedGatewayFee).toFixed(2)
      );
      break;
  }

  return {
    basePrice: safeBase,
    feeBearer,
    platformFee: calculatedPlatformFee,
    gatewayFee: calculatedGatewayFee,
    attendeeTotalPayable,
    organizerNetShare,
    currency,
  };
}

/**
 * Format currency for display (e.g. ₹1,000)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
