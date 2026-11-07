import {
  DecisionContext,
  EvaluationResult,
  OfferTrigger,
  SmartOffer,
  UserIntent,
} from "./types";
import { SMART_OFFERS_CATALOG, INTENT_TO_DEFAULT_OFFER } from "./catalog";

/**
 * Deterministic hash to assign ~10% of users to the no-offer control group.
 */
function isAssignedToControlGroup(identifier: string, controlRate = 0.1): boolean {
  if (!identifier) return false;
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash % 100) / 100;
  return normalized < controlRate;
}

/**
 * Validates plan entitlements and ensures no invalid downgrade or pricing contradictions.
 */
function isAlreadyEntitled(
  currentPlanSlug: string | undefined,
  targetFeatureOrIntent: string
): boolean {
  if (!currentPlanSlug) return false;
  const p = currentPlanSlug.toLowerCase();
  const highTierPlans = ["pro", "business", "founder", "lifetime", "enterprise", "managed_enterprise"];

  if (targetFeatureOrIntent === "single_event_pass" && highTierPlans.includes(p)) {
    // Pro/Business accounts already have unlimited/10 events and pro features, no need for ₹299 pass.
    return true;
  }
  if (targetFeatureOrIntent === "starter" && highTierPlans.includes(p)) {
    return true;
  }
  return false;
}

/**
 * UrPass Smart Offer Engine - Rules-Based Decision Resolver.
 * Follows exact priority logic with zero paid AI APIs.
 */
