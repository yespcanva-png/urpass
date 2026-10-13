import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { attendeeSchema, PASS_TYPES } from "@/lib/validations/attendee";

export type ImportColumn =
  | "ignore"
  | "name"
  | "email"
  | "phone"
  | "pass_type"
  | "ticket_type"
  | "payment_status";

export type ColumnMapping = Record<string, ImportColumn>;

export interface RawImportRow {
  rowNumber: number;
  values: Record<string, string>;
}

export interface ValidatedImportRow {
  rowNumber: number;
  name: string;
  email: string;
  phone: string | null;
  passType: string;
  ticketTypeName: string | null;
  ticketTypeId: string | null;
  paymentStatus: string | null;
  customResponses: Record<string, string>;
  errors: string[];
  duplicateReason?: "within_file" | "existing_event";
}

export interface ImportValidationResult {
  headers: string[];
  rows: ValidatedImportRow[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    potentiallyBillable: number;
  };
}

export interface TicketTypeLookup {
  id: string;
  name: string;
  price: number;
  capacity: number | null;
  status: string;
}

const emailSchema = z.string().email();

export function parseCSVText(text: string): { headers: string[]; rows: RawImportRow[] } {
  const clean = text.replace(/^\uFEFF/, "");
  const records: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuote = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const next = clean[i + 1];

    if (ch === '"' && inQuote && next === '"') {
      cell += '"';
      i++;
      continue;
    }

    if (ch === '"') {
      inQuote = !inQuote;
      continue;
    }

    if (ch === "," && !inQuote) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuote) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell.trim());
      cell = "";
      if (row.some((v) => v.length > 0)) records.push(row);
      row = [];
      continue;
    }

    cell += ch;
  }

  row.push(cell.trim());
  if (row.some((v) => v.length > 0)) records.push(row);

  if (records.length === 0) return { headers: [], rows: [] };
  const headers = dedupeHeaders(records[0].map((h) => normalizeHeaderLabel(h)));
  const rows = records.slice(1).map((cols, idx) => ({
    rowNumber: idx + 2,
    values: Object.fromEntries(headers.map((h, i) => [h, cols[i]?.trim() ?? ""])),
  }));
  return { headers, rows };
}

export function inferColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  for (const header of headers) {
    const key = header.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    if (["name", "full_name", "attendee_name", "student_name", "participant_name"].includes(key)) {
      mapping[header] = "name";
    } else if (["email", "email_address", "attendee_email", "mail"].includes(key)) {
      mapping[header] = "email";
    } else if (["phone", "mobile", "mobile_number", "phone_number", "contact", "contact_number"].includes(key)) {
      mapping[header] = "phone";
    } else if (["pass_type", "pass", "role", "attendee_type"].includes(key)) {
      mapping[header] = "pass_type";
    } else if (["ticket_type", "ticket", "ticket_tier", "category", "tier"].includes(key)) {
      mapping[header] = "ticket_type";
    } else if (["payment_status", "payment", "paid_status"].includes(key)) {
      mapping[header] = "payment_status";
    } else {
      mapping[header] = "ignore";
    }
  }
  return mapping;
}

export async function getImportContext(
  db: SupabaseClient,
  eventId: string
): Promise<{
  existingEmails: Set<string>;
  ticketTypes: TicketTypeLookup[];
}> {
  const [{ data: attendees }, { data: ticketTypes }] = await Promise.all([
    db.from("attendees").select("email").eq("event_id", eventId),
    db.from("ticket_types").select("id, name, price, capacity, status").eq("event_id", eventId),
  ]);

  return {
    existingEmails: new Set((attendees ?? []).map((a: any) => String(a.email || "").toLowerCase().trim()).filter(Boolean)),
    ticketTypes: (ticketTypes ?? []) as TicketTypeLookup[],
  };
}

