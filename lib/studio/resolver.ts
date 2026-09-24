import type {
  StudioDesign,
  StudioElement,
  StudioQRElement,
  TicketFormat,
} from "./types";
import { FORMAT_DIMENSIONS, MIN_QR_SIZE } from "./types";
import { STUDIO_TEMPLATES } from "./templates";
import type { TicketDesignConfig } from "@/lib/pass-design";

/**
 * Type guard to check if an object is already a version 2 StudioDesign.
 */
export function isStudioDesign(input: unknown): input is StudioDesign {
  if (!input || typeof input !== "object") return false;
  const raw = input as Record<string, unknown>;
  return (
    raw.version === 2 &&
    Array.isArray(raw.elements) &&
    typeof raw.format === "string" &&
    typeof raw.width === "number" &&
    typeof raw.height === "number"
  );
}

/**
 * Calculates luminance for contrast checking.
 */
function getLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return 0.5;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Computes contrast ratio between two hex colors.
 */
export function getContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = getLuminance(fgHex);
  const l2 = getLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validates a StudioDesign for gate scannability and layout integrity.
 */
export function validateStudioDesign(design: StudioDesign): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const qrElement = design.elements.find((el) => el.type === "qr") as StudioQRElement | undefined;

  if (!qrElement) {
    errors.push("Your ticket must contain at least one QR Code for gate check-in.");
  } else {
    // 1. Minimum scannable size
    if (qrElement.width < MIN_QR_SIZE || qrElement.height < MIN_QR_SIZE) {
      errors.push(
        `QR Code size (${Math.round(qrElement.width)}px) is below minimum scannable size (${MIN_QR_SIZE}px). Volunter scanners may fail in low lighting.`
      );
    }

    // 2. Off-canvas check
    if (
      qrElement.x < 0 ||
      qrElement.y < 0 ||
      qrElement.x + qrElement.width > design.width ||
      qrElement.y + qrElement.height > design.height
    ) {
      errors.push("The QR Code is partially or completely outside the printable canvas bounds.");
    }

    // 3. Contrast check
    const ratio = getContrastRatio(qrElement.fgColor || "#000000", qrElement.bgColor || "#FFFFFF");
    if (ratio < 4.5) {
      errors.push(
        `QR Code contrast ratio (${ratio.toFixed(1)}:1) is too low. Gate scanners need at least 4.5:1 contrast.`
      );
    } else if (ratio < 7.0) {
      warnings.push(`QR contrast is moderate (${ratio.toFixed(1)}:1). Darker foreground on pure white is recommended.`);
    }
  }

  // Check required dynamic tokens
  const hasAttendeeName = design.elements.some(
    (el) => el.type === "dynamic_text" && (el as { fieldKey?: string }).fieldKey === "attendee.name"
  );
  if (!hasAttendeeName) {
    warnings.push("Ticket does not have an Attendee Name element. Adding one helps gate volunteers verify attendee identity.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Converts a legacy TicketDesignConfig or CustomPassDesign to a modern StudioDesign.
 */
export function convertLegacyToStudioDesign(
  legacy: Partial<TicketDesignConfig> & {
    brand_color?: string;
    org_name?: string;
    org_logo_url?: string;
  }
): StudioDesign {
  const templateKey = legacy.template === "dark" ? "dark-obsidian-luxury" : legacy.template === "minimal" ? "minimal-monochrome" : "community-meetup";
  const matched = STUDIO_TEMPLATES.find((t) => t.id === templateKey) || STUDIO_TEMPLATES[0];

  const design: StudioDesign = JSON.parse(JSON.stringify(matched.design));
  design.name = "Migrated Pass Design";
  design.isPublished = Boolean(legacy.isPublished ?? true);

  if (legacy.primaryColor) {
    design.elements.forEach((el) => {
      if (el.type === "shape" && el.fillColor === "#635BFF") {
        el.fillColor = legacy.primaryColor!;
      }
      if (el.type === "text" && el.color === "#635BFF") {
        el.color = legacy.primaryColor!;
      }
      if (el.type === "dynamic_text" && el.color === "#635BFF") {
        el.color = legacy.primaryColor!;
      }
    });
  }

  if (legacy.logoUrl) {
    design.elements.unshift({
      id: `img-${Math.random().toString(36).slice(2, 9)}`,
      type: "image",
      name: "Event Logo",
      src: legacy.logoUrl,
      x: 140,
      y: 18,
      width: 100,
      height: 40,
      objectFit: "contain",
      zIndex: 15,
    });
  }

  return design;
}

/**
 * Resolves active StudioDesign with priority:
 * 1. Event custom_pass_design (if StudioDesign version 2)
 * 2. Event custom_pass_design (if legacy object converted to version 2)
 * 3. Profile default custom_pass_design (version 2 or legacy converted)
 * 4. Fallback to default Minimal Monochrome template
 */
export function resolveStudioDesign(
  eventDesign?: unknown,
  profileDesign?: unknown,
  fallbackBrandColor?: string | null,
  preferredFormat: TicketFormat = "digital"
): StudioDesign {
  if (eventDesign) {
    if (isStudioDesign(eventDesign)) return eventDesign;
    if (typeof eventDesign === "object" && Object.keys(eventDesign).length > 0) {
      return convertLegacyToStudioDesign(eventDesign as Record<string, unknown>);
    }
  }

  if (profileDesign) {
    if (isStudioDesign(profileDesign)) return profileDesign;
    if (typeof profileDesign === "object" && Object.keys(profileDesign).length > 0) {
      return convertLegacyToStudioDesign(profileDesign as Record<string, unknown>);
    }
  }

  const defaultTemplate =
    STUDIO_TEMPLATES.find((t) => t.format === preferredFormat) || STUDIO_TEMPLATES[0];

  const design = JSON.parse(JSON.stringify(defaultTemplate.design)) as StudioDesign;
  if (fallbackBrandColor) {
    design.elements.forEach((el) => {
      if (el.type === "shape" && (el.fillColor === "#635BFF" || el.fillColor === "#F59E0B")) {
        el.fillColor = fallbackBrandColor;
      }
    });
  }

  return design;
}
