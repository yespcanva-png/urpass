"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { securityPoliciesSchema, type SecurityPoliciesInput } from "@/lib/validations/sso";
import { recordAuditLog } from "@/lib/sso/audit";
import { revalidatePath } from "next/cache";
import type { EnterpriseSession, SecurityPolicies } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getEnterpriseSessions(orgId: string): Promise<EnterpriseSession[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return [];
  }

  const admin = adminClient();
  const { data: sessions, error } = await admin
    .from("enterprise_sessions")
    .select("*")
    .eq("organization_id", orgId)
    .order("last_active_at", { ascending: false })
    .limit(100);

  if (error || !sessions) return [];

  // Fetch user profiles to enrich sessions
  const userIds = [...new Set(sessions.map((s) => s.user_id))];
  const { data: profiles } = await admin
    .from("profiles")
    .select("user_id, full_name, email")
    .in("user_id", userIds);

  const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

  return sessions.map((s) => {
    const prof = profileMap.get(s.user_id);
    return {
      ...s,
      user_email: prof?.email || "Unknown",
      user_name: prof?.full_name || "Enterprise User",
    } as EnterpriseSession;
  });
}

export async function revokeEnterpriseSession(
  orgId: string,
  sessionId: string
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
    return { success: false, error: "Only owners and admins can revoke sessions." };
  }

  const admin = adminClient();
  const { data: session } = await admin
    .from("enterprise_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("organization_id", orgId)
    .single();

  if (!session) return { success: false, error: "Session not found." };

  await admin
    .from("enterprise_sessions")
    .update({ status: "revoked" })
    .eq("id", sessionId);

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "session.revoked",
    resourceType: "session",
    resourceId: sessionId,
    details: { targetUserId: session.user_id, ip: session.ip_address },
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true };
}

export async function getSecurityPolicies(orgId: string): Promise<SecurityPolicies | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = adminClient();
  const [settingsRes, ssoRes] = await Promise.all([
    admin.from("organization_settings").select("*").eq("organization_id", orgId).maybeSingle(),
    admin.from("enterprise_sso_connections").select("enforce_sso").eq("organization_id", orgId).maybeSingle(),
  ]);

  const settings = settingsRes.data;
  const sso = ssoRes.data;

  return {
    enforce_sso: sso?.enforce_sso ?? settings?.enforce_sso ?? false,
    allow_emergency_owner_login: settings?.allow_emergency_owner_login ?? true,
    session_idle_timeout_minutes: settings?.session_idle_timeout_minutes ?? 1440,
    enforce_2fa: settings?.enforce_2fa ?? false,
    allowed_domains: settings?.allowed_domains ?? [],
  };
}

export async function updateSecurityPolicies(
  orgId: string,
  data: SecurityPoliciesInput
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
    return { success: false, error: "Only owners and admins can update security policies." };
  }

  const parsed = securityPoliciesSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const admin = adminClient();

  // If enforce_sso is enabled, ensure verified domain exists
  if (parsed.data.enforce_sso) {
    const { data: verified } = await admin
      .from("verified_domains")
      .select("id")
      .eq("organization_id", orgId)
      .eq("status", "verified")
      .limit(1);

    if (!verified || verified.length === 0) {
      return {
        success: false,
        error: "Cannot enforce SSO: You must have at least one verified domain in your Security Center before enforcing SSO.",
      };
    }
  }

  await Promise.all([
    admin
      .from("organization_settings")
      .update({
        enforce_sso: parsed.data.enforce_sso,
        allow_emergency_owner_login: parsed.data.allow_emergency_owner_login,
        session_idle_timeout_minutes: parsed.data.session_idle_timeout_minutes,
        enforce_2fa: parsed.data.enforce_2fa,
        allowed_domains: parsed.data.allowed_domains,
      })
      .eq("organization_id", orgId),
    admin
      .from("enterprise_sso_connections")
      .update({
        enforce_sso: parsed.data.enforce_sso,
      })
      .eq("organization_id", orgId),
  ]);

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "policy.updated",
    resourceType: "policy",
    details: parsed.data as unknown as Record<string, unknown>,
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true };
}
