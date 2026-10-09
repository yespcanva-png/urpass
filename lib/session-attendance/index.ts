export * from "./types";
import crypto from "crypto";
import { isFeatureEnabled, type EventLike } from "@/lib/feature-flags";
import {
  type SessionScheduleConfig,
  type SessionAttendanceRecord,
  type SessionScanRequest,
  type SessionScanResult,
  type SessionAttendanceStats,
} from "./types";

/**
 * Validates and records session-wise attendance for an attendee.
 * Enforces session-specific operator permissions, ticket category eligibility,
 * advance reservation checks, capacity limits, and checkout duration tracking.
 */
export function processSessionScan({
  session,
  request,
  attendee,
  passRecord,
  existingSessionRecords = [],
  reservations = [],
  allOtherSessionRecords = [],
}: {
  session: SessionScheduleConfig;
  request: SessionScanRequest;
  attendee?: {
    id: string;
    name: string;
    email: string;
    ticketTier?: string;
    ticketTypeId?: string;
    pass_status?: string;
  } | null;
  passRecord?: {
    id: string;
    pass_token: string;
    status: string;
    pass_type?: string;
    ticket_type_id?: string;
  } | null;
  existingSessionRecords?: SessionAttendanceRecord[];
  reservations?: Array<{ attendeeId: string; status: string }>;
  allOtherSessionRecords?: SessionAttendanceRecord[];
}): {
  result: SessionScanResult;
  newRecord?: SessionAttendanceRecord;
  updatedRecord?: SessionAttendanceRecord;
} {
  const nowIso = request.scanTimestamp || new Date().toISOString();
  const currentCount = existingSessionRecords.filter(
    (r) => r.status === "checked_in" || r.status === "attended"
  ).length;

  // 1. Pass and Credential Validation
  if (!passRecord) {
    return {
      result: {
        success: false,
        status: "INVALID_CREDENTIAL",
        currentAttendanceCount: currentCount,
        error: "PASS_NOT_FOUND",
        message: "Digital pass could not be found or verified.",
      },
    };
  }

  if (passRecord.status === "revoked" || attendee?.pass_status === "reassigned_revoked") {
    return {
      result: {
        success: false,
        status: "REVOKED_CREDENTIAL",
        currentAttendanceCount: currentCount,
        error: "CREDENTIAL_REVOKED",
        message: "This pass has been revoked following ticket reassignment or cancellation.",
      },
    };
  }

  // 2. Operator Session Scanning Permissions
  if (
    Array.isArray(session.scannerOperatorEmails) &&
    session.scannerOperatorEmails.length > 0
  ) {
    const normalizedOperator = request.operatorEmail.toLowerCase().trim();
    const isPermitted = session.scannerOperatorEmails
      .map((e) => e.toLowerCase().trim())
      .includes(normalizedOperator);

    if (!isPermitted && !request.override) {
      return {
        result: {
          success: false,
          status: "OPERATOR_UNAUTHORIZED",
          currentAttendanceCount: currentCount,
          error: "OPERATOR_NOT_PERMITTED_FOR_SESSION",
          message: `Operator "${request.operatorEmail}" is not authorized to scan for session "${session.name}".`,
        },
      };
    }
  }

  // 3. Ticket Tier & Category Eligibility (Scenario 3)
  const ticketTier = attendee?.ticketTier || passRecord.pass_type;
  const ticketTypeId = attendee?.ticketTypeId || passRecord.ticket_type_id || ticketTier;

  if (
    Array.isArray(session.eligibleTicketTypeIds) &&
    session.eligibleTicketTypeIds.length > 0
  ) {
    const isEligible =
      (ticketTypeId && session.eligibleTicketTypeIds.includes(ticketTypeId)) ||
      (ticketTier && session.eligibleTicketTypeIds.includes(ticketTier));

    if (!isEligible && !request.override) {
      return {
        result: {
          success: false,
          status: "UNAUTHORIZED_TIER",
          currentAttendanceCount: currentCount,
          session: {
            id: session.id,
            name: session.name,
            roomName: session.roomName,
            dayIndex: session.dayIndex,
          },
          attendee: attendee
            ? {
                id: attendee.id,
                name: attendee.name,
                email: attendee.email,
                ticketTier,
                ticketTypeId,
              }
            : undefined,
          error: "TIER_ACCESS_DENIED",
          message: `Access denied. Session "${session.name}" requires specific ticket category eligibility.`,
        },
      };
    }
  }

  // 4. Advance Registration Requirement Verification
  const isReserved = reservations.some(
    (r) => r.attendeeId === attendee?.id && (r.status === "reserved" || r.status === "attended")
  );

  if (session.requireAdvanceRegistration && !isReserved && !request.override) {
    return {
      result: {
        success: false,
        status: "NOT_RESERVED",
        currentAttendanceCount: currentCount,
        session: {
          id: session.id,
          name: session.name,
          roomName: session.roomName,
        },
        attendee: attendee ? { id: attendee.id, name: attendee.name, email: attendee.email } : undefined,
        error: "SESSION_RESERVATION_REQUIRED",
        message: `Advance reservation is required for session "${session.name}".`,
      },
    };
  }

  // 5. Existing Check-In & Checkout Handling (Scenario 4 & 6)
  const existingRecord = existingSessionRecords.find(
    (r) => r.attendeeId === attendee?.id
  );

  if (existingRecord) {
    // If attendee is checking out
    const shouldCheckout =
      request.action === "checkout" ||
      (request.action === "auto" && session.allowCheckout && !existingRecord.checkoutTime);

    if (shouldCheckout) {
      const checkinMs = new Date(existingRecord.checkinTime).getTime();
      const checkoutMs = new Date(nowIso).getTime();
      const durationMinutes = Math.max(1, Math.round((checkoutMs - checkinMs) / 60000));

      const updatedRecord: SessionAttendanceRecord = {
        ...existingRecord,
        checkoutTime: nowIso,
        durationMinutes,
        status: "checked_out",
      };

      return {
        result: {
          success: true,
          status: "CHECKED_OUT",
          session: {
            id: session.id,
            name: session.name,
            roomName: session.roomName,
            timeRange: `${session.startTime} - ${session.endTime}`,
            dayIndex: session.dayIndex,
          },
          attendee: attendee
            ? {
                id: attendee.id,
                name: attendee.name,
                email: attendee.email,
                ticketTier,
                ticketTypeId,
              }
            : undefined,
          checkinTime: existingRecord.checkinTime,
          checkoutTime: nowIso,
          durationMinutes,
          currentAttendanceCount: Math.max(0, currentCount - 1),
          message: `Checked out of session "${session.name}". Duration: ${durationMinutes} minutes.`,
        },
        updatedRecord,
      };
    }

    // Duplicate Check-In Attempt
    return {
      result: {
        success: false,
        status: "ALREADY_CHECKED_IN",
        session: {
          id: session.id,
          name: session.name,
          roomName: session.roomName,
          timeRange: `${session.startTime} - ${session.endTime}`,
          dayIndex: session.dayIndex,
        },
        attendee: attendee
          ? {
                id: attendee.id,
                name: attendee.name,
                email: attendee.email,
                ticketTier,
                ticketTypeId,
              }
            : undefined,
        checkinTime: existingRecord.checkinTime,
        currentAttendanceCount: currentCount,
        error: "DUPLICATE_SESSION_SCAN",
        message: `Attendee is already checked into session "${session.name}" at ${existingRecord.checkinTime}.`,
      },
    };
  }

  // 6. Capacity Limit Enforcement (Scenario 5)
  if (
    typeof session.capacity === "number" &&
    session.capacity > 0 &&
    currentCount >= session.capacity &&
    !isReserved &&
    !request.override
  ) {
    return {
      result: {
        success: false,
        status: "SESSION_FULL",
        currentAttendanceCount: currentCount,
        remainingCapacity: 0,
        session: {
          id: session.id,
          name: session.name,
          roomName: session.roomName,
        },
        error: "SESSION_CAPACITY_REACHED",
        message: `Session "${session.name}" has reached full capacity (${session.capacity} attendees).`,
      },
    };
  }

  // 7. Successful Session Check-In (Scenario 1, 2, 8, 9)
  const newRecord: SessionAttendanceRecord = {
    id: `sess_att_${crypto.randomUUID()}`,
    sessionId: session.id,
    eventId: session.eventId,
    attendeeId: attendee?.id || "unknown",
    passId: passRecord.id,
    credentialId: passRecord.pass_token,
    checkinTime: nowIso,
    scannedBy: request.operatorEmail,
    deviceId: request.deviceId,
    status: "checked_in",
  };

  const newCount = currentCount + 1;
  const remainingCapacity =
    typeof session.capacity === "number" ? Math.max(0, session.capacity - newCount) : null;

  return {
    result: {
      success: true,
      status: "CHECKED_IN",
      session: {
        id: session.id,
        name: session.name,
        roomName: session.roomName,
        timeRange: `${session.startTime} - ${session.endTime}`,
        dayIndex: session.dayIndex,
      },
      attendee: attendee
        ? {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            ticketTier,
            ticketTypeId,
          }
        : undefined,
      checkinTime: nowIso,
      currentAttendanceCount: newCount,
      remainingCapacity,
      message: `Checked into session "${session.name}".`,
    },
    newRecord,
  };
}

