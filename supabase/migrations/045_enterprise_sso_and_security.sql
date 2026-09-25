-- ============================================================
-- Migration 045: Enterprise SSO, Verified Domains, and Security Center
-- 
-- 1. Enterprise SSO Connections (SAML 2.0 & OIDC)
-- 2. Verified Domains (DNS TXT Verification)
-- 3. Enterprise Audit Logs (Security Events & Compliance)
-- 4. Enterprise Active Sessions & Revocation
-- 5. Tenant Policy Extensions
-- 6. Row Level Security & Isolation Policies
-- ============================================================

-- Ensure pgcrypto extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Enterprise SSO Connections
-- ============================================================

CREATE TABLE IF NOT EXISTS public.enterprise_sso_connections (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id             UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  protocol                    TEXT NOT NULL CHECK (protocol IN ('SAML', 'OIDC')),
  name                        TEXT NOT NULL DEFAULT 'Corporate Identity Provider',
  status                      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'testing')),
  domains                     TEXT[] NOT NULL DEFAULT '{}',
  enforce_sso                 BOOLEAN NOT NULL DEFAULT false,
  jit_provisioning            BOOLEAN NOT NULL DEFAULT true,
  default_role                TEXT NOT NULL DEFAULT 'member' CHECK (default_role IN ('owner', 'admin', 'event_manager', 'checkin_staff', 'viewer', 'member')),
  
  -- SAML 2.0 configuration
  sp_entity_id                TEXT NOT NULL,
  acs_url                     TEXT NOT NULL,
  idp_entity_id               TEXT,
  idp_sso_url                 TEXT,
  idp_certificate             TEXT,
  
  -- OpenID Connect configuration
  oidc_issuer                 TEXT,
  oidc_client_id              TEXT,
  oidc_client_secret          TEXT,
  oidc_authorization_endpoint TEXT,
  oidc_token_endpoint         TEXT,
  oidc_userinfo_endpoint      TEXT,
  
  -- Health & test metrics
  last_tested_at              TIMESTAMPTZ,
  last_tested_status          TEXT CHECK (last_tested_status IN ('success', 'failure')),
  last_tested_error           TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_sso_org_unique UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_enterprise_sso_org ON public.enterprise_sso_connections(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_sso_status ON public.enterprise_sso_connections(status);

CREATE TRIGGER trg_enterprise_sso_updated_at
  BEFORE UPDATE ON public.enterprise_sso_connections
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 2. Verified Domains
-- ============================================================

CREATE TABLE IF NOT EXISTS public.verified_domains (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id             UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain                      TEXT NOT NULL UNIQUE,
  verification_method         TEXT NOT NULL DEFAULT 'dns_txt' CHECK (verification_method IN ('dns_txt', 'meta_tag')),
  verification_token          TEXT NOT NULL,
  status                      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  verified_at                 TIMESTAMPTZ,
  last_checked_at             TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verified_domains_org ON public.verified_domains(organization_id);
CREATE INDEX IF NOT EXISTS idx_verified_domains_domain ON public.verified_domains(domain);
CREATE INDEX IF NOT EXISTS idx_verified_domains_status ON public.verified_domains(status);

CREATE TRIGGER trg_verified_domains_updated_at
  BEFORE UPDATE ON public.verified_domains
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 3. Enterprise Audit Logs
-- ============================================================

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

CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.enterprise_audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.enterprise_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.enterprise_audit_logs(action);

-- ============================================================
-- 4. Enterprise Sessions (Tracking & Revocation)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.enterprise_sessions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id             UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id                     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sso_connection_id           UUID REFERENCES public.enterprise_sso_connections(id) ON DELETE SET NULL,
  session_token_hash          TEXT,
  idp_session_index           TEXT,
  ip_address                  TEXT,
  user_agent                  TEXT,
  device                      TEXT,
  status                      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  last_active_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at                  TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enterprise_sessions_org ON public.enterprise_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_sessions_user ON public.enterprise_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_sessions_status ON public.enterprise_sessions(status);

-- ============================================================
-- 5. Extend Organization Settings for SSO & Emergency Login
-- ============================================================

ALTER TABLE IF EXISTS public.organization_settings
  ADD COLUMN IF NOT EXISTS enforce_sso BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_emergency_owner_login BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS session_idle_timeout_minutes INTEGER NOT NULL DEFAULT 1440;

-- ============================================================
-- 6. Row Level Security & Policies
-- ============================================================

-- enterprise_sso_connections RLS
ALTER TABLE public.enterprise_sso_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sso_member_select" ON public.enterprise_sso_connections;
CREATE POLICY "sso_member_select" ON public.enterprise_sso_connections
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "sso_admin_insert" ON public.enterprise_sso_connections;
CREATE POLICY "sso_admin_insert" ON public.enterprise_sso_connections
  FOR INSERT WITH CHECK (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "sso_admin_update" ON public.enterprise_sso_connections;
CREATE POLICY "sso_admin_update" ON public.enterprise_sso_connections
  FOR UPDATE USING (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "sso_owner_delete" ON public.enterprise_sso_connections;
CREATE POLICY "sso_owner_delete" ON public.enterprise_sso_connections
  FOR DELETE USING (public.get_user_org_role(organization_id) = 'owner');

-- verified_domains RLS
ALTER TABLE public.verified_domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "domains_member_select" ON public.verified_domains;
CREATE POLICY "domains_member_select" ON public.verified_domains
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "domains_admin_insert" ON public.verified_domains;
CREATE POLICY "domains_admin_insert" ON public.verified_domains
  FOR INSERT WITH CHECK (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "domains_admin_update" ON public.verified_domains;
CREATE POLICY "domains_admin_update" ON public.verified_domains
  FOR UPDATE USING (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "domains_admin_delete" ON public.verified_domains;
CREATE POLICY "domains_admin_delete" ON public.verified_domains
  FOR DELETE USING (public.is_org_admin(organization_id));

-- enterprise_audit_logs RLS
ALTER TABLE public.enterprise_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_admin_select" ON public.enterprise_audit_logs;
CREATE POLICY "audit_logs_admin_select" ON public.enterprise_audit_logs
  FOR SELECT USING (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "audit_logs_insert" ON public.enterprise_audit_logs;
CREATE POLICY "audit_logs_insert" ON public.enterprise_audit_logs
  FOR INSERT WITH CHECK (public.is_org_member(organization_id));

-- enterprise_sessions RLS
ALTER TABLE public.enterprise_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_select" ON public.enterprise_sessions;
CREATE POLICY "sessions_select" ON public.enterprise_sessions
  FOR SELECT USING (
    public.is_org_admin(organization_id)
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "sessions_update" ON public.enterprise_sessions;
CREATE POLICY "sessions_update" ON public.enterprise_sessions
  FOR UPDATE USING (
    public.is_org_admin(organization_id)
    OR user_id = auth.uid()
  );
