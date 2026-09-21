"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { locationSchema, type LocationInput } from "@/lib/validations/location";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { Location } from "@/types";

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

    if (error) return [];
    return (data ?? []) as Location[];
  } catch {
    return [];
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

    if (error) return { error: error.message };

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

  try {
    const { error } = await adminClient()
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

    if (error) return { error: error.message };

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
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can remove locations." };
  }

  try {
    const { error } = await adminClient()
      .from("locations")
      .delete()
      .eq("id", locationId);

    if (error) return { error: error.message };

    revalidatePath(`/org`);
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete location." };
  }
}
