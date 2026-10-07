import { z } from "zod";

export const ageTierPricingSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, "Tier label is required"),
  min_age: z.number().int().min(0).max(120).nullable().optional(),
  max_age: z.number().int().min(0).max(120).nullable().optional(),
  price: z.number().min(0, "Price must be 0 or more").default(0), // in rupees in form
  description: z.string().max(200).optional().nullable(),
  is_free: z.boolean().default(false),
  badge_label: z.string().max(30).optional().nullable(),
});

export type AgeTierPricing = z.infer<typeof ageTierPricingSchema>;

export function findMatchingAgeTier<T extends { min_age?: number | null; max_age?: number | null }>(
  age: number | null | undefined,
  tiers: T[] | null | undefined
): T | null {
  if (!tiers || tiers.length === 0) return null;
  if (age === null || age === undefined || isNaN(Number(age))) {
    return tiers[0] || null;
  }
  const numericAge = Number(age);
  const match = tiers.find((tier) => {
    const min = tier.min_age ?? 0;
    const max = tier.max_age ?? 150;
    return numericAge >= min && numericAge <= max;
  });
  return match || tiers[0] || null;
}

export const AGE_TIER_PRESETS: {
  id: string;
  name: string;
  description: string;
  tiers: AgeTierPricing[];
}[] = [
  {
    id: "standard_all_ages",
    name: "Standard All-Ages (Adult / Child / Senior / Infant)",
    description: "Standard corporate & festival breakdown with adult, child, senior discount, and free infants",
    tiers: [
      { id: "adult", label: "Adult (18–59 yrs)", min_age: 18, max_age: 59, price: 0, is_free: false, badge_label: "ADULT" },
      { id: "child", label: "Child (5–12 yrs)", min_age: 5, max_age: 12, price: 0, is_free: false, badge_label: "CHILD" },
      { id: "senior", label: "Senior Citizen (60+ yrs)", min_age: 60, max_age: null, price: 0, is_free: false, badge_label: "SENIOR" },
      { id: "infant", label: "Infant (<5 yrs)", min_age: 0, max_age: 4, price: 0, is_free: true, badge_label: "INFANT (FREE)" },
    ],
  },
  {
    id: "family_youth",
    name: "Family & Youth (Adult / Teen / Kid / Toddler)",
    description: "Ideal for family-friendly conventions, fests, and cultural celebrations",
    tiers: [
      { id: "adult", label: "Adult (18+ yrs)", min_age: 18, max_age: null, price: 0, is_free: false, badge_label: "ADULT" },
      { id: "teen", label: "Teen / Youth (13–17 yrs)", min_age: 13, max_age: 17, price: 0, is_free: false, badge_label: "TEEN" },
      { id: "kid", label: "Kid (3–12 yrs)", min_age: 3, max_age: 12, price: 0, is_free: false, badge_label: "KID" },
      { id: "toddler", label: "Toddler (<3 yrs)", min_age: 0, max_age: 2, price: 0, is_free: true, badge_label: "FREE" },
    ],
  },
  {
    id: "collegiate",
    name: "Collegiate & Academic (General / Student / School)",
    description: "Geared towards university hackathons, conferences, and technical symposiums",
    tiers: [
      { id: "general", label: "General Professional (22+ yrs)", min_age: 22, max_age: null, price: 0, is_free: false, badge_label: "GENERAL" },
      { id: "student", label: "College Student (17–25 yrs)", min_age: 17, max_age: 25, price: 0, is_free: false, badge_label: "STUDENT" },
      { id: "school", label: "School Student (<17 yrs)", min_age: 0, max_age: 16, price: 0, is_free: false, badge_label: "SCHOOL" },
    ],
  },
];

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

    // ── Age-Wise Pricing Support ──
    age_pricing_enabled: z.boolean().default(false),
    age_tiers: z.array(ageTierPricingSchema).default([]),

    // ── Extra Member & Group Support ──
    is_group_pass: z.boolean().default(false),
    included_guests: z.number().int().min(1).default(1),
    min_guests: z.number().int().min(1).default(1),
    max_guests: z.number().int().min(1).default(1),
    allow_extra_guests: z.boolean().default(false),
    extra_guest_price: z.number().min(0, "Extra member price must be 0 or more").default(0), // in rupees
    max_extra_guests: z.number().int().min(0).max(50).default(0),
    extra_member_pricing_mode: z.enum(["flat", "age_based"]).default("flat"),

    // ── Duration & Access Metadata ──
    duration_label: z.string().max(50).optional().nullable(),
    duration_days: z.number().int().min(1).max(30).default(1),
    pass_validity: z.string().max(50).optional().nullable(),
    access_type: z.string().max(50).optional().nullable(),
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
