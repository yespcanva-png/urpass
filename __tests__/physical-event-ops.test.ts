import { describe, it, expect, beforeEach } from "vitest";
import {
  buildDefaultBadgeTemplates,
  getBadgeTemplates,
  saveBadgeTemplate,
  queueBadgePrint,
  updateBadgePrintStatus,
  recordBadgeReprint,
  getBadgePrintQueue,
  getBadgePrintLogs,
} from "@/lib/physical-ops/badge-service";
import {
  getEventZones,
  saveEventZone,
  getAccessRules,
  saveAccessRule,
  evaluateZoneAccess,
  recordZoneScan,
} from "@/lib/physical-ops/zone-service";
import {
  registerWalkIn,
  searchDeskAttendees,
  checkInDeskAttendee,
} from "@/lib/physical-ops/desk-service";
import {
  getStaffAssignments,
  saveStaffAssignment,
  getOpsDevices,
  recordDeviceHeartbeat,
} from "@/lib/physical-ops/staff-device-service";
import {
  logOpsAudit,
  triggerOpsAlert,
  getOpsAlerts,
  getOpsAuditLogs,
} from "@/lib/physical-ops/audit-alert-service";
import { computeStage2Analytics } from "@/lib/physical-ops/analytics-service";

describe("Stage 2: Physical Event Operations Engine", () => {
  const eventId = "evt-test-ops-001";

  beforeEach(() => {
    // Reset global test storage
    globalThis.__urpass_badge_templates = {};
    globalThis.__urpass_badge_queue = {};
    globalThis.__urpass_badge_logs = {};
    globalThis.__urpass_zones = {};
    globalThis.__urpass_access_rules = {};
    globalThis.__urpass_zone_scans = {};
    globalThis.__urpass_desk_attendees = {};
    globalThis.__urpass_staff_assignments = {};
    globalThis.__urpass_devices = {};
    globalThis.__urpass_ops_audit = {};
    globalThis.__urpass_ops_alerts = {};
  });

  describe("Sprint 1 & 2: Badge Studio & Badge Printing", () => {
    it("generates default templates for all standard physical credential roles", () => {
      const templates = buildDefaultBadgeTemplates(eventId);
      expect(templates.length).toBe(6);
      const roles = templates.map((t) => t.badgeType);
      expect(roles).toContain("attendee");
      expect(roles).toContain("vip");
      expect(roles).toContain("speaker");
      expect(roles).toContain("staff");
      expect(roles).toContain("sponsor");
      expect(roles).toContain("exhibitor");

      // Verify template dimensions and layout structure
      const vipTemplate = templates.find((t) => t.badgeType === "vip");
      expect(vipTemplate?.widthMm).toBe(100);
      expect(vipTemplate?.heightMm).toBe(150);
      expect(vipTemplate?.layout.headerTitle).toBe("VIP ALL-ACCESS");
      expect(vipTemplate?.layout.showQrCode).toBe(true);
    });

    it("queues badge prints, updates status, and logs reprints with audit records", () => {
      const item = queueBadgePrint({
        eventId,
        attendeeId: "att-001",
        attendeeName: "Priya Sundaram",
        attendeeEmail: "priya@example.com",
        attendeeCompany: "Yesp Corp",
        badgeType: "vip",
      });
      expect(item.status).toBe("queued");

      const queue = getBadgePrintQueue(eventId);
      expect(queue.length).toBe(1);

      const printed = updateBadgePrintStatus(eventId, item.id, "printed", "Badge Station #1");
      expect(printed?.status).toBe("printed");
      expect(printed?.printedAt).toBeDefined();

      const reprintLog = recordBadgeReprint({
        eventId,
        attendeeId: "att-001",
        attendeeName: "Priya Sundaram",
        printType: "reprint",
        reprintReason: "Damaged Lanyard Pouch",
        printedByName: "Desk Staff Arun",
      });
      expect(reprintLog.reprintReason).toBe("Damaged Lanyard Pouch");

      const logs = getBadgePrintLogs(eventId);
      expect(logs.length).toBe(1);
    });
  });

  describe("Sprint 3: Onsite Registration Desk", () => {
    it("registers walk-in delegate, checks in, queues badge, and supports sub-second search", () => {
      const attendee = registerWalkIn({
        eventId,
        name: "Vikram Malhotra",
        email: "vikram@example.com",
        phone: "+91 98877 66554",
        company: "Stripe India",
        badgeType: "attendee",
        ticketName: "General Admission",
        paymentMethod: "upi",
        amountPaid: 499,
        autoCheckIn: true,
        autoQueuePrint: true,
      });

      expect(attendee.isCheckedIn).toBe(true);
      expect(attendee.paymentStatus).toBe("paid");
      expect(attendee.passToken).toContain("PASS-");

      // Verify print queue received item
      const queue = getBadgePrintQueue(eventId);
      expect(queue.length).toBe(1);
      expect(queue[0].attendeeName).toBe("Vikram Malhotra");

      // Search
      const searchResults = searchDeskAttendees(eventId, "vikram");
      expect(searchResults.length).toBe(1);
      expect(searchResults[0].company).toBe("Stripe India");
    });
  });

  describe("Sprint 4, 5 & 6: Zone Management, Access Rules, and Occupancy", () => {
    it("evaluates zone access rules by badge credential", () => {
      const vipZone = saveEventZone({
        eventId,
        name: "VIP Lounge",
        zoneType: "vip",
        capacity: 50,
      });

      saveAccessRule({
        eventId,
        zoneId: vipZone.id,
        name: "VIP Badge Credential Only",
        ruleType: "badge_type",
        allowedBadgeTypes: ["vip", "speaker"],
      });

      const rules = getAccessRules(eventId, vipZone.id);

      // Normal attendee scan attempt
      const regularAttendeeResult = evaluateZoneAccess({
        attendee: { id: "att-reg", name: "Regular Joe", badgeType: "attendee" },
        zoneId: vipZone.id,
        direction: "in",
        currentZone: vipZone,
        rules,
      });
      expect(regularAttendeeResult.allowed).toBe(false);
      expect(regularAttendeeResult.status).toBe("denied");

      // VIP attendee scan attempt
      const vipAttendeeResult = evaluateZoneAccess({
        attendee: { id: "att-vip", name: "VIP Executive", badgeType: "vip" },
        zoneId: vipZone.id,
        direction: "in",
        currentZone: vipZone,
        rules,
      });
      expect(vipAttendeeResult.allowed).toBe(true);
      expect(vipAttendeeResult.status).toBe("allowed");
    });

    it("enforces capacity protection limits and supports supervisor override", () => {
      const keynoteZone = saveEventZone({
        eventId,
        name: "Keynote Arena",
        zoneType: "main_hall",
        capacity: 2, // Tiny cap for testing
      });

      const rules: any[] = []; // open access

      // Scan in 2 attendees
      recordZoneScan({
        eventId,
        zoneId: keynoteZone.id,
        attendeeId: "att-1",
        attendeeName: "Attendee 1",
        direction: "in",
        status: "allowed",
      });
      recordZoneScan({
        eventId,
        zoneId: keynoteZone.id,
        attendeeId: "att-2",
        attendeeName: "Attendee 2",
        direction: "in",
        status: "allowed",
      });

      expect(keynoteZone.currentOccupancy).toBe(2);

      // 3rd attendee tries to enter — capacity protection triggers
      const blockedResult = evaluateZoneAccess({
        attendee: { id: "att-3", name: "Attendee 3", badgeType: "attendee" },
        zoneId: keynoteZone.id,
        direction: "in",
        currentZone: keynoteZone,
        rules,
        override: false,
      });
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.isCapacityFull).toBe(true);

      // Supervisor override authorized
      const overrideResult = evaluateZoneAccess({
        attendee: { id: "att-3", name: "Attendee 3", badgeType: "attendee" },
        zoneId: keynoteZone.id,
        direction: "in",
        currentZone: keynoteZone,
        rules,
        override: true,
      });
      expect(overrideResult.allowed).toBe(true);
      expect(overrideResult.status).toBe("capacity_override");

      // Scan direction: exit decreases headcount
      recordZoneScan({
        eventId,
        zoneId: keynoteZone.id,
        attendeeId: "att-1",
        attendeeName: "Attendee 1",
        direction: "out",
        status: "allowed",
      });
      expect(keynoteZone.currentOccupancy).toBe(1);
    });
  });

  describe("Sprint 8: Staff and Device Management", () => {
    it("provisions staff assignments and records device heartbeats", () => {
      const staff = saveStaffAssignment({
        eventId,
        staffName: "Karthik Raja",
        staffEmail: "karthik@example.com",
        role: "gate_scanner",
        gateName: "North Entrance Gate #1",
        pinCode: "4321",
      });
      expect(staff.pinCode).toBe("4321");

      const list = getStaffAssignments(eventId);
      expect(list.some((s) => s.staffName === "Karthik Raja")).toBe(true);

      const device = recordDeviceHeartbeat(
        eventId,
        "dev-tablet-01",
        "Entrance iPad Station",
        88,
        "North Entrance Gate #1",
        "Main Hall"
      );
      expect(device.isOnline).toBe(true);
      expect(device.batteryLevel).toBe(88);

      const devices = getOpsDevices(eventId);
      expect(devices.some((d) => d.deviceId === "dev-tablet-01")).toBe(true);
    });
  });

  describe("Sprint 9 & 10: Operational Alerts, Audit Logs, and Analytics", () => {
    it("logs immutable audit records, alerts, and calculates comprehensive ops analytics", () => {
      logOpsAudit(
        eventId,
        "capacity_override",
        "zone",
        "zone-vip",
        { reason: "Dean of Faculty Authorized" },
        "Chief Security Officer"
      );

      triggerOpsAlert(
        eventId,
        "zone_nearly_full",
        "warning",
        "Keynote Hall has reached 90% capacity"
      );

      const audits = getOpsAuditLogs(eventId);
      expect(audits.length).toBe(1);
      expect(audits[0].actionType).toBe("capacity_override");

      const alerts = getOpsAlerts(eventId);
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("zone_nearly_full");

      const analytics = computeStage2Analytics(eventId);
      expect(analytics.auditLogSummary.totalOverrides).toBe(1);
      expect(analytics.zoneOccupancyBreakdown.length).toBeGreaterThan(0);
    });
  });
});
