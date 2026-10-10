export * from "./types";
import crypto from "crypto";
import {
  type ScanResultStatus,
  type DigitalCredential,
  type ScanEvent,
  type ReassignmentRequest,
  type ReassignmentResult,
  type CredentialVerificationResult,
  type TicketAuditHistory,
} from "./types";

/**
 * Extracts opaque pass token from a scanned QR payload (supports raw token or URL).
 */
export function extractOpaquePassToken(qrPayload: string): string {
  if (!qrPayload) return "";
  const trimmed = qrPayload.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const match = url.pathname.match(/\/pass\/([^\/]+)/);
      if (match) {
        return match[1];
      }
      return trimmed.replace(/^https?:\/\/[^\/]+\/pass\//, "").split("?")[0];
    } catch {
      return trimmed.replace(/^https?:\/\/[^\/]+\/pass\//, "").split("?")[0];
    }
  }

  return trimmed;
}

/**
 * Server-side verification of a digital QR credential.
 * Validates active status, rejects revoked/invalid tokens, records scan event audit trail.
 */
export function verifyDigitalCredential({
  credentialToken,
  eventId,
  gateId,
  sessionId,
  scannedBy,
  credentialsStore = [],
  scanEventsStore = [],
  attendeesStore = [],
}: {
  credentialToken: string;
  eventId?: string;
  gateId?: string;
  sessionId?: string;
  scannedBy?: string;
  credentialsStore?: DigitalCredential[];
  scanEventsStore?: ScanEvent[];
  attendeesStore?: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    event_id?: string;
  }>;
}): {
  result: CredentialVerificationResult;
  updatedScanEvents: ScanEvent[];
} {
  const cleanToken = extractOpaquePassToken(credentialToken);
  const nowIso = new Date().toISOString();
  const scanEventId = `scan_${crypto.randomUUID()}`;

  if (!cleanToken) {
    return {
      result: {
        valid: false,
        status: "INVALID",
        error: "EMPTY_CREDENTIAL_TOKEN",
        message: "No credential token provided.",
      },
      updatedScanEvents: scanEventsStore,
    };
  }

  // Find credential in store
  const credential = credentialsStore.find((c) => c.credential_id === cleanToken);

  if (!credential) {
    const invalidScan: ScanEvent = {
      scan_event_id: scanEventId,
      credential_id: cleanToken,
      ticket_id: "unknown",
      attendee_id: "unknown",
      event_id: eventId || "unknown",
      session_id: sessionId || null,
      gate_id: gateId || null,
      scanned_at: nowIso,
      scanned_by: scannedBy || null,
      scan_result: "INVALID",
    };

    return {
      result: {
        valid: false,
        status: "INVALID",
        error: "INVALID_CREDENTIAL",
        message: "Invalid or non-existent QR credential.",
        scan_event_id: scanEventId,
      },
      updatedScanEvents: [...scanEventsStore, invalidScan],
    };
  }

  const attendee = attendeesStore.find((a) => a.id === credential.attendee_id);

  // Check Revoked / Superseded status
  if (credential.status === "revoked" || credential.status === "superseded") {
    const revokedScan: ScanEvent = {
      scan_event_id: scanEventId,
      credential_id: credential.credential_id,
      ticket_id: credential.ticket_id,
      attendee_id: credential.attendee_id,
      event_id: eventId || "unknown",
      session_id: sessionId || null,
      gate_id: gateId || null,
      scanned_at: nowIso,
      scanned_by: scannedBy || null,
      scan_result: "REVOKED",
      metadata: { revocation_reason: credential.revocation_reason },
    };

    return {
      result: {
        valid: false,
        status: "REVOKED",
        credential_id: credential.credential_id,
        ticket_id: credential.ticket_id,
        booking_id: credential.booking_id,
        event_id: eventId,
        attendee: attendee ? { id: attendee.id, name: attendee.name, email: attendee.email } : undefined,
        scan_event_id: scanEventId,
        error: "CREDENTIAL_REVOKED",
        message: "This digital QR pass has been revoked following ticket reassignment or cancellation.",
      },
      updatedScanEvents: [...scanEventsStore, revokedScan],
    };
  }

  // Check Expired status
  if (credential.status === "expired") {
    const expiredScan: ScanEvent = {
      scan_event_id: scanEventId,
      credential_id: credential.credential_id,
      ticket_id: credential.ticket_id,
      attendee_id: credential.attendee_id,
      event_id: eventId || "unknown",
      session_id: sessionId || null,
      gate_id: gateId || null,
      scanned_at: nowIso,
      scanned_by: scannedBy || null,
      scan_result: "EXPIRED",
    };

    return {
      result: {
        valid: false,
        status: "EXPIRED",
        credential_id: credential.credential_id,
        ticket_id: credential.ticket_id,
        booking_id: credential.booking_id,
        event_id: eventId,
        scan_event_id: scanEventId,
        error: "CREDENTIAL_EXPIRED",
        message: "This digital credential has expired.",
      },
      updatedScanEvents: [...scanEventsStore, expiredScan],
    };
  }

  // Check if already checked in at this specific session / main gate
  const priorValidScans = scanEventsStore.filter(
    (s) =>
      s.credential_id === credential.credential_id &&
      s.scan_result === "VALID" &&
      (sessionId ? s.session_id === sessionId : !s.session_id)
  );

  const isAlreadyCheckedIn = priorValidScans.length > 0;
  const scanResultStatus: ScanResultStatus = isAlreadyCheckedIn ? "ALREADY_CHECKED_IN" : "VALID";

  const newScanEvent: ScanEvent = {
    scan_event_id: scanEventId,
    credential_id: credential.credential_id,
    ticket_id: credential.ticket_id,
    attendee_id: credential.attendee_id,
    event_id: eventId || "unknown",
    session_id: sessionId || null,
    gate_id: gateId || null,
    scanned_at: nowIso,
    scanned_by: scannedBy || null,
    scan_result: scanResultStatus,
  };

  return {
    result: {
      valid: true,
      status: scanResultStatus,
      credential_id: credential.credential_id,
      ticket_id: credential.ticket_id,
      booking_id: credential.booking_id,
      event_id: eventId,
      attendee: attendee
        ? {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            phone: attendee.phone,
          }
        : undefined,
      scan_event_id: scanEventId,
      checked_in_at: isAlreadyCheckedIn ? priorValidScans[0].scanned_at : nowIso,
      message: isAlreadyCheckedIn
        ? `Attendee already checked in at ${priorValidScans[0].scanned_at}`
        : "Valid digital credential verified successfully.",
    },
    updatedScanEvents: [...scanEventsStore, newScanEvent],
  };
}

