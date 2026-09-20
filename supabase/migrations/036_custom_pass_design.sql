-- ============================================================
-- Migration 036: Custom Pass Design for Pro Users
-- ============================================================

-- Add custom_pass_design JSONB to profiles (default organizer pass design)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS custom_pass_design JSONB DEFAULT NULL;

-- Add custom_pass_design JSONB to events (event-level override)
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS custom_pass_design JSONB DEFAULT NULL;

COMMENT ON COLUMN public.profiles.custom_pass_design IS 
  'Default custom ticket pass design configuration (theme, colors, pattern, font, header style, footer note)';

COMMENT ON COLUMN public.events.custom_pass_design IS 
  'Event-specific custom ticket pass design override. If NULL, inherits from organizer profile custom_pass_design';
