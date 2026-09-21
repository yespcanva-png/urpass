-- ============================================================
-- Migration 041: Enterprise Database Foundation
-- 
-- 1. Organizations & Members Enhancement
-- 2. Organization Settings (Tenant-level configuration)
-- 3. Workspaces / Departments (Multi-team hierarchy)
-- 4. Locations (Venues & Facility Management)
-- 5. Enterprise Resource Association (organization_id on API keys, webhooks, invoices, passes)
-- 6. Comprehensive Tenant Isolation (RLS & helper functions)
-- 7. Automated Backfill for Existing Users, Events, and Resources
-- 8. Auto-provisioning on Signup (handle_new_user integration)
-- ============================================================

-- Ensure pgcrypto extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Organizations & Members Schema Enhancements
-- ============================================================

ALTER TABLE IF EXISTS public.organizations 
  ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'starter'
    CHECK (tier IN ('free', 'starter', 'pro', 'enterprise')),
  ADD COLUMN IF NOT EXISTS max_workspaces INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS max_locations INTEGER NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS max_members INTEGER NOT NULL DEFAULT 50;

-- Expand organization_members role check if needed
ALTER TABLE IF EXISTS public.organization_members 
  DROP CONSTRAINT IF EXISTS organization_members_role_check;

ALTER TABLE IF EXISTS public.organization_members 
  ADD CONSTRAINT organization_members_role_check 
  CHECK (role IN ('owner', 'admin', 'event_manager', 'checkin_staff', 'viewer', 'member'));

