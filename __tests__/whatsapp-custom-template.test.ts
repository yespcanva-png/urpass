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
  });

  it("sends nivi's three body variables and clean dynamic pass button", async () => {
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
        { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: "pass-token" }] },
      ],
    });
  });

  it("keeps an explicit en code when building an unknown custom template", () => {
    const payload = buildTemplatePayload("ticket_confirmation", { passToken: "pass-token" }, "en", "custom_invitation");
    expect(payload.language.code).toBe("en");
  });
});