export function evaluateSmartOfferRules(context: DecisionContext): EvaluationResult {
  const plan = (context.currentPlanSlug || "free").toLowerCase();
  const pricingVisits = context.pricingVisitsCount || 0;
  const draft = context.draftEvent;
  const totalEvents = context.totalEventsCount || 0;
  const completedEvents = context.completedEventsCount || 0;
  const attendees = context.estimatedAttendees || 0;
  const usage = context.usageRatio || 0;
  const identifier = context.userId || context.sessionId || "anonymous";

  // Check if forceIntent was provided (e.g. preview, simulator, or explicit override)
  if (context.forceIntent) {
    const offer = INTENT_TO_DEFAULT_OFFER[context.forceIntent] || SMART_OFFERS_CATALOG.free_event_creation;
    return {
      offer,
      intent: context.forceIntent,
      trigger: context.trigger || "manual_preview",
      reason: `Manually previewed intent: ${context.forceIntent}`,
      isControlGroup: false,
      eligibility: {
        planSlug: plan,
        eventsCount: totalEvents,
        estimatedAttendees: attendees,
        usageRatio: usage,
        pricingVisits,
        hasDraftAbandoned: Boolean(draft),
        hasCheckoutAbandoned: Boolean(context.checkoutAbandoned),
        validPriceGuaranteed: true,
      },
    };
  }

  let selectedOffer: SmartOffer;
  let resolvedIntent: UserIntent;
  let resolvedTrigger: OfferTrigger = context.trigger || "first_visit";
  let reason: string;

  // PRIORITY RULE 1: Event setup is incomplete or draft abandoned (> 24 hours or incomplete onboarding)
  if (draft && (draft.hoursSinceCreation && draft.hoursSinceCreation >= 24)) {
    resolvedIntent = "first_event";
    resolvedTrigger = "draft_abandoned";
    reason = `Event draft "${draft.name}" was abandoned over 24 hours ago. Offering free guided setup to unblock publishing.`;
    selectedOffer = SMART_OFFERS_CATALOG.free_guided_setup;
  }
  // PRIORITY RULE 1b: Checkout abandoned within 1 to 24 hours
  else if (context.checkoutAbandoned) {
    resolvedIntent = "price_sensitive";
    resolvedTrigger = "checkout_abandoned";
    reason = "Checkout was initiated but not completed. Offering direct assistance and free plan reassurance.";
    selectedOffer = SMART_OFFERS_CATALOG.price_sensitive_help;
  }
  // PRIORITY RULE 2: Plan limit approaching (>= 80% of monthly registrations or event limit)
  else if (usage >= 0.8 && plan === "free") {
    resolvedIntent = "paid_ticketing";
    resolvedTrigger = "plan_limit_approaching";
    reason = `User is at ${Math.round(usage * 100)}% of plan registration limit. Recommending Starter or Pro upgrade.`;
    selectedOffer = SMART_OFFERS_CATALOG.paid_plan_comparison;
  }
  // PRIORITY RULE 3: Large event needs assistance (attendees >= 500 or multi-gate access)
  else if (attendees >= 500 || context.isMultiGate) {
    resolvedIntent = "large_event";
    resolvedTrigger = context.trigger || "paid_feature_selected";
    reason = `Large scale detected (${attendees} expected attendees / multi-gate). Offering engineering architecture demo.`;
    selectedOffer = SMART_OFFERS_CATALOG.business_demo_support;
  }
  // PRIORITY RULE 4: User needs paid feature or configuring paid ticket tiers
  else if (context.requiresPaidTicketing || context.selectedFeatureKey) {
    if (context.isOneTimeEventIntent && !isAlreadyEntitled(plan, "single_event_pass")) {
      resolvedIntent = "one_time_event";
      resolvedTrigger = "paid_feature_selected";
      reason = "Paid feature needed for a single event. Recommending ₹299 Single-Event Pass with zero recurring subscription.";
      selectedOffer = SMART_OFFERS_CATALOG.single_event_pass;
    } else {
      resolvedIntent = "paid_ticketing";
      resolvedTrigger = "paid_feature_selected";
      reason = "User configuring paid tickets or advanced feature. Recommending 0% commission Starter/Pro plan.";
      selectedOffer = SMART_OFFERS_CATALOG.paid_plan_comparison;
    }
  }
  // PRIORITY RULE 5: Returning organiser with completed event(s)
  else if (completedEvents >= 1) {
    resolvedIntent = "returning_organizer";
    resolvedTrigger = "event_completed";
    reason = `Organiser has successfully completed ${completedEvents} event(s). Providing 1-click duplicate shortcut and recurring tier comparison.`;
    selectedOffer = SMART_OFFERS_CATALOG.repeat_event_shortcut;
  }
  // PRIORITY RULE 6: User organising recurring events (creating second event or expressed recurring need)
  else if (totalEvents >= 2 || context.isRecurringIntent) {
    resolvedIntent = "returning_organizer";
    resolvedTrigger = "second_event_created";
    reason = "User is organizing multiple recurring events. Comparing monthly/annual recurring subscription options.";
    selectedOffer = SMART_OFFERS_CATALOG.paid_plan_comparison;
  }
  // PRIORITY RULE 7: One-time event fits requirements (1 upcoming event, limited requirements)
  else if (context.isOneTimeEventIntent && !isAlreadyEntitled(plan, "single_event_pass")) {
    resolvedIntent = "one_time_event";
    resolvedTrigger = "first_visit";
    reason = "Organiser indicated single upcoming event. Suggesting one-time ₹299 Event Pass instead of recurring plan.";
    selectedOffer = SMART_OFFERS_CATALOG.single_event_pass;
  }
  // PRIORITY RULE 8: Price-sensitive (repeated pricing page visits >= 3)
  else if (pricingVisits >= 3) {
    resolvedIntent = "price_sensitive";
    resolvedTrigger = "pricing_browse";
    reason = `User visited pricing ${pricingVisits} times. Offering direct event guidance and clarifying Free Forever tier (no forced discounts).`;
    selectedOffer = SMART_OFFERS_CATALOG.price_sensitive_help;
  }
  // PRIORITY RULE 9: First time organiser (account created, 0 published events)
  else if (context.userId && (!context.hasPublishedEvent || totalEvents === 0)) {
    resolvedIntent = "first_event";
    resolvedTrigger = "new_signup";
    reason = "New signup with no published events. Offering free guided setup and onboarding assistance.";
    selectedOffer = SMART_OFFERS_CATALOG.free_guided_setup;
  }
  // PRIORITY RULE 10 (Default fallback): Exploring UrPass
  else {
    resolvedIntent = "exploring";
    resolvedTrigger = "first_visit";
    reason = "Visitor exploring UrPass. Recommending zero-risk free event creation.";
    selectedOffer = SMART_OFFERS_CATALOG.free_event_creation;
  }

  // Double check entitlement to guarantee no invalid offers or pricing promises
  if (isAlreadyEntitled(plan, selectedOffer.id)) {
    selectedOffer = SMART_OFFERS_CATALOG.repeat_event_shortcut;
    reason += " (Adjusted because user already owns higher subscription tier).";
  }

  // Determine control group assignment (10% holdout for lift measurement)
  const isControlGroup = context.bypassControlGroup ? false : isAssignedToControlGroup(identifier, 0.1);

  return {
    offer: selectedOffer,
    intent: resolvedIntent,
    trigger: resolvedTrigger,
    reason,
    isControlGroup,
    eligibility: {
      planSlug: plan,
      eventsCount: totalEvents,
      estimatedAttendees: attendees,
      usageRatio: usage,
      pricingVisits,
      hasDraftAbandoned: Boolean(draft),
      hasCheckoutAbandoned: Boolean(context.checkoutAbandoned),
      validPriceGuaranteed: true,
    },
  };
}
