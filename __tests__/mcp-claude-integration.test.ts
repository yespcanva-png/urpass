import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/mcp/route";
import { GET as getOAuthMetadata } from "@/app/.well-known/oauth-authorization-server/route";
import { GET as getOAuthStatus, DELETE as deleteOAuthStatus } from "@/app/api/oauth/status/route";
import { POST as postOAuthAuthorize } from "@/app/api/oauth/authorize/route";
import {
  createAuthorizationCode,
  exchangeCodeForTokens,
  refreshAccessToken,
  revokeOAuthToken,
  verifyOAuthToken,
  verifyPkce,
  revokeUserConnections,
} from "@/lib/mcp/oauth";

// Mock Supabase
const mockGetUser = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(() => ({
    auth: {
      getUser: () => mockGetUser(),
    },
  })),
}));

// Mock core functions
const mockListEvents = vi.fn();
const mockGetEvent = vi.fn();
const mockCreateEvent = vi.fn();
const mockUpdateEvent = vi.fn();
const mockListTicketTiers = vi.fn();
const mockCreateTicketTier = vi.fn();
const mockGetRegistrations = vi.fn();
const mockGetEventAnalytics = vi.fn();
const mockGetEventReadiness = vi.fn();
const mockGetScannerStats = vi.fn();
const mockPublishEvent = vi.fn();
const mockSubmitToExplore = vi.fn();

vi.mock("@/lib/mcp/core", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    mcpListEvents: (...args: any[]) => mockListEvents(...args),
    mcpGetEvent: (...args: any[]) => mockGetEvent(...args),
    mcpCreateEvent: (...args: any[]) => mockCreateEvent(...args),
    mcpUpdateEvent: (...args: any[]) => mockUpdateEvent(...args),
    mcpListTicketTiers: (...args: any[]) => mockListTicketTiers(...args),
    mcpCreateTicketTier: (...args: any[]) => mockCreateTicketTier(...args),
    mcpGetRegistrations: (...args: any[]) => mockGetRegistrations(...args),
    mcpGetEventAnalytics: (...args: any[]) => mockGetEventAnalytics(...args),
    mcpGetEventReadiness: (...args: any[]) => mockGetEventReadiness(...args),
    mcpGetScannerStats: (...args: any[]) => mockGetScannerStats(...args),
    mcpPublishEvent: (...args: any[]) => mockPublishEvent(...args),
    mcpSubmitToExplore: (...args: any[]) => mockSubmitToExplore(...args),
  };
});

