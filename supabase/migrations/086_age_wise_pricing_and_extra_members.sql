-- ============================================================
-- Migration 086: Age-Wise Pricing System & Extra Member Support
-- Corporate Multi-Tier Ticket Configuration & Age-Based Roster
-- ============================================================

-- ── 1. Enhance ticket_types with Age Pricing & Extra Member Modes ──
ALTER TABLE public.ticket_types
  ADD COLUMN IF NOT EXISTS age_pricing_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS age_tiers JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS extra_member_pricing_mode TEXT DEFAULT 'flat';

-- ── 2. Enhance passes with Age Classification ──
ALTER TABLE public.passes
  ADD COLUMN IF NOT EXISTS attendee_age INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS age_tier_label TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS age_tier_id TEXT DEFAULT NULL;

-- ── 3. Enhance attendees with Age Details ──
ALTER TABLE public.attendees
  ADD COLUMN IF NOT EXISTS age INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS age_tier_label TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS age_tier_id TEXT DEFAULT NULL;

-- ── 4. Enhance ticket_orders with Age Selection Details ──
ALTER TABLE public.ticket_orders
  ADD COLUMN IF NOT EXISTS age_tier_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS age_tier_label TEXT DEFAULT NULL;

COMMENT ON COLUMN public.ticket_types.age_pricing_enabled IS 'When true, price is determined by attendee age brackets configured in age_tiers JSONB';
COMMENT ON COLUMN public.ticket_types.age_tiers IS 'Array of AgeTierPricing objects with label, min_age, max_age, price in paise, is_free, and badge_label';
COMMENT ON COLUMN public.ticket_types.extra_member_pricing_mode IS 'Pricing strategy for extra accompanying members: "flat" or "age_based"';
