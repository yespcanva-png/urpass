/**
 * UrPass Group & Family Passes Engine
 * 
 * Implements Pass Types + Duration Variants + Included Guests + Extra Guest Pricing
 * Formula: Total = Base Pass Price + max(0, Number of People - Included People) × Extra Person Price
 * Capacity: Consumes `total_attendee_count` units (e.g. 1 Family Pass with 6 people = 6 capacity units)
 */

export interface GroupPassConfig {
  id?: string;
  name: string; // "Single Person" | "Couple" | "Family" | "VIP" | string
  duration: string; // "1 Day" | "3 Days" | string
  durationDays: number; // 1 | 3
  basePrice: number; // in rupees (e.g. 199, 449, 1049)
  includedGuests: number; // e.g. 1, 2, 4
  minGuests: number; // e.g. 1, 2, 4
  maxGuests: number; // e.g. 1, 2, 10
  allowExtraGuests: boolean; // true for Family, false for Single/Couple/VIP
  extraGuestPrice: number; // in rupees, e.g. 100
  maxExtraGuests?: number; // e.g. 6 (allowing 4 + 6 = 10 max)
  passValidity?: string; // "1 Day" | "3 Days" | "Full Event"
  accessType?: "GENERAL" | "VIP" | "ALL_ACCESS";
  description?: string;
}

export interface GroupPassPriceCalculation {
  passName: string;
  duration: string;
  durationDays: number;
  basePrice: number;
  includedGuests: number;
  selectedGuests: number;
  extraGuestsCount: number;
  extraGuestPrice: number;
  extraGuestsTotal: number;
  totalAmount: number; // in rupees
  totalAmountPaise: number; // in integer paise (₹549 = 54900 paise)
  capacityUnitsConsumed: number; // e.g. 6 people = 6 capacity units
  ticketQuantity: number; // Always 1 for 1 pass
}

export interface GroupMember {
  name: string;
  phone?: string;
  email?: string;
  role?: "primary" | "member";
  checkedIn?: boolean;
  checkedInAt?: string;
}

