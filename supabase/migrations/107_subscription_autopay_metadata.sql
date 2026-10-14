-- Store Razorpay recurring mandate metadata for paid onboarding renewals.
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS provider_customer_id text,
  ADD COLUMN IF NOT EXISTS autopay_max_amount_paise integer,
  ADD COLUMN IF NOT EXISTS autopay_currency text DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS autopay_confirmed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_customer_id
  ON public.subscriptions(provider_customer_id)
  WHERE provider_customer_id IS NOT NULL;

