import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = {
        send: mockSend,
      };
    },
  };
});

import {
  notifyOwnerPaymentAttempt,
  notifyOwnerPaidSubscription,
  notifyOwnerTrialActivated,
  notifyOwnerNewUser,
  getOwnerEmail,
} from "@/lib/email";
import { GET as getGeo } from "@/app/api/geo/route";
import { NextRequest } from "next/server";

describe("Email Notifications to Owner (srinithin@yespstudio.com)", () => {
  const originalEnvKey = process.env.RESEND_API_KEY;

  beforeEach(() => {
    mockSend.mockClear();
    process.env.RESEND_API_KEY = "re_valid_test_key_12345";
    mockSend.mockResolvedValue({ data: { id: "resend_test_123" }, error: null });
  });

  afterEach(() => {
    if (originalEnvKey !== undefined) {
      process.env.RESEND_API_KEY = originalEnvKey;
    } else {
      delete process.env.RESEND_API_KEY;
    }
  });

  it("getOwnerEmail: returns srinithin@yespstudio.com as designated recipient", () => {
    expect(getOwnerEmail()).toBe("srinithin@yespstudio.com");
  });

  it("notifyOwnerPaymentAttempt: sends payment checkout attempt notification to owner", async () => {
    await notifyOwnerPaymentAttempt({
      kind: "subscription",
      buyerName: "Rahul Sharma",
      buyerEmail: "rahul@example.com",
      itemName: "Pro Plan (monthly) [INR]",
      amountPaise: 117882, // ₹1,178.82
      orderId: "order_12345",
      currency: "INR",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArg = mockSend.mock.calls[0][0];
    expect(callArg.to).toBe("srinithin@yespstudio.com");
    expect(callArg.subject).toContain("Payment Started: Pro Plan (monthly) [INR]");
    expect(callArg.subject).toContain("rahul@example.com");
    expect(callArg.html).toContain("Rahul Sharma");
    expect(callArg.html).toContain("rahul@example.com");
    expect(callArg.html).toContain("order_12345");
  });

  it("notifyOwnerPaidSubscription: sends payment confirmed notification to owner with currency support", async () => {
    await notifyOwnerPaidSubscription({
      buyerName: "Sarah Jenkins",
      buyerEmail: "sarah@ukevents.co.uk",
      planName: "Pro Plan (UK)",
      billingCycle: "monthly",
      amountPaise: 4200, // £42.00
      paymentId: "pay_uk_999",
      orderId: "order_uk_999",
      currency: "GBP",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArg = mockSend.mock.calls[0][0];
    expect(callArg.to).toBe("srinithin@yespstudio.com");
    expect(callArg.subject).toContain("URPASS Paid Subscription");
    expect(callArg.subject).toContain("Pro Plan (UK)");
    expect(callArg.subject).toContain("£42.00");
    expect(callArg.html).toContain("Sarah Jenkins");
    expect(callArg.html).toContain("sarah@ukevents.co.uk");
    expect(callArg.html).toContain("pay_uk_999");
  });

  it("notifyOwnerTrialActivated: sends free trial activation notification to owner", async () => {
    await notifyOwnerTrialActivated({
      buyerName: "Priya Nair",
      buyerEmail: "priya@techfest.in",
      planName: "Business Plan",
      billingInterval: "monthly",
      futurePricePaise: 249900,
      trialEndsAt: "30 October 2026",
      currency: "INR",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArg = mockSend.mock.calls[0][0];
    expect(callArg.to).toBe("srinithin@yespstudio.com");
    expect(callArg.subject).toContain("URPASS 30-Day Free Trial Activated: Business Plan");
    expect(callArg.subject).toContain("priya@techfest.in");
    expect(callArg.html).toContain("30-Day Free Trial Started");
    expect(callArg.html).toContain("Priya Nair");
    expect(callArg.html).toContain("30 October 2026");
  });

  it("notifyOwnerNewUser: sends signup notification to owner on registration", async () => {
    await notifyOwnerNewUser({
      name: "David Miller",
      email: "david@londontech.org",
      provider: "email",
      userId: "user_uuid_777",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArg = mockSend.mock.calls[0][0];
    expect(callArg.to).toBe("srinithin@yespstudio.com");
    expect(callArg.subject).toContain("[URPASS] New User Signup: david@londontech.org");
    expect(callArg.html).toContain("David Miller");
    expect(callArg.html).toContain("EMAIL");
    expect(callArg.html).toContain("user_uuid_777");
  });
});

describe("/api/geo & Region IP Currency Detection", () => {
  it("detects UK from x-vercel-ip-country header and returns GBP (£)", async () => {
    const req = new NextRequest("http://localhost:3000/api/geo", {
      headers: {
        "x-vercel-ip-country": "GB",
      },
    });

    const res = await getGeo(req);
    const data = await res.json();
    expect(data.country).toBe("GB");
    expect(data.currency).toBe("GBP");
    expect(data.currencySymbol).toBe("£");
    expect(data.isUk).toBe(true);
    expect(data.isIndia).toBe(false);
  });

  it("detects India from x-vercel-ip-country header and returns INR (₹)", async () => {
    const req = new NextRequest("http://localhost:3000/api/geo", {
      headers: {
        "x-vercel-ip-country": "IN",
      },
    });

    const res = await getGeo(req);
    const data = await res.json();
    expect(data.country).toBe("IN");
    expect(data.currency).toBe("INR");
    expect(data.currencySymbol).toBe("₹");
    expect(data.isUk).toBe(false);
    expect(data.isIndia).toBe(true);
  });

  it("detects UK from /uk pathname header and returns GBP", async () => {
    const req = new NextRequest("http://localhost:3000/api/geo", {
      headers: {
        "x-invoke-path": "/uk/pricing",
      },
    });

    const res = await getGeo(req);
    const data = await res.json();
    expect(data.country).toBe("GB");
    expect(data.currency).toBe("GBP");
  });
});
