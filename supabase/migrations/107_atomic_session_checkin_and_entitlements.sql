-- Migration 107: Atomic Session Check-In, Attendee Session Entitlements & Group Session Attendance
-- Provides transactional row locking, capacity enforcement, revoked pass validation, and single QR multi-session support.

-- 1. Attendee-Specific Session Entitlements Table (For Multi-Session Add-ons & Manual Grants)
CREATE TABLE IF NOT EXISTS public.attendee_session_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'ticket_tier' CHECK (source IN ('ticket_tier', 'addon_purchase', 'manual_grant', 'vip_override')),
  order_id UUID REFERENCES public.ticket_orders(id) ON DELETE SET NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_attendee_session_entitlement UNIQUE (attendee_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_attendee_session_entitlements_attendee ON public.attendee_session_entitlements(attendee_id);
CREATE INDEX IF NOT EXISTS idx_attendee_session_entitlements_session ON public.attendee_session_entitlements(session_id);
CREATE INDEX IF NOT EXISTS idx_attendee_session_entitlements_event ON public.attendee_session_entitlements(event_id);

-- Enable RLS
ALTER TABLE public.attendee_session_entitlements ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'attendee_session_entitlements' AND policyname = 'Organizers manage attendee session entitlements'
  ) THEN
    CREATE POLICY "Organizers manage attendee session entitlements"
      ON public.attendee_session_entitlements
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = attendee_session_entitlements.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'attendee_session_entitlements' AND policyname = 'Service role full access to attendee session entitlements'
  ) THEN
    CREATE POLICY "Service role full access to attendee session entitlements"
      ON public.attendee_session_entitlements
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;


-- 2. Extend session_checkins with admitted_guests and scan_operation_id
ALTER TABLE public.session_checkins
  ADD COLUMN IF NOT EXISTS admitted_guests INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS scan_operation_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_session_checkins_scan_op 
  ON public.session_checkins(scan_operation_id) 
  WHERE scan_operation_id IS NOT NULL;


-- 3. Dedicated Group Session Admissions Ledger
CREATE TABLE IF NOT EXISTS public.session_group_admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
  pass_id UUID NOT NULL REFERENCES public.passes(id) ON DELETE CASCADE,
  group_booking_reference TEXT NOT NULL,
  admitted_count INT NOT NULL CHECK (admitted_count > 0),
  previously_admitted INT NOT NULL DEFAULT 0,
  remaining_after INT NOT NULL DEFAULT 0,
  total_entitlements INT NOT NULL DEFAULT 1,
  scanner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  operator_email TEXT,
  device_id TEXT DEFAULT 'web-scanner',
  scan_operation_id TEXT UNIQUE,
  admitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_session_group_admissions_session ON public.session_group_admissions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_group_admissions_pass ON public.session_group_admissions(pass_id);
CREATE INDEX IF NOT EXISTS idx_session_group_admissions_ref ON public.session_group_admissions(group_booking_reference);

-- Enable RLS
ALTER TABLE public.session_group_admissions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'session_group_admissions' AND policyname = 'Organizers view session group admissions'
  ) THEN
    CREATE POLICY "Organizers view session group admissions"
      ON public.session_group_admissions
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = session_group_admissions.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'session_group_admissions' AND policyname = 'Service role full access to session group admissions'
  ) THEN
    CREATE POLICY "Service role full access to session group admissions"
      ON public.session_group_admissions
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;


