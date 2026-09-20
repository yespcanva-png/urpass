export type PassThemePreset = "classic" | "modern" | "minimal" | "badge" | "cyber";

export type BackgroundPattern = "mesh" | "dots" | "radial" | "stripes" | "clean";

export type FontFamily = "sans" | "mono" | "serif";

export type HeaderStyle = "gradient" | "solid" | "glass";

export interface CustomPassDesign {
  theme: PassThemePreset;
  primaryColor: string;
  secondaryColor: string;
  pattern: BackgroundPattern;
  fontFamily: FontFamily;
  headerStyle: HeaderStyle;
  badgeLabel?: string;
  footerNote?: string;
  bannerUrl?: string;
  accentGlow: boolean;
  showQrBorder: boolean;
}

export interface PassDesignPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  design: CustomPassDesign;
}

export const DEFAULT_PASS_DESIGN: CustomPassDesign = {
  theme: "classic",
  primaryColor: "#6D28D9",
  secondaryColor: "#4C1D95",
  pattern: "radial",
  fontFamily: "sans",
  headerStyle: "gradient",
  badgeLabel: "EVENT PASS",
  footerNote: "Show this digital pass at the entrance counter for quick check-in.",
  bannerUrl: "",
  accentGlow: true,
  showQrBorder: true,
};

export const PASS_DESIGN_PRESETS: PassDesignPreset[] = [
  {
    id: "classic_violet",
    name: "Classic Violet",
    description: "Iconic URPASS deep violet with gentle radial spotlight and ticket tear cutouts.",
    badge: "Popular",
    design: {
      theme: "classic",
      primaryColor: "#6D28D9",
      secondaryColor: "#4C1D95",
      pattern: "radial",
      fontFamily: "sans",
      headerStyle: "gradient",
      badgeLabel: "EVENT PASS",
      footerNote: "Show this digital pass at the entrance counter for quick check-in.",
      bannerUrl: "",
      accentGlow: true,
      showQrBorder: true,
    },
  },
  {
    id: "modern_glass",
    name: "Glassmorphic Aura",
    description: "Ultra-modern translucent frosted glass aesthetic with multi-point mesh gradient.",
    badge: "Pro",
    design: {
      theme: "modern",
      primaryColor: "#0284C7",
      secondaryColor: "#0F172A",
      pattern: "mesh",
      fontFamily: "sans",
      headerStyle: "glass",
      badgeLabel: "DIGITAL PASS",
      footerNote: "Verified digital credential • Valid for entry on registered date.",
      bannerUrl: "",
      accentGlow: true,
      showQrBorder: true,
    },
  },
  {
    id: "cyber_neon",
    name: "Cyberpunk Matrix",
    description: "High-tech dark aesthetics, monospace font, cyan neon glow and dot-matrix geometry.",
    badge: "Tech",
    design: {
      theme: "cyber",
      primaryColor: "#06B6D4",
      secondaryColor: "#111827",
      pattern: "dots",
      fontFamily: "mono",
      headerStyle: "gradient",
      badgeLabel: "ALL-ACCESS PASS",
      footerNote: "CRYPTOGRAPHIC ACCESS TOKEN • SCAN AT TERMINAL GATE",
      bannerUrl: "",
      accentGlow: true,
      showQrBorder: true,
    },
  },
  {
    id: "emerald_vip",
    name: "Emerald Executive",
    description: "Prestigious deep emerald green and rich jade badge layout for conferences & summits.",
    badge: "VIP",
    design: {
      theme: "badge",
      primaryColor: "#059669",
      secondaryColor: "#064E3B",
      pattern: "radial",
      fontFamily: "sans",
      headerStyle: "gradient",
      badgeLabel: "VIP DELEGATE",
      footerNote: "VIP Lounge Access & Priority Check-in included.",
      bannerUrl: "",
      accentGlow: true,
      showQrBorder: true,
    },
  },
  {
    id: "sunset_modern",
    name: "Sunset Ember",
    description: "Vibrant coral to deep crimson warm gradient with modern rounded styling.",
    badge: "Festival",
    design: {
      theme: "modern",
      primaryColor: "#EA580C",
      secondaryColor: "#991B1B",
      pattern: "mesh",
      fontFamily: "sans",
      headerStyle: "gradient",
      badgeLabel: "FESTIVAL TICKET",
      footerNote: "Wristband pickup available at Main Registration.",
      bannerUrl: "",
      accentGlow: true,
      showQrBorder: true,
    },
  },
  {
    id: "monochrome_luxe",
    name: "Noir Minimal",
    description: "Clean Swiss typographic luxury, editorial serif font, and crisp monochrome contrast.",
    badge: "Minimal",
    design: {
      theme: "minimal",
      primaryColor: "#18181B",
      secondaryColor: "#27272A",
      pattern: "clean",
      fontFamily: "serif",
      headerStyle: "solid",
      badgeLabel: "EXCLUSIVE ENTRY",
      footerNote: "Strictly non-transferable. Identification required upon entry.",
      bannerUrl: "",
      accentGlow: false,
      showQrBorder: false,
    },
  },
  {
    id: "royal_sapphire",
    name: "Royal Sapphire",
    description: "Deep corporate blue with diagonal technical stripes and conference badge hierarchy.",
    badge: "Corporate",
    design: {
      theme: "badge",
      primaryColor: "#2563EB",
      secondaryColor: "#1E3A8A",
      pattern: "stripes",
      fontFamily: "sans",
      headerStyle: "gradient",
      badgeLabel: "OFFICIAL BADGE",
      footerNote: "Wear digital or printed badge visibly during conference sessions.",
      bannerUrl: "",
      accentGlow: true,
      showQrBorder: true,
    },
  },
  {
    id: "rose_gold",
    name: "Rose & Velvet",
    description: "Sophisticated magenta-rose gradient ideal for galas, arts, and creative gatherings.",
    badge: "Creative",
    design: {
      theme: "modern",
      primaryColor: "#DB2777",
      secondaryColor: "#4C0519",
      pattern: "mesh",
      fontFamily: "sans",
      headerStyle: "gradient",
      badgeLabel: "INVITATION PASS",
      footerNote: "Welcome to the showcase! Scan at reception for admission.",
      bannerUrl: "",
      accentGlow: true,
      showQrBorder: true,
    },
  },
];

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Validates and sanitizes a custom pass design object.
 */
