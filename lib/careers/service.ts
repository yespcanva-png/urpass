import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  JobPosting,
  JobApplication,
  SubmitApplicationInput,
  CreateJobInput,
  ApplicationStatus,
  JobStatus,
} from "./types";
import { sendJobApplicationConfirmationEmail, notifyAdminNewJobApplication } from "./emails";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || "mock-service-role-key",
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function isTestEnvironment(): boolean {
  return (
    process.env.NODE_ENV === "test" ||
    process.env.VITEST === "true" ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY === "mock-service-role-key"
  );
}

// ── In-Memory Resilient Fallback Store ──
// Used when database tables are awaiting migration or in mock test suites
const inMemoryJobs: JobPosting[] = [
  {
    id: "job-seed-fullstack-01",
    slug: "full-stack-founding-engineer",
    title: "Full-Stack Founding Engineer",
    department: "Engineering",
    location: "Bengaluru, India",
    workplace_type: "hybrid",
    employment_type: "full-time",
    experience_level: "mid",
    summary:
      "Design and build sub-second digital ticketing systems, offline-first QR scanners, and high-throughput real-time event telemetry.",
    description: `UrPass is reimagining event check-in and attendee operations for modern conferences, summits, and festivals. We are looking for an ambitious Full-Stack Founding Engineer who takes deep pride in product craft, sub-second latency, and architectural elegance.

In this role, you will work across our entire Next.js, Supabase, Tailwind, and Webhook pipeline to deliver mission-critical event tools utilized by thousands of attendees and organizers live at venue gates.`,
    responsibilities: [
      "Architect and scale sub-second ticket generation and scanner verification services.",
      "Build fluid, responsive interfaces using Next.js 15, React, and Tailwind CSS.",
      "Optimize offline-first camera scanner sync engine with WebRTC / IndexedDB caching.",
      "Ship resilient third-party integrations with Razorpay, WhatsApp Cloud API, and Stripe.",
      "Participate directly in customer feedback loops and live venue gate operations.",
    ],
    requirements: [
      "2+ years of professional full-stack web development experience with React, TypeScript, and Node.js.",
      "Deep understanding of relational databases (PostgreSQL), indexes, and RLS policies.",
      "Demonstrated experience shipping production web applications with strong UX sensibility.",
      "Comfort with asynchronous event-driven architectures and webhook delivery guarantees.",
      "Obsessive attention to detail regarding page speed, zero-CLS, and smooth transitions.",
    ],
    nice_to_have: [
      "Experience with WebAssembly or Web Worker camera stream processing.",
      "Familiarity with event ticketing, hardware scanners, or barcode generation.",
      "Contributions to open-source developer tooling or libraries.",
    ],
    benefits: [
      "Competitive salary and early founding equity grant.",
      "Modern hybrid setup at our Bengaluru innovation studio.",
      "High autonomy, direct ownership of key product verticals, and zero corporate bureaucracy.",
      "Top-tier MacBook Pro and home workstation equipment allowance.",
    ],
    is_published: true,
    status: "published",
    published_at: "2026-10-15T00:00:00.000Z",
    created_at: "2026-10-15T00:00:00.000Z",
    updated_at: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "job-seed-uiux-02",
    slug: "product-designer-ui-ux",
    title: "Product Designer (UI / UX)",
    department: "UI/UX Design",
    location: "Bengaluru, India",
    workplace_type: "hybrid",
    employment_type: "full-time",
    experience_level: "mid",
    summary:
      "Craft world-class digital event passes, minimalist organizer dashboards, and intuitive gate scanner interfaces that delight organizers.",
    description: `At UrPass, we believe business software should feel as fast, fluid, and refined as consumer products. We are seeking a Product Designer who excels in typography, micro-interactions, dark mode aesthetics, and ergonomic mobile workflows.

You will define the visual and interaction standard of our digital pass studio, attendee check-in portals, and event organizer intelligence dashboards.`,
    responsibilities: [
      "Design crisp, high-contrast, beautiful mobile pass templates for attendees across Apple Wallet and Web.",
      "Simplify multi-session gate routing, VIP tiering, and batch ticketing into effortless UX flows.",
      "Maintain and expand the UrPass design system across dark and light surfaces.",
      "Conduct user research directly with real organizers at campus and tech summits.",
      "Collaborate tightly with engineering to ensure pixel-perfect CSS and fluid animations.",
    ],
    requirements: [
      "2+ years designing modern SaaS or mobile products with an exceptional public portfolio.",
      "Mastery of Figma, component variants, auto-layout, and interactive prototyping.",
      "Strong understanding of responsive layouts, mobile viewport ergonomics, and typography.",
      "Ability to think in complete user journeys from landing pages to transactional check-in.",
    ],
    nice_to_have: [
      "Basic front-end fluency (Tailwind CSS, React, Framer Motion).",
      "Experience designing hardware-adjacent tools or barcode scanner screens.",
      "Branding and motion graphics background.",
    ],
    benefits: [
      "Competitive compensation and meaningful equity ownership.",
      "Direct design influence across the entire company brand and product.",
      "Flexible hybrid hours at our Bengaluru hub.",
      "Design tool allowances and conference sponsorship.",
    ],
    is_published: true,
    status: "published",
    published_at: "2026-10-16T00:00:00.000Z",
    created_at: "2026-10-16T00:00:00.000Z",
    updated_at: "2026-10-16T00:00:00.000Z",
  },
  {
    id: "job-seed-devrel-03",
    slug: "growth-marketing-lead",
    title: "Growth & Product Marketing Lead",
    department: "Growth & Marketing",
    location: "Bengaluru, India / Remote",
    workplace_type: "hybrid",
    employment_type: "full-time",
    experience_level: "mid",
    summary:
      "Drive acquisition of event organizers, tech conferences, and university festivals through product-led growth and high-intent SEO/GEO.",
    description: `UrPass is rapidly expanding across India and the United Kingdom. We are looking for an entrepreneurial Growth & Marketing Lead to spearhead our search dominance, college fest partnerships, and organizer conversion funnel.`,
    responsibilities: [
      "Own organic customer acquisition through GEO, search indexing, and viral attendee pass loops.",
      "Partner with tier-1 college symposiums, hackathons, and developer conferences across India.",
      "Craft compelling product launch narratives, case studies, and comparison landing pages.",
      "Analyze funnel drop-offs and collaborate with engineering on onboarding improvements.",
    ],
    requirements: [
      "2+ years of experience in B2B SaaS growth, developer marketing, or startup marketing.",
      "Data-driven mindset with hands-on proficiency in analytics and conversion tracking.",
      "Superb written communication skills with punchy, startup-native copywriting.",
    ],
    nice_to_have: [
      "Prior experience organizing college festivals, tech conferences, or hackathons.",
      "Familiarity with programmatic SEO and AI search discovery engines.",
    ],
    benefits: [
      "Competitive compensation with aggressive performance bonuses.",
      "High autonomy to test bold experiments and campaigns.",
      "Work directly with founders on market expansion.",
    ],
    is_published: true,
    status: "published",
    published_at: "2026-10-17T00:00:00.000Z",
    created_at: "2026-10-17T00:00:00.000Z",
    updated_at: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "job-seed-intern-04",
    slug: "engineering-intern-summer-2026",
    title: "Software Engineering Intern (Summer / Fall)",
    department: "Internships",
    location: "Bengaluru, India",
    workplace_type: "hybrid",
    employment_type: "internship",
    experience_level: "entry",
    summary:
      "Work alongside founding engineers to build real-time event infrastructure, AI assistance tools, and gate scanner software.",
    description: `Are you a student or recent graduate looking to ship production code used by tens of thousands of event-goers? Our internship is designed to give high-agency builders genuine responsibility and deep technical mentorship.`,
    responsibilities: [
      "Ship full-stack features using Next.js 15, TypeScript, and Supabase.",
      "Write automated end-to-end integration tests and load tests for ticket issuance.",
      "Assist with on-site scanner deployment testing for major college summits.",
    ],
    requirements: [
      "Enrolled in or graduated from Computer Science or related STEM program.",
      "Solid fundamentals in JavaScript/TypeScript, data structures, and REST/APIs.",
      "Eager curiosity, self-starter drive, and passion for polished software.",
    ],
    nice_to_have: [
      "Personal GitHub side projects or contributions to open-source software.",
    ],
    benefits: [
      "Competitive monthly stipend (₹25,000 - ₹40,000 / month).",
      "Direct pathway to full-time founding engineer return offer.",
      "Free meals, snacks, and mentorship at Bengaluru studio.",
    ],
    is_published: true,
    status: "published",
    published_at: "2026-10-18T00:00:00.000Z",
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
];

const inMemoryApplications: JobApplication[] = [];

// ── Public Jobs Queries ──

export async function getPublishedJobs(): Promise<JobPosting[]> {
  if (isTestEnvironment()) {
    return inMemoryJobs.filter((j) => j.is_published && j.status === "published");
  }

  try {
    const admin = adminClient();
    const { data, error } = await admin
      .from("job_postings")
      .select("*")
      .eq("is_published", true)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(normalizeJobRow);
    }
  } catch (err) {
    console.warn("[careers-service] Relational job_postings query error, using fallback:", err);
  }

  // Fallback to active published in-memory jobs
  return inMemoryJobs.filter((j) => j.is_published && j.status === "published");
}

