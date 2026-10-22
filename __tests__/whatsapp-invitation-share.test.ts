import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  buildWhatsAppInvitationText,
  buildWhatsAppUrls,
  getShareInvitationData,
} from "@/lib/communications/invitation-share";
import { buildWhatsAppPassUrl } from "@/components/pass/WhatsAppShareButton";

describe("WhatsApp Invitation Sharing — Text Reconstruction & URLs", () => {
  const baseParams = {
    eventName: "Bangalore Tech Summit 2026",
    eventDate: "2026-10-24",
    eventTime: "10:30 AM",
    venue: "Palace Grounds, Main Arena",
    attendeeName: "Priya Sharma",
    passUrl: "https://urpass.space/pass/urp_pass_xyz789",
    shareUrl: "https://urpass.space/share/urp_pass_xyz789",
  };

  it("reconstructs exact urpass_space WhatsApp invitation text with emojis and links", () => {
    const text = buildWhatsAppInvitationText({
      ...baseParams,
      templateName: "urpass_space",
      orgName: "Tech Summit Org",
    });

    expect(text).toContain("Hi Priya Sharma,");
    expect(text).toContain("Your registration for *Bangalore Tech Summit 2026* has been confirmed! ✅");
    expect(text).toContain("📅 *Date:* 24 Oct 2026");
    expect(text).toContain("⏰ *Time:* 10:30 AM");
    expect(text).toContain("📍 *Venue:* Palace Grounds, Main Arena");
    expect(text).toContain("🎟️ Your digital event pass is ready.");
    expect(text).toContain("🔗 *View Digital Pass:*\nhttps://urpass.space/pass/urp_pass_xyz789");
    expect(text).toContain("📲 *Share this invitation with friends/colleagues:*\nhttps://urpass.space/share/urp_pass_xyz789");
    expect(text).toContain("*Tech Summit Org*");
  });

  it("reconstructs urpass_ticket format with dedicated layout", () => {
    const text = buildWhatsAppInvitationText({
      ...baseParams,
      templateName: "urpass_ticket",
    });

    expect(text).toContain("Hi Priya Sharma, Your registration for *Bangalore Tech Summit 2026* has been confirmed! 🎟️");
    expect(text).toContain("📅 *Date:* 24 Oct 2026");
    expect(text).toContain("⏰ *Time:* 10:30 AM");
    expect(text).toContain("🔗 *View Digital Pass:*\nhttps://urpass.space/pass/urp_pass_xyz789");
    expect(text).toContain("📲 *Share Invitation:*\nhttps://urpass.space/share/urp_pass_xyz789");
    expect(text).toContain("Show this pass at the entrance for instant check-in!");
  });

  it("reconstructs nivi1 template with embedded pass URL and share invitation", () => {
    const text = buildWhatsAppInvitationText({
      ...baseParams,
      templateName: "nivi1",
    });

    expect(text).toContain("📅 *Date:* 24 October 2026");
    expect(text).toContain("⏰ *Time:* 10:30 AM");
    expect(text).toContain("📍 *Venue:* Palace Grounds, Main Arena");
    expect(text).toContain("🎟️ *View Digital Pass:*\nhttps://urpass.space/pass/urp_pass_xyz789");
    expect(text).toContain("📲 *Share Invitation:*\nhttps://urpass.space/share/urp_pass_xyz789");
  });

  it("handles missing attendee name by defaulting to Guest", () => {
    const text = buildWhatsAppInvitationText({
      ...baseParams,
      attendeeName: undefined,
    });
    expect(text).toContain("Hi Guest,");
  });

  it("handles missing venue by providing standard fallback", () => {
    const text = buildWhatsAppInvitationText({
      ...baseParams,
      venue: undefined,
    });
    expect(text).toContain("Confirmed on Pass");
  });

  it("generates wa.me and web.whatsapp.com URLs without double-encoding", () => {
    const rawText = "Hi Priya! 🎟️ Visit: https://urpass.space/pass/urp_pass_123 & share: https://urpass.space/share/urp_pass_123";
    const { whatsappUrl, whatsappWebUrl } = buildWhatsAppUrls(rawText);

    expect(whatsappUrl).toContain("https://wa.me/?text=");
    expect(whatsappWebUrl).toContain("https://web.whatsapp.com/send?text=");

    // Crucial check: verify NO double encoding
    // In single encoding: 'https://' becomes 'https%3A%2F%2F'. In double encoding, it would be 'https%253A%252F%252F'
    expect(whatsappUrl).not.toContain("%253A");
    expect(whatsappUrl).not.toContain("%252F");
    expect(decodeURIComponent(whatsappUrl.replace("https://wa.me/?text=", ""))).toBe(rawText);
    expect(decodeURIComponent(whatsappWebUrl.replace("https://web.whatsapp.com/send?text=", ""))).toBe(rawText);
  });

  it("normalizes phone numbers for WhatsApp URL", () => {
    const text = "Invitation message";
    const { whatsappUrl } = buildWhatsAppUrls(text, "9876543210");
    expect(whatsappUrl).toContain("https://wa.me/919876543210?text=");

    const withCode = buildWhatsAppUrls(text, "+91 98765-43210");
    expect(withCode.whatsappUrl).toContain("https://wa.me/919876543210?text=");
  });
});

