import type { EventBooth, BoothStatus } from "./types";
import { getAdminClient } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_booths: Record<string, EventBooth[]> | undefined;
}

if (!globalThis.__urpass_booths) {
  globalThis.__urpass_booths = {};
}

export const DEFAULT_PRESET_BOOTHS = [
  { boothNumber: "A-101", sizeSqft: 100, hallName: "Main Expo Pavilion", status: "available" as const },
  { boothNumber: "A-102", sizeSqft: 100, hallName: "Main Expo Pavilion", status: "available" as const },
  { boothNumber: "A-103", sizeSqft: 150, hallName: "Main Expo Pavilion", status: "available" as const },
  { boothNumber: "B-201", sizeSqft: 200, hallName: "Hall 2 Innovation Zone", status: "available" as const },
  { boothNumber: "B-202", sizeSqft: 200, hallName: "Hall 2 Innovation Zone", status: "available" as const },
  { boothNumber: "VIP-01", sizeSqft: 400, hallName: "Grand Atrium Center", status: "available" as const },
];

export function getEventBooths(eventId: string): EventBooth[] {
  const store = globalThis.__urpass_booths!;
  if (store[eventId] === undefined) {
    const now = new Date().toISOString();
    store[eventId] = DEFAULT_PRESET_BOOTHS.map((b, idx) => ({
      id: `booth-${eventId}-${b.boothNumber.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      eventId,
      boothNumber: b.boothNumber,
      sizeSqft: b.sizeSqft,
      hallName: b.hallName,
      status: b.status,
      position: idx,
      createdAt: now,
      updatedAt: now,
    }));
  }
  return store[eventId];
}

export async function getEventBoothsDb(eventId: string): Promise<EventBooth[]> {
  const admin = getAdminClient();
  if (!admin) return getEventBooths(eventId);

  try {
    const { data, error } = await admin
      .from("event_booths")
      .select(`
        id,
        event_id,
        booth_number,
        size_sqft,
        hall_name,
        zone_id,
        status,
        notes,
        position,
        created_at,
        updated_at
      `)
      .eq("event_id", eventId)
      .order("position", { ascending: true });

    if (error || !data) return getEventBooths(eventId);

    if (data.length === 0) {
      globalThis.__urpass_booths![eventId] = [];
      return [];
    }

    // Query exhibitors to match assigned booth
    const { data: exhibitors } = await admin
      .from("event_exhibitors")
      .select("id, company_name, booth_id")
      .eq("event_id", eventId);

    const boothToExhibitor = new Map<string, { id: string; name: string }>();
    (exhibitors || []).forEach((e) => {
      if (e.booth_id) boothToExhibitor.set(e.booth_id, { id: e.id, name: e.company_name });
    });

    const mapped: EventBooth[] = data.map((row: any) => {
      const assigned = boothToExhibitor.get(row.id);
      return {
        id: row.id,
        eventId: row.event_id,
        boothNumber: row.booth_number,
        sizeSqft: Number(row.size_sqft),
        hallName: row.hall_name,
        zoneId: row.zone_id || undefined,
        status: assigned ? "occupied" : (row.status as BoothStatus),
        notes: row.notes || undefined,
        assignedExhibitorId: assigned?.id,
        assignedExhibitorName: assigned?.name,
        position: row.position || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });

    globalThis.__urpass_booths![eventId] = mapped;
    return mapped;
  } catch (err) {
    console.warn("[booth-service] Error reading booths from DB:", err);
    return getEventBooths(eventId);
  }
}

export function saveEventBooth(
  booth: Partial<EventBooth> & { eventId: string; boothNumber: string }
): EventBooth {
  const store = globalThis.__urpass_booths!;
  const list = getEventBooths(booth.eventId);
  const now = new Date().toISOString();

  if (booth.id) {
    const idx = list.findIndex((b) => b.id === booth.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...booth, updatedAt: now };
      store[booth.eventId] = list;
      return list[idx];
    }
  }

  const newBooth: EventBooth = {
    id: booth.id || `booth-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: booth.eventId,
    boothNumber: booth.boothNumber,
    sizeSqft: booth.sizeSqft || 100,
    hallName: booth.hallName || "Main Exhibition Hall",
    zoneId: booth.zoneId,
    status: booth.status || "available",
    notes: booth.notes,
    assignedExhibitorId: booth.assignedExhibitorId,
    assignedExhibitorName: booth.assignedExhibitorName,
    position: list.length,
    createdAt: now,
    updatedAt: now,
  };

  list.push(newBooth);
  store[booth.eventId] = list;
  return newBooth;
}

export async function saveEventBoothDb(
  booth: Partial<EventBooth> & { eventId: string; boothNumber: string }
): Promise<EventBooth> {
  const local = saveEventBooth(booth);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: booth.eventId,
      booth_number: booth.boothNumber,
      size_sqft: booth.sizeSqft || 100,
      hall_name: booth.hallName || "Main Exhibition Hall",
      zone_id: booth.zoneId || null,
      status: booth.status || "available",
      notes: booth.notes || null,
      updated_at: new Date().toISOString(),
    };

    if (booth.id && !booth.id.startsWith("booth-")) {
      await admin.from("event_booths").update(payload).eq("id", booth.id);
    } else {
      const { data } = await admin.from("event_booths").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[booth-service] Error saving booth to DB:", err);
  }

  return local;
}

export function deleteEventBooth(eventId: string, boothId: string): boolean {
  const store = globalThis.__urpass_booths!;
  const list = getEventBooths(eventId);
  store[eventId] = list.filter((b) => b.id !== boothId);
  return true;
}

export async function deleteEventBoothDb(eventId: string, boothId: string): Promise<boolean> {
  deleteEventBooth(eventId, boothId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("event_booths").delete().eq("id", boothId);
    return true;
  } catch (err) {
    console.warn("[booth-service] Error deleting booth from DB:", err);
    return false;
  }
}
