-- ============================================================================
-- UrPass UK Platform — Sovereign Baseline Migration
-- Migration: 001_uk_platform_baseline.sql
-- Target: Dedicated UrPass UK Supabase Project (AWS eu-west-2 London)
-- Locale: en-GB | Timezone: Europe/London | Currency: GBP (£)
-- Compliance: UK GDPR / Data Protection Act 2018 / PECR
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Profiles ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  phone text,
  country_code text NOT NULL DEFAULT 'GB',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ── 2. Organizations & Tenancy ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  country_code text NOT NULL DEFAULT 'GB',
  billing_currency text NOT NULL DEFAULT 'GBP',
  billing_timezone text NOT NULL DEFAULT 'Europe/London',
  billing_entity_id text,
  tax_information jsonb NOT NULL DEFAULT '{"taxType":"VAT","taxRate":20}'::jsonb,
  market_configuration jsonb NOT NULL DEFAULT '{"market":"GB","terms":{"institution":"University","governingBody":"Students Union"}}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'event_manager', 'checkin_staff', 'member')),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'invited', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT org_members_org_user_unique UNIQUE (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);

CREATE TABLE IF NOT EXISTS public.organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
  default_country_code text NOT NULL DEFAULT 'GB',
  default_currency text NOT NULL DEFAULT 'GBP',
  default_timezone text NOT NULL DEFAULT 'Europe/London',
  custom_domain text,
  verified_domain text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── 3. Billing Plans & Subscriptions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  price_monthly integer NOT NULL DEFAULT 0, -- minor units (pence)
  price_yearly integer NOT NULL DEFAULT 0,  -- minor units (pence)
  currency text NOT NULL DEFAULT 'GBP',
  max_events integer NOT NULL DEFAULT 1,
  max_attendees integer NOT NULL DEFAULT 100,
  features text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed UK initial tiers (Free tier active immediately; paid tiers pending provider activation)
INSERT INTO public.plans (name, slug, price_monthly, price_yearly, currency, max_events, max_attendees, features, is_active)
VALUES 
  ('Free', 'free', 0, 0, 'GBP', 1, 100, ARRAY['public_registration', 'pass_issuance', 'standard_checkin', 'core_analytics'], true),
  ('Starter', 'starter', 1500, 15000, 'GBP', 3, 1000, ARRAY['public_registration', 'pass_issuance', 'standard_checkin', 'core_analytics', 'csv_import', 'csv_export'], false),
  ('Pro', 'pro', 3900, 39000, 'GBP', 10, 5000, ARRAY['public_registration', 'pass_issuance', 'standard_checkin', 'core_analytics', 'csv_import', 'csv_export', 'custom_pass_design', 'advanced_analytics', 'remove_branding'], false),
  ('Business', 'business', 7900, 79000, 'GBP', 50, 25000, ARRAY['public_registration', 'pass_issuance', 'standard_checkin', 'core_analytics', 'csv_import', 'csv_export', 'custom_pass_design', 'advanced_analytics', 'remove_branding', 'api_access', 'webhooks'], false)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  plan_id uuid NOT NULL REFERENCES public.plans(id),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
  provider text NOT NULL DEFAULT 'free',
  provider_subscription_id text,
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL DEFAULT (now() + interval '100 years'),
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);

-- ── 4. Events & Ticket Types ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  starts_at_utc timestamptz,
  ends_at_utc timestamptz,
  venue text NOT NULL,
  event_type text NOT NULL DEFAULT 'physical' CHECK (event_type IN ('physical', 'online', 'hybrid')),
  country_code text NOT NULL DEFAULT 'GB',
  currency text NOT NULL DEFAULT 'GBP',
  timezone text NOT NULL DEFAULT 'Europe/London',
  locale text NOT NULL DEFAULT 'en-GB',
  logo_url text,
  banner_url text,
  attendee_limit integer NOT NULL DEFAULT 100,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'published', 'completed', 'cancelled')),
  application_enabled boolean NOT NULL DEFAULT true,
  auto_approve boolean NOT NULL DEFAULT false,
  is_paid_event boolean NOT NULL DEFAULT false,
  ticket_price integer NOT NULL DEFAULT 0, -- major units (0 for free)
  apply_slug text NOT NULL UNIQUE,
  custom_fields jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_org ON public.events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_apply_slug ON public.events(apply_slug);
