import { z } from "zod";

export const ssoConnectionSchema = z.object({
  name: z.string().trim().min(2, "Connection name must be at least 2 characters").max(100),
  protocol: z.enum(["SAML", "OIDC"]),
  status: z.enum(["draft", "active", "inactive", "testing"]).default("draft"),
  domains: z.array(z.string().trim().toLowerCase()).default([]),
  enforce_sso: z.boolean().default(false),
  jit_provisioning: z.boolean().default(true),
  default_role: z.enum(["owner", "admin", "event_manager", "checkin_staff", "viewer", "member"]).default("member"),

  // SAML fields
  idp_entity_id: z.string().trim().optional().nullable(),
  idp_sso_url: z.string().trim().optional().nullable(),
  idp_certificate: z.string().trim().optional().nullable(),

  // OIDC fields
  oidc_issuer: z.string().trim().optional().nullable(),
  oidc_client_id: z.string().trim().optional().nullable(),
  oidc_client_secret: z.string().trim().optional().nullable(),
  oidc_authorization_endpoint: z.string().trim().optional().nullable(),
  oidc_token_endpoint: z.string().trim().optional().nullable(),
  oidc_userinfo_endpoint: z.string().trim().optional().nullable(),
});

export type SSOConnectionInput = z.infer<typeof ssoConnectionSchema>;

export const domainSchema = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/,
      "Please enter a valid domain (e.g. company.com or events.company.com)"
    ),
});

export type DomainInput = z.infer<typeof domainSchema>;

export const securityPoliciesSchema = z.object({
  enforce_sso: z.boolean().default(false),
  allow_emergency_owner_login: z.boolean().default(true),
  session_idle_timeout_minutes: z.number().int().min(15).max(10080).default(1440),
  enforce_2fa: z.boolean().default(false),
  allowed_domains: z.array(z.string().trim().toLowerCase()).default([]),
  allowed_cidrs: z.array(z.string().trim()).default([]),
  enforce_ip_allowlist: z.boolean().default(false),
  anonymize_pii_days: z.number().int().min(7).max(730).nullable().optional(),
});

export type SecurityPoliciesInput = z.infer<typeof securityPoliciesSchema>;
