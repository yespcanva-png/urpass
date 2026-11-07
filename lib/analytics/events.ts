/**
 * UrPass Unified Lifecycle & User Intelligence Events
 * Covers all 13 core events across GA4, PostHog, Microsoft Clarity, and Supabase.
 */

export type UrPassLifecycleEvent =
  | "landing_page_viewed"
  | "pricing_page_viewed"
  | "signup_started"
  | "signup_completed"
  | "onboarding_started"
  | "onboarding_completed"
  | "event_creation_started"
  | "event_created"
  | "subscription_selected"
  | "checkout_started"
  | "payment_succeeded"
  | "payment_failed"
  | "subscription_cancelled"
  | "diwali_welcome_shown"
  | "diwali_welcome_skipped"
  | "diwali_welcome_completed"
  | "diwali_sale_popup_shown"
  | "diwali_sale_popup_clicked"
  | "diwali_sale_popup_dismissed";

export interface LifecycleEventProperties {
  plan?: string;
  source?: string;
  referrer?: string;
  currency?: string;
  amount?: number;
  eventId?: string;
  eventName?: string;
  step?: string | number;
  userId?: string;
  visitorId?: string;
  path?: string;
  [key: string]: unknown;
}

export type UserFunnelStage = "Visiting" | "Signed up" | "Activated" | "Paying" | "Abandoned";

export interface UserIntelligenceRecord {
  userId: string;
  name: string;
  firstSource: string;
  lastSource: string;
  stage: UserFunnelStage;
  action: string;
  eventsCount?: number;
  signedUpAt?: string;
  lastSeenAt?: string;
}

