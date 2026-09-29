"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { locationSchema, type LocationInput } from "@/lib/validations/location";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { Location } from "@/types";
import {
  isTableMissingError,
  getStoredLocations,
  saveStoredLocations,
} from "@/lib/org/fallback-store";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getLocations(orgId: string): Promise<Location[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) {
      return await getStoredLocations(orgId);
    }
    return (data ?? []) as Location[];
  } catch {
    return await getStoredLocations(orgId);
  }
}

export async function createLocation(
  orgId: string,
  data: LocationInput
): Promise<{ error?: string; location?: Location }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify user is owner, admin, or event manager in this org
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || !["owner", "admin", "event_manager"].includes(member.role)) {
    return { error: "Insufficient permissions to add locations." };
  }

  const parsed = locationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const { data: created, error } = await adminClient()
      .from("locations")
      .insert({
        organization_id: orgId,
        workspace_id: parsed.data.workspace_id || null,
        name: parsed.data.name,
        venue_type: parsed.data.venue_type,
        address: parsed.data.address || null,
        city: parsed.data.city || null,
        state: parsed.data.state || null,
        country: parsed.data.country || "India",
        postal_code: parsed.data.postal_code || null,
        capacity: parsed.data.capacity || null,
        timezone: parsed.data.timezone || "Asia/Kolkata",
        virtual_url: parsed.data.virtual_url || null,
        contact_name: parsed.data.contact_name || null,
        contact_phone: parsed.data.contact_phone || null,
        contact_email: parsed.data.contact_email || null,
        is_active: parsed.data.is_active,
      })
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        // Fallback: save to system_settings
        const existing = await getStoredLocations(orgId);
        const newLoc: Location = {
          id: `loc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          organization_id: orgId,
          workspace_id: parsed.data.workspace_id || null,
          name: parsed.data.name,
          venue_type: parsed.data.venue_type,
          address: parsed.data.address || null,
          city: parsed.data.city || null,
          state: parsed.data.state || null,
          country: parsed.data.country || "India",
          postal_code: parsed.data.postal_code || null,
          capacity: parsed.data.capacity ?? null,
          timezone: parsed.data.timezone || "Asia/Kolkata",
          virtual_url: parsed.data.virtual_url || null,
          contact_name: parsed.data.contact_name || null,
          contact_phone: parsed.data.contact_phone || null,
          contact_email: parsed.data.contact_email || null,
          metadata: {},
          is_active: parsed.data.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const updated = [newLoc, ...existing];
        await saveStoredLocations(orgId, updated);
        revalidatePath(`/org`);
        return { location: newLoc };
      }
      return { error: error.message };
    }

    revalidatePath(`/org`);
    return { location: created as Location };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to create location." };
  }
}

export async function updateLocation(
  locationId: string,
  data: LocationInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = locationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const admin = adminClient();
  const { data: loc, error: findErr } = await admin
    .from("locations")
    .select("organization_id")
    .eq("id", locationId)
    .maybeSingle();

  if (findErr && isTableMissingError(findErr)) {
    // Handled via stored fallback below
  } else if (!loc && !findErr) {
    return { error: "Location not found." };
  }

  const orgId = loc?.organization_id;

  try {
    const { error } = await admin
      .from("locations")
      .update({
        name: parsed.data.name,
        workspace_id: parsed.data.workspace_id || null,
        venue_type: parsed.data.venue_type,
        address: parsed.data.address || null,
        city: parsed.data.city || null,
        state: parsed.data.state || null,
        country: parsed.data.country || "India",
        postal_code: parsed.data.postal_code || null,
        capacity: parsed.data.capacity || null,
        timezone: parsed.data.timezone || "Asia/Kolkata",
        virtual_url: parsed.data.virtual_url || null,
        contact_name: parsed.data.contact_name || null,
        contact_phone: parsed.data.contact_phone || null,
        contact_email: parsed.data.contact_email || null,
        is_active: parsed.data.is_active,
      })
      .eq("id", locationId);

    if (error) {
      if (isTableMissingError(error) && orgId) {
        const existing = await getStoredLocations(orgId);
        const updated = existing.map((l) =>
          l.id === locationId
            ? {
                ...l,
                name: parsed.data.name,
                workspace_id: parsed.data.workspace_id || null,
                venue_type: parsed.data.venue_type,
                address: parsed.data.address || null,
                city: parsed.data.city || null,
                state: parsed.data.state || null,
                country: parsed.data.country || "India",
                postal_code: parsed.data.postal_code || null,
                capacity: parsed.data.capacity ?? null,
                timezone: parsed.data.timezone || "Asia/Kolkata",
                virtual_url: parsed.data.virtual_url || null,
                contact_name: parsed.data.contact_name || null,
                contact_phone: parsed.data.contact_phone || null,
                contact_email: parsed.data.contact_email || null,
                is_active: parsed.data.is_active,
                updated_at: new Date().toISOString(),
              }
            : l
        );
        await saveStoredLocations(orgId, updated);
        revalidatePath(`/org`);
        return {};
      }
      return { error: error.message };
    }

    revalidatePath(`/org`);
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update location." };
  }
}

export async function deleteLocation(
  locationId: string,
  orgId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can remove locations." };
  }

  try {
    const { error } = await adminClient()
      .from("locations")
      .delete()
      .eq("id", locationId)
      .eq("organization_id", orgId);

    if (error) {
      if (isTableMissingError(error)) {
        const existing = await getStoredLocations(orgId);
        const filtered = existing.filter((l) => l.id !== locationId);
        await saveStoredLocations(orgId, filtered);
        revalidatePath(`/org`);
        return {};
      }
      return { error: error.message };
    }

    revalidatePath(`/org`);
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete location." };
  }
}
