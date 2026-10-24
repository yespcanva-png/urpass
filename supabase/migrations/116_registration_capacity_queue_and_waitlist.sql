-- ============================================================
-- Migration 116: Registration Capacity, Durable Queue & Waitlist Auto-Promotion
-- ============================================================

-- 1. Add auto_promote_waitlist to events table (default false for existing events)
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS auto_promote_waitlist BOOLEAN NOT NULL DEFAULT false;

-- 2. Add cancellation_token to attendees table for authorized self-service withdrawal
ALTER TABLE public.attendees
  ADD COLUMN IF NOT EXISTS cancellation_token TEXT DEFAULT encode(gen_random_bytes(24), 'hex');

CREATE INDEX IF NOT EXISTS idx_attendees_cancellation_token
  ON public.attendees (cancellation_token)
  WHERE cancellation_token IS NOT NULL;

-- 3. Durable communication queue table for background email & multi-channel dispatches
CREATE TABLE IF NOT EXISTS public.communication_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'whatsapp', 'sms')),
  purpose TEXT NOT NULL,
  subject TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'failed', 'cancelled')),
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_comm_queue_pending
  ON public.communication_queue (status, next_attempt_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_comm_queue_event
  ON public.communication_queue (event_id, purpose, status);

-- Enable RLS on communication_queue
ALTER TABLE public.communication_queue ENABLE ROW LEVEL SECURITY;

-- Organizers can select their event queues
CREATE POLICY "organizers_view_own_queue" ON public.communication_queue
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = communication_queue.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = communication_queue.event_id
        AND events.organization_id IS NOT NULL
        AND is_org_member(events.organization_id)
    )
  );

CREATE POLICY "service_role_queue_all" ON public.communication_queue
  FOR ALL USING (auth.role() = 'service_role');

-- 4. Atomic capacity allocation procedure for registrations & auto-approvals
CREATE OR REPLACE FUNCTION public.allocate_attendance_capacity(
  p_event_id UUID,
  p_ticket_type_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_event_limit INT;
  v_waitlist_enabled BOOLEAN;
  v_app_enabled BOOLEAN;
  v_event_status TEXT;
  v_approved_count INT;
  v_reserved_count INT;
  v_total_consumed INT;
  v_ticket_capacity INT;
  v_ticket_consumed INT;
BEGIN
  -- Row-level lock on event to serialize concurrent capacity evaluations
  SELECT attendee_limit, waitlist_enabled, application_enabled, status
  INTO v_event_limit, v_waitlist_enabled, v_app_enabled, v_event_status
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'EVENT_NOT_FOUND', 'message', 'Event does not exist.');
  END IF;

  IF v_event_status != 'active' OR NOT v_app_enabled THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_ACCEPTING', 'message', 'Event is not currently accepting applications.');
  END IF;

  -- Count confirmed attendees
  SELECT count(*) INTO v_approved_count
  FROM public.attendees
  WHERE event_id = p_event_id AND application_status = 'approved';

  -- Count unexpired ticket capacity reservations
  SELECT count(*) INTO v_reserved_count
  FROM public.ticket_reservations
  WHERE event_id = p_event_id AND status IN ('RESERVED', 'PAID') AND expires_at > NOW();

  v_total_consumed := v_approved_count + v_reserved_count;

  -- Check total event capacity
  IF v_event_limit IS NOT NULL AND v_total_consumed >= v_event_limit THEN
    IF v_waitlist_enabled THEN
      RETURN jsonb_build_object(
        'success', true,
        'status', 'waitlisted',
        'consumed', v_total_consumed,
        'limit', v_event_limit,
        'message', 'Event has reached total capacity. Applicant queued on waitlist.'
      );
    ELSE
      RETURN jsonb_build_object(
        'success', false,
        'error', 'SOLD_OUT',
        'consumed', v_total_consumed,
        'limit', v_event_limit,
        'message', 'This event has reached total capacity.'
      );
    END IF;
  END IF;

  -- Enforce tier capacity if a specific ticket type is chosen
  IF p_ticket_type_id IS NOT NULL THEN
    SELECT capacity INTO v_ticket_capacity
    FROM public.ticket_types
    WHERE id = p_ticket_type_id AND event_id = p_event_id
    FOR UPDATE;

    IF v_ticket_capacity IS NOT NULL THEN
      SELECT count(*) INTO v_ticket_consumed
      FROM public.attendees
      WHERE event_id = p_event_id AND ticket_type_id = p_ticket_type_id AND application_status = 'approved';

      IF v_ticket_consumed >= v_ticket_capacity THEN
        IF v_waitlist_enabled THEN
          RETURN jsonb_build_object(
            'success', true,
            'status', 'waitlisted',
            'message', 'Selected ticket tier is sold out. Added to waitlist.'
          );
        ELSE
          RETURN jsonb_build_object(
            'success', false,
            'error', 'SOLD_OUT',
            'message', 'Selected ticket category is sold out.'
          );
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'status', 'approved',
    'consumed', v_total_consumed,
    'limit', v_event_limit
  );