export interface GroupPassRecord {
  id: string;
  passToken: string;
  orderId?: string;
  eventId: string;
  passName: string;
  duration: string;
  durationDays: number;
  basePrice: number;
  totalAmount: number;
  totalGuests: number;
  checkedInGuests: number;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  members: GroupMember[];
  status: "VALID" | "CHECKED_IN" | "PARTIALLY_CHECKED_IN" | "REFUNDED" | "CANCELLED";
  qrCodePayload: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Standard UrPass Event Pass Matrix
 */
export const EVENT_PASS_MATRIX: GroupPassConfig[] = [
  {
    name: "Single Person",
    duration: "1 Day",
    durationDays: 1,
    basePrice: 199,
    includedGuests: 1,
    minGuests: 1,
    maxGuests: 1,
    allowExtraGuests: false,
    extraGuestPrice: 0,
    maxExtraGuests: 0,
    passValidity: "1 Day",
    accessType: "GENERAL",
    description: "Single attendee entry for 1 Day.",
  },
  {
    name: "Single Person",
    duration: "3 Days",
    durationDays: 3,
    basePrice: 449,
    includedGuests: 1,
    minGuests: 1,
    maxGuests: 1,
    allowExtraGuests: false,
    extraGuestPrice: 0,
    maxExtraGuests: 0,
    passValidity: "3 Days",
    accessType: "GENERAL",
    description: "Single attendee full-event access for all 3 Days.",
  },
  {
    name: "Couple",
    duration: "1 Day",
    durationDays: 1,
    basePrice: 249,
    includedGuests: 2,
    minGuests: 2,
    maxGuests: 2,
    allowExtraGuests: false,
    extraGuestPrice: 0,
    maxExtraGuests: 0,
    passValidity: "1 Day",
    accessType: "GENERAL",
    description: "Admits exactly 2 people for 1 Day.",
  },
  {
    name: "Couple",
    duration: "3 Days",
    durationDays: 3,
    basePrice: 549,
    includedGuests: 2,
    minGuests: 2,
    maxGuests: 2,
    allowExtraGuests: false,
    extraGuestPrice: 0,
    maxExtraGuests: 0,
    passValidity: "3 Days",
    accessType: "GENERAL",
    description: "Admits exactly 2 people for all 3 Days.",
  },
  {
    name: "Family",
    duration: "1 Day",
    durationDays: 1,
    basePrice: 449,
    includedGuests: 4,
    minGuests: 4,
    maxGuests: 10,
    allowExtraGuests: true,
    extraGuestPrice: 100,
    maxExtraGuests: 6,
    passValidity: "1 Day",
    accessType: "GENERAL",
    description: "Includes up to 4 people. ₹100 for each additional person up to 10.",
  },
  {
    name: "Family",
    duration: "3 Days",
    durationDays: 3,
    basePrice: 1049,
    includedGuests: 4,
    minGuests: 4,
    maxGuests: 10,
    allowExtraGuests: true,
    extraGuestPrice: 100,
    maxExtraGuests: 6,
    passValidity: "3 Days",
    accessType: "GENERAL",
    description: "Includes up to 4 people for all 3 Days. ₹100 for each additional person up to 10.",
  },
  {
    name: "VIP",
    duration: "1 Day",
    durationDays: 1,
    basePrice: 599,
    includedGuests: 1,
    minGuests: 1,
    maxGuests: 1,
    allowExtraGuests: false,
    extraGuestPrice: 0,
    maxExtraGuests: 0,
    passValidity: "1 Day",
    accessType: "VIP",
    description: "Fast-track VIP access for 1 Day.",
  },
  {
    name: "VIP",
    duration: "3 Days",
    durationDays: 3,
    basePrice: 999,
    includedGuests: 1,
    minGuests: 1,
    maxGuests: 1,
    allowExtraGuests: false,
    extraGuestPrice: 0,
    maxExtraGuests: 0,
    passValidity: "3 Days",
    accessType: "VIP",
    description: "Fast-track VIP access for all 3 Days.",
  },
];

/**
 * Server-Side Authoritative Group Pass Price Calculator
 * 
 * Formula:
 * Total = Base Pass Price + max(0, Number of People - Included People) × Extra Person Price
 */
export function calculateGroupPassPrice(
  passConfig: GroupPassConfig,
  numberOfPeople: number
): GroupPassPriceCalculation {
  // Clamp number of people within configured bounds
  const clampedPeople = Math.max(
    passConfig.minGuests,
    Math.min(numberOfPeople, passConfig.maxGuests)
  );

  // Extra guests calculation
  const extraGuestsCount = passConfig.allowExtraGuests
    ? Math.max(0, clampedPeople - passConfig.includedGuests)
    : 0;

  const extraGuestsTotal = extraGuestsCount * passConfig.extraGuestPrice;
  const totalAmount = passConfig.basePrice + extraGuestsTotal;
  const totalAmountPaise = Math.round(totalAmount * 100);

  return {
    passName: passConfig.name,
    duration: passConfig.duration,
    durationDays: passConfig.durationDays,
    basePrice: passConfig.basePrice,
    includedGuests: passConfig.includedGuests,
    selectedGuests: clampedPeople,
    extraGuestsCount,
    extraGuestPrice: passConfig.extraGuestPrice,
    extraGuestsTotal,
    totalAmount,
    totalAmountPaise,
    capacityUnitsConsumed: clampedPeople, // Critical: 6 people consume 6 capacity units
    ticketQuantity: 1, // 1 pass issued
  };
}

/**
 * Finds a pass configuration by name and duration from the matrix or a custom list
 */
export function findPassConfig(
  passName: string,
  duration: string,
  customList: GroupPassConfig[] = EVENT_PASS_MATRIX
): GroupPassConfig | null {
  const normName = passName.trim().toLowerCase();
  const normDuration = duration.trim().toLowerCase();

  return (
    customList.find(
      (p) =>
        p.name.trim().toLowerCase() === normName &&
        p.duration.trim().toLowerCase() === normDuration
    ) || null
  );
}

/**
 * Sanitizes and formats group members from raw submission
 */
export function sanitizeGroupMembers(
  primaryContact: { name: string; email: string; phone?: string },
  additionalMembers: Array<{ name: string; phone?: string; email?: string }>,
  totalExpectedGuests: number
): GroupMember[] {
  const members: GroupMember[] = [];

  // Member 1 is the Primary Contact
  members.push({
    name: primaryContact.name.trim(),
    email: primaryContact.email.trim().toLowerCase(),
    phone: primaryContact.phone?.trim() || undefined,
    role: "primary",
    checkedIn: false,
  });

  // Additional members
  for (let i = 0; i < additionalMembers.length; i++) {
    if (members.length >= totalExpectedGuests) break;
    const m = additionalMembers[i];
    const name = m.name?.trim();
    if (name) {
      members.push({
        name,
        phone: m.phone?.trim() || undefined,
        email: m.email?.trim()?.toLowerCase() || undefined,
        role: "member",
        checkedIn: false,
      });
    }
  }

  // If user selected e.g. 4 people but only typed 2 names, pad with guest placeholders
  while (members.length < totalExpectedGuests) {
    members.push({
      name: `Guest ${members.length + 1}`,
      role: "member",
      checkedIn: false,
    });
  }

  return members;
}

/**
 * Encodes Group Pass QR Payload
 */
export function createGroupPassQRPayload(pass: {
  passToken: string;
  passName: string;
  duration: string;
  totalGuests: number;
  holderName: string;
}): string {
  return JSON.stringify({
    v: 1,
    type: "GROUP_PASS",
    token: pass.passToken,
    pass: pass.passName,
    dur: pass.duration,
    cap: pass.totalGuests,
    h: pass.holderName,
  });
}
