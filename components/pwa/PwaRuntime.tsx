"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import InstallUrPassButton from "./InstallUrPassButton";

const UPDATE_DISMISSED_KEY = "urpass_pwa_update_dismissed";

function isOperationalPath(pathname: string) {
  return pathname.startsWith("/scan") || pathname.includes("/attendees") || pathname.includes("/check-in");
}

export default function PwaRuntime() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (!window.isSecureContext && window.location.hostname !== "localhost") return;

    let registrationRef: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        registrationRef = registration;

        if (registration.waiting && !sessionStorage.getItem(UPDATE_DISMISSED_KEY)) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller &&
              !sessionStorage.getItem(UPDATE_DISMISSED_KEY)
            ) {
              setWaitingWorker(worker);
              setShowUpdate(true);
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[UrPass PWA] Service worker registration failed:", err);
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (isOperationalPath(window.location.pathname)) {
        setShowUpdate(false);
        return;
      }
      window.location.reload();
    });

    const checkForUpdates = window.setInterval(() => {
      registrationRef?.update().catch(() => null);
    }, 60 * 60 * 1000);

    return () => window.clearInterval(checkForUpdates);
  }, []);

  function applyUpdate() {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowUpdate(false);
  }

  function dismissUpdate() {
    sessionStorage.setItem(UPDATE_DISMISSED_KEY, "1");
    setShowUpdate(false);
  }

  return (
    <>
      <InstallUrPassButton />
      {showUpdate && waitingWorker && (
        <div className="fixed z-[60] bottom-20 inset-x-4 mx-auto max-w-md sm:bottom-auto sm:top-5 sm:right-5 sm:left-auto sm:mx-0 sm:max-w-sm rounded-2xl border border-violet-200 bg-white p-4 text-neutral-950 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">UrPass update available</p>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Apply it when you are not actively scanning. Scanner pages will not reload automatically.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={applyUpdate}
                  className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-600"
                >
                  Update now
                </button>
                <button
                  type="button"
                  onClick={dismissUpdate}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissUpdate}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Dismiss update prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