describe("getShareInvitationData — Database & Permissions", () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    };
    (globalThis as any).__urpass_admin_client = mockSupabase;
  });

  afterEach(() => {
    delete (globalThis as any).__urpass_admin_client;
    vi.restoreAllMocks();
  });

  it("retrieves active pass and reconstructs share data successfully", async () => {
    const passToken = "urp_live_token_777";
    const passRecord = {
      pass_token: passToken,
      pass_type: "standard",
      status: "active",
      attendee_id: "att-123",
      event_id: "evt-456",
    };

    const attendeeRecord = {
      id: "att-123",
      name: "Aarav Patel",
      application_status: "approved",
      email: "aarav.private@example.com",
      phone: "+919988776655",
      custom_responses: { private_notes: "VIP seat" },
    };

    const eventRecord = {
      id: "evt-456",
      name: "UrPass Creators Conference 2026",
      event_date: "2026-11-15",
      start_time: "09:00:00",
      end_time: "17:00:00",
      venue: "Grand Ballroom, ITC Gardenia",
      event_type: "in_person",
      status: "published",
      organizer_id: "org-user-1",
      custom_pass_design: {},
      whatsapp_settings: {
        template_name: "urpass_space",
        allow_pass_sharing: true,
      },
    };

    const profileRecord = {
      org_name: "UrPass Community",
    };

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: () => ({
              maybeSingle: async () => ({ data: passRecord, error: null }),
            }),
          }),
        };
      }
      if (table === "attendees") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: attendeeRecord, error: null }),
            }),
          }),
        };
      }
      if (table === "events") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: eventRecord, error: null }),
            }),
          }),
        };
      }
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: profileRecord, error: null }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });

    const result = await getShareInvitationData(passToken);

    expect(result.status).toBe("active");
    expect(result.canShare).toBe(true);
    expect(result.passToken).toBe(passToken);
    expect(result.sanitizedToken).toBe(passToken);
    expect(result.passUrl).toContain(`/pass/${passToken}`);
    expect(result.shareUrl).toContain(`/share/${passToken}`);
    expect(result.eventName).toBe("UrPass Creators Conference 2026");
    expect(result.attendeeName).toBe("Aarav Patel");
    expect(result.organizerName).toBe("UrPass Community");
    expect(result.whatsappUrl).toContain("https://wa.me/?text=");
    expect(result.whatsappWebUrl).toContain("https://web.whatsapp.com/send?text=");

    // Privacy Protection: No email or phone should leak into the share data or text
    expect((result as any).email).toBeUndefined();
    expect((result as any).phone).toBeUndefined();
    expect(result.invitationText).not.toContain("aarav.private@example.com");
    expect(result.invitationText).not.toContain("9988776655");
    expect(result.invitationText).not.toContain("VIP seat");
  });

  it("cleans Meta button template placeholder artifacts from raw tokens", async () => {
    const rawTokenWithPrefix = "%7B%7B1%7D%7Durp_clean_token_888";
    const cleanToken = "urp_clean_token_888";

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: (query: string) => {
              expect(query).toContain(`pass_token.eq.${cleanToken}`);
              return {
                maybeSingle: async () => ({
                  data: {
                    pass_token: cleanToken,
                    status: "active",
                    attendee_id: "att-1",
                    event_id: "evt-1",
                  },
                  error: null,
                }),
              };
            },
          }),
        };
      }
      if (table === "attendees") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { id: "att-1", name: "Guest" },
              }),
            }),
          }),
        };
      }
      if (table === "events") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  id: "evt-1",
                  name: "Summit",
                  event_date: "2026-10-30",
                  status: "published",
                },
              }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });

    const result = await getShareInvitationData(rawTokenWithPrefix);
    expect(result.status).toBe("active");
    expect(result.sanitizedToken).toBe("urp_clean_token_888");
    expect(result.passUrl).toBe("https://urpass.space/pass/urp_clean_token_888");
    expect(result.shareUrl).toBe("https://urpass.space/share/urp_clean_token_888");
  });

  it("handles revoked passes with dedicated state and prevents sharing", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: () => ({
              maybeSingle: async () => ({
                data: { pass_token: "revoked_token", status: "revoked" },
                error: null,
              }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });

    const result = await getShareInvitationData("revoked_token");
    expect(result.status).toBe("revoked");
    expect(result.canShare).toBe(false);
    expect(result.reason).toContain("revoked");
  });

  it("handles cancelled events and passes with dedicated state", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: () => ({
              maybeSingle: async () => ({
                data: { pass_token: "active_token", status: "active", attendee_id: "att-1", event_id: "evt-1" },
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === "attendees") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { id: "att-1", name: "Guest" } }),
            }),
          }),
        };
      }
      if (table === "events") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { id: "evt-1", name: "Cancelled Event", status: "cancelled" } }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });

    const result = await getShareInvitationData("active_token");
    expect(result.status).toBe("cancelled");
    expect(result.canShare).toBe(false);
    expect(result.reason).toContain("cancelled");
  });

  it("handles expired passes with dedicated state", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: () => ({
              maybeSingle: async () => ({
                data: { pass_token: "expired_token", status: "expired" },
                error: null,
              }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });

    const result = await getShareInvitationData("expired_token");
    expect(result.status).toBe("expired");
    expect(result.canShare).toBe(false);
    expect(result.reason).toContain("expired");
  });

  it("blocks sharing when organizer configured allow_pass_sharing as false", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: () => ({
              maybeSingle: async () => ({
                data: { pass_token: "token_no_share", status: "active", attendee_id: "att-1", event_id: "evt-1" },
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === "attendees") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { id: "att-1", name: "Guest" } }),
            }),
          }),
        };
      }
      if (table === "events") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  id: "evt-1",
                  name: "Private Gala",
                  status: "published",
                  whatsapp_settings: { allow_pass_sharing: false },
                },
              }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });

    const result = await getShareInvitationData("token_no_share");
    expect(result.status).toBe("sharing_disabled");
    expect(result.canShare).toBe(false);
    expect(result.reason).toContain("disabled WhatsApp invitation sharing");
  });

  it("hides attendee name when custom_pass_design sets showAttendeeName to false", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: () => ({
              maybeSingle: async () => ({
                data: { pass_token: "token_anon", status: "active", attendee_id: "att-1", event_id: "evt-1" },
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === "attendees") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { id: "att-1", name: "Confidential VIP" } }),
            }),
          }),
        };
      }
      if (table === "events") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  id: "evt-1",
                  name: "Secret Event",
                  status: "published",
                  custom_pass_design: { showAttendeeName: false },
                },
              }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });

    const result = await getShareInvitationData("token_anon");
    expect(result.status).toBe("active");
    expect(result.attendeeName).toBe("Guest");
    expect(result.invitationText).toContain("Hi Guest,");
    expect(result.invitationText).not.toContain("Confidential VIP");
  });
});

