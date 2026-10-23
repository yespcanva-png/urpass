import { afterEach, describe, expect, it, vi } from "vitest";
import { buildTemplatePayload, normalizeTemplateLanguage } from "@/lib/communications/providers/whatsapp/templates";
import { explainWhatsAppFailure } from "@/lib/communications/whatsapp-errors";
import { WhatsAppProvider } from "@/lib/communications/providers/whatsapp/provider";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Custom WhatsApp template translations", () => {
  it("explains Meta marketing restrictions for current and older receipts", () => {
    expect(explainWhatsAppFailure("Rejected", "131049")).toContain("Meta declined this marketing message");
    expect(explainWhatsAppFailure("This message was not delivered to maintain healthy ecosystem engagement.")).toContain("Immediate retries may also fail");
    expect(explainWhatsAppFailure("Invalid translation", "132001")).toContain("132001");
  });

  it("preserves English separately from English US", () => {
    expect(normalizeTemplateLanguage("en", "custom_invitation")).toBe("en");
    expect(normalizeTemplateLanguage("en_US", "custom_invitation")).toBe("en_US");
  });

  it("uses the verified nivi translation despite a stale US language setting", () => {
    expect(normalizeTemplateLanguage("en_US", "nivi")).toBe("en");
    expect(normalizeTemplateLanguage("en_US", "nivi1")).toBe("en");
  });

  it("sends nivi1's four body variables and required dynamic URL button", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "test-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ messages: [{ id: "test-message" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await new WhatsAppProvider().sendTicketWhatsApp({
      eventId: "event-1", eventName: "Festivals for Joy", eventDate: "2026-10-24",
      eventTime: "11:00 AM", venue: "D-1 Prathapaparudra, Jubilee Hills",
      attendeeId: "attendee-1", attendeeName: "Guest Name", email: "guest@example.com",
      phone: "+919876543210", ticketId: "URP-TEST", passToken: "token123",
      templateName: "nivi1", templateLanguage: "en",
    });
    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.template.components).toContainEqual({
      type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: "token123" }],
    });
    expect(sent.template).toEqual({
      name: "nivi1", language: { code: "en" }, components: [
        { type: "body", parameters: [
          { type: "text", text: "24 October 2026" },
          { type: "text", text: "11:00 AM" },
          { type: "text", text: "D-1 Prathapaparudra, Jubilee Hills" },
          { type: "text", text: "https://urpass.space/pass/token123" },
        ] },
        { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: "token123" }] },
      ],
    });
  });

  it("sends nivi's three body variables without button component", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "test-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ messages: [{ id: "test-message" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await new WhatsAppProvider().sendTicketWhatsApp({
      eventId: "event-1", eventName: "Festivals for Joy", eventDate: "2026-10-24",
      eventTime: "11:00 AM – 1:00 PM", venue: "Celebration Hall",
      attendeeId: "attendee-1", attendeeName: "Guest Name", email: "guest@example.com",
      phone: "+919876543210", ticketId: "URP-TEST", passToken: "pass-token",
      templateName: "nivi", templateLanguage: "en_US", mediaUrl: "https://example.com/image.png",
    });
    expect(result.success).toBe(true);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.template).toEqual({
      name: "nivi", language: { code: "en" }, components: [
        { type: "body", parameters: [
          { type: "text", text: "24 October 2026" },
          { type: "text", text: "11:00 AM – 1:00 PM" },
          { type: "text", text: "Celebration Hall" },
        ] },
      ],
    });
  });

  it("formats 24-hour database time strings into clean AM/PM times for nivi", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "test-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ messages: [{ id: "test-message" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await new WhatsAppProvider().sendTicketWhatsApp({
      eventId: "event-1", eventName: "Festivals for Joy", eventDate: "2026-10-24",
      eventTime: "11:00:00", venue: "Celebration Hall",
      attendeeId: "attendee-1", attendeeName: "Guest Name", email: "guest@example.com",
      phone: "+919876543210", ticketId: "URP-TEST", passToken: "pass-token",
      templateName: "nivi1", templateLanguage: "en",
    });
    expect(result.success).toBe(true);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.template.components[0].parameters[1].text).toBe("11:00 AM");
  });

  it("keeps an explicit en code when building an unknown custom template", () => {
    const payload = buildTemplatePayload("ticket_confirmation", { passToken: "pass-token" }, "en", "custom_invitation");
    expect(payload.language.code).toBe("en");
  });

  it("recovers from Meta Code 131008 by attaching the dynamic URL button parameter and retrying", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "test-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");

    let callCount = 0;
    const fetchMock = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        // Meta rejects initial call because button parameter is required
        return {
          ok: false,
          status: 400,
          json: async () => ({
            error: {
              code: 131008,
              message: "(#131008) Required parameter is missing",
              error_data: {
                details: "buttons: Button at index 0 of type Url requires a parameter",
              },
            },
          }),
        };
      }
      // Retry succeeds!
      return {
        ok: true,
        status: 200,
        json: async () => ({ messages: [{ id: "wamid_retry_success_123" }] }),
      };
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await new WhatsAppProvider().sendTicketWhatsApp({
      eventId: "event-1",
      eventName: "Anniversary Gala",
      eventDate: "2026-10-24",
      venue: "Grand Ballroom",
      attendeeId: "att-1",
      attendeeName: "Guest",
      email: "guest@example.com",
      phone: "+919876543210",
      ticketId: "URP-123",
      passToken: "tok_auto_recover_777",
      templateName: "nivi",
      templateLanguage: "en",
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe("wamid_retry_success_123");
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Verify retry payload had the dynamic button parameter attached
    const retryBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    const buttonComponent = retryBody.template.components.find((c: any) => c.type === "button");
    expect(buttonComponent).toBeDefined();
    expect(buttonComponent.sub_type).toBe("url");
    expect(buttonComponent.parameters[0].text).toBe("tok_auto_recover_777");
  });

  it("recovers from Meta Code 132018 by stripping the button component and retrying", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "test-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");

    let callCount = 0;
    const fetchMock = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        // Meta rejects because template does not have button component
        return {
          ok: false,
          status: 400,
          json: async () => ({
            error: {
              code: 132018,
              message: "(#132018) Template does not contain a button component",
              error_data: {
                details: "Template does not contain a button component",
              },
            },
          }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ messages: [{ id: "wamid_strip_btn_success_456" }] }),
      };
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await new WhatsAppProvider().sendTicketWhatsApp({
      eventId: "event-1",
      eventName: "Anniversary Gala",
      eventDate: "2026-10-24",
      venue: "Grand Ballroom",
      attendeeId: "att-1",
      attendeeName: "Guest",
      email: "guest@example.com",
      phone: "+919876543210",
      ticketId: "URP-123",
      passToken: "tok_strip_btn_888",
      templateName: "urpass_space",
      templateLanguage: "en",
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe("wamid_strip_btn_success_456");
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Verify retry payload stripped the button component
    const retryBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    const buttonComponent = retryBody.template.components.find((c: any) => c.type === "button");
    expect(buttonComponent).toBeUndefined();
  });

  it("sends nivi122's five body variables and required dynamic URL button", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "test-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ messages: [{ id: "test-nivi122-message" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await new WhatsAppProvider().sendTicketWhatsApp({
      eventId: "event-1",
      eventName: "Festivals for Joy – 5th Anniversary Celebration",
      eventDate: "2026-10-24",
      eventTime: "11:00 AM",
      venue: "Grand Ballroom, Hyderabad",
      attendeeId: "attendee-1",
      attendeeName: "Guest Name",
      email: "guest@example.com",
      phone: "+919876543210",
      ticketId: "URP-TEST",
      passToken: "tok_nivi122_share",
      templateName: "nivi122",
      templateLanguage: "en",
    });

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.template).toEqual({
      name: "nivi122",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: "Festivals for Joy – 5th Anniversary Celebration" },
            { type: "text", text: "24 October 2026" },
            { type: "text", text: "11:00 AM" },
            { type: "text", text: "Grand Ballroom, Hyderabad" },
            { type: "text", text: "https://urpass.space/pass/tok_nivi122_share" },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: "tok_nivi122_share" }],
        },
      ],
    });
  });

  it("recovers from Meta Code 132000 (param count mismatch: 4 sent, 5 expected) and retries successfully", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "test-token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");

    let callCount = 0;
    const fetchMock = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        // Meta rejects initial call because only 4 params were sent when 5 are expected
        return {
          ok: false,
          status: 400,
          json: async () => ({
            error: {
              code: 132000,
              message: "(#132000) Number of parameters does not match the expected number of parameters",
              error_data: {
                details: "body: number of localizable_params (4) does not match the expected number of params (5)",
              },
            },
          }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ messages: [{ id: "wamid_code_132000_healed_999" }] }),
      };
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await new WhatsAppProvider().sendTicketWhatsApp({
      eventId: "event-1",
      eventName: "Festivals for Joy",
      eventDate: "2026-10-24",
      eventTime: "11:00 AM",
      venue: "Grand Ballroom",
      attendeeId: "att-1",
      attendeeName: "Guest",
      email: "guest@example.com",
      phone: "+919876543210",
      ticketId: "URP-123",
      passToken: "tok_heal_132000",
      templateName: "custom_5param_template",
      templateLanguage: "en",
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe("wamid_code_132000_healed_999");
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Verify retry payload adjusted parameters count to 5
    const retryBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    const bodyComp = retryBody.template.components.find((c: any) => c.type === "body");
    expect(bodyComp).toBeDefined();
    expect(bodyComp.parameters).toHaveLength(5);
  });
});


