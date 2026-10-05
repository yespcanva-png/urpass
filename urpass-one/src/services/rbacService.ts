import type { UserRole, UserPermissions } from "../types";

export const RBACService = {
  getPermissions(role: UserRole): UserPermissions {
    switch (role) {
      case "super_admin":
      case "org_admin":
        return {
          canAccessEvents: true,
          canOperateGates: true,
          canSearchAttendees: true,
          canOverrideScans: true,
          canPerformCheckout: true,
          canViewAnalytics: true,
          canManageStaff: true,
          canConfigureAccessRules: true,
        };

      case "event_manager":
        return {
          canAccessEvents: true,
          canOperateGates: true,
          canSearchAttendees: true,
          canOverrideScans: true,
          canPerformCheckout: true,
          canViewAnalytics: true,
          canManageStaff: true,
          canConfigureAccessRules: true,
        };

      case "gate_manager":
        return {
          canAccessEvents: true,
          canOperateGates: true,
          canSearchAttendees: true,
          canOverrideScans: true,
          canPerformCheckout: true,
          canViewAnalytics: false,
          canManageStaff: true,
          canConfigureAccessRules: false,
        };

      case "gate_staff":
        return {
          canAccessEvents: true,
          canOperateGates: true,
          canSearchAttendees: true,
          canOverrideScans: false,
          canPerformCheckout: true,
          canViewAnalytics: false,
          canManageStaff: false,
          canConfigureAccessRules: false,
        };

      case "view_only_ops":
        return {
          canAccessEvents: true,
          canOperateGates: false,
          canSearchAttendees: true,
          canOverrideScans: false,
          canPerformCheckout: false,
          canViewAnalytics: true,
          canManageStaff: false,
          canConfigureAccessRules: false,
        };

      default:
        return {
          canAccessEvents: false,
          canOperateGates: false,
          canSearchAttendees: false,
          canOverrideScans: false,
          canPerformCheckout: false,
          canViewAnalytics: false,
          canManageStaff: false,
          canConfigureAccessRules: false,
        };
    }
  },

  canPerformAction(role: UserRole, action: keyof UserPermissions): boolean {
    const perms = this.getPermissions(role);
    return perms[action] ?? false;
  },

  formatRoleName(role: UserRole): string {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "org_admin":
        return "Organization Admin";
      case "event_manager":
        return "Event Manager";
      case "gate_manager":
        return "Gate Manager";
      case "gate_staff":
        return "Gate Staff / Scanner";
      case "view_only_ops":
        return "Operations Viewer";
      default:
        return role;
    }
  },
};