/**
 * Applies organizer-controlled manual attendance correction with reason and audit log.
 */
export function applyManualAttendanceCorrection({
  record,
  newStatus,
  correctedBy,
  reason,
}: {
  record: SessionAttendanceRecord;
  newStatus: "checked_in" | "checked_out" | "attended";
  correctedBy: string;
  reason: string;
}): SessionAttendanceRecord {
  return {
    ...record,
    status: newStatus,
    manualCorrection: {
      correctedBy,
      correctedAt: new Date().toISOString(),
      reason,
      originalStatus: record.status,
    },
  };
}

/**
 * Computes aggregated real-time statistics for a session.
 */
export function computeSessionAttendanceStats({
  session,
  records = [],
}: {
  session: SessionScheduleConfig;
  records: SessionAttendanceRecord[];
}): SessionAttendanceStats {
  const sessionRecords = records.filter((r) => r.sessionId === session.id);
  const totalCheckedIn = sessionRecords.length;
  const checkedOutRecords = sessionRecords.filter((r) => r.status === "checked_out");
  const totalCheckedOut = checkedOutRecords.length;
  const currentlyPresent = sessionRecords.filter((r) => r.status === "checked_in").length;

  let totalDurationMinutes = 0;
  for (const r of checkedOutRecords) {
    if (typeof r.durationMinutes === "number") {
      totalDurationMinutes += r.durationMinutes;
    }
  }

  const averageDurationMinutes =
    totalCheckedOut > 0 ? Math.round(totalDurationMinutes / totalCheckedOut) : 0;

  return {
    sessionId: session.id,
    title: session.name,
    capacity: session.capacity,
    totalCheckedIn,
    totalCheckedOut,
    currentlyPresent,
    averageDurationMinutes,
  };
}
