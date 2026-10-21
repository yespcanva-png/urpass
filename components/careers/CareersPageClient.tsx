"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CareersHero from "./CareersHero";
import CareersAbout from "./CareersAbout";
import WhyWorkWithUs from "./WhyWorkWithUs";
import JobBoard from "./JobBoard";
import JobApplicationForm from "./JobApplicationForm";
import type { JobPosting } from "@/lib/careers/types";

interface Props {
  initialJobs: JobPosting[];
}

export default function CareersPageClient({ initialJobs }: Props) {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0910] text-neutral-100 flex flex-col selection:bg-purple-500/30 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero */}
        <CareersHero />

        {/* 2. About Working at UrPass */}
        <CareersAbout />

        {/* 3. Why UrPass (4 Pillars) */}
        <WhyWorkWithUs />

        {/* 4. Open Positions Job Board */}
        <JobBoard
          jobs={initialJobs}
          onSelectJobForApplication={(job) => setSelectedJob(job)}
        />

        {/* 5. Production Application Form */}
        <section className="py-20 sm:py-28 bg-[#0e0c16] border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <JobApplicationForm
              availableJobs={initialJobs}
              selectedJob={selectedJob}
              onClearSelectedJob={() => setSelectedJob(null)}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
