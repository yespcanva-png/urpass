import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiwaliFlashSaleModal from "@/components/festive/DiwaliFlashSaleModal";
import DiwaliCampaignExperience from "@/components/festive/DiwaliCampaignExperience";
import * as diwaliOffer from "@/lib/billing/diwali-offer";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/lib/analytics/client", () => ({
  trackLifecycleEvent: vi.fn(),
}));

describe("Special Diwali Campaign Redesigned UI", () => {
  const originalEnv = process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = "true";
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED;
    }
  });

  describe("DiwaliFlashSaleModal", () => {
    it("renders clean, professional modal with exact requested campaign copy and pricing", () => {
      const handleClose = vi.fn();
      render(<DiwaliFlashSaleModal onClose={handleClose} />);

      // Campaign badge & title
      expect(screen.getByText("Special Diwali Campaign")).toBeInTheDocument();
      expect(screen.getByText("70% OFF")).toBeInTheDocument();
      expect(screen.getByText(/all UrPass plans/i)).toBeInTheDocument();
      expect(screen.getByText(/48 hours only · Valid on your first payment/i)).toBeInTheDocument();

      // Server verified countdown
      expect(screen.getByText("Offer Ends in (Server Verified)")).toBeInTheDocument();
      expect(screen.getByText("Days")).toBeInTheDocument();
      expect(screen.getByText("Hours")).toBeInTheDocument();
      expect(screen.getByText("Mins")).toBeInTheDocument();
      expect(screen.getByText("Secs")).toBeInTheDocument();

      // 3 Tier interactive pricing cards
      expect(screen.getByText("Starter")).toBeInTheDocument();
      expect(screen.getByText("₹149")).toBeInTheDocument();
      expect(screen.getByText("₹499")).toBeInTheDocument();
      expect(screen.getByText("Save ₹350")).toBeInTheDocument();

      expect(screen.getByText("POPULAR")).toBeInTheDocument();
      expect(screen.getByText("Pro")).toBeInTheDocument();
      expect(screen.getByText("₹299")).toBeInTheDocument();
      expect(screen.getByText("₹999")).toBeInTheDocument();
      expect(screen.getByText("Save ₹700")).toBeInTheDocument();

      expect(screen.getByText("Business")).toBeInTheDocument();
      expect(screen.getByText("₹749")).toBeInTheDocument();
      expect(screen.getByText("₹2,499")).toBeInTheDocument();
      expect(screen.getByText("Save ₹1,750")).toBeInTheDocument();

      // Coupon callout & terms
      expect(screen.getByText("DIWALI70")).toBeInTheDocument();
      expect(screen.getByText(/Standard renewal pricing applies on subsequent cycles/i)).toBeInTheDocument();

      // Action CTAs
      expect(screen.getByText("Claim My 70% Discount")).toBeInTheDocument();
      expect(screen.getByText("Maybe later")).toBeInTheDocument();
    });

    it("allows interactive plan switching and claims selected plan", () => {
      const handleClose = vi.fn();
      render(<DiwaliFlashSaleModal onClose={handleClose} />);

      // Click Starter plan button
      const starterButton = screen.getByText("Starter").closest("button");
      expect(starterButton).not.toBeNull();
      fireEvent.click(starterButton!);

      // Click Claim CTA
      const claimButton = screen.getByText("Claim My 70% Discount");
      fireEvent.click(claimButton);

      expect(mockPush).toHaveBeenCalledWith("/pricing?coupon=DIWALI70&plan=starter");
      expect(sessionStorage.getItem("urpass_diwali_sale_dismissed")).toBe("1");
      expect(handleClose).toHaveBeenCalled();
    });

    it("dismisses cleanly without navigating when 'Maybe later' is clicked", () => {
      const handleClose = vi.fn();
      render(<DiwaliFlashSaleModal onClose={handleClose} />);

      const laterButton = screen.getByText("Maybe later");
      fireEvent.click(laterButton);

      expect(mockPush).not.toHaveBeenCalled();
      expect(sessionStorage.getItem("urpass_diwali_sale_dismissed")).toBe("1");
      expect(handleClose).toHaveBeenCalled();
    });

    it("dismisses cleanly when clicking the close (X) button", () => {
      const handleClose = vi.fn();
      render(<DiwaliFlashSaleModal onClose={handleClose} />);

      const closeButton = screen.getByLabelText("Close Diwali sale offer");
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalled();
      expect(sessionStorage.getItem("urpass_diwali_sale_dismissed")).toBe("1");
    });
  });

  describe("DiwaliCampaignExperience", () => {
    it("does NOT render full-screen blocking welcome animation", () => {
      const { container } = render(<DiwaliCampaignExperience />);
      expect(screen.queryByLabelText("Happy Diwali from UrPass")).toBeNull();
    });

    it("renders floating launcher badge when sale was dismissed", () => {
      sessionStorage.setItem("urpass_diwali_sale_dismissed", "1");
      render(<DiwaliCampaignExperience />);

      expect(screen.getByLabelText("Diwali Flash Sale Offer")).toBeInTheDocument();
      expect(screen.getByText("70% OFF")).toBeInTheDocument();
      expect(screen.getByText("DIWALI70")).toBeInTheDocument();
    });

    it("opens the modal when clicking the floating launcher pill", () => {
      sessionStorage.setItem("urpass_diwali_sale_dismissed", "1");
      render(<DiwaliCampaignExperience />);

      const launcherButton = screen.getByText("70% OFF").closest("button");
      expect(launcherButton).not.toBeNull();
      fireEvent.click(launcherButton!);

      expect(screen.getByText("Special Diwali Campaign")).toBeInTheDocument();
    });
  });
});
