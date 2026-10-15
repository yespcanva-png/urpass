-- Migration 106: Hard Event Capacity Enforcement at Database Transaction Boundary
-- Guarantees strict attendee_limit enforcement for individual and group QR check-ins
-- under concurrent multi-gate scans via PostgreSQL row locks (SELECT ... FOR UPDATE).

-- ── 1. Atomic Individual Check-in with Capacity Enforcement ─────────────────
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
  v_attendee_limit INT;
  v_ci_count INT;
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
  v_new_ci_at TIMESTAMPTZ := NOW();
  v_event_exists BOOLEAN;
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
        'message', 'Entry allowed',
        'checkedInAt', v_existing_ci_at,
        'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
        'passType', v_pass_type,
        'scanOperationId', p_scan_operation_id
      );
    END IF;
  END IF;

  -- 2. Lock event row to serialize check-in capacity transactions
  SELECT attendee_limit
  INTO v_attendee_limit
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'status', 'WRONG_EVENT',
      'success', false,
      'error', 'This pass is not valid for this event',
      'message', 'This pass is not valid for this event',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 3. Lock pass row to serialize concurrent gate scans of the exact same pass
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
      'status', 'INVALID_PASS',
      'success', false,
      'error', 'Invalid QR pass',
      'message', 'Invalid QR pass',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 4. Check already checked in
  IF v_pass_status = 'checked_in' OR v_att_pass_status = 'checked_in' THEN
    SELECT checked_in_at INTO v_existing_ci_at
    FROM public.check_ins
    WHERE pass_id = v_pass_id
    ORDER BY checked_in_at DESC
    LIMIT 1;

    RETURN jsonb_build_object(
      'status', 'ALREADY_CHECKED_IN',
      'alreadyCheckedIn', true,
      'success', false,
      'error', 'Already checked in',
      'message', 'Already checked in',
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
      'success', false,
      'error', 'Attendee is not approved for this event',
      'message', 'Attendee is not approved for this event',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 6. Gate Zone Access Verification
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
          'success', false,
          'error', 'This pass is not authorized for this gate / zone.',
          'message', 'This pass is not authorized for this gate / zone.',
          'passType', v_pass_type,
          'scanOperationId', p_scan_operation_id
        );
      END IF;
    END IF;
  END IF;

  -- 7. Hard Capacity Check at Event Level (Atomic within event lock)
  IF v_attendee_limit IS NOT NULL AND v_attendee_limit > 0 THEN
    SELECT COUNT(*) INTO v_ci_count
    FROM public.check_ins
    WHERE event_id = p_event_id;

    IF v_ci_count >= v_attendee_limit THEN
      RETURN jsonb_build_object(
        'status', 'EVENT_CAPACITY_REACHED',
        'success', false,
        'error', 'Event capacity reached',
        'message', 'Event capacity reached',
        'currentCheckins', v_ci_count,
        'capacityLimit', v_attendee_limit,
        'scanOperationId', p_scan_operation_id
      );
    END IF;
  END IF;

  -- 8. Atomic check-in insertion with duplicate guard
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
  );

  -- 9. Update pass and attendee records
  UPDATE public.passes
  SET status = 'checked_in', updated_at = v_new_ci_at
  WHERE id = v_pass_id;

  UPDATE public.attendees
  SET pass_status = 'checked_in', venue_presence_state = 'inside', last_scanned_at = v_new_ci_at, updated_at = v_new_ci_at
  WHERE id = v_attendee_id;

  RETURN jsonb_build_object(
    'status', 'CHECKED_IN',
    'success', true,
    'message', 'Entry allowed',
    'checkedInAt', v_new_ci_at,
    'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
    'passType', v_pass_type,
    'scanOperationId', p_scan_operation_id
  );
END;
$$;


