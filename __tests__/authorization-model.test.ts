import { describe, expect, it } from "vitest";
import {
  canChangeOrgMemberRole,
  canRemoveOrgMember,
  hasOrgPermission,
  isAssignableOrgRole,
  isOrgRole,
} from "@/lib/authorization";

describe("enterprise authorization model", () => {
  it("recognizes only supported organization roles", () => {
    expect(isOrgRole("owner")).toBe(true);
    expect(isOrgRole("admin")).toBe(true);
    expect(isOrgRole("event_manager")).toBe(true);
    expect(isOrgRole("checkin_staff")).toBe(true);
    expect(isOrgRole("viewer")).toBe(true);
    expect(isOrgRole("member")).toBe(true);
    expect(isOrgRole("super_admin")).toBe(false);
    expect(isOrgRole(null)).toBe(false);
  });

  it("does not allow owner as an assignable member role", () => {
    expect(isAssignableOrgRole("admin")).toBe(true);
    expect(isAssignableOrgRole("member")).toBe(true);
    expect(isAssignableOrgRole("owner")).toBe(false);
    expect(isAssignableOrgRole("super_admin")).toBe(false);
  });

  it("maps admin-level permissions to owners and admins only", () => {
    expect(hasOrgPermission("owner", "manageMembers")).toBe(true);
    expect(hasOrgPermission("admin", "manageMembers")).toBe(true);
    expect(hasOrgPermission("event_manager", "manageMembers")).toBe(false);
    expect(hasOrgPermission("member", "manageMembers")).toBe(false);
  });

  it("allows event managers to manage events but not billing or security", () => {
    expect(hasOrgPermission("event_manager", "manageEvents")).toBe(true);
    expect(hasOrgPermission("event_manager", "manageBilling")).toBe(false);
    expect(hasOrgPermission("event_manager", "manageSecurity")).toBe(false);
  });

  it("allows check-in staff only for check-in operations among write permissions", () => {
    expect(hasOrgPermission("checkin_staff", "manageCheckIn")).toBe(true);
    expect(hasOrgPermission("checkin_staff", "manageEvents")).toBe(false);
    expect(hasOrgPermission("checkin_staff", "manageMembers")).toBe(false);
  });

  it("protects owner role from member role changes and removal", () => {
    expect(canChangeOrgMemberRole("owner", "admin")).toBe(true);
    expect(canChangeOrgMemberRole("admin", "owner")).toBe(false);
    expect(canRemoveOrgMember("owner", "member", false)).toBe(true);
    expect(canRemoveOrgMember("owner", "owner", false)).toBe(false);
    expect(canRemoveOrgMember(undefined, "owner", true)).toBe(false);
  });

  it("allows self-removal for non-owner members", () => {
    expect(canRemoveOrgMember(undefined, "member", true)).toBe(true);
    expect(canRemoveOrgMember("member", "admin", false)).toBe(false);
  });
});
