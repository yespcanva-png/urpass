-- Migration 093: Session-Wise Attendance Configuration & Independent Verification
-- Supports: Module 07 (Session schedules, ticket tier eligibility, duration tracking, manual corrections, multi-day occurrence)

-- 1. Extend event_sessions with advanced session attendance configuration
ALTER TABLE public.event_sessions
  ADD COLUMN IF NOT EXISTS eligible_ticket_type_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS checkin_window_start_minutes_before INTEGER DEFAULT 15,
  ADD COLUMN IF NOT EXISTS checkin_cutoff_minutes_after_start INTEGER,
  ADD COLUMN IF NOT EXISTS scanner_operator_emails TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS minimum_duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS allow_overlapping_attendance BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS day_index INTEGER NOT NULL DEFAULT 1;

-- 2. Extend session_checkins with credential references and manual correction audits
ALTER TABLE public.session_checkins
  ADD COLUMN IF NOT EXISTS credential_id TEXT,
  ADD COLUMN IF NOT EXISTS scanned_by TEXT,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS manual_correction JSONB DEFAULT NULL;

-- 3. Dedicated session scan logs for auditability across multiple entries/exits within a session
CREATE TABLE IF NOT EXISTS public.session_scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
    attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
    pass_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
    credential_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('checkin', 'checkout', 'auto', 'manual_override')),
    scanned_by TEXT NOT NULL,
    device_id TEXT,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_scan_logs_session ON public.session_scan_logs(session_id, scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_scan_logs_attendee ON public.session_scan_logs(attendee_id);
CREATE INDEX IF NOT EXISTS idx_session_scan_logs_event ON public.session_scan_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_session_checkins_credential ON public.session_checkins(credential_id);

-- Enable RLS
ALTER TABLE public.session_scan_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'session_scan_logs' AND policyname = 'Organizers view session scan logs'
  ) THEN
    CREATE POLICY "Organizers view session scan logs"
      ON public.session_scan_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = session_scan_logs.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'session_scan_logs' AND policyname = 'Service role full access to session scan logs'
  ) THEN
    CREATE POLICY "Service role full access to session scan logs"
      ON public.session_scan_logs
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
