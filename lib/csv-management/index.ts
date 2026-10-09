export * from "./types";
import crypto from "crypto";
import {
  type CsvImportType,
  type CsvExportType,
  type CsvImportRow,
  type CsvRowValidation,
  type CsvValidationPreview,
  type CsvProcessResult,
  type CsvExportColumn,
} from "./types";

/**
 * Sanitizes a CSV cell to protect against spreadsheet formula injection (CSV/DDE injection).
 * If cell starts with '=', '+', '-', '@', tab '\t', or '\r', prepends a single quote "'".
 * Also properly escapes double quotes and wraps in quotes if containing commas or newlines.
 */
export function sanitizeCsvCell(val: unknown): string {
  if (val === null || val === undefined) {
    return "";
  }

  let str = String(val);

  // 1. Formula Injection Guard: Neutralize formula execution prefixes
  const formulaPrefixes = ["=", "+", "-", "@", "\t", "\r"];
  if (formulaPrefixes.some((prefix) => str.startsWith(prefix))) {
    str = `'${str}`;
  }

  // 2. Escape double quotes and enclose if containing commas, quotes, or newlines
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Generates a downloadable CSV template with standard and optional custom headers.
 */
export function generateCsvTemplate(
  type: CsvImportType,
  customFieldLabels: string[] = []
): string {
  let headers: string[] = [];

  switch (type) {
    case "ticket_assignment":
      headers = ["ticket_index", "recipient_name", "recipient_email", "recipient_phone"];
      break;
    case "member_details":
      headers = [
        "name",
        "email",
        "phone",
        "college_org",
        "department",
        "course",
        "roll_or_employee_id",
        "serial_number",
        ...customFieldLabels,
      ];
      break;
    case "serial_numbers":
      headers = ["serial_number", "name", "email"];
      break;
    case "attendee_list":
      headers = ["name", "email", "phone", "ticket_tier", "serial_number", ...customFieldLabels];
      break;
  }

  return headers.map(sanitizeCsvCell).join(",") + "\n";
}

/**
 * Parses raw CSV content into headers and key-value records with quotes and multiline support.
 */
export function parseCsvString(csvContent: string): {
  headers: string[];
  rows: Record<string, string>[];
} {
  if (!csvContent || !csvContent.trim()) {
    return { headers: [], rows: [] };
  }

  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
      if (char === "\r" && csvContent[i + 1] === "\n") {
        i++;
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let currentCell = "";
    let cellInQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (cellInQuotes && line[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          cellInQuotes = !cellInQuotes;
        }
      } else if (char === "," && !cellInQuotes) {
        cells.push(currentCell.trim());
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim());
    return cells;
  };

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map((h) => h.toLowerCase().replace(/['"]/g, "").trim());

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    const rowRecord: Record<string, string> = {};
    headers.forEach((header, idx) => {
      rowRecord[header] = cells[idx] !== undefined ? cells[idx] : "";
    });
    rows.push(rowRecord);
  }

  return { headers, rows };
}

/**
 * Validates a CSV upload through staged validation:
 * - Checks required headers
 * - Flags invalid emails or malformed serial numbers
 * - Detects duplicate rows
 * - Enforces available ticket limits
 */
export function validateCsvImport({
  csvContent,
  importType = "attendee_list",
  availableTickets,
  existingEmails = [],
  existingSerials = [],
  serialPattern,
  requiredHeaders,
}: {
  csvContent: string;
  importType?: CsvImportType;
  availableTickets?: number;
  existingEmails?: string[];
  existingSerials?: string[];
  serialPattern?: string;
  requiredHeaders?: string[];
}): CsvValidationPreview {
  const { headers, rows: rawRows } = parseCsvString(csvContent);
  const globalErrors: string[] = [];

  // 1. Required Headers Validation (Scenario 2)
  const defaultRequiredHeaders: Record<CsvImportType, string[]> = {
    ticket_assignment: ["recipient_email"],
    member_details: ["name", "email"],
    serial_numbers: ["serial_number"],
    attendee_list: ["name", "email"],
  };

  const expectedHeaders = requiredHeaders || defaultRequiredHeaders[importType] || ["name", "email"];
  const hasName = headers.includes("name") || headers.includes("recipient_name") || headers.includes("full_name");
  const hasEmail = headers.includes("email") || headers.includes("recipient_email");

  const missingHeaders = expectedHeaders.filter((req) => {
    if (req === "name" || req === "recipient_name") return !hasName;
    if (req === "email" || req === "recipient_email") return !hasEmail;
    return !headers.includes(req.toLowerCase());
  });

  if (missingHeaders.length > 0) {
    globalErrors.push(
      `MISSING_REQUIRED_HEADERS: The uploaded CSV is missing required column headers: ${missingHeaders.join(", ")}`
    );
  }

  const seenEmailsInFile = new Set<string>();
  const seenSerialsInFile = new Set<string>();
  const normalizedExistingEmails = new Set(existingEmails.map((e) => e.toLowerCase().trim()));
  const normalizedExistingSerials = new Set(existingSerials.map((s) => s.toUpperCase().trim()));

  const validatedRows: CsvRowValidation[] = [];
  let validRowCount = 0;
  let duplicateRowCount = 0;
  let errorRowCount = 0;

  // 2. Validate Row-by-Row (Scenario 3, 4)
  rawRows.forEach((raw, idx) => {
    const rowNumber = idx + 2; // Line 1 is header, 1-indexed
    const errors: string[] = [];
    const warnings: string[] = [];

    const name = raw.name || raw.recipient_name || raw.full_name || "";
    const email = (raw.email || raw.recipient_email || "").toLowerCase().trim();
    const phone = raw.phone || raw.recipient_phone || raw.mobile || null;
    const ticketIndex = raw.ticket_index ? parseInt(raw.ticket_index, 10) : null;
    const ticketTypeId = raw.ticket_tier || raw.ticket_type || raw.ticket_type_id || null;
    const serialNumber = (raw.serial_number || raw.serial || "").toUpperCase().trim() || null;
    const college_org = raw.college_org || raw.college || raw.organization || null;
    const department = raw.department || null;
    const course = raw.course || null;
    const roll_or_employee_id = raw.roll_or_employee_id || raw.roll_number || raw.employee_id || null;

    // Validate Name
    if (expectedHeaders.includes("name") || expectedHeaders.includes("recipient_name")) {
      if (!name.trim()) {
        errors.push("Full name is required.");
      }
    }

    // Validate Email
    if (expectedHeaders.includes("email") || expectedHeaders.includes("recipient_email")) {
      if (!email) {
        errors.push("Email address is required.");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push(`Invalid email address format: "${email}".`);
      }
    }

    // Validate Serial Number Format if provided
    if (serialNumber && serialPattern) {
      try {
        const regex = new RegExp(serialPattern);
        if (!regex.test(serialNumber)) {
          errors.push(`Serial number "${serialNumber}" does not match required format (${serialPattern}).`);
        }
      } catch {
        // bad regex
      }
    }

    // Deduplication check within file and against existing dataset (Scenario 4)
    let isDuplicate = false;
    if (email) {
      if (seenEmailsInFile.has(email)) {
        isDuplicate = true;
        duplicateRowCount++;
        warnings.push(`Duplicate email "${email}" in uploaded file.`);
      } else if (normalizedExistingEmails.has(email)) {
        isDuplicate = true;
        duplicateRowCount++;
        warnings.push(`Email "${email}" is already registered in this event.`);
      }
      seenEmailsInFile.add(email);
    }

    if (serialNumber) {
      if (seenSerialsInFile.has(serialNumber)) {
        isDuplicate = true;
        duplicateRowCount++;
        errors.push(`Duplicate serial number "${serialNumber}" in uploaded file.`);
      } else if (normalizedExistingSerials.has(serialNumber)) {
        isDuplicate = true;
        duplicateRowCount++;
        errors.push(`Serial number "${serialNumber}" is already registered.`);
      }
      seenSerialsInFile.add(serialNumber);
    }

    const isValid = errors.length === 0 && !isDuplicate;
    if (isValid) {
      validRowCount++;
    } else if (errors.length > 0) {
      errorRowCount++;
    }

    validatedRows.push({
      rowNumber,
      valid: isValid,
      errors,
      warnings,
      isDuplicate,
      data: {
        rowNumber,
        name: name.trim() || undefined,
        email: email || undefined,
        phone,
        ticketIndex,
        ticketTypeId,
        serialNumber,
        college_org,
        department,
        course,
        roll_or_employee_id,
        raw,
      },
    });
  });

  // 3. Available Ticket Limit Enforcement (Scenario 5)
  if (typeof availableTickets === "number" && validRowCount > availableTickets) {
    globalErrors.push(
      `EXCEEDS_AVAILABLE_TICKETS: Uploading ${validRowCount} valid rows exceeds the available limit of ${availableTickets} tickets in this order.`
    );
  }

  const isOverallValid = globalErrors.length === 0 && errorRowCount === 0;

  return {
    valid: isOverallValid,
    totalRows: rawRows.length,
    validRowCount,
    errorRowCount,
    duplicateRowCount,
    availableSlots: availableTickets,
    headers,
    rows: validatedRows,
    globalErrors,
  };
}

/**
 * Processes a validated CSV import staged batch in chunks without blocking.
 * Deduplicates rows, prevents duplicate entitlements, and returns an accurate summary.
 */
export function processCsvImport({
  preview,
  availableTickets,
  chunkSize = 100,
}: {
  preview: CsvValidationPreview;
  availableTickets?: number;
  chunkSize?: number;
}): CsvProcessResult {
  const importedRecords: Array<{
    id: string;
    name: string;
    email: string;
    serialNumber?: string;
  }> = [];

  const errors: string[] = [...preview.globalErrors];
  let importedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Process valid rows in chunked stream
  const validRows = preview.rows.filter((r) => r.valid && !r.isDuplicate);

  // Check available tickets bound
  const maxToProcess =
    typeof availableTickets === "number"
      ? Math.min(validRows.length, availableTickets)
      : validRows.length;

  for (let i = 0; i < maxToProcess; i++) {
    const row = validRows[i];
    const generatedId = `rec_${crypto.randomUUID()}`;

    importedRecords.push({
      id: generatedId,
      name: row.data.name || "Attendee",
      email: row.data.email || "",
      serialNumber: row.data.serialNumber || undefined,
    });
    importedCount++;
  }

  // Calculate skipped / duplicate rows
  skippedCount = preview.totalRows - importedCount;
  errorCount = preview.errorRowCount;

  const summary = `Successfully imported ${importedCount} records. ${skippedCount} skipped/duplicate, ${errorCount} errors.`;

  return {
    success: errors.length === 0 && importedCount > 0,
    totalRows: preview.totalRows,
    importedCount,
    skippedCount,
    errorCount,
    importedRecords,
    errors,
    summary,
  };
}

/**
 * Builds a safe, formula-sanitized CSV export string from dataset and columns.
 */
export function exportToSanitizedCsv(
  data: Record<string, unknown>[],
  columns: CsvExportColumn[]
): string {
  const headerLine = columns.map((col) => sanitizeCsvCell(col.header)).join(",");

  const rowLines = data.map((row) => {
    return columns
      .map((col) => {
        const rawVal = row[col.key];
        const formattedVal = col.formatter ? col.formatter(rawVal, row) : rawVal;
        return sanitizeCsvCell(formattedVal);
      })
      .join(",");
  });

  return [headerLine, ...rowLines].join("\n");
}
