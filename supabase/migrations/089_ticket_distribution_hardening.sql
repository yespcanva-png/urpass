-- 089: M02 Ticket Distribution hardening
-- Adds persisted distribution history metadata and index support for claim-token lookup.

ALTER TABLE public.ticket_orders
  ADD COLUMN IF NOT EXISTS "_distributionHistory" JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_ticket_orders_group_members_gin
  ON public.ticket_orders USING GIN (group_members);

CREATE INDEX IF NOT EXISTS idx_ticket_orders_distribution_history_gin
  ON public.ticket_orders USING GIN ("_distributionHistory");

CREATE TABLE IF NOT EXISTS public.ticket_assignment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id UUID,
  actor_email TEXT,
  action TEXT NOT NULL CHECK (action IN ('INVITED', 'CLAIMED', 'REVOKED', 'REASSIGNED', 'RETAINED')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_assignment_history_order
  ON public.ticket_assignment_history(order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ticket_assignment_history_event
  ON public.ticket_assignment_history(event_id, created_at DESC);

ALTER TABLE public.ticket_assignment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ticket_assignment_history_event_member_select" ON public.ticket_assignment_history;
CREATE POLICY "ticket_assignment_history_event_member_select" ON public.ticket_assignment_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = ticket_assignment_history.event_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND public.is_org_member(e.organization_id)
          )
        )
    )
  );

DROP POLICY IF EXISTS "ticket_assignment_history_service_role_all" ON public.ticket_assignment_history;
CREATE POLICY "ticket_assignment_history_service_role_all" ON public.ticket_assignment_history
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
