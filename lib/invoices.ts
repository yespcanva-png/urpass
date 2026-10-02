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
  currency?: "INR" | "GBP" | "USD";
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string | null;
  customerGstin?: string | null;
  customerState?: string | null;
  customerStateCode?: string | null;
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
  placeOfSupply: "Tamil Nadu",
  stateCode: "33",
};

const URPASS_SERVICE = {
  name: "URPASS SaaS Subscription",
  description: "Monthly subscription for access to the URPASS event management platform.",
  sac: "997331",
  sacNote: "SAC 997331: Licensing services for the right to use computer software and databases.",
  gstRate: 18,
};

const GST_STATE_CODES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory",
};

function formatStateLabel(state?: string | null, code?: string | null) {
  const cleanState = state?.trim();
  const cleanCode = code?.trim();
  if (cleanState && cleanCode) return `${cleanState} (${cleanCode})`;
  if (cleanState) return cleanState;
  if (cleanCode && GST_STATE_CODES[cleanCode]) return `${GST_STATE_CODES[cleanCode]} (${cleanCode})`;
  if (cleanCode) return `State Code ${cleanCode}`;
  return "Not provided";
}

function resolveCustomerState(input: {
  gstin?: string | null;
  address?: string | null;
  state?: string | null;
  stateCode?: string | null;
}): { state: string | null; code: string | null } {
  const explicitCode = input.stateCode?.trim();
  if (explicitCode) {
    return { state: input.state?.trim() || GST_STATE_CODES[explicitCode] || null, code: explicitCode };
  }

  const gstCode = input.gstin?.trim().slice(0, 2);
  if (gstCode && GST_STATE_CODES[gstCode]) {
    return { state: GST_STATE_CODES[gstCode], code: gstCode };
  }

  const haystack = `${input.state || ""} ${input.address || ""}`.toLowerCase();
  for (const [code, state] of Object.entries(GST_STATE_CODES)) {
    if (haystack.includes(state.toLowerCase())) {
      return { state, code };
    }
  }

  if (haystack.includes("tn")) return { state: "Tamil Nadu", code: "33" };
  if (haystack.includes("karnataka")) return { state: "Karnataka", code: "29" };
  return { state: input.state?.trim() || null, code: null };
}

function financialYearFor(date: Date) {
  const year = date.getFullYear();
  const startsThisCalendarYear = date.getMonth() >= 3;
  const startYear = startsThisCalendarYear ? year : year - 1;
  const endYear = startYear + 1;
  return {
    startYear,
    endYear,
    label: `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`,
  };
}

async function nextInvoiceNumber(supabase: ReturnType<typeof adminClient>, date: Date) {
  const fy = financialYearFor(date);
  const start = `${fy.startYear}-04-01`;
  const end = `${fy.endYear}-03-31`;
  const { count } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .gte("invoice_date", start)
    .lte("invoice_date", end);

  return `URP/${fy.label}/${String((count || 0) + 1).padStart(6, "0")}`;
}

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

