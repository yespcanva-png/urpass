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

export const ORG_PERMISSIONS = {
  manageMembers: ["owner", "admin"],
  inviteMembers: ["owner", "admin"],
  manageMemberRoles: ["owner", "admin"],
  manageOrgSettings: ["owner", "admin"],
  deleteOrganization: ["owner"],
  manageEvents: ["owner", "admin", "event_manager"],
  manageTicketing: ["owner", "admin", "event_manager", "registration_manager", "finance"],
  distributeTickets: ["owner", "admin", "event_manager", "registration_manager"],
  reassignTickets: ["owner", "admin", "event_manager", "registration_manager"],
  manageGates: ["owner", "admin", "event_manager", "gate_supervisor", "gate_manager"],
  manageSessions: ["owner", "admin", "event_manager", "session_manager"],
  manageCheckIn: ["owner", "admin", "event_manager", "gate_supervisor", "gate_manager", "gate_staff", "checkin_staff", "session_manager", "session_scanner"],
  viewCheckIn: ["owner", "admin", "event_manager", "registration_manager", "gate_supervisor", "gate_manager", "gate_staff", "checkin_staff", "session_manager", "session_scanner", "analytics_viewer", "viewer"],
  manageBilling: ["owner", "admin", "finance"],
  viewBilling: ["owner", "admin", "finance", "analytics_viewer", "viewer"],
  manageInvoices: ["owner", "admin", "finance"],
  manageRefunds: ["owner", "admin", "finance"],
  viewAnalytics: ["owner", "admin", "event_manager", "registration_manager", "gate_supervisor", "gate_manager", "session_manager", "finance", "analytics_viewer", "viewer"],
  viewAuditLogs: ["owner", "admin", "finance", "gate_supervisor", "gate_manager"],
  manageSecurity: ["owner", "admin"],
  manageGoogleSheets: ["owner", "admin", "event_manager"],
  exportCsv: ["owner", "admin", "event_manager", "registration_manager"],
  importCsv: ["owner", "admin", "event_manager", "registration_manager"],
  viewOrg: ["owner", "admin", "event_manager", "registration_manager", "gate_supervisor", "gate_manager", "gate_staff", "checkin_staff", "session_manager", "session_scanner", "finance", "analytics_viewer", "viewer", "member"],
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
  return isOrgRole(role) && (ORG_PERMISSIONS[permission] as readonly string[]).includes(role);
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
