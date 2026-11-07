"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, ShieldCheck } from "lucide-react";
import { detectCountryClient } from "@/lib/country-config";
import { isTrackableTrafficPath } from "@/lib/traffic/path";

type RegionMode = "uk" | "in" | "common";

/**
 * Legacy landing-page predicate. Consent visibility is decided separately below.
 */
export function isLandingPageRoute(pathname?: string | null): boolean {
  if (!pathname) return true;
  const pathWithoutQuery = pathname.split(/[?#]/)[0];
  const normalized = pathWithoutQuery.trim().toLowerCase().replace(/\/+$/, "") || "/";
  return normalized === "/" || normalized === "/in" || normalized === "/uk";
}

/**
 * Retained for backwards compatibility with callers that classify landing routes.
 */
export function isPublicEventRoute(pathname?: string | null): boolean {
  return !isLandingPageRoute(pathname);
}

/**
 * Determines whether the cookie consent banner should be presented.
 * Show choices on public organiser acquisition pages. Existing UK attendee-page
 * consent behavior is preserved; the traffic module itself excludes attendee pages.
 */
export function shouldShowCookieConsent(pathname?: string | null, isUkVisitor: boolean = false): boolean {
  if (isLandingPageRoute(pathname)) return true;
  const p = (pathname || "").toLowerCase();
  if (isTrackableTrafficPath(p)) return true;
  const isDashboardRoute = p.startsWith("/dashboard") || p.startsWith("/admin") || p.startsWith("/settings");
  if (isDashboardRoute) return false;

  if (isUkVisitor) {
    return (
      p.startsWith("/uk") ||
      p.startsWith("/apply") ||
      p.startsWith("/e/") ||
      p.startsWith("/events") ||
      p.startsWith("/explore") ||
      p.startsWith("/solutions") ||
      p.startsWith("/pricing") ||
      p.startsWith("/privacy") ||
      p.startsWith("/terms") ||
      p.startsWith("/pass/")
    );
  }
  return false;
}

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  const [region, setRegion] = useState<RegionMode>("common");

  const isLanding = isLandingPageRoute(pathname);

  useEffect(() => {
    // 1. Check if consent has already been recorded
    try {
      const stored = localStorage.getItem("urpass_cookie_consent");
      setHasChoice(stored === "all" || stored === "essential_only");
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // In private browsing or disabled storage, fail gracefully
    }

    // 2. Determine initial region from URL & client environment
    try {
      const currentPath = (pathname || window.location.pathname).toLowerCase();
      if (currentPath === "/uk" || currentPath.startsWith("/uk/") || currentPath.includes("-uk")) {
        setRegion("uk");
      } else if (currentPath === "/in" || currentPath.startsWith("/in/") || currentPath.includes("-india")) {
        setRegion("in");
      } else {
        const clientCountry = detectCountryClient();
        if (clientCountry === "GB") {
          setRegion("uk");
        } else if (clientCountry === "IN") {
          setRegion("in");
        } else {
          setRegion("common");
        }

        // 3. Confirm IP with server-side geo detection in background
        fetch("/api/geo")
          .then((res) => res.json())
          .then((data) => {
            if (data?.country === "GB") {
              setRegion("uk");
            } else if (data?.country === "IN") {
              setRegion("in");
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, [isLanding, pathname]);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("urpass_cookie_consent", "all");
      localStorage.setItem("urpass_cookie_consent_record", JSON.stringify({ version: 1, analytics: true, decidedAt: new Date().toISOString() }));
      window.dispatchEvent(new CustomEvent("urpass:cookie-consent", { detail: { analytics: true } }));
    } catch {}
    setVisible(false);
    setHasChoice(true);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem("urpass_cookie_consent", "essential_only");
      localStorage.setItem("urpass_cookie_consent_record", JSON.stringify({ version: 1, analytics: false, decidedAt: new Date().toISOString() }));
      window.dispatchEvent(new CustomEvent("urpass:cookie-consent", { detail: { analytics: false } }));
    } catch {}
    setVisible(false);
    setHasChoice(true);
  };

  const shouldShow = shouldShowCookieConsent(pathname, region === "uk");
  if (!shouldShow) return null;
  if (!visible && hasChoice) return <button type="button" onClick={() => setVisible(true)} className="fixed bottom-4 left-4 z-50 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-md">Cookie choices</button>;
  if (!visible) return null;

  const content = {
    uk: {
      title: "Your Privacy & Cookie Choices",
      description:
        "Optional analytics help us understand which sites bring visitors to UrPass and whether they sign up, create events or buy a plan. With your permission, we use an anonymous visitor cookie and link the source to your account if you sign up. You can change your choice here at any time.",
      badge: "Privacy choices",
    },
    in: {
      title: "Your Privacy & Cookie Choices",
      description:
        "Optional analytics help us understand which sites bring visitors to UrPass and whether they sign up, create events or buy a plan. With your permission, we use an anonymous visitor cookie and link the source to your account if you sign up. You can change your choice here at any time.",
      badge: "Privacy choices",
    },
    common: {
      title: "Your Privacy & Cookie Choices",
      description:
        "Optional analytics help us understand which sites bring visitors to UrPass and whether they sign up, create events or buy a plan. With your permission, we use an anonymous visitor cookie and link the source to your account if you sign up. You can change your choice here at any time.",
      badge: "Privacy & Security Protected",
    },
  }[region];

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
            {content.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={handleAcceptAll}
          className="w-full sm:w-auto flex-1 bg-brand hover:bg-brand-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center"
        >
          Accept All
        </button>
        <button
          onClick={handleRejectNonEssential}
          className="w-full sm:w-auto flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center"
        >
          Reject Non-Essential
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
        <Link href="/privacy" className="hover:text-neutral-700 underline transition-colors">
          Read Privacy Policy
        </Link>
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          {content.badge}
        </span>
      </div>
    </div>
  );
}
