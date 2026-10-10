import { z } from "zod";

export const canonicalOrgRoles = [
  "admin",
  "event_manager",
  "finance",
  "gate_manager",
  "checkin_staff",
  "viewer",
  "member",
] as const;

export function normalizeOrgRoleForStorage(role: unknown) {
  if (typeof role !== "string") return role;

  const aliases: Record<string, (typeof canonicalOrgRoles)[number]> = {
    gate_staff: "checkin_staff",
    session_scanner: "checkin_staff",
    gate_supervisor: "gate_manager",
    registration_manager: "event_manager",
    session_manager: "event_manager",
    analytics_viewer: "viewer",
  };

  return aliases[role] ?? role;
}

export const orgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  logo_url: z.string().url().nullable().optional(),
  website: z.string().url("Enter a valid URL").nullable().optional().or(z.literal("")),
  contact_email: z.string().email("Enter a valid email").nullable().optional().or(z.literal("")),
  contact_phone: z.string().nullable().optional(),
  brand_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Enter a valid hex color"),
});

export type OrgInput = z.infer<typeof orgSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.preprocess(normalizeOrgRoleForStorage, z.enum(canonicalOrgRoles)),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
