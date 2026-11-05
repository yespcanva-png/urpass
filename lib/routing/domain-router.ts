/**
 * UrPass Domain & Subdomain Routing Engine
 * Handles hostname-based multi-zone routing between:
 * - urpass.space (Indian production platform)
 * - uk.urpass.space (UK marketing website & SEO engine)
 * - app.uk.urpass.space (UK application, dashboard & gate scanner)
 */

export interface DomainRouteResolution {
  isUkMarketing: boolean;
  isUkApp: boolean;
  isIndiaPlatform: boolean;
  rewritePath?: string;
  redirectUrl?: string;
}

export function resolveDomainRoute(host: string, pathname: string): DomainRouteResolution {
  const cleanHost = (host || "").split(":")[0].toLowerCase().trim();

  const isUkMarketing = cleanHost === "uk.urpass.space";
  const isUkApp = cleanHost === "app.uk.urpass.space";
  const isIndiaPlatform = !isUkMarketing && !isUkApp;

  // 1. UK Marketing Website (uk.urpass.space)
  if (isUkMarketing) {
    // uk.urpass.space/ -> rewrites to /uk (renders UK homepage directly at root)
    if (pathname === "/") {
      return { isUkMarketing, isUkApp, isIndiaPlatform, rewritePath: "/uk" };
    }

    // uk.urpass.space/uk/... -> strip redundant prefix or serve directly
    if (pathname.startsWith("/uk/")) {
      return { isUkMarketing, isUkApp, isIndiaPlatform };
    }

    // If organizer clicks Dashboard / Create Event on marketing domain, redirect to app.uk.urpass.space
    const appRoutes = ["/dashboard", "/create-event", "/onboarding", "/settings", "/org", "/scan", "/studio"];
    if (appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
      return {
        isUkMarketing,
        isUkApp,
        isIndiaPlatform,
        redirectUrl: `https://app.uk.urpass.space${pathname}`,
      };
    }
  }

  // 2. UK Application Portal (app.uk.urpass.space)
  if (isUkApp) {
    // app.uk.urpass.space/ -> redirect to dashboard (or login if unauthenticated)
    if (pathname === "/") {
      return {
        isUkMarketing,
        isUkApp,
        isIndiaPlatform,
        redirectUrl: "https://app.uk.urpass.space/dashboard",
      };
    }
  }

  return { isUkMarketing, isUkApp, isIndiaPlatform };
}

export function isUkHost(host: string): boolean {
  const clean = (host || "").split(":")[0].toLowerCase().trim();
  return clean === "uk.urpass.space" || clean === "app.uk.urpass.space" || clean.endsWith(".uk.urpass.space");
}
