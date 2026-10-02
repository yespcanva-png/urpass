import type { VenueFloorPlan, FloorPlanMarker, MarkerType } from "./types";
import { getAdminClient } from "./db";

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

export async function getFloorPlansDb(eventId: string): Promise<VenueFloorPlan[]> {
  const admin = getAdminClient();
  if (!admin) return getFloorPlans(eventId);

  try {
    const { data, error } = await admin
      .from("venue_floor_plans")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      const defaultPlan = createDefaultFloorPlan(eventId);
      const { data: inserted } = await admin
        .from("venue_floor_plans")
        .insert({
          event_id: eventId,
          name: defaultPlan.name,
          width_px: defaultPlan.widthPx,
          height_px: defaultPlan.heightPx,
          markers_json: defaultPlan.markers,
          is_active: true,
        })
        .select()
        .single();

      if (inserted) {
        const seeded: VenueFloorPlan = {
          id: inserted.id,
          eventId: inserted.event_id,
          name: inserted.name,
          imageUrl: inserted.image_url || undefined,
          widthPx: inserted.width_px,
          heightPx: inserted.height_px,
          markers: inserted.markers_json || [],
          isActive: inserted.is_active,
          createdAt: inserted.created_at,
          updatedAt: inserted.updated_at,
        };
        globalThis.__urpass_floor_plans![eventId] = [seeded];
        return [seeded];
      }
      return getFloorPlans(eventId);
    }

    const plans: VenueFloorPlan[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      name: d.name,
      imageUrl: d.image_url || undefined,
      widthPx: d.width_px,
      heightPx: d.height_px,
      markers: d.markers_json || [],
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    globalThis.__urpass_floor_plans![eventId] = plans;
    return plans;
  } catch (err) {
    console.warn("[floor-plan-service] Error reading floor plans from DB:", err);
    return getFloorPlans(eventId);
  }
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

export async function saveFloorPlanDb(plan: VenueFloorPlan): Promise<VenueFloorPlan> {
  const local = saveFloorPlan(plan);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: plan.eventId,
      name: plan.name,
      image_url: plan.imageUrl || null,
      width_px: plan.widthPx,
      height_px: plan.heightPx,
      markers_json: plan.markers,
      is_active: plan.isActive,
      updated_at: new Date().toISOString(),
    };

    if (plan.id && !plan.id.startsWith("plan-")) {
      await admin.from("venue_floor_plans").update(payload).eq("id", plan.id);
    } else {
      const { data } = await admin.from("venue_floor_plans").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[floor-plan-service] Error saving floor plan to DB:", err);
  }

  return local;
}

export async function addMarkerDb(eventId: string, marker: FloorPlanMarker): Promise<VenueFloorPlan> {
  const plans = await getFloorPlansDb(eventId);
  const plan = plans[0] || createDefaultFloorPlan(eventId);
  const updatedMarkers = [...plan.markers, marker];
  const updatedPlan = { ...plan, markers: updatedMarkers };
  return saveFloorPlanDb(updatedPlan);
}

export async function deleteMarkerDb(eventId: string, markerId: string): Promise<VenueFloorPlan> {
  const plans = await getFloorPlansDb(eventId);
  const plan = plans[0] || createDefaultFloorPlan(eventId);
  const updatedMarkers = plan.markers.filter((m) => m.id !== markerId);
  const updatedPlan = { ...plan, markers: updatedMarkers };
  return saveFloorPlanDb(updatedPlan);
}
