"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import type {
  JobPosting,
  JobApplication,
  ApplicationStatus,
  JobStatus,
  WorkplaceType,
  EmploymentType,
  ExperienceLevel,
} from "@/lib/careers/types";
import { CAREERS_DEPARTMENTS } from "@/lib/careers/types";

export default function OpsCareersManager() {
  const [activeSubtab, setActiveSubtab] = useState<"jobs" | "applications">("jobs");

  // Jobs state
  const [jobs, setJobs] = useState<(JobPosting & { application_count: number })[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

  // Applications state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [appSearch, setAppSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Job Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDepartment, setFormDepartment] = useState("Engineering");
  const [formLocation, setFormLocation] = useState("Bengaluru, India");
  const [formWorkplace, setFormWorkplace] = useState<WorkplaceType>("hybrid");
  const [formEmployment, setFormEmployment] = useState<EmploymentType>("full-time");
  const [formExperience, setFormExperience] = useState<ExperienceLevel>("mid");
  const [formSummary, setFormSummary] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formResponsibilities, setFormResponsibilities] = useState("");
  const [formRequirements, setFormRequirements] = useState("");
  const [formStatus, setFormStatus] = useState<JobStatus>("draft");
  const [savingJob, setSavingJob] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  async function fetchJobs() {
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/ops/careers/jobs");
      const data = await res.json();
      if (res.ok && data.jobs) {
        setJobs(data.jobs);
      }
    } catch {
      // fallback
    } finally {
      setLoadingJobs(false);
    }
  }

  async function fetchApplications() {
    setLoadingApps(true);
    try {
      const res = await fetch("/api/ops/careers/applications");
      const data = await res.json();
      if (res.ok && data.applications) {
        setApplications(data.applications);
      }
    } catch {
      // fallback
    } finally {
      setLoadingApps(false);
    }
  }

  function handleOpenCreateModal() {
    setEditingJob(null);
    setFormTitle("");
    setFormSlug("");
    setFormDepartment("Engineering");
    setFormLocation("Bengaluru, India");
    setFormWorkplace("hybrid");
    setFormEmployment("full-time");
    setFormExperience("mid");
    setFormSummary("");
    setFormDescription("");
    setFormResponsibilities("");
    setFormRequirements("");
    setFormStatus("draft");
    setFormError(null);
    setJobModalOpen(true);
  }

  function handleOpenEditModal(job: JobPosting) {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormSlug(job.slug);
    setFormDepartment(job.department);
    setFormLocation(job.location);
    setFormWorkplace(job.workplace_type);
    setFormEmployment(job.employment_type);
    setFormExperience(job.experience_level);
    setFormSummary(job.summary);
    setFormDescription(job.description);
    setFormResponsibilities(job.responsibilities.join("\n"));
    setFormRequirements(job.requirements.join("\n"));
    setFormStatus(job.status);
    setFormError(null);
    setJobModalOpen(true);
  }

  async function handleSaveJob(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim() || !formSummary.trim() || !formDescription.trim()) {
      setFormError("Title, summary, and description are required.");
      return;
    }

    setSavingJob(true);

    try {
      const payload = {
        id: editingJob?.id,
        title: formTitle.trim(),
        slug: formSlug.trim() || undefined,
        department: formDepartment,
        location: formLocation.trim(),
        workplaceType: formWorkplace,
        employmentType: formEmployment,
        experienceLevel: formExperience,
        summary: formSummary.trim(),
        description: formDescription.trim(),
        responsibilities: formResponsibilities
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: formRequirements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        status: formStatus,
      };

      const method = editingJob ? "PATCH" : "POST";
      const res = await fetch("/api/ops/careers/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJobModalOpen(false);
        fetchJobs();
      } else {
        setFormError(data.error || "Failed to save job posting.");
      }
    } catch {
      setFormError("Network error saving job posting.");
    } finally {
      setSavingJob(false);
    }
  }

  async function handleDeleteJob(jobId: string, title: string) {
    if (!confirm(`Are you sure you want to delete job posting "${title}"?`)) return;

    try {
      const res = await fetch(`/api/ops/careers/jobs?id=${jobId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch {
      alert("Failed to delete job posting.");
    }
  }

  async function handleToggleJobStatus(job: JobPosting) {
    const nextStatus: JobStatus = job.status === "published" ? "draft" : "published";

    try {
      const res = await fetch("/api/ops/careers/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job.id, status: nextStatus }),
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch {
      alert("Failed to update status.");
    }
  }

  async function handleUpdateAppStatus(appId: string, newStatus: ApplicationStatus) {
    try {
      const res = await fetch("/api/ops/careers/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      }
    } catch {
      alert("Failed to update candidate status.");
    }
  }

  async function handleSaveAppNotes() {
    if (!selectedApp) return;
    setSavingNotes(true);

    try {
      const res = await fetch("/api/ops/careers/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedApp.id, notes: recruiterNotes }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === selectedApp.id ? { ...a, recruiter_notes: recruiterNotes } : a
          )
        );
        setSelectedApp({ ...selectedApp, recruiter_notes: recruiterNotes });
      }
    } catch {
      alert("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  }

  function handleSelectApp(app: JobApplication) {
    setSelectedApp(app);
    setRecruiterNotes(app.recruiter_notes || "");
  }

  function handleExportCsv() {
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Job Title",
      "Department",
      "Type",
      "Experience",
      "Status",
      "Applied Date",
      "LinkedIn",
      "Portfolio",
      "Resume URL",
      "Cover Note",
      "Recruiter Notes",
    ];

    const rows = filteredApps.map((a) => [
      `"${a.id}"`,
      `"${a.full_name.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone || ""}"`,
      `"${a.job_title.replace(/"/g, '""')}"`,
      `"${a.department}"`,
      `"${a.application_type}"`,
      `"${a.years_of_experience || ""}"`,
      `"${a.status}"`,
      `"${new Date(a.created_at).toISOString()}"`,
      `"${a.linkedin_url || ""}"`,
      `"${a.portfolio_url || ""}"`,
      `"${a.resume_url || ""}"`,
      `"${(a.cover_note || "").replace(/"/g, '""')}"`,
      `"${(a.recruiter_notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `urpass_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredApps = applications.filter((app) => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (jobFilter !== "all" && app.job_id !== jobFilter) return false;
    if (appSearch.trim()) {
      const q = appSearch.toLowerCase().trim();
      const matchName = app.full_name.toLowerCase().includes(q);
      const matchEmail = app.email.toLowerCase().includes(q);
      const matchRole = app.job_title.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchRole) return false;
    }
    return true;
  });

  const publishedCount = jobs.filter((j) => j.status === "published").length;
  const draftCount = jobs.filter((j) => j.status === "draft").length;
  const newAppsCount = applications.filter((a) => a.status === "new").length;
  const shortlistedCount = applications.filter(
    (a) => a.status === "shortlisted" || a.status === "interview"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-150">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recruitment &amp; Careers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Talent Pipeline &amp; Vacancies
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage published job descriptions, post new opportunities, and review candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <span>View Live Careers Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6200EE] hover:bg-[#5200cc] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Published Jobs</p>
          <p className="text-2xl font-extrabold text-white mt-1">{publishedCount}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{draftCount} drafts in staging</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Applicants</p>
          <p className="text-2xl font-extrabold text-white mt-1">{applications.length}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Across all roles</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-300">New Applications</p>
          <p className="text-2xl font-extrabold text-purple-300 mt-1">{newAppsCount}</p>
          <p className="text-[10px] text-purple-400/70 mt-0.5">Awaiting initial review</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">In Pipeline</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{shortlistedCount}</p>
          <p className="text-[10px] text-emerald-500/70 mt-0.5">Shortlisted / Interview</p>
        </div>
      </div>

      {/* Subtab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSubtab("jobs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubtab === "jobs"
              ? "bg-white/10 text-white border border-white/15"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Job Postings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubtab("applications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubtab === "applications"
              ? "bg-white/10 text-white border border-white/15"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Candidate Applications ({applications.length})</span>
          {newAppsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-purple-500 text-white">
              {newAppsCount}
            </span>
          )}
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SUBTAB 1: JOBS MANAGEMENT
      ═════════════════════════════════════════════════════════════ */}
      {activeSubtab === "jobs" && (
        <div className="space-y-4">
          {loadingJobs ? (
            <div className="py-12 flex justify-center text-neutral-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Loading job postings...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-neutral-900/40 border border-white/8">
              <Briefcase className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No job postings created yet</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Post your first opening to attract candidates directly through urpass.space/careers.
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6200EE]"
              >
                Post New Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-white/8 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          job.status === "published"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                            : job.status === "draft"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/25"
                            : "bg-neutral-500/15 text-neutral-400 border-neutral-500/25"
                        }`}
                      >
                        {job.status}
                      </span>

                      <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                        {job.department}
                      </span>

                      <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        {job.location} ({job.workplace_type})
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white truncate">{job.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-1">{job.summary}</p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-0.5">
                      <span>Slug: <code className="text-neutral-400 font-mono">/careers/{job.slug}</code></span>
                      <span>&bull;</span>
                      <span className="text-white font-medium">{job.application_count} Applicants</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleJobStatus(job)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        job.status === "published"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20"
                      }`}
                    >
                      {job.status === "published" ? "Unpublish (Draft)" : "Publish Live"}
                    </button>

                    <a
                      href={`/careers/${job.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      title="View Live Job Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleOpenEditModal(job)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      title="Edit Job Posting"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-colors"
                      title="Delete Job Posting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SUBTAB 2: APPLICATIONS PIPELINE
      ═════════════════════════════════════════════════════════════ */}
      {activeSubtab === "applications" && (
        <div className="space-y-4">
          
          {/* Controls Bar: Search, Status Filter, Export */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Filter by candidate name, email, or role..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6200EE]"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="offered">Offered</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              disabled={filteredApps.length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Applications Table */}
          {loadingApps ? (
            <div className="py-12 flex justify-center text-neutral-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Loading applications...</span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-neutral-900/40 border border-white/8">
              <Users className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No applications match your filter</p>
              <p className="text-xs text-neutral-400 mt-0.5">Try adjusting status or search terms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/8 bg-neutral-900/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/8 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-white/[0.02]">
                    <th className="p-3.5">Candidate</th>
                    <th className="p-3.5">Position / Area</th>
                    <th className="p-3.5">Applied Date</th>
                    <th className="p-3.5">Resume</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-white">{app.full_name}</p>
                        <p className="text-neutral-400 text-[11px]">{app.email}</p>
                        {app.phone && <p className="text-neutral-500 text-[10px]">{app.phone}</p>}
                      </td>

                      <td className="p-3.5">
                        <p className="text-white font-medium">{app.job_title}</p>
                        <span className="text-[10px] text-purple-300 font-semibold">{app.department}</span>
                      </td>

                      <td className="p-3.5 text-neutral-400 whitespace-nowrap text-[11px]">
                        {new Date(app.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>

                      <td className="p-3.5">
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:text-white text-[11px] font-semibold"
                          >
                            <FileText className="w-3 h-3" />
                            <span>PDF</span>
                          </a>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">No file</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateAppStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className={`px-2 py-1 rounded text-[11px] font-bold uppercase border bg-neutral-900 focus:outline-none ${
                            app.status === "new"
                              ? "text-purple-300 border-purple-500/30"
                              : app.status === "shortlisted" || app.status === "interview"
                              ? "text-emerald-300 border-emerald-500/30"
                              : app.status === "hired" || app.status === "offered"
                              ? "text-sky-300 border-sky-500/30"
                              : app.status === "rejected"
                              ? "text-red-400 border-red-500/30"
                              : "text-amber-300 border-amber-500/30"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview">Interview</option>
                          <option value="offered">Offered</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleSelectApp(app)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                          Review &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODAL 1: CREATE / EDIT JOB POSTING
      ═════════════════════════════════════════════════════════════ */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12101b] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingJob ? "Edit Job Posting" : "Post New Job Opportunity"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Published jobs will appear immediately on the dynamic careers board.
                </p>
              </div>
              <button
                onClick={() => setJobModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Job Title <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#6200EE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Slug (URL Path)
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="auto-generated from title if blank"
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#6200EE]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Department</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#6200EE]"
                  >
                    {CAREERS_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#6200EE]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Workplace</label>
                  <select
                    value={formWorkplace}
                    onChange={(e) => setFormWorkplace(e.target.value as WorkplaceType)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#6200EE]"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Type</label>
                  <select
                    value={formEmployment}
                    onChange={(e) => setFormEmployment(e.target.value as EmploymentType)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#6200EE]"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Card Summary (1-2 sentences) <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Short overview shown on the job card..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#6200EE]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Full Role Description &amp; Mission <span className="text-purple-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#6200EE]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formResponsibilities}
                  onChange={(e) => setFormResponsibilities(e.target.value)}
                  placeholder="Architect sub-second ticketing services&#10;Optimize camera scanner sync engine"
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#6200EE] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formRequirements}
                  onChange={(e) => setFormRequirements(e.target.value)}
                  placeholder="2+ years React & TypeScript experience&#10;Deep understanding of Postgres relational schemas"
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#6200EE] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Publication Status</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobStatus"
                      checked={formStatus === "published"}
                      onChange={() => setFormStatus("published")}
                    />
                    <span className="text-emerald-400 font-bold">Published (Live on website)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobStatus"
                      checked={formStatus === "draft"}
                      onChange={() => setFormStatus("draft")}
                    />
                    <span className="text-neutral-400 font-medium">Draft (Staging only)</span>
                  </label>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingJob}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#6200EE] hover:bg-[#5200cc] flex items-center gap-2 disabled:opacity-50"
                >
                  {savingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{editingJob ? "Save Changes" : "Create Posting"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          DRAWER 2: CANDIDATE DETAIL REVIEW
      ═════════════════════════════════════════════════════════════ */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12101b] border border-white/15 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Candidate Profile
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{selectedApp.full_name}</h3>
                <p className="text-xs text-neutral-400">
                  Applied for <strong className="text-white">{selectedApp.job_title}</strong> ({selectedApp.department})
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Details */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/8 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Email</span>
                <p className="text-white font-medium">{selectedApp.email}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Phone</span>
                <p className="text-white font-medium">{selectedApp.phone || "Not provided"}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Experience</span>
                <p className="text-white font-medium">{selectedApp.years_of_experience || "N/A"} years</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Applied Date</span>
                <p className="text-white font-medium">
                  {new Date(selectedApp.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Links Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedApp.linkedin_url && (
                <a
                  href={selectedApp.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {selectedApp.portfolio_url && (
                <a
                  href={selectedApp.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold"
                >
                  <span>Portfolio / GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {selectedApp.resume_url && (
                <a
                  href={selectedApp.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold"
                >
                  <FileText className="w-3 h-3" />
                  <span>View Resume PDF</span>
                </a>
              )}
            </div>

            {/* Candidate Cover Note */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Candidate Note / Introduction
              </span>
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-white/8 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                {selectedApp.cover_note}
              </div>
            </div>

            {/* Status Pipeline Advancement */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Update Status in Pipeline
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  "new",
                  "reviewing",
                  "shortlisted",
                  "interview",
                  "offered",
                  "hired",
                  "rejected",
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateAppStatus(selectedApp.id, st as ApplicationStatus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      selectedApp.status === st
                        ? "bg-[#6200EE] text-white shadow-sm"
                        : "bg-white/5 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiter Internal Notes */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Internal Recruiter Notes
                </span>
                <button
                  type="button"
                  onClick={handleSaveAppNotes}
                  disabled={savingNotes}
                  className="text-xs text-purple-300 font-bold hover:text-white"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
              <textarea
                rows={3}
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Add confidential recruitment notes, interview feedback, or follow-up items..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE]"
              />
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-300 bg-white/5 hover:bg-white/10"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
