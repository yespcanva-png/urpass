import type { OpsAuditLog, OpsAlert, AuditActionType, AlertType, AlertSeverity } from "./types";
import { recordLiveOpsEvent } from "@/lib/ops/events";

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

export function getOpsAuditLogs(eventId: string, actionType?: AuditActionType): OpsAuditLog[] {
  const store = globalThis.__urpass_ops_audit!;
  const list = store[eventId] || [];
  return actionType ? list.filter((a) => a.actionType === actionType) : list;
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

export function getOpsAlerts(eventId: string, unresolvedOnly = false): OpsAlert[] {
  const store = globalThis.__urpass_ops_alerts!;
  const list = store[eventId] || [];
  return unresolvedOnly ? list.filter((a) => !a.isResolved) : list;
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
