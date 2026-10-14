"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  MonitorDown,
  Smartphone,
  X,
  Share2,
  Bookmark,
  Copy,
  Check,
  PlusSquare,
  Sparkles,
} from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_KEY = "urpass_install_prompt_dismissed_at";
const DISMISS_DAYS = 3;

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
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/event") ||
    pathname.startsWith("/scan") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/checkins") ||
    pathname === "/"
  );
}

export default function InstallUrPassButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown");
  const [copied, setCopied] = useState(false);

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
    }, 1200);

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

  async function handleShareOrBookmark() {
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "UrPass",
          text: "Launch scanner, dashboard, and event tools in a standalone app window.",
          url: window.location.href,
        });
        return;
      } catch {
        // user closed share sheet or unsupported
      }
    }

    setFallbackOpen(true);
  }

  async function handleCopyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

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

    // On mobile or without deferredPrompt:
    if (platform === "ios" || platform === "android") {
      setFallbackOpen(true);
      if (navigator.share) {
        try {
          await navigator.share({
            title: "UrPass",
            text: "Launch scanner, dashboard, and event tools in a standalone app window.",
            url: window.location.href,
          });
        } catch {
          // user closed share sheet
        }
      }
      return;
    }

    // Desktop without deferredPrompt (e.g. Safari Mac, Firefox)
    setFallbackOpen(true);
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible || installed) return null;

  return (
    <div
      className="fixed z-50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 sm:slide-in-from-top-3
        bottom-20 inset-x-4 mx-auto max-w-md
        sm:bottom-auto sm:top-5 sm:right-5 sm:left-auto sm:mx-0 sm:max-w-sm
        rounded-2xl border border-violet-200/90 bg-white p-4 text-neutral-950 shadow-2xl shadow-violet-950/15"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 border border-violet-100">
          {platform === "desktop" ? <MonitorDown className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-neutral-900 leading-tight">Install UrPass</p>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700">
              <Sparkles className="w-2.5 h-2.5" /> PWA
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            Launch scanner, dashboard, and event tools in a standalone app window.
          </p>

          {/* Fallback & Step-by-Step Mobile Instructions */}
          {fallbackOpen && (
            <div className="mt-3 rounded-xl bg-violet-50/90 p-3 text-xs border border-violet-200/70 text-violet-950 space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[11px] uppercase tracking-wider text-violet-800 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-violet-600" />
                  {platform === "ios" ? "Add to Home Screen / Bookmark" : "Install & Bookmark Instructions"}
                </p>
              </div>

              {platform === "ios" ? (
                <ol className="list-decimal list-inside space-y-1 text-neutral-700 text-[11px] leading-relaxed">
                  <li>
                    Tap the <strong className="text-neutral-900">Share</strong> button (
                    <Share2 className="w-3 h-3 inline text-blue-600 mx-0.5" />
                    ) in Safari.
                  </li>
                  <li>
                    Select <strong className="text-violet-800">Add to Home Screen</strong> (
                    <PlusSquare className="w-3 h-3 inline text-violet-600 mx-0.5" />
                    ) or <strong className="text-neutral-800">Add Bookmark</strong> (
                    <Bookmark className="w-3 h-3 inline text-amber-600 mx-0.5" />
                    ).
                  </li>
                  <li>Tap <strong className="text-neutral-900">Add</strong> to launch UrPass from your home screen!</li>
                </ol>
              ) : platform === "android" ? (
                <ol className="list-decimal list-inside space-y-1 text-neutral-700 text-[11px] leading-relaxed">
                  <li>Tap the browser menu (<strong>⋮</strong>) in the top-right corner.</li>
                  <li>Tap <strong className="text-violet-800">Install app</strong> or <strong>Add to Home screen</strong>.</li>
                  <li>Confirm installation to launch as a standalone app!</li>
                </ol>
              ) : (
                <p className="text-[11px] text-neutral-700 leading-relaxed">
                  Click the install icon in your address bar, or press <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 font-mono text-[10px] font-bold">⌘+D</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 font-mono text-[10px] font-bold">Ctrl+D</kbd> to bookmark UrPass.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button
                    type="button"
                    onClick={handleShareOrBookmark}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-600 text-white font-semibold text-[11px] transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    Open Share &amp; Bookmark
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-violet-200 text-violet-800 hover:bg-violet-100 font-semibold text-[11px] transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Link Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={install}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-violet-600 active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              {platform === "ios" ? "Install or Bookmark" : "Install UrPass"}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-xl border border-neutral-200/90 bg-neutral-50/80 px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
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