CREATE INDEX IF NOT EXISTS idx_events_country_currency ON public.events(country_code, currency);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);

CREATE TABLE IF NOT EXISTS public.ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price_minor bigint NOT NULL DEFAULT 0, -- minor units (pence)
  price integer NOT NULL DEFAULT 0,       -- alias
  fee_minor bigint NOT NULL DEFAULT 0,
  tax_minor bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'GBP',
  capacity integer NOT NULL DEFAULT 100,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'sold_out', 'hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON public.ticket_types(event_id);

-- ── 5. Attendees, Passes, and Check-Ins ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id uuid REFERENCES public.ticket_types(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  pass_type text NOT NULL DEFAULT 'participant',
  application_status text NOT NULL DEFAULT 'pending'
    CHECK (application_status IN ('pending', 'approved', 'rejected', 'waitlisted', 'cancellation_requested', 'cancelled')),
  pass_status text NOT NULL DEFAULT 'not_generated'
    CHECK (pass_status IN ('not_generated', 'generated', 'checked_in')),
  custom_responses jsonb DEFAULT '{}'::jsonb,
  consent_recorded_at timestamptz NOT NULL DEFAULT now(),
  privacy_version text NOT NULL DEFAULT 'uk_gdpr_v1',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT attendees_event_email_key UNIQUE (event_id, email)
);

CREATE INDEX IF NOT EXISTS idx_attendees_event ON public.attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_attendees_status ON public.attendees(event_id, application_status);
CREATE INDEX IF NOT EXISTS idx_attendees_email ON public.attendees(email);

CREATE TABLE IF NOT EXISTS public.passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id uuid NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE UNIQUE,
  ticket_type_id uuid REFERENCES public.ticket_types(id) ON DELETE SET NULL,
  pass_type text NOT NULL DEFAULT 'participant',
  pass_token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex') UNIQUE,
  status text NOT NULL DEFAULT 'generated'
    CHECK (status IN ('not_generated', 'generated', 'checked_in', 'revoked')),
  total_guests integer NOT NULL DEFAULT 1,
  checked_in_guests integer NOT NULL DEFAULT 0,
  is_group_master boolean NOT NULL DEFAULT false,
  is_group_pass boolean NOT NULL DEFAULT false,
  generated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_passes_event ON public.passes(event_id);
CREATE INDEX IF NOT EXISTS idx_passes_token ON public.passes(pass_token);

