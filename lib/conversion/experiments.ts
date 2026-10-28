import {
  ConversionExperiment,
  ExperimentVariant,
  ExperimentAssignment,
} from "./types";
import { adminClient } from "@/lib/supabase/admin";

/**
 * Fast deterministic 32-bit FNV-1a hash function.
 */
function fnv1a(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

/**
 * Deterministically assigns a visitor session to an experiment variant.
 * Guaranteed to return the exact same variant for the same sessionId and experimentKey.
 */
export function assignVariantDeterministic(
  sessionId: string,
  experiment: {
    id: string;
    experimentKey: string;
    variants: ExperimentVariant[];
  }
): ExperimentAssignment {
  const variants = experiment.variants || [];
  const controlVariant = variants.find((v) => v.isControl) || variants[0];

  if (!variants || variants.length === 0) {
    return {
      experimentId: experiment.id,
      variantId: "control",
      variantKey: "control",
      payload: {},
      isControl: true,
    };
  }

  if (variants.length === 1) {
    return {
      experimentId: experiment.id,
      variantId: controlVariant.id,
      variantKey: controlVariant.variantKey,
      payload: controlVariant.payload,
      isControl: true,
    };
  }

  // Hash sessionId + experimentKey into 0..99 bucket
  const hashVal = fnv1a(`${sessionId}:${experiment.experimentKey}`);
  const bucket = hashVal % 100;

  // Cumulative distribution based on variant weights
  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) {
      return {
        experimentId: experiment.id,
        variantId: variant.id,
        variantKey: variant.variantKey,
        payload: variant.payload,
        isControl: variant.isControl,
      };
    }
  }

  return {
    experimentId: experiment.id,
    variantId: controlVariant.id,
    variantKey: controlVariant.variantKey,
    payload: controlVariant.payload,
    isControl: controlVariant.isControl,
  };
}

export interface StatisticalAnalysisResult {
  hasSufficientData: boolean;
  sampleSizeControl: number;
  sampleSizeVariant: number;
  conversionsControl: number;
  conversionsVariant: number;
  crControl: number;
  crVariant: number;
  relativeLift: number;
  zScore: number;
  pValue: number;
  confidencePercent: number;
  isStatisticallySignificant: boolean;
  recommendation: "continue_testing" | "declare_winner" | "rollback" | "inconclusive";
}

/**
 * Standard Normal Cumulative Distribution Function approximation (Abramowitz & Stegun).
 */
function normCdf(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - p : p;
}

/**
 * Calculates two-proportion Z-test with minimum sample guardrails.
 */
export function calculateExperimentStatistics(
  visitorsA: number,
  conversionsA: number,
  visitorsB: number,
  conversionsB: number,
  minConversionsPerVariant = 25
): StatisticalAnalysisResult {
  const crA = visitorsA > 0 ? conversionsA / visitorsA : 0;
  const crB = visitorsB > 0 ? conversionsB / visitorsB : 0;
  const relativeLift = crA > 0 ? ((crB - crA) / crA) * 100 : 0;

  const totalConversions = conversionsA + conversionsB;
  const totalVisitors = visitorsA + visitorsB;

  const hasSufficientData =
    conversionsA >= minConversionsPerVariant &&
    conversionsB >= minConversionsPerVariant &&
    visitorsA >= 100 &&
    visitorsB >= 100;

  if (!hasSufficientData || totalVisitors === 0) {
    return {
      hasSufficientData: false,
      sampleSizeControl: visitorsA,
      sampleSizeVariant: visitorsB,
      conversionsControl: conversionsA,
      conversionsVariant: conversionsB,
      crControl: Number((crA * 100).toFixed(2)),
      crVariant: Number((crB * 100).toFixed(2)),
      relativeLift: Number(relativeLift.toFixed(2)),
      zScore: 0,
      pValue: 1,
      confidencePercent: 0,
      isStatisticallySignificant: false,
      recommendation: "continue_testing",
    };
  }

  // Pooled proportion
  const pPool = totalConversions / totalVisitors;
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / visitorsA + 1 / visitorsB));

  if (se === 0) {
    return {
      hasSufficientData: true,
      sampleSizeControl: visitorsA,
      sampleSizeVariant: visitorsB,
      conversionsControl: conversionsA,
      conversionsVariant: conversionsB,
      crControl: Number((crA * 100).toFixed(2)),
      crVariant: Number((crB * 100).toFixed(2)),
      relativeLift: 0,
      zScore: 0,
      pValue: 1,
      confidencePercent: 0,
      isStatisticallySignificant: false,
      recommendation: "inconclusive",
    };
  }

  const z = (crB - crA) / se;
  // Two-tailed p-value
  const pValue = 2 * (1 - normCdf(Math.abs(z)));
  const confidencePercent = Math.min(99.9, Math.max(0, (1 - pValue) * 100));
  const isSignificant = confidencePercent >= 95.0;

  let recommendation: "continue_testing" | "declare_winner" | "rollback" | "inconclusive" = "continue_testing";
  if (isSignificant) {
    recommendation = relativeLift > 0 ? "declare_winner" : "rollback";
  } else if (visitorsA >= 500 && visitorsB >= 500) {
    recommendation = "inconclusive";
  }

  return {
    hasSufficientData: true,
    sampleSizeControl: visitorsA,
    sampleSizeVariant: visitorsB,
    conversionsControl: conversionsA,
    conversionsVariant: conversionsB,
    crControl: Number((crA * 100).toFixed(2)),
    crVariant: Number((crB * 100).toFixed(2)),
    relativeLift: Number(relativeLift.toFixed(2)),
    zScore: Number(z.toFixed(3)),
    pValue: Number(pValue.toFixed(4)),
    confidencePercent: Number(confidencePercent.toFixed(1)),
    isStatisticallySignificant: isSignificant,
    recommendation,
  };
}

/**
 * Fetches all active experiments with their variants.
 */
export async function getActiveExperiments(): Promise<ConversionExperiment[]> {
  try {
    const admin = adminClient();
    const { data: experiments, error } = await admin
      .from("conversion_experiments")
      .select("*, variants:conversion_experiment_variants(*)")
      .eq("status", "active");

    if (error || !experiments) return [];

    return experiments.map((exp) => ({
      id: exp.id,
      experimentKey: exp.experiment_key,
      name: exp.name,
      description: exp.description,
      targetPageSlug: exp.target_page_slug,
      targetSegment: exp.target_segment,
      status: exp.status,
      winningVariantId: exp.winning_variant_id,
      variants: (exp.variants || []).map((v: any) => ({
        id: v.id,
        experimentId: v.experiment_id,
        variantKey: v.variant_key,
        name: v.name,
        weight: v.weight,
        payload: v.payload || {},
        isControl: v.is_control,
        createdAt: v.created_at,
      })),
      createdAt: exp.created_at,
      updatedAt: exp.updated_at,
    }));
  } catch {
    return [];
  }
}
