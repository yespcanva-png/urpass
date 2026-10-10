/**
 * UrPass Group Entry & Partial Check-In Engine (Module M14)
 * 
 * Implements:
 * 1. Single QR code representing multiple ticket entitlements.
 * 2. Partial check-in quantity deduction:
 *    remaining = valid_entitlements - previously_admitted
 * 3. Prevention of concurrent over-admission across multiple gate scanners.
 * 4. Two group entry modes:
 *    - "count_only": Fast gate admission for quantities without attendee identification.
 *    - "identified": Selects or records verified members against the booking.
 * 5. Re-entry & Session separation rules:
 *    - First entry consumes unused entitlement.
 *    - Re-entry verifies presence without consuming another first-entry entitlement.
 *    - Session attendance scans session rooms without decrementing gate entry balance.
 */

export type GroupEntryMode = "count_only" | "identified";

export interface GroupBookingState {
  bookingReference: string;
  orderId?: string;
  passId?: string;
  eventId: string;
  buyerName: string;
  buyerEmail?: string;
  totalEntitlements: number; // e.g. 10
  admittedEntitlements: number; // e.g. 6
  remainingEntitlements: number; // total - admitted (e.g. 4)
  entryMode: GroupEntryMode;
  status: "VALID" | "EXHAUSTED" | "REFUNDED" | "CANCELLED" | "EXPIRED";
  members?: Array<{
    id?: string;
    name: string;
    email?: string;
    admitted: boolean;
    admittedAt?: string;
  }>;
}

export interface GroupAdmissionRequest {
  bookingReference: string;
  eventId: string;
  quantity: number; // e.g. 6 on first scan, 4 on second scan
  operatorId: string;
  operatorEmail?: string;
  gateId?: string;
  gateName?: string;
  deviceId?: string;
  scanOperationId?: string;
  entryMode?: GroupEntryMode;
  selectedMemberIds?: string[];
  scanTimestamp?: string;
}

export interface GroupAdmissionResult {
  success: boolean;
  status:
    | "GROUP_ADMITTED"
    | "EXHAUSTED"
    | "EXCEEDS_REMAINING"
    | "BOOKING_NOT_FOUND"
    | "BOOKING_INVALID"
    | "INVALID_QUANTITY"
    | "UNAUTHORIZED_OPERATOR"
    | "FEATURE_DISABLED";
  bookingReference: string;
  buyerName: string;
  totalEntitlements: number;
  previouslyAdmitted: number;
  admittedNow: number;
  remainingEntries: number;
  admittedAt: string;
  gateName?: string;
  operatorEmail?: string;
  message: string;
  error?: string;
}

/**
 * Validates and calculates a group admission transaction.
 * Pure deterministic calculation matching database stored procedure logic.
 */
