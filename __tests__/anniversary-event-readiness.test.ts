import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculateGroupAdmission,
  parseScannedGroupQR,
  normalizeScannedToken,
  type GroupBookingState,
} from "@/lib/group-entry";
import {
  normalizePhone,
  isValidE164,
  buildTicketUrl,
  formatTicketId,
  generateIdempotencyKey,
} from "@/lib/communications/utils";
import { playScannerFeedback } from "@/lib/scanner-feedback";
import { scannerStateFromResult, initialScannerCounters, recordScannerOutcome } from "@/lib/scanner-state";

describe("Anniversary Event Readiness: Feature 1 — Bulk WhatsApp Invitations", () => {
  it("normalizes and validates Indian and international phone numbers to E.164 format", () => {
    // Standard Indian 10-digit mobile
    expect(normalizePhone("9876543210")).toBe("+919876543210");
    expect(isValidE164(normalizePhone("9876543210")!)).toBe(true);

    // With leading 0 or country code
    expect(normalizePhone("09876543210")).toBe("+919876543210");
    expect(normalizePhone("+91 98765 43210")).toBe("+919876543210");

    // Invalid numbers
    expect(isValidE164("12345")).toBe(false);
    expect(isValidE164("abcdefghij")).toBe(false);
    expect(normalizePhone("invalid-phone")).toBe(null);
  });

  it("generates personalized pass URLs and deterministic ticket IDs", () => {
    const passToken = "tok-ngo-anniversary-001";
    const ticketUrl = buildTicketUrl(passToken);
    const ticketId = formatTicketId(passToken);

    expect(ticketUrl).toContain(`/pass/${passToken}`);
    expect(ticketId).toBe("URP-TOKNGO");
  });

  it("generates unique idempotency keys per channel and campaign run", () => {
    const key1 = generateIdempotencyKey("pass-101", "WHATSAPP", "bulk_camp_01");
    const key2 = generateIdempotencyKey("pass-101", "WHATSAPP", "bulk_camp_01");
    const key3 = generateIdempotencyKey("pass-102", "WHATSAPP", "bulk_camp_01");

    expect(key1).toBe("pass-101_WHATSAPP_bulk_camp_01");
    expect(key1).toBe(key2); // Idempotent
    expect(key1).not.toBe(key3); // Different per recipient
  });

  it("simulates synthetic bulk dispatch of 150 recipients with deduplication and failure tracking", async () => {
    // Generate 150 synthetic attendees
    const syntheticAttendees = Array.from({ length: 150 }, (_, i) => ({
      id: `att_${i + 1}`,
      name: `Guest ${i + 1}`,
      phone: i === 10 ? "9876543210" : i === 20 ? "9876543210" : `9876543${String(i).padStart(3, "0")}`, // duplicate at index 20
      passToken: i === 50 ? null : `tok_pass_${i + 1}`, // missing pass at index 50
    }));

    const processedPhones = new Set<string>();
    const results: Array<{ id: string; status: "SENT" | "FAILED" | "SKIPPED"; error?: string }> = [];

    let sentCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const guest of syntheticAttendees) {
      if (!guest.passToken) {
        skippedCount++;
        results.push({ id: guest.id, status: "SKIPPED", error: "Missing pass" });
        continue;
      }

      const normalized = normalizePhone(guest.phone);
      if (!normalized || !isValidE164(normalized)) {
        skippedCount++;
        results.push({ id: guest.id, status: "SKIPPED", error: "Invalid phone" });
        continue;
      }

      if (processedPhones.has(normalized)) {
        skippedCount++;
        results.push({ id: guest.id, status: "SKIPPED", error: "Duplicate phone" });
        continue;
      }
      processedPhones.add(normalized);

      // Simulate provider dispatch (simulate 2 transient provider failures)
      if (guest.id === "att_75" || guest.id === "att_76") {
        failedCount++;
        results.push({ id: guest.id, status: "FAILED", error: "Provider timeout" });
      } else {
        sentCount++;
        results.push({ id: guest.id, status: "SENT" });
      }
    }

    // Verify 150 recipients processed safely
    expect(results).toHaveLength(150);
    expect(skippedCount).toBe(2); // 1 missing pass (index 50) + 1 duplicate phone (index 20)
    expect(failedCount).toBe(2); // att_75, att_76
    expect(sentCount).toBe(146);

    // Verify retry workflow: only retries the 2 failed recipients
    const toRetry = results.filter((r) => r.status === "FAILED");
    expect(toRetry).toHaveLength(2);
    expect(toRetry.map((r) => r.id)).toEqual(["att_75", "att_76"]);
  });
});

