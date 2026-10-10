-- ============================================================
-- Migration 101: Module M14 — Bulk Group QR Entry & Partial Check-In
-- Supports:
-- 1. Group booking admissions ledger with row-level locking
-- 2. Partial check-in (e.g. 6 of 10 people, then 4 remaining)
-- 3. Atomic RPC stored procedure preventing concurrent over-admission
-- 4. Audit logs recording gate, operator, timestamp, and admitted count
-- 5. Platform feature flag registration for group_entry
-- ============================================================

-- ── 1. Group Entry Admissions Ledger Table ────────────────────
CREATE TABLE IF NOT EXISTS public.group_entry_admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  pass_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
  group_booking_reference TEXT NOT NULL,
  gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  admitted_count INT NOT NULL CHECK (admitted_count > 0),
  total_entitlements INT NOT NULL CHECK (total_entitlements > 0),
  previously_admitted INT NOT NULL CHECK (previously_admitted >= 0),
  remaining_after INT NOT NULL CHECK (remaining_after >= 0),
  entry_mode TEXT NOT NULL DEFAULT 'count_only' CHECK (entry_mode IN ('count_only', 'identified')),
  admitted_members JSONB DEFAULT '[]'::jsonb,
  scanner_operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  operator_email TEXT,
  device_id TEXT,
  scan_operation_id TEXT UNIQUE,
  admitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_group_entry_event ON public.group_entry_admissions(event_id, admitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_entry_order ON public.group_entry_admissions(order_id);
CREATE INDEX IF NOT EXISTS idx_group_entry_ref ON public.group_entry_admissions(group_booking_reference);
CREATE INDEX IF NOT EXISTS idx_group_entry_scan_op ON public.group_entry_admissions(scan_operation_id);

-- ── 2. Add Group Entry Columns to ticket_orders & passes ───────
ALTER TABLE public.ticket_orders
  ADD COLUMN IF NOT EXISTS group_qr_code TEXT,
  ADD COLUMN IF NOT EXISTS group_entry_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS group_entry_mode TEXT DEFAULT 'count_only' CHECK (group_entry_mode IN ('count_only', 'identified')),
  ADD COLUMN IF NOT EXISTS total_entitlements INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS admitted_entitlements INT DEFAULT 0;

ALTER TABLE public.passes
  ADD COLUMN IF NOT EXISTS is_group_master BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS group_booking_reference TEXT;

CREATE INDEX IF NOT EXISTS idx_ticket_orders_group_qr ON public.ticket_orders(group_qr_code);

-- ── 3. Register Feature Flag in platform_feature_flags ─────────
INSERT INTO public.platform_feature_flags (feature_key, module_code, name, platform_available)
VALUES
  ('group_entry', 'M14', 'Bulk Group QR Entry & Partial Check-In', TRUE)
ON CONFLICT (feature_key) DO UPDATE SET
  module_code = EXCLUDED.module_code,
  name = EXCLUDED.name,
  platform_available = EXCLUDED.platform_available,
  updated_at = now();

-- ── 4. Atomic Group Entry Check-In RPC Function ────────────────
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
        'message', format('Already admitted %s attendee(s). %s remaining.', v_existing_admission.admitted_count, v_existing_admission.remaining_after)
      );
    END IF;
  END IF;

  -- 2. Validate quantity requested
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status', 'INVALID_QUANTITY',
      'error', 'Quantity to admit must be at least 1.'
    );
  END IF;

  -- 3. Row-level Lock on ticket_orders or passes
  -- Search by booking reference, order ID, or group QR code
  SELECT id, event_id, buyer_name, buyer_email, status,
         COALESCE(total_attendee_count, total_entitlements, 1) as total_units,
         COALESCE(admitted_entitlements, 0) as used_units,
         group_entry_enabled, group_entry_mode
  INTO v_order
  FROM public.ticket_orders
  WHERE (
    id::text = p_group_booking_ref
    OR group_qr_code = p_group_booking_ref
    OR id IN (
      SELECT order_id FROM public.passes
      WHERE (pass_token = p_group_booking_ref OR id::text = p_group_booking_ref)
        AND order_id IS NOT NULL
    )
  ) AND event_id = p_event_id
  FOR UPDATE;

  -- If not found directly in orders, check passes table with FOR UPDATE
  IF NOT FOUND THEN
    SELECT p.id, p.event_id, p.attendee_id, p.status,
           COALESCE(p.total_guests, 1) as total_units,
           COALESCE(p.checked_in_guests, 0) as used_units,
           a.name as buyer_name, a.email as buyer_email
    INTO v_pass
    FROM public.passes p
    LEFT JOIN public.attendees a ON a.id = p.attendee_id
    WHERE (p.pass_token = p_group_booking_ref OR p.id::text = p_group_booking_ref)
      AND p.event_id = p_event_id
    FOR UPDATE OF p;

    IF NOT FOUND THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'BOOKING_NOT_FOUND',
        'error', 'Group booking or pass reference not found for this event.'
      );
    END IF;

    -- Verify active status
    IF v_pass.status IN ('revoked', 'cancelled', 'refunded', 'expired') THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'BOOKING_INVALID',
        'error', format('Group pass is %s. Admission denied.', upper(v_pass.status))
      );
    END IF;

    v_total_entitlements := v_pass.total_units;
    v_previously_admitted := v_pass.used_units;
  ELSE
    -- Order found
    IF v_order.status IN ('refunded', 'cancelled', 'failed') THEN
      RETURN jsonb_build_object(
        'success', false,
        'status', 'BOOKING_INVALID',
        'error', format('Booking is %s. Admission denied.', upper(v_order.status))
      );
    END IF;

    v_total_entitlements := v_order.total_units;
    v_previously_admitted := v_order.used_units;
  END IF;

  -- 4. Calculate Remaining Entitlements
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

  -- 5. Commit Admission atomically
  v_new_remaining := v_remaining - p_quantity;

  -- Update order record if present
  IF v_order.id IS NOT NULL THEN
    UPDATE public.ticket_orders
    SET admitted_entitlements = v_previously_admitted + p_quantity,
        updated_at = v_now
    WHERE id = v_order.id;
  END IF;

  -- Update pass record if present
  IF v_pass.id IS NOT NULL THEN
    UPDATE public.passes
    SET checked_in_guests = v_previously_admitted + p_quantity,
        status = CASE WHEN v_new_remaining = 0 THEN 'checked_in' ELSE 'partially_checked_in' END,
        updated_at = v_now
    WHERE id = v_pass.id;
  END IF;

  -- 6. Insert durable audit log entry
  INSERT INTO public.group_entry_admissions (
    event_id,
    order_id,
    pass_id,
    group_booking_reference,
    gate_id,
    admitted_count,
    total_entitlements,
    previously_admitted,
    remaining_after,
    entry_mode,
    admitted_members,
    scanner_operator_id,
    operator_email,
    device_id,
    scan_operation_id,
    admitted_at
  ) VALUES (
    p_event_id,
    v_order.id,
    v_pass.id,
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

-- ── 5. Enable Row Level Security ───────────────────────────────
ALTER TABLE public.group_entry_admissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "group_entry_admissions_organizer_select" ON public.group_entry_admissions;
CREATE POLICY "group_entry_admissions_organizer_select" ON public.group_entry_admissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = group_entry_admissions.event_id
        AND (e.organizer_id = auth.uid() OR public.is_org_member(e.organization_id))
    )
  );

DROP POLICY IF EXISTS "group_entry_admissions_service_role_all" ON public.group_entry_admissions;
CREATE POLICY "group_entry_admissions_service_role_all" ON public.group_entry_admissions
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
