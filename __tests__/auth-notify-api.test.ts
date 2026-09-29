import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { mockGetUser, mockNotifyOwnerNewUser, mockNotifyOwnerUserLogin, mockSendUserWelcomeEmail } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockNotifyOwnerNewUser: vi.fn(),
  mockNotifyOwnerUserLogin: vi.fn(),
  mockSendUserWelcomeEmail: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

vi.mock("@/lib/email", () => ({
  notifyOwnerNewUser: mockNotifyOwnerNewUser,
  notifyOwnerUserLogin: mockNotifyOwnerUserLogin,
  sendUserWelcomeEmail: mockSendUserWelcomeEmail,
}));

import { POST } from "@/app/api/auth/notify/route";

describe("POST /api/auth/notify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires an authenticated session", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const req = new NextRequest("http://localhost:3000/api/auth/notify", {
      method: "POST",
      body: JSON.stringify({
        type: "login",
        email: "spoof@example.com",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(mockNotifyOwnerUserLogin).not.toHaveBeenCalled();
  });

  it("uses session identity instead of client-supplied identity", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-real",
          email: "real@example.com",
          user_metadata: { full_name: "Real User" },
        },
      },
    });

    const req = new NextRequest("http://localhost:3000/api/auth/notify", {
      method: "POST",
      headers: {
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
        "user-agent": "Vitest",
      },
      body: JSON.stringify({
        type: "login",
        email: "spoof@example.com",
        name: "Spoofed User",
        userId: "attacker",
        provider: "google",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockNotifyOwnerUserLogin).toHaveBeenCalledWith({
      name: "Real User",
      email: "real@example.com",
      provider: "google",
      userId: "user-real",
      ipAddress: "203.0.113.10",
      userAgent: "Vitest",
    });
  });

  it("sends signup notifications only to the authenticated user email", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-new",
          email: "new@example.com",
          user_metadata: {},
        },
      },
    });

    const req = new NextRequest("http://localhost:3000/api/auth/notify", {
      method: "POST",
      body: JSON.stringify({
        type: "signup",
        email: "victim@example.com",
        name: "New User",
        userId: "attacker",
        provider: "sso",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockNotifyOwnerNewUser).toHaveBeenCalledWith({
      name: "New User",
      email: "new@example.com",
      provider: "email",
      userId: "user-new",
    });
    expect(mockSendUserWelcomeEmail).toHaveBeenCalledWith({
      to: "new@example.com",
      name: "New User",
    });
  });
});
