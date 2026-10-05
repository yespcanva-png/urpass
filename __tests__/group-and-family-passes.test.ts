import { describe, it, expect } from "vitest";
import {
  EVENT_PASS_MATRIX,
  calculateGroupPassPrice,
  findPassConfig,
  sanitizeGroupMembers,
  createGroupPassQRPayload,
  parseGroupPassQRPayload,
  performGroupCheckIn,
  calculateGroupPassSalesAnalytics,
  GroupPassRecord,
} from "@/lib/passes/group-passes";

describe("UrPass Group & Family Passes Engine", () => {
  describe("1. Standard Event Pass Matrix Configuration", () => {
    it("contains all 8 standard pass tiers with accurate duration and pricing", () => {
      expect(EVENT_PASS_MATRIX).toHaveLength(8);

      const single1D = findPassConfig("Single Person", "1 Day");
      expect(single1D).toBeDefined();
      expect(single1D?.basePrice).toBe(199);
      expect(single1D?.includedGuests).toBe(1);
      expect(single1D?.allowExtraGuests).toBe(false);

      const single3D = findPassConfig("Single Person", "3 Days");
      expect(single3D?.basePrice).toBe(449);
      expect(single3D?.includedGuests).toBe(1);

      const couple1D = findPassConfig("Couple", "1 Day");
      expect(couple1D?.basePrice).toBe(249);
      expect(couple1D?.includedGuests).toBe(2);
      expect(couple1D?.allowExtraGuests).toBe(false);

      const couple3D = findPassConfig("Couple", "3 Days");
      expect(couple3D?.basePrice).toBe(549);
      expect(couple3D?.includedGuests).toBe(2);

      const family1D = findPassConfig("Family", "1 Day");
      expect(family1D?.basePrice).toBe(449);
      expect(family1D?.includedGuests).toBe(4);
      expect(family1D?.allowExtraGuests).toBe(true);
      expect(family1D?.extraGuestPrice).toBe(100);

      const family3D = findPassConfig("Family", "3 Days");
      expect(family3D?.basePrice).toBe(1049);
      expect(family3D?.includedGuests).toBe(4);
      expect(family3D?.allowExtraGuests).toBe(true);
      expect(family3D?.extraGuestPrice).toBe(100);

      const vip1D = findPassConfig("VIP", "1 Day");
      expect(vip1D?.basePrice).toBe(599);
      expect(vip1D?.includedGuests).toBe(1);
      expect(vip1D?.accessType).toBe("VIP");

      const vip3D = findPassConfig("VIP", "3 Days");
      expect(vip3D?.basePrice).toBe(999);
      expect(vip3D?.includedGuests).toBe(1);
      expect(vip3D?.accessType).toBe("VIP");
    });
  });

  describe("2. Server-Side Price Calculations & Extra Person Rule", () => {
    it("calculates exact 1-Day Family Pass pricing with extra guests", () => {
      const family1D = findPassConfig("Family", "1 Day")!;

      // 4 people = ₹449
      const p4 = calculateGroupPassPrice(family1D, 4);
      expect(p4.totalAmount).toBe(449);
      expect(p4.extraGuestsCount).toBe(0);
      expect(p4.extraGuestsTotal).toBe(0);
      expect(p4.totalAmountPaise).toBe(44900);
      expect(p4.capacityUnitsConsumed).toBe(4);
      expect(p4.ticketQuantity).toBe(1);

      // 5 people = ₹549
      const p5 = calculateGroupPassPrice(family1D, 5);
      expect(p5.totalAmount).toBe(549);
      expect(p5.extraGuestsCount).toBe(1);
      expect(p5.extraGuestsTotal).toBe(100);
      expect(p5.totalAmountPaise).toBe(54900);
      expect(p5.capacityUnitsConsumed).toBe(5);

      // 6 people = ₹649
      const p6 = calculateGroupPassPrice(family1D, 6);
      expect(p6.totalAmount).toBe(649);
      expect(p6.extraGuestsCount).toBe(2);
      expect(p6.extraGuestsTotal).toBe(200);
      expect(p6.capacityUnitsConsumed).toBe(6);

      // 7 people = ₹749
      const p7 = calculateGroupPassPrice(family1D, 7);
      expect(p7.totalAmount).toBe(749);
      expect(p7.extraGuestsCount).toBe(3);
      expect(p7.extraGuestsTotal).toBe(300);

      // 8 people = ₹849
      const p8 = calculateGroupPassPrice(family1D, 8);
      expect(p8.totalAmount).toBe(849);
      expect(p8.extraGuestsCount).toBe(4);
      expect(p8.extraGuestsTotal).toBe(400);
    });

    it("calculates exact 3-Day Family Pass pricing with extra guests", () => {
      const family3D = findPassConfig("Family", "3 Days")!;

      // 4 people = ₹1,049
      const p4 = calculateGroupPassPrice(family3D, 4);
      expect(p4.totalAmount).toBe(1049);
      expect(p4.extraGuestsCount).toBe(0);
      expect(p4.totalAmountPaise).toBe(104900);

      // 5 people = ₹1,149
      const p5 = calculateGroupPassPrice(family3D, 5);
      expect(p5.totalAmount).toBe(1149);
      expect(p5.extraGuestsCount).toBe(1);
      expect(p5.extraGuestsTotal).toBe(100);

      // 6 people = ₹1,249
      const p6 = calculateGroupPassPrice(family3D, 6);
      expect(p6.totalAmount).toBe(1249);
      expect(p6.extraGuestsCount).toBe(2);
      expect(p6.extraGuestsTotal).toBe(200);
    });

    it("prevents extra guests from being added to fixed passes like Single, Couple, VIP", () => {
      const couple1D = findPassConfig("Couple", "1 Day")!;
      // Even if client passes 4 people, Couple pass clamps to min/max 2
      const calc = calculateGroupPassPrice(couple1D, 4);
      expect(calc.selectedGuests).toBe(2);
      expect(calc.extraGuestsCount).toBe(0);
      expect(calc.totalAmount).toBe(249);
    });
  });

  describe("3. Ticket Quantity vs Pass Capacity Units", () => {
    it("ensures Ticket Quantity is 1 while Pass Capacity equals attendee count", () => {
      const family1D = findPassConfig("Family", "1 Day")!;
      const calc = calculateGroupPassPrice(family1D, 6);

      // Crucial: 1 Family Pass with 6 people consumes 6 venue capacity units, not 1
      expect(calc.ticketQuantity).toBe(1);
      expect(calc.capacityUnitsConsumed).toBe(6);
      expect(calc.selectedGuests).toBe(6);
    });

    it("calculates sales analytics correctly without distorting inventory", () => {
      const orders = [
        { totalGuests: 6, totalAmount: 649, status: "PAID" },
        { totalGuests: 2, totalAmount: 249, status: "PAID" },
        { totalGuests: 1, totalAmount: 199, status: "PAID" },
      ];

      const analytics = calculateGroupPassSalesAnalytics(orders);
      expect(analytics.passesSold).toBe(3);
      expect(analytics.totalAttendees).toBe(9); // 6 + 2 + 1
      expect(analytics.totalRevenueRupees).toBe(1097);
      expect(analytics.averageGroupSize).toBe(3);
    });
  });

  describe("4. Group Member Sanitization & Rostering", () => {
    it("structures primary contact as Member 1 and parses additional members", () => {
      const primary = {
        name: "Srinithin",
        email: "srinithin@example.com",
        phone: "+919876543210",
      };
      const additional = [
        { name: "Alice", phone: "+919876543211" },
        { name: "Bob", email: "bob@example.com" },
      ];

      const members = sanitizeGroupMembers(primary, additional, 4);
      expect(members).toHaveLength(4);

      expect(members[0].name).toBe("Srinithin");
      expect(members[0].role).toBe("primary");
      expect(members[0].checkedIn).toBe(false);

      expect(members[1].name).toBe("Alice");
      expect(members[1].role).toBe("member");

      expect(members[2].name).toBe("Bob");
      expect(members[2].role).toBe("member");

      // Auto-padded 4th guest
      expect(members[3].name).toBe("Member 4");
      expect(members[3].role).toBe("member");
    });
  });

  describe("5. QR Serialization & Check-In Operations", () => {
    it("encodes and parses structured Group Pass QR code", () => {
      const qrPayload = createGroupPassQRPayload({
        passToken: "tok_fam_12345",
        passName: "Family Pass",
        duration: "3 Days",
        totalGuests: 6,
        holderName: "Srinithin",
      });

      const parsed = parseGroupPassQRPayload(qrPayload);
      expect(parsed.isValid).toBe(true);
      expect(parsed.passToken).toBe("tok_fam_12345");
      expect(parsed.passName).toBe("Family Pass");
      expect(parsed.duration).toBe("3 Days");
      expect(parsed.totalGuests).toBe(6);
      expect(parsed.holderName).toBe("Srinithin");
    });

    it("performs atomic check-in for entire group on single QR scan", () => {
      const mockRecord: GroupPassRecord = {
        id: "pass_001",
        passToken: "tok_fam_12345",
        eventId: "evt_001",
        passName: "Family Pass",
        duration: "1 Day",
        durationDays: 1,
        basePrice: 449,
        totalAmount: 649,
        totalGuests: 6,
        checkedInGuests: 0,
        primaryContact: {
          name: "Srinithin",
          email: "srinithin@example.com",
        },
        members: sanitizeGroupMembers(
          { name: "Srinithin", email: "srinithin@example.com" },
          [{ name: "Member 2" }, { name: "Member 3" }],
          6
        ),
        status: "VALID",
        qrCodePayload: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Check in all 6 attendees
      const result = performGroupCheckIn(mockRecord, { checkInAll: true });
      expect(result.success).toBe(true);
      expect(result.checkedInGuests).toBe(6);
      expect(result.remainingGuests).toBe(0);
      expect(result.status).toBe("CHECKED_IN");
      expect(mockRecord.members.every((m) => m.checkedIn)).toBe(true);

      // Attempting to check in again is rejected with clear error
      const repeatResult = performGroupCheckIn(mockRecord, { checkInAll: true });
      expect(repeatResult.success).toBe(false);
      expect(repeatResult.error).toBe("ALL_GUESTS_ALREADY_CHECKED_IN");
    });

    it("supports partial individual member check-in", () => {
      const mockRecord: GroupPassRecord = {
        id: "pass_002",
        passToken: "tok_fam_67890",
        eventId: "evt_001",
        passName: "Couple Pass",
        duration: "1 Day",
        durationDays: 1,
        basePrice: 249,
        totalAmount: 249,
        totalGuests: 2,
        checkedInGuests: 0,
        primaryContact: { name: "Alex", email: "alex@example.com" },
        members: [
          { name: "Alex", role: "primary", checkedIn: false },
          { name: "Sam", role: "member", checkedIn: false },
        ],
        status: "VALID",
        qrCodePayload: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Check in only Member #1 (Alex)
      const res1 = performGroupCheckIn(mockRecord, { memberIndex: 0 });
      expect(res1.success).toBe(true);
      expect(res1.checkedInGuests).toBe(1);
      expect(res1.status).toBe("PARTIALLY_CHECKED_IN");
      expect(mockRecord.members[0].checkedIn).toBe(true);
      expect(mockRecord.members[1].checkedIn).toBe(false);

      // Checking in Alex again fails
      const resAlexRepeat = performGroupCheckIn(mockRecord, { memberIndex: 0 });
      expect(resAlexRepeat.success).toBe(false);
      expect(resAlexRepeat.error).toBe("MEMBER_ALREADY_CHECKED_IN");

      // Check in Member #2 (Sam)
      const res2 = performGroupCheckIn(mockRecord, { memberIndex: 1 });
      expect(res2.success).toBe(true);
      expect(res2.checkedInGuests).toBe(2);
      expect(res2.status).toBe("CHECKED_IN");
      expect(mockRecord.members[1].checkedIn).toBe(true);
    });
  });
});
