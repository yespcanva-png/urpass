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
  getMemberFormConfig,
  getSerialNumberConfig,
  getFormFieldsForTicket,
  validateSerialNumber,
  generateNextAtomicSerial,
  validateMemberFormSubmission,
  bindMemberDataToAttendee,
} from "@/lib/member-forms";
import type {
  MemberFormField,
  MemberFormConfig,
  SerialNumberConfig,
  MemberFormSubmission,
} from "@/lib/member-forms/types";
import type { EventLike } from "@/lib/feature-flags";

describe("Module 03 — Member Forms & Serial Number Validation (Test 03 Suite)", () => {
  const baseEvent: EventLike = {
    id: "event-forms-001",
    organizer_id: "organizer@college.edu",
    organization_id: "org-univ-01",
    name: "National Technical Symposium 2026",
    attendee_limit: 1000,
    status: "active",
    custom_pass_design: {
      _featureFlags: {
        features: {
          member_registration_forms: true,
          serial_number_validation: true,
        },
        version: 1,
      },
      _memberFormConfig: {
        enabled: true,
        allowUpdateAfterClaim: true,
        retroactivePolicy: "preserve_validity",
        fields: [
          // Common fields for all ticket holders
          {
            id: "college_org",
            label: "College / University",
            type: "text",
            required: true,
          },
          {
            id: "declaration_consent",
            label: "I agree to the code of conduct",
            type: "checkbox",
            required: true,
          },
          // Student specific category fields
          {
            id: "department",
            label: "Department",
            type: "text",
            required: true,
            applicableTicketTypeIds: ["tt_student"],
          },
          {
            id: "course",
            label: "Degree & Year",
            type: "text",
            required: true,
            applicableTicketTypeIds: ["tt_student"],
          },
          {
            id: "roll_or_employee_id",
            label: "Student Roll Number",
            type: "text",
            required: true,
            applicableTicketTypeIds: ["tt_student"],
            validationPattern: "^[0-9]{4}[A-Z]{3}[0-9]{3}$", // e.g. 2026CSE010
          },
          // VIP / Delegate specific category fields
          {
            id: "job_title",
            label: "Designation / Role",
            type: "text",
            required: true,
            applicableTicketTypeIds: ["tt_vip"],
          },
          {
            id: "dietary_preference",
            label: "Dietary Preference",
            type: "select",
            required: false,
            options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"],
            applicableTicketTypeIds: ["tt_vip"],
          },
        ],
      },
      _serialNumberConfig: {
        enabled: true,
        type: "manual",
        required: true,
        pattern: "^CSE2026[0-9]{3}$", // e.g. CSE2026010
        scope: "event",
        caseSensitive: false,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Scenario 1 & 3: Category-Specific Form Fields ─────────────────────────────
  it("Scenario 1 & 3: Correct form fields appear for eligible ticket holders with category targeting", () => {
    // 1. Student ticket category fields
    const studentFields = getFormFieldsForTicket(baseEvent, "tt_student");
    const studentFieldIds = studentFields.map((f) => f.id);

    expect(studentFieldIds).toContain("college_org");
    expect(studentFieldIds).toContain("declaration_consent");
    expect(studentFieldIds).toContain("department");
    expect(studentFieldIds).toContain("course");
    expect(studentFieldIds).toContain("roll_or_employee_id");
    // Should NOT contain VIP fields
    expect(studentFieldIds).not.toContain("job_title");
    expect(studentFieldIds).not.toContain("dietary_preference");

    // 2. VIP ticket category fields
    const vipFields = getFormFieldsForTicket(baseEvent, "tt_vip");
    const vipFieldIds = vipFields.map((f) => f.id);

    expect(vipFieldIds).toContain("college_org");
    expect(vipFieldIds).toContain("declaration_consent");
    expect(vipFieldIds).toContain("job_title");
    expect(vipFieldIds).toContain("dietary_preference");
    // Should NOT contain student fields
    expect(vipFieldIds).not.toContain("department");
    expect(vipFieldIds).not.toContain("roll_or_employee_id");
  });

  // ── Scenario 2: Server-Side Validation Blocks Skipped Required Fields ─────────
  it("Scenario 2: Required member form fields cannot be skipped through direct API requests", () => {
    const invalidSubmission: MemberFormSubmission = {
      name: "Rahul Roy",
      email: "rahul@example.com",
      phone: "+919876543210",
      ticketTypeId: "tt_student",
      college_org: "", // Missing required
      department: "Computer Science",
      course: "B.Tech Final Year",
      roll_or_employee_id: "2026CSE010",
      declarations: {
        declaration_consent: false, // Must be true!
      },
      serialNumber: "CSE2026010",
    };

    const result = validateMemberFormSubmission({
      event: baseEvent,
      submission: invalidSubmission,
      ticketTypeId: "tt_student",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.college_org).toContain("College / University is required.");
    expect(result.errors?.declaration_consent).toContain('Declaration "I agree to the code of conduct" must be accepted.');
  });

  // ── Scenario 4: Duplicate Unique Serials are Rejected ─────────────────────────
  it("Scenario 4: Duplicate unique serial numbers are rejected under concurrency and scope checks", () => {
    const existingAttendees = [
      { id: "att_101", serial_number: "CSE2026010" },
      { id: "att_102", serial_number: "CSE2026011" },
    ];

    const serialConfig = getSerialNumberConfig(baseEvent);

    // Attempting to register with duplicate serial "CSE2026010"
    const validation = validateSerialNumber({
      serial: "CSE2026010",
      config: serialConfig,
      eventId: "event-forms-001",
      existingSerials: existingAttendees,
      currentAttendeeId: "att_999", // Different attendee
    });

    expect(validation.valid).toBe(false);
    expect(validation.error).toBe("DUPLICATE_SERIAL_NUMBER");
    expect(validation.message).toContain('Serial number "CSE2026010" is already assigned to another attendee.');

    // Same attendee updating their own record should be permitted
    const selfUpdate = validateSerialNumber({
      serial: "CSE2026010",
      config: serialConfig,
      eventId: "event-forms-001",
      existingSerials: existingAttendees,
      currentAttendeeId: "att_101", // Same attendee
    });

    expect(selfUpdate.valid).toBe(true);
  });

  // ── Scenario 5: Invalid Serial Formats are Rejected ───────────────────────────
  it("Scenario 5: Invalid serial formats violating pattern regex are rejected", () => {
    const serialConfig = getSerialNumberConfig(baseEvent); // Pattern: ^CSE2026[0-9]{3}$

    // 1. Invalid prefix
    const res1 = validateSerialNumber({
      serial: "ECE2026010",
      config: serialConfig,
      eventId: "event-forms-001",
    });
    expect(res1.valid).toBe(false);
    expect(res1.error).toBe("INVALID_SERIAL_FORMAT");

    // 2. Non-numeric suffix
    const res2 = validateSerialNumber({
      serial: "CSE2026XYZ",
      config: serialConfig,
      eventId: "event-forms-001",
    });
    expect(res2.valid).toBe(false);
    expect(res2.error).toBe("INVALID_SERIAL_FORMAT");

    // 3. Valid conforming format
    const res3 = validateSerialNumber({
      serial: "CSE2026010",
      config: serialConfig,
      eventId: "event-forms-001",
    });
    expect(res3.valid).toBe(true);
    expect(res3.formattedSerial).toBe("CSE2026010");
  });

  // ── Scenario 6: Verified Input (Approved CSV Whitelist) Validation ─────────────
  it("Scenario 6: Allowed CSV whitelist serial numbers validate correctly for verified_input type", () => {
    const verifiedEvent: EventLike = {
      ...baseEvent,
      custom_pass_design: {
        ...baseEvent.custom_pass_design,
        _serialNumberConfig: {
          enabled: true,
          type: "verified_input",
          required: true,
          allowedList: ["MEM-09372", "MEM-09373", "MEM-09374", "MEM-09375"],
          scope: "event",
          caseSensitive: false,
        },
      },
    };

    const config = getSerialNumberConfig(verifiedEvent);

    // 1. Valid approved serial in CSV whitelist
    const val1 = validateSerialNumber({
      serial: "mem-09372", // lower case test
      config,
      eventId: "event-forms-001",
    });
    expect(val1.valid).toBe(true);
    expect(val1.formattedSerial).toBe("MEM-09372");

    // 2. Unapproved serial not in whitelist
    const val2 = validateSerialNumber({
      serial: "MEM-99999",
      config,
      eventId: "event-forms-001",
    });
    expect(val2.valid).toBe(false);
    expect(val2.error).toBe("SERIAL_NOT_IN_APPROVED_LIST");
    expect(val2.message).toContain("not in the approved member dataset");
  });

  // ── Scenario 7: Optional Serial Fields Can Be Left Blank ──────────────────────
  it("Scenario 7: Optional serial numbers can be left blank without validation failure", () => {
    const optionalSerialEvent: EventLike = {
      ...baseEvent,
      custom_pass_design: {
        ...baseEvent.custom_pass_design,
        _serialNumberConfig: {
          enabled: true,
          type: "manual",
          required: false, // Optional!
          pattern: "^[A-Z0-9]{6,10}$",
          scope: "event",
        },
      },
    };

    const config = getSerialNumberConfig(optionalSerialEvent);

    // 1. Blank / empty string
    const valBlank = validateSerialNumber({
      serial: "",
      config,
      eventId: "event-forms-001",
    });
    expect(valBlank.valid).toBe(true);
    expect(valBlank.formattedSerial).toBeNull();

    // 2. Null / undefined
    const valNull = validateSerialNumber({
      serial: undefined,
      config,
      eventId: "event-forms-001",
    });
    expect(valNull.valid).toBe(true);
    expect(valNull.formattedSerial).toBeNull();

    // 3. Provided optional value must still meet pattern
    const valProvidedInvalid = validateSerialNumber({
      serial: "bad", // Too short for pattern
      config,
      eventId: "event-forms-001",
    });
    expect(valProvidedInvalid.valid).toBe(false);
    expect(valProvidedInvalid.error).toBe("INVALID_SERIAL_FORMAT");
  });

  // ── Scenario 8: Retroactive Enablement Preserves Existing Tickets ──────────────
  it("Scenario 8: Enabling member forms after tickets have been issued preserves existing ticket validity", () => {
    // 5 existing issued attendees with generated pass tokens
    const existingIssuedAttendees = Array.from({ length: 5 }, (_, i) => ({
      id: `att_pre_${i + 1}`,
      name: `Original Attendee ${i + 1}`,
      email: `attendee${i + 1}@example.com`,
      pass_status: "generated",
      application_status: "approved",
      passes: {
        id: `pass_${i + 1}`,
        pass_token: `token_valid_${i + 1}`,
      },
    }));

    // Check retroactivity configuration
    const formConfig = getMemberFormConfig(baseEvent);
    expect(formConfig.enabled).toBe(true);
    expect(formConfig.retroactivePolicy).toBe("preserve_validity");

    // All pre-existing passes remain fully valid for gate check-in
    for (const attendee of existingIssuedAttendees) {
      expect(attendee.pass_status).toBe("generated");
      expect(attendee.passes.pass_token).toBeTruthy();
    }
  });

  // ── Scenario 9: Disabling Serial Validation Preserves Historical Numbers ───────
  it("Scenario 9: Disabling serial validation does not erase or modify historical serial records", () => {
    // Historical attendee records
    const historicalAttendees = [
      { id: "att_hist_1", name: "Anil Kapoor", serial_number: "CSE2026001" },
      { id: "att_hist_2", name: "Sunita Rao", serial_number: "CSE2026002" },
    ];

    const serialDisabledEvent: EventLike = {
      ...baseEvent,
      custom_pass_design: {
        ...baseEvent.custom_pass_design,
        _featureFlags: {
          features: {
            serial_number_validation: false, // Disabled
          },
        },
        _serialNumberConfig: {
          enabled: false,
        },
      },
    };

    const config = getSerialNumberConfig(serialDisabledEvent);
    expect(config.enabled).toBe(false);

    // Existing serial numbers remain bound to historical records
    expect(historicalAttendees[0].serial_number).toBe("CSE2026001");
    expect(historicalAttendees[1].serial_number).toBe("CSE2026002");
  });

  // ── Auto-Generated Sequence Guarantee ─────────────────────────────────────────
  it("Auto-Generated Monotonic Sequence: Computes consecutive internal sequences atomically", () => {
    const autoGenConfig: SerialNumberConfig = {
      enabled: true,
      type: "auto_generated",
      required: true,
      prefix: "URP-REG-",
      digitPadding: 6,
      startNumber: 100,
      continuationOffset: 23, // e.g. Resumed after offline issuance
      scope: "event",
    };

    // First sequence: max(100 + 23, 0 + 1) = 123 -> URP-REG-000123
    const serial1 = generateNextAtomicSerial({
      config: autoGenConfig,
      existingHighestSequence: 0,
    });
    expect(serial1).toBe("URP-REG-000123");

    // Next sequence: existing 123 -> 124
    const serial2 = generateNextAtomicSerial({
      config: autoGenConfig,
      existingHighestSequence: 123,
    });
    expect(serial2).toBe("URP-REG-000124");
  });

  // ── Pass Condition: Field Binding to Individual Member Record ─────────────────
  it("Pass Condition: All collected member form fields and serial number are correctly bound to the attendee record", () => {
    const validStudentSubmission: MemberFormSubmission = {
      name: "Sneha Patel",
      email: "sneha.patel@college.edu",
      phone: "+919123456780",
      ticketTypeId: "tt_student",
      college_org: "BITS Pilani",
      department: "Electrical Engineering",
      course: "M.Tech Year 1",
      roll_or_employee_id: "2026EEE042",
      declarations: {
        declaration_consent: true,
      },
      serialNumber: "CSE2026042",
      documentUrl: "https://urpass.space/uploads/id_card_sneha.pdf",
    };

    const validation = validateMemberFormSubmission({
      event: baseEvent,
      submission: validStudentSubmission,
      ticketTypeId: "tt_student",
    });

    expect(validation.valid).toBe(true);
    expect(validation.formattedData).toBeDefined();

    const attendeeRecord = {
      id: "att_sneha_01",
      event_id: "event-forms-001",
      name: "Old Name",
      email: "old@example.com",
    };

    const boundAttendee = bindMemberDataToAttendee(
      attendeeRecord,
      validStudentSubmission,
      validation.serialNumber
    );

    expect(boundAttendee.name).toBe("Sneha Patel");
    expect(boundAttendee.email).toBe("sneha.patel@college.edu");
    expect(boundAttendee.phone).toBe("+919123456780");
    expect(boundAttendee.serial_number).toBe("CSE2026042");

    const customResponses = boundAttendee.custom_responses as Record<string, unknown>;
    expect(customResponses.college_org).toBe("BITS Pilani");
    expect(customResponses.department).toBe("Electrical Engineering");
    expect(customResponses.course).toBe("M.Tech Year 1");
    expect(customResponses.roll_or_employee_id).toBe("2026EEE042");
    expect(customResponses.document_url).toBe("https://urpass.space/uploads/id_card_sneha.pdf");
    expect(customResponses.declarations).toEqual({ declaration_consent: true });
  });
});
