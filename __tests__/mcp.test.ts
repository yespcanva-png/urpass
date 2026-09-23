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
}));

describe("MCP Endpoint (/api/mcp)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/mcp", () => {
    it("returns MCP server capabilities and tool list", async () => {
      mockAuthenticateApiKey.mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/mcp", { method: "GET" });
      const res = await GET(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.name).toBe("urpass-mcp");
      expect(json.tools).toBeInstanceOf(Array);
      expect(json.tools.length).toBe(10);
      expect(json.tools.map((t: { name: string }) => t.name)).toContain("urpass_list_events");
      expect(json.tools.map((t: { name: string }) => t.name)).toContain("urpass_verify_checkin");
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

    it("handles tools/list method", async () => {
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
      expect(json.result.tools.length).toBe(10);
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
  });
});
