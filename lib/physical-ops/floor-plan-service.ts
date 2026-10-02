import type { VenueFloorPlan, FloorPlanMarker, MarkerType } from "./types";

export const MARKER_TYPE_CONFIG: Record<
  MarkerType,
  { label: string; color: string; icon: string; defaultDetails: string }
> = {
  hall: {
    label: "Main Hall / Auditorium",
    color: "#6D28D9",
    icon: "Building2",
    defaultDetails: "Keynotes, panel discussions, and primary sessions",
  },
  booth: {
    label: "Exhibitor / Sponsor Booth",
    color: "#EC4899",
    icon: "Store",
    defaultDetails: "Product demos, company showcase, and swag",
  },
  zone: {
    label: "Access Zone",
    color: "#3B82F6",
    icon: "ShieldAlert",
    defaultDetails: "Restricted badge or ticket credential area",
  },
  gate: {
    label: "Entrance / Security Gate",
    color: "#10B981",
    icon: "DoorOpen",
    defaultDetails: "QR ticket scanner and security bag check",
  },
  registration_desk: {
    label: "Registration & Badge Desk",
    color: "#F59E0B",
    icon: "ClipboardCheck",
    defaultDetails: "Badge collection, walk-in tickets, and helpdesk",
  },
  food_area: {
    label: "Dining / Coffee / Catering",
    color: "#D97706",
    icon: "Coffee",
    defaultDetails: "Lunch buffets, snacks, and water stations",
  },
  emergency_exit: {
    label: "Emergency Exit / First Aid",
    color: "#EF4444",
    icon: "AlertOctagon",
    defaultDetails: "Designated fire exit path and medical station",
  },
};

export function createDefaultFloorPlan(eventId: string, eventName?: string): VenueFloorPlan {
  const now = new Date().toISOString();
  return {
    id: `plan-${eventId}-main`,
    eventId,
    name: `${eventName || "Venue"} Main Convention Hall`,
    widthPx: 1200,
    heightPx: 800,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    markers: [
      {
        id: "m-reg",
        type: "registration_desk",
        label: "Main Registration Desk & Badge Pickup",
        details: "Scan QR voucher, collect lanyard badge, and get lanyard pouch.",
        xPercent: 12,
        yPercent: 88,
        color: MARKER_TYPE_CONFIG.registration_desk.color,
      },
      {
        id: "m-gate-a",
        type: "gate",
        label: "Gate A (Main Entrance)",
        details: "Fast camera scan for general attendees.",
        xPercent: 8,
        yPercent: 50,
        color: MARKER_TYPE_CONFIG.gate.color,
      },
      {
        id: "m-hall-keynote",
        type: "hall",
        label: "Hall 1: Grand Keynote Auditorium",
        details: "Capacity: 800 people. Morning keynotes and awards ceremony.",
        xPercent: 45,
        yPercent: 35,
        color: MARKER_TYPE_CONFIG.hall.color,
      },
      {
        id: "m-vip-lounge",
        type: "zone",
        label: "VIP & Speaker Green Room",
        details: "Private networking, quiet desks, and refreshments. VIP Badge required.",
        xPercent: 82,
        yPercent: 25,
        color: MARKER_TYPE_CONFIG.zone.color,
      },
      {
        id: "m-booth-101",
        type: "booth",
        label: "Startup Expo Booth #101",
        details: "Yesp Corporation Innovation Showcase.",
        boothNumber: "101",
        xPercent: 42,
        yPercent: 75,
        color: MARKER_TYPE_CONFIG.booth.color,
      },
      {
        id: "m-food",
        type: "food_area",
        label: "Catering & Networking Pavilion",
        details: "Buffet lunch served from 12:30 PM to 2:30 PM.",
        xPercent: 80,
        yPercent: 78,
        color: MARKER_TYPE_CONFIG.food_area.color,
      },
      {
        id: "m-exit-north",
        type: "emergency_exit",
        label: "Emergency Exit North",
        details: "Keep clear at all times. Direct assembly point exit.",
        xPercent: 92,
        yPercent: 10,
        color: MARKER_TYPE_CONFIG.emergency_exit.color,
      },
    ],
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __urpass_floor_plans: Record<string, VenueFloorPlan[]> | undefined;
}

if (!globalThis.__urpass_floor_plans) {
  globalThis.__urpass_floor_plans = {};
}

export function getFloorPlans(eventId: string): VenueFloorPlan[] {
  const store = globalThis.__urpass_floor_plans!;
  if (!store[eventId] || store[eventId].length === 0) {
    store[eventId] = [createDefaultFloorPlan(eventId)];
  }
  return store[eventId];
}

export function saveFloorPlan(plan: VenueFloorPlan): VenueFloorPlan {
  const store = globalThis.__urpass_floor_plans!;
  const list = getFloorPlans(plan.eventId);
  const idx = list.findIndex((p) => p.id === plan.id);
  const updated = { ...plan, updatedAt: new Date().toISOString() };

  if (idx >= 0) {
    list[idx] = updated;
  } else {
    list.push(updated);
  }
  store[plan.eventId] = list;
  return updated;
}
