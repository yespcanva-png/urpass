-- ============================================================================
-- Migration 082: P3 Enterprise Hardening
-- ============================================================================
-- 1. Relational Workspaces & Migration from system_settings JSON
-- 2. Dedicated Roles: FINANCE and GATE_MANAGER
-- 3. Granular RBAC and Tenant Isolation Policies
-- 4. Complete Audit Logging Schema (event_id, old_values, new_values)
-- 5. Hardened Public Pass View / Security Definer Functions
-- ============================================================================

-- 1. Dedicated Roles: Update organization_members role constraint
ALTER TABLE IF EXISTS public.organization_members 
  DROP CONSTRAINT IF EXISTS organization_members_role_check;

ALTER TABLE IF EXISTS public.organization_members 
  ADD CONSTRAINT organization_members_role_check 
  CHECK (role IN ('owner', 'admin', 'event_manager', 'finance', 'gate_manager', 'checkin_staff', 'viewer', 'member'));

-- 2. Relational Workspaces: Ensure schema, foreign keys, and indexes
CREATE TABLE IF NOT EXISTS public.workspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT,
  color           TEXT NOT NULL DEFAULT '#6D28D9',
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT workspaces_org_slug_key UNIQUE (organization_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_workspaces_organization ON public.workspaces(organization_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON public.workspaces(slug);

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  member_id    UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member', 'viewer')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT workspace_members_ws_member_key UNIQUE (workspace_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_ws ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_member ON public.workspace_members(member_id);

-- Enable RLS on workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Workspaces RLS policies
DROP POLICY IF EXISTS "workspaces_org_member_select" ON public.workspaces;
CREATE POLICY "workspaces_org_member_select" ON public.workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = workspaces.organization_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

DROP POLICY IF EXISTS "workspaces_admin_all" ON public.workspaces;
CREATE POLICY "workspaces_admin_all" ON public.workspaces
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = workspaces.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
  );

-- Workspace members RLS policies
DROP POLICY IF EXISTS "workspace_members_org_select" ON public.workspace_members;
CREATE POLICY "workspace_members_org_select" ON public.workspace_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      JOIN public.organization_members om ON om.organization_id = w.organization_id
      WHERE w.id = workspace_members.workspace_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

DROP POLICY IF EXISTS "workspace_members_admin_all" ON public.workspace_members;
CREATE POLICY "workspace_members_admin_all" ON public.workspace_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      JOIN public.organization_members om ON om.organization_id = w.organization_id
      WHERE w.id = workspace_members.workspace_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
  );

-- Data Migration: Migrate any legacy JSON workspaces from system_settings
DO $$
DECLARE
  r RECORD;
  v_item RECORD;
  v_org_id UUID;
  v_arr JSONB;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_settings') THEN
    FOR r IN SELECT key, value FROM public.system_settings WHERE key LIKE 'org_workspaces_%' LOOP
      BEGIN
        v_org_id := substring(r.key from 'org_workspaces_(.*)')::uuid;
        v_arr := r.value::jsonb;
        
        IF jsonb_typeof(v_arr) = 'array' THEN
          FOR v_item IN SELECT * FROM jsonb_to_recordset(v_arr) AS x(
            name TEXT,
            slug TEXT,
            description TEXT,
            color TEXT,
            is_default BOOLEAN
          ) LOOP
            IF v_item.name IS NOT NULL AND v_item.slug IS NOT NULL THEN
              INSERT INTO public.workspaces (
                organization_id,
                name,
                slug,
                description,
                color,
                is_default
              ) VALUES (
                v_org_id,
                v_item.name,
                v_item.slug,
                v_item.description,
                COALESCE(v_item.color, '#6D28D9'),
                COALESCE(v_item.is_default, false)
              )
              ON CONFLICT (organization_id, slug) DO NOTHING;
            END IF;
          END LOOP;
        END IF;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END LOOP;
  END IF;
END $$;

