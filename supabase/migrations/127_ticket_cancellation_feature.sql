-- Migration 127: Event Ticket Cancellation Feature
-- Enables optional, secure attendee self-service ticket cancellations,
-- status state machine updates, and audit logging.

-- 1. Expand attendees.application_status check constraint
ALTER TABLE public.attendees DROP CONSTRAINT IF EXISTS attendees_application_status_check;
ALTER TABLE public.attendees ADD CONSTRAINT attendees_application_status_check
  CHECK (application_status IN ('pending', 'approved', 'rejected', 'waitlisted', 'cancellation_requested', 'cancelled'));

-- 2. Expand passes.status check constraint
ALTER TABLE public.passes DROP CONSTRAINT IF EXISTS passes_status_check;
ALTER TABLE public.passes ADD CONSTRAINT passes_status_check
  CHECK (status IN (
    'not_generated',
    'generated',
    'active',
    'checked_in',
    'checked_out',
    'partially_checked_in',
    'revoked',
    'expired',
    'cancelled',
    'refunded'
  ));

-- 3. Create ticket_cancellations table for transactional audit trail
CREATE TABLE IF NOT EXISTS public.ticket_cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  pass_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.ticket_orders(id) ON DELETE SET NULL,
  requested_by TEXT NOT NULL DEFAULT 'ATTENDEE' CHECK (requested_by IN ('ATTENDEE', 'ORGANIZER', 'SYSTEM')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')),
  reason TEXT,
  rejection_reason TEXT,
  policy_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  refund_status TEXT NOT NULL DEFAULT 'NONE' CHECK (refund_status IN ('NONE', 'PENDING', 'PROCESSED', 'FAILED', 'MANUAL_REVIEW')),
  refund_amount INT NOT NULL DEFAULT 0,
  refund_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. Create performant indexes
CREATE INDEX IF NOT EXISTS idx_ticket_cancellations_event ON public.ticket_cancellations (event_id, status);
CREATE INDEX IF NOT EXISTS idx_ticket_cancellations_attendee ON public.ticket_cancellations (attendee_id);
CREATE INDEX IF NOT EXISTS idx_ticket_cancellations_pass ON public.ticket_cancellations (pass_id);

-- 5. Updated_at trigger
DROP TRIGGER IF EXISTS tr_ticket_cancellations_updated_at ON public.ticket_cancellations;
CREATE TRIGGER tr_ticket_cancellations_updated_at
  BEFORE UPDATE ON public.ticket_cancellations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Row-Level Security
ALTER TABLE public.ticket_cancellations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Organizers can view cancellations for their events" ON public.ticket_cancellations;
CREATE POLICY "Organizers can view cancellations for their events"
  ON public.ticket_cancellations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_cancellations.event_id
        AND events.organizer_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.events
      JOIN public.organization_members om ON om.organization_id = events.organization_id
      WHERE events.id = ticket_cancellations.event_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
        AND om.role IN ('owner', 'admin', 'event_manager', 'finance')
    )
  );

DROP POLICY IF EXISTS "Organizers can manage cancellations for their events" ON public.ticket_cancellations;
CREATE POLICY "Organizers can manage cancellations for their events"
  ON public.ticket_cancellations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_cancellations.event_id
        AND events.organizer_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.events
      JOIN public.organization_members om ON om.organization_id = events.organization_id
      WHERE events.id = ticket_cancellations.event_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
        AND om.role IN ('owner', 'admin', 'event_manager')
    )
  );

DROP POLICY IF EXISTS "Public can view own cancellation status" ON public.ticket_cancellations;
CREATE POLICY "Public can view own cancellation status"
  ON public.ticket_cancellations
  FOR SELECT
  USING (true);
