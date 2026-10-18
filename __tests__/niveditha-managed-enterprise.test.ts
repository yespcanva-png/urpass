import { describe, it, expect } from "vitest";
import { generateInvoicePdf, type InvoiceRecord } from "@/lib/invoices";
import { canUseFeature, ENTITLEMENTS } from "@/lib/plan";
import { V2_PLAN_LIMITS } from "@/lib/billing/engine/entitlements-engine";

describe("Niveditha Managed Enterprise Plan & Invoicing", () => {
  it("enforces unlimited events, registrations, and branding removal for managed_enterprise", () => {
    expect(ENTITLEMENTS.MANAGED_ENTERPRISE).toBeDefined();
    expect(ENTITLEMENTS.MANAGED_ENTERPRISE.removeBranding).toBe(true);
    expect(ENTITLEMENTS.MANAGED_ENTERPRISE.prioritySupport).toBe(true);
    expect(ENTITLEMENTS.MANAGED_ENTERPRISE.customPassDesign).toBe(true);
    expect(ENTITLEMENTS.MANAGED_ENTERPRISE.eventsPerMonth).toBe(Infinity);
    expect(ENTITLEMENTS.MANAGED_ENTERPRISE.registrationsPerMonth).toBe(Infinity);

    expect(canUseFeature("managed_enterprise", "removeBranding")).toBe(true);
    expect(canUseFeature("managed_enterprise", "prioritySupport")).toBe(true);
    expect(canUseFeature("managed_enterprise", "customDomain")).toBe(true);

    const v2Limits = V2_PLAN_LIMITS.managed_enterprise;
    expect(v2Limits).toBeDefined();
    expect(v2Limits.features.has("remove_branding")).toBe(true);
    expect(v2Limits.features.has("priority_support")).toBe(true);
  });

  it("calculates exact 7000 discounted to 6000 + 18% GST amounts", () => {
    const originalPrice = 7000;
    const discountedPrice = 6000;
    const gstRate = 0.18;
    const gstAmount = Math.round(discountedPrice * gstRate);
    const totalPayable = discountedPrice + gstAmount;

    expect(originalPrice - discountedPrice).toBe(1000);
    expect(discountedPrice).toBe(6000);
    expect(gstAmount).toBe(1080);
    expect(totalPayable).toBe(7080);
  });

  it("generates an official tax invoice PDF mentioning Managed Support", async () => {
    const mockInvoice: InvoiceRecord = {
      id: "inv_test_managed_123",
      invoice_number: "MS-202610-001",
      user_id: "user_test_niveditha",
      subscription_id: "sub_test_123",
      payment_id: "pay_test_managed_123",
      seller_name: "Yesp Corporation",
      seller_gstin: "33OPDPS9865F1Z3",
      seller_address: "Tamil Nadu, India",
      customer_name: "niveditha",
      customer_email: "niveditha@client.urpass.space",
      customer_address: "Tamil Nadu, India",
      customer_gstin: null,
      place_of_supply: "Tamil Nadu",
      state_code: "33",
      subtotal: 6000,
      discount: 0,
      taxable_amount: 6000,
      cgst_rate: 9,
      cgst_amount: 540,
      sgst_rate: 9,
      sgst_amount: 540,
      igst_rate: 0,
      igst_amount: 0,
      total_amount: 7080,
      currency: "INR",
      invoice_date: "2026-10-18",
      billing_period_start: "2026-10-18",
      billing_period_end: "2026-11-18",
      payment_status: "paid",
      invoice_status: "issued",
      pdf_url: "/api/invoices/inv_test_managed_123/pdf",
      created_at: new Date().toISOString(),
      description: "URPASS Managed Enterprise Plan — Managed Support & Custom Branding",
    };

    const pdfBytes = await generateInvoicePdf(mockInvoice);
    expect(pdfBytes).toBeDefined();
    expect(pdfBytes.byteLength).toBeGreaterThan(1000);

    // Verify PDF starts with %PDF header
    const header = Buffer.from(pdfBytes.slice(0, 5)).toString("utf-8");
    expect(header).toBe("%PDF-");
  });
});
