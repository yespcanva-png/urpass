import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import {
  HIGH_INTENT_25_PAGES,
  HIGH_INTENT_25_BY_SLUG,
  getHighIntent25Page,
  getAllHighIntentSlugs,
} from "@/lib/seo/templates/high-intent-25";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";

describe("High-Intent 25 SEO + GEO Pages Configuration", () => {
  it("contains exactly 25 distinct page targets", () => {
    expect(HIGH_INTENT_25_PAGES).toHaveLength(25);
    const uniqueSlugs = new Set(HIGH_INTENT_25_PAGES.map((p) => p.slug));
    expect(uniqueSlugs.size).toBe(25);
  });

  it("verifies all 25 pages have required SEO + GEO sections and structure", () => {
    HIGH_INTENT_25_PAGES.forEach((page, index) => {
      // Basic identifiers
      expect(page.pageNumber, `Page ${index + 1} pageNumber`).toBeTruthy();
      expect(page.slug, `Page ${index + 1} slug`).toBeTruthy();
      expect(page.canonicalUrl, `Page ${index + 1} canonicalUrl`).toContain("https://urpass.space/");
      expect(page.primaryKeyword, `Page ${index + 1} primaryKeyword`).toBeTruthy();
      expect(page.seoTitle, `Page ${index + 1} seoTitle`).toContain("UrPass");
      expect(page.metaDescription.length, `Page ${index + 1} metaDescription length`).toBeGreaterThan(50);
      expect(page.h1, `Page ${index + 1} h1`).toBeTruthy();

      // Hero direct answer: 50-80 words recommended
      const heroWords = page.heroDescription.trim().split(/\s+/).length;
      expect(
        heroWords,
        `Page ${index + 1} (${page.slug}) hero direct answer word count (${heroWords} words)`
      ).toBeGreaterThanOrEqual(25);

      // Problem section
      expect(page.problemSection.paragraphs.length, `Page ${index + 1} problem paragraphs`).toBeGreaterThanOrEqual(3);

      // Capabilities: 4 feature-to-benefit items
      expect(page.capabilitiesSection.items.length, `Page ${index + 1} capabilities items`).toBeGreaterThanOrEqual(4);
      page.capabilitiesSection.items.forEach((item, itemIdx) => {
        expect(item.title, `Page ${index + 1} cap ${itemIdx + 1} title`).toBeTruthy();
        expect(item.description, `Page ${index + 1} cap ${itemIdx + 1} description`).toBeTruthy();
        expect(item.bestFor, `Page ${index + 1} cap ${itemIdx + 1} bestFor`).toBeTruthy();
      });

      // How it works
      const workflowSteps = (page.howItWorksSection as any).steps || (page.howItWorksSection as any).items || [];
      expect(workflowSteps.length, `Page ${index + 1} howItWorks items`).toBeGreaterThanOrEqual(3);

      // Use cases / Event types: 4 items
      const useCases = (page as any).eventTypesSection?.items || (page as any).useCasesSection?.items || [];
      expect(useCases.length, `Page ${index + 1} useCases items`).toBeGreaterThanOrEqual(4);

      // Pricing & trust: verified claims
      const pricingFeatures = (page as any).pricingSection?.features || [];
      if (pricingFeatures.length > 0) {
        const pricingFeaturesJoined = pricingFeatures.join(" ");
        expect(pricingFeaturesJoined, `Page ${index + 1} pricing claims`).toContain("0%");
      }

      // FAQs: 5+ direct questions
      expect(page.faqSection.faqs.length, `Page ${index + 1} FAQ count`).toBeGreaterThanOrEqual(5);

      // Final CTA / Closing CTA
      const finalCta = (page as any).finalCta || (page as any).closingCtaSection;
      expect(finalCta.primaryCtaLabel, `Page ${index + 1} final primary CTA`).toBeTruthy();
      expect(finalCta.secondaryCtaLabel, `Page ${index + 1} final secondary CTA`).toBeTruthy();
    });
  });

  it("resolves all 25 canonical slugs via getHighIntent25Page", () => {
    const slugs = getAllHighIntentSlugs();
    expect(slugs).toHaveLength(25);

    slugs.forEach((slug) => {
      const page = getHighIntent25Page(slug);
      expect(page, `Resolving ${slug}`).toBeDefined();
      expect(page?.slug).toBe(slug);
    });
  });

  it("resolves URLs with solutions/, uk/, and in/ prefixes", () => {
    expect(getHighIntent25Page("solutions/corporate-event-registration-software")?.slug).toBe(
      "corporate-event-registration-software"
    );
    expect(getHighIntent25Page("uk/conference-registration-software")?.slug).toBe(
      "conference-registration-software-uk"
    );
    expect(getHighIntent25Page("in/bangalore-corporate-event-registration-software")?.slug).toBe(
      "bangalore-corporate-event-registration-software"
    );
    expect(getHighIntent25Page("chennai-conference-qr-check-in-software")?.slug).toBe(
      "chennai-conference-qr-check-in-software"
    );
  });

  it("renders sample configs with SeoGeoLandingTemplate without throwing", () => {
    // Test 1: Page 002 (Conference)
    const confPage = HIGH_INTENT_25_PAGES[1];
    const { container: confContainer } = render(<SeoGeoLandingTemplate config={confPage} />);
    expect(confContainer.querySelector("h1")?.textContent).toBe(confPage.h1);

    // Test 2: Page 016 (UK Conference)
    const ukPage = HIGH_INTENT_25_PAGES[15];
    const { container: ukContainer } = render(<SeoGeoLandingTemplate config={ukPage} />);
    expect(ukContainer.querySelector("h1")?.textContent).toBe(ukPage.h1);

    // Test 3: Page 021 (Bangalore Corporate)
    const blrPage = HIGH_INTENT_25_PAGES[20];
    const { container: blrContainer } = render(<SeoGeoLandingTemplate config={blrPage} />);
    expect(blrContainer.querySelector("h1")?.textContent).toBe(blrPage.h1);
  });
});