-- ============================================================
-- 2. Organization Settings (Organization-Level Configuration)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.organization_settings (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id             UUID NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  timezone                    TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  currency                    TEXT NOT NULL DEFAULT 'INR',
  date_format                 TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
  time_format                 TEXT NOT NULL DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
  allowed_domains             TEXT[] NOT NULL DEFAULT '{}',
  enforce_2fa                 BOOLEAN NOT NULL DEFAULT false,
  require_approval_for_passes BOOLEAN NOT NULL DEFAULT false,
  email_sender_name           TEXT,
  support_email               TEXT,
  custom_domain               TEXT,
  brand_logo_url              TEXT,
  brand_primary_color         TEXT NOT NULL DEFAULT '#6D28D9',
  brand_secondary_color       TEXT NOT NULL DEFAULT '#4C1D95',
  default_pass_template       TEXT NOT NULL DEFAULT 'modern',
  features                    JSONB NOT NULL DEFAULT '{"workspaces": true, "locations": true, "multiGate": true, "advancedAnalytics": true, "customPasses": true}'::jsonb,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_org_settings_org ON public.organization_settings(organization_id);

CREATE TRIGGER trg_organization_settings_updated_at
  BEFORE UPDATE ON public.organization_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 3. Workspaces / Departments
-- ============================================================

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

CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Workspace Members
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

-- ============================================================
-- 4. Locations (Physical Venues & Virtual Rooms)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  workspace_id    UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  venue_type      TEXT NOT NULL DEFAULT 'physical' CHECK (venue_type IN ('physical', 'virtual', 'hybrid')),
  address         TEXT,
  city            TEXT,
  state           TEXT,
  country         TEXT NOT NULL DEFAULT 'India',
  postal_code     TEXT,
  capacity        INTEGER,
  timezone        TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  virtual_url     TEXT,
  contact_name    TEXT,
  contact_phone   TEXT,
  contact_email   TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_locations_organization ON public.locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_workspace ON public.locations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_locations_city ON public.locations(city);

CREATE TRIGGER trg_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 5. Add organization_id, workspace_id, location_id to Enterprise Resources
-- ============================================================

-- Events
ALTER TABLE IF EXISTS public.events
  ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_events_workspace ON public.events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(location_id);

-- API Keys
ALTER TABLE IF EXISTS public.api_keys
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_api_keys_organization ON public.api_keys(organization_id);

-- Webhook Endpoints
ALTER TABLE IF EXISTS public.webhook_endpoints
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_org ON public.webhook_endpoints(organization_id);

-- Invoices
ALTER TABLE IF EXISTS public.invoices
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_organization ON public.invoices(organization_id);

-- Event Passes (credits)
ALTER TABLE IF EXISTS public.event_passes
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_event_passes_organization ON public.event_passes(organization_id);

-- Scanner Gates
ALTER TABLE IF EXISTS public.scanner_gates
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_scanner_gates_org ON public.scanner_gates(organization_id);
CREATE INDEX IF NOT EXISTS idx_scanner_gates_location ON public.scanner_gates(location_id);

-- ============================================================
-- 6. Helper Security Definer Functions for Tenant Isolation
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_user_org_role(p_org_id UUID)
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT role FROM public.organization_members
  WHERE organization_id = p_org_id
    AND user_id = auth.uid()
    AND status = 'active'
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = p_org_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = p_org_id
      AND user_id = auth.uid()
      AND status = 'active'
      AND role IN ('owner', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.get_workspace_org_id(p_workspace_id UUID)
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT organization_id FROM public.workspaces
  WHERE id = p_workspace_id
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_member(p_workspace_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members wm
    JOIN public.organization_members om ON om.id = wm.member_id
    WHERE wm.workspace_id = p_workspace_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
  ) OR EXISTS (
    -- Org owner/admins automatically have access to all workspaces in their tenant
    SELECT 1 FROM public.workspaces w
    WHERE w.id = p_workspace_id
      AND public.is_org_admin(w.organization_id)
  );
$$;

-- ============================================================
-- 7. Row Level Security & Strict Tenant Isolation
-- ============================================================

-- organization_settings RLS
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_settings_member_select" ON public.organization_settings;
CREATE POLICY "org_settings_member_select" ON public.organization_settings
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "org_settings_admin_insert" ON public.organization_settings;
CREATE POLICY "org_settings_admin_insert" ON public.organization_settings
  FOR INSERT WITH CHECK (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "org_settings_admin_update" ON public.organization_settings;
CREATE POLICY "org_settings_admin_update" ON public.organization_settings
  FOR UPDATE USING (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "org_settings_owner_delete" ON public.organization_settings;
CREATE POLICY "org_settings_owner_delete" ON public.organization_settings
  FOR DELETE USING (public.get_user_org_role(organization_id) = 'owner');

-- workspaces RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "workspaces_member_select" ON public.workspaces;
CREATE POLICY "workspaces_member_select" ON public.workspaces
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "workspaces_admin_insert" ON public.workspaces;
CREATE POLICY "workspaces_admin_insert" ON public.workspaces
  FOR INSERT WITH CHECK (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "workspaces_admin_update" ON public.workspaces;
CREATE POLICY "workspaces_admin_update" ON public.workspaces
  FOR UPDATE USING (
    public.is_org_admin(organization_id)
    OR EXISTS (
      SELECT 1 FROM public.workspace_members wm
      JOIN public.organization_members om ON om.id = wm.member_id
      WHERE wm.workspace_id = workspaces.id
        AND om.user_id = auth.uid()
        AND wm.role = 'lead'
    )
  );

DROP POLICY IF EXISTS "workspaces_admin_delete" ON public.workspaces;
CREATE POLICY "workspaces_admin_delete" ON public.workspaces
  FOR DELETE USING (
    public.is_org_admin(organization_id)
    AND is_default = false
  );

-- workspace_members RLS
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "workspace_members_select" ON public.workspace_members;
CREATE POLICY "workspace_members_select" ON public.workspace_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_members.workspace_id
        AND public.is_org_member(w.organization_id)
    )
  );

DROP POLICY IF EXISTS "workspace_members_admin_insert" ON public.workspace_members;
CREATE POLICY "workspace_members_admin_insert" ON public.workspace_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_members.workspace_id
        AND public.is_org_admin(w.organization_id)
    )
  );

DROP POLICY IF EXISTS "workspace_members_admin_update" ON public.workspace_members;
CREATE POLICY "workspace_members_admin_update" ON public.workspace_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_members.workspace_id
        AND public.is_org_admin(w.organization_id)
    )
  );

