"use client";

import { useEffect, useRef, useCallback } from "react";
import type { AdPlacement } from "@/lib/explore/ads-types";

interface ViewabilityTrackerProps {
  campaignId: string;
  placement: AdPlacement;
  city?: string;
  children: (trackClick: () => void) => React.ReactNode;
  className?: string;
}

// Generate or retrieve anonymous session identifier
function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "anon";
  let sid = sessionStorage.getItem("urpass_ad_sid");
  if (!sid) {
    sid = "sid_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
    sessionStorage.setItem("urpass_ad_sid", sid);
  }
  return sid;
}

export default function ViewabilityTracker({
  campaignId,
  placement,
  city,
  children,
  className = "",
}: ViewabilityTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const impressionRecordedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Send beacon or fetch to record event
  const dispatchAdEvent = useCallback(
    (eventType: "impression" | "click") => {
      if (!/^[0-9a-f-]{36}$/i.test(campaignId)) return;
      const sessionId = getAnonymousSessionId();
      const payload = {
        campaignId,
        placement,
        eventType,
        sessionId,
        city: city || "All Cities",
      };

      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], {
            type: "application/json",
          });
          navigator.sendBeacon("/api/explore/ads/event", blob);
        } else {
          fetch("/api/explore/ads/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Non-blocking telemetry
      }
    },
    [campaignId, placement, city]
  );

  // Handle CTA click
  const trackClick = useCallback(() => {
    dispatchAdEvent("click");
  }, [dispatchAdEvent]);

  // Viewability threshold: 50% visible continuously for at least 1 second
  useEffect(() => {
    if (!campaignId || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const sessionKey = `urpass_imp_${campaignId}_${placement}`;
    impressionRecordedRef.current = false;
    if (sessionStorage.getItem(sessionKey)) {
      impressionRecordedRef.current = true;
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !document.hidden) {
          // Start 1-second viewability timer
          if (!timerRef.current && !impressionRecordedRef.current) {
            timerRef.current = setTimeout(() => {
              if (!impressionRecordedRef.current) {
                impressionRecordedRef.current = true;
                sessionStorage.setItem(sessionKey, "1");
                dispatchAdEvent("impression");
              }
            }, 1000);
          }
        } else {
          // Cancel timer if user scrolls past before 1 second
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      },
      {
        threshold: [0, 0.5, 1.0],
      }
    );

    observer.observe(element);
    const onVisibility = () => {
      if (document.hidden && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [campaignId, placement, dispatchAdEvent]);

  return (
    <div ref={containerRef} className={className}>
      {children(trackClick)}
    </div>
  );
}
