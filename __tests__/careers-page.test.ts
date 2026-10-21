import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPublishedJobs,
  getJobBySlug,
  getAllJobsForOps,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  submitJobApplication,
  getApplicationsForOps,
  updateApplicationStatusAndNotes,
} from "@/lib/careers/service";
import {
  sendJobApplicationConfirmationEmail,
  notifyAdminNewJobApplication,
} from "@/lib/careers/emails";
import * as emailModule from "@/lib/email";

describe("UrPass Careers & Job Board System", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Public Job Board Queries", () => {
    it("returns active/published job postings with expected metadata", async () => {
      const jobs = await getPublishedJobs();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);

      const first = jobs[0];
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("slug");
      expect(first).toHaveProperty("title");
      expect(first).toHaveProperty("department");
      expect(first).toHaveProperty("location");
      expect(first).toHaveProperty("workplace_type");
      expect(first).toHaveProperty("status", "published");
      expect(Array.isArray(first.responsibilities)).toBe(true);
      expect(Array.isArray(first.requirements)).toBe(true);
    });

    it("retrieves a job posting by its unique URL slug", async () => {
      const jobs = await getPublishedJobs();
      const targetSlug = jobs[0].slug;

      const job = await getJobBySlug(targetSlug);
      expect(job).not.toBeNull();
      expect(job?.slug).toBe(targetSlug);
      expect(job?.title).toBe(jobs[0].title);
    });

    it("returns null for non-existent job slugs", async () => {
      const nonExistent = await getJobBySlug("non-existent-role-xyz-999");
      expect(nonExistent).toBeNull();
    });
  });

  describe("Ops Job Management", () => {
    it("allows ops to create a new job posting with slug generation", async () => {
      const newJob = await createJobPosting({
        title: "Senior Product Designer",
        department: "Design",
        location: "Bengaluru, India (Hybrid)",
        workplace_type: "hybrid",
        employment_type: "full-time",
        experience_level: "senior",
        summary: "Lead end-to-end design for the UrPass event operating system.",
        responsibilities: ["Design high-density scanning interfaces", "Iterate on organizer dashboard"],
        requirements: ["4+ years in product design", "Figma mastery", "Proven design system experience"],
        benefits: ["Competitive equity", "Top-tier health coverage"],
        status: "published",
        is_featured: true,
      });

      expect(newJob).toHaveProperty("id");
      expect(newJob.title).toBe("Senior Product Designer");
      expect(newJob.slug).toContain("senior-product-designer");
      expect(newJob.status).toBe("published");
      expect(newJob.is_featured).toBe(true);

      // Verify it's retrievable in ops
      const opsJobs = await getAllJobsForOps();
      const found = opsJobs.find((j) => j.id === newJob.id);
      expect(found).toBeDefined();
    });

    it("allows ops to update an existing job posting", async () => {
      const created = await createJobPosting({
        title: "DevRel Engineer",
        department: "Developer Experience",
        location: "Remote (Global)",
        workplace_type: "remote",
        employment_type: "full-time",
        summary: "Empower developers building on UrPass EIaaS API.",
        responsibilities: ["Write SDK tutorials", "Engage developer communities"],
        requirements: ["TypeScript and Node.js proficiency"],
        status: "draft",
      });

      const updated = await updateJobPosting(created.id, {
        status: "published",
        summary: "Updated summary: Empower developers building on UrPass EIaaS worldwide.",
      });

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe("published");
      expect(updated!.summary).toContain("worldwide");
    });

    it("allows ops to delete/archive a job posting", async () => {
      const created = await createJobPosting({
        title: "Temporary Ops Specialist",
        department: "Operations",
        location: "Bengaluru, India",
        workplace_type: "on-site",
        employment_type: "contract",
        summary: "Support on-ground festival deployments.",
        responsibilities: ["Gate hardware support"],
        requirements: ["Reliability and punctuality"],
        status: "draft",
      });

      await deleteJobPosting(created.id);
      const jobs = await getAllJobsForOps();
      const found = jobs.find((j) => j.id === created.id);
      expect(found).toBeUndefined();
    });
  });

  describe("Candidate Application Workflow", () => {
    it("successfully submits a candidate application with valid inputs", async () => {
      const emailSpy = vi.spyOn(emailModule, "sendEmail").mockResolvedValue({ success: true } as any);

      const application = await submitJobApplication({
        full_name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 9876543210",
        application_type: "job",
        department: "Engineering",
        portfolio_url: "https://github.com/aaravsharma",
        resume_url: "https://urpass.space/storage/v1/object/public/job-resumes/aarav_resume.pdf",
        why_urpass: "I love sub-second low-latency systems and want to help scale UrPass to millions of attendees.",
        notes: "Available to start in 2 weeks.",
      });

      expect(application).toHaveProperty("id");
      expect(application.full_name).toBe("Aarav Sharma");
      expect(application.status).toBe("new");
      expect(application.email).toBe("aarav.sharma@example.com");

      // Verify email triggers were invoked
      expect(emailSpy).toHaveBeenCalled();
    });

    it("rejects application when missing mandatory fields", async () => {
      await expect(
        submitJobApplication({
          full_name: "",
          email: "invalid",
          application_type: "job",
          department: "Engineering",
          why_urpass: "",
        })
      ).rejects.toThrow();
    });

    it("allows ops to manage candidate pipeline status and notes", async () => {
      const app = await submitJobApplication({
        full_name: "Priya Nair",
        email: "priya.nair@example.com",
        application_type: "internship",
        department: "Product",
        why_urpass: "Passionate about building intuitive event tech experiences.",
      });

      const updated = await updateApplicationStatusAndNotes(
        app.id,
        "interview",
        "Screened portfolio. Excellent design thinking. Scheduled initial interview."
      );

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe("interview");
      expect(updated!.recruiter_notes).toContain("Excellent design thinking");
    });
  });

  describe("Applicant and Admin Email Dispatch", () => {
    it("dispatches professional candidate confirmation email", async () => {
      const emailSpy = vi.spyOn(emailModule, "sendEmail").mockResolvedValue({ success: true } as any);

      const success = await sendJobApplicationConfirmationEmail({
        applicantName: "Diya Patel",
        applicantEmail: "diya.patel@example.com",
        roleOrDepartment: "Full-Stack Founding Engineer",
        applicationType: "job",
      });

      expect(success).toBe(true);
      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "diya.patel@example.com",
          subject: expect.stringContaining("UrPass Application Received"),
          html: expect.stringContaining("Diya Patel"),
        })
      );
    });

    it("dispatches internal admin notification for new applicant", async () => {
      const emailSpy = vi.spyOn(emailModule, "sendEmail").mockResolvedValue({ success: true } as any);

      const success = await notifyAdminNewJobApplication({
        applicantName: "Rohan Varma",
        applicantEmail: "rohan.varma@example.com",
        roleOrDepartment: "Frontend Engineer",
        applicationType: "job",
        portfolioUrl: "https://rohan.dev",
        resumeUrl: "https://urpass.space/resume.pdf",
        whyUrpass: "UrPass is redefining physical event entry.",
      });

      expect(success).toBe(true);
      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining("New Application: Rohan Varma"),
          html: expect.stringContaining("Rohan Varma"),
        })
      );
    });
  });
});