export function validateImportRows({
  headers,
  rows,
  mapping,
  existingEmails,
  ticketTypes,
}: {
  headers: string[];
  rows: RawImportRow[];
  mapping: ColumnMapping;
  existingEmails: Set<string>;
  ticketTypes: TicketTypeLookup[];
}): ImportValidationResult {
  const seen = new Set<string>();
  const ticketByName = new Map(ticketTypes.map((t) => [normalizeComparable(t.name), t]));

  const validated = rows.map((row) => {
    const errors: string[] = [];
    const mapped: Record<Exclude<ImportColumn, "ignore">, string> = {
      name: "",
      email: "",
      phone: "",
      pass_type: "",
      ticket_type: "",
      payment_status: "",
    };
    const customResponses: Record<string, string> = {};

    for (const header of headers) {
      const target = mapping[header] || "ignore";
      const value = row.values[header] ?? "";
      if (target === "ignore") {
        if (value) customResponses[header] = value;
      } else {
        mapped[target] = value;
      }
    }

    const name = mapped.name.trim();
    const email = mapped.email.toLowerCase().trim();
    const passTypeCandidate = mapped.pass_type.toLowerCase().trim() || "participant";
    const passType = PASS_TYPES.includes(passTypeCandidate as any) ? passTypeCandidate : "participant";
    let ticketTypeId: string | null = null;
    const ticketTypeName = mapped.ticket_type.trim() || null;
    const paymentStatus = mapped.payment_status.trim() || null;

    const parsed = attendeeSchema.safeParse({
      name,
      email,
      phone: mapped.phone.trim() || undefined,
      pass_type: passType,
    });
    if (!parsed.success) {
      errors.push(parsed.error.issues[0]?.message || "Invalid attendee details.");
    }

    if (!emailSchema.safeParse(email).success) errors.push("Invalid email address.");
    if (!name || name.length < 2) errors.push("Missing attendee name.");

    if (seen.has(email)) {
      errors.push("Duplicate email within import file.");
    }
    let duplicateReason: ValidatedImportRow["duplicateReason"];
    if (email) {
      if (seen.has(email)) duplicateReason = "within_file";
      if (existingEmails.has(email)) {
        errors.push("Attendee already exists in this event.");
        duplicateReason = "existing_event";
      }
      seen.add(email);
    }

    if (ticketTypeName) {
      const ticket = ticketByName.get(normalizeComparable(ticketTypeName));
      if (!ticket) {
        errors.push(`Ticket type "${ticketTypeName}" was not found.`);
      } else if (ticket.status !== "on_sale") {
        errors.push(`Ticket type "${ticket.name}" is not on sale.`);
        ticketTypeId = ticket.id;
      } else {
        ticketTypeId = ticket.id;
        if (ticket.price > 0 && (paymentStatus || "").toLowerCase() !== "paid") {
          errors.push(`Ticket type "${ticket.name}" is paid. Import requires verified paid status outside bulk import.`);
        }
      }
    }

    return {
      rowNumber: row.rowNumber,
      name,
      email,
      phone: mapped.phone.trim() || null,
      passType,
      ticketTypeName,
      ticketTypeId,
      paymentStatus,
      customResponses,
      errors: Array.from(new Set(errors)),
      duplicateReason,
    };
  });

  const invalid = validated.filter((r) => r.errors.length > 0).length;
  const duplicates = validated.filter((r) => r.duplicateReason).length;
  const potentiallyBillable = validated.filter((r) => {
    const ticket = r.ticketTypeId ? ticketTypes.find((t) => t.id === r.ticketTypeId) : null;
    return ticket ? ticket.price > 0 : false;
  }).length;

  return {
    headers,
    rows: validated,
    summary: {
      total: validated.length,
      valid: validated.length - invalid,
      invalid,
      duplicates,
      potentiallyBillable,
    },
  };
}

export function buildErrorCsv(rows: ValidatedImportRow[]): string {
  const failed = rows.filter((r) => r.errors.length > 0);
  const headers = ["row_number", "name", "email", "phone", "ticket_type", "errors"];
  return [
    headers.join(","),
    ...failed.map((r) =>
      [
        r.rowNumber,
        r.name,
        r.email,
        r.phone || "",
        r.ticketTypeName || "",
        r.errors.join("; "),
      ].map(csvCell).join(",")
    ),
  ].join("\n");
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function normalizeHeaderLabel(value: string) {
  return String(value || "").replace(/^\uFEFF/, "").trim() || "Column";
}

function dedupeHeaders(headers: string[]) {
  const seen = new Map<string, number>();
  return headers.map((header) => {
    const count = seen.get(header) ?? 0;
    seen.set(header, count + 1);
    return count === 0 ? header : `${header} ${count + 1}`;
  });
}

function normalizeComparable(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}
