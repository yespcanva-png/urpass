-- Migration 095: Google Sheets Integration Connections and Sync Logs
-- Supports: Module 09 (Realtime & hourly Google Sheets synchronization, tab mappings, sync job status)

CREATE TABLE IF NOT EXISTS public.google_sheets_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE UNIQUE,
    connected BOOLEAN NOT NULL DEFAULT FALSE,
    account_email TEXT,
    spreadsheet_id TEXT,
    spreadsheet_title TEXT,
    spreadsheet_url TEXT,
    selected_tabs TEXT[] NOT NULL DEFAULT '{"registrations"}',
    sync_mode TEXT NOT NULL DEFAULT 'realtime' CHECK (sync_mode IN ('manual', 'realtime', 'hourly')),
    auto_sync_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_synced_at TIMESTAMPTZ,
    last_sync_status TEXT CHECK (last_sync_status IN ('success', 'partial', 'failed')),
    last_error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.google_sheets_sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    triggered_by TEXT NOT NULL DEFAULT 'manual',
    tabs_to_sync TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    records_processed INTEGER NOT NULL DEFAULT 0,
    records_failed INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_google_sheets_connections_event ON public.google_sheets_connections(event_id);
CREATE INDEX IF NOT EXISTS idx_google_sheets_sync_jobs_event ON public.google_sheets_sync_jobs(event_id, started_at DESC);

-- Enable RLS
ALTER TABLE public.google_sheets_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_sheets_sync_jobs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'google_sheets_connections' AND policyname = 'Organizers manage Google Sheets connection'
  ) THEN
    CREATE POLICY "Organizers manage Google Sheets connection"
      ON public.google_sheets_connections
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = google_sheets_connections.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'google_sheets_connections' AND policyname = 'Service role full access to Google Sheets connection'
  ) THEN
    CREATE POLICY "Service role full access to Google Sheets connection"
      ON public.google_sheets_connections
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'google_sheets_sync_jobs' AND policyname = 'Organizers view Google Sheets sync jobs'
  ) THEN
    CREATE POLICY "Organizers view Google Sheets sync jobs"
      ON public.google_sheets_sync_jobs
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = google_sheets_sync_jobs.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'google_sheets_sync_jobs' AND policyname = 'Service role full access to Google Sheets sync jobs'
  ) THEN
    CREATE POLICY "Service role full access to Google Sheets sync jobs"
      ON public.google_sheets_sync_jobs
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
