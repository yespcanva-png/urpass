import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getOwnerEmail } from "@/lib/email";
import { generateInvoicePdf, type InvoiceRecord } from "@/lib/invoices";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  const decodedIdentifier = decodeURIComponent(id).trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedIdentifier);

  let invoice: InvoiceRecord | null = null;
  const admin = adminClient();

  // 1. Allow Ops admin to access any invoice
  const isOps = await isOpsAuthenticated();
  if (isOps) {
    const query = admin.from("invoices").select("*");
    const { data } = isUuid
      ? await query.eq("id", decodedIdentifier).maybeSingle()
      : await query.eq("invoice_number", decodedIdentifier).maybeSingle();

    if (data) {
      invoice = data as InvoiceRecord;
    }
  }

  // 2. Authenticated user or Platform Owner
  if (!invoice) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerEmail = getOwnerEmail().toLowerCase();
    const envOwner = (process.env.OWNER_EMAIL || "").toLowerCase();
    const userEmail = (user.email || "").toLowerCase();
    const isOwner =
      userEmail === ownerEmail ||
      userEmail === envOwner ||
      userEmail === "srinithinoffl@gmail.com" ||
      userEmail === "srinithin@yespstudio.com";

    if (isOwner) {
      // Platform owner can access any invoice
      const query = admin.from("invoices").select("*");
      const { data } = isUuid
        ? await query.eq("id", decodedIdentifier).maybeSingle()
        : await query.eq("invoice_number", decodedIdentifier).maybeSingle();

      if (data) {
        invoice = data as InvoiceRecord;
      }
    } else {
      // Customer scoped to their own invoice
      const query = supabase.from("invoices").select("*").eq("user_id", user.id);
      const { data } = isUuid
        ? await query.eq("id", decodedIdentifier).maybeSingle()
        : await query.eq("invoice_number", decodedIdentifier).maybeSingle();

      if (data) {
        invoice = data as InvoiceRecord;
      }
    }

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found or unauthorized" }, { status: 404 });
    }
  }

  const pdfBytes = await generateInvoicePdf(invoice as InvoiceRecord);

  const { searchParams } = new URL(req.url);
  const isDownload = searchParams.get("download") === "1";
  const dispositionType = isDownload ? "attachment" : "inline";
  const filename = `Invoice-${invoice.invoice_number}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${dispositionType}; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
