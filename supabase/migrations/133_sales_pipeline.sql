-- India-first enterprise demo pipeline. Only the service role can read or edit leads.
CREATE TABLE IF NOT EXISTS public.sales_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  market text NOT NULL DEFAULT 'IN' CHECK (market IN ('IN', 'GB')),
  event_type text,
  event_date date,
  estimated_registrations integer CHECK (estimated_registrations IS NULL OR estimated_registrations > 0),
  requirements text,
  expected_budget_inr integer CHECK (expected_budget_inr IS NULL OR expected_budget_inr >= 0),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'demo_booked', 'demo_completed', 'proposal_sent', 'negotiation', 'won', 'lost', 'onboarding')),
  lead_owner text,
  next_action text,
  follow_up_at timestamptz,
  deal_value_inr integer CHECK (deal_value_inr IS NULL OR deal_value_inr >= 0),
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  consent_to_contact boolean NOT NULL DEFAULT false,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sales_leads_follow_up_idx ON public.sales_leads (follow_up_at) WHERE status NOT IN ('won', 'lost');
CREATE INDEX IF NOT EXISTS sales_leads_status_created_idx ON public.sales_leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS sales_leads_email_created_idx ON public.sales_leads (email, created_at DESC);
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sales_leads FROM anon, authenticated;
GRANT ALL ON public.sales_leads TO service_role;

CREATE OR REPLACE FUNCTION public.touch_sales_lead() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sales_leads_touch ON public.sales_leads;
CREATE TRIGGER sales_leads_touch BEFORE UPDATE ON public.sales_leads
FOR EACH ROW EXECUTE FUNCTION public.touch_sales_lead();

-- One claim per lifecycle message. A failed claim is removed for a later retry.
CREATE TABLE IF NOT EXISTS public.sales_lifecycle_dispatches (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent')),
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, message_key)
);
ALTER TABLE public.sales_lifecycle_dispatches ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sales_lifecycle_dispatches FROM anon, authenticated;
GRANT ALL ON public.sales_lifecycle_dispatches TO service_role;
