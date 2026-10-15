"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectCountryClient } from "@/lib/country-config";

export default function Navbar() {
  const pathname = usePathname();
  const isFromFounder = pathname === "/founder-lifetime-deal";
  const isFromPricing = pathname === "/pricing";

  const signupHref = isFromFounder
    ? "/signup?from=founder-lifetime-deal&next=/billing?claim=true"
    : isFromPricing
    ? "/signup?from=pricing&next=/billing"
    : "/signup";

  const isUkRoute = Boolean(pathname?.startsWith("/uk") || pathname?.endsWith("-uk"));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUk, setIsUk] = useState(isUkRoute);

  useEffect(() => {
    const isUkCurrent = Boolean(pathname?.startsWith("/uk") || pathname?.endsWith("-uk"));
    setIsUk(isUkCurrent || detectCountryClient() === "GB");

    const onCountryChanged = (e: Event) => {
      const custom = e as CustomEvent<{ country: "IN" | "GB" }>;
      if (custom.detail?.country) {
        setIsUk(isUkCurrent || custom.detail.country === "GB");
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

  return (
    <header
      style={{ top: "var(--pwa-top-bar-height, 0px)" }}
      className="fixed inset-x-0 z-50 transition-[top] duration-200"
    >
      {/* Main Navbar */}
      <div
        className={cn(
          "transition-all duration-300 border-b",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]"
            : "bg-white/80 backdrop-blur-md border-neutral-200/50"
        )}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            title="URPASS — Official Website"
            aria-label="URPASS Official Website"
            className="font-extrabold tracking-tight text-lg text-neutral-950 hover:text-neutral-700 transition-colors"
          >
            URPASS
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/features"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-100/70 transition-all"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-100/70 transition-all"
            >
              How it works
            </Link>
            <Link
              href="/ticket-templates"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-100/70 transition-all inline-flex items-center gap-1.5"
            >
              <span>Templates</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700 leading-none">
                New
              </span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-100/70 transition-all"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-100/70 transition-all"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA (Focused 2-Button Group) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              href="/managed-setup"
              className="text-sm font-medium text-neutral-800 hover:text-neutral-950 px-3.5 py-2 rounded-lg border border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
            >
              Request a Setup
            </Link>
            <Link
              href={signupHref}
              className="text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 px-4 py-2 rounded-lg transition-all shadow-xs"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100/80 transition-colors text-neutral-700"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="lg:hidden bg-white border-b border-neutral-200/80 px-5 py-5 flex flex-col gap-3 shadow-lg">
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-700 py-2 px-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-700 py-2 px-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/ticket-templates"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-700 py-2 px-2.5 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-between"
            >
              <span>Templates</span>
              <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-bold">
                New
              </span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-700 py-2 px-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/guides"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-700 py-2 px-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-700 py-2 px-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-700 py-2 px-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Contact
            </Link>

            {/* Mobile Action Buttons (Focused 2-Button Group) */}
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
              <Link
                href="/managed-setup"
                onClick={() => setOpen(false)}
                className="text-sm text-center border border-neutral-200/90 rounded-xl py-2.5 font-medium hover:bg-neutral-50 transition-colors text-neutral-900 bg-white shadow-2xs"
              >
                Request a Setup
              </Link>
              <Link
                href={signupHref}
                onClick={() => setOpen(false)}
                className="text-sm text-center bg-neutral-950 text-white rounded-xl py-2.5 font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
