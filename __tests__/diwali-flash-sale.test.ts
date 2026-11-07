import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  DIWALI_COUPON_CODE,
  DIWALI_DISCOUNT_PERCENT,
  DIWALI_CAMPAIGN_START,
  DIWALI_CAMPAIGN_END,
  isDiwaliCampaignActive,
  getDiwaliRemainingMs,
  isDiwaliEligiblePlan,
  computeDiwaliDiscountAmounts,
} from "@/lib/billing/diwali-offer";
import { validateCoupon } from "@/app/actions/coupons";

// Mock Supabase
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "test-user-123" } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }), // simulate DB without coupon to test fallback
    }),
  }),
}));

describe("UrPass Special Diwali Campaign (DIWALI70)", () => {
  const originalEnv = process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED;
    }
  });

  describe("1. Campaign Timing & Active Window", () => {
    it("is active during the 48-hour campaign window (Nov 7 12:00 PM IST to Nov 9 12:00 PM IST 2026)", () => {
      // Nov 7, 2026, 12:30 PM IST (Active)
      const duringCampaign = new Date("2026-11-07T12:30:00+05:30");
      expect(isDiwaliCampaignActive(duringCampaign)).toBe(true);

      // Nov 8, 2026, 04:00 PM IST (Active)
      const midCampaign = new Date("2026-11-08T16:00:00+05:30");
      expect(isDiwaliCampaignActive(midCampaign)).toBe(true);
    });

    it("is inactive before the campaign start date", () => {
      // Nov 7, 2026, 11:59 AM IST (Before start)
      const beforeStart = new Date("2026-11-07T11:59:00+05:30");
      expect(isDiwaliCampaignActive(beforeStart)).toBe(false);
    });

    it("is inactive after the campaign end date (Nov 9 12:00 PM IST)", () => {
      // Nov 9, 2026, 12:01 PM IST (After end)
      const afterEnd = new Date("2026-11-09T12:01:00+05:30");
      expect(isDiwaliCampaignActive(afterEnd)).toBe(false);
    });

    it("honors admin feature flag override", () => {
      process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = "false";
      const duringCampaign = new Date("2026-11-08T12:00:00+05:30");
      expect(isDiwaliCampaignActive(duringCampaign)).toBe(false);

      process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = "true";
      const afterCampaign = new Date("2026-11-15T12:00:00+05:30");
      expect(isDiwaliCampaignActive(afterCampaign)).toBe(true);
    });

    it("calculates countdown remaining milliseconds accurately against fixed server expiry", () => {
      // 1 hour before expiry
      const oneHourBefore = new Date(new Date(DIWALI_CAMPAIGN_END).getTime() - 3600 * 1000);
      expect(getDiwaliRemainingMs(oneHourBefore)).toBe(3600 * 1000);

      // After expiry
      const pastExpiry = new Date(new Date(DIWALI_CAMPAIGN_END).getTime() + 1000);
      expect(getDiwaliRemainingMs(pastExpiry)).toBe(0);
    });
  });

  describe("2. Plan Eligibility & Discount Calculation", () => {
    it("identifies starter, pro, and business as eligible plans", () => {
      expect(isDiwaliEligiblePlan("starter")).toBe(true);
      expect(isDiwaliEligiblePlan("pro")).toBe(true);
      expect(isDiwaliEligiblePlan("business")).toBe(true);
      expect(isDiwaliEligiblePlan("free")).toBe(false);
      expect(isDiwaliEligiblePlan("founder")).toBe(false);
    });

    it("calculates exact 70% off on first billing cycle with correct GST and renewal pricing", () => {
      // Starter: ₹499/month
      const starterResult = computeDiwaliDiscountAmounts(499, "starter", "monthly");
      expect(starterResult.discountValue).toBe(70);
      expect(starterResult.discountAmountRupees).toBe(349.3);
      expect(starterResult.discountedAmountRupees).toBe(149.7);
      expect(starterResult.durationMonths).toBe(1);
      expect(starterResult.renewalTotalRupees).toBe(Math.round(499 * 1.18 * 100) / 100);

      // Pro: ₹999/month
      const proResult = computeDiwaliDiscountAmounts(999, "pro", "monthly");
      expect(proResult.discountAmountRupees).toBe(699.3);
      expect(proResult.discountedAmountRupees).toBe(299.7);
      expect(proResult.renewalTotalRupees).toBe(Math.round(999 * 1.18 * 100) / 100);

      // Business: ₹2,499/month
      const businessResult = computeDiwaliDiscountAmounts(2499, "business", "monthly");
      expect(businessResult.discountAmountRupees).toBe(1749.3);
      expect(businessResult.discountedAmountRupees).toBe(749.7);
      expect(businessResult.renewalTotalRupees).toBe(Math.round(2499 * 1.18 * 100) / 100);
    });
  });

  describe("3. Server Action Validation (validateCoupon)", () => {
    it("successfully validates DIWALI70 during campaign window", async () => {
      process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = "true";
      const result = await validateCoupon("DIWALI70", "pro", "monthly");

      expect("valid" in result && result.valid).toBe(true);
      if ("coupon" in result) {
        expect(result.coupon.code).toBe(DIWALI_COUPON_CODE);
        expect(result.coupon.discountValue).toBe(70);
        expect(result.coupon.discountedAmountRupees).toBe(299.7);
        expect(result.coupon.durationMonths).toBe(1);
      }
    });

    it("rejects DIWALI70 when campaign is inactive", async () => {
      process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = "false";
      const result = await validateCoupon("DIWALI70", "pro", "monthly");

      expect("error" in result).toBe(true);
      if ("error" in result) {
        expect(result.error).toContain("Diwali");
      }
    });

    it("rejects DIWALI70 for ineligible plan", async () => {
      process.env.NEXT_PUBLIC_DIWALI_CAMPAIGN_ENABLED = "true";
      const result = await validateCoupon("DIWALI70", "founder", "monthly");

      expect("error" in result).toBe(true);
      if ("error" in result) {
        expect(result.error).toContain("Starter, Pro, and Business");
      }
    });
  });
});

