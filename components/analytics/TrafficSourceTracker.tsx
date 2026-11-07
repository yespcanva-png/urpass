"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isTrackableTrafficPath } from "@/lib/traffic/path";
import { trackLifecycleEvent } from "@/lib/analytics/client";

const VISITOR_COOKIE = "urpass_traffic_vid";
const CONSENT_COOKIE = "urpass_analytics_consent";
const MAX_AGE = 60 * 60 * 24 * 180;

function getCookie(name: string): string | null {
  const item = document.cookie.split("; ").find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

function referrerOrigin(): string | null {
  try { return document.referrer ? new URL(document.referrer).origin : null; }
  catch { return null; }
}

export default function TrafficSourceTracker() {
  const recorded = useRef(false);
  const previousPath = useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const isSpaNavigation = previousPath.current !== null && previousPath.current !== pathname;
    previousPath.current = pathname;
    recorded.current = false;
    const blocked = () => navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

    const revoke = () => {
      recorded.current = false;
      setCookie(CONSENT_COOKIE, "0", MAX_AGE);
      if (getCookie(VISITOR_COOKIE)) {
        void fetch("/api/analytics/traffic", { method: "DELETE", credentials: "same-origin", keepalive: true });
      }
    };

    const record = () => {
      if (recorded.current || blocked()) return;
      try {
        if (localStorage.getItem("urpass_cookie_consent") !== "all") return;
      } catch { return; }
      recorded.current = true;
      setCookie(CONSENT_COOKIE, "1", MAX_AGE);
      const params = new URLSearchParams(location.search);
      if (!isTrackableTrafficPath(location.pathname)) {
        if (getCookie(VISITOR_COOKIE)) {
          void fetch("/api/analytics/traffic", {
            method: "POST", headers: { "Content-Type": "application/json" },
            credentials: "same-origin", body: JSON.stringify({ linkOnly: true }),
          });
        }
        return;
      }
      if (isSpaNavigation && getCookie(VISITOR_COOKIE) && !params.has("utm_source")) return;
      const existing = getCookie(VISITOR_COOKIE);
      if (!existing || !/^[0-9a-f-]{36}$/i.test(existing)) {
        setCookie(VISITOR_COOKIE, crypto.randomUUID(), MAX_AGE);
      }
      trackLifecycleEvent("landing_page_viewed", {
        source: params.get("utm_source") || (referrerOrigin() || "direct"),
      });
      void fetch("/api/analytics/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        keepalive: true,
        body: JSON.stringify({
          path: location.pathname,
          referrer: referrerOrigin(),
          utmSource: params.get("utm_source"),
          utmMedium: params.get("utm_medium"),
          utmCampaign: params.get("utm_campaign"),
        }),
      }).catch(() => { recorded.current = false; });
    };

    const onChoice = (event: Event) => {
      if ((event as CustomEvent<{ analytics?: boolean }>).detail?.analytics) record();
      else revoke();
    };

    try {
      if (localStorage.getItem("urpass_cookie_consent") === "all") record();
      else if (getCookie(VISITOR_COOKIE)) revoke();
    } catch { /* No storage means no optional tracking. */ }
    window.addEventListener("urpass:cookie-consent", onChoice);
    return () => window.removeEventListener("urpass:cookie-consent", onChoice);
  }, [pathname]);

  return null;
}
