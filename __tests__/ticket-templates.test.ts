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

    // Not unlocked initially
    expect(isTemplateUnlocked(paidTpl!.id, [])).toBe(false);

    // Unlocked when ID is in unlocked list
    expect(isTemplateUnlocked(paidTpl!.id, [paidTpl!.id])).toBe(true);

    // Unlocked when 'all' is in unlocked list
    expect(isTemplateUnlocked(paidTpl!.id, ["all"])).toBe(true);

    // Unlocked when user is Pro
    expect(isTemplateUnlocked(paidTpl!.id, [], true)).toBe(true);
  });

  it("parses unlocked cookie strings correctly", () => {
    const jsonCookie = encodeURIComponent(JSON.stringify(["vip-all-access", "concert-music-fest"]));
    const list = parseUnlockedCookie(jsonCookie);
    expect(list).toContain("vip-all-access");
    expect(list).toContain("concert-music-fest");

    const fallbackList = parseUnlockedCookie("template-1,template-2");
    expect(fallbackList).toContain("template-1");
    expect(fallbackList).toContain("template-2");
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
});
