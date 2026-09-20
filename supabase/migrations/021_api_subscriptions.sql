-- API plan tiers (separate from main UrPass subscription)
CREATE TABLE api_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  price_monthly INTEGER NOT NULL DEFAULT 0, -- in paise (0 = free)
  max_events  INTEGER NOT NULL DEFAULT 5,   -- events created via API per month
  max_attendees INTEGER NOT NULL DEFAULT 100, -- registrations via API per month
  max_requests  INTEGER NOT NULL DEFAULT 10000, -- API requests per month
  features    TEXT[] NOT NULL DEFAULT '{}',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  position    INTEGER NOT NULL DEFAULT 0
);

-- API subscription per user (independent of main subscription)
CREATE TABLE api_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_slug   TEXT NOT NULL DEFAULT 'sandbox',
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled','past_due')),
  razorpay_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX api_subscriptions_user_unique ON api_subscriptions(user_id);

-- Monthly API usage tracking
CREATE TABLE api_usage (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year_month    TEXT NOT NULL, -- e.g. '2026-09'
  api_requests  INTEGER NOT NULL DEFAULT 0,
  registrations INTEGER NOT NULL DEFAULT 0,
  check_ins     INTEGER NOT NULL DEFAULT 0,
  events        INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT api_usage_unique UNIQUE (user_id, year_month)
);

-- Add environment column to api_keys (sandbox vs production)
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS environment TEXT NOT NULL DEFAULT 'production'
  CHECK (environment IN ('sandbox','production'));

-- Seed API plans
INSERT INTO api_plans (slug, name, price_monthly, max_events, max_attendees, max_requests, features, position) VALUES
('sandbox', 'Sandbox', 0, 5, 100, 1000, ARRAY['Sandbox API','Test events','Test attendees','API documentation'], 0),
('starter', 'API Starter', 199900, 10, 2000, 100000, ARRAY['API access','Webhooks','API logs','Developer documentation','Basic support'], 1),
('growth', 'API Growth', 499900, 50, 10000, 500000, ARRAY['Full API','Webhooks','Usage analytics','Higher rate limits','Priority support'], 2),
('scale', 'API Scale', 999900, 200, 50000, 2000000, ARRAY['Full API','Advanced webhooks','High rate limits','Usage analytics','Priority support'], 3),
('enterprise', 'Enterprise API', 0, 999999, 999999, 999999, ARRAY['Custom limits','White-label','Dedicated support','SLA','Custom integrations'], 4);

-- RLS
ALTER TABLE api_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "api_plans_public_read" ON api_plans FOR SELECT USING (true);

ALTER TABLE api_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "api_subs_user" ON api_subscriptions FOR ALL USING (auth.uid() = user_id);

ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "api_usage_user" ON api_usage FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER trg_api_subs_updated_at
  BEFORE UPDATE ON api_subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
