-- ============================================================
-- Migration 070: Stage 3 Commercial Exhibitor, Sponsor & Lead Retrieval Layer
-- Covers:
--   1. Sponsorship Tiers (Platinum, Gold, Silver, Bronze, Custom)
--   2. Sponsor Management, Visibility Settings & Deliverables Tracker
--   3. Trade Show Booth Allocation & Occupancy Status
--   4. Exhibitor Management, Company Profiles & Products
--   5. Exhibitor Staff Management & Booth Check-in
--   6. Lead Capture & Qualification Engine (Hot/Warm/Cold, Tags, CSV Export)
--   7. B2B Meeting Requests & Matchmaking
--   8. Attendee Exhibitor Directory Bookmarks & Callback Requests
-- ============================================================

-- 1. Sponsorship Tiers
CREATE TABLE IF NOT EXISTS public.event_sponsorship_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  max_sponsors INTEGER NOT NULL DEFAULT 5,
  benefits TEXT[] NOT NULL DEFAULT '{}',
  logo_placement_rules JSONB NOT NULL DEFAULT '{"homepage": true, "event_website": true, "agenda": true, "session": true, "email": true, "badge": true, "app": true}'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsorship_tiers_event ON public.event_sponsorship_tiers(event_id, position);

-- 2. Sponsors
CREATE TABLE IF NOT EXISTS public.event_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES public.event_sponsorship_tiers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  visibility_settings JSONB NOT NULL DEFAULT '{"homepage": true, "event_website": true, "agenda": true, "session": true, "email": true, "badge": true, "app": true}'::jsonb,
  deliverables_status JSONB NOT NULL DEFAULT '{"logo_received": false, "banner_received": false, "booth_confirmed": false, "email_inclusion": false, "stage_branding": false, "social_mention": false}'::jsonb,
  page_views INTEGER NOT NULL DEFAULT 0,
  banner_clicks INTEGER NOT NULL DEFAULT 0,
  booth_visits INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsors_event ON public.event_sponsors(event_id, tier_id);

-- 3. Booths
CREATE TABLE IF NOT EXISTS public.event_booths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  booth_number TEXT NOT NULL,
  size_sqft NUMERIC NOT NULL DEFAULT 100,
  hall_name TEXT NOT NULL DEFAULT 'Main Exhibition Hall',
  zone_id UUID REFERENCES public.event_zones(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'assigned', 'reserved', 'occupied', 'closed')),
  notes TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booths_event ON public.event_booths(event_id, status);

-- 4. Exhibitors
CREATE TABLE IF NOT EXISTS public.event_exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  booth_id UUID REFERENCES public.event_booths(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  category TEXT NOT NULL DEFAULT 'Technology',
  products_services TEXT[] NOT NULL DEFAULT '{}',
  portal_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'pending', 'waitlist', 'cancelled')),
  booth_checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  booth_checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exhibitors_event ON public.event_exhibitors(event_id, status);
CREATE INDEX IF NOT EXISTS idx_exhibitors_token ON public.event_exhibitors(portal_token);

-- 5. Exhibitor Staff
CREATE TABLE IF NOT EXISTS public.exhibitor_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibitor_id UUID NOT NULL REFERENCES public.event_exhibitors(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'booth_staff'
    CHECK (role IN ('booth_manager', 'booth_staff', 'sales_rep', 'technical_specialist')),
  pin_code TEXT,
  can_capture_leads BOOLEAN NOT NULL DEFAULT TRUE,
  is_checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_exhibitor ON public.exhibitor_staff(exhibitor_id);
CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_event ON public.exhibitor_staff(event_id);

-- 6. Exhibitor Leads (QR Lead Retrieval)
CREATE TABLE IF NOT EXISTS public.exhibitor_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  exhibitor_id UUID NOT NULL REFERENCES public.event_exhibitors(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.exhibitor_staff(id) ON DELETE SET NULL,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  attendee_company TEXT,
  attendee_designation TEXT,
  ticket_name TEXT,
  qualification_rating TEXT NOT NULL DEFAULT 'warm'
    CHECK (qualification_rating IN ('hot', 'warm', 'cold')),
  notes TEXT,
  interested_products TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  follow_up_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (follow_up_status IN ('pending', 'contacted', 'meeting_scheduled', 'closed_won', 'unqualified')),
  follow_up_required BOOLEAN NOT NULL DEFAULT TRUE,
  consent_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
  custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exhibitor_leads_event ON public.exhibitor_leads(event_id, exhibitor_id);
CREATE INDEX IF NOT EXISTS idx_exhibitor_leads_captured ON public.exhibitor_leads(captured_at DESC);

-- 7. B2B Meetings
CREATE TABLE IF NOT EXISTS public.exhibitor_b2b_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  exhibitor_id UUID NOT NULL REFERENCES public.event_exhibitors(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_company TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  proposed_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  location TEXT NOT NULL DEFAULT 'Exhibitor Booth',
  meeting_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exhibitor_meetings ON public.exhibitor_b2b_meetings(event_id, exhibitor_id, status);

-- 8. Attendee Bookmarks & Callback Requests
CREATE TABLE IF NOT EXISTS public.attendee_exhibitor_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  exhibitor_id UUID NOT NULL REFERENCES public.event_exhibitors(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE CASCADE,
  notes TEXT,
  callback_requested BOOLEAN NOT NULL DEFAULT FALSE,
  business_card_shared BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_attendee ON public.attendee_exhibitor_bookmarks(attendee_id, exhibitor_id);

-- Enable RLS on all tables
ALTER TABLE public.event_sponsorship_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibitor_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibitor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibitor_b2b_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendee_exhibitor_bookmarks ENABLE ROW LEVEL SECURITY;

-- Permissive public read for attendee directory and sponsor placement
CREATE POLICY "Public read event sponsorship tiers" ON public.event_sponsorship_tiers
  FOR SELECT USING (true);

CREATE POLICY "Public read event sponsors" ON public.event_sponsors
  FOR SELECT USING (true);

CREATE POLICY "Public read event booths" ON public.event_booths
  FOR SELECT USING (true);

CREATE POLICY "Public read event exhibitors" ON public.event_exhibitors
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read attendee bookmarks" ON public.attendee_exhibitor_bookmarks
  FOR SELECT USING (true);

CREATE POLICY "Public insert attendee bookmarks" ON public.attendee_exhibitor_bookmarks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert b2b meeting requests" ON public.exhibitor_b2b_meetings
  FOR INSERT WITH CHECK (true);
