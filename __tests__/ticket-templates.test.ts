import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  STUDIO_TEMPLATES,
  getTemplatePrice,
  isTemplateFree,
  SINGLE_TEMPLATE_PRICE_INR,
  ALL_ACCESS_BUNDLE_PRICE_INR,
} from "@/lib/studio/templates";
import {
  isTemplateUnlocked,
  parseUnlockedCookie,
} from "@/lib/studio/purchases";

describe("Ticket Template Directory & Tier Rules", () => {
  it("includes both free templates (₹0) and paid templates (₹49)", () => {
    const freeTemplates = STUDIO_TEMPLATES.filter((t) => t.tier !== "paid");
    const paidTemplates = STUDIO_TEMPLATES.filter((t) => t.tier === "paid");

    expect(freeTemplates.length).toBeGreaterThanOrEqual(4);
    expect(paidTemplates.length).toBeGreaterThanOrEqual(4);

    // Verify free template prices are 0
    for (const tpl of freeTemplates) {
      expect(getTemplatePrice(tpl)).toBe(0);
      expect(isTemplateFree(tpl)).toBe(true);
    }

    // Verify paid template prices are 49
    for (const tpl of paidTemplates) {
      expect(getTemplatePrice(tpl)).toBe(SINGLE_TEMPLATE_PRICE_INR);
      expect(isTemplateFree(tpl)).toBe(false);
    }
  });

  it("always allows access to free templates without purchasing", () => {
    const freeTpl = STUDIO_TEMPLATES.find((t) => t.tier !== "paid");
    expect(freeTpl).toBeDefined();

    const isUnlocked = isTemplateUnlocked(freeTpl!.id, []);
    expect(isUnlocked).toBe(true);
  });

  it("locks paid templates until purchased or unlocked by Pro user", () => {
    const paidTpl = STUDIO_TEMPLATES.find((t) => t.tier === "paid");
    expect(paidTpl).toBeDefined();

    // Locked for free user with empty unlocked list
    expect(isTemplateUnlocked(paidTpl!.id, [])).toBe(false);

    // Unlocked once purchased
    expect(isTemplateUnlocked(paidTpl!.id, [paidTpl!.id])).toBe(true);

    // Unlocked with all-access bundle
    expect(isTemplateUnlocked(paidTpl!.id, ["all"])).toBe(true);

    // Unlocked for Pro users
    expect(isTemplateUnlocked(paidTpl!.id, [], true)).toBe(true);
  });

  it("parses unlocked cookie strings correctly", () => {
    expect(parseUnlockedCookie(null)).toEqual([]);
    expect(parseUnlockedCookie("")).toEqual([]);

    const jsonCookie = encodeURIComponent(JSON.stringify(["vip-all-access", "hackathon-terminal"]));
    expect(parseUnlockedCookie(jsonCookie)).toEqual(["vip-all-access", "hackathon-terminal"]);

    const commaCookie = "vip-all-access,concert-music-fest";
    expect(parseUnlockedCookie(commaCookie)).toEqual(["vip-all-access", "concert-music-fest"]);
  });

  it("verifies all 12 templates cover digital, printable, and badge formats", () => {
    const formats = new Set(STUDIO_TEMPLATES.map((t) => t.format));
    expect(formats.has("digital")).toBe(true);
    expect(formats.has("printable")).toBe(true);
    expect(formats.has("badge")).toBe(true);
    expect(STUDIO_TEMPLATES.length).toBe(12);
  });
});

describe("Razorpay Template Order API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a Razorpay order for a single paid template at ₹49", async () => {
    const { POST } = await import("@/app/api/razorpay/template-order/route");

    const req = new Request("http://localhost:3000/api/razorpay/template-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: "vip-all-access",
        templateName: "VIP All-Access Pass",
        userEmail: "organizer@example.com",
      }),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.priceINR).toBe(49);
    expect(json.amount).toBe(4900);
    expect(json.templateId).toBe("vip-all-access");
  });

  it("creates a Razorpay order for all-access bundle at ₹99", async () => {
    const { POST } = await import("@/app/api/razorpay/template-order/route");

    const req = new Request("http://localhost:3000/api/razorpay/template-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: "all-access-bundle",
        isBundle: true,
        userEmail: "organizer@example.com",
      }),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.priceINR).toBe(ALL_ACCESS_BUNDLE_PRICE_INR);
    expect(json.amount).toBe(9900);
    expect(json.templateId).toBe("all");
  });

  it("verifies and unlocks template payment via /api/razorpay/verify-template", async () => {
    const { POST } = await import("@/app/api/razorpay/verify-template/route");

    const req = new Request("http://localhost:3000/api/razorpay/verify-template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "order_tpl_test_12345",
        paymentId: "pay_test_98765",
        signature: "sig_dummy_test",
        templateId: "concert-music-fest",
        templateName: "Concert & Music Fest",
      }),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.templateId).toBe("concert-music-fest");
    expect(res.headers.get("set-cookie")).toContain("urpass_unlocked_templates");
  });
});

describe("Ticket Mockup Canvas Exporter", () => {
  it("exports canvas dimensions according to digital, printable, and badge formats", async () => {
    const { exportTicketMockupCanvas } = await import("@/lib/studio/ticket-mockup-exporter");
    const digitalTpl = STUDIO_TEMPLATES.find((t) => t.format === "digital")!;
    const printableTpl = STUDIO_TEMPLATES.find((t) => t.format === "printable")!;
    const badgeTpl = STUDIO_TEMPLATES.find((t) => t.format === "badge")!;

    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillStyle: "",
      fillRect: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
      arc: vi.fn(),
      setLineDash: vi.fn(),
    }) as any;

    const originalImage = global.Image;
    global.Image = class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      crossOrigin: string = "";
      set src(_val: string) {
        setTimeout(() => this.onload && this.onload(), 5);
      }
    } as any;

    try {
      // 1. Digital Pass
      const dCanvas = await exportTicketMockupCanvas({
        template: digitalTpl,
        eventName: "TECH SUMMIT 2026",
        hostName: "IIT Madras",
        venue: "Main Auditorium",
        date: "24 OCT 2026",
      });
      expect(dCanvas.width).toBe(800);
      expect(dCanvas.height).toBe(1420);

      // 2. Printable Stub Ticket
      const pCanvas = await exportTicketMockupCanvas({
        template: printableTpl,
        eventName: "CONCERT LIVE 2026",
        hostName: "Live Nation",
        venue: "JLN Arena",
        date: "05 DEC 2026",
      });
      expect(pCanvas.width).toBe(1560);
      expect(pCanvas.height).toBe(760);

      // 3. Conference Badge
      const bCanvas = await exportTicketMockupCanvas({
        template: badgeTpl,
        eventName: "DEVCON 2026",
        hostName: "Google Cloud",
        venue: "The Leela Palace",
        date: "18 NOV 2026",
      });
      expect(bCanvas.width).toBe(880);
      expect(bCanvas.height).toBe(1380);
    } finally {
      HTMLCanvasElement.prototype.getContext = originalGetContext;
      global.Image = originalImage;
    }
  });
});
