-- Grant Pro plan to yespcorpindia@gmail.com.
-- Uses ON CONFLICT to safely upsert whether or not a subscription row already exists.
INSERT INTO subscriptions (user_id, plan_id, status, provider, current_period_start, current_period_end)
SELECT
  u.id,
  p.id,
  'active',
  'manual',
  now(),
  now() + interval '100 years'
FROM auth.users u
CROSS JOIN plans p
WHERE u.email = 'yespcorpindia@gmail.com'
  AND p.slug   = 'pro'
ON CONFLICT (user_id) DO UPDATE SET
  plan_id               = EXCLUDED.plan_id,
  status                = 'active',
  provider              = 'manual',
  current_period_end    = EXCLUDED.current_period_end,
  cancel_at_period_end  = false,
  updated_at            = now();
