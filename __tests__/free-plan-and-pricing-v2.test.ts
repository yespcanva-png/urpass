import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveUserSubscriptionAccess } from "@/lib/billing/entitlement-resolver";
import {
  STATIC_V2_PLANS,
  evaluateOfferEligibility,
  resolveCheckoutPrice,
} from "@/lib/billing/engine/pricing-engine";
import { V2_PLAN_LIMITS } from "@/lib/billing/engine/entitlements-engine";
import { ENTITLEMENTS, canUseFeature } from "@/lib/plan";

describe("UrPass 7-Day Growth & Monetization: Free Forever + Standard SaaS Tiers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Free Forever Subscription Access & Onboarding Exemption", () => {
    it("requires un-onboarded new user to choose a plan before gaining organizer access", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      };

      const result = await resolveUserSubscriptionAccess({
        supabase: mockSupabase as any,
        user: { id: "brand-new-user-789", created_at: new Date().toISOString() },
      });

      expect(result.hasOrganizerAccess).toBe(false);
      expect(result.shouldRedirectToSubscriptionOnboarding).toBe(true);
      expect(result.state).toBe("onboarding_required");
    });

    it("grants immediate organizer access on Free Forever to new users after plan selection without requiring payment details", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      };

      const result = await resolveUserSubscriptionAccess({
        supabase: mockSupabase as any,
        user: { id: "new-user-123", created_at: new Date().toISOString(), user_metadata: { plan_selected: true } },
      });

      expect(result.hasOrganizerAccess).toBe(true);
      expect(result.shouldRedirectToSubscriptionOnboarding).toBe(false);
      expect(result.shouldRedirectToBilling).toBe(false);
      expect(result.planSlug).toBe("free");
      expect(result.state).toBe("free_forever_active");
      expect(result.expiresAt).toBeNull();
    });

    it("retains Free Forever access for users with explicit free provider/subscription rows", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockImplementation(() => {
          return Promise.resolve({
            data: {
              status: "active",
              provider: "free",
              billing_cycle: null,
              plan: { slug: "free" },
            },
          });
        }),
      };

      const result = await resolveUserSubscriptionAccess({
        supabase: mockSupabase as any,
        user: { id: "existing-free-user-456", created_at: "2026-09-01T00:00:00.000Z" },
      });

      expect(result.hasOrganizerAccess).toBe(true);
      expect(result.shouldRedirectToSubscriptionOnboarding).toBe(false);
      expect(result.planSlug).toBe("free");
      expect(result.state).toBe("free_forever_active");
    });
  });

  describe("Tier Limits & Entitlements Specification", () => {
    it("enforces Free plan limits: 1 active event, 100 registrations/month, 1 team seat", () => {
      expect(ENTITLEMENTS.FREE.eventsPerMonth).toBe(1);
      expect(ENTITLEMENTS.FREE.registrationsPerMonth).toBe(100);
      expect(ENTITLEMENTS.FREE.organizerSeats).toBe(1);

      expect(V2_PLAN_LIMITS.free.eventsPerMonth).toBe(1);
      expect(V2_PLAN_LIMITS.free.registrationsPerMonth).toBe(100);
      expect(V2_PLAN_LIMITS.free.organizerSeats).toBe(1);

      // Free plan does not have advanced features
      expect(canUseFeature("free", "customPassDesign")).toBe(false);
      expect(canUseFeature("free", "removeBranding")).toBe(false);
      expect(canUseFeature("free", "apiAccess")).toBe(false);
    });

    it("enforces Starter plan limits: 3 active events, 500 registrations/month, 2 team seats", () => {
      expect(ENTITLEMENTS.STARTER.eventsPerMonth).toBe(3);
      expect(ENTITLEMENTS.STARTER.registrationsPerMonth).toBe(500);
      expect(ENTITLEMENTS.STARTER.organizerSeats).toBe(2);

      expect(V2_PLAN_LIMITS.starter.eventsPerMonth).toBe(3);
      expect(V2_PLAN_LIMITS.starter.registrationsPerMonth).toBe(500);
      expect(V2_PLAN_LIMITS.starter.organizerSeats).toBe(2);

      // Starter has CSV and custom registration, but not API or custom pass design
      expect(canUseFeature("starter", "csvImport")).toBe(true);
      expect(canUseFeature("starter", "csvExport")).toBe(true);
      expect(canUseFeature("starter", "customPassDesign")).toBe(false);
      expect(canUseFeature("starter", "apiAccess")).toBe(false);
    });

    it("enforces Pro plan limits: 10 active events, 2,500 registrations/month, 5 team seats, session attendance", () => {
      expect(ENTITLEMENTS.PRO.eventsPerMonth).toBe(10);
      expect(ENTITLEMENTS.PRO.registrationsPerMonth).toBe(2500);
      expect(ENTITLEMENTS.PRO.organizerSeats).toBe(5);

      expect(V2_PLAN_LIMITS.pro.eventsPerMonth).toBe(10);
      expect(V2_PLAN_LIMITS.pro.registrationsPerMonth).toBe(2500);
      expect(V2_PLAN_LIMITS.pro.organizerSeats).toBe(5);

      // Pro has pass design, branding removal, session attendance, but API & webhooks are reserved for Business
      expect(canUseFeature("pro", "customPassDesign")).toBe(true);
      expect(canUseFeature("pro", "removeBranding")).toBe(true);
      expect(canUseFeature("pro", "advancedAnalytics")).toBe(true);
      expect(canUseFeature("pro", "apiAccess")).toBe(false);
      expect(canUseFeature("pro", "webhooks")).toBe(false);
    });

    it("enforces Business plan limits: Unlimited events, 10,000 registrations/month, 15 seats, API & webhooks", () => {
      expect(ENTITLEMENTS.BUSINESS.registrationsPerMonth).toBe(10000);
      expect(ENTITLEMENTS.BUSINESS.organizerSeats).toBe(15);

      expect(V2_PLAN_LIMITS.business.registrationsPerMonth).toBe(10000);
      expect(V2_PLAN_LIMITS.business.organizerSeats).toBe(15);

      // Business unlocks API, webhooks, cross-event analytics, advanced permissions
      expect(canUseFeature("business", "apiAccess")).toBe(true);
      expect(canUseFeature("business", "webhooks")).toBe(true);
      expect(canUseFeature("business", "crossEventAnalytics")).toBe(true);
      expect(canUseFeature("business", "advancedPermissions")).toBe(true);
    });
  });

  describe("Retirement of ₹29 Offer & Transparent Subscription Pricing", () => {
    it("provides Free Forever catalog entry at ₹0 / £0", () => {
      const freePlan = STATIC_V2_PLANS.free;
      expect(freePlan.name).toBe("Free Forever");
      expect(freePlan.inrMonthly).toBe(0);
      expect(freePlan.gbpMonthly).toBe(0);
    });

    it("maintains standard transparent pricing across Starter, Pro, and Business", () => {
      expect(STATIC_V2_PLANS.starter.inrMonthly).toBe(49900); // ₹499
      expect(STATIC_V2_PLANS.starter.inrAnnual).toBe(499000); // ₹4,990

      expect(STATIC_V2_PLANS.pro.inrMonthly).toBe(99900); // ₹999
      expect(STATIC_V2_PLANS.pro.inrAnnual).toBe(999000); // ₹9,990

      expect(STATIC_V2_PLANS.business.inrMonthly).toBe(249900); // ₹2,499
      expect(STATIC_V2_PLANS.business.inrAnnual).toBe(2499000); // ₹24,990
    });

    it("evaluates ₹29 intro offer eligibility as false (retired)", async () => {
      const result = await evaluateOfferEligibility({
        userId: "user-new",
        planSlug: "starter",
        billingCycle: "monthly",
        currency: "INR",
      });

      expect(result.isEligibleForIntroOffer).toBe(false);
      expect(result.introOffer).toBeNull();
      expect(result.reason).toContain("retired");
    });

    it("resolves checkout price at standard full amount instead of promotional ₹29", async () => {
      const starterPrice = await resolveCheckoutPrice({
        userId: "user-new",
        planSlug: "starter",
        billingCycle: "monthly",
        currency: "INR",
      });

      expect(starterPrice.amountPaise).toBe(49900); // ₹499
      expect(starterPrice.isIntroCycle).toBe(false);

      const proPrice = await resolveCheckoutPrice({
        userId: "user-new",
        planSlug: "pro",
        billingCycle: "monthly",
        currency: "INR",
      });

      expect(proPrice.amountPaise).toBe(99900); // ₹999
      expect(proPrice.isIntroCycle).toBe(false);
    });
  });
});
