-- ============================================================
-- Migration 081: P1 Reliability, Scalability & Operations Layer
-- Covers:
--   1. Document Sequences table & Atomic Sequence RPC (gapless, non-colliding invoice numbering)
--   2. Bulk Offline Scans Sync RPC (single-transaction batch sync, preventing Vercel timeout)
--   3. Check-in Conflicts table verification & enhanced conflict tracking
--   4. Exhibitor Leads RLS policies & token normalization indexes
-- ============================================================

-- 1. Document Sequences (Atomic Invoice & Credit Note Numbering)
CREATE TABLE IF NOT EXISTS public.document_sequences (
  doc_type TEXT NOT NULL,
  financial_year TEXT NOT NULL,
  current_sequence BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (doc_type, financial_year)
);

CREATE INDEX IF NOT EXISTS idx_document_sequences_lookup
  ON public.document_sequences(doc_type, financial_year);

ALTER TABLE public.document_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_document_sequences_all" ON public.document_sequences
  FOR ALL USING (auth.role() = 'service_role');

-- Atomic counter function: guarantees gapless, lock-safe, non-colliding sequences
CREATE OR REPLACE FUNCTION public.get_next_document_sequence(
  p_doc_type TEXT,
  p_financial_year TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seq BIGINT;
BEGIN
  INSERT INTO public.document_sequences (doc_type, financial_year, current_sequence, updated_at)
  VALUES (p_doc_type, p_financial_year, 1, NOW())
  ON CONFLICT (doc_type, financial_year)
  DO UPDATE SET
    current_sequence = public.document_sequences.current_sequence + 1,
    updated_at = NOW()
  RETURNING current_sequence INTO v_seq;

  RETURN v_seq;
END;
$$;

-- 2. Verify check_in_conflicts table from Migration 044
CREATE TABLE IF NOT EXISTS public.check_in_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  pass_id UUID REFERENCES public.passes(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  conflict_type TEXT NOT NULL DEFAULT 'OFFLINE_DUPLICATE'
    CHECK (conflict_type IN ('OFFLINE_DUPLICATE', 'GATE_CONFLICT', 'ZONE_MISMATCH')),
  winning_check_in_id UUID REFERENCES public.check_ins(id) ON DELETE SET NULL,
  conflicting_scan_operation_id TEXT,
  conflicting_scanned_at TIMESTAMPTZ NOT NULL,
  winning_scanned_at TIMESTAMPTZ,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_check_in_conflicts_event ON public.check_in_conflicts(event_id);
CREATE INDEX IF NOT EXISTS idx_check_in_conflicts_pass ON public.check_in_conflicts(pass_id);
CREATE INDEX IF NOT EXISTS idx_check_in_conflicts_resolved ON public.check_in_conflicts(event_id, resolved);

ALTER TABLE public.check_in_conflicts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'check_in_conflicts' AND policyname = 'service_role_check_in_conflicts_all'
  ) THEN
    CREATE POLICY "service_role_check_in_conflicts_all" ON public.check_in_conflicts
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 3. Bulk Offline Scan Sync RPC (Atomic Single-Roundtrip Batch Processing)
CREATE OR REPLACE FUNCTION public.sync_offline_scans_bulk(
  p_event_id UUID,
  p_user_id UUID,
  p_scans JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_scan JSONB;
  v_scan_op_id TEXT;
  v_raw_token TEXT;
  v_clean_token TEXT;
  v_gate_id UUID;
  v_check_in_method TEXT;
  v_scanned_at TIMESTAMPTZ;
  v_synced_at TIMESTAMPTZ := NOW();
  v_pass RECORD;
  v_existing_ci RECORD;
  v_existing_op RECORD;
  v_zone_access RECORD;
  v_gate RECORD;
  v_results JSONB := '[]'::jsonb;
  v_item_result JSONB;
  v_is_uuid BOOLEAN;
BEGIN
  -- Iterate through each scan item in the bulk JSON array
  FOR v_scan IN SELECT * FROM jsonb_array_elements(p_scans)
  LOOP
    v_scan_op_id := v_scan->>'scanOperationId';
    v_raw_token := COALESCE(v_scan->>'passToken', '');
    v_clean_token := regexp_replace(v_raw_token, '^https?://[^/]+/pass/', '', 'i');
    v_clean_token := regexp_replace(v_clean_token, '^pass/', '', 'i');
    v_gate_id := NULL;
    IF v_scan->>'gateId' IS NOT NULL AND (v_scan->>'gateId') != '' THEN
      BEGIN
        v_gate_id := (v_scan->>'gateId')::UUID;
      EXCEPTION WHEN OTHERS THEN
        v_gate_id := NULL;
      END;
    END IF;
    v_check_in_method := COALESCE(v_scan->>'checkInMethod', 'qr');
    BEGIN
      v_scanned_at := (v_scan->>'scannedAt')::TIMESTAMPTZ;
    EXCEPTION WHEN OTHERS THEN
      v_scanned_at := v_synced_at;
    END;

    -- 1. Idempotency Check: if this exact scanOperationId was already processed
    SELECT id, checked_in_at, gate_id INTO v_existing_op
    FROM public.check_ins
    WHERE scan_operation_id = v_scan_op_id
    LIMIT 1;

    IF FOUND THEN
      v_item_result := jsonb_build_object(
        'scanOperationId', v_scan_op_id,
        'status', 'CHECKED_IN',
        'success', true,
        'checkedInAt', v_existing_op.checked_in_at
      );
      v_results := v_results || jsonb_build_array(v_item_result);
      CONTINUE;
    END IF;

    -- 2. Pass Lookup scoped to event
    v_is_uuid := v_clean_token ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
    IF v_is_uuid THEN
      SELECT id, pass_token, pass_type, status, attendee_id, event_id, ticket_type_id INTO v_pass
      FROM public.passes
      WHERE (pass_token = v_clean_token OR id = v_clean_token::UUID)
        AND event_id = p_event_id
      LIMIT 1;
    ELSE
      SELECT id, pass_token, pass_type, status, attendee_id, event_id, ticket_type_id INTO v_pass
      FROM public.passes
      WHERE pass_token = v_clean_token
        AND event_id = p_event_id
      LIMIT 1;
    END IF;

    IF NOT FOUND THEN
      v_item_result := jsonb_build_object(
        'scanOperationId', v_scan_op_id,
        'status', 'INVALID_PASS',
        'success', false,
        'conflictMessage', 'Pass not found for this event'
      );
      v_results := v_results || jsonb_build_array(v_item_result);
      CONTINUE;
    END IF;

    -- 3. Check pass validity / revocation (P0 protection)
    IF v_pass.status IN ('revoked', 'expired', 'cancelled') THEN
      v_item_result := jsonb_build_object(
        'scanOperationId', v_scan_op_id,
        'status', 'ACCESS_DENIED',
        'success', false,
        'conflictMessage', 'Pass has been revoked or cancelled'
      );
      v_results := v_results || jsonb_build_array(v_item_result);
      CONTINUE;
    END IF;

    -- 4. Zone Restriction Verification
    IF v_gate_id IS NOT NULL AND v_pass.ticket_type_id IS NOT NULL THEN
      SELECT id, name, zone_id INTO v_gate
      FROM public.scanner_gates
      WHERE id = v_gate_id AND event_id = p_event_id;

      IF FOUND AND v_gate.zone_id IS NOT NULL THEN
        SELECT id INTO v_zone_access
        FROM public.ticket_zone_access
        WHERE ticket_type_id = v_pass.ticket_type_id
          AND zone_id = v_gate.zone_id
        LIMIT 1;

        IF NOT FOUND THEN
          v_item_result := jsonb_build_object(
            'scanOperationId', v_scan_op_id,
            'status', 'ACCESS_DENIED',
            'success', false,
            'conflictMessage', 'Pass is not authorized for this gate / zone'
          );
          v_results := v_results || jsonb_build_array(v_item_result);
          CONTINUE;
        END IF;
      END IF;
    END IF;

    -- 5. Offline Duplicate Check (Concurrency Conflict Detection)
    SELECT id, checked_in_at, gate_id, scan_operation_id, scanned_at INTO v_existing_ci
    FROM public.check_ins
    WHERE pass_id = v_pass.id
    LIMIT 1;

    IF FOUND THEN
      -- Record conflict in check_in_conflicts table
      INSERT INTO public.check_in_conflicts (
        event_id,
        pass_id,
        attendee_id,
        gate_id,
        conflict_type,
        winning_check_in_id,
        conflicting_scan_operation_id,
        conflicting_scanned_at,
        winning_scanned_at,
        details
      ) VALUES (
        p_event_id,
        v_pass.id,
        v_pass.attendee_id,
        v_gate_id,
        'OFFLINE_DUPLICATE',
        v_existing_ci.id,
        v_scan_op_id,
        v_scanned_at,
        COALESCE(v_existing_ci.scanned_at, v_existing_ci.checked_in_at),
        jsonb_build_object(
          'winning_gate_id', v_existing_ci.gate_id,
          'winning_checked_in_at', v_existing_ci.checked_in_at,
          'conflicting_gate_id', v_gate_id,
          'conflicting_scanned_at', v_scanned_at
        )
      );

      v_item_result := jsonb_build_object(
        'scanOperationId', v_scan_op_id,
        'status', 'ALREADY_CHECKED_IN',
        'success', false,
        'conflict', true,
        'conflictMessage', 'Pass was already checked in at another gate',
        'winningGateId', v_existing_ci.gate_id,
        'winningCheckedInAt', v_existing_ci.checked_in_at
      );
      v_results := v_results || jsonb_build_array(v_item_result);
      CONTINUE;
    END IF;

    -- 6. Insert Check-In atomically
    BEGIN
      INSERT INTO public.check_ins (
        pass_id,
        event_id,
        attendee_id,
        checked_in_by,
        gate_id,
        check_in_method,
        scan_operation_id,
        checked_in_at,
        scanned_at,
        synced_at,
        is_offline
      ) VALUES (
        v_pass.id,
        p_event_id,
        v_pass.attendee_id,
        p_user_id,
        v_gate_id,
        v_check_in_method,
        v_scan_op_id,
        v_scanned_at,
        v_scanned_at,
        v_synced_at,
        true
      );

      -- Update pass & attendee status
      UPDATE public.passes SET status = 'checked_in' WHERE id = v_pass.id;
      IF v_pass.attendee_id IS NOT NULL THEN
        UPDATE public.attendees SET pass_status = 'checked_in' WHERE id = v_pass.attendee_id;
      END IF;

      v_item_result := jsonb_build_object(
        'scanOperationId', v_scan_op_id,
        'status', 'CHECKED_IN',
        'success', true,
        'checkedInAt', v_scanned_at
      );
      v_results := v_results || jsonb_build_array(v_item_result);
    EXCEPTION WHEN unique_violation THEN
      -- In case of concurrent insert race condition
      v_item_result := jsonb_build_object(
        'scanOperationId', v_scan_op_id,
        'status', 'ALREADY_CHECKED_IN',
        'success', false,
        'conflict', true,
        'conflictMessage', 'Pass checked in concurrently by another worker'
      );
      v_results := v_results || jsonb_build_array(v_item_result);
    END;
  END LOOP;

  RETURN v_results;
END;
$$;

-- 4. Exhibitor Leads Schema Enhancements & RLS Policies
CREATE TABLE IF NOT EXISTS public.exhibitor_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  exhibitor_id UUID NOT NULL REFERENCES public.event_exhibitors(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.exhibitor_staff(id) ON DELETE SET NULL,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  attendee_company TEXT,
  attendee_designation TEXT,
  ticket_name TEXT,
  qualification_rating TEXT NOT NULL DEFAULT 'warm'
    CHECK (qualification_rating IN ('hot', 'warm', 'cold')),
  notes TEXT,
  interested_products TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  follow_up_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (follow_up_status IN ('pending', 'contacted', 'meeting_scheduled', 'closed_won', 'unqualified')),
  follow_up_required BOOLEAN NOT NULL DEFAULT TRUE,
  consent_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
  custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exhibitor_leads_event ON public.exhibitor_leads(event_id, exhibitor_id);
CREATE INDEX IF NOT EXISTS idx_exhibitor_leads_captured ON public.exhibitor_leads(captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_exhibitor_leads_attendee ON public.exhibitor_leads(attendee_id);

ALTER TABLE public.exhibitor_leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'exhibitor_leads' AND policyname = 'service_role_exhibitor_leads_all'
  ) THEN
    CREATE POLICY "service_role_exhibitor_leads_all" ON public.exhibitor_leads
      FOR ALL USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'exhibitor_leads' AND policyname = 'organizer_view_leads'
  ) THEN
    CREATE POLICY "organizer_view_leads" ON public.exhibitor_leads
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE events.id = exhibitor_leads.event_id
            AND events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'exhibitor_leads' AND policyname = 'public_insert_exhibitor_leads'
  ) THEN
    CREATE POLICY "public_insert_exhibitor_leads" ON public.exhibitor_leads
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;
