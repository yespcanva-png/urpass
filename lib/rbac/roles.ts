/**
 * UrPass Role-Based Access Control (RBAC) - Built-In Role Templates & Custom Role Management
 * Module M13 · Enterprise Security & Permission Management
 */

import type { UrPassPermission } from "./permissions";

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  isAssignable: boolean;
  permissions: readonly UrPassPermission[];
}

export interface CustomRole {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  baseRoleTemplateId?: string;
  permissions: UrPassPermission[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Built-In Role Templates according to UrPass RBAC Specification
 */
export const BUILT_IN_ROLES: Record<string, RoleTemplate> = {
  super_admin: {
    id: "super_admin",
    name: "Platform Super Admin",
    description: "Manage UrPass platform, global subscriptions, and support access (isolated from tenant data)",
    isBuiltIn: true,
    isAssignable: false,
    permissions: ["platform.manage_system"],
  },
  owner: {
    id: "owner",
    name: "Organization Owner",
    description: "Full control over their organization, all events, financial accounts, and team management",
    isBuiltIn: true,
    isAssignable: false, // Owners cannot be assigned via regular invite; ownership is transferred
    permissions: [
      "tickets.view",
      "attendees.edit",
      "tickets.bulk",
      "tickets.distribute",
      "tickets.reassign",
      "tickets.validate_serial",
      "events.view",
      "events.manage",
      "gates.manage",
      "attendance.scan_gate",
      "attendance.scan_session",
      "attendance.correct",
      "attendance.override",
      "sessions.manage",
      "group_entry.configure",
      "group_entry.scan",
      "group_entry.view",
      "group_entry.override",
      "group_entry.audit",
      "analytics.view",
      "data.export_csv",
      "data.import_csv",
      "integrations.google.manage",
      "org.manage_team",
      "org.manage_roles",
      "org.manage_settings",
      "org.manage_billing",
      "org.view_audit",
      "org.manage_security",
    ],
  },
  admin: {
    id: "admin",
    name: "Organization Admin",
    description: "Manage events, team roles, operational settings, integrations, and reports",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "tickets.view",
      "attendees.edit",
      "tickets.bulk",
      "tickets.distribute",
      "tickets.reassign",
      "tickets.validate_serial",
      "events.view",
      "events.manage",
      "gates.manage",
      "attendance.scan_gate",
      "attendance.scan_session",
      "attendance.correct",
      "attendance.override",
      "sessions.manage",
      "group_entry.configure",
      "group_entry.scan",
      "group_entry.view",
      "group_entry.override",
      "group_entry.audit",
      "analytics.view",
      "data.export_csv",
      "data.import_csv",
      "integrations.google.manage",
      "org.manage_team",
      "org.manage_roles",
      "org.manage_settings",
      "org.manage_billing",
      "org.view_audit",
      "org.manage_security",
    ],
  },
  event_manager: {
    id: "event_manager",
    name: "Event Manager",
    description: "Manage assigned events, ticketing, gates, sessions, integrations, and event staff",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "tickets.view",
      "attendees.edit",
      "tickets.bulk",
      "tickets.distribute",
      "tickets.reassign",
      "tickets.validate_serial",
      "events.view",
      "events.manage",
      "gates.manage",
      "attendance.scan_gate",
      "attendance.scan_session",
      "attendance.correct",
      "attendance.override",
      "sessions.manage",
      "group_entry.configure",
      "group_entry.scan",
      "group_entry.view",
      "group_entry.override",
      "group_entry.audit",
      "analytics.view",
      "data.export_csv",
      "data.import_csv",
      "integrations.google.manage",
      "org.manage_team",
    ],
  },
  registration_manager: {
    id: "registration_manager",
    name: "Registration Manager",
    description: "Manage attendee registrations, bulk group orders, ticket distribution, and data imports",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "tickets.view",
      "attendees.edit",
      "tickets.bulk",
      "tickets.distribute",
      "tickets.reassign",
      "tickets.validate_serial",
      "data.export_csv",
      "data.import_csv",
      "analytics.view",
    ],
  },
  gate_supervisor: {
    id: "gate_supervisor",
    name: "Gate Supervisor",
    description: "Manage entry/exit gates, door scanners, anti-passback rules, and supervisor overrides",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "gates.manage",
      "attendance.scan_gate",
      "attendance.correct",
      "attendance.override",
      "group_entry.scan",
      "group_entry.view",
      "group_entry.override",
      "group_entry.audit",
      "tickets.view",
      "tickets.validate_serial",
      "analytics.view",
      "org.view_audit",
    ],
  },
  gate_manager: {
    id: "gate_manager",
    name: "Gate Manager",
    description: "Alias for Gate Supervisor with gate routing, scanner coordination, and attendance overrides",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "gates.manage",
      "attendance.scan_gate",
      "attendance.correct",
      "attendance.override",
      "group_entry.scan",
      "group_entry.view",
      "group_entry.override",
      "group_entry.audit",
      "tickets.view",
      "tickets.validate_serial",
      "analytics.view",
      "org.view_audit",
    ],
  },
  gate_staff: {
    id: "gate_staff",
    name: "Gate Staff",
    description: "Scan QR passes at assigned entry/exit gates in online and offline modes",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "attendance.scan_gate",
      "group_entry.scan",
      "group_entry.view",
      "tickets.validate_serial",
    ],
  },
  checkin_staff: {
    id: "checkin_staff",
    name: "Check-in Staff",
    description: "Standard gate door check-in staff for assigned venue gates",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "attendance.scan_gate",
      "group_entry.scan",
      "group_entry.view",
      "tickets.validate_serial",
    ],
  },
  session_manager: {
    id: "session_manager",
    name: "Session Manager",
    description: "Manage conference multi-track sessions, room capacities, and session-level check-ins",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "sessions.manage",
      "attendance.scan_session",
      "attendance.correct",
      "tickets.view",
      "tickets.validate_serial",
      "analytics.view",
    ],
  },
  session_scanner: {
    id: "session_scanner",
    name: "Session Scanner",
    description: "Scan attendee passes for assigned conference tracks and session rooms",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "attendance.scan_session",
      "tickets.validate_serial",
    ],
  },
  finance: {
    id: "finance",
    name: "Finance",
    description: "Manage billing, invoices, payment gateways, and financial revenue reports",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "org.manage_billing",
      "analytics.view",
      "org.view_audit",
    ],
  },
  analytics_viewer: {
    id: "analytics_viewer",
    name: "Analytics Viewer",
    description: "View authorized real-time venue attendance and operational reports without editing rights",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "analytics.view",
    ],
  },
  viewer: {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to organization overview and reports",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
      "analytics.view",
    ],
  },
  member: {
    id: "member",
    name: "Attendee / Member",
    description: "Access own bookings, tickets, and allowed distribution links",
    isBuiltIn: true,
    isAssignable: true,
    permissions: [
      "events.view",
    ],
  },
};

