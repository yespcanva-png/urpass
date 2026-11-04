import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import {
  HIGH_INTENT_BATCH_2_PAGES,
  HIGH_INTENT_BATCH_2_BY_SLUG,
  getHighIntentBatch2Page,
  getAllHighIntentBatch2Slugs,
} from "@/lib/seo/templates/high-intent-batch-2";
import { HIGH_INTENT_25_PAGES } from "@/lib/seo/templates/high-intent-25";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";

describe("High-Intent Batch 2 (Pages 26–50) SEO + GEO Pages Configuration", () => {
  it("contains exactly 25 distinct page targets in Batch 2", () => {
    expect(HIGH_INTENT_BATCH_2_PAGES).toHaveLength(25);
    const uniqueSlugs = new Set(HIGH_INTENT_BATCH_2_PAGES.map((p) => p.slug));
    expect(uniqueSlugs.size).toBe(25);
  });

  it("ensures zero slug collisions between Batch 1 and Batch 2", () => {
    const batch1Slugs = new Set(HIGH_INTENT_25_PAGES.map((p) => p.slug));
    const batch2Slugs = HIGH_INTENT_BATCH_2_PAGES.map((p) => p.slug);
    batch2Slugs.forEach((slug) => {
      expect(batch1Slugs.has(slug), `Slug collision detected for ${slug}`).toBe(false);
    });
  });

  it("verifies all 25 pages have required SEO + GEO sections and structure", () => {
    HIGH_INTENT_BATCH_2_PAGES.forEach((page, index) => {
      const pageNumExpected = `Page 0${index + 26}`;

      // Basic identifiers
      expect(page.pageNumber, `Page ${index + 26} pageNumber`).toBe(pageNumExpected);
      expect(page.slug, `Page ${index + 26} slug`).toBeTruthy();
      expect(page.canonicalUrl, `Page ${index + 26} canonicalUrl`).toContain("https://urpass.space/solutions/");
      expect(page.primaryKeyword, `Page ${index + 26} primaryKeyword`).toBeTruthy();
      expect(page.seoTitle, `Page ${index + 26} seoTitle`).toContain("UrPass");
      expect(page.metaDescription.length, `Page ${index + 26} metaDescription length`).toBeGreaterThan(50);
      expect(page.h1, `Page ${index + 26} h1`).toBeTruthy();

      // Hero direct answer: 50-80 words recommended (minimum 25 words)
      const heroWords = page.heroDescription.trim().split(/\s+/).length;
      expect(
        heroWords,
        `Page ${index + 26} (${page.slug}) hero direct answer word count (${heroWords} words)`
      ).toBeGreaterThanOrEqual(25);

      // Problem section
      expect(page.problemSection.paragraphs.length, `Page ${index + 26} problem paragraphs`).toBeGreaterThanOrEqual(3);

      // Capabilities: 4 feature-to-benefit items
      expect(page.capabilitiesSection.items.length, `Page ${index + 26} capabilities items`).toBeGreaterThanOrEqual(4);
      page.capabilitiesSection.items.forEach((item, itemIdx) => {
        expect(item.title, `Page ${index + 26} cap ${itemIdx + 1} title`).toBeTruthy();
        expect(item.description, `Page ${index + 26} cap ${itemIdx + 1} description`).toBeTruthy();
        expect(item.bestFor, `Page ${index + 26} cap ${itemIdx + 1} bestFor`).toBeTruthy();
      });

      // How it works: at least 3 steps
      const workflowSteps = (page.howItWorksSection as any).steps || (page.howItWorksSection as any).items || [];
      expect(workflowSteps.length, `Page ${index + 26} howItWorks items`).toBeGreaterThanOrEqual(3);

      // Use cases / Event types: at least 4 items
      const useCases = (page as any).eventTypesSection?.items || (page as any).useCasesSection?.items || [];
      expect(useCases.length, `Page ${index + 26} useCases items`).toBeGreaterThanOrEqual(4);

      // Pricing & trust: verified claims with 0% platform fee
      const pricingFeatures = (page as any).pricingSection?.features || [];
      expect(pricingFeatures.length, `Page ${index + 26} pricing features`).toBeGreaterThan(0);
      const pricingFeaturesJoined = pricingFeatures.join(" ");
      expect(pricingFeaturesJoined, `Page ${index + 26} pricing claims`).toContain("0%");

      // FAQs: 5+ direct questions
      expect(page.faqSection.faqs.length, `Page ${index + 26} FAQ count`).toBeGreaterThanOrEqual(5);

      // Final CTA / Closing CTA
      const finalCta = (page as any).finalCta || (page as any).closingCtaSection;
      expect(finalCta.primaryCtaLabel, `Page ${index + 26} final primary CTA`).toBeTruthy();
      expect(finalCta.secondaryCtaLabel, `Page ${index + 26} final secondary CTA`).toBeTruthy();
    });
  });

  it("resolves all 25 canonical slugs via getHighIntentBatch2Page", () => {
    const slugs = getAllHighIntentBatch2Slugs();
    expect(slugs).toHaveLength(25);

    slugs.forEach((slug) => {
      const page = getHighIntentBatch2Page(slug);
      expect(page, `Resolving ${slug}`).toBeDefined();
      expect(page?.slug).toBe(slug);
    });
  });

  it("resolves URLs with solutions/ prefix and natural aliases", () => {
    // Check solutions prefix
    expect(getHighIntentBatch2Page("solutions/custom-qr-ticket-designer")?.slug).toBe(
      "custom-qr-ticket-designer"
    );
    expect(getHighIntentBatch2Page("solutions/printable-conference-badge-generator-with-qr-code")?.slug).toBe(
      "printable-conference-badge-generator-with-qr-code"
    );
    expect(getHighIntentBatch2Page("solutions/offline-qr-code-event-check-in-software")?.slug).toBe(
      "offline-qr-code-event-check-in-software"
    );

    // Check alias resolution
    expect(getHighIntentBatch2Page("qr-conference-badge-generator")?.slug).toBe(
      "printable-conference-badge-generator-with-qr-code"
    );
    expect(getHighIntentBatch2Page("offline-qr-check-in-software")?.slug).toBe(
      "offline-qr-code-event-check-in-software"
    );
    expect(getHighIntentBatch2Page("early-bird-vip-pricing")?.slug).toBe(
      "event-ticket-sales-with-early-bird-and-vip-pricing"
    );
    expect(getHighIntentBatch2Page("live-event-attendance-dashboard")?.slug).toBe(
      "real-time-event-attendance-dashboard-software"
    );
    expect(getHighIntentBatch2Page("product-launch-registration-software")?.slug).toBe(
      "product-launch-event-registration-software"
    );
  });

  it("renders sample configs (including the 5 highest-priority business drivers) with SeoGeoLandingTemplate without throwing", () => {
    // Test 1: Page 027 — QR Conference Badge Generator (Top 5 Priority)
    const page27 = getHighIntentBatch2Page("printable-conference-badge-generator-with-qr-code");
    expect(page27).toBeDefined();
    const { unmount: unmount27 } = render(<SeoGeoLandingTemplate config={page27!} />);
    unmount27();

    // Test 2: Page 030 — Offline Event QR Check-In (Top 5 Priority)
    const page30 = getHighIntentBatch2Page("offline-qr-code-event-check-in-software");
    expect(page30).toBeDefined();
    const { unmount: unmount30 } = render(<SeoGeoLandingTemplate config={page30!} />);
    unmount30();

    // Test 3: Page 036 — Early Bird & VIP Event Ticketing (Top 5 Priority)
    const page36 = getHighIntentBatch2Page("event-ticket-sales-with-early-bird-and-vip-pricing");
    expect(page36).toBeDefined();
    const { unmount: unmount36 } = render(<SeoGeoLandingTemplate config={page36!} />);
    unmount36();

    // Test 4: Page 040 — Live Attendance Dashboard (Top 5 Priority)
    const page40 = getHighIntentBatch2Page("real-time-event-attendance-dashboard-software");
    expect(page40).toBeDefined();
    const { unmount: unmount40 } = render(<SeoGeoLandingTemplate config={page40!} />);
    unmount40();

    // Test 5: Page 046 — Product Launch Event Registration (Top 5 Priority)
    const page46 = getHighIntentBatch2Page("product-launch-event-registration-software");
    expect(page46).toBeDefined();
    const { unmount: unmount46 } = render(<SeoGeoLandingTemplate config={page46!} />);
    unmount46();
  });
});

