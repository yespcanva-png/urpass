"use client";

import { useEffect, useState } from "react";
import DiwaliWelcomeAnimation from "./DiwaliWelcomeAnimation";
import DiwaliFlashSaleModal from "./DiwaliFlashSaleModal";
import { isDiwaliCampaignActive } from "@/lib/billing/diwali-offer";

export default function DiwaliCampaignExperience() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSale, setShowSale] = useState(false);

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
      }
    } catch {
      // In restricted storage environments, fail gracefully without blocking
    }
  }, []);

  if (!mounted) return null;

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    try {
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
  };

  return (
    <>
      {showWelcome && <DiwaliWelcomeAnimation onComplete={handleWelcomeComplete} />}
      {showSale && <DiwaliFlashSaleModal onClose={handleSaleClose} />}
    </>
  );
}

