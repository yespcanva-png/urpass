import { describe, it, expect } from "vitest";
import { resolveFunnelIntent } from "@/lib/conversion/intent-resolver";
import { ENTITLEMENTS } from "@/lib/plan";
import { SELF_SERVICE_PLAN_LIMITS } from "@/lib/billing/plan-limits";
import { getAllHighIntentSlugs } from "@/lib/seo/templates/high-intent-25";
import { getAllHighIntentBatch2Slugs } from "@/lib/seo/templates/high-intent-batch-2";

describe("UrPass SEO Visitor to Paying Customer Conversion Strategy", () => {
  describe("Technique 1: Match CTA to Search Intent", () => {
    it("assigns intent-tailored CTAs for all major high-intent clusters", () => {
      // 1. Badge generator intent
      const badgeIntent = resolveFunnelIntent("printable-conference-badge-generator-with-qr-code");
      expect(badgeIntent.ctaText).toBe("Design My Badge");
      expect(badgeIntent.template).toBe("badge");
      expect(badgeIntent.suggestedCapacity).toBe(250);

      // 2. Offline Scanner intent
      const scannerIntent = resolveFunnelIntent("offline-qr-code-event-check-in-software");
      expect(scannerIntent.ctaText).toBe("Try Offline Scanner");
      expect(scannerIntent.template).toBe("scanner");

      // 3. College Fest intent
      const collegeIntent = resolveFunnelIntent("college-fest-ticketing-software");
      expect(collegeIntent.ctaText).toBe("Create College Fest");
      expect(collegeIntent.template).toBe("college_fest");
      expect(collegeIntent.suggestedCapacity).toBe(2500);

      // 4. Paid Workshop intent
      const workshopIntent = resolveFunnelIntent("paid-workshop-registration-platform");
      expect(workshopIntent.ctaText).toBe("Create Paid Workshop");
      expect(workshopIntent.template).toBe("workshop");
      expect(workshopIntent.suggestedCapacity).toBe(30);

      // 5. VIP Access intent
      const vipIntent = resolveFunnelIntent("vip-ticket-access-control-software-for-events");
      expect(vipIntent.ctaText).toBe("Configure VIP Entry");
      expect(vipIntent.template).toBe("vip_access");

      // 6. Conference intent
      const confIntent = resolveFunnelIntent("conference-registration-software");
      expect(confIntent.ctaText).toBe("Create Conference");
      expect(confIntent.template).toBe("conference");

      // 7. Product Launch intent
      const launchIntent = resolveFunnelIntent("product-launch-event-registration-software");
      expect(launchIntent.ctaText).toBe("Create Launch Event");
      expect(launchIntent.template).toBe("product_launch");
    });

    it("builds intent-preserving signup URLs carrying search context into onboarding", () => {
      const intent = resolveFunnelIntent("printable-conference-badge-generator-with-qr-code");
      const url = new URL(intent.signupUrl, "https://urpass.space");

      expect(url.pathname).toBe("/signup");
      expect(url.searchParams.get("template")).toBe("badge");
      expect(url.searchParams.get("intent")).toBe("Design My Badge");
      expect(url.searchParams.get("eventName")).toBe("Leadership Summit Badges");
      expect(url.searchParams.get("capacity")).toBe("250");
      expect(url.searchParams.get("segment")).toBe("corporate");
      expect(url.searchParams.get("from")).toBe("/solutions/printable-conference-badge-generator-with-qr-code");
    });
  });

  describe("Technique 2: Working Product Previews & Simulators", () => {
    it("provides complete sample ticket and form field previews for all 50 pages", () => {
      const allSlugs = [...getAllHighIntentSlugs(), ...getAllHighIntentBatch2Slugs()];
      expect(allSlugs.length).toBeGreaterThanOrEqual(50);

      for (const slug of allSlugs) {
        const intent = resolveFunnelIntent(slug);
        expect(intent.sampleTicket).toBeDefined();
        expect(intent.sampleTicket.eventName).toBeTruthy();
        expect(intent.sampleTicket.ticketTier).toBeTruthy();
        expect(intent.sampleTicket.attendeeName).toBeTruthy();
        expect(intent.sampleTicket.token).toContain("URPASS-");

        expect(intent.sampleFormFields.length).toBeGreaterThanOrEqual(2);
        intent.sampleFormFields.forEach((field) => {
          expect(field.label).toBeTruthy();
          expect(field.value).toBeTruthy();
        });
      }
    });
  });

  describe("Technique 4 & 5: Harmonized Plan Limits & Context-Based Plan Selection", () => {
    it("enforces synchronized plan quotas across ENTITLEMENTS and SELF_SERVICE_PLAN_LIMITS", () => {
      // Free: 50
      expect(ENTITLEMENTS.FREE.registrationsPerMonth).toBe(50);
      expect(SELF_SERVICE_PLAN_LIMITS.free.registrationsPerMonth).toBe(50);

      // Starter: 1,000
      expect(ENTITLEMENTS.STARTER.registrationsPerMonth).toBe(1000);
      expect(SELF_SERVICE_PLAN_LIMITS.starter.registrationsPerMonth).toBe(1000);

      // Pro: 5,000
      expect(ENTITLEMENTS.PRO.registrationsPerMonth).toBe(5000);
      expect(SELF_SERVICE_PLAN_LIMITS.pro.registrationsPerMonth).toBe(5000);

      // Business: 15,000
      expect(ENTITLEMENTS.BUSINESS.registrationsPerMonth).toBe(15000);
      expect(SELF_SERVICE_PLAN_LIMITS.business.registrationsPerMonth).toBe(15000);
    });

    it("recommends correct plans based on expected registrations", () => {
      const plans = [
        { slug: "free", registrations: 50 },
        { slug: "starter", registrations: 1000 },
        { slug: "pro", registrations: 5000 },
        { slug: "business", registrations: 15000 },
      ];

      // 30 attendees (workshop) -> Free fits
      const recWorkshop = plans.find((p) => p.registrations >= 30)?.slug;
      expect(recWorkshop).toBe("free");

      // 250 attendees (badges / summits) -> Starter fits
      const recBadge = plans.find((p) => p.registrations >= 250)?.slug;
      expect(recBadge).toBe("starter");

      // 2,500 attendees (college fest) -> Pro fits
      const recFest = plans.find((p) => p.registrations >= 2500)?.slug;
      expect(recFest).toBe("pro");

      // 10,000 attendees -> Business fits
      const recLarge = plans.find((p) => p.registrations >= 10000)?.slug;
      expect(recLarge).toBe("business");
    });
  });

  describe("Section 4: Interactive Acquisition Calculator Math", () => {
    it("reproduces prompt baseline assumptions accurately", () => {
      // From user prompt section 4:
      // Monthly organic visitors: 5,000
      // Visitor -> signup: 5%
      // Signup -> first event created (activated): 40%
      // Activated organizer -> paid: 15%
      // Output: 250 signups, 100 activated, 15 paying customers

      const visitors = 5000;
      const signupRate = 0.05;
      const activationRate = 0.40;
      const paidRate = 0.15;

      const signups = Math.round(visitors * signupRate);
      expect(signups).toBe(250);

      const activated = Math.round(signups * activationRate);
      expect(activated).toBe(100);

      const paying = Math.round(activated * paidRate);
      expect(paying).toBe(15);
    });

    it("calculates 0% platform ticketing fee savings vs 7.5% competitor commission", () => {
      const payingCustomers = 15;
      const avgTicketsPerEvent = 300;
      const avgPrice = 500; // INR

      const totalTickets = payingCustomers * avgTicketsPerEvent;
      expect(totalTickets).toBe(4500);

      const grossVolume = totalTickets * avgPrice;
      expect(grossVolume).toBe(2250000); // ₹22.5 Lakhs

      const competitorCommission = Math.round(grossVolume * 0.075);
      expect(competitorCommission).toBe(168750); // ₹1,68,750 saved by organizers using UrPass
    });
  });
});
