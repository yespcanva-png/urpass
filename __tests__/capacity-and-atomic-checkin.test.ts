import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  reserveEventCapacity,
  calculateConsumedCapacity,
  linkOrderToReservation,
  markReservationPaid,
  markReservationApproved,
  releaseReservation,
} from "@/lib/capacity-reservation";
import { playScannerFeedback } from "@/lib/scanner-feedback";
import { NextRequest } from "next/server";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// ── Mock Supabase for capacity tests ──────────────────────────────────────────

function createMockSupabaseForCapacity({
  attendeeLimit = 100,
  approvedAttendees = 99,
  paidPendingAttendees = 0,
  activeReservations = 0,
  expiredReservations = 0,
  eventStatus = "active",
  appEnabled = true,
}: {
  attendeeLimit?: number;
  approvedAttendees?: number;
  paidPendingAttendees?: number;
  activeReservations?: number;
  expiredReservations?: number;
  eventStatus?: string;
  appEnabled?: boolean;
} = {}) {
  let reservationsCount = activeReservations;
  const reservationsTable: Array<Record<string, unknown>> = [];

  const client = {
    rpc: vi.fn().mockImplementation(async (name: string) => {
      // Simulate RPC not found in unit mock to test fallback algorithm
      return { data: null, error: { code: "PGRST202", message: "function not found" } };
    }),
    from: vi.fn((table: string) => {
      const chain: Record<string, unknown> = {};

      chain.select = vi.fn().mockImplementation((cols: string, opts?: { count?: string; head?: boolean }) => {
        if (table === "events") {
          return {
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  attendee_limit: attendeeLimit,
                  status: eventStatus,
                  application_enabled: appEnabled,
                },
                error: null,
              }),
            }),
          };
        }

        if (table === "attendees") {
          return {
            eq: vi.fn().mockImplementation((field: string, val: string) => {
              return {
                eq: vi.fn().mockImplementation((f2: string, v2: string) => {
                  if (v2 === "approved") {
                    return Promise.resolve({ count: approvedAttendees, data: null, error: null });
                  }
                  return Promise.resolve({ count: 0, data: null, error: null });
                }),
              };
            }),
          };
        }

        if (table === "ticket_orders") {
          return {
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ count: paidPendingAttendees, data: null, error: null }),
              }),
            }),
          };
        }

        if (table === "ticket_reservations") {
          return {
            eq: vi.fn().mockImplementation((f: string, v: string) => {
              if (f === "event_id") {
                return {
                  eq: vi.fn().mockImplementation((f2: string, v2: string) => {
                    if (v2 === "RESERVED") {
                      return {
                        gt: vi.fn().mockResolvedValue({ count: reservationsCount, data: null, error: null }),
                      };
                    }
                    if (v2 === "PAID") {
                      return Promise.resolve({ count: 0, data: null, error: null });
                    }
                    return Promise.resolve({ count: 0, data: null, error: null });
                  }),
                };
              }
              return Promise.resolve({ count: 0, data: null, error: null });
            }),
          };
        }

        return chain;
      });

      chain.update = vi.fn().mockImplementation((data: Record<string, unknown>) => ({
        eq: vi.fn().mockImplementation((field: string, val: string) => ({
          eq: vi.fn().mockImplementation((f2: string, v2: string) => ({
            lte: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      }));

      chain.insert = vi.fn().mockImplementation((record: Record<string, unknown>) => {
        reservationsCount++;
        const newRecord = { id: `res-${reservationsCount}`, ...record };
        reservationsTable.push(newRecord);
        return {
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: newRecord, error: null }),
          }),
        };
      });

      return chain;
    }),
  };

  return { client: client as never, reservationsTable };
}

