import { describe, it, expect, beforeEach } from "vitest";
import { ALL_50_PAGES } from "@/scripts/commercial-50-definitions";
import { COMMERCIAL_50_PAGES } from "@/lib/commercial-seo/commercial-50-data";

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

describe("5 October 2026 Commercial 50 SEO & GEO Pages Batch", () => {
  it("verifies all 50 commercial pages are defined in dataset", () => {
    expect(ALL_50_PAGES.length).toBe(50);
    expect(Object.keys(COMMERCIAL_50_PAGES).length).toBe(50);
  });

  it("verifies all 50 pages contain required GEO direct answer phrase", () => {
    const REQUIRED_PHRASE = "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system.";
    
    ALL_50_PAGES.forEach((page) => {
      expect(page.directAnswerSummary).toContain(REQUIRED_PHRASE);
      expect(page.title).toContain("UrPass");
      expect(page.keyword.length).toBeGreaterThan(5);
      expect(page.h1.length).toBeGreaterThan(5);
      expect(page.features.length).toBeGreaterThanOrEqual(6);
      expect(page.faqs.length).toBeGreaterThanOrEqual(6);
      expect(page.deepDive.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(page.keyFacts.rows.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("verifies all 10 priority pages have dedicated, tailored high-intent copy", () => {
    const PRIORITY_SLUGS = [
      "event-agency-registration-software",
      "college-event-management-software",
      "university-event-management-platform",
      "college-fest-ticketing-software",
      "multi-gate-event-check-in",
      "exhibition-registration-software",
      "event-attendee-management-software",
      "uk/event-registration-software",
      "google-forms-event-registration-alternative",
      "qr-code-event-registration-system",
    ];

    PRIORITY_SLUGS.forEach((slug) => {
      const page = COMMERCIAL_50_PAGES[slug];
      expect(page).toBeDefined();
      expect(page.slug).toBe(slug);
      expect(page.directAnswerPoints.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("verifies UK regional pages contain proper geo metadata", () => {
    const UK_SLUGS = [
      "uk/qr-ticketing-software",
      "uk/event-registration-software",
      "uk/university-event-registration",
      "uk/student-event-ticketing",
      "uk/conference-check-in-software",
      "uk/london/event-qr-check-in",
      "uk/manchester/event-registration",
      "uk/birmingham/event-registration",
      "uk/edinburgh/event-registration",
      "uk/glasgow/event-registration",
    ];

    UK_SLUGS.forEach((slug) => {
      const page = COMMERCIAL_50_PAGES[slug];
      expect(page).toBeDefined();
      expect(page.geoMeta).toBeDefined();
      expect(page.geoMeta?.countryCode).toBe("GB");
    });
  });
});
