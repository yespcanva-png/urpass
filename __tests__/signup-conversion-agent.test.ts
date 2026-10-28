import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  detectVisitorSegment,
  detectDeviceCategory,
  generateSessionId,
} from "@/lib/conversion/attribution";
import {
  assignVariantDeterministic,
  calculateExperimentStatistics,
} from "@/lib/conversion/experiments";
import {
  getClientCTAConfig,
  DEFAULT_CTA_CATALOG,
} from "@/lib/conversion/cta-engine";
import { hasAnalyticsConsent } from "@/lib/conversion/tracker";

describe("Signup Conversion Agent (Agent 01) — Comprehensive Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Attribution & Visitor Segment Classifier", () => {
    it("classifies college and campus pages into the 'college' segment", () => {
      expect(detectVisitorSegment("/college-events")).toBe("college");
      expect(detectVisitorSegment("/college-fest-ticketing-software")).toBe("college");
      expect(detectVisitorSegment("/qr-check-in-for-college-fests")).toBe("college");
      expect(detectVisitorSegment("/university-society-event-ticketing")).toBe("college");
      expect(detectVisitorSegment("/hackathon-check-in-system")).toBe("college");
      expect(detectVisitorSegment("/freshers-event-ticketing-software")).toBe("college");
    });

    it("classifies corporate, enterprise, and conference pages into the 'corporate' segment", () => {
      expect(detectVisitorSegment("/corporate-visitor-qr-check-in")).toBe("corporate");
      expect(detectVisitorSegment("/business-summit-registration")).toBe("corporate");
      expect(detectVisitorSegment("/ai-conference-management")).toBe("corporate");
      expect(detectVisitorSegment("/event-ticketing-platform-for-conferences")).toBe("corporate");
      expect(detectVisitorSegment("/trade-show-exhibitor-registration")).toBe("corporate");
    });

    it("classifies ticketing and pricing pages into the 'ticketing' segment", () => {
      expect(detectVisitorSegment("/pricing")).toBe("ticketing");
      expect(detectVisitorSegment("/ticket-fee-calculator")).toBe("ticketing");
      expect(detectVisitorSegment("/upi-ticketing-platform")).toBe("ticketing");
      expect(detectVisitorSegment("/zero-commission-event-ticketing")).toBe("ticketing");
      expect(detectVisitorSegment("/razorpay-event-ticketing")).toBe("ticketing");
    });

    it("classifies managed service paths into the 'managed_service' segment", () => {
      expect(detectVisitorSegment("/services/managed-event-setup")).toBe("managed_service");
      expect(detectVisitorSegment("/request-event-setup")).toBe("managed_service");
      expect(detectVisitorSegment("/any-page", "managed_service")).toBe("managed_service");
    });

    it("respects explicit segment parameter overrides", () => {
      expect(detectVisitorSegment("/", "college")).toBe("college");
      expect(detectVisitorSegment("/", "corporate")).toBe("corporate");
      expect(detectVisitorSegment("/", "ticketing")).toBe("ticketing");
      expect(detectVisitorSegment("/", "managed_service")).toBe("managed_service");
    });

    it("falls back gracefully to 'general' segment for generic pages", () => {
      expect(detectVisitorSegment("/")).toBe("general");
      expect(detectVisitorSegment("/features")).toBe("general");
      expect(detectVisitorSegment("/about")).toBe("general");
    });

    it("detects device category accurately without personal fingerprinting", () => {
      const iphoneUa = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";
      const androidUa = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36";
      const ipadUa = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
      const desktopUa = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36";

      expect(detectDeviceCategory(iphoneUa)).toBe("mobile");
      expect(detectDeviceCategory(androidUa)).toBe("mobile");
      expect(detectDeviceCategory(ipadUa)).toBe("tablet");
      expect(detectDeviceCategory(desktopUa)).toBe("desktop");
      expect(detectDeviceCategory(null)).toBe("desktop");
    });

    it("generates crypto-safe session identifiers", () => {
      const s1 = generateSessionId();
      const s2 = generateSessionId();
      expect(s1).toBeDefined();
      expect(s2).toBeDefined();
      expect(s1).not.toBe(s2);
      expect(s1.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("2. Intent-Based CTA Catalog & Optimization Engine", () => {
    it("provides approved intent-based CTAs for each visitor segment", () => {
      const collegeCta = getClientCTAConfig("college");
      expect(collegeCta.primaryCtaLabel).toBe("Create College Event");
      expect(collegeCta.primaryCtaUrl).toContain("segment=college");
      expect(collegeCta.badgeText).toContain("Campus");

      const corporateCta = getClientCTAConfig("corporate");
      expect(corporateCta.primaryCtaLabel).toBe("Start Free / Request Demo");
      expect(corporateCta.badgeText).toContain("Corporate");

      const ticketingCta = getClientCTAConfig("ticketing");
      expect(ticketingCta.primaryCtaLabel).toBe("Create Tickets");
      expect(ticketingCta.secondaryCtaLabel).toBe("Calculate Your Savings");

      const managedCta = getClientCTAConfig("managed_service");
      expect(managedCta.primaryCtaLabel).toBe("Request Managed Setup");
      expect(managedCta.secondaryCtaLabel).toBe("Start Self-Service");
    });

    it("maintains strict distinction between organizer signup and attendee booking", () => {
      for (const segment of Object.keys(DEFAULT_CTA_CATALOG) as Array<keyof typeof DEFAULT_CTA_CATALOG>) {
        const cta = DEFAULT_CTA_CATALOG[segment];
        if (segment === "managed_service") {
          expect(cta.primaryCtaUrl).toContain("/contact");
          expect(cta.secondaryCtaUrl).toContain("/signup");
        } else {
          expect(cta.primaryCtaUrl).toContain("/signup");
          expect(cta.primaryCtaUrl).toContain("intent=organizer_signup");
        }
        // Ensure attendee booking paths are never used as organizer CTAs
        expect(cta.primaryCtaUrl).not.toContain("/apply/");
        expect(cta.primaryCtaUrl).not.toContain("/e/");
      }
    });
  });

  describe("3. Deterministic A/B Testing & Assignment Engine", () => {
    const mockExperiment = {
      id: "exp_101",
      experimentKey: "ab_college_fest_hero",
      variants: [
        {
          id: "var_control",
          experimentId: "exp_101",
          variantKey: "control",
          name: "Original Control",
          weight: 50,
          payload: { primaryCtaLabel: "Create Your Event" },
          isControl: true,
        },
        {
          id: "var_variant_b",
          experimentId: "exp_101",
          variantKey: "variant_b",
          name: "High-Intent Campus CTA",
          weight: 50,
          payload: { primaryCtaLabel: "Create College Event (100 Free Tickets)" },
          isControl: false,
        },
      ],
    };

    it("guarantees stable, sticky assignment for the same session ID", () => {
      const sessionIdA = "sess_user_alpha_12345";
      const sessionIdB = "sess_user_beta_67890";

      const assignmentA1 = assignVariantDeterministic(sessionIdA, mockExperiment);
      const assignmentA2 = assignVariantDeterministic(sessionIdA, mockExperiment);
      expect(assignmentA1.variantKey).toBe(assignmentA2.variantKey);
      expect(assignmentA1.payload).toEqual(assignmentA2.payload);

      const assignmentB1 = assignVariantDeterministic(sessionIdB, mockExperiment);
      const assignmentB2 = assignVariantDeterministic(sessionIdB, mockExperiment);
      expect(assignmentB1.variantKey).toBe(assignmentB2.variantKey);
    });

    it("falls back safely to control if experiment has only control or no variants", () => {
      const emptyExp = { id: "exp_empty", experimentKey: "ab_empty", variants: [] };
      const res = assignVariantDeterministic("sess_xyz", emptyExp);
      expect(res.isControl).toBe(true);
      expect(res.variantKey).toBe("control");
    });
  });

  describe("4. Statistical Significance & Guardrail Engine", () => {
    it("flags insufficient data when sample size or conversions are below guardrail thresholds", () => {
      // 50 visitors each, 2 conversions each
      const stats = calculateExperimentStatistics(50, 2, 50, 4, 25);
      expect(stats.hasSufficientData).toBe(false);
      expect(stats.isStatisticallySignificant).toBe(false);
      expect(stats.recommendation).toBe("continue_testing");
    });

    it("accurately detects statistically significant lift (>95% confidence) on adequate sample sizes", () => {
      // Control: 1,000 visitors, 40 conversions (4.0% CR)
      // Variant B: 1,000 visitors, 75 conversions (7.5% CR)
      const stats = calculateExperimentStatistics(1000, 40, 1000, 75, 25);
      expect(stats.hasSufficientData).toBe(true);
      expect(stats.crControl).toBe(4.0);
      expect(stats.crVariant).toBe(7.5);
      expect(stats.relativeLift).toBeGreaterThan(80);
      expect(stats.confidencePercent).toBeGreaterThanOrEqual(95.0);
      expect(stats.pValue).toBeLessThan(0.05);
      expect(stats.isStatisticallySignificant).toBe(true);
      expect(stats.recommendation).toBe("declare_winner");
    });

    it("recommends rollback if variant performs statistically worse than control", () => {
      // Control: 1,000 visitors, 80 conversions (8.0% CR)
      // Variant B: 1,000 visitors, 35 conversions (3.5% CR)
      const stats = calculateExperimentStatistics(1000, 80, 1000, 35, 25);
      expect(stats.hasSufficientData).toBe(true);
      expect(stats.relativeLift).toBeLessThan(0);
      expect(stats.isStatisticallySignificant).toBe(true);
      expect(stats.recommendation).toBe("rollback");
    });

    it("recommends inconclusive when sample is large but lift is negligible", () => {
      // Control: 2,000 visitors, 100 conversions (5.0% CR)
      // Variant B: 2,000 visitors, 102 conversions (5.1% CR)
      const stats = calculateExperimentStatistics(2000, 100, 2000, 102, 25);
      expect(stats.hasSufficientData).toBe(true);
      expect(stats.isStatisticallySignificant).toBe(false);
      expect(stats.recommendation).toBe("inconclusive");
    });
  });

  describe("5. Cookie Consent & Privacy Safeguards", () => {
    it("respects analytics consent settings from localStorage", () => {
      // Mock window and localStorage
      const storage: Record<string, string> = {};
      vi.stubGlobal("window", {});
      vi.stubGlobal("localStorage", {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => { storage[k] = v; },
      });

      expect(hasAnalyticsConsent()).toBe(false);

      storage["urpass_cookie_consent"] = "essential_only";
      expect(hasAnalyticsConsent()).toBe(false);

      storage["urpass_cookie_consent"] = "all";
      expect(hasAnalyticsConsent()).toBe(true);
    });
  });

  describe("6. Server Conversion Tracking & Validation", () => {
    it("rejects event payloads missing eventName or pageSlug", async () => {
      const { recordServerConversion } = await import("@/lib/conversion/server");
      const res1 = await recordServerConversion({ eventName: "" as any, pageSlug: "/college-events" });
      expect(res1.error).toContain("Missing required eventName or pageSlug");

      const res2 = await recordServerConversion({ eventName: "landing_page_view", pageSlug: "" });
      expect(res2.error).toContain("Missing required eventName or pageSlug");
    });
  });

  describe("7. Ops Security & Human Authorization Guardrails", () => {
    it("rejects recommendation approvals when operator session is invalid", async () => {
      const { approveRecommendationAction, rejectRecommendationAction, triggerAgentAnalysisAction, rollbackExperimentAction } = await import("@/app/actions/conversion-dashboard");
      
      const approveRes = await approveRecommendationAction("rec-123");
      expect(approveRes.success).toBe(false);
      expect(approveRes.error).toBe("Unauthorized");

      const rejectRes = await rejectRecommendationAction("rec-123");
      expect(rejectRes.success).toBe(false);
      expect(rejectRes.error).toBe("Unauthorized");

      const runRes = await triggerAgentAnalysisAction();
      expect(runRes.success).toBe(false);
      expect(runRes.error).toBe("Unauthorized");

      const rollbackRes = await rollbackExperimentAction("exp-123");
      expect(rollbackRes.success).toBe(false);
      expect(rollbackRes.error).toBe("Unauthorized");
    });
  });
});