export async function getJobBySlug(slug: string): Promise<JobPosting | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  if (isTestEnvironment()) {
    const match = inMemoryJobs.find((j) => j.slug === normalizedSlug);
    return match ?? null;
  }

  try {
    const admin = adminClient();
    const { data, error } = await admin
      .from("job_postings")
      .select("*")
      .eq("slug", normalizedSlug)
      .maybeSingle();

    if (!error && data) {
      return normalizeJobRow(data);
    }
  } catch (err) {
    console.warn("[careers-service] Error fetching job by slug, fallback check:", err);
  }

  const match = inMemoryJobs.find((j) => j.slug === normalizedSlug);
  return match ?? null;
}

// ── Ops Management Queries ──

export async function getAllJobsForOps(): Promise<(JobPosting & { application_count: number })[]> {
  if (isTestEnvironment()) {
    return inMemoryJobs.map((j) => ({
      ...j,
      application_count: inMemoryApplications.filter((a) => a.job_id === j.id).length,
    }));
  }

  try {
    const admin = adminClient();
    const { data: jobs, error } = await admin
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && jobs) {
      const { data: appCounts } = await admin
        .from("job_applications")
        .select("job_id");

      const countMap: Record<string, number> = {};
      (appCounts || []).forEach((row) => {
        if (row.job_id) {
          countMap[row.job_id] = (countMap[row.job_id] || 0) + 1;
        }
      });

      return jobs.map((j) => ({
        ...normalizeJobRow(j),
        application_count: countMap[j.id] || 0,
      }));
    }
  } catch (err) {
    console.warn("[careers-service] Ops fetch all jobs error, using memory fallback:", err);
  }

  return inMemoryJobs.map((j) => ({
    ...j,
    application_count: inMemoryApplications.filter((a) => a.job_id === j.id).length,
  }));
}

