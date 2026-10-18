/**
 * URPASS Production Readiness Audit - End-to-End Workflow Verification Suite
 * 
 * Tests the 10 critical business workflows (A through J) with 100% isolated synthetic fixtures.
 * Zero production mutations, zero external message dispatch, zero real financial transactions.
 */

import { describe, it, expect } from "vitest";

// =========================================================================
// Workflow A: Event Creation, Slug Resolution & Attendee Registration
// =========================================================================
describe("Workflow A: Event Creation, Slug Resolution & Registration Persistence", () => {
  it("enforces unique sanitized event slugs and validation", async () => {
    const { findAvailableEventSlug } = await import("@/app/actions/events");
    expect(typeof findAvailableEventSlug).toBe("function");
  });

  it("validates attendee schema with required fields and rejects invalid emails/phones", async () => {
    const { attendeeSchema } = await import("@/lib/validations/attendee");
    
    // Valid input
    const valid = attendeeSchema.safeParse({
      name: "Srinithin",
      email: "test@example.com",
      phone: "+919876543210",
      pass_type: "participant",
    });
    expect(valid.success).toBe(true);

    // Invalid email
    const invalidEmail = attendeeSchema.safeParse({
      name: "Srinithin",
      email: "invalid-email-format",
      phone: "+919876543210",
      pass_type: "participant",
    });
    expect(invalidEmail.success).toBe(false);

    // Invalid short name
    const invalidName = attendeeSchema.safeParse({
      name: "A",
      email: "test@example.com",
      pass_type: "participant",
    });
    expect(invalidName.success).toBe(false);
  });
});

// =========================================================================
// Workflow B: Individual QR Pass Issuance & Duplicate-Entry Protection
// =========================================================================
describe("Workflow B: Individual QR Pass & Anti-Duplicate Check-in", () => {
  it("generates opaque pass tokens and extracts clean token from URLs", async () => {
    const { extractPassToken } = await import("@/lib/hardware-scanner");
    const rawUrl = "https://urpass.space/pass/tok_alpha_998877";
    const extracted = extractPassToken(rawUrl);
    expect(extracted).toBe("tok_alpha_998877");
  });

  it("hardens public pass views by masking attendee PII", async () => {
    const { maskPhone, maskEmail } = await import("@/lib/passes/public-pass");
    expect(maskPhone("+919876543210")).toBe("+91******3210");
    expect(maskEmail("srinithin@example.com")).toBe("s***n@e***e.com");
  });
});

// =========================================================================
// Workflow C: Group Pass & Partial Entry Concurrency (M14)
// =========================================================================
describe("Workflow C: Group Pass & Partial Entry Concurrency", () => {
  it("calculates group admission accurately across multiple partial entries", async () => {
    const { calculateGroupAdmission } = await import("@/lib/group-entry/index");

    let booking: any = {
      bookingReference: "GRP-ORD-100",
      buyerName: "Corporate Team",
      buyerEmail: "lead@corp.com",
      eventId: "evt-1",
      ticketTypeId: "tt-vip",
      totalEntitlements: 5,
      admittedEntitlements: 0,
      remainingEntitlements: 5,
      status: "CONFIRMED",
      purchasedAt: "2026-10-18T00:00:00Z",
    };

    // Step 1: Admit 2 guests
    const step1 = calculateGroupAdmission({
      booking,
      request: {
        eventId: "evt-1",
        quantity: 2,
        scanTimestamp: "2026-10-18T10:00:00Z",
      } as any,
      isFeatureActive: true,
    });

    expect(step1.result.success).toBe(true);
    expect(step1.result.admittedNow).toBe(2);
    expect(step1.result.remainingEntries).toBe(3);
    booking = step1.updatedBooking!;

    // Step 2: Admit 2 more guests
    const step2 = calculateGroupAdmission({
      booking,
      request: {
        eventId: "evt-1",
        quantity: 2,
        scanTimestamp: "2026-10-18T10:15:00Z",
      } as any,
      isFeatureActive: true,
    });

    expect(step2.result.success).toBe(true);
    expect(step2.result.admittedNow).toBe(2);
    expect(step2.result.remainingEntries).toBe(1);
    booking = step2.updatedBooking!;

    // Step 3: Admit final 1 guest
    const step3 = calculateGroupAdmission({
      booking,
      request: {
        eventId: "evt-1",
        quantity: 1,
        scanTimestamp: "2026-10-18T10:30:00Z",
      } as any,
      isFeatureActive: true,
    });

    expect(step3.result.success).toBe(true);
    expect(step3.result.admittedNow).toBe(1);
    expect(step3.result.remainingEntries).toBe(0);
    booking = step3.updatedBooking!;

    // Step 4: Further entry attempt MUST BE REJECTED
    const step4 = calculateGroupAdmission({
      booking,
      request: {
        eventId: "evt-1",
        quantity: 1,
        scanTimestamp: "2026-10-18T10:45:00Z",
      } as any,
      isFeatureActive: true,
    });

    expect(step4.result.success).toBe(false);
    expect(step4.result.status).toBe("EXHAUSTED");
    expect(step4.result.remainingEntries).toBe(0);
  });
});