describe("P0: Paid-Event Capacity Reservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Acceptance Test: allows the 100th registration when 99 seats are confirmed", async () => {
    const { client } = createMockSupabaseForCapacity({
      attendeeLimit: 100,
      approvedAttendees: 99,
      activeReservations: 0,
    });

    const result = await reserveEventCapacity({
      adminClient: client,
      eventId: "evt-100",
      buyerEmail: "buyer1@example.com",
      buyerName: "Buyer One",
      windowSeconds: 600,
    });

    expect(result.success).toBe(true);
    expect(result.reservationId).toBeDefined();
    expect(result.expiresAt).toBeDefined();
  });

  it("Acceptance Test: rejects the second buyer with SOLD_OUT when only one seat remained", async () => {
    // Event capacity = 100, 99 seats confirmed.
    // Buyer 1 successfully takes the last slot.
    // Buyer 2 attempts immediately while Buyer 1's slot is RESERVED.
    const { client } = createMockSupabaseForCapacity({
      attendeeLimit: 100,
      approvedAttendees: 99,
      activeReservations: 1, // Buyer 1 already reserved!
    });

    const result = await reserveEventCapacity({
      adminClient: client,
      eventId: "evt-100",
      buyerEmail: "buyer2@example.com",
      buyerName: "Buyer Two",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("SOLD_OUT");
    expect(result.message).toContain("capacity");
  });

  it("treats paid manual-approval attendees as consuming capacity before organizer approves", async () => {
    // 98 approved + 2 paid pending approval = 100 total consumed
    const { client } = createMockSupabaseForCapacity({
      attendeeLimit: 100,
      approvedAttendees: 98,
      paidPendingAttendees: 2,
      activeReservations: 0,
    });

    const result = await reserveEventCapacity({
      adminClient: client,
      eventId: "evt-manual-approval",
      buyerEmail: "buyer3@example.com",
      buyerName: "Buyer Three",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("SOLD_OUT");
  });

  it("releases capacity immediately when a reservation is cancelled", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });
    const client = {
      from: vi.fn().mockReturnValue({
        update: mockUpdate,
      }),
    } as never;

    await releaseReservation(client, { reservationId: "res-123" });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: "CANCELLED" })
    );
  });
});

// ── P0: Atomic & Idempotent QR Check-In Tests ─────────────────────────────────

