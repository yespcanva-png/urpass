-- ============================================================
-- Migration 080: P0 Critical Fixes
--
-- 1. Webhook Idempotency (processed_webhook_events)
-- 2. Extended pass statuses (revoked, expired, cancelled, active)
-- 3. Invalidate check-in for cancelled events and revoked passes
-- 4. Ticket order refund tracking columns
-- 5. Ops Authentication Audit Log
-- ============================================================

-- ── 1. Webhook Idempotency Table ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'razorpay',
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' 
    CHECK (status IN ('processing', 'completed', 'failed')),
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  CONSTRAINT uq_webhook_provider_event UNIQUE (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_processed_webhooks_event 
  ON public.processed_webhook_events (provider, event_id);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_received 
  ON public.processed_webhook_events (received_at);

-- Enable RLS (Service role access only)
ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_processed_webhooks_all" ON public.processed_webhook_events
  FOR ALL USING (auth.role() = 'service_role');

-- ── 2. Pass Lifecycle Status Constraint Expansion ────────────
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
    'revoked',
    'expired',
    'cancelled'
  ));

CREATE INDEX IF NOT EXISTS idx_passes_event_status 
  ON public.passes (event_id, status);

-- Attendee Pass Lifecycle & Recovery Status
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
    'revoked',
    'expired',
    'cancelled'
  ));

ALTER TABLE public.attendees
  ADD COLUMN IF NOT EXISTS pass_error_details TEXT,
  ADD COLUMN IF NOT EXISTS pass_retry_count INT DEFAULT 0;

-- ── 3. Ticket Orders Refund Tracking Columns & Status Check ───
ALTER TABLE public.ticket_orders
  DROP CONSTRAINT IF EXISTS ticket_orders_status_check;

ALTER TABLE public.ticket_orders
  ADD CONSTRAINT ticket_orders_status_check
  CHECK (status IN ('created', 'paid', 'failed', 'refunded'));

ALTER TABLE public.ticket_orders
  ADD COLUMN IF NOT EXISTS refund_id TEXT,
  ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none'
    CHECK (refund_status IN ('none', 'pending', 'processed', 'failed')),
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refund_amount INT,
  ADD COLUMN IF NOT EXISTS refund_reason TEXT;

-- ── 3B. Guest / Attendee Invoices & Credit Notes Support ──────
-- Allow invoices & credit notes for guest attendee purchases without auth.users accounts
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'user_id' AND is_nullable = 'NO') THEN
    ALTER TABLE public.invoices ALTER COLUMN user_id DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_notes' AND column_name = 'user_id' AND is_nullable = 'NO') THEN
    ALTER TABLE public.credit_notes ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL;

ALTER TABLE public.credit_notes
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- ── 4. Ops PIN Authentication Audit Log ──────────────────────
CREATE TABLE IF NOT EXISTS public.ops_auth_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  details JSONB DEFAULT '{}'::JSONB,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ops_auth_audit_ip_time 
  ON public.ops_auth_audit (ip_address, attempted_at);

-- ── 5. Hardened Atomic Check-in Pass Procedure ───────────────
-- Verifies pass status, event status, gate zone access, and duplicates
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
  v_event_status TEXT;
BEGIN
  -- 0. Verify Event Status (Cancelled or Inactive events strictly block scanning)
  SELECT status INTO v_event_status
  FROM public.events
  WHERE id = p_event_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'status', 'INVALID',
      'error', 'Event does not exist',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  IF v_event_status != 'active' THEN
    RETURN jsonb_build_object(
      'status', 'EVENT_INACTIVE',
      'eventStatus', v_event_status,
      'error', 'Check-in is blocked: Event is ' || upper(v_event_status),
      'scanOperationId', p_scan_operation_id
    );
  END IF;

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

  -- 3. Verify Pass Lifecycle Status (REVOKED / CANCELLED / EXPIRED)
  IF v_pass_status = 'revoked' THEN
    RETURN jsonb_build_object(
      'status', 'REVOKED',
      'error', 'Pass has been revoked by the organizer',
      'passType', v_pass_type,
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  IF v_pass_status = 'cancelled' THEN
    RETURN jsonb_build_object(
      'status', 'CANCELLED',
      'error', 'Ticket has been cancelled or refunded',
      'passType', v_pass_type,
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  IF v_pass_status = 'expired' THEN
    RETURN jsonb_build_object(
      'status', 'EXPIRED',
      'error', 'Pass has expired',
      'passType', v_pass_type,
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 4. Gate Zone Access Verification
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

  -- 5. Check if already checked in
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

  -- 6. Check attendee application approval status
  IF v_att_app_status != 'approved' THEN
    RETURN jsonb_build_object(
      'status', 'NOT_APPROVED',
      'error', 'Attendee is not approved for this event (' || v_att_app_status || ')',
      'scanOperationId', p_scan_operation_id
    );
  END IF;

  -- 7. Atomic check-in insertion
  v_new_ci_at := NOW();
  INSERT INTO public.check_ins (
    pass_id,
    event_id,
    attendee_id,
    checked_in_by,
    gate_id,
    check_in_method,
    checked_in_at,
    scan_operation_id
  ) VALUES (
    v_pass_id,
    p_event_id,
    v_attendee_id,
    p_checked_in_by,
    p_gate_id,
    p_check_in_method,
    v_new_ci_at,
    p_scan_operation_id
  ) RETURNING id INTO v_new_ci_id;

  -- 8. Transition pass and attendee to checked_in
  UPDATE public.passes
  SET status = 'checked_in', updated_at = v_new_ci_at
  WHERE id = v_pass_id;

  UPDATE public.attendees
  SET pass_status = 'checked_in', updated_at = v_new_ci_at
  WHERE id = v_attendee_id;

  RETURN jsonb_build_object(
    'status', 'CHECKED_IN',
    'success', true,
    'checkedInAt', v_new_ci_at,
    'checkInId', v_new_ci_id,
    'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
    'passType', v_pass_type,
    'scanOperationId', p_scan_operation_id
  );
END;
$$;
