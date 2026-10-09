-- Migration 097: Advanced Attendance Analytics Snapshots & Materialized Reporting
-- Supports: Module 11 (Aggregated demographic breakdowns, hourly scans by gate, session fill rates, time-series retention)

CREATE TABLE IF NOT EXISTS public.event_analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    snapshot_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    total_tickets INTEGER NOT NULL DEFAULT 0,
    tickets_sold INTEGER NOT NULL DEFAULT 0,
    tickets_claimed INTEGER NOT NULL DEFAULT 0,
    tickets_unassigned INTEGER NOT NULL DEFAULT 0,
    tickets_revoked INTEGER NOT NULL DEFAULT 0,
    total_attendees INTEGER NOT NULL DEFAULT 0,
    net_attendees_inside INTEGER NOT NULL DEFAULT 0,
    total_checkins INTEGER NOT NULL DEFAULT 0,
    total_exits INTEGER NOT NULL DEFAULT 0,
    total_re_entries INTEGER NOT NULL DEFAULT 0,
    gate_breakdown JSONB DEFAULT '[]'::jsonb,
    session_breakdown JSONB DEFAULT '[]'::jsonb,
    demographics JSONB DEFAULT '{}'::jsonb,
    time_series JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_analytics_snapshots_event_ts ON public.event_analytics_snapshots(event_id, snapshot_timestamp DESC);

-- Enable RLS
ALTER TABLE public.event_analytics_snapshots ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_analytics_snapshots' AND policyname = 'Organizers view analytics snapshots'
  ) THEN
    CREATE POLICY "Organizers view analytics snapshots"
      ON public.event_analytics_snapshots
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = event_analytics_snapshots.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_analytics_snapshots' AND policyname = 'Service role full access to analytics snapshots'
  ) THEN
    CREATE POLICY "Service role full access to analytics snapshots"
      ON public.event_analytics_snapshots
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
