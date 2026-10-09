import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { signOutAction, requestPasswordReset } from "@/app/actions/auth";
import { POST as signOutPOST, GET as signOutGET } from "@/app/auth/signout/route";
import { GET as authCallbackGET } from "@/app/auth/callback/route";

// Mock email sending
vi.mock("@/lib/email", () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue({ id: "mock-reset-email-id" }),
  notifyOwnerNewUser: vi.fn().mockResolvedValue(undefined),
  notifyOwnerUserLogin: vi.fn().mockResolvedValue(undefined),
  sendUserWelcomeEmail: vi.fn().mockResolvedValue(undefined),
  getFromEmail: vi.fn().mockReturnValue("URPASS <urpass.space@yespstudio.com>"),
  getOwnerEmail: vi.fn().mockReturnValue("srinithin@yespstudio.com"),
}));

// Mock Supabase
const mockVerifyOtp = vi.fn().mockResolvedValue({ data: { user: { id: "user-123", email: "user@example.com", created_at: new Date().toISOString() }, session: { access_token: "tok" } }, error: null });
const mockExchangeCode = vi.fn().mockResolvedValue({ data: { user: { id: "user-123", email: "user@example.com", created_at: new Date().toISOString() }, session: { access_token: "tok" } }, error: null });
const mockSignOut = vi.fn().mockResolvedValue({ error: null });
const mockGenerateLink = vi.fn().mockResolvedValue({
  data: {
    properties: { hashed_token: "mock-hashed-token" },
    user: { id: "u-1", email: "user@example.com", user_metadata: { full_name: "Test User" } },
  },
  error: null,
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      admin: {
        generateLink: mockGenerateLink,
      },
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        ilike: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: { full_name: "Test User" } }),
        })),
      })),
    })),
  })),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      signOut: mockSignOut,
      verifyOtp: mockVerifyOtp,
      exchangeCodeForSession: mockExchangeCode,
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u-1", email: "user@example.com" } }, error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([
      { name: "sb-kxmxxqyxkoseksfaymqm-auth-token", value: "tok" },
      { name: "sb-kxmxxqyxkoseksfaymqm-auth-token.0", value: "tok0" },
    ]),
    delete: vi.fn(),
    set: vi.fn(),
  }),
}));

describe("Auth Flows, Logout, and Password Reset Hardening", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Sign Out Action & Route", () => {
    it("signOutAction clears cookies and terminates session", async () => {
      const result = await signOutAction();
      expect(result.success).toBe(true);
      expect(mockSignOut).toHaveBeenCalledWith({ scope: "local" });
    });

    it("POST /auth/signout cleans cookies and returns redirect to /login", async () => {
      const req = new NextRequest("http://localhost:3000/auth/signout", { method: "POST" });
      const res = await signOutPOST(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/login");
      expect(mockSignOut).toHaveBeenCalled();
    });

    it("GET /auth/signout cleans cookies and returns redirect to /login", async () => {
      const req = new NextRequest("http://localhost:3000/auth/signout", { method: "GET" });
      const res = await signOutGET(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/login");
    });
  });

  describe("Password Reset Link Generation & Delivery", () => {
    it("requestPasswordReset generates link and dispatches branded email", async () => {
      const result = await requestPasswordReset("user@example.com");
      expect(result.success).toBe(true);
      expect(mockGenerateLink).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "recovery",
          email: "user@example.com",
        })
      );
      const { sendPasswordResetEmail } = await import("@/lib/email");
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@example.com",
          resetUrl: expect.stringContaining("token_hash=mock-hashed-token"),
          name: "Test User",
        })
      );
    });

    it("requestPasswordReset rejects invalid email", async () => {
      const result = await requestPasswordReset("invalid-email");
      expect(result.error).toBe("Please enter a valid email address.");
    });
  });

  describe("Auth Callback with Password Reset Token Hash", () => {
    it("handles token_hash and type=recovery by redirecting to /auth/reset-password", async () => {
      const req = new Request("http://localhost:3000/auth/callback?token_hash=somehash&type=recovery");
      const res = await authCallbackGET(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/auth/reset-password");
      expect(mockVerifyOtp).toHaveBeenCalledWith(
        expect.objectContaining({
          token_hash: "somehash",
          type: "recovery",
        })
      );
    });

    it("handles code exchange and redirects to dashboard", async () => {
      const req = new Request("http://localhost:3000/auth/callback?code=valid-code");
      const res = await authCallbackGET(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
      expect(mockExchangeCode).toHaveBeenCalledWith("valid-code");
    });
  });
});
