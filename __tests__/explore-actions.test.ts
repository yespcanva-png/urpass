import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase server and client modules
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  adminClient: vi.fn(),
}));

vi.mock("@/lib/ops/auth", () => ({
  isOpsAuthenticated: vi.fn(),
}));

vi.mock("@/lib/explore/eligibility", () => ({
  getExploreEligibility: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getExploreEligibility } from "@/lib/explore/eligibility";
import {
  checkEventExploreReadinessAction,
  getEventExploreListingStatusAction,
  submitExploreListingApplicationAction,
  organizerResubmitExploreListingAction,
  unlistExploreListingAction,
  adminRejectExploreListingAction,
  adminRequestChangesExploreListingAction,
  adminApproveExploreListingAction,
  getExploreListingAttributionAction,
} from "@/app/actions/explore";

describe("UrPass Explore — Server Actions & Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validEventId = "11111111-1111-1111-1111-111111111111";

  describe("checkEventExploreReadinessAction", () => {
    it("reports ready for an eligible active event", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }),
        },
      };
      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: validEventId,
                  organizer_id: "user-owner",
                  name: "Tech Summit",
                  venue: "Bengaluru",
                },
                error: null,
              }),
            }),
          }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);
      vi.mocked(getExploreEligibility).mockResolvedValue({
        ready: true,
        issues: [],
        minPricePaise: 0,
        isFree: true,
        availableTickets: 250,
      });

      const res = await checkEventExploreReadinessAction(validEventId);
      expect(res.ready).toBe(true);
      expect(res.issues).toHaveLength(0);
      expect(res.isFree).toBe(true);
    });

    it("returns actionable issues when event is not ready", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }),
        },
      };
      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: validEventId,
                  organizer_id: "user-owner",
                },
                error: null,
              }),
            }),
          }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);
      vi.mocked(getExploreEligibility).mockResolvedValue({
        ready: false,
        issues: [
          "Event must be published and set to Active status.",
          "Event date cannot be in the past.",
        ],
        minPricePaise: 0,
        isFree: true,
        availableTickets: 0,
      });

      const res = await checkEventExploreReadinessAction(validEventId);
      expect(res.ready).toBe(false);
      expect(res.issues).toContain("Event must be published and set to Active status.");
      expect(res.issues).toContain("Event date cannot be in the past.");
    });
  });

  describe("submitExploreListingApplicationAction & Currency Bug Regression", () => {
    it("fails gracefully if unauthenticated", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await submitExploreListingApplicationAction(validEventId, {
        city: "Bengaluru",
        category: "business",
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Sign in to manage/i);
    });

    it("prevents non-owners from submitting application", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "attacker-user" } } }),
        },
      };
      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: validEventId,
                  organizer_id: "legit-owner",
                  organization_id: null,
                },
                error: null,
              }),
            }),
          }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);

      const res = await submitExploreListingApplicationAction(validEventId, {
        city: "Bengaluru",
        category: "business",
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/You cannot manage this event's Explore listing/i);
    });

    it("rejects application if eligibility validation fails", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }),
        },
      };
      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: validEventId,
                  organizer_id: "user-owner",
                  venue: "Koramangala",
                },
                error: null,
              }),
            }),
          }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);
      vi.mocked(getExploreEligibility).mockResolvedValue({
        ready: false,
        issues: ["Private or invitation-only events cannot be listed publicly."],
        minPricePaise: 0,
        isFree: true,
        availableTickets: 0,
      });

      const res = await submitExploreListingApplicationAction(validEventId, {
        city: "Bengaluru",
        category: "business",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Private or invitation-only events cannot be listed publicly.");
    });

    it("successfully creates listing application with default INR currency (currency bug fixed)", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }),
        },
      };

      const upsertSpy = vi.fn().mockResolvedValue({ error: null });

      const mockAdmin = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: {
                      id: validEventId,
                      organizer_id: "user-owner",
                      venue: "Taj West End",
                    },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === "explore_marketplace_listings") {
            return {
              upsert: upsertSpy,
            };
          }
          return {};
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);
      vi.mocked(getExploreEligibility).mockResolvedValue({
        ready: true,
        issues: [],
        minPricePaise: 49900,
        isFree: false,
        availableTickets: 100,
      });

      const res = await submitExploreListingApplicationAction(validEventId, {
        city: "Bengaluru",
        category: "business",
        editorialSummary: "Exclusive tech founders mixer",
      });

      expect(res.success).toBe(true);
      expect(upsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event_id: validEventId,
          status: "pending",
          currency: "INR",
          min_price_paise: 49900,
          is_free: false,
          city: "Bengaluru",
          category: "business",
          editorial_summary: "Exclusive tech founders mixer",
        }),
        { onConflict: "event_id" }
      );
    });
  });

  describe("unlistExploreListingAction", () => {
    it("sets status to suspended without deleting event or registrations", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }),
        },
      };

      const updateSpy = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const mockAdmin = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: validEventId, organizer_id: "user-owner" },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === "explore_marketplace_listings") {
            return {
              update: updateSpy,
            };
          }
          return {};
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);

      const res = await unlistExploreListingAction(validEventId);
      expect(res.success).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "suspended",
        })
      );
    });
  });

  describe("Admin Curation Actions", () => {
    it("adminRejectExploreListingAction updates status and records reason", async () => {
      vi.mocked(isOpsAuthenticated).mockResolvedValue(true);

      const updateSpy = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          update: updateSpy,
        }),
      };

      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);

      const res = await adminRejectExploreListingAction(validEventId, "Missing physical venue");
      expect(res.success).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "rejected",
          rejection_reason: "Missing physical venue",
        })
      );
    });

    it("adminRequestChangesExploreListingAction sets changes requested format", async () => {
      vi.mocked(isOpsAuthenticated).mockResolvedValue(true);

      const updateSpy = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          update: updateSpy,
        }),
      };

      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);

      const res = await adminRequestChangesExploreListingAction(validEventId, "Please add speaker lineup");
      expect(res.success).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "rejected",
          rejection_reason: "[Changes Requested] Please add speaker lineup",
        })
      );
    });

    it("adminApproveExploreListingAction validates eligibility before approving", async () => {
      vi.mocked(isOpsAuthenticated).mockResolvedValue(true);

      const updateSpy = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: "listing-1" }, error: null }),
          }),
        }),
      });

      const mockAdmin = {
        from: vi.fn((table: string) => {
          if (table === "explore_marketplace_listings") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: { category: "business", city: "Bengaluru" },
                    error: null,
                  }),
                }),
              }),
              update: updateSpy,
            };
          }
          return {};
        }),
      };

      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);
      vi.mocked(getExploreEligibility).mockResolvedValue({
        ready: true,
        issues: [],
        minPricePaise: 0,
        isFree: true,
        availableTickets: 50,
      });

      const res = await adminApproveExploreListingAction(validEventId, true);
      expect(res.success).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "approved",
          featured: true,
          rejection_reason: null,
        })
      );
    });
  });

  describe("getExploreListingAttributionAction", () => {
    it("correctly calculates explore bookings and ticket revenue", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }),
        },
      };

      const mockAttendees = [
        { id: "att-1", custom_responses: { referral_source: "explore" }, application_status: "approved" },
        { id: "att-2", custom_responses: { referral_source: "explore" }, application_status: "approved" },
        { id: "att-3", custom_responses: { referral_source: "direct" }, application_status: "approved" },
      ];

      const mockOrders = [
        { id: "ord-1", attendee_id: "att-1", amount: 150000, status: "paid" },
        { id: "ord-2", attendee_id: "att-2", amount: 150000, status: "paid" },
        { id: "ord-3", attendee_id: "att-3", amount: 150000, status: "paid" },
      ];

      const mockAdmin = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: validEventId, organizer_id: "user-owner" },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === "attendees") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  neq: vi.fn().mockResolvedValue({ data: mockAttendees, error: null }),
                }),
              }),
            };
          }
          if (table === "ticket_orders") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ data: mockOrders, error: null }),
                }),
              }),
            };
          }
          return {};
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(adminClient).mockReturnValue(mockAdmin as any);

      const res = await getExploreListingAttributionAction(validEventId);

      expect(res.success).toBe(true);
      expect(res.exploreBookings).toBe(2);
      expect(res.totalBookings).toBe(3);
      expect(res.exploreRevenuePaise).toBe(300000);
      expect(res.totalRevenuePaise).toBe(450000);
      expect(res.views).toBeNull();
      expect(res.clicks).toBeNull();
    });
  });
});
