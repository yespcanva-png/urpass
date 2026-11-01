import { beforeEach, describe, expect, it, vi } from "vitest";

const { adminClient, insert } = vi.hoisted(() => ({
  adminClient: vi.fn(),
  insert: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ adminClient }));

import { recordServerConversion } from "@/lib/conversion/server";

describe("conversion recording", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    insert.mockResolvedValue({ error: null });
    adminClient.mockReturnValue({
      from: (table: string) => table === "conversion_visitor_sessions"
        ? { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: "session-1", user_id: null } }) }) }), update: () => ({ eq: async () => ({ error: null }) }) }
        : { insert },
    });
  });

  it("records an event without the unsupported live utm_content column", async () => {
    const result = await recordServerConversion({
      eventName: "signup_started",
      sessionId: "session-1",
      pageSlug: "/signup",
      utmContent: "hero",
    });

    expect(result).toEqual({ success: true });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      event_name: "signup_started",
      metadata: { utm_content: "hero" },
    }));
    expect(insert.mock.calls[0][0]).not.toHaveProperty("utm_content");
  });

  it("returns insert failures to the caller", async () => {
    insert.mockResolvedValue({ error: { code: "42703", message: "missing column" } });

    const result = await recordServerConversion({
      eventName: "signup_started",
      sessionId: "session-1",
      pageSlug: "/signup",
    });

    expect(result).toEqual({ error: "missing column" });
  });
});
