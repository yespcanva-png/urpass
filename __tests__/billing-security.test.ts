import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getUserPlan } from "@/lib/plan";
import { generateInvoicePdf, type InvoiceRecord } from "@/lib/invoices";
import { NextRequest } from "next/server";

// ── Mock Next.js server modules ───────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
const mockedCreateClient = vi.mocked(createClient);
const mockedCreateAdminClient = vi.mocked(createAdminClient);

describe("Razorpay Signature Verification", () => {
  const secret = "test_secret_key_12345";
  const orderId = "order_9A33XWu170gUtm";
  const paymentId = "pay_29Ae35XUxq5KaM";

  it("returns true for a valid signature", () => {
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const result = verifyRazorpaySignature(orderId, paymentId, validSignature, secret);
    expect(result).toBe(true);
  });

  it("returns false for a forged or tampered signature", () => {
    const forgedSignature = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const result = verifyRazorpaySignature(orderId, paymentId, forgedSignature, secret);
    expect(result).toBe(false);
  });

  it("returns false when signature or IDs are empty", () => {
    expect(verifyRazorpaySignature("", paymentId, "sig", secret)).toBe(false);
    expect(verifyRazorpaySignature(orderId, "", "sig", secret)).toBe(false);
    expect(verifyRazorpaySignature(orderId, paymentId, "", secret)).toBe(false);
  });
});

describe("Starter Plan Entitlements", () => {
  it("gives Starter the paid_events entitlement", async () => {
    const dummyClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { status: "active", plan: { slug: "starter" } },
        error: null,
      }),
    };

    const plan = await getUserPlan(dummyClient as never, "user-starter-1");
    expect(plan.canUse("paid_events")).toBe(true);
  });
});

describe("Payment Verification in Subscription Activation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects activation without payment verification for paid plan", async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1", email: "test@example.com" } } }) },
    };
    mockedCreateClient.mockResolvedValue(mockSupabase as never);

    const mockAdmin = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: "plan-pro", slug: "pro" }, error: null }),
    };
    mockedCreateAdminClient.mockReturnValue(mockAdmin as never);

    const { activatePaidSubscription } = await import("@/app/actions/billing");
    const result = await activatePaidSubscription("pro");

    expect(result?.error).toMatch(/Payment verification failed/i);
  });

  it("rejects activation when payment signature is invalid", async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1", email: "test@example.com" } } }) },
    };
    mockedCreateClient.mockResolvedValue(mockSupabase as never);

    const mockAdmin = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: "plan-pro", slug: "pro" }, error: null }),
    };
    mockedCreateAdminClient.mockReturnValue(mockAdmin as never);

    const { activatePaidSubscription } = await import("@/app/actions/billing");
    const result = await activatePaidSubscription("pro", {
      orderId: "order_123",
      paymentId: "pay_123",
      signature: "invalid_signature",
    });

    expect(result?.error).toMatch(/invalid signature/i);
  });
});

describe("Payment Verification in Event Pass Activation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects activation without payment verification payload", async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1", email: "test@example.com" } } }) },
    };
    mockedCreateClient.mockResolvedValue(mockSupabase as never);

    const { activateEventPass } = await import("@/app/actions/event-passes");
    const result = await activateEventPass("event", "" as never);

    expect(result?.error).toMatch(/Payment verification failed/i);
  });
});

describe("Invoice PDF Generation", () => {
  it("generates a valid binary PDF document", async () => {
    const sampleInvoice: InvoiceRecord = {
      id: "inv-uuid-1",
      invoice_number: "INV-202609-1234",
      user_id: "user-1",
      subscription_id: "sub-1",
      payment_id: "pay_xyz",
      seller_name: "URPASS Technologies Private Limited",
      seller_gstin: "33AABCU9603R1ZM",
      seller_address: "IIT Madras Research Park, Chennai",
      customer_name: "Srinithin",
      customer_email: "srinithin@example.com",
      customer_address: null,
      customer_gstin: null,
      place_of_supply: "Tamil Nadu (33)",
      state_code: "33",
      subtotal: 999,
      discount: 0,
      taxable_amount: 999,
      cgst_rate: 9,
      cgst_amount: 89.91,
      sgst_rate: 9,
      sgst_amount: 89.91,
      igst_rate: 0,
      igst_amount: 0,
      total_amount: 1178.82,
      currency: "INR",
      invoice_date: "2026-09-16",
      billing_period_start: "2026-09-16",
      billing_period_end: "2026-10-16",
      payment_status: "paid",
      invoice_status: "issued",
      pdf_url: "/api/invoices/inv-uuid-1/pdf",
      created_at: new Date().toISOString(),
      description: "Pro Plan (monthly)",
    };

    const pdfBytes = await generateInvoicePdf(sampleInvoice);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(500);

    // Verify PDF Magic Header %PDF-
    const header = Buffer.from(pdfBytes.slice(0, 5)).toString("utf-8");
    expect(header).toBe("%PDF-");
  });
});

describe("GET /api/invoices/[id]/pdf", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when user is unauthenticated", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never);

    const { GET } = await import("@/app/api/invoices/[id]/pdf/route");
    const req = new NextRequest("http://localhost/api/invoices/inv-1/pdf");
    const res = await GET(req, { params: Promise.resolve({ id: "inv-1" }) });

    expect(res.status).toBe(401);
  });

  it("returns 404 when invoice does not belong to user", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
      }),
    } as never);

    const { GET } = await import("@/app/api/invoices/[id]/pdf/route");
    const req = new NextRequest("http://localhost/api/invoices/inv-1/pdf");
    const res = await GET(req, { params: Promise.resolve({ id: "inv-1" }) });

    expect(res.status).toBe(404);
  });
});
