-- 048: Add trial_used_at column to subscriptions
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS trial_used_at timestamptz;
