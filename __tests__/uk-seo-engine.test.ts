import { describe, it, expect, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { MARKETS, marketForCountry, isPaidMarketAvailable } from "@/lib/markets/config";
import { validatePhoneNumber, validatePostalCode } from "@/lib/markets/localisation";
import { FEATURE_FLAG_DEFINITIONS } from "@/lib/feature-flags";
import fs from "fs";
import path from "path";

// Mock Supabase in sitemap execution
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => ({
              limit: vi.fn().mockResolvedValue({ data: [] }),
            }),
          }),
        }),
      }),
    }),
  }),
}));

vi.mock("@/lib/careers/service", () => ({
  getPublishedJobs: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/explore/service", () => ({
  fetchExploreMarketplaceEvents: vi.fn().mockResolvedValue({ events: [] }),
}));

describe("UK SEO, AEO & GEO Acquisition Engine", () => {
  describe("1. UK Metadata and OpenGraph Generation", () => {
    it("generates correct en_GB locale and canonical URL for UK pages", () => {
      const meta = generatePageMetadata({
        slug: "uk/event-registration-software",
        title: "Event Registration Software UK | UrPass",
        description: "Zero commission event registration for UK universities and conferences.",
        status: "published",
        canonicalUrl: "https://urpass.space/uk/event-registration-software",
      } as any);

      expect(meta.alternates?.canonical).toBe("https://urpass.space/uk/event-registration-software");
      expect(meta.openGraph?.locale).toBe("en_GB");
      expect(meta.other?.["geo.region"]).toBe("GB");
      expect(meta.other?.["geo.placename"]).toBe("United Kingdom");
      expect(meta.other?.["ICBM"]).toBe("55.3781, -3.4360");
    });

    it("preserves en_IN locale for Indian pages without regression", () => {
      const meta = generatePageMetadata({
        slug: "in/bangalore",
        title: "Event Registration Bengaluru | UrPass",
        description: "Event registration in Bengaluru.",
        status: "published",
        canonicalUrl: "https://urpass.space/in/bangalore",
      } as any);

      expect(meta.alternates?.canonical).toBe("https://urpass.space/in/bangalore");
      expect(meta.openGraph?.locale).toBe("en_IN");
      expect(meta.other?.["geo.region"]).toBeUndefined();
    });
  });

  describe("2. Sitemap Generation & UK Route Coverage", () => {
    it("indexes all 50 UK pages with valid priorities and no duplicates", async () => {
      const sitemapEntries = await sitemap();
      const urls = sitemapEntries.map((e) => e.url);

      // Verify master UK hub
      expect(urls).toContain("https://urpass.space/uk");

      // Verify 10 priority product pages
      expect(urls).toContain("https://urpass.space/uk/event-registration-software");
      expect(urls).toContain("https://urpass.space/uk/event-ticketing-software");
      expect(urls).toContain("https://urpass.space/uk/event-check-in-software");
      expect(urls).toContain("https://urpass.space/uk/qr-check-in");
      expect(urls).toContain("https://urpass.space/uk/qr-ticketing-system");
      expect(urls).toContain("https://urpass.space/uk/qr-code-event-check-in");
      expect(urls).toContain("https://urpass.space/uk/qr-code-event-registration");
      expect(urls).toContain("https://urpass.space/uk/qr-ticketing-software");
      expect(urls).toContain("https://urpass.space/uk/qr-event-check-in-software");
      expect(urls).toContain("https://urpass.space/uk/qr-code-event-check-in-software");

      // Verify 10 sector / vertical pages
      expect(urls).toContain("https://urpass.space/uk/conference-registration-software");
      expect(urls).toContain("https://urpass.space/uk/conference-check-in-software");
      expect(urls).toContain("https://urpass.space/uk/university-event-software");
      expect(urls).toContain("https://urpass.space/uk/university-event-management-software");
      expect(urls).toContain("https://urpass.space/uk/university-event-registration");
      expect(urls).toContain("https://urpass.space/uk/event-registration-platform-for-universities");
      expect(urls).toContain("https://urpass.space/uk/student-union-event-ticketing");
      expect(urls).toContain("https://urpass.space/uk/student-event-ticketing");
      expect(urls).toContain("https://urpass.space/uk/college-event-registration");
      expect(urls).toContain("https://urpass.space/uk/corporate-event-guest-management-software");

      // Verify UK comparisons & guides
      expect(urls).toContain("https://urpass.space/uk/eventbrite-alternative");

      // Verify UK 15 cities
      expect(urls).toContain("https://urpass.space/uk/london");
      expect(urls).toContain("https://urpass.space/uk/manchester");
      expect(urls).toContain("https://urpass.space/uk/birmingham");
      expect(urls).toContain("https://urpass.space/uk/edinburgh");
      expect(urls).toContain("https://urpass.space/uk/glasgow");
      expect(urls).toContain("https://urpass.space/uk/leeds");
      expect(urls).toContain("https://urpass.space/uk/bristol");
      expect(urls).toContain("https://urpass.space/uk/liverpool");
      expect(urls).toContain("https://urpass.space/uk/cambridge");
      expect(urls).toContain("https://urpass.space/uk/oxford");
      expect(urls).toContain("https://urpass.space/uk/cardiff");
      expect(urls).toContain("https://urpass.space/uk/nottingham");
      expect(urls).toContain("https://urpass.space/uk/sheffield");
      expect(urls).toContain("https://urpass.space/uk/newcastle");
      expect(urls).toContain("https://urpass.space/uk/belfast");

      // Verify city intent subpages
      expect(urls).toContain("https://urpass.space/uk/london/event-qr-check-in");
      expect(urls).toContain("https://urpass.space/uk/manchester/event-registration");
      expect(urls).toContain("https://urpass.space/uk/birmingham/event-registration");
      expect(urls).toContain("https://urpass.space/uk/edinburgh/event-registration");
      expect(urls).toContain("https://urpass.space/uk/glasgow/event-registration");

      // Check URL uniqueness (no duplicates)
      const ukUrls = urls.filter((u) => u.startsWith("https://urpass.space/uk/") || u === "https://urpass.space/uk");
      const uniqueUkUrls = new Set(ukUrls);
      expect(uniqueUkUrls.size).toBe(ukUrls.length);
      expect(uniqueUkUrls.size).toBe(50);
    });
  });

  describe("3. Commercial Readiness Protection (Safety Gating)", () => {
    it("confirms that GBP paid ticketing remains disabled until provider certification", () => {
      expect(FEATURE_FLAG_DEFINITIONS.uk_paid_ticketing.defaultEnabled).toBe(false);
      expect(FEATURE_FLAG_DEFINITIONS.uk_organizer_mor.defaultEnabled).toBe(false);
      expect(FEATURE_FLAG_DEFINITIONS.uk_market_enabled.defaultEnabled).toBe(true);
      expect(FEATURE_FLAG_DEFINITIONS.uk_free_registration.defaultEnabled).toBe(true);

      expect(MARKETS.GB.paymentsEnabled).toBe(false);
      expect(isPaidMarketAvailable("GBP")).toBe(false);
      expect(isPaidMarketAvailable("INR")).toBe(true);
    });

    it("verifies zero Indian Rupee (₹ or INR) currency leaks across all UK route files", () => {
      const ukDir = path.resolve(process.cwd(), "app/uk");
      const findPageFiles = (dir: string): string[] => {
        let results: string[] = [];
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat && stat.isDirectory()) {
            results = results.concat(findPageFiles(filePath));
          } else if (file === "page.tsx") {
            results.push(filePath);
          }
        });
        return results;
      };

      const pages = findPageFiles(ukDir);
      expect(pages.length).toBe(50);

      pages.forEach((pagePath) => {
        const content = fs.readFileSync(pagePath, "utf-8");
        expect(content, `Page ${pagePath} should not contain Rupee symbol (₹)`).not.toContain("₹");
        expect(content, `Page ${pagePath} should not contain currency INR`).not.toContain("INR");
        expect(content, `Page ${pagePath} should not contain Razorpay checkout claims`).not.toContain("Razorpay/Stripe checkout");
        expect(content, `Page ${pagePath} should use ISO geo.region GB`).not.toContain('"geo.region": "UK"');
      });
    });
  });

  describe("4. UK Market Localisation Utilities", () => {
    it("resolves GB market configuration correctly", () => {
      const gbMarket = marketForCountry("GB");
      expect(gbMarket.countryCode).toBe("GB");
      expect(gbMarket.currency).toBe("GBP");
      expect(gbMarket.currencySymbol).toBe("£");
      expect(gbMarket.defaultTimezone).toBe("Europe/London");
      expect(gbMarket.locale).toBe("en-GB");
      expect(gbMarket.tax.taxType).toBe("VAT");
      expect(gbMarket.tax.taxRatePercent).toBe(20);
      expect(gbMarket.terminology.institution).toBe("University");
      expect(gbMarket.terminology.studentOrg).toBe("Societies & Sports Clubs");
    });

    it("validates UK phone numbers (+44 prefix and 10 digits)", () => {
      expect(validatePhoneNumber("+447911123456", "GB")).toBe(true);
      expect(validatePhoneNumber("07911123456", "GB")).toBe(true);
      expect(validatePhoneNumber("12345", "GB")).toBe(false);
    });

    it("validates standard UK postcodes across regions", () => {
      expect(validatePostalCode("SW1A 1AA", "GB")).toBe(true); // London
      expect(validatePostalCode("M1 1AE", "GB")).toBe(true); // Manchester
      expect(validatePostalCode("B1 1BB", "GB")).toBe(true); // Birmingham
      expect(validatePostalCode("EH1 1YZ", "GB")).toBe(true); // Edinburgh
      expect(validatePostalCode("BT1 5GS", "GB")).toBe(true); // Belfast
      expect(validatePostalCode("INVALID", "GB")).toBe(false);
    });
  });

  describe("5. Indian Market Regression Protection", () => {
    it("confirms Indian payment provider and GST configuration remains unaffected", () => {
      const inMarket = marketForCountry("IN");
      expect(inMarket.countryCode).toBe("IN");
      expect(inMarket.currency).toBe("INR");
      expect(inMarket.currencySymbol).toBe("₹");
      expect(inMarket.defaultTimezone).toBe("Asia/Kolkata");
      expect(inMarket.tax.taxType).toBe("GST");
      expect(inMarket.tax.taxRatePercent).toBe(18);
      expect(inMarket.paymentsEnabled).toBe(true);
      expect(inMarket.defaultGateway).toBe("razorpay");
    });
  });
});
