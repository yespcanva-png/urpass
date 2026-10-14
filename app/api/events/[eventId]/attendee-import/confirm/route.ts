import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

  try {
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
  } catch (e) {
    console.error("Batch insert tracking notice:", e);
  }

  const imported: Array<{ rowNumber: number; attendeeId: string; passToken: string }> = [];
  const failed = validation.rows
    .filter((r) => r.errors.length > 0)
    .map((r) => ({ rowNumber: r.rowNumber, email: r.email, errors: r.errors }));

  const rowsToImport = validation.rows.filter((r) => r.errors.length === 0);

  // Check event capacity
  const { count: currentApprovedCount } = await admin
    .from("attendees")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  let capacityRemaining = (access.event.attendee_limit || 999999) - (currentApprovedCount || 0);

  for (const row of rowsToImport) {
    if (capacityRemaining <= 0) {
      failed.push({
        rowNumber: row.rowNumber,
        email: row.email,
        errors: ["Event capacity has been reached."],
      });
      continue;
    }

    // Check duplicate email
    const { data: existingAttendee } = await admin
      .from("attendees")
      .select("id")
      .eq("event_id", eventId)
      .ilike("email", row.email)
      .maybeSingle();

    if (existingAttendee) {
      failed.push({
        rowNumber: row.rowNumber,
        email: row.email,
        errors: ["Attendee already exists in this event."],
      });
      continue;
    }

    // 1. Insert attendee
    const { data: attendeeRecord, error: attendeeErr } = await admin
      .from("attendees")
      .insert({
        event_id: eventId,
        name: row.name,
        email: row.email,
        phone: row.phone || null,
        pass_type: row.passType || "participant",
        application_status: "approved",
        pass_status: "generated",
        ticket_type_id: row.ticketTypeId || null,
        custom_responses: {
          ...row.customResponses,
          imported_from: "csv_import",
          import_operation_id: `${idempotencyKey}:${row.rowNumber}:${row.email}`,
        },
      })
      .select("id")
      .single();

    if (attendeeErr || !attendeeRecord) {
      failed.push({
        rowNumber: row.rowNumber,
        email: row.email,
        errors: [attendeeErr?.message || "Failed to create attendee."],
      });
      continue;
    }

    // 2. Insert pass and get generated pass_token
    const { data: passRecord, error: passErr } = await admin
      .from("passes")
      .insert({
        event_id: eventId,
        attendee_id: attendeeRecord.id,
        pass_type: row.passType || "participant",
        ticket_type_id: row.ticketTypeId || null,
        status: "generated",
        generated_at: new Date().toISOString(),
      })
      .select("id, pass_token")
      .single();

    if (passErr || !passRecord) {
      await admin.from("attendees").delete().eq("id", attendeeRecord.id);
      failed.push({
        rowNumber: row.rowNumber,
        email: row.email,
        errors: [passErr?.message || "Failed to generate pass."],
      });
      continue;
    }

    capacityRemaining--;
    imported.push({
      rowNumber: row.rowNumber,
      attendeeId: attendeeRecord.id,
      passToken: passRecord.pass_token,
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

  try {
    await admin
      .from("attendee_import_batches")
      .update({
        status: "completed",
        imported_rows: imported.length,
        failed_rows: failed.length,
        report,
        completed_at: new Date().toISOString(),
      })
      .eq("event_id", eventId)
      .eq("idempotency_key", idempotencyKey);
  } catch (e) {
    console.error("Batch update tracking notice:", e);
  }

  try {
    revalidatePath(`/event/${eventId}/attendees`);
    revalidatePath(`/event/${eventId}`);
  } catch (err) {
    console.error("Failed to revalidate path:", err);
  }

  return NextResponse.json(report);
}
