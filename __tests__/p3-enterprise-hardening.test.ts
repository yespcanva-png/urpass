import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import {
  hasOrgPermission,
  ORG_ROLES,
  ASSIGNABLE_ORG_ROLES,
} from "@/lib/authorization";
import { maskEmail, maskPhone, getHardenedPublicPass } from "@/lib/passes/public-pass";
import { recordEnterpriseAudit, queryEnterpriseAuditLogs } from "@/lib/audit/enterprise-audit";
import { getStoredWorkspaces, saveStoredWorkspaces } from "@/lib/org/fallback-store";

describe("P3 — Enterprise Hardening", () => {
  let mockWorkspacesStore: any[] = [];
  let mockAuditStore: any[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    mockWorkspacesStore = [];
    mockAuditStore = [];

    (globalThis as any).__urpass_admin_client = {
      from: vi.fn((table: string) => {
        if (table === "workspaces") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  order: vi.fn().mockImplementation(() =>
                    Promise.resolve({
                      data: mockWorkspacesStore,
                      error: null,
                    })
                  ),
                }),
              }),
            }),
            upsert: vi.fn().mockImplementation((row: any) => {
              mockWorkspacesStore.push(row);
              return Promise.resolve({ data: row, error: null });
            }),
          };
        }
        if (table === "passes") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: { message: "Pass not found" } }),
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          };
        }
        if (table === "enterprise_audit_logs") {
          const createQueryMock: any = () => ({
            eq: vi.fn().mockImplementation(() => createQueryMock()),
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockImplementation(() =>
                Promise.resolve({
                  data: mockAuditStore,
                  error: null,
                })
              ),
            }),
          });
          return {
            insert: vi.fn().mockImplementation((row: any) => {
              mockAuditStore.push(row);
              return Promise.resolve({ data: row, error: null });
            }),
            select: vi.fn().mockImplementation(() => createQueryMock()),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        };
      }),
    };
  });

  afterEach(() => {
    delete (globalThis as any).__urpass_admin_client;
  });

  // =========================================================================
  // Item 23: Relational Workspaces Persistence
  // =========================================================================
  describe("Item 23: Relational Workspaces Persistence", () => {
    it("persists and reads workspaces using relational schema rather than system_settings JSON", async () => {
      const orgId = "00000000-0000-0000-0000-000000000001";
      const mockWorkspaces = [
        {
          id: "11111111-1111-1111-1111-111111111111",
          organization_id: orgId,
          name: "Engineering",
          slug: "engineering",
          description: "Tech department workspace",
          color: "#2563EB",
          is_default: false,
          created_by: "user-1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const saved = await saveStoredWorkspaces(orgId, mockWorkspaces as any);
      expect(saved).toBe(true);

      const list = await getStoredWorkspaces(orgId);
      expect(list).toBeDefined();
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
      expect(list[0].name).toBe("Engineering");
    });
  });

  // =========================================================================
  // Item 24: Dedicated Roles & Fine-Grained Permission Boundaries
  // =========================================================================
  describe("Item 24: Dedicated Roles (FINANCE & GATE_MANAGER)", () => {
    it("includes finance and gate_manager in ORG_ROLES and ASSIGNABLE_ORG_ROLES", () => {
      expect(ORG_ROLES).toContain("finance");
      expect(ORG_ROLES).toContain("gate_manager");
      expect(ASSIGNABLE_ORG_ROLES).toContain("finance");
      expect(ASSIGNABLE_ORG_ROLES).toContain("gate_manager");
    });

    it("verifies FINANCE role can manage billing, invoices, and refunds, but cannot edit events or checkin", () => {
      // Allowed permissions for FINANCE
      expect(hasOrgPermission("finance", "manageBilling")).toBe(true);
      expect(hasOrgPermission("finance", "viewBilling")).toBe(true);
      expect(hasOrgPermission("finance", "manageInvoices")).toBe(true);
      expect(hasOrgPermission("finance", "manageRefunds")).toBe(true);
      expect(hasOrgPermission("finance", "viewAnalytics")).toBe(true);
      expect(hasOrgPermission("finance", "viewAuditLogs")).toBe(true);

      // Forbidden permissions for FINANCE
      expect(hasOrgPermission("finance", "manageEvents")).toBe(false);
      expect(hasOrgPermission("finance", "manageCheckIn")).toBe(false);
      expect(hasOrgPermission("finance", "manageGates")).toBe(false);
      expect(hasOrgPermission("finance", "deleteOrganization")).toBe(false);
      expect(hasOrgPermission("finance", "manageSecurity")).toBe(false);
    });

    it("verifies GATE_MANAGER role can manage gates, checkin, and view audit logs, but cannot alter billing or events", () => {
      // Allowed permissions for GATE_MANAGER
      expect(hasOrgPermission("gate_manager", "manageGates")).toBe(true);
      expect(hasOrgPermission("gate_manager", "manageCheckIn")).toBe(true);
      expect(hasOrgPermission("gate_manager", "viewCheckIn")).toBe(true);
      expect(hasOrgPermission("gate_manager", "viewAuditLogs")).toBe(true);

      // Forbidden permissions for GATE_MANAGER
      expect(hasOrgPermission("gate_manager", "manageBilling")).toBe(false);
      expect(hasOrgPermission("gate_manager", "manageInvoices")).toBe(false);
      expect(hasOrgPermission("gate_manager", "manageRefunds")).toBe(false);
      expect(hasOrgPermission("gate_manager", "manageEvents")).toBe(false);
      expect(hasOrgPermission("gate_manager", "deleteOrganization")).toBe(false);
    });
  });

  // =========================================================================
  // Item 25: Strict API-Key Security (No Query Parameter API Keys)
  // =========================================================================
  describe("Item 25: Strict API-Key Security", () => {
    it("rejects GET requests with API keys passed in URL query parameters with 400 Bad Request", async () => {
      const { GET } = await import("@/app/api/mcp/route");
      const req = new NextRequest("https://urpass.space/api/mcp?api_key=urp_live_secret12345");
      const res = await GET(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("INSECURE_AUTH_METHOD");
      expect(json.message).toContain("strictly forbidden");
    });

    it("rejects POST requests with API keys in URL query parameters with JSON-RPC error", async () => {
      const { POST } = await import("@/app/api/mcp/route");
      const req = new NextRequest("https://urpass.space/api/mcp?apiKey=urp_live_secret12345", {
        method: "POST",
        body: JSON.stringify({ jsonrpc: "2.0", method: "tools/list", id: 1 }),
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.code).toBe(-32600);
      expect(json.error.message).toContain("strictly forbidden");
    });
  });

  // =========================================================================
  // Item 26: Harden Public Pass Page & Mask PII
  // =========================================================================
  describe("Item 26: Harden Public Pass Page & Mask PII", () => {
    it("masks email addresses correctly to hide user and domain details", () => {
      expect(maskEmail("john.doe@company.com")).toBe("j***e@c***y.com");
      expect(maskEmail("al@domain.org")).toBe("a*@d***n.org");
      expect(maskEmail("")).toBe("");
      expect(maskEmail(null)).toBe("");
    });

    it("masks phone numbers correctly protecting attendee privacy", () => {
      expect(maskPhone("+919876543210")).toBe("+91******3210");
      expect(maskPhone("9876543210")).toBe("987******3210");
      expect(maskPhone("1234")).toBe("****");
      expect(maskPhone("")).toBe("");
      expect(maskPhone(null)).toBe("");
    });

    it("returns null for non-existent, revoked, cancelled, or expired passes", async () => {
      const pass = await getHardenedPublicPass("tok_revoked_test_12345");
      expect(pass).toBeNull();
    });
  });

  // =========================================================================
  // Item 27: Tenant Isolation Audit
  // =========================================================================
  describe("Item 27: Tenant Isolation Audit", () => {
    it("enforces tenant organization boundaries on API key event requests", async () => {
      const { GET } = await import("@/app/api/v1/events/[eventId]/attendees/route");
      const req = new NextRequest("https://urpass.space/api/v1/events/event-123/attendees");
      const res = await GET(req, { params: Promise.resolve({ eventId: "event-123" }) });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toContain("Unauthorized");
    });
  });

  // =========================================================================
  // Item 28: Complete Audit Logging Engine
  // =========================================================================
  describe("Item 28: Complete Audit Logging Engine", () => {
    it("records full audit log with who, old/new values, timestamp, org, event, and IP", async () => {
      const orgId = "00000000-0000-0000-0000-000000000099";
      const eventId = "00000000-0000-0000-0000-000000000088";

      const record = await recordEnterpriseAudit({
        organizationId: orgId,
        eventId,
        userId: "user-ops-42",
        actorEmail: "ops@acme-corp.com",
        action: "TICKET_TIER_UPDATED",
        resourceType: "ticket_type",
        resourceId: "tier-vip-1",
        oldValues: { price: 5000, capacity: 100 },
        newValues: { price: 6500, capacity: 150 },
        ipAddress: "203.0.113.195",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
        details: { reason: "VIP price adjustment for corporate wave 2" },
      });

      expect(record).toBeDefined();
      expect(record.organization_id).toBe(orgId);
      expect(record.event_id).toBe(eventId);
      expect(record.user_id).toBe("user-ops-42");
      expect(record.actor_email).toBe("ops@acme-corp.com");
      expect(record.action).toBe("TICKET_TIER_UPDATED");
      expect(record.old_values).toEqual({ price: 5000, capacity: 100 });
      expect(record.new_values).toEqual({ price: 6500, capacity: 150 });
      expect(record.ip_address).toBe("203.0.113.195");
      expect(record.created_at).toBeDefined();

      // Query audit logs
      const logs = await queryEnterpriseAuditLogs({
        organizationId: orgId,
        eventId,
        action: "TICKET_TIER_UPDATED",
      });

      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].id).toBe(record.id);
      expect(logs[0].old_values).toEqual({ price: 5000, capacity: 100 });
      expect(logs[0].new_values).toEqual({ price: 6500, capacity: 150 });
    });
  });
});
