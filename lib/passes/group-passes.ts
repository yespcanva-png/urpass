/**
 * UrPass Group & Family Passes Engine
 * 
 * Implements Pass Types + Duration Variants + Included Guests + Extra Guest Pricing
 * 
 * Pricing Formula (Server-Side Authoritative):
 * Total = Base Pass Price + max(0, Number of People - Included People) × Extra Person Price
 * 
 * Capacity Principle:
 * A Family Pass for 6 people has:
 *   - Ticket Quantity = 1
 *   - Pass Capacity / Attendee Count = 6
 *   - Capacity Units Consumed = 6 (decrements venue capacity by 6, NOT 1)
 */

export interface GroupPassConfig {
  id?: string;
  name: string; // "Single Person" | "Couple" | "Family" | "VIP" | string
  duration: string; // "1 Day" | "3 Days" | string
  durationDays: number; // 1 | 3
  basePrice: number; // in rupees (e.g. 199, 249, 449, 549, 599, 999, 1049)
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
  totalAmount: number; // in rupees (e.g. ₹549)
  totalAmountPaise: number; // in integer paise (₹549 = 54900 paise)
  capacityUnitsConsumed: number; // 6 people = 6 capacity units
  ticketQuantity: number; // Always 1 for 1 pass issued
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
  totalGuests: number; // Pass capacity (e.g. 6 people)
  checkedInGuests: number; // Count of checked-in guests (0 to totalGuests)
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
  };
  members: GroupMember[];
  status: "VALID" | "CHECKED_IN" | "PARTIALLY_CHECKED_IN" | "REFUNDED" | "CANCELLED";
  qrCodePayload: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupPassCheckInResult {
  success: boolean;
  passId: string;
  passName: string;
  holderName: string;
  totalGuests: number;
  previouslyCheckedIn: number;
  newlyCheckedIn: number;
  checkedInGuests: number;
  remainingGuests: number;
  status: "VALID" | "CHECKED_IN" | "PARTIALLY_CHECKED_IN";
  message: string;
  error?: string;
}

export interface GroupPassSalesAnalytics {
  passesSold: number;
  totalAttendees: number;
  totalRevenueRupees: number;
  totalRevenuePaise: number;
  averageGroupSize: number;
}

/**
 * Standard UrPass Event Pass Matrix
 * 
 * | Pass Type     | Duration | Price  | Included People | Extra Person Rule |
 * |---------------|---------:|-------:|----------------:|------------------:|
 * | Single Person | 1 Day    | ₹199   | 1               | Not allowed       |
 * | Single Person | 3 Days   | ₹449   | 1               | Not allowed       |
 * | Couple        | 1 Day    | ₹249   | 2               | Not allowed       |
 * | Couple        | 3 Days   | ₹549   | 2               | Not allowed       |
 * | Family        | 1 Day    | ₹449   | 4               | ₹100/person       |
 * | Family        | 3 Days   | ₹1,049 | 4               | ₹100/person       |
 * | VIP           | 1 Day    | ₹599   | 1               | Not allowed       |
 * | VIP           | 3 Days   | ₹999   | 1               | Not allowed       |
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
    const name = m?.name?.trim();
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
      name: `Member ${members.length + 1}`,
      role: "member",
      checkedIn: false,
    });
  }

  return members;
}

/**
 * Encodes Group Pass QR Payload
 * Formats: Holder, People Count, Validity, Pass Type
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

/**
 * Parses and validates a Group Pass QR Payload
 */
export function parseGroupPassQRPayload(rawPayload: string): {
  isValid: boolean;
  passToken?: string;
  passName?: string;
  duration?: string;
  totalGuests?: number;
  holderName?: string;
} {
  try {
    const parsed = JSON.parse(rawPayload);
    if (parsed && (parsed.type === "GROUP_PASS" || parsed.token)) {
      return {
        isValid: true,
        passToken: parsed.token,
        passName: parsed.pass,
        duration: parsed.dur,
        totalGuests: Number(parsed.cap || 1),
        holderName: parsed.h,
      };
    }
  } catch {
    // Fallback: If raw QR is plain token string
    if (rawPayload && typeof rawPayload === "string" && rawPayload.trim().length > 0) {
      return {
        isValid: true,
        passToken: rawPayload.trim(),
        totalGuests: 1,
      };
    }
  }

  return { isValid: false };
}

/**
 * Group Check-In Logic:
 * Performs atomic single-QR or partial member check-in for group passes.
 */
