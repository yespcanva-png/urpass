import { describe, it, expect } from "vitest";
import {
  ageTierPricingSchema,
  AGE_TIER_PRESETS,
  ticketTypeSchema,
  findMatchingAgeTier,
  type AgeTierPricing,
  type TicketTypeInput,
} from "@/lib/validations/ticket-type";

describe("Age-Wise Pricing and Extra Member Engine", () => {
  describe("1. Age Tier Validation & Built-in Presets", () => {
    it("validates ageTierPricingSchema correctly for paid and free tiers", () => {
      const validPaid = ageTierPricingSchema.parse({
        id: "adult",
        label: "Adult (18–59 yrs)",
        min_age: 18,
        max_age: 59,
        price: 499,
        is_free: false,
        badge_label: "ADULT",
      });
      expect(validPaid.id).toBe("adult");
      expect(validPaid.price).toBe(499);
      expect(validPaid.is_free).toBe(false);

      const validFree = ageTierPricingSchema.parse({
        id: "infant",
        label: "Infant (<5 yrs)",
        min_age: 0,
        max_age: 4,
        price: 0,
        is_free: true,
        badge_label: "INFANT (FREE)",
      });
      expect(validFree.is_free).toBe(true);
      expect(validFree.price).toBe(0);
    });

    it("rejects invalid age bracket boundaries or negative prices", () => {
      expect(() =>
        ageTierPricingSchema.parse({
          id: "invalid_price",
          label: "Invalid Tier",
          price: -50,
        })
      ).toThrow();

      expect(() =>
        ageTierPricingSchema.parse({
          id: "invalid_age",
          label: "Invalid Tier",
          min_age: -5,
          price: 100,
        })
      ).toThrow();
    });

    it("provides all 3 corporate age-bracket presets with exact metadata", () => {
      expect(AGE_TIER_PRESETS).toHaveLength(3);

      // Standard All-Ages Preset
      const standard = AGE_TIER_PRESETS.find((p) => p.id === "standard_all_ages");
      expect(standard).toBeDefined();
      expect(standard?.tiers).toHaveLength(4);
      expect(standard?.tiers.map((t) => t.id)).toEqual(["adult", "child", "senior", "infant"]);
      expect(standard?.tiers.find((t) => t.id === "infant")?.is_free).toBe(true);

      // Family & Youth Preset
      const family = AGE_TIER_PRESETS.find((p) => p.id === "family_youth");
      expect(family).toBeDefined();
      expect(family?.tiers).toHaveLength(4);
      expect(family?.tiers.map((t) => t.id)).toEqual(["adult", "teen", "kid", "toddler"]);
      expect(family?.tiers.find((t) => t.id === "toddler")?.is_free).toBe(true);

      // Collegiate & Academic Preset
      const collegiate = AGE_TIER_PRESETS.find((p) => p.id === "collegiate");
      expect(collegiate).toBeDefined();
      expect(collegiate?.tiers).toHaveLength(3);
      expect(collegiate?.tiers.map((t) => t.id)).toEqual(["general", "student", "school"]);
    });
  });

  describe("2. Automatic Age Tier Matching (findMatchingAgeTier)", () => {
    const sampleTiers: AgeTierPricing[] = [
      { id: "adult", label: "Adult (18–59 yrs)", min_age: 18, max_age: 59, price: 499, is_free: false, badge_label: "ADULT" },
      { id: "child", label: "Child (5–12 yrs)", min_age: 5, max_age: 12, price: 199, is_free: false, badge_label: "CHILD" },
      { id: "teen", label: "Teen (13–17 yrs)", min_age: 13, max_age: 17, price: 299, is_free: false, badge_label: "TEEN" },
      { id: "senior", label: "Senior Citizen (60+ yrs)", min_age: 60, max_age: null, price: 249, is_free: false, badge_label: "SENIOR" },
      { id: "infant", label: "Infant (<5 yrs)", min_age: 0, max_age: 4, price: 0, is_free: true, badge_label: "INFANT" },
    ];

    it("matches exact brackets based on raw age number without attendee configuration", () => {
      expect(findMatchingAgeTier(28, sampleTiers)?.id).toBe("adult");
      expect(findMatchingAgeTier(18, sampleTiers)?.id).toBe("adult");
      expect(findMatchingAgeTier(59, sampleTiers)?.id).toBe("adult");

      expect(findMatchingAgeTier(7, sampleTiers)?.id).toBe("child");
      expect(findMatchingAgeTier(15, sampleTiers)?.id).toBe("teen");
      expect(findMatchingAgeTier(65, sampleTiers)?.id).toBe("senior");
      expect(findMatchingAgeTier(2, sampleTiers)?.id).toBe("infant");
      expect(findMatchingAgeTier(0, sampleTiers)?.id).toBe("infant");
    });

    it("falls back to default first tier when age is null, undefined, or empty", () => {
      expect(findMatchingAgeTier(null, sampleTiers)?.id).toBe("adult");
      expect(findMatchingAgeTier(undefined, sampleTiers)?.id).toBe("adult");
      expect(findMatchingAgeTier(NaN, sampleTiers)?.id).toBe("adult");
    });
  });

  describe("3. Ticket Type Schema with Age-Wise Pricing & Extra Member Config", () => {
    it("parses valid ticket tier with age-wise pricing enabled", () => {
      const input: TicketTypeInput = ticketTypeSchema.parse({
        name: "Corporate Summit VIP",
        category: "vip",
        price: 999,
        age_pricing_enabled: true,
        age_tiers: [
          { id: "exec", label: "Executive (25+ yrs)", min_age: 25, price: 999, is_free: false, badge_label: "EXEC" },
          { id: "intern", label: "Intern / Student (<25 yrs)", min_age: 0, max_age: 24, price: 499, is_free: false, badge_label: "INTERN" },
        ],
        is_group_pass: true,
        included_guests: 1,
        allow_extra_guests: true,
        extra_guest_price: 350,
        max_extra_guests: 4,
        extra_member_pricing_mode: "age_based",
      });

      expect(input.age_pricing_enabled).toBe(true);
      expect(input.age_tiers).toHaveLength(2);
      expect(input.extra_member_pricing_mode).toBe("age_based");
      expect(input.max_extra_guests).toBe(4);
    });

    it("handles default values for backward compatibility", () => {
      const input = ticketTypeSchema.parse({
        name: "General Admission",
        price: 199,
      });

      expect(input.age_pricing_enabled).toBe(false);
      expect(input.age_tiers).toEqual([]);
      expect(input.is_group_pass).toBe(false);
      expect(input.included_guests).toBe(1);
      expect(input.allow_extra_guests).toBe(false);
      expect(input.extra_guest_price).toBe(0);
      expect(input.extra_member_pricing_mode).toBe("flat");
    });
  });

  describe("4. Pricing Engine Calculations (Automatic Matching from Attendee Age)", () => {
    // Helper function mirroring authoritative server-side calculation in /api/razorpay/ticket-order
    function calculateServerSideOrderPrice(params: {
      ticketType: {
        price: number; // in paise
        age_pricing_enabled?: boolean;
        age_tiers?: Array<{ id: string; label: string; min_age?: number | null; max_age?: number | null; price: number; is_free?: boolean }>; // in paise
        included_guests?: number;
        min_guests?: number;
        max_guests?: number;
        allow_extra_guests?: boolean;
        extra_guest_price?: number; // in rupees
        max_extra_guests?: number;
        extra_member_pricing_mode?: "flat" | "age_based";
      };
      requestedGuests: number;
      buyerAge?: number;
      primaryAgeTierId?: string;
      groupMembers?: Array<{ name: string; age?: number; ageTierId?: string }>;
    }) {
      const { ticketType, requestedGuests, buyerAge, primaryAgeTierId, groupMembers } = params;
      const includedGuests = Number(ticketType.included_guests || 1);
      const minGuests = Number(ticketType.min_guests || 1);
      const allowExtra = Boolean(ticketType.allow_extra_guests);
      const maxGuests = Number(ticketType.max_guests || (allowExtra ? 20 : includedGuests));
      const clampedGuests = Math.max(minGuests, Math.min(requestedGuests, maxGuests));

      // 1. Primary Attendee Base Price (Auto-matched from buyerAge)
      let basePricePaise = Number(ticketType.price);
      let resolvedAgeTierId: string | null = null;
      let resolvedAgeTierLabel: string | null = null;

      if (ticketType.age_pricing_enabled && Array.isArray(ticketType.age_tiers) && ticketType.age_tiers.length > 0) {
        const matchedTier =
          buyerAge !== undefined && buyerAge !== null && !isNaN(buyerAge)
            ? findMatchingAgeTier(Number(buyerAge), ticketType.age_tiers)
            : (primaryAgeTierId && ticketType.age_tiers.find((t) => t.id === primaryAgeTierId)) || ticketType.age_tiers[0];

        if (matchedTier) {
          basePricePaise = matchedTier.is_free ? 0 : Number(matchedTier.price || 0);
          resolvedAgeTierId = matchedTier.id;
          resolvedAgeTierLabel = matchedTier.label;
        }
      }

      // 2. Extra Members Price (Auto-matched from guest age)
      const extraGuestsCount = allowExtra ? Math.max(0, clampedGuests - includedGuests) : 0;
      let extraAmountPaise = 0;

      if (extraGuestsCount > 0) {
        if (ticketType.extra_member_pricing_mode === "age_based" && Array.isArray(groupMembers) && groupMembers.length > 1) {
          for (let i = 1; i < groupMembers.length && i <= clampedGuests; i++) {
            const member = groupMembers[i];
            const memberTier =
              member.age !== undefined && member.age !== null && !isNaN(member.age)
                ? findMatchingAgeTier(Number(member.age), ticketType.age_tiers)
                : member.ageTierId
                ? ticketType.age_tiers?.find((t) => t.id === member.ageTierId)
                : null;

            if (memberTier) {
              extraAmountPaise += memberTier.is_free ? 0 : Number(memberTier.price || 0);
            } else {
              extraAmountPaise += Math.round(Number(ticketType.extra_guest_price || 0) * 100);
            }
          }
        } else {
          const extraPriceRupees = Number(ticketType.extra_guest_price || 0);
          const extraGuestsAmountRupees = extraGuestsCount * extraPriceRupees;
          extraAmountPaise = Math.round(extraGuestsAmountRupees * 100);
        }
      }

      const totalAmountPaise = basePricePaise + extraAmountPaise;
      return {
        basePricePaise,
        extraAmountPaise,
        totalAmountPaise,
        totalAmountRupees: totalAmountPaise / 100,
        extraGuestsCount,
        totalAttendeeCount: clampedGuests,
        resolvedAgeTierId,
        resolvedAgeTierLabel,
      };
    }

    const standardTicketType = {
      price: 50000,
      age_pricing_enabled: true,
      age_tiers: [
        { id: "adult", label: "Adult (18–59 yrs)", min_age: 18, max_age: 59, price: 50000, is_free: false },
        { id: "child", label: "Child (5–12 yrs)", min_age: 5, max_age: 12, price: 20000, is_free: false },
        { id: "senior", label: "Senior (60+ yrs)", min_age: 60, max_age: null, price: 30000, is_free: false },
        { id: "infant", label: "Infant (<5 yrs)", min_age: 0, max_age: 4, price: 0, is_free: true },
      ],
      included_guests: 1,
      allow_extra_guests: true,
      extra_guest_price: 250,
      max_guests: 8,
      extra_member_pricing_mode: "age_based" as const,
    };

    it("automatically matches buyer age to tier and applies correct rate", () => {
      // Adult buyer (age 30)
      const resAdult = calculateServerSideOrderPrice({
        ticketType: standardTicketType,
        requestedGuests: 1,
        buyerAge: 30,
      });
      expect(resAdult.resolvedAgeTierId).toBe("adult");
      expect(resAdult.totalAmountRupees).toBe(500);

      // Senior buyer (age 68)
      const resSenior = calculateServerSideOrderPrice({
        ticketType: standardTicketType,
        requestedGuests: 1,
        buyerAge: 68,
      });
      expect(resSenior.resolvedAgeTierId).toBe("senior");
      expect(resSenior.totalAmountRupees).toBe(300);

      // Infant (<5 yrs)
      const resInfant = calculateServerSideOrderPrice({
        ticketType: standardTicketType,
        requestedGuests: 1,
        buyerAge: 3,
      });
      expect(resInfant.resolvedAgeTierId).toBe("infant");
      expect(resInfant.totalAmountRupees).toBe(0);
    });

    it("calculates multi-attendee booking where attendee enters only age numbers", () => {
      // Primary: Adult (Age 35) -> ₹500
      // Guest 1: Senior (Age 65) -> ₹300
      // Guest 2: Child (Age 8) -> ₹200
      // Guest 3: Infant (Age 2) -> ₹0 (Free)
      // Total: 500 + 300 + 200 + 0 = ₹1,000 (100,000 paise)
      const res = calculateServerSideOrderPrice({
        ticketType: standardTicketType,
        requestedGuests: 4,
        buyerAge: 35,
        groupMembers: [
          { name: "Parent", age: 35 },
          { name: "Grandparent", age: 65 },
          { name: "Kid", age: 8 },
          { name: "Baby", age: 2 },
        ],
      });

      expect(res.basePricePaise).toBe(50000);
      expect(res.extraGuestsCount).toBe(3);
      expect(res.extraAmountPaise).toBe(50000); // 30000 + 20000 + 0
      expect(res.totalAmountPaise).toBe(100000);
      expect(res.totalAmountRupees).toBe(1000);
      expect(res.totalAttendeeCount).toBe(4);
    });

    it("supports flat extra member rate configured by organizer", () => {
      const flatTicketType = {
        price: 40000, // ₹400
        included_guests: 1,
        allow_extra_guests: true,
        extra_guest_price: 150, // ₹150 flat
        max_guests: 5,
        extra_member_pricing_mode: "flat" as const,
      };

      const res = calculateServerSideOrderPrice({
        ticketType: flatTicketType,
        requestedGuests: 3,
      });

      expect(res.basePricePaise).toBe(40000);
      expect(res.extraGuestsCount).toBe(2);
      expect(res.extraAmountPaise).toBe(30000);
      expect(res.totalAmountRupees).toBe(700);
    });
  });
});
