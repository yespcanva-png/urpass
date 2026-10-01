-- ============================================================
-- Migration 057: URPASS Managed Payments & Marketplace Split-Settlement
-- 
-- 1. organization_payment_accounts: Marketplace vendor accounts (Razorpay Route / Cashfree)
-- 2. event_payment_configs: Per-event payment mode (URPASS_MANAGED vs ORGANIZER_GATEWAY)
-- 3. ticket_orders: Authoritative financial order entities
-- 4. payment_transactions: Gateway payment ledger
-- 5. payment_transfers: Marketplace split transfers to organizer linked accounts
-- 6. payment_refunds: Refund ledger with automatic transfer reversal
-- 7. settlements: Settlement batches and reconciliation records
-- 8. Passes ticket status expansion for server-side refund invalidation
-- ============================================================

-- ── 1. Organization Payment Accounts (Marketplace KYC & Vendor Onboarding) ──
CREATE TABLE IF NOT EXISTS public.organization_payment_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'RAZORPAY' CHECK (provider IN ('RAZORPAY', 'CASHFREE')),
  provider_vendor_id TEXT, -- e.g. Razorpay linked account 'acc_xxxx'
  kyc_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
  settlement_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (settlement_status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
  bank_verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (bank_verification_status IN ('PENDING', 'VERIFIED', 'FAILED')),
  business_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  settlement_details JSONB NOT NULL DEFAULT '{}'::jsonb, -- Masked bank details & IFSC
  payments_enabled BOOLEAN NOT NULL DEFAULT false,
  refunds_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_org_payment_account UNIQUE (organization_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_org_payment_accounts_org ON public.organization_payment_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_payment_accounts_vendor ON public.organization_payment_accounts(provider_vendor_id);

-- ── 2. Event Payment Configurations ─────────────────────────
CREATE TABLE IF NOT EXISTS public.event_payment_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE UNIQUE,
  payment_mode TEXT NOT NULL DEFAULT 'URPASS_MANAGED' CHECK (payment_mode IN ('URPASS_MANAGED', 'ORGANIZER_GATEWAY')),
  provider TEXT NOT NULL DEFAULT 'RAZORPAY' CHECK (provider IN ('RAZORPAY', 'CASHFREE')),
  provider_linked_account_id TEXT,
  fee_bearer TEXT NOT NULL DEFAULT 'ATTENDEE' CHECK (fee_bearer IN ('ATTENDEE', 'ORGANIZER', 'SPLIT')),
  platform_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 2.00,
  platform_fee_fixed_inr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  gateway_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 2.00,
  gateway_fee_fixed_inr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  refund_policy TEXT NOT NULL DEFAULT 'ORGANIZER_DISCRETION' CHECK (refund_policy IN ('NON_REFUNDABLE', 'FLEXIBLE_24H', 'ORGANIZER_DISCRETION')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_payment_configs_event ON public.event_payment_configs(event_id);

-- ── 3. Ticket Orders ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ticket_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE SET NULL,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  reservation_id UUID REFERENCES public.ticket_reservations(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  currency TEXT NOT NULL DEFAULT 'INR',
  subtotal NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  gateway_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12,2) NOT NULL,
  organizer_share NUMERIC(12,2) NOT NULL,
  fee_bearer TEXT NOT NULL DEFAULT 'ATTENDEE',
  payment_mode TEXT NOT NULL DEFAULT 'URPASS_MANAGED' CHECK (payment_mode IN ('URPASS_MANAGED', 'ORGANIZER_GATEWAY')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED')),
  order_status TEXT NOT NULL DEFAULT 'CREATED' CHECK (order_status IN ('CREATED', 'PROCESSING', 'CONFIRMED', 'CANCELLED', 'REFUNDED')),
  provider TEXT NOT NULL DEFAULT 'RAZORPAY',
  provider_order_id TEXT,
  provider_payment_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_orders_event ON public.ticket_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_orders_org ON public.ticket_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_ticket_orders_provider_order ON public.ticket_orders(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_ticket_orders_status ON public.ticket_orders(payment_status, order_status);

-- ── 4. Payment Transactions ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_payment_id TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'REFUNDED')),
  payment_method TEXT,
  captured_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  raw_provider_reference JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_id ON public.payment_transactions(provider_payment_id);

-- ── 5. Payment Transfers (Split / Razorpay Route) ─────────────
CREATE TABLE IF NOT EXISTS public.payment_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'RAZORPAY',
  linked_account_id TEXT NOT NULL,
  gross_amount NUMERIC(12,2) NOT NULL,
  platform_fee NUMERIC(12,2) NOT NULL,
  organizer_share NUMERIC(12,2) NOT NULL,
  provider_transfer_id TEXT, -- e.g. Razorpay Route transfer 'trf_xxxx'
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED', 'REVERSED', 'ON_HOLD')),
  settlement_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transfers_order ON public.payment_transfers(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transfers_linked ON public.payment_transfers(linked_account_id);

-- ── 6. Payment Refunds ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'PROCESSING', 'PROCESSED', 'FAILED')),
  provider_refund_id TEXT,
  reverse_transfer BOOLEAN NOT NULL DEFAULT true,
  requested_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_refunds_order ON public.payment_refunds(order_id);

-- ── 7. Settlements ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'RAZORPAY',
  provider_settlement_id TEXT,
  gross_amount NUMERIC(12,2) NOT NULL,
  platform_fees NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  gateway_fees NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  refunds NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  adjustments NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  net_settlement NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SETTLED', 'FAILED', 'ON_HOLD')),
  expected_settlement_date DATE,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settlements_org ON public.settlements(organization_id);

-- ── 8. Expand passes status for server-side ticket invalidation ─
DO $$
BEGIN
  -- Add ticket_status column if not already present
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'passes' AND column_name = 'ticket_status'
  ) THEN
    ALTER TABLE public.passes 
      ADD COLUMN ticket_status TEXT NOT NULL DEFAULT 'VALID'
      CHECK (ticket_status IN ('VALID', 'USED', 'REFUNDED', 'CANCELLED', 'BLOCKED'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_passes_ticket_status ON public.passes(ticket_status);

-- ── 9. Enable RLS on all tables ───────────────────────────────
ALTER TABLE public.organization_payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_payment_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- Organization Members can view and manage their organization payment data
CREATE POLICY "org_payment_accounts_member_select" ON public.organization_payment_accounts
  FOR SELECT USING (is_org_member(organization_id));

CREATE POLICY "event_payment_configs_member_select" ON public.event_payment_configs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_payment_configs.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

CREATE POLICY "ticket_orders_organizer_select" ON public.ticket_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_orders.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

CREATE POLICY "settlements_organizer_select" ON public.settlements
  FOR SELECT USING (is_org_member(organization_id));

-- Service role has full permissions for backend operations and webhooks
CREATE POLICY "service_role_org_payment_accounts" ON public.organization_payment_accounts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_event_payment_configs" ON public.event_payment_configs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_ticket_orders" ON public.ticket_orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_payment_transactions" ON public.payment_transactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_payment_transfers" ON public.payment_transfers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_payment_refunds" ON public.payment_refunds FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_settlements" ON public.settlements FOR ALL USING (auth.role() = 'service_role');
