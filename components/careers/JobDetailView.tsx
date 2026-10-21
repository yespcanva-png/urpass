"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ArrowDown,
  Sparkles,
  Building2,
  Calendar,
} from "lucide-react";
import type { JobPosting } from "@/lib/careers/types";
import JobApplicationForm from "./JobApplicationForm";

interface Props {
  job: JobPosting;
}

export default function JobDetailView({ job }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopyShareLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleScrollToForm() {
    const elem = document.getElementById("application-form");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0910] text-neutral-200 pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <Link href="/careers" className="hover:text-white transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>All Openings</span>
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400">{job.department}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-medium truncate max-w-xs">{job.title}</span>
        </div>

        {/* Role Header Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#12101b] border border-white/10 mb-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25 uppercase tracking-wider">
              {job.department}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-neutral-300 bg-white/5 border border-white/8 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{job.location}</span>
            </span>

            <span className="text-xs text-neutral-300 bg-white/5 border border-white/8 px-3 py-1 rounded-full capitalize">
              {job.workplace_type}
            </span>

            <span className="text-xs text-neutral-300 bg-white/5 border border-white/8 px-3 py-1 rounded-full capitalize">
              {job.employment_type}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {job.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed mb-8">
            {job.summary}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleScrollToForm}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#6200EE] hover:bg-[#5200cc] shadow-[0_0_24px_rgba(98,0,238,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for this Role</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyShareLink}
              className="px-4 py-3 rounded-xl font-semibold text-xs text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share Role</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Description Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* About the Role */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>About the Position</span>
              </h2>
              <div className="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  What You&apos;ll Do
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  What We&apos;re Looking For
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nice to Have */}
            {job.nice_to_have && job.nice_to_have.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Nice to Have
                </h2>
                <ul className="space-y-3">
                  {job.nice_to_have.map((nth, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-400 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 shrink-0 mt-0.5">
                        &bull;
                      </span>
                      <span>{nth}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  What We Offer
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3" />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dynamic Application Form tailored to this JD */}
            <div className="pt-8 border-t border-white/10">
              <JobApplicationForm selectedJob={job} />
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overview Card */}
            <div className="p-6 rounded-2xl bg-[#12101b] border border-white/10 space-y-4 text-xs">
              <p className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Position Specification
              </p>

              <div className="space-y-3.5 divide-y divide-white/5">
                <div className="flex justify-between pt-2 first:pt-0">
                  <span className="text-neutral-400">Department</span>
                  <span className="text-white font-medium">{job.department}</span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-neutral-400">Location</span>
                  <span className="text-white font-medium">{job.location}</span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-neutral-400">Workplace</span>
                  <span className="text-white font-medium capitalize">{job.workplace_type}</span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-neutral-400">Employment Type</span>
                  <span className="text-white font-medium capitalize">{job.employment_type}</span>
                </div>

                <div className="flex justify-between pt-3">
                  <span className="text-neutral-400">Experience Level</span>
                  <span className="text-white font-medium capitalize">{job.experience_level}</span>
                </div>

                {job.published_at && (
                  <div className="flex justify-between pt-3">
                    <span className="text-neutral-400">Posted</span>
                    <span className="text-white font-medium">
                      {new Date(job.published_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleScrollToForm}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#6200EE] hover:bg-[#5200cc] shadow-sm transition-all text-center block mt-4 cursor-pointer"
              >
                Apply for this Role
              </button>
            </div>

            {/* About UrPass Mini Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>About UrPass</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                UrPass is an event operating system created by Yesp Corporation, powering digital passes, QR check-in gates, and real-time attendance for modern tech events across India and the UK.
              </p>
              <Link
                href="/about"
                className="inline-block text-xs font-semibold text-purple-300 hover:text-white transition-colors"
              >
                Learn more about our team &rarr;
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