export function performGroupCheckIn(
  record: GroupPassRecord,
  options: {
    checkInAll?: boolean;
    guestCountToCheckIn?: number;
    memberIndex?: number;
  } = {}
): GroupPassCheckInResult {
  const previouslyCheckedIn = record.checkedInGuests || 0;
  const totalGuests = record.totalGuests || 1;

  if (previouslyCheckedIn >= totalGuests) {
    return {
      success: false,
      passId: record.id,
      passName: record.passName,
      holderName: record.primaryContact.name,
      totalGuests,
      previouslyCheckedIn,
      newlyCheckedIn: 0,
      checkedInGuests: previouslyCheckedIn,
      remainingGuests: 0,
      status: "CHECKED_IN",
      message: `All ${totalGuests} attendees on this pass are already checked in.`,
      error: "ALL_GUESTS_ALREADY_CHECKED_IN",
    };
  }

  let countToAdmit = 0;
  const now = new Date().toISOString();
  const updatedMembers = [...(record.members || [])];

  if (options.checkInAll) {
    // Check in all remaining members
    countToAdmit = totalGuests - previouslyCheckedIn;
    for (let i = 0; i < updatedMembers.length; i++) {
      if (!updatedMembers[i].checkedIn) {
        updatedMembers[i] = {
          ...updatedMembers[i],
          checkedIn: true,
          checkedInAt: now,
        };
      }
    }
  } else if (typeof options.memberIndex === "number") {
    // Check in single specific member by index
    const idx = options.memberIndex;
    if (idx >= 0 && idx < updatedMembers.length) {
      if (updatedMembers[idx].checkedIn) {
        return {
          success: false,
          passId: record.id,
          passName: record.passName,
          holderName: record.primaryContact.name,
          totalGuests,
          previouslyCheckedIn,
          newlyCheckedIn: 0,
          checkedInGuests: previouslyCheckedIn,
          remainingGuests: totalGuests - previouslyCheckedIn,
          status: previouslyCheckedIn > 0 ? "PARTIALLY_CHECKED_IN" : "VALID",
          message: `${updatedMembers[idx].name} is already checked in.`,
          error: "MEMBER_ALREADY_CHECKED_IN",
        };
      }
      updatedMembers[idx] = {
        ...updatedMembers[idx],
        checkedIn: true,
        checkedInAt: now,
      };
      countToAdmit = 1;
    }
  } else if (typeof options.guestCountToCheckIn === "number" && options.guestCountToCheckIn > 0) {
    // Check in specified number of guests
    countToAdmit = Math.min(options.guestCountToCheckIn, totalGuests - previouslyCheckedIn);
    let admitted = 0;
    for (let i = 0; i < updatedMembers.length && admitted < countToAdmit; i++) {
      if (!updatedMembers[i].checkedIn) {
        updatedMembers[i] = {
          ...updatedMembers[i],
          checkedIn: true,
          checkedInAt: now,
        };
        admitted++;
      }
    }
  } else {
    // Default Stage 1 behavior: One QR checks in the entire group
    countToAdmit = totalGuests - previouslyCheckedIn;
    for (let i = 0; i < updatedMembers.length; i++) {
      if (!updatedMembers[i].checkedIn) {
        updatedMembers[i] = {
          ...updatedMembers[i],
          checkedIn: true,
          checkedInAt: now,
        };
      }
    }
  }

  const finalCheckedIn = previouslyCheckedIn + countToAdmit;
  const newStatus = finalCheckedIn >= totalGuests ? "CHECKED_IN" : "PARTIALLY_CHECKED_IN";

  record.checkedInGuests = finalCheckedIn;
  record.members = updatedMembers;
  record.status = newStatus;
  record.updatedAt = now;

  return {
    success: true,
    passId: record.id,
    passName: record.passName,
    holderName: record.primaryContact.name,
    totalGuests,
    previouslyCheckedIn,
    newlyCheckedIn: countToAdmit,
    checkedInGuests: finalCheckedIn,
    remainingGuests: totalGuests - finalCheckedIn,
    status: newStatus,
    message:
      finalCheckedIn >= totalGuests
        ? `Successfully checked in all ${totalGuests} guests for ${record.passName}.`
        : `Successfully checked in ${countToAdmit} guest(s). ${totalGuests - finalCheckedIn} remaining.`,
  };
}

/**
 * Calculates Inventory & Sales Analytics for Group Passes
 * 
 * Capacity Principle:
 * `capacity_units = attendee_count`
 * 
 * Sales Analytics:
 * Passes Sold = 1
 * Attendees = 6
 * Revenue = ₹649
 */
export function calculateGroupPassSalesAnalytics(
  passes: Array<{
    totalGuests?: number;
    totalAmount?: number;
    basePrice?: number;
    status?: string;
  }>
): GroupPassSalesAnalytics {
  const activePasses = passes.filter((p) => p.status !== "REFUNDED" && p.status !== "CANCELLED");

  let passesSold = 0;
  let totalAttendees = 0;
  let totalRevenueRupees = 0;

  for (const p of activePasses) {
    passesSold += 1;
    totalAttendees += Number(p.totalGuests || 1);
    totalRevenueRupees += Number(p.totalAmount || p.basePrice || 0);
  }

  const totalRevenuePaise = Math.round(totalRevenueRupees * 100);
  const averageGroupSize = passesSold > 0 ? Number((totalAttendees / passesSold).toFixed(2)) : 0;

  return {
    passesSold,
    totalAttendees,
    totalRevenueRupees,
    totalRevenuePaise,
    averageGroupSize,
  };
}
