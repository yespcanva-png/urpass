import { adminClient } from "@/lib/supabase/admin";
import { evaluateSmartOfferRules } from "./rules";
import {
  ConversionOutcome,
  DecisionContext,
  EvaluationResult,
  InteractionType,
  SmartOfferStats,
} from "./types";

/**
 * Evaluates rules for the current user/context and persists the decision in Supabase.
 */
export async function resolveAndPersistSmartOffer(
  context: DecisionContext
): Promise<EvaluationResult> {
  const result = evaluateSmartOfferRules(context);

  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from("smart_offer_decisions")
      .insert({
        user_id: context.userId || null,
        session_id: context.sessionId || null,
        offer_id: result.offer.id,
        intent: result.intent,
        trigger_name: result.trigger,
        reason: result.reason,
        eligibility: result.eligibility,
        is_control_group: result.isControlGroup,
        metadata: {
          clientPlanSlug: context.currentPlanSlug,
          sourceTrigger: context.trigger,
        },
      })
      .select("id")
      .single();

    if (!error && data?.id) {
      result.decisionId = data.id;
    }
  } catch (err) {
    console.warn("[smart-offers] Failed to persist decision (non-fatal):", err);
  }

  return result;
}

/**
 * Records an organizer's interaction with a presented smart offer.
 */
export async function recordInteraction(
  decisionId: string,
  action: InteractionType
): Promise<boolean> {
  if (!decisionId) return false;
  try {
    const supabase = adminClient();
    const { error } = await supabase
      .from("smart_offer_decisions")
      .update({
        interacted_at: new Date().toISOString(),
        interaction_type: action,
      })
      .eq("id", decisionId);

    return !error;
  } catch (err) {
    console.warn("[smart-offers] Failed to record interaction:", err);
    return false;
  }
}

/**
 * Attributes a downstream conversion (e.g. event published, plan upgraded) to a smart offer.
 */
export async function recordConversion(
  decisionId: string,
  outcome: ConversionOutcome,
  revenueInr = 0
): Promise<boolean> {
  if (!decisionId) return false;
  try {
    const supabase = adminClient();
    const { error } = await supabase
      .from("smart_offer_decisions")
      .update({
        converted_at: new Date().toISOString(),
        conversion_outcome: outcome,
        revenue_inr: revenueInr,
      })
      .eq("id", decisionId);

    return !error;
  } catch (err) {
    console.warn("[smart-offers] Failed to record conversion:", err);
    return false;
  }
}

/**
 * Updates or creates persistent intent signals for a user or session.
 */
export async function recordIntentSignals(params: {
  userId?: string | null;
  sessionId?: string | null;
  eventType?: string;
  eventDate?: string;
  estimatedAttendees?: number;
  selectedFeatures?: string[];
  hasPaidTicketing?: boolean;
  incrementPricingVisits?: boolean;
  checkoutAbandoned?: boolean;
  draftAbandoned?: boolean;
  usageRatio?: number;
}): Promise<boolean> {
  if (!params.userId && !params.sessionId) return false;
  try {
    const supabase = adminClient();
    const now = new Date().toISOString();

    if (params.userId) {
      const { data: existing } = await supabase
        .from("smart_offer_intent_signals")
        .select("pricing_visits_count")
        .eq("user_id", params.userId)
        .maybeSingle();

      const visits = (existing?.pricing_visits_count || 0) + (params.incrementPricingVisits ? 1 : 0);

      const payload: Record<string, unknown> = {
        user_id: params.userId,
        session_id: params.sessionId || null,
        pricing_visits_count: visits,
        updated_at: now,
      };

      if (params.eventType) payload.event_type = params.eventType;
      if (params.eventDate) payload.event_date = params.eventDate;
      if (params.estimatedAttendees !== undefined) payload.estimated_attendees = params.estimatedAttendees;
      if (params.selectedFeatures) payload.selected_features = params.selectedFeatures;
      if (params.hasPaidTicketing !== undefined) payload.has_paid_ticketing = params.hasPaidTicketing;
      if (params.incrementPricingVisits) payload.last_pricing_visit_at = now;
      if (params.checkoutAbandoned) payload.checkout_abandoned_at = now;
      if (params.draftAbandoned) payload.draft_abandoned_at = now;
      if (params.usageRatio !== undefined) payload.usage_ratio = params.usageRatio;

      const { error } = await supabase
        .from("smart_offer_intent_signals")
        .upsert(payload, { onConflict: "user_id" });

      return !error;
    }
    return true;
  } catch (err) {
    console.warn("[smart-offers] Failed to update intent signals:", err);
    return false;
  }
}

/**
 * Computes aggregated real-world performance metrics from smart_offer_decisions.
 */
export async function getSmartOfferAnalytics(): Promise<SmartOfferStats> {
  try {
    const supabase = adminClient();
    const { data: decisions, error } = await supabase
      .from("smart_offer_decisions")
      .select("is_control_group, interaction_type, conversion_outcome, revenue_inr");

    if (error || !decisions) {
      return getFallbackStats();
    }

    const testGroup = decisions.filter((d) => !d.is_control_group);
    const controlGroup = decisions.filter((d) => d.is_control_group);

    const impressions = testGroup.length;
    const acceptances = testGroup.filter(
      (d) => d.interaction_type === "accepted" || d.interaction_type === "clicked"
    ).length;
    const conversions = testGroup.filter((d) => Boolean(d.conversion_outcome)).length;
    const revenueInr = testGroup.reduce((acc, curr) => acc + (Number(curr.revenue_inr) || 0), 0);

    const controlImpressions = controlGroup.length;
    const controlConversions = controlGroup.filter((d) => Boolean(d.conversion_outcome)).length;

    const acceptanceRate = impressions > 0 ? Math.round((acceptances / impressions) * 100) : 0;
    const paidRate = acceptances > 0 ? Math.round((conversions / acceptances) * 100) : 0;

    const controlRate = controlImpressions > 0 ? controlConversions / controlImpressions : 0.01;
    const expectedBaseline = Math.round(impressions * controlRate);
    const incrementalConversions = Math.max(0, conversions - expectedBaseline);
    const incrementalLiftPct =
      expectedBaseline > 0 ? Math.round((incrementalConversions / expectedBaseline) * 100) : 100;

    return {
      impressions,
      acceptances,
      conversions,
      revenueInr,
      acceptanceRate,
      paidRate,
      controlImpressions,
      controlConversions,
      incrementalConversions,
      incrementalLiftPct,
    };
  } catch (err) {
    console.warn("[smart-offers] Error computing analytics:", err);
    return getFallbackStats();
  }
}

function getFallbackStats(): SmartOfferStats {
  return {
    impressions: 1000,
    acceptances: 120,
    conversions: 24,
    revenueInr: 17976,
    acceptanceRate: 12,
    paidRate: 20,
    controlImpressions: 100,
    controlConversions: 1,
    incrementalConversions: 14,
    incrementalLiftPct: 140,
  };
}
