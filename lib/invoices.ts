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
  name: "YESP Corporation",
  gstin: "33OPDPS9865F1Z3",
  address: "YESP Corporation, Tamil Nadu, India",
  placeOfSupply: "Tamil Nadu (33)",
  stateCode: "33",
};

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
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primary = rgb(0.43, 0.16, 0.85); // #6D28D9
  const primaryLight = rgb(0.96, 0.95, 1.0); // #F5F3FF
  const dark = rgb(0.06, 0.09, 0.16); // #0F172A
  const darkGray = rgb(0.20, 0.25, 0.30);
  const muted = rgb(0.40, 0.45, 0.52); // #64748B
  const cardBg = rgb(0.98, 0.98, 0.99); // #F8FAFC
  const borderCol = rgb(0.89, 0.91, 0.94); // #E2E8F0
  const emeraldBg = rgb(0.92, 0.99, 0.96); // #ECFDF5
  const emeraldText = rgb(0.02, 0.47, 0.34); // #047857
  const rzpBlue = rgb(0.01, 0.41, 0.73); // Razorpay brand blue

  // 1. Top accent bar
  page.drawRectangle({
    x: 0,
    y: height - 5,
    width,
    height: 5,
    color: primary,
  });

  // 2. Brand Block (YESP Corporation + URPASS)
  page.drawText("YESP CORPORATION", {
    x: 40,
    y: height - 38,
    size: 18,
    font: fontBold,
    color: dark,
  });

  page.drawText("URPASS  •  EVENT TICKETING & PASS PLATFORM", {
    x: 40,
    y: height - 51,
    size: 7.5,
    font: fontBold,
    color: primary,
  });

  page.drawText("urpass.space  •  yespstudio.com  •  GSTIN: 33OPDPS9865F1Z3", {
    x: 40,
    y: height - 63,
    size: 8,
    font: fontRegular,
    color: muted,
  });

  // Top Right: TAX INVOICE + PAID Pill
  const isSample = invoice.invoice_number.includes("SMPL") || Boolean(invoice.payment_id?.includes("sample"));
  page.drawText(isSample ? "SAMPLE INVOICE" : "TAX INVOICE", {
    x: width - 170,
    y: height - 38,
    size: 17,
    font: fontBold,
    color: dark,
  });

  page.drawRectangle({
    x: width - 170,
    y: height - 65,
    width: 130,
    height: 19,
    color: emeraldBg,
    borderColor: rgb(0.65, 0.95, 0.82),
    borderWidth: 1,
  });

  page.drawText("PAID • RAZORPAY VERIFIED", {
    x: width - 162,
    y: height - 59,
    size: 7.5,
    font: fontBold,
    color: emeraldText,
  });

  // Divider
  page.drawLine({
    start: { x: 40, y: height - 76 },
    end: { x: width - 40, y: height - 76 },
    color: borderCol,
    thickness: 1,
  });

  // 3. Invoice Metadata Strip (Razorpay Style)
  const metaY = height - 128;
  page.drawRectangle({
    x: 40,
    y: metaY,
    width: width - 80,
    height: 42,
    color: cardBg,
    borderColor: borderCol,
    borderWidth: 1,
  });

  const colW = (width - 80) / 4;
  const drawMetaCol = (idx: number, label: string, val: string, isPurple = false) => {
    const cx = 52 + idx * colW;
    page.drawText(label, { x: cx, y: metaY + 26, size: 7, font: fontBold, color: muted });
    page.drawText(val.slice(0, 22), { x: cx, y: metaY + 12, size: 8.5, font: fontBold, color: isPurple ? primary : dark });
  };

  drawMetaCol(0, "INVOICE NUMBER", invoice.invoice_number);
  drawMetaCol(1, "INVOICE DATE", invoice.invoice_date);
  drawMetaCol(2, "PAYMENT METHOD", "Razorpay Secure", true);
  drawMetaCol(3, "PAYMENT ID", invoice.payment_id || "N/A");

  // 4. Seller & Buyer Cards (Canva 2-Column Grid)
  const cardsY = metaY - 100;
  const cardWidth = (width - 92) / 2;

  // Seller Card
  page.drawRectangle({
    x: 40,
    y: cardsY,
    width: cardWidth,
    height: 90,
    color: cardBg,
    borderColor: borderCol,
    borderWidth: 1,
  });

  page.drawText("ISSUED BY (SELLER)", { x: 52, y: cardsY + 74, size: 7.5, font: fontBold, color: primary });
  page.drawText(invoice.seller_name || "YESP Corporation", { x: 52, y: cardsY + 59, size: 10.5, font: fontBold, color: dark });
  page.drawText(`GSTIN: ${invoice.seller_gstin || "33OPDPS9865F1Z3"}`, { x: 52, y: cardsY + 45, size: 8.5, font: fontBold, color: darkGray });
  page.drawText(`State: ${invoice.place_of_supply || "Tamil Nadu (33)"}`, { x: 52, y: cardsY + 32, size: 8, font: fontRegular, color: muted });
  page.drawText("Email: srinithin@yespstudio.com", { x: 52, y: cardsY + 19, size: 8, font: fontRegular, color: muted });
  page.drawText("Platform: URPASS (urpass.space)", { x: 52, y: cardsY + 7, size: 8, font: fontRegular, color: muted });

  // Buyer Card
  const buyerX = 40 + cardWidth + 12;
  page.drawRectangle({
    x: buyerX,
    y: cardsY,
    width: cardWidth,
    height: 90,
    color: cardBg,
    borderColor: borderCol,
    borderWidth: 1,
  });

  page.drawText("BILLED TO (BUYER)", { x: buyerX + 12, y: cardsY + 74, size: 7.5, font: fontBold, color: primary });
  page.drawText((invoice.customer_name || "YESP Corporation").slice(0, 26), { x: buyerX + 12, y: cardsY + 59, size: 10.5, font: fontBold, color: dark });
  page.drawText(`GSTIN: ${invoice.customer_gstin || "33OPDPS9865F1Z3"}`, { x: buyerX + 12, y: cardsY + 45, size: 8.5, font: fontBold, color: darkGray });
  page.drawText(`Email: ${invoice.customer_email || "yespcorpindia@gmail.com"}`, { x: buyerX + 12, y: cardsY + 32, size: 8, font: fontRegular, color: muted });
  page.drawText(`Place of Supply: ${invoice.place_of_supply || "Tamil Nadu (33)"}`, { x: buyerX + 12, y: cardsY + 19, size: 8, font: fontRegular, color: muted });
  page.drawText(invoice.customer_address ? `Address: ${invoice.customer_address.slice(0, 32)}` : "Account: Corporate Verified Account", { x: buyerX + 12, y: cardsY + 7, size: 8, font: fontRegular, color: muted });

  // 5. Line Items Table (Canva Modern Table)
  const tableY = cardsY - 32;
  page.drawRectangle({
    x: 40,
    y: tableY,
    width: width - 80,
    height: 24,
    color: rgb(0.94, 0.96, 0.98),
    borderColor: borderCol,
    borderWidth: 1,
  });

  page.drawText("DESCRIPTION & SERVICE", { x: 52, y: tableY + 8, size: 7.5, font: fontBold, color: darkGray });
  page.drawText("SAC CODE", { x: 250, y: tableY + 8, size: 7.5, font: fontBold, color: darkGray });
  page.drawText("QTY", { x: 315, y: tableY + 8, size: 7.5, font: fontBold, color: darkGray });
  page.drawText("TAXABLE", { x: 355, y: tableY + 8, size: 7.5, font: fontBold, color: darkGray });
  page.drawText("GST (18%)", { x: 425, y: tableY + 8, size: 7.5, font: fontBold, color: darkGray });
  page.drawText("TOTAL (INR)", { x: 490, y: tableY + 8, size: 7.5, font: fontBold, color: darkGray });

  // Table row
  const rowY = tableY - 35;
  const itemTitle = invoice.description || (isSample ? "Sample Pass & Designer Pack" : "URPASS Pro Plan Subscription");
  const itemSubtitle = isSample
    ? "Demo Pass Template • QR Code • Custom Ticket Designer Preview"
    : "Unlimited Events • Custom Pass Designer • White-label • Priority Support";

  page.drawText(itemTitle.slice(0, 36), { x: 52, y: rowY + 12, size: 9, font: fontBold, color: dark });
  page.drawText(itemSubtitle.slice(0, 52), { x: 52, y: rowY, size: 7.5, font: fontRegular, color: muted });
  page.drawText("998313", { x: 250, y: rowY + 6, size: 8.5, font: fontRegular, color: darkGray });
  page.drawText("1", { x: 320, y: rowY + 6, size: 8.5, font: fontRegular, color: darkGray });
  page.drawText(`INR ${Number(invoice.taxable_amount).toFixed(2)}`, { x: 355, y: rowY + 6, size: 8.5, font: fontRegular, color: darkGray });
  const totalGst = Number(invoice.cgst_amount) + Number(invoice.sgst_amount) + Number(invoice.igst_amount);
  page.drawText(`INR ${totalGst.toFixed(2)}`, { x: 425, y: rowY + 6, size: 8.5, font: fontRegular, color: darkGray });
  page.drawText(`INR ${Number(invoice.total_amount).toFixed(2)}`, { x: 490, y: rowY + 6, size: 8.5, font: fontBold, color: dark });

  // Divider under row
  page.drawLine({
    start: { x: 40, y: rowY - 10 },
    end: { x: width - 40, y: rowY - 10 },
    color: borderCol,
    thickness: 1,
  });

  // 6. Split Bottom Section: Razorpay Authentication & Financial Breakdown
  const bottomY = rowY - 135;

  // Razorpay Card
  page.drawRectangle({
    x: 40,
    y: bottomY,
    width: cardWidth,
    height: 115,
    color: rgb(0.97, 0.98, 1.0),
    borderColor: rgb(0.80, 0.88, 0.97),
    borderWidth: 1,
  });

  page.drawText("RAZORPAY PAYMENT AUTHENTICATION", { x: 52, y: bottomY + 98, size: 7.5, font: fontBold, color: rzpBlue });
  page.drawText("Payment Gateway: Razorpay Secure PG (India)", { x: 52, y: bottomY + 82, size: 8, font: fontRegular, color: darkGray });
  page.drawText(`Transaction ID: ${(invoice.payment_id || "pay_rzp_real_yespcorp").slice(0, 24)}`, { x: 52, y: bottomY + 68, size: 8, font: fontBold, color: dark });
  page.drawText("Payment Status: Captured & Settled (PAID)", { x: 52, y: bottomY + 54, size: 8, font: fontBold, color: emeraldText });
  page.drawText("Method: Online / UPI / Corporate NetBanking", { x: 52, y: bottomY + 40, size: 8, font: fontRegular, color: muted });
  page.drawText("Security: 256-bit TLS Encrypted • Razorpay Shield", { x: 52, y: bottomY + 26, size: 8, font: fontRegular, color: muted });
  page.drawText("Verification: Authenticated Digital Tax Record", { x: 52, y: bottomY + 12, size: 7.5, font: fontBold, color: rzpBlue });

  // Financial Totals
  page.drawRectangle({
    x: buyerX,
    y: bottomY,
    width: cardWidth,
    height: 115,
    color: cardBg,
    borderColor: borderCol,
    borderWidth: 1,
  });

  const drawSummaryLine = (label: string, val: string, yOff: number) => {
    page.drawText(label, { x: buyerX + 14, y: bottomY + yOff, size: 8, font: fontRegular, color: muted });
    page.drawText(val, { x: buyerX + cardWidth - 95, y: bottomY + yOff, size: 8.5, font: fontBold, color: dark });
  };

  drawSummaryLine("Subtotal (Taxable):", `INR ${Number(invoice.subtotal).toFixed(2)}`, 96);
  drawSummaryLine("CGST (9.0%):", `INR ${Number(invoice.cgst_amount).toFixed(2)}`, 80);
  drawSummaryLine("SGST (9.0%):", `INR ${Number(invoice.sgst_amount).toFixed(2)}`, 64);
  drawSummaryLine("Total GST (18.0%):", `INR ${totalGst.toFixed(2)}`, 48);

  // Total Paid Highlight Bar
  page.drawRectangle({
    x: buyerX + 8,
    y: bottomY + 8,
    width: cardWidth - 16,
    height: 28,
    color: primaryLight,
    borderColor: rgb(0.80, 0.75, 0.95),
    borderWidth: 1,
  });

  page.drawText("TOTAL PAID (INR):", { x: buyerX + 16, y: bottomY + 17, size: 9, font: fontBold, color: primary });
  page.drawText(`INR ${Number(invoice.total_amount).toFixed(2)}`, { x: buyerX + cardWidth - 105, y: bottomY + 16, size: 11, font: fontBold, color: primary });

  // 7. Footer
  page.drawLine({
    start: { x: 40, y: 70 },
    end: { x: width - 40, y: 70 },
    color: borderCol,
    thickness: 1,
  });

  page.drawText("This is a computer-generated tax invoice issued by YESP Corporation in compliance with GST Rules.", {
    x: 40,
    y: 54,
    size: 7.5,
    font: fontRegular,
    color: muted,
  });
  page.drawText("Payment processed securely via Razorpay. Support: srinithin@yespstudio.com • support@urpass.space", {
    x: 40,
    y: 42,
    size: 7.5,
    font: fontRegular,
    color: muted,
  });
  page.drawText("URPASS © 2026 YESP Corporation. All rights reserved. • https://urpass.space", {
    x: 40,
    y: 30,
    size: 7.5,
    font: fontBold,
    color: primary,
  });

  return await pdfDoc.save();
}
