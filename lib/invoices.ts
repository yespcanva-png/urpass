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
  name: "URPASS Technologies Private Limited",
  gstin: "33AABCU9603R1ZM",
  address: "IIT Madras Research Park, Kanagam Road, Taramani, Chennai, Tamil Nadu 600113",
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

  const black = rgb(0.08, 0.08, 0.08);
  const darkGray = rgb(0.25, 0.25, 0.25);
  const muted = rgb(0.45, 0.45, 0.45);
  const lightBg = rgb(0.96, 0.96, 0.97);
  const primary = rgb(0.43, 0.16, 0.85); // URPASS purple

  // Header banner
  page.drawRectangle({
    x: 40,
    y: height - 100,
    width: width - 80,
    height: 60,
    color: lightBg,
  });

  page.drawText("URPASS", {
    x: 55,
    y: height - 75,
    size: 22,
    font: fontBold,
    color: primary,
  });

  page.drawText("TAX INVOICE", {
    x: width - 180,
    y: height - 75,
    size: 16,
    font: fontBold,
    color: black,
  });

  // Invoice meta
  let y = height - 125;
  page.drawText(`Invoice No: ${invoice.invoice_number}`, {
    x: 40,
    y,
    size: 10,
    font: fontBold,
    color: black,
  });
  page.drawText(`Date: ${invoice.invoice_date}`, {
    x: 350,
    y,
    size: 10,
    font: fontRegular,
    color: black,
  });

  y -= 16;
  page.drawText(`Payment ID: ${invoice.payment_id || "N/A"}`, {
    x: 40,
    y,
    size: 10,
    font: fontRegular,
    color: darkGray,
  });
  page.drawText(`Status: PAID`, {
    x: 350,
    y,
    size: 10,
    font: fontBold,
    color: rgb(0.08, 0.58, 0.25),
  });

  // Two columns: Seller & Buyer
  y -= 35;
  page.drawText("ISSUED BY (SELLER):", { x: 40, y, size: 9, font: fontBold, color: muted });
  page.drawText("BILLED TO (BUYER):", { x: 300, y, size: 9, font: fontBold, color: muted });

  y -= 14;
  page.drawText(invoice.seller_name, { x: 40, y, size: 10, font: fontBold, color: black });
  page.drawText(invoice.customer_name, { x: 300, y, size: 10, font: fontBold, color: black });

  y -= 14;
  page.drawText(`GSTIN: ${invoice.seller_gstin}`, { x: 40, y, size: 9, font: fontRegular, color: darkGray });
  page.drawText(`Email: ${invoice.customer_email}`, { x: 300, y, size: 9, font: fontRegular, color: darkGray });

  y -= 14;
  page.drawText(`State: ${invoice.place_of_supply}`, { x: 40, y, size: 9, font: fontRegular, color: darkGray });
  if (invoice.customer_gstin) {
    page.drawText(`GSTIN: ${invoice.customer_gstin}`, { x: 300, y, size: 9, font: fontRegular, color: darkGray });
  }

  // Items table header
  y -= 35;
  page.drawRectangle({
    x: 40,
    y: y - 5,
    width: width - 80,
    height: 24,
    color: lightBg,
  });

  page.drawText("Description", { x: 50, y, size: 9, font: fontBold, color: darkGray });
  page.drawText("SAC Code", { x: 250, y, size: 9, font: fontBold, color: darkGray });
  page.drawText("Taxable", { x: 340, y, size: 9, font: fontBold, color: darkGray });
  page.drawText("GST (18%)", { x: 415, y, size: 9, font: fontBold, color: darkGray });
  page.drawText("Total", { x: 490, y, size: 9, font: fontBold, color: darkGray });

  // Table Row
  y -= 25;
  const itemDesc = invoice.description || "UrPass Subscription Service";
  page.drawText(itemDesc.slice(0, 32), { x: 50, y, size: 9, font: fontRegular, color: black });
  page.drawText("998313", { x: 250, y, size: 9, font: fontRegular, color: darkGray });
  page.drawText(`INR ${invoice.taxable_amount.toFixed(2)}`, { x: 340, y, size: 9, font: fontRegular, color: black });
  const totalGst = Number(invoice.cgst_amount) + Number(invoice.sgst_amount) + Number(invoice.igst_amount);
  page.drawText(`INR ${totalGst.toFixed(2)}`, { x: 415, y, size: 9, font: fontRegular, color: black });
  page.drawText(`INR ${invoice.total_amount.toFixed(2)}`, { x: 490, y, size: 9, font: fontBold, color: black });

  // Summary box
  y -= 50;
  const boxX = 320;
  page.drawRectangle({
    x: boxX,
    y: y - 100,
    width: width - boxX - 40,
    height: 115,
    color: lightBg,
  });

  const drawSummaryLine = (label: string, value: string, currentY: number, isBold = false) => {
    page.drawText(label, { x: boxX + 12, y: currentY, size: 9, font: isBold ? fontBold : fontRegular, color: darkGray });
    page.drawText(value, { x: boxX + 120, y: currentY, size: 9, font: isBold ? fontBold : fontRegular, color: black });
  };

  let sumY = y;
  drawSummaryLine("Subtotal:", `INR ${invoice.subtotal.toFixed(2)}`, sumY);
  sumY -= 16;
  drawSummaryLine("Discount:", `INR ${invoice.discount.toFixed(2)}`, sumY);
  sumY -= 16;
  drawSummaryLine("Taxable Value:", `INR ${invoice.taxable_amount.toFixed(2)}`, sumY);
  sumY -= 16;
  drawSummaryLine("CGST (9%):", `INR ${invoice.cgst_amount.toFixed(2)}`, sumY);
  sumY -= 16;
  drawSummaryLine("SGST (9%):", `INR ${invoice.sgst_amount.toFixed(2)}`, sumY);
  sumY -= 18;
  drawSummaryLine("Total (INR):", `INR ${invoice.total_amount.toFixed(2)}`, sumY, true);

  // Footer
  page.drawText("This is a computer-generated tax invoice and requires no physical signature.", {
    x: 40,
    y: 50,
    size: 8,
    font: fontRegular,
    color: muted,
  });
  page.drawText("Thank you for using URPASS (urpass.space). For billing queries, contact support@urpass.space", {
    x: 40,
    y: 36,
    size: 8,
    font: fontRegular,
    color: muted,
  });

  return await pdfDoc.save();
}
