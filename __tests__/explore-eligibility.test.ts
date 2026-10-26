import { describe, expect, it } from "vitest";
import { assessExploreEligibility, type EligibilityEvent } from "@/lib/explore/eligibility";

const future = "2027-12-19";
const event: EligibilityEvent = {
  id: "11111111-1111-1111-1111-111111111111", name: "City Music Festival",
  description: "Live performances", banner_url: "https://example.com/cover.jpg", logo_url: null,
  status: "active", application_enabled: true, apply_slug: "city-music-festival",
  event_date: future, start_time: "18:00", venue: "City Hall, Bengaluru",
  attendee_limit: 100, is_paid_event: false, ticket_price: 0,
};
const base = { metadata: { city: "Bengaluru", category: "music" }, tiers: [], attendeeCount: 0, activeReservations: 0, now: new Date("2026-10-25T00:00:00Z") };

describe("Explore eligibility", () => {
  it("accepts a free event using the existing direct registration route", () => {
    const result = assessExploreEligibility({ ...base, event });
    expect(result).toMatchObject({ ready: true, isFree: true, minPricePaise: 0 });
  });
  it("accepts available multi-tier tickets and uses their lowest price", () => {
    const result = assessExploreEligibility({ ...base, event: { ...event, is_paid_event: true }, tiers: [
      { id: "general", status: "on_sale", price: 49900, capacity: 50, reserved: 3, sales_start: null, sales_end: null },
      { id: "vip", status: "on_sale", price: 149900, capacity: 10, reserved: 0, sales_start: null, sales_end: null },
    ] });
    expect(result).toMatchObject({ ready: true, isFree: false, minPricePaise: 49900 });
  });
  it("requires a price when a base-price event is marked paid", () => {
    const result = assessExploreEligibility({ ...base, event: { ...event, is_paid_event: true, ticket_price: 0 } });
    expect(result.ready).toBe(false);
    expect(result.issues.join(" ")).toContain("base ticket price");
  });
  it.each([
    [{ status: "draft" }, "Active"],
    [{ status: "cancelled" }, "Cancelled"],
    [{ event_date: "2025-01-01" }, "past"],
    [{ application_enabled: false }, "enabled"],
    [{ custom_pass_design: { visibility: "private" } }, "Private"],
  ])("rejects an ineligible event: %j", (changes, expected) => {
    const result = assessExploreEligibility({ ...base, event: { ...event, ...changes } });
    expect(result.ready).toBe(false);
    expect(result.issues.join(" ")).toContain(expected);
  });
  it("blocks sold-out tiers without blocking a legitimate free base-price event", () => {
    const result = assessExploreEligibility({ ...base, event, tiers: [
      { id: "free", status: "on_sale", price: 0, capacity: 10, reserved: 10, sales_start: null, sales_end: null },
    ] });
    expect(result.ready).toBe(false);
    expect(result.issues.join(" ")).toContain("available tickets");
  });
});
