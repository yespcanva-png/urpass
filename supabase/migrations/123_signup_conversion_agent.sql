-- ============================================================================
-- Migration 123: UrPass Signup Conversion Agent (Agent 01)
-- Description: Establishes visitor session attribution (first & last touch),
--              conversion event lifecycle tracking, dynamic CTA configs,
--              A/B experiment engine & assignments, recovery tracking,
--              and AI Growth Agent recommendations, logs, and audit records.
-- ============================================================================

-- 1. Visitor Sessions Table (First & Last Touch Attribution)
CREATE TABLE IF NOT EXISTS conversion_visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_session_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_segment TEXT NOT NULL DEFAULT 'general' CHECK (
    visitor_segment IN ('college', 'corporate', 'ticketing', 'managed_service', 'general')
  ),
  device_category TEXT NOT NULL DEFAULT 'desktop' CHECK (
    device_category IN ('mobile', 'tablet', 'desktop', 'unknown')
  ),
  -- First touch attribution (preserved immutable origin)
  first_touch_url TEXT,
  first_touch_page_slug TEXT,
  first_touch_cluster TEXT,
  first_touch_utm_source TEXT,
  first_touch_utm_medium TEXT,
  first_touch_utm_campaign TEXT,
  first_touch_utm_content TEXT,
  first_touch_referrer TEXT,
  first_touch_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Last touch attribution (updated on return visits)
  last_touch_url TEXT,
  last_touch_page_slug TEXT,
  last_touch_cluster TEXT,
  last_touch_utm_source TEXT,
  last_touch_utm_medium TEXT,
  last_touch_utm_campaign TEXT,
  last_touch_utm_content TEXT,
  last_touch_referrer TEXT,
  last_touch_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_country TEXT DEFAULT 'IN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversion_sessions_anon_id ON conversion_visitor_sessions(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_sessions_user_id ON conversion_visitor_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_sessions_segment ON conversion_visitor_sessions(visitor_segment);
CREATE INDEX IF NOT EXISTS idx_conversion_sessions_created ON conversion_visitor_sessions(created_at DESC);

-- 2. Experiments Table
CREATE TABLE IF NOT EXISTS conversion_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  target_page_slug TEXT,
  target_segment TEXT CHECK (
    target_segment IS NULL OR target_segment IN ('college', 'corporate', 'ticketing', 'managed_service', 'general')
  ),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'active', 'paused', 'completed', 'rolled_back')
  ),
  winning_variant_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversion_exp_status ON conversion_experiments(status);
CREATE INDEX IF NOT EXISTS idx_conversion_exp_key ON conversion_experiments(experiment_key);

-- 3. Experiment Variants Table
CREATE TABLE IF NOT EXISTS conversion_experiment_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES conversion_experiments(id) ON DELETE CASCADE,
  variant_key TEXT NOT NULL,
  name TEXT NOT NULL,
  weight INT NOT NULL DEFAULT 50 CHECK (weight >= 0 AND weight <= 100),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_control BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_exp_variant UNIQUE (experiment_id, variant_key)
);

CREATE INDEX IF NOT EXISTS idx_conversion_variants_exp ON conversion_experiment_variants(experiment_id);

-- 4. Experiment Assignments Table (Guarantees Stable Variant sticky per Session)
CREATE TABLE IF NOT EXISTS conversion_experiment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  experiment_id UUID NOT NULL REFERENCES conversion_experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES conversion_experiment_variants(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_session_experiment UNIQUE (session_id, experiment_id)
);

