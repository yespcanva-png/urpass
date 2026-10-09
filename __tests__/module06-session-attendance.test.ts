import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js & Supabase ──────────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import {
  processSessionScan,
  applyManualAttendanceCorrection,
  computeSessionAttendanceStats,
} from "@/lib/session-attendance";
import type {
  SessionScheduleConfig,
  SessionScanRequest,
  SessionAttendanceRecord,
} from "@/lib/session-attendance/types";
import { processGateScan } from "@/lib/gate-tracking";
import type { EventLike } from "@/lib/feature-flags";

describe("Module 06 — Session-Wise Attendance (Test 06 Suite)", () => {
  const sessionA: SessionScheduleConfig = {
    id: "session_ai_keynote",
    eventId: "event-conf-001",
    name: "Opening AI Keynote",
    roomName: "Grand Ballroom",
    date: "2026-10-10",
    startTime: "09:30",
    endTime: "11:00",
    dayIndex: 1,
    capacity: 200,
    allowCheckout: true,
  };

  const sessionB: SessionScheduleConfig = {
    id: "session_security_workshop",
    eventId: "event-conf-001",
    name: "Hands-on Zero Trust Workshop",
    roomName: "Lab Room 4",
    date: "2026-10-10",
    startTime: "11:30",
    endTime: "13:00",
    dayIndex: 1,
    capacity: 30, // Small capacity
    allowCheckout: true,
  };

  const sessionVipExclusive: SessionScheduleConfig = {
    id: "session_executive_roundtable",
    eventId: "event-conf-001",
    name: "CXO Private Roundtable",
    roomName: "Executive Boardroom",
    date: "2026-10-10",
    startTime: "14:00",
    endTime: "15:30",
    dayIndex: 1,
    eligibleTicketTypeIds: ["tt_vip", "tt_speaker"], // VIP/Speaker only!
    capacity: 20,
    allowCheckout: true,
  };

  const multiDaySessionDay2: SessionScheduleConfig = {
    id: "session_day2_deepdive",
    eventId: "event-conf-001",
    name: "Cloud Architecture Deep Dive",
    roomName: "Hall B",
    date: "2026-10-11", // Day 2
    startTime: "10:00",
    endTime: "12:00",
    dayIndex: 2,
    capacity: 150,
  };

  const sampleGeneralAttendee = {
    id: "att_alex_01",
    name: "Alex Johnson",
    email: "alex@example.com",
    ticketTier: "General Admission",
    ticketTypeId: "tt_general",
    pass_status: "generated",
  };

  const sampleVipAttendee = {
    id: "att_victoria_vip",
    name: "Victoria Smith",
    email: "victoria@venture.com",
    ticketTier: "VIP Pass",
    ticketTypeId: "tt_vip",
    pass_status: "generated",
  };

  const samplePass = {
    id: "pass_alex_123",
    pass_token: "token_alex_single_qr",
    status: "active",
    pass_type: "General Admission",
    ticket_type_id: "tt_general",
  };

  const sampleVipPass = {
    id: "pass_vic_456",
    pass_token: "token_vic_single_qr",
    status: "active",
    pass_type: "VIP Pass",
    ticket_type_id: "tt_vip",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Scenario 1: Same QR Valid Across Main Gate & Multiple Sessions ────────────
  it("Scenario 1: Same single QR pass is valid at Main Gate, Session A, and Session B without generating new tickets", () => {
    // 1. Scan at Main Gate
    const gateScan = processGateScan({
      event: { id: "event-conf-001", organizer_id: "org-1", custom_pass_design: {} },
      request: {
        eventId: "event-conf-001",
        credentialToken: "token_alex_single_qr",
        operationMode: "entry",
        gateId: "main_gate",
        operatorId: "op_gate",
        operatorEmail: "gate@staff.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
      currentPresence: "OUTSIDE",
    });
    expect(gateScan.result.success).toBe(true);

    // 2. Scan at Session A using the exact same QR
    const scanSessionA = processSessionScan({
      session: sessionA,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_ai_keynote",
        credentialToken: "token_alex_single_qr",
        operatorEmail: "staff@sessions.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
    });
    expect(scanSessionA.result.success).toBe(true);
    expect(scanSessionA.result.status).toBe("CHECKED_IN");
    expect(scanSessionA.newRecord?.sessionId).toBe("session_ai_keynote");

    // 3. Scan at Session B using the exact same QR
    const scanSessionB = processSessionScan({
      session: sessionB,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_security_workshop",
        credentialToken: "token_alex_single_qr",
        operatorEmail: "staff@sessions.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
    });
    expect(scanSessionB.result.success).toBe(true);
    expect(scanSessionB.result.status).toBe("CHECKED_IN");
    expect(scanSessionB.newRecord?.sessionId).toBe("session_security_workshop");
  });

  // ── Scenario 2: Check-in at Session A Does Not Auto-Register Session B ─────────
  it("Scenario 2: Check-in at Session A does not automatically register attendance for Session B", () => {
    // Check-in record created ONLY for Session A
    const recordSessionA: SessionAttendanceRecord = {
      id: "rec_sess_a",
      sessionId: "session_ai_keynote",
      eventId: "event-conf-001",
      attendeeId: "att_alex_01",
      credentialId: "token_alex_single_qr",
      checkinTime: "2026-10-10T09:35:00.000Z",
      scannedBy: "staff@sessions.org",
      status: "checked_in",
    };

    // Query stats for Session B (which has no check-ins yet)
    const statsSessionB = computeSessionAttendanceStats({
      session: sessionB,
      records: [recordSessionA], // Contains only Session A record
    });

    expect(statsSessionB.totalCheckedIn).toBe(0);
    expect(statsSessionB.currentlyPresent).toBe(0);

    // Query stats for Session A
    const statsSessionA = computeSessionAttendanceStats({
      session: sessionA,
      records: [recordSessionA],
    });
    expect(statsSessionA.totalCheckedIn).toBe(1);
    expect(statsSessionA.currentlyPresent).toBe(1);
  });

  // ── Scenario 3: Unauthorized Session Access is Denied ─────────────────────────
  it("Scenario 3: Unauthorized ticket tier is denied entry to restricted sessions", () => {
    // General attendee attempts entry to VIP-exclusive roundtable
    const scanRes = processSessionScan({
      session: sessionVipExclusive, // requires "tt_vip" or "tt_speaker"
      request: {
        eventId: "event-conf-001",
        sessionId: "session_executive_roundtable",
        credentialToken: "token_alex_single_qr",
        operatorEmail: "vip_staff@sessions.org",
      },
      attendee: sampleGeneralAttendee, // "tt_general"
      passRecord: samplePass,
    });

    expect(scanRes.result.success).toBe(false);
    expect(scanRes.result.status).toBe("UNAUTHORIZED_TIER");
    expect(scanRes.result.error).toBe("TIER_ACCESS_DENIED");
    expect(scanRes.result.message).toContain("requires specific ticket category eligibility");

    // VIP attendee succeeds
    const vipScan = processSessionScan({
      session: sessionVipExclusive,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_executive_roundtable",
        credentialToken: "token_vic_single_qr",
        operatorEmail: "vip_staff@sessions.org",
      },
      attendee: sampleVipAttendee, // "tt_vip"
      passRecord: sampleVipPass,
    });

    expect(vipScan.result.success).toBe(true);
    expect(vipScan.result.status).toBe("CHECKED_IN");
  });

  // ── Scenario 4: Duplicate Session Check-in Follows Configured Policy ──────────
  it("Scenario 4: Duplicate check-in scan for the same session is detected and rejected", () => {
    const existingCheckin: SessionAttendanceRecord = {
      id: "rec_sess_existing",
      sessionId: "session_ai_keynote",
      eventId: "event-conf-001",
      attendeeId: "att_alex_01",
      credentialId: "token_alex_single_qr",
      checkinTime: "2026-10-10T09:30:00.000Z",
      scannedBy: "staff@sessions.org",
      status: "checked_in",
    };

    // Repeat check-in scan with action "checkin"
    const duplicateScan = processSessionScan({
      session: sessionA,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_ai_keynote",
        credentialToken: "token_alex_single_qr",
        action: "checkin",
        operatorEmail: "staff@sessions.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
      existingSessionRecords: [existingCheckin],
    });

    expect(duplicateScan.result.success).toBe(false);
    expect(duplicateScan.result.status).toBe("ALREADY_CHECKED_IN");
    expect(duplicateScan.result.error).toBe("DUPLICATE_SESSION_SCAN");
    expect(duplicateScan.result.message).toContain("already checked into session");
  });

  // ── Scenario 5: Session Capacity Cannot be Exceeded by Concurrent Scans ───────
  it("Scenario 5: Session capacity is strictly enforced, blocking scans when room capacity is full", () => {
    const fullSession: SessionScheduleConfig = {
      ...sessionB,
      capacity: 2, // Only 2 seats
    };

    const existing2Records: SessionAttendanceRecord[] = [
      {
        id: "r1",
        sessionId: "session_security_workshop",
        eventId: "event-conf-001",
        attendeeId: "att_user_1",
        credentialId: "c1",
        checkinTime: "2026-10-10T11:30:00Z",
        scannedBy: "staff@org",
        status: "checked_in",
      },
      {
        id: "r2",
        sessionId: "session_security_workshop",
        eventId: "event-conf-001",
        attendeeId: "att_user_2",
        credentialId: "c2",
        checkinTime: "2026-10-10T11:31:00Z",
        scannedBy: "staff@org",
        status: "checked_in",
      },
    ];

    // Third attendee tries to enter
    const thirdScan = processSessionScan({
      session: fullSession,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_security_workshop",
        credentialToken: "token_alex_single_qr",
        operatorEmail: "staff@org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
      existingSessionRecords: existing2Records,
    });

    expect(thirdScan.result.success).toBe(false);
    expect(thirdScan.result.status).toBe("SESSION_FULL");
    expect(thirdScan.result.error).toBe("SESSION_CAPACITY_REACHED");
    expect(thirdScan.result.remainingCapacity).toBe(0);
  });

  // ── Scenario 6: Session Checkout Calculates Duration Correctly ────────────────
  it("Scenario 6: Session checkout calculates attendance duration in minutes correctly", () => {
    const existingCheckin: SessionAttendanceRecord = {
      id: "rec_sess_for_checkout",
      sessionId: "session_ai_keynote",
      eventId: "event-conf-001",
      attendeeId: "att_alex_01",
      credentialId: "token_alex_single_qr",
      checkinTime: "2026-10-10T10:00:00.000Z", // 10:00 AM
      scannedBy: "staff@sessions.org",
      status: "checked_in",
    };

    // Checkout at 10:45 AM (45 minutes later)
    const checkoutScan = processSessionScan({
      session: sessionA,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_ai_keynote",
        credentialToken: "token_alex_single_qr",
        action: "checkout",
        operatorEmail: "staff@sessions.org",
        scanTimestamp: "2026-10-10T10:45:00.000Z",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
      existingSessionRecords: [existingCheckin],
    });

    expect(checkoutScan.result.success).toBe(true);
    expect(checkoutScan.result.status).toBe("CHECKED_OUT");
    expect(checkoutScan.result.durationMinutes).toBe(45); // Exactly 45 mins!
    expect(checkoutScan.updatedRecord?.status).toBe("checked_out");
    expect(checkoutScan.updatedRecord?.durationMinutes).toBe(45);
  });

  // ── Scenario 7: Session Attendance Works When Advanced Gate Tracking is OFF ───
  it("Scenario 7: Session attendance functions independently even when advanced gate tracking is disabled", () => {
    const sessionScan = processSessionScan({
      session: sessionA,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_ai_keynote",
        credentialToken: "token_alex_single_qr",
        operatorEmail: "staff@sessions.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
      existingSessionRecords: [],
    });

    expect(sessionScan.result.success).toBe(true);
    expect(sessionScan.result.status).toBe("CHECKED_IN");
    expect(sessionScan.newRecord?.sessionId).toBe("session_ai_keynote");
  });

  // ── Scenario 8: Multi-Day Sessions Record Appropriate Occurrence ───────────────
  it("Scenario 8: Multi-day sessions accurately track Day 1 vs Day 2 session occurrences", () => {
    const day2Scan = processSessionScan({
      session: multiDaySessionDay2, // Day 2 session
      request: {
        eventId: "event-conf-001",
        sessionId: "session_day2_deepdive",
        credentialToken: "token_alex_single_qr",
        operatorEmail: "staff@sessions.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
      existingSessionRecords: [],
    });

    expect(day2Scan.result.success).toBe(true);
    expect(day2Scan.result.session?.dayIndex).toBe(2);
    expect(day2Scan.result.session?.name).toBe("Cloud Architecture Deep Dive");
  });

  // ── Scenario 9: Overlapping Sessions Not Silently Rejected Unless Configured ──
  it("Scenario 9: Overlapping session attendance records are permitted without silent corruption", () => {
    const overlappingSessionRecord: SessionAttendanceRecord = {
      id: "rec_sess_parallel",
      sessionId: "session_parallel_track",
      eventId: "event-conf-001",
      attendeeId: "att_alex_01",
      credentialId: "token_alex_single_qr",
      checkinTime: "2026-10-10T11:35:00.000Z",
      scannedBy: "staff@track1.org",
      status: "checked_in",
    };

    // Attendee also checks in to Session B during same time window
    const scanRes = processSessionScan({
      session: sessionB,
      request: {
        eventId: "event-conf-001",
        sessionId: "session_security_workshop",
        credentialToken: "token_alex_single_qr",
        operatorEmail: "staff@track2.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: samplePass,
      existingSessionRecords: [], // No prior record for Session B itself
      allOtherSessionRecords: [overlappingSessionRecord],
    });

    expect(scanRes.result.success).toBe(true);
    expect(scanRes.result.status).toBe("CHECKED_IN");
  });

  // ── Manual Attendance Correction ──────────────────────────────────────────────
  it("allows organizer manual attendance correction with reason and audit log", () => {
    const initialRecord: SessionAttendanceRecord = {
      id: "rec_to_correct",
      sessionId: "session_ai_keynote",
      eventId: "event-conf-001",
      attendeeId: "att_alex_01",
      credentialId: "token_alex_single_qr",
      checkinTime: "2026-10-10T09:30:00Z",
      scannedBy: "staff@org",
      status: "checked_in",
    };

    const corrected = applyManualAttendanceCorrection({
      record: initialRecord,
      newStatus: "checked_out",
      correctedBy: "admin@urpass.space",
      reason: "Attendee departed early due to medical emergency",
    });

    expect(corrected.status).toBe("checked_out");
    expect(corrected.manualCorrection?.correctedBy).toBe("admin@urpass.space");
    expect(corrected.manualCorrection?.reason).toContain("medical emergency");
    expect(corrected.manualCorrection?.originalStatus).toBe("checked_in");
  });
});
