/**
 * UrPass Multi-Layer Access Evaluator & Resource Scoping
 * Module M13 · Enterprise Security & Permission Management
 */

import type { UrPassPermission } from "./permissions";
import { getRolePermissions, BUILT_IN_ROLES } from "./roles";

export interface UserContext {
  id: string;
  organizationId?: string;
  role?: string;
  customPermissions?: UrPassPermission[];
  assignedEventIds?: string[];
  assignedGateIds?: string[];
  assignedSessionIds?: string[];
  status?: "active" | "revoked" | "expired" | "pending";
  isPlatformSupport?: boolean;
}

export interface ResourceTarget {
  orgId: string;
  eventId?: string;
  gateId?: string;
  sessionId?: string;
  featureKey?: string;
}

export interface EventContext {
  id: string;
  organization_id?: string | null;
  status?: string;
  features?: Record<string, boolean>;
  [key: string]: any;
}

export interface SubscriptionContext {
  tier?: string;
  canUseFeature?: (featureKey: string) => boolean;
  [key: string]: any;
}

export interface AccessEvaluationInput {
  user: UserContext | null;
  permission: UrPassPermission;
  target: ResourceTarget;
  event?: EventContext | null;
  subscriptionPlan?: SubscriptionContext | null;
}

export interface AccessEvaluationResult {
  allowed: boolean;
  reason?: string;
  code?:
    | "UNAUTHENTICATED"
    | "USER_REVOKED"
    | "NO_PERMISSION"
    | "SCOPE_MISMATCH"
    | "CROSS_ORG_DENIED"
    | "FEATURE_DISABLED"
    | "PLAN_UPGRADE_REQUIRED";
}

/**
 * Core Multi-Layer Access Evaluator
 * Enforces:
 * 1. User Authenticated & Active
 * 2. Organization Isolation
 * 3. Subscription Entitlement (Feature Available)
 * 4. Event Module Configuration (Event Feature Enabled)
 * 5. User Has Granular Permission (Role / Custom Permissions)
 * 6. Resource Scoping (Event -> Gate / Session)
 */
export function evaluateAccess({
  user,
  permission,
  target,
  event,
  subscriptionPlan,
}: AccessEvaluationInput): AccessEvaluationResult {
  // 1. User must be authenticated
  if (!user || !user.id) {
    return {
      allowed: false,
      reason: "Authentication required to perform this action.",
      code: "UNAUTHENTICATED",
    };
  }

  // 2. User status must be active (not revoked or expired)
  if (user.status && user.status !== "active") {
    return {
      allowed: false,
      reason: `User access is ${user.status}. Action denied.`,
      code: "USER_REVOKED",
    };
  }

  // 3. Platform Support Isolation
  // Support staff must not automatically receive unrestricted tenant data access without explicit org delegation
  if (user.isPlatformSupport && !user.organizationId) {
    if (permission !== "platform.manage_system") {
      return {
        allowed: false,
        reason: "Platform support accounts cannot directly access tenant operational data without delegation.",
        code: "CROSS_ORG_DENIED",
      };
    }
  }

  // 4. Cross-Organization Isolation
  if (user.organizationId && target.orgId && user.organizationId !== target.orgId) {
    return {
      allowed: false,
      reason: "Cross-organization access is strictly forbidden.",
      code: "CROSS_ORG_DENIED",
    };
  }

  // 5. Subscription Plan Entitlement Check (Feature Available)
  if (target.featureKey && subscriptionPlan) {
    if (typeof subscriptionPlan.canUseFeature === "function") {
      if (!subscriptionPlan.canUseFeature(target.featureKey)) {
        return {
          allowed: false,
          reason: `Feature '${target.featureKey}' is not entitled under the current subscription plan.`,
          code: "PLAN_UPGRADE_REQUIRED",
        };
      }
    }
  }

  // 6. Event-Level Optional Module Check (Event Feature Enabled)
  if (target.featureKey && event && event.features) {
    const isEnabled = event.features[target.featureKey];
    if (isEnabled === false) {
      return {
        allowed: false,
        reason: `Module '${target.featureKey}' is disabled for this event.`,
        code: "FEATURE_DISABLED",
      };
    }
  }

  // 7. Granular Permission Evaluation (Role / Custom Permissions)
  const role = user.role?.toLowerCase();
  const isOwner = role === "owner";
  let userPermissions: readonly UrPassPermission[] = [];

  if (isOwner) {
    userPermissions = BUILT_IN_ROLES.owner.permissions;
  } else if (Array.isArray(user.customPermissions) && user.customPermissions.length > 0) {
    userPermissions = user.customPermissions;
  } else if (role) {
    userPermissions = getRolePermissions(role);
  }

  const hasPermission = isOwner || userPermissions.includes(permission);
  if (!hasPermission) {
    return {
      allowed: false,
      reason: `User role '${role || "unknown"}' lacks the required '${permission}' permission.`,
      code: "NO_PERMISSION",
    };
  }

  // 8. Resource Scoping: Event Level
  if (target.eventId && user.assignedEventIds && user.assignedEventIds.length > 0) {
    if (!isOwner && role !== "admin" && !user.assignedEventIds.includes(target.eventId)) {
      return {
        allowed: false,
        reason: "User is not assigned to this event.",
        code: "SCOPE_MISMATCH",
      };
    }
  }

  // 9. Resource Scoping: Gate Level (Gate Staff vs Gate Supervisor)
  if (target.gateId && (permission === "attendance.scan_gate" || permission === "group_entry.scan")) {
    // If user has gates.manage (e.g. Gate Supervisor, Event Manager, Admin, Owner), they can scan any gate
    const canManageGates = isOwner || userPermissions.includes("gates.manage");
    if (!canManageGates && user.assignedGateIds && user.assignedGateIds.length > 0) {
      if (!user.assignedGateIds.includes(target.gateId)) {
        return {
          allowed: false,
          reason: `User is only authorized to scan at assigned gate(s) [${user.assignedGateIds.join(", ")}]. Scan at gate '${target.gateId}' denied.`,
          code: "SCOPE_MISMATCH",
        };
      }
    }
  }

  // 10. Resource Scoping: Session Level (Session Scanner vs Session Manager)
  if (target.sessionId && permission === "attendance.scan_session") {
    const canManageSessions = isOwner || userPermissions.includes("sessions.manage");
    if (!canManageSessions && user.assignedSessionIds && user.assignedSessionIds.length > 0) {
      if (!user.assignedSessionIds.includes(target.sessionId)) {
        return {
          allowed: false,
          reason: `User is only authorized to scan at assigned session(s) [${user.assignedSessionIds.join(", ")}]. Scan for session '${target.sessionId}' denied.`,
          code: "SCOPE_MISMATCH",
        };
      }
    }
  }

  // All 6 conditions passed: Action Allowed
  return {
    allowed: true,
  };
}
