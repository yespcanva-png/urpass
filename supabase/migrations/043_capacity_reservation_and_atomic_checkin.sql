-- ============================================================
-- Migration 043: Paid-Event Capacity Reservation & Atomic Check-In
-- 
-- 1. ticket_reservations table: tracks temporary capacity holds (10-min window)
-- 2. Explicit capacity states: AVAILABLE -> RESERVED -> PAID -> APPROVED -> CHECKED_IN
-- 3. Atomic capacity reservation function with row-locking (reserve_ticket_capacity)
-- 4. scan_operation_id on check_ins for atomic & idempotent check-in validation
-- 5. Atomic check-in function with concurrency control (atomic_check_in_pass)
-- ============================================================

-- ── 1. ticket_reservations table ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.ticket_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE CASCADE,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  order_id TEXT,
  status TEXT NOT NULL DEFAULT 'RESERVED' 
    CHECK (status IN ('AVAILABLE', 'RESERVED', 'PAID', 'APPROVED', 'CHECKED_IN', 'EXPIRED', 'CANCELLED')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_reservations_event 
  ON public.ticket_reservations (event_id, ticket_type_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_ticket_reservations_order 
  ON public.ticket_reservations (order_id);
CREATE INDEX IF NOT EXISTS idx_ticket_reservations_status_expires 
  ON public.ticket_reservations (status, expires_at);

-- Enable RLS
ALTER TABLE public.ticket_reservations ENABLE ROW LEVEL SECURITY;

-- Organizer can view all reservations for their events
CREATE POLICY "organizer_ticket_reservations_select" ON public.ticket_reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_reservations.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_reservations.event_id
        AND events.organization_id IS NOT NULL
        AND is_org_member(events.organization_id)
    )
  );

-- Service role / public insert/update through backend API
CREATE POLICY "service_ticket_reservations_all" ON public.ticket_reservations
  FOR ALL USING (auth.role() = 'service_role');

-- ── 2. Add scan_operation_id to check_ins ─────────────────────
ALTER TABLE public.check_ins
  ADD COLUMN IF NOT EXISTS scan_operation_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_check_ins_scan_operation_id
  ON public.check_ins (scan_operation_id)
  WHERE scan_operation_id IS NOT NULL;

