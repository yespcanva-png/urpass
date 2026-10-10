-- 100: M05 hardening for atomic QR credential reassignment.
-- Keeps one active credential per pass and performs holder rotation in one DB transaction.

CREATE UNIQUE INDEX IF NOT EXISTS idx_digital_qr_credentials_one_active_per_pass
  ON public.digital_qr_credentials(pass_id)
  WHERE status = 'active';

CREATE OR REPLACE FUNCTION public.reassign_ticket_credential_atomic(
  p_booking_id UUID,
  p_pass_id UUID,
  p_current_attendee_id UUID,
  p_new_name TEXT,
  p_new_email TEXT,
  p_new_phone TEXT DEFAULT NULL,
  p_custom_responses JSONB DEFAULT '{}'::jsonb,
  p_actor_email TEXT DEFAULT NULL,
  p_actor_user_id UUID DEFAULT NULL,
  p_organizer_override BOOLEAN DEFAULT FALSE,
  p_reason TEXT DEFAULT NULL,
  p_expected_version INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.ticket_orders%ROWTYPE;
  v_event public.events%ROWTYPE;
  v_pass public.passes%ROWTYPE;
  v_current_attendee public.attendees%ROWTYPE;
  v_active_credential public.digital_qr_credentials%ROWTYPE;
  v_new_attendee_id UUID;
  v_new_token TEXT := encode(gen_random_bytes(32), 'hex');
  v_next_version INTEGER := 1;
  v_actor_email TEXT := lower(trim(coalesce(p_actor_email, '')));
  v_is_buyer BOOLEAN := FALSE;
  v_is_event_manager BOOLEAN := FALSE;
  v_has_check_in BOOLEAN := FALSE;
  v_feature_enabled BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_order
  FROM public.ticket_orders
  WHERE id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'ORDER_NOT_FOUND', 'message', 'Booking order not found.');
  END IF;

  SELECT * INTO v_event
  FROM public.events
  WHERE id = v_order.event_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'EVENT_NOT_FOUND', 'message', 'Event not found.');
  END IF;

  SELECT COALESCE(efs.enabled AND efs.required_config_valid AND pff.platform_available, FALSE)
    INTO v_feature_enabled
  FROM public.event_feature_settings efs
  JOIN public.platform_feature_flags pff ON pff.feature_key = efs.feature_key
  WHERE efs.event_id = v_event.id
    AND efs.feature_key = 'ticket_reassignment';

  IF COALESCE(v_feature_enabled, FALSE) IS NOT TRUE THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'FEATURE_DISABLED',
      'message', 'Ticket reassignment is disabled for this event.'
    );
  END IF;

  v_is_buyer := lower(coalesce(v_order.buyer_email, '')) = v_actor_email;
  v_is_event_manager :=
    COALESCE(p_actor_user_id = v_event.organizer_id, FALSE)
    OR (
      v_event.organization_id IS NOT NULL
      AND p_actor_user_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = v_event.organization_id
          AND om.user_id = p_actor_user_id
          AND om.status = 'active'
          AND om.role IN ('owner', 'admin', 'event_manager')
      )
    );

  IF NOT (v_is_buyer OR v_is_event_manager) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'UNAUTHORIZED',
      'message', 'Only the original ticket purchaser or event organizer can reassign this ticket.'
    );
  END IF;

  SELECT * INTO v_pass
  FROM public.passes
  WHERE id = p_pass_id
    AND event_id = v_event.id
    AND attendee_id = p_current_attendee_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'PASS_NOT_FOUND',
      'message', 'No active pass was found for the current attendee.'
    );
  END IF;

  IF v_pass.status IN ('revoked', 'expired', 'cancelled') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'PASS_NOT_REASSIGNABLE',
      'message', 'This pass is no longer eligible for reassignment.'
    );
  END IF;

  SELECT * INTO v_current_attendee
  FROM public.attendees
  WHERE id = p_current_attendee_id
    AND event_id = v_event.id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'CURRENT_ATTENDEE_NOT_FOUND',
      'message', 'The current ticket holder could not be found.'
    );
  END IF;

  SELECT * INTO v_active_credential
  FROM public.digital_qr_credentials
  WHERE pass_id = v_pass.id
    AND status = 'active'
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.digital_qr_credentials (
      event_id,
      pass_id,
      booking_id,
      attendee_id,
      credential_token,
      status,
      version,
      metadata
    ) VALUES (
      v_event.id,
      v_pass.id,
      p_booking_id,
      p_current_attendee_id,
      v_pass.pass_token,
      'active',
      1,
      jsonb_build_object('created_from_legacy_pass', true)
    )
    RETURNING * INTO v_active_credential;
  END IF;

  IF p_expected_version IS NOT NULL AND v_active_credential.version <> p_expected_version THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'CONCURRENT_MODIFICATION_CONFLICT',
      'message', 'This ticket was modified by another transaction. Please refresh and try again.'
    );
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.check_ins ci
    WHERE ci.pass_id = v_pass.id
    LIMIT 1
  ) OR v_pass.status = 'checked_in'
  INTO v_has_check_in;

  IF v_has_check_in AND (p_organizer_override IS NOT TRUE OR v_is_event_manager IS NOT TRUE) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'CHECKED_IN_CANNOT_BE_REASSIGNED',
      'message', 'Tickets with recorded check-in attendance require organizer exception approval.'
    );
  END IF;

  INSERT INTO public.attendees (
    event_id,
    name,
    email,
    phone,
    pass_type,
    application_status,
    pass_status,
    custom_responses
  ) VALUES (
    v_event.id,
    trim(p_new_name),
    lower(trim(p_new_email)),
    nullif(trim(coalesce(p_new_phone, '')), ''),
    v_pass.pass_type,
    'approved',
    'generated',
    coalesce(p_custom_responses, '{}'::jsonb)
  )
  RETURNING id INTO v_new_attendee_id;

  UPDATE public.attendees
  SET pass_status = 'revoked',
      updated_at = now()
  WHERE id = p_current_attendee_id;

  UPDATE public.digital_qr_credentials
  SET status = 'revoked',
      revoked_at = now(),
      revocation_reason = coalesce(p_reason, 'Holder reassignment'),
      updated_at = now()
  WHERE id = v_active_credential.id;

  v_next_version := v_active_credential.version + 1;

  UPDATE public.passes
  SET attendee_id = v_new_attendee_id,
      pass_token = v_new_token,
      status = 'generated',
      updated_at = now()
  WHERE id = v_pass.id;

  INSERT INTO public.digital_qr_credentials (
    event_id,
    pass_id,
    booking_id,
    attendee_id,
    credential_token,
    status,
    version,
    metadata
  ) VALUES (
    v_event.id,
    v_pass.id,
    p_booking_id,
    v_new_attendee_id,
    v_new_token,
    'active',
    v_next_version,
    jsonb_build_object(
      'reassigned_from_attendee_id', p_current_attendee_id,
      'actor_email', v_actor_email
    )
  );

  INSERT INTO public.ticket_reassignment_logs (
    event_id,
    booking_id,
    ticket_id,
    from_attendee_id,
    from_name,
    from_email,
    to_attendee_id,
    to_name,
    to_email,
    actor_email,
    reason,
    revoked_credential_token,
    new_credential_token
  ) VALUES (
    v_event.id,
    p_booking_id,
    v_pass.id,
    p_current_attendee_id,
    v_current_attendee.name,
    v_current_attendee.email,
    v_new_attendee_id,
    trim(p_new_name),
    lower(trim(p_new_email)),
    v_actor_email,
    coalesce(p_reason, 'Holder reassignment'),
    v_active_credential.credential_token,
    v_new_token
  );

  RETURN jsonb_build_object(
    'success', true,
    'booking_id', p_booking_id,
    'ticket_id', v_pass.id,
    'previous_attendee_id', p_current_attendee_id,
    'new_attendee_id', v_new_attendee_id,
    'revoked_credential_id', v_active_credential.credential_token,
    'new_credential_id', v_new_token,
    'new_pass_token', v_new_token,
    'message', 'Ticket successfully reassigned. Old QR credential revoked.'
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'DUPLICATE_ATTENDEE_OR_CREDENTIAL',
      'message', 'The replacement attendee or credential already exists for this event.'
    );
END;
$$;
