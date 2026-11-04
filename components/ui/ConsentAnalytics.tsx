"use client";

import { useEffect } from "react";

/** Optional analytics is loaded only after an affirmative choice. */
export default function ConsentAnalytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    const scriptId = "urpass-consent-analytics";
    const enable = () => {
      if (document.getElementById(scriptId)) return;
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.onload = () => {
        const analyticsWindow = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
        analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
        analyticsWindow.gtag = (...args: unknown[]) => { analyticsWindow.dataLayer?.push(args); };
        analyticsWindow.gtag("js", new Date());
        analyticsWindow.gtag("config", measurementId, { page_path: window.location.pathname });
      };
      document.head.appendChild(script);
    };
    const disable = () => {
      document.getElementById(scriptId)?.remove();
      const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
      analyticsWindow.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.split("=")[0].trim();
        if (!/^(_ga|_gid$|_gat)/.test(name)) continue;
        document.cookie = `${name}=; Max-Age=0; Path=/`;
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${location.hostname.replace(/^www\./, "")}`;
      }
    };
    const onChoice = (event: Event) => {
      if ((event as CustomEvent<{ analytics?: boolean }>).detail?.analytics) enable();
      else disable();
    };
    try {
      if (localStorage.getItem("urpass_cookie_consent") === "all") enable();
    } catch {
      // Storage denied: optional analytics remains off.
    }
    window.addEventListener("urpass:cookie-consent", onChoice);
    return () => window.removeEventListener("urpass:cookie-consent", onChoice);
  }, [measurementId]);
  return null;
}
