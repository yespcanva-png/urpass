"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(DISMISSED_KEY);
  if (!raw) return false;
  const time = Number(raw);
  if (!Number.isFinite(time)) return false;
  return Date.now() - time < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isOrganizerInstallPath(pathname: string) {
  // Never show on the landing page or home page
  if (!pathname || pathname === "/") return false;

  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/event") ||
    pathname.startsWith("/scan") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/checkins") ||
    pathname.startsWith("/managed-setup")
  );
}

export default function InstallUrPassButton() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown");
  const [copied, setCopied] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

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

    if (!isOrganizerInstallPath(pathname) || recentlyDismissed() || isStandaloneDisplay()) {
      setVisible(false);
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!isStandaloneDisplay() && isOrganizerInstallPath(pathname)) setVisible(true);
    }, 800);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      if (isOrganizerInstallPath(pathname)) {
        setVisible(true);
      }
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
  }, [pathname]);

  // Dynamically set CSS custom property so fixed navbar and headers offset smoothly without collision
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!visible || installed || !isOrganizerInstallPath(pathname)) {
      document.documentElement.style.setProperty("--pwa-top-bar-height", "0px");
      return;
    }

    const updateHeight = () => {
      const h = bannerRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--pwa-top-bar-height", `${h}px`);
    };

    updateHeight();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateHeight) : null;
    if (bannerRef.current && ro) {
      ro.observe(bannerRef.current);
    }

    return () => {
      ro?.disconnect();
      document.documentElement.style.setProperty("--pwa-top-bar-height", "0px");
    };
  }, [visible, installed, pathname]);

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

    // On mobile or without deferredPrompt (e.g. Safari on iOS or macOS):
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

    // Desktop without deferredPrompt (Safari Mac, Firefox)
    setFallbackOpen(true);
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--pwa-top-bar-height", "0px");
    }
  }

  if (!visible || installed || !isOrganizerInstallPath(pathname)) return null;

  return (
    <>
      {/* ── TOP-DOCKED ANNOUNCEMENT STRIP (NEVER OVERLAYS OR DISTURBS PAGE COMPONENTS) ── */}
      <aside
        ref={bannerRef}
        id="urpass-pwa-top-bar"
        aria-label="UrPass Standalone App Notification"
        className="fixed top-0 inset-x-0 z-[60] bg-neutral-950 text-white border-b border-neutral-800 shadow-sm transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
          {/* Left: Indicator & Main Pitch */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-600/20 text-violet-400 border border-violet-500/30">
              {platform === "desktop" ? (
                <MonitorDown className="h-3.5 w-3.5" />
              ) : (
                <Smartphone className="h-3.5 w-3.5" />
              )}
            </div>
            <p className="text-neutral-300 font-normal truncate sm:text-clip leading-snug">
              <span className="hidden sm:inline">
                Launch scanner, dashboard, and event tools in a standalone app window.
              </span>
              <span className="sm:hidden">
                Launch scanner, dashboard &amp; tools in standalone app.
              </span>
            </p>
          </div>

          {/* Right: Direct Inline Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={install}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors shadow-xs active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install UrPass</span>
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── NON-INVASIVE INSTRUCTION DIALOG (CENTRAL MODAL FOR SAFARI / IOS / DESKTOP BOOKMARK) ── */}
      {fallbackOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-neutral-900 relative">
            <button
              type="button"
              onClick={() => setFallbackOpen(false)}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 border border-violet-100">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-950">Install UrPass</h3>
                <p className="text-xs text-neutral-500">
                  {platform === "ios"
                    ? "Add to Home Screen for 1-tap app launch"
                    : platform === "android"
                    ? "Add to Home Screen"
                    : "Standalone App & Bookmark Instructions"}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200/80 text-xs text-neutral-700 space-y-2.5">
              {platform === "ios" ? (
                <ol className="list-decimal list-inside space-y-2 text-neutral-700 text-xs leading-relaxed">
                  <li>
                    Tap the <strong className="text-neutral-900 font-semibold">Share</strong> button (
                    <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" />
                    ) in Safari.
                  </li>
                  <li>
                    Select <strong className="text-violet-800 font-semibold">Add to Home Screen</strong> (
                    <PlusSquare className="w-3.5 h-3.5 inline text-violet-600 mx-0.5" />
                    ) or <strong className="text-neutral-900 font-semibold">Add Bookmark</strong>.
                  </li>
                  <li>Tap <strong className="text-neutral-900 font-semibold">Add</strong> in top-right corner to launch UrPass from your home screen!</li>
                </ol>
              ) : platform === "android" ? (
                <ol className="list-decimal list-inside space-y-2 text-neutral-700 text-xs leading-relaxed">
                  <li>Tap the browser menu (<strong className="font-semibold text-neutral-900">⋮</strong>) in the top-right corner.</li>
                  <li>Tap <strong className="text-violet-800 font-semibold">Install app</strong> or <strong className="font-semibold text-neutral-900">Add to Home screen</strong>.</li>
                  <li>Confirm installation to launch as a standalone app!</li>
                </ol>
              ) : (
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Click the install icon in your browser&apos;s address bar, or press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 font-mono text-[11px] font-bold">⌘+D</kbd> /{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 font-mono text-[11px] font-bold">Ctrl+D</kbd> to bookmark UrPass.
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button
                    type="button"
                    onClick={handleShareOrBookmark}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Open Share Sheet
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200 font-semibold text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Link Copied!" : "Copy Link"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setFallbackOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
