import { z } from "zod";

export const ticketTypeSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional().nullable(),
    category: z
      .enum(["general", "vip", "student", "early_bird", "workshop", "staff", "speaker", "custom"])
      .default("general"),
    price: z.number().min(0, "Price must be 0 or more").default(0), // in rupees in form, converted to paise in action
    capacity: z.number().int().min(1).nullable().optional(),
    sales_start: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
    sales_end: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
    max_per_person: z.number().int().min(1).max(20).default(1),
    status: z.enum(["draft", "on_sale", "closed"]).default("on_sale"),
  })
  .refine(
    (data) => {
      if (data.sales_start && data.sales_end) {
        const start = new Date(data.sales_start).getTime();
        const end = new Date(data.sales_end).getTime();
        if (!isNaN(start) && !isNaN(end)) {
          return end > start;
        }
      }
      return true;
    },
    {
      message: "Sales end date must be after sales start date",
      path: ["sales_end"],
    }
  );

export type TicketTypeInput = z.infer<typeof ticketTypeSchema>;
