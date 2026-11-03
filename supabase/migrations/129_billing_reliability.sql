-- Additive billing identities and recoverable webhook claims. No customer rows are changed.
ALTER TABLE public.subscription_checkout_intents
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;
UPDATE public.subscription_checkout_intents
  SET expires_at = created_at + interval '30 minutes'
  WHERE status = 'pending' AND expires_at IS NULL;
ALTER TABLE public.subscription_checkout_intents
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '30 minutes');
CREATE INDEX IF NOT EXISTS subscription_checkout_pending_expiry
  ON public.subscription_checkout_intents(expires_at) WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS public.token_mandate_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_payment_id text NOT NULL UNIQUE,
  provider_order_id text NOT NULL UNIQUE,
  provider_customer_id text NOT NULL,
  token_id text NOT NULL,
  plan_id uuid REFERENCES public.plans(id),
  amount_paise bigint NOT NULL CHECK (amount_paise > 0),
  currency text NOT NULL CHECK (currency = 'INR'),
  is_trial boolean NOT NULL DEFAULT false,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.token_mandate_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY token_mandate_payment_owner_read ON public.token_mandate_payments
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- A replay returns its original period. The row lock serializes other payments for this user.
CREATE OR REPLACE FUNCTION public.activate_token_mandate_payment(
  p_user_id uuid, p_payment_id text, p_order_id text, p_customer_id text,
  p_token_id text, p_plan_id uuid, p_amount_paise bigint, p_is_trial boolean,
  p_period_start timestamptz, p_period_end timestamptz
) RETURNS TABLE(subscription_id uuid, replayed boolean, effective_period_end timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_existing public.token_mandate_payments%ROWTYPE; v_sub_id uuid;
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service role required'; END IF;
  IF p_period_end <= p_period_start OR p_amount_paise <= 0 THEN RAISE EXCEPTION 'invalid billing period'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
  SELECT * INTO v_existing FROM public.token_mandate_payments
    WHERE provider_payment_id = p_payment_id OR provider_order_id = p_order_id FOR UPDATE;
  IF FOUND THEN
    IF v_existing.user_id <> p_user_id OR v_existing.provider_payment_id <> p_payment_id
       OR v_existing.provider_order_id <> p_order_id OR v_existing.plan_id IS DISTINCT FROM p_plan_id THEN
      RAISE EXCEPTION 'payment belongs to another checkout';
    END IF;
    SELECT id INTO v_sub_id FROM public.subscriptions WHERE user_id = p_user_id;
    RETURN QUERY SELECT v_sub_id, true, v_existing.period_end;
    RETURN;
  END IF;

  INSERT INTO public.token_mandate_payments
    (user_id, provider_payment_id, provider_order_id, provider_customer_id, token_id,
     plan_id, amount_paise, currency, is_trial, period_start, period_end)
  VALUES (p_user_id, p_payment_id, p_order_id, p_customer_id, p_token_id,
          p_plan_id, p_amount_paise, 'INR', p_is_trial, p_period_start, p_period_end);

  INSERT INTO public.subscriptions AS s
    (user_id, plan_id, status, provider, billing_cycle, provider_customer_id,
     autopay_mandate_id, autopay_status, autopay_currency, autopay_confirmed_at,
     current_period_start, current_period_end, next_billing_date, registrations_used,
     is_trial, trial_starts_at, trial_ends_at, free_event_trial_active,
     free_event_trial_consumed, trial_events_quota, trial_events_created,
     autopay_max_amount_paise, cancel_at_period_end, cancellation_state, updated_at)
  VALUES (p_user_id, p_plan_id, CASE WHEN p_is_trial THEN 'trialing' ELSE 'active' END,
          'razorpay', 'monthly', p_customer_id, p_token_id, 'active', 'INR', now(),
          CASE WHEN p_is_trial THEN NULL ELSE p_period_start END,
          CASE WHEN p_is_trial THEN NULL ELSE p_period_end END,
          CASE WHEN p_is_trial THEN NULL ELSE p_period_end END, 0,
          p_is_trial, CASE WHEN p_is_trial THEN p_period_start ELSE NULL END,
          CASE WHEN p_is_trial THEN p_period_end ELSE NULL END,
          p_is_trial, false, CASE WHEN p_is_trial THEN 1 ELSE NULL END,
          CASE WHEN p_is_trial THEN 0 ELSE NULL END,
          p_amount_paise, false, 'none', now())
  ON CONFLICT (user_id) DO UPDATE SET
    plan_id = EXCLUDED.plan_id, status = EXCLUDED.status, provider = EXCLUDED.provider,
    billing_cycle = EXCLUDED.billing_cycle, provider_customer_id = EXCLUDED.provider_customer_id,
    autopay_mandate_id = EXCLUDED.autopay_mandate_id, autopay_status = EXCLUDED.autopay_status,
    autopay_currency = EXCLUDED.autopay_currency, autopay_confirmed_at = EXCLUDED.autopay_confirmed_at,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end, next_billing_date = EXCLUDED.next_billing_date,
    registrations_used = 0, is_trial = EXCLUDED.is_trial,
    trial_starts_at = EXCLUDED.trial_starts_at, trial_ends_at = EXCLUDED.trial_ends_at,
    free_event_trial_active = EXCLUDED.free_event_trial_active,
    free_event_trial_consumed = EXCLUDED.free_event_trial_consumed,
    trial_events_quota = EXCLUDED.trial_events_quota,
    trial_events_created = EXCLUDED.trial_events_created,
    autopay_max_amount_paise = EXCLUDED.autopay_max_amount_paise,
    cancel_at_period_end = false, cancellation_state = 'none', updated_at = now()
  RETURNING id INTO v_sub_id;
  RETURN QUERY SELECT v_sub_id, false, p_period_end;
END $$;
REVOKE ALL ON FUNCTION public.activate_token_mandate_payment(uuid,text,text,text,text,uuid,bigint,boolean,timestamptz,timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.activate_token_mandate_payment(uuid,text,text,text,text,uuid,bigint,boolean,timestamptz,timestamptz) TO service_role;

ALTER TABLE public.processed_webhook_events
  ADD COLUMN IF NOT EXISTS retry_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lease_until timestamptz,
  ADD COLUMN IF NOT EXISTS raw_body text,
  ADD COLUMN IF NOT EXISTS signature text;
CREATE INDEX IF NOT EXISTS processed_webhook_recovery_due
  ON public.processed_webhook_events(lease_until)
  WHERE status IN ('processing', 'failed');

CREATE OR REPLACE FUNCTION public.claim_razorpay_webhook(
  p_event_id text, p_event_type text, p_payload_hash text, p_raw_body text, p_signature text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_row public.processed_webhook_events%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service role required'; END IF;
  INSERT INTO public.processed_webhook_events
    (provider, event_id, event_type, payload_hash, status, raw_body, signature, lease_until, retry_count)
  VALUES ('razorpay', p_event_id, p_event_type, p_payload_hash, 'processing', p_raw_body,
          p_signature, now() + interval '2 minutes', 1)
  ON CONFLICT (provider, event_id) DO NOTHING;
  IF FOUND THEN RETURN 'claimed'; END IF;
  SELECT * INTO v_row FROM public.processed_webhook_events
    WHERE provider = 'razorpay' AND event_id = p_event_id FOR UPDATE;
  IF v_row.payload_hash <> p_payload_hash THEN RETURN 'mismatch'; END IF;
  IF v_row.status = 'completed' THEN RETURN 'completed'; END IF;
  IF v_row.status = 'processing' AND v_row.lease_until > now() THEN RETURN 'busy'; END IF;
  UPDATE public.processed_webhook_events SET status = 'processing', error_message = NULL,
    lease_until = now() + interval '2 minutes', retry_count = retry_count + 1,
    raw_body = p_raw_body, signature = p_signature
  WHERE id = v_row.id;
  RETURN 'claimed';
END $$;
REVOKE ALL ON FUNCTION public.claim_razorpay_webhook(text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_razorpay_webhook(text,text,text,text,text) TO service_role;
