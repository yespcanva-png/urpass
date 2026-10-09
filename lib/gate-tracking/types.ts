export type ScannerOperationMode =
  | "entry" // Main Event Entry (records entry, sets presence INSIDE)
  | "exit" // Event Exit (records exit, sets presence OUTSIDE)
  | "re_entry" // Event Re-Entry (records re-entry, sets presence INSIDE)
  | "verify_only"; // Ticket Verification Only (inspects validity without mutating presence)

export type VenuePresenceState = "OUTSIDE" | "INSIDE";

export type GateType = "entry" | "exit" | "bidirectional" | "verification_only";

export type DuplicateEntryPolicy = "reject" | "warn" | "allow_multi_scan";
export type UnmatchedExitPolicy = "flag_and_record" | "reject" | "allow";
export type OfflineSyncPolicy = "queue_and_reconcile" | "strict_online_only";

export interface EventZone {
  id: string;
  name: string;
  capacity_limit?: number | null;
  description?: string;
}

export interface EventGate {
  id: string;
  name: string;
  code: string;
  zone_id?: string | null;
  type: GateType;
  allowedTicketTypeIds?: string[]; // Empty/undefined = all tiers allowed
  is_active: boolean;
}

export interface StaffGateAssignment {
  operator_id: string;
  operator_email: string;
  allowed_gate_ids: string[]; // Empty/undefined = all gates permitted
}

export interface GateTrackingConfig {
  enabled: boolean;
  allowReEntry: boolean;
  duplicateEntryPolicy: DuplicateEntryPolicy;
  duplicateWindowSeconds: number;
  unmatchedExitPolicy: UnmatchedExitPolicy;
  offlineSyncPolicy: OfflineSyncPolicy;
  zones: EventZone[];
  gates: EventGate[];
  staffAssignments: StaffGateAssignment[];
}

export interface GateScanRecord {
  scan_id: string;
  event_id: string;
  credential_id: string;
  ticket_id: string;
  attendee_id: string;
  gate_id: string;
  operator_id: string;
  operator_email: string;
  device_id?: string;
  operation_mode: ScannerOperationMode;
  presence_before: VenuePresenceState;
  presence_after: VenuePresenceState;
  result: "GRANTED" | "DENIED" | "WARNING";
  reason_code?: string;
  timestamp: string; // Server-authoritative timestamp for online scans
  is_offline_reconciled?: boolean;
}

export interface GateScanRequest {
  eventId: string;
  credentialToken: string;
  operationMode: ScannerOperationMode;
  gateId: string;
  operatorId: string;
  operatorEmail: string;
  deviceId?: string;
  clientTimestamp?: string;
  isOffline?: boolean;
}

export interface GateScanResult {
  success: boolean;
  status:
    | "GRANTED"
    | "DENIED"
    | "WARNING"
    | "ALREADY_INSIDE"
    | "ALREADY_OUTSIDE"
    | "TIER_MISMATCH"
    | "GATE_UNAUTHORIZED"
    | "INVALID_CREDENTIAL"
    | "REVOKED_CREDENTIAL"
    | "RE_ENTRY_NOT_PERMITTED";
  operationMode: ScannerOperationMode;
  presenceState: VenuePresenceState;
  attendee?: {
    id: string;
    name: string;
    email: string;
    ticketTier?: string;
    ticketTypeId?: string;
  };
  gate?: {
    id: string;
    name: string;
    code: string;
    zoneName?: string;
  };
  serverTimestamp: string;
  scanEventId: string;
  error?: string;
  message?: string;
  warning?: string;
}

export interface VenuePresenceSummary {
  totalRegistered: number;
  totalEntered: number;
  currentlyInside: number;
  currentlyOutside: number;
  totalExits: number;
  totalReEntries: number;
  gateStats: Record<
    string,
    { entries: number; exits: number; reEntries: number; denials: number }
  >;
  zoneOccupancy: Record<string, number>;
}