-- 4. Atomic Session Check-In Stored Procedure
CREATE OR REPLACE FUNCTION public.atomic_session_checkin(
  p_pass_token TEXT,
  p_event_id UUID,
  p_session_id UUID,
  p_scanner_user_id UUID DEFAULT NULL,
  p_operator_email TEXT DEFAULT NULL,
  p_device_id TEXT DEFAULT 'web-scanner',
  p_action TEXT DEFAULT 'auto',
  p_override BOOLEAN DEFAULT false,
  p_scan_operation_id TEXT DEFAULT NULL,
  p_admitted_count INT DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_session RECORD;
  v_room RECORD;
  v_pass RECORD;
  v_attendee RECORD;
  v_ticket_type RECORD;
  v_existing_checkin RECORD;
  v_existing_op_checkin RECORD;
  v_reservation RECORD;
  v_is_explicit_entitled BOOLEAN := false;
  v_is_tier_eligible BOOLEAN := false;
  v_effective_capacity INT;
  v_current_occupancy INT;
  v_now TIMESTAMPTZ := now();
  v_checkin_id UUID;
  v_is_group BOOLEAN := false;
  v_group_total INT := 1;
  v_group_previously_admitted INT := 0;
  v_group_remaining INT := 1;
  v_admit_qty INT := GREATEST(1, COALESCE(p_admitted_count, 1));
  v_operator_permitted BOOLEAN := true;
BEGIN
  -- 1. Idempotency Check
  IF p_scan_operation_id IS NOT NULL THEN
    SELECT sc.*, a.name as attendee_name, a.email as attendee_email, p.pass_type, s.title as session_title
    INTO v_existing_op_checkin
    FROM public.session_checkins sc
    JOIN public.attendees a ON a.id = sc.attendee_id
    JOIN public.passes p ON p.id = sc.pass_id
    JOIN public.event_sessions s ON s.id = sc.session_id
    WHERE sc.scan_operation_id = p_scan_operation_id;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'success', true,
        'idempotent', true,
        'status', CASE WHEN v_existing_op_checkin.checkout_time IS NOT NULL THEN 'CHECKED_OUT' ELSE 'CHECKED_IN' END,
        'checkinId', v_existing_op_checkin.id,
        'checkinTime', v_existing_op_checkin.checkin_time,
        'checkoutTime', v_existing_op_checkin.checkout_time,
        'attendee', jsonb_build_object(
          'id', v_existing_op_checkin.attendee_id,
          'name', v_existing_op_checkin.attendee_name,
          'email', v_existing_op_checkin.attendee_email,
          'pass_type', v_existing_op_checkin.pass_type
        ),
        'session', jsonb_build_object(
          'id', v_existing_op_checkin.session_id,
          'title', v_existing_op_checkin.session_title
        ),
        'message', 'Operation already processed (idempotent).'
      );
    END IF;
  END IF;

  -- 2. Lock & Retrieve Session
  SELECT s.*, r.name as room_name, r.capacity as room_capacity
  INTO v_session
  FROM public.event_sessions s
  LEFT JOIN public.event_rooms r ON r.id = s.room_id
  WHERE s.id = p_session_id AND s.event_id = p_event_id
  FOR UPDATE OF s;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'SESSION_NOT_FOUND',
      'error', 'Session not found for this event.'
    );
  END IF;

  IF NOT v_session.checkin_enabled THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'CHECKIN_DISABLED',
      'error', 'Check-in is currently disabled for this session.'
    );
  END IF;

  IF v_session.status = 'cancelled' THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'SESSION_CLOSED',
      'error', 'This session has been cancelled.'
    );
  END IF;

  -- 3. Check Scanner Operator Authorization
  IF v_session.scanner_operator_emails IS NOT NULL AND array_length(v_session.scanner_operator_emails, 1) > 0 THEN
    IF p_operator_email IS NOT NULL AND NOT p_override THEN
      IF NOT (lower(trim(p_operator_email)) = ANY(
        SELECT lower(trim(unnest(v_session.scanner_operator_emails)))
      )) THEN
        RETURN jsonb_build_object(
          'success', false,
          'status', 'SCANNER_UNAUTHORIZED',
          'error', format('Operator "%s" is not assigned to scan for this session.', p_operator_email)
        );
      END IF;
    END IF;
  END IF;

  -- 4. Lock & Validate Pass Credential
  SELECT p.*, a.id as att_id, a.name as att_name, a.email as att_email, a.phone as att_phone,
         a.pass_type as att_pass_type, a.ticket_type_id as att_ticket_type_id,
         a.application_status as att_application_status, a.custom_responses as att_custom_responses
  INTO v_pass
  FROM public.passes p
  JOIN public.attendees a ON a.id = p.attendee_id
  WHERE (p.pass_token = trim(p_pass_token) OR p.id::text = trim(p_pass_token))
    AND p.event_id = p_event_id
  FOR UPDATE OF p;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'INVALID_PASS',
      'error', 'Pass credential not found for this event.'
    );
  END IF;

  -- Validate Pass Lifecycle Status (CRITICAL SECURITY FIX)
  IF v_pass.status IN ('revoked', 'cancelled', 'refunded', 'expired', 'suspended') THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', CASE 
        WHEN v_pass.status = 'revoked' THEN 'PASS_REVOKED'
        WHEN v_pass.status IN ('cancelled', 'refunded') THEN 'TICKET_CANCELLED'
        WHEN v_pass.status = 'expired' THEN 'PASS_EXPIRED'
        ELSE 'PASS_INVALID'
      END,
      'error', format('Pass is %s. Admission denied.', upper(v_pass.status)),
      'attendee', jsonb_build_object('name', v_pass.att_name, 'email', v_pass.att_email)
    );
  END IF;

  IF v_pass.att_application_status = 'rejected' THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'NOT_APPROVED',
      'error', 'Attendee registration is rejected.',
      'attendee', jsonb_build_object('name', v_pass.att_name, 'email', v_pass.att_email)
    );
  END IF;

  -- 5. Ticket Tier & Entitlement Resolution
  -- First check explicit attendee session entitlement
  SELECT EXISTS (
    SELECT 1 FROM public.attendee_session_entitlements
    WHERE attendee_id = v_pass.att_id AND session_id = p_session_id
  ) INTO v_is_explicit_entitled;

  IF NOT v_is_explicit_entitled THEN
    -- Check session eligible ticket types
    IF v_session.eligible_ticket_type_ids IS NULL OR array_length(v_session.eligible_ticket_type_ids, 1) IS NULL OR array_length(v_session.eligible_ticket_type_ids, 1) = 0 THEN
      v_is_tier_eligible := true;
    ELSE
      -- Check ticket type id or pass type string
      IF (v_pass.ticket_type_id IS NOT NULL AND v_pass.ticket_type_id = ANY(v_session.eligible_ticket_type_ids))
         OR (v_pass.att_ticket_type_id IS NOT NULL AND v_pass.att_ticket_type_id = ANY(v_session.eligible_ticket_type_ids)) THEN
        v_is_tier_eligible := true;
      ELSE
        v_is_tier_eligible := false;
      END IF;
    END IF;

    IF NOT v_is_tier_eligible AND NOT p_override THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'SESSION_ACCESS_DENIED',
        'error', format('ACCESS DENIED: Ticket does not include session "%s".', v_session.title),
        'attendee', jsonb_build_object('name', v_pass.att_name, 'email', v_pass.att_email, 'pass_type', v_pass.pass_type),
        'session', jsonb_build_object('id', v_session.id, 'title', v_session.title)
      );
    END IF;
  END IF;

  -- 6. Reservation Verification
  SELECT * INTO v_reservation
  FROM public.session_reservations
  WHERE session_id = p_session_id AND attendee_id = v_pass.att_id;

  IF v_session.registration_required AND NOT p_override THEN
    IF v_reservation IS NULL OR v_reservation.status NOT IN ('reserved', 'attended') THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'RESERVATION_REQUIRED',
        'error', format('ACCESS DENIED: Advance reservation required for session "%s".', v_session.title),
        'attendee', jsonb_build_object('name', v_pass.att_name, 'email', v_pass.att_email),
        'session', jsonb_build_object('id', v_session.id, 'title', v_session.title)
      );
    END IF;
  END IF;

  -- 7. Group Pass Resolution
  v_is_group := COALESCE(v_pass.is_group_pass, false) 
             OR COALESCE(v_pass.is_group_master, false) 
             OR COALESCE(v_pass.total_guests, 1) > 1
             OR COALESCE(v_pass.att_custom_responses->>'is_single_group_qr', 'false') IN ('true', 't', '1');

  IF v_is_group THEN
    v_group_total := GREATEST(
      COALESCE(v_pass.total_guests, 1),
      COALESCE(NULLIF(regexp_replace(COALESCE(v_pass.att_custom_responses->>'group_attendee_count', '0'), '[^0-9]', '', 'g'), '')::int, 0),
      COALESCE(NULLIF(regexp_replace(COALESCE(v_pass.att_custom_responses->>'guest_count', '0'), '[^0-9]', '', 'g'), '')::int, 0),
      1
    );

    SELECT COALESCE(SUM(admitted_count), 0) INTO v_group_previously_admitted
    FROM public.session_group_admissions
    WHERE session_id = p_session_id AND pass_id = v_pass.id;

    v_group_remaining := GREATEST(0, v_group_total - v_group_previously_admitted);

    IF p_action IN ('checkin', 'auto') AND v_group_remaining <= 0 THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'ALREADY_CHECKED_IN',
        'isGroup', true,
        'totalEntitlements', v_group_total,
        'previouslyAdmitted', v_group_previously_admitted,
        'remainingEntries', 0,
        'error', 'All group entitlements have already been admitted to this session.',
        'attendee', jsonb_build_object('name', v_pass.att_name, 'email', v_pass.att_email)
      );
    END IF;

    IF p_action IN ('checkin', 'auto') AND v_admit_qty > v_group_remaining THEN
      v_admit_qty := v_group_remaining;
    END IF;
  ELSE
    v_admit_qty := 1;
  END IF;

  -- 8. Existing Check-In Record
  SELECT * INTO v_existing_checkin
  FROM public.session_checkins
  WHERE session_id = p_session_id AND attendee_id = v_pass.att_id;

  -- Check-out Mode Execution
  IF (p_action = 'checkout' OR (p_action = 'auto' AND v_session.require_checkout)) 
     AND v_existing_checkin IS NOT NULL AND v_existing_checkin.checkout_time IS NULL THEN
    UPDATE public.session_checkins
    SET checkout_time = v_now,
        duration_minutes = ROUND(EXTRACT(EPOCH FROM (v_now - v_existing_checkin.checkin_time)) / 60)::INT
    WHERE id = v_existing_checkin.id;

    -- Audit Log
    INSERT INTO public.session_scan_logs (
      event_id, session_id, attendee_id, pass_id, credential_id, action, scanned_by, device_id, scanned_at, duration_minutes
    ) VALUES (
      p_event_id, p_session_id, v_pass.att_id, v_pass.id, v_pass.pass_token, 'checkout',
      COALESCE(p_operator_email, 'staff'), p_device_id, v_now,
      ROUND(EXTRACT(EPOCH FROM (v_now - v_existing_checkin.checkin_time)) / 60)::INT
    );

    RETURN jsonb_build_object(
      'success', true,
      'status', 'CHECKED_OUT',
      'attendee', jsonb_build_object('id', v_pass.att_id, 'name', v_pass.att_name, 'email', v_pass.att_email, 'pass_type', v_pass.pass_type),
      'session', jsonb_build_object('id', v_session.id, 'title', v_session.title, 'room', COALESCE(v_session.room_name, 'Main Venue')),
      'checkinTime', v_existing_checkin.checkin_time,
      'checkoutTime', v_now,
      'message', format('Checked out: %s', v_pass.att_name)
    );
  END IF;

  -- Duplicate Scan Prevention (if not group pass with remaining entries)
  IF NOT v_is_group AND v_existing_checkin IS NOT NULL AND v_existing_checkin.checkout_time IS NULL THEN
    IF p_action NOT IN ('reentry', 'override') THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'ALREADY_CHECKED_IN',
        'attendee', jsonb_build_object('id', v_pass.att_id, 'name', v_pass.att_name, 'email', v_pass.att_email, 'pass_type', v_pass.pass_type),
        'session', jsonb_build_object('id', v_session.id, 'title', v_session.title, 'room', COALESCE(v_session.room_name, 'Main Venue')),
        'checkedInAt', v_existing_checkin.checkin_time,
        'message', format('ALREADY ADMITTED: %s entered this session at %s', v_pass.att_name, to_char(v_existing_checkin.checkin_time, 'HH12:MI AM'))
      );
    END IF;
  END IF;

  -- 9. Authoritative Capacity Enforcement
  v_effective_capacity := COALESCE(v_session.capacity, v_session.room_capacity);

  -- Atomic count of individuals currently inside this session
  SELECT COALESCE(SUM(admitted_guests), 0) INTO v_current_occupancy
  FROM public.session_checkins
  WHERE session_id = p_session_id AND checkout_time IS NULL;

  IF v_effective_capacity IS NOT NULL AND v_effective_capacity > 0 THEN
    IF (v_current_occupancy + v_admit_qty) > v_effective_capacity 
       AND (v_reservation IS NULL OR v_reservation.status != 'reserved') 
       AND NOT p_override THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'SESSION_FULL',
        'capacity', v_effective_capacity,
        'checkedIn', v_current_occupancy,
        'remainingSeats', GREATEST(0, v_effective_capacity - v_current_occupancy),
        'error', format('SESSION FULL: Capacity (%s) reached. Available: %s', v_effective_capacity, GREATEST(0, v_effective_capacity - v_current_occupancy)),
        'attendee', jsonb_build_object('name', v_pass.att_name, 'email', v_pass.att_email)
      );
    END IF;
  END IF;

  -- 10. Record Check-In / Re-entry
  IF v_existing_checkin IS NOT NULL THEN
    -- Re-entry or Group Increment
    IF v_is_group THEN
      UPDATE public.session_checkins
      SET checkin_time = v_now,
          checkout_time = NULL,
          admitted_guests = v_existing_checkin.admitted_guests + v_admit_qty,
          scanner_user_id = p_scanner_user_id,
          device_id = p_device_id
      WHERE id = v_existing_checkin.id;
      v_checkin_id := v_existing_checkin.id;
    ELSE
      -- Re-entry for single attendee
      UPDATE public.session_checkins
      SET checkin_time = v_now,
          checkout_time = NULL,
          scanner_user_id = p_scanner_user_id,
          device_id = p_device_id
      WHERE id = v_existing_checkin.id;
      v_checkin_id := v_existing_checkin.id;
    END IF;
  ELSE
    -- Initial Entry
    INSERT INTO public.session_checkins (
      event_id, session_id, attendee_id, pass_id, registration_id,
      scanner_user_id, device_id, checkin_time, checkin_source, sync_status,
      admitted_guests, scan_operation_id
    ) VALUES (
      p_event_id, p_session_id, v_pass.att_id, v_pass.id, COALESCE(v_reservation.id::text, v_pass.id::text),
      p_scanner_user_id, p_device_id, v_now, 'qr', 'synced',
      v_admit_qty, p_scan_operation_id
    ) RETURNING id INTO v_checkin_id;
  END IF;

  -- If group pass, record in session_group_admissions ledger
  IF v_is_group THEN
    INSERT INTO public.session_group_admissions (
      event_id, session_id, pass_id, group_booking_reference,
      admitted_count, previously_admitted, remaining_after, total_entitlements,
      scanner_user_id, operator_email, device_id, scan_operation_id, admitted_at
    ) VALUES (
      p_event_id, p_session_id, v_pass.id, v_pass.pass_token,
      v_admit_qty, v_group_previously_admitted, GREATEST(0, v_group_remaining - v_admit_qty), v_group_total,
      p_scanner_user_id, p_operator_email, p_device_id, p_scan_operation_id, v_now
    );
  END IF;

  -- Update reservation to attended if reserved
  IF v_reservation IS NOT NULL AND v_reservation.status = 'reserved' THEN
    UPDATE public.session_reservations
    SET status = 'attended'
    WHERE id = v_reservation.id;
  END IF;

  -- Audit Log
  INSERT INTO public.session_scan_logs (
    event_id, session_id, attendee_id, pass_id, credential_id,
    action, scanned_by, device_id, scanned_at
  ) VALUES (
    p_event_id, p_session_id, v_pass.att_id, v_pass.id, v_pass.pass_token,
    CASE WHEN v_existing_checkin IS NOT NULL AND v_existing_checkin.checkout_time IS NOT NULL THEN 'reentry' ELSE 'checkin' END,
    COALESCE(p_operator_email, 'staff'), p_device_id, v_now
  );

  v_current_occupancy := v_current_occupancy + v_admit_qty;

  RETURN jsonb_build_object(
    'success', true,
    'status', 'CHECKED_IN',
    'checkinId', v_checkin_id,
    'checkinTime', v_now,
    'admittedCount', v_admit_qty,
    'capacity', v_effective_capacity,
    'checkedInCount', v_current_occupancy,
    'remainingSeats', CASE WHEN v_effective_capacity IS NOT NULL THEN GREATEST(0, v_effective_capacity - v_current_occupancy) ELSE NULL END,
    'isGroup', v_is_group,
    'groupDetails', CASE WHEN v_is_group THEN jsonb_build_object(
      'totalEntitlements', v_group_total,
      'previouslyAdmitted', v_group_previously_admitted,
      'admittedNow', v_admit_qty,
      'remainingEntries', GREATEST(0, v_group_remaining - v_admit_qty)
    ) ELSE NULL END,
    'attendee', jsonb_build_object(
      'id', v_pass.att_id,
      'name', v_pass.att_name,
      'email', v_pass.att_email,
      'pass_type', v_pass.pass_type
    ),
    'session', jsonb_build_object(
      'id', v_session.id,
      'title', v_session.title,
      'room', COALESCE(v_session.room_name, 'Main Venue')
    ),
    'message', CASE 
      WHEN v_is_group THEN format('✓ ADMITTED %s GUEST(S): %s (%s remaining)', v_admit_qty, v_pass.att_name, GREATEST(0, v_group_remaining - v_admit_qty))
      WHEN v_existing_checkin IS NOT NULL AND v_existing_checkin.checkout_time IS NOT NULL THEN format('✓ RE-ADMITTED: %s', v_pass.att_name)
      ELSE format('✓ CHECKED IN: %s', v_pass.att_name)
    END
  );
