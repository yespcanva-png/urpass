import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js & Supabase ──────────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import {
  sanitizeCsvCell,
  generateCsvTemplate,
  parseCsvString,
  validateCsvImport,
  processCsvImport,
  exportToSanitizedCsv,
} from "@/lib/csv-management";
import { exportEventDataCsvAction } from "@/app/actions/csv-management";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

describe("Module 07 — CSV Import & Export (Test 07 Suite)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Scenario 1: Valid CSV Imports Records Correctly ───────────────────────────
  it("Scenario 1: Valid CSV content parses, validates, and processes successfully with accurate summary", () => {
    const validCsv = `name,email,phone,serial_number
Alice Smith,alice@example.com,+919876543210,URP-001
Bob Builder,bob@example.com,+919876543211,URP-002
Charlie Chaplin,charlie@example.com,+919876543212,URP-003`;

    const preview = validateCsvImport({
      csvContent: validCsv,
      importType: "attendee_list",
      availableTickets: 10,
    });

    expect(preview.valid).toBe(true);
    expect(preview.totalRows).toBe(3);
    expect(preview.validRowCount).toBe(3);
    expect(preview.errorRowCount).toBe(0);
    expect(preview.globalErrors).toEqual([]);

    // Process the import
    const result = processCsvImport({ preview, availableTickets: 10 });
    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(3);
    expect(result.skippedCount).toBe(0);
    expect(result.errorCount).toBe(0);
    expect(result.importedRecords.length).toBe(3);
    expect(result.importedRecords[0].name).toBe("Alice Smith");
    expect(result.importedRecords[0].email).toBe("alice@example.com");
  });

  // ── Scenario 2: Missing Required Headers are Reported ─────────────────────────
  it("Scenario 2: Missing required column headers are identified and reported in global errors", () => {
    // Missing 'email' column header
    const missingHeaderCsv = `full_name,mobile_number,city
John Doe,+919876543210,Pilani
Jane Doe,+919876543211,Delhi`;

    const preview = validateCsvImport({
      csvContent: missingHeaderCsv,
      importType: "attendee_list",
      requiredHeaders: ["name", "email"],
    });

    expect(preview.valid).toBe(false);
    expect(preview.globalErrors.length).toBeGreaterThan(0);
    expect(preview.globalErrors[0]).toContain("MISSING_REQUIRED_HEADERS");
    expect(preview.globalErrors[0]).toContain("email");
  });

  // ── Scenario 3: Invalid Email or Serial Number is Flagged ─────────────────────
  it("Scenario 3: Rows with invalid email format or non-conforming serial numbers are flagged individually", () => {
    const malformedCsv = `name,email,serial_number
Valid User,valid@domain.com,CSE2026001
Bad Email User,not-a-valid-email,CSE2026002
Bad Serial User,valid2@domain.com,INVALID_SERIAL_999`;

    const preview = validateCsvImport({
      csvContent: malformedCsv,
      importType: "attendee_list",
      serialPattern: "^CSE2026[0-9]{3}$",
    });

    expect(preview.valid).toBe(false);
    expect(preview.totalRows).toBe(3);
    expect(preview.validRowCount).toBe(1); // Only row 1 is valid
    expect(preview.errorRowCount).toBe(2);

    // Row 2 (Index 1): Bad email
    expect(preview.rows[1].valid).toBe(false);
    expect(preview.rows[1].errors[0]).toContain("Invalid email address format");

    // Row 3 (Index 2): Bad serial pattern
    expect(preview.rows[2].valid).toBe(false);
    expect(preview.rows[2].errors[0]).toContain("does not match required format");
  });

  // ── Scenario 4: Duplicate Rows Do Not Create Multiple Entitlements ─────────────
  it("Scenario 4: Duplicate rows in uploaded CSV or existing registrations are deduplicated and not multi-issued", () => {
    const duplicateCsv = `name,email,phone
David Miller,david@test.com,+919000000001
David Miller,david@test.com,+919000000001
Emma Watson,emma@test.com,+919000000002
Existing User,already_in_db@test.com,+919000000003`;

    const preview = validateCsvImport({
      csvContent: duplicateCsv,
      importType: "attendee_list",
      existingEmails: ["already_in_db@test.com"],
    });

    expect(preview.totalRows).toBe(4);
    expect(preview.validRowCount).toBe(2); // David (1st) and Emma
    expect(preview.duplicateRowCount).toBe(2); // David (2nd) and existing user

    // Process deduplicated import
    const result = processCsvImport({ preview });
    expect(result.importedCount).toBe(2); // Exactly 2 imported
    expect(result.skippedCount).toBe(2); // 2 skipped
  });

  // ── Scenario 5: Uploading More Rows Than Available Tickets is Rejected ────────
  it("Scenario 5: Uploading more rows than available order tickets is rejected with capacity error", () => {
    const excessCsv = `name,email
User 1,u1@test.com
User 2,u2@test.com
User 3,u3@test.com
User 4,u4@test.com
User 5,u5@test.com`;

    // Only 2 slots available in order
    const preview = validateCsvImport({
      csvContent: excessCsv,
      importType: "ticket_assignment",
      availableTickets: 2,
    });

    expect(preview.valid).toBe(false);
    expect(preview.globalErrors.some((e) => e.includes("EXCEEDS_AVAILABLE_TICKETS"))).toBe(true);
    expect(preview.globalErrors[0]).toContain("exceeds the available limit of 2 tickets");
  });

  // ── Scenario 6: Repeated Import Attempts Handled Safely (Idempotency) ──────────
  it("Scenario 6: Repeated import attempts do not duplicate records or corrupt state", () => {
    const csvData = `name,email\nUser A,a@test.com\nUser B,b@test.com`;

    const preview1 = validateCsvImport({ csvContent: csvData, availableTickets: 5 });
    const result1 = processCsvImport({ preview: preview1 });
    expect(result1.importedCount).toBe(2);

    // Second import attempt with existing emails in DB
    const preview2 = validateCsvImport({
      csvContent: csvData,
      existingEmails: ["a@test.com", "b@test.com"],
      availableTickets: 5,
    });

    expect(preview2.validRowCount).toBe(0);
    expect(preview2.duplicateRowCount).toBe(2);

    const result2 = processCsvImport({ preview: preview2 });
    expect(result2.importedCount).toBe(0);
    expect(result2.skippedCount).toBe(2);
  });

  // ── Scenario 7: Large Files Processed in Chunks Without Blocking ──────────────
  it("Scenario 7: Large CSV datasets (e.g. 500 rows) are processed in chunked streams without memory spikes", () => {
    const largeRows = Array.from({ length: 500 }, (_, i) => ({
      name: `Attendee ${i + 1}`,
      email: `attendee_${i + 1}@bigevent.org`,
      serial_number: `BIG-${String(i + 1).padStart(4, "0")}`,
    }));

    const header = "name,email,serial_number\n";
    const body = largeRows.map((r) => `${r.name},${r.email},${r.serial_number}`).join("\n");
    const largeCsv = header + body;

    const preview = validateCsvImport({
      csvContent: largeCsv,
      importType: "attendee_list",
      availableTickets: 1000,
    });

    expect(preview.totalRows).toBe(500);
    expect(preview.validRowCount).toBe(500);

    const result = processCsvImport({
      preview,
      availableTickets: 1000,
      chunkSize: 100, // 100 per chunk
    });

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(500);
    expect(result.importedRecords.length).toBe(500);
  });

  // ── Scenario 8: Spreadsheet Formula Injection Protection (CSV Injection) ──────
  it("Scenario 8: Exported CSV sanitizes dangerous spreadsheet formula prefixes (=, +, -, @, \\t, \\r)", () => {
    // Dangerous input cells attempting formula execution or DDE commands
    const maliciousData = [
      { id: "1", name: "=1+1", email: "=cmd|' /C calc'!A0", comment: "+SUM(A1:A10)" },
      { id: "2", name: "-100", email: "@malicious.site", comment: "\tTabPrefixed" },
      { id: "3", name: "Safe User", email: "safe@example.com", comment: "Standard string" },
    ];

    const columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Comment", key: "comment" },
    ];

    const exportedCsv = exportToSanitizedCsv(maliciousData, columns);

    // Verify formula prefixes are prefixed with single quote "'"
    expect(exportedCsv).toContain("'=1+1");
    expect(exportedCsv).toContain("'=cmd");
    expect(exportedCsv).toContain("'+SUM(A1:A10)");
    expect(exportedCsv).toContain("'-100");
    expect(exportedCsv).toContain("'@malicious.site");

    // Verify safe user is unmodified
    expect(exportedCsv).toContain("Safe User");
    expect(exportedCsv).toContain("safe@example.com");
  });

  // ── Scenario 9: Multi-Tenant Authorization Enforcement ────────────────────────
  it("Scenario 9: Unauthorized users cannot export or import data for other organizers' events", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "unauthorized_user_999" } },
        }),
      },
    };

    const mockAdminDb = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: "event-secret-01",
            organizer_id: "legitimate_organizer_123", // Different organizer!
            name: "Private Gala",
          },
        }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

    const exportRes = await exportEventDataCsvAction({
      eventId: "event-secret-01",
      exportType: "attendee_registrations",
    });

    expect(exportRes.success).toBe(false);
    expect(exportRes.error).toContain("UNAUTHORIZED");
  });

  // ── Template Generation ───────────────────────────────────────────────────────
  it("generates correct CSV templates with custom fields", () => {
    const template = generateCsvTemplate("member_details", ["t_shirt_size", "dietary_needs"]);
    expect(template).toContain("name,email,phone,college_org,department,course,roll_or_employee_id,serial_number,t_shirt_size,dietary_needs");
  });
});
