import { describe, expect, it } from "vitest";
import { safeCreative, safeDestination, selectExplorePlacements } from "@/lib/explore/ads-service";
import type { AdCampaign } from "@/lib/explore/ads-types";

const base: AdCampaign = {
  id: "11111111-1111-4111-8111-111111111111", title: "Approved sponsor", description: null,
  placement: "hero", campaignType: "brand_sponsor", advertiserName: "Sponsor",
  desktopImageUrl: "https://images.unsplash.com/photo-123", badgeLabel: "Sponsored",
  ctaText: "Learn more", destinationUrl: "/explore", cityTargeting: ["All Cities"],
  startsAt: "2026-10-01T00:00:00Z", endsAt: "2026-11-01T00:00:00Z",
  priority: 50, status: "active", impressionsCount: 0, clicksCount: 0,
  createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z",
};
const now = Date.parse("2026-10-25T00:00:00Z");

describe("Explore ad delivery", () => {
  it("rejects protocol-relative and executable destinations", () => {
    expect(safeDestination("/explore?city=Mumbai")).toBe(true);
    expect(safeDestination("https://partner.example/tickets")).toBe(true);
    expect(safeDestination("//attacker.example")).toBe(false);
    expect(safeDestination("/\\attacker.example")).toBe(false);
    expect(safeDestination("javascript:alert(1)")).toBe(false);
    expect(safeDestination("https://user:pass@partner.example")).toBe(false);
  });

  it("accepts only trusted image hosts and paths", () => {
    expect(safeCreative(base.desktopImageUrl)).toBe(true);
    expect(safeCreative("https://evil.example/banner.jpg")).toBe(false);
  });

  it("filters expired, paused, city-mismatched, and unsafe campaigns", () => {
    const rows = [base,
      { ...base, id: "2", status: "paused" as const, priority: 100 },
      { ...base, id: "3", endsAt: "2026-10-24T00:00:00Z", priority: 100 },
      { ...base, id: "4", cityTargeting: ["Mumbai"], priority: 100 },
      { ...base, id: "5", destinationUrl: "//evil.example", priority: 100 }];
    expect(selectExplorePlacements(rows, "Bengaluru", now).hero.map(c => c.id)).toEqual([base.id]);
  });

  it("orders by priority and avoids reuse across placements", () => {
    const rows = [base, { ...base, id: "2", priority: 90 }, { ...base, id: "3", placement: "top_sidebar" as const }];
    const result = selectExplorePlacements(rows, "All Cities", now);
    expect(result.hero.map(c => c.id)).toEqual(["2", base.id]);
    expect(result.topSidebar?.id).toBe("3");
  });
});