-- ── 3. Atomic capacity reservation function ───────────────────
CREATE OR REPLACE FUNCTION public.reserve_ticket_capacity(
  p_event_id UUID,
  p_ticket_type_id UUID,
  p_buyer_email TEXT,
  p_buyer_name TEXT,
  p_window_seconds INT DEFAULT 600
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_capacity INT;
  v_consumed INT;
  v_reservation_id UUID;
  v_expires_at TIMESTAMPTZ;
  v_event_limit INT;
  v_event_consumed INT;
  v_is_paid BOOLEAN;
  v_app_enabled BOOLEAN;
  v_event_status TEXT;
BEGIN
  -- Expire overdue reservations for this event first
  UPDATE public.ticket_reservations
  SET status = 'EXPIRED', updated_at = NOW()
  WHERE event_id = p_event_id
    AND status = 'RESERVED'
    AND expires_at <= NOW();

  -- Lock event row for atomic capacity check
  SELECT attendee_limit, is_paid_event, application_enabled, status
  INTO v_event_limit, v_is_paid, v_app_enabled, v_event_status
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'EVENT_NOT_FOUND', 'message', 'Event does not exist.');
  END IF;

  IF v_event_status != 'active' OR NOT v_app_enabled THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_ACCEPTING', 'message', 'Event is not accepting registrations.');
  END IF;

  -- Calculate total event capacity consumption across all active states:
  -- 1. Approved attendees (not rejected)
  -- 2. Paid registrations pending approval (so manual approval paid events consume capacity!)
  -- 3. Active unexpired reservations
  -- 4. Paid reservations not yet transitioned
  SELECT COUNT(*) INTO v_event_consumed
  FROM (
    SELECT id FROM public.attendees 
    WHERE event_id = p_event_id AND application_status = 'approved'
    UNION
    SELECT a.id FROM public.attendees a
    JOIN public.ticket_orders o ON o.attendee_id = a.id
    WHERE a.event_id = p_event_id 
      AND a.application_status != 'rejected'
      AND o.status = 'paid'
    UNION
    SELECT id FROM public.ticket_reservations
    WHERE event_id = p_event_id
      AND status = 'RESERVED'
      AND expires_at > NOW()
    UNION
    SELECT id FROM public.ticket_reservations
    WHERE event_id = p_event_id
      AND status = 'PAID'
  ) event_slots;

  IF v_event_limit IS NOT NULL AND v_event_consumed >= v_event_limit THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'SOLD_OUT', 
      'message', 'Event has reached total capacity.',
      'consumed', v_event_consumed,
      'limit', v_event_limit
    );
  END IF;

  -- If ticket_type_id is specified, lock and enforce ticket tier capacity
  IF p_ticket_type_id IS NOT NULL THEN
    SELECT capacity INTO v_capacity
    FROM public.ticket_types
    WHERE id = p_ticket_type_id AND event_id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'TICKET_NOT_FOUND', 'message', 'Selected ticket type not found.');
    END IF;

    IF v_capacity IS NOT NULL THEN
      SELECT COUNT(*) INTO v_consumed
      FROM (
        SELECT id FROM public.attendees 
        WHERE event_id = p_event_id 
          AND ticket_type_id = p_ticket_type_id 
          AND application_status = 'approved'
        UNION
        SELECT a.id FROM public.attendees a
        JOIN public.ticket_orders o ON o.attendee_id = a.id
        WHERE a.event_id = p_event_id 
          AND a.ticket_type_id = p_ticket_type_id
          AND a.application_status != 'rejected'
          AND o.status = 'paid'
        UNION
        SELECT id FROM public.ticket_reservations
        WHERE event_id = p_event_id
          AND ticket_type_id = p_ticket_type_id
          AND status = 'RESERVED'
          AND expires_at > NOW()
        UNION
        SELECT id FROM public.ticket_reservations
        WHERE event_id = p_event_id
          AND ticket_type_id = p_ticket_type_id
          AND status = 'PAID'
      ) tier_slots;

      IF v_consumed >= v_capacity THEN
        RETURN jsonb_build_object(
          'success', false, 
          'error', 'SOLD_OUT', 
          'message', 'Selected ticket type is sold out.',
          'consumed', v_consumed,
          'capacity', v_capacity
        );
      END IF;
    END IF;
  END IF;

  -- Capacity is guaranteed available -> Atomically insert reservation
  v_expires_at := NOW() + (p_window_seconds || ' seconds')::INTERVAL;
  INSERT INTO public.ticket_reservations (
    event_id,
    ticket_type_id,
    buyer_email,
    buyer_name,
    status,
    expires_at
  ) VALUES (
    p_event_id,
    p_ticket_type_id,
    p_buyer_email,
    p_buyer_name,
    'RESERVED',
    v_expires_at
  ) RETURNING id INTO v_reservation_id;

  RETURN jsonb_build_object(
    'success', true,
    'reservation_id', v_reservation_id,
    'expires_at', v_expires_at,
    'window_seconds', p_window_seconds
  );
END;
$$;

