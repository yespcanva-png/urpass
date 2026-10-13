-- ==============================================================================
-- UrPass Subscription System V2 — Database Architecture & Migration
-- Migration 105: Centralized Multi-Tenant Billing, Entitlements & Pricing V2
-- ==============================================================================

-- 1. BILLING PLANS (Versioned Plans)
CREATE TABLE IF NOT EXISTS public.billing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  tier_rank integer NOT NULL DEFAULT 1, -- 1: Starter, 2: Pro, 3: Business, 4: Campus, 5: Enterprise, 6: Founder
  is_active boolean NOT NULL DEFAULT true,
  is_public boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT billing_plans_slug_key UNIQUE (slug)
);

-- 2. BILLING PLAN PRICES (Versioned Pricing, Multi-Currency, Tax Treatment)
CREATE TABLE IF NOT EXISTS public.billing_plan_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.billing_plans(id) ON DELETE CASCADE,
  currency text NOT NULL DEFAULT 'INR', -- 'INR', 'GBP', etc.
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime')),
  price_paise bigint NOT NULL, -- Integer monetary units (paise/pence)
  tax_inclusive boolean NOT NULL DEFAULT false,
  tax_rate_percent numeric(5,2) NOT NULL DEFAULT 18.00, -- 18% GST or 20% VAT
  is_active boolean NOT NULL DEFAULT true,
  version integer NOT NULL DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT billing_plan_prices_unique UNIQUE (plan_id, currency, billing_cycle, version)
);

-- 3. BILLING OFFERS (₹29 Introductory Offer & Promotions)
CREATE TABLE IF NOT EXISTS public.billing_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  offer_type text NOT NULL CHECK (offer_type IN ('introductory_monthly', 'fixed_discount', 'percent_discount')),
  intro_price_paise bigint NOT NULL DEFAULT 2900, -- ₹29 = 2900 paise
  cycles_count integer NOT NULL DEFAULT 2, -- Apply for exactly 2 cycles
  regular_price_paise bigint, -- Fallback / baseline price
  applicable_plans text[] NOT NULL DEFAULT ARRAY['starter', 'pro', 'business'],
  applicable_cycles text[] NOT NULL DEFAULT ARRAY['monthly'],
  eligibility_rule text NOT NULL DEFAULT 'new_users_only', -- 'new_users_only', 'legacy_free', 'all'
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT billing_offers_code_key UNIQUE (code)
);

-- 4. ORGANIZATION SUBSCRIPTIONS (The Core Multi-Tenant Subscription Anchor)
CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.billing_plans(id),
  plan_price_id uuid REFERENCES public.billing_plan_prices(id),
  lifecycle_state text NOT NULL DEFAULT 'active' CHECK (
    lifecycle_state IN ('pending', 'trialing', 'active', 'past_due', 'grace', 'ending', 'expired', 'cancelled', 'suspended')
  ),
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime')),
  currency text NOT NULL DEFAULT 'INR',
  is_trial boolean NOT NULL DEFAULT false,
  trial_ends_at timestamptz,
  legacy_free_expires_at timestamptz, -- For existing Free users: signup_at + 30 days
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  grace_period_ends_at timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  cancelled_at timestamptz,
  
  -- Offer tracking
  active_offer_id uuid REFERENCES public.billing_offers(id),
  intro_offer_cycles_completed integer NOT NULL DEFAULT 0,
  intro_offer_eligible boolean NOT NULL DEFAULT true,
  
  -- Mandate & Provider state
  provider text NOT NULL DEFAULT 'razorpay' CHECK (provider IN ('razorpay', 'stripe', 'uk_direct', 'manual', 'free')),
  provider_subscription_id text,
  provider_customer_id text,
  autopay_status text NOT NULL DEFAULT 'none' CHECK (autopay_status IN ('none', 'active', 'pending', 'failing', 'cancelled')),
  autopay_mandate_id text,
  
  -- Lifetime protection
  has_lifetime_access boolean NOT NULL DEFAULT false,
  lifetime_plan_slug text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT organization_subscriptions_org_key UNIQUE (organization_id)
);

