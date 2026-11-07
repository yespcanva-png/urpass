export type UserIntent =
  | "exploring"
  | "first_event"
  | "one_time_event"
  | "paid_ticketing"
  | "large_event"
  | "price_sensitive"
  | "returning_organizer";

export type OfferCategory = "value" | "product" | "promotional";

export type OfferTrigger =
  | "new_signup"
  | "draft_abandoned"
  | "plan_limit_approaching"
  | "checkout_abandoned"
  | "paid_feature_selected"
  | "event_completed"
  | "second_event_created"
  | "first_visit"
  | "pricing_browse"
  | "manual_preview";

export type InteractionType = "viewed" | "clicked" | "dismissed" | "accepted";

export type ConversionOutcome =
  | "event_created"
  | "event_published"
  | "paid_plan_purchased"
  | "event_pass_purchased"
  | "demo_booked"
  | "setup_claimed"
  | "draft_resumed";

export interface SmartOffer {
  id: string;
  category: OfferCategory;
  intent: UserIntent;
  title: string;
  headline: string;
  subtext: string;
  badge: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  discountPaise?: number;
  helperNote?: string;
  isActive?: boolean;
}

export interface DecisionContext {
  userId?: string | null;
  sessionId?: string | null;
  currentPlanSlug?: string;
  hasPublishedEvent?: boolean;
  draftEvent?: {
    id: string;
    name: string;
    hoursSinceCreation?: number;
    hoursSinceUpdate?: number;
  } | null;
  completedEventsCount?: number;
  totalEventsCount?: number;
  estimatedAttendees?: number;
  isMultiGate?: boolean;
  requiresPaidTicketing?: boolean;
  selectedFeatureKey?: string;
  pricingVisitsCount?: number;
  checkoutAbandoned?: boolean;
  usageRatio?: number; // 0.0 to 1.0 (e.g. 0.8 for 80% limit)
  isOneTimeEventIntent?: boolean;
  isRecurringIntent?: boolean;
  trigger?: OfferTrigger;
  forceIntent?: UserIntent;
  bypassControlGroup?: boolean;
}

export interface EvaluationResult {
  decisionId?: string;
  offer: SmartOffer;
  intent: UserIntent;
  trigger: OfferTrigger;
  reason: string;
  isControlGroup: boolean;
  eligibility: {
    planSlug: string;
    eventsCount: number;
    estimatedAttendees?: number;
    usageRatio?: number;
    pricingVisits: number;
    hasDraftAbandoned: boolean;
    hasCheckoutAbandoned: boolean;
    validPriceGuaranteed: boolean;
  };
}

export interface SimulationParameters {
  impressions: number;
  acceptanceRate: number; // e.g. 12 (for 12%)
  acceptedToPaidRate: number; // e.g. 20 (for 20%)
  avgOrderValueInr?: number; // default e.g. 749 (average between ₹299 pass and ₹999/mo Pro)
  controlBaselineRate?: number; // default e.g. 1.0% (expected baseline conversion without offer)
}

export interface SimulationResult {
  impressions: number;
  acceptanceRate: number;
  acceptedToPaidRate: number;
  acceptances: number;
  attributedPurchases: number;
  attributedRevenueInr: number;
  controlBaselinePurchases: number;
  incrementalPurchases: number;
  incrementalRevenueInr: number;
  incrementalLiftPct: number;
}

export interface SmartOfferStats {
  impressions: number;
  acceptances: number;
  conversions: number;
  revenueInr: number;
  acceptanceRate: number;
  paidRate: number;
  controlImpressions: number;
  controlConversions: number;
  incrementalConversions: number;
  incrementalLiftPct: number;
}
