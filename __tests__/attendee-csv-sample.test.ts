import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { parseCSVText, inferColumnMapping, validateImportRows } from "../lib/attendee-import";

describe("Sample CSV 5-User Import & 1-QR Function", () => {
  it("successfully parses the sample CSV and maps all 5 rows with 0 errors", () => {
    const csvPath = path.join(process.cwd(), "public", "sample-attendees-5.csv");
    const rawCsv = fs.readFileSync(csvPath, "utf-8");

    const parsed = parseCSVText(rawCsv);
    expect(parsed.headers).toEqual(["name", "email", "phone", "pass_type", "ticket_type"]);
    expect(parsed.rows.length).toBe(5);

    const mapping = inferColumnMapping(parsed.headers);
    expect(mapping).toEqual({
      name: "name",
      email: "email",
      phone: "phone",
      pass_type: "pass_type",
      ticket_type: "ticket_type",
    });

    const validation = validateImportRows({
      headers: parsed.headers,
      rows: parsed.rows,
      mapping,
      existingEmails: new Set(),
      ticketTypes: [
        { id: "tt-1", name: "General Admission", price: 0, capacity: 500, status: "active" },
        { id: "tt-2", name: "VIP Access", price: 999, capacity: 100, status: "active" },
        { id: "tt-3", name: "Speaker Pass", price: 0, capacity: 50, status: "active" },
        { id: "tt-4", name: "Organizer Pass", price: 0, capacity: 20, status: "active" },
      ],
    });

    expect(validation.summary.total).toBe(5);
    expect(validation.summary.valid).toBe(5);
    expect(validation.summary.invalid).toBe(0);
    expect(validation.summary.duplicates).toBe(0);
    expect(validation.rows.every((r) => r.errors.length === 0)).toBe(true);
  });
});
