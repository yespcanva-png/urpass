import { describe, it, expect } from "vitest";
import {
  EXPLORE_SEO_PAGES,
  getExploreSeoPage,
  getAllExploreSeoSlugs,
  getAllExploreSeoPages,
  getExploreSeoPagesByType,
} from "@/lib/explore/seo-pages";
import { generateStaticParams } from "@/app/explore/[slug]/page";

describe("UrPass Explore — 50 SEO + GEO Pages Architecture", () => {
  it("defines exactly 50 target SEO & GEO pages", () => {
    expect(EXPLORE_SEO_PAGES).toHaveLength(50);
    const slugs = getAllExploreSeoSlugs();
    expect(slugs).toHaveLength(50);
    // Ensure all slugs are unique
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(50);
  });

  describe("1. City-based discovery (15 pages)", () => {
    const expectedCities = [
      "bangalore",
      "chennai",
      "hyderabad",
      "coimbatore",
      "mumbai",
      "delhi-ncr",
      "pune",
      "kochi",
      "thiruvananthapuram",
      "madurai",
      "erode",
      "tiruppur",
      "kolkata",
      "ahmedabad",
      "jaipur",
    ];

    it("contains all 15 targeted Indian city pages", () => {
      const cityPages = getExploreSeoPagesByType("city");
      expect(cityPages).toHaveLength(15);
      const citySlugs = cityPages.map((p) => p.slug);
      for (const city of expectedCities) {
        expect(citySlugs).toContain(city);
      }
    });

    it("configures Bangalore as P1 with local neighbourhoods and direct answer", () => {
      const bgl = getExploreSeoPage("bangalore");
      expect(bgl).toBeDefined();
      expect(bgl?.priority).toBe("P1");
      expect(bgl?.cityFilter).toBe("Bengaluru");
      expect(bgl?.h1).toBe("Discover Events in Bangalore");
      expect(bgl?.seoTitle).toContain("Events in Bangalore");
      expect(bgl?.directAnswer).toContain("Bangalore");
      expect(bgl?.highlights.length).toBeGreaterThanOrEqual(3);
      expect(bgl?.faqs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("2. Event category discovery (15 pages)", () => {
    const expectedCategories = [
      "music-concerts",
      "standup-comedy",
      "food-festivals",
      "business-networking",
      "workshops",
      "college-fests",
      "cultural-events",
      "tech-events",
      "sports-events",
      "startup-events",
      "art-workshops",
      "dance-dj-events",
      "family-kids-events",
      "exhibitions",
      "wellness-events",
    ];

    it("contains all 15 category pages", () => {
      const catPages = getExploreSeoPagesByType("category");
      expect(catPages).toHaveLength(15);
      const catSlugs = catPages.map((p) => p.slug);
      for (const cat of expectedCategories) {
        expect(catSlugs).toContain(cat);
      }
    });

    it("configures Music Concerts with direct ticket and concert keywords", () => {
      const music = getExploreSeoPage("music-concerts");
      expect(music).toBeDefined();
      expect(music?.categoryFilter).toBe("music");
      expect(music?.seoTitle).toContain("Music Concerts in India");
      expect(music?.faqs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("3. Festival and seasonal discovery (10 pages)", () => {
    const expectedSeasonal = [
      "halloween-events-2026",
      "christmas-events-2026",
      "new-year-parties-2027",
      "new-years-eve-2026",
      "pongal-events-2027",
      "makar-sankranti-events-2027",
      "republic-day-events-2027",
      "valentines-day-events-2027",
      "holi-events-2027",
      "womens-day-events-2027",
    ];

    it("contains all 10 festival and seasonal pages", () => {
      const seasonalPages = getExploreSeoPagesByType("seasonal");
      expect(seasonalPages).toHaveLength(10);
      const seasonalSlugs = seasonalPages.map((p) => p.slug);
      for (const season of expectedSeasonal) {
        expect(seasonalSlugs).toContain(season);
      }
    });

    it("configures Halloween 2026 and New Year Parties 2027 as P1", () => {
      const halloween = getExploreSeoPage("halloween-events-2026");
      expect(halloween?.priority).toBe("P1");
      const nye = getExploreSeoPage("new-year-parties-2027");
      expect(nye?.priority).toBe("P1");
    });
  });

  describe("4. High-intent discovery pages (10 pages)", () => {
    const expectedIntent = [
      "this-weekend",
      "today",
      "tomorrow",
      "free-events",
      "ticketed-events",
      "online-events",
      "weekend-activities",
      "things-to-do-with-friends",
      "family-activities",
      "event-tickets",
    ];

    it("contains all 10 high-intent discovery pages", () => {
      const intentPages = getExploreSeoPagesByType("intent");
      expect(intentPages).toHaveLength(10);
      const intentSlugs = intentPages.map((p) => p.slug);
      for (const intent of expectedIntent) {
        expect(intentSlugs).toContain(intent);
      }
    });

    it("configures this-weekend with dateFilter", () => {
      const wknd = getExploreSeoPage("this-weekend");
      expect(wknd?.dateFilter).toBe("this_weekend");
      expect(wknd?.priority).toBe("P1");
    });

    it("configures free-events with zero-cost filter", () => {
      const free = getExploreSeoPage("free-events");
      expect(free?.pricingFilter).toBe("free");
      expect(free?.priority).toBe("P1");
    });
  });

  describe("5. Static Params & Next.js Routing", () => {
    it("generates static parameters for all 50 slugs", async () => {
      const params = await generateStaticParams();
      expect(params).toHaveLength(50);
      expect(params.map((p) => p.slug)).toEqual(getAllExploreSeoSlugs());
    });
  });

  describe("6. GEO & SEO Quality Standards", () => {
    it("ensures every page has a complete GEO direct answer and FAQ set", () => {
      for (const page of EXPLORE_SEO_PAGES) {
        expect(page.h1).toBeTruthy();
        expect(page.seoTitle).toBeTruthy();
        expect(page.metaDescription).toBeTruthy();
        expect(page.metaDescription.length).toBeGreaterThan(40);
        expect(page.directAnswer).toBeTruthy();
        expect(page.directAnswer.length).toBeGreaterThan(50);
        expect(page.faqs.length).toBeGreaterThanOrEqual(1);
        expect(page.highlights.length).toBeGreaterThanOrEqual(1);
        expect(page.relatedSlugs.length).toBeGreaterThanOrEqual(2);
      }
    });
  });
});
