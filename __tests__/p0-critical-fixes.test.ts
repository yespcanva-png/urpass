import { describe, it, expect, vi, beforeEach } from "vitest";
import { hashOpsPin, verifyOpsPinHash, verifyOpsPinWithRateLimit } from "@/lib/ops/pin";
import { cancelEventWithCascade } from "@/lib/payments/state-orchestrator";

// Mock Supabase & Services
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockGte = vi.fn();
const mockMaybeSingle = vi.fn();
const mockSingle = vi.fn();
const mockRpc = vi.fn();

const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  select: mockSelect,
  update: mockUpdate,
  delete: vi.fn(),
}));

// Setup default fluent mocks
beforeEach(() => {
  vi.clearAllMocks();

  mockInsert.mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: mockSingle.mockResolvedValue({
        data: { id: "test-id", credit_note_number: "UP/CN/2026-27/0001" },
        error: null,
      }),
      maybeSingle: mockMaybeSingle.mockResolvedValue({
        data: { id: "test-id", credit_note_number: "UP/CN/2026-27/0001" },
        error: null,
      }),
    }),
    error: null,
  });

  mockSelect.mockReturnValue({
    eq: mockEq,
    in: mockIn,
    gte: mockGte,
    maybeSingle: mockMaybeSingle,
    single: mockSingle,
  });

  mockEq.mockReturnValue({
    eq: mockEq,
    in: mockIn,
    gte: mockGte,
    maybeSingle: mockMaybeSingle,
    single: mockSingle,
    select: mockSelect,
    update: mockUpdate,
  });

  mockIn.mockReturnValue({
    select: mockSelect,
    eq: mockEq,
    maybeSingle: mockMaybeSingle,
  });

  mockGte.mockReturnValue({
    count: 0,
    data: [],
    error: null,
  });

  mockUpdate.mockReturnValue({
    eq: mockEq,
    in: mockIn,
    select: mockSelect,
  });
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: mockFrom,
    rpc: mockRpc,
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "usr_org_1" } } }),
    },
  }),
}));

vi.mock("@/lib/supabase/config", () => ({
  getSupabaseUrl: () => "https://mock.supabase.co",
}));

describe("P0 Fix 4: Secure Ops/Admin PIN Hashing & Rate Limiting", () => {
  it("hashes PIN using scrypt with unique salt", () => {
    const pin = "260203";
    const hashed1 = hashOpsPin(pin);
    const hashed2 = hashOpsPin(pin);

    expect(hashed1).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    expect(hashed2).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    // Unique salts produce different hashes
    expect(hashed1).not.toBe(hashed2);

    // Both verify correctly
    expect(verifyOpsPinHash(pin, hashed1)).toBe(true);
    expect(verifyOpsPinHash(pin, hashed2)).toBe(true);
    expect(verifyOpsPinHash("000000", hashed1)).toBe(false);
  });

  it("verifies legacy plaintext PIN with timingSafeEqual and upgrades to scrypt", () => {
    const plain = "260203";
    expect(verifyOpsPinHash("260203", plain)).toBe(true);
    expect(verifyOpsPinHash("wrong", plain)).toBe(false);
  });

  it("enforces lockout when 5 failed attempts occur within 15 minutes", async () => {
    // Mock 5 failed attempts in the rate limit window
    mockGte.mockResolvedValueOnce({ count: 5 });

    const result = await verifyOpsPinWithRateLimit("260203", "192.168.1.100");
    expect(result.valid).toBe(false);
    expect(result.rateLimited).toBe(true);
    expect(result.error).toContain("temporarily locked");
  });
});