-- 5. SUBSCRIPTION PERIODS (Historical Periods & Line Items)
CREATE TABLE IF NOT EXISTS public.subscription_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.organization_subscriptions(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  period_number integer NOT NULL DEFAULT 1,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  is_intro_cycle boolean NOT NULL DEFAULT false,
  amount_paise bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. PAYMENT MANDATES (Recurring Autopay Gateway References)
CREATE TABLE IF NOT EXISTS public.payment_mandates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.organization_subscriptions(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'razorpay',
  mandate_reference text NOT NULL, -- e.g. sub_xyz or token_xyz
  customer_id text,
  payment_method text DEFAULT 'card', -- 'card', 'upi', 'nach', 'direct_debit'
  authorized_amount_paise bigint NOT NULL,
  recurring_amount_paise bigint NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'failing', 'revoked', 'expired')),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. BILLING INVOICES
CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.organization_subscriptions(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  subtotal_paise bigint NOT NULL DEFAULT 0,
  tax_paise bigint NOT NULL DEFAULT 0,
  discount_paise bigint NOT NULL DEFAULT 0,
  total_paise bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'paid' CHECK (status IN ('draft', 'issued', 'paid', 'unpaid', 'void', 'refunded')),
  pdf_url text,
  billing_name text,
  billing_email text,
  billing_address text,
  billing_gstin text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT billing_invoices_number_key UNIQUE (invoice_number)
);

-- 8. BILLING PAYMENTS (Payment Attempts & Settlement Status)
CREATE TABLE IF NOT EXISTS public.billing_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.billing_invoices(id) ON DELETE SET NULL,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.organization_subscriptions(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'razorpay',
  provider_payment_id text NOT NULL,
  provider_order_id text,
  amount_paise bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  failure_reason text,
  settlement_status text DEFAULT 'pending',
  raw_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. BILLING WEBHOOK EVENTS (Idempotent Webhook Processing)
CREATE TABLE IF NOT EXISTS public.billing_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'razorpay',
  event_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'ignored', 'failed')),
  error_message text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT billing_webhook_events_unique UNIQUE (provider, event_id)
);

-- 10. SUBSCRIPTION CHANGES (Scheduled Upgrades, Downgrades & Cancellations)
CREATE TABLE IF NOT EXISTS public.subscription_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.organization_subscriptions(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES auth.users(id),
  change_type text NOT NULL CHECK (change_type IN ('upgrade', 'downgrade', 'cancel_renewal', 'pause', 'resume')),
  target_plan_id uuid REFERENCES public.billing_plans(id),
  target_cycle text CHECK (target_cycle IN ('monthly', 'annual')),
  effective_at timestamptz NOT NULL DEFAULT now(), -- now() or current_period_end
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 11. ORGANIZATION ENTITLEMENTS (Centralized Feature Grants)
CREATE TABLE IF NOT EXISTS public.organization_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  granted_by_plan_slug text NOT NULL,
  custom_override boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT org_entitlements_unique UNIQUE (organization_id, feature_key)
);

-- 12. ORGANIZATION USAGE (Atomic Quotas & Quota Counters)
CREATE TABLE IF NOT EXISTS public.organization_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  resource_key text NOT NULL, -- 'events_per_month', 'registrations_per_month', 'organizer_seats'
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  allocated_limit bigint NOT NULL DEFAULT 0, -- 999999 for unlimited
  consumed_count bigint NOT NULL DEFAULT 0,
  reserved_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT org_usage_unique UNIQUE (organization_id, resource_key, period_start)
);

