import type { OrgRole } from "@/types";

export const ORG_ROLES = [
  "owner",
  "admin",
  "event_manager",
  "checkin_staff",
  "viewer",
  "member",
] as const satisfies readonly OrgRole[];

export const ASSIGNABLE_ORG_ROLES = [
  "admin",
  "event_manager",
  "checkin_staff",
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
  manageTicketing: ["owner", "admin", "event_manager"],
  manageCheckIn: ["owner", "admin", "event_manager", "checkin_staff"],
  manageBilling: ["owner", "admin"],
  manageSecurity: ["owner", "admin"],
  viewOrg: ["owner", "admin", "event_manager", "checkin_staff", "viewer", "member"],
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
