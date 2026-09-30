import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase admin client
const mockUpsert = vi.fn().mockResolvedValue({ error: null });
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockSelect = vi.fn();
const mockFrom = vi.fn((table: string) => {
  if (table === "system_settings") {
    return {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: mockSelect,
        })),
      })),
      upsert: mockUpsert,
    };
  }
  if (table === "coupons") {
    return {
      insert: mockInsert,
    };
  }
  return {
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue({ data: [] }),
      })),
    })),
  };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

vi.mock("@/lib/email", () => ({
  sendSponsorshipApprovalEmail: vi.fn().mockResolvedValue({ success: true }),
}));

describe("Ops Campus Sponsorships Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (globalThis.__urpass_sponsorship_cache) {
      globalThis.__urpass_sponsorship_cache = [];
    }
  });

  it("submits a new sponsorship application and flags it as pending", async () => {
    mockSelect.mockResolvedValue({ data: null, error: null });
    const { addSponsorshipApplication, getSponsorshipApplications } = await import(
      "@/lib/ops/sponsorship"
    );

    const app = await addSponsorshipApplication({
      eventName: "HackTech 2026",
      collegeName: "IIT Madras",
      studentName: "Arjun Verma",
      email: "arjun@example.com",
      phone: "+91 9876543210",
      expectedAttendees: "500",
      eventDate: "2026-11-15",
    });

    expect(app.id).toBeDefined();
    expect(app.status).toBe("pending");
    expect(app.eventName).toBe("HackTech 2026");

    const list = await getSponsorshipApplications();
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list[0].email).toBe("arjun@example.com");
  });

  it("1-click approves an application, generates a voucher code and triggers approval email", async () => {
    const {
      addSponsorshipApplication,
      approveSponsorshipApplication,
      getSponsorshipApplications,
    } = await import("@/lib/ops/sponsorship");
    const { sendSponsorshipApprovalEmail } = await import("@/lib/email");

    const app = await addSponsorshipApplication({
      eventName: "Pravega 2026",
      collegeName: "IISc Bangalore",
      studentName: "Sneha Rao",
      email: "sneha@example.com",
    });

    const res = await approveSponsorshipApplication(app.id, "Founder Ops");
    expect(res.success).toBe(true);
    expect(res.application?.status).toBe("approved");
    expect(res.application?.voucherCode).toMatch(/^CAMPUS-/);
    expect(res.application?.reviewedBy).toBe("Founder Ops");

    expect(sendSponsorshipApprovalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "sneha@example.com",
        eventName: "Pravega 2026",
        voucherCode: res.application?.voucherCode,
      })
    );

    const updatedList = await getSponsorshipApplications();
    const target = updatedList.find((a) => a.id === app.id);
    expect(target?.status).toBe("approved");
  });

  it("rejects an application with custom reasoning", async () => {
    const {
      addSponsorshipApplication,
      rejectSponsorshipApplication,
      getSponsorshipApplications,
    } = await import("@/lib/ops/sponsorship");

    const app = await addSponsorshipApplication({
      eventName: "Commercial Expo",
      collegeName: "Private Entity",
      studentName: "Rohan",
      email: "rohan@example.com",
    });

    const res = await rejectSponsorshipApplication(
      app.id,
      "Only non-profit university fests qualify."
    );
    expect(res.success).toBe(true);
    expect(res.application?.status).toBe("rejected");
    expect(res.application?.rejectionReason).toBe("Only non-profit university fests qualify.");

    const list = await getSponsorshipApplications();
    const target = list.find((a) => a.id === app.id);
    expect(target?.status).toBe("rejected");
  });
});