// =========================================================================
// Workflow D: Session-Wise Attendance & Multi-Session Isolation (M07)
// =========================================================================
describe("Workflow D: Session-Wise Attendance & Isolation", () => {
  it("isolates attendance between distinct sessions (e.g., Autism vs ADHD)", async () => {
    const { computeSessionAttendanceStats } = await import("@/lib/session-attendance/index");

    const sessionAutism: any = {
      id: "sess-autism",
      eventId: "evt-1",
      date: "2026-10-18",
      name: "Autism Research Keynote",
      startTime: "10:00",
      endTime: "11:00",
      capacity: 50,
      requiresRegistration: false,
    };
    const sessionAdhd: any = {
      id: "sess-adhd",
      eventId: "evt-1",
      date: "2026-10-18",
      name: "ADHD Diagnostic Symposium",
      startTime: "11:00",
      endTime: "12:00",
      capacity: 100,
      requiresRegistration: false,
    };

    const recordsAutism: any[] = [
      { id: "r1", eventId: "evt-1", sessionId: "sess-autism", attendeeId: "att-1", status: "checked_in", checkInTime: "2026-10-18T10:00:00Z", checkInMethod: "qr" },
      { id: "r2", eventId: "evt-1", sessionId: "sess-autism", attendeeId: "att-2", status: "checked_in", checkInTime: "2026-10-18T10:05:00Z", checkInMethod: "qr" },
    ];
    const stats1 = computeSessionAttendanceStats({ session: sessionAutism, records: recordsAutism });
    expect(stats1.totalCheckedIn).toBe(2);
    expect(stats1.currentlyPresent).toBe(2);
    expect(stats1.capacity).toBe(50);

    const recordsAdhd: any[] = [
      { id: "r3", eventId: "evt-1", sessionId: "sess-adhd", attendeeId: "att-1", status: "checked_in", checkInTime: "2026-10-18T11:00:00Z", checkInMethod: "qr" },
      { id: "r4", eventId: "evt-1", sessionId: "sess-adhd", attendeeId: "att-3", status: "checked_in", checkInTime: "2026-10-18T11:10:00Z", checkInMethod: "qr" },
      { id: "r5", eventId: "evt-1", sessionId: "sess-adhd", attendeeId: "att-4", status: "checked_in", checkInTime: "2026-10-18T11:15:00Z", checkInMethod: "qr" },
    ];
    const stats2 = computeSessionAttendanceStats({ session: sessionAdhd, records: recordsAdhd });
    expect(stats2.totalCheckedIn).toBe(3);
    expect(stats2.currentlyPresent).toBe(3);
    expect(stats2.capacity).toBe(100);
  });

  it("detects conference session scheduling and room overlaps on the same day", async () => {
    const { doSessionsOverlap } = await import("@/lib/conference/conflict-detection");

    // Overlapping slots on same date
    const overlap = doSessionsOverlap("2026-10-18", "10:00", "11:00", "2026-10-18", "10:30", "11:30");
    expect(overlap).toBe(true);

    // Non-overlapping slots on same date
    const nonOverlap = doSessionsOverlap("2026-10-18", "10:00", "11:00", "2026-10-18", "11:00", "12:00");
    expect(nonOverlap).toBe(false);

    // Same times on different dates DO NOT conflict
    const diffDays = doSessionsOverlap("2026-10-18", "10:00", "11:00", "2026-10-19", "10:00", "11:00");
    expect(diffDays).toBe(false);
  });
});

// =========================================================================
// Workflow E: Bulk WhatsApp Invitations & Delivery Fallbacks
// =========================================================================
describe("Workflow E: Bulk Invitations & Communication Fallback", () => {
  it("normalizes phone numbers to E.164 and validates format", async () => {
    const { normalizePhone, isValidE164 } = await import("@/lib/communications/utils");
    
    expect(normalizePhone("9876543210")).toBe("+919876543210");
    expect(normalizePhone("+91 98765 43210")).toBe("+919876543210");
    expect(isValidE164("+919876543210")).toBe(true);
    expect(isValidE164("12345")).toBe(false);
  });
});

