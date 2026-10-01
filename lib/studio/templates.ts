import type { StudioDesign, TicketFormat } from "./types";
import type { TicketDesignConfig, TicketTemplate, TicketShape } from "@/lib/pass-design";

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

/**
 * Generates a valid StudioDesign for a digital mobile pass
 */
function createDigitalPassDesign(
  name: string,
  bgColor = "#FFFFFF",
  fgColor = "#18181B",
  accentColor = "#635BFF"
): StudioDesign {
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
        id: `shape-accent-${Math.random().toString(36).slice(2, 7)}`,
        type: "shape",
        name: "Accent Strip",
        shapeType: "rect",
        fillColor: accentColor,
        x: 0,
        y: 0,
        width: 380,
        height: 6,
        zIndex: 1,
      },
      {
        id: `text-event-${Math.random().toString(36).slice(2, 7)}`,
        type: "dynamic_text",
        name: "Event Name",
        fieldKey: "event.name",
        fallbackText: "EVENT NAME",
        fontFamily: "sans",
        fontSize: 18,
        fontWeight: 800,
        color: fgColor,
        textAlign: "center",
        x: 20,
        y: 36,
        width: 340,
        height: 30,
        zIndex: 2,
      },
      {
        id: `qr-${Math.random().toString(36).slice(2, 7)}`,
        type: "qr",
        name: "QR Code",
        size: 180,
        fgColor: "#000000",
        bgColor: "#FFFFFF",
        cornerRadius: 12,
        showScanLabel: true,
        scanLabelText: "SCAN FOR ENTRY",
        contrastSafe: true,
        x: 100,
        y: 150,
        width: 180,
        height: 180,
        locked: true,
        zIndex: 3,
      },
      {
        id: `text-attendee-${Math.random().toString(36).slice(2, 7)}`,
        type: "dynamic_text",
        name: "Attendee Name",
        fieldKey: "attendee.name",
        fallbackText: "ATTENDEE NAME",
        fontFamily: "sans",
        fontSize: 20,
        fontWeight: 800,
        color: fgColor,
        textAlign: "center",
        x: 20,
        y: 380,
        width: 340,
        height: 30,
        zIndex: 4,
      },
      {
        id: `text-ticket-${Math.random().toString(36).slice(2, 7)}`,
        type: "dynamic_text",
        name: "Ticket Category",
        fieldKey: "ticket.category",
        fallbackText: "VIP DELEGATE",
        fontFamily: "sans",
        fontSize: 12,
        fontWeight: 700,
        color: accentColor,
        textAlign: "center",
        x: 20,
        y: 420,
        width: 340,
        height: 24,
        zIndex: 5,
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
    format: "digital",
    tier: "free",
    priceINR: 0,
    badgeLabel: "Free",
    description: "Simple educational layout with session date, time, and track details prominent for training sessions.",
    tags: ["Campus", "Workshop", "Education", "Training"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Workshop Clean", "#FFFFFF", "#134E4A", "#0D9488"),
  },
  {
    id: "speaker-badge",
    name: "Speaker Badge",
    category: "Campus",
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Mobile pass with prominent speaker credentials, designation, company, and role color strip.",
    tags: ["Campus", "Speaker", "Conference", "Credential"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Speaker Badge", "#FFFFFF", "#111827", "#059669"),
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
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Dynamic diagonal layout with team and stadium gate access indicators for sporting tournaments.",
    tags: ["Entertainment", "Sports", "Arena", "Tournament"],
    thumbnailBg: "#FFFFFF",
    design: createDigitalPassDesign("Sports Arena", "#FFFFFF", "#111827", "#DC2626"),
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
    format: "digital",
    tier: "paid",
    priceINR: 49,
    badgeLabel: "₹49",
    description: "Company-first mobile credential layout with exhibitor and trade visitor badges for exhibitions and expos.",
    tags: ["Premium", "Exhibition", "Expo", "Trade"],
    thumbnailBg: "#F8FAFC",
    design: createDigitalPassDesign("Expo Pro", "#F8FAFC", "#0F172A", "#1D4ED8"),
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
  return createDigitalPassDesign("Untitled Digital Pass", "#FFFFFF", "#111827", "#635BFF");
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

  switch (tpl.id) {
    case "corporate-minimal":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#18181B";
      break;
    case "executive-blue":
      templateTheme = "modern";
      shape = "standard";
      primaryColor = "#2563EB";
      break;
    case "minimal-monochrome":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#000000";
      break;
    case "networking-pro":
      templateTheme = "modern";
      shape = "rounded";
      primaryColor = "#4F46E5";
      break;
    case "tech-pulse":
      templateTheme = "dark";
      shape = "rounded";
      primaryColor = "#8B5CF6";
      break;
    case "future-grid":
      templateTheme = "dark";
      shape = "compact";
      primaryColor = "#10B981";
      break;
    case "product-launch":
      templateTheme = "modern";
      shape = "standard";
      primaryColor = "#09090B";
      break;
    case "ultra-qr":
      templateTheme = "minimal";
      shape = "compact";
      primaryColor = "#18181B";
      break;
    case "campus-pop":
      templateTheme = "event";
      shape = "rounded";
      primaryColor = "#F59E0B";
      break;
    case "campus-classic":
      templateTheme = "event";
      shape = "standard";
      primaryColor = "#065F46";
      break;
    case "workshop-clean":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#0D9488";
      break;
    case "speaker-badge":
      templateTheme = "modern";
      shape = "rounded";
      primaryColor = "#059669";
      break;
    case "festival-neon":
      templateTheme = "dark";
      shape = "rounded";
      primaryColor = "#EC4899";
      break;
    case "urban-festival":
      templateTheme = "event";
      shape = "compact";
      primaryColor = "#FF5500";
      break;
    case "sports-arena":
      templateTheme = "event";
      shape = "compact";
      primaryColor = "#DC2626";
      break;
    case "marathon-pass":
      templateTheme = "modern";
      shape = "compact";
      primaryColor = "#EA580C";
      break;
    case "vip-midnight":
      templateTheme = "dark";
      shape = "rounded";
      primaryColor = "#D4AF37";
      break;
    case "premium-ivory":
      templateTheme = "minimal";
      shape = "standard";
      primaryColor = "#44403C";
      break;
    case "elegant-rsvp":
      templateTheme = "minimal";
      shape = "rounded";
      primaryColor = "#57534E";
      break;
    case "expo-pro":
      templateTheme = "modern";
      shape = "standard";
      primaryColor = "#1D4ED8";
      break;
    default:
      templateTheme = "event";
      shape = "standard";
      primaryColor = "#18181B";
  }

  return {
    template: templateTheme,
    primaryColor,
    shape,
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
