export type SessionAttendanceAction = "auto" | "checkin" | "checkout";

export type SessionAttendanceStatus =
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "ALREADY_CHECKED_IN"
  | "UNAUTHORIZED_TIER"
  | "NOT_RESERVED"
  | "SESSION_FULL"
  | "OUTSIDE_WINDOW"
  | "OPERATOR_UNAUTHORIZED"
  | "INVALID_CREDENTIAL"
  | "REVOKED_CREDENTIAL";

export interface SessionScheduleConfig {
  id: string; // session_id
  eventId: string;
  name: string; // title
  roomName?: string;
  date: string; // e.g. "2026-10-10"
  startTime: string; // e.g. "10:00"
  endTime: string; // e.g. "11:30"
  dayIndex?: number; // Multi-day occurrence indicator (e.g. Day 1, Day 2)
  eligibleTicketTypeIds?: string[]; // Empty/omitted = all ticket tiers allowed
  capacity?: number | null;
  checkinWindowStartMinutesBefore?: number; // e.g. 15
  checkinCutoffMinutesAfterStart?: number | null;
  requireAdvanceRegistration?: boolean;
  allowCheckout?: boolean;
  minimumDurationMinutes?: number | null;
  scannerOperatorEmails?: string[]; // Session-specific scanning permissions
  allowOverlappingAttendance?: boolean;
}

export interface SessionAttendanceRecord {
  id: string;
  sessionId: string;
  eventId: string;
  attendeeId: string;
  passId?: string;
  credentialId: string;
  checkinTime: string;
  checkoutTime?: string | null;
  durationMinutes?: number | null;
  scannedBy: string;
  deviceId?: string;
  status: "checked_in" | "checked_out" | "attended";
  manualCorrection?: {
    correctedBy: string;
    correctedAt: string;
    reason: string;
    originalStatus: string;
  };
}

export interface SessionScanRequest {
  eventId: string;
  sessionId: string;
  credentialToken: string;
  action?: SessionAttendanceAction;
  operatorEmail: string;
  deviceId?: string;
  override?: boolean;
  scanTimestamp?: string;
}

export interface SessionScanResult {
  success: boolean;
  status: SessionAttendanceStatus;
  session?: {
    id: string;
    name: string;
    roomName?: string;
    timeRange?: string;
    dayIndex?: number;
  };
  attendee?: {
    id: string;
    name: string;
    email: string;
    ticketTier?: string;
    ticketTypeId?: string;
  };
  checkinTime?: string;
  checkoutTime?: string;
  durationMinutes?: number;
  currentAttendanceCount: number;
  remainingCapacity?: number | null;
  error?: string;
  message?: string;
}

export interface SessionAttendanceStats {
  sessionId: string;
  title: string;
  capacity?: number | null;
  totalCheckedIn: number;
  totalCheckedOut: number;
  currentlyPresent: number;
  averageDurationMinutes: number;
}
