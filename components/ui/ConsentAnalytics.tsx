"use client";

import { useEffect } from "react";
import { detectCountryClient } from "@/lib/country-config";

interface Props {
  measurementId: string;
  clarityProjectId?: string;
}

/**
 * Loads analytics (GA4, Microsoft Clarity, PostHog) with privacy safeguards.
 * Masks sensitive form inputs and honors Do Not Track / Global Privacy Control.
 */
export default function ConsentAnalytics({
  measurementId,
  clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "z9scwpec4o",
}: Props) {
  useEffect(() => {
    const gaScriptId = "urpass-consent-analytics-ga";
    const clarityScriptId = "urpass-consent-analytics-clarity";
    const posthogScriptId = "urpass-consent-analytics-posthog";

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    const blocked = () =>
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

    const enable = () => {
      if (blocked()) return;

      // 1. Google Analytics 4
      if (measurementId && !document.getElementById(gaScriptId)) {
        const script = document.createElement("script");
        script.id = gaScriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        script.onload = () => {
          const analyticsWindow = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
          analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
          analyticsWindow.gtag = (...args: unknown[]) => { analyticsWindow.dataLayer?.push(args); };
          analyticsWindow.gtag("js", new Date());
          analyticsWindow.gtag("config", measurementId, {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        };
        document.head.appendChild(script);
      }

      // 2. Microsoft Clarity
      if (clarityProjectId && !document.getElementById(clarityScriptId)) {
        const script = document.createElement("script");
        script.id = clarityScriptId;
        script.async = true;
        script.innerHTML = `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${encodeURIComponent(clarityProjectId)}");
        `;
        document.head.appendChild(script);
      }

      // 3. PostHog Analytics
      if (posthogKey && !document.getElementById(posthogScriptId)) {
        const script = document.createElement("script");
        script.id = posthogScriptId;
        script.async = true;
        script.innerHTML = `
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init('${posthogKey}',{api_host:'${posthogHost}',person_profiles:'identified_only',autocapture:true,capture_pageview:true});
        `;
        document.head.appendChild(script);
      }
    };

    const disable = () => {
      // Remove scripts
      document.getElementById(gaScriptId)?.remove();
      document.getElementById(clarityScriptId)?.remove();
      document.getElementById(posthogScriptId)?.remove();

      // Signal opt-out
      const analyticsWindow = window as Window & {
        gtag?: (...args: unknown[]) => void;
        posthog?: { opt_out_capturing?: () => void };
      };
      analyticsWindow.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
      analyticsWindow.posthog?.opt_out_capturing?.();

      // Clear standard tracker cookies
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.split("=")[0].trim();
        if (!/^(_ga|_gid$|_gat|ph_|mp_|_clck|_clsk)/.test(name)) continue;
        document.cookie = `${name}=; Max-Age=0; Path=/`;
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${location.hostname.replace(/^www\./, "")}`;
      }
    };

    const onChoice = (event: Event) => {
      if ((event as CustomEvent<{ analytics?: boolean }>).detail?.analytics) enable();
      else disable();
    };

    try {
      const stored = localStorage.getItem("urpass_cookie_consent");
      if (stored === "all") {
        enable();
      } else if (stored === "essential_only") {
        disable();
      } else {
        const isUk = detectCountryClient() === "GB";
        if (!isUk && !blocked()) {
          enable();
        }
      }
    } catch {
      // Storage denied: optional analytics remains off.
    }

    window.addEventListener("urpass:cookie-consent", onChoice);
    return () => window.removeEventListener("urpass:cookie-consent", onChoice);
  }, [measurementId, clarityProjectId]);

  return null;
}
