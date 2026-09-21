import { z } from "zod";

export const locationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Location name must be at least 2 characters")
    .max(100, "Location name must be under 100 characters"),
  workspace_id: z.string().uuid("Invalid workspace ID").nullable().optional(),
  venue_type: z.enum(["physical", "virtual", "hybrid"]).default("physical"),
  address: z.string().trim().max(300, "Address must be under 300 characters").optional().or(z.literal("")),
  city: z.string().trim().max(100, "City must be under 100 characters").optional().or(z.literal("")),
  state: z.string().trim().max(100, "State must be under 100 characters").optional().or(z.literal("")),
  country: z.string().trim().default("India"),
  postal_code: z.string().trim().max(20, "Postal code must be under 20 characters").optional().or(z.literal("")),
  capacity: z.coerce.number().int().min(0, "Capacity must be positive").optional().nullable(),
  timezone: z.string().default("Asia/Kolkata"),
  virtual_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contact_name: z.string().trim().max(100).optional().or(z.literal("")),
  contact_phone: z.string().trim().max(30).optional().or(z.literal("")),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type LocationInput = z.infer<typeof locationSchema>;
