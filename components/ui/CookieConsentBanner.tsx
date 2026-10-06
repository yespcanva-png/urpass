"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, ShieldCheck } from "lucide-react";
import { detectCountryClient } from "@/lib/country-config";

type RegionMode = "uk" | "in" | "common";

/**
 * Returns true if the given pathname is a public event / registration / attendee pass page.
 * For public event visitors, the cookie banner popup is suppressed to eliminate friction
 * and deliver an instant, seamless event details and ticket booking experience.
 */
export function isPublicEventRoute(pathname?: string | null): boolean {
  if (!pathname) return false;
  const path = pathname.toLowerCase();
  return (
    path.startsWith("/events/") ||
    path === "/events" ||
    path.startsWith("/apply/") ||
    path === "/apply" ||
    path.startsWith("/e/") ||
    path === "/e" ||
    path.startsWith("/p/") ||
    path === "/p" ||
    path.startsWith("/verify") ||
    path.startsWith("/feedback/") ||
    path === "/feedback"
  );
}

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [region, setRegion] = useState<RegionMode>("common");

  // If on a public event, registration, or pass page, never show the cookie consent popup
  const isPublicEvent = isPublicEventRoute(pathname);

  useEffect(() => {
    if (isPublicEvent) {
      setVisible(false);
      return;
    }

    // 1. Check if consent has already been recorded
    try {
      const stored = localStorage.getItem("urpass_cookie_consent");
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // In private browsing or disabled storage, fail gracefully
    }

    // 2. Determine initial region from URL & client environment
    try {
      const currentPath = (pathname || window.location.pathname).toLowerCase();
      if (currentPath === "/uk" || currentPath.startsWith("/uk/") || currentPath.includes("-uk")) {
        setRegion("uk");
      } else if (currentPath === "/in" || currentPath.startsWith("/in/") || currentPath.includes("-india")) {
        setRegion("in");
      } else {
        const clientCountry = detectCountryClient();
        if (clientCountry === "GB") {
          setRegion("uk");
        } else if (clientCountry === "IN") {
          setRegion("in");
        } else {
          setRegion("common");
        }

        // 3. Confirm IP with server-side geo detection in background
        fetch("/api/geo")
          .then((res) => res.json())
          .then((data) => {
            if (data?.country === "GB") {
              setRegion("uk");
            } else if (data?.country === "IN") {
              setRegion("in");
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, [isPublicEvent, pathname]);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("urpass_cookie_consent", "all");
      window.dispatchEvent(new CustomEvent("urpass:cookie-consent", { detail: { analytics: true } }));
    } catch {}
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem("urpass_cookie_consent", "essential_only");
      window.dispatchEvent(new CustomEvent("urpass:cookie-consent", { detail: { analytics: false } }));
    } catch {}
    setVisible(false);
  };

  if (isPublicEvent || !visible) return null;

  const content = {
    uk: {
      title: "Your Privacy & Cookie Choices",
      description:
        "We use strictly necessary cookies to run secure event check-in and optional performance cookies to monitor scanning speed. In accordance with the UK GDPR & PECR, you can choose your preferences.",
      badge: "UK GDPR & PECR Compliant",
    },
    in: {
      title: "Your Privacy & Cookie Choices",
      description:
        "We use strictly necessary cookies to run secure event check-in and digital ticket issuance. In accordance with the Digital Personal Data Protection (DPDP) Act, you can choose your preferences.",
      badge: "DPDP & ISO 27001 Compliant",
    },
    common: {
      title: "Your Privacy & Cookie Choices",
      description:
        "We use strictly necessary cookies to run secure event check-in and optional performance cookies to monitor scanning speed. In accordance with global data protection standards, you can choose your preferences.",
      badge: "Privacy & Security Protected",
    },
  }[region];

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
            {content.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={handleAcceptAll}
          className="w-full sm:w-auto flex-1 bg-brand hover:bg-brand-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center"
        >
          Accept All
        </button>
        <button
          onClick={handleRejectNonEssential}
          className="w-full sm:w-auto flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center"
        >
          Reject Non-Essential
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
        <Link href="/privacy" className="hover:text-neutral-700 underline transition-colors">
          Read Privacy Policy
        </Link>
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          {content.badge}
        </span>
      </div>
    </div>
  );
}