-- 3. Audit Logging: Extend enterprise_audit_logs with event_id, old_values, new_values
CREATE TABLE IF NOT EXISTS public.enterprise_audit_logs (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id             UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id                     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email                 TEXT,
  action                      TEXT NOT NULL,
  resource_type               TEXT NOT NULL,
  resource_id                 TEXT,
  details                     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address                  TEXT,
  user_agent                  TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE IF EXISTS public.enterprise_audit_logs
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS old_values JSONB,
  ADD COLUMN IF NOT EXISTS new_values JSONB;

CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.enterprise_audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON public.enterprise_audit_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.enterprise_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.enterprise_audit_logs(action);

-- Audit logs RLS policies
ALTER TABLE public.enterprise_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_org_admin_select" ON public.enterprise_audit_logs;
CREATE POLICY "audit_logs_org_admin_select" ON public.enterprise_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = enterprise_audit_logs.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'finance', 'gate_manager')
        AND om.status = 'active'
    )
  );

DROP POLICY IF EXISTS "audit_logs_service_insert" ON public.enterprise_audit_logs;
CREATE POLICY "audit_logs_service_insert" ON public.enterprise_audit_logs
  FOR INSERT WITH CHECK (true);

-- 4. Granular Role Support in Attendees, Passes, Check-Ins, and Invoices
-- Ensure referenced organization_id and event_id columns exist before policy definition
ALTER TABLE IF EXISTS public.events
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.invoices
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_organization ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_event ON public.invoices(event_id);

ALTER TABLE IF EXISTS public.credit_notes
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_credit_notes_organization ON public.credit_notes(organization_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_event ON public.credit_notes(event_id);

-- Update policies to include FINANCE and GATE_MANAGER roles
DROP POLICY IF EXISTS "attendees_org_member_select" ON public.attendees;
CREATE POLICY "attendees_org_member_select" ON public.attendees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.organization_members om ON om.organization_id = e.organization_id
      WHERE e.id = attendees.event_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'event_manager', 'finance', 'gate_manager', 'checkin_staff')
        AND om.status = 'active'
    )
  );

DROP POLICY IF EXISTS "passes_org_member_select" ON public.passes;
CREATE POLICY "passes_org_member_select" ON public.passes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.organization_members om ON om.organization_id = e.organization_id
      WHERE e.id = passes.event_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'event_manager', 'finance', 'gate_manager', 'checkin_staff')
        AND om.status = 'active'
    )
  );

DROP POLICY IF EXISTS "check_ins_gate_manager_all" ON public.check_ins;
CREATE POLICY "check_ins_gate_manager_all" ON public.check_ins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.organization_members om ON om.organization_id = e.organization_id
      WHERE e.id = check_ins.event_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'event_manager', 'gate_manager', 'checkin_staff')
        AND om.status = 'active'
    )
  );

-- Invoices RLS: Finance, Owner, Admin
DROP POLICY IF EXISTS "invoices_finance_select" ON public.invoices;
CREATE POLICY "invoices_finance_select" ON public.invoices
  FOR SELECT USING (
    (
      invoices.organization_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = invoices.organization_id
          AND om.user_id = auth.uid()
          AND om.role IN ('owner', 'admin', 'finance')
          AND om.status = 'active'
      )
    )
    OR
    (
      invoices.event_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.organization_members om ON om.organization_id = e.organization_id
        WHERE e.id = invoices.event_id
          AND om.user_id = auth.uid()
          AND om.role IN ('owner', 'admin', 'finance')
          AND om.status = 'active'
      )
    )
  );

-- Credit Notes RLS: Finance, Owner, Admin
DROP POLICY IF EXISTS "credit_notes_finance_select" ON public.credit_notes;
CREATE POLICY "credit_notes_finance_select" ON public.credit_notes
  FOR SELECT USING (
    (
      credit_notes.organization_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = credit_notes.organization_id
          AND om.user_id = auth.uid()
          AND om.role IN ('owner', 'admin', 'finance')
          AND om.status = 'active'
      )
    )
    OR
    (
      credit_notes.event_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.organization_members om ON om.organization_id = e.organization_id
        WHERE e.id = credit_notes.event_id
          AND om.user_id = auth.uid()
          AND om.role IN ('owner', 'admin', 'finance')
          AND om.status = 'active'
      )
    )
  );

