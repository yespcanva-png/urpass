"use client";

import { useEffect } from "react";

const SKEW_RELOAD_KEY = "urpass_skew_reload_timestamp";
const RELOAD_COOLDOWN_MS = 20000; // 20s cooldown to prevent reload loops

function isVersionSkewError(message: string): boolean {
  if (!message || typeof message !== "string") return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("unrecognizedactionerror") ||
    lower.includes("was not found on the server") ||
    lower.includes("failed-to-find-server-action") ||
    lower.includes("chunkloaderror") ||
    lower.includes("loading chunk") ||
    lower.includes("failed to load resource")
  );
}

function triggerRecoveryReload(reason: string) {
  try {
    const lastReload = sessionStorage.getItem(SKEW_RELOAD_KEY);
    const now = Date.now();
    if (lastReload) {
      const diff = now - parseInt(lastReload, 10);
      if (diff < RELOAD_COOLDOWN_MS) {
        console.warn(`[URPASS] Version skew detected (${reason}), but cooldown is active to prevent loops.`);
        return;
      }
    }

    sessionStorage.setItem(SKEW_RELOAD_KEY, now.toString());
    console.warn(`[URPASS] Deployment update detected (${reason}). Refreshing to load latest application version...`);
    window.location.reload();
  } catch {
    // SessionStorage may be restricted in private browsing mode
    window.location.reload();
  }
}

/**
 * VersionSkewHandler automatically recovers the browser when a deployment update or server restart
 * causes stale server action hashes (UnrecognizedActionError) or missing JavaScript chunks (ChunkLoadError).
 */
export default function VersionSkewHandler() {
  useEffect(() => {
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const reason = event?.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason?.message || (reason ? String(reason) : "");

      if (isVersionSkewError(message)) {
        event.preventDefault(); // Prevent crash loop in console
        triggerRecoveryReload(message);
      }
    }

    function handleError(event: ErrorEvent) {
      const message = event?.message || "";
      if (isVersionSkewError(message)) {
        event.preventDefault();
        triggerRecoveryReload(message);
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
