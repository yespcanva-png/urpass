"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { EnterpriseAuditLog } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getEnterpriseAuditLogs(
  orgId: string,
  limit = 50,
  filters?: { eventId?: string; resourceType?: string; action?: string }
): Promise<EnterpriseAuditLog[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Check admin/owner/finance/gate_manager access
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || !["owner", "admin", "finance", "gate_manager"].includes(member.role)) {
    return [];
  }

  const admin = adminClient();
  let query = admin
    .from("enterprise_audit_logs")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters?.eventId) query = query.eq("event_id", filters.eventId);
  if (filters?.resourceType) query = query.eq("resource_type", filters.resourceType);
  if (filters?.action) query = query.eq("action", filters.action.toUpperCase());

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    const { queryEnterpriseAuditLogs } = await import("@/lib/audit/enterprise-audit");
    return (await queryEnterpriseAuditLogs({
      organizationId: orgId,
      eventId: filters?.eventId,
      resourceType: filters?.resourceType,
      action: filters?.action,
      limit,
    })) as unknown as EnterpriseAuditLog[];
  }

  return data as EnterpriseAuditLog[];
}
