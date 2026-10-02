-- ============================================================
-- Migration 060: Stage 2 Physical-Event Operations
-- Covers:
--   1. Badge Studio & Templates
--   2. Badge Printing & Reprint Audit Logs
--   3. Zone Management Extensions & Capacities
--   4. Advanced Access Rules (Ticket, Badge, Role, Time)
--   5. Zone Scans & Live Occupancy Tracking (Entry/Exit)
--   6. Venue Floor Plans & Interactive Markers
--   7. Gate-to-Zone Mappings & Staff Assignments
--   8. Device Management & Heartbeats
--   9. Operational Alerts
--  10. Ops Audit Logs (Overrides, Reprints, Walk-ins)
-- ============================================================

-- 1. Badge Templates
CREATE TABLE IF NOT EXISTS public.event_badge_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  badge_type TEXT NOT NULL DEFAULT 'attendee'
    CHECK (badge_type IN ('attendee', 'vip', 'speaker', 'staff', 'sponsor', 'exhibitor', 'custom')),
  orientation TEXT NOT NULL DEFAULT 'portrait'
    CHECK (orientation IN ('portrait', 'landscape')),
  size_preset TEXT NOT NULL DEFAULT 'lanyard_100x150'
    CHECK (size_preset IN ('lanyard_100x150', 'card_cr80', 'badge_4x6', 'badge_3x4', 'custom')),
  width_mm NUMERIC NOT NULL DEFAULT 100,
  height_mm NUMERIC NOT NULL DEFAULT 150,
  layout_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_badge_templates_event ON public.event_badge_templates(event_id);

-- 2. Badge Print Queue & Logs
CREATE TABLE IF NOT EXISTS public.badge_print_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.event_badge_templates(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'printing', 'printed', 'failed', 'reprinted')),
  printer_id TEXT,
  printed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  printed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.badge_print_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.event_badge_templates(id) ON DELETE SET NULL,
  printer_id TEXT,
  print_type TEXT NOT NULL DEFAULT 'initial'
    CHECK (print_type IN ('initial', 'reprint', 'batch', 'desk_walkin')),
  reprint_reason TEXT,
  printed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  printed_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_badge_print_queue_event ON public.badge_print_queue(event_id, status);
CREATE INDEX IF NOT EXISTS idx_badge_print_logs_event ON public.badge_print_logs(event_id, created_at DESC);

-- 3. Extend event_zones if not already having capacity/type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='event_zones' AND column_name='capacity') THEN
    ALTER TABLE public.event_zones ADD COLUMN capacity INTEGER NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='event_zones' AND column_name='zone_type') THEN
    ALTER TABLE public.event_zones ADD COLUMN zone_type TEXT NOT NULL DEFAULT 'custom';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='event_zones' AND column_name='color') THEN
    ALTER TABLE public.event_zones ADD COLUMN color TEXT NOT NULL DEFAULT '#6D28D9';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='event_zones' AND column_name='current_occupancy') THEN
    ALTER TABLE public.event_zones ADD COLUMN current_occupancy INTEGER NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='event_zones' AND column_name='peak_occupancy') THEN
    ALTER TABLE public.event_zones ADD COLUMN peak_occupancy INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- 4. Advanced Access Rules
CREATE TABLE IF NOT EXISTS public.access_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES public.event_zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL DEFAULT 'ticket_type'
    CHECK (rule_type IN ('ticket_type', 'badge_type', 'role', 'session', 'time_window', 'multi_condition')),
  allowed_ticket_type_ids UUID[] DEFAULT '{}',
  allowed_badge_types TEXT[] DEFAULT '{}',
  allowed_roles TEXT[] DEFAULT '{}',
  session_id UUID,
  start_time TIME,
  end_time TIME,
  day_of_event INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_rules_event_zone ON public.access_rules(event_id, zone_id);