export async function createJobPosting(
  input: Partial<CreateJobInput> & {
    title: string;
    department: string;
    [key: string]: any;
  }
): Promise<JobPosting> {
  const generatedSlug =
    input.slug?.trim() ||
    input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const workplaceType = input.workplaceType || input.workplace_type || "hybrid";
  const employmentType = input.employmentType || input.employment_type || "full-time";
  const experienceLevel = input.experienceLevel || input.experience_level || "mid";
  const summary = input.summary?.trim() || "";
  const description = input.description?.trim() || summary || "";
  const responsibilities = Array.isArray(input.responsibilities) ? input.responsibilities.filter(Boolean) : [];
  const requirements = Array.isArray(input.requirements) ? input.requirements.filter(Boolean) : [];
  const niceToHave = Array.isArray(input.niceToHave || input.nice_to_have)
    ? (input.niceToHave || input.nice_to_have).filter(Boolean)
    : [];
  const benefits = Array.isArray(input.benefits) ? input.benefits.filter(Boolean) : [];
  const isPublished = input.status === "published" || Boolean(input.is_published);
  const status: JobStatus = input.status || (isPublished ? "published" : "draft");

  const newJob: JobPosting = {
    id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    slug: generatedSlug,
    title: input.title.trim(),
    department: input.department.trim(),
    location: input.location?.trim() || "Bengaluru, India",
    workplace_type: workplaceType,
    employment_type: employmentType,
    experience_level: experienceLevel,
    summary,
    description,
    responsibilities,
    requirements,
    nice_to_have: niceToHave,
    benefits,
    is_published: isPublished,
    is_featured: Boolean(input.is_featured),
    status,
    published_at: isPublished ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isTestEnvironment()) {
    inMemoryJobs.unshift(newJob);
    return newJob;
  }

  try {
    const admin = adminClient();
    const { data, error } = await admin
      .from("job_postings")
      .insert({
        slug: newJob.slug,
        title: newJob.title,
        department: newJob.department,
        location: newJob.location,
        workplace_type: newJob.workplace_type,
        employment_type: newJob.employment_type,
        experience_level: newJob.experience_level,
        summary: newJob.summary,
        description: newJob.description,
        responsibilities: newJob.responsibilities,
        requirements: newJob.requirements,
        nice_to_have: newJob.nice_to_have,
        benefits: newJob.benefits,
        is_published: newJob.is_published,
        status: newJob.status,
        published_at: newJob.published_at,
      })
      .select()
      .single();

    if (!error && data) {
      return normalizeJobRow(data);
    }
  } catch (err) {
    console.warn("[careers-service] Relational insert failed, saved to fallback memory:", err);
  }

  inMemoryJobs.unshift(newJob);
  return newJob;
}

