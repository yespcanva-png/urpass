import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { adminClient, sendEmail } = vi.hoisted(() => ({ adminClient: vi.fn(), sendEmail: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ adminClient }));
vi.mock("@/lib/email", () => ({ getFromEmail: vi.fn(() => "team@urpass.space"), isEmailProviderConfigured: vi.fn(() => true), sendEmail }));
import { GET } from "@/app/api/cron/sales-lifecycle/route";

describe("sales lifecycle cron access", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => {
    delete process.env.CRON_SECRET;
    delete process.env.SALES_LIFECYCLE_EMAIL_ENABLED;
  });

  it("fails closed when no cron secret is configured", async () => {
    const response = await GET(new NextRequest("http://localhost/api/cron/sales-lifecycle"));
    expect(response.status).toBe(401);
  });

  it("does not send while the rollout flag is off", async () => {
    process.env.CRON_SECRET = "test-secret";
    const response = await GET(new NextRequest("http://localhost/api/cron/sales-lifecycle", { headers: { authorization: "Bearer test-secret" } }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ enabled: false, sent: 0 });
  });

  function setupDb(events: { id: string; name: string; status: string }[], optedIn: boolean, claimError: unknown = null, published = false, explicitConsent = true) {
    let signupQueries = 0;
    const insert = vi.fn().mockResolvedValue({ error: claimError });
    const update = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }) });
    const db = {
      auth: { admin: { getUserById: vi.fn().mockResolvedValue({ data: { user: { email: "host@example.com", user_metadata: { lifecycle_reminders_opt_in: explicitConsent } } }, error: null }) } },
      from: vi.fn((table: string) => {
        if (table === "conversion_events") return {
          select: () => ({ eq: (_field: string, eventName: string) => ({ gte: () => ({ lte: () => ({ not: () => ({ order: () => ({
            limit: async () => ({ data: eventName === "first_event_published"
              ? (published ? [{ user_id: "user-1", metadata: { event_id: "event-1" } }] : [])
              : (signupQueries++ === 0 && !published ? [{ user_id: "user-1" }] : []), error: null }),
          }) }) }) }) }) }),
        };
        if (table === "events") return { select: () => ({ eq: () => ({ order: async () => ({ data: events, error: null }) }) }) };
        if (table === "email_preferences") return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { email: "host@example.com", lifecycle_reminders: optedIn }, error: null }) }) }) };
        if (table === "sales_lifecycle_dispatches") return {
          insert, update, delete: () => ({ eq: () => ({ eq: async () => ({ error: null }) }) }),
        };
        throw new Error(`Unexpected table ${table}`);
      }),
    };
    adminClient.mockReturnValue(db);
    process.env.CRON_SECRET = "test-secret";
    process.env.SALES_LIFECYCLE_EMAIL_ENABLED = "true";
    sendEmail.mockResolvedValue({ id: "sent-1" });
    return { insert, update };
  }

  const run = () => GET(new NextRequest("http://localhost/api/cron/sales-lifecycle", { headers: { authorization: "Bearer test-secret" } }));

  it("suppresses reminders after the event is published", async () => {
    setupDb([{ id: "event-1", name: "Summit", status: "active" }], true);
    const response = await run();
    expect((await response.json()).sent).toBe(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("recovers an unpublished draft once when the organiser opted in", async () => {
    const { insert } = setupDb([{ id: "event-1", name: "Summit", status: "draft" }], true);
    const response = await run();
    expect((await response.json()).sent).toBe(1);
    expect(insert).toHaveBeenCalledWith({ user_id: "user-1", message_key: "draft_recovery:event-1" });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "host@example.com", subject: "Finish setting up Summit" }));
  });

  it("does not send when reminders are switched off", async () => {
    setupDb([], false);
    const response = await run();
    expect((await response.json()).sent).toBe(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not treat an older default-on preference as explicit consent", async () => {
    setupDb([], true, null, false, false);
    const response = await run();
    expect((await response.json()).sent).toBe(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("sends a share link after publish and suppresses signup reminders", async () => {
    setupDb([{ id: "event-1", name: "Summit", status: "active" }], true, null, true);
    const response = await run();
    expect((await response.json()).sent).toBe(1);
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ subject: "Summit is live — share your registration link" }));
  });
});
