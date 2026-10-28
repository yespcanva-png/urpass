import { describe, expect, it, vi, beforeEach } from "vitest";

const { recordFirstEventConversion, mockSupabase } = vi.hoisted(() => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "organizer-1", email: "organizer@example.com" } },
      }),
    },
    from: vi.fn(),
  };
  return {
    recordFirstEventConversion: vi.fn(),
    mockSupabase,
  };
});

vi.mock("@/lib/conversion/first-event", () => ({ recordFirstEventConversion }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/plan", () => ({
  getUserPlan: vi.fn().mockResolvedValue({
    slug: "starter",
    getLimit: vi.fn().mockReturnValue(100),
  }),
}));

vi.mock("@/lib/events/preflight", () => ({
  validateEventPreflightReadiness: vi.fn().mockResolvedValue({
    ready: true,
    errors: [],
    warnings: [],
  }),
}));

import { updateEventStatus, updateEvent } from "@/app/actions/events";

describe("first-event publish and registration setup conversion tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records first_event_published and sets is_onboarding_draft: false when publishing", async () => {
    const updateSpy = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const chainableQuery: Record<string, any> = {};
    chainableQuery.select = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.eq = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.neq = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.gte = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.maybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: "event-123",
        name: "Corporate Summit 2026",
        organizer_id: "organizer-1",
        status: "draft",
        is_onboarding_draft: true,
      },
      error: null,
    });
    chainableQuery.count = 0;
    chainableQuery.then = (resolve: any) => resolve({ count: 0, data: null, error: null });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "events") {
        return {
          ...chainableQuery,
          update: updateSpy,
        };
      }
      if (table === "subscriptions") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        };
      }
      return chainableQuery;
    });

    const result = await updateEventStatus("event-123", "active");
    expect(result).toEqual({ eventId: "event-123" });

    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "active",
        is_onboarding_draft: false,
      })
    );

    expect(recordFirstEventConversion).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "organizer-1",
        eventId: "event-123",
        eventName: "first_event_published",
        idempotencyKey: "first-publish:organizer-1",
      })
    );
  });

  it("records registration_setup_completed when event settings are updated", async () => {
    const updateSpy = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const chainableQuery: Record<string, any> = {};
    chainableQuery.select = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.eq = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.neq = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.in = vi.fn().mockReturnValue(chainableQuery);
    chainableQuery.maybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: "event-123",
        organizer_id: "organizer-1",
        apply_slug: "corp-summit",
        venue: "Auditorium",
        custom_pass_design: {},
      },
      error: null,
    });
    chainableQuery.count = 0;
    chainableQuery.then = (resolve: any) => resolve({ count: 0, data: null, error: null });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "events") {
        return {
          ...chainableQuery,
          update: updateSpy,
        };
      }
      if (table === "attendees") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({ count: 0 }),
            }),
          }),
        };
      }
      return chainableQuery;
    });

    const result = await updateEvent("event-123", {
      name: "Corporate Summit 2026",
      description: null,
      event_date: "2026-12-01",
      start_time: "09:00",
      end_time: "17:00",
      venue: "Convention Center",
      attendee_limit: 500,
      status: "draft",
      event_type: "physical",
      meeting_url: null,
      meeting_platform: null,
      workspace_id: null,
      location_id: null,
      currency: "INR",
      timezone: "Asia/Kolkata",
      application_enabled: true,
      auto_approve: true,
      is_paid_event: false,
      ticket_price: 0,
    });

    expect(result).toEqual({ eventId: "event-123" });
    expect(recordFirstEventConversion).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "organizer-1",
        eventId: "event-123",
        eventName: "registration_setup_completed",
        idempotencyKey: "reg-setup:event-123",
      })
    );
  });
});
