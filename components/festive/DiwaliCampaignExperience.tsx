"use client";

import { useEffect, useState } from "react";
import DiwaliWelcomeAnimation from "./DiwaliWelcomeAnimation";
import DiwaliFlashSaleModal from "./DiwaliFlashSaleModal";
import { isDiwaliCampaignActive } from "@/lib/billing/diwali-offer";
import { Sparkles, X, ArrowRight } from "lucide-react";

export default function DiwaliCampaignExperience() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSale, setShowSale] = useState(false);
  const [showFloatingPill, setShowFloatingPill] = useState(false);
  const [pillClosed, setPillClosed] = useState(false);

  useEffect(() => {
    // Only run if campaign is active
    if (!isDiwaliCampaignActive()) {
      return;
    }

    setMounted(true);

    try {
      const welcomeSeen = sessionStorage.getItem("urpass_diwali_welcome_seen") === "1";
      const saleDismissed = sessionStorage.getItem("urpass_diwali_sale_dismissed") === "1";

      if (!welcomeSeen) {
        setShowWelcome(true);
      } else if (!saleDismissed) {
        setShowSale(true);
      } else {
        setShowFloatingPill(true);
      }
    } catch {
      // In restricted storage environments, fail gracefully
      setShowFloatingPill(true);
    }
  }, []);

  // Listen for global custom event so any link/button on the page can re-trigger the modal
  useEffect(() => {
    const handleOpen = () => {
      setShowSale(true);
    };
    window.addEventListener("open-diwali-sale", handleOpen);
    return () => window.removeEventListener("open-diwali-sale", handleOpen);
  }, []);

  if (!mounted) return null;

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    try {
      sessionStorage.setItem("urpass_diwali_welcome_seen", "1");
      const saleDismissed = sessionStorage.getItem("urpass_diwali_sale_dismissed") === "1";
      if (!saleDismissed) {
        setShowSale(true);
      }
    } catch {
      setShowSale(true);
    }
  };

  const handleSaleClose = () => {
    setShowSale(false);
    setShowFloatingPill(true);
    try {
      sessionStorage.setItem("urpass_diwali_sale_dismissed", "1");
    } catch {}
  };

  const handleOpenSale = () => {
    setShowSale(true);
  };

  const handleDismissPill = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPillClosed(true);
  };

  return (
    <>
      {showWelcome && <DiwaliWelcomeAnimation onComplete={handleWelcomeComplete} />}
      {showSale && <DiwaliFlashSaleModal onClose={handleSaleClose} />}

      {/* ── Floating Launcher Badge: Non-intrusive, sleek, docked in bottom-right corner ── */}
      {showFloatingPill && !showSale && !showWelcome && !pillClosed && (
        <aside
          aria-label="Diwali Flash Sale Offer"
          className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="group flex items-center bg-neutral-950 text-white rounded-full pl-3.5 pr-2 py-1.5 shadow-xl border border-amber-400/30 hover:border-amber-400/60 transition-all">
            <button
              type="button"
              onClick={handleOpenSale}
              className="flex items-center gap-2 text-xs font-semibold cursor-pointer pr-1"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-extrabold text-amber-300">70% OFF</span>
              <span className="text-neutral-300 hidden sm:inline">Diwali Special</span>
              <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                DIWALI70
              </span>
              <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-white transition-all ml-0.5" />
            </button>

            <button
              type="button"
              onClick={handleDismissPill}
              aria-label="Dismiss Diwali offer badge"
              className="ml-1 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
