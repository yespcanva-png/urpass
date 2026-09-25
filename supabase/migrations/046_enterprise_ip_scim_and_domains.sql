-- ============================================================
-- Migration 046: Enterprise IP Allowlisting, SCIM 2.0 Directory Sync,
-- and Custom CNAME Domain Engine
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Idempotent Security Definer Helpers
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

-- 1. Extend Organization Settings with Network Allowlisting & GDPR Retention
ALTER TABLE IF EXISTS public.organization_settings
  ADD COLUMN IF NOT EXISTS allowed_cidrs TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS enforce_ip_allowlist BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS anonymize_pii_days INTEGER DEFAULT NULL;

-- 2. SCIM 2.0 Directory Sync Tokens
CREATE TABLE IF NOT EXISTS public.enterprise_scim_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'SCIM Directory Token',
  token_hash      TEXT NOT NULL,
  token_hint      TEXT NOT NULL,
  last_used_at    TIMESTAMPTZ,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT scim_tokens_org_unique UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_scim_tokens_org ON public.enterprise_scim_tokens(organization_id);

-- 3. Custom CNAME Domains for White-Labeling
CREATE TABLE IF NOT EXISTS public.custom_domains (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain             TEXT NOT NULL UNIQUE,
  cname_target       TEXT NOT NULL DEFAULT 'cname.urpass.in',
  status             TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'failed')),
  ssl_status         TEXT NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'issued', 'failed')),
  verification_token TEXT NOT NULL,
  verified_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_domains_org ON public.custom_domains(organization_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain ON public.custom_domains(domain);

-- 4. Enable Row Level Security
ALTER TABLE public.enterprise_scim_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scim_tokens_admin_select" ON public.enterprise_scim_tokens;
CREATE POLICY "scim_tokens_admin_select" ON public.enterprise_scim_tokens
  FOR SELECT USING (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "scim_tokens_admin_manage" ON public.enterprise_scim_tokens;
CREATE POLICY "scim_tokens_admin_manage" ON public.enterprise_scim_tokens
  FOR ALL USING (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "custom_domains_member_select" ON public.custom_domains;
CREATE POLICY "custom_domains_member_select" ON public.custom_domains
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "custom_domains_admin_manage" ON public.custom_domains;
CREATE POLICY "custom_domains_admin_manage" ON public.custom_domains
  FOR ALL USING (public.is_org_admin(organization_id));
