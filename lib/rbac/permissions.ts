/**
 * UrPass Role-Based Access Control (RBAC) - Granular Permissions Definition
 * Module M13 · Enterprise Security & Permission Management
 */

export type PermissionCategory =
  | "registration_and_ticketing"
  | "event_operations"
  | "data_and_integrations"
  | "administration_and_security";

export type UrPassPermission =
  // ── Registration & Ticketing ──
  | "tickets.view"
  | "attendees.edit"
  | "tickets.bulk"
  | "tickets.distribute"
  | "tickets.reassign"
  | "tickets.validate_serial"

  // ── Event Operations ──
  | "events.view"
  | "events.manage"
  | "gates.manage"
  | "attendance.scan_gate"
  | "attendance.scan_session"
  | "attendance.correct"
  | "attendance.override"
  | "sessions.manage"
  | "group_entry.configure"
  | "group_entry.scan"
  | "group_entry.view"
  | "group_entry.override"
  | "group_entry.audit"

  // ── Data & Integrations ──
  | "analytics.view"
  | "data.export_csv"
  | "data.import_csv"
  | "integrations.google.manage"

  // ── Administration & Security ──
  | "org.manage_team"
  | "org.manage_roles"
  | "org.manage_settings"
  | "org.manage_billing"
  | "org.view_audit"
  | "org.manage_security"
  | "platform.manage_system";

export interface PermissionDefinition {
  id: UrPassPermission;
  label: string;
  description: string;
  category: PermissionCategory;
  requiredFeature?: string; // Optional feature flag required in event/plan
}