END;
$$;


-- 5. Atomic Session Reservation Stored Procedure
CREATE OR REPLACE FUNCTION public.atomic_session_reserve(
  p_session_id UUID,
  p_attendee_id UUID,
  p_pass_token TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'web'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_session RECORD;
  v_attendee RECORD;
  v_pass RECORD;
  v_existing_res RECORD;
  v_conflict_count INT;
  v_effective_capacity INT;
  v_active_reservations INT;
  v_res_status TEXT := 'reserved';
  v_res_id UUID;
  v_is_tier_eligible BOOLEAN := false;
  v_is_explicit_entitled BOOLEAN := false;
BEGIN
  -- 1. Lock Session
  SELECT s.*, r.capacity as room_capacity
  INTO v_session
  FROM public.event_sessions s
  LEFT JOIN public.event_rooms r ON r.id = s.room_id
  WHERE s.id = p_session_id
  FOR UPDATE OF s;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Session not found.');
  END IF;

  IF v_session.status = 'cancelled' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Session is cancelled.');
  END IF;

  -- 2. Lookup Attendee
  SELECT a.*, p.id as pass_id, p.pass_token, p.status as pass_status, p.ticket_type_id as pass_ticket_type_id
  INTO v_attendee
  FROM public.attendees a
  LEFT JOIN public.passes p ON p.attendee_id = a.id AND p.event_id = v_session.event_id
  WHERE a.id = p_attendee_id AND a.event_id = v_session.event_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Valid attendee registration not found for this event.');
  END IF;

  IF v_attendee.application_status = 'rejected' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Attendee registration is rejected.');
  END IF;

  -- Check if pass is cancelled/refunded
  IF v_attendee.pass_status IN ('revoked', 'cancelled', 'refunded', 'expired') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Pass is revoked or cancelled. Cannot reserve session.');
  END IF;

  -- 3. Ticket Tier & Entitlement Check
  SELECT EXISTS (
    SELECT 1 FROM public.attendee_session_entitlements
    WHERE attendee_id = p_attendee_id AND session_id = p_session_id
  ) INTO v_is_explicit_entitled;

  IF NOT v_is_explicit_entitled THEN
    IF v_session.eligible_ticket_type_ids IS NULL OR array_length(v_session.eligible_ticket_type_ids, 1) IS NULL OR array_length(v_session.eligible_ticket_type_ids, 1) = 0 THEN
      v_is_tier_eligible := true;
    ELSE
      IF (v_attendee.ticket_type_id IS NOT NULL AND v_attendee.ticket_type_id = ANY(v_session.eligible_ticket_type_ids))
         OR (v_attendee.pass_ticket_type_id IS NOT NULL AND v_attendee.pass_ticket_type_id = ANY(v_session.eligible_ticket_type_ids)) THEN
        v_is_tier_eligible := true;
      END IF;
    END IF;

    IF NOT v_is_tier_eligible THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'UNAUTHORIZED_TIER',
        'error', format('Your ticket tier does not include access to reserve session "%s".', v_session.title)
      );
    END IF;
  END IF;

  -- 4. Check Existing Reservation
  SELECT * INTO v_existing_res
  FROM public.session_reservations
  WHERE session_id = p_session_id AND attendee_id = p_attendee_id;

  IF v_existing_res IS NOT NULL AND v_existing_res.status IN ('reserved', 'attended') THEN
    RETURN jsonb_build_object(
      'success', true,
      'status', v_existing_res.status,
      'reservationId', v_existing_res.id,
      'message', 'You already have an active reservation for this session.'
    );
  END IF;

  -- 5. Time Schedule Conflict Check
  SELECT COUNT(*) INTO v_conflict_count
  FROM public.session_reservations sr
  JOIN public.event_sessions other ON other.id = sr.session_id
  WHERE sr.attendee_id = p_attendee_id
    AND sr.status IN ('reserved', 'waitlisted')
    AND other.id != p_session_id
    AND other.session_date = v_session.session_date
    AND other.status != 'cancelled'
    AND other.start_time < v_session.end_time
    AND other.end_time > v_session.start_time;

  IF v_conflict_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'SCHEDULE_CONFLICT',
      'error', 'Schedule Conflict: You already have a session reservation during this time window.'
    );
  END IF;

  -- 6. Atomic Reservation Capacity Check
  v_effective_capacity := COALESCE(v_session.capacity, v_session.room_capacity);

  IF v_effective_capacity IS NOT NULL AND v_effective_capacity > 0 THEN
    SELECT COUNT(*) INTO v_active_reservations
    FROM public.session_reservations
    WHERE session_id = p_session_id AND status = 'reserved';

    IF v_active_reservations >= v_effective_capacity THEN
      IF v_session.allow_waitlist THEN
        v_res_status := 'waitlisted';
      ELSE
        RETURN jsonb_build_object(
          'success', false,
          'status', 'SESSION_FULL',
          'error', 'Session is at full capacity and does not accept waitlists.'
        );
      END IF;
    END IF;
  END IF;

  -- 7. Upsert Reservation
  INSERT INTO public.session_reservations (
    session_id, attendee_id, registration_id, status, reserved_at, cancelled_at
  ) VALUES (
    p_session_id, p_attendee_id, COALESCE(v_attendee.pass_id::text, p_attendee_id::text),
    v_res_status, now(), NULL
  )
  ON CONFLICT (session_id, attendee_id)
  DO UPDATE SET
    status = v_res_status,
    reserved_at = now(),
    cancelled_at = NULL
  RETURNING id INTO v_res_id;

  -- Add to personal agenda automatically
  INSERT INTO public.attendee_agenda (event_id, attendee_id, session_id)
  VALUES (v_session.event_id, p_attendee_id, p_session_id)
  ON CONFLICT (attendee_id, session_id) DO NOTHING;

  RETURN jsonb_build_object(
    'success', true,
    'status', v_res_status,
    'reservationId', v_res_id,
    'message', CASE WHEN v_res_status = 'waitlisted' THEN 'Session is full. Added to waitlist.' ELSE 'Seat reserved successfully!' END
  );
END;
$$;
