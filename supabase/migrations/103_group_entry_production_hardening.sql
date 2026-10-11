-- ============================================================
-- Migration 103: Group QR Partial Entry Production Hardening
-- Fixes:
-- 1. Do not classify credentials as group QR solely from total_guests > 1.
-- 2. Allow one check_ins row per admitted group entitlement.
-- 3. Keep group admission writes transaction-safe and idempotent.
-- ============================================================

ALTER TABLE public.check_ins
  DROP CONSTRAINT IF EXISTS check_ins_pass_id_unique;

ALTER TABLE public.passes
  DROP CONSTRAINT IF EXISTS passes_status_check;

ALTER TABLE public.passes
  ADD CONSTRAINT passes_status_check
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

ALTER TABLE public.attendees
  DROP CONSTRAINT IF EXISTS attendees_pass_status_check;

ALTER TABLE public.attendees
  ADD CONSTRAINT attendees_pass_status_check
  CHECK (pass_status IN (
    'not_generated',
    'pending_retry',
    'failed',
    'generated',
    'active',
    'checked_in',
    'checked_out',
    'partially_checked_in',
    'revoked',
    'expired',
    'cancelled'
  ));

CREATE INDEX IF NOT EXISTS idx_check_ins_group_qr_units
  ON public.check_ins(event_id, pass_id, check_in_method, checked_in_at);

ALTER TABLE public.group_entry_admissions
  DROP CONSTRAINT IF EXISTS group_entry_admissions_admitted_count_check;

ALTER TABLE public.group_entry_admissions
  ADD CONSTRAINT group_entry_admissions_admitted_count_check
  CHECK (admitted_count <> 0);

ALTER TABLE public.group_entry_admissions
  DROP CONSTRAINT IF EXISTS group_entry_admissions_entry_mode_check;

ALTER TABLE public.group_entry_admissions
  ADD CONSTRAINT group_entry_admissions_entry_mode_check
  CHECK (entry_mode IN ('count_only', 'identified', 'supervisor_correction'));

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
  v_is_group_master BOOLEAN;
  v_is_group_pass BOOLEAN;
  v_total_guests INT;
  v_checked_in_guests INT;
  v_custom_responses JSONB;
  v_is_group_ticket_type BOOLEAN;
  v_group_total INT;
  v_group_remaining INT;
