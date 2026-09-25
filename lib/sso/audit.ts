import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export interface AuditLogParams {
  organizationId: string;
  userId?: string | null;
  actorEmail?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function recordAuditLog(params: AuditLogParams): Promise<void> {
  try {
    const admin = adminClient();
    await admin.from("enterprise_audit_logs").insert({
      organization_id: params.organizationId,
      user_id: params.userId || null,
      actor_email: params.actorEmail || null,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId || null,
      details: params.details || {},
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
    });
  } catch (err) {
    console.error("[audit-log] Failed to write enterprise audit log:", err);
  }
}