CREATE INDEX IF NOT EXISTS idx_conversion_assignments_session ON conversion_experiment_assignments(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_assignments_exp ON conversion_experiment_assignments(experiment_id);

-- 5. Intent-Based CTA Configuration Table
CREATE TABLE IF NOT EXISTS conversion_cta_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL UNIQUE CHECK (
    segment IN ('college', 'corporate', 'ticketing', 'managed_service', 'general')
  ),
  primary_cta_label TEXT NOT NULL,
  primary_cta_subtext TEXT,
  primary_cta_url TEXT NOT NULL DEFAULT '/signup',
  secondary_cta_label TEXT,
  secondary_cta_subtext TEXT,
  secondary_cta_url TEXT,
  badge_text TEXT,
  headline_override TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Initial Intent-Based CTA Configurations
INSERT INTO conversion_cta_configs (segment, primary_cta_label, primary_cta_subtext, primary_cta_url, secondary_cta_label, secondary_cta_subtext, secondary_cta_url, badge_text, headline_override)
VALUES
  ('college', 'Create College Event', 'Free Forever Plan Available · 0% Ticket Commission · Sub-second Check-in', '/signup?segment=college', 'Request College Demo', 'Talk to campus specialist', '/contact?segment=college', 'Campus Verified', 'Host Flawless College Fests, Symposia & Campus Events'),
  ('corporate', 'Start Free / Request Demo', 'Instant Setup · GST Tax Invoices · Corporate RBAC Workspaces', '/signup?segment=corporate', 'Book Enterprise Demo', 'Live 1-on-1 walkthrough', '/contact?segment=corporate', 'Enterprise Ready', 'Enterprise Event Registration & Digital Access Control'),
  ('ticketing', 'Create Tickets', '0% Platform Fee · Direct Razorpay/UPI Payouts · Instant QR Delivery', '/signup?segment=ticketing', 'Calculate Your Savings', 'See how much you save vs 8% platforms', '/ticket-fee-calculator', '0% Fee Ticketing', 'Sell Tickets Online with 0% Platform Commission'),
  ('managed_service', 'Request Managed Setup', 'From ₹1,000/event · Done-For-You Remote Setup by UrPass Engineers', '/contact?segment=managed_service', 'Start Self-Service', 'Or configure your own event in minutes', '/signup?segment=self_service', 'Done-For-You', 'Remote Managed Event Ticketing & Pass Configuration'),
  ('general', 'Create Your Event', 'Free Forever Plan Available · 0% Ticket Commission · Fast Setup', '/signup?segment=general', 'Explore Features', 'Discover all tools and features', '/features', 'UrPass Growth', 'Digital Event Passes & Sub-Second Lightning QR Check-In')
ON CONFLICT (segment) DO NOTHING;

-- 6. Conversion Events Table (Idempotent Funnel Tracking)
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL CHECK (
    event_name IN (
      'landing_page_view',
      'primary_cta_click',
      'secondary_cta_click',
      'signup_started',
      'signup_completed',
      'signup_abandoned',
      'first_event_created',
      'first_event_draft_created',
      'pricing_viewed',
      'subscription_plan_selected',
      'checkout_started',
      'autopay_authorization_started',
      'autopay_authorized',
      'subscription_activated',
      'checkout_failed',
      'free_plan_activated',
      'registration_setup_completed',
      'first_event_published',
      'managed_service_enquiry',
      'subscription_started',
      'experiment_exposed',
      'recovery_modal_shown',
      'recovery_cta_clicked',
      'recovery_dismissed'
    )
  ),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_slug TEXT NOT NULL,
  content_cluster TEXT,
  visitor_segment TEXT DEFAULT 'general' CHECK (
    visitor_segment IN ('college', 'corporate', 'ticketing', 'managed_service', 'general')
  ),
  cta_position TEXT,
  experiment_id UUID REFERENCES conversion_experiments(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES conversion_experiment_variants(id) ON DELETE SET NULL,
  device_category TEXT DEFAULT 'desktop',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  idempotency_key TEXT UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversion_events_name ON conversion_events(event_name);
CREATE INDEX IF NOT EXISTS idx_conversion_events_session ON conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_user ON conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_page ON conversion_events(page_slug);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created ON conversion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_segment ON conversion_events(visitor_segment);

-- 7. AI Growth Agent Recommendations Table
CREATE TABLE IF NOT EXISTS conversion_agent_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  target_metric TEXT NOT NULL,
  target_page_slug TEXT,
  target_segment TEXT,
  proposed_changes JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected', 'applied')
  ),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (
    priority IN ('low', 'medium', 'high', 'critical')
  ),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_rec_status ON conversion_agent_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_agent_rec_priority ON conversion_agent_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_agent_rec_created ON conversion_agent_recommendations(created_at DESC);

-- 8. AI Growth Agent Execution Logs Table
CREATE TABLE IF NOT EXISTS conversion_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL CHECK (
    run_type IN ('scheduled_daily', 'scheduled_weekly', 'manual_trigger', 'anomaly_alert')
  ),
  metrics_analyzed JSONB NOT NULL DEFAULT '{}'::jsonb,
  insights JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON conversion_agent_logs(created_at DESC);

-- 9. Conversion Audit Records Table
CREATE TABLE IF NOT EXISTS conversion_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  actor_email TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversion_audit_created ON conversion_audit_logs(created_at DESC);

-- 10. Row Level Security Policies (Strict Service Role & Server Authorized)
ALTER TABLE conversion_visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_experiment_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_cta_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_agent_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_audit_logs ENABLE ROW LEVEL SECURITY;

-- Deny anon select by default (Privacy safeguard)
DROP POLICY IF EXISTS "Anon cannot select visitor sessions" ON conversion_visitor_sessions;
CREATE POLICY "Anon cannot select visitor sessions" ON conversion_visitor_sessions FOR SELECT USING (false);

DROP POLICY IF EXISTS "Anon cannot select conversion events" ON conversion_events;
CREATE POLICY "Anon cannot select conversion events" ON conversion_events FOR SELECT USING (false);

DROP POLICY IF EXISTS "Anon cannot select recommendations" ON conversion_agent_recommendations;
CREATE POLICY "Anon cannot select recommendations" ON conversion_agent_recommendations FOR SELECT USING (false);

DROP POLICY IF EXISTS "Anon cannot select agent logs" ON conversion_agent_logs;
CREATE POLICY "Anon cannot select agent logs" ON conversion_agent_logs FOR SELECT USING (false);

-- Service role full access
DROP POLICY IF EXISTS "Service role manages sessions" ON conversion_visitor_sessions;
CREATE POLICY "Service role manages sessions" ON conversion_visitor_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages experiments" ON conversion_experiments;
CREATE POLICY "Service role manages experiments" ON conversion_experiments FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages variants" ON conversion_experiment_variants;
CREATE POLICY "Service role manages variants" ON conversion_experiment_variants FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages assignments" ON conversion_experiment_assignments;
CREATE POLICY "Service role manages assignments" ON conversion_experiment_assignments FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages cta configs" ON conversion_cta_configs;
CREATE POLICY "Service role manages cta configs" ON conversion_cta_configs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages events" ON conversion_events;
CREATE POLICY "Service role manages events" ON conversion_events FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages recommendations" ON conversion_agent_recommendations;
CREATE POLICY "Service role manages recommendations" ON conversion_agent_recommendations FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages agent logs" ON conversion_agent_logs;
CREATE POLICY "Service role manages agent logs" ON conversion_agent_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages audit logs" ON conversion_audit_logs;
CREATE POLICY "Service role manages audit logs" ON conversion_audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 11. Helper Functions & Triggers
CREATE OR REPLACE FUNCTION update_conversion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_conversion_sessions_updated ON conversion_visitor_sessions;
CREATE TRIGGER trg_conversion_sessions_updated
  BEFORE UPDATE ON conversion_visitor_sessions
  FOR EACH ROW EXECUTE FUNCTION update_conversion_timestamp();

DROP TRIGGER IF EXISTS trg_conversion_exp_updated ON conversion_experiments;
CREATE TRIGGER trg_conversion_exp_updated
  BEFORE UPDATE ON conversion_experiments
  FOR EACH ROW EXECUTE FUNCTION update_conversion_timestamp();

DROP TRIGGER IF EXISTS trg_conversion_rec_updated ON conversion_agent_recommendations;
CREATE TRIGGER trg_conversion_rec_updated
  BEFORE UPDATE ON conversion_agent_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_conversion_timestamp();

DROP TRIGGER IF EXISTS trg_conversion_cta_updated ON conversion_cta_configs;
CREATE TRIGGER trg_conversion_cta_updated
  BEFORE UPDATE ON conversion_cta_configs
  FOR EACH ROW EXECUTE FUNCTION update_conversion_timestamp();
