import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ adminClient: vi.fn() }));
vi.mock("@/lib/ops/auth", () => ({ isOpsAuthenticated: vi.fn() }));
vi.mock("@/lib/explore/eligibility", () => ({ getExploreEligibility: vi.fn() }));

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getExploreEligibility } from "@/lib/explore/eligibility";
import {
  submitExploreListingApplicationAction, unlistExploreListingAction,
  adminApproveExploreListingAction, adminRejectExploreListingAction,
} from "@/app/actions/explore";

const eventId = "11111111-1111-1111-1111-111111111111";
const owner = "22222222-2222-2222-2222-222222222222";
const payload = { category: "music", city: "Bengaluru", editorialSummary: "Live music" };

function setup(options: { ownerId?: string; listing?: { status: string }; insertError?: { code: string; message: string } } = {}) {
  let current = options.listing || null;
  const changes: Array<{ table: string; action: string; values: Record<string, unknown> }> = [];
  const selections: Array<{ table: string; columns: string }> = [];
  const db = {
    from(table: string) {
      let operation = "select";
      let values: Record<string, unknown> = {};
      const filters: Record<string, unknown> = {};
      const query = {
        select(columns: string) { selections.push({ table, columns }); return query; },
        eq(key: string, value: unknown) { filters[key] = value; return query; },
        in() { return query; },
        update(next: Record<string, unknown>) { operation = "update"; values = next; return query; },
        insert(next: Record<string, unknown>) { operation = "insert"; values = next; return query; },
        async maybeSingle() {
          if (table === "events") return { data: { id: eventId, organizer_id: options.ownerId || owner, organization_id: null, venue: "City Hall" }, error: null };
          if (table !== "explore_marketplace_listings") return { data: null, error: null };
          if (operation === "select") return { data: current, error: null };
          changes.push({ table, action: operation, values });
          if (operation === "insert" && options.insertError) return { data: null, error: options.insertError };
          if (operation === "update" && current?.status !== filters.status && filters.status) return { data: null, error: null };
          current = { ...current, status: String(values.status) };
          return { data: { id: "listing-id" }, error: null };
        },
      };
      return query;
    },
  };
  vi.mocked(adminClient).mockReturnValue(db as never);
  vi.mocked(createClient).mockResolvedValue({ auth: { getUser: async () => ({ data: { user: { id: owner } } }) } } as never);
  vi.mocked(getExploreEligibility).mockResolvedValue({ ready: true, issues: [], minPricePaise: 0, isFree: true, availableTickets: 12 });
  return { changes, selections, get listing() { return current; } };
}

describe("Explore listing actions", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(isOpsAuthenticated).mockResolvedValue(false); });

  it("rejects an event ID from another organizer", async () => {
    setup({ ownerId: "33333333-3333-3333-3333-333333333333" });
    const result = await submitExploreListingApplicationAction(eventId, payload);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/cannot manage/);
  });

  it("returns actionable eligibility feedback before writing", async () => {
    const state = setup();
    vi.mocked(getExploreEligibility).mockResolvedValue({ ready: false, issues: ["Add an event cover image or logo."], minPricePaise: 0, isFree: true, availableTickets: 0 });
    const result = await submitExploreListingApplicationAction(eventId, payload);
    expect(result.error).toContain("cover image");
    expect(state.changes).toHaveLength(0);
  });

  it("submits without selecting events.currency and defaults to INR", async () => {
    const state = setup();
    const result = await submitExploreListingApplicationAction(eventId, payload);
    expect(result.success).toBe(true);
    expect(state.changes[0].values).toMatchObject({ status: "pending", currency: "INR", min_price_paise: 0, is_free: true });
    expect(state.selections.filter((item) => item.table === "events").every((item) => !item.columns.split(",").map((column) => column.trim()).includes("currency"))).toBe(true);
  });

  it("prevents duplicate pending submissions", async () => {
    const state = setup({ listing: { status: "pending" } });
    const result = await submitExploreListingApplicationAction(eventId, payload);
    expect(result.success).toBe(false);
    expect(state.changes).toHaveLength(0);
  });

  it("reports a concurrent insert conflict without an unhandled exception", async () => {
    setup({ insertError: { code: "23505", message: "duplicate key" } });
    const result = await submitExploreListingApplicationAction(eventId, payload);
    expect(result).toMatchObject({ success: false, error: expect.stringContaining("already exists") });
  });

  it("unlists without deleting the event or its direct registration", async () => {
    const state = setup({ listing: { status: "approved" } });
    const result = await unlistExploreListingAction(eventId);
    expect(result.success).toBe(true);
    expect(state.changes[0]).toMatchObject({ table: "explore_marketplace_listings", action: "update", values: { status: "unlisted" } });
  });

  it("requires ops access for approval", async () => {
    setup({ listing: { status: "pending" } });
    const result = await adminApproveExploreListingAction(eventId);
    expect(result.error).toMatch(/Administrator access/);
  });

  it("requires a reason to reject a listing", async () => {
    setup({ listing: { status: "pending" } });
    vi.mocked(isOpsAuthenticated).mockResolvedValue(true);
    const result = await adminRejectExploreListingAction(eventId, " ");
    expect(result.error).toMatch(/reason/);
  });
});
