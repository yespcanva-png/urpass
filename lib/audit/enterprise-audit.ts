import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordLiveOpsEvent } from "@/lib/ops/events";

function adminClient() {
  if ((globalThis as any).__urpass_admin_client) {
    return (globalThis as any).__urpass_admin_client;
  }
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export type AuditResourceType =
  | "event"
  | "attendee"
  | "ticket_type"
  | "organization_member"
  | "invoice"
  | "workspace"
  | "security_settings"
  | "payment";

export interface EnterpriseAuditLogInput {
  organizationId: string;
  eventId?: string | null;
  userId?: string | null;
  actorEmail?: string | null;
  action: string;
  resourceType: AuditResourceType | string;
  resourceId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface EnterpriseAuditRecord {
  id: string;
  organization_id: string;
  event_id: string | null;
  user_id: string | null;
  actor_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// In-memory fallback buffer for test runs without active Supabase connections
declare global {
  // eslint-disable-next-line no-var
  var __urpass_enterprise_audit_buffer: EnterpriseAuditRecord[] | undefined;
}

if (!globalThis.__urpass_enterprise_audit_buffer) {
  globalThis.__urpass_enterprise_audit_buffer = [];
}

/**
 * Record an immutable audit log entry detailing who changed what, the before/after state,
 * timestamp, tenant organization, event, and client metadata.
 */
export async function recordEnterpriseAudit(
  input: EnterpriseAuditLogInput
): Promise<EnterpriseAuditRecord> {
  const timestamp = new Date().toISOString();
  const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const record: EnterpriseAuditRecord = {
    id,
    organization_id: input.organizationId,
    event_id: input.eventId || null,
    user_id: input.userId || null,
    actor_email: input.actorEmail || null,
    action: input.action.toUpperCase(),
    resource_type: input.resourceType,
    resource_id: input.resourceId || null,
    old_values: input.oldValues || null,
    new_values: input.newValues || null,
    details: input.details || {},
    ip_address: input.ipAddress || null,
    user_agent: input.userAgent || null,
    created_at: timestamp,
  };

  // Add to in-memory audit buffer
  globalThis.__urpass_enterprise_audit_buffer!.unshift(record);
  if (globalThis.__urpass_enterprise_audit_buffer!.length > 500) {
    globalThis.__urpass_enterprise_audit_buffer!.length = 500;
  }

  // Persist to relational enterprise_audit_logs table
  try {
    const admin = adminClient();
    await admin.from("enterprise_audit_logs").insert({
      id: record.id,
      organization_id: record.organization_id,
      event_id: record.event_id,
      user_id: record.user_id,
      actor_email: record.actor_email,
      action: record.action,
      resource_type: record.resource_type,
      resource_id: record.resource_id,
      old_values: record.old_values,
      new_values: record.new_values,
      details: record.details,
      ip_address: record.ip_address,
      user_agent: record.user_agent,
      created_at: record.created_at,
    });
  } catch (err) {
    console.warn("[enterprise-audit] Failed persisting to database, saved to buffer:", err);
  }

  // Broadcast to LiveOps command center if high-impact action
  if (["MEMBER_ROLE_CHANGED", "EVENT_CANCELLED", "REFUND_ISSUED", "SECURITY_POLICY_CHANGED"].includes(record.action)) {
    recordLiveOpsEvent({
      level: "WARN",
      category: "SECURITY",
      message: `Audit: ${record.action} performed on ${record.resource_type}:${record.resource_id || "all"} by ${record.actor_email || record.user_id || "system"}`,
      details: {
        organizationId: record.organization_id,
        eventId: record.event_id,
        action: record.action,
        oldValues: record.old_values,
        newValues: record.new_values,
      },
    });
  }

  return record;
}

/**
 * Query audit logs for an organization with optional event, resource, and action filters.
 */
export async function queryEnterpriseAuditLogs(params: {
  organizationId: string;
  eventId?: string;
  resourceType?: string;
  action?: string;
  limit?: number;
}): Promise<EnterpriseAuditRecord[]> {
  const limit = Math.min(params.limit || 50, 200);

  try {
    const admin = adminClient();
    let query = admin
      .from("enterprise_audit_logs")
      .select("*")
      .eq("organization_id", params.organizationId);

    if (params.eventId) query = query.eq("event_id", params.eventId);
    if (params.resourceType) query = query.eq("resource_type", params.resourceType);
    if (params.action) query = query.eq("action", params.action.toUpperCase());

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!error && data && data.length > 0) {
      return data as EnterpriseAuditRecord[];
    }
  } catch (err) {
    console.warn("[enterprise-audit] Error querying audit logs from DB:", err);
  }

  // Fallback to in-memory buffer
  let list = (globalThis.__urpass_enterprise_audit_buffer || []).filter(
    (item) => item.organization_id === params.organizationId
  );
  if (params.eventId) list = list.filter((item) => item.event_id === params.eventId);
  if (params.resourceType) list = list.filter((item) => item.resource_type === params.resourceType);
  if (params.action) list = list.filter((item) => item.action === params.action?.toUpperCase());

  return list.slice(0, limit);
}
