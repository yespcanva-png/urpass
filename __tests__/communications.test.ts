import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  normalizePhone,
  isValidE164,
  maskPhone,
  formatTicketId,
  buildTicketUrl,
  buildTicketSmsText,
  generateIdempotencyKey,
} from "@/lib/communications/utils";
import { MockSMSProvider } from "@/lib/communications/providers/sms/mock";
import { GenericDLTSMSProvider } from "@/lib/communications/providers/sms/generic";
import { CommunicationService } from "@/lib/communications/service";

vi.mock("@/lib/email", () => ({
  sendPassEmail: vi.fn().mockResolvedValue(undefined),
}));

// ── Phone number and utility unit tests ─────────────────────────────────────

describe("Communication Utils", () => {
  it("normalizes Indian 10-digit mobile numbers to E.164 with +91", () => {
    expect(normalizePhone("9876543210")).toBe("+919876543210");
    expect(normalizePhone("09876543210")).toBe("+919876543210");
    expect(normalizePhone("919876543210")).toBe("+919876543210");
    expect(normalizePhone("+91 98765-43210")).toBe("+919876543210");
  });

  it("validates standard E.164 formatted numbers", () => {
    expect(isValidE164("+919876543210")).toBe(true);
    expect(isValidE164("+14155552671")).toBe(true);
    expect(isValidE164("9876543210")).toBe(false);
    expect(isValidE164("invalid")).toBe(false);
  });

  it("masks phone numbers properly for organizer privacy", () => {
    expect(maskPhone("+919876543210")).toBe("+91 •••••••210");
    expect(maskPhone("9876543210")).toBe("+91 •••••••210");
    expect(maskPhone(null)).toBe("—");
  });

  it("formats ticket IDs and URLs deterministically", () => {
    const token = "a1b2c3d4e5f6";
    expect(formatTicketId(token)).toBe("URP-A1B2C3");
    expect(buildTicketUrl(token)).toContain(`/pass/${token}`);
  });

  it("formats standard DLT transactional ticket confirmation text", () => {
    const text = buildTicketSmsText("Tech Fest 2026", "URP-84721", "https://urpass.space/pass/xyz");
    expect(text).toContain("URPASS: Your ticket for Tech Fest 2026 is confirmed.");
    expect(text).toContain("Ticket: URP-84721");
    expect(text).toContain("View ticket: https://urpass.space/pass/xyz");
  });

  it("generates unique idempotency keys per channel and version", () => {
    const key1 = generateIdempotencyKey("pass_123", "SMS", "v1");
    const key2 = generateIdempotencyKey("pass_123", "EMAIL", "v1");
    expect(key1).toBe("pass_123_SMS_v1");
    expect(key2).toBe("pass_123_EMAIL_v1");
  });
});

// ── SMS Provider unit tests ──────────────────────────────────────────────────

describe("MockSMSProvider", () => {
  let provider: MockSMSProvider;

  beforeEach(() => {
    provider = new MockSMSProvider();
    provider.clear();
  });

  it("sends SMS successfully for valid E.164 destination", async () => {
    const res = await provider.send({
      to: "+919876543210",
      body: "Test ticket confirmation",
    });

    expect(res.success).toBe(true);
    expect(res.status).toBe("SENT");
    expect(res.messageId).toMatch(/^mock_sms_/);
    expect(provider.getSentMessages()).toHaveLength(1);
    expect(provider.getSentMessages()[0].to).toBe("+919876543210");
  });

  it("fails immediately when phone number is not valid E.164", async () => {
    const res = await provider.send({
      to: "9876543210", // Missing +
      body: "Test ticket confirmation",
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe("FAILED");
    expect(res.errorCode).toBe("INVALID_PHONE_NUMBER");
  });

  it("simulates temporary delivery failure", async () => {
    provider.setFailNext("Network timeout from gateway");
    const res = await provider.send({
      to: "+919876543210",
      body: "Test ticket confirmation",
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe("FAILED");
    expect(res.error).toBe("Network timeout from gateway");

    // Next request should succeed
    const res2 = await provider.send({
      to: "+919876543210",
      body: "Retry ticket confirmation",
    });
    expect(res2.success).toBe(true);
  });
});

// ── CommunicationService & Fallback Rules ────────────────────────────────────

describe("CommunicationService Orchestration", () => {
  let service: CommunicationService;

  beforeEach(() => {
    service = new CommunicationService();
  });

  it("sendTicketSMS returns validation error for missing or malformed phone", async () => {
    const res = await service.sendTicketSMS({
      eventId: "evt-1",
      eventName: "Demo",
      ticketId: "URP-12345",
      passToken: "tok-123",
      attendeeId: "att-1",
      attendeeName: "Alice",
      email: "alice@example.com",
      phone: "invalid-phone",
    });

    expect(res.success).toBe(false);
    expect(res.errorCode).toBe("INVALID_PHONE_NUMBER");
  });

  it("dispatches SMS when direct SMS channel is enabled", async () => {
    const res = await service.sendTicketCommunications(
      {
        eventId: "evt-1",
        eventName: "Annual Gala",
        ticketId: "URP-GALA01",
        passToken: "gala_token_123",
        attendeeId: "att-1",
        attendeeName: "Bob",
        email: "bob@example.com",
        phone: "+919876543210",
      },
      {
        email_enabled: true,
        whatsapp_enabled: false,
        sms_enabled: true,
      }
    );

    expect(res.sms).toBeDefined();
    expect(res.sms?.success).toBe(true);
    expect(res.smsFallbackTriggered).toBeFalsy();
  });

  it("triggers SMS fallback when WhatsApp is unavailable or fails", async () => {
    // Force whatsapp to fail
    const { whatsAppProvider } = await import("@/lib/communications/providers/whatsapp/provider");
    whatsAppProvider.setSimulateFailure(true);

    const res = await service.sendTicketCommunications(
      {
        eventId: "evt-1",
        eventName: "Annual Gala",
        ticketId: "URP-GALA01",
        passToken: "gala_token_fallback",
        attendeeId: "att-2",
        attendeeName: "Charlie",
        email: "charlie@example.com",
        phone: "+919876543210",
      },
      {
        email_enabled: false,
        whatsapp_enabled: true,
        sms_enabled: false,
        sms_fallback_enabled: true,
      }
    );

    expect(res.whatsapp?.success).toBe(false);
    expect(res.smsFallbackTriggered).toBe(true);
    expect(res.sms?.success).toBe(true);

    whatsAppProvider.setSimulateFailure(false);
  });
});
