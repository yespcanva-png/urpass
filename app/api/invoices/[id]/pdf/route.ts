import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInvoicePdf, type InvoiceRecord } from "@/lib/invoices";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up invoice scoped to the authenticated user
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: "Invoice not found or unauthorized" }, { status: 404 });
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
