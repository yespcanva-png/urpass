import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js server modules ───────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/email", () => ({
  notifyOwnerPaymentSuccess: vi.fn().mockResolvedValue(undefined),
  notifyOwnerOneTimePayment: vi.fn().mockResolvedValue(undefined),
  sendApplicationConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendApprovalEmail: vi.fn().mockResolvedValue(undefined),
  sendPassEmail: vi.fn().mockResolvedValue(undefined),
  sendUserPaymentSuccessEmail: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/webhooks", () => ({
  sendWebhooks: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/api-usage", () => ({
  recordApiUsage: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/plan", () => ({
  getUserPlan: vi.fn().mockResolvedValue({
    slug: "pro",
    canExport: true,
    canCSV: true,
    canUse: () => true,
    getLimit: (key: string) => (key === "custom_fields" ? 10 : 999999),
  }),
}));

// ── Supabase mock factory ─────────────────────────────────────────────────────
function makeSupabase(overrides: Record<string, unknown> = {}) {
  const base = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  };
  return base;
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
const mockedCreateClient = vi.mocked(createClient);
const mockedCreateAdminClient = vi.mocked(createAdminClient);

describe("Custom Registration Fields Builder", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects custom fields with empty question labels", async () => {
    const supabase = makeSupabase({
      single: vi.fn().mockResolvedValue({
        data: { id: "evt-123", organizer_id: "user-123", organization_id: null },
        error: null,
      }),
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const { updateEventCustomFields } = await import("@/app/actions/events");
    const result = await updateEventCustomFields("evt-123", [
      { id: "f1", label: "   ", type: "text", required: false },
    ]);

    expect(result?.error).toBe("Field label cannot be empty.");
  });

  it("rejects dropdown questions with zero options", async () => {
    const supabase = makeSupabase({
      single: vi.fn().mockResolvedValue({
        data: { id: "evt-123", organizer_id: "user-123", organization_id: null },
        error: null,
      }),
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const { updateEventCustomFields } = await import("@/app/actions/events");
    const result = await updateEventCustomFields("evt-123", [
      { id: "f1", label: "T-Shirt Size", type: "select", options: [], required: false },
    ]);

    expect(result?.error).toContain("must have at least one option");
  });

  it("successfully saves sanitized custom fields", async () => {
    let updatedPayload: Record<string, unknown> | null = null;
    const supabase = makeSupabase();
    supabase.single = vi.fn().mockResolvedValue({
      data: { id: "evt-123", organizer_id: "user-123", organization_id: null },
      error: null,
    });
    supabase.update = vi.fn().mockImplementation((payload) => {
      updatedPayload = payload;
      return { eq: vi.fn().mockResolvedValue({ error: null }) };
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const { updateEventCustomFields } = await import("@/app/actions/events");
    const result = await updateEventCustomFields("evt-123", [
      { id: "f1", label: " T-Shirt Size ", type: "select", options: ["S", " M ", "L"], required: true },
      { id: "f2", label: "College Name", type: "text", placeholder: "e.g. Stanford", required: false },
    ]);

    expect(result?.error).toBeUndefined();
    expect(updatedPayload).toEqual({
      custom_fields: [
        { id: "f1", label: "T-Shirt Size", type: "select", required: true, options: ["S", "M", "L"], placeholder: undefined },
        { id: "f2", label: "College Name", type: "text", required: false, options: undefined, placeholder: "e.g. Stanford" },
      ],
    });
  });
});

describe("Attendee Application with Custom Field Responses", () => {
  beforeEach(() => vi.clearAllMocks());

  it("blocks registration if a required custom question is not answered", async () => {
    const admin = makeSupabase();
    admin.single = vi.fn().mockImplementation(async () => {
      return {
        data: {
          id: "evt-123",
          status: "active",
          application_enabled: true,
          auto_approve: true,
          attendee_limit: 100,
          name: "Hackathon",
          event_date: "2026-10-15",
          venue: "Main Hall",
          is_paid_event: false,
          ticket_price: 0,
          organizer_id: "user-123",
          organization_id: null,
          custom_fields: [
            { id: "f_tshirt", label: "T-Shirt Size", type: "select", required: true },
          ],
        },
        error: null,
      };
    });
    mockedCreateAdminClient.mockReturnValue(admin as never);

    const { submitApplication } = await import("@/app/actions/attendees");
    const result = await submitApplication(
      "evt-123",
      { name: "John Doe", email: "john@example.com", phone: "+91 9999999999", pass_type: "participant" },
      undefined,
      null,
      {} // Empty custom responses
    );

    expect(result?.error).toContain('Please answer the required question: "T-Shirt Size"');
  });

  it("stores custom responses in attendees table on valid submission", async () => {
    let insertedAttendee: Record<string, unknown> | null = null;
    const admin = makeSupabase();
    admin.single = vi.fn().mockImplementation(async () => {
      return {
        data: {
          id: "evt-123",
          status: "active",
          application_enabled: true,
          auto_approve: true,
          attendee_limit: 100,
          name: "Hackathon",
          event_date: "2026-10-15",
          venue: "Main Hall",
          is_paid_event: false,
          ticket_price: 0,
          organizer_id: "user-123",
          organization_id: null,
          custom_fields: [
            { id: "f_tshirt", label: "T-Shirt Size", type: "select", required: true },
            { id: "f_college", label: "College Name", type: "text", required: false },
          ],
        },
        error: null,
      };
    });

    admin.insert = vi.fn().mockImplementation((payload) => {
      if (payload.name && payload.email) {
        insertedAttendee = payload;
      }
      return {
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "att-123", pass_type: "participant", pass_token: "tok_123" },
            error: null,
          }),
        }),
      };
    });
    mockedCreateAdminClient.mockReturnValue(admin as never);

    const { submitApplication } = await import("@/app/actions/attendees");
    const result = await submitApplication(
      "evt-123",
      { name: "John Doe", email: "john@example.com", phone: "+91 9999999999", pass_type: "participant" },
      undefined,
      null,
      { f_tshirt: "L", f_college: "MIT" }
    );

    expect(result?.error).toBeUndefined();
    expect(insertedAttendee).not.toBeNull();
    expect((insertedAttendee as unknown as Record<string, unknown>)?.custom_responses).toEqual({
      f_tshirt: "L",
      f_college: "MIT",
    });
  });
});