DROP POLICY IF EXISTS "workspace_members_admin_delete" ON public.workspace_members;
CREATE POLICY "workspace_members_admin_delete" ON public.workspace_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_members.workspace_id
        AND public.is_org_admin(w.organization_id)
    )
  );

-- locations RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "locations_member_select" ON public.locations;
CREATE POLICY "locations_member_select" ON public.locations
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "locations_manager_insert" ON public.locations;
CREATE POLICY "locations_manager_insert" ON public.locations
  FOR INSERT WITH CHECK (
    public.get_user_org_role(organization_id) IN ('owner', 'admin', 'event_manager')
  );

DROP POLICY IF EXISTS "locations_manager_update" ON public.locations;
CREATE POLICY "locations_manager_update" ON public.locations
  FOR UPDATE USING (
    public.get_user_org_role(organization_id) IN ('owner', 'admin', 'event_manager')
  );

DROP POLICY IF EXISTS "locations_admin_delete" ON public.locations;
CREATE POLICY "locations_admin_delete" ON public.locations
  FOR DELETE USING (public.is_org_admin(organization_id));

-- Updated API Keys RLS (supports personal + org keys)
DROP POLICY IF EXISTS "user_api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "api_keys_tenant_access" ON public.api_keys;
CREATE POLICY "api_keys_tenant_access" ON public.api_keys
  FOR ALL USING (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_admin(organization_id))
  );

-- Updated Webhook Endpoints RLS (supports personal + org webhooks)
DROP POLICY IF EXISTS "user_webhooks" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "webhooks_tenant_access" ON public.webhook_endpoints;
CREATE POLICY "webhooks_tenant_access" ON public.webhook_endpoints
  FOR ALL USING (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_admin(organization_id))
  );

-- Updated Invoices RLS (supports personal + org invoices)
DROP POLICY IF EXISTS "invoices_owner_select" ON public.invoices;
DROP POLICY IF EXISTS "invoices_tenant_select" ON public.invoices;
CREATE POLICY "invoices_tenant_select" ON public.invoices
  FOR SELECT USING (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_admin(organization_id))
  );

-- ============================================================
-- 8. Core Function: Ensure Default Organization & Workspace for a User
-- ============================================================

