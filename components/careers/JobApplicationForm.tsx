"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Shield,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import type { JobPosting, ApplicationType } from "@/lib/careers/types";
import { CAREERS_DEPARTMENTS } from "@/lib/careers/types";

interface Props {
  availableJobs?: JobPosting[];
  selectedJob?: JobPosting | null;
  onClearSelectedJob?: () => void;
}

export default function JobApplicationForm({
  availableJobs = [],
  selectedJob = null,
  onClearSelectedJob,
}: Props) {
  const [appType, setAppType] = useState<ApplicationType>(
    selectedJob ? "job_specific" : "general"
  );
  const [chosenJobId, setChosenJobId] = useState<string>(selectedJob?.id || "");
  const [department, setDepartment] = useState<string>(
    selectedJob?.department || "Engineering"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("1-3");
  const [coverNote, setCoverNote] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [resumeFilename, setResumeFilename] = useState<string>("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Sync when selectedJob prop changes (e.g. on dynamic JD page or card click)
  useEffect(() => {
    if (selectedJob) {
      setAppType("job_specific");
      setChosenJobId(selectedJob.id);
      setDepartment(selectedJob.department);
    }
  }, [selectedJob]);

  const activeJob =
    selectedJob || availableJobs.find((j) => j.id === chosenJobId) || null;

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setResumeError("Only PDF documents (.pdf) are accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError("Resume must be smaller than 5MB.");
      return;
    }

    setResumeError(null);
    setResumeFile(file);
    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/careers/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResumeUrl(data.url);
        setResumeFilename(data.filename || file.name);
      } else {
        setResumeError(data.error || "Failed to process resume upload.");
      }
    } catch {
      setResumeError("Network error while uploading resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  }

  function handleRemoveResume() {
    setResumeFile(null);
    setResumeUrl("");
    setResumeFilename("");
    setResumeError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim() || !email.trim() || !coverNote.trim()) {
      setSubmitError("Please fill in your full name, email, and introductory note.");
      return;
    }

    if (!privacyConsent) {
      setSubmitError("Please confirm your consent for UrPass to process your application data.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        jobId: activeJob?.id || null,
        jobSlug: activeJob?.slug || null,
        jobTitle: activeJob
          ? activeJob.title
          : appType === "internship"
          ? "Internship Expression of Interest"
          : "General Application",
        department: activeJob?.department || department,
        applicationType: appType,
        fullName,
        email,
        phone,
        linkedinUrl,
        portfolioUrl,
        yearsOfExperience,
        coverNote,
        resumeUrl,
        resumeFilename,
      };

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedRef(data.applicationId || "REF-OK");
      } else {
        setSubmitError(data.error || "Submission failed. Please check your details.");
      }
    } catch {
      setSubmitError("Network error submitting application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSubmittedRef(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setLinkedinUrl("");
    setPortfolioUrl("");
    setCoverNote("");
    handleRemoveResume();
    setSubmitError(null);
  }

  if (submittedRef) {
    return (
      <div id="application-form" className="p-8 sm:p-12 rounded-3xl bg-[#12101b] border border-purple-500/30 text-center max-w-xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Application Received
        </span>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
          Thank you, {fullName}!
        </h3>

        <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
          We&apos;ve securely received your application for{" "}
          <strong className="text-white">
            {activeJob ? activeJob.title : appType === "internship" ? "Internship Opportunity" : "UrPass Team"}
          </strong>
          . A confirmation email has been dispatched to{" "}
          <span className="text-[#a78bfa] underline">{email}</span>.
        </p>

        <div className="my-6 p-4 rounded-xl bg-white/[0.03] border border-white/8 text-left text-xs text-neutral-400 space-y-1">
          <div className="flex justify-between">
            <span>Reference ID:</span>
            <span className="font-mono text-purple-300 font-bold">{submittedRef.slice(0, 12)}</span>
          </div>
          <div className="flex justify-between">
            <span>Department:</span>
            <span className="text-white">{activeJob?.department || department}</span>
          </div>
          <div className="flex justify-between">
            <span>Review SLA:</span>
            <span className="text-white">3 – 5 Business Days</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div
      id="application-form"
      className="p-6 sm:p-10 rounded-3xl bg-[#12101b] border border-white/10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-[#c4b5fd] tracking-widest uppercase mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Introduce Yourself</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Join the UrPass Mission
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
          Whether applying for an active opening or introducing yourself for future roles, we&apos;d love to hear from you.
        </p>
      </div>

      {/* JD Context Banner (when applying for a specific role) */}
      {activeJob && (
        <div className="mb-6 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[#c4b5fd] shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                Applying for Open Position
              </p>
              <p className="text-sm font-bold text-white truncate">{activeJob.title}</p>
              <p className="text-[11px] text-neutral-400">
                {activeJob.department} &middot; {activeJob.location} ({activeJob.workplace_type})
              </p>
            </div>
          </div>

          {onClearSelectedJob && (
            <button
              type="button"
              onClick={onClearSelectedJob}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 shrink-0"
              title="Switch to General Application"
            >
              Change
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot field for bot spam detection */}
        <input
          type="text"
          name="website_url_check"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Application Type Selector (hidden if specifically pre-locked to a JD) */}
        {!selectedJob && (
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Application Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "general", label: "General Application" },
                { id: "internship", label: "Internship" },
                { id: "job_specific", label: "Open Position" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setAppType(opt.id as ApplicationType);
                    if (opt.id !== "job_specific") {
                      setChosenJobId("");
                    }
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    appType === opt.id
                      ? "bg-[#6200EE] border-[#6200EE] text-white font-bold shadow-sm"
                      : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If Open Position is selected without pre-selection, pick from available jobs */}
        {appType === "job_specific" && !selectedJob && availableJobs.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Select Position <span className="text-[#a78bfa]">*</span>
            </label>
            <select
              value={chosenJobId}
              onChange={(e) => {
                setChosenJobId(e.target.value);
                const found = availableJobs.find((j) => j.id === e.target.value);
                if (found) setDepartment(found.department);
              }}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6200EE] transition-colors"
            >
              <option value="">-- Choose an Open Role --</option>
              {availableJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department} - {j.location})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Department / Area of Interest (if general application or internship) */}
        {appType !== "job_specific" && (
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Area of Interest <span className="text-[#a78bfa]">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6200EE] transition-colors"
            >
              {CAREERS_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Personal Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Full Name <span className="text-[#a78bfa]">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Email Address <span className="text-[#a78bfa]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aditi@example.com"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE] transition-colors"
            />
          </div>
        </div>

        {/* Phone & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Phone Number <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Experience Level
            </label>
            <select
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6200EE] transition-colors"
            >
              <option value="0-1">0 - 1 years / Student / New Grad</option>
              <option value="1-3">1 - 3 years</option>
              <option value="3-5">3 - 5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
        </div>

        {/* Links: LinkedIn & Portfolio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Portfolio / GitHub / Website
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE] transition-colors"
            />
          </div>
        </div>

        {/* Resume PDF Upload */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Resume / CV <span className="text-neutral-500 font-normal">(PDF only, max 5MB)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelected}
            className="hidden"
          />

          {resumeFilename ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-emerald-500/30">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-white truncate">{resumeFilename}</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10">
                  Ready
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="text-neutral-400 hover:text-red-400 p-1 transition-colors"
                title="Remove resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploadingResume}
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 rounded-xl border border-dashed border-white/20 hover:border-purple-400 bg-white/[0.02] hover:bg-white/[0.04] flex items-center justify-center gap-2.5 text-xs text-neutral-300 transition-all cursor-pointer"
            >
              {uploadingResume ? (
                <>
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span>Uploading resume...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>Click to browse and upload PDF resume</span>
                </>
              )}
            </button>
          )}

          {resumeError && (
            <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {resumeError}
            </p>
          )}
        </div>

        {/* Why UrPass / Cover Note */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            {activeJob
              ? `Why are you excited about the ${activeJob.title} role at UrPass?`
              : "Why UrPass? / Tell us about what you want to build"} <span className="text-[#a78bfa]">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Share a project you're proud of, how you solve tough problems, or what excites you about event technology..."
            className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE] transition-colors leading-relaxed"
          />
        </div>

        {/* Privacy Consent Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="privacyConsent"
            type="checkbox"
            required
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#6200EE] focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="privacyConsent" className="text-[11px] text-neutral-400 leading-normal cursor-pointer">
            I agree to UrPass processing my personal information for recruitment and evaluation purposes in accordance with the{" "}
            <a href="/privacy" target="_blank" className="text-[#a78bfa] underline hover:text-white">
              Privacy Policy
            </a>
            . We never sell or share candidate data.
          </label>
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || uploadingResume}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#6200EE] hover:bg-[#5200cc] shadow-[0_0_24px_rgba(98,0,238,0.4)] hover:shadow-[0_0_32px_rgba(98,0,238,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <span>Submit Application</span>
          )}
        </button>
      </form>
    </div>
  );
}
