import type { TicketDesignConfig, TicketTemplate, TicketShape } from "@/lib/pass-design";

export interface AiMagicRequest {
  prompt?: string;
  vibe?: string;
  eventName?: string;
  venue?: string;
  eventDate?: string;
  categories?: Array<{ id: string; name: string }>;
}

export interface AiMagicResult {
  config: TicketDesignConfig;
  vibeName: string;
  vibeBadge: string;
  colorPaletteName: string;
  primaryColor: string;
  accentColors: string[];
  designRationale: string;
  suggestedTagline: string;
}

interface VibeArchetype {
  id: string;
  name: string;
  badge: string;
  paletteName: string;
  template: TicketTemplate;
  shape: TicketShape;
  primaryColor: string;
  accentColors: string[];
  qrSize: "sm" | "md" | "lg";
  qrPosition: "center" | "bottom";
  showQrBorder: boolean;
  showOrganization: boolean;
  showPhone: boolean;
  showRegistrationNumber: boolean;
  customMessage: string;
  customInstruction: string;
  categoryColors: Record<string, string>;
  rationale: string;
  keywords: string[];
}

const ARCHETYPES: VibeArchetype[] = [
  {
    id: "cyber_hackathon",
    name: "Cyber Hackathon",
    badge: "TECH & AI",
    paletteName: "Neon Matrix",
    template: "dark",
    shape: "rounded",
    primaryColor: "#635BFF",
    accentColors: ["#635BFF", "#06B6D4", "#EC4899", "#10B981"],
    qrSize: "md",
    qrPosition: "center",
    showQrBorder: true,
    showOrganization: true,
    showPhone: false,
    showRegistrationNumber: true,
    customMessage: "Build. Hack. Ship. 24-Hour Pass",
    customInstruction: "Scan QR at Security Desk for hacker badge wristband activation.",
    categoryColors: {
      Hacker: "#635BFF",
      VIP: "#EC4899",
      Speaker: "#06B6D4",
      Mentor: "#10B981",
      General: "#4F46E5",
    },
    rationale: "Dark obsidian canvas with high-energy neon violet and cyber-cyan accents. QR is framed with contrast borders for fast verification in dim venue auditoriums.",
    keywords: ["hack", "code", "ai", "cyber", "tech", "developer", "software", "robot", "cloud", "data", "crypto", "web3", "build"],
  },
  {
    id: "executive_summit",
    name: "Executive Summit",
    badge: "CXO & ENTERPRISE",
    paletteName: "Obsidian & Gold",
    template: "minimal",
    shape: "compact",
    primaryColor: "#18181B",
    accentColors: ["#18181B", "#D97706", "#475569", "#0F172A"],
    qrSize: "sm",
    qrPosition: "bottom",
    showQrBorder: true,
    showOrganization: true,
    showPhone: false,
    showRegistrationNumber: false,
    customMessage: "Executive Delegate Credential",
    customInstruction: "Strictly non-transferable. Please present official government photo ID with your digital pass.",
    categoryColors: {
      "C-Suite": "#D97706",
      VIP: "#B45309",
      Speaker: "#1E293B",
      Delegate: "#475569",
      General: "#334155",
    },
    rationale: "Understated minimalist luxury with champagne gold accents. QR code is neatly anchored at the bottom to give prominence to executive attendee credentials.",
    keywords: ["summit", "executive", "cxo", "board", "investor", "leadership", "corporate", "conference", "ceo", "finance", "business"],
  },
  {
    id: "college_cultural",
    name: "College Fest",
    badge: "CAMPUS & YOUTH",
    paletteName: "Sunset Euphoria",
    template: "event",
    shape: "rounded",
    primaryColor: "#F59E0B",
    accentColors: ["#F59E0B", "#EF4444", "#8B5CF6", "#10B981"],
    qrSize: "lg",
    qrPosition: "center",
    showQrBorder: true,
    showOrganization: true,
    showPhone: true,
    showRegistrationNumber: true,
    customMessage: "Annual Cultural & Arts Extravaganza",
    customInstruction: "Pass strictly valid for registered college student with valid College ID card.",
    categoryColors: {
      Student: "#F59E0B",
      "External Delegate": "#EF4444",
      VIP: "#8B5CF6",
      Performer: "#10B981",
      General: "#F97316",
    },
    rationale: "High-vibrancy warm sunset gradient with large central QR for volunteer smartphone clearance in crowded campus entrance gates.",
    keywords: ["college", "fest", "campus", "cultural", "university", "student", "arts", "youth", "symposium", "culturals", "inter-college"],
  },
  {
    id: "music_rave",
    name: "Music & Concert",
    badge: "NIGHTLIFE & FEST",
    paletteName: "Electric Ultraviolet",
    template: "dark",
    shape: "compact",
    primaryColor: "#EC4899",
    accentColors: ["#EC4899", "#8B5CF6", "#06B6D4", "#F43F5E"],
    qrSize: "md",
    qrPosition: "center",
    showQrBorder: true,
    showOrganization: false,
    showPhone: false,
    showRegistrationNumber: false,
    customMessage: "Official Admission Pass · 18+ Entry",
    customInstruction: "Valid for one wristband exchange at Box Office. Anti-screenshot verification active.",
    categoryColors: {
      "VIP Lounge": "#EC4899",
      "Fan Pit": "#8B5CF6",
      "Backstage Access": "#06B6D4",
      "General Entry": "#4F46E5",
      "Early Bird": "#10B981",
    },
    rationale: "Deep nightlife aesthetic with electric magenta and ultraviolet accents. Clean metadata layout ensures rapid wristband exchange at high-volume gate turnstiles.",
    keywords: ["music", "concert", "rave", "dj", "nightlife", "party", "club", "festival", "sound", "band", "live", "dance"],
  },
  {
    id: "medical_science",
    name: "Medical & Science",
    badge: "HEALTHCARE & SCIENCE",
    paletteName: "Clinical Teal",
    template: "modern",
    shape: "standard",
    primaryColor: "#0284C7",
    accentColors: ["#0284C7", "#0D9488", "#1E40AF", "#38BDF8"],
    qrSize: "md",
    qrPosition: "bottom",
    showQrBorder: false,
    showOrganization: true,
    showPhone: false,
    showRegistrationNumber: true,
    customMessage: "CME Certified Conference Pass",
    customInstruction: "Scan at hall doors for CME session attendance and certificate credit tracking.",
    categoryColors: {
      Surgeon: "#0284C7",
      Physician: "#0D9488",
      Speaker: "#1E40AF",
      Resident: "#38BDF8",
      Delegate: "#0369A1",
    },
    rationale: "Clean clinical aesthetic with calming cyan and deep navy. Includes registration number and institutional affiliation for accreditation compliance.",
    keywords: ["medical", "health", "doctor", "hospital", "pharma", "clinical", "cme", "bio", "science", "research", "surgery", "dental"],
  },
  {
    id: "luxury_gala",
    name: "Luxury Gala",
    badge: "BLACK TIE & VIP",
    paletteName: "Emerald & Champagne",
    template: "minimal",
    shape: "standard",
    primaryColor: "#065F46",
    accentColors: ["#065F46", "#D97706", "#047857", "#1E293B"],
    qrSize: "sm",
    qrPosition: "bottom",
    showQrBorder: true,
    showOrganization: false,
    showPhone: false,
    showRegistrationNumber: false,
    customMessage: "By Private Invitation Only",
    customInstruction: "Black tie dress code strictly enforced. Champagne reception commences at 7:00 PM.",
    categoryColors: {
      "Honorary Guest": "#D97706",
      Benefactor: "#065F46",
      "Table Host": "#047857",
      VIP: "#B45309",
      Patron: "#1E293B",
    },
    rationale: "Opulent forest emerald with warm champagne gold accents. Refined typography prioritizing guest name and table classification over cluttered fields.",
    keywords: ["gala", "luxury", "dinner", "black tie", "auction", "charity", "vip", "ball", "cocktail", "exclusive", "fashion"],
  },
  {
    id: "startup_pitch",
    name: "Startup Pitch Day",
    badge: "VENTURE & FOUNDERS",
    paletteName: "Venture Indigo",
    template: "modern",
    shape: "rounded",
    primaryColor: "#4F46E5",
    accentColors: ["#4F46E5", "#10B981", "#F59E0B", "#06B6D4"],
    qrSize: "md",
    qrPosition: "center",
    showQrBorder: true,
    showOrganization: true,
    showPhone: false,
    showRegistrationNumber: false,
    customMessage: "Investor & Founder Pass",
    customInstruction: "Includes access to Closed-Door Deal Room and Networking Cocktail.",
    categoryColors: {
      Investor: "#10B981",
      Founder: "#4F46E5",
      Speaker: "#F59E0B",
      Partner: "#06B6D4",
      Attendee: "#64748B",
    },
    rationale: "Vibrant Silicon Valley aesthetic with energetic emerald and indigo accents. Organization/Firm name is featured prominently for networking efficiency.",
    keywords: ["startup", "pitch", "demo", "investor", "vc", "founder", "angel", "incubator", "venture", "accelerator"],
  },
  {
    id: "sports_tournament",
    name: "Sports & Marathon",
    badge: "ATHLETICS & RACING",
    paletteName: "Championship Crimson",
    template: "event",
    shape: "compact",
    primaryColor: "#DC2626",
    accentColors: ["#DC2626", "#EA580C", "#0284C7", "#16A34A"],
    qrSize: "lg",
    qrPosition: "center",
    showQrBorder: true,
    showOrganization: false,
    showPhone: true,
    showRegistrationNumber: true,
    customMessage: "Athlete Bib & Timing Chip Credential",
    customInstruction: "Scan at Start Line corral. Emergency medical contact details registered to this pass.",
    categoryColors: {
      Elite: "#DC2626",
      "Age Category": "#EA580C",
      Staff: "#0284C7",
      Pacer: "#16A34A",
      Participant: "#E11D48",
    },
    rationale: "High-contrast dynamic crimson designed for outdoor legibility in bright sunlight. Large QR enables split-second corral gate validation.",
    keywords: ["marathon", "run", "sport", "race", "tournament", "football", "cricket", "athletics", "game", "esports", "championship"],
  },
];

