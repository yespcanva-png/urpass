import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { formatPrice } from "@/lib/markets/currency";

export interface UkInvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceMinor: number; // in pence
  vatRatePercent: number; // 20 for standard VAT, 0 for exempt/free
}

export interface UkInvoiceParams {
  invoiceNumber: string;
  issueDate: string; // YYYY-MM-DD
  sellerName?: string;
  sellerVatNumber?: string;
  sellerAddress?: string;
  customerName: string;
  customerEmail: string;
  customerOrgName?: string | null;
  eventName?: string | null;
  lineItems: UkInvoiceLineItem[];
  currency?: "GBP";
  notes?: string;
}

export interface GeneratedUkInvoice {
  pdfBytes: Uint8Array;
  subtotalMinor: number;
  vatAmountMinor: number;
  totalAmountMinor: number;
  formattedTotal: string;
}

/**
 * Generates an HMRC-compliant PDF invoice or receipt for the UK market.
 * Accurately calculates 20% VAT or zero-rated free receipts.
 */
export async function generateUkInvoicePdf(params: UkInvoiceParams): Promise<GeneratedUkInvoice> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4 dimensions in points
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 45;
  let cursorY = height - margin;

  // Colors
  const primaryColor = rgb(0.05, 0.05, 0.05); // #0d0d0d
  const textMuted = rgb(0.45, 0.45, 0.45);
  const borderColor = rgb(0.88, 0.88, 0.88);
  const bgHeader = rgb(0.97, 0.97, 0.97);

  // 1. Header: Platform Brand & Invoice Title
  page.drawText("URPASS UK", {
    x: margin,
    y: cursorY - 18,
    size: 20,
    font: fontBold,
    color: primaryColor,
  });

  const isFreeReceipt = params.lineItems.every((item) => item.unitPriceMinor === 0);
  const docTitle = isFreeReceipt ? "FREE REGISTRATION RECEIPT" : "VAT INVOICE";

  page.drawText(docTitle, {
    x: width - margin - fontBold.widthOfTextAtSize(docTitle, 12),
    y: cursorY - 14,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });

  cursorY -= 40;

  // 2. Metadata Bar
  page.drawText(`Invoice / Receipt No: ${params.invoiceNumber}`, {
    x: margin,
    y: cursorY,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  page.drawText(`Date of Issue: ${params.issueDate}`, {
    x: width - margin - 150,
    y: cursorY,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  cursorY -= 25;
  page.drawLine({
    start: { x: margin, y: cursorY },
    end: { x: width - margin, y: cursorY },
    thickness: 1,
    color: borderColor,
  });

  cursorY -= 25;

  // 3. Parties: Seller & Customer
  const sellerName = params.sellerName || "UrPass Platform UK";
  const sellerVat = params.sellerVatNumber ? `VAT Reg: ${params.sellerVatNumber}` : "VAT: Pending Registration / Exempt";
  const sellerAddr = params.sellerAddress || "London, United Kingdom · uk.urpass.space";

  // Left Column: Supplier
  page.drawText("ISSUED BY:", { x: margin, y: cursorY, size: 8, font: fontBold, color: textMuted });
  cursorY -= 14;
  page.drawText(sellerName, { x: margin, y: cursorY, size: 10, font: fontBold, color: primaryColor });
  cursorY -= 14;
  page.drawText(sellerAddr, { x: margin, y: cursorY, size: 9, font: fontRegular, color: primaryColor });
  cursorY -= 14;
  page.drawText(sellerVat, { x: margin, y: cursorY, size: 9, font: fontRegular, color: textMuted });

  // Right Column: Customer
  let rightY = cursorY + 42;
  page.drawText("BILLED TO / ATTENDEE:", { x: width / 2 + 20, y: rightY, size: 8, font: fontBold, color: textMuted });
  rightY -= 14;
  page.drawText(params.customerName, { x: width / 2 + 20, y: rightY, size: 10, font: fontBold, color: primaryColor });
  rightY -= 14;
  page.drawText(params.customerEmail, { x: width / 2 + 20, y: rightY, size: 9, font: fontRegular, color: primaryColor });
  if (params.customerOrgName) {
    rightY -= 14;
    page.drawText(params.customerOrgName, { x: width / 2 + 20, y: rightY, size: 9, font: fontRegular, color: textMuted });
  }

  cursorY = Math.min(cursorY, rightY) - 30;

  // 4. Line Items Table Header
  const colX = {
    desc: margin + 8,
    qty: width - margin - 220,
    price: width - margin - 150,
    vat: width - margin - 80,
    total: width - margin - 10,
  };

  page.drawRectangle({
    x: margin,
    y: cursorY - 6,
    width: width - margin * 2,
    height: 24,
    color: bgHeader,
  });

  page.drawText("Description", { x: colX.desc, y: cursorY, size: 9, font: fontBold, color: primaryColor });
  page.drawText("Qty", { x: colX.qty, y: cursorY, size: 9, font: fontBold, color: primaryColor });
  page.drawText("Unit Price", { x: colX.price, y: cursorY, size: 9, font: fontBold, color: primaryColor });
  page.drawText("VAT Rate", { x: colX.vat, y: cursorY, size: 9, font: fontBold, color: primaryColor });
  page.drawText("Amount", { x: colX.total - 40, y: cursorY, size: 9, font: fontBold, color: primaryColor });

  cursorY -= 24;

  // 5. Line Items Rows
  let subtotalMinor = 0;
  let vatAmountMinor = 0;

  for (const item of params.lineItems) {
    const itemSubtotal = item.unitPriceMinor * item.quantity;
    const itemVat = Math.round(itemSubtotal * (item.vatRatePercent / 100));
    subtotalMinor += itemSubtotal;
    vatAmountMinor += itemVat;

    page.drawText(item.description, { x: colX.desc, y: cursorY, size: 9, font: fontRegular, color: primaryColor });
    page.drawText(String(item.quantity), { x: colX.qty, y: cursorY, size: 9, font: fontRegular, color: primaryColor });
    page.drawText(formatPrice(item.unitPriceMinor, "GBP"), { x: colX.price, y: cursorY, size: 9, font: fontRegular, color: primaryColor });
    page.drawText(`${item.vatRatePercent}%`, { x: colX.vat, y: cursorY, size: 9, font: fontRegular, color: primaryColor });
    page.drawText(formatPrice(itemSubtotal, "GBP"), { x: colX.total - 40, y: cursorY, size: 9, font: fontRegular, color: primaryColor });

    cursorY -= 20;
    page.drawLine({
      start: { x: margin, y: cursorY + 6 },
      end: { x: width - margin, y: cursorY + 6 },
      thickness: 0.5,
      color: borderColor,
    });
  }

  const totalAmountMinor = subtotalMinor + vatAmountMinor;

  // 6. Summary Totals Box
  cursorY -= 20;
  const summaryX = width - margin - 180;

  page.drawText("Subtotal:", { x: summaryX, y: cursorY, size: 9, font: fontRegular, color: textMuted });
  page.drawText(formatPrice(subtotalMinor, "GBP"), { x: width - margin - 40, y: cursorY, size: 9, font: fontRegular, color: primaryColor });
  cursorY -= 16;

  page.drawText("VAT (UK 20%):", { x: summaryX, y: cursorY, size: 9, font: fontRegular, color: textMuted });
  page.drawText(formatPrice(vatAmountMinor, "GBP"), { x: width - margin - 40, y: cursorY, size: 9, font: fontRegular, color: primaryColor });
  cursorY -= 18;

  page.drawLine({
    start: { x: summaryX, y: cursorY + 6 },
    end: { x: width - margin, y: cursorY + 6 },
    thickness: 1,
    color: primaryColor,
  });

  page.drawText("Total Amount Due / Paid:", { x: summaryX, y: cursorY - 6, size: 10, font: fontBold, color: primaryColor });
  page.drawText(formatPrice(totalAmountMinor, "GBP"), { x: width - margin - 40, y: cursorY - 6, size: 10, font: fontBold, color: primaryColor });

  // 7. Footer: Compliance & Support
  const footerText = isFreeReceipt
    ? "This is a digital entry confirmation and free pass receipt issued under UrPass UK. No payment was collected."
    : "Payment processed in British Pounds (GBP). Retain this invoice for HMRC tax and accounting records.";

  page.drawText(footerText, {
    x: margin,
    y: margin + 20,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });

  page.drawText("Support & Inquiries: support@uk.urpass.space · Web: https://uk.urpass.space", {
    x: margin,
    y: margin + 8,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });

  const pdfBytes = await doc.save();

  const formatInvoicePence = (minor: number) => {
    if (minor === 0 && isFreeReceipt) return "Free";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(minor / 100);
  };

  return {
    pdfBytes,
    subtotalMinor,
    vatAmountMinor,
    totalAmountMinor,
    formattedTotal: formatInvoicePence(totalAmountMinor),
  };
}