-- ── 4. Atomic check-in function ───────────────────────────────
CREATE OR REPLACE FUNCTION public.atomic_check_in_pass(
  p_pass_token TEXT,
  p_event_id UUID,
  p_checked_in_by UUID,
  p_gate_id UUID DEFAULT NULL,
  p_check_in_method TEXT DEFAULT 'qr',
  p_scan_operation_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_pass_id UUID;
  v_attendee_id UUID;
  v_ticket_type_id UUID;
  v_pass_type TEXT;
  v_pass_status TEXT;
  v_att_name TEXT;
  v_att_email TEXT;
  v_att_app_status TEXT;
  v_att_pass_status TEXT;
  v_gate_zone_id UUID;
  v_has_zone_access BOOLEAN;
  v_existing_ci_at TIMESTAMPTZ;
  v_new_ci_id UUID;
  v_new_ci_at TIMESTAMPTZ;
BEGIN
  -- 1. Idempotency check: if scan_operation_id was already executed, return original result
  IF p_scan_operation_id IS NOT NULL THEN
    SELECT c.checked_in_at, a.name, a.email, p.pass_type
    INTO v_existing_ci_at, v_att_name, v_att_email, v_pass_type
    FROM public.check_ins c
    JOIN public.passes p ON p.id = c.pass_id
    JOIN public.attendees a ON a.id = c.attendee_id
    WHERE c.scan_operation_id = p_scan_operation_id;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'status', 'CHECKED_IN',
        'success', true,
        'idempotent', true,
        'checkedInAt', v_existing_ci_at,
        'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
        'passType', v_pass_type,
        'scanOperationId', p_scan_operation_id
      );
    END IF;
  END IF;

  -- 2. Lock pass row to serialize concurrent gate scans of the exact same pass
  SELECT p.id, p.attendee_id, p.ticket_type_id, p.pass_type, p.status,
         a.name, a.email, a.application_status, a.pass_status
  INTO v_pass_id, v_attendee_id, v_ticket_type_id, v_pass_type, v_pass_status,
       v_att_name, v_att_email, v_att_app_status, v_att_pass_status
  FROM public.passes p
  JOIN public.attendees a ON a.id = p.attendee_id
  WHERE p.pass_token = p_pass_token AND p.event_id = p_event_id
  FOR UPDATE OF p;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'status', 'INVALID',
      'error', 'Invalid pass — not found for this event',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 3. Gate Zone Access Verification
  IF p_gate_id IS NOT NULL THEN
    SELECT zone_id INTO v_gate_zone_id
    FROM public.scanner_gates
    WHERE id = p_gate_id AND event_id = p_event_id;

    IF v_gate_zone_id IS NOT NULL AND v_ticket_type_id IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1 FROM public.ticket_zone_access
        WHERE ticket_type_id = v_ticket_type_id AND zone_id = v_gate_zone_id
      ) INTO v_has_zone_access;

      IF NOT v_has_zone_access THEN
        RETURN jsonb_build_object(
          'status', 'ACCESS_DENIED',
          'accessDenied', true,
          'error', 'This pass is not authorized for this gate / zone.',
          'passType', v_pass_type,
          'scanOperationId', p_scan_operation_id
        );
      END IF;
    END IF;
  END IF;

  -- 4. Check already checked in
  IF v_pass_status = 'checked_in' OR v_att_pass_status = 'checked_in' THEN
    SELECT checked_in_at INTO v_existing_ci_at
    FROM public.check_ins
    WHERE pass_id = v_pass_id;

    RETURN jsonb_build_object(
      'status', 'ALREADY_CHECKED_IN',
      'alreadyCheckedIn', true,
      'checkedInAt', COALESCE(v_existing_ci_at, NOW()),
      'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
      'passType', v_pass_type,
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 5. Check approval status
  IF v_att_app_status != 'approved' THEN
    RETURN jsonb_build_object(
      'status', 'NOT_APPROVED',
      'error', 'Attendee is not approved for this event',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 6. Atomic check-in insertion with duplicate guard
  v_new_ci_at := NOW();
  INSERT INTO public.check_ins (
    pass_id,
    event_id,
    attendee_id,
    checked_in_by,
    gate_id,
    check_in_method,
    scan_operation_id,
    checked_in_at
  ) VALUES (
    v_pass_id,
    p_event_id,
    v_attendee_id,
    p_checked_in_by,
    p_gate_id,
    p_check_in_method,
    p_scan_operation_id,
    v_new_ci_at
  )
  ON CONFLICT (pass_id) DO NOTHING
  RETURNING id INTO v_new_ci_id;

  -- If conflict occurred (another scanner won the microsecond race)
  IF v_new_ci_id IS NULL THEN
    SELECT checked_in_at INTO v_existing_ci_at
    FROM public.check_ins
    WHERE pass_id = v_pass_id;

    RETURN jsonb_build_object(
      'status', 'ALREADY_CHECKED_IN',
      'alreadyCheckedIn', true,
      'checkedInAt', COALESCE(v_existing_ci_at, NOW()),
      'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
      'passType', v_pass_type,
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 7. Update pass & attendee status
  UPDATE public.passes
  SET status = 'checked_in', updated_at = NOW()
  WHERE id = v_pass_id;

  UPDATE public.attendees
  SET pass_status = 'checked_in', updated_at = NOW()
  WHERE id = v_attendee_id;

  -- Update reservation status to CHECKED_IN if linked
  UPDATE public.ticket_reservations
  SET status = 'CHECKED_IN', updated_at = NOW()
  WHERE event_id = p_event_id
    AND buyer_email = v_att_email
    AND status IN ('PAID', 'APPROVED');

  RETURN jsonb_build_object(
    'status', 'CHECKED_IN',
    'success', true,
    'checkedInAt', v_new_ci_at,
    'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
    'passType', v_pass_type,
    'scanOperationId', p_scan_operation_id
  );
END;
$$;