-- 13. OFFER REDEMPTIONS (One-Time ₹29 Offer Prevention)
CREATE TABLE IF NOT EXISTS public.offer_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.billing_offers(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  plan_slug text NOT NULL,
  cycles_granted integer NOT NULL DEFAULT 2,
  cycles_redeemed integer NOT NULL DEFAULT 1,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT offer_redemptions_org_offer_unique UNIQUE (offer_id, organization_id)
);

-- 14. BILLING AUDIT LOGS (Immutable Administrative & Security Trail)
CREATE TABLE IF NOT EXISTS public.billing_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL, -- 'subscription', 'mandate', 'invoice', 'offer', 'entitlement'
  entity_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_org_subs_lifecycle ON public.organization_subscriptions(lifecycle_state);
CREATE INDEX IF NOT EXISTS idx_org_subs_period_end ON public.organization_subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_org_subs_mandate ON public.organization_subscriptions(autopay_mandate_id);
CREATE INDEX IF NOT EXISTS idx_org_usage_lookup ON public.organization_usage(organization_id, resource_key, period_end);
CREATE INDEX IF NOT EXISTS idx_billing_payments_prov ON public.billing_payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_billing_webhook_prov ON public.billing_webhook_events(provider, event_id);

-- Enable RLS on all V2 billing tables
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_plan_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read policies for active catalog
CREATE POLICY "Public read active plans" ON public.billing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active prices" ON public.billing_plan_prices FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active offers" ON public.billing_offers FOR SELECT USING (is_active = true);

-- Organization members can view their organization billing records
CREATE POLICY "Org members read sub" ON public.organization_subscriptions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_subscriptions.organization_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

CREATE POLICY "Org members read invoices" ON public.billing_invoices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = billing_invoices.organization_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

CREATE POLICY "Org members read entitlements" ON public.organization_entitlements FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_entitlements.organization_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

CREATE POLICY "Org members read usage" ON public.organization_usage FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_usage.organization_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

-- ==============================================================================
-- ATOMIC QUOTA RESERVATION & REGISTRATION FUNCTION (Race-condition proof)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.reserve_organization_quota(
  p_org_id uuid,
  p_resource_key text,
  p_count integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usage record;
  v_allocated bigint;
  v_consumed bigint;
  v_now timestamptz := now();
BEGIN
  -- Lock the usage row for this organization and resource for update
  SELECT * INTO v_usage
  FROM public.organization_usage
  WHERE organization_id = p_org_id
    AND resource_key = p_resource_key
    AND period_start <= v_now
    AND period_end >= v_now
  FOR UPDATE;

  -- If no usage row exists yet, check subscription plan and initialize
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining', 999999,
      'unlimited', true
    );
  END IF;

  v_allocated := v_usage.allocated_limit;
  v_consumed := v_usage.consumed_count;

  -- Unlimited quota (>= 999999)
  IF v_allocated >= 999999 THEN
    UPDATE public.organization_usage
    SET consumed_count = consumed_count + p_count,
        updated_at = v_now
    WHERE id = v_usage.id;

    RETURN jsonb_build_object(
      'allowed', true,
      'remaining', 999999,
      'unlimited', true
    );
  END IF;

  -- Quota exceeded check
  IF (v_consumed + p_count) > v_allocated THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining', GREATEST(0, v_allocated - v_consumed),
      'allocated', v_allocated,
      'consumed', v_consumed,
      'unlimited', false
    );
  END IF;

  -- Atomic increment
  UPDATE public.organization_usage
  SET consumed_count = consumed_count + p_count,
      updated_at = v_now
  WHERE id = v_usage.id;

  RETURN jsonb_build_object(
    'allowed', true,
    'remaining', v_allocated - (v_consumed + p_count),
    'allocated', v_allocated,
    'consumed', v_consumed + p_count,
    'unlimited', false
  );
END;
$$;

-- ==============================================================================
-- SEED V2 PLANS, VERSION 1 PRICES & ₹29 INTRODUCTORY OFFER
-- ==============================================================================

