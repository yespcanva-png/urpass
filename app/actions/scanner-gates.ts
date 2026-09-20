"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ScannerGate {
  id: string;
  event_id: string;
  name: string;
  zone_id: string | null;
  position: number;
  created_at: string;
  zone: { name: string } | null;
}

export async function getEventGates(eventId: string): Promise<ScannerGate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scanner_gates")
    .select("id, event_id, name, zone_id, position, created_at, zone:event_zones(name)")
    .eq("event_id", eventId)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data as unknown as ScannerGate[];
}

export async function createGate(
  eventId: string,
  name: string,
  zoneId?: string
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Determine next position
  const { data: existing } = await supabase
    .from("scanner_gates")
    .select("position")
    .eq("event_id", eventId)
    .order("position", { ascending: false })
    .limit(1);
  const position = existing && existing.length > 0 ? (existing[0].position ?? 0) + 1 : 0;

  const { data: gate, error } = await supabase
    .from("scanner_gates")
    .insert({
      event_id: eventId,
      name: name.trim(),
      zone_id: zoneId ?? null,
      position,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/event/${eventId}/checkins`);
  return { id: gate.id };
}

export async function deleteGate(
  gateId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch gate to get event_id for revalidation
  const { data: gate } = await supabase
    .from("scanner_gates")
    .select("event_id")
    .eq("id", gateId)
    .single();

  if (!gate) return { error: "Gate not found." };

  const { error } = await supabase
    .from("scanner_gates")
    .delete()
    .eq("id", gateId);

  if (error) return { error: error.message };

  revalidatePath(`/event/${gate.event_id}/checkins`);
  return {};
}
