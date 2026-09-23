import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/support/route";
import { NextRequest } from "next/server";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-test-123", email: "user@test.com" } },
      }),
    },
  }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  }),
}));

const mockSendSupportTeam = vi.fn().mockResolvedValue(undefined);
const mockSendSupportAck = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/email", () => ({
  sendSupportTicketNotificationToTeam: (...args: unknown[]) => mockSendSupportTeam(...args),
  sendSupportTicketAcknowledgement: (...args: unknown[]) => mockSendSupportAck(...args),
}));

describe("POST /api/support", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if email is invalid", async () => {
    const req = new NextRequest("http://localhost/api/support", {
      method: "POST",
      body: JSON.stringify({
        email: "not-an-email",
        topic: "Billing & Payments",
        message: "Need help with invoice",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("valid email");
  });

  it("returns 400 if topic is invalid", async () => {
    const req = new NextRequest("http://localhost/api/support", {
      method: "POST",
      body: JSON.stringify({
        email: "alex@example.com",
        topic: "Random Topic",
        message: "Need help with invoice",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("valid support topic");
  });

  it("returns 400 if message is too short", async () => {
    const req = new NextRequest("http://localhost/api/support", {
      method: "POST",
      body: JSON.stringify({
        email: "alex@example.com",
        topic: "Billing & Payments",
        message: "Hi",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("at least 5 characters");
  });

  it("creates a ticket successfully with unique random number id and notifies team & user", async () => {
    const req = new NextRequest("http://localhost/api/support", {
      method: "POST",
      body: JSON.stringify({
        email: "customer@email.com",
        topic: "Billing & Payments",
        message: "I need an updated tax invoice for my organization.",
        pageUrl: "https://urpass.space/dashboard/settings",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.ticketId).toMatch(/^\d{6}$/);

    expect(mockSendSupportTeam).toHaveBeenCalledWith(
      expect.objectContaining({
        ticketId: body.ticketId,
        customerEmail: "customer@email.com",
        topic: "Billing & Payments",
        message: "I need an updated tax invoice for my organization.",
        pageUrl: "https://urpass.space/dashboard/settings",
      })
    );

    expect(mockSendSupportAck).toHaveBeenCalledWith(
      expect.objectContaining({
        ticketId: body.ticketId,
        customerEmail: "customer@email.com",
        topic: "Billing & Payments",
      })
    );
  });

  it("supports optional attachments properly", async () => {
    const req = new NextRequest("http://localhost/api/support", {
      method: "POST",
      body: JSON.stringify({
        email: "customer@email.com",
        topic: "Technical Issue",
        message: "Screenshot attached showing error message when scanning tickets.",
        attachment: {
          name: "screenshot.png",
          size: 1024,
          type: "image/png",
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);

    expect(mockSendSupportTeam).toHaveBeenCalledWith(
      expect.objectContaining({
        attachment: expect.objectContaining({
          filename: "screenshot.png",
          contentType: "image/png",
        }),
      })
    );
  });
});
