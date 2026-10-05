/**
 * Utility to resolve the post-login / post-signup destination.
 * Enforces that users originating from https://urpass.space/founder-lifetime-deal
 * or the /pricing page are redirected to the billing page (/billing).
 */

export interface ParamGetter {
  get: (key: string) => string | null;
}

const FALLBACK_DESTINATION = "/dashboard";

const BLOCKED_AUTH_DESTINATIONS = [
  "/auth",
  "/api/auth",
  "/login",
  "/signup",
  "/forgot-password",
];

function isBlockedDestination(pathname: string) {
  return BLOCKED_AUTH_DESTINATIONS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function sanitizeInternalDestination(candidate: string | null | undefined) {
  if (!candidate) return null;

  const trimmed = candidate.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  try {
    const parsed = new URL(trimmed, "https://urpass.space");
    if (parsed.origin !== "https://urpass.space") return null;
    if (isBlockedDestination(parsed.pathname)) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function resolvePostAuthRedirect(
  searchParams?: ParamGetter | null,
  referrer?: string | null
): string {
  const next = searchParams?.get("next");
  const redirect = searchParams?.get("redirect");
  const returnTo = searchParams?.get("returnTo");
  const redirectTo = searchParams?.get("redirect_to");
  const from = searchParams?.get("from");
  const plan = searchParams?.get("plan");

  const candidate = next || redirect || returnTo || redirectTo;
  const safeCandidate = sanitizeInternalDestination(candidate);

  // 1. If explicit candidate is already a /billing route, preserve it
  if (safeCandidate && safeCandidate.startsWith("/billing")) {
    return safeCandidate;
  }

  // 2. Check if candidate or 'from' originates from founder-lifetime-deal
  const isFounderSource =
    (candidate && candidate.includes("founder-lifetime-deal")) ||
    (from && (from.includes("founder") || from.includes("lifetime")));

  if (isFounderSource) {
    return "/billing?claim=true";
  }

  // 3. Check if candidate or 'from' originates from pricing page
  const isPricingSource =
    (candidate && candidate.includes("pricing")) ||
    (from && from.includes("pricing")) ||
    Boolean(plan);

  if (isPricingSource) {
    return plan ? `/billing?plan=${encodeURIComponent(plan)}` : "/billing";
  }

  // 4. Check referrer (e.g. browser document.referrer or HTTP referer header)
  if (referrer) {
    try {
      const refUrl = new URL(referrer);
      if (refUrl.pathname.includes("founder-lifetime-deal")) {
        return "/billing?claim=true";
      }
      if (refUrl.pathname.includes("pricing")) {
        return "/billing";
      }
    } catch {
      if (referrer.includes("founder-lifetime-deal")) {
        return "/billing?claim=true";
      }
      if (referrer.includes("pricing")) {
        return "/billing";
      }
    }
  }

  // 5. If candidate is a safe relative internal route, honor it
  if (safeCandidate) {
    return safeCandidate;
  }

  return FALLBACK_DESTINATION;
}

/**
 * Resolves the password reset redirect URL.
 * Strictly avoids localhost / local loopback addresses in email callbacks to guarantee
 * that password reset links work reliably on mobile devices and external networks.
 */
export function getAuthResetRedirectUrl(customOrigin?: string | null): string {
  const PRODUCTION_RESET_URL = "https://urpass.space/auth/reset-password";

  // 1. Check customOrigin (e.g. window.location.origin) if valid non-local domain
  if (customOrigin && typeof customOrigin === "string") {
    const trimmed = customOrigin.trim();
    if (
      trimmed &&
      !trimmed.includes("localhost") &&
      !trimmed.includes("127.0.0.1") &&
      !trimmed.includes("0.0.0.0") &&
      trimmed.startsWith("http")
    ) {
      try {
        const parsed = new URL(trimmed);
        if (
          parsed.hostname &&
          !parsed.hostname.includes("localhost") &&
          !parsed.hostname.includes("127.0.0.1")
        ) {
          return `${parsed.origin}/auth/reset-password`;
        }
      } catch {
        // Fall through to production URL
      }
    }
  }

  // 2. Check environment variables
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && typeof envUrl === "string") {
    const trimmed = envUrl.trim();
    if (
      trimmed &&
      !trimmed.includes("localhost") &&
      !trimmed.includes("127.0.0.1") &&
      !trimmed.includes("0.0.0.0") &&
      trimmed.startsWith("http")
    ) {
      return `${trimmed.replace(/\/$/, "")}/auth/reset-password`;
    }
  }

  // 3. Fallback strictly to production domain
  return PRODUCTION_RESET_URL;
}
