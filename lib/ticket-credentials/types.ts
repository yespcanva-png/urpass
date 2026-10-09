export type CredentialStatus = "active" | "revoked" | "expired" | "superseded";

export type ScanResultStatus =
  | "VALID"
  | "ALREADY_CHECKED_IN"
  | "REVOKED"
  | "EXPIRED"
  | "INVALID"
  | "SESSION_UNAUTHORIZED";

export interface DigitalCredential {
  credential_id: string; // The active digital QR token / opaque reference
  booking_id: string; // Identifies the original purchase / order
  ticket_id: string; // Identifies one ticket entitlement
  attendee_id: string; // Identifies the person currently entitled to use it
  status: CredentialStatus;
  issued_at: string;
  revoked_at?: string | null;
  revocation_reason?: string | null;
  pass_type?: string;
  version: number;
}

export interface ScanEvent {
  scan_event_id: string; // Identifies an individual scanning action
  credential_id: string;
  ticket_id: string;
  attendee_id: string;
  event_id: string;
  session_id?: string | null; // Applicable conference/track session
  gate_id?: string | null;
  scanned_at: string;
  scanned_by?: string | null;
  scan_result: ScanResultStatus;
  metadata?: Record<string, unknown>;
}

export interface ReassignmentRequest {
  booking_id: string;
  ticket_id: string;
  current_attendee_id: string;
  new_attendee: {
    name: string;
    email: string;
    phone?: string | null;
    customResponses?: Record<string, unknown>;
  };
  actor_email: string;
  is_organizer?: boolean;
  organizer_override?: boolean; // Required if ticket has recorded attendance / check-in
  reason?: string;
  expectedVersion?: number; // Concurrency protection
}

export interface ReassignmentResult {
  success: boolean;
  booking_id?: string;
  ticket_id?: string;
  previous_attendee_id?: string;
  new_attendee_id?: string;
  revoked_credential_id?: string;
  new_credential_id?: string;
  new_pass_token?: string;
  error?: string;
  message?: string;
}

export interface CredentialVerificationResult {
  valid: boolean;
  status: ScanResultStatus;
  credential_id?: string;
  ticket_id?: string;
  booking_id?: string;
  event_id?: string;
  attendee?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  scan_event_id?: string;
  checked_in_at?: string | null;
  error?: string;
  message?: string;
}

export interface TicketAuditHistory {
  ticket_id: string;
  booking_id: string;
  credentials: DigitalCredential[];
  scan_events: ScanEvent[];
  reassignments: Array<{
    id?: string;
    ticket_id?: string;
    booking_id?: string;
    timestamp: string;
    from_attendee_id: string;
    from_name: string;
    from_email: string;
    to_attendee_id: string;
    to_name: string;
    to_email: string;
    actor_email: string;
    reason?: string;
    revoked_credential_id: string;
    new_credential_id: string;
  }>;
}
