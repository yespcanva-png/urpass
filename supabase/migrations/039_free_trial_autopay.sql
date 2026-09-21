-- 039: 30-Day Free Trial and AutoPay support
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS trial_used boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_plan text,
  ADD COLUMN IF NOT EXISTS trial_starts_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_trial boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS autopay_mandate_id text,
  ADD COLUMN IF NOT EXISTS autopay_status text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS reminded_7_days boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminded_3_days boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminded_1_day boolean NOT NULL DEFAULT false;

-- Create index for quick trial expiration & reminder lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_trial_ends_at 
  ON public.subscriptions(trial_ends_at) 
  WHERE is_trial = true;

CREATE INDEX IF NOT EXISTS idx_subscriptions_trial_used 
  ON public.subscriptions(user_id, trial_used);
