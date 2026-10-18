"use client";

import { useEffect } from "react";

const SKEW_RELOAD_KEY = "urpass_skew_reload_timestamp";
const RELOAD_COOLDOWN_MS = 15000; // 15s cooldown to prevent reload loops

export function isVersionSkewError(message: unknown): boolean {
  if (!message) return false;
  let text = "";
  if (typeof message === "string") {
    text = message;
  } else if (message instanceof Error) {
    text = `${message.name} ${message.message} ${(message as any).digest || ""} ${message.stack || ""}`;
  } else if (typeof message === "object") {
    try {
      text = JSON.stringify(message);
    } catch {
      text = String(message);
    }
  } else {
    text = String(message);
  }

  const lower = text.toLowerCase();
  return (
    lower.includes("unrecognizedactionerror") ||
    lower.includes("was not found on the server") ||
    lower.includes("failed-to-find-server-action") ||
    (lower.includes("server action") && lower.includes("not found")) ||
    lower.includes("chunkloaderror") ||
    lower.includes("loading chunk") ||
    lower.includes("failed to fetch dynamically imported module") ||
    lower.includes("cannot find module")
  );
}

export function triggerRecoveryReload(reason: string) {
  if (typeof window === "undefined") return;
  try {
    const lastReload = sessionStorage.getItem(SKEW_RELOAD_KEY);
    const now = Date.now();
    if (lastReload) {
      const diff = now - parseInt(lastReload, 10);
      if (diff < RELOAD_COOLDOWN_MS) {
        console.warn(`[URPASS] Version skew detected (${reason}), but cooldown is active to prevent reload loops.`);
        return;
      }
    }

    sessionStorage.setItem(SKEW_RELOAD_KEY, now.toString());
    console.warn(`[URPASS] Deployment update or Server Action skew detected (${reason}). Refreshing application to sync version...`);
    window.location.reload();
  } catch {
    // SessionStorage may be restricted in private browsing mode
    window.location.reload();
  }
}

/**
 * VersionSkewHandler automatically recovers the browser when a deployment update or server restart
 * causes stale server action hashes (failed-to-find-server-action) or missing JavaScript chunks (ChunkLoadError).
 */
export default function VersionSkewHandler() {
  useEffect(() => {
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const reason = event?.reason;
      if (isVersionSkewError(reason)) {
        event.preventDefault(); // Prevent crash banner
        triggerRecoveryReload(
          typeof reason === "string" ? reason : reason?.message || "Server action deployment skew"
        );
      }
    }

    function handleError(event: ErrorEvent) {
      const err = event?.error || event?.message;
      if (isVersionSkewError(err)) {
        event.preventDefault();
        triggerRecoveryReload(event?.message || "Version skew runtime error");
      }
    }

    // Intercept fetch calls to catch Server Action responses that failed due to deployment skew
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);
      try {
        const init = args[1];
        const headers = init?.headers;
        let isAction = false;
        if (headers) {
          if (headers instanceof Headers) {
            isAction = headers.has("Next-Action") || headers.has("next-action");
          } else if (Array.isArray(headers)) {
            isAction = headers.some(([k]) => k.toLowerCase() === "next-action");
          } else if (typeof headers === "object") {
            isAction = Boolean((headers as Record<string, string>)["Next-Action"] || (headers as Record<string, string>)["next-action"]);
          }
        }

        if (isAction && !response.ok) {
          const clone = response.clone();
          const text = await clone.text();
          if (isVersionSkewError(text)) {
            triggerRecoveryReload("Server Action missing from deployment response");
          }
        }
      } catch {
        // Silently pass through
      }
      return response;
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
