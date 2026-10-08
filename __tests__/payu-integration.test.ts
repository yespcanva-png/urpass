import { describe, it, expect, vi } from "vitest";
import {
  generatePayUHash,
  verifyPayUResponseHash,
  getPayUEndpoint,
  buildPayUPaymentParams,
  type PayUResponsePayload,
} from "@/lib/payments/payu";
import { getPaymentProvider, PayUAdapter } from "@/lib/payments/providers";
import { testPayUCredentials } from "@/app/actions/payu-settings";

describe("PayU Payment Gateway Integration", () => {
  const mockKey = "mock_merchant_key_123";
  const mockSalt = "mock_merchant_salt_456";

  describe("SHA-512 Hash Generation and Verification", () => {
    it("generates 128-character hex SHA-512 request hash", () => {
      const hash = generatePayUHash({
        merchantKey: mockKey,
        merchantSalt: mockSalt,
        txnid: "txn_987654321",
        amount: 499.0,
        productinfo: "Conference VIP Pass",
        firstname: "John",
        email: "john@example.com",
        udf1: "event_123",
      });

      expect(hash).toBeDefined();
      expect(hash).toHaveLength(128); // 512 bits / 4 = 128 hex chars
      expect(/^[0-9a-f]{128}$/.test(hash)).toBe(true);
    });

    it("verifies matching reverse response hash successfully", () => {
      const txnid = "txn_987654321";
      const amount = "499.00";
      const status = "success";
      const productinfo = "Conference VIP Pass";
      const firstname = "John";
      const email = "john@example.com";
      const udf1 = "event_123";

      // Compute expected reverse hash:
      // sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
      const crypto = require("node:crypto");
      const reverseString = [
        mockSalt,
        status,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        udf1,
        email,
        firstname,
        productinfo,
        amount,
        txnid,
        mockKey,
      ].join("|");
      const computedHash = crypto.createHash("sha512").update(reverseString).digest("hex").toLowerCase();

      const payload: PayUResponsePayload = {
        key: mockKey,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        status,
        hash: computedHash,
        udf1,
      };

      const isValid = verifyPayUResponseHash(payload, mockSalt);
      expect(isValid).toBe(true);
    });

    it("rejects response hash if amount was tampered", () => {
      const payload: PayUResponsePayload = {
        key: mockKey,
        txnid: "txn_123",
        amount: "100.00",
        productinfo: "Pass",
        firstname: "Alice",
        email: "alice@example.com",
        status: "success",
        hash: "invalid_hash_attempt",
      };

      const isValid = verifyPayUResponseHash(payload, mockSalt);
      expect(isValid).toBe(false);
    });
  });

  describe("PayU Endpoints & Parameter Builder", () => {
    it("returns correct production and sandbox endpoints", () => {
      expect(getPayUEndpoint("production")).toBe("https://secure.payu.in/_payment");
      expect(getPayUEndpoint("sandbox")).toBe("https://test.payu.in/_payment");
    });

    it("builds complete form submission fields", () => {
      const params = buildPayUPaymentParams({
        merchantKey: mockKey,
        merchantSalt: mockSalt,
        environment: "sandbox",
        txnid: "txn_sample_1",
        amount: "250.00",
        productinfo: "Workshop Entry",
        firstname: "Bob",
        email: "bob@example.com",
        phone: "9876543210",
        surl: "https://urpass.space/api/payu/verify",
        furl: "https://urpass.space/api/payu/verify",
      });

      expect(params.actionUrl).toBe("https://test.payu.in/_payment");
      expect(params.fields.key).toBe(mockKey);
      expect(params.fields.txnid).toBe("txn_sample_1");
      expect(params.fields.amount).toBe("250.00");
      expect(params.fields.hash).toHaveLength(128);
      expect(params.fields.surl).toBe("https://urpass.space/api/payu/verify");
    });
  });

  describe("PayU Provider Adapter", () => {
    it("returns PayUAdapter instance from getPaymentProvider('PAYU')", () => {
      const provider = getPaymentProvider("PAYU");
      expect(provider).toBeInstanceOf(PayUAdapter);
      expect(provider.providerName).toBe("PAYU");
    });

    it("normalizes PayU webhook event payload", () => {
      const adapter = new PayUAdapter();
      const normalized = adapter.normalizeWebhookEvent({
        status: "success",
        txnid: "payu_txn_100",
        mihpayid: "mih_9999",
        amount: "500.00",
        mode: "UPI",
      });

      expect(normalized).toBeDefined();
      expect(normalized?.eventType).toBe("PAYMENT_CAPTURED");
      expect(normalized?.provider).toBe("PAYU");
      expect(normalized?.providerOrderId).toBe("payu_txn_100");
      expect(normalized?.providerPaymentId).toBe("mih_9999");
      expect(normalized?.amount).toBe(500);
      expect(normalized?.paymentMethod).toBe("UPI");
    });
  });

  describe("testPayUCredentials Action", () => {
    it("verifies valid key and salt credentials", async () => {
      const res = await testPayUCredentials(mockKey, mockSalt);
      expect(res.success).toBe(true);
      expect(res.message).toContain("cryptographic verification passed");
    });

    it("rejects empty key or salt", async () => {
      const res = await testPayUCredentials("", "");
      expect(res.success).toBe(false);
      expect(res.message).toContain("required");
    });
  });
});
