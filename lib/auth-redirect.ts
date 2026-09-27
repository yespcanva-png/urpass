/**
 * Utility to resolve the post-login / post-signup destination.
 * Enforces that users originating from https://urpass.space/founder-lifetime-deal
 * or the /pricing page are redirected to the billing page (/billing).
 */

export interface ParamGetter {
  get: (key: string) => string | null;
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

  // 1. If explicit candidate is already a /billing route, preserve it
  if (candidate && candidate.startsWith("/billing")) {
    return candidate;
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
  if (candidate && candidate.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }

  return "/dashboard";
}
