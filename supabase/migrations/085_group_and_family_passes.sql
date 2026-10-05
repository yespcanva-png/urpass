-- ============================================================
-- Migration 085: Group & Family Passes with Duration Variants,
-- Included Guests & Extra Guest Pricing
-- ============================================================

-- ── 1. Enhance ticket_types with Group & Duration Configuration ──
ALTER TABLE public.ticket_types
  ADD COLUMN IF NOT EXISTS duration_label TEXT DEFAULT '1 Day',
  ADD COLUMN IF NOT EXISTS duration_days INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_group_pass BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS included_guests INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS min_guests INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS max_guests INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS allow_extra_guests BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS extra_guest_price NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS max_extra_guests INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pass_validity TEXT DEFAULT '1 Day',
  ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'GENERAL';

-- ── 2. Enhance passes with Group Member Details & Check-In Tracking ──
ALTER TABLE public.passes
  ADD COLUMN IF NOT EXISTS total_guests INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS checked_in_guests INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group_members JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pass_duration TEXT DEFAULT '1 Day',
  ADD COLUMN IF NOT EXISTS is_group_pass BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_passes_is_group_pass ON public.passes(is_group_pass);

-- ── 3. Enhance ticket_orders with Capacity Units & Extra Guest Ledger ──
ALTER TABLE public.ticket_orders
  ADD COLUMN IF NOT EXISTS total_attendee_count INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS extra_guests_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS extra_guests_amount NUMERIC(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS group_members JSONB DEFAULT '[]'::jsonb;

-- ── 4. Enhance payments table if present ─────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
    ALTER TABLE public.payments
      ADD COLUMN IF NOT EXISTS total_attendee_count INT DEFAULT 1,
      ADD COLUMN IF NOT EXISTS extra_guests_count INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS extra_guests_amount NUMERIC(12,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS group_members JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;
