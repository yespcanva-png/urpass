export type VisitorSegment =
  | "college"
  | "corporate"
  | "ticketing"
  | "managed_service"
  | "general";

export type DeviceCategory = "mobile" | "tablet" | "desktop" | "unknown";

export type ConversionEventName =
  | "landing_page_view"
  | "primary_cta_click"
  | "secondary_cta_click"
  | "signup_started"
  | "signup_completed"
  | "signup_abandoned"
  | "first_event_created"
  | "first_event_draft_created"
  | "pricing_viewed"
  | "subscription_plan_selected"
  | "checkout_started"
  | "autopay_authorization_started"
  | "autopay_authorized"
  | "subscription_activated"
  | "checkout_failed"
  | "free_plan_activated"
  | "registration_setup_completed"
  | "first_event_published"
  | "managed_service_enquiry"
  | "subscription_started"
  | "experiment_exposed"
  | "recovery_modal_shown"
  | "recovery_cta_clicked"
  | "recovery_dismissed";

export interface VisitorAttribution {
  anonymousSessionId: string;
  userId?: string | null;
  visitorSegment: VisitorSegment;
  deviceCategory: DeviceCategory;
  firstTouchUrl?: string | null;
  firstTouchPageSlug?: string | null;
  firstTouchCluster?: string | null;
  firstTouchUtmSource?: string | null;
  firstTouchUtmMedium?: string | null;
  firstTouchUtmCampaign?: string | null;
  firstTouchUtmContent?: string | null;
  firstTouchReferrer?: string | null;
  firstTouchAt?: string | null;
  lastTouchUrl?: string | null;
  lastTouchPageSlug?: string | null;
  lastTouchCluster?: string | null;
  lastTouchUtmSource?: string | null;
  lastTouchUtmMedium?: string | null;
  lastTouchUtmCampaign?: string | null;
  lastTouchUtmContent?: string | null;
  lastTouchReferrer?: string | null;
  lastTouchAt?: string | null;
  ipCountry?: string | null;
}

export interface TrackConversionPayload {
  eventName: ConversionEventName;
  pageSlug: string;
  contentCluster?: string | null;
  visitorSegment?: VisitorSegment | null;
  ctaPosition?: string | null;
  experimentId?: string | null;
  variantId?: string | null;
  deviceCategory?: DeviceCategory;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
  landingUrl?: string | null;
  sessionId?: string | null;
  userId?: string | null;
  idempotencyKey?: string | null;
  metadata?: Record<string, unknown>;
}

export interface CTAConfig {
  id?: string;
  segment: VisitorSegment;
  primaryCtaLabel: string;
  primaryCtaSubtext?: string | null;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string | null;
  secondaryCtaSubtext?: string | null;
  secondaryCtaUrl?: string | null;
  badgeText?: string | null;
  headlineOverride?: string | null;
  isActive?: boolean;
}

export interface ConversionExperiment {
  id: string;
  experimentKey: string;
  name: string;
  description?: string | null;
  targetPageSlug?: string | null;
  targetSegment?: VisitorSegment | null;
  status: "draft" | "active" | "paused" | "completed" | "rolled_back";
  winningVariantId?: string | null;
  variants?: ExperimentVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentVariant {
  id: string;
  experimentId: string;
  variantKey: string;
  name: string;
  weight: number;
  payload: Record<string, unknown>;
  isControl: boolean;
  createdAt?: string;
}

export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  variantKey: string;
  payload: Record<string, unknown>;
  isControl: boolean;
}

export interface AgentRecommendation {
  id: string;
  title: string;
  summary: string;
  hypothesis: string;
  targetMetric: string;
  targetPageSlug?: string | null;
  targetSegment?: VisitorSegment | null;
  proposedChanges: Record<string, unknown>;
  status: "pending" | "approved" | "rejected" | "applied";
  priority: "low" | "medium" | "high" | "critical";
  approvedBy?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentLog {
  id: string;
  runType: "scheduled_daily" | "scheduled_weekly" | "manual_trigger" | "anomaly_alert";
  metricsAnalyzed: Record<string, unknown>;
  insights: Array<{
    type: "positive" | "warning" | "alert" | "info";
    title: string;
    description: string;
    metric?: string;
  }>;
  recommendationsCount: number;
  createdAt: string;
}

export interface AuditRecord {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  actorEmail?: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}