describe("P0: Atomic & Idempotent QR Check-In", () => {
  it("attaches scanOperationId and returns structured CHECKED_IN response", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const mockUser = { id: "scanner-user-1" };
    const mockEvent = { id: "evt-1", name: "Tech Summit", organizer_id: mockUser.id };
    const mockPass = {
      id: "pass-1",
      pass_token: "tok-abc",
      pass_type: "vip",
      status: "generated",
      attendee_id: "att-1",
      event_id: "evt-1",
    };
    const mockAttendee = {
      id: "att-1",
      name: "Srinithin",
      email: "srinithin@example.com",
      pass_type: "vip",
      application_status: "approved",
      pass_status: "generated",
    };

    const singles: Array<{ data: unknown; error: null }> = [
      { data: mockEvent, error: null },
      { data: mockPass, error: null },
      { data: mockAttendee, error: null },
    ];
    let idx = 0;

    const supabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }) },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      single: vi.fn().mockImplementation(async () => singles[idx++] ?? { data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const { POST } = await import("@/app/api/verify/route");
    const scanOperationId = "scan-op-unique-123";
    const req = new NextRequest("http://localhost/api/verify", {
      method: "POST",
      body: JSON.stringify({
        passToken: "tok-abc",
        eventId: "evt-1",
        scanOperationId,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("CHECKED_IN");
    expect(body.success).toBe(true);
    expect(body.attendee.name).toBe("Srinithin");
    expect(body.scanOperationId).toBe(scanOperationId);
    expect(body.checkedInAt).toBeDefined();
  });

  it("Acceptance Test: handles concurrent scan race condition and returns ALREADY_CHECKED_IN with 23505 duplicate code", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const mockUser = { id: "scanner-user-1" };
    const mockEvent = { id: "evt-1", name: "Tech Summit", organizer_id: mockUser.id };
    const mockPass = {
      id: "pass-1",
      pass_token: "tok-abc",
      pass_type: "vip",
      status: "generated",
      attendee_id: "att-1",
      event_id: "evt-1",
    };
    const mockAttendee = {
      id: "att-1",
      name: "Srinithin",
      email: "srinithin@example.com",
      pass_type: "vip",
      application_status: "approved",
      pass_status: "generated",
    };

    const singles: Array<{ data: unknown; error: null }> = [
      { data: mockEvent, error: null },
      { data: mockPass, error: null },
      { data: mockAttendee, error: null },
    ];
    let idx = 0;

    const supabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }) },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      // Simulate PostgreSQL unique constraint 23505: Gate A won the insert, Gate B got duplicate
      insert: vi.fn().mockResolvedValue({
        error: { code: "23505", message: "duplicate key value violates unique constraint check_ins_pass_id_unique" },
      }),
      single: vi.fn().mockImplementation(async () => singles[idx++] ?? { data: null, error: null }),
      maybeSingle: vi
        .fn()
        .mockResolvedValueOnce({ data: null, error: null }) // Initial op ID check: no prior op
        .mockResolvedValue({ data: { checked_in_at: "2026-09-24T00:00:00.000Z" }, error: null }),
    };

    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const { POST } = await import("@/app/api/verify/route");
    const req = new NextRequest("http://localhost/api/verify", {
      method: "POST",
      body: JSON.stringify({
        passToken: "tok-abc",
        eventId: "evt-1",
        scanOperationId: "concurrent-scan-gate-b",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("ALREADY_CHECKED_IN");
    expect(body.alreadyCheckedIn).toBe(true);
    expect(body.attendee.name).toBe("Srinithin");
    expect(body.scanOperationId).toBe("concurrent-scan-gate-b");
  });

  it("returns idempotent CHECKED_IN result when exact same scanOperationId is retried", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const mockUser = { id: "scanner-user-1" };
    const mockEvent = { id: "evt-1", name: "Tech Summit", organizer_id: mockUser.id };

    const singles = [
      { data: mockEvent, error: null },
      { data: { name: "Srinithin", email: "srinithin@example.com", pass_type: "vip" }, error: null },
    ];
    let idx = 0;

    const supabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }) },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(async () => singles[idx++] ?? { data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          checked_in_at: "2026-09-24T00:00:00.000Z",
          pass_id: "pass-1",
          attendee_id: "att-1",
        },
        error: null,
      }),
    };

    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const { POST } = await import("@/app/api/verify/route");
    const req = new NextRequest("http://localhost/api/verify", {
      method: "POST",
      body: JSON.stringify({
        passToken: "tok-abc",
        eventId: "evt-1",
        scanOperationId: "repeated-scan-op-1",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("CHECKED_IN");
    expect(body.idempotent).toBe(true);
    expect(body.attendee.name).toBe("Srinithin");
    expect(body.scanOperationId).toBe("repeated-scan-op-1");
  });
});

// ── P0: Scanner Sound + Haptic Feedback Tests ─────────────────────────────────

describe("P0: Scanner Sound & Haptics", () => {
  it("triggers Web Vibration API with appropriate tactile patterns without throwing", () => {
    const vibrateMock = vi.fn();
    Object.defineProperty(global, "navigator", {
      value: { vibrate: vibrateMock },
      configurable: true,
      writable: true,
    });

    // Test success feedback
    playScannerFeedback("success", { sound: false, haptics: true });
    expect(vibrateMock).toHaveBeenCalledWith([70]);

    // Test duplicate feedback
    playScannerFeedback("duplicate", { sound: false, haptics: true });
    expect(vibrateMock).toHaveBeenCalledWith([120, 80, 120]);

    // Test access denied feedback
    playScannerFeedback("access_denied", { sound: false, haptics: true });
    expect(vibrateMock).toHaveBeenCalledWith([250]);

    // Test error feedback
    playScannerFeedback("error", { sound: false, haptics: true });
    expect(vibrateMock).toHaveBeenCalledWith([250]);
  });
});
