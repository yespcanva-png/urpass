"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectCountryClient } from "@/lib/country-config";
import FreeTrialTopBanner from "@/components/landing/FreeTrialTopBanner";
import RequestEventSetupModal, { openRequestEventSetupModal } from "@/components/landing/RequestEventSetupModal";

import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function Navbar({ isAuthenticated: initialAuth }: NavbarProps = {}) {
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(initialAuth));

  useEffect(() => {
    if (initialAuth !== undefined) {
      setIsLoggedIn(initialAuth);
      return;
    }
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          setIsLoggedIn(true);
        }
      }).catch(() => {});
    } catch {
      // Ignore if supabase client is unavailable
    }
  }, [initialAuth]);

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

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/ticket-templates", label: "Templates", badge: "New" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        style={{ top: "var(--pwa-top-bar-height, 0px)" }}
        className="fixed inset-x-0 z-50 transition-[top] duration-200"
      >
        {/* ── 00 Top Free Trial Offer Banner ── */}
        <FreeTrialTopBanner isUk={isUk} />

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
              className="font-extrabold tracking-tight text-lg text-neutral-950 hover:text-neutral-700 transition-colors flex items-center gap-2"
            >
              <span>URPASS</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5",
                      isActive
                        ? "font-semibold text-neutral-950 bg-neutral-100/90 shadow-2xs"
                        : "font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700 leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2.5">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => openRequestEventSetupModal()}
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950 px-3.5 py-2 rounded-lg hover:bg-neutral-100/80 transition-all cursor-pointer"
                  >
                    Request a Setup
                  </button>
                  <Link
                    href={pathname === "/pricing" ? "/dashboard/billing" : "/dashboard"}
                    className="text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 px-4 py-2 rounded-lg transition-all shadow-xs"
                  >
                    {pathname === "/pricing" ? "Billing Portal" : "Dashboard"}
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openRequestEventSetupModal()}
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950 px-3.5 py-2 rounded-lg hover:bg-neutral-100/80 transition-all cursor-pointer"
                  >
                    Request a Setup
                  </button>
                  <Link
                    href={signupHref}
                    className="text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 px-4 py-2 rounded-lg transition-all shadow-xs"
                  >
                    Get Started
                  </Link>
                </>
              )}
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
            <div className="lg:hidden bg-white border-b border-neutral-200/80 px-5 py-5 flex flex-col gap-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-between",
                      isActive
                        ? "font-semibold text-neutral-950 bg-neutral-100"
                        : "font-medium text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile Action Buttons */}
              <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openRequestEventSetupModal();
                  }}
                  className="text-sm text-center border border-neutral-200/90 rounded-xl py-2.5 font-medium hover:bg-neutral-50 transition-colors text-neutral-900 bg-white shadow-2xs cursor-pointer w-full"
                >
                  Request a Setup
                </button>
                {isLoggedIn ? (
                  <Link
                    href={pathname === "/pricing" ? "/dashboard/billing" : "/dashboard"}
                    onClick={() => setOpen(false)}
                    className="text-sm text-center bg-neutral-950 text-white rounded-xl py-2.5 font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    {pathname === "/pricing" ? "Billing Portal" : "Dashboard"}
                  </Link>
                ) : (
                  <Link
                    href={signupHref}
                    onClick={() => setOpen(false)}
                    className="block text-sm text-center bg-neutral-950 text-white rounded-xl py-2.5 font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Global Request Event Setup Modal ── */}
      <RequestEventSetupModal />
    </>
  );
}
