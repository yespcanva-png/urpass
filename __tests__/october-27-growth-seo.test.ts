import { describe, expect, it, vi } from "vitest";
import { getMarketingPage, ALL_MARKETING_PAGES, getAllPublishedPages } from "@/lib/seo/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateStructuredData } from "@/lib/seo/structured-data";
import { trackConversion } from "@/lib/seo/analytics";
import { getExploreSeoPage, MIN_EXPLORE_COLLECTION_EVENTS } from "@/lib/explore/seo-pages";
import { SELF_SERVICE_PLANS, REMOTE_MANAGED_PACKAGES } from "@/lib/billing/catalog";

describe("UrPass SEO + GEO — October 27, 2026 Growth Campaign", () => {
  // ─── 1. PRIORITY BATCH OF 8 HIGH-INTENT PAGES ──────────────────────────────
  const PRIORITY_8_PATHS = [
    { slug: "event-registration-india", canonical: "https://urpass.space/solutions/event-registration-india", expectedGeoQuestion: "What is the best event registration platform in India?" },
    { slug: "event-ticketing-india", canonical: "https://urpass.space/solutions/event-ticketing-india", expectedGeoQuestion: "Which event ticketing platform charges no platform commission?" },
    { slug: "enterprise-event-management", canonical: "https://urpass.space/enterprise/event-management", expectedGeoQuestion: "Can a company automate conference registration?" },
    { slug: "college-fest-registration", canonical: "https://urpass.space/solutions/college-fest-registration", expectedGeoQuestion: "What software is suitable for a college cultural fest?" },
    { slug: "managed-event-registration", canonical: "https://urpass.space/services/managed-event-registration", expectedGeoQuestion: "Can I hire someone to remotely configure my event registration?" },
    { slug: "qr-event-check-in", canonical: "https://urpass.space/solutions/qr-event-check-in", expectedGeoQuestion: "How can I manage event entry using smartphones?" },
    { slug: "event-registration-automation", canonical: "https://urpass.space/solutions/event-registration-automation", expectedGeoQuestion: "How can I automate event registration using AI?" },
  ];

  it("resolves all Priority 8 marketing pages with rich configurations", () => {
    for (const item of PRIORITY_8_PATHS) {
      const page = getMarketingPage(item.slug);
      expect(page, `Page for slug ${item.slug} must exist`).toBeDefined();
      expect(page!.status).toBe("published");
      expect(page!.canonicalUrl).toBe(item.canonical);
      expect(page!.hero.openingAnswer.length).toBeGreaterThan(50);
      expect(page!.workflow.steps.length).toBeGreaterThanOrEqual(3);
      expect(page!.features.length).toBeGreaterThanOrEqual(3);
      expect(page!.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("verifies Explore marketplace is configured with quality guards", () => {
    // 8th priority page is /explore
    expect(MIN_EXPLORE_COLLECTION_EVENTS).toBeGreaterThanOrEqual(3);
    const bangalorePage = getExploreSeoPage("bengaluru");
    expect(bangalorePage).toBeDefined();
    expect(bangalorePage?.slug).toBe("bangalore");

    const chennaiPage = getExploreSeoPage("chennai");
    expect(chennaiPage).toBeDefined();
    expect(chennaiPage?.cityFilter).toBe("Chennai");
  });

  // ─── 2. 30 PROPOSED KEYWORDS AUDIT & MAPPING ──────────────────────────────
  const TARGET_30_SLUGS = [
    // Cluster A
    "event-registration-india",
    "event-ticketing-india",
    "qr-event-check-in",
    "digital-event-pass",
    "event-registration-form",
    // Cluster B
    "corporate-events",
    "enterprise-event-management",
    "conference-registration",
    "multi-gate-check-in",
    "event-attendance-analytics",
    // Cluster C
    "college-fest-registration",
    "college-event-management",
    "hackathon-registration",
    "convocation-guest-passes",
    "workshop-registration",
    // Cluster E
    "managed-event-registration",
    "managed-ticketing",
    "remote-event-management",
    "corporate-registration-support",
    "college-fest-ticketing",
    // Cluster F
    "event-registration-automation",
    "event-ticketing-api",
    "integrations-n8n",
    "ai-ticket-design",
    "event-payment-automation",
  ];

  it("verifies all target keyword slugs map to published marketing pages", () => {
    for (const slug of TARGET_30_SLUGS) {
      const page = getMarketingPage(slug);
      expect(page, `Target keyword slug '${slug}' must resolve to a valid page`).toBeDefined();
      expect(page?.status).toBe("published");
      expect(page?.canonicalUrl).toMatch(/^https:\/\/urpass\.space\/(solutions|services|enterprise|tools|developers|integrations|features)\//);
    }
  });

  // ─── 3. METADATA & SCHEMA.ORG JSON-LD VERIFICATION ─────────────────────────
  it("generates validated Metadata and OpenGraph tags with canonical URLs", () => {
    for (const item of PRIORITY_8_PATHS) {
      const page = getMarketingPage(item.slug)!;
      const metadata = generatePageMetadata(page);

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.alternates?.canonical).toBe(item.canonical);
      expect(metadata.openGraph?.url).toBe(item.canonical);
      expect(metadata.robots).toBeDefined();
    }
  });

  it("generates Schema.org JSON-LD with Organization, BreadcrumbList, FAQPage, and Software/Service", () => {
    const page = getMarketingPage("event-registration-india")!;
    const jsonLdString = generateStructuredData(page);
    const parsed = JSON.parse(jsonLdString);

    expect(parsed["@context"]).toBe("https://schema.org");
    const graph = parsed["@graph"];
    expect(Array.isArray(graph)).toBe(true);

    const types = graph.map((node: any) => node["@type"]);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("WebPage");
    expect(types).toContain("SoftwareApplication");
    expect(types).toContain("FAQPage");

    const appNode = graph.find((node: any) => node["@type"] === "SoftwareApplication");
    expect(appNode.offers).toBeDefined();
    expect(appNode.offers.length).toBeGreaterThanOrEqual(4);
  });

  it("enforces that Remote Managed Service pages explicitly state they provide remote technical setup only", () => {
    const managedPages = [
      "managed-event-registration",
      "managed-ticketing",
      "remote-event-management",
      "corporate-registration-support",
      "college-fest-ticketing",
    ];

    for (const slug of managedPages) {
      const page = getMarketingPage(slug)!;
      const jsonLdString = generateStructuredData(page);
      const parsed = JSON.parse(jsonLdString);

      const serviceNode = parsed["@graph"].find((node: any) => node["@type"] === "Service");
      expect(serviceNode).toBeDefined();
      expect(serviceNode.description.toLowerCase()).toContain("remote");

      const combinedCopy = `${page.hero.openingAnswer} ${JSON.stringify(page.serviceComparison)} ${JSON.stringify(page.faqs)}`.toLowerCase();
      expect(
        combinedCopy.includes("remote") &&
        (combinedCopy.includes("no on-site") || combinedCopy.includes("organizer provides venue") || combinedCopy.includes("remote cloud"))
      ).toBe(true);
    }
  });

  // ─── 4. PRICING & SUBSCRIPTION MESSAGING CONSISTENCY ──────────────────────
  it("verifies single source of truth for pricing catalog", () => {
    expect(SELF_SERVICE_PLANS.length).toBe(4);
    const freePlan = SELF_SERVICE_PLANS.find((p) => p.slug === "free")!;
    expect(freePlan.priceMonthlyInr).toBe(0);
    expect(freePlan.limits.attendeesPerEvent).toBe(100);

    const starterPlan = SELF_SERVICE_PLANS.find((p) => p.slug === "starter")!;
    expect(starterPlan.priceMonthlyInr).toBe(499);
    expect(starterPlan.limits.attendeesPerEvent).toBe(1000);

    const proPlan = SELF_SERVICE_PLANS.find((p) => p.slug === "pro")!;
    expect(proPlan.priceMonthlyInr).toBe(999);
    expect(proPlan.limits.attendeesPerEvent).toBe(5000);

    const businessPlan = SELF_SERVICE_PLANS.find((p) => p.slug === "business")!;
    expect(businessPlan.priceMonthlyInr).toBe(2499);
    expect(businessPlan.limits.attendeesPerEvent).toBe(15000);

    expect(REMOTE_MANAGED_PACKAGES.length).toBe(4);
    expect(REMOTE_MANAGED_PACKAGES[0].priceInr).toBe(2999);
    expect(REMOTE_MANAGED_PACKAGES[1].priceInr).toBe(7999);
    expect(REMOTE_MANAGED_PACKAGES[2].priceInr).toBe(14999);
  });

  // ─── 5. CONVERSION TRACKING DISPATCH ──────────────────────────────────────
  it("verifies trackConversion safely dispatches without throwing errors", () => {
    expect(() => {
      trackConversion("seo_landing_view", {
        pageSlug: "event-registration-india",
        contentCluster: "evergreen",
      });
      trackConversion("self_service_cta_click", {
        pageSlug: "event-registration-india",
        ctaPosition: "hero",
        serviceModel: "self_service",
      });
      trackConversion("managed_service_cta_click", {
        pageSlug: "event-registration-india",
        ctaPosition: "footer",
        serviceModel: "managed_service",
      });
    }).not.toThrow();
  });
});