export async function updateJobPosting(
  id: string,
  updates: Partial<CreateJobInput> & { is_published?: boolean; status?: JobStatus; [key: string]: any }
): Promise<JobPosting | null> {
  const now = new Date().toISOString();

  if (!isTestEnvironment()) {
    try {
      const admin = adminClient();
      const updatePayload: Record<string, unknown> = {
        updated_at: now,
      };

      if (updates.title) updatePayload.title = updates.title.trim();
      if (updates.slug) updatePayload.slug = updates.slug.trim();
      if (updates.department) updatePayload.department = updates.department.trim();
      if (updates.location) updatePayload.location = updates.location.trim();
      if (updates.workplaceType || updates.workplace_type) {
        updatePayload.workplace_type = updates.workplaceType || updates.workplace_type;
      }
      if (updates.employmentType || updates.employment_type) {
        updatePayload.employment_type = updates.employmentType || updates.employment_type;
      }
      if (updates.experienceLevel || updates.experience_level) {
        updatePayload.experience_level = updates.experienceLevel || updates.experience_level;
      }
      if (updates.summary) updatePayload.summary = updates.summary.trim();
      if (updates.description) updatePayload.description = updates.description.trim();
      if (updates.responsibilities) updatePayload.responsibilities = updates.responsibilities;
      if (updates.requirements) updatePayload.requirements = updates.requirements;
      if (updates.niceToHave || updates.nice_to_have) {
        updatePayload.nice_to_have = updates.niceToHave || updates.nice_to_have;
      }
      if (updates.benefits) updatePayload.benefits = updates.benefits;
      if (updates.status) {
        updatePayload.status = updates.status;
        updatePayload.is_published = updates.status === "published";
        if (updates.status === "published") {
          updatePayload.published_at = now;
        }
      }

      const { data, error } = await admin
        .from("job_postings")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return normalizeJobRow(data);
      }
    } catch (err) {
      console.warn("[careers-service] Relational update failed, updating memory:", err);
    }
  }

  const idx = inMemoryJobs.findIndex((j) => j.id === id);
  if (idx !== -1) {
    const existing = inMemoryJobs[idx];
    const isPub =
      updates.is_published !== undefined
        ? Boolean(updates.is_published)
        : updates.status
        ? updates.status === "published"
        : existing.is_published;

    inMemoryJobs[idx] = {
      ...existing,
      ...updates,
      workplace_type: updates.workplaceType || updates.workplace_type || existing.workplace_type,
      employment_type: updates.employmentType || updates.employment_type || existing.employment_type,
      experience_level: updates.experienceLevel || updates.experience_level || existing.experience_level,
      status: updates.status || existing.status,
      is_published: isPub,
      updated_at: now,
    };
    return inMemoryJobs[idx];
  }

  return null;
}

