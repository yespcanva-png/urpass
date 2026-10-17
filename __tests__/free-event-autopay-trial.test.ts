import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveUserSubscriptionAccess } from "@/lib/billing/entitlement-resolver";
import { createEvent, duplicateEvent, deleteEvent } from "@/app/actions/events";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Mock server environments
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }));

describe("1 Free Event AutoPay Trial & Anti-Abuse Enforcement", () => {
  const NOW = new Date("2026-10-17T12:00:00.000Z");
  const TODAY_STR = "2026-10-17";
  const FUTURE_DATE_STR = "2026-10-25";
  const PAST_DATE_STR = "2026-10-10";

  function createMockSupabase(params: {
    subData?: Record<string, unknown> | null;
    trialEventData?: Record<string, unknown> | null;
    eventData?: Record<string, unknown> | null;
    profileData?: Record<string, unknown> | null;
  }) {
    const { subData, trialEventData, eventData, profileData } = params;

    return {
      from: vi.fn((table: string) => {
        if (table === "subscriptions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: subData ?? null, error: null }),
            single: vi.fn().mockResolvedValue({ data: subData ?? null, error: null }),
          };
        }
        if (table === "user_trial_events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: trialEventData ?? null, error: null }),
            single: vi.fn().mockResolvedValue({ data: trialEventData ?? null, error: null }),
          };
        }
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: eventData ?? null, error: null }),
            single: vi.fn().mockResolvedValue({ data: eventData ?? null, error: null }),
          };
        }
        if (table === "profiles") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: profileData ?? null, error: null }),
            single: vi.fn().mockResolvedValue({ data: profileData ?? null, error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    };
  }

  // ── Scenario 1: Activated AutoPay trial before creating any event ───────────
  it("Scenario 1: AutoPay trial active with 0 events allows organizer access", async () => {
    const user = {
      id: "usr-trial-fresh",
      created_at: new Date("2026-10-15T00:00:00.000Z").toISOString(),
    };

    const mockSupabase = createMockSupabase({
      subData: {
        status: "trialing",
        autopay_status: "active",
        free_event_trial_active: true,
        free_event_trial_consumed: false,
        trial_plan: "pro",
        trial_ends_at: new Date("2026-11-15T00:00:00.000Z").toISOString(),
        plan: { slug: "pro" },
      },
      trialEventData: null,
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user,
      now: NOW,
    });

    expect(access.state).toBe("autopay_trial_active");
    expect(access.hasOrganizerAccess).toBe(true);
    expect(access.isTrial).toBe(true);
    expect(access.freeEventTrialConsumed).toBe(false);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(false);
  });

  // ── Scenario 2: Active trial event ongoing ─────────────────────────────────
  it("Scenario 2: Single ongoing trial event preserves active organizer access", async () => {
    const user = {
      id: "usr-trial-active-event",
      created_at: new Date("2026-10-15T00:00:00.000Z").toISOString(),
    };

    const mockSupabase = createMockSupabase({
      subData: {
        status: "trialing",
        autopay_status: "active",
        free_event_trial_active: true,
        free_event_trial_consumed: true,
        free_event_trial_id: "evt-active-123",
        trial_plan: "pro",
        trial_ends_at: new Date("2026-11-15T00:00:00.000Z").toISOString(),
        plan: { slug: "pro" },
      },
      trialEventData: {
        id: "ute-1",
        event_id: "evt-active-123",
        event_deleted: false,
      },
      eventData: {
        id: "evt-active-123",
        event_date: FUTURE_DATE_STR,
        status: "active",
      },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user,
      now: NOW,
    });

    expect(access.state).toBe("autopay_trial_active");
    expect(access.hasOrganizerAccess).toBe(true);
    expect(access.freeEventTrialConsumed).toBe(true);
    expect(access.isTrial).toBe(true);
  });

  // ── Scenario 3: Trial event completed by past date ─────────────────────────
  it("Scenario 3: Trial event completed by date -> resolves autopay_trial_completed and redirects to billing", async () => {
    const user = {
      id: "usr-trial-past-date",
      created_at: new Date("2026-10-01T00:00:00.000Z").toISOString(),
    };

    const mockSupabase = createMockSupabase({
      subData: {
        status: "trialing",
        autopay_status: "active",
        free_event_trial_active: true,
        free_event_trial_consumed: true,
        free_event_trial_id: "evt-past-123",
        trial_plan: "pro",
        plan: { slug: "pro" },
      },
      trialEventData: {
        id: "ute-past",
        event_id: "evt-past-123",
        event_deleted: false,
      },
      eventData: {
        id: "evt-past-123",
        event_date: PAST_DATE_STR, // Date in the past
        status: "active",
      },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user,
      now: NOW,
    });

    expect(access.state).toBe("autopay_trial_completed");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(true);
    expect(access.freeEventTrialConsumed).toBe(true);
  });

  // ── Scenario 4: Trial event marked as completed ───────────────────────────
  it("Scenario 4: Trial event marked completed -> resolves autopay_trial_completed", async () => {
    const user = {
      id: "usr-trial-completed-status",
      created_at: new Date("2026-10-01T00:00:00.000Z").toISOString(),
    };

    const mockSupabase = createMockSupabase({
      subData: {
        status: "trialing",
        autopay_status: "active",
        free_event_trial_active: true,
        free_event_trial_consumed: true,
        free_event_trial_id: "evt-status-comp",
        plan: { slug: "pro" },
      },
      trialEventData: {
        id: "ute-comp",
        event_id: "evt-status-comp",
        event_deleted: false,
      },
      eventData: {
        id: "evt-status-comp",
        event_date: FUTURE_DATE_STR,
        status: "completed", // explicitly completed
      },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user,
      now: NOW,
    });

    expect(access.state).toBe("autopay_trial_completed");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(true);
  });

  // ── Scenario 5: Trial event deleted -> strictly blocks access and recreation
  it("Scenario 5: Deleted trial event resolves autopay_trial_completed", async () => {
    const user = {
      id: "usr-trial-deleted-event",
      created_at: new Date("2026-10-10T00:00:00.000Z").toISOString(),
    };

    const mockSupabase = createMockSupabase({
      subData: {
        status: "trialing",
        autopay_status: "active",
        free_event_trial_active: true,
        free_event_trial_consumed: true,
        free_event_trial_id: null,
        plan: { slug: "pro" },
      },
      trialEventData: {
        id: "ute-deleted",
        event_id: "evt-del-456",
        event_deleted: true, // flagged as deleted
      },
      eventData: null, // event was deleted from events table
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user,
      now: NOW,
    });

    expect(access.state).toBe("autopay_trial_completed");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(true);
  });

  // ── Scenario 6: Strict anti-abuse in createEvent ──────────────────────────
  it("Scenario 6: User who used/deleted trial event is blocked from creating another event", async () => {
    const mockUser = { id: "usr-abuser-123", email: "abuser@test.com" };

    // Set up mock auth and admin client
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn((table: string) => {
        if (table === "subscriptions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                status: "trialing",
                autopay_status: "active",
                free_event_trial_active: true,
                free_event_trial_consumed: true,
                plan: { slug: "pro" },
              },
              error: null,
            }),
          };
        }
        if (table === "user_trial_events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                id: "ute-existing",
                event_deleted: true, // event was deleted
              },
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    } as any);

    // Mock admin client
    process.env.SUPABASE_SERVICE_ROLE_KEY = "dummy-service-key";
    vi.mocked(createAdminClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "user_trial_events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: "ute-existing", event_deleted: true },
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    } as any);

    const result = await createEvent({
      name: "Sneaky Second Event",
      event_date: "2026-11-01",
      event_type: "physical",
      location: "Bangalore",
      attendee_limit: 100,
      is_paid_event: false,
    } as any);

    expect(result).toBeDefined();
    expect(result?.error).toMatch(/already used your 1 free event trial|trial event is completed/i);
  });

  // ── Scenario 7: Event duplication blocked for trial users ─────────────────
  it("Scenario 7: Trial users cannot duplicate events", async () => {
    const mockUser = { id: "usr-trial-dup", email: "trialdup@test.com" };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn((table: string) => {
        if (table === "subscriptions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                status: "trialing",
                autopay_status: "active",
                free_event_trial_active: true,
                free_event_trial_consumed: false,
                plan: { slug: "pro" },
              },
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    } as any);

    const result = await duplicateEvent("evt-original-123");
    expect(result).toBeDefined();
    expect(result.error).toMatch(/Event duplication is not permitted on the 1 free event trial/i);
  });

  // ── Scenario 8: User with paid subscription is NOT subject to trial limits ─
  it("Scenario 8: Paid subscriber who previously used trial has unrestricted access", async () => {
    const paidUser = {
      id: "usr-graduated-paid",
      created_at: new Date("2026-09-01T00:00:00.000Z").toISOString(),
    };

    const mockSupabase = createMockSupabase({
      subData: {
        status: "active",
        provider: "razorpay",
        current_period_end: new Date("2026-11-17T00:00:00.000Z").toISOString(),
        is_trial: false,
        free_event_trial_active: false,
        free_event_trial_consumed: true, // used in past
        autopay_status: "active",
        plan: { slug: "pro" },
      },
      trialEventData: {
        id: "ute-old",
        event_deleted: true,
      },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: paidUser,
      now: NOW,
    });

    expect(access.state).toBe("subscription_active");
    expect(access.hasOrganizerAccess).toBe(true);
    expect(access.isTrial).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(false);
  });
});
