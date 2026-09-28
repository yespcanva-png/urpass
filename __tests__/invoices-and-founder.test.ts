import { describe, it, expect, vi, beforeEach } from "vitest";
import { numToWords, numToWordsGBP } from "@/lib/invoices";

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
