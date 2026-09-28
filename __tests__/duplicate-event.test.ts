import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js server modules ───────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/api-usage", () => ({
  recordApiUsage: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/plan", () => ({
  getUserPlan: vi.fn().mockResolvedValue({
    slug: "pro",
    canExport: true,
    canCSV: true,
    canUse: () => true,
    getLimit: () => 999999,
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { duplicateEvent } from "@/app/actions/events";

const mockedCreateClient = vi.mocked(createClient);

function makeSupabase(overrides: Record<string, unknown> = {}) {
  const base = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer-123" } } }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  };
  return base;
}

describe("Event Duplication & Cloning (duplicateEvent)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error if source event is not found", async () => {
    const client = makeSupabase({
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockedCreateClient.mockResolvedValue(client as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await duplicateEvent("non-existent-evt");
    expect(res.error).toBe("Source event not found.");
  });

  it("returns error if user is not authorized to duplicate the event", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-attacker" } } }),
      },
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: "evt-victim",
                name: "Private Summit",
                organizer_id: "user-original-owner",
                organization_id: null,
              },
              error: null,
            }),
          };
        }
        return makeSupabase();
      }),
    };
    mockedCreateClient.mockResolvedValue(client as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await duplicateEvent("evt-victim");
    expect(res.error).toBe("You are not authorized to duplicate this event.");
  });

  it("duplicates event details and associated ticket tiers into a draft event", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let insertedEventPayload: Record<string, any> | null = null;
    let insertedTicketTypes: Array<Record<string, unknown>> = [];

    const mockSourceEvent = {
      id: "evt-source-100",
      organizer_id: "user-organizer-123",
      organization_id: "org-456",
      name: "Global Tech Conf",
      description: "Annual premier technology conference.",
      venue: "Grand Convention Center",
      event_date: "2026-05-15",
      start_time: "09:00",
      end_time: "18:00",
      attendee_limit: 500,
      status: "active",
      application_enabled: true,
      auto_approve: true,
      waitlist_enabled: true,
      is_paid_event: true,
      ticket_price: 1999,
      currency: "INR",
      timezone: "Asia/Kolkata",
      event_type: "physical",
      meeting_url: null,
      meeting_platform: null,
      custom_fields: [
        { id: "f1", label: "T-Shirt Size", type: "dropdown", required: true, options: ["S", "M", "L", "XL"] },
      ],
      apply_slug: "tech-conf-2026",
    };

    const mockTicketTypes = [
      {
        id: "tt-1",
        event_id: "evt-source-100",
        name: "Early Bird",
        description: "Discounted access",
        category: "regular",
        price: 999,
        capacity: 100,
        max_per_person: 1,
        position: 0,
        status: "active",
      },
      {
        id: "tt-2",
        event_id: "evt-source-100",
        name: "VIP Pass",
        description: "Backstage access",
        category: "vip",
        price: 2999,
        capacity: 50,
        max_per_person: 2,
        position: 1,
        status: "active",
      },
    ];

    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer-123" } } }),
      },
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockSourceEvent, error: null }),
            insert: vi.fn((payload: Record<string, unknown>) => {
              insertedEventPayload = payload;
              return {
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                  data: { id: "evt-cloned-new-777" },
                  error: null,
                }),
              };
            }),
          };
        }
        if (table === "ticket_types") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockTicketTypes, error: null }),
            insert: vi.fn((payload: Array<Record<string, unknown>>) => {
              insertedTicketTypes = payload;
              return { error: null };
            }),
          };
        }
        return makeSupabase();
      }),
    };

    mockedCreateClient.mockResolvedValue(client as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await duplicateEvent("evt-source-100");

    expect(res.newEventId).toBe("evt-cloned-new-777");
    expect(res.error).toBeUndefined();

    // Verify cloned event properties
    expect(insertedEventPayload).not.toBeNull();
    const payload = insertedEventPayload as unknown as Record<string, any>;
    expect(payload.name).toBe("Global Tech Conf (Copy)");
    expect(payload.status).toBe("draft"); // Always starts as draft
    expect(payload.venue).toBe("Grand Convention Center");
    expect(payload.attendee_limit).toBe(500);
    expect(payload.custom_fields).toEqual(mockSourceEvent.custom_fields);
    expect(payload.apply_slug).toBeDefined();
    expect(payload.apply_slug).not.toBe("tech-conf-2026"); // new random slug

    // Verify cloned ticket tiers
    expect(insertedTicketTypes.length).toBe(2);
    expect(insertedTicketTypes[0].name).toBe("Early Bird");
    expect(insertedTicketTypes[0].event_id).toBe("evt-cloned-new-777");
    expect(insertedTicketTypes[1].name).toBe("VIP Pass");
    expect(insertedTicketTypes[1].event_id).toBe("evt-cloned-new-777");
  });
});
