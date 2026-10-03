import { NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordLiveOpsEvent } from "@/lib/ops/events";
import { calculateInvoiceTaxes, parseInvoiceNumber } from "@/lib/invoices";
import { validateGstin } from "@/lib/validations/gstin";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PATCH(req: Request) {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      invoiceId,
      invoiceNumber,
      customerName,
      customerAddress,
      customerGstin,
      customerState,
      customerStateCode,
    } = await req.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: "invoiceId is required" },
        { status: 400 }
      );
    }

    const trimmedNumber = typeof invoiceNumber === "string" ? invoiceNumber.trim() : "";
    const trimmedName = typeof customerName === "string" ? customerName.trim() : "";
    const trimmedAddress = typeof customerAddress === "string" ? customerAddress.trim() : "";
    const trimmedGstin = typeof customerGstin === "string" ? customerGstin.trim().toUpperCase() : "";
    const trimmedState = typeof customerState === "string" ? customerState.trim() : "";
    const trimmedStateCode = typeof customerStateCode === "string" ? customerStateCode.trim() : "";

    if (!trimmedNumber && !trimmedName && !trimmedAddress && !trimmedGstin && !trimmedStateCode) {
      return NextResponse.json(
        { error: "Provide an invoice number or billing details to update" },
        { status: 400 }
      );
    }

    let parsed: ReturnType<typeof parseInvoiceNumber> = null;
    if (trimmedNumber) {
      // Verify format matches UrPass standard UP/{DOC_TYPE}/{FY}/{SEQUENCE}
      parsed = parseInvoiceNumber(trimmedNumber);
      if (!parsed) {
        return NextResponse.json(
          {
            error:
              "Invalid invoice number format. Expected format: UP/{DOC_TYPE}/{FY}/{000000} (e.g. UP/SUB/2026-27/000001 or UP/INV/2026-27/000001)",
          },
          { status: 400 }
        );
      }
    }

    if (trimmedGstin && !validateGstin(trimmedGstin)) {
      return NextResponse.json(
        { error: "Invalid GSTIN format. Leave blank for unregistered customers." },
        { status: 400 }
      );
    }

    const admin = adminClient();

    // Check if another invoice already uses this number
    if (trimmedNumber) {
      const { data: existingWithNumber } = await admin
        .from("invoices")
        .select("id")
        .eq("invoice_number", trimmedNumber)
        .neq("id", invoiceId)
        .maybeSingle();

      if (existingWithNumber) {
        return NextResponse.json(
          { error: `Invoice number ${trimmedNumber} is already in use by another invoice` },
          { status: 409 }
        );
      }
    }

    // Retrieve previous invoice number for audit log
    const { data: currentInvoice } = await admin
      .from("invoices")
      .select("id, invoice_number, user_id, customer_name, customer_email, customer_address, customer_gstin, taxable_amount, currency")
      .eq("id", invoiceId)
      .maybeSingle();

    if (!currentInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const previousNumber = currentInvoice.invoice_number;
    const nextName = trimmedName || currentInvoice.customer_name;
    const nextAddress = trimmedAddress || currentInvoice.customer_address;
    const nextGstin = trimmedGstin || null;
    const taxes =
      trimmedAddress || trimmedGstin || trimmedStateCode
        ? calculateInvoiceTaxes({
            taxableAmount: Number(currentInvoice.taxable_amount || 0),
            currency: currentInvoice.currency,
            customerGstin: nextGstin,
            customerAddress: nextAddress,
            customerState: trimmedState || null,
            customerStateCode: trimmedStateCode || null,
          })
        : null;

    const updates: Record<string, string | number | null> = {};
    if (trimmedNumber) updates.invoice_number = trimmedNumber;
    if (trimmedName) updates.customer_name = trimmedName;
    if (trimmedAddress) updates.customer_address = trimmedAddress;
    if (typeof customerGstin === "string") updates.customer_gstin = nextGstin;
    if (taxes) {
      updates.place_of_supply = taxes.placeOfSupply;
      updates.state_code = taxes.stateCode;
      updates.cgst_rate = taxes.cgstRate;
      updates.cgst_amount = taxes.cgstAmount;
      updates.sgst_rate = taxes.sgstRate;
      updates.sgst_amount = taxes.sgstAmount;
      updates.igst_rate = taxes.igstRate;
      updates.igst_amount = taxes.igstAmount;
      updates.total_amount = taxes.totalAmount;
    }

    const { error: updateError } = await admin
      .from("invoices")
      .update(updates)
      .eq("id", invoiceId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (trimmedName || trimmedAddress || typeof customerGstin === "string") {
      const profileUpdates: Record<string, string | null> = {};
      if (trimmedName) profileUpdates.company_name = trimmedName;
      if (trimmedAddress) profileUpdates.billing_address = trimmedAddress;
      if (typeof customerGstin === "string") profileUpdates.gstin = nextGstin;

      await admin
        .from("profiles")
        .update(profileUpdates)
        .eq("user_id", currentInvoice.user_id);
    }

    recordLiveOpsEvent({
      level: "SUCCESS",
      category: "BILLING",
      message: `Ops updated invoice billing details for ${currentInvoice.customer_email}: [${previousNumber}] → [${trimmedNumber || previousNumber}]`,
      details: {
        invoiceId,
        previousNumber,
        newNumber: trimmedNumber || previousNumber,
        docType: parsed?.docType,
        fy: parsed?.fy,
        sequence: parsed?.sequence,
        customerGstin: nextGstin,
        stateCode: taxes?.stateCode,
      },
    });

    return NextResponse.json({
      success: true,
      invoiceId,
      invoiceNumber: trimmedNumber || previousNumber,
      previousNumber,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update invoice number";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
