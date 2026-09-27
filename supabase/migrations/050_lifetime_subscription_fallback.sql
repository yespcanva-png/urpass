-- ============================================================
-- Migration 050: Support Lifetime Access Fallback
-- Ensures lifetime plan users maintain their permanent license
-- even when subscribing to/cancelling temporary upgrade tiers.
-- ============================================================

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS has_lifetime_access boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS lifetime_plan_slug text DEFAULT NULL;

-- Backfill any existing founder/lifetime subscriptions
UPDATE subscriptions s
SET has_lifetime_access = true,
    lifetime_plan_slug = 'founder'
FROM plans p
WHERE s.plan_id = p.id AND (p.slug = 'founder' OR s.billing_cycle = 'lifetime');
