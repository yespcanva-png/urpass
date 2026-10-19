-- ============================================================
-- Migration 112: UrPass Communication Management Redesign
-- Supports:
--   1. Master communication switch & default email channel
--   2. Option 1: Self-Service WhatsApp (Business plan only)
--   3. Option 2: UrPass Managed WhatsApp (paid add-on)
--   4. Notification automation matrix & granular event rules
--   5. Automatic default initialization for new organizations
-- ============================================================

-- 1. Organization Communication Settings Table
CREATE TABLE IF NOT EXISTS public.organization_communication_settings (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  enable_communication BOOLEAN NOT NULL DEFAULT TRUE,
  default_channel TEXT NOT NULL DEFAULT 'email' CHECK (default_channel IN ('email', 'whatsapp')),
  email_communication BOOLEAN NOT NULL DEFAULT TRUE,
  whatsapp_communication BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_integration_model TEXT NOT NULL DEFAULT 'none' 
    CHECK (whatsapp_integration_model IN ('none', 'self_service', 'managed')),
  whatsapp_setup_status TEXT NOT NULL DEFAULT 'not_configured' 
    CHECK (whatsapp_setup_status IN (
      'disabled', 
      'not_configured', 
      'setup_in_progress', 
      'pending_verification', 
      'pending_payment', 
      'pending_admin_activation', 
      'active', 
      'suspended', 
      'failed'
    )),
  automation_rules JSONB NOT NULL DEFAULT '{
    "registration_confirmed": { "email": true, "whatsapp": false },
    "registration_approved": { "email": true, "whatsapp": false },
    "registration_rejected": { "email": true, "whatsapp": false },
    "ticket_issued": { "email": true, "whatsapp": false },
    "qr_pass_generated": { "email": true, "whatsapp": false },
    "event_reminder": { "email": true, "whatsapp": false },
    "event_updated": { "email": true, "whatsapp": false },
    "event_cancelled": { "email": true, "whatsapp": false }
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Self-Service WhatsApp Configuration (Encrypted Credentials at Rest)
CREATE TABLE IF NOT EXISTS public.whatsapp_self_service_configs (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  waba_id TEXT,
  phone_number_id TEXT,
  app_id TEXT,
  encrypted_access_token TEXT,
  encrypted_app_secret TEXT,
  display_phone_number TEXT,
  verified_name TEXT,
  connection_status TEXT NOT NULL DEFAULT 'disconnected' 
    CHECK (connection_status IN ('pending', 'connected', 'disconnected', 'failed')),
  last_verified_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. UrPass Managed WhatsApp Service Requests (Paid Add-on Workflow)
CREATE TABLE IF NOT EXISTS public.whatsapp_managed_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending_review' 
    CHECK (status IN (
      'pending_review', 
      'quote_provided', 
      'pending_payment', 
      'paid', 
      'pending_admin_activation', 
      'active', 
      'suspended', 
      'cancelled'
    )),
  estimated_monthly_volume TEXT NOT NULL,
  use_case TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  quoted_amount NUMERIC(10, 2),
  currency TEXT NOT NULL DEFAULT 'INR',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  paid_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WhatsApp Templates Catalog
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'UTILITY' 
    CHECK (category IN ('UTILITY', 'MARKETING', 'AUTHENTICATION')),
  language TEXT NOT NULL DEFAULT 'en_US',
  status TEXT NOT NULL DEFAULT 'APPROVED' 
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAUSED')),
  header_type TEXT DEFAULT 'NONE',
  header_content TEXT,
  body_text TEXT NOT NULL,
  footer_text TEXT,
  buttons JSONB NOT NULL DEFAULT '[]'::jsonb,
  variable_mappings JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed System Default Template (urpass_ticket)
INSERT INTO public.whatsapp_templates (name, category, language, status, body_text, buttons, is_system)
VALUES (
  'urpass_ticket',
  'UTILITY',
  'en_US',
  'APPROVED',
  'Hello {{1}},\n\nYour pass for {{2}} is ready!\n\n📅 Date: {{3}}\n📍 Venue: {{4}}\n🎟️ Ticket ID: {{5}}\n\nClick the button below to view your digital QR ticket.',
  '[{"type": "URL", "text": "View Mobile Ticket", "url": "https://urpass.space/pass/{{1}}"}]'::jsonb,
  TRUE
)
ON CONFLICT DO NOTHING;

-- 5. Extend events table with communication master switch if not present
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS communication_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS whatsapp_model TEXT NOT NULL DEFAULT 'none';

-- 6. Indexes for Performance & Queries
CREATE INDEX IF NOT EXISTS idx_org_comm_settings_org ON public.organization_communication_settings(organization_id);
CREATE INDEX IF NOT EXISTS idx_wa_self_service_org ON public.whatsapp_self_service_configs(organization_id);
CREATE INDEX IF NOT EXISTS idx_wa_managed_req_org ON public.whatsapp_managed_service_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_wa_managed_req_status ON public.whatsapp_managed_service_requests(status);
CREATE INDEX IF NOT EXISTS idx_wa_templates_org ON public.whatsapp_templates(organization_id);

-- 7. Automatic Default Communication Initialization Trigger for New Organizations
CREATE OR REPLACE FUNCTION public.handle_new_organization_communication_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.organization_communication_settings (
    organization_id,
    enable_communication,
    default_channel,
    email_communication,
    whatsapp_communication,
    whatsapp_integration_model,
    whatsapp_setup_status
  ) VALUES (
    NEW.id,
    TRUE,
    'email',
    TRUE,
    FALSE,
    'none',
    'not_configured'
  )
  ON CONFLICT (organization_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_new_organization_comm_settings ON public.organizations;
CREATE TRIGGER trg_new_organization_comm_settings
  AFTER INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_organization_communication_settings();

-- 8. Enable Row Level Security
ALTER TABLE public.organization_communication_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_self_service_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_managed_service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies (Org Members can read; Owners/Admins can manage)
CREATE POLICY "org_members_read_comm_settings" ON public.organization_communication_settings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_communication_settings.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
    )
  );

CREATE POLICY "org_admins_manage_comm_settings" ON public.organization_communication_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_communication_settings.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "org_admins_manage_self_service" ON public.whatsapp_self_service_configs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = whatsapp_self_service_configs.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "org_members_manage_managed_requests" ON public.whatsapp_managed_service_requests
  FOR ALL TO authenticated
  USING (
    requested_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = whatsapp_managed_service_requests.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "view_templates" ON public.whatsapp_templates
  FOR SELECT TO authenticated
  USING (
    is_system = TRUE OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = whatsapp_templates.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
    )
  );

CREATE POLICY "manage_org_templates" ON public.whatsapp_templates
  FOR ALL TO authenticated
  USING (
    is_system = FALSE AND
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = whatsapp_templates.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.role IN ('owner', 'admin')
    )
  );
