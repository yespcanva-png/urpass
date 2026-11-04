import { CINEMA_TICKET_DESIGN } from "./cinema-template";
import type { StudioDesign, TicketFormat, DynamicFieldKey, StudioDynamicTextElement, StudioTextElement } from "./types";
import type { TicketDesignConfig, TicketTemplate, TicketShape, TicketRealStyle } from "@/lib/pass-design";

export type TemplateTier = "free" | "paid";

export interface StudioTemplateDefinition {
  id: string;
  name: string;
  category: "Corporate" | "Technology" | "Campus" | "Events & Entertainment" | "Premium" | string;
  format: TicketFormat;
  description: string;
  tags: string[];
  thumbnailBg: string;
  tier?: TemplateTier;
  priceINR?: number;
  badgeLabel?: string;
  featured?: boolean;
  design: StudioDesign;
}

function mkText(
  id: string,
  content: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize = 10,
  fontWeight: number | string = 700,
  color = "#777984",
  textAlign: "left" | "center" | "right" = "left",
  letterSpacing = 1.2
): StudioTextElement {
  return {
    id,
    type: "text",
    name: content,
    content,
    x,
    y,
    width,
    height,
    zIndex: 3,
    fontFamily: "sans",
    fontSize,
    fontWeight,
    color,
    textAlign,
    letterSpacing,
  };
}

function mkField(
  id: string,
  fieldKey: DynamicFieldKey,
  fallbackText: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize = 14,
  fontWeight: number | string = 700,
  color = "#18181B",
  textAlign: "left" | "center" | "right" = "left"
): StudioDynamicTextElement {
  return {
    id,
    type: "dynamic_text",
    name: id,
    fieldKey,
    fallbackText,
    x,
    y,
    width,
    height,
    zIndex: 3,
    fontFamily: "sans",
    fontSize,
    fontWeight,
    lineHeight: 1.25,
    color,
    textAlign,
  };
}

/**
 * Generates an authentic StudioDesign for a digital mobile pass
 * with real ticket anatomy: header foil, seating matrix, metadata, perforated stub, and dual-scan codes.
 */
