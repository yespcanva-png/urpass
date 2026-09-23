-- ============================================================
-- Migration 044: Offline QR Scanner, Check-in Sync & Conflict Reconciliation
-- ============================================================

-- 1. Add offline tracking columns to check_ins
ALTER TABLE public.check_ins
  ADD COLUMN IF NOT EXISTS is_offline BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS scanned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ;

-- Backfill scanned_at for existing rows
UPDATE public.check_ins
SET scanned_at = checked_in_at
WHERE scanned_at IS NULL;

-- 2. Create table for tracking offline check-in conflicts
-- e.g. Gate A and Gate B scanned the exact same pass while disconnected from the internet
CREATE TABLE IF NOT EXISTS public.check_in_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  pass_id UUID REFERENCES public.passes(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  conflict_type TEXT NOT NULL DEFAULT 'OFFLINE_DUPLICATE'
    CHECK (conflict_type IN ('OFFLINE_DUPLICATE', 'GATE_CONFLICT', 'ZONE_MISMATCH')),
  winning_check_in_id UUID REFERENCES public.check_ins(id) ON DELETE SET NULL,
  conflicting_scan_operation_id TEXT,
  conflicting_scanned_at TIMESTAMPTZ NOT NULL,
  winning_scanned_at TIMESTAMPTZ,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast conflict queries
CREATE INDEX IF NOT EXISTS idx_check_in_conflicts_event ON public.check_in_conflicts(event_id);
CREATE INDEX IF NOT EXISTS idx_check_in_conflicts_pass ON public.check_in_conflicts(pass_id);
CREATE INDEX IF NOT EXISTS idx_check_in_conflicts_resolved ON public.check_in_conflicts(event_id, resolved);

-- 3. Enable RLS on check_in_conflicts
ALTER TABLE public.check_in_conflicts ENABLE ROW LEVEL SECURITY;

-- Organizers and authorized org staff can view conflicts for their events
CREATE POLICY "organizers_view_conflicts" ON public.check_in_conflicts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = check_in_conflicts.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = check_in_conflicts.event_id
        AND events.organization_id IS NOT NULL
        AND is_org_member(events.organization_id)
    )
  );

-- Backend service role can insert and manage all conflict records
CREATE POLICY "service_role_check_in_conflicts_all" ON public.check_in_conflicts
  FOR ALL USING (auth.role() = 'service_role');