describe("Attendee CSV Export with Custom Fields", () => {
  beforeEach(() => vi.clearAllMocks());

  it("includes custom field titles in CSV header and responses in rows", async () => {
    const supabase = makeSupabase();
    mockedCreateClient.mockResolvedValue(supabase as never);

    // Mock getUserPlan
    supabase.single = vi.fn().mockImplementation(async () => {
      return {
        data: {
          id: "evt-123",
          organizer_id: "user-123",
          organization_id: null,
          attendee_limit: 100,
          status: "active",
          application_enabled: true,
          custom_fields: [
            { id: "f_tshirt", label: "T-Shirt Size" },
            { id: "f_diet", label: "Dietary" },
          ],
        },
        error: null,
      };
    });

    supabase.order = vi.fn().mockResolvedValue({
      data: [
        {
          name: "Alice Smith",
          email: "alice@example.com",
          phone: "+91 9876543210",
          pass_type: "participant",
          application_status: "approved",
          pass_status: "generated",
          created_at: "2026-10-01T10:00:00Z",
          custom_responses: {
            f_tshirt: "M",
            f_diet: "Vegetarian",
          },
        },
      ],
      error: null,
    });

    const { exportAttendeesCSV } = await import("@/app/actions/attendees");
    const result = await exportAttendeesCSV("evt-123");

    expect(result.error).toBeUndefined();
    expect(result.csv).toBeDefined();
    expect(result.csv).toContain("T-Shirt Size,Dietary");
    expect(result.csv).toContain('"Alice Smith"');
    expect(result.csv).toContain('"M","Vegetarian"');
  });
});