CREATE TABLE IF NOT EXISTS public.check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id uuid NOT NULL REFERENCES public.passes(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id uuid NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  scan_operation_id text UNIQUE,
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  checked_in_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  check_in_method text NOT NULL DEFAULT 'qr',
  gate_name text DEFAULT 'Main Entrance',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_check_ins_pass ON public.check_ins(pass_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_event ON public.check_ins(event_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_scan_op ON public.check_ins(scan_operation_id) WHERE scan_operation_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.ticket_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id uuid REFERENCES public.ticket_types(id) ON DELETE CASCADE,
  buyer_email text NOT NULL,
  buyer_name text NOT NULL,
  order_id text,
  status text NOT NULL DEFAULT 'RESERVED'
    CHECK (status IN ('AVAILABLE', 'RESERVED', 'PAID', 'APPROVED', 'CHECKED_IN', 'EXPIRED', 'CANCELLED')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservations_event ON public.ticket_reservations(event_id, ticket_type_id, status, expires_at);

-- ── 6. UK GDPR Compliance & Privacy ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.privacy_erasure_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id text NOT NULL UNIQUE,
  email text NOT NULL,
  verification_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  token_expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'VERIFIED', 'PROCESSING', 'COMPLETED', 'REJECTED')),
  records_scrubbed integer NOT NULL DEFAULT 0,
  requested_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz,
  completed_at timestamptz,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_privacy_erasure_email ON public.privacy_erasure_requests(email);
CREATE INDEX IF NOT EXISTS idx_privacy_erasure_token ON public.privacy_erasure_requests(verification_token);

-- ── 7. UK Organic Acquisition & Lead Capture ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  organization_name text,
  city text,
  expected_attendees text,
  source_page text,
  referrer text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON public.lead_captures(email);

-- ── 8. Stored Procedures / RPCs ─────────────────────────────────────────────

-- Atomic Check-in RPC
CREATE OR REPLACE FUNCTION public.atomic_check_in_pass(
  p_pass_token text,
  p_event_id uuid,
  p_checked_in_by uuid,
  p_gate_id uuid DEFAULT NULL,
  p_check_in_method text DEFAULT 'qr',
  p_scan_operation_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_pass_id uuid;
  v_attendee_id uuid;
  v_pass_type text;
  v_pass_status text;
  v_att_name text;
  v_att_email text;
  v_att_app_status text;
  v_existing_ci_at timestamptz;
  v_new_ci_id uuid;
  v_new_ci_at timestamptz;
BEGIN
  -- Idempotency check via scan_operation_id
  IF p_scan_operation_id IS NOT NULL THEN
    SELECT c.checked_in_at, a.name, a.email, p.pass_type
    INTO v_existing_ci_at, v_att_name, v_att_email, v_pass_type
    FROM public.check_ins c
    JOIN public.passes p ON p.id = c.pass_id
    JOIN public.attendees a ON a.id = c.attendee_id
    WHERE c.scan_operation_id = p_scan_operation_id;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'status', 'CHECKED_IN',
        'success', true,
        'idempotent', true,
        'checkedInAt', v_existing_ci_at,
        'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
        'passType', v_pass_type
      );
    END IF;
  END IF;

  -- Lock pass row for concurrency serialization
  SELECT p.id, p.attendee_id, p.pass_type, p.status, a.name, a.email, a.application_status
  INTO v_pass_id, v_attendee_id, v_pass_type, v_pass_status, v_att_name, v_att_email, v_att_app_status
  FROM public.passes p
  JOIN public.attendees a ON a.id = p.attendee_id
  WHERE p.pass_token = p_pass_token AND p.event_id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'status', 'NOT_FOUND', 'message', 'Invalid or unrecognised pass token.');
  END IF;

  IF v_att_app_status != 'approved' THEN
    RETURN jsonb_build_object('success', false, 'status', 'NOT_APPROVED', 'message', 'Attendee application is not approved.');
  END IF;

  IF v_pass_status = 'checked_in' THEN
    SELECT checked_in_at INTO v_existing_ci_at FROM public.check_ins WHERE pass_id = v_pass_id ORDER BY checked_in_at DESC LIMIT 1;
    RETURN jsonb_build_object(
      'success', false,
      'status', 'ALREADY_CHECKED_IN',
      'alreadyCheckedIn', true,
      'message', 'Pass has already been checked in.',
      'checkedInAt', v_existing_ci_at,
      'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type)
    );
  END IF;

  v_new_ci_at := now();
  INSERT INTO public.check_ins (pass_id, event_id, attendee_id, scan_operation_id, checked_in_at, checked_in_by, check_in_method)
  VALUES (v_pass_id, p_event_id, v_attendee_id, p_scan_operation_id, v_new_ci_at, p_checked_in_by, p_check_in_method)
  RETURNING id INTO v_new_ci_id;

  UPDATE public.passes SET status = 'checked_in', updated_at = v_new_ci_at WHERE id = v_pass_id;
  UPDATE public.attendees SET pass_status = 'checked_in', updated_at = v_new_ci_at WHERE id = v_attendee_id;

  RETURN jsonb_build_object(
    'success', true,
    'status', 'CHECKED_IN',
    'checkInId', v_new_ci_id,
    'checkedInAt', v_new_ci_at,
    'attendee', jsonb_build_object('name', v_att_name, 'email', v_att_email, 'pass_type', v_pass_type),
    'passType', v_pass_type
  );
END;
$$;

-- Atomic Group Entry Check-in RPC
CREATE OR REPLACE FUNCTION public.group_entry_checkin(
  p_pass_token text,
  p_event_id uuid,
  p_admit_count integer,
  p_checked_in_by uuid,
  p_gate_name text DEFAULT 'Main Entrance'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_pass_id uuid;
  v_attendee_id uuid;
  v_total_guests integer;
  v_checked_in integer;
  v_remaining integer;
  v_now timestamptz := now();
BEGIN
  IF p_admit_count <= 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Admit count must be at least 1.');
  END IF;

  SELECT p.id, p.attendee_id, p.total_guests, p.checked_in_guests
  INTO v_pass_id, v_attendee_id, v_total_guests, v_checked_in
  FROM public.passes p
  WHERE p.pass_token = p_pass_token AND p.event_id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'status', 'NOT_FOUND', 'message', 'Pass token not found.');
  END IF;

  v_remaining := v_total_guests - v_checked_in;
  IF v_remaining <= 0 THEN
    RETURN jsonb_build_object('success', false, 'status', 'EXHAUSTED', 'message', 'All guests on this group pass have already entered.');
  END IF;

  IF p_admit_count > v_remaining THEN
    RETURN jsonb_build_object('success', false, 'status', 'OVER_LIMIT', 'message', 'Requested count exceeds remaining admissions.', 'remaining', v_remaining);
  END IF;

  UPDATE public.passes
  SET checked_in_guests = checked_in_guests + p_admit_count,
      status = CASE WHEN checked_in_guests + p_admit_count >= total_guests THEN 'checked_in' ELSE status END,
      updated_at = v_now
  WHERE id = v_pass_id;

  INSERT INTO public.check_ins (pass_id, event_id, attendee_id, checked_in_at, checked_in_by, check_in_method, gate_name)
  VALUES (v_pass_id, p_event_id, v_attendee_id, v_now, p_checked_in_by, 'group_qr', p_gate_name);

  RETURN jsonb_build_object(
    'success', true,
    'admitted', p_admit_count,
    'totalGuests', v_total_guests,
    'nowCheckedIn', v_checked_in + p_admit_count,
    'remaining', v_remaining - p_admit_count
  );
END;
$$;

-- ── 9. Row Level Security Policies ──────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_erasure_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

-- Profiles: Users manage own profile
CREATE POLICY "profiles_user_all" ON public.profiles FOR ALL USING (auth.uid() = user_id);

-- Organizations: Members can select, Owners/Admins can update
CREATE POLICY "org_member_select" ON public.organizations FOR SELECT USING (
  owner_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.organization_members WHERE organization_id = organizations.id AND user_id = auth.uid() AND status = 'active')
);
CREATE POLICY "org_owner_all" ON public.organizations FOR ALL USING (owner_id = auth.uid());