END;
$$;

-- 5. Atomic manual approval procedure for organizers
CREATE OR REPLACE FUNCTION public.atomic_approve_attendee(
  p_attendee_id UUID,
  p_event_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_event_limit INT;
  v_approved_count INT;
  v_current_status TEXT;
  v_ticket_type_id UUID;
  v_ticket_capacity INT;
  v_ticket_consumed INT;
BEGIN
  -- Lock event row
  SELECT attendee_limit INTO v_event_limit
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'EVENT_NOT_FOUND', 'message', 'Event not found.');
  END IF;

  -- Lock attendee row
  SELECT application_status, ticket_type_id INTO v_current_status, v_ticket_type_id
  FROM public.attendees
  WHERE id = p_attendee_id AND event_id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'ATTENDEE_NOT_FOUND', 'message', 'Attendee not found.');
  END IF;

  IF v_current_status = 'approved' THEN
    RETURN jsonb_build_object('success', true, 'already_approved', true, 'message', 'Attendee is already approved.');
  END IF;

  -- Evaluate current approved count atomically
  SELECT count(*) INTO v_approved_count
  FROM public.attendees
  WHERE event_id = p_event_id AND application_status = 'approved';

  IF v_event_limit IS NOT NULL AND v_approved_count >= v_event_limit THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'CAPACITY_REACHED',
      'message', format('Event is at capacity (%s). Increase the limit in Settings to approve more.', v_event_limit)
    );
  END IF;

  -- Check tier capacity
  IF v_ticket_type_id IS NOT NULL THEN
    SELECT capacity INTO v_ticket_capacity
    FROM public.ticket_types
    WHERE id = v_ticket_type_id AND event_id = p_event_id
    FOR UPDATE;

    IF v_ticket_capacity IS NOT NULL THEN
      SELECT count(*) INTO v_ticket_consumed
      FROM public.attendees
      WHERE event_id = p_event_id AND ticket_type_id = v_ticket_type_id AND application_status = 'approved';

      IF v_ticket_consumed >= v_ticket_capacity THEN
        RETURN jsonb_build_object(
          'success', false,
          'error', 'TIER_CAPACITY_REACHED',
          'message', 'Selected ticket tier capacity has been reached.'
        );
      END IF;
    END IF;
  END IF;

  -- Set approved
  UPDATE public.attendees
  SET application_status = 'approved', updated_at = NOW()
  WHERE id = p_attendee_id AND event_id = p_event_id;

  RETURN jsonb_build_object(
    'success', true,
    'approved_count', v_approved_count + 1,
    'limit', v_event_limit
  );
END;
$$;

-- ============================================================
-- ROLLBACK INSTRUCTIONS (if reversion is required):
-- ============================================================
-- DROP FUNCTION IF EXISTS public.atomic_approve_attendee(UUID, UUID);
-- DROP FUNCTION IF EXISTS public.allocate_attendance_capacity(UUID, UUID);
-- DROP POLICY IF EXISTS "organizers_view_own_queue" ON public.communication_queue;
-- DROP POLICY IF EXISTS "service_role_queue_all" ON public.communication_queue;
-- DROP TABLE IF EXISTS public.communication_queue;
-- DROP INDEX IF EXISTS public.idx_attendees_cancellation_token;
-- ALTER TABLE public.attendees DROP COLUMN IF EXISTS cancellation_token;
-- ALTER TABLE public.events DROP COLUMN IF EXISTS auto_promote_waitlist;
-- ============================================================
