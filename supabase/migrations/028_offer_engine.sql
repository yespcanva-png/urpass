-- ============================================================
-- 028: Offer & Coupon Engine
-- Adds: coupons, coupon_redemptions, credits,
--       credit_transactions, referrals
-- Also updates plan prices to V1 pricing and ensures
-- the Business plan exists.
-- ============================================================

-- ── Update plan prices to V1 (values in paise) ──────────────
UPDATE plans SET price_monthly = 0,      price_yearly = 0       WHERE slug = 'free';
UPDATE plans SET price_monthly = 49900,  price_yearly = 499000  WHERE slug = 'starter';
UPDATE plans SET price_monthly = 99900,  price_yearly = 999000  WHERE slug = 'pro';

-- Ensure Business plan exists
INSERT INTO plans (name, slug, price_monthly, price_yearly, max_events, max_attendees, features, is_active)
VALUES (
  'Business', 'business', 249900, 2499000,
  999999, 999999,
  ARRAY['Unlimited events','10000 registrations/month','15 organizer seats','Custom domain, API & webhooks','Advanced permissions','Cross-event analytics'],
  true
)
ON CONFLICT (slug) DO UPDATE
  SET price_monthly = 249900,
      price_yearly  = 2499000,
      is_active     = true;

-- ── Coupons ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code                    text        UNIQUE NOT NULL,
  description             text,
  discount_type           text        NOT NULL CHECK (discount_type IN ('percentage','fixed','free_months')),
  discount_value          numeric     NOT NULL,
  applicable_plans        text[],     -- NULL = all plans
  applicable_products     text[],     -- NULL = all; values: 'subscription','event_pass'
  billing_cycle           text        CHECK (billing_cycle IN ('monthly','annual')),
  duration_months         int,        -- NULL = forever; number of billing cycles discount lasts
  min_purchase_amount     numeric,
  max_discount_amount     numeric,
  start_date              timestamptz,
  expiry_date             timestamptz,
  total_redemption_limit  int,        -- NULL = unlimited
  per_customer_limit      int         NOT NULL DEFAULT 1,
  new_customers_only      boolean     NOT NULL DEFAULT false,
  first_purchase_only     boolean     NOT NULL DEFAULT false,
  stackable               boolean     NOT NULL DEFAULT false,
  is_active               boolean     NOT NULL DEFAULT true,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- ── Coupon redemptions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id               uuid        NOT NULL REFERENCES public.coupons(id),
  user_id                 uuid        NOT NULL REFERENCES auth.users(id),
  plan_slug               text        NOT NULL,
  billing_cycle           text,
  original_amount_rupees  numeric     NOT NULL,
  discount_amount_rupees  numeric     NOT NULL,
  final_amount_rupees     numeric     NOT NULL,
  billing_cycles_remaining int,
  redeemed_at             timestamptz NOT NULL DEFAULT now()
);

-- ── Account credits ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.credits (
  user_id       uuid        PRIMARY KEY REFERENCES auth.users(id),
  balance_paise bigint      NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Credit ledger ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id),
  amount_paise bigint      NOT NULL,
  type         text        NOT NULL CHECK (type IN ('referral_earned','referral_bonus','applied','adjustment','expiry')),
  reference_id uuid,
  description  text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Referrals ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id           uuid        NOT NULL REFERENCES auth.users(id),
  referred_id           uuid        NOT NULL REFERENCES auth.users(id),
  referral_code         text        NOT NULL,
  status                text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','qualified','rewarded')),
  referred_purchased_at timestamptz,
  rewarded_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.coupons             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals           ENABLE ROW LEVEL SECURITY;

-- coupons: any signed-in user can read active coupons
CREATE POLICY "coupons_authenticated_read"
  ON public.coupons FOR SELECT
  TO authenticated
  USING (is_active = true);

-- coupon_redemptions: users manage own rows
CREATE POLICY "coupon_redemptions_own_select"
  ON public.coupon_redemptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "coupon_redemptions_own_insert"
  ON public.coupon_redemptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- credits: users read own
CREATE POLICY "credits_own_select"
  ON public.credits FOR SELECT
  USING (user_id = auth.uid());

-- credit_transactions: users read own
CREATE POLICY "credit_transactions_own_select"
  ON public.credit_transactions FOR SELECT
  USING (user_id = auth.uid());

-- referrals: users read their own referrals
CREATE POLICY "referrals_own_select"
  ON public.referrals FOR SELECT
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "referrals_own_insert"
  ON public.referrals FOR INSERT
  WITH CHECK (referrer_id = auth.uid());

-- ── Seed V1 launch coupons ────────────────────────────────────
INSERT INTO public.coupons (
  code, description,
  discount_type, discount_value,
  applicable_plans, billing_cycle, duration_months,
  per_customer_limit, new_customers_only, first_purchase_only,
  stackable, expiry_date
) VALUES
(
  'WELCOME20',
  '20% off your first 3 months — new URPASS users only',
  'percentage', 20,
  ARRAY['starter','pro','business'], 'monthly', 3,
  1, true, false, false,
  '2026-12-31 23:59:59+00'
),
(
  'FIRSTEVENT50',
  '50% off your first Event Pass — new workspaces only',
  'percentage', 50,
  NULL, NULL, 1,
  1, true, true, false,
  '2026-12-31 23:59:59+00'
)
ON CONFLICT (code) DO NOTHING;
