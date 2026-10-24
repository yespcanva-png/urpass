import { describe, it, expect } from "vitest";
import { ALL_MARKETING_PAGES, getMarketingPage, getAllPublishedSlugs } from "@/lib/seo/pages";
import { generateMarketingMetadata } from "@/lib/seo/metadata";
import { generateStructuredData } from "@/lib/seo/structured-data";
import { getRelatedPages } from "@/lib/seo/linking";
import { z } from "zod";

const inquirySchema = z.object({
  organizerName: z.string().min(2, "Organizer/Company name required"),
  businessEmail: z.string().email("Valid business email required"),
  phoneNumber: z.string().min(8, "Valid phone number required"),
  eventType: z.string().min(2, "Event type required"),
  eventDate: z.string().min(4, "Event date required"),
  city: z.string().min(2, "City required"),
  estimatedAttendees: z.string().min(1, "Attendee estimate required"),
  eventModel: z.enum(["paid", "free", "private", "mixed"]),
  preferredPackage: z.enum(["essential", "pro", "premium", "enterprise"]),
  supportRequirements: z.array(z.string()).default([]),
  comments: z.string().optional(),
  consentGiven: z.boolean().refine((val) => val === true, "Consent required"),
  slug: z.string().default("direct"),
  cluster: z.string().default("evergreen"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

describe("UrPass SEO + GEO Engine — Master 40 Page Registry Suite", () => {
  const pages = ALL_MARKETING_PAGES;

  it("should contain exactly 40 registered marketing pages", () => {
    expect(pages.length).toBe(40);
  });

  it("should partition exactly into 4 clusters", () => {
    const clusterA = pages.filter((p) => p.cluster === "festive");
    const clusterB = pages.filter((p) => p.cluster === "institutional");
    const clusterC = pages.filter((p) => p.cluster === "recurring");
    const clusterD = pages.filter((p) => p.cluster === "evergreen");

    expect(clusterA.length).toBe(12);
    expect(clusterB.length).toBe(10);
    expect(clusterC.length).toBe(12);
    expect(clusterD.length).toBe(6);
  });

  it("should have 100% unique slugs across all 40 pages", () => {
    const slugs = pages.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(40);
  });

  it("should have 100% unique canonical URLs matching https://urpass.space/[slug]", () => {
    const canonicals = pages.map((p) => p.canonicalUrl);
    const uniqueCanonicals = new Set(canonicals);
    expect(uniqueCanonicals.size).toBe(40);

    for (const page of pages) {
      expect(page.canonicalUrl).toBe(`https://urpass.space/${page.slug}`);
    }
  });

  it("should have 100% unique SEO titles", () => {
    const titles = pages.map((p) => p.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(40);

    for (const page of pages) {
      expect(page.title.length).toBeGreaterThan(20);
      expect(page.title).toContain("UrPass");
    }
  });

  it("should have 100% unique meta descriptions", () => {
    const descriptions = pages.map((p) => p.description);
    const uniqueDescriptions = new Set(descriptions);
    expect(uniqueDescriptions.size).toBe(40);

    for (const page of pages) {
      expect(page.description.length).toBeGreaterThan(50);
      expect(page.description.length).toBeLessThan(250);
    }
  });

  it("should have 100% unique H1 headings", () => {
    const h1s = pages.map((p) => p.h1);
    const uniqueH1s = new Set(h1s);
    expect(uniqueH1s.size).toBe(40);

    for (const page of pages) {
      expect(page.h1.trim().length).toBeGreaterThan(15);
    }
  });

  it("should contain between 5 and 8 substantive FAQs for every page", () => {
    for (const page of pages) {
      expect(
        page.faqs.length,
        `Page ${page.slug} should have between 5 and 8 FAQs`
      ).toBeGreaterThanOrEqual(5);
      expect(
        page.faqs.length,
        `Page ${page.slug} should have between 5 and 8 FAQs`
      ).toBeLessThanOrEqual(8);

      for (const faq of page.faqs) {
        expect(faq.q.trim().length).toBeGreaterThan(10);
        expect(faq.a.trim().length).toBeGreaterThan(25);
      }
    }
  });

  it("should define exactly 3 execution workflow steps per page", () => {
    for (const page of pages) {
      expect(page.workflow.steps.length).toBe(3);
      for (const step of page.workflow.steps) {
        expect(step.title.trim().length).toBeGreaterThan(3);
        expect(step.desc.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it("should have at least 3 feature highlights and a practical scenario per page", () => {
    for (const page of pages) {
      expect(page.features.length).toBeGreaterThanOrEqual(3);
      expect(page.practicalScenario.title.length).toBeGreaterThan(5);
      expect(page.practicalScenario.problem.length).toBeGreaterThan(20);
      expect(page.practicalScenario.solution.length).toBeGreaterThan(20);
      expect(page.practicalScenario.outcome.length).toBeGreaterThan(20);
    }
  });

  it("should have dual-service comparison with explicit remote boundaries", () => {
    for (const page of pages) {
      expect(page.serviceComparison.selfServicePoints.length).toBeGreaterThanOrEqual(3);
      expect(page.serviceComparison.managedServicePoints.length).toBeGreaterThanOrEqual(3);
      expect(page.serviceComparison.recommendedFor.length).toBeGreaterThan(10);
    }
  });

  describe("Compliance and Truthful Capabilities", () => {
    it("should never promise on-site staff for remote managed services", () => {
      for (const page of pages) {
        const textToScan = [
          page.hero.openingAnswer,
          page.serviceComparison.recommendedFor,
          ...page.features.map((f) => f.desc),
          ...page.faqs.map((f) => f.a),
        ].join(" ").toLowerCase();

        expect(textToScan).not.toContain("on-site staff");
        expect(textToScan).not.toContain("physical security personnel");
        expect(textToScan).not.toContain("metal detector screening");
      }
    });

    it("should not promise statutory ID verification on Republic Day pages", () => {
      const repVisitorPage = getMarketingPage("republic-day-visitor-management");
      expect(repVisitorPage).toBeDefined();
      const allText = JSON.stringify(repVisitorPage).toLowerCase();
      expect(allText).not.toContain("statutory identity verification");
      expect(allText).not.toContain("police verification");
    });

    it("should not promise code judging on hackathon registration page", () => {
      const hackathonPage = getMarketingPage("hackathon-registration-platform");
      expect(hackathonPage).toBeDefined();
      const allText = JSON.stringify(hackathonPage).toLowerCase();
      expect(allText).not.toContain("code judging engine");
      expect(allText).not.toContain("automated test runner for code");
    });

    it("should not promise assigned seat mapping on stand-up comedy page", () => {
      const comedyPage = getMarketingPage("standup-comedy-ticketing");
      expect(comedyPage).toBeDefined();
      const allText = JSON.stringify(comedyPage).toLowerCase();
      expect(allText).not.toContain("3d seat map selection");
      expect(allText).not.toContain("reserved seat row and column picking");
    });
  });

  describe("Structured Data (JSON-LD) Engine", () => {
    it("should generate valid parseable JSON-LD for every page", () => {
      for (const page of pages) {
        const jsonLd = generateStructuredData(page);
        expect(typeof jsonLd).toBe("string");
        const parsed = JSON.parse(jsonLd);
        expect(parsed["@context"]).toBe("https://schema.org");
        expect(Array.isArray(parsed["@graph"])).toBe(true);
        expect(parsed["@graph"].length).toBeGreaterThanOrEqual(3); // WebPage, BreadcrumbList, FAQPage
      }
    });

    it("should produce Service schema for remote-managed-event-services", () => {
      const managedPage = getMarketingPage("remote-managed-event-services");
      expect(managedPage).toBeDefined();
      const jsonLd = generateStructuredData(managedPage!);
      const parsed = JSON.parse(jsonLd);
      const serviceNode = parsed["@graph"].find((node: any) => node["@type"] === "Service");
      expect(serviceNode).toBeDefined();
      expect(serviceNode.provider["@type"]).toBe("Organization");
      expect(serviceNode.provider.name).toBe("UrPass");
    });

    it("should produce SoftwareApplication schema for software pages", () => {
      const qrCheckinPage = getMarketingPage("qr-event-check-in-software");
      expect(qrCheckinPage).toBeDefined();
      const jsonLd = generateStructuredData(qrCheckinPage!);
      const parsed = JSON.parse(jsonLd);
      const appNode = parsed["@graph"].find((node: any) => node["@type"] === "SoftwareApplication");
      expect(appNode).toBeDefined();
      expect(appNode.applicationCategory).toBe("BusinessApplication");
    });
  });

  describe("Internal Linking Engine", () => {
    it("should return between 3 and 5 related pages without self-links", () => {
      for (const page of pages) {
        const related = getRelatedPages(page);
        expect(related.length).toBeGreaterThanOrEqual(3);
        expect(related.length).toBeLessThanOrEqual(5);

        for (const item of related) {
          expect(item.slug).not.toBe(page.slug);
          const targetExists = ALL_MARKETING_PAGES.some((p) => p.slug === item.slug);
          expect(targetExists).toBe(true);
        }
      }
    });
  });

  describe("Next.js Metadata Generator", () => {
    it("should produce comprehensive Next.js metadata objects", () => {
      for (const page of pages) {
        const meta = generateMarketingMetadata(page);
        expect(meta.title).toBe(page.title);
        expect(meta.description).toBe(page.description);
        expect(meta.alternates?.canonical).toBe(page.canonicalUrl);
        expect(meta.openGraph?.title).toBe(page.title);
        expect(meta.openGraph?.url).toBe(page.canonicalUrl);
        expect((meta.twitter as any)?.card).toBe("summary_large_image");
      }
    });
  });

  describe("Managed Inquiry Validation Schema", () => {
    it("should accept valid inquiry submission", () => {
      const validPayload = {
        organizerName: "Bangalore Tech Events",
        businessEmail: "organizer@techconf.in",
        phoneNumber: "+91 98765 43210",
        eventType: "Tech Fest 2026",
        eventDate: "2026-12-15",
        city: "Bengaluru",
        estimatedAttendees: "2500",
        eventModel: "paid",
        preferredPackage: "pro",
        supportRequirements: ["qr_configuration", "scanner_training"],
        comments: "Need multi-gate scanner training for 6 gate captains.",
        consentGiven: true,
        slug: "college-fest-qr-ticketing",
        cluster: "recurring",
      };

      const result = inquirySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject honeypot-filled bot submissions", () => {
      const botPayload = {
        organizerName: "Spammer",
        businessEmail: "bot@spam.com",
        phoneNumber: "12345678",
        eventType: "Spam Event",
        eventDate: "2026-12-01",
        city: "Nowhere",
        estimatedAttendees: "100",
        eventModel: "free",
        preferredPackage: "essential",
        consentGiven: true,
        honeypot: "http://spam-link.ru",
      };

      const result = inquirySchema.safeParse(botPayload);
      expect(result.success).toBe(false);
    });

    it("should reject submissions without explicit consent", () => {
      const noConsentPayload = {
        organizerName: "John Doe",
        businessEmail: "john@example.com",
        phoneNumber: "+91 98888 77777",
        eventType: "New Year Bash",
        eventDate: "2026-12-31",
        city: "Goa",
        estimatedAttendees: "800",
        eventModel: "paid",
        preferredPackage: "essential",
        consentGiven: false,
      };

      const result = inquirySchema.safeParse(noConsentPayload);
      expect(result.success).toBe(false);
    });
  });
});
