import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as googleCallbackGet, clearRecentExchangedCodes } from "@/app/auth/google/callback/route";
import { GET as googleRedirectGet } from "@/app/api/auth/google/redirect/route";
import {
  GOOGLE_OAUTH_NEXT_COOKIE,
  GOOGLE_OAUTH_NONCE_COOKIE,
} from "@/lib/supabase/auth-cookies";

// Mock Supabase admin client
const mockAdminUpdateUserById = vi.fn().mockResolvedValue({ data: {}, error: null });
const mockAdminCreateUser = vi.fn().mockResolvedValue({
  data: { user: { id: "test-user-id", email: "organizer@example.com" } },
  error: null,
});
const mockAdminGenerateLink = vi.fn().mockResolvedValue({
  data: {
    properties: {
      hashed_token: "mock_hash_token_123",
      verification_type: "magiclink",
    },
    user: { id: "test-user-id" },
  },
  error: null,
});
const mockAdminFrom = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    ilike: vi.fn().mockReturnValue({
      maybeSingle: vi.fn().mockResolvedValue({ data: { user_id: "test-user-id" } }),
    }),
  }),
  upsert: vi.fn().mockResolvedValue({ data: {}, error: null }),
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      admin: {
        updateUserById: mockAdminUpdateUserById,
        createUser: mockAdminCreateUser,
        generateLink: mockAdminGenerateLink,
      },
    },
    from: mockAdminFrom,
  }),
}));

// Mock @supabase/ssr createServerClient
const mockSignInWithOAuth = vi.fn().mockResolvedValue({
  data: {
    url: "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Furpass.space%2Fauth%2Fgoogle%2Fcallback",
  },
  error: null,
});
const mockExchangeCodeForSession = vi.fn().mockResolvedValue({
  data: {
    user: {
      id: "test-user-id",
      email: "organizer@example.com",
      created_at: "2020-01-01T00:00:00.000Z",
      user_metadata: { full_name: "Alex Organizer" },
      app_metadata: { provider: "google" },
    },
  },
  error: null,
});
const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: { cookies: { setAll: (cookies: unknown[]) => void } }) => {
    return {
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
        exchangeCodeForSession: vi.fn(async (code: string) => {
          const result = await mockExchangeCodeForSession(code);
          if (!result.error) {
            options.cookies.setAll([
              { name: "sb-auth-token", value: "token-abc", options: { path: "/" } },
            ]);
          }
          return result;
        }),
        getUser: mockGetUser,
      },
    };
  },
}));

// Mock cookies from next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}));

// Mock email notifications
vi.mock("@lib/email", () => ({
  notifyOwnerNewUser: vi.fn().mockResolvedValue(undefined),
  notifyOwnerUserLogin: vi.fn().mockResolvedValue(undefined),
  sendUserWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

describe("Google OAuth Routes", () => {
  const origFetch = global.fetch;

  function buildStateCookie(next = "/dashboard", nonce = "test-nonce-123") {
    const statePayload = Buffer.from(
      JSON.stringify({ next, nonce, redirect_uri: "https://urpass.space/auth/google/callback", ts: Date.now() })
    ).toString("base64url");

    return `${GOOGLE_OAUTH_NEXT_COOKIE}=${statePayload}; ${GOOGLE_OAUTH_NONCE_COOKIE}=${nonce}`;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    clearRecentExchangedCodes();
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        user: {
          id: "test-user-id",
          email: "organizer@example.com",
          created_at: "2020-01-01T00:00:00.000Z",
          user_metadata: { full_name: "Alex Organizer" },
          app_metadata: { provider: "google" },
        },
      },
      error: null,
    });
    mockSignInWithOAuth.mockResolvedValue({
      data: {
        url: "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Furpass.space%2Fauth%2Fgoogle%2Fcallback",
      },
      error: null,
    });
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-google-client-id.apps.googleusercontent.com";
    process.env.GOOGLE_CLIENT_SECRET = "mock-google-client-secret";
    process.env.NEXT_PUBLIC_APP_URL = "https://urpass.space";
  });

  afterEach(() => {
    global.fetch = origFetch;
  });

  describe("GET /api/auth/google/redirect", () => {
    it("redirects to Supabase-generated Google OAuth URL and stores nonce/next cookies", async () => {
      const req = new NextRequest("https://urpass.space/api/auth/google/redirect?next=/dashboard");
      const res = await googleRedirectGet(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toContain("https://accounts.google.com/o/oauth2/v2/auth");
      expect(location).toContain("redirect_uri=https%3A%2F%2Furpass.space%2Fauth%2Fgoogle%2Fcallback");
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: expect.objectContaining({
          redirectTo: "https://urpass.space/auth/google/callback",
          scopes: "openid email profile",
        }),
      });

      // Verify oauth_state_nonce cookie is set
      const nonceCookie = res.cookies.get(GOOGLE_OAUTH_NONCE_COOKIE);
      const nextCookie = res.cookies.get(GOOGLE_OAUTH_NEXT_COOKIE);
      expect(nonceCookie).toBeDefined();
      expect(nextCookie).toBeDefined();
    });
  });

  describe("GET /auth/google/callback", () => {
    it("redirects to login with error if error query parameter is present", async () => {
      const req = new NextRequest("https://urpass.space/auth/google/callback?error=access_denied", {
        headers: { cookie: buildStateCookie() },
      });
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/login?error=access_denied");
    });

    it("rejects callbacks without the stored nonce state", async () => {
      const req = new NextRequest("https://urpass.space/auth/google/callback?code=valid_code");
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/login?error=oauth_state_invalid");
      expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    });

    it("exchanges the Supabase OAuth code once and sets session cookies", async () => {
      const req = new NextRequest("https://urpass.space/auth/google/callback?code=valid_code", {
        headers: { cookie: buildStateCookie("/dashboard") },
      });
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/dashboard");
      expect(mockExchangeCodeForSession).toHaveBeenCalledTimes(1);
      expect(mockExchangeCodeForSession).toHaveBeenCalledWith("valid_code");
      expect(res.cookies.get("sb-auth-token")?.value).toBe("token-abc");
    });

    it("redirects to the stored next path after session exchange", async () => {
      const req = new NextRequest("https://urpass.space/auth/google/callback?code=valid_code", {
        headers: { cookie: buildStateCookie("/billing") },
      });
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/billing");
      expect(mockExchangeCodeForSession).toHaveBeenCalledTimes(1);
      expect(res.cookies.get("sb-auth-token")?.value).toBe("token-abc");
    });

    it("clears stale auth cookies when Supabase reports refresh_token_not_found", async () => {
      mockExchangeCodeForSession.mockResolvedValueOnce({
        data: { user: null },
        error: {
          code: "refresh_token_not_found",
          message: "Invalid Refresh Token: Refresh Token Not Found",
          status: 400,
        },
      });

      const req = new NextRequest("https://urpass.space/auth/google/callback?code=valid_code", {
        headers: { cookie: `${buildStateCookie()}; sb-kxmxxqyxkoseksfaymqm-auth-token=stale-token` },
      });
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/login?error=refresh_token_not_found");
      expect(res.cookies.get("sb-kxmxxqyxkoseksfaymqm-auth-token")?.value).toBe("");
    });
  });
});
