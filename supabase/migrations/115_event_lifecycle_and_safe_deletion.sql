-- ============================================================
-- URPASS Migration 115 — Event Lifecycle Normalization & Safe Deletion
-- ============================================================
-- Purpose:
-- 1. Support 'archived' in events.status constraint.
-- 2. Add deleted_at and archived_at timestamps for soft-deletion and archival.
-- 3. Add partial indexes to optimize dashboard active-event queries and soft-delete filtering.
-- ============================================================

-- 1. Add deleted_at and archived_at columns to events table if not present
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- 2. Expand status check constraint to include 'archived'
-- Safely drop existing check constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'events_status_check'
      AND conrelid = 'public.events'::regclass
  ) THEN
    ALTER TABLE public.events DROP CONSTRAINT events_status_check;
  END IF;
END $$;

ALTER TABLE public.events
  ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'active', 'completed', 'cancelled', 'archived'));

-- 3. Add performance indexes for active and non-deleted events
CREATE INDEX IF NOT EXISTS idx_events_status
  ON public.events(status);

CREATE INDEX IF NOT EXISTS idx_events_active_non_deleted
  ON public.events(organizer_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_events_archived_at
  ON public.events(archived_at)
  WHERE archived_at IS NOT NULL;

-- ============================================================
-- ROLLBACK INSTRUCTIONS (if reversion is required):
-- ============================================================
-- ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;
-- ALTER TABLE public.events ADD CONSTRAINT events_status_check
--   CHECK (status IN ('draft', 'active', 'completed', 'cancelled'));
-- DROP INDEX IF EXISTS public.idx_events_archived_at;
-- DROP INDEX IF EXISTS public.idx_events_active_non_deleted;
-- DROP INDEX IF EXISTS public.idx_events_status;
-- ALTER TABLE public.events DROP COLUMN IF EXISTS archived_at;
-- ALTER TABLE public.events DROP COLUMN IF EXISTS deleted_at;
-- ============================================================
