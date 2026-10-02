export type BadgeRoleType =
  | "attendee"
  | "vip"
  | "speaker"
  | "staff"
  | "sponsor"
  | "exhibitor"
  | "custom";

export type BadgeOrientation = "portrait" | "landscape";

export type BadgeSizePreset =
  | "lanyard_100x150"
  | "card_cr80"
  | "badge_4x6"
  | "badge_3x4"
  | "custom";

export interface BadgeSizeConfig {
  preset: BadgeSizePreset;
  widthMm: number;
  heightMm: number;
  label: string;
  description: string;
}

export const BADGE_SIZE_PRESETS: Record<BadgeSizePreset, BadgeSizeConfig> = {
  lanyard_100x150: {
    preset: "lanyard_100x150",
    widthMm: 100,
    heightMm: 150,
    label: "Conference Lanyard (100 × 150 mm)",
    description: "Standard large pouch lanyard badge with prominent photo, role banner, and QR.",
  },
  card_cr80: {
    preset: "card_cr80",
    widthMm: 85.6,
    heightMm: 53.98,
    label: "Credit Card CR80 (86 × 54 mm)",
    description: "PVC plastic card format for direct thermal or retransfer card printers.",
  },
  badge_4x6: {
    preset: "badge_4x6",
    widthMm: 101.6,
    heightMm: 152.4,
    label: "Executive Summit (4 × 6 in)",
    description: "Oversized executive badge with agenda track highlights and multi-zone access pills.",
  },
  badge_3x4: {
    preset: "badge_3x4",
    widthMm: 76.2,
    heightMm: 101.6,
    label: "Compact Badge (3 × 4 in)",
    description: "Lightweight badge format suited for workshops and symposiums.",
  },
  custom: {
    preset: "custom",
    widthMm: 100,
    heightMm: 140,
    label: "Custom Dimensions",
    description: "Organizer-specified custom physical dimensions for continuous roll or die-cut paper.",
  },
};

export interface BadgeElementConfig {
  id: string;
  type: "text" | "dynamic" | "qr" | "shape" | "photo" | "barcode" | "zone_pills";
  label: string;
  field?:
    | "attendee.name"
    | "attendee.company"
    | "attendee.role"
    | "ticket.name"
    | "badge.type"
    | "event.name"
    | "event.date"
    | "event.venue"
    | "booth.number"
    | "custom";
  staticText?: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  fontSizePx: number;
  fontWeight: "normal" | "bold" | "black";
  color: string;
  align: "left" | "center" | "right";
  widthPercent?: number;
  heightPercent?: number;
  backgroundColor?: string;
  borderRadiusPx?: number;
  visible: boolean;
}

export interface BadgeTemplateLayout {
  headerColor: string;
  headerTextColor: string;
  headerTitle?: string;
  badgeTypeTag: BadgeRoleType;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  showLanyardSlot: boolean;
  showQrCode: boolean;
  elements: BadgeElementConfig[];
}

