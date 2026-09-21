"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("urpass_banner_dismissed") === "true") {
        setBannerVisible(false);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

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
        <div className="bg-gradient-to-r from-neutral-950 via-purple-950 to-neutral-950 text-white border-b border-purple-900/30 text-xs py-2 px-4 relative z-50 shadow-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
              <span className="inline-flex items-center gap-1 text-purple-300 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-neutral-200 font-normal">
                Start free or try any paid plan with our 30-day free trial. ₹0 today.
              </span>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 font-semibold text-purple-300 hover:text-white transition-colors underline-offset-4 hover:underline shrink-0 ml-1"
              >
                <span>Try 30 days free</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors shrink-0 -mr-1"
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
          <Link href="/" className="font-semibold tracking-tight text-base text-neutral-900">
            URPASS
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/#how-it-works"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              How it works
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
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-neutral-700 transition-colors"
            >
              Create event
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
              href="/#how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-600 py-1"
            >
              How it works
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
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm text-center border border-neutral-200 rounded-xl py-2.5 font-medium hover:bg-neutral-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-sm text-center bg-neutral-900 text-white rounded-xl py-2.5 font-medium hover:bg-neutral-700 transition-colors"
              >
                Create event
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