BEGIN
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

  SELECT p.id, p.attendee_id, p.ticket_type_id, p.pass_type, p.status,
         COALESCE(p.is_group_master, false),
         COALESCE(p.is_group_pass, false),
         COALESCE(p.total_guests, 1),
         COALESCE(p.checked_in_guests, 0),
         a.name, a.email, a.application_status, a.pass_status, a.custom_responses,
         COALESCE(tt.is_group_pass, false)
  INTO v_pass_id, v_attendee_id, v_ticket_type_id, v_pass_type, v_pass_status,
       v_is_group_master, v_is_group_pass, v_total_guests, v_checked_in_guests,
       v_att_name, v_att_email, v_att_app_status, v_att_pass_status, v_custom_responses,
       v_is_group_ticket_type
  FROM public.passes p
  JOIN public.attendees a ON a.id = p.attendee_id
  LEFT JOIN public.ticket_types tt ON tt.id = p.ticket_type_id
  WHERE (p.pass_token = p_pass_token OR p.id::text = p_pass_token)
    AND p.event_id = p_event_id
  FOR UPDATE OF p;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'INVALID', 'error', 'Invalid pass — not found for this event', 'scanOperationId', p_scan_operation_id);
  END IF;

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

  IF v_pass_status IN ('revoked', 'cancelled', 'refunded', 'expired') THEN
    RETURN jsonb_build_object(
      'status', upper(v_pass_status),
      'success', false,
      'accessDenied', true,
      'error', format('Pass is %s. Entry denied.', upper(v_pass_status)),
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  IF (
    v_is_group_master
    OR v_is_group_pass
    OR v_is_group_ticket_type
    OR COALESCE(v_custom_responses->>'is_single_group_qr', 'false') IN ('true', 't', '1')
    OR COALESCE(v_custom_responses->>'credential_type', '') = 'GROUP_QR'
    OR COALESCE(v_custom_responses->>'credentialType', '') = 'GROUP_QR'
  ) THEN
    v_group_total := GREATEST(
      v_total_guests,
      COALESCE(NULLIF(regexp_replace(COALESCE(v_custom_responses->>'group_attendee_count', '0'), '[^0-9]', '', 'g'), '')::int, 0),
      COALESCE(NULLIF(regexp_replace(COALESCE(v_custom_responses->>'bulk_quantity', '0'), '[^0-9]', '', 'g'), '')::int, 0),
      COALESCE(NULLIF(regexp_replace(COALESCE(v_custom_responses->>'guest_count', '0'), '[^0-9]', '', 'g'), '')::int, 0),
      1
    );
    v_group_remaining := GREATEST(0, v_group_total - v_checked_in_guests);

    IF v_is_group_master IS NOT TRUE OR v_total_guests <> v_group_total THEN
      UPDATE public.passes
      SET is_group_master = true, total_guests = v_group_total
      WHERE id = v_pass_id;
    END IF;

    IF v_group_remaining <= 0 OR v_pass_status = 'checked_in' THEN
      RETURN jsonb_build_object(
        'status', 'EXHAUSTED',
        'isGroupQR', true,
        'alreadyCheckedIn', true,
        'bookingReference', p_pass_token,
        'totalEntitlements', v_group_total,
        'previouslyAdmitted', v_checked_in_guests,
        'remainingEntries', 0,
        'error', format('All %s group pass entry entitlements have already been admitted.', v_group_total),
        'message', format('All %s group pass entry entitlements have already been admitted.', v_group_total),
        'scanOperationId', p_scan_operation_id
      );
    END IF;

    RETURN jsonb_build_object(
      'status', 'GROUP_PASS_DETECTED',
      'success', true,
      'isGroupQR', true,
      'bookingReference', p_pass_token,
      'buyerName', v_att_name,
      'buyerEmail', v_att_email,
      'ticketCategory', v_pass_type,
      'totalEntitlements', v_group_total,
      'previouslyAdmitted', v_checked_in_guests,
      'remainingEntries', v_group_remaining,
      'message', 'Single Group QR pass detected. How many people are entering now?',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  IF v_pass_status = 'checked_in' OR v_att_pass_status = 'checked_in' THEN
    SELECT checked_in_at INTO v_existing_ci_at
    FROM public.check_ins
    WHERE pass_id = v_pass_id
    ORDER BY checked_in_at DESC
    LIMIT 1;

    RETURN jsonb_build_object(
      'status', 'ALREADY_CHECKED_IN',
      'alreadyCheckedIn', true,
      'checkedInAt', COALESCE(v_existing_ci_at, NOW()),
      'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
      'passType', v_pass_type,
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  v_new_ci_at := NOW();

  UPDATE public.passes
  SET status = 'checked_in', updated_at = v_new_ci_at
  WHERE id = v_pass_id;

  UPDATE public.attendees
  SET pass_status = 'checked_in', venue_presence_state = 'inside', last_scanned_at = v_new_ci_at, updated_at = v_new_ci_at
  WHERE id = v_attendee_id;

  INSERT INTO public.check_ins (
    pass_id, event_id, attendee_id, checked_in_by, gate_id, check_in_method, scan_operation_id, checked_in_at
  ) VALUES (
    v_pass_id, p_event_id, v_attendee_id, p_checked_in_by, p_gate_id, p_check_in_method, p_scan_operation_id, v_new_ci_at
  ) RETURNING id INTO v_new_ci_id;

  RETURN jsonb_build_object(
    'status', 'CHECKED_IN',
    'success', true,
    'checkedInAt', v_new_ci_at,
    'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
    'passType', v_pass_type,
    'checkInId', v_new_ci_id,
    'scanOperationId', p_scan_operation_id
  );
END;
$$;

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
  v_total_entitlements INT;
  v_previously_admitted INT;
  v_remaining INT;
  v_new_remaining INT;
  v_admission_id UUID;
  v_now TIMESTAMPTZ := now();
  v_existing_admission RECORD;
  v_is_explicit_group BOOLEAN := false;
  i INT;
BEGIN
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
        'message', format('Already admitted %s attendee(s). %s remaining.', v_existing_admission.admitted_count, v_existing_admission.remaining_after)
      );
    END IF;
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RETURN jsonb_build_object('success', false, 'status', 'INVALID_QUANTITY', 'error', 'Quantity to admit must be at least 1.');
  END IF;

  SELECT id, event_id, buyer_name, buyer_email, status,
         COALESCE(total_attendee_count, total_entitlements, 1) as total_units,
         COALESCE(admitted_entitlements, 0) as used_units,
         group_entry_enabled, group_entry_mode, group_qr_code
  INTO v_order
  FROM public.ticket_orders
  WHERE (
    group_qr_code = p_group_booking_ref
    OR (
      p_group_booking_ref ~* '^(URP-GRP-|GRP-|GROUP-)'
      AND id::text = p_group_booking_ref
    )
    OR id IN (
      SELECT order_id FROM public.passes
      WHERE (pass_token = p_group_booking_ref OR id::text = p_group_booking_ref)
        AND order_id IS NOT NULL
    )
  ) AND event_id = p_event_id
  FOR UPDATE;

  IF FOUND THEN
    v_is_explicit_group := COALESCE(v_order.group_entry_enabled, false)
      AND (v_order.group_qr_code = p_group_booking_ref OR p_group_booking_ref ~* '^(URP-GRP-|GRP-|GROUP-)');
  END IF;

  IF NOT FOUND THEN
    SELECT p.id, p.event_id, p.attendee_id, p.status,
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

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'status', 'BOOKING_NOT_FOUND', 'error', 'Group booking or pass reference not found for this event.');
    END IF;

    v_is_explicit_group := COALESCE(v_pass.is_group_master, false)
      OR COALESCE(v_pass.is_group_pass, false)
      OR COALESCE(v_pass.is_group_ticket_type, false)
      OR COALESCE(v_pass.custom_responses->>'is_single_group_qr', 'false') IN ('true', 't', '1')
      OR COALESCE(v_pass.custom_responses->>'credential_type', '') = 'GROUP_QR'
      OR COALESCE(v_pass.custom_responses->>'credentialType', '') = 'GROUP_QR'
      OR p_group_booking_ref ~* '^(URP-GRP-|GRP-|GROUP-)';

    IF v_pass.status IN ('revoked', 'cancelled', 'refunded', 'expired') THEN
      RETURN jsonb_build_object('success', false, 'status', 'BOOKING_INVALID', 'error', format('Group pass is %s. Admission denied.', upper(v_pass.status)));
    END IF;

    v_total_entitlements := v_pass.total_units;
    v_previously_admitted := v_pass.used_units;
  ELSE
    IF v_order.status IN ('refunded', 'cancelled', 'failed') THEN
      RETURN jsonb_build_object('success', false, 'status', 'BOOKING_INVALID', 'error', format('Booking is %s. Admission denied.', upper(v_order.status)));
    END IF;

    v_total_entitlements := v_order.total_units;
    v_previously_admitted := v_order.used_units;
  END IF;

  IF NOT v_is_explicit_group THEN
    RETURN jsonb_build_object('success', false, 'status', 'NOT_GROUP_PASS', 'error', 'Scanned credential is not an authoritative group QR.');
  END IF;

  v_remaining := v_total_entitlements - v_previously_admitted;

  IF v_remaining <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'EXHAUSTED',
      'error', 'All group entitlements have already been admitted.',
      'totalEntitlements', v_total_entitlements,
      'previouslyAdmitted', v_previously_admitted,
      'remainingEntries', 0
    );
  END IF;

  IF p_quantity > v_remaining THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'EXCEEDS_REMAINING',
      'error', format('Requested %s admissions, but only %s entitlement(s) remain.', p_quantity, v_remaining),
      'totalEntitlements', v_total_entitlements,
      'previouslyAdmitted', v_previously_admitted,
      'remainingEntries', v_remaining
    );
  END IF;

  v_new_remaining := v_remaining - p_quantity;

  IF v_order.id IS NOT NULL THEN
    UPDATE public.ticket_orders
    SET admitted_entitlements = v_previously_admitted + p_quantity,
        updated_at = v_now
    WHERE id = v_order.id;
  END IF;

  IF v_pass.id IS NOT NULL THEN
    UPDATE public.passes
    SET checked_in_guests = v_previously_admitted + p_quantity,
        total_guests = v_total_entitlements,
        is_group_master = true,
        status = CASE WHEN v_new_remaining = 0 THEN 'checked_in' ELSE 'partially_checked_in' END,
        updated_at = v_now
    WHERE id = v_pass.id;
  END IF;

  INSERT INTO public.group_entry_admissions (
    event_id, order_id, pass_id, group_booking_reference, gate_id, admitted_count,
    total_entitlements, previously_admitted, remaining_after, entry_mode,
    admitted_members, scanner_operator_id, operator_email, device_id,
    scan_operation_id, admitted_at
  ) VALUES (
    p_event_id, v_order.id, v_pass.id, p_group_booking_ref, p_gate_id, p_quantity,
    v_total_entitlements, v_previously_admitted, v_new_remaining, p_entry_mode,
    p_admitted_members, p_checked_in_by, p_operator_email, p_device_id,
    p_scan_operation_id, v_now
  ) RETURNING id INTO v_admission_id;

  IF v_pass.attendee_id IS NOT NULL THEN
    UPDATE public.attendees
    SET pass_status = 'checked_in',
        venue_presence_state = 'inside',
        last_scanned_at = v_now,
        updated_at = v_now
    WHERE id = v_pass.attendee_id;

    FOR i IN 1..p_quantity LOOP
      INSERT INTO public.check_ins (
        pass_id, event_id, attendee_id, checked_in_by, gate_id, check_in_method, scan_operation_id, checked_in_at
      ) VALUES (
        v_pass.id, p_event_id, v_pass.attendee_id, p_checked_in_by, p_gate_id, 'group_qr',
        CASE WHEN p_scan_operation_id IS NOT NULL THEN format('%s_unit_%s', p_scan_operation_id, i) ELSE NULL END,
        v_now
      );
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'status', 'GROUP_ADMITTED',
    'admissionId', v_admission_id,
    'groupBookingReference', p_group_booking_ref,
    'admittedCount', p_quantity,
    'totalEntitlements', v_total_entitlements,
    'previouslyAdmitted', v_previously_admitted,
    'remainingEntries', v_new_remaining,
    'admittedAt', v_now,
    'buyerName', COALESCE(v_order.buyer_name, v_pass.buyer_name, 'Group Holder'),
    'message', format('Successfully admitted %s attendee(s). %s entitlement(s) remaining.', p_quantity, v_new_remaining)
  );
END;
$$;
