import { describe, it, expect } from "vitest";

describe("Niveditha Client Custom Business Plan + WhatsApp Billing", () => {
  const NIVEDITHA_EMAIL = "niveditha@client.urpass.space";

  it("calculates Business Plan + WhatsApp add-on + 18% GST breakdown with exact precision", () => {
    function resolveUserPlanQuote(email: string, planSlug: string) {
      const isNiveditha = email.toLowerCase() === NIVEDITHA_EMAIL;

      if (isNiveditha) {
        const businessBase = 2499;
        const whatsappAddon = 500;
        const taxableBase = businessBase + whatsappAddon; // ₹2,999.00
        const gstRate = 0.18;
        const gstAmount = Math.round(taxableBase * gstRate * 100) / 100; // ₹539.82
        const totalNetPayable = Math.round((taxableBase + gstAmount) * 100) / 100; // ₹3,538.82

        return {
          planSlug: "business",
          planName: "Business Plan (with WhatsApp Integration)",
          businessBase,
          whatsappAddon,
          taxableBase,
          gstRate: 18,
          gstAmount,
          totalNetPayable,
          paiseAmount: Math.round(totalNetPayable * 100), // 353882 paise
        };
      }

      // Default standard business plan
      const base = 2499;
      const gst = Math.round(base * 0.18 * 100) / 100;
      return {
        planSlug,
        planName: "Business Plan",
        businessBase: base,
        whatsappAddon: 0,
        taxableBase: base,
        gstRate: 18,
        gstAmount: gst,
        totalNetPayable: Math.round((base + gst) * 100) / 100,
        paiseAmount: Math.round((base + gst) * 100),
      };
    }

    const nivedithaQuote = resolveUserPlanQuote(NIVEDITHA_EMAIL, "business");

    expect(nivedithaQuote.planSlug).toBe("business");
    expect(nivedithaQuote.businessBase).toBe(2499);
    expect(nivedithaQuote.whatsappAddon).toBe(500);
    expect(nivedithaQuote.taxableBase).toBe(2999);
    expect(nivedithaQuote.gstAmount).toBe(539.82);
    expect(nivedithaQuote.totalNetPayable).toBe(3538.82);
    expect(nivedithaQuote.paiseAmount).toBe(353882);

    // Other users get normal pricing
    const regularQuote = resolveUserPlanQuote("other@company.com", "business");
    expect(regularQuote.whatsappAddon).toBe(0);
    expect(regularQuote.taxableBase).toBe(2499);
  });

  it("formats the invoice description correctly for Niveditha", () => {
    function getInvoiceDescription(email: string) {
      if (email.toLowerCase() === NIVEDITHA_EMAIL) {
        return "URPASS Business Plan + WhatsApp Delivery Integration (Monthly)";
      }
      return "BUSINESS Plan (monthly)";
    }

    expect(getInvoiceDescription(NIVEDITHA_EMAIL)).toBe(
      "URPASS Business Plan + WhatsApp Delivery Integration (Monthly)"
    );
  });
});
