import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/mcp/route";
import { NextRequest } from "next/server";

// Mock api-auth
const mockAuthenticateApiKey = vi.fn();
vi.mock("@/lib/api-auth", () => ({
  authenticateApiKey: (req: NextRequest) => mockAuthenticateApiKey(req),
}));

// Mock mcp core
vi.mock("@/lib/mcp/core", () => ({
  mcpListEvents: vi.fn().mockResolvedValue({
    events: [
      {
        id: "evt-123",
        name: "Test Hackathon 2026",
        event_date: "2026-10-15",
        venue: "Tech Park",
        status: "active",
      },
    ],
    total: 1,
    limit: 20,
    offset: 0,
  }),
  mcpGetEvent: vi.fn().mockResolvedValue({
    id: "evt-123",
    name: "Test Hackathon 2026",
    stats: { totalApplications: 50, approved: 45, checkedIn: 20 },
  }),
  mcpCreateEvent: vi.fn().mockResolvedValue({
    event: { id: "evt-new", name: "New Event" },
    applyUrl: "https://urpass.space/apply/new-event",
  }),
  mcpListAttendees: vi.fn().mockResolvedValue({
    attendees: [{ id: "att-1", name: "Alice", email: "alice@example.com" }],
    total: 1,
  }),
  mcpApproveAttendee: vi.fn().mockResolvedValue({
    success: true,
    passToken: "tok-abc",
  }),
  mcpRejectAttendee: vi.fn().mockResolvedValue({ success: true }),
  mcpLookupPass: vi.fn().mockResolvedValue({
    passToken: "tok-abc",
    status: "generated",
    attendee: { name: "Alice" },
  }),
  mcpVerifyCheckin: vi.fn().mockResolvedValue({
    success: true,
    message: "Checked in",
  }),
  mcpGetEventAnalytics: vi.fn().mockResolvedValue({
    eventName: "Test Hackathon",
    metrics: { totalApplications: 100, checkedIn: 80 },
  }),
  mcpIssuePass: vi.fn().mockResolvedValue({
    success: true,
    passToken: "tok-vip",
  }),
  mcpListSessions: vi.fn().mockResolvedValue({
    total: 2,
    sessions: [{ id: "sess-1", title: "AI Opening Keynote" }],
  }),
  mcpCreateSession: vi.fn().mockResolvedValue({
    success: true,
    session: { id: "sess-2", title: "Future of AI" },
  }),
  mcpListRooms: vi.fn().mockResolvedValue({
    rooms: [{ id: "rm-1", name: "Main Auditorium", capacity: 500 }],
  }),
  mcpListSpeakers: vi.fn().mockResolvedValue({
    speakers: [{ id: "spk-1", full_name: "Sarah Chen" }],
  }),
  mcpAssignSpeaker: vi.fn().mockResolvedValue({ success: true }),
  mcpVerifySessionCheckin: vi.fn().mockResolvedValue({
    status: "CHECKED_IN",
    success: true,
    attendee: { name: "Alice" },
  }),
  mcpGetConferenceAnalytics: vi.fn().mockResolvedValue({
    analytics: { totalSessions: 10, totalCapacity: 1500 },
  }),
}));

describe("MCP Endpoint (/api/mcp)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/mcp", () => {
    it("returns MCP server capabilities and tool list with CORS headers", async () => {
      mockAuthenticateApiKey.mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/mcp", { method: "GET" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");

      const json = await res.json();
      expect(json.name).toBe("urpass-mcp");
      expect(json.tools).toBeInstanceOf(Array);
      expect(json.tools.length).toBe(17);
      expect(json.tools.map((t: { name: string }) => t.name)).toContain("urpass_list_events");
      expect(json.tools.map((t: { name: string }) => t.name)).toContain("urpass_list_sessions");
      expect(json.tools.map((t: { name: string }) => t.name)).toContain("urpass_verify_session_checkin");
    });
  });

  describe("POST /api/mcp", () => {
    it("returns 401 when Authorization header is missing or invalid", async () => {
      mockAuthenticateApiKey.mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");

      const json = await res.json();
      expect(json.error.code).toBe(-32000);
      expect(json.error.message).toContain("Unauthorized");
    });

    it("handles initialize method correctly", async () => {
      mockAuthenticateApiKey.mockResolvedValue({ userId: "user-123", keyId: "key-123" });
      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 10,
          method: "initialize",
          params: { protocolVersion: "2024-11-05" },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.result.serverInfo.name).toBe("urpass-mcp");
      expect(json.result.capabilities.tools).toBeDefined();
    });

    it("handles tools/list method with 17 tools", async () => {
      mockAuthenticateApiKey.mockResolvedValue({ userId: "user-123", keyId: "key-123" });
      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 11,
          method: "tools/list",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.result.tools.length).toBe(17);
    });

    it("executes tools/call for urpass_list_events", async () => {
      mockAuthenticateApiKey.mockResolvedValue({ userId: "user-123", keyId: "key-123" });
      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 12,
          method: "tools/call",
          params: {
            name: "urpass_list_events",
            arguments: { status: "active" },
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.result.content[0].type).toBe("text");
      const parsed = JSON.parse(json.result.content[0].text);
      expect(parsed.events[0].name).toBe("Test Hackathon 2026");
    });

    it("returns error code -32601 when tool is not found", async () => {
      mockAuthenticateApiKey.mockResolvedValue({ userId: "user-123", keyId: "key-123" });
      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 13,
          method: "tools/call",
          params: {
            name: "non_existent_tool",
            arguments: {},
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.error.code).toBe(-32601);
      expect(json.error.message).toContain("Tool not found");
    });

    it("executes conference tools/call for urpass_list_sessions", async () => {
      mockAuthenticateApiKey.mockResolvedValue({ userId: "user-123", keyId: "key-123" });
      const req = new NextRequest("http://localhost/api/mcp", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 14,
          method: "tools/call",
          params: {
            name: "urpass_list_sessions",
            arguments: { eventId: "evt-123" },
          },
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.result.content[0].type).toBe("text");
      const parsed = JSON.parse(json.result.content[0].text);
      expect(parsed.sessions[0].title).toBe("AI Opening Keynote");
    });

    it("rejects query parameter authentication ?api_key=... with 400 Bad Request", async () => {
      const req = new NextRequest("http://localhost/api/mcp?api_key=urp_live_querykey", {
        method: "POST",
        body: JSON.stringify({ jsonrpc: "2.0", id: 15, method: "ping" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.code).toBe(-32600);
      expect(json.error.message).toContain("strictly forbidden");
    });
  });

  describe("OPTIONS /api/mcp", () => {
    it("returns 204 with CORS preflight headers", async () => {
      const { OPTIONS } = await import("@/app/api/mcp/route");
      const res = await OPTIONS();
      expect(res.status).toBe(204);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");
      expect(res.headers.get("access-control-allow-methods")).toContain("GET, POST, OPTIONS");
    });
  });
});
