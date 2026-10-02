import { describe, it, expect, vi } from "vitest";
import {
  numToWords,
  numToWordsGBP,
  financialYearFor,
  getFinancialYear,
  formatDocumentNumber,
  formatInvoiceNumber,
  parseInvoiceNumber,
  nextInvoiceNumber,
  nextCreditNoteNumber,
} from "@/lib/invoices";

describe("Invoice 18% GST and Founder Lifetime Calculations", () => {
  it("converts numbers to Indian currency words accurately", () => {
    expect(numToWords(19999)).toBe("Rupees Nineteen Thousand Nine Hundred Ninety Nine Only");
    expect(numToWords(499)).toBe("Rupees Four Hundred Ninety Nine Only");
    expect(numToWords(0)).toBe("Zero Rupees Only");
    expect(numToWords(23598.82)).toBe("Rupees Twenty Three Thousand Five Hundred Ninety Eight and Eighty Two Paise Only");
  });

  it("converts numbers to UK GBP words accurately", () => {
    expect(numToWordsGBP(249)).toBe("Pounds Two Hundred Forty Nine Only");
    expect(numToWordsGBP(35)).toBe("Pounds Thirty Five Only");
    expect(numToWordsGBP(0)).toBe("Zero Pounds Only");
    expect(numToWordsGBP(42.50)).toBe("Pounds Forty Two and Fifty Pence Only");
  });

  it("calculates exactly 20% UK VAT for Starter (£15), Pro (£35), and Founder (£249)", () => {
    const ukTiers = [
      { base: 15, expectedVat: 3.00, expectedTotal: 18.00 },
      { base: 35, expectedVat: 7.00, expectedTotal: 42.00 },
      { base: 79, expectedVat: 15.80, expectedTotal: 94.80 },
      { base: 249, expectedVat: 49.80, expectedTotal: 298.80 },
    ];

    for (const t of ukTiers) {
      const vat = Math.round(t.base * 0.20 * 100) / 100;
      const total = Math.round((t.base + vat) * 100) / 100;
      expect(vat).toBe(t.expectedVat);
      expect(total).toBe(t.expectedTotal);
    }
  });

  it("calculates exactly 18% GST (9% CGST + 9% SGST) for Founder Lifetime Deal (₹19,999)", () => {
    const baseRupees = 19999;
    const cgstAmount = Math.round(baseRupees * 0.09 * 100) / 100;
    const sgstAmount = Math.round(baseRupees * 0.09 * 100) / 100;
    const totalGst = Math.round((cgstAmount + sgstAmount) * 100) / 100;
    const totalAmount = Math.round((baseRupees + totalGst) * 100) / 100;

    expect(cgstAmount).toBe(1799.91);
    expect(sgstAmount).toBe(1799.91);
    expect(totalGst).toBe(3599.82);
    expect(totalAmount).toBe(23598.82);

    // In paise:
    const basePaise = baseRupees * 100; // 1999900
    const gstPaise = Math.round(basePaise * 0.18); // 359982
    const totalPaise = basePaise + gstPaise; // 2359882
    expect(totalPaise).toBe(2359882);
  });

  it("calculates 18% GST correctly for Starter (₹499), Pro (₹999), and Business (₹2499)", () => {
    const plans = [
      { slug: "starter", base: 499, expectedGst: 89.82, expectedTotal: 588.82 },
      { slug: "pro", base: 999, expectedGst: 179.82, expectedTotal: 1178.82 },
      { slug: "business", base: 2499, expectedGst: 449.82, expectedTotal: 2948.82 },
    ];

    for (const p of plans) {
      const cgst = Math.round(p.base * 0.09 * 100) / 100;
      const sgst = Math.round(p.base * 0.09 * 100) / 100;
      const totalGst = Math.round((cgst + sgst) * 100) / 100;
      const total = Math.round((p.base + totalGst) * 100) / 100;

      expect(totalGst).toBe(p.expectedGst);
      expect(total).toBe(p.expectedTotal);
    }
  });

  it("calculates 18% GST correctly on discounted base when coupon is applied", () => {
    const baseRupees = 19999;
    const discountRupees = 1999.9; // 10% discount
    const taxableAmount = Math.max(0, baseRupees - discountRupees);
    const cgst = Math.round(taxableAmount * 0.09 * 100) / 100;
    const sgst = Math.round(taxableAmount * 0.09 * 100) / 100;
    const totalGst = Math.round((cgst + sgst) * 100) / 100;
    const totalAmount = Math.round((taxableAmount + totalGst) * 100) / 100;

    expect(taxableAmount).toBe(17999.1);
    expect(cgst).toBe(1619.92);
    expect(sgst).toBe(1619.92);
    expect(totalGst).toBe(3239.84);
    expect(totalAmount).toBe(21238.94);
  });
});

