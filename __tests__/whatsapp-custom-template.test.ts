import { afterEach, describe, expect, it, vi } from "vitest";
import { buildTemplatePayload, normalizeTemplateLanguage } from "@/lib/communications/providers/whatsapp/templates";
import { WhatsAppProvider } from "@/lib/communications/providers/whatsapp/provider";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Custom WhatsApp template translations", () => {
  it("preserves English separately from English US", () => {
    expect(normalizeTemplateLanguage("en", "custom_invitation")).toBe("en");
    expect(normalizeTemplateLanguage("en_US", "custom_invitation")).toBe("en_US");
  });

  it("uses the verified nivi translation despite a stale US language setting", () => {
    expect(normalizeTemplateLanguage("en_US", "nivi")).toBe("en");
    expect(normalizeTemplateLanguage("en_US", "nivi1")).toBe("en");
  });

  it("sends nivi1's four body variables without a button component", async () => {
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
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.template).toEqual({
      name: "nivi1", language: { code: "en" }, components: [
        { type: "body", parameters: [
          { type: "text", text: "24 October 2026" },
          { type: "text", text: "11:00 AM" },
          { type: "text", text: "D-1 Prathapaparudra, Jubilee Hills" },
          { type: "text", text: "https://urpass.space/pass/token123" },
        ] },
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
});
