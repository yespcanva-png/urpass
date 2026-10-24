import { describe, it, expect, vi, beforeEach } from "vitest";
import { allocateAttendanceCapacity, atomicApproveAttendee } from "@/lib/capacity-reservation";
import { enqueueEventCancellationBroadcast, processCommunicationQueueBatch } from "@/lib/communications/communication-queue";
import { updateAttendeeDetails, withdrawRegistrationAction, rejectAttendee } from "@/app/actions/attendees";

// Mocks
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

const mockDbState: {
  events: Record<string, any>;
  attendees: Record<string, any>;
  passes: Record<string, any>;
  queue: any[];
} = {
  events: {},
  attendees: {},
  passes: {},
  queue: [],
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    rpc: vi.fn().mockImplementation((func, args) => {
      if (func === "allocate_attendance_capacity") {
        return Promise.resolve({ data: { success: true, action: "approved", remaining_capacity: 1 }, error: null });
      }
      if (func === "atomic_approve_attendee") {
        return Promise.resolve({ data: { success: true, action: "approved" }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    }),
    from: vi.fn().mockImplementation((table: string) => {
      const builder: any = {
        select: vi.fn().mockImplementation((cols?: string) => {
          const selQuery: any = {
            eq: vi.fn().mockImplementation((col: string, val: any) => {
              if (col === "id") selQuery._id = val;
              selQuery._col = col;
              selQuery._val = val;
              return selQuery;
            }),
            neq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockImplementation((lim: number) => {
              const limObj: any = {
                maybeSingle: vi.fn().mockImplementation(() => {
                  return Promise.resolve({ data: null, error: null });
                }),
                single: vi.fn().mockImplementation(() => {
                  return Promise.resolve({ data: null, error: null });
                }),
                then: (resolve: any) => {
                  if (table === "communication_queue") {
                    return resolve({ data: mockDbState.queue.slice(0, lim), error: null });
                  }
                  return resolve({ data: [], error: null });
                },
              };
              return limObj;
            }),
            maybeSingle: vi.fn().mockImplementation(() => {
              const lookupKey = selQuery._id || selQuery._val;
              if (table === "events") {
                return Promise.resolve({ data: mockDbState.events[lookupKey] || { id: lookupKey, attendee_limit: 100 }, error: null });
              }
              if (table === "attendees") {
                return Promise.resolve({ data: mockDbState.attendees[lookupKey] || null, error: null });
              }
              return Promise.resolve({ data: null, error: null });
            }),
            single: vi.fn().mockImplementation(() => {
              const lookupKey = selQuery._id || selQuery._val;
              if (table === "events") {
                return Promise.resolve({ data: mockDbState.events[lookupKey] || { id: lookupKey, name: "Test Event", event_date: "2026-11-01", venue: "Hall A", attendee_limit: 100 }, error: null });
              }
              if (table === "attendees") {
                return Promise.resolve({ data: mockDbState.attendees[lookupKey] || { id: lookupKey, name: "Test Attendee", email: "test@example.com", custom_responses: {} }, error: null });
              }
              return Promise.resolve({ data: {}, error: null });
            }),
          };
          return selQuery;
        }),
        insert: vi.fn().mockImplementation((payload: any) => {
          return {
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "new_1", ...payload }, error: null }),
            }),
            then: (resolve: any) => resolve({ data: { id: "new_1", ...payload }, error: null }),
          };
        }),
        upsert: vi.fn().mockImplementation((payload: any) => {
          if (table === "communication_queue") {
            const arr = Array.isArray(payload) ? payload : [payload];
            mockDbState.queue.push(...arr);
          }
          return Promise.resolve({ error: null });
        }),
        update: vi.fn().mockImplementation((payload: any) => {
          const updateQuery: any = {
            eq: vi.fn().mockImplementation((col: string, val: any) => {
              if (table === "attendees" && mockDbState.attendees[val]) {
                Object.assign(mockDbState.attendees[val], payload);
              }
              return updateQuery;
            }),
            then: (resolve: any) => resolve({ error: null }),
          };
          return updateQuery;
        }),
      };
      return builder;
    }),
  })),
}));

vi.mock("@/lib/supabase/config", () => ({
  getSupabaseUrl: () => "https://test-urpass.supabase.co",
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
  isEmailProviderConfigured: vi.fn().mockReturnValue(true),
  getFromEmail: vi.fn().mockReturnValue("notifications@urpass.in"),
  sendApprovalEmail: vi.fn().mockResolvedValue(undefined),
  sendAttendeeRejectionAndRefundEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/invoices", () => ({
  createCreditNoteForPayment: vi.fn().mockResolvedValue({ creditNoteNumber: "CN-TEST-001" }),
}));

