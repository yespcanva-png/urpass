-- ============================================================
-- Migration 056: User Unlocked Ticket Templates
-- Persists organizer unlocked ticket templates permanently across all devices.
-- ============================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS unlocked_templates TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.unlocked_templates IS
  'Array of template IDs or ["all"] unlocked by this organizer profile.';
