-- ============================================================================
-- Migration 117: Managed Service Inquiries & Marketing Campaign Attribution
-- Description: Creates persistent storage and audit tracking for remote managed
--              service inquiries, pipeline stages, and conversion tracking.
-- ============================================================================

-- 1. Create enum or check constraint for pipeline stages
CREATE TABLE IF NOT EXISTS managed_service_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT,
  city TEXT,
  expected_attendees TEXT,
  event_pricing_type TEXT DEFAULT 'free', -- 'paid', 'free', 'private'
  preferred_package TEXT DEFAULT 'essential', -- 'essential', 'pro', 'premium', 'enterprise'
  support_requirements TEXT,
  comments TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'new' CHECK (
    status IN (
      'new',
      'contacted',
      'qualified',
      'quotation_sent',
      'accepted',
      'payment_pending',
      'paid',
      'setup_in_progress',
      'client_approved',
      'completed',
      'rejected'
    )
  ),
  assigned_owner TEXT,
  quoted_amount_inr NUMERIC,
  paid_amount_inr NUMERIC,
  payment_reference TEXT,
  page_slug TEXT,
  content_cluster TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for operational triage and stage updates
CREATE INDEX IF NOT EXISTS idx_managed_inquiries_status ON managed_service_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_managed_inquiries_created_at ON managed_service_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_managed_inquiries_slug ON managed_service_inquiries(page_slug);

-- 2. Marketing campaign conversions table (Deduplicated first-party conversion events)
CREATE TABLE IF NOT EXISTS marketing_campaign_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL, -- e.g. 'self_service_cta_click', 'managed_service_cta_click', 'signup_completed'
  page_slug TEXT NOT NULL,
  content_cluster TEXT,
  service_model TEXT CHECK (service_model IN ('self_service', 'managed_service', 'hybrid')),
  cta_position TEXT, -- 'hero', 'mid', 'footer', 'sticky'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_conversions_slug ON marketing_campaign_conversions(page_slug);
CREATE INDEX IF NOT EXISTS idx_marketing_conversions_event ON marketing_campaign_conversions(event_name);
CREATE INDEX IF NOT EXISTS idx_marketing_conversions_created ON marketing_campaign_conversions(created_at DESC);

-- 3. Row Level Security
ALTER TABLE managed_service_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaign_conversions ENABLE ROW LEVEL SECURITY;

-- Anonymous users cannot read inquiries (strict privacy)
DROP POLICY IF EXISTS "Anon cannot select inquiries" ON managed_service_inquiries;
CREATE POLICY "Anon cannot select inquiries" ON managed_service_inquiries
  FOR SELECT USING (false);

-- Anonymous users cannot direct-insert without API control, or permit API insert
DROP POLICY IF EXISTS "Service role manages inquiries" ON managed_service_inquiries;
CREATE POLICY "Service role manages inquiries" ON managed_service_inquiries
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Marketing conversions
DROP POLICY IF EXISTS "Service role manages conversions" ON marketing_campaign_conversions;
CREATE POLICY "Service role manages conversions" ON marketing_campaign_conversions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_managed_inquiry_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_managed_inquiry_timestamp ON managed_service_inquiries;
CREATE TRIGGER trg_managed_inquiry_timestamp
  BEFORE UPDATE ON managed_service_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_managed_inquiry_timestamp();
