"use server";

import { createClient } from "@/lib/supabase/server";
import {
  ConversionOutcome,
  DecisionContext,
  EvaluationResult,
  InteractionType,
  SimulationParameters,
  SimulationResult,
  SmartOfferStats,
} from "@/lib/smart-offers/types";
import {
  resolveAndPersistSmartOffer,
  recordInteraction,
  recordConversion,
  recordIntentSignals,
  getSmartOfferAnalytics,
} from "@/lib/smart-offers/server";
import { simulateSmartOffers } from "@/lib/smart-offers/simulator";

/**
 * Server Action: Evaluate smart offer for the active session / user.
 */
export async function getSmartOfferAction(
  clientContext: Partial<DecisionContext> = {}
): Promise<EvaluationResult> {
  let userId: string | null = null;
  let currentPlanSlug = clientContext.currentPlanSlug || "free";
  let totalEvents = clientContext.totalEventsCount || 0;
  let completedEvents = clientContext.completedEventsCount || 0;
  let draftEvent = clientContext.draftEvent || null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;

      // Lookup current plan and events if not already supplied
      const [{ data: subData }, { data: events }] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("plan:plans!subscriptions_plan_id_fkey(slug)")
          .eq("user_id", user.id)
          .in("status", ["active", "trialing"])
          .maybeSingle(),
        supabase
          .from("events")
          .select("id, name, status, created_at, updated_at, is_onboarding_draft")
          .eq("organizer_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (subData?.plan) {
        currentPlanSlug = (subData.plan as unknown as { slug: string }).slug || "free";
      }

      if (events) {
        totalEvents = events.length;
        completedEvents = events.filter((e) => e.status === "completed").length;
        const unfinished = events.find((e) => e.status === "draft");
        if (unfinished) {
          const hoursAgo =
            (Date.now() - new Date(unfinished.created_at).getTime()) / (1000 * 60 * 60);
          draftEvent = {
            id: unfinished.id,
            name: unfinished.name,
            hoursSinceCreation: Math.round(hoursAgo),
          };
        }
      }
    }
  } catch (err) {
    console.warn("[getSmartOfferAction] Could not fetch server auth state:", err);
  }

  const context: DecisionContext = {
    userId: userId || clientContext.userId,
    sessionId: clientContext.sessionId,
    currentPlanSlug,
    totalEventsCount: totalEvents,
    completedEventsCount: completedEvents,
    hasPublishedEvent: totalEvents > 0 && completedEvents > 0,
    draftEvent,
    estimatedAttendees: clientContext.estimatedAttendees,
    isMultiGate: clientContext.isMultiGate,
    requiresPaidTicketing: clientContext.requiresPaidTicketing,
    selectedFeatureKey: clientContext.selectedFeatureKey,
    pricingVisitsCount: clientContext.pricingVisitsCount,
    checkoutAbandoned: clientContext.checkoutAbandoned,
    usageRatio: clientContext.usageRatio,
    isOneTimeEventIntent: clientContext.isOneTimeEventIntent,
    isRecurringIntent: clientContext.isRecurringIntent,
    trigger: clientContext.trigger,
    forceIntent: clientContext.forceIntent,
    bypassControlGroup: clientContext.bypassControlGroup,
  };

  return await resolveAndPersistSmartOffer(context);
}

/**
 * Server Action: Track interaction on a smart offer.
 */
export async function trackSmartOfferInteractionAction(
  decisionId: string,
  action: InteractionType
): Promise<{ success: boolean }> {
  const success = await recordInteraction(decisionId, action);
  return { success };
}

/**
 * Server Action: Record downstream conversion attributed to a smart offer.
 */
export async function trackSmartOfferConversionAction(
  decisionId: string,
  outcome: ConversionOutcome,
  revenueInr = 0
): Promise<{ success: boolean }> {
  const success = await recordConversion(decisionId, outcome, revenueInr);
  return { success };
}

/**
 * Server Action: Record organizer intent signals.
 */
export async function trackIntentSignalAction(params: {
  sessionId?: string;
  eventType?: string;
  eventDate?: string;
  estimatedAttendees?: number;
  selectedFeatures?: string[];
  hasPaidTicketing?: boolean;
  incrementPricingVisits?: boolean;
  checkoutAbandoned?: boolean;
  draftAbandoned?: boolean;
  usageRatio?: number;
}): Promise<{ success: boolean }> {
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) userId = user.id;
  } catch {
    // anonymous visitor
  }

  const success = await recordIntentSignals({
    userId,
    ...params,
  });
  return { success };
}

/**
 * Server Action: Run impact simulation calculation.
 */
export async function runSmartOfferSimulationAction(
  params: SimulationParameters
): Promise<SimulationResult> {
  return simulateSmartOffers(params);
}

/**
 * Server Action: Get real aggregate analytics.
 */
export async function getSmartOfferAnalyticsAction(): Promise<SmartOfferStats> {
  return await getSmartOfferAnalytics();
}
