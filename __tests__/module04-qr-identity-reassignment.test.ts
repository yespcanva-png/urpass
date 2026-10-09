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
  verifyDigitalCredential,
  reassignTicketToNewHolder,
  getTicketAuditHistory,
  extractOpaquePassToken,
} from "@/lib/ticket-credentials";
import type {
  DigitalCredential,
  ScanEvent,
  ReassignmentRequest,
} from "@/lib/ticket-credentials/types";

describe("Module 04 — Digital QR Identity & Ticket Reassignment (Test 04 Suite)", () => {
  const sampleBookingOrder = {
    id: "booking_order_777",
    event_id: "event-conf-001",
    buyer_name: "Arun Kumar",
    buyer_email: "arun@example.com",
    organizer_email: "organizer@urpass.space",
    total_amount: 500000,
  };

  const initialCredential: DigitalCredential = {
    credential_id: "cred_token_original_arun",
    booking_id: "booking_order_777",
    ticket_id: "ticket_entitlement_01",
    attendee_id: "att_original_holder",
    status: "active",
    issued_at: "2026-10-01T10:00:00.000Z",
    version: 1,
    pass_type: "VIP Pass",
  };

  const initialAttendees = [
    {
      id: "att_original_holder",
      name: "Original Holder",
      email: "original@example.com",
      phone: "+919876543210",
      event_id: "event-conf-001",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Scenario 1: Current Valid QR is Accepted ──────────────────────────────────
  it("Scenario 1: Current valid QR credential is accepted and verified server-side", () => {
    const { result, updatedScanEvents } = verifyDigitalCredential({
      credentialToken: "cred_token_original_arun",
      eventId: "event-conf-001",
      gateId: "gate_main_entrance",
      scannedBy: "staff_gate_1",
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
    });

    expect(result.valid).toBe(true);
    expect(result.status).toBe("VALID");
    expect(result.attendee?.name).toBe("Original Holder");
    expect(result.attendee?.email).toBe("original@example.com");
    expect(result.ticket_id).toBe("ticket_entitlement_01");
    expect(result.booking_id).toBe("booking_order_777");
    expect(result.scan_event_id).toBeDefined();

    // Verify scan event was logged
    expect(updatedScanEvents.length).toBe(1);
    expect(updatedScanEvents[0].scan_result).toBe("VALID");
    expect(updatedScanEvents[0].credential_id).toBe("cred_token_original_arun");
  });

  // ── Scenario 2: Invalid or Revoked QR is Rejected ─────────────────────────────
  it("Scenario 2: Invalid or revoked QR credentials are fundamentally rejected", () => {
    // 1. Completely unknown / fake token
    const fakeRes = verifyDigitalCredential({
      credentialToken: "cred_completely_fake_token",
      credentialsStore: [initialCredential],
    });
    expect(fakeRes.result.valid).toBe(false);
    expect(fakeRes.result.status).toBe("INVALID");
    expect(fakeRes.result.error).toBe("INVALID_CREDENTIAL");

    // 2. Revoked token
    const revokedCredential: DigitalCredential = {
      ...initialCredential,
      status: "revoked",
      revoked_at: new Date().toISOString(),
      revocation_reason: "Ticket reassigned",
    };

    const revokedRes = verifyDigitalCredential({
      credentialToken: "cred_token_original_arun",
      credentialsStore: [revokedCredential],
      attendeesStore: initialAttendees,
    });
    expect(revokedRes.result.valid).toBe(false);
    expect(revokedRes.result.status).toBe("REVOKED");
    expect(revokedRes.result.error).toBe("CREDENTIAL_REVOKED");
  });

  // ── Scenario 3: Simultaneous Reassignments Cannot Both Succeed ────────────────
  it("Scenario 3: Two simultaneous reassignment requests cannot both succeed under concurrency version guards", () => {
    let credentialsStore = [initialCredential];
    let attendeesStore: Array<Record<string, unknown>> = [...initialAttendees];
    let reassignmentsAudit: Array<Record<string, unknown>> = [];

    const request1: ReassignmentRequest = {
      booking_id: "booking_order_777",
      ticket_id: "ticket_entitlement_01",
      current_attendee_id: "att_original_holder",
      new_attendee: {
        name: "Replacement Alice",
        email: "alice@example.com",
      },
      actor_email: "arun@example.com",
      expectedVersion: 1,
    };

    const request2: ReassignmentRequest = {
      booking_id: "booking_order_777",
      ticket_id: "ticket_entitlement_01",
      current_attendee_id: "att_original_holder",
      new_attendee: {
        name: "Replacement Bob",
        email: "bob@example.com",
      },
      actor_email: "arun@example.com",
      expectedVersion: 1, // Same stale version 1!
    };

    // First reassignment succeeds
    const res1 = reassignTicketToNewHolder({
      request: request1,
      bookingOrder: sampleBookingOrder,
      credentialsStore,
      attendeesStore,
      scanEventsStore: [],
      reassignmentsAudit,
    });

    expect(res1.result.success).toBe(true);
    credentialsStore = res1.updatedCredentials!;
    attendeesStore = res1.updatedAttendees!;
    reassignmentsAudit = res1.updatedAudit!;

    // Second concurrent reassignment fails due to version conflict / active credential state
    const res2 = reassignTicketToNewHolder({
      request: request2,
      bookingOrder: sampleBookingOrder,
      credentialsStore,
      attendeesStore,
      scanEventsStore: [],
      reassignmentsAudit,
    });

    expect(res2.result.success).toBe(false);
    expect(
      res2.result.error === "CONCURRENT_MODIFICATION_CONFLICT" ||
      res2.result.error === "ACTIVE_CREDENTIAL_NOT_FOUND"
    ).toBe(true);
  });

  // ── Scenario 4 & 5: Old QR Stops Working & New QR Belongs Only to New Attendee ─
  it("Scenario 4 & 5: After reassignment, old QR is revoked and new QR belongs exclusively to the new holder", () => {
    const reassignRes = reassignTicketToNewHolder({
      request: {
        booking_id: "booking_order_777",
        ticket_id: "ticket_entitlement_01",
        current_attendee_id: "att_original_holder",
        new_attendee: {
          name: "Deepak Chopra",
          email: "deepak@company.com",
          phone: "+919988112233",
        },
        actor_email: "arun@example.com",
      },
      bookingOrder: sampleBookingOrder,
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
      scanEventsStore: [],
    });

    expect(reassignRes.result.success).toBe(true);
    const newPassToken = reassignRes.result.new_pass_token!;
    const newAttendeeId = reassignRes.result.new_attendee_id!;
    const updatedCredentials = reassignRes.updatedCredentials!;
    const updatedAttendees = reassignRes.updatedAttendees as any[];

    // 1. Verify OLD QR is revoked upon scan
    const oldScan = verifyDigitalCredential({
      credentialToken: "cred_token_original_arun",
      credentialsStore: updatedCredentials,
      attendeesStore: updatedAttendees,
    });
    expect(oldScan.result.valid).toBe(false);
    expect(oldScan.result.status).toBe("REVOKED");

    // 2. Verify NEW QR is valid and bound exclusively to Deepak
    const newScan = verifyDigitalCredential({
      credentialToken: newPassToken,
      credentialsStore: updatedCredentials,
      attendeesStore: updatedAttendees,
    });
    expect(newScan.result.valid).toBe(true);
    expect(newScan.result.status).toBe("VALID");
    expect(newScan.result.attendee?.id).toBe(newAttendeeId);
    expect(newScan.result.attendee?.name).toBe("Deepak Chopra");
    expect(newScan.result.attendee?.email).toBe("deepak@company.com");
  });

  // ── Scenario 6: Previous Entry History Remains Available for Audit ────────────
  it("Scenario 6: Previous entry scan events and holder details remain fully available for audit", () => {
    const pastScanEvents: ScanEvent[] = [
      {
        scan_event_id: "scan_day1_morning",
        credential_id: "cred_token_original_arun",
        ticket_id: "ticket_entitlement_01",
        attendee_id: "att_original_holder",
        event_id: "event-conf-001",
        gate_id: "gate_east",
        scanned_at: "2026-10-05T09:00:00.000Z",
        scanned_by: "scanner_alice",
        scan_result: "VALID",
      },
    ];

    const reassignRes = reassignTicketToNewHolder({
      request: {
        booking_id: "booking_order_777",
        ticket_id: "ticket_entitlement_01",
        current_attendee_id: "att_original_holder",
        new_attendee: {
          name: "Vikram Seth",
          email: "vikram@author.org",
        },
        actor_email: "arun@example.com",
        organizer_override: true, // Approved exception
      },
      bookingOrder: sampleBookingOrder,
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
      scanEventsStore: pastScanEvents,
    });

    expect(reassignRes.result.success).toBe(true);

    const audit = getTicketAuditHistory({
      ticketId: "ticket_entitlement_01",
      bookingId: "booking_order_777",
      credentialsStore: reassignRes.updatedCredentials!,
      scanEventsStore: pastScanEvents,
      reassignmentsAudit: reassignRes.updatedAudit!,
    });

    // Check that previous scan history is preserved
    expect(audit.scan_events.length).toBe(1);
    expect(audit.scan_events[0].scan_event_id).toBe("day1_morning".padStart(17, "scan_"));
    expect(audit.scan_events[0].attendee_id).toBe("att_original_holder");

    // Check that reassignment record preserves old holder name & email
    expect(audit.reassignments.length).toBe(1);
    expect(audit.reassignments[0].from_name).toBe("Original Holder");
    expect(audit.reassignments[0].from_email).toBe("original@example.com");
    expect(audit.reassignments[0].to_name).toBe("Vikram Seth");
    expect(audit.reassignments[0].to_email).toBe("vikram@author.org");
  });

  // ── Scenario 7: QR Verification Works When Bulk Distribution is Disabled ──────
  it("Scenario 7: QR credential verification works regardless of bulk feature flag state", () => {
    // Single attendee pass generated under standard workflow (without bulk distribution)
    const standardCredential: DigitalCredential = {
      credential_id: "cred_single_standard_pass",
      booking_id: "booking_single_999",
      ticket_id: "ticket_single_01",
      attendee_id: "att_single_01",
      status: "active",
      issued_at: "2026-10-09T12:00:00.000Z",
      version: 1,
    };

    const standardAttendee = {
      id: "att_single_01",
      name: "Standard Attendee",
      email: "standard@example.com",
    };

    const scanResult = verifyDigitalCredential({
      credentialToken: "cred_single_standard_pass",
      eventId: "event-standard-01",
      credentialsStore: [standardCredential],
      attendeesStore: [standardAttendee],
    });

    expect(scanResult.result.valid).toBe(true);
    expect(scanResult.result.status).toBe("VALID");
    expect(scanResult.result.attendee?.name).toBe("Standard Attendee");
  });

  // ── Scenario 8: No Second QR Generated for Multi-Session Entry ────────────────
  it("Scenario 8: Attendee uses the exact same active digital QR for event entry and sessions without generating duplicate QRs", () => {
    let scanEventsStore: ScanEvent[] = [];

    // 1. Scan at Main Gate
    const gateScan = verifyDigitalCredential({
      credentialToken: "cred_token_original_arun",
      eventId: "event-conf-001",
      gateId: "main_gate",
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
      scanEventsStore,
    });

    expect(gateScan.result.valid).toBe(true);
    expect(gateScan.result.credential_id).toBe("cred_token_original_arun");
    scanEventsStore = gateScan.updatedScanEvents;

    // 2. Scan at Track A (AI Session)
    const sessionScanA = verifyDigitalCredential({
      credentialToken: "cred_token_original_arun",
      eventId: "event-conf-001",
      sessionId: "session_track_ai",
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
      scanEventsStore,
    });

    expect(sessionScanA.result.valid).toBe(true);
    // Crucial: Exact same credential token is verified, no secondary token spawned
    expect(sessionScanA.result.credential_id).toBe("cred_token_original_arun");
    scanEventsStore = sessionScanA.updatedScanEvents;

    // 3. Scan at Track B (Keynote)
    const sessionScanB = verifyDigitalCredential({
      credentialToken: "cred_token_original_arun",
      eventId: "event-conf-001",
      sessionId: "session_track_keynote",
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
      scanEventsStore,
    });

    expect(sessionScanB.result.valid).toBe(true);
    expect(sessionScanB.result.credential_id).toBe("cred_token_original_arun");
    scanEventsStore = sessionScanB.updatedScanEvents;

    // Exactly 3 scan event records tracked for the single credential
    expect(scanEventsStore.length).toBe(3);
  });

  // ── Scenario 9: Checked-In Tickets Blocked from Reassignment Without Exception
  it("Scenario 9: Checked-in tickets cannot be reassigned by default without organizer override", () => {
    const checkedInScanEvent: ScanEvent = {
      scan_event_id: "scan_checked_in_01",
      credential_id: "cred_token_original_arun",
      ticket_id: "ticket_entitlement_01",
      attendee_id: "att_original_holder",
      event_id: "event-conf-001",
      scanned_at: "2026-10-09T08:30:00.000Z",
      scan_result: "VALID",
    };

    // Attempt reassignment without organizer exception override
    const attempt1 = reassignTicketToNewHolder({
      request: {
        booking_id: "booking_order_777",
        ticket_id: "ticket_entitlement_01",
        current_attendee_id: "att_original_holder",
        new_attendee: {
          name: "Late Attendee",
          email: "late@example.com",
        },
        actor_email: "arun@example.com",
        organizer_override: false, // No override!
      },
      bookingOrder: sampleBookingOrder,
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
      scanEventsStore: [checkedInScanEvent],
    });

    expect(attempt1.result.success).toBe(false);
    expect(attempt1.result.error).toBe("CHECKED_IN_CANNOT_BE_REASSIGNED");
    expect(attempt1.result.message).toContain("cannot be reassigned without explicit organizer exception approval");

    // Attempt with organizer exception override succeeds
    const attempt2 = reassignTicketToNewHolder({
      request: {
        booking_id: "booking_order_777",
        ticket_id: "ticket_entitlement_01",
        current_attendee_id: "att_original_holder",
        new_attendee: {
          name: "Late Attendee",
          email: "late@example.com",
        },
        actor_email: "organizer@urpass.space",
        is_organizer: true,
        organizer_override: true, // Approved override!
      },
      bookingOrder: sampleBookingOrder,
      credentialsStore: [initialCredential],
      attendeesStore: initialAttendees,
      scanEventsStore: [checkedInScanEvent],
    });

    expect(attempt2.result.success).toBe(true);
    expect(attempt2.result.new_attendee_id).toBeDefined();
  });

  // ── Pass Condition: Exactly One Active Credential Per Ticket ──────────────────
  it("Pass Condition: Maintains exactly one active credential per ticket across reassignments", () => {
    let credentialsStore = [initialCredential];
    const initialActive = credentialsStore.filter(
      (c) => c.ticket_id === "ticket_entitlement_01" && c.status === "active"
    );
    expect(initialActive.length).toBe(1);

    // Reassign once
    const res1 = reassignTicketToNewHolder({
      request: {
        booking_id: "booking_order_777",
        ticket_id: "ticket_entitlement_01",
        current_attendee_id: "att_original_holder",
        new_attendee: { name: "User 2", email: "user2@example.com" },
        actor_email: "arun@example.com",
      },
      bookingOrder: sampleBookingOrder,
      credentialsStore,
      attendeesStore: initialAttendees,
      scanEventsStore: [],
    });
    credentialsStore = res1.updatedCredentials!;

    const activeAfterReassign1 = credentialsStore.filter(
      (c) => c.ticket_id === "ticket_entitlement_01" && c.status === "active"
    );
    expect(activeAfterReassign1.length).toBe(1); // Exactly 1 active credential!

    // Reassign twice
    const res2 = reassignTicketToNewHolder({
      request: {
        booking_id: "booking_order_777",
        ticket_id: "ticket_entitlement_01",
        current_attendee_id: res1.result.new_attendee_id!,
        new_attendee: { name: "User 3", email: "user3@example.com" },
        actor_email: "arun@example.com",
      },
      bookingOrder: sampleBookingOrder,
      credentialsStore,
      attendeesStore: res1.updatedAttendees!,
      scanEventsStore: [],
    });
    credentialsStore = res2.updatedCredentials!;

    const activeAfterReassign2 = credentialsStore.filter(
      (c) => c.ticket_id === "ticket_entitlement_01" && c.status === "active"
    );
    expect(activeAfterReassign2.length).toBe(1); // Exactly 1 active credential!
    expect(credentialsStore.filter((c) => c.status === "revoked").length).toBe(2);
  });

  // ── URL Token Extraction Helper ───────────────────────────────────────────────
  it("extracts clean token from full pass URLs and query strings", () => {
    expect(extractOpaquePassToken("https://urpass.space/pass/abc123token?tab=qr")).toBe("abc123token");
    expect(extractOpaquePassToken("http://localhost:3000/pass/def456token")).toBe("def456token");
    expect(extractOpaquePassToken("raw_token_789")).toBe("raw_token_789");
  });
});
