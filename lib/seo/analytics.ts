/**
 * First-Party & GA4 Marketing Conversion Analytics
 * Handles client-side tracking and server-side conversion recording.
 */

export interface TrackingContext {
  pageSlug: string;
  contentCluster?: string;
  ctaPosition?: "hero" | "mid" | "footer" | "sticky";
  serviceModel?: "self_service" | "managed_service" | "hybrid";
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  referrer?: string;
}

export type AnalyticsEventName =
  | "seo_landing_view"
  | "self_service_cta_click"
  | "managed_service_cta_click"
  | "self_service_signup_completed"
  | "self_service_event_created"
  | "self_service_event_published"
  | "subscription_checkout_started"
  | "subscription_payment_confirmed"
  | "managed_service_form_started"
  | "managed_service_form_submitted"
  | "managed_service_qualified"
  | "managed_service_quote_sent"
  | "managed_service_quote_accepted"
  | "managed_service_payment_confirmed";

const recordedEvents = new Set<string>();

/**
 * Extracts UTM parameters and referrer from browser URL safely.
 */
export function getClientTrackingContext(pageSlug: string, contentCluster?: string): TrackingContext {
  if (typeof window === "undefined") {
    return { pageSlug, contentCluster };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    pageSlug,
    contentCluster,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmContent: params.get("utm_content") || undefined,
    referrer: document.referrer ? new URL(document.referrer, window.location.origin).hostname : undefined,
  };
}

/**
 * Dispatches an analytics event to GA4 dataLayer and records first-party conversion.
 */
export function trackConversion(eventName: AnalyticsEventName, ctx: TrackingContext) {
  if (typeof window === "undefined") return;

  // Deduplicate rapid duplicate clicks (e.g. double-clicks)
  const dedupKey = `${eventName}:${ctx.pageSlug}:${ctx.ctaPosition || "default"}`;
  const now = Date.now();
  if (recordedEvents.has(dedupKey)) {
    return;
  }
  recordedEvents.add(dedupKey);
  setTimeout(() => recordedEvents.delete(dedupKey), 5000);

  // 1. GA4 dataLayer push (non-sensitive parameters only)
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") {
      gtag("event", eventName, {
        page_slug: ctx.pageSlug,
        content_cluster: ctx.contentCluster || "general",
        cta_position: ctx.ctaPosition || "default",
        service_model: ctx.serviceModel || "unknown",
        utm_source: ctx.utmSource,
        utm_medium: ctx.utmMedium,
        utm_campaign: ctx.utmCampaign,
      });
    }
  } catch (err) {
    console.debug("[analytics] GA4 dispatch suppressed:", err);
  }

  // 2. Dispatches custom browser event for reactive UI
  try {
    window.dispatchEvent(
      new CustomEvent("urpass:conversion", {
        detail: { eventName, context: ctx, timestamp: now },
      })
    );
  } catch {
    // Suppress custom event errors
  }

  // 3. First-party database recording via lightweight beacon
  try {
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({
        eventName,
        ...ctx,
      });
      navigator.sendBeacon("/api/analytics/conversion", payload);
    }
  } catch {
    // Non-blocking fallback
  }
}
