"use client";

import type { UrPassLifecycleEvent, LifecycleEventProperties } from "./events";

// Extend global window interface for analytics SDKs
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
      identify: (distinctId: string, userProperties?: Record<string, unknown>) => void;
      opt_in_capturing?: () => void;
      opt_out_capturing?: () => void;
    };
  }
}

/**
 * Centrally track a lifecycle event across GA4, PostHog, Microsoft Clarity,
 * and UrPass Supabase internal tracking.
 */
export function trackLifecycleEvent(
  eventName: UrPassLifecycleEvent,
  properties?: LifecycleEventProperties
): void {
  if (typeof window === "undefined") return;

  // 1. Check user consent / DNT
  const blocked =
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

  if (blocked) return;

  const eventPayload = {
    ...properties,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  // 2. Google Analytics 4
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventPayload);
    }
  } catch (err) {
    console.debug("[analytics/ga4] tracking skipped:", err);
  }

  // 3. PostHog
  try {
    if (window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(eventName, eventPayload);
    }
  } catch (err) {
    console.debug("[analytics/posthog] tracking skipped:", err);
  }

  // 4. Microsoft Clarity
  try {
    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
      if (properties?.plan) {
        window.clarity("set", "plan", String(properties.plan));
      }
    }
  } catch (err) {
    console.debug("[analytics/clarity] tracking skipped:", err);
  }

  // 5. Internal Supabase Telemetry (non-blocking beacon)
  try {
    const isConsentGiven =
      localStorage.getItem("urpass_cookie_consent") === "all";

    if (isConsentGiven) {
      void fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        keepalive: true,
        body: JSON.stringify({
          eventName,
          properties: eventPayload,
        }),
      }).catch(() => {
        // Non-blocking
      });
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Link an anonymous visitor to their confirmed organizer account across all analytics platforms.
 */
export function identifyUser(
  userId: string,
  traits?: {
    email?: string;
    name?: string;
    role?: string;
    source?: string;
  }
): void {
  if (typeof window === "undefined" || !userId) return;

  // PostHog Identify
  try {
    if (window.posthog && typeof window.posthog.identify === "function") {
      window.posthog.identify(userId, traits);
    }
  } catch {
    // ignore
  }

  // Clarity Identify
  try {
    if (typeof window.clarity === "function") {
      window.clarity("identify", userId);
    }
  } catch {
    // ignore
  }

  // GA4 User ID
  try {
    if (typeof window.gtag === "function") {
      window.gtag("set", "user_id", userId);
    }
  } catch {
    // ignore
  }
}

