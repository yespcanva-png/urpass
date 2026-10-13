import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminClient, requireImportAccess } from "../_shared";
import {
  buildErrorCsv,
  getImportContext,
  inferColumnMapping,
  parseCSVText,
  validateImportRows,
  type ColumnMapping,
} from "@/lib/attendee-import";
import { recordApiUsage } from "@/lib/api-usage";

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

  const idempotencyKey = String(body.idempotencyKey || crypto.randomUUID()).trim();
  if (!idempotencyKey) {
    return NextResponse.json({ error: "Missing import idempotency key." }, { status: 400 });
  }

  const parsed = parseCSVText(String(body.csvText || ""));

  const mapping: ColumnMapping = body.mapping || inferColumnMapping(parsed.headers);
  const context = await getImportContext(access.db, eventId);
  const validation = validateImportRows({
    headers: parsed.headers,
    rows: parsed.rows,
    mapping,
    existingEmails: context.existingEmails,
    ticketTypes: context.ticketTypes,
  });

  const admin = adminClient();
  const { data: existingBatch } = await admin
    .from("attendee_import_batches")
    .select("report")
    .eq("event_id", eventId)
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existingBatch?.report) {
    return NextResponse.json({ idempotent: true, ...existingBatch.report });
  }

  await admin.from("attendee_import_batches").insert({
    event_id: eventId,
    created_by: access.user.id,
    source: "csv",
    idempotency_key: idempotencyKey,
    status: "processing",
    total_rows: validation.summary.total,
    valid_rows: validation.summary.valid,
    invalid_rows: validation.summary.invalid,
    duplicate_rows: validation.summary.duplicates,
  });

  const imported: Array<{ rowNumber: number; attendeeId: string; passToken: string }> = [];
  const failed = validation.rows
    .filter((r) => r.errors.length > 0)
    .map((r) => ({ rowNumber: r.rowNumber, email: r.email, errors: r.errors }));

  for (const row of validation.rows.filter((r) => r.errors.length === 0)) {
    const { data, error } = await admin.rpc("import_attendee_with_pass", {
      p_event_id: eventId,
      p_name: row.name,
      p_email: row.email,
      p_phone: row.phone,
      p_pass_type: row.passType,
      p_ticket_type_id: row.ticketTypeId,
      p_custom_responses: row.customResponses,
      p_idempotency_key: `${idempotencyKey}:${row.rowNumber}:${row.email}`,
    });

    const result = data as { status?: string; error?: string; attendee_id?: string; pass_token?: string } | null;
    if (error || !result || result.status !== "IMPORTED") {
      failed.push({
        rowNumber: row.rowNumber,
        email: row.email,
        errors: [error?.message || result?.error || result?.status || "Import failed."],
      });
      continue;
    }

    imported.push({
      rowNumber: row.rowNumber,
      attendeeId: String(result.attendee_id),
      passToken: String(result.pass_token),
    });
  }

  if (imported.length > 0) {
    void recordApiUsage(access.event.organizer_id, "registrations", imported.length);
  }

  const report = {
    summary: {
      total: validation.summary.total,
      valid: validation.summary.valid,
      invalid: validation.summary.invalid,
      duplicates: validation.summary.duplicates,
      imported: imported.length,
      failed: failed.length,
    },
    imported,
    failed,
    errorCsv: buildErrorCsv(
      validation.rows.map((r) =>
        failed.some((f) => f.rowNumber === r.rowNumber)
          ? { ...r, errors: failed.find((f) => f.rowNumber === r.rowNumber)?.errors || r.errors }
          : r
      )
    ),
  };

  await admin
    .from("attendee_import_batches")
    .update({
      status: failed.length > 0 ? "completed" : "completed",
      imported_rows: imported.length,
      failed_rows: failed.length,
      report,
      completed_at: new Date().toISOString(),
    })
    .eq("event_id", eventId)
    .eq("idempotency_key", idempotencyKey);

  return NextResponse.json(report);
}