/**
 * Atomically reassigns a ticket entitlement to a new holder.
 * - Enforces authorization (purchaser or organizer).
 * - Blocks checked-in tickets unless organizer override is present.
 * - Revokes old credential immediately (old QR stops working).
 * - Issues new replacement credential with updated cryptographic reference.
 * - Preserves historical entry and holder logs.
 * - Retains original booking financial ownership.
 */
export function reassignTicketToNewHolder({
  request,
  bookingOrder,
  credentialsStore = [],
  attendeesStore = [],
  scanEventsStore = [],
  reassignmentsAudit = [],
}: {
  request: ReassignmentRequest;
  bookingOrder: Record<string, unknown>;
  credentialsStore: DigitalCredential[];
  attendeesStore: Array<Record<string, unknown>>;
  scanEventsStore: ScanEvent[];
  reassignmentsAudit?: Array<Record<string, unknown>>;
}): {
  result: ReassignmentResult;
  updatedCredentials?: DigitalCredential[];
  updatedAttendees?: Array<Record<string, unknown>>;
  updatedAudit?: Array<Record<string, unknown>>;
} {
  const nowIso = new Date().toISOString();
  const normalizedActor = request.actor_email.toLowerCase().trim();
  const buyerEmail = String(bookingOrder.buyer_email || "").toLowerCase().trim();
  const organizerEmail = String(bookingOrder.organizer_email || "").toLowerCase().trim();

  // 1. Authorization Guard
  const isPurchaser = buyerEmail === normalizedActor;
  const isOrganizer = Boolean(request.is_organizer) || organizerEmail === normalizedActor;

  if (!isPurchaser && !isOrganizer) {
    return {
      result: {
        success: false,
        error: "UNAUTHORIZED",
        message: "Only the original ticket purchaser or event organizer can reassign this ticket.",
      },
    };
  }

  // 2. Find Ticket & Active Credential
  const activeCredIndex = credentialsStore.findIndex(
    (c) =>
      c.ticket_id === request.ticket_id &&
      c.attendee_id === request.current_attendee_id &&
      c.status === "active"
  );

  if (activeCredIndex < 0) {
    return {
      result: {
        success: false,
        error: "ACTIVE_CREDENTIAL_NOT_FOUND",
        message: "No active credential found for the specified ticket and current attendee.",
      },
    };
  }

  const activeCred = credentialsStore[activeCredIndex];

  // 3. Concurrency Protection (Version Guard)
  if (
    typeof request.expectedVersion === "number" &&
    activeCred.version !== request.expectedVersion
  ) {
    return {
      result: {
        success: false,
        error: "CONCURRENT_MODIFICATION_CONFLICT",
        message: "This ticket was modified by another concurrent transaction. Please refresh and try again.",
      },
    };
  }

  // 4. Check-in & Recorded Attendance Policy
  const priorValidScans = scanEventsStore.filter(
    (s) =>
      (s.ticket_id === request.ticket_id || s.credential_id === activeCred.credential_id) &&
      (s.scan_result === "VALID" || s.scan_result === "ALREADY_CHECKED_IN")
  );

  const hasCheckedIn = priorValidScans.length > 0;

  if (hasCheckedIn && !request.organizer_override) {
    return {
      result: {
        success: false,
        error: "CHECKED_IN_CANNOT_BE_REASSIGNED",
        message: "Tickets with recorded check-in attendance cannot be reassigned without explicit organizer exception approval.",
      },
    };
  }

  // 5. Revoke Old Credential
  const revokedOldCred: DigitalCredential = {
    ...activeCred,
    status: "revoked",
    revoked_at: nowIso,
    revocation_reason: `Reassigned by ${normalizedActor} to ${request.new_attendee.email}`,
  };

  // 6. Generate New Replacement Credential
  const newPassToken = crypto.randomBytes(32).toString("hex");
  const newCredentialId = newPassToken;
  const newAttendeeId = `att_${crypto.randomUUID()}`;

  const newCred: DigitalCredential = {
    credential_id: newCredentialId,
    booking_id: activeCred.booking_id,
    ticket_id: activeCred.ticket_id,
    attendee_id: newAttendeeId,
    status: "active",
    issued_at: nowIso,
    version: activeCred.version + 1,
    pass_type: activeCred.pass_type,
  };

  const updatedCredentials = [...credentialsStore];
  updatedCredentials[activeCredIndex] = revokedOldCred;
  updatedCredentials.push(newCred);

  // 7. Update Attendees Store
  const currentAttendee = attendeesStore.find((a) => a.id === request.current_attendee_id);
  const fromName = currentAttendee ? String(currentAttendee.name) : "Previous Holder";
  const fromEmail = currentAttendee ? String(currentAttendee.email) : "previous@example.com";

  const newAttendeeRecord: Record<string, unknown> = {
    id: newAttendeeId,
    ticket_id: request.ticket_id,
    booking_id: activeCred.booking_id,
    event_id: bookingOrder.event_id,
    name: request.new_attendee.name.trim(),
    email: request.new_attendee.email.toLowerCase().trim(),
    phone: request.new_attendee.phone?.trim() || null,
    pass_status: "generated",
    custom_responses: request.new_attendee.customResponses || {},
    created_at: nowIso,
    updated_at: nowIso,
  };

  const updatedAttendees = [
    ...attendeesStore.map((a) =>
      a.id === request.current_attendee_id
        ? { ...a, pass_status: "revoked", updated_at: nowIso }
        : a
    ),
    newAttendeeRecord,
  ];

  // 8. Log Reassignment Audit Trail (Preserves historical holder data)
  const auditEntry = {
    id: `reassign_${crypto.randomUUID()}`,
    timestamp: nowIso,
    ticket_id: request.ticket_id,
    booking_id: activeCred.booking_id,
    from_attendee_id: request.current_attendee_id,
    from_name: fromName,
    from_email: fromEmail,
    to_attendee_id: newAttendeeId,
    to_name: request.new_attendee.name.trim(),
    to_email: request.new_attendee.email.toLowerCase().trim(),
    actor_email: normalizedActor,
    reason: request.reason || "Holder reassignment",
    revoked_credential_id: activeCred.credential_id,
    new_credential_id: newCredentialId,
  };

  const updatedAudit = [...reassignmentsAudit, auditEntry];

  return {
    result: {
      success: true,
      booking_id: activeCred.booking_id,
      ticket_id: request.ticket_id,
      previous_attendee_id: request.current_attendee_id,
      new_attendee_id: newAttendeeId,
      revoked_credential_id: activeCred.credential_id,
      new_credential_id: newCredentialId,
      new_pass_token: newPassToken,
      message: `Ticket successfully reassigned to ${request.new_attendee.name}. Old QR credential revoked.`,
    },
    updatedCredentials,
    updatedAttendees,
    updatedAudit,
  };
}

/**
 * Compiles a comprehensive ticket audit history with all credentials, scan events, and reassignments.
 */
export function getTicketAuditHistory({
  ticketId,
  bookingId,
  credentialsStore = [],
  scanEventsStore = [],
  reassignmentsAudit = [],
}: {
  ticketId: string;
  bookingId: string;
  credentialsStore: DigitalCredential[];
  scanEventsStore: ScanEvent[];
  reassignmentsAudit?: Array<Record<string, unknown>>;
}): TicketAuditHistory {
  const credentials = credentialsStore.filter((c) => c.ticket_id === ticketId);
  const credentialIds = new Set(credentials.map((c) => c.credential_id));

  const scan_events = scanEventsStore.filter(
    (s) => s.ticket_id === ticketId || credentialIds.has(s.credential_id)
  );

  const reassignments = (reassignmentsAudit as TicketAuditHistory["reassignments"]).filter(
    (r) => r.ticket_id === ticketId
  );

  return {
    ticket_id: ticketId,
    booking_id: bookingId,
    credentials,
    scan_events,
    reassignments,
  };
}
