-- ==============================================================================
-- UrPass Migration 118: Production-Ready Pricing, Billing & Managed Service Orders
-- Normalized entities for Self-Service Subscriptions and Remote Managed Services
-- ==============================================================================

-- 1. MANAGED SERVICE PACKAGES (Catalog of One-Time Event Services)
CREATE TABLE IF NOT EXISTS public.managed_service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE, -- 'essential', 'pro', 'premium', 'enterprise'
  name text NOT NULL,
  description text,
  max_attendees integer NOT NULL,
  price_inr_paise bigint NOT NULL,
  tax_rate_percent numeric(5,2) NOT NULL DEFAULT 18.00,
  included_training_sessions integer NOT NULL DEFAULT 1,
  support_level text NOT NULL DEFAULT 'standard', -- 'standard', 'priority', 'dedicated'
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed Packages
INSERT INTO public.managed_service_packages (code, name, description, max_attendees, price_inr_paise, included_training_sessions, support_level)
VALUES 
  ('essential', 'Essential Remote Setup', 'Up to 1,000 attendees. Complete event configuration, registration form setup, ticket setup, QR pass configuration, and 1 remote training session.', 1000, 299900, 1, 'standard'),
  ('pro', 'Pro Remote Management', 'Up to 5,000 attendees. All Essential features plus bulk guest import, group QR configuration, multi-gate setup, WhatsApp template configuration, and 2 remote training sessions.', 5000, 799900, 2, 'priority'),
  ('premium', 'Premium Remote Operations', 'Up to 15,000 attendees. All Pro features plus complex registration logic, session-wise attendance, pre-event rehearsal, dedicated remote contact, and 3 remote training sessions.', 15000, 1499900, 3, 'dedicated')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  max_attendees = EXCLUDED.max_attendees,
  price_inr_paise = EXCLUDED.price_inr_paise,
  included_training_sessions = EXCLUDED.included_training_sessions,
  support_level = EXCLUDED.support_level,
  updated_at = now();

-- 2. MANAGED SERVICE ORDERS (One-Time Event Scope with 50% Deposit & 50% Balance)
CREATE TABLE IF NOT EXISTS public.managed_service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  package_code text NOT NULL REFERENCES public.managed_service_packages(code),
  
  -- Event Details
  event_name text NOT NULL,
  event_date timestamptz,
  city text,
  estimated_attendees integer NOT NULL,
  extra_attendees_purchased integer NOT NULL DEFAULT 0,
  
  -- Financials in Integer Paise
  base_price_paise bigint NOT NULL,
  extra_attendee_price_paise bigint NOT NULL DEFAULT 0,
  discount_paise bigint NOT NULL DEFAULT 0,
  tax_paise bigint NOT NULL,
  total_amount_paise bigint NOT NULL,
  
  -- 50% Deposit & 50% Balance Structure
  deposit_required_paise bigint NOT NULL,
  deposit_paid_paise bigint NOT NULL DEFAULT 0,
  deposit_paid_at timestamptz,
  deposit_payment_id text,
  
  balance_required_paise bigint NOT NULL,
  balance_paid_paise bigint NOT NULL DEFAULT 0,
  balance_paid_at timestamptz,
  balance_payment_id text,
  
  -- Order Status
  status text NOT NULL DEFAULT 'quote_pending' CHECK (
    status IN (
      'quote_pending', 
      'quote_accepted', 
      'deposit_pending', 
      'deposit_paid', 
      'setup_in_progress', 
      'client_review', 
      'balance_pending', 
      'balance_paid', 
      'ready_for_event', 
      'completed', 
      'cancelled', 
      'refunded'
    )
  ),
  
  -- Operational Details
  assigned_ops_lead text,
  training_sessions_conducted integer NOT NULL DEFAULT 0,
  rehearsal_completed boolean NOT NULL DEFAULT false,
  remote_support_notes text,
  
  -- Billing & Tax Details
  billing_name text NOT NULL,
  billing_email text NOT NULL,
  billing_phone text NOT NULL,
  billing_address text,
  billing_gstin text,
  billing_state text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. MANAGED SERVICE ORDER PAYMENTS (Tracks Individual Deposit, Balance, or Addon Payments)
CREATE TABLE IF NOT EXISTS public.managed_service_order_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.managed_service_orders(id) ON DELETE CASCADE,
  payment_type text NOT NULL CHECK (payment_type IN ('deposit', 'balance', 'extra_attendees', 'full', 'refund')),
  amount_paise bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  provider text NOT NULL DEFAULT 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  receipt_number text,
  raw_payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. BILLING AUDIT LOGS (Financial & Entitlement Integrity Trail)
CREATE TABLE IF NOT EXISTS public.billing_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid, -- user_id or organization_id
  account_type text NOT NULL DEFAULT 'user' CHECK (account_type IN ('user', 'organization')),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text,
  action text NOT NULL, -- 'subscription_created', 'plan_upgraded', 'plan_downgraded', 'autopay_mandate_verified', 'renewal_succeeded', 'renewal_failed', 'cancellation_scheduled', 'managed_order_placed', 'deposit_collected', 'balance_collected', 'entitlement_override'
  entity_type text NOT NULL, -- 'subscription', 'invoice', 'payment', 'managed_order', 'mandate'
  entity_id text NOT NULL,
  previous_state jsonb,
  new_state jsonb,
  notes text,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_managed_service_orders_user ON public.managed_service_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_managed_service_orders_org ON public.managed_service_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_managed_service_orders_status ON public.managed_service_orders(status);
CREATE INDEX IF NOT EXISTS idx_managed_order_payments_order ON public.managed_service_order_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_billing_audit_log_account ON public.billing_audit_log(account_id);
CREATE INDEX IF NOT EXISTS idx_billing_audit_log_entity ON public.billing_audit_log(entity_type, entity_id);

-- Row Level Security
ALTER TABLE public.managed_service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managed_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managed_service_order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_audit_log ENABLE ROW LEVEL SECURITY;

-- Public can view active packages
CREATE POLICY "Public can view active managed packages"
  ON public.managed_service_packages FOR SELECT
  USING (is_active = true);

-- Users can view their own orders
CREATE POLICY "Users can view own managed orders"
  ON public.managed_service_orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can view their own order payments
CREATE POLICY "Users can view own managed order payments"
  ON public.managed_service_order_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.managed_service_orders o
      WHERE o.id = managed_service_order_payments.order_id
      AND o.user_id = auth.uid()
    )
  );

-- Service role has full control
CREATE POLICY "Service role full access on managed_service_packages"
  ON public.managed_service_packages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on managed_service_orders"
  ON public.managed_service_orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on managed_service_order_payments"
  ON public.managed_service_order_payments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on billing_audit_log"
  ON public.billing_audit_log FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