function createDigitalPassDesign(
  name: string,
  bgColor = "#FFFFFF",
  fgColor = "#18181B",
  accentColor = "#635BFF"
): StudioDesign {
  const isDark = bgColor === "#09090B" || bgColor === "#0F1E36" || bgColor === "#0B0F19" || bgColor === "#18181B" || bgColor === "#0F0B1E" || bgColor === "#0F172A";
  const stubBg = isDark ? "#14151B" : "#F8FAFC";
  const notchFill = isDark ? "#09090D" : "#F1F5F9";
  const labelColor = isDark ? "#94A3B8" : "#64748B";

  return {
    version: 2,
    format: "digital",
    width: 380,
    height: 680,
    name,
    isPublished: true,
    background: { type: "color", color: bgColor },
    elements: [
      {
        id: `shape-header-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Header Banner",
        shapeType: "rect",
        fillColor: accentColor,
        x: 0,
        y: 0,
        width: 380,
        height: 44,
        zIndex: 1,
      },
      mkText(`lbl-hdr-brand-${Math.random().toString(36).slice(2, 7)}`, "★ OFFICIAL ADMISSION PASS", 20, 14, 220, 18, 9, 800, "#FFFFFF", "left", 1.8),
      mkText(`lbl-hdr-stub-${Math.random().toString(36).slice(2, 7)}`, "SECURE QR", 260, 14, 100, 18, 9, 800, "#FFFFFF", "right", 1.8),
      mkField(`field-event-${Math.random().toString(36).slice(2, 7)}`, "event.name", "URPASS ANNUAL EVENT", 20, 60, 340, 52, 21, 800, fgColor, "center"),
      {
        id: `shape-cat-bg-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Category Background",
        shapeType: "pill",
        fillColor: isDark ? "#1E1E2E" : "#F1F5F9",
        x: 80,
        y: 122,
        width: 220,
        height: 28,
        zIndex: 2,
      },
      mkField(`field-cat-${Math.random().toString(36).slice(2, 7)}`, "ticket.category", "VIP DELEGATE PASS", 80, 128, 220, 20, 11, 800, accentColor, "center"),
      mkText(`lbl-sched-${Math.random().toString(36).slice(2, 7)}`, "SCHEDULE", 24, 168, 160, 16, 8, 700, labelColor),
      mkText(`lbl-venue-${Math.random().toString(36).slice(2, 7)}`, "LOCATION", 196, 168, 160, 16, 8, 700, labelColor),
      mkField(`field-date-${Math.random().toString(36).slice(2, 7)}`, "event.date", "24 OCT 2026", 24, 188, 160, 22, 13, 700, fgColor),
      mkField(`field-venue-${Math.random().toString(36).slice(2, 7)}`, "event.venue", "Main Hall, Tech Park", 196, 188, 160, 22, 13, 700, fgColor),
      mkText(`lbl-holder-${Math.random().toString(36).slice(2, 7)}`, "PASS HOLDER", 24, 228, 332, 16, 8, 700, labelColor),
      mkField(`field-attendee-${Math.random().toString(36).slice(2, 7)}`, "attendee.name", "Aarav Mehta", 24, 248, 332, 28, 18, 800, fgColor),
      mkText(`lbl-matrix-${Math.random().toString(36).slice(2, 7)}`, "GATE 01  ·  SEC VIP  ·  ROW A  ·  SEAT 14", 24, 288, 332, 18, 10, 800, accentColor, "center", 1.5),
      {
        id: `shape-stub-bg-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Stub Background",
        shapeType: "rect",
        fillColor: stubBg,
        x: 0,
        y: 330,
        width: 380,
        height: 390,
        zIndex: 1,
      },
      {
        id: `div-perforation-${Math.random().toString(36).slice(2, 7)}`,
        type: "divider",
        name: "Tear-off Perforation",
        color: isDark ? "#2D3139" : "#CBD5E1",
        thickness: 2,
        style: "dashed",
        x: 18,
        y: 330,
        width: 344,
        height: 2,
        zIndex: 3,
      },
      {
        id: `shape-left-notch-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Left Notch Cutout",
        shapeType: "circle",
        fillColor: notchFill,
        x: -12,
        y: 318,
        width: 24,
        height: 24,
        zIndex: 4,
      },
      {
        id: `shape-right-notch-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Right Notch Cutout",
        shapeType: "circle",
        fillColor: notchFill,
        x: 368,
        y: 318,
        width: 24,
        height: 24,
        zIndex: 4,
      },
      mkText(`lbl-counterfoil-${Math.random().toString(36).slice(2, 7)}`, "ADMISSION COUNTERFOIL · AUDIT COUPON", 20, 344, 340, 16, 8, 800, labelColor, "center", 1.5),
      {
        id: `qr-${Math.random().toString(36).slice(2, 7)}`,
        type: "qr",
        name: "Scannable QR Code",
        size: 168,
        fgColor: "#000000",
        bgColor: "#FFFFFF",
        cornerRadius: 12,
        showScanLabel: true,
        scanLabelText: "SCAN AT GATE",
        contrastSafe: true,
        x: 106,
        y: 374,
        width: 168,
        height: 168,
        locked: true,
        zIndex: 3,
      },
      mkText(`lbl-ref-${Math.random().toString(36).slice(2, 7)}`, "TICKET CREDENTIAL", 20, 560, 340, 16, 8, 700, labelColor, "center"),
      mkField(`field-id-${Math.random().toString(36).slice(2, 7)}`, "ticket.id", "#URP-10284", 20, 580, 340, 22, 13, 800, fgColor, "center"),
      mkText(`lbl-footer-${Math.random().toString(36).slice(2, 7)}`, "OFFICIAL PASS · VALID FOR ADMISSION · KEEP STUB", 20, 680, 340, 16, 7.5, 700, labelColor, "center", 1.2),
    ],
  };
}

/**
 * Generates an authentic StudioDesign for a printable landscape stub ticket
 * with two-compartment architecture (Main Pass + Tear-off Gate Stub with Notches).
 */
function createPrintableTicketDesign(
  name: string,
  bgColor = "#FFFFFF",
  fgColor = "#18181B",
  accentColor = "#635BFF"
): StudioDesign {
  const isDark = bgColor === "#111827" || bgColor === "#0F1E36" || bgColor === "#09090B";
  const stubBg = isDark ? "#171F30" : "#F8FAFC";
  const notchFill = isDark ? "#0B0F19" : "#F1F5F9";
  const labelColor = isDark ? "#94A3B8" : "#64748B";

  return {
    version: 2,
    format: "printable",
    width: 780,
    height: 340,
    name,
    isPublished: true,
    background: { type: "color", color: bgColor },
    elements: [
      {
        id: `shape-accent-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Left Accent Strip",
        shapeType: "rect",
        fillColor: accentColor,
        x: 0,
        y: 0,
        width: 12,
        height: 340,
        zIndex: 1,
      },
      mkText(`lbl-main-hdr-${Math.random().toString(36).slice(2, 7)}`, "★ OFFICIAL EVENT ADMISSION TICKET", 32, 22, 480, 16, 8.5, 800, accentColor, "left", 1.8),
      mkField(`text-event-${Math.random().toString(36).slice(2, 7)}`, "event.name", "URPASS ANNUAL SUMMIT", 32, 44, 480, 38, 24, 800, fgColor, "left"),
      mkText(`lbl-holder-${Math.random().toString(36).slice(2, 7)}`, "PASS HOLDER", 32, 98, 240, 16, 8, 700, labelColor),
      mkField(`text-attendee-${Math.random().toString(36).slice(2, 7)}`, "attendee.name", "Aarav Mehta", 32, 116, 240, 26, 17, 700, fgColor, "left"),
      mkText(`lbl-venue-${Math.random().toString(36).slice(2, 7)}`, "LOCATION & DATE", 280, 98, 240, 16, 8, 700, labelColor),
      mkField(`field-date-${Math.random().toString(36).slice(2, 7)}`, "event.date", "24 OCT 2026", 280, 116, 240, 24, 13, 700, fgColor),
      mkField(`field-venue-${Math.random().toString(36).slice(2, 7)}`, "event.venue", "Convention Center Hall A", 280, 142, 240, 24, 12, 600, fgColor),
      mkText(`lbl-matrix-${Math.random().toString(36).slice(2, 7)}`, "GATE 01  ·  SEC VIP  ·  ROW A  ·  SEAT 14", 32, 196, 480, 20, 11, 800, accentColor, "left", 1.5),
      mkText(`lbl-barcode-${Math.random().toString(36).slice(2, 7)}`, "BARCODE // LINEAR ADMISSION CODE", 32, 242, 480, 14, 7.5, 700, labelColor),
      mkField(`field-barcode-${Math.random().toString(36).slice(2, 7)}`, "ticket.id", "* URPASS-10284 *", 32, 262, 480, 22, 12, 700, fgColor),
      {
        id: `shape-stub-bg-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Stub Background",
        shapeType: "rect",
        fillColor: stubBg,
        x: 540,
        y: 0,
        width: 240,
        height: 340,
        zIndex: 1,
      },
      {
        id: `divider-${Math.random().toString(36).slice(2, 7)}`,
        type: "divider",
        name: "Perforated Divider",
        color: isDark ? "#374151" : "#CBD5E1",
        thickness: 2,
        style: "dashed",
        x: 540,
        y: 0,
        width: 2,
        height: 340,
        zIndex: 4,
      },
      {
        id: `shape-top-notch-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Top Punch Notch",
        shapeType: "circle",
        fillColor: notchFill,
        x: 527,
        y: -13,
        width: 26,
        height: 26,
        zIndex: 5,
      },
      {
        id: `shape-bottom-notch-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Bottom Punch Notch",
        shapeType: "circle",
        fillColor: notchFill,
        x: 527,
        y: 327,
        width: 26,
        height: 26,
        zIndex: 5,
      },
      mkText(`lbl-stub-hdr-${Math.random().toString(36).slice(2, 7)}`, "GATE STUB · ADMISSION", 555, 18, 210, 16, 8, 800, labelColor, "center", 1.5),
      {
        id: `qr-${Math.random().toString(36).slice(2, 7)}`,
        type: "qr",
        name: "QR Code",
        size: 154,
        fgColor: "#000000",
        bgColor: "#FFFFFF",
        cornerRadius: 8,
        showScanLabel: true,
        scanLabelText: "SCAN AT GATE",
        contrastSafe: true,
        x: 583,
        y: 48,
        width: 154,
        height: 154,
        locked: true,
        zIndex: 5,
      },
      mkText(`lbl-stub-seat-${Math.random().toString(36).slice(2, 7)}`, "SEC VIP · SEAT 14", 555, 236, 210, 16, 9, 800, fgColor, "center"),
      mkField(`field-stub-id-${Math.random().toString(36).slice(2, 7)}`, "ticket.id", "#URP-10284", 555, 260, 210, 20, 11, 700, labelColor, "center"),
      mkText(`lbl-stub-void-${Math.random().toString(36).slice(2, 7)}`, "VOID IF DETACHED", 555, 305, 210, 14, 7.5, 800, isDark ? "#F87171" : "#DC2626", "center", 1.2),
    ],
  };
}

/**
 * Generates a valid StudioDesign for an event lanyard badge
 */
function createBadgeDesign(
  name: string,
  bgColor = "#FFFFFF",
  fgColor = "#18181B",
  accentColor = "#635BFF"
): StudioDesign {
  return {
    version: 2,
    format: "badge",
    width: 440,
    height: 640,
    name,
    isPublished: true,
    background: { type: "color", color: bgColor },
    elements: [
      {
        id: `shape-lanyard-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Lanyard Slot Hole",
        shapeType: "pill",
        x: 190,
        y: 18,
        width: 60,
        height: 12,
        fillColor: "#E5E7EB",
        borderRadius: 999,
        zIndex: 1,
      },
      {
        id: `text-event-${Math.random().toString(36).slice(2, 7)}`,
        type: "dynamic_text",
        name: "Event Name",
        fieldKey: "event.name",
        fallbackText: "EVENT NAME",
        fontFamily: "sans",
        fontSize: 16,
        fontWeight: 800,
        color: accentColor,
        textAlign: "center",
        x: 20,
        y: 54,
        width: 400,
        height: 24,
        zIndex: 2,
      },
      {
        id: `text-attendee-${Math.random().toString(36).slice(2, 7)}`,
        type: "dynamic_text",
        name: "Attendee Name",
        fieldKey: "attendee.name",
        fallbackText: "ATTENDEE NAME",
        fontFamily: "sans",
        fontSize: 24,
        fontWeight: 800,
        color: fgColor,
        textAlign: "center",
        x: 20,
        y: 110,
        width: 400,
        height: 36,
        zIndex: 3,
      },
      {
        id: `qr-${Math.random().toString(36).slice(2, 7)}`,
        type: "qr",
        name: "QR Code",
        size: 180,
        fgColor: "#000000",
        bgColor: "#FFFFFF",
        cornerRadius: 8,
        showScanLabel: true,
        scanLabelText: "SCAN AT ENTRANCE",
        contrastSafe: true,
        x: 130,
        y: 200,
        width: 180,
        height: 180,
        locked: true,
        zIndex: 4,
      },
    ],
  };
}

