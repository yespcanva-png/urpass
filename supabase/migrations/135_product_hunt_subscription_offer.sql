ALTER TABLE public.subscription_checkout_intents
  ADD COLUMN IF NOT EXISTS promo_code text;

CREATE UNIQUE INDEX IF NOT EXISTS subscription_checkout_producthunt50_once
  ON public.subscription_checkout_intents (user_id)
  WHERE promo_code = 'PRODUCTHUNT50' AND status = 'authorized';