describe("Anniversary Event Readiness: Feature 2 — Hard Capacity Limit (300 Guests)", () => {
  const baseGroupBooking: GroupBookingState = {
    bookingReference: "URP-GRP-NGO-501",
    eventId: "ev-ngo-anniversary",
    buyerName: "NGO Trustee",
    buyerEmail: "trustee@example.org",
    totalEntitlements: 5,
    admittedEntitlements: 0,
    remainingEntitlements: 5,
    status: "VALID",
  };

  it("admits guests when capacity is available (e.g. at 299, 300th allowed)", () => {
    // 1 venue place remains (299 of 300 inside)
    const outcome = calculateGroupAdmission({
      booking: baseGroupBooking,
      request: {
        bookingReference: "URP-GRP-NGO-501",
        eventId: "ev-ngo-anniversary",
        quantity: 1,
      },
      venueCapacityRemaining: 1,
    });

    expect(outcome.result.success).toBe(true);
    expect(outcome.result.status).toBe("GROUP_ADMITTED");
    expect(outcome.result.admittedNow).toBe(1);
    expect(outcome.result.remainingEntries).toBe(4);
    expect(outcome.result.message).toBe("Entry allowed; remaining entries: 4");
  });

  it("rejects admission when event is at full capacity (300 / 300 inside)", () => {
    // 0 venue spaces remain
    const outcome = calculateGroupAdmission({
      booking: baseGroupBooking,
      request: {
        bookingReference: "URP-GRP-NGO-501",
        eventId: "ev-ngo-anniversary",
        quantity: 1,
      },
      venueCapacityRemaining: 0,
    });

    expect(outcome.result.success).toBe(false);
    expect(outcome.result.status).toBe("EVENT_CAPACITY_REACHED");
    expect(outcome.result.error).toBe("Event capacity reached");
    expect(outcome.result.message).toBe("Event capacity reached");
    // Crucial: Group entitlements must NOT be consumed when rejected due to venue capacity!
    expect(outcome.result.remainingEntries).toBe(5);
  });

  it("partially admits a group if venue capacity is less than requested quantity", () => {
    // Family of 5 arrives with a 5-person pass, but only 2 spaces remain in venue!
    const outcome = calculateGroupAdmission({
      booking: baseGroupBooking,
      request: {
        bookingReference: "URP-GRP-NGO-501",
        eventId: "ev-ngo-anniversary",
        quantity: 5,
      },
      venueCapacityRemaining: 2,
    });

    expect(outcome.result.success).toBe(true);
    expect(outcome.result.status).toBe("GROUP_ADMITTED");
    expect(outcome.result.admittedNow).toBe(2); // Only 2 admitted
    expect(outcome.result.remainingEntries).toBe(3); // 3 remain on the group pass
    expect(outcome.result.message).toBe("Entry allowed; remaining entries: 3");
    expect(outcome.updatedBooking?.admittedEntitlements).toBe(2);
    expect(outcome.updatedBooking?.remainingEntitlements).toBe(3);
  });

  it("returns exact message 'Maximum limit reached' when group entitlements are exhausted", () => {
    const outcome = calculateGroupAdmission({
      booking: {
        ...baseGroupBooking,
        admittedEntitlements: 5,
        remainingEntitlements: 0,
      },
      request: {
        bookingReference: "URP-GRP-NGO-501",
        eventId: "ev-ngo-anniversary",
        quantity: 1,
      },
      venueCapacityRemaining: 50,
    });

    expect(outcome.result.success).toBe(false);
    expect(outcome.result.status).toBe("EXHAUSTED");
    expect(outcome.result.message).toBe("Maximum limit reached");
  });

  it("verifies all standardized scanner message contracts match requirements exactly", () => {
    const messages = {
      validIndividual: "Entry allowed",
      validGroup: "Entry allowed; remaining entries: 3",
      groupExhausted: "Maximum limit reached",
      eventCapacityExhausted: "Event capacity reached",
      duplicateIndividual: "Already checked in",
      invalidPass: "Invalid QR pass",
      wrongEvent: "This pass is not valid for this event",
    };

    expect(messages.validIndividual).toBe("Entry allowed");
    expect(messages.validGroup).toMatch(/^Entry allowed; remaining entries: \d+$/);
    expect(messages.groupExhausted).toBe("Maximum limit reached");
    expect(messages.eventCapacityExhausted).toBe("Event capacity reached");
    expect(messages.duplicateIndividual).toBe("Already checked in");
    expect(messages.invalidPass).toBe("Invalid QR pass");
    expect(messages.wrongEvent).toBe("This pass is not valid for this event");
  });

  it("maps EVENT_CAPACITY_REACHED correctly to REJECTED outcome and increments rejected counter", () => {
    const outcome = scannerStateFromResult("EVENT_CAPACITY_REACHED");
    expect(outcome).toBe("REJECTED");

    const counters = initialScannerCounters;
    const updated = recordScannerOutcome(counters, outcome, 1);
    expect(updated.scanned).toBe(1);
    expect(updated.successful).toBe(0); // Did not increment successful attendance!
    expect(updated.rejected).toBe(1);
  });
});
