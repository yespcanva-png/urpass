import { VisitorSegment, DeviceCategory, VisitorAttribution } from "./types";

export const ANON_SESSION_COOKIE = "urpass_anon_session";
export const ATTRIBUTION_STORAGE_KEY = "urpass_attribution_v1";

/**
 * Deterministically resolves the visitor segment from pathname or explicit parameter.
 */
export function detectVisitorSegment(
  pathname: string,
  explicitSegment?: string | null
): VisitorSegment {
  if (explicitSegment) {
    const clean = explicitSegment.toLowerCase().trim();
    if (
      clean === "college" ||
      clean === "corporate" ||
      clean === "ticketing" ||
      clean === "managed_service" ||
      clean === "general"
    ) {
      return clean as VisitorSegment;
    }
    if (clean === "campus" || clean === "university") return "college";
    if (clean === "enterprise" || clean === "business") return "corporate";
    if (clean === "tickets" || clean === "pricing") return "ticketing";
    if (clean === "managed" || clean === "service") return "managed_service";
  }

  const p = pathname.toLowerCase();
  if (
    p.includes("college") ||
    p.includes("campus") ||
    p.includes("university") ||
    p.includes("hackathon") ||
    p.includes("freshers") ||
    p.includes("student")
  ) {
    return "college";
  }

  if (
    p.includes("corporate") ||
    p.includes("conference") ||
    p.includes("summit") ||
    p.includes("b2b") ||
    p.includes("trade-show") ||
    p.includes("business") ||
    p.includes("employee") ||
    p.includes("enterprise")
  ) {
    return "corporate";
  }

  if (
    p.includes("ticket") ||
    p.includes("pass") ||
    p.includes("pricing") ||
    p.includes("upi") ||
    p.includes("razorpay") ||
    p.includes("zero-commission") ||
    p.includes("fee-calculator")
  ) {
    return "ticketing";
  }

  if (
    p.includes("managed") ||
    p.includes("service") ||
    p.includes("request-event-setup")
  ) {
    return "managed_service";
  }

  return "general";
}

/**
 * Detects device category safely from User-Agent string.
 */
export function detectDeviceCategory(userAgent?: string | null): DeviceCategory {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Generates a crypto-random v4 UUID string.
 */
export function generateSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "sess_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

/**
 * Client-side: gets or establishes the persistent anonymous session ID.
 */
export function getOrCreateClientSessionId(): string {
  if (typeof window === "undefined") {
    return generateSessionId();
  }

  // 1. Check document.cookie
  const match = document.cookie.match(new RegExp(`(?:^|; )${ANON_SESSION_COOKIE}=([^;]*)`));
  if (match && match[1]) {
    const val = decodeURIComponent(match[1]).trim();
    if (val.length >= 8) return val;
  }

  // 2. Check localStorage
  try {
    const stored = localStorage.getItem(ANON_SESSION_COOKIE);
    if (stored && stored.trim().length >= 8) {
      persistSessionCookie(stored.trim());
      return stored.trim();
    }
  } catch {}

  // 3. Generate new session
  const newId = generateSessionId();
  persistSessionCookie(newId);
  try {
    localStorage.setItem(ANON_SESSION_COOKIE, newId);
  } catch {}

  return newId;
}

/**
 * Persists session cookie for 1 year with Secure/Lax settings.
 */
export function persistSessionCookie(sessionId: string) {
  if (typeof document === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${ANON_SESSION_COOKIE}=${encodeURIComponent(
    sessionId
  )}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

/**
 * Client-side: Extracts current URL query params, referrer, segment, and device.
 */
export function extractClientAttribution(
  pathname: string,
  contentCluster?: string
): Partial<VisitorAttribution> {
  if (typeof window === "undefined") {
    return {
      visitorSegment: detectVisitorSegment(pathname),
      deviceCategory: "desktop",
      firstTouchPageSlug: pathname,
      firstTouchCluster: contentCluster || null,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const explicitSegment = params.get("segment") || params.get("intent");
  const segment = detectVisitorSegment(pathname, explicitSegment);
  const device = detectDeviceCategory(navigator.userAgent);

  let referrerHost: string | null = null;
  if (document.referrer) {
    try {
      referrerHost = new URL(document.referrer).hostname;
    } catch {
      referrerHost = document.referrer.slice(0, 100);
    }
  }

  return {
    visitorSegment: segment,
    deviceCategory: device,
    lastTouchUrl: window.location.href.slice(0, 500),
    lastTouchPageSlug: pathname.slice(0, 120),
    lastTouchCluster: contentCluster || null,
    lastTouchUtmSource: params.get("utm_source")?.slice(0, 100) || null,
    lastTouchUtmMedium: params.get("utm_medium")?.slice(0, 100) || null,
    lastTouchUtmCampaign: params.get("utm_campaign")?.slice(0, 100) || null,
    lastTouchUtmContent: params.get("utm_content")?.slice(0, 100) || null,
    lastTouchReferrer: referrerHost,
  };
}
