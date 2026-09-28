import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Next.js modules
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { undoCheckIn, undoCheckInByToken } from "@/app/actions/manual-checkin";

const mockedCreateClient = vi.mocked(createClient);

describe("undoCheckIn & undoCheckInByToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when event not found", async () => {
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const result = await undoCheckIn("att-1", "evt-1");
    expect(result).toEqual({ error: "Event not found." });
  });

  it("returns error when user is not authorized", async () => {
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-unauthorized" } } }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "evt-1", organizer_id: "user-organizer", organization_id: null },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {};
      }),
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const result = await undoCheckIn("att-1", "evt-1");
    expect(result).toEqual({ error: "Not authorized to reset check-in for this event." });
  });

  it("returns error when pass is not found for attendee", async () => {
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "evt-1", organizer_id: "user-organizer", organization_id: null },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "passes") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          };
        }
        return {};
      }),
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const result = await undoCheckIn("att-1", "evt-1");
    expect(result).toEqual({ error: "No pass found for this attendee." });
  });

  it("successfully deletes check-in and resets pass and attendee status", async () => {
    const deletedCheckIns: Array<{ filter: Record<string, unknown> }> = [];
    const updatedPasses: Array<Record<string, unknown>> = [];
    const updatedAttendees: Array<Record<string, unknown>> = [];

    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "evt-1", organizer_id: "user-organizer", organization_id: null },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "passes") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: "pass-1", status: "checked_in" },
                    error: null,
                  }),
                }),
              }),
            }),
            update: vi.fn().mockImplementation((fields) => {
              updatedPasses.push(fields);
              return {
                eq: vi.fn().mockResolvedValue({ error: null }),
              };
            }),
          };
        }
        if (table === "check_ins") {
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockImplementation((col1, val1) => ({
                eq: vi.fn().mockImplementation((col2, val2) => {
                  deletedCheckIns.push({ filter: { [col1]: val1, [col2]: val2 } });
                  return Promise.resolve({ error: null });
                }),
              })),
            }),
          };
        }
        if (table === "attendees") {
          return {
            update: vi.fn().mockImplementation((fields) => {
              updatedAttendees.push(fields);
              return {
                eq: vi.fn().mockResolvedValue({ error: null }),
              };
            }),
          };
        }
        return {};
      }),
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const result = await undoCheckIn("att-1", "evt-1");
    expect(result).toEqual({ success: true });
    expect(deletedCheckIns.length).toBe(2);
    expect(updatedPasses).toEqual([{ status: "generated" }]);
    expect(updatedAttendees).toEqual([{ pass_status: "generated" }]);
  });

  it("undoCheckInByToken finds attendee and resets check-in", async () => {
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "evt-1", organizer_id: "user-organizer", organization_id: null },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "passes") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockImplementation((col1, val1) => ({
                eq: vi.fn().mockImplementation((col2, val2) => ({
                  single: vi.fn().mockImplementation(() => {
                    if (col1 === "pass_token" && val1 === "TOKEN123") {
                      return Promise.resolve({
                        data: { id: "pass-1", attendee_id: "att-42" },
                        error: null,
                      });
                    }
                    if (col1 === "attendee_id" && val1 === "att-42") {
                      return Promise.resolve({
                        data: { id: "pass-1", status: "checked_in" },
                        error: null,
                      });
                    }
                    return Promise.resolve({ data: null, error: null });
                  }),
                })),
              })),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (table === "check_ins") {
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }),
          };
        }
        if (table === "attendees") {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        return {};
      }),
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const result = await undoCheckInByToken("TOKEN123", "evt-1");
    expect(result).toEqual({ success: true });
  });

  it("undoCheckInByToken returns error when pass token not found", async () => {
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "evt-1", organizer_id: "user-organizer", organization_id: null },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "passes") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          };
        }
        return {};
      }),
    };
    mockedCreateClient.mockResolvedValue(supabase as never);

    const result = await undoCheckInByToken("UNKNOWN_TOKEN", "evt-1");
    expect(result).toEqual({ error: "Pass not found." });
  });
});
