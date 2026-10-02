import type { OpsAuditLog, OpsAlert, AuditActionType, AlertType, AlertSeverity } from "./types";
import { recordLiveOpsEvent } from "@/lib/ops/events";
import { getAdminClient } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_ops_audit: Record<string, OpsAuditLog[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_ops_alerts: Record<string, OpsAlert[]> | undefined;
}

if (!globalThis.__urpass_ops_audit) {
  globalThis.__urpass_ops_audit = {};
}
if (!globalThis.__urpass_ops_alerts) {
  globalThis.__urpass_ops_alerts = {};
}

export function logOpsAudit(
  eventId: string,
  actionType: AuditActionType,
  targetType: OpsAuditLog["targetType"],
  targetId: string,
  details: Record<string, unknown>,
  actorName = "Operations Lead"
): OpsAuditLog {
  const store = globalThis.__urpass_ops_audit!;
  if (!store[eventId]) store[eventId] = [];

  const item: OpsAuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    actionType,
    targetType,
    targetId,
    details,
    actorName,
    createdAt: new Date().toISOString(),
  };

  store[eventId].unshift(item);

  // Also broadcast to central live ops telemetry buffer
  recordLiveOpsEvent({
    level: actionType.includes("override") ? "WARN" : "INFO",
    category: "EVENT",
    message: `[Audit] ${actorName} performed ${actionType} on ${targetType} #${targetId}`,
    details: { ...details, eventId },
  });

  return item;
}

export async function logOpsAuditDb(
  eventId: string,
  actionType: AuditActionType,
  targetType: OpsAuditLog["targetType"],
  targetId: string,
  details: Record<string, unknown>,
  actorName = "Operations Lead"
): Promise<OpsAuditLog> {
  const item = logOpsAudit(eventId, actionType, targetType, targetId, details, actorName);
  const admin = getAdminClient();
  if (!admin) return item;

  try {
    const { data } = await admin
      .from("ops_audit_logs")
      .insert({
        event_id: eventId,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        actor_name: actorName,
        details,
      })
      .select()
      .single();

    if (data?.id) {
      item.id = data.id;
    }
  } catch (err) {
    console.warn("[audit-service] Error inserting audit log into DB:", err);
  }

  return item;
}

export function getOpsAuditLogs(eventId: string, actionType?: AuditActionType): OpsAuditLog[] {
  const store = globalThis.__urpass_ops_audit!;
  const list = store[eventId] || [];
  return actionType ? list.filter((a) => a.actionType === actionType) : list;
}

export async function getOpsAuditLogsDb(eventId: string, actionType?: AuditActionType): Promise<OpsAuditLog[]> {
  const admin = getAdminClient();
  if (!admin) return getOpsAuditLogs(eventId, actionType);

  try {
    let query = admin
      .from("ops_audit_logs")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (actionType) {
      query = query.eq("action_type", actionType);
    }

    const { data, error } = await query;
    if (error || !data) {
      return getOpsAuditLogs(eventId, actionType);
    }

    const mapped: OpsAuditLog[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      actionType: d.action_type,
      targetType: d.target_type,
      targetId: d.target_id,
      actorName: d.actor_name || "Operations Lead",
      details: d.details || {},
      createdAt: d.created_at,
    }));

    return mapped;
  } catch (err) {
    console.warn("[audit-service] Error fetching audit logs from DB:", err);
    return getOpsAuditLogs(eventId, actionType);
  }
}

export function triggerOpsAlert(
  eventId: string,
  alertType: AlertType,
  severity: AlertSeverity,
  message: string,
  zoneName?: string,
  gateName?: string,
  deviceId?: string
): OpsAlert {
  const store = globalThis.__urpass_ops_alerts!;
  if (!store[eventId]) store[eventId] = [];

  const alert: OpsAlert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    alertType,
    severity,
    message,
    zoneName,
    gateName,
    deviceId,
    isResolved: false,
    createdAt: new Date().toISOString(),
  };

  store[eventId].unshift(alert);

  recordLiveOpsEvent({
    level: severity === "critical" ? "ERROR" : severity === "warning" ? "WARN" : "INFO",
    category: "SCAN",
    message: `[Alert: ${alertType.toUpperCase()}] ${message}`,
    details: { eventId, zoneName, gateName, deviceId },
  });

  return alert;
}

export async function triggerOpsAlertDb(
  eventId: string,
  alertType: AlertType,
  severity: AlertSeverity,
  message: string,
  zoneName?: string,
  gateName?: string,
  deviceId?: string
): Promise<OpsAlert> {
  const alert = triggerOpsAlert(eventId, alertType, severity, message, zoneName, gateName, deviceId);
  const admin = getAdminClient();
  if (!admin) return alert;

  try {
    const { data } = await admin
      .from("ops_alerts")
      .insert({
        event_id: eventId,
        alert_type: alertType,
        severity,
        message,
        zone_name: zoneName || null,
        gate_name: gateName || null,
        device_id: deviceId || null,
        is_resolved: false,
      })
      .select()
      .single();

    if (data?.id) {
      alert.id = data.id;
    }
  } catch (err) {
    console.warn("[audit-service] Error inserting alert into DB:", err);
  }

  return alert;
}

export function getOpsAlerts(eventId: string, unresolvedOnly = false): OpsAlert[] {
  const store = globalThis.__urpass_ops_alerts!;
  const list = store[eventId] || [];
  return unresolvedOnly ? list.filter((a) => !a.isResolved) : list;
}

export async function getOpsAlertsDb(eventId: string, unresolvedOnly = false): Promise<OpsAlert[]> {
  const admin = getAdminClient();
  if (!admin) return getOpsAlerts(eventId, unresolvedOnly);

  try {
    let query = admin
      .from("ops_alerts")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (unresolvedOnly) {
      query = query.eq("is_resolved", false);
    }

    const { data, error } = await query;
    if (error || !data) {
      return getOpsAlerts(eventId, unresolvedOnly);
    }

    const mapped: OpsAlert[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      alertType: d.alert_type,
      severity: d.severity,
      message: d.message,
      zoneName: d.zone_name || undefined,
      gateName: d.gate_name || undefined,
      deviceId: d.device_id || undefined,
      isResolved: d.is_resolved,
      resolvedAt: d.resolved_at || undefined,
      createdAt: d.created_at,
    }));

    return mapped;
  } catch (err) {
    console.warn("[audit-service] Error fetching alerts from DB:", err);
    return getOpsAlerts(eventId, unresolvedOnly);
  }
}

export function resolveOpsAlert(eventId: string, alertId: string): boolean {
  const store = globalThis.__urpass_ops_alerts!;
  const list = store[eventId] || [];
  const alert = list.find((a) => a.id === alertId);
  if (alert) {
    alert.isResolved = true;
    alert.resolvedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function resolveOpsAlertDb(eventId: string, alertId: string): Promise<boolean> {
  resolveOpsAlert(eventId, alertId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin
      .from("ops_alerts")
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq("id", alertId);
    return true;
  } catch (err) {
    console.warn("[audit-service] Error resolving alert in DB:", err);
    return false;
  }
}
