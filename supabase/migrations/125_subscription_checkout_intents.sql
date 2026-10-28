-- A single pending authorization per organizer prevents duplicate Razorpay subscriptions.
CREATE TABLE IF NOT EXISTS public.subscription_checkout_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_slug text NOT NULL CHECK (plan_slug IN ('starter', 'pro', 'business')),
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  currency text NOT NULL,
  amount_paise bigint NOT NULL CHECK (amount_paise > 0),
  provider_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'cancelled', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS subscription_checkout_one_pending_per_user
  ON public.subscription_checkout_intents (user_id) WHERE status = 'pending';

ALTER TABLE public.subscription_checkout_intents ENABLE ROW LEVEL SECURITY;
-- Only the server service role writes checkout intents. Account holders may inspect their own.
DROP POLICY IF EXISTS "checkout_intents_owner_read" ON public.subscription_checkout_intents;
CREATE POLICY "checkout_intents_owner_read" ON public.subscription_checkout_intents
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
