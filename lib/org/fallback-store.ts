import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { Workspace, Location } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function isTableMissingError(error: unknown): boolean {
  if (!error) return false;
  const msg =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : "";
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return (
    code === "PGRST205" ||
    msg.includes("schema cache") ||
    msg.includes("does not exist") ||
    msg.includes("relation")
  );
}

// ── Workspaces System Settings Persistence ──

export async function getStoredWorkspaces(orgId: string, userId?: string): Promise<Workspace[]> {
  try {
    const admin = adminClient();
    const key = `org_workspaces_${orgId}`;
    const { data } = await admin
      .from("system_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (data?.value) {
      const parsed = JSON.parse(data.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Workspace[];
      }
    }
  } catch (err) {
    console.warn("[workspaces] Error reading from system_settings:", err);
  }

  // Default initial workspace if none stored
  return [
    {
      id: `default-${orgId}`,
      organization_id: orgId,
      name: "General",
      slug: "general",
      description: "Default workspace for team coordination and main events.",
      color: "#6D28D9",
      is_default: true,
      created_by: userId || "system",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      eventCount: 0,
      memberCount: 1,
    },
  ];
}

export async function saveStoredWorkspaces(orgId: string, workspaces: Workspace[]): Promise<boolean> {
  try {
    const admin = adminClient();
    const key = `org_workspaces_${orgId}`;
    const { error } = await admin.from("system_settings").upsert({
      key,
      value: JSON.stringify(workspaces),
      description: `Persisted workspaces for organization ${orgId}`,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (err) {
    console.error("[workspaces] Error saving to system_settings:", err);
    return false;
  }
}

// ── Locations System Settings Persistence ──

export async function getStoredLocations(orgId: string): Promise<Location[]> {
  try {
    const admin = adminClient();
    const key = `org_locations_${orgId}`;
    const { data } = await admin
      .from("system_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (data?.value) {
      const parsed = JSON.parse(data.value);
      if (Array.isArray(parsed)) {
        return parsed as Location[];
      }
    }
  } catch (err) {
    console.warn("[locations] Error reading from system_settings:", err);
  }
  return [];
}

export async function saveStoredLocations(orgId: string, locations: Location[]): Promise<boolean> {
  try {
    const admin = adminClient();
    const key = `org_locations_${orgId}`;
    const { error } = await admin.from("system_settings").upsert({
      key,
      value: JSON.stringify(locations),
      description: `Persisted locations for organization ${orgId}`,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (err) {
    console.error("[locations] Error saving to system_settings:", err);
    return false;
  }
}