CREATE OR REPLACE FUNCTION public.ensure_user_default_organization(p_user_id UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_member_id UUID;
  v_workspace_id UUID;
  v_user_email TEXT;
  v_user_name TEXT;
  v_org_name TEXT;
  v_org_slug TEXT;
  v_candidate_slug TEXT;
  v_count INTEGER;
BEGIN
  -- 1. Check if user is already an active member of any organization
  SELECT organization_id INTO v_org_id
  FROM public.organization_members
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY joined_at ASC NULLS LAST, created_at ASC
  LIMIT 1;

  IF v_org_id IS NOT NULL THEN
    -- Ensure organization_settings exists
    INSERT INTO public.organization_settings (organization_id)
    VALUES (v_org_id)
    ON CONFLICT (organization_id) DO NOTHING;

    -- Ensure default workspace exists
    SELECT id INTO v_workspace_id
    FROM public.workspaces
    WHERE organization_id = v_org_id AND is_default = true
    LIMIT 1;

    IF v_workspace_id IS NULL THEN
      INSERT INTO public.workspaces (organization_id, name, slug, is_default, created_by)
      VALUES (v_org_id, 'General', 'general', true, p_user_id)
      RETURNING id INTO v_workspace_id;
    END IF;

    RETURN v_org_id;
  END IF;

  -- 2. Fetch user email and full name
  SELECT email, coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
  INTO v_user_email, v_user_name
  FROM auth.users
  WHERE id = p_user_id;

  IF v_user_email IS NULL THEN
    SELECT email, full_name INTO v_user_email, v_user_name
    FROM public.profiles
    WHERE user_id = p_user_id;
  END IF;

  v_user_name := coalesce(v_user_name, 'Organizer');
  v_org_name := trim(v_user_name) || '''s Organization';

  -- 3. Generate a clean unique slug
  v_org_slug := lower(regexp_replace(v_user_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_org_slug := trim(both '-' from v_org_slug);
  IF length(v_org_slug) = 0 THEN v_org_slug := 'team'; END IF;
  v_candidate_slug := v_org_slug;

  v_count := 1;
  WHILE EXISTS (SELECT 1 FROM public.organizations WHERE slug = v_candidate_slug) LOOP
    v_candidate_slug := v_org_slug || '-' || v_count;
    v_count := v_count + 1;
  END LOOP;

  -- 4. Create Organization
  INSERT INTO public.organizations (name, slug, contact_email, created_by)
  VALUES (v_org_name, v_candidate_slug, v_user_email, p_user_id)
  RETURNING id INTO v_org_id;

  -- 5. Add user as Owner in organization_members
  INSERT INTO public.organization_members (
    organization_id,
    user_id,
    invited_email,
    role,
    status,
    joined_at
  )
  VALUES (
    v_org_id,
    p_user_id,
    coalesce(v_user_email, ''),
    'owner',
    'active',
    now()
  )
  RETURNING id INTO v_member_id;

  -- 6. Create default Organization Settings
  INSERT INTO public.organization_settings (
    organization_id,
    timezone,
    currency,
    support_email
  )
  VALUES (
    v_org_id,
    'Asia/Kolkata',
    'INR',
    v_user_email
  )
  ON CONFLICT (organization_id) DO NOTHING;

  -- 7. Create default "General" Workspace
  INSERT INTO public.workspaces (
    organization_id,
    name,
    slug,
    description,
    is_default,
    created_by
  )
  VALUES (
    v_org_id,
    'General',
    'general',
    'Default organization workspace for general events and team coordination.',
    true,
    p_user_id
  )
  RETURNING id INTO v_workspace_id;

  -- 8. Assign owner to default workspace as lead
  INSERT INTO public.workspace_members (workspace_id, member_id, role)
  VALUES (v_workspace_id, v_member_id, 'lead')
  ON CONFLICT DO NOTHING;

  RETURN v_org_id;
END;
$$;

-- ============================================================
-- 9. Backfill Script: Connect Existing Users, Events, and Resources
-- ============================================================

CREATE OR REPLACE FUNCTION public.backfill_enterprise_foundation()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user RECORD;
  v_org RECORD;
  v_event RECORD;
  v_org_id UUID;
  v_workspace_id UUID;
  v_location_id UUID;
  v_users_provisioned INTEGER := 0;
  v_events_connected INTEGER := 0;
  v_locations_created INTEGER := 0;
BEGIN
  -- 1. Ensure all existing users have an organization and default workspace
  FOR v_user IN (
    SELECT DISTINCT u.id FROM auth.users u
    UNION
    SELECT DISTINCT p.user_id FROM public.profiles p
  ) LOOP
    v_org_id := public.ensure_user_default_organization(v_user.id);
    v_users_provisioned := v_users_provisioned + 1;
  END LOOP;

  -- 2. Ensure every organization has settings and a default workspace
  FOR v_org IN (SELECT id, created_by FROM public.organizations) LOOP
    INSERT INTO public.organization_settings (organization_id)
    VALUES (v_org.id)
    ON CONFLICT (organization_id) DO NOTHING;

    SELECT id INTO v_workspace_id
    FROM public.workspaces
    WHERE organization_id = v_org.id AND is_default = true
    LIMIT 1;

    IF v_workspace_id IS NULL THEN
      INSERT INTO public.workspaces (organization_id, name, slug, is_default, created_by)
      VALUES (v_org.id, 'General', 'general', true, v_org.created_by)
      RETURNING id INTO v_workspace_id;
    END IF;
  END LOOP;

  -- 3. Connect existing events to organizations, workspaces, and locations
  FOR v_event IN (
    SELECT id, organizer_id, organization_id, workspace_id, venue
    FROM public.events
  ) LOOP
    -- If event has no organization_id, connect to organizer's organization
    IF v_event.organization_id IS NULL THEN
      SELECT om.organization_id INTO v_org_id
      FROM public.organization_members om
      WHERE om.user_id = v_event.organizer_id
        AND om.status = 'active'
      ORDER BY (CASE WHEN om.role = 'owner' THEN 1 WHEN om.role = 'admin' THEN 2 ELSE 3 END)
      LIMIT 1;

      IF v_org_id IS NOT NULL THEN
        SELECT id INTO v_workspace_id
        FROM public.workspaces
        WHERE organization_id = v_org_id AND is_default = true
        LIMIT 1;

        UPDATE public.events
        SET organization_id = v_org_id,
            workspace_id = coalesce(v_event.workspace_id, v_workspace_id)
        WHERE id = v_event.id;

        v_events_connected := v_events_connected + 1;
      END IF;
    ELSE
      v_org_id := v_event.organization_id;
      IF v_event.workspace_id IS NULL THEN
        SELECT id INTO v_workspace_id
        FROM public.workspaces
        WHERE organization_id = v_org_id AND is_default = true
        LIMIT 1;

        UPDATE public.events
        SET workspace_id = v_workspace_id
        WHERE id = v_event.id;
      END IF;
    END IF;

    -- If event has a venue string, ensure a Location entity exists and is linked
    IF v_org_id IS NOT NULL AND v_event.venue IS NOT NULL AND trim(v_event.venue) <> '' THEN
      SELECT id INTO v_location_id
      FROM public.locations
      WHERE organization_id = v_org_id
        AND lower(trim(name)) = lower(trim(v_event.venue))
      LIMIT 1;

      IF v_location_id IS NULL THEN
        INSERT INTO public.locations (
          organization_id,
          workspace_id,
          name,
          address,
          venue_type
        )
        VALUES (
          v_org_id,
          v_workspace_id,
          trim(v_event.venue),
          trim(v_event.venue),
          'physical'
        )
        RETURNING id INTO v_location_id;
        v_locations_created := v_locations_created + 1;
      END IF;

      UPDATE public.events
      SET location_id = v_location_id
      WHERE id = v_event.id AND location_id IS NULL;
    END IF;
  END LOOP;

  -- 4. Connect enterprise resources (API keys, Webhooks, Invoices) to user's primary organization
  UPDATE public.api_keys ak
  SET organization_id = (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = ak.user_id AND om.status = 'active'
    ORDER BY (CASE WHEN om.role = 'owner' THEN 1 ELSE 2 END) LIMIT 1
  )
  WHERE ak.organization_id IS NULL;

  UPDATE public.webhook_endpoints we
  SET organization_id = (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = we.user_id AND om.status = 'active'
    ORDER BY (CASE WHEN om.role = 'owner' THEN 1 ELSE 2 END) LIMIT 1
  )
  WHERE we.organization_id IS NULL;

  UPDATE public.invoices inv
  SET organization_id = (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = inv.user_id AND om.status = 'active'
    ORDER BY (CASE WHEN om.role = 'owner' THEN 1 ELSE 2 END) LIMIT 1
  )
  WHERE inv.organization_id IS NULL;

  RETURN jsonb_build_object(
    'users_provisioned', v_users_provisioned,
    'events_connected', v_events_connected,
    'locations_created', v_locations_created
  );
END;
$$;

-- Run backfill immediately
SELECT public.backfill_enterprise_foundation();

-- ============================================================
-- 10. Update handle_new_user() to Auto-Provision Default Org
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id UUID;
  v_full_name TEXT;
BEGIN
  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- 1. Insert Profile
  INSERT INTO public.profiles (user_id, full_name, email, avatar_url)
  VALUES (
    new.id,
    v_full_name,
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      avatar_url = coalesce(EXCLUDED.avatar_url, public.profiles.avatar_url);

  -- 2. Grant Free Subscription
  SELECT id INTO free_plan_id FROM public.plans WHERE slug = 'free' LIMIT 1;
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (user_id, plan_id, status, provider)
    VALUES (new.id, free_plan_id, 'active', 'free')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- 3. Auto-provision Organization & Default Workspace
  PERFORM public.ensure_user_default_organization(new.id);

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Prevent signup failure if org bootstrapping encounters an edge case
    RAISE WARNING 'handle_new_user error for %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;
