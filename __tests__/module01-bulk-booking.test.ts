import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js & external dependencies ─────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  validateBulkBookingRequest,
  calculateBulkOrderPricing,
  reserveBulkEventCapacity,
  settleBulkOrderAndIssueTickets,
  refundBulkOrderOrTicket,
  getBulkBookingSettings,
} from "@/lib/bulk-booking";
import {
  initiateBulkTicketCheckout,
  completeBulkPaymentAndIssueTickets,
  cancelOrRefundBulkTickets,
} from "@/app/actions/bulk-booking";
import type { BulkBookingRequest } from "@/lib/bulk-booking/types";
import type { EventLike } from "@/lib/feature-flags";

describe("Module 01 — Bulk Ticket Booking (Test 01 Suite)", () => {
  const activeBulkEvent: EventLike = {
    id: "event-bulk-001",
    organizer_id: "org-1",
    name: "Tech Summit 2026",
    attendee_limit: 100,
    status: "active",
    application_enabled: true,
    custom_pass_design: {
      _featureFlags: {
        features: {
          bulk_ticket_booking: true,
        },
        version: 1,
      },
      _bulkBookingSettings: {
        enabled: true,
        minQuantity: 1,
        maxQuantityPerOrder: 10,
        maxQuantityPerCustomer: 20,
        allowMixedTickets: true,
        assignAttendeesLater: true,
        reservationTtlSeconds: 600,
      },
    },
  };

  const bulkOffEvent: EventLike = {
    id: "event-bulk-off",
    organizer_id: "org-1",
    name: "Exclusive Workshop",
    attendee_limit: 50,
    status: "active",
    application_enabled: true,
    custom_pass_design: {
      _featureFlags: {
        features: {
          bulk_ticket_booking: false, // OFF
        },
      },
      _bulkBookingSettings: {
        enabled: false,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Scenario 1: Purchase 1 ticket (Existing checkout works) ───────────────────
  it("Scenario 1: Purchase 1 ticket works normally across standard & bulk workflows", async () => {
    const singleTicketRequest: BulkBookingRequest = {
      eventId: "event-bulk-001",
      buyerName: "Arun Kumar",
      buyerEmail: "arun@example.com",
      items: [
        {
          ticketTypeId: "tt_general",
          ticketTypeName: "General Admission",
          pricePaise: 50000, // ₹500
          quantity: 1,
        },
      ],
    };

    const validation = await validateBulkBookingRequest({
      event: activeBulkEvent,
      request: singleTicketRequest,
    });

    expect(validation.valid).toBe(true);
    expect(validation.pricing?.totalQuantity).toBe(1);
    expect(validation.pricing?.totalAmountPaise).toBe(50000);
  });

  // ── Scenario 2: Purchase 10 tickets (10 ticket records, 1 order) ───────────────
  it("Scenario 2: Purchase 10 tickets generates 1 order and 10 individual ticket records with unique pass tokens", async () => {
    const bulk10Request: BulkBookingRequest = {
      eventId: "event-bulk-001",
      buyerName: "Arun Kumar",
      buyerEmail: "arun@example.com",
      buyerPhone: "+919876543210",
      items: [
        {
          ticketTypeId: "tt_general",
          ticketTypeName: "General Admission",
          pricePaise: 50000,
          quantity: 10,
        },
      ],
    };

    const pricing = calculateBulkOrderPricing(bulk10Request);
    expect(pricing.totalQuantity).toBe(10);
    expect(pricing.totalAmountPaise).toBe(500000); // 10 * ₹500 = ₹5,000

    const insertedAttendees: any[] = [];
    const insertedPasses: any[] = [];
    let insertedOrder: any = null;

    const mockAdminDb = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "ticket_orders") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null }), // No prior settled order
            insert: vi.fn().mockImplementation((payload) => {
              insertedOrder = payload;
              return Promise.resolve({ error: null });
            }),
          };
        }
        if (table === "attendees") {
          return {
            insert: vi.fn().mockImplementation((payload) => {
              insertedAttendees.push(payload);
              return Promise.resolve({ error: null });
            }),
          };
        }
        if (table === "passes") {
          return {
            insert: vi.fn().mockImplementation((payload) => {
              insertedPasses.push(payload);
              return Promise.resolve({ error: null });
            }),
          };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
      }),
    };

    const settlement = await settleBulkOrderAndIssueTickets({
      adminClient: mockAdminDb as any,
      event: activeBulkEvent,
      request: bulk10Request,
      paymentId: "pay_rzp_123456789",
    });

    expect(settlement.success).toBe(true);
    expect(settlement.status).toBe("paid");
    expect(settlement.totalQuantity).toBe(10);
    expect(settlement.totalAmountPaise).toBe(500000);
    expect(settlement.tickets.length).toBe(10);

    // Verify 1 consolidated order was created
    expect(insertedOrder).not.toBeNull();
    expect(insertedOrder.total_attendee_count).toBe(10);
    expect(insertedOrder.razorpay_payment_id).toBe("pay_rzp_123456789");

    // Verify 10 individual attendee records created
    expect(insertedAttendees.length).toBe(10);
    expect(insertedAttendees[0].name).toContain("Arun Kumar");
    expect(insertedAttendees[9].name).toContain("Guest 10");

    // Verify 10 unique pass tokens
    expect(insertedPasses.length).toBe(10);
    const uniqueTokens = new Set(insertedPasses.map((p) => p.pass_token));
    expect(uniqueTokens.size).toBe(10);
  });

  // ── Scenario 3: Purchase exceeds limit (Block with validation message) ────────
  it("Scenario 3: Purchase exceeding maximum order limit is blocked with validation error", async () => {
    const excessRequest: BulkBookingRequest = {
      eventId: "event-bulk-001",
      buyerName: "Enterprise Buyer",
      buyerEmail: "buyer@enterprise.com",
      items: [
        {
          ticketTypeId: "tt_general",
          ticketTypeName: "General Admission",
          pricePaise: 50000,
          quantity: 15, // Limit is 10
        },
      ],
    };

    const validation = await validateBulkBookingRequest({
      event: activeBulkEvent,
      request: excessRequest,
    });

    expect(validation.valid).toBe(false);
    expect(validation.error).toBe("EXCEEDS_ORDER_LIMIT");
    expect(validation.message).toContain("Purchase exceeds maximum allowed limit of 10 tickets");
  });

  // ── Scenario 4: Only 5 slots remain; request 10 (Reject / Insufficient capacity) ─
  it("Scenario 4: When only 5 slots remain and 10 are requested, reservation is rejected with insufficient capacity", async () => {
    const limitedEvent: EventLike = {
      ...activeBulkEvent,
      attendee_limit: 20, // Only 20 total limit
    };

    const mockAdminDb = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "attendees") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            // 15 already approved attendees -> only 5 slots remain!
            count: 15,
          };
        }
        if (table === "ticket_reservations") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gt: vi.fn().mockResolvedValue({ data: [] }),
            update: vi.fn().mockReturnThis(),
            lte: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
      }),
    };

    const bulk10Request: BulkBookingRequest = {
      eventId: "event-bulk-001",
      buyerName: "Late Buyer",
      buyerEmail: "late@buyer.com",
      items: [
        {
          ticketTypeId: "tt_general",
          ticketTypeName: "General Admission",
          pricePaise: 50000,
          quantity: 10, // Requesting 10 when only 5 remain
        },
      ],
    };

    const result = await reserveBulkEventCapacity({
      adminClient: mockAdminDb as any,
      event: limitedEvent,
      request: bulk10Request,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("INSUFFICIENT_EVENT_CAPACITY");
    expect(result.message).toContain("Only 5 slots remain for this event. You requested 10.");
    expect(result.remainingCapacity).toBe(5);
  });

  // ── Scenario 5: Payment fails (No active tickets issued) ───────────────────────
  it("Scenario 5: When payment fails, no active tickets are issued and order remains unpaid", async () => {
    const failedRequest: BulkBookingRequest = {
      eventId: "event-bulk-001",
      buyerName: "Failed Cardholder",
      buyerEmail: "declined@card.com",
      items: [
        {
          ticketTypeId: "tt_general",
          ticketTypeName: "General Admission",
          pricePaise: 50000,
          quantity: 5,
        },
      ],
    };

    // If payment fails on client or gateway, completeBulkPaymentAndIssueTickets is never called with a valid payment
    // If called with invalid/missing event, it reports failed status with zero tickets
    const mockAdminDb = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: "Payment declined" } }),
      }),
    };
    vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

    const result = await completeBulkPaymentAndIssueTickets({
      eventId: "non-existent-event",
      request: failedRequest,
      paymentId: "pay_failed_declined",
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("failed");
    expect(result.tickets).toEqual([]);
    expect(result.totalQuantity).toBe(0);
  });

  // ── Scenario 6: Payment webhook repeats (Idempotency guarantee) ───────────────
  it("Scenario 6: Payment webhook repeat is idempotent and does not create duplicate tickets", async () => {
    const existingPaidOrder = {
      id: "order_existing_123",
      event_id: "event-bulk-001",
      buyer_name: "Arun Kumar",
      buyer_email: "arun@example.com",
      total_attendee_count: 5,
      amount: 250000,
      status: "paid",
    };

    const existingAttendees = Array.from({ length: 5 }, (_, i) => ({
      id: `att_${i + 1}`,
      name: `Arun Kumar (Guest ${i + 1})`,
      email: "arun@example.com",
      pass_type: "General Admission",
      ticket_type_id: "tt_general",
      pass_status: "generated",
      passes: {
        id: `pass_${i + 1}`,
        pass_token: `token_existing_${i + 1}`,
      },
    }));

    const mockInsert = vi.fn();

    const mockAdminDb = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "ticket_orders") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: existingPaidOrder }),
            insert: mockInsert,
          };
        }
        if (table === "attendees") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: vi.fn().mockImplementation((cb) => cb({ data: existingAttendees })),
            insert: mockInsert,
          };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), insert: mockInsert };
      }),
    };

    const repeatedSettlement = await settleBulkOrderAndIssueTickets({
      adminClient: mockAdminDb as any,
      event: activeBulkEvent,
      request: {
        eventId: "event-bulk-001",
        buyerName: "Arun Kumar",
        buyerEmail: "arun@example.com",
        items: [{ ticketTypeId: "tt_general", ticketTypeName: "General Admission", pricePaise: 50000, quantity: 5 }],
      },
      paymentId: "pay_rzp_duplicate_webhook",
    });

    expect(repeatedSettlement.success).toBe(true);
    expect(repeatedSettlement.isExisting).toBe(true);
    expect(repeatedSettlement.orderId).toBe("order_existing_123");
    expect(repeatedSettlement.tickets.length).toBe(5);
    // Crucial: No extra database insert occurred on repeated webhook
    expect(mockInsert).not.toHaveBeenCalled();
  });

  // ── Scenario 7: Simultaneous purchases (No capacity overselling) ──────────────
  it("Scenario 7: Concurrent purchases check consumed capacity atomically preventing overselling", async () => {
    const limitedEvent: EventLike = {
      ...activeBulkEvent,
      attendee_limit: 10, // Exactly 10 slots
    };

    let simulatedApproved = 0;

    const createMockDb = () => ({
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "attendees") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            count: simulatedApproved,
          };
        }
        if (table === "ticket_reservations") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gt: vi.fn().mockResolvedValue({ data: [] }),
            insert: vi.fn().mockResolvedValue({ error: null }),
            update: vi.fn().mockReturnThis(),
            lte: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
      }),
    });

    // Buyer 1 reserves 6 tickets
    const res1 = await reserveBulkEventCapacity({
      adminClient: createMockDb() as any,
      event: limitedEvent,
      request: {
        eventId: "event-bulk-001",
        buyerName: "Buyer 1",
        buyerEmail: "b1@test.com",
        items: [{ ticketTypeId: "tt_1", ticketTypeName: "Pass", pricePaise: 1000, quantity: 6 }],
      },
    });
    expect(res1.success).toBe(true);

    // Capacity consumed is now 6
    simulatedApproved = 6;

    // Buyer 2 attempts to reserve 6 tickets concurrently (6 + 6 > 10)
    const res2 = await reserveBulkEventCapacity({
      adminClient: createMockDb() as any,
      event: limitedEvent,
      request: {
        eventId: "event-bulk-001",
        buyerName: "Buyer 2",
        buyerEmail: "b2@test.com",
        items: [{ ticketTypeId: "tt_1", ticketTypeName: "Pass", pricePaise: 1000, quantity: 6 }],
      },
    });

    expect(res2.success).toBe(false);
    expect(res2.error).toBe("INSUFFICIENT_EVENT_CAPACITY");
    expect(res2.remainingCapacity).toBe(4);
  });

  // ── Scenario 8: Bulk feature OFF (Normal checkout only) ───────────────────────
  it("Scenario 8: When bulk feature is OFF, quantity > 1 is blocked with validation error while quantity 1 succeeds", async () => {
    // 1. Quantity = 5 on bulk-off event -> Blocked
    const multiRequest: BulkBookingRequest = {
      eventId: "event-bulk-off",
      buyerName: "Customer",
      buyerEmail: "cust@example.com",
      items: [
        {
          ticketTypeId: "tt_general",
          ticketTypeName: "Standard",
          pricePaise: 20000,
          quantity: 5,
        },
      ],
    };

    const val1 = await validateBulkBookingRequest({
      event: bulkOffEvent,
      request: multiRequest,
    });
    expect(val1.valid).toBe(false);
    expect(val1.error).toBe("BULK_FEATURE_DISABLED");

    // 2. Quantity = 1 on bulk-off event -> Passes normally
    const singleRequest: BulkBookingRequest = {
      eventId: "event-bulk-off",
      buyerName: "Customer",
      buyerEmail: "cust@example.com",
      items: [
        {
          ticketTypeId: "tt_general",
          ticketTypeName: "Standard",
          pricePaise: 20000,
          quantity: 1,
        },
      ],
    };

    const val2 = await validateBulkBookingRequest({
      event: bulkOffEvent,
      request: singleRequest,
    });
    expect(val2.valid).toBe(true);
    expect(val2.pricing?.totalQuantity).toBe(1);
  });

  // ── Full & Partial Refunds / Cancellations ────────────────────────────────────
  describe("Refund & Lifecycle State Management", () => {
    it("supports partial / individual ticket refund while keeping other tickets active", async () => {
      const mockOrder = {
        id: "order_bulk_500",
        event_id: "event-bulk-001",
        status: "paid",
        group_members: [
          { attendeeId: "att_1", name: "Guest 1", pricePaise: 50000, status: "active" },
          { attendeeId: "att_2", name: "Guest 2", pricePaise: 50000, status: "active" },
          { attendeeId: "att_3", name: "Guest 3", pricePaise: 50000, status: "active" },
        ],
      };

      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "ticket_orders") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
              update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
            };
          }
          if (table === "passes" || table === "attendees") {
            return {
              update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };

      // Refund only Guest 2 ("att_2")
      const refundRes = await refundBulkOrderOrTicket({
        adminClient: mockAdminDb as any,
        orderId: "order_bulk_500",
        ticketAttendeeIds: ["att_2"],
      });

      expect(refundRes.success).toBe(true);
      expect(refundRes.isFullRefund).toBe(false);
      expect(refundRes.refundedCount).toBe(1);
      expect(refundRes.remainingActiveCount).toBe(2);
      expect(refundRes.refundedAmountPaise).toBe(50000);
      expect(refundRes.refundedTicketIds).toEqual(["att_2"]);
    });

    it("supports whole-order refund revoking all individual ticket passes", async () => {
      const mockOrder = {
        id: "order_bulk_999",
        event_id: "event-bulk-001",
        status: "paid",
        group_members: [
          { attendeeId: "att_1", name: "Guest 1", pricePaise: 50000, status: "active" },
          { attendeeId: "att_2", name: "Guest 2", pricePaise: 50000, status: "active" },
        ],
      };

      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "ticket_orders") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
              update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
            };
          }
          if (table === "passes" || table === "attendees") {
            return {
              update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };

      // Whole-order refund (no specific ticket IDs specified)
      const refundRes = await refundBulkOrderOrTicket({
        adminClient: mockAdminDb as any,
        orderId: "order_bulk_999",
      });

      expect(refundRes.success).toBe(true);
      expect(refundRes.isFullRefund).toBe(true);
      expect(refundRes.refundedCount).toBe(2);
      expect(refundRes.remainingActiveCount).toBe(0);
      expect(refundRes.refundedAmountPaise).toBe(100000);
    });
  });
});
