import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Next.js & Supabase
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { processSessionScan } from "@/lib/session-attendance";
import type {
  SessionScheduleConfig,
  SessionScanRequest,
  SessionAttendanceRecord,
} from "@/lib/session-attendance/types";
import { verifySessionOfflinePass, saveEventManifest } from "@/lib/offline-scanner";

describe("Enterprise Session-Wise Ticketing & Single QR Test Suite", () => {
  const eventId = "evt-summit-2026";

  const keynoteSession: SessionScheduleConfig = {
    id: "sess-keynote",
    eventId,
    name: "Opening Keynote",
    roomName: "Grand Auditorium",
    date: "2026-10-14",
    startTime: "09:00",
    endTime: "10:30",
    capacity: 500,
    allowCheckout: true,
  };

  const aiWorkshopSession: SessionScheduleConfig = {
    id: "sess-ai-workshop",
    eventId,
    name: "AI Workshop",
    roomName: "Workshop Lab 1",
    date: "2026-10-14",
    startTime: "11:00",
    endTime: "13:00",
    eligibleTicketTypeIds: ["tt-workshop", "tt-premium", "tt-vip"],
    capacity: 50,
    allowCheckout: true,
  };

  const vipRoundtableSession: SessionScheduleConfig = {
    id: "sess-vip-roundtable",
    eventId,
    name: "VIP Executive Roundtable",
    roomName: "Boardroom A",
    date: "2026-10-14",
    startTime: "16:00",
    endTime: "17:30",
    eligibleTicketTypeIds: ["tt-vip"],
    capacity: 20,
    allowCheckout: true,
    scannerOperatorEmails: ["vip-lead@urpass.space"],
  };

  const smallRoomSession: SessionScheduleConfig = {
    id: "sess-limited-room",
    eventId,
    name: "Fireside Chat",
    roomName: "Room 101",
    date: "2026-10-14",
    startTime: "14:00",
    endTime: "15:00",
    capacity: 2, // strictly 2 seats
    allowCheckout: true,
  };

  // Attendees
  const generalAttendee = {
    id: "att-general-01",
    name: "Arun Kumar",
    email: "arun@example.com",
    ticketTier: "General Pass",
    ticketTypeId: "tt-general",
    pass_status: "generated",
  };

  const premiumAttendee = {
    id: "att-premium-02",
    name: "Priya Sharma",
    email: "priya@example.com",
    ticketTier: "Premium Pass",
    ticketTypeId: "tt-premium",
    pass_status: "generated",
  };

  const vipAttendee = {
    id: "att-vip-03",
    name: "Vikram Malhotra",
    email: "vikram@example.com",
    ticketTier: "VIP All Access",
    ticketTypeId: "tt-vip",
    pass_status: "generated",
  };

  // Passes
  const generalPass = {
    id: "pass-general-01",
    pass_token: "TOKEN-GENERAL-01",
    status: "issued",
    pass_type: "General Pass",
    ticket_type_id: "tt-general",
  };

  const premiumPass = {
    id: "pass-premium-02",
    pass_token: "TOKEN-PREMIUM-02",
    status: "issued",
    pass_type: "Premium Pass",
    ticket_type_id: "tt-premium",
  };

  const vipPass = {
    id: "pass-vip-03",
    pass_token: "TOKEN-VIP-03",
    status: "issued",
    pass_type: "VIP All Access",
    ticket_type_id: "tt-vip",
  };

  describe("1. Ticket Tier & Entitlement Enforcement", () => {
    it("General ticket holder can access Keynote session", () => {
      const outcome = processSessionScan({
        session: keynoteSession,
        request: {
          eventId,
          sessionId: keynoteSession.id,
          credentialToken: generalPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: generalAttendee,
        passRecord: generalPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(true);
      expect(outcome.result.status).toBe("CHECKED_IN");
      expect(outcome.result.attendee?.name).toBe("Arun Kumar");
    });

    it("General ticket holder is DENIED entry to AI Workshop session", () => {
      const outcome = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: generalPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: generalAttendee,
        passRecord: generalPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(false);
      expect(outcome.result.status).toBe("UNAUTHORIZED_TIER");
      expect(outcome.result.error).toBe("TIER_ACCESS_DENIED");
    });

    it("Premium ticket holder is GRANTED entry to AI Workshop", () => {
      const outcome = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: premiumPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: premiumAttendee,
        passRecord: premiumPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(true);
      expect(outcome.result.status).toBe("CHECKED_IN");
    });

    it("Premium ticket holder is DENIED entry to VIP Executive Roundtable", () => {
      const outcome = processSessionScan({
        session: vipRoundtableSession,
        request: {
          eventId,
          sessionId: vipRoundtableSession.id,
          credentialToken: premiumPass.pass_token,
          operatorEmail: "vip-lead@urpass.space",
          action: "checkin",
        },
        attendee: premiumAttendee,
        passRecord: premiumPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(false);
      expect(outcome.result.status).toBe("UNAUTHORIZED_TIER");
    });

    it("VIP ticket holder is GRANTED entry to VIP Executive Roundtable", () => {
      const outcome = processSessionScan({
        session: vipRoundtableSession,
        request: {
          eventId,
          sessionId: vipRoundtableSession.id,
          credentialToken: vipPass.pass_token,
          operatorEmail: "vip-lead@urpass.space",
          action: "checkin",
        },
        attendee: vipAttendee,
        passRecord: vipPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(true);
      expect(outcome.result.status).toBe("CHECKED_IN");
    });

    it("Enforces scanner operator email permission on VIP session", () => {
      const outcome = processSessionScan({
        session: vipRoundtableSession,
        request: {
          eventId,
          sessionId: vipRoundtableSession.id,
          credentialToken: vipPass.pass_token,
          operatorEmail: "unauthorized-volunteer@urpass.space",
          action: "checkin",
        },
        attendee: vipAttendee,
        passRecord: vipPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(false);
      expect(outcome.result.status).toBe("OPERATOR_UNAUTHORIZED");
    });
  });

  describe("2. Security: Revoked, Cancelled, and Refunded Pass Rejection", () => {
    it("Denies admission when pass is revoked", () => {
      const revokedPass = { ...premiumPass, status: "revoked" };
      const outcome = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: revokedPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: premiumAttendee,
        passRecord: revokedPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(false);
      expect(outcome.result.status).toBe("REVOKED_CREDENTIAL");
    });

    it("Allows event-level checked-in pass to be admitted to session", () => {
      // Pass already checked in at main gate: pass.status = 'checked_in'
      const eventCheckedInPass = { ...premiumPass, status: "checked_in" };
      const outcome = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: eventCheckedInPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: premiumAttendee,
        passRecord: eventCheckedInPass,
        existingSessionRecords: [],
      });

      expect(outcome.result.success).toBe(true);
      expect(outcome.result.status).toBe("CHECKED_IN");
    });
  });

  describe("3. Single QR Across Multiple Sessions & Independent Attendance", () => {
    it("Same QR can be scanned into Session A and Session B independently", () => {
      // Step 1: Scan at Keynote
      const keynoteScan = processSessionScan({
        session: keynoteSession,
        request: {
          eventId,
          sessionId: keynoteSession.id,
          credentialToken: vipPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: vipAttendee,
        passRecord: vipPass,
        existingSessionRecords: [],
      });
      expect(keynoteScan.result.success).toBe(true);
      expect(keynoteScan.result.status).toBe("CHECKED_IN");

      // Keynote attendance record
      const keynoteRecord: SessionAttendanceRecord = {
        id: "rec-keynote-vip",
        sessionId: keynoteSession.id,
        eventId,
        attendeeId: vipAttendee.id,
        credentialId: vipPass.id,
        checkinTime: "2026-10-14T09:05:00.000Z",
        scannedBy: "staff@urpass.space",
        status: "checked_in",
      };

      // Step 2: Scan SAME QR at AI Workshop
      // Session B has NO records yet for this attendee
      const workshopScan = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: vipPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: vipAttendee,
        passRecord: vipPass,
        existingSessionRecords: [], // empty for session B!
        allOtherSessionRecords: [keynoteRecord],
      });

      expect(workshopScan.result.success).toBe(true);
      expect(workshopScan.result.status).toBe("CHECKED_IN");
    });

    it("Rejects duplicate in-session scans and preserves original timestamp", () => {
      const existingCheckin: SessionAttendanceRecord = {
        id: "rec-workshop-premium",
        sessionId: aiWorkshopSession.id,
        eventId,
        attendeeId: premiumAttendee.id,
        credentialId: premiumPass.id,
        checkinTime: "2026-10-14T11:02:00.000Z",
        scannedBy: "staff@urpass.space",
        status: "checked_in",
      };

      const outcome = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: premiumPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: premiumAttendee,
        passRecord: premiumPass,
        existingSessionRecords: [existingCheckin],
      });

      expect(outcome.result.success).toBe(false);
      expect(outcome.result.status).toBe("ALREADY_CHECKED_IN");
      expect(outcome.result.checkinTime).toBe("2026-10-14T11:02:00.000Z");
    });

    it("Supports checkout and calculates attendance duration correctly", () => {
      const activeRecord: SessionAttendanceRecord = {
        id: "rec-ai-workshop-active",
        sessionId: aiWorkshopSession.id,
        eventId,
        attendeeId: premiumAttendee.id,
        credentialId: premiumPass.id,
        checkinTime: "2026-10-14T11:00:00.000Z",
        scannedBy: "staff@urpass.space",
        status: "checked_in",
      };

      const outcome = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: premiumPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkout",
          scanTimestamp: "2026-10-14T12:30:00.000Z", // 90 minutes later
        },
        attendee: premiumAttendee,
        passRecord: premiumPass,
        existingSessionRecords: [activeRecord],
      });

      expect(outcome.result.success).toBe(true);
      expect(outcome.result.status).toBe("CHECKED_OUT");
      expect(outcome.result.durationMinutes).toBe(90);
    });

    it("Allows re-entry when attendee previously checked out", () => {
      const checkedOutRecord: SessionAttendanceRecord = {
        id: "rec-ai-workshop-checkedout",
        sessionId: aiWorkshopSession.id,
        eventId,
        attendeeId: premiumAttendee.id,
        credentialId: premiumPass.id,
        checkinTime: "2026-10-14T11:00:00.000Z",
        checkoutTime: "2026-10-14T12:00:00.000Z",
        durationMinutes: 60,
        scannedBy: "staff@urpass.space",
        status: "checked_out",
      };

      const outcome = processSessionScan({
        session: aiWorkshopSession,
        request: {
          eventId,
          sessionId: aiWorkshopSession.id,
          credentialToken: premiumPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
          scanTimestamp: "2026-10-14T12:15:00.000Z",
        },
        attendee: premiumAttendee,
        passRecord: premiumPass,
        existingSessionRecords: [checkedOutRecord],
      });

      expect(outcome.result.success).toBe(true);
      expect(outcome.result.status).toBe("CHECKED_IN");
      expect(outcome.result.message).toContain("RE-ADMITTED");
    });
  });

  describe("4. Capacity Enforcement & Room Occupancy Limits", () => {
    it("Blocks admission when room capacity is reached", () => {
      // Room has capacity 2, and 2 people are currently checked in
      const record1: SessionAttendanceRecord = {
        id: "rec-room-01",
        sessionId: smallRoomSession.id,
        eventId,
        attendeeId: "att-other-01",
        credentialId: "pass-other-01",
        checkinTime: "2026-10-14T14:02:00.000Z",
        scannedBy: "staff",
        status: "checked_in",
      };
      const record2: SessionAttendanceRecord = {
        id: "rec-room-02",
        sessionId: smallRoomSession.id,
        eventId,
        attendeeId: "att-other-02",
        credentialId: "pass-other-02",
        checkinTime: "2026-10-14T14:03:00.000Z",
        scannedBy: "staff",
        status: "checked_in",
      };

      const outcome = processSessionScan({
        session: smallRoomSession,
        request: {
          eventId,
          sessionId: smallRoomSession.id,
          credentialToken: generalPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: generalAttendee,
        passRecord: generalPass,
        existingSessionRecords: [record1, record2],
      });

      expect(outcome.result.success).toBe(false);
      expect(outcome.result.status).toBe("SESSION_FULL");
      expect(outcome.result.currentAttendanceCount).toBe(2);
      expect(outcome.result.remainingCapacity).toBe(0);
    });

    it("Allows admission when a checked-in attendee checks out, freeing a seat", () => {
      const record1Active: SessionAttendanceRecord = {
        id: "rec-room-01",
        sessionId: smallRoomSession.id,
        eventId,
        attendeeId: "att-other-01",
        credentialId: "pass-other-01",
        checkinTime: "2026-10-14T14:02:00.000Z",
        scannedBy: "staff",
        status: "checked_in",
      };
      const record2CheckedOut: SessionAttendanceRecord = {
        id: "rec-room-02",
        sessionId: smallRoomSession.id,
        eventId,
        attendeeId: "att-other-02",
        credentialId: "pass-other-02",
        checkinTime: "2026-10-14T14:03:00.000Z",
        checkoutTime: "2026-10-14T14:20:00.000Z", // Checked out!
        scannedBy: "staff",
        status: "checked_out",
      };

      const outcome = processSessionScan({
        session: smallRoomSession,
        request: {
          eventId,
          sessionId: smallRoomSession.id,
          credentialToken: generalPass.pass_token,
          operatorEmail: "staff@urpass.space",
          action: "checkin",
        },
        attendee: generalAttendee,
        passRecord: generalPass,
        existingSessionRecords: [record1Active, record2CheckedOut],
      });

      expect(outcome.result.success).toBe(true);
      expect(outcome.result.status).toBe("CHECKED_IN");
      expect(outcome.result.currentAttendanceCount).toBe(2); // 1 previous active + 1 new
      expect(outcome.result.remainingCapacity).toBe(0);
    });
  });

  describe("5. Offline Scanner Support for Sessions", () => {
    beforeEach(async () => {
      await saveEventManifest(eventId, "UrPass Tech Summit 2026", [
        {
          passId: generalPass.id,
          passToken: generalPass.pass_token,
          attendeeId: generalAttendee.id,
          name: generalAttendee.name,
          email: generalAttendee.email,
          passType: generalPass.pass_type,
          ticketTypeId: generalPass.ticket_type_id,
          checkedIn: false,
        },
      ]);
    });

    it("Verifies session offline pass and queues entry when valid", async () => {
      const res = await verifySessionOfflinePass({
        eventId,
        sessionId: keynoteSession.id,
        sessionTitle: keynoteSession.name,
        passToken: generalPass.pass_token,
        eligibleTicketTypeIds: [],
        guestCount: 1,
      });

      expect(res.offline).toBe(true);
      expect(res.status).toBe("CHECKED_IN");
      expect(res.scanOperationId).toBeTruthy();
    });

    it("Rejects session offline pass when ticket tier is unauthorized", async () => {
      const res = await verifySessionOfflinePass({
        eventId,
        sessionId: vipRoundtableSession.id,
        sessionTitle: vipRoundtableSession.name,
        passToken: generalPass.pass_token,
        eligibleTicketTypeIds: ["tt-vip"], // VIP only
      });

      expect(res.offline).toBe(true);
      expect(res.status).toBe("ACCESS_DENIED");
    });
  });
});
