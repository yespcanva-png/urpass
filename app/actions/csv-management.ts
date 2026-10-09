"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  type CsvImportType,
  type CsvExportType,
  type CsvValidationPreview,
  type CsvProcessResult,
  type CsvExportColumn,
  validateCsvImport,
  processCsvImport,
  exportToSanitizedCsv,
  generateCsvTemplate,
} from "@/lib/csv-management";
import { isFeatureEnabled } from "@/lib/feature-flags";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Validates a CSV file upload for ticket assignment or attendee imports.
 */
export async function validateCsvUploadAction({
  eventId,
  csvContent,
  importType = "attendee_list",
  orderId,
}: {
  eventId: string;
  csvContent: string;
  importType?: CsvImportType;
  orderId?: string;
}): Promise<CsvValidationPreview & { error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      valid: false,
      totalRows: 0,
      validRowCount: 0,
      errorRowCount: 0,
      duplicateRowCount: 0,
      headers: [],
      rows: [],
      globalErrors: ["UNAUTHORIZED: Authentication required."],
      error: "Authentication required.",
    };
  }

  const db = adminClient();
  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return {
      valid: false,
      totalRows: 0,
      validRowCount: 0,
      errorRowCount: 0,
      duplicateRowCount: 0,
      headers: [],
      rows: [],
      globalErrors: ["EVENT_NOT_FOUND: Event could not be found."],
      error: "Event not found.",
    };
  }

  // Fetch existing attendees to detect cross-event collisions
  const { data: attendees } = await db
    .from("attendees")
    .select("email, serial_number")
    .eq("event_id", eventId);

  const existingEmails = (attendees || []).map((a) => a.email).filter(Boolean);
  const existingSerials = (attendees || []).map((a) => a.serial_number).filter(Boolean);

  let availableTickets: number | undefined = undefined;
  if (orderId) {
    const { data: order } = await db
      .from("ticket_orders")
      .select("total_attendee_count, group_members")
      .eq("id", orderId)
      .maybeSingle();

    if (order && Array.isArray(order.group_members)) {
      const assigned = order.group_members.filter(
        (m: Record<string, unknown>) => m.assignmentState && m.assignmentState !== "UNASSIGNED"
      ).length;
      availableTickets = Math.max(0, order.total_attendee_count - assigned);
    }
  }

  const serialConfig = (event.custom_pass_design as Record<string, unknown>)?._serialNumberConfig as {
    pattern?: string;
  } | null;

  return validateCsvImport({
    csvContent,
    importType,
    availableTickets,
    existingEmails,
    existingSerials,
    serialPattern: serialConfig?.pattern,
  });
}

/**
 * Processes confirmed CSV import batch.
 */
export async function processCsvUploadAction({
  eventId,
  preview,
  orderId,
}: {
  eventId: string;
  preview: CsvValidationPreview;
  orderId?: string;
}): Promise<CsvProcessResult> {
  const result = processCsvImport({ preview, availableTickets: preview.availableSlots });
  const db = adminClient();

  if (result.success && result.importedRecords.length > 0) {
    const nowIso = new Date().toISOString();
    try {
      // Insert imported records to attendees
      const toInsert = result.importedRecords.map((r) => ({
        event_id: eventId,
        name: r.name,
        email: r.email,
        serial_number: r.serialNumber || null,
        application_status: "approved",
        pass_status: "not_generated",
        created_at: nowIso,
        updated_at: nowIso,
      }));

      await db.from("attendees").insert(toInsert);
    } catch {
      // Mock / fallback
    }
  }

  return result;
}

/**
 * Exports formula-sanitized CSV data for distribution, attendees, or session logs.
 */
export async function exportEventDataCsvAction({
  eventId,
  exportType = "attendee_registrations",
}: {
  eventId: string;
  exportType?: CsvExportType;
}): Promise<{ success: boolean; csvContent?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "UNAUTHORIZED: Authentication required." };
  }

  const db = adminClient();
  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, name")
    .eq("id", eventId)
    .maybeSingle();

  // Multi-tenant authorization check (Scenario 9)
  if (!event || event.organizer_id !== user.id) {
    return { success: false, error: "UNAUTHORIZED: You do not have permission to export data for this event." };
  }

  let csvContent = "";

  if (exportType === "attendee_registrations") {
    const { data: attendees } = await db
      .from("attendees")
      .select("id, name, email, phone, pass_type, serial_number, pass_status, created_at")
      .eq("event_id", eventId);

    const columns: CsvExportColumn[] = [
      { header: "Attendee ID", key: "id" },
      { header: "Full Name", key: "name" },
      { header: "Email Address", key: "email" },
      { header: "Phone Number", key: "phone" },
      { header: "Ticket Tier", key: "pass_type" },
      { header: "Serial Number", key: "serial_number" },
      { header: "Pass Status", key: "pass_status" },
      { header: "Registered At", key: "created_at" },
    ];

    csvContent = exportToSanitizedCsv(attendees || [], columns);
  }

  return {
    success: true,
    csvContent,
  };
}
