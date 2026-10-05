-- ============================================================
-- Migration 084: Cashfree Payments Core & Easy Split Architecture
--
-- 1. payments: Authoritative payment records with integer paise precision
-- 2. webhook_events: Idempotent webhook event ledger (replay protection)
-- 3. payment_splits: 2-minute delayed split settlement jobs
-- 4. cashfree_vendors: Easy Split vendor registrations
-- ============================================================

-- ── 1. Payments Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT ('pay_' || replace(gen_random_uuid()::text, '-', '')),
  order_id TEXT NOT NULL UNIQUE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registration_id TEXT,
  ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE SET NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  gross_amount NUMERIC(12,2) NOT NULL,
  gross_amount_paise BIGINT NOT NULL,
  platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  platform_fee_paise BIGINT NOT NULL DEFAULT 0,
  organizer_share NUMERIC(12,2) NOT NULL,
  organizer_share_paise BIGINT NOT NULL,
  cashfree_vendor_id TEXT,
  cashfree_order_id TEXT,
  cashfree_payment_id TEXT,
  payment_session_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'CREATED' CHECK (
    payment_status IN (
      'CREATED',
      'CHECKOUT_READY',
      'PENDING',
      'PAID',
      'FAILED',
      'EXPIRED',
      'REFUNDED',
      'PARTIALLY_REFUNDED'
    )
  ),
  split_status TEXT NOT NULL DEFAULT 'NOT_REQUIRED' CHECK (
    split_status IN (
      'NOT_REQUIRED',
      'SCHEDULED',
      'PROCESSING',
      'SUCCESS',
      'FAILED'
    )
  ),
  settlement_status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (
    settlement_status IN (
      'NOT_STARTED',
      'PENDING',
      'SETTLED',
      'ON_HOLD',
      'FAILED'
    )
  ),
  idempotency_key TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  split_run_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON public.payments(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_org_id ON public.payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_split_status ON public.payments(split_status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_cf_payment_id ON public.payments(cashfree_payment_id) WHERE cashfree_payment_id IS NOT NULL;

-- ── 2. Webhook Events (Replay Protection) ─────────────────────
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'cashfree',
  event_id TEXT NOT NULL UNIQUE,
  order_id TEXT,
  event_type TEXT,
  payload_hash TEXT,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_order_id ON public.webhook_events(order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);

-- ── 3. Payment Splits (Split Jobs with 2-Minute Delay) ─────────
CREATE TABLE IF NOT EXISTS public.payment_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  vendor_id TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  amount_paise BIGINT NOT NULL,
  percentage NUMERIC(5,2),
  status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (
    status IN ('SCHEDULED', 'PROCESSING', 'SUCCESS', 'FAILED')
  ),
  idempotency_key TEXT NOT NULL UNIQUE,
  attempts INT NOT NULL DEFAULT 0,
  run_after TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  last_error TEXT,
  response_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_splits_order_id ON public.payment_splits(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_splits_status_run_after ON public.payment_splits(status, run_after);

-- ── 4. Cashfree Vendors (Easy Split Onboarding) ───────────────
CREATE TABLE IF NOT EXISTS public.cashfree_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cashfree_vendor_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  kyc_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
  bank_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  upi_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  schedule_option INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_cashfree_vendor_org UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_cashfree_vendors_vendor_id ON public.cashfree_vendors(cashfree_vendor_id);
CREATE INDEX IF NOT EXISTS idx_cashfree_vendors_org_id ON public.cashfree_vendors(organization_id);

-- ── 5. Enable Row Level Security ──────────────────────────────
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashfree_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_org_member_select" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = payments.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

CREATE POLICY "payment_splits_org_member_select" ON public.payment_splits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.payments p
      JOIN public.events e ON e.id = p.event_id
      WHERE p.id = payment_splits.payment_id
        AND (e.organizer_id = auth.uid() OR (e.organization_id IS NOT NULL AND is_org_member(e.organization_id)))
    )
  );

CREATE POLICY "cashfree_vendors_org_member_select" ON public.cashfree_vendors
  FOR SELECT USING (is_org_member(organization_id));

-- Service Role Full Permissions
CREATE POLICY "service_role_payments" ON public.payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_webhook_events" ON public.webhook_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_payment_splits" ON public.payment_splits FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_cashfree_vendors" ON public.cashfree_vendors FOR ALL USING (auth.role() = 'service_role');
