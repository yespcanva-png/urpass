/**
 * UrPass Offline RBAC Permission Snapshots & Revocation Management
 * Module M13 · Enterprise Security & Permission Management
 */

import type { UrPassPermission } from "./permissions";
import { getRolePermissions } from "./roles";

export interface OfflinePermissionSnapshot {
  snapshotId: string;
  userId: string;
  organizationId: string;
  eventId: string;
  role: string;
  permissions: UrPassPermission[];
  assignedGateIds?: string[];
  assignedSessionIds?: string[];
  issuedAt: string;
  expiresAt: string;
  isRevoked: boolean;
  revocationReason?: string;
}

const DEFAULT_OFFLINE_VALIDITY_HOURS = 24;

/**
 * Generate a time-limited permission snapshot for offline scanner devices
 */
export function createOfflinePermissionSnapshot({
  userId,
  organizationId,
  eventId,
  role,
  customPermissions,
  assignedGateIds,
  assignedSessionIds,
  validityHours = DEFAULT_OFFLINE_VALIDITY_HOURS,
}: {
  userId: string;
  organizationId: string;
  eventId: string;
  role: string;
  customPermissions?: UrPassPermission[];
  assignedGateIds?: string[];
  assignedSessionIds?: string[];
  validityHours?: number;
}): OfflinePermissionSnapshot {
  const permissions = Array.isArray(customPermissions) && customPermissions.length > 0
    ? customPermissions
    : [...getRolePermissions(role)];

  const now = new Date();
  const expiresAt = new Date(now.getTime() + validityHours * 60 * 60 * 1000);

  return {
    snapshotId: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    organizationId,
    eventId,
    role,
    permissions,
    assignedGateIds,
    assignedSessionIds,
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isRevoked: false,
  };
}

/**
 * Validate an offline permission snapshot on device
 */
export function validateOfflineSnapshot(
  snapshot: OfflinePermissionSnapshot | null | undefined,
  requiredPermission: UrPassPermission,
  targetGateId?: string,
  targetSessionId?: string
): { valid: boolean; reason?: string } {
  if (!snapshot) {
    return { valid: false, reason: "No offline permission snapshot found." };
  }

  if (snapshot.isRevoked) {
    return { valid: false, reason: `Offline authorization revoked: ${snapshot.revocationReason || "Access revoked by administrator."}` };
  }

  const now = Date.now();
  const expiry = new Date(snapshot.expiresAt).getTime();
  if (now > expiry) {
    return { valid: false, reason: "Offline authorization snapshot has expired. Reconnection required." };
  }

  if (!snapshot.permissions.includes(requiredPermission)) {
    return { valid: false, reason: `Snapshot lacks '${requiredPermission}' permission.` };
  }

  // Gate assignment scoping
  if (targetGateId && requiredPermission === "attendance.scan_gate") {
    const canManageGates = snapshot.permissions.includes("gates.manage");
    if (!canManageGates && snapshot.assignedGateIds && snapshot.assignedGateIds.length > 0) {
      if (!snapshot.assignedGateIds.includes(targetGateId)) {
        return { valid: false, reason: `Offline staff is not authorized for gate '${targetGateId}'.` };
      }
    }
  }

  // Session assignment scoping
  if (targetSessionId && requiredPermission === "attendance.scan_session") {
    const canManageSessions = snapshot.permissions.includes("sessions.manage");
    if (!canManageSessions && snapshot.assignedSessionIds && snapshot.assignedSessionIds.length > 0) {
      if (!snapshot.assignedSessionIds.includes(targetSessionId)) {
        return { valid: false, reason: `Offline staff is not authorized for session '${targetSessionId}'.` };
      }
    }
  }

  return { valid: true };
}

/**
 * Handle reconnected offline staff device when user role has been revoked
 */
export function processReconnectedRevocation(
  snapshot: OfflinePermissionSnapshot,
  isUserRevokedOnServer: boolean
): {
  allowFreshAuthorization: boolean;
  handlePendingOperationsPolicy: "reconcile_with_revocation_flag" | "accept" | "reject";
  reason: string;
} {
  if (isUserRevokedOnServer || snapshot.isRevoked) {
    return {
      allowFreshAuthorization: false,
      handlePendingOperationsPolicy: "reconcile_with_revocation_flag",
      reason: "User role was revoked on the server. No fresh offline authorization is issued; pending queue is reconciled with an audit flag.",
    };
  }

  return {
    allowFreshAuthorization: true,
    handlePendingOperationsPolicy: "accept",
    reason: "User permissions are valid and in good standing.",
  };
}
