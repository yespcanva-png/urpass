export type TicketTemplate = "minimal" | "event" | "dark" | "modern";
export type TicketShape = "standard" | "rounded" | "compact";

export interface TicketDesignConfig {
  template: TicketTemplate;
  primaryColor: string;
  shape?: TicketShape;
  logoUrl?: string | null;
  sponsorLogoUrl?: string | null;
  backgroundImageUrl?: string | null;

  // Dynamic ticket fields
  showAttendeeName: boolean;
  showTicketType: boolean;
  showEventDate?: boolean;
  showVenue: boolean;
  showTicketId: boolean;
  showOrganization?: boolean;
  showPhone?: boolean;
  showRegistrationNumber?: boolean;

  // Custom message & Ticket rules
  customMessage?: string;
  showSingleEntryRule?: boolean;
  showGateNotice?: boolean;
  showTermsLink?: boolean;
  showOrganizerContact?: boolean;
  customInstruction?: string;

  // Ticket type / category accent colors (e.g. { "VIP": "#18181B", "General": "#4F46E5" })
  categoryColors?: Record<string, string>;

  updatedAt?: string;
  isPublished?: boolean;
}

export const DEFAULT_TICKET_DESIGN: TicketDesignConfig = {
  template: "event",
  primaryColor: "#635BFF",
  shape: "standard",
  logoUrl: null,
  sponsorLogoUrl: null,
  backgroundImageUrl: null,
  showAttendeeName: true,
  showTicketType: true,
  showEventDate: true,
  showVenue: true,
  showTicketId: true,
  showOrganization: false,
  showPhone: false,
  showRegistrationNumber: false,
  customMessage: "",
  showSingleEntryRule: true,
  showGateNotice: true,
  showTermsLink: false,
  showOrganizerContact: false,
  customInstruction: "",
  categoryColors: {},
  isPublished: true,
};

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Validates and sanitizes a ticket design configuration object.
 */