export function sanitizePassDesign(input: unknown): CustomPassDesign {
  if (!input || typeof input !== "object") {
    return { ...DEFAULT_PASS_DESIGN };
  }

  const raw = input as Record<string, unknown>;

  const theme: PassThemePreset = ["classic", "modern", "minimal", "badge", "cyber"].includes(
    String(raw.theme)
  )
    ? (raw.theme as PassThemePreset)
    : DEFAULT_PASS_DESIGN.theme;

  const pattern: BackgroundPattern = ["mesh", "dots", "radial", "stripes", "clean"].includes(
    String(raw.pattern)
  )
    ? (raw.pattern as BackgroundPattern)
    : DEFAULT_PASS_DESIGN.pattern;

  const fontFamily: FontFamily = ["sans", "mono", "serif"].includes(String(raw.fontFamily))
    ? (raw.fontFamily as FontFamily)
    : DEFAULT_PASS_DESIGN.fontFamily;

  const headerStyle: HeaderStyle = ["gradient", "solid", "glass"].includes(String(raw.headerStyle))
    ? (raw.headerStyle as HeaderStyle)
    : DEFAULT_PASS_DESIGN.headerStyle;

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

  return {
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

/**
 * Resolves the active pass design with hierarchy:
 * 1. Event-specific custom pass design (if set)
 * 2. Profile default custom pass design (if set)
 * 3. Fallback to profile brandColor or default
 */
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

/**
 * Returns background style and texture css for a given pass design.
 */
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

  switch (pattern) {
    case "mesh":
      return {
        background: baseBg,
        backgroundImage: `radial-gradient(at 10% 20%, rgba(255,255,255,0.25) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(0,0,0,0.3) 0px, transparent 50%), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      };
    case "dots":
      return {
        background: baseBg,
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.22) 1.5px, transparent 1.5px), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        backgroundSize: "16px 16px, 100% 100%",
      };
    case "stripes":
      return {
        background: baseBg,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.07) 0px, rgba(255, 255, 255, 0.07) 2px, transparent 2px, transparent 10px), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      };
    case "radial":
      return {
        background: baseBg,
        backgroundImage: `radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.28) 0%, transparent 60%), linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      };
    case "clean":
    default:
      return { background: baseBg };
  }
}

/**
 * Font family CSS utility
 */
export function getFontFamilyCls(fontFamily: FontFamily): string {
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