-- Events: Public can view active/published events; Organizers manage own events
CREATE POLICY "events_public_select" ON public.events FOR SELECT USING (status IN ('active', 'published'));
CREATE POLICY "events_organizer_all" ON public.events FOR ALL USING (
  organizer_id = auth.uid() OR
  (organization_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = events.organization_id AND user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'event_manager')
  ))
);

-- Ticket Types: Public can view active ticket types; Organizers manage them
CREATE POLICY "ticket_types_public_select" ON public.ticket_types FOR SELECT USING (status = 'active');
CREATE POLICY "ticket_types_organizer_all" ON public.ticket_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = ticket_types.event_id AND events.organizer_id = auth.uid())
);

-- Attendees: Public can register (insert); Organizers can manage attendees
CREATE POLICY "attendees_public_insert" ON public.attendees FOR INSERT WITH CHECK (true);
CREATE POLICY "attendees_organizer_all" ON public.attendees FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = attendees.event_id AND events.organizer_id = auth.uid())
);

-- Passes: Public can view pass by token; Organizers manage passes
CREATE POLICY "passes_public_select" ON public.passes FOR SELECT USING (true);
CREATE POLICY "passes_organizer_all" ON public.passes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = passes.event_id AND events.organizer_id = auth.uid())
);

-- Privacy Erasure Requests: STRICT SERVICE ROLE ONLY
CREATE POLICY "privacy_erasure_service_only" ON public.privacy_erasure_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Lead Captures: Public insert; Service role select
CREATE POLICY "lead_captures_public_insert" ON public.lead_captures FOR INSERT WITH CHECK (true);
CREATE POLICY "lead_captures_service_select" ON public.lead_captures FOR SELECT TO service_role USING (true);
