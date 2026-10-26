import { describe, expect, it } from "vitest";
import { isPublicIndexableEvent } from "@/lib/seo/event-indexing";
import { matchesExploreSeoPage, MIN_EXPLORE_COLLECTION_EVENTS, type ExploreSeoPageConfig } from "@/lib/explore/seo-pages";
import type { ExploreEventItem } from "@/lib/explore/types";

describe("public event indexing", () => {
  it("excludes private, invite-only, inactive, and closed registration events", () => {
    const base = { status: "active", application_enabled: true };
    expect(isPublicIndexableEvent(base)).toBe(true);
    expect(isPublicIndexableEvent({ ...base, custom_pass_design: { is_private: true } })).toBe(false);
    expect(isPublicIndexableEvent({ ...base, custom_pass_design: { visibility: "invite_only" } })).toBe(false);
    expect(isPublicIndexableEvent({ ...base, custom_pass_design: { visibility: "unlisted" } })).toBe(false);
    expect(isPublicIndexableEvent({ ...base, status: "draft" })).toBe(false);
    expect(isPublicIndexableEvent({ ...base, application_enabled: false })).toBe(false);
  });
});

describe("Explore collection sitemap eligibility", () => {
  it("requires more than one listing before indexing a collection", () => {
    expect(MIN_EXPLORE_COLLECTION_EVENTS).toBe(3);
  });

  const event: ExploreEventItem = {
    id: "listing-1", eventId: "event-1", slug: "music-night", name: "Music Night",
    description: "A live concert", eventDate: "2026-12-19", startTime: "18:00", endTime: "21:00",
    venue: "City Hall", city: "Bengaluru", category: "music", categoryLabel: "Music",
    bannerUrl: null, logoUrl: null, minPricePaise: 49900, currency: "INR", isFree: false,
    featured: false, organizerName: "City Events", applicationEnabled: true, status: "active",
  };
  const page = { cityFilter: "Bengaluru", categoryFilter: "music", queryKeywords: ["concert"] } as ExploreSeoPageConfig;

  it("includes only collections with a real matching listing", () => {
    expect(matchesExploreSeoPage(event, page)).toBe(true);
    expect(matchesExploreSeoPage(event, { ...page, cityFilter: "Chennai" })).toBe(false);
    expect(matchesExploreSeoPage(event, { ...page, categoryFilter: "workshops" })).toBe(false);
    expect(matchesExploreSeoPage(event, { ...page, queryKeywords: ["workshop"] })).toBe(false);
    expect(matchesExploreSeoPage(event, { ...page, pricingFilter: "free" })).toBe(false);
  });

  it("checks date-based collections against the event date", () => {
    const now = new Date("2026-12-19T09:00:00.000Z");
    expect(matchesExploreSeoPage(event, { ...page, dateFilter: "today" }, now)).toBe(true);
    expect(matchesExploreSeoPage(event, { ...page, dateFilter: "this_month" }, now)).toBe(true);
    expect(matchesExploreSeoPage(event, { ...page, dateFilter: "this_weekend" }, now)).toBe(true);
    expect(matchesExploreSeoPage(event, { ...page, dateFilter: "today" }, new Date("2026-12-20T09:00:00.000Z"))).toBe(false);
  });
});
