export type WorkplaceType = "remote" | "hybrid" | "on-site";
export type EmploymentType = "full-time" | "part-time" | "internship" | "contract";
export type ExperienceLevel = "entry" | "junior" | "mid" | "senior" | "lead" | "intern";
export type JobStatus = "draft" | "published" | "archived";

export type ApplicationType = "job_specific" | "general" | "internship";
export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offered"
  | "hired"
  | "rejected";

export const CAREERS_DEPARTMENTS = [
  "Engineering",
  "UI/UX Design",
  "Product Management",
  "Growth & Marketing",
  "Customer Success",
  "Operations",
  "Internships",
] as const;

export type CareerDepartment = (typeof CAREERS_DEPARTMENTS)[number] | string;

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  department: CareerDepartment;
  location: string;
  workplace_type: WorkplaceType;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have?: string[];
  benefits?: string[];
  is_published: boolean;
  is_featured?: boolean;
  status: JobStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id?: string | null;
  job_title: string;
  department: string;
  application_type: ApplicationType;
  full_name: string;
  email: string;
  phone?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
  years_of_experience?: string | null;
  cover_note: string;
  resume_url?: string | null;
  resume_filename?: string | null;
  status: ApplicationStatus;
  recruiter_notes?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmitApplicationInput {
  jobId?: string | null;
  jobSlug?: string | null;
  jobTitle?: string;
  department?: string;
  applicationType?: ApplicationType;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  yearsOfExperience?: string;
  coverNote: string;
  resumeUrl?: string;
  resumeFilename?: string;
}

export interface CreateJobInput {
  title: string;
  slug?: string;
  department: string;
  location?: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  benefits?: string[];
  status?: JobStatus;
}