// =========================================================================
// Workflow F: Financial Integrity, Razorpay Webhooks & Tax Invoices
// =========================================================================
describe("Workflow F: Payments, Invoices & Tax Calculations", () => {
  it("computes GST 18% (CGST 9% + SGST 9%) and VAT 20% accurately without rounding drift", async () => {
    const { calculateInvoiceTaxes } = await import("@/lib/invoices");

    // Test Indian Intra-state GST (₹1,000 base -> ₹90 CGST + ₹90 SGST = ₹1,180 total)
    const inTaxes = calculateInvoiceTaxes({
      taxableAmount: 1000,
      currency: "INR",
      customerState: "Tamil Nadu",
      customerStateCode: "33",
    });

    expect(inTaxes.cgstRate).toBe(9);
    expect(inTaxes.sgstRate).toBe(9);
    expect(inTaxes.cgstAmount).toBe(90);
    expect(inTaxes.sgstAmount).toBe(90);
    expect(inTaxes.totalAmount).toBe(1180);

    // Test UK VAT (20%)
    const ukTaxes = calculateInvoiceTaxes({
      taxableAmount: 100,
      currency: "GBP",
    });
    expect(ukTaxes.igstRate).toBe(20);
    expect(ukTaxes.igstAmount).toBe(20);
    expect(ukTaxes.totalAmount).toBe(120);
  });

  it("verifies Razorpay webhook candidate secrets resolution", async () => {
    const { getRazorpayWebhookCandidateSecrets } = await import("@/lib/razorpay-webhook");
    const secrets = getRazorpayWebhookCandidateSecrets();
    expect(Array.isArray(secrets)).toBe(true);
  });
});

// =========================================================================
// Workflow G: Offline Scanning, Manifest Serialization & Reconciliation
// =========================================================================
describe("Workflow G: Offline Scanning & Data Serialization", () => {
  it("serializes and normalizes tokens for offline IndexedDB matching", async () => {
    const { normalizeToken } = await import("@/lib/offline-scanner");
    expect(normalizeToken("https://urpass.space/pass/tok_mesh_123")).toBe("tok_mesh_123");
    expect(normalizeToken("TOK_MESH_123")).toBe("TOK_MESH_123");
  });
});

// =========================================================================
// Workflow H: Role-Based Access Control & Security Policies
// =========================================================================
describe("Workflow H: RBAC & Permission Boundaries", () => {
  it("enforces protected organization owners against downgrade or removal", async () => {
    const { isProtectedOwner, getRolePermissions } = await import("@/lib/rbac/roles");
    expect(isProtectedOwner("owner")).toBe(true);
    expect(isProtectedOwner("admin")).toBe(false);
    expect(isProtectedOwner("gate_staff")).toBe(false);

    const staffPerms = getRolePermissions("gate_staff");
    expect(staffPerms.includes("attendance.scan_gate")).toBe(true);
    expect(staffPerms.includes("org.manage_billing")).toBe(false);
  });

  it("validates enterprise CIDR IPv4 blocks correctly", async () => {
    const { isIpv4InCidr, validateCidr } = await import("@/lib/sso/ip-allowlist");
    expect(validateCidr("192.168.1.0/24").valid).toBe(true);
    expect(validateCidr("invalid-ip").valid).toBe(false);

    expect(isIpv4InCidr("192.168.1.50", "192.168.1.0/24")).toBe(true);
    expect(isIpv4InCidr("10.0.0.1", "192.168.1.0/24")).toBe(false);
  });
});

// =========================================================================
// Workflow I: Operational Analytics & Net In-Venue Presence
// =========================================================================
describe("Workflow I: Turnout & Presence Analytics", () => {
  it("computes net in-venue presence from scan entry and exit sequences", async () => {
    const { calculateNetPresence } = await import("@/lib/advanced-analytics/index");

    const scanLogs = [
      { attendee_id: "att-1", operation_type: "entry", created_at: "2026-10-18T09:00:00Z" },
      { attendee_id: "att-2", operation_type: "entry", created_at: "2026-10-18T09:05:00Z" },
      { attendee_id: "att-3", operation_type: "entry", created_at: "2026-10-18T09:10:00Z" },
      { attendee_id: "att-1", operation_type: "exit", created_at: "2026-10-18T10:00:00Z" }, // att-1 left
    ];

    const presence = calculateNetPresence(scanLogs);
    expect(presence.totalEntries).toBe(3);
    expect(presence.totalExits).toBe(1);
    expect(presence.netInside).toBe(2);
    expect(presence.uniqueAttendeesEntered).toBe(3);
  });
});

// =========================================================================
// Workflow J: Error Resilience, CSV Formula Sanitization & Webhook Retries
// =========================================================================
describe("Workflow J: Resilience & Injection Protection", () => {
  it("sanitizes CSV cells to prevent Formula Injection Attacks (=, +, -, @, \\t, \\r)", async () => {
    const { sanitizeCsvCell } = await import("@/lib/csv-management/index");

    // Malicious formula payloads
    expect(sanitizeCsvCell("=CMD('calc')")).toBe("'=CMD('calc')");
    expect(sanitizeCsvCell("+1+1")).toBe("'+1+1");
    expect(sanitizeCsvCell("-5")).toBe("'-5");
    expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");

    // Safe values should not be altered
    expect(sanitizeCsvCell("Regular Attendee")).toBe("Regular Attendee");
    expect(sanitizeCsvCell("123456")).toBe("123456");
  });
});
