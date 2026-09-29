import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js & email modules ───────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/email", () => ({
  sendOrgInviteEmail: vi.fn().mockResolvedValue(undefined),
  sendPassEmail: vi.fn().mockResolvedValue(undefined),
}));

// ── Supabase mocks ─────────────────────────────────────────────────────────────
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { updateOrganization, deleteOrganization } from "@/app/actions/organizations";
import { updateMemberRole, removeMember, cancelInvite, resendInvite } from "@/app/actions/org-members";
import { updateWorkspace, deleteWorkspace, addWorkspaceMember } from "@/app/actions/workspaces";
import { updateLocation, deleteLocation } from "@/app/actions/locations";
import { saveOrgPaymentSettings, removeOrgPaymentSettings } from "@/app/actions/org-payment-settings";
import { deleteDomain } from "@/app/actions/domains";
import { lookupSSOByEmail } from "@/app/actions/sso";

describe("Module 1: Authentication, Workspaces & Multi-Tenant Authorization Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Organization Permissions & Role Enforcement", () => {
    it("updateOrganization: blocks callers who are not owner or admin", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-attacker" } } }) },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { role: "member" } }), // only regular member
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await updateOrganization("org-123", { name: "Hacked Org", brand_color: "#6D28D9" });
      expect(res).toEqual({ error: "Only organization owners and admins can update organization settings." });
    });

    it("deleteOrganization: blocks admin from deleting the organization (only owner allowed)", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-admin" } } }) },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { role: "admin" } }), // admin, not owner
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await deleteOrganization("org-123");
      expect(res).toEqual({ error: "Only the organization owner can delete the organization." });
    });
  });

  describe("Member Management & Role Modification Security", () => {
    it("updateMemberRole: blocks regular member from modifying roles", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-regular" } } }) },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "organization_members") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockImplementation(() => {
                // Return caller role as member
                return Promise.resolve({ data: { role: "member", organization_id: "org-1" } });
              }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await updateMemberRole("member-target", "org-slug", "admin");
      expect(res).toEqual({ error: "Only organization owners and admins can update member roles." });
    });

    it("removeMember: blocks non-admin from removing another member", async () => {
      let callCount = 0;
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-rogue" } } }) },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              // Target member
              return Promise.resolve({ data: { id: "target-123", organization_id: "org-1", role: "member", user_id: "other-user" } });
            }
            // Caller member
            return Promise.resolve({ data: { role: "member" } });
          }),
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await removeMember("target-123", "org-slug");
      expect(res).toEqual({ error: "Only organization owners and admins can remove members." });
    });

    it("cancelInvite: allows owner/admin to cancel pending invitations", async () => {
      let callCount = 0;
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }) },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve({ data: { id: "inv-1", organization_id: "org-1", status: "pending" } });
            }
            return Promise.resolve({ data: { role: "owner" } });
          }),
          delete: mockDelete,
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await cancelInvite("inv-1", "org-slug");
      expect(res).toBeUndefined();
    });
  });

  describe("Workspace Multi-Tenant IDOR Hardening", () => {
    it("updateWorkspace: prevents cross-tenant modification by verifying organization membership", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-attacker" } } }) },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }), // Attacker is not a member of target org
        }),
      };
      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { organization_id: "org-victim" } }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(createAdminClient).mockReturnValue(mockAdmin as any);

      const res = await updateWorkspace("ws-victim-1", { name: "Tampered Name", is_default: false, color: "#6D28D9" });
      expect(res).toEqual({ error: "Only organization owners and admins can update workspaces." });
    });

    it("deleteWorkspace: scopes deletion strictly to organization_id", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-owner" } } }) },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { role: "owner" } }),
        }),
      };
      const deleteEqMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { is_default: false } }),
          delete: vi.fn().mockReturnValue({ eq: deleteEqMock }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
      vi.mocked(createAdminClient).mockReturnValue(mockAdmin as any);

      const res = await deleteWorkspace("ws-1", "org-1");
      expect(res).toEqual({});
      expect(deleteEqMock).toHaveBeenCalled();
    });
  });

  describe("Payment Settings Authorization Hardening", () => {
    it("saveOrgPaymentSettings: rejects non-owner / non-admin callers", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-unauthorized" } } }) },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { role: "member" } }),
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await saveOrgPaymentSettings("org-1", "org-slug", "rzp_live_test123", "secret123");
      expect(res).toEqual({ error: "Only organization owners and admins can configure payment credentials." });
    });

    it("removeOrgPaymentSettings: rejects non-owner / non-admin callers", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-unauthorized" } } }) },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await removeOrgPaymentSettings("org-1", "org-slug");
      expect(res).toEqual({ error: "Only organization owners and admins can remove payment credentials." });
    });
  });

  describe("SSO & Domain Security", () => {
    it("lookupSSOByEmail: gracefully handles malformed and invalid email inputs", async () => {
      const r1 = await lookupSSOByEmail("");
      expect(r1).toEqual({ ssoAvailable: false, enforced: false });

      const r2 = await lookupSSOByEmail("invalid-email-without-at");
      expect(r2).toEqual({ ssoAvailable: false, enforced: false });

      const r3 = await lookupSSOByEmail("test@nodot");
      expect(r3).toEqual({ ssoAvailable: false, enforced: false });
    });

    it("deleteDomain: blocks non-admin users from deleting verified domains", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-regular" } } }) },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { role: "member" } }),
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const res = await deleteDomain("org-1", "domain-1");
      expect(res).toEqual({ success: false, error: "Only organization owners and admins can remove verified domains." });
    });
  });
});
