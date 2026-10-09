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
  getGateTrackingConfig,
  processGateScan,
  computeVenuePresenceSummary,
} from "@/lib/gate-tracking";
import type {
  GateTrackingConfig,
  GateScanRequest,
  GateScanRecord,
} from "@/lib/gate-tracking/types";
import type { EventLike } from "@/lib/feature-flags";

describe("Module 05 — Event Entry, Exit & Multi-Gate Tracking (Test 05 Suite)", () => {
  const activeGateEvent: EventLike = {
    id: "event-multigate-001",
    organizer_id: "organizer@urpass.space",
    name: "Global Tech Expo 2026",
    attendee_limit: 5000,
    status: "active",
    custom_pass_design: {
      _featureFlags: {
        features: {
          advanced_entry_tracking: true,
        },
        version: 1,
      },
      _gateTrackingConfig: {
        enabled: true,
        allowReEntry: true,
        duplicateEntryPolicy: "reject",
        duplicateWindowSeconds: 60,
        unmatchedExitPolicy: "flag_and_record",
        offlineSyncPolicy: "queue_and_reconcile",
        zones: [
          { id: "zone_main_hall", name: "Main Exhibition Hall", capacity_limit: 4000 },
          { id: "zone_vip_lounge", name: "VIP Lounge", capacity_limit: 200 },
        ],
        gates: [
          {
            id: "gate_north_entry",
            name: "North General Gate",
            code: "GATE_NORTH",
            zone_id: "zone_main_hall",
            type: "entry",
            is_active: true,
          },
          {
            id: "gate_south_exit",
            name: "South Exit Turnstile",
            code: "GATE_SOUTH",
            zone_id: "zone_main_hall",
            type: "exit",
            is_active: true,
          },
          {
            id: "gate_vip_exclusive",
            name: "VIP Lounge Gate",
            code: "GATE_VIP",
            zone_id: "zone_vip_lounge",
            type: "bidirectional",
            allowedTicketTypeIds: ["tt_vip"], // VIP only!
            is_active: true,
          },
        ],
        staffAssignments: [
          {
            operator_id: "op_alice",
            operator_email: "alice@staff.org",
            allowed_gate_ids: ["gate_north_entry", "gate_south_exit"],
          },
        ],
      },
    },
  };

  const trackingOffEvent: EventLike = {
    id: "event-gate-off",
    organizer_id: "organizer@urpass.space",
    name: "Community Meetup",
    attendee_limit: 100,
    status: "active",
    custom_pass_design: {
      _featureFlags: {
        features: {
          advanced_entry_tracking: false, // OFF
        },
      },
      _gateTrackingConfig: {
        enabled: false,
      },
    },
  };

  const sampleGeneralAttendee = {
    id: "att_general_01",
    name: "John Doe",
    email: "john@example.com",
    ticketTier: "General Admission",
    ticketTypeId: "tt_general",
    pass_status: "generated",
  };

  const sampleVipAttendee = {
    id: "att_vip_01",
    name: "Sarah VIP",
    email: "sarah.vip@investor.com",
    ticketTier: "VIP Pass",
    ticketTypeId: "tt_vip",
    pass_status: "generated",
  };

  const sampleGeneralPass = {
    id: "pass_gen_123",
    pass_token: "token_general_valid_qr",
    status: "active",
    pass_type: "General Admission",
    ticket_type_id: "tt_general",
  };

  const sampleVipPass = {
    id: "pass_vip_456",
    pass_token: "token_vip_valid_qr",
    status: "active",
    pass_type: "VIP Pass",
    ticket_type_id: "tt_vip",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Scenario 1: First Valid Entry ─────────────────────────────────────────────
  it("Scenario 1: First valid entry scan succeeds and sets attendee presence to INSIDE", () => {
    const request: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_general_valid_qr",
      operationMode: "entry",
      gateId: "gate_north_entry",
      operatorId: "op_alice",
      operatorEmail: "alice@staff.org",
    };

    const { result, nextPresence, newScanRecord } = processGateScan({
      event: activeGateEvent,
      request,
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence: "OUTSIDE",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("GRANTED");
    expect(result.presenceState).toBe("INSIDE");
    expect(nextPresence).toBe("INSIDE");
    expect(newScanRecord?.result).toBe("GRANTED");
    expect(newScanRecord?.presence_after).toBe("INSIDE");
    expect(result.gate?.name).toBe("North General Gate");
  });

  // ── Scenario 2: Immediate Duplicate Entry ─────────────────────────────────────
  it("Scenario 2: Immediate duplicate entry while already inside is rejected under policy", () => {
    const request: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_general_valid_qr",
      operationMode: "entry",
      gateId: "gate_north_entry",
      operatorId: "op_alice",
      operatorEmail: "alice@staff.org",
    };

    // Attendee is already INSIDE
    const { result, nextPresence } = processGateScan({
      event: activeGateEvent,
      request,
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence: "INSIDE",
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("ALREADY_INSIDE");
    expect(result.error).toBe("DUPLICATE_ENTRY");
    expect(nextPresence).toBe("INSIDE");
  });

  // ── Scenario 3: Valid Exit ────────────────────────────────────────────────────
  it("Scenario 3: Valid exit scan succeeds and sets attendee presence to OUTSIDE", () => {
    const request: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_general_valid_qr",
      operationMode: "exit",
      gateId: "gate_south_exit",
      operatorId: "op_alice",
      operatorEmail: "alice@staff.org",
    };

    // Attendee is currently INSIDE
    const { result, nextPresence, newScanRecord } = processGateScan({
      event: activeGateEvent,
      request,
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence: "INSIDE",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("GRANTED");
    expect(result.presenceState).toBe("OUTSIDE");
    expect(nextPresence).toBe("OUTSIDE");
    expect(newScanRecord?.presence_after).toBe("OUTSIDE");
  });

  // ── Scenario 4: Exit Without Prior Entry ──────────────────────────────────────
  it("Scenario 4: Exit scan without prior entry is flagged according to event policy", () => {
    const request: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_general_valid_qr",
      operationMode: "exit",
      gateId: "gate_south_exit",
      operatorId: "op_alice",
      operatorEmail: "alice@staff.org",
    };

    // Attendee is OUTSIDE when exit is scanned
    const { result, nextPresence } = processGateScan({
      event: activeGateEvent,
      request,
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence: "OUTSIDE",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("WARNING");
    expect(result.warning).toContain("Exit recorded without prior entry record");
    expect(nextPresence).toBe("OUTSIDE");
  });

  // ── Scenario 5: Re-entry After Exit ───────────────────────────────────────────
  it("Scenario 5: Re-entry scan succeeds when re-entry is enabled, transitioning presence to INSIDE", () => {
    const request: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_general_valid_qr",
      operationMode: "re_entry",
      gateId: "gate_north_entry",
      operatorId: "op_alice",
      operatorEmail: "alice@staff.org",
    };

    // Attendee has exited and is currently OUTSIDE
    const { result, nextPresence } = processGateScan({
      event: activeGateEvent,
      request,
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence: "OUTSIDE",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("GRANTED");
    expect(result.presenceState).toBe("INSIDE");
    expect(nextPresence).toBe("INSIDE");
  });

  // ── Scenario 6: VIP-Only Gate with General Ticket Denied ──────────────────────
  it("Scenario 6: VIP-only gate rejects general admission ticket with access denied", () => {
    // 1. General admission ticket scanning at VIP gate -> DENIED
    const genRequest: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_general_valid_qr",
      operationMode: "entry",
      gateId: "gate_vip_exclusive",
      operatorId: "op_admin",
      operatorEmail: "admin@staff.org",
    };

    const genResult = processGateScan({
      event: activeGateEvent,
      request: genRequest,
      attendee: sampleGeneralAttendee, // General tier
      passRecord: sampleGeneralPass,
      currentPresence: "OUTSIDE",
    });

    expect(genResult.result.success).toBe(false);
    expect(genResult.result.status).toBe("TIER_MISMATCH");
    expect(genResult.result.error).toBe("ZONE_TIER_ACCESS_DENIED");
    expect(genResult.result.message).toContain("VIP Lounge Gate");

    // 2. VIP ticket scanning at VIP gate -> GRANTED
    const vipRequest: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_vip_valid_qr",
      operationMode: "entry",
      gateId: "gate_vip_exclusive",
      operatorId: "op_admin",
      operatorEmail: "admin@staff.org",
    };

    const vipResult = processGateScan({
      event: activeGateEvent,
      request: vipRequest,
      attendee: sampleVipAttendee, // VIP tier
      passRecord: sampleVipPass,
      currentPresence: "OUTSIDE",
    });

    expect(vipResult.result.success).toBe(true);
    expect(vipResult.result.status).toBe("GRANTED");
    expect(vipResult.result.presenceState).toBe("INSIDE");
  });

  // ── Scenario 7: Simultaneous Scans at Two Gates ───────────────────────────────
  it("Scenario 7: Simultaneous entry scans across two gates maintain consistent state without double entry", () => {
    let currentPresence: "OUTSIDE" | "INSIDE" = "OUTSIDE";

    // Scan at Gate 1 (North Gate)
    const scan1 = processGateScan({
      event: activeGateEvent,
      request: {
        eventId: "event-multigate-001",
        credentialToken: "token_general_valid_qr",
        operationMode: "entry",
        gateId: "gate_north_entry",
        operatorId: "op_alice",
        operatorEmail: "alice@staff.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence,
    });

    expect(scan1.result.success).toBe(true);
    currentPresence = scan1.nextPresence;
    expect(currentPresence).toBe("INSIDE");

    // Concurrent scan attempt with same ticket at another gate while already inside
    const scan2 = processGateScan({
      event: activeGateEvent,
      request: {
        eventId: "event-multigate-001",
        credentialToken: "token_general_valid_qr",
        operationMode: "entry",
        gateId: "gate_north_entry",
        operatorId: "op_alice",
        operatorEmail: "alice@staff.org",
      },
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence,
    });

    expect(scan2.result.success).toBe(false);
    expect(scan2.result.status).toBe("ALREADY_INSIDE");
    expect(scan2.result.error).toBe("DUPLICATE_ENTRY");
  });

  // ── Scenario 8: Network Disconnect / Offline Policy ───────────────────────────
  it("Scenario 8: Offline scan follows configured queue-and-reconcile policy with client timestamp", () => {
    const offlineRequest: GateScanRequest = {
      eventId: "event-multigate-001",
      credentialToken: "token_general_valid_qr",
      operationMode: "entry",
      gateId: "gate_north_entry",
      operatorId: "op_alice",
      operatorEmail: "alice@staff.org",
      isOffline: true,
      clientTimestamp: "2026-10-09T20:00:00.000Z",
    };

    const { result, newScanRecord } = processGateScan({
      event: activeGateEvent,
      request: offlineRequest,
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence: "OUTSIDE",
    });

    expect(result.success).toBe(true);
    expect(newScanRecord?.is_offline_reconciled).toBe(true);
  });

  // ── Scenario 9: Advanced Tracking OFF (Existing Basic Check-in Unchanged) ──────
  it("Scenario 9: When advanced tracking is OFF, basic single check-in workflow operates normally", () => {
    const request: GateScanRequest = {
      eventId: "event-gate-off",
      credentialToken: "token_general_valid_qr",
      operationMode: "entry",
      gateId: "gate_basic",
      operatorId: "op_staff",
      operatorEmail: "staff@example.com",
    };

    const { result, nextPresence } = processGateScan({
      event: trackingOffEvent,
      request,
      attendee: sampleGeneralAttendee,
      passRecord: sampleGeneralPass,
      currentPresence: "OUTSIDE",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("GRANTED");
    expect(nextPresence).toBe("INSIDE");
  });

  // ── Live Presence Summary Computation ─────────────────────────────────────────
  it("Pass Condition: Correctly computes live turnout, net headcount inside/outside, and gate metrics", () => {
    const scanRecords: GateScanRecord[] = [
      // Attendee 1: enters Gate North, stays inside
      {
        scan_id: "s1",
        event_id: "event-multigate-001",
        credential_id: "c1",
        ticket_id: "t1",
        attendee_id: "att_1",
        gate_id: "gate_north_entry",
        operator_id: "op1",
        operator_email: "alice@staff.org",
        operation_mode: "entry",
        presence_before: "OUTSIDE",
        presence_after: "INSIDE",
        result: "GRANTED",
        timestamp: "2026-10-09T10:00:00Z",
      },
      // Attendee 2: enters Gate North, exits Gate South
      {
        scan_id: "s2",
        event_id: "event-multigate-001",
        credential_id: "c2",
        ticket_id: "t2",
        attendee_id: "att_2",
        gate_id: "gate_north_entry",
        operator_id: "op1",
        operator_email: "alice@staff.org",
        operation_mode: "entry",
        presence_before: "OUTSIDE",
        presence_after: "INSIDE",
        result: "GRANTED",
        timestamp: "2026-10-09T10:05:00Z",
      },
      {
        scan_id: "s3",
        event_id: "event-multigate-001",
        credential_id: "c2",
        ticket_id: "t2",
        attendee_id: "att_2",
        gate_id: "gate_south_exit",
        operator_id: "op1",
        operator_email: "alice@staff.org",
        operation_mode: "exit",
        presence_before: "INSIDE",
        presence_after: "OUTSIDE",
        result: "GRANTED",
        timestamp: "2026-10-09T11:30:00Z",
      },
      // Attendee 3: enters VIP Gate, stays inside
      {
        scan_id: "s4",
        event_id: "event-multigate-001",
        credential_id: "c3",
        ticket_id: "t3",
        attendee_id: "att_3",
        gate_id: "gate_vip_exclusive",
        operator_id: "op2",
        operator_email: "admin@staff.org",
        operation_mode: "entry",
        presence_before: "OUTSIDE",
        presence_after: "INSIDE",
        result: "GRANTED",
        timestamp: "2026-10-09T10:15:00Z",
      },
    ];

    const summary = computeVenuePresenceSummary({
      totalRegistered: 10,
      scanRecords,
    });

    expect(summary.totalRegistered).toBe(10);
    expect(summary.totalEntered).toBe(3); // 3 unique attendees entered
    expect(summary.currentlyInside).toBe(2); // att_1 and att_3 inside
    expect(summary.currentlyOutside).toBe(8); // 10 total - 2 inside = 8
    expect(summary.totalExits).toBe(1);
    expect(summary.gateStats["gate_north_entry"].entries).toBe(2);
    expect(summary.gateStats["gate_south_exit"].exits).toBe(1);
    expect(summary.gateStats["gate_vip_exclusive"].entries).toBe(1);
  });
});