export const PERMISSION_CATEGORIES: Record<PermissionCategory, { label: string; description: string }> = {
  registration_and_ticketing: {
    label: "Registration & Ticketing",
    description: "Manage attendee forms, bulk purchases, ticket distribution, and serial validation",
  },
  event_operations: {
    label: "Event Operations",
    description: "Manage venue gates, scanner operations, session attendance, and entry corrections",
  },
  data_and_integrations: {
    label: "Data & Integrations",
    description: "Access analytics, CSV import/export manifests, and Google Sheets sync",
  },
  administration_and_security: {
    label: "Administration & Security",
    description: "Manage team roles, organization settings, billing, and audit logs",
  },
};

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Registration & Ticketing
  {
    id: "tickets.view",
    label: "View registrations",
    description: "View attendee lists, order records, and pass details",
    category: "registration_and_ticketing",
  },
  {
    id: "attendees.edit",
    label: "Edit attendee details",
    description: "Modify attendee profile fields, registration answers, and custom details",
    category: "registration_and_ticketing",
  },
  {
    id: "tickets.bulk",
    label: "Manage bulk tickets",
    description: "Configure group pricing, bulk quantities, and atomic inventory allocations",
    category: "registration_and_ticketing",
    requiredFeature: "bulk_ticketing",
  },
  {
    id: "tickets.distribute",
    label: "Distribute tickets",
    description: "Dispatch digital passes, claim links, and bulk email invitations",
    category: "registration_and_ticketing",
    requiredFeature: "ticket_distribution",
  },
  {
    id: "tickets.reassign",
    label: "Reassign tickets",
    description: "Revoke existing QR tokens and reassign unused passes to new attendees",
    category: "registration_and_ticketing",
    requiredFeature: "ticket_reassignment",
  },
  {
    id: "tickets.validate_serial",
    label: "Serial validation",
    description: "Validate roll numbers, manual sequences, or verified member whitelists",
    category: "registration_and_ticketing",
    requiredFeature: "serial_validation",
  },

  // Event Operations
  {
    id: "events.view",
    label: "View events",
    description: "Read event schedules, venues, and public pass configurations",
    category: "event_operations",
  },
  {
    id: "events.manage",
    label: "Manage events",
    description: "Create, edit, and configure event parameters and custom fields",
    category: "event_operations",
  },
  {
    id: "gates.manage",
    label: "Manage gates",
    description: "Configure entry/exit gates, zone routing, and staff door assignments",
    category: "event_operations",
    requiredFeature: "gate_tracking",
  },
  {
    id: "attendance.scan_gate",
    label: "Scan gate entry/exit",
    description: "Scan QR passes at assigned venue gates in online and offline modes",
    category: "event_operations",
  },
  {
    id: "attendance.scan_session",
    label: "Scan session attendance",
    description: "Scan QR passes for assigned conference tracks and session rooms",
    category: "event_operations",
    requiredFeature: "session_tracking",
  },
  {
    id: "attendance.correct",
    label: "Correct attendance",
    description: "Allow re-entry, undo check-ins, or reset pass status after errors",
    category: "event_operations",
  },
  {
    id: "attendance.override",
    label: "Authorize supervisor override",
    description: "Grant supervisor-level entry override when zone/gate rules block admission",
    category: "event_operations",
  },
  {
    id: "sessions.manage",
    label: "Manage sessions",
    description: "Configure multi-track sessions, room capacities, and attendance eligibility",
    category: "event_operations",
    requiredFeature: "session_tracking",
  },
  {
    id: "group_entry.configure",
    label: "Configure group QR booking rules",
    description: "Configure group QR partial entry rules, entitlement counts, and mode selection",
    category: "event_operations",
    requiredFeature: "group_entry",
  },
  {
    id: "group_entry.scan",
    label: "Admit members with group QR",
    description: "Admit attendees and deduct entry entitlements using group QR at assigned gates",
    category: "event_operations",
    requiredFeature: "group_entry",
  },
  {
    id: "group_entry.view",
    label: "View booking entry balance",
    description: "View total, admitted, and remaining entry entitlement balances for group bookings",
    category: "event_operations",
  },
  {
    id: "group_entry.override",
    label: "Perform supervisory group corrections",
    description: "Perform audited supervisory corrections to group entry admission counts",
    category: "event_operations",
  },
  {
    id: "group_entry.audit",
    label: "View full admission history",
    description: "View complete audit trail of group QR admissions, gates, operators, and timestamps",
    category: "event_operations",
  },

  // Data & Integrations
  {
    id: "analytics.view",
    label: "View advanced analytics",
    description: "Access real-time venue headcount, throughput velocity, and conversion curves",
    category: "data_and_integrations",
    requiredFeature: "advanced_analytics",
  },
  {
    id: "data.export_csv",
    label: "Export CSV",
    description: "Download formula-sanitized CSV attendee manifests and operational exports",
    category: "data_and_integrations",
    requiredFeature: "csv_management",
  },
  {
    id: "data.import_csv",
    label: "Import CSV",
    description: "Upload and stage bulk attendee import spreadsheets with automated validation",
    category: "data_and_integrations",
    requiredFeature: "csv_management",
  },
  {
    id: "integrations.google.manage",
    label: "Manage Google Sheets",
    description: "Connect organizer Google accounts and configure real-time spreadsheet synchronization",
    category: "data_and_integrations",
    requiredFeature: "google_sheets_sync",
  },

  // Administration & Security
  {
    id: "org.manage_team",
    label: "Manage team roles",
    description: "Invite team members, assign resource scopes, and modify role templates",
    category: "administration_and_security",
  },
  {
    id: "org.manage_roles",
    label: "Manage custom roles",
    description: "Create, clone, and configure granular custom role permission sets",
    category: "administration_and_security",
  },
  {
    id: "org.manage_settings",
    label: "Manage feature settings",
    description: "Configure organization profile, default currencies, and branding",
    category: "administration_and_security",
  },
  {
    id: "org.manage_billing",
    label: "Manage billing & plans",
    description: "Manage subscription plans, payment methods, tax receipts, and invoices",
    category: "administration_and_security",
  },
  {
    id: "org.view_audit",
    label: "View enterprise audit logs",
    description: "Access immutable audit logs for role modifications, rejections, and gate overrides",
    category: "administration_and_security",
  },
  {
    id: "org.manage_security",
    label: "Manage security & SSO",
    description: "Configure SAML 2.0 / OAuth SSO, SCIM directories, 2FA, and domain verification",
    category: "administration_and_security",
  },
  {
    id: "platform.manage_system",
    label: "Platform administration",
    description: "UrPass platform maintenance, global subscriptions, and system health",
    category: "administration_and_security",
  },
];

export const PERMISSIONS_BY_ID = ALL_PERMISSIONS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<UrPassPermission, PermissionDefinition>
);