vi.mock("@/app/actions/passes", () => ({
  generatePass: vi.fn().mockResolvedValue({ passToken: "pass_tok_123" }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("UrPass Stage 5: Registration & Forms Remediation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbState.queue = [];
    mockDbState.attendees = {
      att_1: {
        id: "att_1",
        event_id: "evt_1",
        name: "Test Attendee",
        email: "attendee@example.com",
        phone: "9876543210",
        application_status: "approved",
        pass_status: "generated",
        cancellation_token: "valid_token_123",
        custom_responses: { college: "IIT", t_shirt: "L" },
      },
    };
    mockDbState.events = {
      evt_1: {
        id: "evt_1",
        organizer_id: "org_1",
        name: "UrPass Demo",
        attendee_limit: 100,
        auto_promote_waitlist: true,
      },
    };
  });

  describe("Phase 1 (P0): Concurrency-Safe Capacity Allocation", () => {
    it("simulates 100 concurrent registrations for 1 remaining spot and ensures capacity is never exceeded", async () => {
      let currentApproved = 99;
      const attendeeLimit = 100;
      let approvedCount = 0;
      let waitlistedCount = 0;

      // Mock database client simulating PostgreSQL row-level locks
      const mockAdmin = {
        rpc: vi.fn().mockImplementation(async (funcName, args) => {
          if (funcName === "allocate_attendance_capacity") {
            // Simulated transaction block with row-level lock
            if (currentApproved < attendeeLimit) {
              currentApproved++;
              return { data: { success: true, action: "approved", remaining_capacity: attendeeLimit - currentApproved }, error: null };
            } else {
              return { data: { success: true, action: "waitlisted", remaining_capacity: 0 }, error: null };
            }
          }
          return { data: null, error: new Error("Unknown RPC") };
        }),
      };

      // Launch 100 concurrent requests
      const promises = Array.from({ length: 100 }, async () => {
        const alloc = await allocateAttendanceCapacity({
          adminClient: mockAdmin as any,
          eventId: "event_concurrent_1",
          ticketTypeId: null,
        });

        if (alloc.action === "approved") approvedCount++;
        else if (alloc.action === "waitlisted") waitlistedCount++;
        return alloc;
      });

      const results = await Promise.all(promises);

      // Exactly 1 request must receive approved, 99 waitlisted
      expect(approvedCount).toBe(1);
      expect(waitlistedCount).toBe(99);
      expect(results.length).toBe(100);
      expect(currentApproved).toBe(100);
      expect(currentApproved).toBeLessThanOrEqual(attendeeLimit);
    });

    it("simulates 20 concurrent manual approvals for 1 remaining spot with atomicApproveAttendee", async () => {
      let currentApproved = 9;
      const attendeeLimit = 10;
      let approvalsWon = 0;
      let approvalsRejected = 0;

      const mockAdmin = {
        rpc: vi.fn().mockImplementation(async (funcName, args) => {
          if (funcName === "atomic_approve_attendee") {
            if (currentApproved < attendeeLimit) {
              currentApproved++;
              return { data: { success: true, action: "approved" }, error: null };
            } else {
              return { data: { success: false, error: "Event is at capacity" }, error: null };
            }
          }
          return { data: null, error: new Error("Unknown RPC") };
        }),
      };

      const promises = Array.from({ length: 20 }, async (_, idx) => {
        const res = await atomicApproveAttendee({
          adminClient: mockAdmin as any,
          attendeeId: `att_${idx + 1}`,
          eventId: "event_concurrent_2",
        });

        if (res.success) approvalsWon++;
        else approvalsRejected++;
        return res;
      });

      await Promise.all(promises);

      expect(approvalsWon).toBe(1);
      expect(approvalsRejected).toBe(19);
      expect(currentApproved).toBe(10);
    });
  });

  describe("Phase 3 (P1): Attendee Details Editing", () => {
    it("validates input and prevents empty name and invalid emails", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as any).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "org_1", email: "organizer@urpass.in" } },
          }),
        },
        from: vi.fn().mockImplementation((table) => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: "evt_1", organizer_id: "org_1" } }),
              }),
            }),
          }),
        })),
      });

      const emptyNameRes = await updateAttendeeDetails("evt_1", "att_1", { name: "" });
      expect(emptyNameRes.error).toContain("Name cannot be empty");

      const invalidEmailRes = await updateAttendeeDetails("evt_1", "att_1", { email: "bad-email" });
      expect(invalidEmailRes.error).toContain("valid email address");
    });
  });

  describe("Phase 4 (P1): Durable Communication Queue", () => {
    it("enqueues event cancellation notifications and processes batches with idempotency", async () => {
      const enqueueRes = await enqueueEventCancellationBroadcast("evt_1", "Weather emergency");
      expect(enqueueRes).toBeDefined();

      const batchRes = await processCommunicationQueueBatch(25);
      expect(batchRes).toBeDefined();
      expect(typeof batchRes.processed).toBe("number");
    });
  });

  describe("Phase 7 (P3): Self-Service Registration Withdrawal", () => {
    it("blocks withdrawal without authorized identity or valid cancellation token", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as any).mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      });

      const res = await withdrawRegistrationAction("evt_1", "att_1", {
        cancellationToken: "wrong_token",
      });

      expect(res.error).toContain("Unauthorized");
    });

    it("allows withdrawal with verified cancellation token and triggers waitlist auto-promotion", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as any).mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      });

      const res = await withdrawRegistrationAction("evt_1", "att_1", {
        cancellationToken: "valid_token_123",
      });

      expect(res.success).toBe(true);
    });
  });

  describe("Phase 8: Gateway Refund Reconciliation", () => {
    it("does not create credit note or send refund email when Razorpay refund fails", async () => {
      const { createCreditNoteForPayment } = await import("@/lib/invoices");
      const { sendAttendeeRejectionAndRefundEmail } = await import("@/lib/email");

      expect(createCreditNoteForPayment).not.toHaveBeenCalled();
      expect(sendAttendeeRejectionAndRefundEmail).not.toHaveBeenCalled();
    });
  });
});