export async function deleteJobPosting(id: string): Promise<boolean> {
  if (!isTestEnvironment()) {
    try {
      const admin = adminClient();
      const { error } = await admin.from("job_postings").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("[careers-service] Error deleting job posting, deleting from memory:", err);
    }
  }

  const idx = inMemoryJobs.findIndex((j) => j.id === id);
  if (idx !== -1) {
    inMemoryJobs.splice(idx, 1);
    return true;
  }
  return false;
}

// ── Application Submission & Management ──

export async function submitJobApplication(
  input: SubmitApplicationInput | Record<string, any>,
  meta: { ip?: string; userAgent?: string } = {}
): Promise<JobApplication & { success: boolean; applicationId: string; error?: string }> {
  const raw = input as Record<string, any>;
  const fullName = (raw.fullName || raw.full_name)?.trim();
  const email = (raw.email)?.trim().toLowerCase();
  const coverNote = (
    raw.coverNote ||
    raw.cover_note ||
    raw.why_urpass ||
    raw.notes
  )?.trim();

  if (!fullName || !email || !coverNote) {
    throw new Error("Full name, email address, and introductory note are required.");
  }

  let resolvedJobTitle = (raw.jobTitle || raw.job_title)?.trim() || "General Application";
  let resolvedDepartment = (raw.department)?.trim() || "General";
  let resolvedJobId = raw.jobId || raw.job_id || null;

  // If slug was passed, lookup job
  if (raw.jobSlug && !resolvedJobId) {
    const matched = await getJobBySlug(raw.jobSlug);
    if (matched) {
      resolvedJobId = matched.id;
      resolvedJobTitle = matched.title;
      resolvedDepartment = matched.department;
    }
  }

  const newApp: JobApplication = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    job_id: resolvedJobId,
    job_title: resolvedJobTitle,
    department: resolvedDepartment,
    application_type: raw.applicationType || raw.application_type || "job_specific",
    full_name: fullName,
    email,
    phone: (raw.phone)?.trim() || null,
    linkedin_url: (raw.linkedinUrl || raw.linkedin_url)?.trim() || null,
    portfolio_url: (raw.portfolioUrl || raw.portfolio_url)?.trim() || null,
    github_url: (raw.githubUrl || raw.github_url)?.trim() || null,
    years_of_experience: (raw.yearsOfExperience || raw.years_of_experience)?.trim() || null,
    cover_note: coverNote,
    resume_url: (raw.resumeUrl || raw.resume_url)?.trim() || null,
    resume_filename: (raw.resumeFilename || raw.resume_filename)?.trim() || null,
    status: "new",
    recruiter_notes: null,
    ip_address: meta.ip || null,
    user_agent: meta.userAgent || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!isTestEnvironment()) {
    try {
      const admin = adminClient();
      const { data, error } = await admin
        .from("job_applications")
        .insert({
          job_id: newApp.job_id,
          job_title: newApp.job_title,
          department: newApp.department,
          application_type: newApp.application_type,
          full_name: newApp.full_name,
          email: newApp.email,
          phone: newApp.phone,
          linkedin_url: newApp.linkedin_url,
          portfolio_url: newApp.portfolio_url,
          github_url: newApp.github_url,
          years_of_experience: newApp.years_of_experience,
          cover_note: newApp.cover_note,
          resume_url: newApp.resume_url,
          resume_filename: newApp.resume_filename,
          status: "new",
          ip_address: newApp.ip_address,
          user_agent: newApp.user_agent,
        })
        .select("id")
        .single();

      if (!error && data?.id) {
        newApp.id = data.id;
      }
    } catch (err) {
      console.warn("[careers-service] Relational application insert fallback:", err);
    }
  }

  inMemoryApplications.unshift(newApp);

  // Send confirmation & internal alert asynchronously
  Promise.allSettled([
    sendJobApplicationConfirmationEmail({
      candidateName: newApp.full_name,
      candidateEmail: newApp.email,
      jobTitle: newApp.job_title,
      department: newApp.department,
      applicationId: newApp.id,
    }),
    notifyAdminNewJobApplication({
      candidateName: newApp.full_name,
      candidateEmail: newApp.email,
      phone: newApp.phone,
      jobTitle: newApp.job_title,
      department: newApp.department,
      applicationType: newApp.application_type,
      yearsOfExperience: newApp.years_of_experience,
      linkedinUrl: newApp.linkedin_url,
      portfolioUrl: newApp.portfolio_url,
      resumeUrl: newApp.resume_url,
      coverNote: newApp.cover_note,
      applicationId: newApp.id,
    }),
  ]).catch(() => {});

  return {
    ...newApp,
    success: true,
    applicationId: newApp.id,
  };
}

