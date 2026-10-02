import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { isOpsAuthenticated } from "@/lib/ops/auth";
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

  let invoice: InvoiceRecord | null = null;

  // 1. Allow Ops admin to access any invoice
  const isOps = await isOpsAuthenticated();
  if (isOps) {
    const admin = adminClient();
    const { data } = await admin
      .from("invoices")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (data) {
      invoice = data as InvoiceRecord;
    }
  }

  // 2. Normal authenticated user scoped to their own invoice
  if (!invoice) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id);

    const { data, error } =
      typeof (query as any).maybeSingle === "function"
        ? await (query as any).maybeSingle()
        : await (query as any).single();

    if (error || !data) {
      return NextResponse.json({ error: "Invoice not found or unauthorized" }, { status: 404 });
    }

    invoice = data as InvoiceRecord;
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
