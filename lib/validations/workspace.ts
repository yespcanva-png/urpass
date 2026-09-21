import { z } from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be under 50 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be under 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().trim().max(300, "Description must be under 300 characters").optional().or(z.literal("")),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #6D28D9)").default("#6D28D9"),
  is_default: z.boolean().default(false),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;