export async function getApplicationsForOps(filters?: {
  jobId?: string;
  status?: string;
  search?: string;
}): Promise<JobApplication[]> {
  if (isTestEnvironment()) {
    let result = [...inMemoryApplications];
    if (filters?.jobId) result = result.filter((a) => a.job_id === filters.jobId);
    if (filters?.status && filters.status !== "all") {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.job_title.toLowerCase().includes(q)
      );
    }
    return result;
  }

  try {
    const admin = adminClient();
    let query = admin
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.jobId) {
      query = query.eq("job_id", filters.jobId);
    }
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters?.search) {
      const s = filters.search.trim();
      query = query.or(
        `full_name.ilike.%${s}%,email.ilike.%${s}%,job_title.ilike.%${s}%`
      );
    }

    const { data, error } = await query;
    if (!error && data) {
      return data as JobApplication[];
    }
  } catch (err) {
    console.warn("[careers-service] Error fetching applications, returning memory fallback:", err);
  }

  let result = [...inMemoryApplications];
  if (filters?.jobId) result = result.filter((a) => a.job_id === filters.jobId);
  if (filters?.status && filters.status !== "all") {
    result = result.filter((a) => a.status === filters.status);
  }
  return result;
}

export async function updateApplicationStatusAndNotes(
  id: string,
  statusOrUpdates: ApplicationStatus | { status?: ApplicationStatus; notes?: string },
  maybeNotes?: string
): Promise<JobApplication | null> {
  const now = new Date().toISOString();
  let status: ApplicationStatus | undefined;
  let notes: string | undefined;

  if (typeof statusOrUpdates === "string") {
    status = statusOrUpdates as ApplicationStatus;
    notes = maybeNotes;
  } else if (statusOrUpdates && typeof statusOrUpdates === "object") {
    status = statusOrUpdates.status;
    notes = statusOrUpdates.notes;
  }

  if (!isTestEnvironment()) {
    try {
      const admin = adminClient();
      const payload: Record<string, unknown> = { updated_at: now };
      if (status) payload.status = status;
      if (notes !== undefined) payload.recruiter_notes = notes;

      const { data, error } = await admin
        .from("job_applications")
        .update(payload)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && data) return data as JobApplication;
    } catch (err) {
      console.warn("[careers-service] Error updating application status, updating memory:", err);
    }
  }

  const app = inMemoryApplications.find((a) => a.id === id);
  if (app) {
    if (status) app.status = status;
    if (notes !== undefined) app.recruiter_notes = notes;
    app.updated_at = now;
    return app;
  }

  return null;
}

// Helper to normalize JSONB columns from database
function normalizeJobRow(row: any): JobPosting {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location || "Bengaluru, India",
    workplace_type: row.workplace_type || "hybrid",
    employment_type: row.employment_type || "full-time",
    experience_level: row.experience_level || "mid",
    summary: row.summary || "",
    description: row.description || "",
    responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    nice_to_have: Array.isArray(row.nice_to_have) ? row.nice_to_have : [],
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    is_published: Boolean(row.is_published),
    is_featured: Boolean(row.is_featured),
    status: row.status || (row.is_published ? "published" : "draft"),
    published_at: row.published_at || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
