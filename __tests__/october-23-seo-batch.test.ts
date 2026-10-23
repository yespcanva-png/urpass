import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { OCTOBER_23_SEO_PAGES, buildOctober23Config, generateOctober23Metadata } from "@/lib/seo/october-23-batch";

describe("UrPass SEO + GEO — 23 October 2026 Batch (30 Pages)", () => {
  const slugs = Object.keys(OCTOBER_23_SEO_PAGES);
  const rootDir = path.resolve(__dirname, "..");

  it("should contain exactly 30 planned pages", () => {
    expect(slugs.length).toBe(30);
  });

  it("should contain all 10 Priority 1 Commercial pages", () => {
    const p1Pages = [
      "event-rsvp-tracking-software",
      "corporate-visitor-qr-check-in",
      "vip-event-invitation-management",
      "group-qr-ticket-entry-software",
      "multi-gate-event-check-in-software",
      "private-event-guest-list-software",
      "conference-session-attendance-tracking",
      "event-passes-via-whatsapp",
      "invitation-only-event-registration",
      "qr-check-in-large-events",
    ];
    for (const slug of p1Pages) {
      expect(OCTOBER_23_SEO_PAGES[slug]).toBeDefined();
      expect(OCTOBER_23_SEO_PAGES[slug].category).toBe("Commercial P1");
    }
  });

  it("should contain all 15 Priority 2 Industry-Specific pages", () => {
    const p2Pages = [
      "alumni-meet-registration-software",
      "award-ceremony-guest-registration",
      "college-symposium-pass-management",
      "school-annual-day-qr-invitations",
      "product-launch-guest-management",
      "trade-association-event-registration",
      "business-networking-qr-passes",
      "factory-visitor-event-registration",
      "exhibitor-staff-qr-passes",
      "employee-family-day-invitations",
      "charity-gala-invitation-software",
      "community-festival-registration-software",
      "real-estate-launch-event-rsvp",
      "dealer-meet-qr-registration",
      "investor-event-guest-check-in",
    ];
    for (const slug of p2Pages) {
      expect(OCTOBER_23_SEO_PAGES[slug]).toBeDefined();
      expect(OCTOBER_23_SEO_PAGES[slug].category).toBe("Industry P2");
    }
  });

  it("should contain all 5 Priority 3 Location pages", () => {
    const p3Pages = [
      "bangalore-conference-registration-software",
      "hyderabad-event-qr-invitations",
      "chennai-corporate-event-check-in",
      "mumbai-exhibition-guest-management",
      "coimbatore-college-event-software",
    ];
    for (const slug of p3Pages) {
      expect(OCTOBER_23_SEO_PAGES[slug]).toBeDefined();
      expect(OCTOBER_23_SEO_PAGES[slug].category).toBe("Location P3");
    }
  });

  it("should verify every page file exists and imports the batch module", () => {
    for (const slug of slugs) {
      const pageFile = path.join(rootDir, "app", slug, "page.tsx");
      expect(fs.existsSync(pageFile)).toBe(true);
      const content = fs.readFileSync(pageFile, "utf-8");
      expect(content).toContain("generateOctober23Metadata");
      expect(content).toContain("October23SeoPage");
      expect(content).toContain(`slug = "${slug}"`);
    }
  });

  it("should verify valid metadata and canonical URLs for all pages", () => {
    for (const slug of slugs) {
      const meta = generateOctober23Metadata(slug);
      expect(meta.title).toBeDefined();
      expect(typeof meta.title === "string" ? meta.title.length : 0).toBeGreaterThan(15);
      expect(meta.description?.length).toBeGreaterThan(50);
      expect(meta.alternates?.canonical).toBe(`https://urpass.space/${slug}`);
      expect(meta.openGraph?.url).toBe(`https://urpass.space/${slug}`);
    }
  });

  it("should verify every page config contains AI-ready direct answers, workflows, key facts, and FAQs", () => {
    for (const slug of slugs) {
      const config = buildOctober23Config(slug);
      
      // H1 and direct answer
      expect(config.h1.length).toBeGreaterThan(10);
      expect(config.directAnswer).toBeDefined();
      expect(config.directAnswer?.title?.length).toBeGreaterThan(10);
      expect(config.directAnswer?.summary.length).toBeGreaterThan(50);
      expect(config.directAnswer?.keyPoints?.length).toBeGreaterThanOrEqual(3);

      // WhatIs definition & limitations
      expect(config.whatIs).toBeDefined();
      expect(config.whatIs?.definition.length).toBeGreaterThan(30);
      expect(config.whatIs?.details?.some(d => d.includes("Limitations:"))).toBe(true);

      // Features and CTAs
      expect(config.features.length).toBe(6);
      expect(config.ctaLabel).toBe("Create Your Event");
      expect(config.ctaHref).toBe("/signup");
      expect(config.secondaryCtaLabel).toBe("Explore Features");
      expect(config.secondaryCtaHref).toBe("/features");

      // Key facts table
      expect(config.keyFactsTable).toBeDefined();
      expect(config.keyFactsTable?.rows.length).toBeGreaterThanOrEqual(4);

      // Workflow steps
      expect(config.steps?.length).toBe(5);

      // FAQs
      expect(config.faqs.length).toBeGreaterThanOrEqual(4);

      // Related internal links
      expect(config.relatedLinks?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("should verify all 30 pages are present in sitemap.ts", () => {
    const sitemapContent = fs.readFileSync(path.join(rootDir, "app", "sitemap.ts"), "utf-8");
    for (const slug of slugs) {
      expect(sitemapContent).toContain(`"/${slug}"`);
    }
  });
});