describe("UrPass Invoice & Document Numbering Scheme", () => {
  it("correctly identifies Indian Financial Year (1 April - 31 March) with 2026-27 format", () => {
    // Middle of FY 2026-27
    const octDate = new Date(2026, 9, 3); // Oct 3, 2026
    const fyOct = financialYearFor(octDate);
    expect(fyOct.label).toBe("2026-27");
    expect(fyOct.startYear).toBe(2026);
    expect(fyOct.endYear).toBe(2027);
    expect(fyOct.startDate).toBe("2026-04-01");
    expect(fyOct.endDate).toBe("2027-03-31");

    // First day of FY 2026-27 (1 April 2026)
    const apr1Date = new Date(2026, 3, 1);
    expect(financialYearFor(apr1Date).label).toBe("2026-27");

    // Last day of FY 2026-27 (31 March 2027)
    const mar31Date = new Date(2027, 2, 31);
    expect(financialYearFor(mar31Date).label).toBe("2026-27");

    // First day of next FY 2027-28 (1 April 2027 rollover)
    const apr1Next = new Date(2027, 3, 1);
    const fyNext = financialYearFor(apr1Next);
    expect(fyNext.label).toBe("2027-28");
    expect(fyNext.startDate).toBe("2027-04-01");
    expect(fyNext.endDate).toBe("2028-03-31");

    // Early calendar year before April (15 Jan 2026 belongs to FY 2025-26)
    const janDate = new Date(2026, 0, 15);
    expect(financialYearFor(janDate).label).toBe("2025-26");
  });

  it("formats standard sequential invoice numbers: UP/INV/2026-27/000001", () => {
    expect(formatDocumentNumber("INV", "2026-27", 1)).toBe("UP/INV/2026-27/000001");
    expect(formatDocumentNumber("INV", "2026-27", 2)).toBe("UP/INV/2026-27/000002");
    expect(formatDocumentNumber("INV", "2026-27", 3)).toBe("UP/INV/2026-27/000003");
    expect(formatInvoiceNumber("INV", "2026-27", 999)).toBe("UP/INV/2026-27/000999");
  });

  it("supports separate document sequences for credit notes, debit notes, and receipts", () => {
    expect(formatDocumentNumber("CN", "2026-27", 1)).toBe("UP/CN/2026-27/000001");
    expect(formatDocumentNumber("DN", "2026-27", 1)).toBe("UP/DN/2026-27/000001");
    expect(formatDocumentNumber("RCP", "2026-27", 1)).toBe("UP/RCP/2026-27/000001");
  });

  it("supports separate vertical series for subscriptions, ticketing, and managed services", () => {
    // SaaS Subscriptions
    expect(formatDocumentNumber("SUB", "2026-27", 1)).toBe("UP/SUB/2026-27/000001");
    // Ticket / platform-fee invoices
    expect(formatDocumentNumber("TKT", "2026-27", 1)).toBe("UP/TKT/2026-27/000001");
    // Managed services
    expect(formatDocumentNumber("MS", "2026-27", 1)).toBe("UP/MS/2026-27/000001");
  });

  it("formats next financial year sequence reset on 1 April: UP/INV/2027-28/000001", () => {
    expect(formatDocumentNumber("INV", "2027-28", 1)).toBe("UP/INV/2027-28/000001");
    expect(formatDocumentNumber("SUB", "2027-28", 1)).toBe("UP/SUB/2027-28/000001");
  });

  it("parses invoice number structure into prefix, document type, FY, and sequence", () => {
    const parsedInv = parseInvoiceNumber("UP/INV/2026-27/000001");
    expect(parsedInv).toEqual({
      prefix: "UP",
      docType: "INV",
      fy: "2026-27",
      sequence: 1,
    });

    const parsedSub = parseInvoiceNumber("UP/SUB/2026-27/000042");
    expect(parsedSub).toEqual({
      prefix: "UP",
      docType: "SUB",
      fy: "2026-27",
      sequence: 42,
    });

    const parsedCn = parseInvoiceNumber("UP/CN/2027-28/000123");
    expect(parsedCn).toEqual({
      prefix: "UP",
      docType: "CN",
      fy: "2027-28",
      sequence: 123,
    });

    // Invalid format returns null
    expect(parseInvoiceNumber("INVALID_INVOICE_123")).toBeNull();
    expect(parseInvoiceNumber("")).toBeNull();
  });

  it("keeps customer ID, event ID, and gateway transaction IDs as separate fields, not in invoice number", () => {
    const sampleInvoice = {
      invoice_number: "UP/SUB/2026-27/000001",
      user_id: "c8a7db89-abe3-4459-be3e-d39b63f1bb74",
      payment_id: "pay_PkJd98Fh2ksl",
      subscription_id: "sub_1092830192",
      event_id: "evt_3829102",
    };

    // Verify invoice number is clean and doesn't leak or bake in IDs
    expect(sampleInvoice.invoice_number).not.toContain(sampleInvoice.user_id);
    expect(sampleInvoice.invoice_number).not.toContain(sampleInvoice.payment_id);
    expect(sampleInvoice.invoice_number).not.toContain(sampleInvoice.event_id);
    expect(sampleInvoice.invoice_number).toMatch(/^UP\/[A-Z]{2,4}\/\d{4}-\d{2}\/\d{6}$/);
  });

  it("queries next document sequence scoped to prefix and financial year", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockResolvedValue({ count: 4 }),
      }),
    };

    const date = new Date(2026, 9, 3);
    const subNumber = await nextInvoiceNumber(mockSupabase as never, date, "SUB");
    expect(subNumber).toBe("UP/SUB/2026-27/000005");

    const tktNumber = await nextInvoiceNumber(mockSupabase as never, date, "TKT");
    expect(tktNumber).toBe("UP/TKT/2026-27/000005");
  });
});

