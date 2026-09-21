import { z } from "zod";

export const organizationSettingsSchema = z.object({
  timezone: z.string().default("Asia/Kolkata"),
  currency: z.string().default("INR"),
  date_format: z.string().default("DD/MM/YYYY"),
  time_format: z.enum(["12h", "24h"]).default("12h"),
  allowed_domains: z.array(z.string().trim().toLowerCase()).default([]),
  enforce_2fa: z.boolean().default(false),
  require_approval_for_passes: z.boolean().default(false),
  email_sender_name: z.string().trim().max(100).optional().or(z.literal("")),
  support_email: z.string().email("Invalid email").optional().or(z.literal("")),
  custom_domain: z.string().trim().max(100).optional().or(z.literal("")),
  brand_logo_url: z.string().url("Must be valid URL").optional().or(z.literal("")),
  brand_primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#6D28D9"),
  brand_secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#4C1D95"),
  default_pass_template: z.string().default("modern"),
  features: z
    .object({
      workspaces: z.boolean().optional(),
      locations: z.boolean().optional(),
      multiGate: z.boolean().optional(),
      advancedAnalytics: z.boolean().optional(),
      customPasses: z.boolean().optional(),
    })
    .default({}),
});

export type OrganizationSettingsInput = z.input<typeof organizationSettingsSchema>;
