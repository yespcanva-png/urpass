import { describe, it, expect } from "vitest";
import {
  STUDIO_TEMPLATES,
  cloneTemplateDesign,
  createBlankDesign,
} from "@/lib/studio/templates";
import {
  isStudioDesign,
  validateStudioDesign,
  convertLegacyToStudioDesign,
  resolveStudioDesign,
  getContrastRatio,
} from "@/lib/studio/resolver";
import {
  DUMMY_ATTENDEES,
  resolveDynamicField,
  interpolateTokens,
} from "@/lib/studio/dummy-attendees";
import { MIN_QR_SIZE, FORMAT_DIMENSIONS, type StudioDesign } from "@/lib/studio/types";
import { getStudioPlanLimits, sanitizeDesignForPlan } from "@/lib/studio/limits";

describe("URPASS Ticket Studio", () => {
  describe("12 Professional Templates Library", () => {
    it("contains exactly 12 high-quality templates with unique IDs", () => {
      expect(STUDIO_TEMPLATES.length).toBe(12);
      const ids = STUDIO_TEMPLATES.map((t) => t.id);
      expect(new Set(ids).size).toBe(12);
    });

    it("covers Digital Pass, Printable Ticket, and Event Badge formats", () => {
      const formats = new Set(STUDIO_TEMPLATES.map((t) => t.format));
      expect(formats.has("digital")).toBe(true);
      expect(formats.has("printable")).toBe(true);
      expect(formats.has("badge")).toBe(true);
    });

    it("every template passes QR safety validation", () => {
      STUDIO_TEMPLATES.forEach((template) => {
        const validation = validateStudioDesign(template.design);
        expect(validation.valid).toBe(true);
        expect(validation.errors).toEqual([]);
      });
    });

    it("every template contains a protected QR code with minimum scannable size", () => {
      STUDIO_TEMPLATES.forEach((template) => {
        const qr = template.design.elements.find((el) => el.type === "qr");
        expect(qr).toBeDefined();
        expect(qr?.width).toBeGreaterThanOrEqual(MIN_QR_SIZE);
        expect(qr?.height).toBeGreaterThanOrEqual(MIN_QR_SIZE);
      });
    });

    it("cloneTemplateDesign produces isolated elements with unique IDs", () => {
      const original = STUDIO_TEMPLATES[0];
      const cloned = cloneTemplateDesign(original);

      expect(cloned.name).toBe(original.name);
      expect(cloned.elements.length).toBe(original.design.elements.length);

      // Verify element IDs are unique and not shared with original
      const originalIds = original.design.elements.map((el) => el.id);
      const clonedIds = cloned.elements.map((el) => el.id);
      clonedIds.forEach((id) => {
        expect(originalIds.includes(id)).toBe(false);
      });
    });
  });

  describe("Start from Blank formats", () => {
    it("creates digital pass with 380x680 dimensions and centered QR", () => {
      const blank = createBlankDesign("digital");
      expect(blank.format).toBe("digital");
      expect(blank.width).toBe(FORMAT_DIMENSIONS.digital.width);
      expect(blank.height).toBe(FORMAT_DIMENSIONS.digital.height);
      const qr = blank.elements.find((e) => e.type === "qr");
      expect(qr).toBeDefined();
      expect(qr?.width).toBeGreaterThanOrEqual(MIN_QR_SIZE);
    });

    it("creates printable landscape ticket with 780x340 dimensions and stub divider", () => {
      const blank = createBlankDesign("printable");
      expect(blank.format).toBe("printable");
      expect(blank.width).toBe(FORMAT_DIMENSIONS.printable.width);
      expect(blank.height).toBe(FORMAT_DIMENSIONS.printable.height);
      const divider = blank.elements.find((e) => e.type === "divider");
      expect(divider).toBeDefined();
    });

    it("creates event badge with 440x640 dimensions and lanyard slot", () => {
      const blank = createBlankDesign("badge");
      expect(blank.format).toBe("badge");
      expect(blank.width).toBe(FORMAT_DIMENSIONS.badge.width);
      expect(blank.height).toBe(FORMAT_DIMENSIONS.badge.height);
      const lanyardHole = blank.elements.find((e) => e.type === "shape");
      expect(lanyardHole).toBeDefined();
    });
  });

  describe("QR Component Safety & Contrast Engine", () => {
    it("calculates high contrast for black on white", () => {
      const ratio = getContrastRatio("#000000", "#FFFFFF");
      expect(ratio).toBeGreaterThan(15);
    });

    it("flags low contrast QR codes (< 4.5:1 ratio)", () => {
      // Light grey on white
      const lowRatio = getContrastRatio("#CCCCCC", "#FFFFFF");
      expect(lowRatio).toBeLessThan(4.5);
    });

    it("fails validation if QR is smaller than 140px", () => {
      const design: StudioDesign = {
        version: 2,
        format: "digital",
        width: 380,
        height: 680,
        background: { type: "color", color: "#FFFFFF" },
        isPublished: true,
        elements: [
          {
            id: "qr-small",
            type: "qr",
            name: "QR Code",
            size: 100,
            width: 100,
            height: 100,
            x: 50,
            y: 50,
            fgColor: "#000000",
            bgColor: "#FFFFFF",
            zIndex: 1,
          },
        ],
      };

      const result = validateStudioDesign(design);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("below minimum scannable size"))).toBe(true);
    });

    it("fails validation if QR is completely missing", () => {
      const design: StudioDesign = {
        version: 2,
        format: "digital",
        width: 380,
        height: 680,
        background: { type: "color", color: "#FFFFFF" },
        isPublished: true,
        elements: [],
      };

      const result = validateStudioDesign(design);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("at least one QR Code"))).toBe(true);
    });

    it("fails validation if QR is outside canvas boundary", () => {
      const design: StudioDesign = {
        version: 2,
        format: "digital",
        width: 380,
        height: 680,
        background: { type: "color", color: "#FFFFFF" },
        isPublished: true,
        elements: [
          {
            id: "qr-offscreen",
            type: "qr",
            name: "QR Code",
            size: 180,
            width: 180,
            height: 180,
            x: 350, // exceeds 380 width
            y: 50,
            fgColor: "#000000",
            bgColor: "#FFFFFF",
            zIndex: 1,
          },
        ],
      };

      const result = validateStudioDesign(design);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("outside the printable canvas"))).toBe(true);
    });
  });

  describe("Dynamic Field Tokens & Dummy Attendees", () => {
    it("provides realistic dummy profiles including long name stress test", () => {
      expect(DUMMY_ATTENDEES.length).toBeGreaterThanOrEqual(4);
      const longNameProfile = DUMMY_ATTENDEES.find((a) => a.id === "att-long-name");
      expect(longNameProfile).toBeDefined();
      expect(longNameProfile?.name).toBe("Dr. Christopher Montgomery-Vanderbilt III");
    });

    it("resolves dynamic attendee tokens accurately", () => {
      const attendee = DUMMY_ATTENDEES[0]; // Arjun Kumar
      expect(resolveDynamicField("attendee.name", attendee)).toBe("Arjun Kumar");
      expect(resolveDynamicField("ticket.category", attendee)).toBe("VIP ACCESS");
      expect(resolveDynamicField("ticket.id", attendee)).toBe("#URP-10284");
    });

    it("interpolates merge tags within text strings", () => {
      const attendee = DUMMY_ATTENDEES[0];
      const template = "Welcome {{attendee.name}}! Your tier is {{ticket.category}}.";
      const result = interpolateTokens(template, attendee);
      expect(result).toBe("Welcome Arjun Kumar! Your tier is VIP ACCESS.");
    });
  });

  describe("Backward Compatibility & Legacy Migration", () => {
    it("correctly identifies StudioDesign version 2", () => {
      const studio = STUDIO_TEMPLATES[0].design;
      expect(isStudioDesign(studio)).toBe(true);
      expect(isStudioDesign({ template: "modern" })).toBe(false);
      expect(isStudioDesign(null)).toBe(false);
    });

    it("seamlessly converts legacy TicketDesignConfig to version 2 StudioDesign", () => {
      const legacy = {
        template: "dark" as const,
        primaryColor: "#059669",
        logoUrl: "https://example.com/logo.png",
        showAttendeeName: true,
      };

      const converted = convertLegacyToStudioDesign(legacy);
      expect(converted.version).toBe(2);
      expect(converted.format).toBe("digital");
      expect(converted.elements.length).toBeGreaterThan(0);
      expect(converted.elements.some((e) => e.type === "qr")).toBe(true);
      expect(converted.elements.some((e) => e.type === "image" && (e as { src?: string }).src === "https://example.com/logo.png")).toBe(true);
    });

    it("resolves studio design with event override taking precedence", () => {
      const eventStudio: StudioDesign = {
        ...STUDIO_TEMPLATES[1].design,
        name: "Event Custom Pass",
      };

      const resolved = resolveStudioDesign(eventStudio, null, null);
      expect(resolved.name).toBe("Event Custom Pass");
    });
  });

  describe("Subscription Tier Limits & Ticket Studio Sanitization", () => {
    it("correctly identifies Free tier capabilities and restricts Pro perks", () => {
      const limits = getStudioPlanLimits("free");
      expect(limits.isPro).toBe(false);
      expect(limits.isFree).toBe(true);
      expect(limits.canRemoveBranding).toBe(false);
      expect(limits.canUploadBackground).toBe(false);
      expect(limits.canUploadSponsorLogo).toBe(false);
      expect(limits.canUseCategoryColors).toBe(false);
      expect(limits.canExportSvg).toBe(false);
      expect(limits.allowedTemplates).not.toContain("dark");
      expect(limits.allowedShapes).toEqual(["standard"]);
    });

    it("correctly identifies Starter tier capabilities", () => {
      const limits = getStudioPlanLimits("starter");
      expect(limits.isPro).toBe(false);
      expect(limits.isStarter).toBe(true);
      expect(limits.canRemoveBranding).toBe(false);
      expect(limits.canUploadBackground).toBe(false);
      expect(limits.canUploadSponsorLogo).toBe(false);
      expect(limits.allowedTemplates).toEqual(["modern", "minimal", "event"]);
    });

    it("unlocks all studio features for Pro, Business, Campus, and Founder plans", () => {
      const tiers = ["pro", "business", "campus", "founder", "lifetime", "enterprise"] as const;
      for (const tier of tiers) {
        const limits = getStudioPlanLimits(tier);
        expect(limits.isPro).toBe(true);
        expect(limits.canRemoveBranding).toBe(true);
        expect(limits.canUploadBackground).toBe(true);
        expect(limits.canUploadSponsorLogo).toBe(true);
        expect(limits.canUseCategoryColors).toBe(true);
        expect(limits.canExportSvg).toBe(true);
        expect(limits.allowedTemplates).toContain("dark");
        expect(limits.allowedShapes).toContain("rounded");
        expect(limits.allowedShapes).toContain("compact");
      }
    });

    it("sanitizes Pro design features for Free tier users without erroring", () => {
      const proDesign = {
        template: "dark" as const,
        shape: "rounded" as const,
        primaryColor: "#635BFF",
        backgroundImageUrl: "https://example.com/bg.png",
        sponsorLogoUrl: "https://example.com/sponsor.png",
        categoryColors: { VIP: "#FF0000", General: "#00FF00" },
      };

      const sanitized = sanitizeDesignForPlan(proDesign, "free");
      // Template reset to allowed template
      expect(sanitized.template).toBe("modern");
      // Shape reset to standard
      expect(sanitized.shape).toBe("standard");
      // Background & sponsor logo stripped
      expect(sanitized.backgroundImageUrl).toBeNull();
      expect(sanitized.sponsorLogoUrl).toBeNull();
      // Category colors stripped to empty
      expect(sanitized.categoryColors).toEqual({});
      // Base colors and flags preserved
      expect(sanitized.primaryColor).toBe("#635BFF");
    });

    it("preserves full Pro customization for Pro tier users", () => {
      const proDesign = {
        template: "dark" as const,
        shape: "rounded" as const,
        primaryColor: "#111827",
        backgroundImageUrl: "https://example.com/bg.png",
        sponsorLogoUrl: "https://example.com/sponsor.png",
        categoryColors: { VIP: "#FFD700" },
      };

      const sanitized = sanitizeDesignForPlan(proDesign, "pro");
      expect(sanitized.template).toBe("dark");
      expect(sanitized.shape).toBe("rounded");
      expect(sanitized.backgroundImageUrl).toBe("https://example.com/bg.png");
      expect(sanitized.sponsorLogoUrl).toBe("https://example.com/sponsor.png");
      expect(sanitized.categoryColors).toEqual({ VIP: "#FFD700" });
    });
  });
});
