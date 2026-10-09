-- Migration 092: Multi-Gate Tracking, Structured Entry/Exit & Live Venue Presence
-- Supports: Module 06 (Advanced Entry & Exit Tracking, Re-Entry rules, gate operator permissions, duplicate prevention)

-- 1. Ensure presence state columns on attendees
ALTER TABLE public.attendees 
  ADD COLUMN IF NOT EXISTS venue_presence_state TEXT NOT NULL DEFAULT 'OUTSIDE' CHECK (venue_presence_state IN ('OUTSIDE', 'INSIDE')),
  ADD COLUMN IF NOT EXISTS last_gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_gate_scanned_at TIMESTAMPTZ;

-- 2. Staff gate assignments
CREATE TABLE IF NOT EXISTS public.staff_gate_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    operator_email TEXT NOT NULL,
    allowed_gate_ids UUID[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(event_id, operator_email)
);

-- 3. Comprehensive Gate Scan Events Table
CREATE TABLE IF NOT EXISTS public.gate_scan_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    credential_id TEXT NOT NULL,
    ticket_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
    attendee_id UUID REFERENCES public.attendees(id) ON DELETE CASCADE,
    gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
    operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    operator_email TEXT NOT NULL,
    device_id TEXT,
    operation_mode TEXT NOT NULL CHECK (operation_mode IN ('entry', 'exit', 're_entry', 'verify_only')),
    presence_before TEXT NOT NULL DEFAULT 'OUTSIDE' CHECK (presence_before IN ('OUTSIDE', 'INSIDE')),
    presence_after TEXT NOT NULL DEFAULT 'INSIDE' CHECK (presence_after IN ('OUTSIDE', 'INSIDE')),
    result TEXT NOT NULL CHECK (result IN ('GRANTED', 'DENIED', 'WARNING')),
    reason_code TEXT,
    is_offline_reconciled BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for ultra-fast scans, dashboard aggregates, and live streams
CREATE INDEX IF NOT EXISTS idx_gate_scan_events_event_created ON public.gate_scan_events(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gate_scan_events_credential ON public.gate_scan_events(credential_id);
CREATE INDEX IF NOT EXISTS idx_gate_scan_events_attendee ON public.gate_scan_events(attendee_id);
CREATE INDEX IF NOT EXISTS idx_gate_scan_events_gate ON public.gate_scan_events(gate_id);
CREATE INDEX IF NOT EXISTS idx_gate_scan_events_result ON public.gate_scan_events(event_id, result);
CREATE INDEX IF NOT EXISTS idx_staff_gate_assignments_event ON public.staff_gate_assignments(event_id);
CREATE INDEX IF NOT EXISTS idx_staff_gate_assignments_operator ON public.staff_gate_assignments(operator_email);

-- Enable RLS
ALTER TABLE public.staff_gate_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_scan_events ENABLE ROW LEVEL SECURITY;

-- Policies for staff_gate_assignments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'staff_gate_assignments' AND policyname = 'Organizers manage staff gate assignments'
  ) THEN
    CREATE POLICY "Organizers manage staff gate assignments"
      ON public.staff_gate_assignments
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = staff_gate_assignments.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'staff_gate_assignments' AND policyname = 'Service role full access to staff assignments'
  ) THEN
    CREATE POLICY "Service role full access to staff assignments"
      ON public.staff_gate_assignments
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gate_scan_events' AND policyname = 'Organizers view gate scan events'
  ) THEN
    CREATE POLICY "Organizers view gate scan events"
      ON public.gate_scan_events
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = gate_scan_events.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gate_scan_events' AND policyname = 'Service role full access to gate scans'
  ) THEN
    CREATE POLICY "Service role full access to gate scans"
      ON public.gate_scan_events
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