export function numToWordsGBP(n: number): string {
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

  const pounds = Math.floor(n);
  const pence = Math.round((n - pounds) * 100);

  let result = "";
  if (pounds === 0) {
    result = "Zero Pounds";
  } else {
    const million = Math.floor(pounds / 1000000);
    const thousand = Math.floor((pounds % 1000000) / 1000);
    const hundred = pounds % 1000;

    const parts: string[] = [];
    if (million) parts.push(convertChunk(million) + " Million");
    if (thousand) parts.push(convertChunk(thousand) + " Thousand");
    if (hundred) parts.push(convertChunk(hundred));

    result = "Pounds " + parts.join(" ");
  }

  if (pence > 0) {
    result += " and " + convertChunk(pence) + " Pence Only";
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

  const currency = (params.currency || "INR").toUpperCase();
  const isUk = currency === "GBP";

  // Fetch customer details from parameters or profile
  let custName = params.customerName;
  let custEmail = params.customerEmail;
  let custAddress = params.customerAddress;
  let custGstin = params.customerGstin;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, company_name, org_name, gstin, billing_address")
    .eq("user_id", params.userId)
    .maybeSingle();

  custName = custName || profile?.company_name || profile?.org_name || profile?.full_name || "Valued Customer";
  custEmail = custEmail || profile?.email || "billing@urpass.space";
  custAddress = custAddress || profile?.billing_address || (isUk ? "United Kingdom" : null);
  custGstin = custGstin || profile?.gstin || null;

  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10);
  const invoiceNumber = await nextInvoiceNumber(supabase, date);

  const subtotal = Math.max(0, Number(params.baseAmountRupees) || 0);
  const discount = Math.max(0, Number(params.discountRupees) || 0);
  const taxableAmount = Math.max(0, subtotal - discount);

  const customerState = resolveCustomerState({
    gstin: custGstin,
    address: custAddress,
    state: params.customerState,
    stateCode: params.customerStateCode,
  });

  const isIntraState = !isUk && customerState.code === SELLER.stateCode;

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;
  let totalAmount = taxableAmount;

  if (isUk) {
    // UK 20% Standard VAT
    cgstRate = 0;
    sgstRate = 0;
    igstRate = 20;
    igstAmount = Math.round(taxableAmount * 0.20 * 100) / 100;
    totalAmount = Math.round((taxableAmount + igstAmount) * 100) / 100;
  } else {
    if (isIntraState) {
      cgstRate = 9;
      sgstRate = 9;
      cgstAmount = Math.round(taxableAmount * 0.09 * 100) / 100;
      sgstAmount = Math.round(taxableAmount * 0.09 * 100) / 100;
      totalAmount = Math.round((taxableAmount + cgstAmount + sgstAmount) * 100) / 100;
    } else {
      igstRate = 18;
      igstAmount = Math.round(taxableAmount * 0.18 * 100) / 100;
      totalAmount = Math.round((taxableAmount + igstAmount) * 100) / 100;
    }
  }

  const toDateString = (d?: Date | string | null) =>
    d ? (d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10)) : null;

  const sellerName = isUk ? "Yesp Corporation UK" : SELLER.name;
  const sellerGstin = isUk ? "GB 987 6543 21" : SELLER.gstin;
  const sellerAddress = isUk ? "London, United Kingdom" : SELLER.address;
  const placeOfSupply = isUk ? "United Kingdom" : formatStateLabel(customerState.state, customerState.code);
  const stateCode = isUk ? "GB" : (customerState.code || "");

  const invoiceRow = {
    invoice_number: invoiceNumber,
    user_id: params.userId,
    subscription_id: params.subscriptionId ?? null,
    payment_id: params.paymentId,
    seller_name: sellerName,
    seller_gstin: sellerGstin,
    seller_address: sellerAddress,
    customer_name: custName,
    customer_email: custEmail,
    customer_address: custAddress,
    customer_gstin: custGstin,
    place_of_supply: placeOfSupply,
    state_code: stateCode,
    subtotal,
    discount,
    taxable_amount: taxableAmount,
    cgst_rate: cgstRate,
    cgst_amount: cgstAmount,
    sgst_rate: sgstRate,
    sgst_amount: sgstAmount,
    igst_rate: igstRate,
    igst_amount: igstAmount,
    total_amount: totalAmount,
    currency: isUk ? "GBP" : "INR",
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
  const isUkInvoice = (invoice.currency || "").toUpperCase() === "GBP";
  const currencyCode = isUkInvoice ? "GBP" : "INR";
  const rawAddress = invoice.customer_address?.trim();
  const customerAddress =
    !rawAddress || rawAddress.toLowerCase() === "customer billing address"
      ? "Not provided"
      : rawAddress;
  const rawGstin = invoice.customer_gstin?.trim();
  const customerGstin =
    !rawGstin || rawGstin === "29ABCDE1234F1Z5"
      ? "Not registered / Not provided"
      : rawGstin;
  const placeOfSupply = invoice.place_of_supply?.trim() || "Not provided";
  const customerStateCode = invoice.state_code?.trim() || "Not provided";
  const paymentMethod = isUkInvoice ? "Card / Bank Transfer" : "UPI / Card / Net Banking";

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
  const titleText = "TAX INVOICE - PAID";
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 20);
  page.drawText(titleText, {
    x: rightEdge - titleWidth,
    y: startY + 2,
    size: 20,
    font: fontBold,
    color: dark,
  });

  // Elegant green paid status pill
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

  drawMetaBox(0, "Invoice Number", invoice.invoice_number || "URP/26-27/000001");
  drawMetaBox(1, "Issue Date", invoice.invoice_date || "20 Sep 2026");
  drawMetaBox(2, "Due Date", invoice.invoice_date || "20 Sep 2026");
  drawMetaBox(
    3,
    "Billing Period",
    invoice.billing_period_start && invoice.billing_period_end
      ? (invoice.billing_period_end.startsWith("212") || invoice.description?.includes("Founder") || invoice.description?.includes("Lifetime")
        ? `Lifetime (from ${invoice.billing_period_start})`
        : `${invoice.billing_period_start} – ${invoice.billing_period_end}`)
      : (invoice.invoice_date || "One-Time")
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
  page.drawText("FROM - SELLER", { x: margin, y: partiesY, size: 8, font: fontBold, color: muted });
  page.drawText(invoice.seller_name || (isUkInvoice ? "Yesp Corporation UK" : "Yesp Corporation"), { x: margin, y: partiesY - 18, size: 12, font: fontBold, color: dark });
  page.drawText(
    isUkInvoice
      ? `VAT Reg: ${invoice.seller_gstin || "GB 987 6543 21"}`
      : `GSTIN: ${invoice.seller_gstin || "33OPDPS9865F1Z3"}`,
    { x: margin, y: partiesY - 34, size: 9, font: fontBold, color: bodyText }
  );
  page.drawText(invoice.seller_address || (isUkInvoice ? "London, United Kingdom" : "Tamil Nadu, India"), { x: margin, y: partiesY - 49, size: 9, font: fontRegular, color: muted });
  page.drawText(isUkInvoice ? "Country: United Kingdom" : `State: ${SELLER.placeOfSupply} (${SELLER.stateCode})`, { x: margin, y: partiesY - 64, size: 9, font: fontRegular, color: muted });
  page.drawText("Website: urpass.space", { x: margin, y: partiesY - 79, size: 9, font: fontRegular, color: muted });
  page.drawText(isUkInvoice ? "Email: billing@urpass.space" : "Email: urpass.space@yespstudio.com", { x: margin, y: partiesY - 94, size: 9, font: fontRegular, color: primary });

  // BILL TO (CUSTOMER)
  const custX = margin + colHalf;
  page.drawText("BILL TO - CUSTOMER", { x: custX, y: partiesY, size: 8, font: fontBold, color: muted });
  page.drawText(invoice.customer_name || "Valued Customer", { x: custX, y: partiesY - 18, size: 12, font: fontBold, color: dark });
  page.drawText(customerAddress, { x: custX, y: partiesY - 34, size: 9, font: fontRegular, color: muted });
  if (isUkInvoice) {
    if (invoice.customer_gstin) {
      page.drawText(`VAT ID: ${invoice.customer_gstin}`, { x: custX, y: partiesY - 49, size: 9, font: fontBold, color: bodyText });
    }
  } else {
    page.drawText(`GSTIN: ${customerGstin}`, { x: custX, y: partiesY - 49, size: 9, font: fontBold, color: bodyText });
  }
  page.drawText(isUkInvoice ? "Country: United Kingdom" : `Place of Supply: ${placeOfSupply}`, { x: custX, y: partiesY - 64, size: 9, font: fontRegular, color: muted });
  if (!isUkInvoice) {
    page.drawText(`State Code: ${customerStateCode}`, { x: custX, y: partiesY - 79, size: 9, font: fontRegular, color: muted });
  }
  page.drawText(`Email: ${invoice.customer_email || "Not provided"}`, { x: custX, y: partiesY - 94, size: 9, font: fontRegular, color: primary });

  // Divider above table
  const partiesDividerY = partiesY - 108;
  page.drawLine({
    start: { x: margin, y: partiesDividerY },
    end: { x: rightEdge, y: partiesDividerY },
    color: lineCol,
    thickness: 1,
  });

  // ---------------- 4. ITEM TABLE ----------------
  const tableY = partiesDividerY - 28;

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
  const colSacX = margin + 255;
  const colQtyX = margin + 320;
  const colRateX = margin + 410;
  const colAmountX = rightEdge - 14;

  const headerTextY = tableY + 1;
  page.drawText("#", { x: colNumX, y: headerTextY, size: 8, font: fontBold, color: muted });
  page.drawText("DESCRIPTION", { x: colDescX, y: headerTextY, size: 8, font: fontBold, color: muted });
  page.drawText("SAC", { x: colSacX, y: headerTextY, size: 8, font: fontBold, color: muted });
  page.drawText("QTY", { x: colQtyX, y: headerTextY, size: 8, font: fontBold, color: muted });
  drawTextRightAt(`RATE (${currencyCode})`, colRateX, headerTextY, 8, fontBold, muted);
  drawTextRightAt(`AMOUNT (${currencyCode})`, colAmountX, headerTextY, 8, fontBold, muted);

  // Line item 1
  const rowY = tableY - 32;
  const taxableVal = Number(invoice.taxable_amount || 0);
  const formattedRate = isUkInvoice
    ? taxableVal.toFixed(2)
    : taxableVal.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const formattedAmount = isUkInvoice
    ? taxableVal.toFixed(2)
    : taxableVal.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  page.drawText("1", { x: colNumX, y: rowY, size: 9, font: fontRegular, color: dark });
  page.drawText(URPASS_SERVICE.name, { x: colDescX, y: rowY, size: 10.5, font: fontBold, color: dark });
  const subHeading = URPASS_SERVICE.description;
  page.drawText(subHeading, {
    x: colDescX,
    y: rowY - 14,
    size: 8,
    font: fontRegular,
    color: muted,
  });
  const periodText = invoice.billing_period_start && invoice.billing_period_end
    ? (invoice.billing_period_end.startsWith("212") || invoice.description?.includes("Founder") || invoice.description?.includes("Lifetime")
      ? `Validity: Lifetime Access (Activated: ${invoice.billing_period_start})`
      : `Billing Period: ${invoice.billing_period_start} – ${invoice.billing_period_end}`)
    : `Invoice Date: ${invoice.invoice_date || new Date().toISOString().slice(0, 10)}`;
  page.drawText(periodText, {
    x: colDescX,
    y: rowY - 26,
    size: 8,
    font: fontRegular,
    color: lightMuted,
  });

  page.drawText(URPASS_SERVICE.sac, { x: colSacX, y: rowY, size: 9, font: fontRegular, color: bodyText });
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

  page.drawText(URPASS_SERVICE.sacNote, {
    x: colDescX,
    y: rowBottomY - 14,
    size: 7.5,
    font: fontRegular,
    color: lightMuted,
  });

  // ---------------- 5. PAYMENT & TOTALS SECTION ----------------
  const calcTopY = rowBottomY - 50;

  // Left: PAYMENT DETAILS
  page.drawText("PAYMENT DETAILS", { x: margin, y: calcTopY, size: 8, font: fontBold, color: muted });

  let payInfoY = calcTopY - 18;
  const drawPaymentItem = (label: string, val: string, isGreen = false) => {
    page.drawText(label, { x: margin, y: payInfoY, size: 8.5, font: fontRegular, color: muted });
    page.drawText(val, { x: margin + 105, y: payInfoY, size: 8.5, font: fontBold, color: isGreen ? greenText : dark });
    payInfoY -= 16;
  };

  drawPaymentItem("Payment Status:", "PAID", true);
  drawPaymentItem("Payment Method:", paymentMethod);
  drawPaymentItem("Transaction ID:", invoice.payment_id || "Not available");
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

  const subtotalVal = Number(invoice.subtotal || taxableVal || 0);
  const taxableAmountVal = Number(invoice.taxable_amount || taxableVal || 0);
  const cgstVal = Number(invoice.cgst_amount || 0);
  const sgstVal = Number(invoice.sgst_amount || 0);
  const igstVal = Number(invoice.igst_amount || 0);
  const totalVal = Number(invoice.total_amount || taxableAmountVal + cgstVal + sgstVal + igstVal);

  if (isUkInvoice) {
    const vatVal = Number(invoice.igst_amount || Math.round(subtotalVal * 0.20 * 100) / 100);
    drawTotalLine("Subtotal:", `GBP ${subtotalVal.toFixed(2)}`);
    drawTotalLine("VAT (20%):", `GBP ${vatVal.toFixed(2)}`);
  } else {
    drawTotalLine("Subtotal:", `INR ${subtotalVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
    if (Number(invoice.discount || 0) > 0) {
      drawTotalLine("Discount:", `INR ${Number(invoice.discount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
    }
    drawTotalLine("Taxable Value:", `INR ${taxableAmountVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
    if (igstVal > 0 || Number(invoice.igst_rate || 0) > 0) {
      drawTotalLine(`IGST (${Number(invoice.igst_rate || 18)}%):`, `INR ${igstVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
    } else {
      drawTotalLine(`CGST (${Number(invoice.cgst_rate || 9)}%):`, `INR ${cgstVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
      drawTotalLine(`SGST (${Number(invoice.sgst_rate || 9)}%):`, `INR ${sgstVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
    }
  }

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

  page.drawText(`TOTAL (${currencyCode}):`, {
    x: totalBoxX + 10,
    y: totalBoxY + 13,
    size: 10.5,
    font: fontBold,
    color: primary,
  });

  const totalText = isUkInvoice
    ? `GBP ${totalVal.toFixed(2)}`
    : `INR ${totalVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
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

  const wordsStr = isUkInvoice ? numToWordsGBP(totalVal) : numToWords(totalVal);
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
  page.drawText(isUkInvoice ? "Yesp Corporation UK Ltd" : "A product by Yesp Corporation", { x: margin, y: 36, size: 8, font: fontRegular, color: muted });

  drawTextRight(isUkInvoice ? "Need help? billing@urpass.space • urpass.space" : "Need help? urpass.space@yespstudio.com • urpass.space", 48, 8, fontBold, primary);
  drawTextRight("Urpass is a product of Yesp Corporation.", 36, 7.5, fontRegular, muted);

  // Row 2 (Legal)
  if (isUkInvoice) {
    page.drawText("Yesp Corporation UK | VAT Reg: GB 987 6543 21 | London, United Kingdom", {
      x: margin,
      y: 20,
      size: 7.5,
      font: fontRegular,
      color: lightMuted,
    });
    drawTextRight("This is a computer-generated tax invoice issued in compliance with UK VAT Regulations.", 20, 7.5, fontRegular, lightMuted);
  } else {
    page.drawText("Yesp Corporation | GSTIN: 33OPDPS9865F1Z3 | Tamil Nadu, India", {
      x: margin,
      y: 20,
      size: 7.5,
      font: fontRegular,
      color: lightMuted,
    });
    drawTextRight("Computer-generated tax invoice. Confirm SAC classification with your CA for permanent filing.", 20, 7.5, fontRegular, lightMuted);
  }

  return await pdfDoc.save();
}
