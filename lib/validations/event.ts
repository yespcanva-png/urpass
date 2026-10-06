import { z } from "zod";

export const eventSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional().nullable().transform((val) => val || null),
    event_date: z.string().min(1, "Event date is required"),
    end_date: z.string().optional().nullable(),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    venue: z.string().max(500),
    event_type: z.enum(["physical", "online", "hybrid"]),
    meeting_url: z
      .union([z.string().url("Enter a valid URL"), z.literal("")])
      .optional()
      .nullable()
      .transform((val) => (val ? val : null)),
    meeting_platform: z
      .union([z.enum(["zoom", "google_meet", "teams", "custom"]), z.literal("")])
      .optional()
      .nullable()
      .transform((val) => (val ? val : null)),
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
    workspace_id: z
      .union([z.string().uuid("Invalid workspace"), z.literal("")])
      .optional()
      .nullable()
      .transform((val) => (val ? val : null)),
    location_id: z
      .union([z.string().uuid("Invalid location"), z.literal("")])
      .optional()
      .nullable()
      .transform((val) => (val ? val : null)),
    currency: z.enum(["INR", "GBP", "USD"]).default("INR"),
    timezone: z.string().default("Asia/Kolkata"),
    event_images: z.array(z.string()).optional(),
    custom_slug: z.string().max(100, "URL slug cannot exceed 100 characters").optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // 1. Date & Time validation (supports multi-day and overnight / past-midnight schedules)
    if (data.event_date && data.end_date) {
      if (data.end_date < data.event_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date cannot be earlier than start date",
          path: ["end_date"],
        });
      }
    }

    if (data.start_time && data.end_time) {
      const startMinutes = parseTimeToMinutes(data.start_time);
      const endMinutes = parseTimeToMinutes(data.end_time);
      const isSameDate = !data.end_date || data.end_date === data.event_date;

      // When on the exact same date and start time equals end time
      if (isSameDate && startMinutes !== null && endMinutes !== null && startMinutes === endMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time cannot be the same as start time",
          path: ["end_time"],
        });
      }
      // Note: When endMinutes < startMinutes on single-day events (e.g., 19:00 -> 01:00),
      // it is a valid overnight schedule continuing past midnight into the next day.
    }

    // 2. Physical and Hybrid events must have a non-empty venue
    if ((data.event_type === "physical" || data.event_type === "hybrid") && (!data.venue || !data.venue.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Venue is required for physical and hybrid events",
        path: ["venue"],
      });
    }

    // 3. Online and Hybrid events require meeting URL when published / active
    if ((data.event_type === "online" || data.event_type === "hybrid") && data.status === "active") {
      if (!data.meeting_url || !data.meeting_url.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Meeting URL is required when publishing an online or hybrid event",
          path: ["meeting_url"],
        });
      }
    }
  });

function parseTimeToMinutes(timeStr: string): number | null {
  const parts = timeStr.trim().split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (!isNaN(hours) && !isNaN(minutes)) {
      return hours * 60 + minutes;
    }
  }
  return null;
}

export type EventInput = z.infer<typeof eventSchema>;

