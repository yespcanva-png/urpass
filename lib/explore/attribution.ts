import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { adminClient } from "@/lib/supabase/admin";

const COOKIE = "urpass_explore_ref";
const SESSION = "urpass_explore_session";
const ttlSeconds = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.EXPLORE_ATTRIBUTION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value || value.length < 32) throw new Error("Explore attribution secret is not configured.");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export async function setExploreReferral(eventId: string) {
  const jar = await cookies();
  const issued = Date.now();
  const value = `${eventId}.${issued}`;
  jar.set(COOKIE, `${value}.${sign(value)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: ttlSeconds });
  if (!jar.get(SESSION)?.value) jar.set(SESSION, randomBytes(24).toString("hex"), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: ttlSeconds,
  });
}

export async function hasExploreReferral(eventId: string) {
  try {
    const raw = (await cookies()).get(COOKIE)?.value;
    if (!raw) return false;
    const parts = raw.split(".");
    if (parts.length !== 3 || parts[0] !== eventId || !Number.isFinite(Number(parts[1]))) return false;
    if (Date.now() - Number(parts[1]) > ttlSeconds * 1000 || Number(parts[1]) > Date.now()) return false;
    const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`), "hex");
    const received = Buffer.from(parts[2], "hex");
    return expected.length === received.length && timingSafeEqual(expected, received);
  } catch { return false; }
}

export async function recordExploreInteraction(eventId: string, eventType: "detail_view" | "ticket_selection" | "registration_start") {
  const jar = await cookies();
  const session = jar.get(SESSION)?.value;
  if (!session || !await hasExploreReferral(eventId)) return;
  const sessionHash = createHmac("sha256", secret()).update(session).digest("hex");
  await adminClient().from("explore_interactions").upsert({
    event_id: eventId, event_type: eventType, session_hash: sessionHash,
    event_day: new Date().toISOString().slice(0, 10),
  }, { onConflict: "event_id,event_type,session_hash,event_day", ignoreDuplicates: true });
}

export async function recordExploreBooking(eventId: string, attendeeId: string, providerOrderId?: string | null, confirmed = true) {
  if (!await hasExploreReferral(eventId)) return;
  await adminClient().from("explore_booking_attributions").upsert({
    attendee_id: attendeeId, event_id: eventId, source: "explore",
    provider_order_id: providerOrderId || null, confirmed_at: confirmed ? new Date().toISOString() : null,
  }, { onConflict: "attendee_id", ignoreDuplicates: true });
}

export async function confirmExploreBooking(attendeeId: string) {
  await adminClient().from("explore_booking_attributions")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("attendee_id", attendeeId).is("confirmed_at", null);
}