export interface BadgeTemplate {
  id: string;
  eventId: string;
  name: string;
  badgeType: BadgeRoleType;
  orientation: BadgeOrientation;
  sizePreset: BadgeSizePreset;
  widthMm: number;
  heightMm: number;
  layout: BadgeTemplateLayout;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PrintQueueStatus = "queued" | "printing" | "printed" | "failed" | "reprinted";

export interface BadgePrintQueueItem {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeCompany?: string;
  ticketName?: string;
  badgeType: BadgeRoleType;
  templateId?: string;
  status: PrintQueueStatus;
  printerId?: string;
  printedBy?: string;
  printedAt?: string | null;
  createdAt: string;
}

export interface BadgePrintLog {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  templateId?: string;
  printerId?: string;
  printType: "initial" | "reprint" | "batch" | "desk_walkin";
  reprintReason?: string;
  printedBy?: string;
  printedByName?: string;
  createdAt: string;
}

export type ZoneType =
  | "main_hall"
  | "vip"
  | "expo"
  | "backstage"
  | "staff_only"
  | "dining"
  | "custom";

export interface EventZone {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  zoneType: ZoneType;
  color: string;
  capacity: number;
  currentOccupancy: number;
  peakOccupancy: number;
  position: number;
  createdAt?: string;
}

export type AccessRuleType =
  | "ticket_type"
  | "badge_type"
  | "role"
  | "session"
  | "time_window"
  | "multi_condition";

export interface AccessRule {
  id: string;
  eventId: string;
  zoneId: string;
  name: string;
  ruleType: AccessRuleType;
  allowedTicketTypeIds: string[];
  allowedBadgeTypes: BadgeRoleType[];
  allowedRoles: string[];
  gateId?: string;
  dayNumber?: number;
  sessionId?: string;
  startTime?: string; // HH:MM:SS
  endTime?: string;   // HH:MM:SS
  dayOfEvent?: number;
  isActive: boolean;
  createdAt: string;
}

export type ScanDirection = "in" | "out";
export type ScanValidationStatus = "allowed" | "denied" | "capacity_override";

export interface ZoneScanRecord {
  id: string;
  eventId: string;
  zoneId: string;
  zoneName?: string;
  gateId?: string;
  gateName?: string;
  attendeeId: string;
  attendeeName?: string;
  badgeType?: BadgeRoleType;
  passId?: string;
  direction: ScanDirection;
  status: ScanValidationStatus;
  rejectionReason?: string;
  isOverride?: boolean;
  overrideReason?: string;
  overrideBy?: string;
  deviceId?: string;
  staffUserId?: string;
  staffName?: string;
  scannedAt: string;
}

export type MarkerType =
  | "hall"
  | "booth"
  | "zone"
  | "gate"
  | "registration_desk"
  | "food_area"
  | "emergency_exit";

export interface FloorPlanMarker {
  id: string;
  type: MarkerType;
  label: string;
  details?: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  zoneId?: string;
  color?: string;
  boothNumber?: string;
  iconName?: string;
}

export interface VenueFloorPlan {
  id: string;
  eventId: string;
  name: string;
  imageUrl?: string;
  widthPx: number;
  heightPx: number;
  markers: FloorPlanMarker[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StaffRole =
  | "gate_scanner"
  | "zone_monitor"
  | "registration_desk"
  | "badge_printer"
  | "session_coordinator"
  | "help_desk"
  | "supervisor";

export interface OpsStaffAssignment {
  id: string;
  eventId: string;
  userId?: string;
  staffName: string;
  staffEmail?: string;
  staffPhone?: string;
  pinCode: string;
  role: StaffRole;
  gateId?: string;
  gateName?: string;
  zoneId?: string;
  zoneName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface OpsDevice {
  id: string;
  eventId: string;
  deviceId: string;
  deviceName: string;
  deviceType: "smartphone" | "tablet" | "laptop_webcam" | "handheld_laser" | "printer_station";
  assignedGateId?: string;
  assignedGateName?: string;
  assignedZoneId?: string;
  assignedZoneName?: string;
  appVersion: string;
  isOnline: boolean;
  batteryLevel?: number;
  lastHeartbeatAt: string;
  createdAt: string;
}

export type AlertSeverity = "info" | "warning" | "critical";
export type AlertType =
  | "zone_nearly_full"
  | "zone_full"
  | "scanner_offline"
  | "printer_failure"
  | "high_duplicate_scans"
  | "gate_congestion";

export interface OpsAlert {
  id: string;
  eventId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  zoneId?: string;
  zoneName?: string;
  gateId?: string;
  gateName?: string;
  deviceId?: string;
  isResolved: boolean;
  resolvedAt?: string | null;
  createdAt: string;
}

export type AuditActionType =
  | "manual_checkin"
  | "capacity_override"
  | "badge_reprint"
  | "walkin_registration"
  | "payment_status_change"
  | "zone_override"
  | "gate_reassignment"
  | "staff_pin_generated";

export interface OpsAuditLog {
  id: string;
  eventId: string;
  actionType: AuditActionType;
  actorId?: string;
  actorName: string;
  targetType: "attendee" | "zone" | "gate" | "badge" | "payment" | "device" | "staff";
  targetId: string;
  details: Record<string, unknown>;
  createdAt: string;
}
