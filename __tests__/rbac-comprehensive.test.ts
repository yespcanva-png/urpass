import { describe, expect, it } from "vitest";
import {
  evaluateAccess,
  createOfflinePermissionSnapshot,
  validateOfflineSnapshot,
  processReconnectedRevocation,
  canAssignPermissions,
  isProtectedOwner,
  cloneRoleTemplate,
  getRoleTemplate,
  getRolePermissions,
  BUILT_IN_ROLES,
  ALL_PERMISSIONS,
} from "@/lib/rbac";
import {
  isOrgRole,
  isAssignableOrgRole,
  hasOrgPermission,
  canChangeOrgMemberRole,
  canRemoveOrgMember,
} from "@/lib/authorization";

describe("Module M13 · Enterprise Security & RBAC Permission Management", () => {
  describe("Section 1 & 2: Role Templates and Permission Matrix", () => {
    it("defines all default role templates specified in Section 1", () => {
      expect(BUILT_IN_ROLES.super_admin).toBeDefined();
      expect(BUILT_IN_ROLES.owner).toBeDefined();
      expect(BUILT_IN_ROLES.admin).toBeDefined();
      expect(BUILT_IN_ROLES.event_manager).toBeDefined();
      expect(BUILT_IN_ROLES.registration_manager).toBeDefined();
      expect(BUILT_IN_ROLES.gate_supervisor).toBeDefined();
      expect(BUILT_IN_ROLES.gate_staff).toBeDefined();
      expect(BUILT_IN_ROLES.session_manager).toBeDefined();
      expect(BUILT_IN_ROLES.session_scanner).toBeDefined();
      expect(BUILT_IN_ROLES.finance).toBeDefined();
      expect(BUILT_IN_ROLES.analytics_viewer).toBeDefined();
      expect(BUILT_IN_ROLES.member).toBeDefined();
    });

    it("verifies permissions count and template integrity", () => {
      const ownerPerms = getRolePermissions("owner");
      const gateStaffPerms = getRolePermissions("gate_staff");
      const sessionScannerPerms = getRolePermissions("session_scanner");

      expect(ownerPerms.length).toBeGreaterThanOrEqual(20);
      expect(gateStaffPerms).toContain("attendance.scan_gate");
      expect(gateStaffPerms).not.toContain("org.manage_billing");
      expect(sessionScannerPerms).toContain("attendance.scan_session");
      expect(sessionScannerPerms).not.toContain("events.manage");
    });

    it("allows cloning role templates into custom organization roles", () => {
      const customGateLead = cloneRoleTemplate("gate_staff", "VIP Gate Lead", "org_123", {
        description: "Gate staff with attendance correction rights",
        addPermissions: ["attendance.correct"],
      });

      expect(customGateLead.name).toBe("VIP Gate Lead");
      expect(customGateLead.permissions).toContain("attendance.scan_gate");
      expect(customGateLead.permissions).toContain("attendance.correct");
      expect(customGateLead.permissions).not.toContain("org.manage_billing");
    });
  });

  describe("Section 5: Required RBAC Test Cases", () => {
    // 1. Gate Staff opens event billing -> Access denied
    it("Test 1: Gate Staff opens event billing -> Access denied", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_gate_1",
          organizationId: "org_acme",
          role: "gate_staff",
          status: "active",
        },
        permission: "org.manage_billing",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
        },
      });

      expect(result.allowed).toBe(false);
      expect(result.code).toBe("NO_PERMISSION");
    });

    // 2. Gate Staff scans assigned gate -> Allowed
    it("Test 2: Gate Staff scans assigned gate -> Allowed", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_gate_1",
          organizationId: "org_acme",
          role: "gate_staff",
          assignedEventIds: ["evt_fest_2026"],
          assignedGateIds: ["gate_north_vip"],
          status: "active",
        },
        permission: "attendance.scan_gate",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
          gateId: "gate_north_vip",
        },
      });

      expect(result.allowed).toBe(true);
    });

    // 3. Gate Staff scans unauthorized gate -> Denied
    it("Test 3: Gate Staff scans unauthorized gate -> Denied", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_gate_1",
          organizationId: "org_acme",
          role: "gate_staff",
          assignedEventIds: ["evt_fest_2026"],
          assignedGateIds: ["gate_north_vip"],
          status: "active",
        },
        permission: "attendance.scan_gate",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
          gateId: "gate_south_general",
        },
      });

      expect(result.allowed).toBe(false);
      expect(result.code).toBe("SCOPE_MISMATCH");
    });

    // 4. Session Scanner scans assigned session -> Allowed
    it("Test 4: Session Scanner scans assigned session -> Allowed", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_session_1",
          organizationId: "org_acme",
          role: "session_scanner",
          assignedEventIds: ["evt_fest_2026"],
          assignedSessionIds: ["sess_keynote_ai"],
          status: "active",
        },
        permission: "attendance.scan_session",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
          sessionId: "sess_keynote_ai",
          featureKey: "session_tracking",
        },
        event: {
          id: "evt_fest_2026",
          features: { session_tracking: true },
        },
      });

      expect(result.allowed).toBe(true);
    });

    // 5. Session Scanner edits ticket price -> Denied
    it("Test 5: Session Scanner edits ticket price -> Denied", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_session_1",
          organizationId: "org_acme",
          role: "session_scanner",
          status: "active",
        },
        permission: "events.manage",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
        },
      });

      expect(result.allowed).toBe(false);
      expect(result.code).toBe("NO_PERMISSION");
    });

    // 6. Registration Manager distributes tickets -> Allowed within assigned scope
    it("Test 6: Registration Manager distributes tickets -> Allowed within assigned scope", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_reg_mgr",
          organizationId: "org_acme",
          role: "registration_manager",
          assignedEventIds: ["evt_fest_2026"],
          status: "active",
        },
        permission: "tickets.distribute",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
          featureKey: "ticket_distribution",
        },
        event: {
          id: "evt_fest_2026",
          features: { ticket_distribution: true },
        },
      });

      expect(result.allowed).toBe(true);
    });

    // 7. Analytics Viewer edits attendance -> Denied
    it("Test 7: Analytics Viewer edits attendance -> Denied", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_analytics_1",
          organizationId: "org_acme",
          role: "analytics_viewer",
          status: "active",
        },
        permission: "attendance.correct",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
        },
      });

      expect(result.allowed).toBe(false);
      expect(result.code).toBe("NO_PERMISSION");
    });

    // 8. Event Manager changes organization owner -> Denied
    it("Test 8: Event Manager changes organization owner -> Denied", () => {
      const canChange = canChangeOrgMemberRole("event_manager", "owner");
      expect(canChange).toBe(false);

      const isProtected = isProtectedOwner("owner");
      expect(isProtected).toBe(true);
    });

    // 9. Staff accesses another organization's data -> Denied
    it("Test 9: Staff accesses another organization's data -> Denied", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_staff_acme",
          organizationId: "org_acme",
          role: "event_manager",
          status: "active",
        },
        permission: "events.view",
        target: {
          orgId: "org_competitor_inc",
          eventId: "evt_competitor_1",
        },
      });

      expect(result.allowed).toBe(false);
      expect(result.code).toBe("CROSS_ORG_DENIED");
    });

    // 10. Removed staff attempts another API action -> Denied
    it("Test 10: Removed staff attempts another API action -> Denied", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_revoked_1",
          organizationId: "org_acme",
          role: "gate_staff",
          status: "revoked",
        },
        permission: "attendance.scan_gate",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
          gateId: "gate_north",
        },
      });

      expect(result.allowed).toBe(false);
      expect(result.code).toBe("USER_REVOKED");
    });

    // 11. Revoked offline staff device reconnects -> Pending operations handled under revocation policy; no fresh authorization
    it("Test 11: Revoked offline staff device reconnects -> Pending operations handled under revocation policy; no fresh authorization", () => {
      const offlineSnap = createOfflinePermissionSnapshot({
        userId: "usr_offline_gate",
        organizationId: "org_acme",
        eventId: "evt_fest_2026",
        role: "gate_staff",
        assignedGateIds: ["gate_1"],
        validityHours: 12,
      });

      // While offline: valid
      const offlineCheck = validateOfflineSnapshot(offlineSnap, "attendance.scan_gate", "gate_1");
      expect(offlineCheck.valid).toBe(true);

      // Upon reconnect, server reports user was removed/revoked by admin
      const reconnectResult = processReconnectedRevocation(offlineSnap, true);
      expect(reconnectResult.allowFreshAuthorization).toBe(false);
      expect(reconnectResult.handlePendingOperationsPolicy).toBe("reconcile_with_revocation_flag");
    });

    // 12. Custom role tries to grant itself admin rights -> Denied (Privilege escalation prevented)
    it("Test 12: Custom role tries to grant itself admin rights -> Denied (Privilege escalation prevented)", () => {
      const eventManagerPerms = getRolePermissions("event_manager");
      const adminPerms = getRolePermissions("admin");

      // Event Manager does NOT hold org.manage_security or org.manage_billing
      const canEscalate = canAssignPermissions(eventManagerPerms, adminPerms);
      expect(canEscalate).toBe(false);
    });

    // 13. Disabled feature accessed with a valid role -> Denied for new operations
    it("Test 13: Disabled feature accessed with a valid role -> Denied for new operations", () => {
      const result = evaluateAccess({
        user: {
          id: "usr_admin_1",
          organizationId: "org_acme",
          role: "admin",
          status: "active",
        },
        permission: "attendance.scan_session",
        target: {
          orgId: "org_acme",
          eventId: "evt_fest_2026",
          featureKey: "session_tracking",
        },
        event: {
          id: "evt_fest_2026",
          features: {
            session_tracking: false, // Feature is turned off for this event
          },
        },
      });

      expect(result.allowed).toBe(false);
      expect(result.code).toBe("FEATURE_DISABLED");
    });
  });

  describe("Backwards Compatibility with lib/authorization", () => {
    it("preserves isOrgRole and isAssignableOrgRole checks", () => {
      expect(isOrgRole("owner")).toBe(true);
      expect(isOrgRole("admin")).toBe(true);
      expect(isOrgRole("registration_manager")).toBe(true);
      expect(isOrgRole("gate_staff")).toBe(true);
      expect(isOrgRole("session_scanner")).toBe(true);
      expect(isOrgRole("super_admin")).toBe(false);
      expect(isOrgRole(null)).toBe(false);

      expect(isAssignableOrgRole("registration_manager")).toBe(true);
      expect(isAssignableOrgRole("gate_staff")).toBe(true);
      expect(isAssignableOrgRole("owner")).toBe(false);
    });

    it("verifies hasOrgPermission with new and existing permission mappings", () => {
      expect(hasOrgPermission("owner", "manageMembers")).toBe(true);
      expect(hasOrgPermission("admin", "manageMembers")).toBe(true);
      expect(hasOrgPermission("registration_manager", "distributeTickets")).toBe(true);
      expect(hasOrgPermission("gate_staff", "manageBilling")).toBe(false);
    });

    it("protects owner from removal or demotion", () => {
      expect(canRemoveOrgMember("owner", "owner", false)).toBe(false);
      expect(canRemoveOrgMember("admin", "owner", false)).toBe(false);
      expect(canChangeOrgMemberRole("admin", "owner")).toBe(false);
    });
  });
});