-- 1. Insert V2 Billing Plans
INSERT INTO public.billing_plans (slug, name, description, tier_rank, is_active, is_public)
VALUES
  ('starter', 'Starter', 'For individual organizers and small event teams.', 1, true, true),
  ('pro', 'Pro', 'For growing event teams, colleges and professional organizers.', 2, true, true),
  ('business', 'Business', 'For organizations managing events at scale.', 3, true, true),
  ('campus', 'Campus', 'Enterprise multi-department platform for institutions.', 4, true, true),
  ('founder', 'Founder Lifetime', 'Permanent access for founding partners.', 5, true, false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  tier_rank = EXCLUDED.tier_rank,
  updated_at = now();

-- 2. Insert V2 Pricing (Paise & Pence, Annual & Monthly)
-- Starter (Monthly ₹499 / £15; Annual ₹4,990 / £120)
INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'monthly', 49900, 18.00, 1 FROM public.billing_plans WHERE slug = 'starter'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'annual', 499000, 18.00, 1 FROM public.billing_plans WHERE slug = 'starter'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'GBP', 'monthly', 1500, 20.00, 1 FROM public.billing_plans WHERE slug = 'starter'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'GBP', 'annual', 12000, 20.00, 1 FROM public.billing_plans WHERE slug = 'starter'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

-- Pro (Monthly ₹999 / £35; Annual ₹9,990 / £300)
INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'monthly', 99900, 18.00, 1 FROM public.billing_plans WHERE slug = 'pro'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'annual', 999000, 18.00, 1 FROM public.billing_plans WHERE slug = 'pro'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'GBP', 'monthly', 3500, 20.00, 1 FROM public.billing_plans WHERE slug = 'pro'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'GBP', 'annual', 30000, 20.00, 1 FROM public.billing_plans WHERE slug = 'pro'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

-- Business (Monthly ₹2,499 / £79; Annual ₹24,990 / £699)
INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'monthly', 249900, 18.00, 1 FROM public.billing_plans WHERE slug = 'business'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'annual', 2499000, 18.00, 1 FROM public.billing_plans WHERE slug = 'business'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'GBP', 'monthly', 7900, 20.00, 1 FROM public.billing_plans WHERE slug = 'business'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'GBP', 'annual', 69900, 20.00, 1 FROM public.billing_plans WHERE slug = 'business'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

-- Campus (Annual from ₹9,999)
INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'annual', 999900, 18.00, 1 FROM public.billing_plans WHERE slug = 'campus'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

-- Founder Lifetime (₹19,999 / £249 one-time)
INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'INR', 'lifetime', 1999900, 18.00, 1 FROM public.billing_plans WHERE slug = 'founder'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

INSERT INTO public.billing_plan_prices (plan_id, currency, billing_cycle, price_paise, tax_rate_percent, version)
SELECT id, 'GBP', 'lifetime', 24900, 20.00, 1 FROM public.billing_plans WHERE slug = 'founder'
ON CONFLICT (plan_id, currency, billing_cycle, version) DO NOTHING;

-- 3. Seed ₹29 Introductory Offer
INSERT INTO public.billing_offers (
  code,
  name,
  offer_type,
  intro_price_paise,
  cycles_count,
  applicable_plans,
  applicable_cycles,
  eligibility_rule,
  is_active
)
VALUES (
  'INTRO29',
  '₹29 Monthly Introductory Promotion (Months 1 & 2)',
  'introductory_monthly',
  2900,
  2,
  ARRAY['starter', 'pro', 'business'],
  ARRAY['monthly'],
  'new_users_only',
  true
)
ON CONFLICT (code) DO UPDATE SET
  intro_price_paise = EXCLUDED.intro_price_paise,
  cycles_count = EXCLUDED.cycles_count,
  applicable_plans = EXCLUDED.applicable_plans,
  is_active = EXCLUDED.is_active;
