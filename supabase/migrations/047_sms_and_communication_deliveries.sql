-- ============================================================
-- Migration 047: Unified Communication Deliveries & SMS Ticket Delivery (DLT Support)
-- ============================================================

-- 1. Extend events table with communication settings
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS sms_fallback_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS sms_sender_id TEXT DEFAULT 'URPASS',
  ADD COLUMN IF NOT EXISTS sms_dlt_entity_id TEXT,
  ADD COLUMN IF NOT EXISTS sms_dlt_template_id TEXT,
  ADD COLUMN IF NOT EXISTS sms_provider TEXT DEFAULT 'default';

-- 2. Create generic communication_deliveries table
CREATE TABLE IF NOT EXISTS public.communication_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_id TEXT,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP', 'SMS')),
  destination TEXT NOT NULL,
  template_name TEXT NOT NULL DEFAULT 'ticket_confirmation',
  provider TEXT NOT NULL DEFAULT 'generic',
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'QUEUED'
    CHECK (status IN ('QUEUED', 'SENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED')),
  attempt_count INTEGER NOT NULL DEFAULT 1,
  failure_code TEXT,
  failure_reason TEXT,
  last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  provider_cost NUMERIC(10, 4) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  idempotency_key TEXT UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes for rapid querying and webhook reconciliation
CREATE INDEX IF NOT EXISTS idx_comm_deliv_event ON public.communication_deliveries(event_id);
CREATE INDEX IF NOT EXISTS idx_comm_deliv_attendee ON public.communication_deliveries(attendee_id);
CREATE INDEX IF NOT EXISTS idx_comm_deliv_ticket ON public.communication_deliveries(ticket_id);
CREATE INDEX IF NOT EXISTS idx_comm_deliv_channel ON public.communication_deliveries(channel);
CREATE INDEX IF NOT EXISTS idx_comm_deliv_status ON public.communication_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_comm_deliv_idempotency ON public.communication_deliveries(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_comm_deliv_provider_msg ON public.communication_deliveries(provider, provider_message_id);

-- 4. Enable RLS on communication_deliveries
ALTER TABLE public.communication_deliveries ENABLE ROW LEVEL SECURITY;

-- Organizers and authorized org staff can view communication logs
CREATE POLICY "organizers_view_communication_deliveries" ON public.communication_deliveries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = communication_deliveries.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = communication_deliveries.event_id
        AND events.organization_id IS NOT NULL
        AND is_org_member(events.organization_id)
    )
  );

-- Organizers can trigger manual resends (insert/update delivery records)
CREATE POLICY "organizers_manage_communication_deliveries" ON public.communication_deliveries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = communication_deliveries.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = communication_deliveries.event_id
        AND events.organization_id IS NOT NULL
        AND is_org_member(events.organization_id)
    )
  );
