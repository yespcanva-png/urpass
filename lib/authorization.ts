import type { OrgRole } from "@/types";
export * from "./rbac";

export const ORG_ROLES = [
  "owner",
  "admin",
  "event_manager",
  "registration_manager",
  "gate_supervisor",
  "gate_manager",
  "gate_staff",
  "checkin_staff",
  "session_manager",
  "session_scanner",
  "finance",
  "analytics_viewer",
  "viewer",
  "member",
] as const satisfies readonly OrgRole[];

export const ASSIGNABLE_ORG_ROLES = [
  "admin",
  "event_manager",
  "registration_manager",
  "gate_supervisor",
  "gate_manager",
  "gate_staff",
  "checkin_staff",
  "session_manager",
  "session_scanner",
  "finance",
  "analytics_viewer",
  "viewer",
  "member",
] as const satisfies readonly OrgRole[];

const LEGACY_ROLE_ALIASES: Partial<Record<OrgRole, OrgRole>> = {
  registration_manager: "event_manager",
  gate_supervisor: "gate_manager",
  gate_staff: "checkin_staff",
  session_manager: "event_manager",
  session_scanner: "checkin_staff",
  analytics_viewer: "viewer",
};

function normalizePermissionRole(role: string | null | undefined) {
  if (!isOrgRole(role)) return role;
  return LEGACY_ROLE_ALIASES[role] ?? role;
}

export const ORG_PERMISSIONS = {
  manageMembers: ["owner", "admin"],
  inviteMembers: ["owner", "admin"],
  manageMemberRoles: ["owner", "admin"],
  manageOrgSettings: ["owner", "admin"],
  deleteOrganization: ["owner"],
  manageEvents: ["owner", "admin", "event_manager"],
  manageTicketing: ["owner", "admin", "event_manager", "finance"],
  distributeTickets: ["owner", "admin", "event_manager"],
  reassignTickets: ["owner", "admin", "event_manager"],
  manageGates: ["owner", "admin", "event_manager", "gate_manager"],
  manageSessions: ["owner", "admin", "event_manager"],
  manageCheckIn: ["owner", "admin", "event_manager", "gate_manager", "checkin_staff"],
  viewCheckIn: ["owner", "admin", "event_manager", "gate_manager", "checkin_staff", "viewer"],
  manageBilling: ["owner", "admin", "finance"],
  viewBilling: ["owner", "admin", "finance", "viewer"],
  manageInvoices: ["owner", "admin", "finance"],
  manageRefunds: ["owner", "admin", "finance"],
  viewAnalytics: ["owner", "admin", "event_manager", "gate_manager", "finance", "viewer"],
  viewAuditLogs: ["owner", "admin", "finance", "gate_manager"],
  manageSecurity: ["owner", "admin"],
  manageGoogleSheets: ["owner", "admin", "event_manager"],
  exportCsv: ["owner", "admin", "event_manager"],
  importCsv: ["owner", "admin", "event_manager"],
  viewOrg: ["owner", "admin", "event_manager", "gate_manager", "checkin_staff", "finance", "viewer", "member"],
} as const satisfies Record<string, readonly OrgRole[]>;

export type OrgPermission = keyof typeof ORG_PERMISSIONS;

export function isOrgRole(role: string | null | undefined): role is OrgRole {
  return typeof role === "string" && (ORG_ROLES as readonly string[]).includes(role);
}

export function isAssignableOrgRole(role: string | null | undefined): role is OrgRole {
  return typeof role === "string" && (ASSIGNABLE_ORG_ROLES as readonly string[]).includes(role);
}

export function hasOrgPermission(
  role: string | null | undefined,
  permission: OrgPermission
): role is OrgRole {
  const normalizedRole = normalizePermissionRole(role);
  return isOrgRole(role) && (ORG_PERMISSIONS[permission] as readonly string[]).includes(normalizedRole ?? "");
}

export function canChangeOrgMemberRole(actorRole: string | null | undefined, targetRole: string | null | undefined) {
  return hasOrgPermission(actorRole, "manageMemberRoles") && targetRole !== "owner";
}

export function canRemoveOrgMember(
  actorRole: string | null | undefined,
  targetRole: string | null | undefined,
  isSelf: boolean
) {
  if (targetRole === "owner") return false;
  return isSelf || hasOrgPermission(actorRole, "manageMembers");
}
