export type BillingLifecycleState =
  | "pending"
  | "trialing"
  | "active"
  | "past_due"
  | "grace"
  | "ending"
  | "expired"
  | "cancelled"
  | "suspended";

export type BillingCycle = "monthly" | "annual" | "lifetime";

export type CurrencyCode = "INR" | "GBP";

export type PlanSlug = "starter" | "pro" | "business" | "campus" | "founder" | "free" | "managed_enterprise";

export interface BillingPlan {
  id: string;
  slug: PlanSlug;
  name: string;
  description: string | null;
  tierRank: number;
  isActive: boolean;
  isPublic: boolean;
  metadata?: Record<string, unknown>;
}

export interface BillingPlanPrice {
  id: string;
  planId: string;
  planSlug: PlanSlug;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  pricePaise: number;
  taxInclusive: boolean;
  taxRatePercent: number;
  isActive: boolean;
  version: number;
}

export interface BillingOffer {
  id: string;
  code: string;
  name: string;
  offerType: "introductory_monthly" | "fixed_discount" | "percent_discount";
  introPricePaise: number;
  cyclesCount: number;
  applicablePlans: string[];
  applicableCycles: string[];
  eligibilityRule: "new_users_only" | "legacy_free" | "all";
  isActive: boolean;
}

export interface OrganizationSubscription {
  id: string;
  organizationId: string;
  planId: string;
  planSlug: PlanSlug;
  planName: string;
  planPriceId?: string | null;
  lifecycleState: BillingLifecycleState;
  billingCycle: BillingCycle;
  currency: CurrencyCode;
  isTrial: boolean;
  trialEndsAt?: string | null;
  legacyFreeExpiresAt?: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  gracePeriodEndsAt?: string | null;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string | null;
  
  // Offer tracking
  activeOfferId?: string | null;
  introOfferCyclesCompleted: number;
  introOfferEligible: boolean;
  
  // Gateway & Mandate
  provider: "razorpay" | "uk_direct" | "manual" | "free";
  providerSubscriptionId?: string | null;
  autopayStatus: "none" | "active" | "pending" | "failing" | "cancelled";
  autopayMandateId?: string | null;
  
  // Lifetime Continuity
  hasLifetimeAccess: boolean;
  lifetimePlanSlug?: string | null;
}

export interface EligibilityResult {
  isEligibleForIntroOffer: boolean;
  reason?: string;
  introOffer?: {
    code: string;
    introPricePaise: number;
    cyclesCount: number;
    currency: CurrencyCode;
  } | null;
  legacyFreeStatus?: {
    isLegacyFree: boolean;
    expiresAt: string;
    isExpired: boolean;
    daysRemaining: number;
  } | null;
  existingTrialStatus?: {
    isTrial: boolean;
    expiresAt: string;
    isExpired: boolean;
    daysRemaining: number;
  } | null;
}

export type EntitlementKey =
  | "csv_import"
  | "csv_export"
  | "email_notifications_full"
  | "custom_fields_unlimited"
  | "custom_pass_design"
  | "remove_branding"
  | "team_permissions_basic"
  | "team_permissions_advanced"
  | "custom_domain"
  | "api_access"
  | "webhooks"
  | "priority_support"
  | "advanced_analytics"
  | "standard_analytics"
  | "cross_event_analytics"
  | "paid_events";

export type QuotaResourceKey =
  | "events_per_month"
  | "registrations_per_month"
  | "organizer_seats";
