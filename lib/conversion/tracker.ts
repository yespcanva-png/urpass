import {
  ConversionEventName,
  TrackConversionPayload,
  VisitorSegment,
  DeviceCategory,
} from "./types";
import {
  getOrCreateClientSessionId,
  extractClientAttribution,
  detectVisitorSegment,
  detectDeviceCategory,
} from "./attribution";

const dispatchedEvents = new Set<string>();

/**
 * Maps first-party event names to GA4 recommended event names.
 */
function mapToGA4Event(eventName: ConversionEventName): string {
  switch (eventName) {
    case "landing_page_view":
      return "page_view";
    case "primary_cta_click":
    case "secondary_cta_click":
      return "select_content";
    case "signup_started":
      return "begin_registration";
    case "signup_completed":
      return "sign_up";
    case "managed_service_enquiry":
      return "generate_lead";
    case "pricing_viewed":
      return "view_item_list";
    case "subscription_plan_selected":
      return "select_item";
    case "checkout_started":
      return "begin_checkout";
    case "autopay_authorized":
      return "add_payment_info";
    case "subscription_activated":
      return "purchase";
    case "first_event_created":
      return "create_event";
    case "first_event_published":
      return "publish_event";
    case "experiment_exposed":
      return "view_promotion";
    case "recovery_modal_shown":
      return "view_assistance";
    default:
      return eventName;
  }
}

/**
 * Checks if user has granted analytical cookie consent.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const consent = localStorage.getItem("urpass_cookie_consent");
    return consent === "all";
  } catch {
    return false;
  }
}

/**
 * Dispatches an event to GA4 dataLayer if consent was granted.
 */
function sendToGA4(eventName: ConversionEventName, payload: TrackConversionPayload) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === "function") {
      const ga4Name = mapToGA4Event(eventName);
      gtag("event", ga4Name, {
        event_category: "Conversion",
        page_slug: payload.pageSlug,
        visitor_segment: payload.visitorSegment,
        cta_position: payload.ctaPosition,
        experiment_id: payload.experimentId,
        variant_id: payload.variantId,
        utm_source: payload.utmSource,
        utm_medium: payload.utmMedium,
        utm_campaign: payload.utmCampaign,
        ...payload.metadata,
      });
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Client-side conversion tracker.
 * 1. Checks deduplication
 * 2. Emits GA4 event if consented
 * 3. Dispatches DOM custom event for UI reactivity
 * 4. Transmits event via beacon or fetch to /api/conversion/track
 */
export function trackConversionEvent(
  eventName: ConversionEventName,
  options: {
    pageSlug: string;
    contentCluster?: string;
    visitorSegment?: VisitorSegment;
    ctaPosition?: string;
    experimentId?: string;
    variantId?: string;
    metadata?: Record<string, unknown>;
    idempotencyKey?: string;
  }
) {
  if (typeof window === "undefined") return;

  const sessionId = getOrCreateClientSessionId();
  const dedupKey = options.idempotencyKey || `${eventName}:${options.pageSlug}:${options.ctaPosition || "default"}`;
  
  // Suppress duplicate triggers within 3 seconds (e.g. fast double-clicks)
  if (dispatchedEvents.has(dedupKey)) {
    return;
  }
  dispatchedEvents.add(dedupKey);
  setTimeout(() => dispatchedEvents.delete(dedupKey), 3000);

  const clientAttr = extractClientAttribution(options.pageSlug, options.contentCluster);
  const segment = options.visitorSegment || clientAttr.visitorSegment || detectVisitorSegment(options.pageSlug);
  const device = clientAttr.deviceCategory || detectDeviceCategory(navigator.userAgent);

  const payload: TrackConversionPayload = {
    eventName,
    sessionId,
    pageSlug: options.pageSlug,
    contentCluster: options.contentCluster || null,
    visitorSegment: segment,
    ctaPosition: options.ctaPosition || null,
    experimentId: options.experimentId || null,
    variantId: options.variantId || null,
    deviceCategory: device,
    utmSource: clientAttr.lastTouchUtmSource || null,
    utmMedium: clientAttr.lastTouchUtmMedium || null,
    utmCampaign: clientAttr.lastTouchUtmCampaign || null,
    utmContent: clientAttr.lastTouchUtmContent || null,
    referrer: clientAttr.lastTouchReferrer || null,
    landingUrl: clientAttr.lastTouchUrl || null,
    idempotencyKey: options.idempotencyKey || `${sessionId}:${eventName}:${options.pageSlug}:${Math.floor(Date.now() / 60000)}`,
    metadata: options.metadata || {},
  };

  // 1. GA4
  sendToGA4(eventName, payload);

  // 2. Browser Event
  try {
    window.dispatchEvent(
      new CustomEvent("urpass:conversion", {
        detail: payload,
      })
    );
  } catch {}

  // 3. First-party database persistence via Beacon or Fetch
  const body = JSON.stringify(payload);
  const endpoint = "/api/conversion/track";

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (!sent) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Non-blocking fallback
  }
}