describe("Two WhatsApp Accounts Forward-Sharing Simulation", () => {
  let mockSupabase: any;
  const originalToken = "urp_original_pass_555";

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    };
    (globalThis as any).__urpass_admin_client = mockSupabase;

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "passes") {
        return {
          select: () => ({
            or: () => ({
              maybeSingle: async () => ({
                data: {
                  pass_token: originalToken,
                  status: "active",
                  attendee_id: "att-primary",
                  event_id: "evt-fest",
                },
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === "attendees") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { id: "att-primary", name: "Primary Attendee" },
              }),
            }),
          }),
        };
      }
      if (table === "events") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  id: "evt-fest",
                  name: "Diwali Fest 2026",
                  event_date: "2026-11-01",
                  start_time: "18:00:00",
                  venue: "Community Amphitheatre",
                  status: "published",
                },
              }),
            }),
          }),
        };
      }
      return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) };
    });
  });

  afterEach(() => {
    delete (globalThis as any).__urpass_admin_client;
    vi.restoreAllMocks();
  });

  it("simulates Account 1 sending to Account 2, and Account 2 forwarding to Account 3 seamlessly", async () => {
    // Step 1: Account 1 shares the invitation via the share URL
    const account1ShareData = await getShareInvitationData(originalToken);
    expect(account1ShareData.canShare).toBe(true);
    expect(account1ShareData.shareUrl).toBe(`https://urpass.space/share/${originalToken}`);
    expect(account1ShareData.passUrl).toBe(`https://urpass.space/pass/${originalToken}`);

    // Verify WhatsApp invitation text sent by Account 1 to Account 2
    const account1Message = account1ShareData.invitationText;
    expect(account1Message).toContain(`https://urpass.space/pass/${originalToken}`);
    expect(account1Message).toContain(`https://urpass.space/share/${originalToken}`);

    // Step 2: Account 2 receives the message and opens the share link: https://urpass.space/share/${originalToken}
    const account2ShareData = await getShareInvitationData(originalToken);
    expect(account2ShareData.status).toBe("active");
    expect(account2ShareData.eventName).toBe("Diwali Fest 2026");

    // Account 2 forwards the invitation to Account 3
    const account2ForwardMessage = account2ShareData.invitationText;
    expect(account2ForwardMessage).toContain(`https://urpass.space/pass/${originalToken}`);
    expect(account2ForwardMessage).toContain(`https://urpass.space/share/${originalToken}`);

    // Step 3: Account 3 receives the exact same entry pass and event details
    expect(account2ForwardMessage).toBe(account1Message);

    // Verify that the original QR pass token was preserved throughout the entire relay chain
    expect(account2ShareData.passToken).toBe(originalToken);
  });
});

describe("buildWhatsAppPassUrl Backward Compatibility", () => {
  it("maintains backward compatibility with existing callers", () => {
    const url = buildWhatsAppPassUrl({
      eventName: "Hackathon",
      eventDate: "Tomorrow",
      venue: "Main Hall",
      passToken: "urp_pass_compat_123",
      attendeeName: "Dev",
      phone: "9876543210",
    });

    expect(url).toContain("https://wa.me/919876543210?text=");
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Hackathon");
    expect(decoded).toContain("Dev");
    expect(decoded).toContain("urp_pass_compat_123");
    expect(decoded).toContain("https://urpass.space/share/urp_pass_compat_123");
  });
});
