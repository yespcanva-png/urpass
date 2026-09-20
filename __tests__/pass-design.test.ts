import { describe, it, expect } from "vitest";
import {
  DEFAULT_PASS_DESIGN,
  PASS_DESIGN_PRESETS,
  sanitizePassDesign,
  resolvePassDesign,
  darkenHex,
  getPatternStyle,
  getFontFamilyCls,
} from "@/lib/pass-design";

describe("Custom Pass Design - lib/pass-design", () => {
  it("provides valid default pass design", () => {
    expect(DEFAULT_PASS_DESIGN.theme).toBe("classic");
    expect(DEFAULT_PASS_DESIGN.primaryColor).toBe("#6D28D9");
    expect(DEFAULT_PASS_DESIGN.pattern).toBe("radial");
    expect(DEFAULT_PASS_DESIGN.fontFamily).toBe("sans");
    expect(DEFAULT_PASS_DESIGN.headerStyle).toBe("gradient");
    expect(DEFAULT_PASS_DESIGN.badgeLabel).toBe("EVENT PASS");
    expect(DEFAULT_PASS_DESIGN.accentGlow).toBe(true);
    expect(DEFAULT_PASS_DESIGN.showQrBorder).toBe(true);
  });

  it("contains curated designer presets with unique IDs and designs", () => {
    expect(PASS_DESIGN_PRESETS.length).toBeGreaterThanOrEqual(6);
    const ids = PASS_DESIGN_PRESETS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    // Verify presence of core themes
    const themes = PASS_DESIGN_PRESETS.map((p) => p.design.theme);
    expect(themes).toContain("classic");
    expect(themes).toContain("modern");
    expect(themes).toContain("cyber");
    expect(themes).toContain("badge");
    expect(themes).toContain("minimal");
  });

  describe("sanitizePassDesign", () => {
    it("returns default design when given null, undefined, or empty object", () => {
      expect(sanitizePassDesign(null)).toEqual(DEFAULT_PASS_DESIGN);
      expect(sanitizePassDesign(undefined)).toEqual(DEFAULT_PASS_DESIGN);
      expect(sanitizePassDesign({})).toEqual(DEFAULT_PASS_DESIGN);
    });

    it("accepts and sanitizes valid theme, colors, and properties", () => {
      const input = {
        theme: "cyber",
        primaryColor: "#06B6D4",
        secondaryColor: "#111827",
        pattern: "dots",
        fontFamily: "mono",
        headerStyle: "gradient",
        badgeLabel: "ALL-ACCESS",
        footerNote: "Strictly non-transferable",
        bannerUrl: "https://example.com/banner.png",
        accentGlow: false,
        showQrBorder: true,
      };

      const sanitized = sanitizePassDesign(input);
      expect(sanitized.theme).toBe("cyber");
      expect(sanitized.primaryColor).toBe("#06B6D4");
      expect(sanitized.secondaryColor).toBe("#111827");
      expect(sanitized.pattern).toBe("dots");
      expect(sanitized.fontFamily).toBe("mono");
      expect(sanitized.badgeLabel).toBe("ALL-ACCESS");
      expect(sanitized.footerNote).toBe("Strictly non-transferable");
      expect(sanitized.bannerUrl).toBe("https://example.com/banner.png");
      expect(sanitized.accentGlow).toBe(false);
      expect(sanitized.showQrBorder).toBe(true);
    });

    it("falls back to default for invalid theme, pattern, or hex color", () => {
      const input = {
        theme: "invalid_theme",
        pattern: "invalid_pattern",
        fontFamily: "invalid_font",
        headerStyle: "invalid_header",
        primaryColor: "not_a_hex",
        bannerUrl: "http://insecure.com/banner.png", // non-https rejected
      };

      const sanitized = sanitizePassDesign(input);
      expect(sanitized.theme).toBe(DEFAULT_PASS_DESIGN.theme);
      expect(sanitized.pattern).toBe(DEFAULT_PASS_DESIGN.pattern);
      expect(sanitized.fontFamily).toBe(DEFAULT_PASS_DESIGN.fontFamily);
      expect(sanitized.headerStyle).toBe(DEFAULT_PASS_DESIGN.headerStyle);
      expect(sanitized.primaryColor).toBe(DEFAULT_PASS_DESIGN.primaryColor);
      expect(sanitized.bannerUrl).toBe("");
    });

    it("enforces length limits on badgeLabel and footerNote", () => {
      const input = {
        badgeLabel: "A".repeat(100),
        footerNote: "B".repeat(300),
      };

      const sanitized = sanitizePassDesign(input);
      expect(sanitized.badgeLabel?.length).toBeLessThanOrEqual(32);
      expect(sanitized.footerNote?.length).toBeLessThanOrEqual(160);
    });
  });

  describe("resolvePassDesign", () => {
    const eventDesign = {
      theme: "cyber",
      primaryColor: "#06B6D4",
      secondaryColor: "#000000",
      pattern: "dots",
      fontFamily: "mono",
      headerStyle: "solid",
      badgeLabel: "EVENT OVERRIDE",
      accentGlow: true,
      showQrBorder: true,
    };

    const profileDesign = {
      theme: "badge",
      primaryColor: "#059669",
      secondaryColor: "#047857",
      pattern: "radial",
      fontFamily: "sans",
      headerStyle: "gradient",
      badgeLabel: "ORG DEFAULT",
      accentGlow: true,
      showQrBorder: true,
    };

    it("prioritizes event-specific design when present", () => {
      const resolved = resolvePassDesign(eventDesign, profileDesign, "#18181B");
      expect(resolved.theme).toBe("cyber");
      expect(resolved.badgeLabel).toBe("EVENT OVERRIDE");
      expect(resolved.primaryColor).toBe("#06B6D4");
    });

    it("falls back to profile default design when event design is absent or null", () => {
      const resolved = resolvePassDesign(null, profileDesign, "#18181B");
      expect(resolved.theme).toBe("badge");
      expect(resolved.badgeLabel).toBe("ORG DEFAULT");
      expect(resolved.primaryColor).toBe("#059669");
    });

    it("falls back to fallbackBrandColor when both designs are absent", () => {
      const resolved = resolvePassDesign(null, null, "#2563EB");
      expect(resolved.primaryColor).toBe("#2563EB");
      expect(resolved.theme).toBe(DEFAULT_PASS_DESIGN.theme);
    });

    it("returns default design when everything is null", () => {
      const resolved = resolvePassDesign(null, null, null);
      expect(resolved.primaryColor).toBe(DEFAULT_PASS_DESIGN.primaryColor);
      expect(resolved.theme).toBe(DEFAULT_PASS_DESIGN.theme);
    });
  });

  describe("darkenHex", () => {
    it("darkens a 6-digit hex color correctly", () => {
      const darkened = darkenHex("#FFFFFF", 50);
      expect(darkened.toLowerCase()).toBe("#cdcdcd");
    });

    it("handles hex without # prefix or invalid hex lengths gracefully", () => {
      expect(darkenHex("invalid")).toBe("invalid");
      expect(darkenHex("#FFF")).toBe("#FFF");
    });
  });

  describe("getPatternStyle", () => {
    it("generates correct background style for mesh, dots, stripes, radial, and clean", () => {
      const meshStyle = getPatternStyle("mesh", "#6D28D9", "#4C1D95");
      expect(meshStyle.backgroundImage).toContain("radial-gradient");

      const dotsStyle = getPatternStyle("dots", "#06B6D4", "#111827");
      expect(dotsStyle.backgroundSize).toBe("16px 16px, 100% 100%");

      const stripesStyle = getPatternStyle("stripes", "#059669", "#064E3B");
      expect(stripesStyle.backgroundImage).toContain("repeating-linear-gradient");

      const radialStyle = getPatternStyle("radial", "#2563EB", "#1E3A8A");
      expect(radialStyle.backgroundImage).toContain("radial-gradient(circle at 85% 30%");

      const cleanStyle = getPatternStyle("clean", "#18181B", "#27272A", "solid");
      expect(cleanStyle.background).toBe("#18181B");
    });
  });

  describe("getFontFamilyCls", () => {
    it("maps fontFamily enum to corresponding Tailwind utility class", () => {
      expect(getFontFamilyCls("sans")).toBe("font-sans");
      expect(getFontFamilyCls("mono")).toBe("font-mono");
      expect(getFontFamilyCls("serif")).toBe("font-serif");
    });
  });
});
