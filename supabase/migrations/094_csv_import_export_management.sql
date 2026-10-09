-- Migration 094: CSV Bulk Import & Export Jobs and Audit Logs
-- Supports: Module 08 (Staged CSV imports, format validation, anti-formula injection, export audit)

CREATE TABLE IF NOT EXISTS public.csv_import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    import_type TEXT NOT NULL CHECK (import_type IN ('ticket_assignment', 'member_details', 'serial_numbers', 'attendee_list')),
    status TEXT NOT NULL DEFAULT 'staged' CHECK (status IN ('staged', 'validating', 'validated', 'processing', 'completed', 'failed')),
    file_name TEXT,
    total_rows INTEGER NOT NULL DEFAULT 0,
    valid_rows INTEGER NOT NULL DEFAULT 0,
    error_rows INTEGER NOT NULL DEFAULT 0,
    imported_rows INTEGER NOT NULL DEFAULT 0,
    validation_summary JSONB DEFAULT '{}'::jsonb,
    error_log JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.csv_export_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    export_type TEXT NOT NULL CHECK (export_type IN ('ticket_distribution', 'attendee_registrations', 'entry_exit_history', 'session_attendance', 'attendance_summary')),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    exported_rows INTEGER NOT NULL DEFAULT 0,
    file_url TEXT,
    filters JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_csv_import_jobs_event ON public.csv_import_jobs(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_csv_export_jobs_event ON public.csv_export_jobs(event_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.csv_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csv_export_jobs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'csv_import_jobs' AND policyname = 'Organizers manage CSV import jobs'
  ) THEN
    CREATE POLICY "Organizers manage CSV import jobs"
      ON public.csv_import_jobs
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = csv_import_jobs.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'csv_import_jobs' AND policyname = 'Service role full access to CSV import jobs'
  ) THEN
    CREATE POLICY "Service role full access to CSV import jobs"
      ON public.csv_import_jobs
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'csv_export_jobs' AND policyname = 'Organizers view CSV export jobs'
  ) THEN
    CREATE POLICY "Organizers view CSV export jobs"
      ON public.csv_export_jobs
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = csv_export_jobs.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'csv_export_jobs' AND policyname = 'Service role full access to CSV export jobs'
  ) THEN
    CREATE POLICY "Service role full access to CSV export jobs"
      ON public.csv_export_jobs
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
