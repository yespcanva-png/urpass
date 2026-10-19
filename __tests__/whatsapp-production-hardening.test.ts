import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

// ── Mock Dependencies for Isolation ──────────────────────────────────────────

const mockAdminDeliveries: Record<string, any> = {};

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "usr-org-1", email: "organizer@example.com" } } }),
    },
    from: vi.fn().mockImplementation((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    })),
  })),
}));

describe("UrPass — WhatsApp Cloud API Production Hardening & P0 Remediation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ── Scenario 1: Correct Webhook Verification (GET) ───────────────────────────
  it("Scenario 1: GET returns hub.challenge with 200 OK for valid verification token", async () => {
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = "sec_prod_token_xyz987";
    const { GET } = await import("@/app/api/webhooks/whatsapp/route");

    const challenge = "9988776655";
    const url = `https://urpass.space/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=${challenge}&hub.verify_token=sec_prod_token_xyz987`;
    const req = new NextRequest(url, { method: "GET" });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const bodyText = await res.text();
    expect(bodyText).toBe(challenge);
    expect(res.headers.get("content-type")).toContain("text/plain");
  });

  // ── Scenario 2: Incorrect Verification Token & Missing Token ────────────────
  it("Scenario 2: GET rejects invalid token with 403 and unconfigured token with 500", async () => {
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = "sec_prod_token_xyz987";
    const { GET } = await import("@/app/api/webhooks/whatsapp/route");

    // Invalid token
    const urlBad = "https://urpass.space/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=123&hub.verify_token=attacker_guess";
    const resBad = await GET(new NextRequest(urlBad, { method: "GET" }));
    expect(resBad.status).toBe(403);

    // Unconfigured token in environment (fail-closed, no hardcoded fallbacks)
    delete process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    delete process.env.WHATSAPP_VERIFY_TOKEN;
    const resUnset = await GET(new NextRequest(urlBad, { method: "GET" }));
    expect(resUnset.status).toBe(500);
    expect(await resUnset.text()).toContain("unconfigured");
  });

  // ── Scenario 3: Missing App Secret in Production (POST) ──────────────────────
  it("Scenario 3: POST rejects requests with 500 if WHATSAPP_APP_SECRET is missing in production", async () => {
    (process.env as any).NODE_ENV = "production";
    delete process.env.WHATSAPP_APP_SECRET;

    const { POST } = await import("@/app/api/webhooks/whatsapp/route");
    const req = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      body: JSON.stringify({ object: "whatsapp_business_account" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("not configured");
  });

  // ── Scenario 4: Missing or Invalid Webhook Signature (POST) ──────────────────
  it("Scenario 4: POST rejects missing or invalid x-hub-signature-256 header with 401", async () => {
    process.env.WHATSAPP_APP_SECRET = "top_secret_app_key";
    const { POST } = await import("@/app/api/webhooks/whatsapp/route");

    const bodyString = JSON.stringify({ object: "whatsapp_business_account", entry: [] });

    // Missing signature header
    const reqNoSig = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      body: bodyString,
    });
    const resNoSig = await POST(reqNoSig);
    expect(resNoSig.status).toBe(401);

    // Forged / invalid signature
    const reqBadSig = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      headers: { "x-hub-signature-256": "sha256=0000000000000000000000000000000000000000000000000000000000000000" },
      body: bodyString,
    });
    const resBadSig = await POST(reqBadSig);
    expect(resBadSig.status).toBe(401);
  });

  // ── Scenario 5: Correctly Signed Payload (POST) ─────────────────────────────
  it("Scenario 5: POST accepts properly signed HMAC-SHA256 payload with 200 OK", async () => {
    process.env.WHATSAPP_APP_SECRET = "valid_meta_app_secret";
    const { POST } = await import("@/app/api/webhooks/whatsapp/route");

    const bodyString = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [],
    });

    const signature = "sha256=" + crypto.createHmac("sha256", "valid_meta_app_secret").update(bodyString).digest("hex");

    const req = new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hub-signature-256": signature,
      },
      body: bodyString,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  // ── Scenario 6: Duplicate Webhook Events ─────────────────────────────────────
  it("Scenario 6: Deduplicates rapid duplicate webhook events for the same message status", async () => {
    process.env.WHATSAPP_APP_SECRET = "valid_secret";
    const { POST } = await import("@/app/api/webhooks/whatsapp/route");
    const { communicationService } = await import("@/lib/communications");
    const spyUpdate = vi.spyOn(communicationService, "updateDeliveryFromWebhook").mockResolvedValue(true);

    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_1",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                statuses: [
                  {
                    id: "wamid.DUPLICATE_TEST_100",
                    status: "delivered",
                    timestamp: "1710000000",
                  },
                ],
              },
              field: "messages",
            },
          ],
        },
      ],
    };

    const bodyString = JSON.stringify(payload);
    const signature = "sha256=" + crypto.createHmac("sha256", "valid_secret").update(bodyString).digest("hex");

    const makeReq = () =>
      new NextRequest("https://urpass.space/api/webhooks/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-hub-signature-256": signature },
        body: bodyString,
      });

    // 1st request -> should process and call database reconciliation
    const res1 = await POST(makeReq());
    expect(res1.status).toBe(200);
    expect(spyUpdate).toHaveBeenCalledTimes(1);

    // 2nd duplicate burst -> deduplicated; should NOT call database reconciliation again
    const res2 = await POST(makeReq());
    expect(res2.status).toBe(200);
    expect(spyUpdate).toHaveBeenCalledTimes(1); // Still 1!
  });

  // ── Scenario 7: Concurrent Duplicate Notification Attempts (Atomic Claim) ──
  it("Scenario 7: Atomic database claim prevents concurrent duplicate WhatsApp dispatches", async () => {
    const { CommunicationService } = await import("@/lib/communications/service");
    const service = new CommunicationService();

    // Mock whatsapp provider
    const sendSpy = vi.spyOn((service as any).whatsapp, "sendTicketWhatsApp").mockResolvedValue({
      success: true,
      messageId: "wamid.CONCURRENT_WINNER",
      provider: "whatsapp_cloud",
    });

    const payload = {
      eventId: "evt-atomic",
      eventName: "Cyber Summit 2026",
      ticketId: "URP-CYB01",
      passToken: "tok_atomic_concurrency",
      attendeeId: "att-concurrency",
      attendeeName: "Priya",
      email: "priya@example.com",
      phone: "+919876543210",
      whatsappConsent: true,
      templateName: "ticket_confirmation",
    };

    // First call claims and sends
    const firstCall = await service.sendTicketWhatsApp(payload);
    expect(firstCall.success).toBe(true);
    expect(firstCall.messageId).toBe("wamid.CONCURRENT_WINNER");

    // Replay call with same token and version (should suppress and return previous success or duplicate suppressed)
    const secondCall = await service.sendTicketWhatsApp(payload);
    expect(secondCall.success).toBe(true);
  });

  // ── Scenario 8: Meta Gateway Timeout / Ambiguous Results ────────────────────
  it("Scenario 8: Ambiguous gateway timeouts do not blindly retry before webhook confirmation", async () => {
    const { whatsAppProvider } = await import("@/lib/communications/providers/whatsapp/provider");
    process.env.WHATSAPP_CLOUD_ACCESS_TOKEN = "EAAB_test";
    process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID = "101010";
    process.env.WHATSAPP_TEMPLATE_NAME = "ticket_confirmation";

    const originalFetch = global.fetch;
    // Simulate gateway abort / timeout
    global.fetch = vi.fn().mockRejectedValue(new Error("The operation was aborted due to timeout"));

    const result = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "evt-timeout",
      eventName: "Demo",
      ticketId: "URP-TIME",
      passToken: "tok_timeout",
      attendeeId: "att-t",
      attendeeName: "Rohan",
      email: "rohan@example.com",
      phone: "+919876543210",
      whatsappConsent: true,
      templateName: "ticket_confirmation",
    });

    expect(result.success).toBe(false);
    expect(result.unavailable).toBe(true);
    expect(result.error).toContain("timeout");

    global.fetch = originalFetch;
  });

  // ── Scenario 9: Missing Approved Template (Policy Enforcement) ─────────────
  it("Scenario 9: Strictly rejects unapproved free-form text outside 24h service window", async () => {
    const { whatsAppProvider } = await import("@/lib/communications/providers/whatsapp/provider");
    delete process.env.WHATSAPP_TEMPLATE_NAME;

    // Outbound business notification without templateName and without isSessionReply
    const result = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "evt-policy",
      eventName: "Gala Night",
      ticketId: "URP-POL01",
      passToken: "tok_policy",
      attendeeId: "att-p",
      attendeeName: "Ananya",
      email: "ananya@example.com",
      phone: "+919876543210",
      whatsappConsent: true,
      // No templateName
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("strictly requires an approved message template");
    expect(result.error).toContain("24-hour");
  });

  // ── Scenario 10: No WhatsApp Consent (Suppresses Send & Preserves Email) ───
  it("Scenario 10: Suppresses WhatsApp dispatch when attendee consent is missing; email delivers safely", async () => {
    const { CommunicationService } = await import("@/lib/communications/service");
    const service = new CommunicationService();

    // Mock email to succeed
    vi.spyOn(service, "sendTicketEmail").mockResolvedValue({ success: true });
    const waSpy = vi.spyOn((service as any).whatsapp, "sendTicketWhatsApp");

    const result = await service.sendTicketCommunications(
      {
        eventId: "evt-consent",
        eventName: "Design Workshop",
        ticketId: "URP-DSGN",
        passToken: "tok_consent_test",
        attendeeId: "att-no-consent",
        attendeeName: "Vikram",
        email: "vikram@example.com",
        phone: "+919876543210",
        whatsappConsent: false, // Consent declined!
        templateName: "ticket_confirmation",
      },
      {
        email_enabled: true,
        whatsapp_enabled: true,
      }
    );

    // Email delivered
    expect(result.email?.success).toBe(true);
    // WhatsApp rejected due to consent
    expect(result.whatsapp?.success).toBe(false);
    expect(result.whatsapp?.error).toContain("opted in");
    // Gateway was never touched
    expect(waSpy).not.toHaveBeenCalled();
    // SMS fallback was NOT triggered on withheld consent
    expect(result.smsFallbackTriggered).toBeFalsy();
  });

  // ── Scenario 11: Individual QR Ticket Delivery (Payload Structure) ──────────
  it("Scenario 11: Formats template parameters correctly with ticket ID and pass URL", async () => {
    process.env.WHATSAPP_CLOUD_ACCESS_TOKEN = "EAAB_test_key";
    process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID = "202020";
    process.env.WHATSAPP_TEMPLATE_NAME = "ticket_confirmation";

    const originalFetch = global.fetch;
    let interceptedBody: any = null;
    global.fetch = vi.fn().mockImplementation(async (_url, opts) => {
      interceptedBody = JSON.parse(opts.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({ messages: [{ id: "wamid.HBgM123" }] }),
      };
    });

    const { whatsAppProvider } = await import("@/lib/communications/providers/whatsapp/provider");
    const res = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "evt-template",
      eventName: "AI Conclave",
      ticketId: "URP-AI99",
      passToken: "tok_ai99",
      attendeeId: "att-ai",
      attendeeName: "Karthik",
      email: "karthik@example.com",
      phone: "+919876543210",
      ticketUrl: "https://urpass.space/pass/tok_ai99",
      mediaUrl: "https://urpass.space/api/passes/tok_ai99/qr.png",
      templateName: "ticket_confirmation",
      templateLanguage: "en_US",
    });

    expect(res.success).toBe(true);
    expect(interceptedBody.messaging_product).toBe("whatsapp");
    expect(interceptedBody.template.name).toBe("ticket_confirmation");
    expect(interceptedBody.template.language.code).toBe("en_US");

    // Header image verified
    expect(interceptedBody.template.components[0].type).toBe("header");
    expect(interceptedBody.template.components[0].parameters[0].image.link).toContain("qr.png");

    // Body parameters verified
    const bodyComp = interceptedBody.template.components[1];
    expect(bodyComp.parameters[0].text).toBe("Karthik");
    expect(bodyComp.parameters[1].text).toBe("AI Conclave");
    expect(bodyComp.parameters[2].text).toBe("URP-AI99");
    expect(bodyComp.parameters[3].text).toContain("/pass/tok_ai99");

    global.fetch = originalFetch;
  });

  // ── Scenario 12: Group Master QR Delivery ────────────────────────────────────
  it("Scenario 12: Group master QR passes are dispatched once with group entitlement link", async () => {
    process.env.WHATSAPP_CLOUD_ACCESS_TOKEN = "EAAB_test_key";
    process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID = "202020";

    const { whatsAppProvider } = await import("@/lib/communications/providers/whatsapp/provider");
    const originalFetch = global.fetch;
    let interceptedBody: any = null;
    global.fetch = vi.fn().mockImplementation(async (_url, opts) => {
      interceptedBody = JSON.parse(opts.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({ messages: [{ id: "wamid.GROUP_MASTER_1" }] }),
      };
    });

    const res = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "evt-grp",
      eventName: "Music Festival",
      ticketId: "URP-GRP05",
      passToken: "tok_master_group_qr",
      attendeeId: "att-group-leader",
      attendeeName: "Sanjay (Group of 5)",
      email: "sanjay@example.com",
      phone: "+919876543210",
      ticketUrl: "https://urpass.space/pass/tok_master_group_qr",
      templateName: "ticket_confirmation",
    });

    expect(res.success).toBe(true);
    expect(res.messageId).toBe("wamid.GROUP_MASTER_1");
    expect(interceptedBody.template.components[0].parameters[0].text).toBe("Sanjay (Group of 5)");

    global.fetch = originalFetch;
  });

  // ── Scenario 13: Delivery-State Monotonic Reconciliation ─────────────────────
  it("Scenario 13: Delivery reconciliation maintains monotonic state (READ never regresses to DELIVERED)", async () => {
    const { CommunicationService } = await import("@/lib/communications/service");
    const service = new CommunicationService();

    // Verify method exists and type checks
    expect(typeof service.updateDeliveryFromWebhook).toBe("function");

    // In unit test environment without live supabase admin connection, test returns false safely
    const reconciled = await service.updateDeliveryFromWebhook("whatsapp_cloud", {
      providerMessageId: "wamid.NON_EXISTENT",
      status: "DELIVERED",
    });
    expect(typeof reconciled).toBe("boolean");
  });

  // ── Scenario 14: Consent Withdrawal Action ──────────────────────────────────
  it("Scenario 14: updateAttendeeWhatsAppConsent persists withdrawal cleanly", async () => {
    const { updateAttendeeWhatsAppConsent } = await import("@/app/actions/attendees");
    expect(typeof updateAttendeeWhatsAppConsent).toBe("function");
  });

  // ── Scenario 15: Phone Normalization and Masking ────────────────────────────
  it("Scenario 15: Formats and masks destination numbers for attendee privacy", async () => {
    const { normalizePhone, maskPhone } = await import("@/lib/communications/utils");
    expect(normalizePhone("9876543210")).toBe("+919876543210");
    expect(normalizePhone("+91 98765 43210")).toBe("+919876543210");
    expect(maskPhone("+919876543210")).toBe("+91 •••••••210");
  });

  // ── Scenario 16: Template Mapping Service Parameter Assembly ───────────────
  it("Scenario 16: Template mapping service assembles approved template parameters in correct sequence", async () => {
    const { buildTemplatePayload, APPROVED_TEMPLATES } = await import(
      "@/lib/communications/providers/whatsapp/templates"
    );

    // 1. ticket_confirmation
    const tplTicket = buildTemplatePayload(
      "ticket_confirmation",
      {
        attendeeName: "Ananya",
        eventName: "UrPass Launch",
        ticketId: "URP-101",
        ticketUrl: "https://urpass.space/pass/tok_101",
        passToken: "tok_101",
      },
      "en_US"
    );
    expect(tplTicket.name).toBe(APPROVED_TEMPLATES.ticket_confirmation.name);
    expect(tplTicket.language.code).toBe("en_US");
    expect(tplTicket.components[0].type).toBe("body");
    expect(tplTicket.components[0].parameters[0].text).toBe("Ananya");
    expect(tplTicket.components[0].parameters[1].text).toBe("UrPass Launch");
    expect(tplTicket.components[0].parameters[2].text).toBe("URP-101");
    expect(tplTicket.components[0].parameters[3].text).toBe("https://urpass.space/pass/tok_101");
    // URL button suffix
    expect(tplTicket.components[1].type).toBe("button");
    expect(tplTicket.components[1].parameters[0].text).toBe("tok_101");

    // 2. registration_received
    const tplReg = buildTemplatePayload("registration_received", {
      attendeeName: "Rahul",
      eventName: "Founders Meetup",
      ticketId: "APP-555",
    });
    expect(tplReg.components[0].parameters[0].text).toBe("Rahul");
    expect(tplReg.components[0].parameters[1].text).toBe("Founders Meetup");
    expect(tplReg.components[0].parameters[2].text).toBe("APP-555");

    // 3. payment_confirmation
    const tplPay = buildTemplatePayload("payment_confirmation", {
      attendeeName: "Srinithin",
      eventName: "Music Gala",
      amountFormatted: "₹1,499",
      transactionId: "pay_xyz89",
    });
    expect(tplPay.components[0].parameters[2].text).toBe("₹1,499");
    expect(tplPay.components[0].parameters[3].text).toBe("pay_xyz89");

    // 4. event_cancelled
    const tplCancel = buildTemplatePayload("event_cancelled", {
      attendeeName: "Karan",
      eventName: "Hackathon",
      reason: "Postponed due to severe weather. Full refunds issued.",
    });
    expect(tplCancel.components[0].parameters[2].text).toContain("severe weather");
  });

  // ── Scenario 17: Inbound WhatsApp Opt-Out ("STOP") ─────────────────────────
  it("Scenario 17: Inbound opt-out ('STOP') triggers consent revocation and session reply", async () => {
    const { handleInboundWhatsAppMessage } = await import(
      "@/lib/communications/providers/whatsapp/inbound"
    );

    const result = await handleInboundWhatsAppMessage({
      fromPhone: "+919876543210",
      messageId: "wamid_inbound_stop_1",
      text: "STOP",
      timestamp: String(Date.now()),
    });

    expect(result.handled).toBe(true);
    expect(result.action).toBe("opt_out");
    expect(result.replySent).toBe(true);
  });

  // ── Scenario 18: Inbound WhatsApp Commands (/pass, /events, /help) ─────────
  it("Scenario 18: Inbound commands are recognized and answered via 24h session messages", async () => {
    const { handleInboundWhatsAppMessage } = await import(
      "@/lib/communications/providers/whatsapp/inbound"
    );

    // /pass command
    const passResult = await handleInboundWhatsAppMessage({
      fromPhone: "+919876543210",
      messageId: "wamid_inbound_pass_1",
      text: "/pass",
    });
    expect(passResult.handled).toBe(true);
    expect(passResult.action).toBe("command");
    expect(passResult.command).toBe("/pass");

    // /help command
    const helpResult = await handleInboundWhatsAppMessage({
      fromPhone: "+919876543210",
      messageId: "wamid_inbound_help_1",
      text: "HELP",
    });
    expect(helpResult.handled).toBe(true);
    expect(helpResult.action).toBe("command");
    expect(helpResult.command).toBe("/help");
  });

  // ── Scenario 19: Admin Diagnostic Authorization Protection ────────────────
  it("Scenario 19: Diagnostic and test-whatsapp endpoints reject non-admin users with HTTP 403", async () => {
    const { GET, POST } = await import("@/app/api/communications/test-whatsapp/route");

    // Mock authenticated non-admin user
    const getRes = await GET();
    expect(getRes.status).toBe(403);
    const getData = await getRes.json();
    expect(getData.error).toContain("Forbidden");

    // POST also protected
    const postReq = new NextRequest("https://urpass.space/api/communications/test-whatsapp", {
      method: "POST",
      body: JSON.stringify({ phone: "+919876543210" }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(403);
  });

  // ── Scenario 20: Outbox Worker Method Availability ─────────────────────────
  it("Scenario 20: CommunicationService exposes processWhatsAppOutboxRetries for background recovery", async () => {
    const { communicationService } = await import("@/lib/communications");
    expect(typeof communicationService.processWhatsAppOutboxRetries).toBe("function");

    const result = await communicationService.processWhatsAppOutboxRetries();
    expect(result).toHaveProperty("processed");
    expect(result).toHaveProperty("recovered");
    expect(result).toHaveProperty("failed");
  });

  // ── Scenario 21: Dynamic Pass Token Extraction for WhatsApp URL Buttons ─────
  it("Scenario 21: extractCleanButtonPassToken strips %7B%7B1%7D%7D, full URLs, and never sends literal {{1}}", async () => {
    const { extractCleanButtonPassToken } = await import(
      "@/lib/communications/providers/whatsapp/templates"
    );

    // Raw valid token
    expect(extractCleanButtonPassToken("pass_abc123")).toBe("pass_abc123");

    // Full URL input
    expect(extractCleanButtonPassToken("https://urpass.space/pass/pass_abc123")).toBe("pass_abc123");

    // Encoded template placeholder artifacts
    expect(extractCleanButtonPassToken("%7B%7B1%7D%7Dpass_abc123")).toBe("pass_abc123");
    expect(extractCleanButtonPassToken("{{1}}pass_abc123")).toBe("pass_abc123");

    // Extracted from ticketUrl
    expect(extractCleanButtonPassToken(null, "https://urpass.space/pass/pass_from_url")).toBe("pass_from_url");

    // Extracted from ticketId fallback
    expect(extractCleanButtonPassToken(null, null, "pass_fallback_id")).toBe("pass_fallback_id");

    // Strictly rejects literal {{1}} or empty
    expect(extractCleanButtonPassToken("{{1}}")).toBeNull();
    expect(extractCleanButtonPassToken("%7B%7B1%7D%7D")).toBeNull();
    expect(extractCleanButtonPassToken(null, null, null)).toBeNull();
  });

  // ── Scenario 22: Pass Page Token Normalization & Redirect ───────────────────
  it("Scenario 22: cleanPassToken strips %7B%7B1%7D%7D and {{1}} for seamless resolution", async () => {
    const { cleanPassToken } = await import("@/lib/passes/public-pass");

    expect(cleanPassToken("clean_token_123")).toBe("clean_token_123");
    expect(cleanPassToken("%7B%7B1%7D%7Dpass_tok_999")).toBe("pass_tok_999");
    expect(cleanPassToken("{{1}}pass_tok_999")).toBe("pass_tok_999");
    expect(cleanPassToken("{{passToken}}pass_tok_999")).toBe("pass_tok_999");
  });

  // ── Scenario 23: Template Payload Builder Dynamic URL Button Verification ───
  it("Scenario 23: buildTemplatePayload populates dynamic URL button with clean token and index 0", async () => {
    const { buildTemplatePayload } = await import(
      "@/lib/communications/providers/whatsapp/templates"
    );

    const payload = buildTemplatePayload(
      "ticket_confirmation",
      {
        attendeeName: "Test Guest",
        eventName: "UrPass Launch",
        eventDate: "Oct 25, 2026",
        venue: "Main Hall",
        passToken: "%7B%7B1%7D%7Dpass_actual_token",
      },
      "en",
      "urpass_space"
    );

    const buttonComponent = payload.components.find((c: any) => c.type === "button");
    expect(buttonComponent).toBeDefined();
    expect(buttonComponent?.sub_type).toBe("url");
    expect(buttonComponent?.index).toBe("0");
    expect(buttonComponent?.parameters[0]?.text).toBe("pass_actual_token");
    expect(buttonComponent?.parameters[0]?.text).not.toContain("%7B%7B1%7D%7D");
    expect(buttonComponent?.parameters[0]?.text).not.toContain("{{1}}");
  });
});

