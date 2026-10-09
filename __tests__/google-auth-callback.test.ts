import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as googleCallbackGet, clearRecentExchangedCodes } from "@/app/auth/google/callback/route";
import { GET as googleRedirectGet } from "@/app/api/auth/google/redirect/route";

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
const mockSignInWithPassword = vi.fn().mockResolvedValue({
  data: { session: { access_token: "mock_token" }, user: { id: "test-user-id" } },
  error: null,
});
const mockVerifyOtp = vi.fn().mockResolvedValue({
  data: { session: { access_token: "mock_token" }, user: { id: "test-user-id" } },
  error: null,
});
const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: { cookies: { setAll: (cookies: unknown[]) => void } }) => {
    return {
      auth: {
        signInWithPassword: vi.fn(async (...args: unknown[]) => {
          const result = await mockSignInWithPassword(...args);
          if (!result.error) {
            options.cookies.setAll([
              { name: "sb-auth-token", value: "token-abc", options: { path: "/" } },
            ]);
          }
          return result;
        }),
        verifyOtp: vi.fn(async (...args: unknown[]) => {
          const result = await mockVerifyOtp(...args);
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
vi.mock("@/lib/email", () => ({
  notifyOwnerNewUser: vi.fn().mockResolvedValue(undefined),
  notifyOwnerUserLogin: vi.fn().mockResolvedValue(undefined),
  sendUserWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

describe("Google Standalone OAuth Routes", () => {
  const origFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    clearRecentExchangedCodes();
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-google-client-id.apps.googleusercontent.com";
    process.env.GOOGLE_CLIENT_SECRET = "mock-google-client-secret";
    process.env.NEXT_PUBLIC_APP_URL = "https://urpass.space";
  });

  afterEach(() => {
    global.fetch = origFetch;
  });

  describe("GET /api/auth/google/redirect", () => {
    it("redirects to Google Accounts OAuth URL and sets nonce cookie", async () => {
      const req = new NextRequest("https://urpass.space/api/auth/google/redirect?next=/dashboard");
      const res = await googleRedirectGet(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toContain("https://accounts.google.com/o/oauth2/v2/auth");
      expect(location).toContain("client_id=mock-google-client-id.apps.googleusercontent.com");
      expect(location).toContain("redirect_uri=https%3A%2F%2Furpass.space%2Fauth%2Fgoogle%2Fcallback");
      expect(location).toContain("response_type=code");
      expect(location).toContain("scope=openid+email+profile");

      const nonceCookie = res.cookies.get("oauth_state_nonce");
      expect(nonceCookie).toBeDefined();
    });
  });

  describe("GET /auth/google/callback", () => {
    it("redirects to login with error if error query parameter is present", async () => {
      const req = new NextRequest("https://urpass.space/auth/google/callback?error=access_denied");
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/login?error=access_denied");
    });

    it("exchanges Google authorization code for tokens, resolves profile in Supabase DB, and sets session cookies", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url === "https://oauth2.googleapis.com/token") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                access_token: "mock-access-token",
                id_token: "mock-valid-id-token",
              }),
          });
        }
        if (url.includes("googleapis.com/oauth2/v3/userinfo") || url.includes("oauth2.googleapis.com/tokeninfo")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                sub: "google-user-123",
                email: "organizer@example.com",
                email_verified: "true",
                name: "Alex Organizer",
                picture: "https://example.com/avatar.jpg",
                aud: "mock-google-client-id.apps.googleusercontent.com",
              }),
          });
        }
        return Promise.reject(new Error("Unknown URL: " + url));
      });

      const statePayload = Buffer.from(
        JSON.stringify({ next: "/dashboard", nonce: "test-nonce-123", redirect_uri: "https://urpass.space/auth/google/callback", ts: Date.now() })
      ).toString("base64url");

      const req = new NextRequest(`https://urpass.space/auth/google/callback?code=valid_code&state=${statePayload}`);
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/dashboard");
      expect(mockAdminGenerateLink).toHaveBeenCalled();
      expect(mockVerifyOtp).toHaveBeenCalled();
      expect(res.cookies.get("sb-auth-token")?.value).toBe("token-abc");
    });

    it("redirects to target path encoded in state after successful exchange", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url === "https://oauth2.googleapis.com/token") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                access_token: "mock-access-token",
                id_token: "mock-valid-id-token",
              }),
          });
        }
        if (url.includes("googleapis.com/oauth2/v3/userinfo") || url.includes("oauth2.googleapis.com/tokeninfo")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                sub: "google-user-123",
                email: "organizer@example.com",
                email_verified: "true",
                name: "Alex Organizer",
                picture: "https://example.com/avatar.jpg",
                aud: "mock-google-client-id.apps.googleusercontent.com",
              }),
          });
        }
        return Promise.reject(new Error("Unknown URL: " + url));
      });

      const statePayload = Buffer.from(
        JSON.stringify({ next: "/billing", nonce: "test-nonce-123", redirect_uri: "https://urpass.space/auth/google/callback", ts: Date.now() })
      ).toString("base64url");

      const req = new NextRequest(`https://urpass.space/auth/google/callback?code=valid_code_billing&state=${statePayload}`);
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/billing");
      expect(mockVerifyOtp).toHaveBeenCalled();
      expect(res.cookies.get("sb-auth-token")?.value).toBe("token-abc");
    });

    it("falls back to magiclink verifyOtp if direct signInWithPassword fails", async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: null,
        error: new Error("Invalid credentials"),
      });

      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url === "https://oauth2.googleapis.com/token") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                access_token: "mock-access-token",
                id_token: "mock-valid-id-token",
              }),
          });
        }
        if (url.includes("googleapis.com/oauth2/v3/userinfo")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                sub: "google-user-123",
                email: "organizer@example.com",
                email_verified: "true",
                name: "Alex Organizer",
                picture: "https://example.com/avatar.jpg",
                aud: "mock-google-client-id.apps.googleusercontent.com",
              }),
          });
        }
        return Promise.reject(new Error("Unknown URL: " + url));
      });

      const statePayload = Buffer.from(
        JSON.stringify({ next: "/dashboard", nonce: "test-nonce-123", redirect_uri: "https://urpass.space/auth/google/callback", ts: Date.now() })
      ).toString("base64url");

      const req = new NextRequest(`https://urpass.space/auth/google/callback?code=valid_code_otp&state=${statePayload}`);
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/dashboard");
      expect(mockAdminGenerateLink).toHaveBeenCalled();
      expect(mockVerifyOtp).toHaveBeenCalled();
      expect(res.cookies.get("sb-auth-token")?.value).toBe("token-abc");
    });

    it("falls back to JWT payload decode if userinfo endpoint fails", async () => {
      // Create a valid base64url JWT id_token
      const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
      const payload = Buffer.from(
        JSON.stringify({
          sub: "google-jwt-user-456",
          email: "jwt-user@example.com",
          email_verified: true,
          name: "JWT User",
          aud: "mock-google-client-id.apps.googleusercontent.com",
        })
      ).toString("base64url");
      const signature = Buffer.from("mock_signature").toString("base64url");
      const mockJwtToken = `${header}.${payload}.${signature}`;

      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url === "https://oauth2.googleapis.com/token") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ id_token: mockJwtToken }),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      const req = new NextRequest(`https://urpass.space/auth/google/callback?code=valid_code_jwt`);
      const res = await googleCallbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://urpass.space/dashboard");
      expect(mockVerifyOtp).toHaveBeenCalled();
    });
  });
});
