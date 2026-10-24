import { describe, it, expect } from "vitest";
import {
  SELF_SERVICE_PLANS,
  REMOTE_MANAGED_PACKAGES,
  REMOTE_MANAGED_SERVICE_BOUNDARIES,
} from "@/lib/billing/catalog";
import {
  calculateGst,
  isValidGstin,
  getStateCodeFromGstin,
  formatInr,
} from "@/lib/billing/tax";

describe("UrPass Production Pricing & Billing Architecture Suite", () => {
  describe("Phase 1: Product Catalog Integrity", () => {
    it("should configure all 4 Self-Service subscription plans accurately", () => {
      expect(SELF_SERVICE_PLANS.length).toBe(4);
      const slugs = SELF_SERVICE_PLANS.map((p) => p.slug);
      expect(slugs).toEqual(["free", "starter", "pro", "business"]);

      const free = SELF_SERVICE_PLANS.find((p) => p.slug === "free")!;
      expect(free.priceMonthlyInr).toBe(0);
      expect(free.limits.activeEvents).toBe(1);
      expect(free.limits.attendeesPerEvent).toBe(100);
      expect(free.limits.teamSeats).toBe(1);

      const starter = SELF_SERVICE_PLANS.find((p) => p.slug === "starter")!;
      expect(starter.priceMonthlyInr).toBe(499);
      expect(starter.priceMonthlyPaise).toBe(49900);
      expect(starter.limits.activeEvents).toBe(3);
      expect(starter.limits.attendeesPerEvent).toBe(1000);
      expect(starter.limits.teamSeats).toBe(2);

      const pro = SELF_SERVICE_PLANS.find((p) => p.slug === "pro")!;
      expect(pro.priceMonthlyInr).toBe(999);
      expect(pro.priceMonthlyPaise).toBe(99900);
      expect(pro.limits.activeEvents).toBe(10);
      expect(pro.limits.attendeesPerEvent).toBe(5000);
      expect(pro.limits.teamSeats).toBe(5);

      const business = SELF_SERVICE_PLANS.find((p) => p.slug === "business")!;
      expect(business.priceMonthlyInr).toBe(2499);
      expect(business.priceMonthlyPaise).toBe(249900);
      expect(business.limits.activeEvents).toBe(30);
      expect(business.limits.attendeesPerEvent).toBe(15000);
      expect(business.limits.teamSeats).toBe(15);
    });

    it("should configure all 4 Remote Managed Service packages accurately", () => {
      expect(REMOTE_MANAGED_PACKAGES.length).toBe(4);
      const codes = REMOTE_MANAGED_PACKAGES.map((p) => p.code);
      expect(codes).toEqual(["essential", "pro", "premium", "enterprise"]);

      const essential = REMOTE_MANAGED_PACKAGES.find((p) => p.code === "essential")!;
      expect(essential.priceInr).toBe(2999);
      expect(essential.pricePaise).toBe(299900);
      expect(essential.maxAttendees).toBe(1000);
      expect(essential.depositPercentage).toBe(50);
      expect(essential.balancePercentage).toBe(50);
      expect(essential.includedTrainingSessions).toBe(1);

      const pro = REMOTE_MANAGED_PACKAGES.find((p) => p.code === "pro")!;
      expect(pro.priceInr).toBe(7999);
      expect(pro.pricePaise).toBe(799900);
      expect(pro.maxAttendees).toBe(5000);
      expect(pro.depositPercentage).toBe(50);
      expect(pro.balancePercentage).toBe(50);
      expect(pro.includedTrainingSessions).toBe(2);

      const premium = REMOTE_MANAGED_PACKAGES.find((p) => p.code === "premium")!;
      expect(premium.priceInr).toBe(14999);
      expect(premium.pricePaise).toBe(1499900);
      expect(premium.maxAttendees).toBe(15000);
      expect(premium.depositPercentage).toBe(50);
      expect(premium.balancePercentage).toBe(50);
      expect(premium.includedTrainingSessions).toBe(3);

      const enterprise = REMOTE_MANAGED_PACKAGES.find((p) => p.code === "enterprise")!;
      expect(enterprise.priceInr).toBe(0);
      expect(enterprise.maxAttendees).toBe("unlimited");
    });
  });

  describe("Phase 6: GST & Tax Engine Calculations", () => {
    it("should calculate exact 18% GST for Free tier (₹0)", () => {
      const tax = calculateGst(0);
      expect(tax.baseAmountInr).toBe(0);
      expect(tax.taxAmountInr).toBe(0);
      expect(tax.totalAmountInr).toBe(0);
      expect(tax.isGstExempt).toBe(true);
    });

    it("should calculate exact 18% GST for Starter tier (₹499 -> ₹588.82)", () => {
      const tax = calculateGst(49900);
      expect(tax.baseAmountPaise).toBe(49900);
      expect(tax.taxAmountPaise).toBe(8982);
      expect(tax.totalAmountPaise).toBe(58882);
      expect(tax.baseAmountInr).toBe(499);
      expect(tax.taxAmountInr).toBe(89.82);
      expect(tax.totalAmountInr).toBe(588.82);
    });

    it("should calculate exact 18% GST for Pro tier (₹999 -> ₹1,178.82)", () => {
      const tax = calculateGst(99900);
      expect(tax.baseAmountPaise).toBe(99900);
      expect(tax.taxAmountPaise).toBe(17982);
      expect(tax.totalAmountPaise).toBe(117882);
      expect(tax.totalAmountInr).toBe(1178.82);
    });

    it("should calculate exact 18% GST for Business tier (₹2,499 -> ₹2,948.82)", () => {
      const tax = calculateGst(249900);
      expect(tax.baseAmountPaise).toBe(249900);
      expect(tax.taxAmountPaise).toBe(44982);
      expect(tax.totalAmountPaise).toBe(294882);
      expect(tax.totalAmountInr).toBe(2948.82);
    });

    it("should calculate exact 18% GST for Essential Managed (₹2,999 -> ₹3,538.82)", () => {
      const tax = calculateGst(299900);
      expect(tax.baseAmountPaise).toBe(299900);
      expect(tax.taxAmountPaise).toBe(53982);
      expect(tax.totalAmountPaise).toBe(353882);
      expect(tax.totalAmountInr).toBe(3538.82);
    });

    it("should calculate exact 18% GST for Pro Managed (₹7,999 -> ₹9,438.82)", () => {
      const tax = calculateGst(799900);
      expect(tax.baseAmountPaise).toBe(799900);
      expect(tax.taxAmountPaise).toBe(143982);
      expect(tax.totalAmountPaise).toBe(943882);
      expect(tax.totalAmountInr).toBe(9438.82);
    });

    it("should calculate exact 18% GST for Premium Managed (₹14,999 -> ₹17,698.82)", () => {
      const tax = calculateGst(1499900);
      expect(tax.baseAmountPaise).toBe(1499900);
      expect(tax.taxAmountPaise).toBe(269982);
      expect(tax.totalAmountPaise).toBe(1769882);
      expect(tax.totalAmountInr).toBe(17698.82);
    });

    it("should split taxes into CGST & SGST for intra-state transactions", () => {
      const tax = calculateGst(49900, { customerStateCode: "33", merchantStateCode: "33" });
      expect(tax.cgstPaise).toBe(4491);
      expect(tax.sgstPaise).toBe(4491);
      expect(tax.cgstPaise! + tax.sgstPaise!).toBe(8982);
    });

    it("should apply IGST for inter-state transactions", () => {
      const tax = calculateGst(49900, { customerStateCode: "29", merchantStateCode: "33" }); // Karnataka -> Tamil Nadu
      expect(tax.igstPaise).toBe(8982);
    });

    it("should validate Indian GSTIN format correctly", () => {
      expect(isValidGstin("33AAAAA0000A1Z5")).toBe(true);
      expect(isValidGstin("29ABCDE1234F1Z5")).toBe(true);
      expect(isValidGstin("INVALID_GST")).toBe(false);
      expect(isValidGstin("")).toBe(false);
      expect(isValidGstin(null)).toBe(false);

      expect(getStateCodeFromGstin("33AAAAA0000A1Z5")).toBe("33");
      expect(getStateCodeFromGstin("29ABCDE1234F1Z5")).toBe("29");
    });
  });

  describe("Phase 8: Strict Remote Managed Service Boundaries", () => {
    it("should never promise on-site event staff or venue physical attendance", () => {
      const exclusions = REMOTE_MANAGED_SERVICE_BOUNDARIES.exclusions.join(" ").toLowerCase();
      expect(exclusions).toContain("no on-site");
      expect(exclusions).toContain("no physical hardware");
      expect(exclusions).toContain("no venue security");

      for (const pkg of REMOTE_MANAGED_PACKAGES) {
        const text = [pkg.tagline, ...pkg.features].join(" ").toLowerCase();
        expect(text).not.toContain("on-site staff");
        expect(text).not.toContain("metal detector");
        expect(text).not.toContain("physical bouncer");
      }
    });

    it("should require 50% advance deposit and 50% balance before launch", () => {
      for (const pkg of REMOTE_MANAGED_PACKAGES) {
        expect(pkg.depositPercentage).toBe(50);
        expect(pkg.balancePercentage).toBe(50);
      }
    });
  });

  describe("Formatting Utilities", () => {
    it("should format INR currencies cleanly", () => {
      expect(formatInr(0)).toBe("₹0");
      expect(formatInr(499)).toBe("₹499");
      expect(formatInr(588.82)).toBe("₹588.82");
      expect(formatInr(2499)).toBe("₹2,499");
    });
  });
});