/**
 * Role Normalization & Lookup
 */
export function getRoleTemplate(roleId: string | null | undefined): RoleTemplate | null {
  if (!roleId) return null;
  const key = roleId.toLowerCase().trim();
  return BUILT_IN_ROLES[key] || null;
}

export function getRolePermissions(roleId: string | null | undefined): readonly UrPassPermission[] {
  const t = getRoleTemplate(roleId);
  return t ? t.permissions : [];
}

/**
 * Clone a built-in role template into a custom role configuration
 */
export function cloneRoleTemplate(
  baseRoleId: string,
  customName: string,
  organizationId: string,
  overrides?: {
    description?: string;
    addPermissions?: UrPassPermission[];
    removePermissions?: UrPassPermission[];
  }
): CustomRole {
  const base = getRoleTemplate(baseRoleId) || BUILT_IN_ROLES.viewer;
  const basePerms = new Set(base.permissions);

  if (overrides?.addPermissions) {
    overrides.addPermissions.forEach((p) => basePerms.add(p));
  }
  if (overrides?.removePermissions) {
    overrides.removePermissions.forEach((p) => basePerms.delete(p));
  }

  return {
    id: `role_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    organizationId,
    name: customName,
    description: overrides?.description || `Custom role derived from ${base.name}`,
    baseRoleTemplateId: base.id,
    permissions: Array.from(basePerms),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Privilege Escalation Guard
 * Ensures an actor cannot grant permissions or roles that exceed their own permissions.
 */
export function canAssignPermissions(
  actorPermissions: readonly UrPassPermission[],
  targetPermissions: readonly UrPassPermission[]
): boolean {
  const actorSet = new Set(actorPermissions);
  // Actor must hold all permissions they are attempting to grant
  return targetPermissions.every((p) => actorSet.has(p));
}

/**
 * Owner Protection Guard
 * Ensures the organization owner cannot be deleted, demoted, or removed.
 */
export function isProtectedOwner(targetRole: string | null | undefined): boolean {
  return targetRole?.toLowerCase() === "owner";
}