export function sanitizeTicketDesign(input: unknown): TicketDesignConfig {
  if (!input || typeof input !== "object") {
    return { ...DEFAULT_TICKET_DESIGN };
  }

  const raw = input as Record<string, unknown>;

  let legacyLogo: string | null = null;
  let legacyColor: string | null = null;
  if (raw.version === 2 && Array.isArray(raw.elements)) {
    for (const el of raw.elements) {
      if (el && typeof el === "object") {
        const item = el as Record<string, unknown>;
        if (!legacyLogo && item.type === "image" && typeof item.src === "string") {
          legacyLogo = item.src;
        }
        if (!legacyColor && item.type === "shape" && typeof item.fillColor === "string" && HEX_REGEX.test(item.fillColor)) {
          legacyColor = item.fillColor;
        }
      }
    }
  }

  const template: TicketTemplate = ["minimal", "event", "dark", "modern"].includes(String(raw.template))
    ? (raw.template as TicketTemplate)
    : raw.theme === "minimal"
    ? "minimal"
    : raw.theme === "cyber"
    ? "dark"
    : DEFAULT_TICKET_DESIGN.template;

  const shape: TicketShape = ["standard", "rounded", "compact"].includes(String(raw.shape))
    ? (raw.shape as TicketShape)
    : DEFAULT_TICKET_DESIGN.shape || "standard";

  const primaryColor =
    typeof raw.primaryColor === "string" && HEX_REGEX.test(raw.primaryColor)
      ? raw.primaryColor
      : typeof raw.brand_color === "string" && HEX_REGEX.test(raw.brand_color)
      ? raw.brand_color
      : legacyColor || DEFAULT_TICKET_DESIGN.primaryColor;

  const logoUrl =
    typeof raw.logoUrl === "string" && (raw.logoUrl.startsWith("https://") || raw.logoUrl.startsWith("data:image/"))
      ? raw.logoUrl.trim()
      : typeof raw.org_logo_url === "string" && raw.org_logo_url.startsWith("https://")
      ? raw.org_logo_url.trim()
      : legacyLogo || null;

  const sponsorLogoUrl =
    typeof raw.sponsorLogoUrl === "string" &&
    (raw.sponsorLogoUrl.startsWith("https://") || raw.sponsorLogoUrl.startsWith("data:image/"))
      ? raw.sponsorLogoUrl.trim()
      : null;

  const backgroundImageUrl =
    typeof raw.backgroundImageUrl === "string" &&
    (raw.backgroundImageUrl.startsWith("https://") || raw.backgroundImageUrl.startsWith("data:image/"))
      ? raw.backgroundImageUrl.trim()
      : typeof raw.bannerUrl === "string" && raw.bannerUrl.startsWith("https://")
      ? raw.bannerUrl.trim()
      : null;

  const showAttendeeName =
    typeof raw.showAttendeeName === "boolean" ? raw.showAttendeeName : true;

  const showTicketType =
    typeof raw.showTicketType === "boolean" ? raw.showTicketType : true;

  const showEventDate =
    typeof raw.showEventDate === "boolean" ? raw.showEventDate : true;

  const showVenue =
    typeof raw.showVenue === "boolean" ? raw.showVenue : true;

  const showTicketId =
    typeof raw.showTicketId === "boolean" ? raw.showTicketId : true;

  const showOrganization =
    typeof raw.showOrganization === "boolean" ? raw.showOrganization : false;

  const showPhone =
    typeof raw.showPhone === "boolean" ? raw.showPhone : false;

  const showRegistrationNumber =
    typeof raw.showRegistrationNumber === "boolean" ? raw.showRegistrationNumber : false;

  const customMessage =
    typeof raw.customMessage === "string" ? raw.customMessage.trim().slice(0, 160) : "";

  const showSingleEntryRule =
    typeof raw.showSingleEntryRule === "boolean" ? raw.showSingleEntryRule : true;

  const showGateNotice =
    typeof raw.showGateNotice === "boolean" ? raw.showGateNotice : true;

  const showTermsLink =
    typeof raw.showTermsLink === "boolean" ? raw.showTermsLink : false;

  const showOrganizerContact =
    typeof raw.showOrganizerContact === "boolean" ? raw.showOrganizerContact : false;

  const customInstruction =
    typeof raw.customInstruction === "string" ? raw.customInstruction.trim().slice(0, 160) : "";

  // Category accent colors mapping
  const categoryColors: Record<string, string> = {};
  if (raw.categoryColors && typeof raw.categoryColors === "object") {
    for (const [k, v] of Object.entries(raw.categoryColors as Record<string, unknown>)) {
      if (typeof v === "string" && HEX_REGEX.test(v)) {
        categoryColors[k] = v;
      }
    }
  }

  const isPublished =
    typeof raw.isPublished === "boolean" ? raw.isPublished : true;

  return {
    template,
    primaryColor,
    shape,
    logoUrl,
    sponsorLogoUrl,
    backgroundImageUrl,
    showAttendeeName,
    showTicketType,
    showEventDate,
    showVenue,
    showTicketId,
    showOrganization,
    showPhone,
    showRegistrationNumber,
    customMessage,
    showSingleEntryRule,
    showGateNotice,
    showTermsLink,
    showOrganizerContact,
    customInstruction,
    categoryColors,
    isPublished,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  };
}

/**
 * Resolves the active ticket design with fallback:
 * 1. Event-specific ticket design (if set)
 * 2. Profile default ticket design (if set)
 * 3. Fallback brandColor or defaults
 */
export function resolveTicketDesign(
  eventDesign?: unknown,
  profileDesign?: unknown,
  fallbackBrandColor?: string | null
): TicketDesignConfig {
  if (eventDesign && typeof eventDesign === "object" && Object.keys(eventDesign).length > 0) {
    return sanitizeTicketDesign(eventDesign);
  }

  if (profileDesign && typeof profileDesign === "object" && Object.keys(profileDesign).length > 0) {
    return sanitizeTicketDesign(profileDesign);
  }

  if (fallbackBrandColor && HEX_REGEX.test(fallbackBrandColor)) {
    return {
      ...DEFAULT_TICKET_DESIGN,
      primaryColor: fallbackBrandColor,
    };
  }

  return { ...DEFAULT_TICKET_DESIGN };
}

