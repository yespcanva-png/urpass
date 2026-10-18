-- ============================================================
-- Migration 110: WhatsApp Consent and Production Hardening
-- ============================================================

-- 1. Add explicit WhatsApp opt-in and consent tracking to attendees
ALTER TABLE public.attendees
  ADD COLUMN IF NOT EXISTS whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS whatsapp_consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS whatsapp_consent_disclosure_version TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_consent_source TEXT DEFAULT 'registration_form';

-- 2. Index for filtering attendees who opted into WhatsApp
CREATE INDEX IF NOT EXISTS idx_attendees_whatsapp_consent 
  ON public.attendees(event_id, whatsapp_consent);

-- 3. Enhance communication_deliveries with delivery state tracking
ALTER TABLE public.communication_deliveries
  ADD COLUMN IF NOT EXISTS consent_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS template_language TEXT DEFAULT 'en';

-- 4. Create an audit table for WhatsApp consent changes (grant / revoke)
CREATE TABLE IF NOT EXISTS public.attendee_consent_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'WHATSAPP',
  consent_granted BOOLEAN NOT NULL,
  disclosure_version TEXT NOT NULL,
  source TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_audit_attendee ON public.attendee_consent_audit(attendee_id);
CREATE INDEX IF NOT EXISTS idx_consent_audit_event ON public.attendee_consent_audit(event_id);

ALTER TABLE public.attendee_consent_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizers_view_consent_audit" ON public.attendee_consent_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = attendee_consent_audit.event_id
      AND (
        e.organizer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.organization_members om
          WHERE om.organization_id = e.organization_id
          AND om.user_id = auth.uid()
          AND om.status = 'active'
        )
      )
    )
  );
