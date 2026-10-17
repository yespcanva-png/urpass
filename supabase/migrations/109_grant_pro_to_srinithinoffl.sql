-- Grant Pro plan to srinithinoffl@gmail.com
-- Idempotent upsert across legacy subscriptions and Subscription V2 organization_subscriptions

-- 1. Upgrade public.subscriptions
INSERT INTO subscriptions (
  user_id,
  plan_id,
  status,
  provider,
  billing_cycle,
  current_period_start,
  current_period_end,
  is_trial,
  cancel_at_period_end
)
SELECT
  u.id,
  p.id,
  'active',
  'manual',
  'monthly',
  now(),
  now() + interval '100 years',
  false,
  false
FROM auth.users u
CROSS JOIN plans p
WHERE lower(u.email) = 'srinithinoffl@gmail.com'
  AND p.slug = 'pro'
ON CONFLICT (user_id) DO UPDATE SET
  plan_id               = EXCLUDED.plan_id,
  status                = 'active',
  provider              = 'manual',
  billing_cycle         = 'monthly',
  is_trial              = false,
  current_period_end    = EXCLUDED.current_period_end,
  cancel_at_period_end  = false,
  updated_at            = now();

-- 2. Upgrade organization_subscriptions (V2) for their organization(s)
INSERT INTO organization_subscriptions (
  organization_id,
  plan_id,
  plan_price_id,
  lifecycle_state,
  billing_cycle,
  currency,
  is_trial,
  provider,
  current_period_start,
  current_period_end,
  cancel_at_period_end
)
SELECT
  o.id,
  bp.id,
  bpp.id,
  'active',
  'monthly',
  'INR',
  false,
  'manual',
  now(),
  now() + interval '100 years',
  false
FROM auth.users u
JOIN organizations o ON o.created_by = u.id
CROSS JOIN billing_plans bp
LEFT JOIN billing_plan_prices bpp ON bpp.plan_id = bp.id AND bpp.currency = 'INR' AND bpp.billing_cycle = 'monthly'
WHERE lower(u.email) = 'srinithinoffl@gmail.com'
  AND bp.slug = 'pro'
ON CONFLICT (organization_id) DO UPDATE SET
  plan_id              = EXCLUDED.plan_id,
  plan_price_id        = EXCLUDED.plan_price_id,
  lifecycle_state      = 'active',
  billing_cycle        = 'monthly',
  is_trial             = false,
  provider             = 'manual',
  current_period_end   = EXCLUDED.current_period_end,
  cancel_at_period_end = false,
  updated_at           = now();
