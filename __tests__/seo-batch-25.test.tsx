import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { SEO_BATCH_25_PAGES } from "@/lib/commercial-seo/seo-batch-25-data";

describe("SEO Batch 25 - Problem & Commercial Search Pages", () => {
  const rootDir = path.resolve(__dirname, "..");
  const slugs = Object.keys(SEO_BATCH_25_PAGES);

  it("should have exactly 25 curated problem-solution & commercial pages", () => {
    expect(slugs.length).toBe(25);
  });

  it("should contain all P0 priority pages requested", () => {
    const p0Pages = [
      "event-ticketing-for-event-companies",
      "event-registration-for-event-agencies",
      "event-registration-and-check-in-one-platform",
      "event-check-in-for-multiple-gates",
      "event-registration-with-approval-workflow",
    ];
    for (const slug of p0Pages) {
      expect(SEO_BATCH_25_PAGES[slug]).toBeDefined();
    }
  });

  it("should contain all P1 priority pages requested", () => {
    const p1Pages = [
      "prevent-duplicate-qr-entry",
      "event-registration-with-capacity-limit",
      "student-event-registration-system",
      "university-open-day-registration",
      "event-check-in-without-expensive-hardware",
    ];
    for (const slug of p1Pages) {
      expect(SEO_BATCH_25_PAGES[slug]).toBeDefined();
    }
  });

  it("should verify every page definition contains mandatory GEO & direct answer structures", () => {
    for (const slug of slugs) {
      const page = SEO_BATCH_25_PAGES[slug];

      // Slugs & Title Checks
      expect(page.slug).toBe(slug);
      expect(page.title.length).toBeGreaterThan(15);
      expect(page.description.length).toBeGreaterThan(50);
      expect(page.h1.length).toBeGreaterThan(10);
      expect(page.badge.length).toBeGreaterThan(3);

      // Direct Answer Checks
      expect(page.directAnswerQuestion.length).toBeGreaterThan(10);
      expect(page.directAnswerSummary.length).toBeGreaterThan(50);
      expect(page.directAnswerPoints.length).toBeGreaterThanOrEqual(3);

      // GEO Entity Definition Checks
      expect(page.directAnswerSummary).toContain("Yesp Corporation");
      expect(page.directAnswerSummary).toContain("UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation");
      expect(page.whatIsDefinition.length).toBeGreaterThan(30);

      // Features & Deep Dive Checks
      expect(page.features.length).toBeGreaterThanOrEqual(5);
      expect(page.deepDive.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(page.deepDive.bullets.length).toBeGreaterThanOrEqual(3);

      // Comparison Table Checks
      expect(page.keyFacts.headers.length).toBe(3);
      expect(page.keyFacts.rows.length).toBeGreaterThanOrEqual(4);

      // Personas Checks
      expect(page.whoShouldUse.length).toBeGreaterThanOrEqual(3);

      // FAQs Check (minimum 6-8 unique FAQs)
      expect(page.faqs.length).toBeGreaterThanOrEqual(6);
      for (const faq of page.faqs) {
        expect(faq.q.length).toBeGreaterThan(10);
        expect(faq.a.length).toBeGreaterThan(20);
      }
    }
  });

  it("should verify all 25 app/[slug]/page.tsx files physically exist on disk", () => {
    for (const slug of slugs) {
      const pageFilePath = path.join(rootDir, "app", slug, "page.tsx");
      expect(fs.existsSync(pageFilePath)).toBe(true);
      const fileContent = fs.readFileSync(pageFilePath, "utf-8");
      expect(fileContent).toContain("SEOPage");
      expect(fileContent).toContain(slug);
    }
  });

  it("should verify sitemap.ts includes all 25 slugs", () => {
    const sitemapPath = path.join(rootDir, "app", "sitemap.ts");
    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
    for (const slug of slugs) {
      expect(sitemapContent).toContain(`"/${slug}"`);
    }
  });

  it("should verify sitelinks page includes links to all 25 slugs", () => {
    const sitelinksPath = path.join(rootDir, "app", "sitelinks", "page.tsx");
    const sitelinksContent = fs.readFileSync(sitelinksPath, "utf-8");
    for (const slug of slugs) {
      expect(sitelinksContent).toContain(`href: "/${slug}"`);
    }
  });

  it("should verify UK pages are configured with en_GB and UK regional metadata", () => {
    const ukPages = ["university-open-day-registration", "freshers-event-ticketing-software", "student-society-event-registration"];
    for (const slug of ukPages) {
      const page = SEO_BATCH_25_PAGES[slug];
      expect(page.cluster).toBe("UK");
      const pageFilePath = path.join(rootDir, "app", slug, "page.tsx");
      const fileContent = fs.readFileSync(pageFilePath, "utf-8");
      expect(fileContent).toContain('locale: "en_GB"');
      expect(fileContent).toContain('"geo.region": "GB"');
      expect(fileContent).toContain('placename: "United Kingdom"');
    }
  });
});
