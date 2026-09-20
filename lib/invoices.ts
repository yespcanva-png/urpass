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
  email: "support@urpass.space",
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
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Palette: MNC fintech / SaaS aesthetic
  const primary = rgb(0.43, 0.16, 0.85); // #6D28D9 Urpass purple accent
  const primaryLight = rgb(0.96, 0.95, 1.0); // #F5F3FF
  const primaryBorder = rgb(0.87, 0.84, 0.98); // #DDD6FE
  const dark = rgb(0.06, 0.09, 0.16); // #0F172A Dark navy/charcoal
  const charcoal = rgb(0.20, 0.25, 0.33); // #334155
  const muted = rgb(0.39, 0.45, 0.55); // #64748B
  const faint = rgb(0.58, 0.64, 0.72); // #94A3B8
  const lineCol = rgb(0.89, 0.91, 0.94); // #E2E8F0
  const bgLight = rgb(0.97, 0.98, 0.99); // #F8FAFC
  const greenBg = rgb(0.92, 0.99, 0.96); // #ECFDF5
  const greenBorder = rgb(0.65, 0.95, 0.82); // #A7F3D0
  const greenText = rgb(0.02, 0.47, 0.34); // #047857

  // Subtle watermark in background (3-5% opacity)
  page.drawText("URPASS", {
    x: width / 2 - 130,
    y: height / 2 - 40,
    size: 72,
    font: fontBold,
    color: rgb(0.97, 0.97, 0.99),
  });

  // ---------------- HEADER ----------------
  const startY = height - 48;

  // Top-left: URPASS logo + A product by Yesp Corporation + tagline
  page.drawText("URPASS", {
    x: 44,
    y: startY,
    size: 22,
    font: fontBold,
    color: primary,
  });

  page.drawText("A product by Yesp Corporation", {
    x: 44,
    y: startY - 15,
    size: 8.5,
    font: fontBold,
    color: dark,
  });

  page.drawText("Event registration made simple.", {
    x: 44,
    y: startY - 27,
    size: 8,
    font: fontRegular,
    color: muted,
  });

  // Top-right: TAX INVOICE + PAID status badge
  page.drawText("TAX INVOICE", {
    x: width - 180,
    y: startY,
    size: 18,
    font: fontBold,
    color: dark,
  });

  // Elegant green PAID badge
  page.drawRectangle({
    x: width - 85,
    y: startY - 1,
    width: 41,
    height: 16,
    color: greenBg,
    borderColor: greenBorder,
    borderWidth: 1,
  });
  page.drawText("PAID", {
    x: width - 77,
    y: startY + 3,
    size: 7.5,
    font: fontBold,
    color: greenText,
  });

  // Invoice metadata list (top right)
  const metaLabelsX = width - 200;
  const metaValuesX = width - 110;
  let metaY = startY - 18;

  const drawMetaRow = (label: string, val: string) => {
    page.drawText(label, { x: metaLabelsX, y: metaY, size: 8, font: fontRegular, color: muted });
    page.drawText(val, { x: metaValuesX, y: metaY, size: 8, font: fontBold, color: dark });
    metaY -= 12;
  };

  drawMetaRow("Invoice No:", invoice.invoice_number || "URP/26-27/0001");
  drawMetaRow("Issue Date:", invoice.invoice_date || "20 Sep 2026");
  drawMetaRow("Due Date:", invoice.invoice_date || "20 Sep 2026");
  drawMetaRow(
    "Billing Period:",
    invoice.billing_period_start && invoice.billing_period_end
      ? `${invoice.billing_period_start} - ${invoice.billing_period_end}`
      : "20 Sep 2026 - 19 Oct 2026"
  );

  // Subtle divider
  page.drawLine({
    start: { x: 44, y: startY - 72 },
    end: { x: width - 44, y: startY - 72 },
    color: lineCol,
    thickness: 1,
  });

  // ---------------- SELLER & CUSTOMER SECTION ----------------
  const entityY = startY - 95;

  // FROM (SELLER)
  page.drawText("FROM (SELLER)", { x: 44, y: entityY, size: 7.5, font: fontBold, color: muted });
  page.drawText(invoice.seller_name || "Yesp Corporation", { x: 44, y: entityY - 14, size: 11, font: fontBold, color: dark });
  page.drawText(`GSTIN: ${invoice.seller_gstin || "33OPDPS9865F1Z3"}`, { x: 44, y: entityY - 27, size: 8.5, font: fontBold, color: charcoal });
  page.drawText("Tamil Nadu, India", { x: 44, y: entityY - 39, size: 8.5, font: fontRegular, color: muted });
  page.drawText("Website: urpass.space", { x: 44, y: entityY - 51, size: 8.5, font: fontRegular, color: muted });
  page.drawText("Email: support@urpass.space", { x: 44, y: entityY - 63, size: 8.5, font: fontRegular, color: primary });

  // BILL TO (CUSTOMER)
  const custX = 310;
  page.drawText("BILL TO (CUSTOMER)", { x: custX, y: entityY, size: 7.5, font: fontBold, color: muted });
  page.drawText(invoice.customer_name || "ABC Events Pvt Ltd", { x: custX, y: entityY - 14, size: 11, font: fontBold, color: dark });
  page.drawText(invoice.customer_address || "Customer Billing Address", { x: custX, y: entityY - 27, size: 8.5, font: fontRegular, color: muted });
  page.drawText(`GSTIN: ${invoice.customer_gstin || "29ABCDE1234F1Z5"}`, { x: custX, y: entityY - 39, size: 8.5, font: fontBold, color: charcoal });
  page.drawText(`State: ${invoice.place_of_supply || "Karnataka (29)"}`, { x: custX, y: entityY - 51, size: 8.5, font: fontRegular, color: muted });
  page.drawText(`Email: ${invoice.customer_email || "billing@abcevents.com"}`, { x: custX, y: entityY - 63, size: 8.5, font: fontRegular, color: primary });

  // ---------------- ITEM TABLE ----------------
  const tableY = entityY - 95;

  // Header background strip
  page.drawRectangle({
    x: 44,
    y: tableY,
    width: width - 88,
    height: 22,
    color: bgLight,
    borderColor: lineCol,
    borderWidth: 1,
  });

  page.drawText("#", { x: 54, y: tableY + 7, size: 7.5, font: fontBold, color: charcoal });
  page.drawText("DESCRIPTION", { x: 80, y: tableY + 7, size: 7.5, font: fontBold, color: charcoal });
  page.drawText("SAC", { x: 285, y: tableY + 7, size: 7.5, font: fontBold, color: charcoal });
  page.drawText("QTY", { x: 345, y: tableY + 7, size: 7.5, font: fontBold, color: charcoal });
  page.drawText("RATE (INR)", { x: 405, y: tableY + 7, size: 7.5, font: fontBold, color: charcoal });
  page.drawText("AMOUNT (INR)", { x: 480, y: tableY + 7, size: 7.5, font: fontBold, color: charcoal });

  // Line item row
  const rowY = tableY - 25;
  const taxable = Number(invoice.taxable_amount || 1999).toFixed(2);

  page.drawText("1", { x: 54, y: rowY, size: 8.5, font: fontRegular, color: dark });
  page.drawText(invoice.description || "Urpass Pro Plan", { x: 80, y: rowY, size: 9.5, font: fontBold, color: dark });
  page.drawText("Monthly Subscription", { x: 80, y: rowY - 11, size: 8, font: fontRegular, color: muted });
  page.drawText("Billing Period: 20 Sep 2026 - 19 Oct 2026", { x: 80, y: rowY - 21, size: 7.5, font: fontRegular, color: faint });

  page.drawText("998313", { x: 285, y: rowY, size: 8.5, font: fontRegular, color: charcoal });
  page.drawText("1", { x: 348, y: rowY, size: 8.5, font: fontRegular, color: charcoal });
  page.drawText(Number(taxable).toLocaleString("en-IN", { minimumFractionDigits: 2 }), { x: 405, y: rowY, size: 8.5, font: fontRegular, color: charcoal });
  page.drawText(Number(taxable).toLocaleString("en-IN", { minimumFractionDigits: 2 }), { x: 485, y: rowY, size: 8.5, font: fontBold, color: dark });

  // Divider under row
  page.drawLine({
    start: { x: 44, y: rowY - 32 },
    end: { x: width - 44, y: rowY - 32 },
    color: lineCol,
    thickness: 1,
  });

  // ---------------- TOTAL & PAYMENT SECTION ----------------
  const splitY = rowY - 52;

  // Left: PAYMENT DETAILS & Message card
  page.drawText("PAYMENT DETAILS", { x: 44, y: splitY, size: 7.5, font: fontBold, color: muted });

  let payY = splitY - 14;
  const drawPayRow = (label: string, val: string, isGreen = false) => {
    page.drawText(label, { x: 44, y: payY, size: 8, font: fontRegular, color: muted });
    page.drawText(val, { x: 135, y: payY, size: 8, font: fontBold, color: isGreen ? greenText : dark });
    payY -= 13;
  };

  drawPayRow("Payment Status:", "PAID", true);
  drawPayRow("Payment Method:", "UPI");
  drawPayRow("Transaction ID:", invoice.payment_id || "pay_Qr7H9k3LmN2");
  drawPayRow("Payment Date:", invoice.invoice_date || "20 Sep 2026");

  // Premium message card
  const msgY = payY - 24;
  page.drawRectangle({
    x: 44,
    y: msgY,
    width: 235,
    height: 38,
    color: bgLight,
    borderColor: lineCol,
    borderWidth: 1,
  });

  page.drawText("Thank you for choosing Urpass.", {
    x: 54,
    y: msgY + 23,
    size: 8,
    font: fontBold,
    color: dark,
  });
  page.drawText("We're excited to be part of your event journey.", {
    x: 54,
    y: msgY + 11,
    size: 7.5,
    font: fontRegular,
    color: muted,
  });

  // Right: TOTALS SECTION
  const sumLabelX = 330;
  const sumValX = 485;
  let sumY = splitY;

  const drawSummaryLine = (label: string, val: string) => {
    page.drawText(label, { x: sumLabelX, y: sumY, size: 8.5, font: fontRegular, color: charcoal });
    page.drawText(val, { x: sumValX, y: sumY, size: 8.5, font: fontBold, color: dark });
    sumY -= 15;
  };

  const subtotalStr = `INR ${Number(invoice.subtotal || 1999).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const cgstStr = `INR ${Number(invoice.cgst_amount || 179.91).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const sgstStr = `INR ${Number(invoice.sgst_amount || 179.91).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  drawSummaryLine("Subtotal:", subtotalStr);
  drawSummaryLine("CGST (9%):", cgstStr);
  drawSummaryLine("SGST (9%):", sgstStr);

  // Visually Prominent Final Total Box
  const totalBoxY = sumY - 22;
  page.drawRectangle({
    x: sumLabelX - 10,
    y: totalBoxY,
    width: width - 44 - (sumLabelX - 10),
    height: 32,
    color: primaryLight,
    borderColor: primaryBorder,
    borderWidth: 1,
  });

  page.drawText("TOTAL (INR):", {
    x: sumLabelX,
    y: totalBoxY + 11,
    size: 10,
    font: fontBold,
    color: primary,
  });

  const totalFormatted = `INR ${Number(invoice.total_amount || 2358.82).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  page.drawText(totalFormatted, {
    x: sumValX - 18,
    y: totalBoxY + 10,
    size: 13,
    font: fontBold,
    color: primary,
  });

  // Amount in Words below total box
  const wordsY = totalBoxY - 18;
  page.drawText("Amount in Words:", {
    x: sumLabelX - 10,
    y: wordsY,
    size: 7.5,
    font: fontBold,
    color: muted,
  });

  const wordsStr = numToWords(Number(invoice.total_amount || 2358.82));
  page.drawText(wordsStr, {
    x: sumLabelX - 10,
    y: wordsY - 10,
    size: 6.8,
    font: fontRegular,
    color: charcoal,
  });

  // ---------------- FOOTER ----------------
  const footerDividerY = 70;
  page.drawLine({
    start: { x: 44, y: footerDividerY },
    end: { x: width - 44, y: footerDividerY },
    color: lineCol,
    thickness: 1,
  });

  // Footer Row 1
  page.drawText("URPASS", { x: 44, y: 53, size: 9, font: fontBold, color: dark });
  page.drawText("A product by Yesp Corporation", { x: 44, y: 43, size: 7.5, font: fontRegular, color: muted });

  page.drawText("Need help?", { x: width - 180, y: 53, size: 7.5, font: fontRegular, color: faint });
  page.drawText("support@urpass.space  •  urpass.space", { x: width - 180, y: 43, size: 7.5, font: fontBold, color: primary });

  // Bottom legal lines
  page.drawText("Yesp Corporation | GSTIN: 33OPDPS9865F1Z3 | Tamil Nadu, India", {
    x: 44,
    y: 28,
    size: 7,
    font: fontRegular,
    color: faint,
  });

  page.drawText("Urpass is a product of Yesp Corporation.", {
    x: width - 190,
    y: 28,
    size: 7,
    font: fontBold,
    color: muted,
  });

  return await pdfDoc.save();
}
