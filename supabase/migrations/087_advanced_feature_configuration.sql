-- 087: Advanced feature configuration foundation
-- M00 creates first-class, auditable event-level activation for optional modules.

CREATE TABLE IF NOT EXISTS public.platform_feature_flags (
  feature_key TEXT PRIMARY KEY,
  module_code TEXT NOT NULL,
  name TEXT NOT NULL,
  platform_available BOOLEAN NOT NULL DEFAULT TRUE,
  rollout_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_feature_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  required_config_valid BOOLEAN NOT NULL DEFAULT TRUE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  validation_errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT event_feature_settings_event_feature_key UNIQUE (event_id, feature_key),
  CONSTRAINT event_feature_settings_platform_key_fk
    FOREIGN KEY (feature_key)
    REFERENCES public.platform_feature_flags(feature_key)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS public.event_feature_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('enabled', 'disabled', 'configured', 'validated')),
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_feature_settings_event
  ON public.event_feature_settings(event_id);

CREATE INDEX IF NOT EXISTS idx_event_feature_settings_feature
  ON public.event_feature_settings(feature_key);

CREATE INDEX IF NOT EXISTS idx_event_feature_audit_event
  ON public.event_feature_audit_logs(event_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_feature_audit_feature
  ON public.event_feature_audit_logs(feature_key, created_at DESC);

DROP TRIGGER IF EXISTS trg_platform_feature_flags_updated_at ON public.platform_feature_flags;
CREATE TRIGGER trg_platform_feature_flags_updated_at
  BEFORE UPDATE ON public.platform_feature_flags
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_event_feature_settings_updated_at ON public.event_feature_settings;
CREATE TRIGGER trg_event_feature_settings_updated_at
  BEFORE UPDATE ON public.event_feature_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

INSERT INTO public.platform_feature_flags (feature_key, module_code, name, platform_available)
VALUES
  ('bulk_ticket_booking', 'M01', 'Bulk Ticket Booking', TRUE),
  ('ticket_distribution', 'M02', 'Ticket Distribution & Member Management', TRUE),
  ('member_registration_forms', 'M03', 'Member Registration Forms', TRUE),
  ('serial_number_validation', 'M04', 'Serial Number Management', TRUE),
  ('ticket_reassignment', 'M05', 'Digital QR & Ticket Reassignment', TRUE),
  ('advanced_entry_tracking', 'M06', 'Event Entry, Exit & Multi-Gate Tracking', TRUE),
  ('session_attendance', 'M07', 'Session-Wise Attendance', TRUE),
  ('csv_management', 'M08', 'CSV Import & Export', TRUE),
  ('google_sheets', 'M09', 'Google Sheets Integration', TRUE),
  ('offline_scanning', 'M10', 'Offline Scanning & Synchronization', TRUE),
  ('advanced_analytics', 'M11', 'Advanced Analytics & Reporting', TRUE)
ON CONFLICT (feature_key) DO UPDATE SET
  module_code = EXCLUDED.module_code,
  name = EXCLUDED.name,
  platform_available = EXCLUDED.platform_available,
  updated_at = now();

ALTER TABLE public.platform_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_feature_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_feature_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_feature_flags_authenticated_read" ON public.platform_feature_flags;
CREATE POLICY "platform_feature_flags_authenticated_read" ON public.platform_feature_flags
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "platform_feature_flags_service_role_all" ON public.platform_feature_flags;
CREATE POLICY "platform_feature_flags_service_role_all" ON public.platform_feature_flags
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "event_feature_settings_member_read" ON public.event_feature_settings;
CREATE POLICY "event_feature_settings_member_read" ON public.event_feature_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_feature_settings.event_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND public.is_org_member(e.organization_id)
          )
        )
    )
  );

DROP POLICY IF EXISTS "event_feature_settings_manager_write" ON public.event_feature_settings;
CREATE POLICY "event_feature_settings_manager_write" ON public.event_feature_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_feature_settings.event_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND public.get_user_org_role(e.organization_id) IN ('owner', 'admin', 'event_manager')
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_feature_settings.event_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND public.get_user_org_role(e.organization_id) IN ('owner', 'admin', 'event_manager')
          )
        )
    )
  );

DROP POLICY IF EXISTS "event_feature_settings_service_role_all" ON public.event_feature_settings;
CREATE POLICY "event_feature_settings_service_role_all" ON public.event_feature_settings
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "event_feature_audit_logs_member_read" ON public.event_feature_audit_logs;
CREATE POLICY "event_feature_audit_logs_member_read" ON public.event_feature_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_feature_audit_logs.event_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND public.is_org_member(e.organization_id)
          )
        )
    )
  );

DROP POLICY IF EXISTS "event_feature_audit_logs_service_role_all" ON public.event_feature_audit_logs;
CREATE POLICY "event_feature_audit_logs_service_role_all" ON public.event_feature_audit_logs
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
