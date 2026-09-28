import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Next.js modules
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/communications", () => ({
  communicationService: {
    sendTicketCommunications: vi.fn().mockResolvedValue({ success: true }),
    sendTicketEmail: vi.fn().mockResolvedValue({ success: true }),
    sendTicketWhatsApp: vi.fn().mockResolvedValue({ success: true }),
  },
  formatTicketId: (token: string) => `URP-${token.slice(0, 6).toUpperCase()}`,
  buildTicketUrl: (token: string) => `https://urpass.space/pass/${token}`,
}));

import { createClient } from "@/lib/supabase/server";
import { bulkGeneratePasses, bulkBroadcastPasses } from "@/app/actions/passes";
import { communicationService } from "@/lib/communications";

const mockedCreateClient = vi.mocked(createClient);

describe("Bulk Pass Delivery & Broadcast Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("bulkGeneratePasses", () => {
    it("returns error if event is not found or user is unauthorized", async () => {
      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: null, error: null }),
                  }),
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkGeneratePasses("evt-1");
      expect(result.success).toBe(false);
      expect(result.generated).toBe(0);
      expect(result.error).toContain("Event not found or unauthorized");
    });

    it("returns generated: 0 if no approved attendees are waiting for a pass", async () => {
      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        id: "evt-1",
                        name: "Conference 2026",
                        event_date: "2026-10-15",
                        venue: "Main Hall",
                        organizer_id: "user-1",
                        organization_id: null,
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "attendees") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
                  }),
                }),
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkGeneratePasses("evt-1");
      expect(result.success).toBe(true);
      expect(result.generated).toBe(0);
      expect(result.tokens).toEqual({});
    });

    it("generates passes in bulk, updates attendee pass_status, and dispatches communications", async () => {
      const attendeesData = [
        { id: "att-1", name: "Alice", email: "alice@example.com", phone: "+919876543210", pass_type: "participant" },
        { id: "att-2", name: "Bob", email: "bob@example.com", phone: "+919876543211", pass_type: "vip" },
      ];

      const insertedPasses: Record<string, string> = {};
      const updatedAttendees: string[] = [];

      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        id: "evt-1",
                        name: "Conference 2026",
                        event_date: "2026-10-15",
                        venue: "Main Hall",
                        organizer_id: "user-1",
                        organization_id: null,
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "attendees") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ data: attendeesData, error: null }),
                  }),
                }),
              }),
              update: vi.fn().mockImplementation((fields: { pass_status: string }) => ({
                eq: vi.fn().mockImplementation((_field: string, id: string) => {
                  updatedAttendees.push(id);
                  return Promise.resolve({ data: null, error: null });
                }),
              })),
            };
          }
          if (table === "passes") {
            return {
              insert: vi.fn().mockImplementation((row: { attendee_id: string; pass_type: string }) => {
                const token = `token-${row.attendee_id}`;
                insertedPasses[row.attendee_id] = token;
                return {
                  select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { pass_token: token }, error: null }),
                  }),
                };
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkGeneratePasses("evt-1");
      expect(result.success).toBe(true);
      expect(result.generated).toBe(2);
      expect(result.tokens).toEqual({
        "att-1": "token-att-1",
        "att-2": "token-att-2",
      });
      expect(updatedAttendees).toContain("att-1");
      expect(updatedAttendees).toContain("att-2");
      expect(communicationService.sendTicketCommunications).toHaveBeenCalledTimes(2);
    });

    it("recovers gracefully if pass token already exists via race condition code 23505", async () => {
      const attendeesData = [
        { id: "att-race", name: "Racer", email: "racer@example.com", phone: null, pass_type: "participant" },
      ];

      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        id: "evt-1",
                        name: "Conference 2026",
                        event_date: "2026-10-15",
                        venue: "Main Hall",
                        organizer_id: "user-1",
                        organization_id: null,
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "attendees") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ data: attendeesData, error: null }),
                  }),
                }),
              }),
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            };
          }
          if (table === "passes") {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: { code: "23505", message: "Duplicate" } }),
                }),
              }),
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { pass_token: "existing-token" }, error: null }),
                  }),
                }),
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkGeneratePasses("evt-1");
      expect(result.success).toBe(true);
      expect(result.generated).toBe(1);
      expect(result.tokens).toEqual({ "att-race": "existing-token" });
    });
  });

  describe("bulkBroadcastPasses", () => {
    it("returns error if event is unauthorized", async () => {
      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: null, error: null }),
                  }),
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkBroadcastPasses("evt-1");
      expect(result.success).toBe(false);
      expect(result.error).toContain("Event not found or unauthorized");
    });

    it("broadcasts emails to all approved attendees with passes", async () => {
      const passesData = [
        {
          id: "pass-1",
          pass_token: "token-1",
          pass_type: "participant",
          attendee: {
            id: "att-1",
            name: "Alice",
            email: "alice@example.com",
            phone: "+919876543210",
            pass_status: "generated",
            application_status: "approved",
          },
        },
        {
          id: "pass-2",
          pass_token: "token-2",
          pass_type: "vip",
          attendee: {
            id: "att-2",
            name: "Bob",
            email: "bob@example.com",
            phone: "+919876543211",
            pass_status: "checked_in",
            application_status: "approved",
          },
        },
      ];

      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        id: "evt-1",
                        name: "Conference 2026",
                        event_date: "2026-10-15",
                        venue: "Main Hall",
                        organizer_id: "user-1",
                        organization_id: null,
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "passes") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: passesData, error: null }),
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkBroadcastPasses("evt-1", "all_approved", "EMAIL");
      expect(result.success).toBe(true);
      expect(result.sent).toBe(2);
      expect(result.failed).toBe(0);
      expect(communicationService.sendTicketEmail).toHaveBeenCalledTimes(2);
    });

    it("filters out checked-in attendees when target is unclaimed", async () => {
      const passesData = [
        {
          id: "pass-1",
          pass_token: "token-1",
          pass_type: "participant",
          attendee: {
            id: "att-1",
            name: "Alice",
            email: "alice@example.com",
            phone: "+919876543210",
            pass_status: "generated",
            application_status: "approved",
          },
        },
        {
          id: "pass-2",
          pass_token: "token-2",
          pass_type: "vip",
          attendee: {
            id: "att-2",
            name: "Bob",
            email: "bob@example.com",
            phone: "+919876543211",
            pass_status: "checked_in",
            application_status: "approved",
          },
        },
      ];

      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        id: "evt-1",
                        name: "Conference 2026",
                        event_date: "2026-10-15",
                        venue: "Main Hall",
                        organizer_id: "user-1",
                        organization_id: null,
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "passes") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: passesData, error: null }),
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkBroadcastPasses("evt-1", "unclaimed", "EMAIL");
      expect(result.success).toBe(true);
      expect(result.sent).toBe(1); // Only Alice
      expect(result.failed).toBe(0);
      expect(communicationService.sendTicketEmail).toHaveBeenCalledTimes(1);
    });

    it("sends via WhatsApp and increments failed count if attendee has no phone", async () => {
      const passesData = [
        {
          id: "pass-1",
          pass_token: "token-1",
          pass_type: "participant",
          attendee: {
            id: "att-1",
            name: "Alice",
            email: "alice@example.com",
            phone: "+919876543210",
            pass_status: "generated",
            application_status: "approved",
          },
        },
        {
          id: "pass-2",
          pass_token: "token-2",
          pass_type: "vip",
          attendee: {
            id: "att-2",
            name: "NoPhoneBob",
            email: "bob@example.com",
            phone: null,
            pass_status: "generated",
            application_status: "approved",
          },
        },
      ];

      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        id: "evt-1",
                        name: "Conference 2026",
                        event_date: "2026-10-15",
                        venue: "Main Hall",
                        organizer_id: "user-1",
                        organization_id: null,
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "passes") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: passesData, error: null }),
              }),
            };
          }
          return {};
        }),
      };
      mockedCreateClient.mockResolvedValue(supabase as never);

      const result = await bulkBroadcastPasses("evt-1", "all_approved", "WHATSAPP");
      expect(result.success).toBe(true);
      expect(result.sent).toBe(1);
      expect(result.failed).toBe(1); // Bob had no phone
      expect(communicationService.sendTicketWhatsApp).toHaveBeenCalledTimes(1);
    });
  });
});
