import { SimulationParameters, SimulationResult } from "./types";

/**
 * Mathematical model for the UrPass Smart Offer Impact Simulator.
 * Demonstrates attribution vs genuine incremental revenue against a holdout control group.
 */
export function simulateSmartOffers(params: SimulationParameters): SimulationResult {
  const impressions = Math.max(0, Math.floor(params.impressions || 0));
  const acceptanceRate = Math.min(100, Math.max(0, params.acceptanceRate || 0));
  const acceptedToPaidRate = Math.min(100, Math.max(0, params.acceptedToPaidRate || 0));
  const avgOrderValueInr = Math.max(0, params.avgOrderValueInr ?? 749);
  const controlBaselineRate = Math.max(0, params.controlBaselineRate ?? 1.0); // 1.0% organic baseline

  // Attributed metrics
  const acceptances = Math.round(impressions * (acceptanceRate / 100));
  const attributedPurchases = Math.round(acceptances * (acceptedToPaidRate / 100));
  const attributedRevenueInr = attributedPurchases * avgOrderValueInr;

  // Control group holdout baseline (what would have converted anyway without an offer)
  const controlBaselinePurchases = Math.round(impressions * (controlBaselineRate / 100));

  // True incremental lift
  const incrementalPurchases = Math.max(0, attributedPurchases - controlBaselinePurchases);
  const incrementalRevenueInr = incrementalPurchases * avgOrderValueInr;
  const incrementalLiftPct =
    controlBaselinePurchases > 0
      ? Math.round(((attributedPurchases - controlBaselinePurchases) / controlBaselinePurchases) * 100)
      : 100;

  return {
    impressions,
    acceptanceRate,
    acceptedToPaidRate,
    acceptances,
    attributedPurchases,
    attributedRevenueInr,
    controlBaselinePurchases,
    incrementalPurchases,
    incrementalRevenueInr,
    incrementalLiftPct,
  };
}
