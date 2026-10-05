import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveEventRazorpayCredentials, verifyRazorpaySignature } from "@/lib/razorpay";
import crypto from "crypto";

describe("Event Razorpay Credentials Resolution & Verification", () => {
  const originalKeyId = process.env.RAZORPAY_KEY_ID;
  const originalKeySecret = process.env.RAZORPAY_KEY_SECRET;

  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = "rzp_live_platform_123";
    process.env.RAZORPAY_KEY_SECRET = "platform_secret_abc";
  });

  it("prioritizes organizer user direct gateway credentials from payment_settings", async () => {
    const mockAdmin = {
      from: vi.fn((table: string) => {
        if (table === "payment_settings") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                razorpay_key_id: "rzp_live_isha_organizer_key",
                razorpay_key_secret: "isha_organizer_secret_999",
              },
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        };
      }),
    };

    const creds = await resolveEventRazorpayCredentials(mockAdmin, {
      id: "event_123",
      organizer_id: "organizer_user_isha",
      organization_id: null,
    });

    expect(creds.source).toBe("ORGANIZER");
    expect(creds.keyId).toBe("rzp_live_isha_organizer_key");
    expect(creds.keySecret).toBe("isha_organizer_secret_999");
  });

  it("prioritizes organization gateway credentials from org_payment_settings", async () => {
    const mockAdmin = {
      from: vi.fn((table: string) => {
        if (table === "org_payment_settings") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                razorpay_key_id: "rzp_live_org_key_456",
                razorpay_key_secret: "org_secret_xyz",
              },
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        };
      }),
    };

    const creds = await resolveEventRazorpayCredentials(mockAdmin, {
      id: "event_123",
      organizer_id: "organizer_user_1",
      organization_id: "org_uuid_456",
    });

    expect(creds.source).toBe("ORGANIZATION");
    expect(creds.keyId).toBe("rzp_live_org_key_456");
    expect(creds.keySecret).toBe("org_secret_xyz");
  });

  it("falls back to platform credentials when organizer has not connected custom gateway", async () => {
    const mockAdmin = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      })),
    };

    const creds = await resolveEventRazorpayCredentials(mockAdmin, {
      id: "event_123",
      organizer_id: "organizer_no_gateway",
      organization_id: null,
    });

    expect(creds.source).toBe("PLATFORM");
    expect(creds.keyId).toBe("rzp_live_platform_123");
    expect(creds.keySecret).toBe("platform_secret_abc");
  });

  it("verifies payment signature correctly with the resolved organizer secret", () => {
    const orderId = "order_rzp_test_12345";
    const paymentId = "pay_rzp_test_67890";
    const organizerSecret = "isha_organizer_secret_999";

    const validSignature = crypto
      .createHmac("sha256", organizerSecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const isValid = verifyRazorpaySignature(orderId, paymentId, validSignature, organizerSecret);
    expect(isValid).toBe(true);

    const isInvalid = verifyRazorpaySignature(orderId, paymentId, "forged_signature", organizerSecret);
    expect(isInvalid).toBe(false);
  });
});
