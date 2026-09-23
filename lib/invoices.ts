import { createClient } from "@supabase/supabase-js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getSupabaseUrl } from "@/lib/supabase/config";

function adminClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase admin environment variables");
  }
  return createClient(url, key);
}

export interface InvoiceCreationParams {
  userId: string;
  subscriptionId?: string | null;
  paymentId: string;
  description: string;
  baseAmountRupees: number;
  discountRupees?: number;
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string | null;
  customerGstin?: string | null;
  billingPeriodStart?: Date | string | null;
  billingPeriodEnd?: Date | string | null;
}

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  user_id: string;
  subscription_id: string | null;
  payment_id: string | null;
  seller_name: string;
  seller_gstin: string;
  seller_address: string;
  customer_name: string;
  customer_email: string;
  customer_address: string | null;
  customer_gstin: string | null;
  place_of_supply: string;
  state_code: string;
  subtotal: number;
  discount: number;
  taxable_amount: number;
  cgst_rate: number;
  cgst_amount: number;
  sgst_rate: number;
  sgst_amount: number;
  igst_rate: number;
  igst_amount: number;
  total_amount: number;
  currency: string;
  invoice_date: string;
  billing_period_start: string | null;
  billing_period_end: string | null;
  payment_status: string;
  invoice_status: string;
  pdf_url: string | null;
  created_at: string;
  description?: string;
}

const SELLER = {
  name: "Yesp Corporation",
  gstin: "33OPDPS9865F1Z3",
  address: "Tamil Nadu, India",
  website: "urpass.space",
  email: "urpass.space@yespstudio.com",
  placeOfSupply: "Tamil Nadu (33)",
  stateCode: "33",
};

export function numToWords(n: number): string {
  const units = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertChunk(num: number): string {
    let str = "";
    if (num >= 100) {
      str += units[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "");
    } else if (num > 0) {
      str += units[num];
    }
    return str.trim();
  }

  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);

  let result = "";
  if (rupees === 0) {
    result = "Zero Rupees";
  } else {
    const crore = Math.floor(rupees / 10000000);
    const lakh = Math.floor((rupees % 10000000) / 100000);
    const thousand = Math.floor((rupees % 100000) / 1000);
    const hundred = rupees % 1000;

    const parts: string[] = [];
    if (crore) parts.push(convertChunk(crore) + " Crore");
    if (lakh) parts.push(convertChunk(lakh) + " Lakh");
    if (thousand) parts.push(convertChunk(thousand) + " Thousand");
    if (hundred) parts.push(convertChunk(hundred));

    result = "Rupees " + parts.join(" ");
  }

  if (paise > 0) {
    result += " and " + convertChunk(paise) + " Paise Only";
  } else {
    result += " Only";
  }
  return result;
}

export async function createInvoiceForPayment(
  params: InvoiceCreationParams
): Promise<InvoiceRecord | null> {
  const supabase = adminClient();

  // Check if invoice already exists for this payment_id
  const { data: existing } = await supabase
    .from("invoices")
    .select("*")
    .eq("payment_id", params.paymentId)
    .maybeSingle();

  if (existing) {
    return existing as InvoiceRecord;
  }

  // Fetch customer details if not fully provided
  let custName = params.customerName;
  let custEmail = params.customerEmail;
  if (!custName || !custEmail) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", params.userId)
      .maybeSingle();
    custName = custName || profile?.full_name || "Valued Customer";
    custEmail = custEmail || profile?.email || "billing@urpass.space";
  }

  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10);
  const yyyymm = dateStr.slice(0, 7).replace("-", "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const invoiceNumber = `INV-${yyyymm}-${randomSuffix}`;

  const subtotal = Math.max(0, Number(params.baseAmountRupees) || 0);
  const discount = Math.max(0, Number(params.discountRupees) || 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const cgstAmount = Math.round(taxableAmount * 0.09 * 100) / 100;
  const sgstAmount = Math.round(taxableAmount * 0.09 * 100) / 100;
  const totalAmount = Math.round((taxableAmount + cgstAmount + sgstAmount) * 100) / 100;

  const toDateString = (d?: Date | string | null) =>
    d ? (d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10)) : null;

  const invoiceRow = {
    invoice_number: invoiceNumber,
    user_id: params.userId,
    subscription_id: params.subscriptionId ?? null,
    payment_id: params.paymentId,
    seller_name: SELLER.name,
    seller_gstin: SELLER.gstin,
    seller_address: SELLER.address,
    customer_name: custName,
    customer_email: custEmail,
    customer_address: params.customerAddress ?? null,
    customer_gstin: params.customerGstin ?? null,
    place_of_supply: SELLER.placeOfSupply,
    state_code: SELLER.stateCode,
    subtotal,
    discount,
    taxable_amount: taxableAmount,
    cgst_rate: 9,
    cgst_amount: cgstAmount,
    sgst_rate: 9,
    sgst_amount: sgstAmount,
    igst_rate: 0,
    igst_amount: 0,
    total_amount: totalAmount,
    currency: "INR",
    invoice_date: dateStr,
    billing_period_start: toDateString(params.billingPeriodStart),
    billing_period_end: toDateString(params.billingPeriodEnd),
    payment_status: "paid",
    invoice_status: "issued",
  };

  const { data: inserted, error } = await supabase
    .from("invoices")
    .insert(invoiceRow)
    .select("*")
    .single();

  if (error || !inserted) {
    console.error("Failed to insert invoice row:", error?.message);
    return null;
  }

  // Update pdf_url to authenticated route
  const pdfUrl = `/api/invoices/${inserted.id}/pdf`;
  await supabase
    .from("invoices")
    .update({ pdf_url: pdfUrl })
    .eq("id", inserted.id);

  return { ...inserted, pdf_url: pdfUrl } as InvoiceRecord;
}

