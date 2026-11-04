-- Additive UK foundation. Apply to staging first; do not reinterpret legacy wall clocks.
-- Existing events.ticket_price is major INR; ticket_types.price is minor INR.
-- Existing payments.*_paise and billing_plan_prices.price_paise are minor INR.
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS country_code text NOT NULL DEFAULT 'IN',
  ADD COLUMN IF NOT EXISTS billing_currency text NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS billing_timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS billing_entity_id text,
  ADD COLUMN IF NOT EXISTS tax_information jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS market_configuration jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS country_code text NOT NULL DEFAULT 'IN',
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en-IN',
  ADD COLUMN IF NOT EXISTS starts_at_utc timestamptz,
  ADD COLUMN IF NOT EXISTS ends_at_utc timestamptz;
-- NULL UTC instants on legacy rows mean the source timezone cannot be proved.
CREATE INDEX IF NOT EXISTS idx_events_country_currency ON public.events(country_code, currency);

ALTER TABLE public.organization_settings
  ADD COLUMN IF NOT EXISTS default_country_code text NOT NULL DEFAULT 'IN',
  ADD COLUMN IF NOT EXISTS default_currency text NOT NULL DEFAULT 'INR';

ALTER TABLE public.org_payment_settings
  ADD COLUMN IF NOT EXISTS gateway_provider text NOT NULL DEFAULT 'razorpay';

ALTER TABLE public.ticket_types
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS price_minor bigint,
  ADD COLUMN IF NOT EXISTS fee_minor bigint,
  ADD COLUMN IF NOT EXISTS tax_minor bigint;
-- The existing price is integer minor units. A NULL alias means read `price`.
-- Future writes must set both fields atomically; do not rewrite historical prices.

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS provider_payment_id text,
  ADD COLUMN IF NOT EXISTS amount_minor bigint,
  ADD COLUMN IF NOT EXISTS refund_status text;
-- Existing gross_amount_paise is minor units; leave amount_minor NULL for historical rows.
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_payment_unique
  ON public.payments(provider, provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;

ALTER TABLE public.organization_payment_accounts
  ADD COLUMN IF NOT EXISTS account_country text NOT NULL DEFAULT 'IN',
  ADD COLUMN IF NOT EXISTS onboarding_status text NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS payouts_enabled boolean NOT NULL DEFAULT false;
-- Existing provider constraint remains India-only until provider approval.

CREATE TABLE IF NOT EXISTS public.privacy_erasure_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id text NOT NULL UNIQUE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'attendee',
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED')),
  records_scrubbed integer NOT NULL DEFAULT 0,
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  notes text
);
CREATE INDEX IF NOT EXISTS idx_privacy_erasure_email ON public.privacy_erasure_requests(email);
ALTER TABLE public.privacy_erasure_requests ENABLE ROW LEVEL SECURITY;
-- Service role bypasses RLS; no browser role may enumerate or mutate requests.
DROP POLICY IF EXISTS "Service role can manage all erasure requests" ON public.privacy_erasure_requests;
DROP POLICY IF EXISTS "Users can view own erasure requests" ON public.privacy_erasure_requests;
CREATE POLICY privacy_erasure_service_only ON public.privacy_erasure_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);
