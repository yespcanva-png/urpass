import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  event_date: z.string().min(1, "Event date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  venue: z.string().max(500),
  event_type: z.enum(["physical", "online", "hybrid"]),
  meeting_url: z.string().url("Enter a valid URL").optional().nullable(),
  meeting_platform: z
    .enum(["zoom", "google_meet", "teams", "custom"])
    .optional()
    .nullable(),
  attendee_limit: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .positive("Must be greater than 0")
    .max(100_000, "Maximum 100,000 attendees"),
  status: z.enum(["draft", "active"]),
  application_enabled: z.boolean(),
  auto_approve: z.boolean(),
  is_paid_event: z.boolean(),
  ticket_price: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(0, "Price cannot be negative")
    .max(100_000_00, "Maximum ticket price is ₹1,00,000"),
  workspace_id: z.string().uuid().optional().nullable(),
  location_id: z.string().uuid().optional().nullable(),
});

export type EventInput = z.infer<typeof eventSchema>;
