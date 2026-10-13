import { NextRequest, NextResponse } from "next/server";
import { requireImportAccess } from "../_shared";
import {
  getImportContext,
  inferColumnMapping,
  parseCSVText,
  validateImportRows,
  type ColumnMapping,
} from "@/lib/attendee-import";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ eventId: string }>;
}

export async function POST(req: NextRequest, { params }: Props) {
  const { eventId } = await params;
  const access = await requireImportAccess(eventId);
  if (access instanceof NextResponse) return access;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  const parsed = parseCSVText(String(body.csvText || ""));

  if (parsed.headers.length === 0 || parsed.rows.length === 0) {
    return NextResponse.json({ error: "No data rows found. The first row must contain column headers." }, { status: 400 });
  }

  if (parsed.rows.length > 10000) {
    return NextResponse.json({ error: "Import limit is 10,000 rows per batch." }, { status: 413 });
  }

  const mapping: ColumnMapping = body.mapping || inferColumnMapping(parsed.headers);
  const context = await getImportContext(access.db, eventId);
  const validation = validateImportRows({
    headers: parsed.headers,
    rows: parsed.rows,
    mapping,
    existingEmails: context.existingEmails,
    ticketTypes: context.ticketTypes,
  });

  return NextResponse.json({
    source: "csv",
    headers: validation.headers,
    mapping,
    ticketTypes: context.ticketTypes,
    rows: validation.rows.slice(0, 200),
    summary: validation.summary,
    truncatedPreview: validation.rows.length > 200,
  });
}
