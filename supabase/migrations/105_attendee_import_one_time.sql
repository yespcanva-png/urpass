-- Migration 105: One-time CSV attendee imports with atomic attendee + pass creation

CREATE TABLE IF NOT EXISTS public.attendee_import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'csv' CHECK (source = 'csv'),
  idempotency_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'previewed' CHECK (status IN ('previewed', 'processing', 'completed', 'failed')),
  total_rows INT NOT NULL DEFAULT 0,
  valid_rows INT NOT NULL DEFAULT 0,
  invalid_rows INT NOT NULL DEFAULT 0,
  duplicate_rows INT NOT NULL DEFAULT 0,
  imported_rows INT NOT NULL DEFAULT 0,
  failed_rows INT NOT NULL DEFAULT 0,
  report JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT attendee_import_batches_event_key UNIQUE (event_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_attendee_import_batches_event_created
  ON public.attendee_import_batches(event_id, created_at DESC);

ALTER TABLE public.attendee_import_batches ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'attendee_import_batches'
      AND policyname = 'Organizers manage attendee import batches'
  ) THEN
    CREATE POLICY "Organizers manage attendee import batches"
      ON public.attendee_import_batches
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = attendee_import_batches.event_id
            AND (
              public.events.organizer_id = auth.uid()
              OR (
                public.events.organization_id IS NOT NULL
                AND EXISTS (
                  SELECT 1 FROM public.organization_members
                  WHERE organization_members.organization_id = public.events.organization_id
                    AND organization_members.user_id = auth.uid()
                    AND organization_members.status = 'active'
                    AND organization_members.role IN ('owner', 'admin', 'event_manager')
                )
              )
            )
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'attendee_import_batches'
      AND policyname = 'Service role full access to attendee import batches'
  ) THEN
    CREATE POLICY "Service role full access to attendee import batches"
      ON public.attendee_import_batches
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.import_attendee_with_pass(
  p_event_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_pass_type TEXT DEFAULT 'participant',
  p_ticket_type_id UUID DEFAULT NULL,
  p_custom_responses JSONB DEFAULT '{}'::jsonb,
  p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event RECORD;
  v_ticket RECORD;
  v_existing_attendee RECORD;
  v_existing_pass RECORD;
  v_approved_count INT;
  v_ticket_count INT;
  v_attendee_id UUID;
  v_pass_token TEXT;
  v_import_key TEXT;
BEGIN
  IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
    RETURN jsonb_build_object('status', 'FAILED', 'error', 'Missing import idempotency key.');
  END IF;

  v_import_key := trim(p_idempotency_key);

  SELECT id, attendee_limit, status, application_enabled
    INTO v_event
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'FAILED', 'error', 'Event not found.');
  END IF;

  IF v_event.status <> 'active' THEN
    RETURN jsonb_build_object('status', 'FAILED', 'error', 'Event is not active.');
  END IF;

  SELECT a.id, p.pass_token
    INTO v_existing_attendee
  FROM public.attendees a
  LEFT JOIN public.passes p ON p.attendee_id = a.id AND p.event_id = a.event_id
  WHERE a.event_id = p_event_id
    AND a.custom_responses ->> 'import_operation_id' = v_import_key
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'status', 'IMPORTED',
      'idempotent', true,
      'attendee_id', v_existing_attendee.id,
      'pass_token', v_existing_attendee.pass_token
    );
  END IF;

  SELECT a.id, p.pass_token
    INTO v_existing_attendee
  FROM public.attendees a
  LEFT JOIN public.passes p ON p.attendee_id = a.id AND p.event_id = a.event_id
  WHERE a.event_id = p_event_id
    AND lower(a.email) = lower(trim(p_email))
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'status', 'DUPLICATE',
      'error', 'An attendee with this email already exists for this event.',
      'attendee_id', v_existing_attendee.id,
      'pass_token', v_existing_attendee.pass_token
    );
  END IF;

  SELECT count(*) INTO v_approved_count
  FROM public.attendees
  WHERE event_id = p_event_id
    AND application_status = 'approved';

  IF v_approved_count >= v_event.attendee_limit THEN
    RETURN jsonb_build_object('status', 'FAILED', 'error', 'Event capacity has been reached.');
  END IF;

  IF p_ticket_type_id IS NOT NULL THEN
    SELECT id, name, price, capacity, status, sales_start, sales_end
      INTO v_ticket
    FROM public.ticket_types
    WHERE id = p_ticket_type_id
      AND event_id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('status', 'FAILED', 'error', 'Selected ticket type was not found.');
    END IF;

    IF v_ticket.status <> 'on_sale' THEN
      RETURN jsonb_build_object('status', 'FAILED', 'error', 'Selected ticket type is not on sale.');
    END IF;

    IF v_ticket.sales_start IS NOT NULL AND v_ticket.sales_start > now() THEN
      RETURN jsonb_build_object('status', 'FAILED', 'error', 'Selected ticket type sales have not started.');
    END IF;

    IF v_ticket.sales_end IS NOT NULL AND v_ticket.sales_end < now() THEN
      RETURN jsonb_build_object('status', 'FAILED', 'error', 'Selected ticket type sales have ended.');
    END IF;

    IF COALESCE(v_ticket.price, 0) > 0 THEN
      RETURN jsonb_build_object('status', 'FAILED', 'error', 'Paid ticket types require verified payment and cannot be bulk imported as paid attendees.');
    END IF;

    IF v_ticket.capacity IS NOT NULL THEN
      SELECT count(*) INTO v_ticket_count
      FROM public.attendees
      WHERE event_id = p_event_id
        AND ticket_type_id = p_ticket_type_id
        AND application_status <> 'rejected';

      IF v_ticket_count >= v_ticket.capacity THEN
        RETURN jsonb_build_object('status', 'FAILED', 'error', 'Selected ticket type is sold out.');
      END IF;
    END IF;
  END IF;

  INSERT INTO public.attendees (
    event_id,
    name,
    email,
    phone,
    pass_type,
    application_status,
    pass_status,
    ticket_type_id,
    custom_responses
  )
  VALUES (
    p_event_id,
    trim(p_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_phone, '')), ''),
    coalesce(nullif(trim(p_pass_type), ''), 'participant'),
    'approved',
    'not_generated',
    p_ticket_type_id,
    coalesce(p_custom_responses, '{}'::jsonb) || jsonb_build_object(
      'imported_from', 'attendee_import',
      'import_operation_id', v_import_key
    )
  )
  RETURNING id INTO v_attendee_id;

  INSERT INTO public.passes (
    event_id,
    attendee_id,
    pass_type,
    ticket_type_id
  )
  VALUES (
    p_event_id,
    v_attendee_id,
    coalesce(nullif(trim(p_pass_type), ''), 'participant'),
    p_ticket_type_id
  )
  RETURNING pass_token INTO v_pass_token;

  UPDATE public.attendees
  SET pass_status = 'generated'
  WHERE id = v_attendee_id;

  RETURN jsonb_build_object(
    'status', 'IMPORTED',
    'attendee_id', v_attendee_id,
    'pass_token', v_pass_token
  );
EXCEPTION
  WHEN unique_violation THEN
    SELECT a.id, p.pass_token
      INTO v_existing_attendee
    FROM public.attendees a
    LEFT JOIN public.passes p ON p.attendee_id = a.id AND p.event_id = a.event_id
    WHERE a.event_id = p_event_id
      AND lower(a.email) = lower(trim(p_email))
    LIMIT 1;

    RETURN jsonb_build_object(
      'status', 'DUPLICATE',
      'error', 'An attendee with this email already exists for this event.',
      'attendee_id', v_existing_attendee.id,
      'pass_token', v_existing_attendee.pass_token
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object('status', 'FAILED', 'error', SQLERRM);
END;
$$;
