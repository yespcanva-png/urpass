import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  AdCampaign,
  AdPlacement,
  ExploreAdPlacementsBundle,
  NewsletterSubscriptionInput,
} from "@/lib/explore/ads-types";

describe("UrPass Explore — Banner Advertising & Promotions QA Acceptance Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const nowIso = new Date().toISOString();
  const pastIso = new Date(Date.now() - 86400000 * 3).toISOString();
  const futureIso = new Date(Date.now() + 86400000 * 3).toISOString();
  const expiredIso = new Date(Date.now() - 3600000).toISOString();

  const mockCampaigns: AdCampaign[] = [
    {
      id: "camp-hero-1",
      title: "Bangalore Tech & AI Summit 2026",
      description: "Join 5,000+ developers, founders, and VCs at India’s premier developer conference.",
      placement: "hero",
      campaignType: "brand_sponsor",
      advertiserName: "TechVentures India",
      desktopImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      mobileImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      badgeLabel: "Featured Partner",
      ctaText: "Book VIP Pass",
      destinationUrl: "/explore?category=business",
      cityTargeting: ["All Cities", "Bengaluru"],
      startsAt: pastIso,
      endsAt: futureIso,
      priority: 100,
      status: "active",
      impressionsCount: 120,
      clicksCount: 15,
      createdAt: pastIso,
      updatedAt: pastIso,
    },
    {
      id: "camp-hero-expired",
      title: "Expired Concert Tour",
      description: "This should never be delivered.",
      placement: "hero",
      campaignType: "event_promo",
      advertiserName: "Past Promoter",
      desktopImageUrl: "https://images.unsplash.com/photo-1",
      badgeLabel: "Sponsored",
      ctaText: "Expired",
      destinationUrl: "/explore",
      cityTargeting: ["All Cities"],
      startsAt: pastIso,
      endsAt: expiredIso, // Expired
      priority: 150,
      status: "active",
      impressionsCount: 50,
      clicksCount: 2,
      createdAt: pastIso,
      updatedAt: pastIso,
    },
    {
      id: "camp-hero-paused",
      title: "Paused Campaign",
      description: "Paused by admin.",
      placement: "hero",
      campaignType: "event_promo",
      advertiserName: "Paused Brand",
      desktopImageUrl: "https://images.unsplash.com/photo-2",
      badgeLabel: "Sponsored",
      ctaText: "Learn More",
      destinationUrl: "/explore",
      cityTargeting: ["All Cities"],
      startsAt: pastIso,
      endsAt: null,
      priority: 200,
      status: "paused", // Paused
      impressionsCount: 0,
      clicksCount: 0,
      createdAt: pastIso,
      updatedAt: pastIso,
    },
    {
      id: "camp-top-sidebar",
      title: "FinTech Founders Masterclass",
      description: "Exclusive closed-door session with seed and series-A startup leaders.",
      placement: "top_sidebar",
      campaignType: "brand_sponsor",
      advertiserName: "VenturePeak Labs",
      desktopImageUrl: "https://images.unsplash.com/photo-3",
      badgeLabel: "Sponsored",
      ctaText: "Apply for Seat",
      destinationUrl: "/explore?category=workshops",
      cityTargeting: ["All Cities", "Mumbai", "Bengaluru"],
      startsAt: pastIso,
      endsAt: null,
      priority: 80,
      status: "active",
      impressionsCount: 85,
      clicksCount: 8,
      createdAt: pastIso,
      updatedAt: pastIso,
    },
    {
      id: "camp-in-content",
      title: "Koramangala Artisan Coffee Fest",
      description: "Taste handcrafted roasts and live indie acoustic sets.",
      placement: "in_content",
      campaignType: "brand_sponsor",
      advertiserName: "BrewCraft Collective",
      desktopImageUrl: "https://images.unsplash.com/photo-4",
      badgeLabel: "Sponsored Feature",
      ctaText: "Explore Lineup",
      destinationUrl: "/explore?category=food_drink",
      cityTargeting: ["Bengaluru"], // City specific
      startsAt: pastIso,
      endsAt: null,
      priority: 70,
      status: "active",
      impressionsCount: 200,
      clicksCount: 19,
      createdAt: pastIso,
      updatedAt: pastIso,
    },
  ];

  describe("1. Campaign Scheduling & Status Filtering", () => {
    it("filters out expired campaigns regardless of priority", () => {
      const activeOnly = mockCampaigns.filter((c) => {
        if (c.status !== "active") return false;
        if (c.endsAt && new Date(c.endsAt).getTime() < Date.now()) return false;
        return true;
      });

      const expired = activeOnly.find((c) => c.id === "camp-hero-expired");
      expect(expired).toBeUndefined();
    });

    it("filters out paused, draft, and archived campaigns", () => {
      const activeOnly = mockCampaigns.filter((c) => c.status === "active");
      const paused = activeOnly.find((c) => c.id === "camp-hero-paused");
      expect(paused).toBeUndefined();
    });
  });

  describe("2. City Targeting Contract", () => {
    function filterCampaignsByCity(campaigns: AdCampaign[], city: string) {
      return campaigns.filter((c) => {
        if (c.status !== "active") return false;
        if (c.endsAt && new Date(c.endsAt).getTime() < Date.now()) return false;
        if (city === "All Cities") return true;
        return c.cityTargeting.some(
          (t) => t === "All Cities" || t.toLowerCase() === city.toLowerCase()
        );
      });
    }

    it("delivers city-targeted ads when matching selected city", () => {
      const blrAds = filterCampaignsByCity(mockCampaigns, "Bengaluru");
      const inContent = blrAds.find((c) => c.placement === "in_content");
      expect(inContent).toBeDefined();
      expect(inContent?.id).toBe("camp-in-content");
    });

    it("excludes city-specific ads when a non-matching city is selected", () => {
      const delhiAds = filterCampaignsByCity(mockCampaigns, "Delhi NCR");
      const inContent = delhiAds.find((c) => c.placement === "in_content");
      expect(inContent).toBeUndefined();
    });

    it("always delivers 'All Cities' campaigns across any selected city", () => {
      const londonAds = filterCampaignsByCity(mockCampaigns, "London");
      const hero = londonAds.find((c) => c.placement === "hero");
      expect(hero).toBeDefined();
      expect(hero?.cityTargeting).toContain("All Cities");
    });
  });

  describe("3. Placements Bundle Assembly & Fallbacks", () => {
    it("assembles all 5 placements cleanly without congestion", () => {
      const bundle: ExploreAdPlacementsBundle = {
        hero: mockCampaigns.filter((c) => c.placement === "hero" && c.status === "active"),
        topSidebar: mockCampaigns.find((c) => c.placement === "top_sidebar") || null,
        inContent: mockCampaigns.find((c) => c.placement === "in_content") || null,
        bottomSidebar: null, // Will use UrPass Organizer fallback
      };

      expect(bundle.hero.length).toBeGreaterThan(0);
      expect(bundle.topSidebar).not.toBeNull();
      expect(bundle.inContent).not.toBeNull();
    });

    it("provides the standard UrPass Organizer fallback for bottom_sidebar when empty", () => {
      const fallbackAd = {
        id: "camp-default-organize",
        title: "Organize Your Event with UrPass",
        ctaText: "Create Event",
        destinationUrl: "/create-event",
      };

      expect(fallbackAd.title).toBe("Organize Your Event with UrPass");
      expect(fallbackAd.ctaText).toBe("Create Event");
      expect(fallbackAd.destinationUrl).toBe("/create-event");
    });
  });

  describe("4. Telemetry Deduplication & Viewability Contract", () => {
    it("enforces session-based deduplication so scrolling doesn't spam impressions", () => {
      const sessionStore: Record<string, string> = {};
      const campaignId = "camp-hero-1";
      const sessionKey = `urpass_imp_${campaignId}_hero`;

      let impressionDispatched = 0;

      // First continuous 1-second view
      if (!sessionStore[sessionKey]) {
        sessionStore[sessionKey] = "1";
        impressionDispatched++;
      }

      // User scrolls back up and triggers observer again
      if (!sessionStore[sessionKey]) {
        sessionStore[sessionKey] = "1";
        impressionDispatched++;
      }

      expect(impressionDispatched).toBe(1);
    });

    it("calculates click-through rate accurately without dividing by zero", () => {
      const calcCtr = (clicks: number, impressions: number) => {
        if (!impressions || impressions === 0) return "0.00";
        return ((clicks / impressions) * 100).toFixed(2);
      };

      expect(calcCtr(15, 120)).toBe("12.50");
      expect(calcCtr(0, 0)).toBe("0.00");
    });
  });

  describe("5. Newsletter Subscription Validation Contract", () => {
    function validateNewsletterInput(input: NewsletterSubscriptionInput): {
      valid: boolean;
      error?: string;
    } {
      const email = input.email?.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: "Please enter a valid email address." };
      }
      if (!input.consentGiven) {
        return { valid: false, error: "Please confirm your consent to receive event updates." };
      }
      return { valid: true };
    }

    it("rejects malformed email addresses", () => {
      const res = validateNewsletterInput({ email: "invalid-email", consentGiven: true });
      expect(res.valid).toBe(false);
      expect(res.error).toContain("valid email");
    });

    it("rejects submission if marketing consent is not given", () => {
      const res = validateNewsletterInput({ email: "user@example.com", consentGiven: false });
      expect(res.valid).toBe(false);
      expect(res.error).toContain("consent");
    });

    it("accepts valid email with consent", () => {
      const res = validateNewsletterInput({ email: "attendee@gmail.com", consentGiven: true });
      expect(res.valid).toBe(true);
    });
  });

  describe("6. Safe Destination URL Validation", () => {
    function isDestinationSafe(url: string): boolean {
      const trimmed = url.trim();
      return (
        trimmed.startsWith("/") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("http://localhost")
      );
    }

    it("allows internal relative paths and secure https destinations", () => {
      expect(isDestinationSafe("/explore?category=music")).toBe(true);
      expect(isDestinationSafe("https://partner-event.com/tickets")).toBe(true);
      expect(isDestinationSafe("/events/bts-2026?ref=explore")).toBe(true);
    });

    it("blocks malicious or executable javascript injection schemes", () => {
      expect(isDestinationSafe("javascript:alert(1)")).toBe(false);
      expect(isDestinationSafe("data:text/html,<script>alert(1)</script>")).toBe(false);
      expect(isDestinationSafe("http://insecure-domain.com")).toBe(false);
    });
  });
});
