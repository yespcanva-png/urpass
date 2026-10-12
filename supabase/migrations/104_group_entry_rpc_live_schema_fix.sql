-- Fix Group QR admission RPC for production schemas where passes.order_id does not exist.
-- The relationship is resolved through ticket_orders.group_qr_code or ticket_orders.attendee_id.

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

  SELECT id, event_id, buyer_name, buyer_email, status, attendee_id,
         COALESCE(total_attendee_count, total_entitlements, 1) as total_units,
         COALESCE(admitted_entitlements, 0) as used_units,
         group_entry_enabled, group_entry_mode, group_qr_code
  INTO v_order
  FROM public.ticket_orders
  WHERE event_id = p_event_id
    AND (
      group_qr_code = p_group_booking_ref
      OR id::text = p_group_booking_ref
      OR razorpay_order_id = p_group_booking_ref
    )
  FOR UPDATE;
  v_has_order := FOUND;

  IF v_has_order THEN
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
    WHERE p.event_id = p_event_id
      AND (
        (v_order.group_qr_code IS NOT NULL AND p.pass_token = v_order.group_qr_code)
        OR (v_order.attendee_id IS NOT NULL AND p.attendee_id = v_order.attendee_id)
      )
    FOR UPDATE OF p;
    v_has_pass := FOUND;
  END IF;

  IF NOT v_has_pass THEN
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

  IF NOT v_has_order AND v_has_pass THEN
    SELECT id, event_id, buyer_name, buyer_email, status, attendee_id,
           COALESCE(total_attendee_count, total_entitlements, 1) as total_units,
           COALESCE(admitted_entitlements, 0) as used_units,
           group_entry_enabled, group_entry_mode, group_qr_code
    INTO v_order
    FROM public.ticket_orders
    WHERE event_id = p_event_id
      AND (
        group_qr_code = v_pass.pass_token
        OR attendee_id = v_pass.attendee_id
      )
    FOR UPDATE;
    v_has_order := FOUND;
  END IF;

  IF NOT v_has_order AND NOT v_has_pass THEN
    RETURN jsonb_build_object('success', false, 'status', 'BOOKING_NOT_FOUND', 'error', 'Group booking or pass reference not found for this event.');
  END IF;

  IF v_has_order AND v_order.status IN ('refunded', 'cancelled', 'failed') THEN
    RETURN jsonb_build_object('success', false, 'status', 'BOOKING_INVALID', 'error', format('Booking is %s. Admission denied.', upper(v_order.status)));
  END IF;

  IF v_has_pass AND v_pass.status IN ('revoked', 'cancelled', 'refunded', 'expired') THEN
    RETURN jsonb_build_object('success', false, 'status', 'BOOKING_INVALID', 'error', format('Group pass is %s. Admission denied.', upper(v_pass.status)));
  END IF;

  v_is_explicit_group :=
    (v_has_order AND COALESCE(v_order.group_entry_enabled, false) AND v_order.group_qr_code IS NOT NULL)
    OR (v_has_pass AND (
      COALESCE(v_pass.is_group_master, false)
      OR COALESCE(v_pass.is_group_pass, false)
      OR COALESCE(v_pass.is_group_ticket_type, false)
      OR COALESCE(v_pass.custom_responses->>'is_single_group_qr', 'false') IN ('true', 't', '1')
      OR COALESCE(v_pass.custom_responses->>'credential_type', '') = 'GROUP_QR'
      OR COALESCE(v_pass.custom_responses->>'credentialType', '') = 'GROUP_QR'
    ))
    OR p_group_booking_ref ~* '^(URP-GRP-|GRP-|GROUP-)';

  IF NOT v_is_explicit_group THEN
    RETURN jsonb_build_object('success', false, 'status', 'NOT_GROUP_PASS', 'error', 'Scanned credential is not an authoritative group QR.');
  END IF;

  v_total_entitlements := GREATEST(
    CASE WHEN v_has_order THEN COALESCE(v_order.total_units, 1) ELSE 1 END,
    CASE WHEN v_has_pass THEN COALESCE(v_pass.total_units, 1) ELSE 1 END
  );
  v_previously_admitted := GREATEST(
    CASE WHEN v_has_order THEN COALESCE(v_order.used_units, 0) ELSE 0 END,
    CASE WHEN v_has_pass THEN COALESCE(v_pass.used_units, 0) ELSE 0 END
  );
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

  IF v_has_order THEN
    UPDATE public.ticket_orders
    SET admitted_entitlements = v_previously_admitted + p_quantity,
        total_entitlements = v_total_entitlements,
        group_entry_enabled = true,
        group_qr_code = COALESCE(group_qr_code, CASE WHEN v_has_pass THEN v_pass.pass_token ELSE NULL END),
        updated_at = v_now
    WHERE id = v_order.id;
  END IF;

  IF v_has_pass THEN
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
    p_event_id,
    CASE WHEN v_has_order THEN v_order.id ELSE NULL END,
    CASE WHEN v_has_pass THEN v_pass.id ELSE NULL END,
    p_group_booking_ref,
    p_gate_id,
    p_quantity,
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

  IF v_has_pass AND v_pass.attendee_id IS NOT NULL THEN
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
    'buyerName', COALESCE(
      CASE WHEN v_has_order THEN v_order.buyer_name ELSE NULL END,
      CASE WHEN v_has_pass THEN v_pass.buyer_name ELSE NULL END,
      'Group Holder'
    ),
    'message', format('Successfully admitted %s attendee(s). %s entitlement(s) remaining.', p_quantity, v_new_remaining)
  );
END;
$$;
