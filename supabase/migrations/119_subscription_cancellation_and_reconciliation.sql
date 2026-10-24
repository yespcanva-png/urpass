-- ==============================================================================
-- 119: Subscription Cancellation, Reconciliation, and Lifecycle Audit Schema
-- Protects existing subscriptions and invoices; purely additive and backward-compatible.
-- ==============================================================================

-- 1. Extend public.subscriptions with robust cancellation, pending plan change, and provider tracking columns
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS cancellation_state text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS cancellation_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancellation_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancellation_reason text,
  ADD COLUMN IF NOT EXISTS cancellation_error text,
  ADD COLUMN IF NOT EXISTS provider_cancellation_id text,
  ADD COLUMN IF NOT EXISTS pending_plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pending_plan_slug text,
  ADD COLUMN IF NOT EXISTS pending_plan_effective_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_billing_date timestamptz,
  ADD COLUMN IF NOT EXISTS billing_model text DEFAULT 'native_subscription',
  ADD COLUMN IF NOT EXISTS last_reconciled_at timestamptz;

-- 2. Add constraint for cancellation_state if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_subscriptions_cancellation_state'
  ) THEN
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT chk_subscriptions_cancellation_state
      CHECK (cancellation_state IN (
        'none',
        'cancellation_requested',
        'cancellation_pending',
        'cancellation_scheduled',
        'cancellation_confirmed',
        'cancellation_failed'
      ));
  END IF;
END $$;

-- 3. Populate existing cancelled rows so cancellation_state accurately reflects existing cancel_at_period_end
UPDATE public.subscriptions
SET cancellation_state = 'cancellation_scheduled'
WHERE cancel_at_period_end = true
  AND (cancellation_state IS NULL OR cancellation_state = 'none');

-- 4. Create indexes for quick lookup during reconciliation and renewal sweeps
CREATE INDEX IF NOT EXISTS idx_subscriptions_cancellation_state
  ON public.subscriptions(cancellation_state)
  WHERE cancellation_state != 'none';

CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date
  ON public.subscriptions(next_billing_date)
  WHERE next_billing_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_pending_plan
  ON public.subscriptions(pending_plan_effective_at)
  WHERE pending_plan_effective_at IS NOT NULL;

-- 5. Billing Audit Log Table for tracking all lifecycle transitions and provider operations
CREATE TABLE IF NOT EXISTS public.billing_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  provider text DEFAULT 'razorpay',
  provider_reference_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_audit_logs_user_id
  ON public.billing_audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_billing_audit_logs_event_type
  ON public.billing_audit_logs(event_type, created_at DESC);

-- Enable RLS on billing_audit_logs
ALTER TABLE public.billing_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own billing audit logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own billing audit logs' AND tablename = 'billing_audit_logs'
  ) THEN
    CREATE POLICY "Users can view their own billing audit logs"
      ON public.billing_audit_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Service role has full access to billing audit logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on billing audit logs' AND tablename = 'billing_audit_logs'
  ) THEN
    CREATE POLICY "Service role full access on billing audit logs"
      ON public.billing_audit_logs
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
