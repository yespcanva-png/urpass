"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { workspaceSchema, type WorkspaceInput } from "@/lib/validations/workspace";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { Workspace, WorkspaceMember, WorkspaceRole } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

export async function getWorkspaces(orgId: string): Promise<Workspace[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("organization_id", orgId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) {
      // If table doesn't exist yet, return a virtual General workspace
      return [
        {
          id: `default-${orgId}`,
          organization_id: orgId,
          name: "General",
          slug: "general",
          description: "Default workspace for team coordination and main events.",
          color: "#6D28D9",
          is_default: true,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          eventCount: 0,
          memberCount: 1,
        },
      ];
    }

    // Enhance with event and member counts
    const workspaces = (data ?? []) as Workspace[];
    return workspaces;
  } catch {
    return [];
  }
}

export async function createWorkspace(
  orgId: string,
  data: WorkspaceInput
): Promise<{ error?: string; workspace?: Workspace }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify user is owner or admin in this org
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can create workspaces." };
  }

  const parsed = workspaceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = parsed.data.slug || toSlug(parsed.data.name);

  try {
    const { data: created, error } = await adminClient()
      .from("workspaces")
      .insert({
        organization_id: orgId,
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        color: parsed.data.color || "#6D28D9",
        is_default: parsed.data.is_default || false,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return { error: "A workspace with this name or slug already exists in this organization." };
      }
      return { error: error.message };
    }

    revalidatePath(`/org`);
    return { workspace: created as Workspace };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to create workspace." };
  }
}

export async function updateWorkspace(
  workspaceId: string,
  data: WorkspaceInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = workspaceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const { error } = await adminClient()
      .from("workspaces")
      .update({
        name: parsed.data.name,
        description: parsed.data.description || null,
        color: parsed.data.color || "#6D28D9",
      })
      .eq("id", workspaceId);

    if (error) return { error: error.message };

    revalidatePath(`/org`);
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update workspace." };
  }
}

export async function deleteWorkspace(
  workspaceId: string,
  orgId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify owner/admin
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can delete workspaces." };
  }

  try {
    // Check if default
    const { data: ws } = await adminClient()
      .from("workspaces")
      .select("is_default")
      .eq("id", workspaceId)
      .single();

    if (ws?.is_default) {
      return { error: "The default workspace cannot be deleted." };
    }

    const { error } = await adminClient()
      .from("workspaces")
      .delete()
      .eq("id", workspaceId);

    if (error) return { error: error.message };

    revalidatePath(`/org`);
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete workspace." };
  }
}

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("*, member:organization_members(*, profile:profiles(full_name, avatar_url))")
      .eq("workspace_id", workspaceId);

    if (error) return [];
    return (data ?? []) as unknown as WorkspaceMember[];
  } catch {
    return [];
  }
}

export async function addWorkspaceMember(
  workspaceId: string,
  memberId: string,
  role: WorkspaceRole = "member"
): Promise<{ error?: string }> {
  try {
    const { error } = await adminClient()
      .from("workspace_members")
      .insert({
        workspace_id: workspaceId,
        member_id: memberId,
        role,
      });

    if (error) return { error: error.message };
    revalidatePath(`/org`);
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to add member to workspace." };
  }
}
