-- Migration 055: Ops Settings and System Configuration
-- Stores operational security parameters such as the Ops Dashboard PIN in the database.

CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Seed ops_pin with default 260203 if not already present in the database
INSERT INTO public.system_settings (key, value, description)
VALUES ('ops_pin', '"260203"'::jsonb, 'Operational Command Center access PIN')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only service role has full access to system_settings, keeping the PIN confidential
DROP POLICY IF EXISTS "system_settings_service_role" ON public.system_settings;
CREATE POLICY "system_settings_service_role" ON public.system_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);
