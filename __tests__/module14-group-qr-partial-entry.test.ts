import { describe, it, expect } from "vitest";
import { calculateGroupAdmission, parseScannedGroupQR, generateGroupQRPayload } from "../lib/group-entry";

describe("Module M14: Bulk Group QR Entry & Partial Check-In", () => {
  const baseBooking = {
    bookingReference: "URP-GRP-10021",
    eventId: "ev-test-100",
    buyerName: "Arun",
    buyerEmail: "arun@example.com",
    totalEntitlements: 10,
    admittedEntitlements: 0,
    remainingEntitlements: 10,
    status: "VALID" as const,
  };

  it("Test Case 1: Purchase 10, admit 6 -> 4 entries remain", () => {
    const outcome = calculateGroupAdmission({
      booking: baseBooking,
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 6,
        operatorEmail: "gate@urpass.space",
        gateName: "North Gate",
      },
    });

    expect(outcome.result.success).toBe(true);
    expect(outcome.result.status).toBe("GROUP_ADMITTED");
    expect(outcome.result.admittedNow).toBe(6);
    expect(outcome.result.previouslyAdmitted).toBe(0);
    expect(outcome.result.remainingEntries).toBe(4);
    expect(outcome.updatedBooking?.admittedEntitlements).toBe(6);
    expect(outcome.updatedBooking?.remainingEntitlements).toBe(4);
    expect(outcome.updatedBooking?.status).toBe("VALID");
  });

  it("Test Case 2: Scan same QR, admit 4 -> 0 remain", () => {
    const outcome = calculateGroupAdmission({
      booking: {
        ...baseBooking,
        admittedEntitlements: 6,
        remainingEntitlements: 4,
      },
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 4,
        operatorEmail: "gate@urpass.space",
      },
    });

    expect(outcome.result.success).toBe(true);
    expect(outcome.result.status).toBe("GROUP_ADMITTED");
    expect(outcome.result.admittedNow).toBe(4);
    expect(outcome.result.previouslyAdmitted).toBe(6);
    expect(outcome.result.remainingEntries).toBe(0);
    expect(outcome.updatedBooking?.status).toBe("EXHAUSTED");
  });

  it("Test Case 3: Scan again for 1 -> Denied (EXHAUSTED)", () => {
    const outcome = calculateGroupAdmission({
      booking: {
        ...baseBooking,
        admittedEntitlements: 10,
        remainingEntitlements: 0,
      },
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 1,
      },
    });

    expect(outcome.result.success).toBe(false);
    expect(outcome.result.status).toBe("EXHAUSTED");
    expect(outcome.result.remainingEntries).toBe(0);
    expect(outcome.result.error).toBe("ALL_ENTITLEMENTS_USED");
  });

  it("Test Case 4: First scan requests 11 -> Denied (EXCEEDS_REMAINING)", () => {
    const outcome = calculateGroupAdmission({
      booking: baseBooking,
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 11,
      },
    });

    expect(outcome.result.success).toBe(false);
    expect(outcome.result.status).toBe("EXCEEDS_REMAINING");
    expect(outcome.result.remainingEntries).toBe(10);
  });

  it("Test Case 5: Zero or negative quantity requested -> Denied (INVALID_QUANTITY)", () => {
    const outcomeZero = calculateGroupAdmission({
      booking: baseBooking,
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 0,
      },
    });
    expect(outcomeZero.result.success).toBe(false);
    expect(outcomeZero.result.status).toBe("INVALID_QUANTITY");

    const outcomeNeg = calculateGroupAdmission({
      booking: baseBooking,
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: -2,
      },
    });
    expect(outcomeNeg.result.success).toBe(false);
    expect(outcomeNeg.result.status).toBe("INVALID_QUANTITY");
  });

  it("Test Case 6: Refunded / Cancelled booking -> Denied", () => {
    const outcomeRefunded = calculateGroupAdmission({
      booking: {
        ...baseBooking,
        status: "REFUNDED",
      },
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 2,
      },
    });
    expect(outcomeRefunded.result.success).toBe(false);
    expect(outcomeRefunded.result.status).toBe("BOOKING_INVALID");
    expect(outcomeRefunded.result.error).toBe("BOOKING_REFUNDED");

    const outcomeCancelled = calculateGroupAdmission({
      booking: {
        ...baseBooking,
        status: "CANCELLED",
      },
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 2,
      },
    });
    expect(outcomeCancelled.result.success).toBe(false);
    expect(outcomeCancelled.result.error).toBe("BOOKING_CANCELLED");
  });

  it("Test Case 7: One ticket refunded before entry -> valid available count is reduced", () => {
    // Purchased 10, but 1 refunded -> totalEntitlements becomes 9
    const outcome = calculateGroupAdmission({
      booking: {
        ...baseBooking,
        totalEntitlements: 9,
        remainingEntitlements: 9,
      },
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 10,
      },
    });

    expect(outcome.result.success).toBe(false);
    expect(outcome.result.status).toBe("EXCEEDS_REMAINING");
    expect(outcome.result.remainingEntries).toBe(9);
  });

  it("Test Case 8: Simulated concurrent race protection rule", () => {
    // Device A and Device B both scan when remaining = 10, both requesting 6
    // In database, the row lock forces serial execution.
    // Device A executes first:
    const outcomeA = calculateGroupAdmission({
      booking: baseBooking,
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 6,
        deviceId: "device-gate-1",
      },
    });
    expect(outcomeA.result.success).toBe(true);
    expect(outcomeA.result.remainingEntries).toBe(4);

    // Device B then executes against updated database row (admitted: 6, remaining: 4)
    const outcomeB = calculateGroupAdmission({
      booking: outcomeA.updatedBooking!,
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 6,
        deviceId: "device-gate-2",
      },
    });
    // Device B must be rejected, combined confirmed admissions never exceed 10!
    expect(outcomeB.result.success).toBe(false);
    expect(outcomeB.result.status).toBe("EXCEEDS_REMAINING");
    expect(outcomeB.result.remainingEntries).toBe(4);
  });

  it("Test Case 9: QR Token Parsing & Payload Generation", () => {
    const rawQr = generateGroupQRPayload({
      bookingReference: "URP-GRP-10021",
      eventId: "ev-test-100",
      totalEntitlements: 10,
      buyerName: "Arun",
      mode: "count_only",
    });

    const parsed = parseScannedGroupQR(rawQr);
    expect(parsed.isGroupQR).toBe(true);
    expect(parsed.bookingReference).toBe("URP-GRP-10021");
    expect(parsed.totalEntitlements).toBe(10);
    expect(parsed.buyerName).toBe("Arun");
    expect(parsed.mode).toBe("count_only");
  });

  it("Test Case 10: Human-readable prefix URP-GRP-* recognized as group QR", () => {
    const parsed = parseScannedGroupQR("URP-GRP-99942");
    expect(parsed.isGroupQR).toBe(true);
    expect(parsed.bookingReference).toBe("URP-GRP-99942");
  });

  it("Test Case 11: Feature disabled check", () => {
    const outcome = calculateGroupAdmission({
      booking: baseBooking,
      request: {
        bookingReference: "URP-GRP-10021",
        eventId: "ev-test-100",
        quantity: 5,
      },
      isFeatureActive: false,
    });
    expect(outcome.result.success).toBe(false);
    expect(outcome.result.status).toBe("FEATURE_DISABLED");
    expect(outcome.result.error).toBe("FEATURE_DISABLED");
  });

  describe("Backend Service: admitGroupMembers", () => {
    const mockUserContext = {
      id: "scanner-usr-1",
      email: "staff@urpass.space",
      role: "checkin_staff",
      assignedGateIds: ["gate-north"],
    };

    const mockEventContext = {
      groupEntryEnabled: true,
      allowedGates: ["gate-north", "gate-south"],
      maxGroupSize: 20,
    };

    it("admitGroupMembers successfully admits partial quantity and returns authoritative balance", async () => {
      const { admitGroupMembers } = await import("../lib/group-entry");

      const response = await admitGroupMembers({
        eventId: "ev-test-100",
        bookingId: "URP-GRP-10021",
        gateId: "gate-north",
        quantity: 6,
        scannerId: "scanner-usr-1",
        scannerEmail: "staff@urpass.space",
        operationId: "op-101",
        booking: {
          ...baseBooking,
          admittedEntitlements: 0,
          remainingEntitlements: 10,
        },
        userContext: mockUserContext,
        eventContext: mockEventContext,
      });

      expect(response.success).toBe(true);
      expect(response.status).toBe("GROUP_ADMITTED");
      expect(response.admittedNow).toBe(6);
      expect(response.remainingEntries).toBe(4);
      expect(response.totalEntitlements).toBe(10);
    });

    it("admitGroupMembers enforces event gate restrictions", async () => {
      const { admitGroupMembers } = await import("../lib/group-entry");

      const response = await admitGroupMembers({
        eventId: "ev-test-100",
        bookingId: "URP-GRP-10021",
        gateId: "gate-vip", // Not in allowedGates: ['gate-north', 'gate-south']
        quantity: 2,
        scannerId: "scanner-usr-1",
        booking: baseBooking,
        userContext: mockUserContext,
        eventContext: mockEventContext,
      });

      expect(response.success).toBe(false);
      expect(response.status).toBe("GATE_NOT_ALLOWED");
    });

    it("admitGroupMembers blocks scanner operator not assigned to gate", async () => {
      const { admitGroupMembers } = await import("../lib/group-entry");

      const response = await admitGroupMembers({
        eventId: "ev-test-100",
        bookingId: "URP-GRP-10021",
        gateId: "gate-south", // allowed for event, but user is only assigned to 'gate-north'
        quantity: 2,
        scannerId: "scanner-usr-1",
        booking: baseBooking,
        userContext: mockUserContext,
        eventContext: mockEventContext,
      });

      expect(response.success).toBe(false);
      expect(response.status).toBe("UNAUTHORIZED_GATE");
    });

    it("supervisor bypasses assigned gate restriction", async () => {
      const { admitGroupMembers } = await import("../lib/group-entry");

      const response = await admitGroupMembers({
        eventId: "ev-test-100",
        bookingId: "URP-GRP-10021",
        gateId: "gate-south",
        quantity: 2,
        scannerId: "sup-usr-1",
        booking: baseBooking,
        userContext: {
          id: "sup-usr-1",
          email: "supervisor@urpass.space",
          role: "gate_supervisor",
          assignedGateIds: ["gate-north"],
        },
        eventContext: mockEventContext,
      });

      expect(response.success).toBe(true);
      expect(response.admittedNow).toBe(2);
      expect(response.remainingEntries).toBe(8);
    });
  });

  describe("Regression: Standard Individual QR Scanning Unchanged", () => {
    it("parseScannedGroupQR identifies standard individual pass tokens as non-group", () => {
      const standardPassTokens = [
        "pass_live_tok_99882233",
        "https://urpass.space/pass/tok_12345678",
        "URP-ATT-00129",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      ];

      for (const token of standardPassTokens) {
        const parsed = parseScannedGroupQR(token);
        expect(parsed.isGroupQR).toBe(false);
      }
    });
  });
});