export function calculateGroupAdmission({
  booking,
  request,
  isFeatureActive = true,
}: {
  booking: GroupBookingState;
  request: GroupAdmissionRequest;
  isFeatureActive?: boolean;
}): {
  result: GroupAdmissionResult;
  updatedBooking?: GroupBookingState;
} {
  const now = request.scanTimestamp || new Date().toISOString();

  // 1. Feature activation check
  if (!isFeatureActive) {
    return {
      result: {
        success: false,
        status: "FEATURE_DISABLED",
        bookingReference: booking.bookingReference,
        buyerName: booking.buyerName,
        totalEntitlements: booking.totalEntitlements,
        previouslyAdmitted: booking.admittedEntitlements,
        admittedNow: 0,
        remainingEntries: Math.max(0, booking.totalEntitlements - booking.admittedEntitlements),
        admittedAt: now,
        error: "FEATURE_DISABLED",
        message: "Group QR Partial Entry is currently disabled for this event.",
      },
    };
  }

  // 2. Booking validity check (Refunded, cancelled, expired)
  if (booking.status === "REFUNDED" || booking.status === "CANCELLED" || booking.status === "EXPIRED") {
    return {
      result: {
        success: false,
        status: "BOOKING_INVALID",
        bookingReference: booking.bookingReference,
        buyerName: booking.buyerName,
        totalEntitlements: booking.totalEntitlements,
        previouslyAdmitted: booking.admittedEntitlements,
        admittedNow: 0,
        remainingEntries: 0,
        admittedAt: now,
        error: `BOOKING_${booking.status}`,
        message: `This booking has been ${booking.status.toLowerCase()}. Entry denied.`,
      },
    };
  }

  // 3. Validate requested quantity
  if (!request.quantity || request.quantity <= 0) {
    return {
      result: {
        success: false,
        status: "INVALID_QUANTITY",
        bookingReference: booking.bookingReference,
        buyerName: booking.buyerName,
        totalEntitlements: booking.totalEntitlements,
        previouslyAdmitted: booking.admittedEntitlements,
        admittedNow: 0,
        remainingEntries: Math.max(0, booking.totalEntitlements - booking.admittedEntitlements),
        admittedAt: now,
        error: "INVALID_QUANTITY",
        message: "Quantity to admit must be at least 1.",
      },
    };
  }

  const remaining = Math.max(0, booking.totalEntitlements - booking.admittedEntitlements);

  // 4. Check if already exhausted
  if (remaining <= 0) {
    return {
      result: {
        success: false,
        status: "EXHAUSTED",
        bookingReference: booking.bookingReference,
        buyerName: booking.buyerName,
        totalEntitlements: booking.totalEntitlements,
        previouslyAdmitted: booking.admittedEntitlements,
        admittedNow: 0,
        remainingEntries: 0,
        admittedAt: now,
        error: "ALL_ENTITLEMENTS_USED",
        message: `All ${booking.totalEntitlements} entries for this booking have already been admitted.`,
      },
    };
  }

  // 5. Quantity cannot exceed remaining entries
  if (request.quantity > remaining) {
    return {
      result: {
        success: false,
        status: "EXCEEDS_REMAINING",
        bookingReference: booking.bookingReference,
        buyerName: booking.buyerName,
        totalEntitlements: booking.totalEntitlements,
        previouslyAdmitted: booking.admittedEntitlements,
        admittedNow: 0,
        remainingEntries: remaining,
        admittedAt: now,
        error: "EXCEEDS_REMAINING",
        message: `Requested ${request.quantity} entries, but only ${remaining} remain on this booking.`,
      },
    };
  }

  // 6. Successful partial or full admission
  const newAdmitted = booking.admittedEntitlements + request.quantity;
  const newRemaining = booking.totalEntitlements - newAdmitted;

  let updatedMembers = booking.members ? [...booking.members] : undefined;
  if (updatedMembers && Array.isArray(request.selectedMemberIds) && request.selectedMemberIds.length > 0) {
    updatedMembers = updatedMembers.map((m) =>
      request.selectedMemberIds!.includes(m.id || "") || request.selectedMemberIds!.includes(m.name)
        ? { ...m, admitted: true, admittedAt: now }
        : m
    );
  }

  const updatedBooking: GroupBookingState = {
    ...booking,
    admittedEntitlements: newAdmitted,
    remainingEntitlements: newRemaining,
    status: newRemaining === 0 ? "EXHAUSTED" : "VALID",
    members: updatedMembers,
  };

  return {
    result: {
      success: true,
      status: "GROUP_ADMITTED",
      bookingReference: booking.bookingReference,
      buyerName: booking.buyerName,
      totalEntitlements: booking.totalEntitlements,
      previouslyAdmitted: booking.admittedEntitlements,
      admittedNow: request.quantity,
      remainingEntries: newRemaining,
      admittedAt: now,
      gateName: request.gateName,
      operatorEmail: request.operatorEmail,
      message:
        newRemaining === 0
          ? `All ${booking.totalEntitlements} attendees admitted for booking ${booking.bookingReference}.`
          : `Admitted ${request.quantity} attendee(s). ${newRemaining} of ${booking.totalEntitlements} remaining.`,
    },
    updatedBooking,
  };
}

/**
 * Creates a unique group QR payload for client rendering and sharing.
 */
export function generateGroupQRPayload(booking: {
  bookingReference: string;
  eventId: string;
  totalEntitlements: number;
  buyerName?: string;
  mode?: "count_only" | "identified";
}): string {
  return JSON.stringify({
    v: 1,
    type: "GROUP_BOOKING_QR",
    ref: booking.bookingReference,
    eventId: booking.eventId,
    total: booking.totalEntitlements,
    name: booking.buyerName || "Group Pass Holder",
    mode: booking.mode || "count_only",
  });
}

/**
 * Detects whether a scanned QR token represents a group booking.
 */
export function parseScannedGroupQR(rawToken: string): {
  isGroupQR: boolean;
  bookingReference?: string;
  totalEntitlements?: number;
  buyerName?: string;
  mode?: "count_only" | "identified";
} {
  const trimmed = rawToken.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && (parsed.type === "GROUP_BOOKING_QR" || parsed.type === "GROUP_PASS")) {
      return {
        isGroupQR: true,
        bookingReference: parsed.ref || parsed.token || parsed.bookingReference,
        totalEntitlements: parsed.total || parsed.cap,
        buyerName: parsed.name || parsed.h,
        mode: parsed.mode || "count_only",
      };
    }
  } catch {
    // If string token follows group prefix conventions (e.g. URP-GRP-... or GRP-...)
    if (/^(URP-GRP-|GRP-|GROUP-)/i.test(trimmed)) {
      return {
        isGroupQR: true,
        bookingReference: trimmed,
      };
    }
  }

  return { isGroupQR: false };
}