-- 5. Zone Scans & Occupancy Log (Entry/Exit Tracking)
CREATE TABLE IF NOT EXISTS public.zone_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES public.event_zones(id) ON DELETE CASCADE,
  gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  pass_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
  direction TEXT NOT NULL DEFAULT 'in' CHECK (direction IN ('in', 'out')),
  status TEXT NOT NULL DEFAULT 'allowed' CHECK (status IN ('allowed', 'denied', 'capacity_override')),
  rejection_reason TEXT,
  device_id TEXT,
  staff_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  staff_name TEXT,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zone_scans_event_zone ON public.zone_scans(event_id, zone_id, scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_zone_scans_attendee ON public.zone_scans(attendee_id, scanned_at DESC);

-- 6. Floor Plans & Interactive Markers
CREATE TABLE IF NOT EXISTS public.venue_floor_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  width_px INTEGER NOT NULL DEFAULT 1200,
  height_px INTEGER NOT NULL DEFAULT 800,
  markers JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_floor_plans_event ON public.venue_floor_plans(event_id);

-- 7. Staff Assignments
CREATE TABLE IF NOT EXISTS public.ops_staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  staff_name TEXT NOT NULL,
  staff_email TEXT,
  staff_phone TEXT,
  pin_code TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'gate_scanner'
    CHECK (role IN ('gate_scanner', 'zone_monitor', 'registration_desk', 'badge_printer', 'session_coordinator', 'help_desk', 'supervisor')),
  gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  zone_id UUID REFERENCES public.event_zones(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ops_staff_event ON public.ops_staff_assignments(event_id);

-- 8. Scanner & Terminal Devices
CREATE TABLE IF NOT EXISTS public.ops_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'smartphone'
    CHECK (device_type IN ('smartphone', 'tablet', 'laptop_webcam', 'handheld_laser', 'printer_station')),
  assigned_gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  assigned_zone_id UUID REFERENCES public.event_zones(id) ON DELETE SET NULL,
  app_version TEXT NOT NULL DEFAULT '2.4.0',
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  battery_level INTEGER,
  last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_event_device UNIQUE (event_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_ops_devices_event ON public.ops_devices(event_id);

-- 9. Operational Alerts
CREATE TABLE IF NOT EXISTS public.ops_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL
    CHECK (alert_type IN ('zone_nearly_full', 'zone_full', 'scanner_offline', 'printer_failure', 'high_duplicate_scans', 'gate_congestion')),
  severity TEXT NOT NULL DEFAULT 'warning'
    CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  zone_id UUID REFERENCES public.event_zones(id) ON DELETE SET NULL,
  gate_id UUID REFERENCES public.scanner_gates(id) ON DELETE SET NULL,
  device_id TEXT,
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ops_alerts_event ON public.ops_alerts(event_id, is_resolved, created_at DESC);

-- 10. Operations Audit Logs
CREATE TABLE IF NOT EXISTS public.ops_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL
    CHECK (action_type IN ('manual_checkin', 'capacity_override', 'badge_reprint', 'walkin_registration', 'payment_status_change', 'zone_override', 'gate_reassignment', 'staff_pin_generated')),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL DEFAULT 'System Staff',
  target_type TEXT NOT NULL DEFAULT 'attendee'
    CHECK (target_type IN ('attendee', 'zone', 'gate', 'badge', 'payment', 'device', 'staff')),
  target_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ops_audit_logs_event ON public.ops_audit_logs(event_id, created_at DESC);

-- RLS setup for all ops tables
ALTER TABLE public.event_badge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_print_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_print_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badge_templates_manage" ON public.event_badge_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = event_badge_templates.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = event_badge_templates.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "badge_print_queue_manage" ON public.badge_print_queue
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = badge_print_queue.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = badge_print_queue.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "badge_print_logs_manage" ON public.badge_print_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = badge_print_logs.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = badge_print_logs.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "access_rules_manage" ON public.access_rules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = access_rules.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = access_rules.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "zone_scans_manage" ON public.zone_scans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = zone_scans.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = zone_scans.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "floor_plans_manage" ON public.venue_floor_plans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = venue_floor_plans.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = venue_floor_plans.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "ops_staff_manage" ON public.ops_staff_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = ops_staff_assignments.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = ops_staff_assignments.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "ops_devices_manage" ON public.ops_devices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = ops_devices.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = ops_devices.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "ops_alerts_manage" ON public.ops_alerts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = ops_alerts.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = ops_alerts.event_id AND organization_members.user_id = auth.uid())
  );

CREATE POLICY "ops_audit_logs_manage" ON public.ops_audit_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = ops_audit_logs.event_id AND events.organizer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events JOIN public.organization_members ON organization_members.organization_id = events.organization_id WHERE events.id = ops_audit_logs.event_id AND organization_members.user_id = auth.uid())
  );