/**
 * Generates an AI-crafted ticket design configuration based on user prompt & event parameters.
 */
export async function generateAiTicketMagic(params: AiMagicRequest): Promise<AiMagicResult> {
  const { prompt = "", vibe = "", eventName = "", venue = "", eventDate = "", categories = [] } = params;

  // Combine query terms for semantic matching
  const fullText = `${prompt} ${vibe} ${eventName} ${venue}`.toLowerCase();

  // Score archetypes
  let bestArchetype = ARCHETYPES[0];
  let maxScore = -1;

  for (const arch of ARCHETYPES) {
    let score = 0;
    if (vibe && arch.id.includes(vibe.toLowerCase())) score += 10;
    if (vibe && arch.name.toLowerCase().includes(vibe.toLowerCase())) score += 8;

    for (const kw of arch.keywords) {
      if (fullText.includes(kw)) {
        score += 3;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestArchetype = arch;
    }
  }

  // Detect custom color hints in prompt (e.g. "purple", "emerald", "gold", "cyan", "red", "blue", "dark")
  let customPrimaryColor = bestArchetype.primaryColor;
  let customTemplate: TicketTemplate = bestArchetype.template;

  if (fullText.includes("dark") || fullText.includes("black") || fullText.includes("night") || fullText.includes("cyber")) {
    customTemplate = "dark";
  } else if (fullText.includes("minimal") || fullText.includes("clean") || fullText.includes("simple") || fullText.includes("white")) {
    customTemplate = "minimal";
  } else if (fullText.includes("modern") || fullText.includes("gradient")) {
    customTemplate = "modern";
  }

  if (fullText.includes("emerald") || fullText.includes("green")) {
    customPrimaryColor = "#059669";
  } else if (fullText.includes("gold") || fullText.includes("yellow") || fullText.includes("amber")) {
    customPrimaryColor = "#D97706";
  } else if (fullText.includes("purple") || fullText.includes("violet")) {
    customPrimaryColor = "#7C3AED";
  } else if (fullText.includes("pink") || fullText.includes("rose") || fullText.includes("magenta")) {
    customPrimaryColor = "#EC4899";
  } else if (fullText.includes("cyan") || fullText.includes("teal")) {
    customPrimaryColor = "#06B6D4";
  } else if (fullText.includes("red") || fullText.includes("crimson")) {
    customPrimaryColor = "#DC2626";
  } else if (fullText.includes("blue") || fullText.includes("indigo")) {
    customPrimaryColor = "#4F46E5";
  }

  // Build category colors matching event's actual categories if provided
  const categoryColors: Record<string, string> = { ...bestArchetype.categoryColors };
  if (categories && categories.length > 0) {
    const palettePool = [
      customPrimaryColor,
      ...bestArchetype.accentColors,
      "#635BFF",
      "#10B981",
      "#F59E0B",
      "#EC4899",
      "#06B6D4",
    ];

    categories.forEach((cat, idx) => {
      if (!categoryColors[cat.name]) {
        categoryColors[cat.name] = palettePool[idx % palettePool.length];
      }
    });
  }

  // Custom instruction & message personalization
  const customMessage =
    prompt.length > 5 && prompt.length < 80
      ? prompt
      : bestArchetype.customMessage;

  const generatedConfig: TicketDesignConfig = {
    template: customTemplate,
    primaryColor: customPrimaryColor,
    shape: bestArchetype.shape,
    logoUrl: null,
    sponsorLogoUrl: null,
    backgroundImageUrl: null,
    showAttendeeName: true,
    showTicketType: true,
    showEventDate: true,
    showVenue: true,
    showTicketId: true,
    showOrganization: bestArchetype.showOrganization,
    showPhone: bestArchetype.showPhone,
    showRegistrationNumber: bestArchetype.showRegistrationNumber,
    fieldOrder: [
      "showAttendeeName",
      "showTicketType",
      "showEventDate",
      "showVenue",
      "showTicketId",
      bestArchetype.showOrganization ? "showOrganization" : "",
      bestArchetype.showRegistrationNumber ? "showRegistrationNumber" : "",
      bestArchetype.showPhone ? "showPhone" : "",
    ].filter(Boolean),
    qrSize: bestArchetype.qrSize,
    qrPosition: bestArchetype.qrPosition,
    showQrBorder: bestArchetype.showQrBorder,
    customMessage,
    showSingleEntryRule: true,
    showGateNotice: true,
    showTermsLink: false,
    showOrganizerContact: false,
    customInstruction: bestArchetype.customInstruction,
    categoryColors,
    isPublished: true,
  };

  return {
    config: generatedConfig,
    vibeName: bestArchetype.name,
    vibeBadge: bestArchetype.badge,
    colorPaletteName: bestArchetype.paletteName,
    primaryColor: customPrimaryColor,
    accentColors: bestArchetype.accentColors,
    designRationale: bestArchetype.rationale,
    suggestedTagline: customMessage,
  };
}

export const AI_MAGIC_VIBE_PRESETS = ARCHETYPES.map((a) => ({
  id: a.id,
  name: a.name,
  badge: a.badge,
  color: a.primaryColor,
  paletteName: a.paletteName,
}));
