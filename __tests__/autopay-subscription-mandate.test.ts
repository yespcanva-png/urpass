import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/invoices", () => ({ createInvoiceForPayment: vi.fn().mockResolvedValue({ id: "inv_123" }) }));

const mockOrdersCreate = vi.fn();
const mockOrdersFetch = vi.fn();
const mockCustomersCreate = vi.fn();
const mockCustomersEdit = vi.fn();
const mockCustomersFetch = vi.fn();
const mockPaymentsFetch = vi.fn();
const mockPaymentsCapture = vi.fn();

vi.mock("@/lib/razorpay", () => ({
  getRazorpayCredentials: vi.fn(() => ({ keyId: "rzp_test_key_123", keySecret: "rzp_test_secret_123" })),
  getRazorpayClient: vi.fn(() => ({
    orders: {
      create: mockOrdersCreate,
      fetch: mockOrdersFetch,
    },
    customers: {
      create: mockCustomersCreate,
      edit: mockCustomersEdit,
      fetch: mockCustomersFetch,
    },
    payments: {
      fetch: mockPaymentsFetch,
      capture: mockPaymentsCapture,
    },
  })),
  verifyRazorpaySignature: vi.fn((orderId: string, paymentId: string, signature: string, secret?: string) => {
    const sec = secret || "rzp_test_secret_123";
    const expected = crypto.createHmac("sha256", sec).update(`${orderId}|${paymentId}`).digest("hex");
    return expected === signature;
  }),
  formatRazorpayErrorMessage: vi.fn((_err: unknown, fallback: string) => fallback),
}));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createInvoiceForPayment } from "@/lib/invoices";
import {
  AUTOPAY_AUTH_AMOUNT_PAISE,
  AUTOPAY_INTRO_CHARGE_PAISE,
  getRazorpayAutopayDisclosure,
} from "@/lib/billing/razorpay-autopay";

const mockedCreateClient = vi.mocked(createClient);
const mockedCreateAdminClient = vi.mocked(createAdminClient);
const mockedCreateInvoice = vi.mocked(createInvoiceForPayment);

