"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, MonitorDown, Smartphone, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_KEY = "urpass_install_prompt_dismissed_at";
const DISMISS_DAYS = 30;

function recentlyDismissed() {
  const raw = localStorage.getItem(DISMISSED_KEY);
  if (!raw) return false;
  const time = Number(raw);
  if (!Number.isFinite(time)) return false;
  return Date.now() - time < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isStandaloneDisplay() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isOrganizerInstallPath(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/event") || pathname.startsWith("/scan") || pathname.startsWith("/billing") || pathname.startsWith("/onboarding");
}

export default function InstallUrPassButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent.toLowerCase();
    const detectedPlatform = /iphone|ipad|ipod/.test(ua)
      ? "ios"
      : /android/.test(ua)
      ? "android"
      : /mac|win|linux|cros/.test(ua)
      ? "desktop"
      : "unknown";

    setPlatform(detectedPlatform);
    setInstalled(isStandaloneDisplay());

    if (!isOrganizerInstallPath(window.location.pathname) || recentlyDismissed() || isStandaloneDisplay()) {
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!isStandaloneDisplay()) setVisible(true);
    }, 1400);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function handleInstalled() {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const fallbackText = useMemo(() => {
    if (platform === "ios") return "In Safari, tap Share, then Add to Home Screen.";
    if (platform === "android") return "Use your browser menu and choose Install app or Add to Home screen.";
    if (platform === "desktop") return "Use the install icon in your browser address bar, or open the browser menu and choose Install UrPass.";
    return "Use your browser menu to install UrPass when supported.";
  }, [platform]);

  async function install() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      } else {
        localStorage.setItem(DISMISSED_KEY, String(Date.now()));
        setVisible(false);
      }
      setDeferredPrompt(null);
      return;
    }
    setFallbackOpen(true);
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible || installed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-violet-200 bg-white p-4 text-neutral-950 shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
          {platform === "desktop" ? <MonitorDown className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Install UrPass</p>
          <p className="mt-1 text-xs leading-5 text-neutral-600">
            Launch scanner, dashboard, and event tools in a standalone app window.
          </p>
          {fallbackOpen && (
            <p className="mt-2 rounded-lg bg-violet-50 px-3 py-2 text-xs leading-5 text-violet-900">
              {fallbackText}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={install}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-600"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

