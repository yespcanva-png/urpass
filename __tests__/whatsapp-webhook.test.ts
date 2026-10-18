import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

vi.mock("@/lib/communications", () => ({
  communicationService: {
    updateDeliveryFromWebhook: vi.fn().mockResolvedValue(true),
    sendTicketWhatsApp: vi.fn().mockResolvedValue({ success: true, messageId: "wamid_123", provider: "whatsapp_cloud" }),
  },
}));

describe("WhatsApp Webhook Endpoint (app/api/webhooks/whatsapp/route.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = "test_verify_token_12345";
  });

  it("verifies Meta webhook challenge successfully via GET", async () => {
    const { GET } = await import("@/app/api/webhooks/whatsapp/route");
    const challenge = "1158201444";
    const url = `https://urpass.space/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=${challenge}&hub.verify_token=test_verify_token_12345`;
    const req = new NextRequest(url, { method: "GET" });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const bodyText = await res.text();
    expect(bodyText).toBe(challenge);
    expect(res.headers.get("content-type")).toContain("text/plain");
  });

  it("rejects Meta webhook verification if token does not match", async () => {
    const { GET } = await import("@/app/api/webhooks/whatsapp/route");
    const url = "https://urpass.space/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=1158201444&hub.verify_token=wrong_token";
    const req = new NextRequest(url, { method: "GET" });

    const res = await GET(req);
    expect(res.status).toBe(403);
    const text = await res.text();
    expect(text).toContain("Forbidden");
  });

  it("rejects Meta webhook verification if hub.mode is not subscribe", async () => {
    const { GET } = await import("@/app/api/webhooks/whatsapp/route");
    const url = "https://urpass.space/api/webhooks/whatsapp?hub.mode=publish&hub.challenge=1158201444&hub.verify_token=test_verify_token_12345";
    const req = new NextRequest(url, { method: "GET" });

    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("processes delivery status receipt (delivered) via POST", async () => {
    const { POST } = await import("@/app/api/webhooks/whatsapp/route");
    const { communicationService } = await import("@/lib/communications");

    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_123456",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "+15550269414",
                  phone_number_id: "PHONE_ID_123",
                },
                statuses: [
                  {
                    id: "wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSQURCRjM3Mzg5QUY3REQzODAxAA==",
                    status: "delivered",
                    timestamp: "1710000000",
                    recipient_id: "919876543210",
                  },
                ],
              },
              field: "messages",
            },
          ],
        },
      ],
    };

    const req = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    expect(communicationService.updateDeliveryFromWebhook).toHaveBeenCalledWith(
      "whatsapp_cloud",
      expect.objectContaining({
        providerMessageId: "wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSQURCRjM3Mzg5QUY3REQzODAxAA==",
        status: "DELIVERED",
      })
    );
  });

  it("processes delivery failure receipt with error details via POST", async () => {
    const { POST } = await import("@/app/api/webhooks/whatsapp/route");
    const { communicationService } = await import("@/lib/communications");

    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_123456",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: { phone_number_id: "PHONE_ID_123" },
                statuses: [
                  {
                    id: "wamid.FAIL_123",
                    status: "failed",
                    timestamp: "1710000050",
                    recipient_id: "919876543210",
                    errors: [
                      {
                        code: 131026,
                        title: "Message undeliverable",
                        details: "Recipient is not registered on WhatsApp",
                      },
                    ],
                  },
                ],
              },
              field: "messages",
            },
          ],
        },
      ],
    };

    const req = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(communicationService.updateDeliveryFromWebhook).toHaveBeenCalledWith(
      "whatsapp_cloud",
      expect.objectContaining({
        providerMessageId: "wamid.FAIL_123",
        status: "FAILED",
        failureReason: "Recipient is not registered on WhatsApp",
      })
    );
  });

  it("validates x-hub-signature-256 when WHATSAPP_APP_SECRET is set", async () => {
    process.env.WHATSAPP_APP_SECRET = "my_meta_app_secret";
    const { POST } = await import("@/app/api/webhooks/whatsapp/route");

    const bodyString = JSON.stringify({ object: "whatsapp_business_account", entry: [] });
    const hmac = crypto.createHmac("sha256", "my_meta_app_secret").update(bodyString).digest("hex");
    const validSignature = `sha256=${hmac}`;

    const validReq = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hub-signature-256": validSignature,
      },
      body: bodyString,
    });

    const validRes = await POST(validReq);
    expect(validRes.status).toBe(200);

    // Invalid signature should be rejected with 401
    const invalidReq = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hub-signature-256": "sha256=invalid_hash",
      },
      body: bodyString,
    });

    const invalidRes = await POST(invalidReq);
    expect(invalidRes.status).toBe(401);
  });
});

describe("Direct Meta WhatsApp Cloud Provider (lib/communications/providers/whatsapp/provider.ts)", () => {
  it("sends ticket via Meta Graph API when credentials are provided", async () => {
    process.env.WHATSAPP_CLOUD_ACCESS_TOKEN = "EAAB_test_token";
    process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID = "10987654321";
    process.env.WHATSAPP_TEMPLATE_NAME = "ticket_confirmation";

    const originalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        messaging_product: "whatsapp",
        contacts: [{ input: "919876543210", wa_id: "919876543210" }],
        messages: [{ id: "wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgS" }],
      }),
    });
    global.fetch = fetchMock;

    const { whatsAppProvider } = await import("@/lib/communications/providers/whatsapp/provider");

    const result = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "evt-123",
      eventName: "UrPass Demo",
      ticketId: "URP-777",
      passToken: "tok_777",
      attendeeId: "att-777",
      attendeeName: "Rahul",
      email: "rahul@example.com",
      phone: "+919876543210",
      ticketUrl: "https://urpass.space/pass/tok_777",
    });

    expect(result.success).toBe(true);
    expect(result.provider).toBe("whatsapp_cloud");
    expect(result.messageId).toBe("wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgS");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("https://graph.facebook.com/v21.0/10987654321/messages"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer EAAB_test_token",
        }),
      })
    );

    global.fetch = originalFetch;
  });

  it("parses Meta Graph API error details on failure", async () => {
    process.env.WHATSAPP_CLOUD_ACCESS_TOKEN = "EAAB_test_token";
    process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID = "10987654321";
    process.env.WHATSAPP_TEMPLATE_NAME = "ticket_confirmation";

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: {
          message: "(#131030) Recipient phone number not in allowed list",
          type: "OAuthException",
          code: 131030,
          error_data: {
            messaging_product: "whatsapp",
            details: "Recipient phone number not in allowed list: Add recipient phone number to recipient list and try again.",
          },
        },
      }),
    });

    const { whatsAppProvider } = await import("@/lib/communications/providers/whatsapp/provider");

    const result = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "evt-123",
      eventName: "UrPass Demo",
      ticketId: "URP-777",
      passToken: "tok_777",
      attendeeId: "att-777",
      attendeeName: "Rahul",
      email: "rahul@example.com",
      phone: "+919876543210",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Recipient phone number not in allowed list");
    expect(result.error).toContain("[Code 131030]");

    global.fetch = originalFetch;
  });
});