-- ── 2. Atomic Group Entry Check-in with Capacity Enforcement ────────────────
CREATE OR REPLACE FUNCTION public.atomic_group_entry_checkin(
  p_group_booking_ref TEXT,
  p_event_id UUID,
  p_quantity INT,
  p_checked_in_by UUID,
  p_operator_email TEXT DEFAULT NULL,
  p_gate_id UUID DEFAULT NULL,
  p_device_id TEXT DEFAULT 'web-scanner',
  p_scan_operation_id TEXT DEFAULT NULL,
  p_entry_mode TEXT DEFAULT 'count_only',
  p_admitted_members JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_pass RECORD;
  v_has_order BOOLEAN := false;
  v_has_pass BOOLEAN := false;
  v_is_explicit_group BOOLEAN := false;
  v_total_entitlements INT;
  v_previously_admitted INT;
  v_remaining INT;
  v_new_remaining INT;
  v_attendee_limit INT;
  v_current_checkins INT;
  v_venue_remaining INT;
  v_actual_admit INT;
  v_admission_id UUID;
  v_now TIMESTAMPTZ := now();
  v_existing_admission RECORD;
  v_buyer_name TEXT;
BEGIN
  -- 1. Idempotency Check
  IF p_scan_operation_id IS NOT NULL THEN
    SELECT * INTO v_existing_admission
    FROM public.group_entry_admissions
    WHERE scan_operation_id = p_scan_operation_id;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'success', true,
        'idempotent', true,
        'status', 'GROUP_ADMITTED',
        'groupBookingReference', v_existing_admission.group_booking_reference,
        'admittedCount', v_existing_admission.admitted_count,
        'totalEntitlements', v_existing_admission.total_entitlements,
        'previouslyAdmitted', v_existing_admission.previously_admitted,
        'remainingEntries', v_existing_admission.remaining_after,
        'admittedAt', v_existing_admission.admitted_at,
        'message', format('Entry allowed; remaining entries: %s', v_existing_admission.remaining_after)
      );
    END IF;
  END IF;

  -- 2. Validate quantity requested
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'INVALID_QUANTITY',
      'error', 'Quantity to admit must be at least 1.',
      'message', 'Quantity to admit must be at least 1.'
    );
  END IF;

  -- 3. Lock Event Row for atomic venue capacity tracking
  SELECT attendee_limit
  INTO v_attendee_limit
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'WRONG_EVENT',
      'error', 'This pass is not valid for this event',
      'message', 'This pass is not valid for this event'
    );
  END IF;

  -- 4. Search and Lock ticket_orders or passes
  SELECT id, event_id, buyer_name, buyer_email, status, attendee_id,
         COALESCE(total_attendee_count, total_entitlements, 1) as total_units,
         COALESCE(admitted_entitlements, 0) as used_units,
         group_entry_enabled, group_entry_mode, group_qr_code
  INTO v_order
  FROM public.ticket_orders
  WHERE (
    id::text = p_group_booking_ref
    OR group_qr_code = p_group_booking_ref
    OR razorpay_order_id = p_group_booking_ref
  ) AND event_id = p_event_id
  FOR UPDATE;
  v_has_order := FOUND;

  IF NOT v_has_order THEN
    SELECT p.id, p.pass_token, p.event_id, p.attendee_id, p.status,
           GREATEST(
             COALESCE(p.total_guests, 1),
             COALESCE(NULLIF(regexp_replace(COALESCE(a.custom_responses->>'group_attendee_count', '0'), '[^0-9]', '', 'g'), '')::int, 0),
             COALESCE(NULLIF(regexp_replace(COALESCE(a.custom_responses->>'bulk_quantity', '0'), '[^0-9]', '', 'g'), '')::int, 0),
             COALESCE(NULLIF(regexp_replace(COALESCE(a.custom_responses->>'guest_count', '0'), '[^0-9]', '', 'g'), '')::int, 0),
             COALESCE(tt.included_guests, 1),
             1
           ) as total_units,
           COALESCE(p.checked_in_guests, 0) as used_units,
           a.name as buyer_name, a.email as buyer_email,
           COALESCE(p.is_group_master, false) as is_group_master,
           COALESCE(p.is_group_pass, false) as is_group_pass,
           COALESCE(tt.is_group_pass, false) as is_group_ticket_type,
           a.custom_responses as custom_responses
    INTO v_pass
    FROM public.passes p
    LEFT JOIN public.attendees a ON a.id = p.attendee_id
    LEFT JOIN public.ticket_types tt ON tt.id = p.ticket_type_id
    WHERE (p.pass_token = p_group_booking_ref OR p.id::text = p_group_booking_ref)
      AND p.event_id = p_event_id
    FOR UPDATE OF p;
    v_has_pass := FOUND;
  END IF;

  IF NOT v_has_order AND NOT v_has_pass THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'BOOKING_NOT_FOUND',
      'error', 'Invalid QR pass',
      'message', 'Invalid QR pass'
    );
  END IF;

  -- 5. Validity checks
  IF v_has_order AND v_order.status IN ('refunded', 'cancelled', 'failed') THEN
    RETURN jsonb_build_object('success', false, 'status', 'BOOKING_INVALID', 'error', 'Invalid QR pass', 'message', 'Invalid QR pass');
  END IF;

  IF v_has_pass AND v_pass.status IN ('revoked', 'cancelled', 'refunded', 'expired') THEN
    RETURN jsonb_build_object('success', false, 'status', 'BOOKING_INVALID', 'error', 'Invalid QR pass', 'message', 'Invalid QR pass');
  END IF;

  v_total_entitlements := GREATEST(
    CASE WHEN v_has_order THEN COALESCE(v_order.total_units, 1) ELSE 1 END,
    CASE WHEN v_has_pass THEN COALESCE(v_pass.total_units, 1) ELSE 1 END
  );
  v_previously_admitted := GREATEST(
    CASE WHEN v_has_order THEN COALESCE(v_order.used_units, 0) ELSE 0 END,
    CASE WHEN v_has_pass THEN COALESCE(v_pass.used_units, 0) ELSE 0 END
  );
  v_remaining := GREATEST(0, v_total_entitlements - v_previously_admitted);

  -- 6. Check if group entitlement already exhausted
  IF v_remaining <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'EXHAUSTED',
      'error', 'Maximum limit reached',
      'message', 'Maximum limit reached',
      'totalEntitlements', v_total_entitlements,
      'previouslyAdmitted', v_previously_admitted,
      'remainingEntries', 0
    );
  END IF;

  -- 7. Venue Hard Capacity Check (Atomically evaluated within event lock)
  IF v_attendee_limit IS NOT NULL AND v_attendee_limit > 0 THEN
    SELECT COUNT(*) INTO v_current_checkins
    FROM public.check_ins
    WHERE event_id = p_event_id;

    v_venue_remaining := GREATEST(0, v_attendee_limit - v_current_checkins);

    IF v_venue_remaining <= 0 THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'EVENT_CAPACITY_REACHED',
        'error', 'Event capacity reached',
        'message', 'Event capacity reached',
        'totalEntitlements', v_total_entitlements,
        'previouslyAdmitted', v_previously_admitted,
        'remainingEntries', v_remaining,
        'currentCheckins', v_current_checkins,
        'capacityLimit', v_attendee_limit
      );
    END IF;

    -- If group requests more than venue capacity can accommodate,
    -- cap admission at venue capacity so we do NOT over-admit
    v_actual_admit := LEAST(p_quantity, v_remaining, v_venue_remaining);
  ELSE
    v_actual_admit := LEAST(p_quantity, v_remaining);
  END IF;

  IF v_actual_admit <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'EVENT_CAPACITY_REACHED',
      'error', 'Event capacity reached',
      'message', 'Event capacity reached',
      'remainingEntries', v_remaining
    );
  END IF;

  -- 8. Commit admission atomically
  v_new_remaining := v_remaining - v_actual_admit;

  IF v_has_order AND v_order.id IS NOT NULL THEN
    UPDATE public.ticket_orders
    SET admitted_entitlements = v_previously_admitted + v_actual_admit,
        updated_at = v_now
    WHERE id = v_order.id;
  END IF;

  IF v_has_pass AND v_pass.id IS NOT NULL THEN
    UPDATE public.passes
    SET checked_in_guests = v_previously_admitted + v_actual_admit,
        status = CASE WHEN v_new_remaining = 0 THEN 'checked_in' ELSE 'partially_checked_in' END,
        updated_at = v_now
    WHERE id = v_pass.id;
  END IF;

  -- 9. Insert durable audit log entry
  INSERT INTO public.group_entry_admissions (
    event_id, order_id, pass_id, group_booking_reference, gate_id, admitted_count,
    total_entitlements, previously_admitted, remaining_after, entry_mode,
    admitted_members, scanner_operator_id, operator_email, device_id,
    scan_operation_id, admitted_at
  ) VALUES (
    p_event_id,
    CASE WHEN v_has_order THEN v_order.id ELSE NULL END,
    CASE WHEN v_has_pass THEN v_pass.id ELSE NULL END,
    p_group_booking_ref,
    p_gate_id,
    v_actual_admit,
    v_total_entitlements,
    v_previously_admitted,
    v_new_remaining,
    p_entry_mode,
    p_admitted_members,
    p_checked_in_by,
    p_operator_email,
    p_device_id,
    p_scan_operation_id,
    v_now
  ) RETURNING id INTO v_admission_id;

  -- 10. Insert check_ins per admitted guest
  IF v_has_pass AND v_pass.attendee_id IS NOT NULL THEN
    UPDATE public.attendees
    SET pass_status = 'checked_in',
        venue_presence_state = 'inside',
        last_scanned_at = v_now,
        updated_at = v_now
    WHERE id = v_pass.attendee_id;

    FOR i IN 1..v_actual_admit LOOP
      INSERT INTO public.check_ins (
        pass_id, event_id, attendee_id, checked_in_by, gate_id, check_in_method, scan_operation_id, checked_in_at
      ) VALUES (
        v_pass.id, p_event_id, v_pass.attendee_id, p_checked_in_by, p_gate_id, 'group_qr',
        CASE WHEN p_scan_operation_id IS NOT NULL THEN format('%s_unit_%s', p_scan_operation_id, i) ELSE NULL END,
        v_now
      );
    END LOOP;
  END IF;

  v_buyer_name := COALESCE(
    CASE WHEN v_has_order THEN v_order.buyer_name ELSE NULL END,
    CASE WHEN v_has_pass THEN v_pass.buyer_name ELSE NULL END,
    'Group Holder'
  );

  RETURN jsonb_build_object(
    'success', true,
    'status', 'GROUP_ADMITTED',
    'admissionId', v_admission_id,
    'groupBookingReference', p_group_booking_ref,
    'admittedCount', v_actual_admit,
    'totalEntitlements', v_total_entitlements,
    'previouslyAdmitted', v_previously_admitted,
    'remainingEntries', v_new_remaining,
    'admittedAt', v_now,
    'buyerName', v_buyer_name,
    'message', format('Entry allowed; remaining entries: %s', v_new_remaining)
  );
END;
$$;
