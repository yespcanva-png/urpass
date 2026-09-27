import { z } from "zod";

export const institutionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Institution name must be at least 3 characters")
    .max(100, "Institution name must be under 100 characters"),
  institution_code: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code must be under 20 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code can only contain uppercase letters, numbers, hyphens and underscores"),
  website: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  email_domain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, "Must be a valid domain (e.g. college.edu)")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().max(300, "Address must be under 300 characters").optional().or(z.literal("")),
  current_academic_year: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2,4}$/, "Academic year must be formatted like 2026-27")
    .default("2026-27"),
  require_event_approval: z.boolean().default(true),
  logo_url: z.string().trim().url().optional().or(z.literal("")),
});

export type InstitutionInput = z.input<typeof institutionSchema>;

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must be under 100 characters"),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Code must be at least 2 characters")
    .max(15, "Code must be under 15 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code can only contain uppercase letters, numbers, hyphens and underscores"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be under 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().trim().max(300, "Description must be under 300 characters").optional().or(z.literal("")),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").default("#6D28D9"),
  head_of_department_id: z.string().uuid("Invalid user ID").optional().or(z.literal("")),
});

export type DepartmentInput = z.input<typeof departmentSchema>;

export const clubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Club/Cell name must be at least 2 characters")
    .max(100, "Club/Cell name must be under 100 characters"),
  department_id: z.string().uuid("Invalid department ID").nullable().optional(),
  category: z.enum(["department_club", "cell", "committee", "student_chapter", "society"]).default("department_club"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be under 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().trim().max(300, "Description must be under 300 characters").optional().or(z.literal("")),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").default("#8B5CF6"),
  faculty_advisor_id: z.string().uuid("Invalid faculty user ID").optional().or(z.literal("")),
  lead_student_id: z.string().uuid("Invalid lead student user ID").optional().or(z.literal("")),
});

export type ClubInput = z.input<typeof clubSchema>;

export const campusMemberSchema = z.object({
  invited_email: z.string().trim().email("Must be a valid email address"),
  role: z.enum(["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN", "CLUB_ADMIN", "ORGANIZER", "SCANNER"]),
  department_id: z.string().uuid("Invalid department ID").nullable().optional(),
  club_id: z.string().uuid("Invalid club ID").nullable().optional(),
});

export type CampusMemberInput = z.input<typeof campusMemberSchema>;

export const campusStudentSchema = z.object({
  student_id: z.string().trim().max(50).optional().or(z.literal("")),
  roll_number: z.string().trim().min(1, "Roll number is required").max(50),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Must be a valid email address"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  department_id: z.string().uuid("Invalid department ID").nullable().optional(),
  year: z.number().int().min(1).max(5).nullable().optional(),
  section: z.string().trim().max(10).optional().or(z.literal("")),
});

export type CampusStudentInput = z.input<typeof campusStudentSchema>;

export const eventApprovalSchema = z.object({
  action: z.enum(["approve", "reject", "request_changes"]),
  reason: z.string().trim().max(500, "Reason must be under 500 characters").optional(),
});

export type EventApprovalInput = z.input<typeof eventApprovalSchema>;
