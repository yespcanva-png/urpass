import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js server modules ───────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/email", () => ({
  notifyOwnerPaymentSuccess: vi.fn().mockResolvedValue(undefined),
  notifyOwnerOneTimePayment: vi.fn().mockResolvedValue(undefined),
  sendApplicationConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendApprovalEmail: vi.fn().mockResolvedValue(undefined),
  sendPassEmail: vi.fn().mockResolvedValue(undefined),
  sendUserPaymentSuccessEmail: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/webhooks", () => ({
  sendWebhooks: vi.fn().mockResolvedValue(undefined),
}));
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

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  submitApplication,
  promoteWaitlistAttendee,
  promoteNextWaitlistAttendee,
} from "@/app/actions/attendees";

const mockedCreateClient = vi.mocked(createClient);
const mockedCreateAdminClient = vi.mocked(createAdminClient);

function makeSupabase(overrides: Record<string, unknown> = {}) {
  const base = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
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

describe("Capacity Waitlist Queue & Automated Backfill Support", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds applicant to waitlist when auto_approve is true and capacity is reached", async () => {
    let insertedStatus = "";
    const admin = {
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: "evt-1",
                name: "Mega Conf",
                status: "active",
                application_enabled: true,
                auto_approve: true,
                attendee_limit: 10,
                waitlist_enabled: true,
                is_paid_event: false,
                ticket_price: 0,
                organizer_id: "user-123",
              },
              error: null,
            }),
          };
        }
        if (table === "attendees") {
          return {
            select: vi.fn((_cols: string, opts?: { count?: string; head?: boolean }) => {
              if (opts?.count === "exact") {
                return {
                  eq: vi.fn().mockReturnThis(),
                  // mock 10 approved attendees (at capacity)
                  count: 10,
                };
              }
              return {
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: { id: "att-wl-1" }, error: null }),
              };
            }),
            insert: vi.fn((payload: { application_status?: string }) => {
              insertedStatus = payload.application_status ?? "";
              return {
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: { id: "att-wl-1" }, error: null }),
              };
            }),
            eq: vi.fn().mockReturnThis(),
          };
        }
        if (table === "event_passes") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        if (table === "subscriptions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: { registrations_used: 5, current_period_start: "2026-09-01" },
            }),
          };
        }
        return makeSupabase();
      }),
    };

    mockedCreateAdminClient.mockReturnValue(admin as unknown as ReturnType<typeof createAdminClient>);

    const res = await submitApplication("evt-1", {
      name: "Alice Waitlist",
      email: "alice@example.com",
      pass_type: "participant",
    });

    expect(res).toEqual({
      waitlisted: true,
      message: "This event is at capacity. You have been added to the waitlist queue and will be notified as spots open up!",
    });
    expect(insertedStatus).toBe("waitlisted");
  });

  it("rejects application when event is at capacity and waitlist_enabled is false", async () => {
    const admin = {
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: "evt-2",
                name: "Exclusive Conf",
                status: "active",
                application_enabled: true,
                auto_approve: true,
                attendee_limit: 5,
                waitlist_enabled: false,
                is_paid_event: false,
                ticket_price: 0,
                organizer_id: "user-123",
              },
              error: null,
            }),
          };
        }
        if (table === "attendees") {
          return {
            select: vi.fn((_cols: string, opts?: { count?: string }) => {
              if (opts?.count === "exact") {
                return {
                  eq: vi.fn().mockReturnThis(),
                  count: 5,
                };
              }
              return { eq: vi.fn().mockReturnThis() };
            }),
          };
        }
        if (table === "event_passes") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        if (table === "subscriptions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: { registrations_used: 5, current_period_start: "2026-09-01" },
            }),
          };
        }
        return makeSupabase();
      }),
    };

    mockedCreateAdminClient.mockReturnValue(admin as unknown as ReturnType<typeof createAdminClient>);

    const res = await submitApplication("evt-2", {
      name: "Bob Full",
      email: "bob@example.com",
      pass_type: "participant",
    });

    expect(res).toEqual({ error: "This event is at capacity." });
  });

  it("promotes a waitlisted attendee and generates their pass", async () => {
    let updatedStatus = "";
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: "evt-3",
                name: "Tech Summit",
                attendee_limit: 50,
                status: "active",
                organizer_id: "user-123",
                event_date: "2026-10-10",
                venue: "Hall A",
              },
              error: null,
            }),
          };
        }
        if (table === "attendees") {
          return {
            select: vi.fn((_cols: string, opts?: { count?: string }) => {
              if (opts?.count === "exact") {
                return {
                  eq: vi.fn().mockReturnThis(),
                  count: 20, // well below capacity
                };
              }
              return {
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "att-3",
                    name: "Charlie Queue",
                    email: "charlie@example.com",
                    pass_type: "participant",
                    pass_status: "not_generated",
                    application_status: "approved",
                  },
                  error: null,
                }),
              };
            }),
            update: vi.fn((payload: { application_status?: string; pass_status?: string }) => {
              if (payload.application_status) {
                updatedStatus = payload.application_status;
              }
              return {
                eq: vi.fn().mockReturnThis(),
                error: null,
              };
            }),
            eq: vi.fn().mockReturnThis(),
          };
        }
        if (table === "ticket_orders") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        if (table === "passes") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { pass_token: "mock-pass-token-123" },
              error: null,
            }),
            insert: vi.fn().mockReturnThis(),
          };
        }
        return makeSupabase();
      }),
    };

    mockedCreateClient.mockResolvedValue(client as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await promoteWaitlistAttendee("att-3", "evt-3");

    expect(res.success).toBe(true);
    expect(updatedStatus).toBe("approved");
    expect(res.passToken).toBe("mock-pass-token-123");
  });

  it("promotes the next waitlist attendee chronologically via promoteNextWaitlistAttendee", async () => {
    let updatedStatus = "";
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: "evt-4",
                name: "Startup Pitch",
                attendee_limit: 100,
                status: "active",
                organizer_id: "user-123",
                event_date: "2026-10-15",
                venue: "Auditorium",
              },
              error: null,
            }),
          };
        }
        if (table === "attendees") {
          return {
            select: vi.fn((_cols: string, opts?: { count?: string }) => {
              if (opts?.count === "exact") {
                return {
                  eq: vi.fn().mockReturnThis(),
                  count: 45, // below 100
                };
              }
              return {
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id: "att-next", name: "David Oldest", email: "david@example.com" },
                  error: null,
                }),
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "att-next",
                    name: "David Oldest",
                    email: "david@example.com",
                    pass_type: "participant",
                    pass_status: "not_generated",
                    application_status: "approved",
                  },
                  error: null,
                }),
              };
            }),
            update: vi.fn((payload: { application_status?: string; pass_status?: string }) => {
              if (payload.application_status) {
                updatedStatus = payload.application_status;
              }
              return {
                eq: vi.fn().mockReturnThis(),
                error: null,
              };
            }),
            eq: vi.fn().mockReturnThis(),
          };
        }
        if (table === "ticket_orders") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        if (table === "passes") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { pass_token: "token-david-123" },
              error: null,
            }),
            insert: vi.fn().mockReturnThis(),
          };
        }
        return makeSupabase();
      }),
    };

    mockedCreateClient.mockResolvedValue(client as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await promoteNextWaitlistAttendee("evt-4");

    expect(res.success).toBe(true);
    expect(res.attendeeName).toBe("David Oldest");
    expect(res.passToken).toBe("token-david-123");
    expect(updatedStatus).toBe("approved");
  });

  it("returns error if waitlist is empty when attempting promoteNextWaitlistAttendee", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: "evt-5",
                name: "Full Event",
                attendee_limit: 10,
                status: "active",
                organizer_id: "user-123",
              },
              error: null,
            }),
          };
        }
        if (table === "attendees") {
          return {
            select: vi.fn((_cols: string, opts?: { count?: string }) => {
              if (opts?.count === "exact") {
                return {
                  eq: vi.fn().mockReturnThis(),
                  count: 5,
                };
              }
              return {
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              };
            }),
          };
        }
        return makeSupabase();
      }),
    };

    mockedCreateClient.mockResolvedValue(client as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await promoteNextWaitlistAttendee("evt-5");

    expect(res.error).toBe("No attendees waiting on the waitlist queue.");
  });

  it("returns error if event is already at capacity when promoteNextWaitlistAttendee is triggered", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: vi.fn((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: "evt-6",
                attendee_limit: 10,
                status: "active",
                organizer_id: "user-123",
              },
              error: null,
            }),
          };
        }
        if (table === "attendees") {
          return {
            select: vi.fn((_cols: string, opts?: { count?: string }) => {
              if (opts?.count === "exact") {
                return {
                  eq: vi.fn().mockReturnThis(),
                  count: 10, // at capacity
                };
              }
              return { eq: vi.fn().mockReturnThis() };
            }),
          };
        }
        return makeSupabase();
      }),
    };

    mockedCreateClient.mockResolvedValue(client as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await promoteNextWaitlistAttendee("evt-6");

    expect(res.error).toContain("Event is at capacity (10)");
  });
});
