import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { parseCSVText, inferColumnMapping, validateImportRows } from "../lib/attendee-import";

describe("Single QR Multi-Entry CSV Import (5 entries on one, 10 on another, random)", () => {
  it("successfully parses the sample CSV and extracts variable entry counts per single QR pass", () => {
    const csvPath = path.join(process.cwd(), "public", "sample-single-qr-entries.csv");
    const rawCsv = fs.readFileSync(csvPath, "utf-8");

    const parsed = parseCSVText(rawCsv);
    expect(parsed.headers).toEqual(["name", "email", "phone", "pass_type", "ticket_type", "entries"]);
    expect(parsed.rows.length).toBe(5);

    const mapping = inferColumnMapping(parsed.headers);
    expect(mapping).toEqual({
      name: "name",
      email: "email",
      phone: "phone",
      pass_type: "pass_type",
      ticket_type: "ticket_type",
      entries: "entries",
    });

    const validation = validateImportRows({
      headers: parsed.headers,
      rows: parsed.rows,
      mapping,
      existingEmails: new Set(),
      ticketTypes: [
        { id: "tt-1", name: "Corporate Group", price: 0, capacity: 500, status: "active" },
        { id: "tt-2", name: "VIP Delegation", price: 999, capacity: 100, status: "active" },
        { id: "tt-3", name: "Speaker Group", price: 0, capacity: 50, status: "active" },
        { id: "tt-4", name: "Academic Group", price: 0, capacity: 50, status: "active" },
      ],
    });

    expect(validation.summary.total).toBe(5);
    expect(validation.summary.valid).toBe(5);
    expect(validation.summary.invalid).toBe(0);
    expect(validation.summary.duplicates).toBe(0);

    // Row 1: 5 entries
    expect(validation.rows[0].entries).toBe(5);
    expect(validation.rows[0].customResponses.is_single_group_qr).toBe("true");
    expect(validation.rows[0].customResponses.group_attendee_count).toBe("5");

    // Row 2: 10 entries
    expect(validation.rows[1].entries).toBe(10);
    expect(validation.rows[1].customResponses.is_single_group_qr).toBe("true");
    expect(validation.rows[1].customResponses.group_attendee_count).toBe("10");

    // Row 3: 3 entries
    expect(validation.rows[2].entries).toBe(3);
    expect(validation.rows[2].customResponses.is_single_group_qr).toBe("true");
    expect(validation.rows[2].customResponses.group_attendee_count).toBe("3");

    // Row 4: 8 entries
    expect(validation.rows[3].entries).toBe(8);
    expect(validation.rows[3].customResponses.is_single_group_qr).toBe("true");
    expect(validation.rows[3].customResponses.group_attendee_count).toBe("8");

    // Row 5: 12 entries
    expect(validation.rows[4].entries).toBe(12);
    expect(validation.rows[4].customResponses.is_single_group_qr).toBe("true");
    expect(validation.rows[4].customResponses.group_attendee_count).toBe("12");
  });

  it("automatically generates valid @guest.urpass.space emails when rows have no email", () => {
    const csvWithoutEmails = `name,phone,ticket_type
Ramesh Kumar,+919876543210,General
Pooja Hegde,,VIP
Deepak Sharma,+919876543210,General`;

    const parsed = parseCSVText(csvWithoutEmails);
    const mapping = inferColumnMapping(parsed.headers);

    const validation = validateImportRows({
      headers: parsed.headers,
      rows: parsed.rows,
      mapping,
      existingEmails: new Set(),
      ticketTypes: [],
    });

    expect(validation.summary.total).toBe(3);
    expect(validation.summary.valid).toBe(3);
    expect(validation.summary.invalid).toBe(0);

    // Row 1: has phone -> phone-based guest email
    expect(validation.rows[0].email).toBe("919876543210@guest.urpass.space");
    expect(validation.rows[0].isGeneratedEmail).toBe(true);
    expect(validation.rows[0].errors).toEqual([]);

    // Row 2: no phone -> name-based guest email with row number
    expect(validation.rows[1].email).toBe("pooja.hegde.3@guest.urpass.space");
    expect(validation.rows[1].isGeneratedEmail).toBe(true);
    expect(validation.rows[1].errors).toEqual([]);

    // Row 3: same phone as row 1 -> disambiguated with row number
    expect(validation.rows[2].email).toBe("919876543210.4@guest.urpass.space");
    expect(validation.rows[2].isGeneratedEmail).toBe(true);
    expect(validation.rows[2].errors).toEqual([]);
  });
});
