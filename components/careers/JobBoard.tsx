"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import type { JobPosting } from "@/lib/careers/types";
import { CAREERS_DEPARTMENTS } from "@/lib/careers/types";

interface Props {
  jobs: JobPosting[];
  onSelectJobForApplication: (job: JobPosting) => void;
}

export default function JobBoard({ jobs = [], onSelectJobForApplication }: Props) {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (selectedDept !== "All" && job.department !== selectedDept) {
        return false;
      }
      if (
        selectedWorkplace !== "All" &&
        job.workplace_type.toLowerCase() !== selectedWorkplace.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesSummary = job.summary.toLowerCase().includes(q);
        const matchesDept = job.department.toLowerCase().includes(q);
        const matchesLoc = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesDept && !matchesLoc) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, selectedDept, selectedWorkplace, searchQuery]);

  function handleQuickApply(job: JobPosting) {
    onSelectJobForApplication(job);
    const formElem = document.getElementById("application-form");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleScrollToGeneralApply() {
    const formElem = document.getElementById("application-form");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section id="open-positions" className="py-20 sm:py-28 bg-[#0a0910] relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-[#c4b5fd] tracking-widest uppercase mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Open Positions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Opportunities at UrPass
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl">
              Explore available opportunities across engineering, product, design, marketing and operations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 bg-white/[0.03] border border-white/8 px-4 py-2 rounded-xl self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {jobs.length} {jobs.length === 1 ? "Active Opening" : "Active Openings"}
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, department, or keyword..."
                className="w-full bg-[#12101b] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6200EE] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Workplace Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-neutral-400 hidden sm:inline">Workplace:</span>
              <select
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
                className="bg-[#12101b] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6200EE] transition-colors"
              >
                <option value="All">All Workplaces</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedDept("All")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === "All"
                  ? "bg-[#6200EE] text-white shadow-sm"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              All Departments
            </button>
            {CAREERS_DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? "bg-[#6200EE] text-white shadow-sm"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 sm:p-7 rounded-2xl bg-[#12101b] border border-white/8 hover:border-purple-500/35 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-[0_8px_30px_rgba(98,0,238,0.12)]"
              >
                <div>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25 uppercase tracking-wider">
                      {job.department}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      <span>{job.location}</span>
                    </span>

                    <span className="text-[11px] text-neutral-500">&bull;</span>

                    <span className="text-[11px] text-neutral-400 capitalize">
                      {job.workplace_type}
                    </span>

                    <span className="text-[11px] text-neutral-500">&bull;</span>

                    <span className="text-[11px] text-neutral-400 capitalize">
                      {job.employment_type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-[#c4b5fd] transition-colors tracking-tight mb-2.5">
                    <Link href={`/careers/${job.slug}`}>{job.title}</Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3 mb-6">
                    {job.summary}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-3">
                  <Link
                    href={`/careers/${job.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                  >
                    <span>View Role &amp; JD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleQuickApply(job)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6200EE] hover:bg-[#5200cc] shadow-xs transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Polished Empty State */
          <div className="p-10 sm:p-16 rounded-3xl bg-[#12101b] border border-white/8 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400 mx-auto mb-5">
              <Inbox className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              No published openings yet
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed max-w-md mx-auto">
              New opportunities will appear here when the UrPass team starts accepting applications for this category.
            </p>

            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-neutral-500">
              Suggested departments for future vacancies: Engineering, UI/UX Design, Product Management, Growth &amp; Marketing, Customer Success, and Internships.
            </div>

            <button
              onClick={handleScrollToGeneralApply}
              className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
            >
              Introduce Yourself (General Application) &rarr;
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
