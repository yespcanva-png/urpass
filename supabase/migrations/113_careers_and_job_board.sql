-- ==============================================================================
-- Migration 113: Careers, Job Postings, and Candidate Applications System
-- Description: Creates relational tables for UrPass dynamic job board, 
-- candidate applications, resume storage, and recruitment lifecycle.
-- ==============================================================================

-- 1. Job Postings Table
CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Bengaluru, India',
    workplace_type TEXT NOT NULL DEFAULT 'hybrid', -- 'remote', 'hybrid', 'on-site'
    employment_type TEXT NOT NULL DEFAULT 'full-time', -- 'full-time', 'part-time', 'internship', 'contract'
    experience_level TEXT NOT NULL DEFAULT 'mid', -- 'entry', 'junior', 'mid', 'senior', 'lead', 'intern'
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    nice_to_have JSONB NOT NULL DEFAULT '[]'::jsonb,
    benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for Job Postings
CREATE INDEX IF NOT EXISTS idx_job_postings_published ON public.job_postings(is_published, status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON public.job_postings(department);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON public.job_postings(slug);

-- 2. Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_postings(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    application_type TEXT NOT NULL DEFAULT 'job_specific', -- 'job_specific', 'general', 'internship'
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    years_of_experience TEXT,
    cover_note TEXT NOT NULL,
    resume_url TEXT,
    resume_filename TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'
    recruiter_notes TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for Job Applications
CREATE INDEX IF NOT EXISTS idx_job_apps_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_apps_email ON public.job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_apps_created ON public.job_applications(created_at DESC);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Job Postings RLS Policies:
-- 1. Anyone can view published active job postings
CREATE POLICY "Public can view published job postings"
    ON public.job_postings
    FOR SELECT
    USING (is_published = true AND status = 'published');

-- 2. Service role / Ops has full access to job postings
CREATE POLICY "Service role full access to job postings"
    ON public.job_postings
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- Job Applications RLS Policies:
-- 1. Anyone can insert job applications (public submissions)
CREATE POLICY "Public can submit job applications"
    ON public.job_applications
    FOR INSERT
    WITH CHECK (true);

-- 2. Service role / Ops has full access to view and update applications
CREATE POLICY "Service role full access to job applications"
    ON public.job_applications
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- Create storage bucket for candidate resumes (if storage extension is active)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