describe("Unified AutoPay Mandate Creation & Verification Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/billing/autopay/mandate", () => {
    it("returns 401 if user is not authenticated", async () => {
      mockedCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      } as never);

      const { POST } = await import("@/app/api/billing/autopay/mandate/route");
      const req = new NextRequest("http://localhost/api/billing/autopay/mandate", {
        method: "POST",
        body: JSON.stringify({ planSlug: "starter" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("rejects non-monthly billing cycle", async () => {
      mockedCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user_1" } } }) },
      } as never);

      const { POST } = await import("@/app/api/billing/autopay/mandate/route");
      const req = new NextRequest("http://localhost/api/billing/autopay/mandate", {
        method: "POST",
        body: JSON.stringify({ planSlug: "starter", billingCycle: "annual" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/monthly INR plans/i);
    });

    it("returns 400 when mobile number is missing", async () => {
      mockedCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user_no_phone" } } }) },
      } as never);

      mockedCreateAdminClient.mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null }),
            }),
          }),
        }),
      } as never);

      const { POST } = await import("@/app/api/billing/autopay/mandate/route");
      const req = new NextRequest("http://localhost/api/billing/autopay/mandate", {
        method: "POST",
        body: JSON.stringify({ planSlug: "starter", billingCycle: "monthly" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/mobile number is required/i);
    });

    it("creates an AutoPay recurring order charging ₹34.22 immediately for Starter plan", async () => {
      const user = { id: "user_test_starter", email: "starter@example.com" };
      mockedCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
      } as never);

      const mockAdminFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
        upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockedCreateAdminClient.mockReturnValue({
        from: mockAdminFrom,
      } as never);

      mockCustomersCreate.mockResolvedValue({ id: "cust_starter_123" });
      mockOrdersCreate.mockResolvedValue({
        id: "order_starter_rzp_456",
        amount: 3422,
        currency: "INR",
      });

      const { POST } = await import("@/app/api/billing/autopay/mandate/route");
      const req = new NextRequest("http://localhost/api/billing/autopay/mandate", {
        method: "POST",
        body: JSON.stringify({
          planSlug: "starter",
          billingCycle: "monthly",
          billingDetails: {
            companyName: "Acme Events",
            phone: "9876543210",
            billingAddress: "123 Tech Park, Chennai",
            gstin: "33AAAAA0000A1Z5",
            state: "Tamil Nadu",
            stateCode: "33",
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.orderId).toBe("order_starter_rzp_456");
      expect(data.amount).toBe(AUTOPAY_INTRO_CHARGE_PAISE); // 3422 paise
      expect(data.todayAmountWithGst).toBe(34.22);
      expect(data.month2AmountWithGst).toBe(34.22);
      expect(data.month3OnwardAmountWithGst).toBe(588.82);
      expect(data.customerId).toBe("cust_starter_123");

      // Verify customer was created with contact
      expect(mockCustomersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Acme Events",
          contact: "9876543210",
        })
      );

      // Verify order creation parameters
      expect(mockOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 3422,
          currency: "INR",
          customer_id: "cust_starter_123",
          token: expect.objectContaining({
            max_amount: 58882, // Starter max monthly ceiling: 499 + 18% GST = 588.82
            frequency: "monthly",
          }),
          notes: expect.objectContaining({
            kind: "urpass_autopay_mandate",
            plan_slug: "starter",
            intro_charge_paise: "3422",
            company_name: "Acme Events",
            customer_gstin: "33AAAAA0000A1Z5",
          }),
        })
      );
    });

    it("creates an AutoPay recurring order charging ₹34.22 with regular ceiling for Pro & Business", async () => {
      const user = { id: "user_test_pro", email: "pro@example.com" };
      mockedCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
      } as never);

      mockedCreateAdminClient.mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null }),
          }),
          upsert: vi.fn().mockResolvedValue({ data: null }),
        }),
      } as never);

      mockCustomersCreate.mockResolvedValue({ id: "cust_pro_123" });
      mockOrdersCreate.mockResolvedValue({
        id: "order_pro_rzp_789",
        amount: 3422,
        currency: "INR",
      });

      const { POST } = await import("@/app/api/billing/autopay/mandate/route");
      const req = new NextRequest("http://localhost/api/billing/autopay/mandate", {
        method: "POST",
        body: JSON.stringify({
          planSlug: "pro",
          billingCycle: "monthly",
          phone: "9876543210",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.amount).toBe(3422);
      expect(data.todayAmountWithGst).toBe(34.22);
      expect(data.month2AmountWithGst).toBe(34.22);
      expect(data.month3OnwardAmountWithGst).toBe(1178.82);

      // Verify token max amount for Pro
      const disclosure = getRazorpayAutopayDisclosure("pro");
      expect(mockOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 3422,
          token: expect.objectContaining({
            max_amount: disclosure.maxAmountPaise, // 117882
          }),
        })
      );
    });
  });

  describe("POST /api/billing/autopay/mandate/verify", () => {
    it("rejects when signature is invalid", async () => {
      const user = { id: "user_test_sig", email: "sig@example.com" };
      mockedCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
      } as never);

      const { POST } = await import("@/app/api/billing/autopay/mandate/verify/route");
      const req = new NextRequest("http://localhost/api/billing/autopay/mandate/verify", {
        method: "POST",
        body: JSON.stringify({
          orderId: "order_123",
          paymentId: "pay_123",
          signature: "tampered_signature",
          customerId: "cust_123",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/invalid signature/i);
    });

    it("verifies payment, activates paid subscription, sets autopay_status active, and generates invoice for ₹34.22", async () => {
      const user = { id: "user_test_activate", email: "active@example.com" };
      mockedCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
      } as never);

      const orderId = "order_rzp_valid_1";
      const paymentId = "pay_rzp_valid_1";
      const secret = "rzp_test_secret_123";
      const validSignature = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      mockOrdersFetch.mockResolvedValue({
        id: orderId,
        notes: {
          kind: "urpass_autopay_mandate",
          user_id: user.id,
          plan_slug: "starter",
          max_amount: "58882",
          is_free_event_trial: "false",
          company_name: "Summit Events",
          billing_address: "78 MG Road, Bengaluru",
          customer_gstin: "29AAAAA0000A1Z5",
          billing_state: "Karnataka",
          billing_state_code: "29",
        },
      });

      mockPaymentsFetch.mockResolvedValue({
        id: paymentId,
        customer_id: "cust_verify_123",
        status: "captured",
        amount: 3422,
        currency: "INR",
        token_id: "token_recurring_mandate_999",
      });

      const mockUpsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: "sub_db_row_123" }, error: null }),
        }),
      });

      mockedCreateAdminClient.mockReturnValue({
        from: vi.fn((table: string) => {
          if (table === "plans") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: "plan_starter_id", name: "Starter", slug: "starter" },
                  }),
                }),
              }),
            };
          }
          if (table === "subscriptions") {
            return {
              upsert: mockUpsert,
            };
          }
          return {};
        }),
      } as never);

      const { POST } = await import("@/app/api/billing/autopay/mandate/verify/route");
      const req = new NextRequest("http://localhost/api/billing/autopay/mandate/verify", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          paymentId,
          signature: validSignature,
          customerId: "cust_verify_123",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.success).toBe(true);
      expect(data.tokenId).toBe("token_recurring_mandate_999");
      expect(data.redirect).toBe("/dashboard");

      // Verify subscription row updated in database
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: user.id,
          status: "active",
          plan_id: "plan_starter_id",
          provider: "razorpay",
          billing_cycle: "monthly",
          autopay_status: "active",
          autopay_mandate_id: "token_recurring_mandate_999",
          autopay_max_amount_paise: 58882,
          is_trial: false,
          free_event_trial_active: false,
        }),
        expect.anything()
      );

      // Verify tax invoice created for ₹34.22 (₹29 base + ₹5.22 GST)
      expect(mockedCreateInvoice).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          subscriptionId: "sub_db_row_123",
          paymentId,
          baseAmountRupees: 29,
          currency: "INR",
          customerName: "Summit Events",
          customerAddress: "78 MG Road, Bengaluru",
          customerGstin: "29AAAAA0000A1Z5",
          customerState: "Karnataka",
          customerStateCode: "29",
        })
      );
    });
  });
});