describe("UrPass Claude MCP Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. OAuth 2.0 Flow with PKCE", () => {
    it("verifies PKCE challenge and verifier", () => {
      const verifier = "secret-pkce-verifier-string-123456789";
      expect(verifyPkce(verifier, verifier, "plain")).toBe(true);
      expect(verifyPkce(verifier, "wrong", "plain")).toBe(false);
    });

    it("creates authorization code and exchanges for tokens", () => {
      const code = createAuthorizationCode({
        clientId: "claude",
        userId: "user-test-456",
        organizationId: "org-test-789",
        scopes: ["events:read", "events:write", "tickets:read", "tickets:write", "attendees:read", "analytics:read"],
        redirectUri: "https://claude.ai/api/auth/callback",
      });

      expect(code.startsWith("urp_mcp_ac_")).toBe(true);

      const tokens = exchangeCodeForTokens({
        code,
        clientId: "claude",
        redirectUri: "https://claude.ai/api/auth/callback",
      });

      expect(tokens.accessToken.startsWith("urp_mcp_at_")).toBe(true);
      expect(tokens.refreshToken.startsWith("urp_mcp_rt_")).toBe(true);
      expect(tokens.userId).toBe("user-test-456");
      expect(tokens.organizationId).toBe("org-test-789");

      // Verify token lookup
      const record = verifyOAuthToken(tokens.accessToken);
      expect(record).not.toBeNull();
      expect(record?.userId).toBe("user-test-456");

      // Code should be single-use (consumed)
      expect(() =>
        exchangeCodeForTokens({
          code,
          clientId: "claude",
        })
      ).toThrow("Invalid or expired authorization code");
    });

    it("refreshes access token and invalidates old one", () => {
      const code = createAuthorizationCode({
        clientId: "claude",
        userId: "user-refresh-test",
        scopes: ["events:read"],
        redirectUri: "https://claude.ai/api/auth/callback",
      });

      const original = exchangeCodeForTokens({ code, clientId: "claude" });
      const refreshed = refreshAccessToken(original.refreshToken);

      expect(refreshed.accessToken).not.toBe(original.accessToken);
      expect(verifyOAuthToken(original.accessToken)).toBeNull();
      expect(verifyOAuthToken(refreshed.accessToken)).not.toBeNull();
    });

    it("revokes token immediately", () => {
      const code = createAuthorizationCode({
        clientId: "claude",
        userId: "user-revoke-test",
        scopes: ["events:read"],
        redirectUri: "https://claude.ai/api/auth/callback",
      });

      const { accessToken } = exchangeCodeForTokens({ code, clientId: "claude" });
      expect(verifyOAuthToken(accessToken)).not.toBeNull();

      const revoked = revokeOAuthToken(accessToken);
      expect(revoked).toBe(true);
      expect(verifyOAuthToken(accessToken)).toBeNull();
    });

    it("handles user denial during consent", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: "user-deny" } } });
      const req = new NextRequest("http://localhost/api/oauth/authorize", {
        method: "POST",
        body: JSON.stringify({
          clientId: "claude",
          redirectUri: "https://claude.ai/oauth/callback",
          state: "xyzState123",
          action: "deny",
        }),
      });

      const res = await postOAuthAuthorize(req);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.redirectUrl).toContain("error=access_denied");
      expect(json.redirectUrl).toContain("state=xyzState123");
    });
  });

  describe("2. RFC 8414 Authorization Server Metadata", () => {
    it("returns standards-compliant OAuth 2.0 metadata for Claude discovery", async () => {
      const res = await getOAuthMetadata();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.issuer).toBe("https://urpass.space");
      expect(json.authorization_endpoint).toBe("https://urpass.space/api/oauth/authorize");
      expect(json.token_endpoint).toBe("https://urpass.space/api/oauth/token");
      expect(json.revocation_endpoint).toBe("https://urpass.space/api/oauth/revoke");
      expect(json.response_types_supported).toContain("code");
      expect(json.code_challenge_methods_supported).toContain("S256");
      expect(json.scopes_supported).toContain("events:read");
      expect(json.scopes_supported).toContain("events:write");
    });
  });

  describe("3. Backend Connection Status API", () => {
    it("returns connected: false when user has no active Claude tokens", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: "user-unconnected" } } });
      const req = new NextRequest("http://localhost/api/oauth/status", { method: "GET" });
      const res = await getOAuthStatus(req);
      const json = await res.json();
      expect(json.connected).toBe(false);
    });

    it("returns connected: true with scopes when user has active Claude tokens", async () => {
      const userId = "user-connected-test";
      const code = createAuthorizationCode({
        clientId: "claude",
        userId,
        scopes: ["events:read", "events:write", "tickets:read"],
        redirectUri: "https://claude.ai/api/auth/callback",
      });
      exchangeCodeForTokens({ code, clientId: "claude" });

      mockGetUser.mockResolvedValueOnce({ data: { user: { id: userId } } });
      const req = new NextRequest("http://localhost/api/oauth/status", { method: "GET" });
      const res = await getOAuthStatus(req);
      const json = await res.json();

      expect(json.connected).toBe(true);
      expect(json.clientId).toBe("claude");
      expect(json.scopes).toContain("events:read");
    });

    it("revokes user connections upon DELETE /api/oauth/status", async () => {
      const userId = "user-disconnect-test";
      const code = createAuthorizationCode({
        clientId: "claude",
        userId,
        scopes: ["events:read"],
        redirectUri: "https://claude.ai/api/auth/callback",
      });
      const { accessToken } = exchangeCodeForTokens({ code, clientId: "claude" });

      mockGetUser.mockResolvedValueOnce({ data: { user: { id: userId } } });
      const req = new NextRequest("http://localhost/api/oauth/status", { method: "DELETE" });
      const res = await deleteOAuthStatus(req);
      const json = await res.json();

      expect(json.success).toBe(true);
      expect(json.connected).toBe(false);
      expect(verifyOAuthToken(accessToken)).toBeNull();
    });
  });

  describe("4. Remote MCP Endpoint with OAuth Bearer Token", () => {
    let validAccessToken: string;

    beforeEach(() => {
      const code = createAuthorizationCode({
        clientId: "claude",
        userId: "usr-claude-user",
        organizationId: "org-primary",
        scopes: ["events:read", "events:write", "tickets:read", "tickets:write", "attendees:read", "analytics:read"],
        redirectUri: "https://claude.ai/api/auth/callback",
      });
      const tokens = exchangeCodeForTokens({ code, clientId: "claude" });
      validAccessToken = tokens.accessToken;
    });

    it("returns MCP tools list including Claude-specific tools", async () => {
      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/list",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      const toolNames = json.result.tools.map((t: any) => t.name);

      expect(toolNames).toContain("list_events");
      expect(toolNames).toContain("get_event");
      expect(toolNames).toContain("create_event");
      expect(toolNames).toContain("update_event");
      expect(toolNames).toContain("list_ticket_tiers");
      expect(toolNames).toContain("create_ticket_tier");
      expect(toolNames).toContain("get_registrations");
      expect(toolNames).toContain("get_event_analytics");
      expect(toolNames).toContain("get_event_readiness");
      expect(toolNames).toContain("get_scanner_stats");
      expect(toolNames).toContain("publish_event");
      expect(toolNames).toContain("submit_to_explore");
    });

    it("executes list_events via OAuth token", async () => {
      mockListEvents.mockResolvedValueOnce({
        events: [{ id: "evt-1", name: "AI Summit 2026", status: "active" }],
        total: 1,
      });

      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "tools/call",
          params: {
            name: "list_events",
            arguments: { limit: 10 },
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.result.isError).toBeUndefined();
      const content = JSON.parse(json.result.content[0].text);
      expect(content.events[0].name).toBe("AI Summit 2026");
    });

    it("executes create_event and creates a draft event", async () => {
      mockCreateEvent.mockResolvedValueOnce({
        event: { id: "evt-draft-1", name: "Christmas Carnival", status: "draft" },
        applyUrl: "https://urpass.space/apply/christmas-carnival-101",
        editorUrl: "https://urpass.space/event/evt-draft-1",
      });

      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "tools/call",
          params: {
            name: "create_event",
            arguments: {
              name: "Christmas Carnival",
              event_date: "2026-12-25",
              start_time: "10:00 AM",
              venue: "Palace Grounds, Bangalore",
              attendee_limit: 1000,
            },
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      const content = JSON.parse(json.result.content[0].text);
      expect(content.event.name).toBe("Christmas Carnival");
      expect(content.event.status).toBe("draft");
    });

    it("executes create_ticket_tier", async () => {
      mockCreateTicketTier.mockResolvedValueOnce({
        success: true,
        message: "Ticket tier 'VIP Entry' created at ₹799",
        tier: { id: "tt-1", name: "VIP Entry", priceINR: 799, pricePaise: 79900 },
      });

      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 4,
          method: "tools/call",
          params: {
            name: "create_ticket_tier",
            arguments: {
              eventId: "evt-draft-1",
              name: "VIP Entry",
              price: 799,
              capacity: 100,
            },
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      const content = JSON.parse(json.result.content[0].text);
      expect(content.tier.priceINR).toBe(799);
    });

    it("executes publish_event requiring confirmation", async () => {
      mockPublishEvent.mockResolvedValueOnce({
        requiresConfirmation: true,
        message: "Event is ready to publish. Please pass confirm: true to make it live to attendees.",
      });

      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 5,
          method: "tools/call",
          params: {
            name: "publish_event",
            arguments: {
              eventId: "evt-draft-1",
            },
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      const content = JSON.parse(json.result.content[0].text);
      expect(content.requiresConfirmation).toBe(true);
    });

    it("executes submit_to_explore requiring confirmation", async () => {
      mockSubmitToExplore.mockResolvedValueOnce({
        requiresConfirmation: true,
        message: "Event is eligible. Pass confirm: true to submit to Explore moderation.",
      });

      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 6,
          method: "tools/call",
          params: {
            name: "submit_to_explore",
            arguments: {
              eventId: "evt-draft-1",
              city: "Bangalore",
              category: "tech-conferences",
            },
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      const content = JSON.parse(json.result.content[0].text);
      expect(content.requiresConfirmation).toBe(true);
    });
  });
});