export async function generateInvoicePdf(invoice: InvoiceRecord): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait (595.28 x 841.89 pt)
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Modern Minimalist Palette (Stripe / Linear inspired)
  const primary = rgb(0.43, 0.16, 0.85);       // #6D28D9 Urpass Purple Accent
  const primaryLight = rgb(0.96, 0.95, 1.0);   // #F5F3FF Soft highlight
  const primaryBorder = rgb(0.87, 0.84, 0.98); // #DDD6FE Border
  const dark = rgb(0.06, 0.09, 0.16);          // #0F172A Deep Charcoal Header
  const bodyText = rgb(0.20, 0.25, 0.33);      // #334155 Slate
  const muted = rgb(0.40, 0.45, 0.55);         // #64748B Muted Subtext
  const lightMuted = rgb(0.60, 0.65, 0.73);    // #94A3B8 Secondary
  const lineCol = rgb(0.88, 0.90, 0.93);       // #E2E8F0 Clean Hairline
  const bgCard = rgb(0.98, 0.98, 0.99);        // #F8FAFC Clean Card Fill
  const greenBg = rgb(0.92, 0.99, 0.95);       // #ECFDF5 Pill background
  const greenBorder = rgb(0.65, 0.93, 0.79);   // #A7F3D0 Pill border
  const greenText = rgb(0.02, 0.47, 0.34);     // #047857 Pill text

  const margin = 50;
  const contentWidth = width - margin * 2; // 495.28 pt
  const rightEdge = width - margin;

  // Helper: draw text right-aligned to rightEdge
  const drawTextRight = (text: string, y: number, size: number, font: typeof fontRegular, color: typeof dark) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: rightEdge - textWidth,
      y,
      size,
      font,
      color,
    });
    return rightEdge - textWidth;
  };

  // Helper: draw text right-aligned to a specific anchor X
  const drawTextRightAt = (text: string, anchorX: number, y: number, size: number, font: typeof fontRegular, color: typeof dark) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: anchorX - textWidth,
      y,
      size,
      font,
      color,
    });
  };

  // ---------------- 1. HEADER ----------------
  const startY = height - 56; // 785.89

  // Top-Left: Branding
  page.drawText("URPASS", {
    x: margin,
    y: startY,
    size: 24,
    font: fontBold,
    color: primary,
  });

  page.drawText("A product by Yesp Corporation", {
    x: margin,
    y: startY - 18,
    size: 9.5,
    font: fontBold,
    color: dark,
  });

  page.drawText("Event registration made simple.", {
    x: margin,
    y: startY - 32,
    size: 9,
    font: fontRegular,
    color: muted,
  });

  // Top-Right: TAX INVOICE & PAID Badge
  const titleText = "TAX INVOICE";
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 20);
  page.drawText(titleText, {
    x: rightEdge - titleWidth,
    y: startY + 2,
    size: 20,
    font: fontBold,
    color: dark,
  });

  // Elegant green PAID pill badge
  const badgeW = 48;
  const badgeH = 18;
  const badgeX = rightEdge - badgeW;
  const badgeY = startY - 26;

  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeW,
    height: badgeH,
    color: greenBg,
    borderColor: greenBorder,
    borderWidth: 1,
  });

  const paidLabel = "PAID";
  const paidLabelW = fontBold.widthOfTextAtSize(paidLabel, 8.5);
  page.drawText(paidLabel, {
    x: badgeX + (badgeW - paidLabelW) / 2,
    y: badgeY + 5,
    size: 8.5,
    font: fontBold,
    color: greenText,
  });

  // Header hairline divider
  const headerDividerY = startY - 50;
  page.drawLine({
    start: { x: margin, y: headerDividerY },
    end: { x: rightEdge, y: headerDividerY },
    color: lineCol,
    thickness: 1,
  });

  // ---------------- 2. METADATA BAR (4 Clean Columns) ----------------
  const metaY = headerDividerY - 22;
  const colW = contentWidth / 4;

  const drawMetaBox = (colIndex: number, label: string, val: string) => {
    const colX = margin + colIndex * colW;
    page.drawText(label.toUpperCase(), {
      x: colX,
      y: metaY,
      size: 7.5,
      font: fontBold,
      color: muted,
    });
    page.drawText(val, {
      x: colX,
      y: metaY - 16,
      size: 9.5,
      font: fontBold,
      color: dark,
    });
  };

  drawMetaBox(0, "Invoice Number", invoice.invoice_number || "URP/26-27/0001");
  drawMetaBox(1, "Issue Date", invoice.invoice_date || "20 Sep 2026");
  drawMetaBox(2, "Due Date", invoice.invoice_date || "20 Sep 2026");
  drawMetaBox(
    3,
    "Billing Period",
    invoice.billing_period_start && invoice.billing_period_end
      ? `${invoice.billing_period_start} – ${invoice.billing_period_end}`
      : "20 Sep 2026 – 19 Oct 2026"
  );

  // Meta hairline divider
  const metaDividerY = metaY - 32;
  page.drawLine({
    start: { x: margin, y: metaDividerY },
    end: { x: rightEdge, y: metaDividerY },
    color: lineCol,
    thickness: 1,
  });

  // ---------------- 3. SELLER & CUSTOMER SECTION ----------------
  const partiesY = metaDividerY - 32;
  const colHalf = contentWidth / 2;

  // FROM (SELLER)
  page.drawText("FROM (SELLER)", { x: margin, y: partiesY, size: 8, font: fontBold, color: muted });
  page.drawText(invoice.seller_name || "Yesp Corporation", { x: margin, y: partiesY - 18, size: 12, font: fontBold, color: dark });
  page.drawText(`GSTIN: ${invoice.seller_gstin || "33OPDPS9865F1Z3"}`, { x: margin, y: partiesY - 34, size: 9, font: fontBold, color: bodyText });
  page.drawText(invoice.seller_address || "Tamil Nadu, India", { x: margin, y: partiesY - 49, size: 9, font: fontRegular, color: muted });
  page.drawText("Website: urpass.space", { x: margin, y: partiesY - 64, size: 9, font: fontRegular, color: muted });
  page.drawText("Email: urpass.space@yespstudio.com", { x: margin, y: partiesY - 79, size: 9, font: fontRegular, color: primary });

  // BILL TO (CUSTOMER)
  const custX = margin + colHalf;
  page.drawText("BILL TO (CUSTOMER)", { x: custX, y: partiesY, size: 8, font: fontBold, color: muted });
  page.drawText(invoice.customer_name || "ABC Events Pvt Ltd", { x: custX, y: partiesY - 18, size: 12, font: fontBold, color: dark });
  page.drawText(invoice.customer_address || "Customer Billing Address", { x: custX, y: partiesY - 34, size: 9, font: fontRegular, color: muted });
  page.drawText(`GSTIN: ${invoice.customer_gstin || "29ABCDE1234F1Z5"}`, { x: custX, y: partiesY - 49, size: 9, font: fontBold, color: bodyText });
  page.drawText(`State: ${invoice.place_of_supply || "Karnataka (29)"}`, { x: custX, y: partiesY - 64, size: 9, font: fontRegular, color: muted });
  page.drawText(`Email: ${invoice.customer_email || "billing@abcevents.com"}`, { x: custX, y: partiesY - 79, size: 9, font: fontRegular, color: primary });

  // Divider above table
  const partiesDividerY = partiesY - 102;
  page.drawLine({
    start: { x: margin, y: partiesDividerY },
    end: { x: rightEdge, y: partiesDividerY },
    color: lineCol,
    thickness: 1,
  });

  // ---------------- 4. ITEM TABLE ----------------
  const tableY = partiesDividerY - 32;

  // Table header background
  page.drawRectangle({
    x: margin,
    y: tableY - 8,
    width: contentWidth,
    height: 26,
    color: bgCard,
    borderColor: lineCol,
    borderWidth: 1,
  });

  // Table Columns
  const colNumX = margin + 14;
  const colDescX = margin + 42;
  const colSacX = margin + 245;
  const colQtyX = margin + 320;
  const colRateX = margin + 410;
  const colAmountX = rightEdge - 14;

  const headerTextY = tableY + 1;
  page.drawText("#", { x: colNumX, y: headerTextY, size: 8, font: fontBold, color: muted });
  page.drawText("DESCRIPTION", { x: colDescX, y: headerTextY, size: 8, font: fontBold, color: muted });
  page.drawText("SAC", { x: colSacX, y: headerTextY, size: 8, font: fontBold, color: muted });
  page.drawText("QTY", { x: colQtyX, y: headerTextY, size: 8, font: fontBold, color: muted });
  drawTextRightAt("RATE (INR)", colRateX, headerTextY, 8, fontBold, muted);
  drawTextRightAt("AMOUNT (INR)", colAmountX, headerTextY, 8, fontBold, muted);

  // Line item 1
  const rowY = tableY - 32;
  const taxableVal = Number(invoice.taxable_amount || 1999);
  const formattedRate = taxableVal.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const formattedAmount = taxableVal.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  page.drawText("1", { x: colNumX, y: rowY, size: 9, font: fontRegular, color: dark });
  page.drawText(invoice.description || "Urpass Pro Plan", { x: colDescX, y: rowY, size: 10.5, font: fontBold, color: dark });
  page.drawText("Monthly Subscription", {
    x: colDescX,
    y: rowY - 14,
    size: 8.5,
    font: fontRegular,
    color: muted,
  });
  page.drawText("Billing Period: 20 Sep 2026 – 19 Oct 2026", {
    x: colDescX,
    y: rowY - 26,
    size: 8,
    font: fontRegular,
    color: lightMuted,
  });

  page.drawText("998313", { x: colSacX, y: rowY, size: 9, font: fontRegular, color: bodyText });
  page.drawText("1", { x: colQtyX + 4, y: rowY, size: 9, font: fontRegular, color: bodyText });
  drawTextRightAt(formattedRate, colRateX, rowY, 9, fontRegular, bodyText);
  drawTextRightAt(formattedAmount, colAmountX, rowY, 9.5, fontBold, dark);

  // Divider under row
  const rowBottomY = rowY - 40;
  page.drawLine({
    start: { x: margin, y: rowBottomY },
    end: { x: rightEdge, y: rowBottomY },
    color: lineCol,
    thickness: 1,
  });

  // ---------------- 5. PAYMENT & TOTALS SECTION ----------------
  const calcTopY = rowBottomY - 36;

  // Left: PAYMENT DETAILS
  page.drawText("PAYMENT DETAILS", { x: margin, y: calcTopY, size: 8, font: fontBold, color: muted });

  let payInfoY = calcTopY - 18;
  const drawPaymentItem = (label: string, val: string, isGreen = false) => {
    page.drawText(label, { x: margin, y: payInfoY, size: 8.5, font: fontRegular, color: muted });
    page.drawText(val, { x: margin + 105, y: payInfoY, size: 8.5, font: fontBold, color: isGreen ? greenText : dark });
    payInfoY -= 16;
  };

  drawPaymentItem("Payment Status:", "PAID", true);
  drawPaymentItem("Payment Method:", "UPI");
  drawPaymentItem("Transaction ID:", invoice.payment_id || "pay_Qr7H9k3LmN2");
  drawPaymentItem("Payment Date:", invoice.invoice_date || "20 Sep 2026");

  // Subtle thank you card
  const msgCardY = payInfoY - 36;
  page.drawRectangle({
    x: margin,
    y: msgCardY,
    width: 245,
    height: 42,
    color: bgCard,
    borderColor: lineCol,
    borderWidth: 1,
  });

  page.drawText("Thank you for choosing Urpass.", {
    x: margin + 14,
    y: msgCardY + 24,
    size: 9,
    font: fontBold,
    color: dark,
  });
  page.drawText("We're excited to be part of your event journey.", {
    x: margin + 14,
    y: msgCardY + 11,
    size: 8,
    font: fontRegular,
    color: muted,
  });

  // Right: TOTALS BREAKDOWN
  const sumLabelX = rightEdge - 200;
  let currentSumY = calcTopY;

  const drawTotalLine = (label: string, val: string, isBold = false) => {
    page.drawText(label, {
      x: sumLabelX,
      y: currentSumY,
      size: 9,
      font: isBold ? fontBold : fontRegular,
      color: isBold ? dark : bodyText,
    });
    drawTextRight(val, currentSumY, 9, isBold ? fontBold : fontRegular, isBold ? dark : bodyText);
    currentSumY -= 18;
  };

  const subtotalVal = Number(invoice.subtotal || 1999);
  const cgstVal = Number(invoice.cgst_amount || 179.91);
  const sgstVal = Number(invoice.sgst_amount || 179.91);
  const totalVal = Number(invoice.total_amount || 2358.82);

  drawTotalLine("Subtotal:", `INR ${subtotalVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
  drawTotalLine("CGST (9%):", `INR ${cgstVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
  drawTotalLine("SGST (9%):", `INR ${sgstVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);

  // Hairline before Total Box
  currentSumY += 2;
  page.drawLine({
    start: { x: sumLabelX, y: currentSumY },
    end: { x: rightEdge, y: currentSumY },
    color: lineCol,
    thickness: 1,
  });
  currentSumY -= 18;

  // Prominent Total Box
  const totalBoxHeight = 36;
  const totalBoxY = currentSumY - 12;
  const totalBoxX = sumLabelX - 8;
  const totalBoxWidth = rightEdge - totalBoxX;

  page.drawRectangle({
    x: totalBoxX,
    y: totalBoxY,
    width: totalBoxWidth,
    height: totalBoxHeight,
    color: primaryLight,
    borderColor: primaryBorder,
    borderWidth: 1,
  });

  page.drawText("TOTAL (INR):", {
    x: totalBoxX + 10,
    y: totalBoxY + 13,
    size: 10.5,
    font: fontBold,
    color: primary,
  });

  const totalText = `INR ${totalVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  drawTextRightAt(totalText, rightEdge - 10, totalBoxY + 12, 13.5, fontBold, primary);

  // Amount in Words below total
  const wordsY = totalBoxY - 20;
  page.drawText("Amount in Words:", {
    x: sumLabelX - 8,
    y: wordsY,
    size: 8,
    font: fontBold,
    color: muted,
  });

  const wordsStr = numToWords(totalVal);
  page.drawText(wordsStr, {
    x: sumLabelX - 8,
    y: wordsY - 12,
    size: 7.5,
    font: fontRegular,
    color: bodyText,
  });

  // ---------------- 6. FOOTER ----------------
  const footerDividerY = 66;
  page.drawLine({
    start: { x: margin, y: footerDividerY },
    end: { x: rightEdge, y: footerDividerY },
    color: lineCol,
    thickness: 1,
  });

  // Row 1
  page.drawText("URPASS", { x: margin, y: 48, size: 9, font: fontBold, color: dark });
  page.drawText("A product by Yesp Corporation", { x: margin, y: 36, size: 8, font: fontRegular, color: muted });

  drawTextRight("Need help? urpass.space@yespstudio.com • urpass.space", 48, 8, fontBold, primary);
  drawTextRight("Urpass is a product of Yesp Corporation.", 36, 7.5, fontRegular, muted);

  // Row 2 (Legal)
  page.drawText("Yesp Corporation | GSTIN: 33OPDPS9865F1Z3 | Tamil Nadu, India", {
    x: margin,
    y: 20,
    size: 7.5,
    font: fontRegular,
    color: lightMuted,
  });

  drawTextRight("This is a computer-generated tax invoice issued in compliance with GST Rules.", 20, 7.5, fontRegular, lightMuted);

  return await pdfDoc.save();
}
