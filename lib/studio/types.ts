export type TicketFormat = "digital" | "printable" | "badge";

export const FORMAT_DIMENSIONS: Record<TicketFormat, { width: number; height: number; label: string; description: string }> = {
  digital: {
    width: 380,
    height: 680,
    label: "Digital Pass",
    description: "Mobile-first vertical pass optimized for smartphones & Apple/Google Wallets.",
  },
  printable: {
    width: 780,
    height: 340,
    label: "Printable Ticket",
    description: "Standard landscape ticket with perforated stub for physical print & gate check-in.",
  },
  badge: {
    width: 440,
    height: 640,
    label: "Event Badge",
    description: "Lanyard badge format with prominent attendee credentials for conferences & summits.",
  },
};

export type StudioElementType = "text" | "dynamic_text" | "image" | "shape" | "qr" | "divider";

export type DynamicFieldKey =
  | "attendee.name"
  | "attendee.email"
  | "attendee.phone"
  | "attendee.company"
  | "ticket.id"
  | "ticket.category"
  | "ticket.zone"
  | "ticket.seat"
  | "event.name"
  | "event.date"
  | "event.time"
  | "event.venue";

export interface StudioElementBase {
  id: string;
  type: StudioElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  locked?: boolean;
  hidden?: boolean;
}

export interface StudioTextElement extends StudioElementBase {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  textAlign: "left" | "center" | "right";
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  opacity?: number;
}

export interface StudioDynamicTextElement extends StudioElementBase {
  type: "dynamic_text";
  fieldKey: DynamicFieldKey;
  fallbackText: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  textAlign: "left" | "center" | "right";
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  opacity?: number;
  prefix?: string;
  suffix?: string;
}

export interface StudioImageElement extends StudioElementBase {
  type: "image";
  src: string;
  alt?: string;
  borderRadius?: number;
  opacity?: number;
  objectFit?: "contain" | "cover" | "fill";
  aspectRatioLocked?: boolean;
  borderWidth?: number;
  borderColor?: string;
}

export interface StudioShapeElement extends StudioElementBase {
  type: "shape";
  shapeType: "rect" | "pill" | "circle";
  fillColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
}

export interface StudioDividerElement extends StudioElementBase {
  type: "divider";
  color: string;
  thickness: number;
  style: "solid" | "dashed" | "dotted";
  opacity?: number;
}

export interface StudioQRElement extends StudioElementBase {
  type: "qr";
  size: number;
  fgColor: string;
  bgColor: string;
  cornerRadius?: number;
  showScanLabel?: boolean;
  scanLabelText?: string;
  showAttendeeId?: boolean;
  contrastSafe?: boolean;
}

export type StudioElement =
  | StudioTextElement
  | StudioDynamicTextElement
  | StudioImageElement
  | StudioShapeElement
  | StudioDividerElement
  | StudioQRElement;

export interface StudioBackground {
  type: "color" | "gradient" | "image" | "pattern";
  color: string;
  secondaryColor?: string;
  gradientAngle?: number;
  pattern?: "mesh" | "dots" | "radial" | "stripes" | "clean";
  imageUrl?: string;
  overlayOpacity?: number;
}

export interface StudioDesign {
  version: 2;
  format: TicketFormat;
  width: number;
  height: number;
  background: StudioBackground;
  elements: StudioElement[];
  isPublished: boolean;
  updatedAt?: string;
  targetTicketType?: string | null; // null = all ticket types, or ticket_type_id
  name?: string;
}

export interface DynamicFieldDefinition {
  key: DynamicFieldKey;
  label: string;
  category: "attendee" | "ticket" | "event";
  sampleValue: string;
  defaultFontSize: number;
  defaultFontWeight: number | string;
  defaultColor: string;
}

export const DYNAMIC_FIELD_DEFINITIONS: DynamicFieldDefinition[] = [
  {
    key: "attendee.name",
    label: "Attendee Name",
    category: "attendee",
    sampleValue: "ARJUN KUMAR",
    defaultFontSize: 18,
    defaultFontWeight: 700,
    defaultColor: "#111827",
  },
  {
    key: "ticket.category",
    label: "Ticket Type / Tier",
    category: "ticket",
    sampleValue: "VIP ACCESS",
    defaultFontSize: 11,
    defaultFontWeight: 700,
    defaultColor: "#635BFF",
  },
  {
    key: "ticket.id",
    label: "Ticket Number / ID",
    category: "ticket",
    sampleValue: "#URP-10284",
    defaultFontSize: 11,
    defaultFontWeight: 600,
    defaultColor: "#6B7280",
  },
  {
    key: "event.name",
    label: "Event Name",
    category: "event",
    sampleValue: "URPASS TECH SUMMIT 2026",
    defaultFontSize: 16,
    defaultFontWeight: 800,
    defaultColor: "#111827",
  },
  {
    key: "event.date",
    label: "Event Date",
    category: "event",
    sampleValue: "24 OCT 2026",
    defaultFontSize: 12,
    defaultFontWeight: 600,
    defaultColor: "#4B5563",
  },
  {
    key: "event.time",
    label: "Event Time",
    category: "event",
    sampleValue: "10:00 AM - 5:00 PM",
    defaultFontSize: 11,
    defaultFontWeight: 500,
    defaultColor: "#6B7280",
  },
  {
    key: "event.venue",
    label: "Venue / Location",
    category: "event",
    sampleValue: "The Residency, Coimbatore",
    defaultFontSize: 11,
    defaultFontWeight: 500,
    defaultColor: "#4B5563",
  },
  {
    key: "ticket.zone",
    label: "Zone / Gate",
    category: "ticket",
    sampleValue: "GATE 3 · HALL A",
    defaultFontSize: 11,
    defaultFontWeight: 700,
    defaultColor: "#059669",
  },
  {
    key: "ticket.seat",
    label: "Seat / Row",
    category: "ticket",
    sampleValue: "ROW B · SEAT 14",
    defaultFontSize: 11,
    defaultFontWeight: 700,
    defaultColor: "#D97706",
  },
  {
    key: "attendee.company",
    label: "Company / Org",
    category: "attendee",
    sampleValue: "Stripe India",
    defaultFontSize: 12,
    defaultFontWeight: 500,
    defaultColor: "#6B7280",
  },
  {
    key: "attendee.email",
    label: "Attendee Email",
    category: "attendee",
    sampleValue: "arjun.kumar@gmail.com",
    defaultFontSize: 10,
    defaultFontWeight: 400,
    defaultColor: "#9CA3AF",
  },
  {
    key: "attendee.phone",
    label: "Attendee Phone",
    category: "attendee",
    sampleValue: "+91 98765 43210",
    defaultFontSize: 10,
    defaultFontWeight: 400,
    defaultColor: "#9CA3AF",
  },
];

export const MIN_QR_SIZE = 140;
export const RECOMMENDED_QR_SIZE = 180;
