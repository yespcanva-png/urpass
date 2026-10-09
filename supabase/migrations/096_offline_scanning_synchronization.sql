-- Migration 096: Offline Scanning Synchronization & Conflict Reconciliation
-- Supports: Module 10 (Encrypted offline scan bundle sync, batch reconciliation, conflict auditing)

CREATE TABLE IF NOT EXISTS public.offline_sync_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    operator_email TEXT NOT NULL,
    total_scans INTEGER NOT NULL DEFAULT 0,
    accepted_scans INTEGER NOT NULL DEFAULT 0,
    conflicted_scans INTEGER NOT NULL DEFAULT 0,
    rejected_scans INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    sync_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sync_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.offline_scan_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.offline_sync_batches(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    credential_id TEXT NOT NULL,
    attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
    client_timestamp TIMESTAMPTZ NOT NULL,
    server_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    conflict_type TEXT NOT NULL CHECK (conflict_type IN ('duplicate_entry', 'revoked_pass', 'unauthorized_session', 'expired', 'tier_mismatch')),
    resolution TEXT NOT NULL CHECK (resolution IN ('accepted_override', 'rejected', 'flagged_warning')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_offline_sync_batches_event ON public.offline_sync_batches(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offline_sync_batches_device ON public.offline_sync_batches(device_id);
CREATE INDEX IF NOT EXISTS idx_offline_scan_conflicts_event ON public.offline_scan_conflicts(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offline_scan_conflicts_credential ON public.offline_scan_conflicts(credential_id);

-- Enable RLS
ALTER TABLE public.offline_sync_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_scan_conflicts ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'offline_sync_batches' AND policyname = 'Organizers view offline sync batches'
  ) THEN
    CREATE POLICY "Organizers view offline sync batches"
      ON public.offline_sync_batches
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = offline_sync_batches.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'offline_sync_batches' AND policyname = 'Service role full access to offline batches'
  ) THEN
    CREATE POLICY "Service role full access to offline batches"
      ON public.offline_sync_batches
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'offline_scan_conflicts' AND policyname = 'Organizers view offline scan conflicts'
  ) THEN
    CREATE POLICY "Organizers view offline scan conflicts"
      ON public.offline_scan_conflicts
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = offline_scan_conflicts.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'offline_scan_conflicts' AND policyname = 'Service role full access to scan conflicts'
  ) THEN
    CREATE POLICY "Service role full access to scan conflicts"
      ON public.offline_scan_conflicts
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
