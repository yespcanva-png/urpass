import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const { createClient, findAvailableEventSlug } = vi.hoisted(() => ({
  createClient: vi.fn(),
  findAvailableEventSlug: vi.fn().mockResolvedValue("team-summit"),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient }));
vi.mock("@/app/actions/events", () => ({ findAvailableEventSlug }));
vi.mock("@/lib/conversion/first-event", () => ({ recordFirstEventConversion: vi.fn() }));

import { saveQuickFirstEventDraft } from "@/app/actions/first-event";

describe("quick first-event draft", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_FIRST_EVENT_CONVERSION_ENABLED = "true";
    vi.clearAllMocks();
  });
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_FIRST_EVENT_CONVERSION_ENABLED;
  });

  it("requires a signed-in organizer", async () => {
    createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) } });
    expect(await saveQuickFirstEventDraft({ name: "Team Summit", expectedRegistrations: 100 }))
      .toEqual({ error: "Sign in to save your event draft." });
  });

  it("reuses the organizer's existing onboarding draft", async () => {
    const query = {
      select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: { id: "draft-1", is_onboarding_draft: true }, error: null }),
    };
    createClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
      from: vi.fn().mockReturnValue(query),
    });
    expect(await saveQuickFirstEventDraft({ name: "Team Summit", expectedRegistrations: 100 }))
      .toEqual({ eventId: "draft-1" });
    expect(findAvailableEventSlug).not.toHaveBeenCalled();
  });

  it("saves only honest draft fields and leaves schedule and venue unset", async () => {
    const insert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: "draft-2" }, error: null }) }),
    });
    const query = {
      select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }), insert,
    };
    createClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
      from: vi.fn().mockReturnValue(query),
    });
    expect(await saveQuickFirstEventDraft({ name: " Team Summit ", expectedRegistrations: 400 }))
      .toEqual({ eventId: "draft-2" });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      name: "Team Summit", attendee_limit: 400, expected_registrations: 400,
      status: "draft", application_enabled: true, event_date: null, start_time: null,
      end_time: null, venue: null, onboarding_category: "corporate",
      onboarding_objective: "collect_registrations",
    }));
  });
});
