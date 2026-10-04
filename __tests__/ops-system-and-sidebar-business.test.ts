import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase admin client
const mockUpsert = vi.fn().mockResolvedValue({ error: null });
const mockSelect = vi.fn();
const mockFrom = vi.fn((table: string) => {
  if (table === "system_settings") {
    return {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: mockSelect,
        })),
      })),
      upsert: mockUpsert,
    };
  }
  return {
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue({ data: [] }),
      })),
    })),
  };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn((name: string) => {
      if (name === "urpass_ops_session") return { value: "valid-session" };
      return undefined;
    }),
    set: vi.fn(),
  }),
}));

describe("Ops Security & Database PIN Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });

  it("retrieves the ops PIN strictly from the database table system_settings", async () => {
    mockSelect.mockResolvedValue({
      data: { value: "260203" },
      error: null,
    });

    const { getOpsPinFromDb, verifyOpsPin } = await import("@/lib/ops/pin");

    const pin = await getOpsPinFromDb();
    expect(pin).toBe("260203");

    // Verify correct PIN
    const isValid = await verifyOpsPin("260203");
    expect(isValid).toBe(true);

    // Verify incorrect PIN rejected
    const isInvalid = await verifyOpsPin("999999");
    expect(isInvalid).toBe(false);
  });

  it("updates the ops PIN in the database when requested", async () => {
    mockUpsert.mockResolvedValueOnce({ error: null });

    const { updateOpsPinInDb } = await import("@/lib/ops/pin");
    const result = await updateOpsPinInDb("123456");

    expect(result.success).toBe(true);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "ops_pin",
        value: expect.stringMatching(/^scrypt\$/),
      }),
      { onConflict: "key" }
    );
  });

  it("rejects invalid PIN lengths", async () => {
    const { updateOpsPinInDb } = await import("@/lib/ops/pin");

    const shortResult = await updateOpsPinInDb("12");
    expect(shortResult.success).toBe(false);
    expect(shortResult.error).toContain("between 4 and 12 characters");

    const longResult = await updateOpsPinInDb("12345678901234");
    expect(longResult.success).toBe(false);
  });

  it("creates and verifies cryptographic session tokens for Ops authorization", async () => {
    const { signOpsSessionToken, verifyOpsSessionToken } = await import("@/lib/ops/auth");

    const token = signOpsSessionToken();
    expect(typeof token).toBe("string");
    expect(token.includes(".")).toBe(true);

    const isValid = verifyOpsSessionToken(token);
    expect(isValid).toBe(true);

    const isTampered = verifyOpsSessionToken(token + "tamper");
    expect(isTampered).toBe(false);
  });

  describe("PATCH /api/ops/invoices", () => {
    it("validates invoice format and rejects invalid numbering", async () => {
      const auth = await import("@/lib/ops/auth");
      vi.spyOn(auth, "isOpsAuthenticated").mockResolvedValue(true);

      const { PATCH } = await import("@/app/api/ops/invoices/route");
      const req = new Request("http://localhost/api/ops/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: "inv-123",
          invoiceNumber: "INVALID-INV-123",
        }),
      });

      const res = await PATCH(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Invalid invoice number format");
    });

    it("accepts valid UP/{DOC_TYPE}/{FY}/{SEQUENCE} format", async () => {
      const { parseInvoiceNumber } = await import("@/lib/invoices");
      const validNumber = "UP/SUB/2026-27/000001";
      const parsed = parseInvoiceNumber(validNumber);

      expect(parsed).toEqual({
        prefix: "UP",
        docType: "SUB",
        fy: "2026-27",
        sequence: 1,
      });
    });
  });
});
