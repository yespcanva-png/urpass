"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Compass,
  Sparkles,
  Workflow,
  LayoutTemplate,
  CreditCard,
  Mail,
  QrCode,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { detectCountryClient } from "@/lib/country-config";
import FreeTrialTopBanner from "@/components/landing/FreeTrialTopBanner";
import RequestEventSetupModal, { openRequestEventSetupModal } from "@/components/landing/RequestEventSetupModal";

import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  isAuthenticated?: boolean;
}

interface NavItem {
  href: string;
  label: string;
  description: string;
  badge?: string;
  badgeTone?: "emerald" | "violet";
  icon: React.ComponentType<{ className?: string }>;
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

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close mobile drawer on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const navLinks: NavItem[] = [
    {
      href: "/explore",
      label: "Explore",
      description: "Discover curated live events & mixers",
      badge: "Early Access",
      badgeTone: "emerald",
      icon: Compass,
    },
    {
      href: "/features",
      label: "Features",
      description: "Pass designer, forms & lightning check-in",
      icon: Sparkles,
    },
    {
      href: "/ticket-templates",
      label: "Templates",
      description: "Ready-to-use digital & thermal passes",
      badge: "New",
      badgeTone: "violet",
      icon: LayoutTemplate,
    },
    {
      href: "/#how-it-works",
      label: "How it works",
      description: "Setup to check-in in 3 simple steps",
      icon: Workflow,
    },
    {
      href: "/pricing",
      label: "Pricing",
      description: "0% commission transparent platform fee",
      icon: CreditCard,
    },
    {
      href: "/contact",
      label: "Contact",
      description: "Support, custom setup & partnerships",
      icon: Mail,
    },
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold leading-none",
                          item.badgeTone === "emerald"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-violet-100 text-violet-700"
                        )}
                      >
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

            {/* Mobile Actions: Direct 1-tap CTA & Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              {isLoggedIn ? (
                <Link
                  href={pathname === "/pricing" ? "/dashboard/billing" : "/dashboard"}
                  className="text-xs font-semibold text-white bg-neutral-950 active:bg-neutral-800 px-3.5 py-2 rounded-xl transition-all shadow-xs touch-manipulation"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href={signupHref}
                  className="text-xs font-semibold text-white bg-neutral-950 active:bg-neutral-800 px-3.5 py-2 rounded-xl transition-all shadow-xs touch-manipulation"
                >
                  Get Started
                </Link>
              )}

              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 rounded-xl border border-neutral-200/80 hover:bg-neutral-100/80 active:bg-neutral-200 transition-colors text-neutral-900 touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer and Backdrop */}
          {open && (
            <>
              {/* Tap-outside Backdrop */}
              <div
                className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs -z-10 animate-in fade-in duration-200"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />

              {/* Drawer Container */}
              <div className="lg:hidden max-h-[calc(100dvh-4.5rem)] overflow-y-auto bg-white/98 backdrop-blur-2xl border-b border-neutral-200/90 px-4 py-4 sm:px-6 sm:py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200 flex flex-col gap-3.5 overscroll-contain">
                {/* Nav Links Stack */}
                <div className="space-y-1">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-150 touch-manipulation group active:scale-[0.99]",
                          isActive
                            ? "bg-neutral-100 text-neutral-950 font-semibold"
                            : "hover:bg-neutral-50/90 text-neutral-700"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                              isActive
                                ? "bg-neutral-950 text-white shadow-xs"
                                : "bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200/80"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold tracking-tight text-neutral-950">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                    item.badgeTone === "emerald"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-violet-100 text-violet-700"
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 font-normal truncate max-w-[240px] sm:max-w-none">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 shrink-0 ml-2" />
                      </Link>
                    );
                  })}
                </div>

                {/* Organizer Staff Scanner Shortcut */}
                <div className="pt-2 border-t border-neutral-100">
                  <Link
                    href="/scan"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-violet-50/80 border border-violet-200/60 hover:bg-violet-100/70 transition-all touch-manipulation group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-violet-950">
                            Gate QR Scanner
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-violet-200 text-violet-800 text-[10px] font-extrabold uppercase tracking-wider">
                            Crew
                          </span>
                        </div>
                        <p className="text-xs text-violet-700 font-medium truncate">
                          Sub-second 0.3s lightning check-in
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                </div>

                {/* Mobile Action Buttons */}
                <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2.5">
                  {isLoggedIn ? (
                    <Link
                      href={pathname === "/pricing" ? "/dashboard/billing" : "/dashboard"}
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl py-3 font-semibold text-sm transition-all shadow-sm active:scale-[0.99] touch-manipulation"
                    >
                      <span>{pathname === "/pricing" ? "Open Billing Portal" : "Go to Dashboard"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href={signupHref}
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl py-3 font-semibold text-sm transition-all shadow-sm active:scale-[0.99] touch-manipulation"
                    >
                      <span>Get Started — Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openRequestEventSetupModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 rounded-xl py-2.5 font-medium text-sm transition-all shadow-2xs active:scale-[0.99] cursor-pointer touch-manipulation"
                  >
                    <span>Request White-Glove Setup</span>
                  </button>
                </div>

                {/* Mobile Drawer Footer Status */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-medium px-1">
                  <span>URPASS · By YESP Corporation</span>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Operational</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Global Request Event Setup Modal ── */}
      <RequestEventSetupModal />
    </>
  );
}