/**
 * Helper to compute a darker shade of any hex color safely.
 */
export function darkenHex(hex: string, amount = 40): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = Math.max(0, parseInt(clean.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(clean.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(clean.slice(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Backward compatibility aliases
export type PassThemePreset = "classic" | "modern" | "minimal" | "badge" | "cyber";
export type BackgroundPattern = "mesh" | "dots" | "radial" | "stripes" | "clean";
export type FontFamily = "sans" | "mono" | "serif";
export type HeaderStyle = "gradient" | "solid" | "glass";

export interface CustomPassDesign extends TicketDesignConfig {
  theme?: PassThemePreset;
  secondaryColor?: string;
  pattern?: BackgroundPattern;
  fontFamily?: FontFamily;
  headerStyle?: HeaderStyle;
  badgeLabel?: string;
  footerNote?: string;
  bannerUrl?: string;
  accentGlow?: boolean;
  showQrBorder?: boolean;
}

export const DEFAULT_PASS_DESIGN: CustomPassDesign = {
  ...DEFAULT_TICKET_DESIGN,
  primaryColor: "#6D28D9",
  secondaryColor: "#4C1D95",
  theme: "classic",
  pattern: "radial",
  fontFamily: "sans",
  headerStyle: "gradient",
  badgeLabel: "EVENT PASS",
  footerNote: "Show this digital pass at the entrance counter for quick check-in.",
  bannerUrl: "",
  accentGlow: true,
  showQrBorder: true,
};

export const PASS_DESIGN_PRESETS: {
  id: string;
  name: string;
  description: string;
  badge: string;
  design: CustomPassDesign;
}[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Crisp white background with high typographic contrast and subtle border accents.",
    badge: "Minimal",
    design: {
      ...DEFAULT_PASS_DESIGN,
      template: "minimal",
      theme: "minimal",
      primaryColor: "#18181B",
      secondaryColor: "#27272A",
    },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek contemporary layout with brand accent ribbon, prominent QR and clean badge.",
    badge: "Popular",
    design: {
      ...DEFAULT_PASS_DESIGN,
      template: "modern",
      theme: "modern",
      primaryColor: "#635BFF",
      secondaryColor: "#4F46E5",
    },
  },
  {
    id: "dark",
    name: "Dark",
    description: "Sophisticated deep dark aesthetic with high contrast white text and vibrant accents.",
    badge: "VIP",
    design: {
      ...DEFAULT_PASS_DESIGN,
      template: "dark",
      theme: "cyber",
      primaryColor: "#818CF8",
      secondaryColor: "#1E1E2D",
    },
  },
];

export function sanitizePassDesign(input: unknown): CustomPassDesign {
  if (!input || typeof input !== "object") {
    return { ...DEFAULT_PASS_DESIGN };
  }

  const raw = input as Record<string, unknown>;

  const theme: PassThemePreset = ["classic", "modern", "minimal", "badge", "cyber"].includes(
    String(raw.theme)
  )
    ? (raw.theme as PassThemePreset)
    : DEFAULT_PASS_DESIGN.theme || "classic";

  const pattern: BackgroundPattern = ["mesh", "dots", "radial", "stripes", "clean"].includes(
    String(raw.pattern)
  )
    ? (raw.pattern as BackgroundPattern)
    : DEFAULT_PASS_DESIGN.pattern || "radial";

  const fontFamily: FontFamily = ["sans", "mono", "serif"].includes(String(raw.fontFamily))
    ? (raw.fontFamily as FontFamily)
    : DEFAULT_PASS_DESIGN.fontFamily || "sans";

  const headerStyle: HeaderStyle = ["gradient", "solid", "glass"].includes(String(raw.headerStyle))
    ? (raw.headerStyle as HeaderStyle)
    : DEFAULT_PASS_DESIGN.headerStyle || "gradient";

  const primaryColor =
    typeof raw.primaryColor === "string" && HEX_REGEX.test(raw.primaryColor)
      ? raw.primaryColor
      : DEFAULT_PASS_DESIGN.primaryColor;

  const secondaryColor =
    typeof raw.secondaryColor === "string" && HEX_REGEX.test(raw.secondaryColor)
      ? raw.secondaryColor
      : raw.primaryColor && HEX_REGEX.test(String(raw.primaryColor))
      ? darkenHex(primaryColor, 35)
      : DEFAULT_PASS_DESIGN.secondaryColor;

  const badgeLabel =
    typeof raw.badgeLabel === "string"
      ? raw.badgeLabel.trim().slice(0, 32)
      : DEFAULT_PASS_DESIGN.badgeLabel;

  const footerNote =
    typeof raw.footerNote === "string"
      ? raw.footerNote.trim().slice(0, 160)
      : DEFAULT_PASS_DESIGN.footerNote;

  const bannerUrl =
    typeof raw.bannerUrl === "string" && raw.bannerUrl.startsWith("https://")
      ? raw.bannerUrl.trim().slice(0, 500)
      : "";

  const accentGlow = typeof raw.accentGlow === "boolean" ? raw.accentGlow : true;
  const showQrBorder = typeof raw.showQrBorder === "boolean" ? raw.showQrBorder : true;

  const baseTicket = sanitizeTicketDesign(input);

  return {
    ...DEFAULT_PASS_DESIGN,
    ...baseTicket,
    theme,
    primaryColor,
    secondaryColor,
    pattern,
    fontFamily,
    headerStyle,
    badgeLabel: badgeLabel || "EVENT PASS",
    footerNote: footerNote || "",
    bannerUrl: bannerUrl || "",
    accentGlow,
    showQrBorder,
  };
}

export function resolvePassDesign(
  eventDesign?: unknown,
  profileDesign?: unknown,
  fallbackBrandColor?: string | null
): CustomPassDesign {
  if (eventDesign && typeof eventDesign === "object" && Object.keys(eventDesign).length > 0) {
    return sanitizePassDesign(eventDesign);
  }

  if (profileDesign && typeof profileDesign === "object" && Object.keys(profileDesign).length > 0) {
    return sanitizePassDesign(profileDesign);
  }

  if (fallbackBrandColor && HEX_REGEX.test(fallbackBrandColor)) {
    return {
      ...DEFAULT_PASS_DESIGN,
      primaryColor: fallbackBrandColor,
      secondaryColor: darkenHex(fallbackBrandColor, 35),
    };
  }

  return { ...DEFAULT_PASS_DESIGN };
}

export function getPatternStyle(
  pattern: BackgroundPattern,
  primaryColor: string,
  secondaryColor: string,
  headerStyle: HeaderStyle = "gradient"
): React.CSSProperties {
  const baseBg =
    headerStyle === "solid"
      ? primaryColor
      : `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;

  // Always use separate backgroundColor and backgroundImage to prevent React style conflicts
  switch (pattern) {
    case "mesh":
      return {
        backgroundColor: primaryColor,
        backgroundImage: `radial-gradient(at 10% 20%, rgba(255,255,255,0.25) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(0,0,0,0.3) 0px, transparent 50%), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      };
    case "dots":
      return {
        backgroundColor: primaryColor,
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.22) 1.5px, transparent 1.5px), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        backgroundSize: "16px 16px, 100% 100%",
      };
    case "stripes":
      return {
        backgroundColor: primaryColor,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.07) 0px, rgba(255, 255, 255, 0.07) 2px, transparent 2px, transparent 10px), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      };
    case "radial":
      return {
        backgroundColor: primaryColor,
        backgroundImage: `radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.28) 0%, transparent 60%), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      };
    case "clean":
    default:
      return { backgroundColor: primaryColor, backgroundImage: baseBg };
  }
}

export function getFontFamilyCls(fontFamily?: FontFamily): string {
  switch (fontFamily) {
    case "mono":
      return "font-mono";
    case "serif":
      return "font-serif";
    case "sans":
    default:
      return "font-sans";
  }
}
