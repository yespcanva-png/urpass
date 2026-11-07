import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { adminClient, insert, lookup } = vi.hoisted(() => ({
  adminClient: vi.fn(),
  insert: vi.fn(),
  lookup: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({ adminClient }));
import { POST } from "@/app/api/sales/leads/route";

function request(payload: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/sales/leads", { method: "POST", body: JSON.stringify(payload), headers: { "content-type": "application/json" } });
}

const lead = { organisationName: "Campus Events", contactName: "Asha Sharma", email: "ASHA@example.com", consentToContact: true };

describe("enterprise lead capture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lookup.mockResolvedValue({ count: 0, error: null });
    insert.mockResolvedValue({ error: null });
    adminClient.mockReturnValue({ from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ gte: lookup }) }),
      insert,
    }) });
  });

  it("requires consent before saving contact details", async () => {
    const response = await POST(request({ ...lead, consentToContact: false }));
    expect(response.status).toBe(400);
    expect(adminClient).not.toHaveBeenCalled();
  });

  it("stores a new lead with separate marketing consent", async () => {
    const response = await POST(request({ ...lead, marketingOptIn: false, estimatedRegistrations: 800 }));
    expect(response.status).toBe(200);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      email: "asha@example.com", estimated_registrations: 800, consent_to_contact: true, marketing_opt_in: false,
    }));
  });

  it("does not create another lead for the same email within an hour", async () => {
    lookup.mockResolvedValue({ count: 1, error: null });
    const response = await POST(request(lead));
    expect(response.status).toBe(200);
    expect(insert).not.toHaveBeenCalled();
  });
});
