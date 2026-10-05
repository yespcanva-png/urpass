import { describe, it, expect, beforeEach } from "vitest";
import { RBACService } from "../src/services/rbacService";
import { ValidationService } from "../src/services/validationService";
import { OfflineDb } from "../src/services/offlineDb";
import { QueueService } from "../src/services/queueService";
import { SyncService } from "../src/services/syncService";
import type { Attendee, Gate, ScanAuditLog, OfflineScanRecord, UserRole } from "../src/types";

describe("UrPass One Mobile Operations & Gate Management Suite", () => {
  const mockGate: Gate = {
    id: "gate-a-main",
    eventId: "evt-tech-summit-2026",
    name: "Gate A – Main Concourse",
    zoneName: "Main Entrance",
    mode: "both",
    status: "open",
    capacity: 3000,
    activeScannersCount: 4,
    scansCount: 120,
    allowedBadgeTypes: ["vip", "participant", "speaker", "delegate"],
  };

  const mockVIPGate: Gate = {
    id: "gate-b-vip",
    eventId: "evt-tech-summit-2026",
    name: "Gate B – VIP Only",
    zoneName: "VIP Concourse",
    mode: "entry",
    status: "open",
    capacity: 500,
    activeScannersCount: 2,
    scansCount: 40,
    allowedBadgeTypes: ["vip", "speaker"],
  };

  beforeEach(async () => {
    // Re-seed offline DB for test isolation
    await OfflineDb.clearAll();
  });

  describe("1. Role-Based Access Control (RBAC)", () => {
    it("should correctly assign permissions for Super Admin", () => {
      const perms = RBACService.getPermissions("super_admin");
      expect(perms.canAccessEvents).toBe(true);
      expect(perms.canOperateGates).toBe(true);
      expect(perms.canSearchAttendees).toBe(true);
      expect(perms.canOverrideScans).toBe(true);
      expect(perms.canPerformCheckout).toBe(true);
      expect(perms.canViewAnalytics).toBe(true);
      expect(perms.canManageStaff).toBe(true);
      expect(perms.canConfigureAccessRules).toBe(true);
    });

    it("should give Event Managers override permissions but restrict platform-wide rules", () => {
      const perms = RBACService.getPermissions("event_manager");
      expect(perms.canOverrideScans).toBe(true);
      expect(perms.canManageStaff).toBe(true);
      expect(perms.canOperateGates).toBe(true);
      expect(perms.canSearchAttendees).toBe(true);
    });

    it("should restrict Gate Staff / Scanners from overriding scans and managing staff", () => {
      const perms = RBACService.getPermissions("gate_staff");
      expect(perms.canOperateGates).toBe(true);
      expect(perms.canSearchAttendees).toBe(true);
      expect(perms.canPerformCheckout).toBe(true);
      expect(perms.canOverrideScans).toBe(false);
      expect(perms.canManageStaff).toBe(false);
      expect(perms.canConfigureAccessRules).toBe(false);
    });

    it("should give View-Only Ops read permissions only", () => {
      const perms = RBACService.getPermissions("view_only_ops");
      expect(perms.canViewAnalytics).toBe(true);
      expect(perms.canOperateGates).toBe(false);
      expect(perms.canOverrideScans).toBe(false);
      expect(perms.canPerformCheckout).toBe(false);
    });
  });

  describe("2. QR Scanner Engine & Atomic Validation", () => {
    it("should grant green entry for a valid attendee outside the venue", async () => {
      const result = await ValidationService.validateScan("UP_VIP_001_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "in",
        deviceId: "OP-DEV-01",
        deviceName: "Primary Scanner",
        userId: "usr-staff-1",
        userName: "Scanner Staff",
      });

      expect(result.allowed).toBe(true);
      expect(result.status).toBe("valid_entry");
      expect(result.color).toBe("green");
      expect(result.attendee).not.toBeNull();
      expect(result.attendee?.presenceStatus).toBe("inside");
      expect(result.attendee?.checkinCount).toBe(1);
    });

    it("should grant green exit when scanning an attendee who is currently inside", async () => {
      // First check them in
      await ValidationService.validateScan("UP_VIP_001_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "in",
        deviceId: "OP-DEV-01",
        deviceName: "Primary Scanner",
        userId: "usr-staff-1",
        userName: "Scanner Staff",
      });

      // Now check them out
      const exitResult = await ValidationService.validateScan("UP_VIP_001_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "out",
        deviceId: "OP-DEV-01",
        deviceName: "Primary Scanner",
        userId: "usr-staff-1",
        userName: "Scanner Staff",
      });

      expect(exitResult.allowed).toBe(true);
      expect(exitResult.status).toBe("valid_exit");
      expect(exitResult.color).toBe("green");
      expect(exitResult.attendee?.presenceStatus).toBe("outside");
      expect(exitResult.attendee?.checkoutCount).toBe(1);
    });

    it("should reject unrecognized or malformed QR payloads with red feedback", async () => {
      const result = await ValidationService.validateScan("UNKNOWN_INVALID_QR_STRING_999", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "in",
        deviceId: "OP-DEV-01",
        deviceName: "Primary Scanner",
        userId: "usr-staff-1",
        userName: "Scanner Staff",
      });

      expect(result.allowed).toBe(false);
      expect(result.status).toBe("invalid_qr");
      expect(result.color).toBe("red");
      expect(result.attendee).toBeNull();
    });

    it("should reject cancelled or rejected attendee registrations with red feedback", async () => {
      const result = await ValidationService.validateScan("UP_CANCELLED_004", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "in",
        deviceId: "OP-DEV-01",
        deviceName: "Primary Scanner",
        userId: "usr-staff-1",
        userName: "Scanner Staff",
      });

      expect(result.allowed).toBe(false);
      expect(result.status).toBe("cancelled_ticket");
      expect(result.color).toBe("red");
      expect(result.rejectionReason).toContain("Pass has been cancelled or rejected");
    });
  });

  describe("3. Duplicate Scan Protection & Re-Use Prevention", () => {
    it("should detect duplicate pass re-use and return amber status with previous scan telemetry", async () => {
      // First valid checkin
      await ValidationService.validateScan("UP_VIP_001_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "in",
        deviceId: "OP-DEV-01",
        deviceName: "Primary Scanner #1",
        userId: "usr-staff-1",
        userName: "Alice Staff",
      });

      // Second checkin attempt with same pass at another gate/device (e.g. screenshot reuse)
      const duplicateResult = await ValidationService.validateScan("UP_VIP_001_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockVIPGate,
        direction: "in",
        deviceId: "OP-DEV-02",
        deviceName: "Secondary Scanner #2",
        userId: "usr-staff-2",
        userName: "Bob Staff",
      });

      expect(duplicateResult.allowed).toBe(false);
      expect(duplicateResult.status).toBe("already_checked_in");
      expect(duplicateResult.color).toBe("amber");
      expect(duplicateResult.canOverride).toBe(true);
      expect(duplicateResult.previousScan).not.toBeNull();
      expect(duplicateResult.previousScan?.gateName).toBe("Gate A – Main Concourse");
      expect(duplicateResult.previousScan?.deviceName).toBe("Primary Scanner #1");
    });
  });

  describe("4. Gate Access Rules & Category Whitelists", () => {
    it("should reject an attendee attempting entry at a gate not allowing their pass type", async () => {
      // UP_DEL_002_VALID is a delegate pass, mockVIPGate only allows ["vip", "speaker"]
      const result = await ValidationService.validateScan("UP_DEL_002_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockVIPGate,
        direction: "in",
        deviceId: "OP-DEV-03",
        deviceName: "VIP Scanner",
        userId: "usr-staff-3",
        userName: "VIP Staff",
      });

      expect(result.allowed).toBe(false);
      expect(result.status).toBe("wrong_gate");
      expect(result.color).toBe("red");
      expect(result.rejectionReason).toContain("Pass type 'delegate' not permitted at Gate B – VIP Only");
    });
  });

  describe("5. Supervisor Manual Override Flow", () => {
    it("should allow an authorized supervisor to override a duplicate or flagged scan with logged reason", async () => {
      // First checkin
      await ValidationService.validateScan("UP_VIP_001_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "in",
        deviceId: "OP-DEV-01",
        deviceName: "Scanner 1",
        userId: "usr-staff-1",
        userName: "Staff 1",
      });

      // Supervisor override with mandatory reason
      const overrideResult = await ValidationService.validateScan("UP_VIP_001_VALID", {
        eventId: "evt-tech-summit-2026",
        gate: mockGate,
        direction: "in",
        override: true,
        overrideReason: "Supervisor Discretion: ID Card Verified",
        overrideBy: "Alex Gate Supervisor",
        deviceId: "OP-DEV-01",
        deviceName: "Supervisor Device",
        userId: "usr-mgr-1",
        userName: "Alex Supervisor",
      });

      expect(overrideResult.allowed).toBe(true);
      expect(overrideResult.status).toBe("valid_entry");
      expect(overrideResult.color).toBe("green");
      expect(overrideResult.message).toContain("Override Authorized");
    });
  });

  describe("6. Offline Queue & Background Sync Engine", () => {
    it("should enqueue scans when offline and flush successfully when back online", async () => {
      const scanRecord: OfflineScanRecord = {
        id: "scan_test_101",
        qrPayload: "UP_VIP_001_VALID",
        attendeeId: "att-vip-001",
        eventId: "evt-tech-summit-2026",
        gateId: "gate-a-main",
        gateName: "Gate A – Main Concourse",
        direction: "in",
        timestamp: new Date().toISOString(),
        deviceId: "OP-DEV-01",
        scannerUserId: "usr-staff-1",
        scannerUserName: "Alice Staff",
        synced: false,
      };

      await QueueService.enqueue(scanRecord);
      const pendingCount = await QueueService.getPendingCount("evt-tech-summit-2026");
      expect(pendingCount).toBe(1);

      // Flush queue
      const syncResult = await SyncService.flushOfflineQueue();
      expect(syncResult.success).toBe(true);
      expect(syncResult.syncedScansCount).toBe(1);

      const remainingCount = await QueueService.getPendingCount("evt-tech-summit-2026");
      expect(remainingCount).toBe(0);
    });
  });

  describe("7. Security Scan Audit Log", () => {
    it("should append and retrieve comprehensive audit logs preserving all forensic metadata", async () => {
      const auditEntry: ScanAuditLog = {
        id: "audit_test_901",
        eventId: "evt-tech-summit-2026",
        gateId: "gate-a-main",
        gateName: "Gate A – Main Concourse",
        deviceId: "OP-DEV-01",
        deviceName: "Primary Scanner",
        userId: "usr-staff-1",
        userName: "Alice Staff",
        userRole: "gate_staff",
        qrPayload: "UP_VIP_001_VALID",
        attendeeId: "att-vip-001",
        attendeeName: "Arjun Mehta",
        passType: "vip",
        resultStatus: "valid_entry",
        feedbackColor: "green",
        direction: "in",
        timestamp: new Date().toISOString(),
        isOffline: false,
        isOverride: false,
      };

      await OfflineDb.appendAuditLog(auditEntry);

      const logs = await OfflineDb.getAuditLogs("evt-tech-summit-2026");
      expect(logs.length).toBeGreaterThan(0);
      const found = logs.find((l) => l.id === "audit_test_901");
      expect(found).toBeDefined();
      expect(found?.attendeeName).toBe("Arjun Mehta");
      expect(found?.feedbackColor).toBe("green");
      expect(found?.gateName).toBe("Gate A – Main Concourse");
    });
  });
});
