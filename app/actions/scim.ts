"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { generateScimToken } from "@/lib/sso/scim";
import { recordAuditLog } from "@/lib/sso/audit";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export interface ScimTokenInfo {
  id: string;
  tokenHint: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export async function getScimTokenInfo(orgId: string): Promise<ScimTokenInfo | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = adminClient();
  const { data } = await admin
    .from("enterprise_scim_tokens")
    .select("id, token_hint, last_used_at, created_at")
    .eq("organization_id", orgId)
    .maybeSingle();

  if (!data) return null;
  return {
    id: data.id,
    tokenHint: data.token_hint,
    lastUsedAt: data.last_used_at,
    createdAt: data.created_at,
  };
}

export async function createOrRegenerateScimToken(
  orgId: string
): Promise<{ success: boolean; rawToken?: string; tokenHint?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { success: false, error: "Only owners and admins can configure SCIM." };
  }

  const { rawToken, tokenHash, tokenHint } = generateScimToken();
  const admin = adminClient();

  const { error } = await admin
    .from("enterprise_scim_tokens")
    .upsert(
      {
        organization_id: orgId,
        token_hash: tokenHash,
        token_hint: tokenHint,
        created_by: user.id,
        created_at: new Date().toISOString(),
      },
      { onConflict: "organization_id" }
    );

  if (error) {
    return { success: false, error: error.message };
  }

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "scim.token.regenerated",
    resourceType: "scim_token",
    details: { tokenHint },
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true, rawToken, tokenHint };
}

export async function deleteScimToken(
  orgId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { success: false, error: "Only owners and admins can remove SCIM tokens." };
  }

  const admin = adminClient();
  await admin.from("enterprise_scim_tokens").delete().eq("organization_id", orgId);

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "scim.token.deleted",
    resourceType: "scim_token",
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true };
}
