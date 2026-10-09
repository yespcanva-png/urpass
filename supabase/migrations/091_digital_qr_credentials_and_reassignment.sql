-- Migration 091: Digital QR Identity Credentials & Ticket Reassignment
-- Supports: Module 05 (Digital QR identity lifecycle, token revocation, atomic reassignment auditing)

CREATE TABLE IF NOT EXISTS public.digital_qr_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    pass_id UUID NOT NULL REFERENCES public.passes(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.ticket_orders(id) ON DELETE SET NULL,
    attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
    credential_token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'superseded')),
    version INTEGER NOT NULL DEFAULT 1,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ticket_reassignment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.ticket_orders(id) ON DELETE SET NULL,
    ticket_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
    from_attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
    from_name TEXT NOT NULL,
    from_email TEXT NOT NULL,
    to_attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
    to_name TEXT NOT NULL,
    to_email TEXT NOT NULL,
    actor_email TEXT NOT NULL,
    reason TEXT,
    revoked_credential_token TEXT,
    new_credential_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for lightning lookups during high-throughput gate scans and audit lookups
CREATE INDEX IF NOT EXISTS idx_digital_qr_credentials_event_id ON public.digital_qr_credentials(event_id);
CREATE INDEX IF NOT EXISTS idx_digital_qr_credentials_pass_id ON public.digital_qr_credentials(pass_id);
CREATE INDEX IF NOT EXISTS idx_digital_qr_credentials_token ON public.digital_qr_credentials(credential_token);
CREATE INDEX IF NOT EXISTS idx_digital_qr_credentials_status ON public.digital_qr_credentials(status);
CREATE INDEX IF NOT EXISTS idx_digital_qr_credentials_attendee_id ON public.digital_qr_credentials(attendee_id);
CREATE INDEX IF NOT EXISTS idx_digital_qr_credentials_booking_id ON public.digital_qr_credentials(booking_id);

CREATE INDEX IF NOT EXISTS idx_ticket_reassignments_event_id ON public.ticket_reassignment_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_reassignments_ticket_id ON public.ticket_reassignment_logs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_reassignments_booking_id ON public.ticket_reassignment_logs(booking_id);

-- Enable RLS
ALTER TABLE public.digital_qr_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_reassignment_logs ENABLE ROW LEVEL SECURITY;

-- Policies for digital_qr_credentials
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'digital_qr_credentials' AND policyname = 'Organizers can view credentials for their events'
  ) THEN
    CREATE POLICY "Organizers can view credentials for their events"
      ON public.digital_qr_credentials
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = digital_qr_credentials.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'digital_qr_credentials' AND policyname = 'Service role full access to credentials'
  ) THEN
    CREATE POLICY "Service role full access to credentials"
      ON public.digital_qr_credentials
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ticket_reassignment_logs' AND policyname = 'Organizers can view reassignment logs'
  ) THEN
    CREATE POLICY "Organizers can view reassignment logs"
      ON public.ticket_reassignment_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.events
          WHERE public.events.id = ticket_reassignment_logs.event_id
            AND public.events.organizer_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ticket_reassignment_logs' AND policyname = 'Service role full access to reassignment logs'
  ) THEN
    CREATE POLICY "Service role full access to reassignment logs"
      ON public.ticket_reassignment_logs
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
