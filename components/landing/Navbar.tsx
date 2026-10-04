"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectCountryClient } from "@/lib/country-config";

export default function Navbar() {
  const pathname = usePathname();
  const isFromFounder = pathname === "/founder-lifetime-deal";
  const isFromPricing = pathname === "/pricing";

  const loginHref = isFromFounder
    ? "/login?from=founder-lifetime-deal&next=/billing?claim=true"
    : isFromPricing
    ? "/login?from=pricing&next=/billing"
    : "/login";

  const signupHref = isFromFounder
    ? "/signup?from=founder-lifetime-deal&next=/billing?claim=true"
    : isFromPricing
    ? "/signup?from=pricing&next=/billing"
    : "/signup";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUk, setIsUk] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return sessionStorage.getItem("urpass_banner_dismissed") !== "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    setIsUk(detectCountryClient() === "GB");

    const onCountryChanged = (e: Event) => {
      const custom = e as CustomEvent<{ country: "IN" | "GB" }>;
      if (custom.detail?.country) {
        setIsUk(custom.detail.country === "GB");
      }
    };
    window.addEventListener("urpass_country_changed", onCountryChanged);
    return () => window.removeEventListener("urpass_country_changed", onCountryChanged);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleDismiss() {
    setBannerVisible(false);
    try {
      sessionStorage.setItem("urpass_banner_dismissed", "true");
    } catch {
      // ignore
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* ── Top Notification / Announcement Bar ── */}
      {bannerVisible && (
        <div className="bg-neutral-900 text-neutral-200 border-b border-neutral-800 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 relative z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-center leading-tight truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-neutral-300 font-normal">
                <span className="sm:hidden">{isUk ? "30-day trial · £0 today." : "30-day trial · ₹0 today."}</span>
                <span className="hidden sm:inline">{isUk ? "Start free or evaluate any paid plan with our 30-day trial. £0 today." : "Start free or evaluate any paid plan with our 30-day trial. ₹0 today."}</span>
              </span>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-0.5 font-medium text-white hover:text-neutral-300 transition-colors shrink-0 ml-1 underline-offset-2 hover:underline"
              >
                <span>{isUk ? "Try free" : "Try free"}</span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </Link>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            title="URPASS — Official Website"
            aria-label="URPASS Official Website"
            className="font-semibold tracking-tight text-base text-neutral-900"
          >
            URPASS
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/features"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/ticket-templates"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
            >
              <span>Templates</span>
              <span className="px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">New</span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/guides"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/faq"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/contact?subject=Book%20a%20Demo"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Book a demo
            </Link>
            <Link
              href={loginHref}
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors px-1"
            >
              Login
            </Link>
            <Link
              href={signupHref}
              className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-neutral-700 transition-colors shadow-2xs"
            >
              Create Free Event
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden bg-white border-b border-neutral-100 px-5 py-5 flex flex-col gap-4">
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1"
            >
              How it works
            </Link>
            <Link
              href="/ticket-templates"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1 flex items-center justify-between"
            >
              <span>Templates</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">New</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1"
            >
              Pricing
            </Link>
            <Link
              href="/guides"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1"
            >
              Guides
            </Link>
            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1"
            >
              Contact
            </Link>

            <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
              <Link
                href="/contact?subject=Book%20a%20Demo"
                onClick={() => setOpen(false)}
                className="text-sm text-center border border-neutral-200 rounded-xl py-2.5 font-medium hover:bg-neutral-50 transition-colors text-neutral-800"
              >
                Book a demo
              </Link>
              <Link
                href={loginHref}
                onClick={() => setOpen(false)}
                className="text-sm text-center border border-neutral-200 rounded-xl py-2.5 font-medium hover:bg-neutral-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href={signupHref}
                onClick={() => setOpen(false)}
                className="text-sm text-center bg-neutral-900 text-white rounded-xl py-2.5 font-medium hover:bg-neutral-700 transition-colors"
              >
                Create Free Event
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
