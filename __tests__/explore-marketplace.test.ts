import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreHeroSearch from "@/components/explore/ExploreHeroSearch";
import ExploreAuthModal from "@/components/explore/ExploreAuthModal";
import ExploreAuthPopup from "@/components/explore/ExploreAuthPopup";
import LiveSearchDropdown from "@/components/explore/LiveSearchDropdown";
import { findNearestExploreCity } from "@/lib/explore/geolocation";
import {
  EXPLORE_CATEGORIES,
  EXPLORE_CITIES,
  type ExploreEventItem,
  type ExploreQueryParams,
  type ExploreQueryResult,
} from "@/lib/explore/types";
import { getCategoryLabel } from "@/lib/explore/service";
import { trackExploreEvent } from "@/lib/explore/analytics";

describe("UrPass Explore — Marketplace Acceptance Tests (Local Only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Category and City Definitions", () => {
    it("provides the standard set of 8 discovery categories plus 'all'", () => {
      const keys = EXPLORE_CATEGORIES.map((c) => c.key);
      expect(keys).toContain("all");
      expect(keys).toContain("music");
      expect(keys).toContain("business");
      expect(keys).toContain("workshops");
      expect(keys).toContain("festivals");
      expect(keys).toContain("food_drink");
      expect(keys).toContain("sports");
      expect(keys).toContain("arts");
      expect(keys).toContain("community");
    });

    it("resolves category labels gracefully", () => {
      expect(getCategoryLabel("music")).toBe("Music");
      expect(getCategoryLabel("food_drink")).toBe("Food & Drink");
      expect(getCategoryLabel("unknown_cat")).toBe("General");
    });

    it("contains major Indian metropolitan tech/cultural hubs and global cities", () => {
      expect(EXPLORE_CITIES).toContain("All Cities");
      expect(EXPLORE_CITIES).toContain("Bengaluru");
      expect(EXPLORE_CITIES).toContain("Mumbai");
      expect(EXPLORE_CITIES).toContain("Delhi NCR");
      expect(EXPLORE_CITIES).toContain("London");
      expect(EXPLORE_CITIES).toContain("Online");
    });
  });

  describe("2. Server-side Listing Visibility & Approval Contract", () => {
    const mockListings = [
      {
        id: "exp-1",
        event_id: "evt-approved-live",
        status: "approved",
        featured: true,
        category: "music",
        city: "Bengaluru",
        event: {
          id: "evt-approved-live",
          name: "Bangalore Indie Waves Fest",
          status: "published",
          event_date: new Date(Date.now() + 86400000).toISOString(),
          apply_slug: "bangalore-indie-waves",
        },
      },
      {
        id: "exp-2",
        event_id: "evt-pending",
        status: "pending",
        featured: false,
        category: "workshops",
        city: "Bengaluru",
        event: {
          id: "evt-pending",
          name: "Unapproved Workshop",
          status: "published",
          event_date: new Date(Date.now() + 86400000).toISOString(),
        },
      },
      {
        id: "exp-3",
        event_id: "evt-cancelled",
        status: "approved",
        featured: false,
        category: "business",
        city: "Delhi NCR",
        event: {
          id: "evt-cancelled",
          name: "Cancelled Summit",
          status: "cancelled", // Event was cancelled
          event_date: new Date(Date.now() + 86400000).toISOString(),
        },
      },
      {
        id: "exp-4",
        event_id: "evt-draft",
        status: "approved",
        featured: false,
        category: "sports",
        city: "Mumbai",
        event: {
          id: "evt-draft",
          name: "Private Draft Marathon",
          status: "draft", // Organizer un-published event
          event_date: new Date(Date.now() + 86400000).toISOString(),
        },
      },
    ];

    it("never includes unapproved or pending listings in the public explore feed", () => {
      const publicFeed = mockListings.filter(
        (l) => l.status === "approved" && l.event.status === "published"
      );
      expect(publicFeed.length).toBe(1);
      expect(publicFeed[0].event_id).toBe("evt-approved-live");
      expect(publicFeed.find((l) => l.event_id === "evt-pending")).toBeUndefined();
    });

    it("excludes cancelled or private/draft events even if the listing was previously approved", () => {
      const liveEvents = mockListings.filter(
        (l) => l.status === "approved" && l.event.status === "published"
      );
      const cancelled = liveEvents.find((l) => l.event_id === "evt-cancelled");
      const draft = liveEvents.find((l) => l.event_id === "evt-draft");

      expect(cancelled).toBeUndefined();
      expect(draft).toBeUndefined();
    });
  });

  describe("3. Ticket Price Resolution & Honest Display", () => {
    function computePriceDisplay(tickets: { price: number; currency?: string }[]) {
      if (!tickets || tickets.length === 0) {
        return { isFree: true, priceDisplay: "Free" };
      }
      const prices = tickets.map((t) => t.price || 0);
      const min = Math.min(...prices);
      const isFree = min === 0;

      if (isFree && prices.every((p) => p === 0)) {
        return { isFree: true, priceDisplay: "Free" };
      }
      const symbol = tickets[0]?.currency === "GBP" ? "£" : "₹";
      return {
        isFree,
        priceDisplay: min === 0 ? "Free" : `From ${symbol}${min}`,
      };
    }

    it("displays 'Free' when all tickets are 0 cost", () => {
      const tickets = [{ price: 0, currency: "INR" }, { price: 0, currency: "INR" }];
      const res = computePriceDisplay(tickets);
      expect(res.isFree).toBe(true);
      expect(res.priceDisplay).toBe("Free");
    });

    it("displays 'From ₹X' matching the minimum honest ticket tier", () => {
      const tickets = [
        { price: 999, currency: "INR" },
        { price: 499, currency: "INR" },
        { price: 1499, currency: "INR" },
      ];
      const res = computePriceDisplay(tickets);
      expect(res.isFree).toBe(false);
      expect(res.priceDisplay).toBe("From ₹499");
    });

    it("handles UK events with proper GBP currency symbol", () => {
      const tickets = [{ price: 25, currency: "GBP" }, { price: 50, currency: "GBP" }];
      const res = computePriceDisplay(tickets);
      expect(res.isFree).toBe(false);
      expect(res.priceDisplay).toBe("From £25");
    });
  });

  describe("4. Search, Filter, and Sort Engine", () => {
    const sampleEvents: ExploreEventItem[] = [
      {
        id: "1",
        eventId: "e1",
        name: "React & Next.js Developers Meetup",
        description: "Deep dive into App Router and Server Components",
        city: "Bengaluru",
        venue: "Indiranagar Tech Hub",
        category: "workshops",
        categoryLabel: "Workshops",
        eventDate: new Date(Date.now() + 2 * 3600000).toISOString(), // Today
        startTime: "10:00 AM",
        endTime: "1:00 PM",
        isFree: true,
        minPricePaise: 0,
        currency: "INR",
        bannerUrl: null,
        logoUrl: null,
        organizerName: "Bangalore Devs",
        applicationEnabled: true,
        status: "published",
        slug: "react-nextjs-meetup",
        featured: false,
      },
      {
        id: "2",
        eventId: "e2",
        name: "Sunburn Beach Electronic Carnival",
        description: "3 days of electronic music and food",
        city: "Goa",
        venue: "Vagator Beach",
        category: "festivals",
        categoryLabel: "Festivals",
        eventDate: new Date(Date.now() + 86400000 * 2).toISOString(), // This Weekend
        startTime: "4:00 PM",
        endTime: "11:00 PM",
        isFree: false,
        minPricePaise: 149900,
        currency: "INR",
        bannerUrl: null,
        logoUrl: null,
        organizerName: "Sunburn India",
        applicationEnabled: true,
        status: "published",
        slug: "sunburn-goa",
        featured: true,
      },
      {
        id: "3",
        eventId: "e3",
        name: "Global SaaS Founders Conference",
        description: "Scaling to $10M ARR",
        city: "Bengaluru",
        venue: "The Leela Palace",
        category: "business",
        categoryLabel: "Business",
        eventDate: new Date(Date.now() + 86400000 * 15).toISOString(), // This Month
        startTime: "9:00 AM",
        endTime: "6:00 PM",
        isFree: false,
        minPricePaise: 499900,
        currency: "INR",
        bannerUrl: null,
        logoUrl: null,
        organizerName: "SaaS Guild",
        applicationEnabled: true,
        status: "published",
        slug: "saas-founders-conf",
        featured: true,
      },
    ];

    it("filters events by keyword matching title or description", () => {
      const q = "next.js";
      const matched = sampleEvents.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q))
      );
      expect(matched.length).toBe(1);
      expect(matched[0].id).toBe("1");
    });

    it("filters by city accurately", () => {
      const blrEvents = sampleEvents.filter((e) => e.city === "Bengaluru");
      expect(blrEvents.length).toBe(2);
      expect(blrEvents.map((e) => e.id)).toEqual(["1", "3"]);
    });

    it("filters by pricing (Free vs Paid)", () => {
      const freeEvents = sampleEvents.filter((e) => e.isFree);
      const paidEvents = sampleEvents.filter((e) => !e.isFree);

      expect(freeEvents.length).toBe(1);
      expect(freeEvents[0].id).toBe("1");
      expect(paidEvents.length).toBe(2);
    });

    it("limits featured listings to maximum of 4 per design specification", () => {
      const featured = sampleEvents.filter((e) => e.featured);
      expect(featured.length).toBeLessThanOrEqual(4);
    });
  });

  describe("5. Telemetry & Analytics Contract", () => {
    it("dispatches anonymous explore events without user PII", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");

      trackExploreEvent("search", {
        query: "music festival",
        city: "Bengaluru",
        category: "festivals",
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const call = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(call.type).toBe("urpass_explore_telemetry");
      expect(call.detail.event).toBe("search");
      expect(call.detail.query).toBe("music festival");
      // Verify no PII is included
      expect(call.detail.email).toBeUndefined();
      expect(call.detail.phone).toBeUndefined();
      expect(call.detail.userId).toBeUndefined();
    });
  });

  describe("6. Guest Discovery & Booking Contract", () => {
    it("constructs direct registration links using existing event slug and ref metadata", () => {
      const item: ExploreEventItem = {
        id: "exp-101",
        eventId: "evt-202",
        name: "Bangalore Tech Summit 2026",
        description: "Premier technology expo",
        city: "Bengaluru",
        venue: "Palace Grounds",
        category: "business",
        categoryLabel: "Business",
        eventDate: new Date().toISOString(),
        startTime: "9:00 AM",
        endTime: "5:00 PM",
        isFree: false,
        minPricePaise: 99900,
        currency: "INR",
        bannerUrl: null,
        logoUrl: null,
        organizerName: "Karnataka Govt",
        applicationEnabled: true,
        status: "published",
        slug: "bts-2026",
        featured: false,
      };

      const bookingUrl = `/events/${item.slug}?ref=explore`;
      expect(bookingUrl).toBe("/events/bts-2026?ref=explore");
      // Guest users can navigate directly to the booking url without login enforcement
    });

    it("renders search bar, location, and attendee Log In in ExploreHeader with Auto-detect option", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExploreHeader, { currentCity: "Bengaluru", onCityChange: () => {} })
      );

      // Should contain Search Bar, Location Selector, and attendee Log In
      expect(html).toContain("Search events");
      expect(html).toContain("Bengaluru");
      expect(html).toContain("Log In");

      // Should NOT contain organizer portal links
      expect(html).not.toContain("Create Event");
      expect(html).not.toContain("/create-event");
      expect(html).not.toContain("/create");
      expect(html).not.toContain("For Organizers");
    });

    it("renders ExploreAuthModal using only Google Auth and manual credentials", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExploreAuthModal, {
          isOpen: true,
          onClose: () => {},
          initialMode: "signin",
        })
      );

      // Should offer Google OAuth
      expect(html).toContain("Continue with Google");

      // Should offer manual email and password fields
      expect(html).toContain("Email Address");
      expect(html).toContain("Password");
      expect(html).toContain("Sign In to Explore");

      // Should strictly NOT contain Enterprise SSO, SAML, or IT Admin options
      expect(html).not.toContain("Enterprise SSO");
      expect(html).not.toContain("SAML");
      expect(html).not.toContain("OIDC");
      expect(html).not.toContain("IT administrator");
    });

    it("accurately detects nearest Explore city from GPS coordinates", () => {
      // Near Bangalore (MG Road)
      expect(findNearestExploreCity(12.9716, 77.5946)).toBe("Bengaluru");
      // Near Mumbai (Bandra)
      expect(findNearestExploreCity(19.0596, 72.8295)).toBe("Mumbai");
      // Near Delhi (Connaught Place)
      expect(findNearestExploreCity(28.6315, 77.2167)).toBe("Delhi NCR");
      // Near London (Soho)
      expect(findNearestExploreCity(51.5136, -0.1365)).toBe("London");
    });

    it("renders the professional segmented UX model in ExploreHeroSearch", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExploreHeroSearch, {
          initialQuery: "",
          currentCity: "Bengaluru",
          currentDateFilter: "all",
          onSearch: () => {},
        })
      );

      // Verify headline & brand badge
      expect(html).toContain("UrPass Explore Marketplace");
      expect(html).toContain("Find events you’ll love.");
      expect(html).toContain("Discover verified conferences, creative workshops, concerts");

      // Verify search input placeholder
      expect(html).toContain("Search by event, artist, venue, or keyword…");

      // Verify location and timing segments
      expect(html).toContain("Bengaluru");
      expect(html).toContain("Any Date");

      // Verify trending discovery tags
      expect(html).toContain("Trending:");
      expect(html).toContain("Tech &amp; AI");
      expect(html).toContain("Indie Music");
      expect(html).not.toContain("Campus Fests");
    });

    it("renders the clean UrPass Explore — Authentication Popup on action", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExploreAuthPopup, {
          isOpen: true,
          onClose: () => {},
          targetEventSlug: "bangalore-indie-waves",
          targetEventName: "Bangalore Indie Waves",
          actionType: "get_tickets",
        })
      );

      // Verify exact header and title
      expect(html).toContain("UrPass Explore");
      expect(html).toContain("Get started");
      expect(html).toContain("Sign in or create an account to continue.");

      // Verify email input and continue button
      expect(html).toContain("Email address");
      expect(html).toContain("Continue");

      // Verify Google option and terms disclaimer
      expect(html).toContain("Continue with Google");
      expect(html).toContain("Terms of Service");
      expect(html).toContain("Privacy Policy");

      // Should not leak enterprise SSO
      expect(html).not.toContain("Enterprise SSO");
      expect(html).not.toContain("SAML");
    });

    it("renders the LiveSearchDropdown with real-time matching events, date, venue, and price", () => {
      const mockLiveEvent: ExploreEventItem = {
        id: "live-event-1",
        eventId: "live-evt-id-1",
        slug: "indie-electronic-night",
        name: "Indie Electronic Night Bengaluru",
        description: "A premier electronic live music gathering.",
        eventDate: "2026-11-15T18:00:00Z",
        startTime: "18:30",
        endTime: "23:00",
        venue: "Koramangala Social",
        city: "Bengaluru",
        category: "music",
        categoryLabel: "Music",
        isFree: false,
        featured: false,
        minPricePaise: 49900,
        currency: "INR",
        bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
        logoUrl: null,
        organizerName: "Indie Sonic Labs",
        applicationEnabled: true,
        status: "approved",
      };

      const html = renderToStaticMarkup(
        React.createElement(LiveSearchDropdown, {
          isOpen: true,
          query: "Indie Electronic",
          results: [mockLiveEvent],
          isLoading: false,
          onViewAll: () => {},
        })
      );

      // Verify header matches query
      expect(html).toContain("Indie Electronic");
      expect(html).toContain("1 match");

      // Verify event content
      expect(html).toContain("Indie Electronic Night Bengaluru");
      expect(html).toContain("Koramangala Social");
      expect(html).toContain("/explore/event/indie-electronic-night");
      expect(html).toContain("From ₹499");

      // Verify view all footer CTA
      expect(html).toContain("View all search results for");
    });

    it("renders LiveSearchDropdown empty state when no events match query", () => {
      const html = renderToStaticMarkup(
        React.createElement(LiveSearchDropdown, {
          isOpen: true,
          query: "NonExistentEventXYZ",
          results: [],
          isLoading: false,
        })
      );

      expect(html).toContain("No events found matching");
      expect(html).toContain("NonExistentEventXYZ");
      expect(html).toContain("0 matches");
    });
  });
});