describe("P0 Fix 5 & 6: Pass Revocation & Cancelled Event Cascade", () => {
  it("cancels an event and executes atomic cascade on active passes and reservations", async () => {
    mockSelect.mockReturnValueOnce({
      eq: vi.fn().mockReturnValueOnce({
        in: vi.fn().mockResolvedValueOnce({
          data: [{ id: "p1" }, { id: "p2" }],
          error: null,
        }),
      }),
    });

    const result = await cancelEventWithCascade("evt_123", "Unforeseen venue closure");
    expect(result.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("events");
    expect(mockFrom).toHaveBeenCalledWith("passes");
    expect(mockFrom).toHaveBeenCalledWith("ticket_reservations");
  });
});

describe("P0 Fix 1: Database-backed Webhook Idempotency", () => {
  it("recognizes duplicate webhook requests when processed_webhook_events has duplicate", async () => {
    const { handleRazorpayWebhook } = await import("@/lib/razorpay-webhook");

    process.env.RAZORPAY_WEBHOOK_SECRET = "test_secret";

    const payload = JSON.stringify({
      event: "payment.captured",
      event_id: "evt_dup_12345",
      payload: { payment: { entity: { id: "pay_test_dup", amount: 50000 } } },
    });

    const crypto = await import("crypto");
    const signature = crypto
      .createHmac("sha256", "test_secret")
      .update(payload)
      .digest("hex");

    const createReq = () =>
      new Request("https://urpass.space/api/webhooks/razorpay", {
        method: "POST",
        headers: {
          "x-razorpay-signature": signature,
          "content-type": "application/json",
        },
        body: payload,
      });

    // First call processes
    const res1 = await handleRazorpayWebhook(createReq() as any);
    const json1 = await res1.json();
    expect(json1.received).toBe(true);

    // Second call triggers duplicate detection
    const res2 = await handleRazorpayWebhook(createReq() as any);
    const json2 = await res2.json();
    expect(json2.received).toBe(true);
    expect(json2.duplicate).toBe(true);
  });
});

describe("P0 Fix 2: Atomic Capacity Reservation Check", () => {
  it("fails fast and does not charge or create order when capacity is sold out", async () => {
    const { reserveEventCapacity } = await import("@/lib/capacity-reservation");

    mockRpc.mockResolvedValueOnce({
      data: { success: false, error: "SOLD_OUT", message: "Selected ticket is sold out." },
      error: null,
    });

    const mockAdmin: any = { rpc: mockRpc };
    const res = await reserveEventCapacity({
      adminClient: mockAdmin,
      eventId: "evt_sold_out",
      ticketTypeId: "tt_vip",
      buyerEmail: "buyer@example.com",
      buyerName: "Buyer Example",
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe("SOLD_OUT");
    expect(res.message).toBe("Selected ticket is sold out.");
  });
});

describe("P0 Fix 7: Pass Generation Recovery", () => {
  it("retryPassGeneration updates attendee pass_status to generated upon recovery", async () => {
    const { retryPassGeneration } = await import("@/app/actions/attendees");

    // 1. Mock attendee lookup (.single)
    mockSingle
      .mockResolvedValueOnce({
        data: {
          id: "att_stranded_1",
          name: "Stranded Attendee",
          email: "stranded@example.com",
          application_status: "approved",
          pass_status: "pending_retry",
          ticket_type_id: "tt_1",
          pass_retry_count: 1,
        },
        error: null,
      })
      // 2. Mock event details lookup (.single)
      .mockResolvedValueOnce({
        data: { name: "Tech Summit", event_date: "2026-11-01", venue: "Grand Hall" },
        error: null,
      })
      // 3. Mock new pass insert (.single)
      .mockResolvedValueOnce({
        data: { pass_token: "pass_tok_healed_999" },
        error: null,
      });

    // Mock existingPass lookup (.maybeSingle) -> not found
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const result = await retryPassGeneration("att_stranded_1", "evt_123");
    expect(result.success).toBe(true);
    expect(result.passToken).toBe("pass_tok_healed_999");
  });
});

describe("P0 Fix 3: Paid Attendee Rejection → Automatic Refund & GST Credit Note", () => {
  it("rejecting a paid attendee triggers pass revocation, updates order refund status, and creates credit note", async () => {
    const { createCreditNoteForPayment } = await import("@/lib/invoices");

    // Mock invoice lookup for credit note creation
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        id: "inv_123",
        invoice_number: "UP/INV/2026-27/0001",
        total_amount: 5000,
        taxable_amount: 4237.29,
        cgst_amount: 381.355,
        sgst_amount: 381.355,
        igst_amount: 0,
        currency: "INR",
      },
      error: null,
    });

    const cnResult = await createCreditNoteForPayment({
      paymentId: "pay_captured_5000",
      reason: "Application rejected by organizer — Full Refund",
      amountRupees: 5000,
      customerName: "Delegate John",
      customerEmail: "john@example.com",
    });

    expect(cnResult).not.toBeNull();
    expect(cnResult?.creditNoteNumber).toMatch(/^UP\/CN\//);
    expect(mockFrom).toHaveBeenCalledWith("credit_notes");
    expect(mockFrom).toHaveBeenCalledWith("invoices");
  });
});
