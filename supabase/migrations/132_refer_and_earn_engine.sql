-- 132: UrPass Refer & Earn V1 Engine
-- Implements Give ₹100, Get ₹150 Organiser Acquisition Model

-- 1. Referral Programs (Campaign Configuration)
CREATE TABLE IF NOT EXISTS public.referral_programs (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                        text NOT NULL DEFAULT 'UrPass Refer & Earn V1',
  slug                        text NOT NULL UNIQUE DEFAULT 'default_in',
  currency                    text NOT NULL DEFAULT 'INR',
  referee_discount_paise      bigint NOT NULL DEFAULT 10000, -- ₹100 off first purchase
  referrer_reward_paise       bigint NOT NULL DEFAULT 15000, -- ₹150 credit
  min_qualifying_payment_paise bigint NOT NULL DEFAULT 49900, -- Minimum ₹499 plan
  hold_period_days            int NOT NULL DEFAULT 14,      -- 14-day verification hold
  monthly_reward_cap          int NOT NULL DEFAULT 10,      -- Max 10 rewards/org/month
  credit_validity_days        int NOT NULL DEFAULT 365,     -- 12 months expiry
  is_active                   boolean NOT NULL DEFAULT true,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Seed initial program
INSERT INTO public.referral_programs (slug, name, referee_discount_paise, referrer_reward_paise, min_qualifying_payment_paise)
VALUES ('default_in', 'UrPass Refer & Earn V1 (India)', 10000, 15000, 49900)
ON CONFLICT (slug) DO UPDATE SET
  referee_discount_paise = EXCLUDED.referee_discount_paise,
  referrer_reward_paise = EXCLUDED.referrer_reward_paise,
  min_qualifying_payment_paise = EXCLUDED.min_qualifying_payment_paise;

-- 2. Referral Codes (Permanent Vanity/Unique Codes)
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code              text NOT NULL UNIQUE,
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id   uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  program_id        uuid NOT NULL REFERENCES public.referral_programs(id) ON DELETE CASCADE,
  clicks_count      int NOT NULL DEFAULT 0,
  signups_count     int NOT NULL DEFAULT 0,
  conversions_count int NOT NULL DEFAULT 0,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_referral_codes_user_program UNIQUE (user_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON public.referral_codes(user_id);

-- 3. Referral Attributions (Visitor Attribution & Lifecycle Tracking)
CREATE TABLE IF NOT EXISTS public.referral_attributions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id                  uuid NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  referral_code            text NOT NULL,
  referrer_user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referrer_organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  referee_user_id          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referee_organization_id  uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  visitor_id               text,
  ip_hash                  text,
  user_agent               text,
  utm_source               text,
  utm_medium               text,
  utm_campaign             text,
  status                   text NOT NULL DEFAULT 'clicked' CHECK (status IN ('clicked', 'signed_up', 'activated', 'converted', 'fraud_blocked', 'expired')),
  first_event_id           uuid REFERENCES public.events(id) ON DELETE SET NULL,
  attributed_at            timestamptz NOT NULL DEFAULT now(),
  signup_at                timestamptz,
  activated_at             timestamptz,
  converted_at             timestamptz,
  expires_at               timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_attributions_code ON public.referral_attributions(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_attributions_referee ON public.referral_attributions(referee_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_attributions_referrer ON public.referral_attributions(referrer_user_id);

-- 4. Referral Events (Audit Log of Milestones)
CREATE TABLE IF NOT EXISTS public.referral_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attribution_id  uuid NOT NULL REFERENCES public.referral_attributions(id) ON DELETE CASCADE,
  event_name      text NOT NULL CHECK (event_name IN ('link_clicked', 'signup_completed', 'email_verified', 'first_event_created', 'checkout_started', 'payment_settled', 'reward_pending', 'reward_approved', 'reward_reversed', 'reward_expired')),
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_events_attribution ON public.referral_events(attribution_id);

-- 5. Referral Conversions (First Eligible Purchase Records)
CREATE TABLE IF NOT EXISTS public.referral_conversions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attribution_id         uuid NOT NULL REFERENCES public.referral_attributions(id) ON DELETE CASCADE,
  referrer_user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  payment_id             text NOT NULL UNIQUE,
  gross_amount_paise     bigint NOT NULL,
  discount_applied_paise bigint NOT NULL DEFAULT 10000, -- ₹100
  net_amount_paise       bigint NOT NULL,
  currency               text NOT NULL DEFAULT 'INR',
  plan_slug              text NOT NULL,
  is_qualifying          boolean NOT NULL DEFAULT true,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee ON public.referral_conversions(referee_user_id);

-- 6. Referral Rewards (Referrer Credit Entitlements)
CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attribution_id           uuid NOT NULL REFERENCES public.referral_attributions(id) ON DELETE CASCADE,
  conversion_id            uuid NOT NULL REFERENCES public.referral_conversions(id) ON DELETE CASCADE,
  referrer_user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referrer_organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  reward_amount_paise      bigint NOT NULL DEFAULT 15000, -- ₹150 credit
  currency                 text NOT NULL DEFAULT 'INR',
  status                   text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'partially_redeemed', 'fully_redeemed', 'reversed', 'expired')),
  hold_until               timestamptz NOT NULL,
  matured_at               timestamptz,
  expires_at               timestamptz NOT NULL DEFAULT (now() + interval '365 days'),
  reversal_reason          text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_reward_conversion UNIQUE (conversion_id)
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON public.referral_rewards(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON public.referral_rewards(status);

-- 7. Referral Credit Transactions (Immutable Financial Ledger)
CREATE TABLE IF NOT EXISTS public.referral_credit_transactions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id           uuid REFERENCES public.referral_rewards(id) ON DELETE SET NULL,
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id     uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  entry_type          text NOT NULL CHECK (entry_type IN ('credit_matured', 'credit_redeemed', 'credit_reversed', 'credit_expired', 'manual_adjustment')),
  amount_paise        bigint NOT NULL,
  balance_after_paise bigint NOT NULL,
  currency            text NOT NULL DEFAULT 'INR',
  invoice_id          uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_credit_tx_user ON public.referral_credit_transactions(user_id, created_at DESC);

-- 8. Referral Fraud Flags (Security & Abuse Prevention)
CREATE TABLE IF NOT EXISTS public.referral_fraud_flags (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attribution_id   uuid REFERENCES public.referral_attributions(id) ON DELETE SET NULL,
  referrer_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_user_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  flag_type        text NOT NULL CHECK (flag_type IN ('self_referral', 'same_vpa', 'same_phone', 'same_ip_burst', 'velocity_limit_exceeded', 'disposable_email', 'suspicious_chargeback', 'manual_flag')),
  severity         text NOT NULL DEFAULT 'high' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details          jsonb NOT NULL DEFAULT '{}'::jsonb,
  resolved         boolean NOT NULL DEFAULT false,
  resolved_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_fraud_flags_referrer ON public.referral_fraud_flags(referrer_user_id);

-- Enable Row Level Security
ALTER TABLE public.referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_fraud_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can read active programs
CREATE POLICY "referral_programs_read" ON public.referral_programs FOR SELECT USING (is_active = true);

-- Users can read their own referral codes
CREATE POLICY "referral_codes_own_read" ON public.referral_codes FOR SELECT USING (user_id = auth.uid());

-- Referrers can read their own attributions (with privacy masking handled in app layer)
CREATE POLICY "referral_attributions_own_read" ON public.referral_attributions FOR SELECT USING (referrer_user_id = auth.uid());

-- Referrers can read their own rewards
CREATE POLICY "referral_rewards_own_read" ON public.referral_rewards FOR SELECT USING (referrer_user_id = auth.uid());

-- Users can read their own credit transactions
CREATE POLICY "referral_credit_tx_own_read" ON public.referral_credit_transactions FOR SELECT USING (user_id = auth.uid());