export const STUDIO_TEMPLATES: StudioTemplateDefinition[] = [
  // ── COLLECTION 1: CORPORATE ──
  {
    id: "corporate-minimal",
    name: "Corporate Minimal",
    category: "Corporate",
    format: "digital",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    featured: true,
    description: "White, charcoal, thin borders, structured typography. Ideal for conferences, seminars, and corporate events.",
    tags: ["Corporate", "Clean", "Minimal", "Conference"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Corporate Minimal", "#FFFFFF", "#18181B", "#18181B"),
  },
  {
    id: "cinema-ticket",
    name: "Cinema Ticket",
    category: "Events & Entertainment",
    format: "digital",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    featured: true,
    description: "BookMyShow-inspired cinema ticket with a rose header, event details, perforated stub, and personal entry QR.",
    tags: ["Cinema", "BookMyShow", "Concert", "Entertainment", "Ticket"],
    thumbnailBg: "#FFF0F3",
    design: CINEMA_TICKET_DESIGN,
  },
  {
    id: "executive-blue",
    name: "Executive Blue",
    category: "Corporate",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Navy and blue accents with a premium structured business layout for leadership summits and board meetings.",
    tags: ["Corporate", "Executive", "Leadership", "Blue"],
    thumbnailBg: "#0F1E36",
    design: createDigitalPassDesign("Executive Blue", "#0F1E36", "#FFFFFF", "#38BDF8"),
  },
  {
    id: "minimal-monochrome",
    name: "Minimal Monochrome",
    category: "Corporate",
    format: "digital",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    description: "High contrast black and white editorial typography with centered QR for professional events.",
    tags: ["Minimal", "Monochrome", "Clean", "Editorial"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Minimal Monochrome", "#FFFFFF", "#000000", "#000000"),
  },
  {
    id: "networking-pro",
    name: "Networking Pro",
    category: "Corporate",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Attendee name, company, and networking role emphasis designed for business networking meetups.",
    tags: ["Corporate", "Networking", "Meetup", "Business"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Networking Pro", "#FFFFFF", "#1E1B4B", "#4F46E5"),
  },

  // ── COLLECTION 2: TECHNOLOGY ──
  {
    id: "tech-pulse",
    name: "Tech Pulse",
    category: "Technology",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    featured: true,
    description: "Dark navy with subtle electric purple/blue gradient accents and technical grid lines for SaaS and hackathons.",
    tags: ["Technology", "Developer", "SaaS", "Hackathon"],
    thumbnailBg: "#0B0F19",
    design: createDigitalPassDesign("Tech Pulse", "#0B0F19", "#FFFFFF", "#8B5CF6"),
  },
  {
    id: "future-grid",
    name: "Future Grid",
    category: "Technology",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Dark background with thin technical grid and sharp monospace typography for developer summits and AI events.",
    tags: ["Technology", "AI", "Terminal", "Cyber"],
    thumbnailBg: "#09090B",
    design: createDigitalPassDesign("Future Grid", "#09090B", "#F4F4F5", "#10B981"),
  },
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Technology",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Hero logo and modern dark-light split designed for brand unveilings and product keynotes.",
    tags: ["Technology", "Keynote", "Launch", "Brand"],
    thumbnailBg: "#18181B",
    design: createDigitalPassDesign("Product Launch", "#18181B", "#FFFFFF", "#6366F1"),
  },
  {
    id: "ultra-qr",
    name: "Ultra QR",
    category: "Technology",
    format: "digital",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    description: "Maximum scan-first layout with oversized QR code and minimal text for high-volume entry gates.",
    tags: ["Technology", "Speed", "HighVolume", "QR"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Ultra QR", "#FFFFFF", "#09090B", "#18181B"),
  },

  // ── COLLECTION 3: CAMPUS ──
  {
    id: "campus-pop",
    name: "Campus Pop",
    category: "Campus",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Bright color blocks and energetic typography with a youthful layout for college fests and student events.",
    tags: ["Campus", "College", "Fest", "Youth"],
    thumbnailBg: "#FFFBEB",
    design: createDigitalPassDesign("Campus Pop", "#FFFBEB", "#1E1B4B", "#F59E0B"),
  },
  {
    id: "campus-classic",
    name: "Campus Classic",
    category: "Campus",
    format: "digital",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    description: "Clean institutional style with prominent college emblem for department seminars and symposiums.",
    tags: ["Campus", "Academic", "Institutional", "University"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Campus Classic", "#FFFFFF", "#064E3B", "#065F46"),
  },
  {
    id: "workshop-clean",
    name: "Workshop Clean",
    category: "Campus",
    format: "printable",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    description: "Simple educational layout with session date, time, and track details prominent for training sessions.",
    tags: ["Campus", "Workshop", "Education", "Training"],
    thumbnailBg: "#FFFFFF",
    design: createPrintableTicketDesign("Workshop Clean", "#FFFFFF", "#134E4A", "#0D9488"),
  },
  {
    id: "speaker-badge",
    name: "Speaker Badge",
    category: "Campus",
    format: "badge",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Mobile pass with prominent speaker credentials, designation, company, and role color strip.",
    tags: ["Campus", "Speaker", "Conference", "Credential"],
    thumbnailBg: "#FFFFFF",
    design: createBadgeDesign("Speaker Badge", "#FFFFFF", "#111827", "#059669"),
  },

  // ── COLLECTION 4: EVENTS & ENTERTAINMENT ──
  {
    id: "festival-neon",
    name: "Festival Neon",
    category: "Events & Entertainment",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Dark artwork with vibrant neon accents and strong ticket category badges for concerts and music fests.",
    tags: ["Entertainment", "Concert", "Music", "Neon"],
    thumbnailBg: "#0F0B1E",
    design: createDigitalPassDesign("Festival Neon", "#0F0B1E", "#FFFFFF", "#EC4899"),
  },
  {
    id: "concert-music-fest",
    name: "Concert Music Fest",
    category: "Events & Entertainment",
    format: "printable",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Wide stub concert ticket layout with tear-off gate validator and artist accent stripe.",
    tags: ["Entertainment", "Concert", "Printable", "Stub"],
    thumbnailBg: "#111827",
    design: createPrintableTicketDesign("Concert Music Fest", "#111827", "#FFFFFF", "#EC4899"),
  },
  {
    id: "urban-festival",
    name: "Urban Festival",
    category: "Events & Entertainment",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Bold typography and poster-inspired blocks for cultural events and youth festivals.",
    tags: ["Entertainment", "Culture", "Poster", "Modern"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Urban Festival", "#FFFFFF", "#18181B", "#FF5500"),
  },
  {
    id: "sports-arena",
    name: "Sports Arena",
    category: "Events & Entertainment",
    format: "printable",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Dynamic diagonal layout with team and stadium gate access indicators for sporting tournaments.",
    tags: ["Entertainment", "Sports", "Arena", "Tournament"],
    thumbnailBg: "#FFFFFF",
    design: createPrintableTicketDesign("Sports Arena", "#FFFFFF", "#111827", "#DC2626"),
  },
  {
    id: "marathon-pass",
    name: "Marathon Pass",
    category: "Events & Entertainment",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Race bib style layout with bold participant number, wave timing, and QR focus for marathons and runs.",
    tags: ["Entertainment", "Marathon", "Running", "Sports"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Marathon Pass", "#FFFFFF", "#1C1917", "#EA580C"),
  },

  // ── COLLECTION 5: PREMIUM ──
  {
    id: "vip-all-access",
    name: "VIP All-Access Pass",
    category: "Premium",
    format: "badge",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    featured: true,
    description: "Executive gold laminated pass with VIP access tier indicator and lanyard notch.",
    tags: ["Premium", "VIP", "Badge", "Access"],
    thumbnailBg: "#0F172A",
    design: createBadgeDesign("VIP All-Access Pass", "#0F172A", "#FFFFFF", "#F59E0B"),
  },
  {
    id: "vip-midnight",
    name: "VIP Midnight",
    category: "Premium",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    featured: true,
    description: "Matte black with subtle gold accents and luxury spacing for VIP galas, private dinners, and patron nights.",
    tags: ["Premium", "VIP", "Luxury", "Gold"],
    thumbnailBg: "#09090B",
    design: createDigitalPassDesign("VIP Midnight", "#09090B", "#FFFFFF", "#D4AF37"),
  },
  {
    id: "premium-ivory",
    name: "Premium Ivory",
    category: "Premium",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Cream background with refined serif heading and elegant minimalism for galas and executive dinners.",
    tags: ["Premium", "Ivory", "Serif", "Gala"],
    thumbnailBg: "#FAF7F2",
    design: createDigitalPassDesign("Premium Ivory", "#FAF7F2", "#292524", "#78716C"),
  },
  {
    id: "elegant-rsvp",
    name: "Elegant RSVP",
    category: "Premium",
    format: "digital",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    description: "Soft neutral background with refined hairline border treatment for weddings and invite-only events.",
    tags: ["Premium", "RSVP", "Wedding", "InviteOnly"],
    thumbnailBg: "#F9FAFB",
    design: createDigitalPassDesign("Elegant RSVP", "#F9FAFB", "#1F2937", "#4B5563"),
  },
  {
    id: "expo-pro",
    name: "Expo Pro",
    category: "Premium",
    format: "badge",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Company-first mobile credential layout with exhibitor and trade visitor badges for exhibitions and expos.",
    tags: ["Premium", "Exhibition", "Expo", "Trade"],
    thumbnailBg: "#F8FAFC",
    design: createBadgeDesign("Expo Pro", "#F8FAFC", "#0F172A", "#1D4ED8"),
  },
];

/**
 * Returns a clone of a template with fresh IDs.
 */
export function cloneTemplateDesign(template: StudioTemplateDefinition): StudioDesign {
  const cloned = JSON.parse(JSON.stringify(template.design)) as StudioDesign;
  cloned.elements = cloned.elements.map((el) => ({
    ...el,
    id: `${el.type}-${Math.random().toString(36).slice(2, 9)}`,
  }));
  return cloned;
}

/**
 * Creates a blank template design for a chosen format.
 */
export function createBlankDesign(format: TicketFormat = "digital"): StudioDesign {
  switch (format) {
    case "printable":
      return {
        version: 2,
        format: "printable",
        width: 780,
        height: 340,
        name: "Untitled Printable Ticket",
        isPublished: false,
        background: { type: "color", color: "#FFFFFF" },
        elements: [
          {
            id: `text-${Math.random().toString(36).slice(2, 9)}`,
            type: "dynamic_text",
            name: "Event Name",
            fieldKey: "event.name",
            fallbackText: "EVENT NAME",
            fontFamily: "sans",
            fontSize: 22,
            fontWeight: 800,
            color: "#111827",
            textAlign: "left",
            x: 32,
            y: 40,
            width: 460,
            height: 34,
            zIndex: 1,
          },
          {
            id: `text-${Math.random().toString(36).slice(2, 9)}`,
            type: "dynamic_text",
            name: "Attendee Name",
            fieldKey: "attendee.name",
            fallbackText: "ATTENDEE NAME",
            fontFamily: "sans",
            fontSize: 18,
            fontWeight: 700,
            color: "#111827",
            textAlign: "left",
            x: 32,
            y: 110,
            width: 460,
            height: 28,
            zIndex: 2,
          },
          {
            id: `divider-${Math.random().toString(36).slice(2, 9)}`,
            type: "divider",
            name: "Stub Divider",
            color: "#E5E7EB",
            thickness: 2,
            style: "dashed",
            x: 540,
            y: 0,
            width: 2,
            height: 340,
            zIndex: 3,
          },
          {
            id: `qr-${Math.random().toString(36).slice(2, 9)}`,
            type: "qr",
            name: "QR Code",
            size: 160,
            fgColor: "#000000",
            bgColor: "#FFFFFF",
            cornerRadius: 8,
            showScanLabel: true,
            scanLabelText: "SCAN AT GATE",
            contrastSafe: true,
            x: 575,
            y: 70,
            width: 160,
            height: 160,
            locked: true,
            zIndex: 4,
          },
        ],
      };
    case "badge":
      return {
        version: 2,
        format: "badge",
        width: 440,
        height: 640,
        name: "Untitled Event Badge",
        isPublished: false,
        background: { type: "color", color: "#FFFFFF" },
        elements: [
          {
            id: `shape-${Math.random().toString(36).slice(2, 9)}`,
            type: "shape",
            name: "Lanyard Slot Hole",
            shapeType: "pill",
            x: 190,
            y: 18,
            width: 60,
            height: 12,
            fillColor: "#E5E7EB",
            borderRadius: 999,
            zIndex: 1,
          },
          {
            id: `text-${Math.random().toString(36).slice(2, 9)}`,
            type: "dynamic_text",
            name: "Event Name",
            fieldKey: "event.name",
            fallbackText: "EVENT NAME",
            fontFamily: "sans",
            fontSize: 16,
            fontWeight: 800,
            color: "#635BFF",
            textAlign: "center",
            x: 20,
            y: 54,
            width: 400,
            height: 24,
            zIndex: 2,
          },
          {
            id: `text-${Math.random().toString(36).slice(2, 9)}`,
            type: "dynamic_text",
            name: "Attendee Name",
            fieldKey: "attendee.name",
            fallbackText: "ATTENDEE NAME",
            fontFamily: "sans",
            fontSize: 24,
            fontWeight: 800,
            color: "#111827",
            textAlign: "center",
            x: 20,
            y: 110,
            width: 400,
            height: 36,
            zIndex: 3,
          },
          {
            id: `qr-${Math.random().toString(36).slice(2, 9)}`,
            type: "qr",
            name: "QR Code",
            size: 180,
            fgColor: "#000000",
            bgColor: "#FFFFFF",
            cornerRadius: 8,
            showScanLabel: true,
            scanLabelText: "SCAN AT ENTRANCE",
            contrastSafe: true,
            x: 130,
            y: 200,
            width: 180,
            height: 180,
            locked: true,
            zIndex: 4,
          },
        ],
      };
    case "digital":
    default:
      return createDigitalPassDesign("Untitled Digital Pass", "#FFFFFF", "#111827", "#635BFF");
  }
}

export const SINGLE_TEMPLATE_PRICE_INR = 49;
export const ALL_ACCESS_BUNDLE_PRICE_INR = 99;

export function getTemplatePrice(template: StudioTemplateDefinition): number {
  if (template.tier === "paid") {
    return template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR;
  }
  return 0;
}

export function isTemplateFree(template: StudioTemplateDefinition): boolean {
  return template.tier !== "paid";
}

/**
 * Converts a StudioTemplateDefinition to a standard TicketDesignConfig
 * compatible with TicketStudio and database pass designs.
 */
export function convertStudioTemplateToTicketDesign(
  tpl: StudioTemplateDefinition
): TicketDesignConfig {
  let templateTheme: TicketTemplate = "event";
  let shape: TicketShape = "standard";
  let primaryColor = "#635BFF";
  let ticketStyle: TicketRealStyle = "concert";

  switch (tpl.id) {
    case "corporate-minimal":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#18181B";
      ticketStyle = "executive";
      break;
    case "cinema-ticket":
      templateTheme = "event";
      shape = "rounded";
      primaryColor = "#F84464";
      ticketStyle = "cinema";
      break;
    case "executive-blue":
      templateTheme = "modern";
      shape = "standard";
      primaryColor = "#2563EB";
      ticketStyle = "executive";
      break;
    case "minimal-monochrome":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#000000";
      ticketStyle = "executive";
      break;
    case "networking-pro":
      templateTheme = "modern";
      shape = "rounded";
      primaryColor = "#4F46E5";
      ticketStyle = "executive";
      break;
    case "tech-pulse":
      templateTheme = "dark";
      shape = "rounded";
      primaryColor = "#8B5CF6";
      ticketStyle = "cyber";
      break;
    case "future-grid":
      templateTheme = "dark";
      shape = "compact";
      primaryColor = "#10B981";
      ticketStyle = "cyber";
      break;
    case "product-launch":
      templateTheme = "modern";
      shape = "standard";
      primaryColor = "#09090B";
      ticketStyle = "cyber";
      break;
    case "ultra-qr":
      templateTheme = "minimal";
      shape = "compact";
      primaryColor = "#18181B";
      ticketStyle = "concert";
      break;
    case "campus-pop":
      templateTheme = "event";
      shape = "rounded";
      primaryColor = "#F59E0B";
      ticketStyle = "vintage";
      break;
    case "campus-classic":
      templateTheme = "event";
      shape = "standard";
      primaryColor = "#065F46";
      ticketStyle = "vintage";
      break;
    case "workshop-clean":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#0D9488";
      ticketStyle = "executive";
      break;
    case "speaker-badge":
      templateTheme = "modern";
      shape = "rounded";
      primaryColor = "#059669";
      ticketStyle = "executive";
      break;
    case "festival-neon":
      templateTheme = "dark";
      shape = "rounded";
      primaryColor = "#EC4899";
      ticketStyle = "concert";
      break;
    case "urban-festival":
      templateTheme = "event";
      shape = "compact";
      primaryColor = "#FF5500";
      ticketStyle = "concert";
      break;
    case "sports-arena":
      templateTheme = "event";
      shape = "compact";
      primaryColor = "#DC2626";
      ticketStyle = "stadium";
      break;
    case "marathon-pass":
      templateTheme = "modern";
      shape = "compact";
      primaryColor = "#EA580C";
      ticketStyle = "stadium";
      break;
    case "vip-midnight":
      templateTheme = "dark";
      shape = "rounded";
      primaryColor = "#D4AF37";
      ticketStyle = "vip_gold";
      break;
    case "premium-ivory":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#44403C";
      ticketStyle = "vip_gold";
      break;
    case "elegant-rsvp":
      templateTheme = "minimal";
      shape = "rounded";
      primaryColor = "#57534E";
      ticketStyle = "vip_gold";
      break;
    case "expo-pro":
      templateTheme = "modern";
      shape = "standard";
      primaryColor = "#1D4ED8";
      ticketStyle = "executive";
      break;
    case "vip-all-access":
      templateTheme = "dark";
      shape = "rounded";
      primaryColor = "#F59E0B";
      ticketStyle = "vip_gold";
      break;
    case "concert-music-fest":
      templateTheme = "event";
      shape = "compact";
      primaryColor = "#EC4899";
      ticketStyle = "concert";
      break;
    default:
      templateTheme = "event";
      shape = "standard";
      primaryColor = "#18181B";
      ticketStyle = "concert";
  }

  const qrPosition: "center" | "bottom" =
    tpl.id === "cinema-ticket" ||
    tpl.id === "marathon-pass" ||
    tpl.id === "sports-arena" ||
    tpl.id === "concert-music-fest"
      ? "bottom"
      : "center";

  return {
    template: templateTheme,
    ticketStyle,
    primaryColor,
    shape,
    format: tpl.id === "cinema-ticket" ? "print" : tpl.format === "badge" ? "badge" : (tpl.format === "printable" || (tpl.format as string) === "print") ? "print" : "mobile",
    qrPosition,
    logoUrl: null,
    sponsorLogoUrl: null,
    backgroundImageUrl: null,
    showAttendeeName: true,
    showTicketType: true,
    showEventDate: true,
    showVenue: true,
    showTicketId: true,
    showOrganization: true,
    showPhone: false,
    showRegistrationNumber: tpl.id === "marathon-pass",
    customMessage: tpl.description,
    showSingleEntryRule: true,
    showGateNotice: true,
    showTermsLink: false,
    showOrganizerContact: false,
    customInstruction: "Scan with any smartphone camera at gate for sub-0.3s check-in.",
    categoryColors: {
      VIP: primaryColor,
      General: "#4F46E5",
      Speaker: "#059669",
    },
    isPublished: true,
  };
}
