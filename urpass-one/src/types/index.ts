export type UserRole =
  | "super_admin"
  | "org_admin"
  | "event_manager"
  | "gate_manager"
  | "gate_staff"
  | "view_only_ops";

export interface UserPermissions {
  canAccessEvents: boolean;
  canOperateGates: boolean;
  canSearchAttendees: boolean;
  canOverrideScans: boolean;
  canPerformCheckout: boolean;
  canViewAnalytics: boolean;
  canManageStaff: boolean;
  canConfigureAccessRules: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  orgId?: string;
  orgName?: string;
  avatarUrl?: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  role: UserRole;
  logoUrl?: string;
  eventsCount: number;
}

export interface EventSummary {
  id: string;
  organizationId?: string;
  name: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  status: "draft" | "active" | "published" | "completed" | "cancelled";
  attendeeLimit?: number;
  totalRegistrations: number;
  approvedCount: number;
  checkedInCount: number;
  currentlyInsideCount: number;
  checkedOutCount: number;
  activeGatesCount: number;
  currency: string;
}

export type GateMode = "entry" | "exit" | "both";
export type GateStatus = "open" | "closed";

export interface Gate {
  id: string;
  eventId: string;
  name: string;
  zoneId?: string;
  zoneName?: string;
  mode: GateMode;
  status: GateStatus;
  capacity?: number;
  activeScannersCount: number;
  scansCount: number;
  lastScanAt?: string;
  allowedTicketTypes?: string[];
  allowedBadgeTypes?: string[];
  assignedStaffNames?: string[];
}

export type PassType =
  | "participant"
  | "vip"
  | "speaker"
  | "staff"
  | "exhibitor"
  | "sponsor"
  | "student"
  | "delegate";

export type ApplicationStatus = "approved" | "pending" | "rejected" | "waitlisted";
export type PresenceStatus = "inside" | "outside";

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  passType: PassType;
  ticketTypeId?: string;
  ticketName?: string;
  ticketNumber?: string;
  registrationId?: string;
  passToken: string;
  applicationStatus: ApplicationStatus;
  presenceStatus: PresenceStatus;
  checkinCount: number;
  checkoutCount: number;
  lastCheckinAt?: string;
  lastCheckoutAt?: string;
  lastGateId?: string;
  lastGateName?: string;
  lastDeviceName?: string;
  photoUrl?: string;
  company?: string;
  studentId?: string;
  customFields?: Record<string, string>;
  assignedZones?: string[];
}

export type ScanDirection = "in" | "out";

export type ScanResultStatus =
  | "valid_entry"
  | "valid_exit"
  | "already_checked_in"
  | "already_checked_out"
  | "requires_review"
  | "invalid_qr"
  | "cancelled_ticket"
  | "wrong_event"
  | "wrong_gate"
  | "expired_pass"
  | "capacity_exceeded";

export type ScanFeedbackColor = "green" | "red" | "amber";

export interface PreviousScanInfo {
  timestamp: string;
  gateName: string;
  deviceName: string;
  action: string;
  staffName?: string;
}

export interface ScanValidationResult {
  status: ScanResultStatus;
  color: ScanFeedbackColor;
  allowed: boolean;
  message: string;
  rejectionReason?: string;
  attendee: Attendee | null;
  direction: ScanDirection;
  previousScan: PreviousScanInfo | null;
  canOverride: boolean;
  timestamp: string;
}

export interface OfflineScanRecord {
  id: string;
  qrPayload: string;
  attendeeId?: string;
  eventId: string;
  gateId: string;
  gateName: string;
  direction: ScanDirection;
  timestamp: string;
  deviceId: string;
  scannerUserId: string;
  scannerUserName: string;
  synced: boolean;
  syncError?: string;
  override?: boolean;
  overrideReason?: string;
  overrideBy?: string;
}

export interface ScanAuditLog {
  id: string;
  eventId: string;
  gateId: string;
  gateName: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  qrPayload: string;
  attendeeId?: string;
  attendeeName?: string;
  passType?: PassType;
  resultStatus: ScanResultStatus;
  feedbackColor: ScanFeedbackColor;
  direction: ScanDirection;
  timestamp: string;
  isOffline: boolean;
  isOfflineQueued?: boolean;
  isOverride: boolean;
  overrideReason?: string;
  overrideBy?: string;
  rejectionReason?: string;
}

export type AlertType =
  | "gate_offline"
  | "sync_lag"
  | "duplicate_spike"
  | "invalid_qr_spike"
  | "capacity_warning"
  | "capacity_critical";

export type AlertSeverity = "info" | "warning" | "critical";

export interface OperationalAlert {
  id: string;
  eventId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ScannerDeviceInfo {
  deviceId: string;
  deviceName: string;
  model: string;
  platform: "ios" | "android" | "web";
  appVersion: string;
  batteryLevel?: number;
  isOnline: boolean;
  assignedGateId?: string;
  assignedGateName?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  lastSyncAt: string;
  lastActivityAt: string;
  isRevoked: boolean;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  type: "check_in" | "check_out" | "duplicate_rejected" | "invalid_rejected" | "override" | "device_offline";
  title: string;
  subtitle: string;
  gateName: string;
  severity: "normal" | "warning" | "critical" | "success";
}
