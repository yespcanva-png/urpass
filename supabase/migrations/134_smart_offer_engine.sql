-- ============================================================================
-- Migration 134: UrPass Smart Offer Engine
-- Description: Intent-based offers to maximize zero-budget conversions.
--              Stores smart offers catalog, intent signals, decision logs,
--              interactions, conversions, and control group assignments for lift measurement.
-- ============================================================================

-- 1. Smart Offers Catalog
CREATE TABLE IF NOT EXISTS public.smart_offers (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('value', 'product', 'promotional')),
  intent TEXT NOT NULL CHECK (
    intent IN (
      'exploring',
      'first_event',
      'one_time_event',
      'paid_ticketing',
      'large_event',
      'price_sensitive',
      'returning_organizer'
    )
  ),
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  subtext TEXT NOT NULL,
  badge TEXT NOT NULL,
  primary_cta_label TEXT NOT NULL,
  primary_cta_url TEXT NOT NULL,
  secondary_cta_label TEXT,
  secondary_cta_url TEXT,
  discount_paise INTEGER DEFAULT 0 CHECK (discount_paise >= 0),
  helper_note TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Canonical Smart Offers
INSERT INTO public.smart_offers (
  id,
  category,
  intent,
  title,
  headline,
  subtext,
  badge,
  primary_cta_label,
  primary_cta_url,
  secondary_cta_label,
  secondary_cta_url,
  discount_paise,
  helper_note
) VALUES
  (
    'free_event_creation',
    'value',
    'exploring',
    'Free Event Creation',
    'Explore UrPass with Zero Risk',
    'Publish your first RSVP event for free. Up to 50 attendee registrations, verified QR entry, and zero platform commission.',
    'Free Forever Entry Point',
    'Create Free Event',
    '/create-event',
    'Explore All Features',
    '/features',
    0,
    'Free entry point · No credit card or discount required'
  ),
  (
    'free_guided_setup',
    'value',
    'first_event',
    'Free Guided Setup',
    'Launch your first event with UrPass',
    'Create your event, customise registrations and test your first QR pass. Need a hand? Our engineering team configures it for you in 24 hours at no cost.',
    'First-Time Organiser Privilege',
    'Claim Free Setup',
    '/create-event?concierge=free',
    'Build Yourself',
    '/create-event',
    0,
    'Free entry point · No discount required'
  ),
  (
    'single_event_pass',
    'product',
    'one_time_event',
    'Single-Event Pass',
    'One Event? Pay Once, No Subscription Needed',
    'Running a single annual conference, festival, or one-off meetup? Get full Pro features (up to 250 attendees, custom badges, CSV export) for just ₹299 once.',
    'Zero Recurring Commitment',
    'Get One-Event Pass (₹299)',
    '/pricing#single-event',
    'Compare Plans',
    '/pricing',
    0,
    'One-time purchase · 0% commission · Never auto-renews'
  ),
  (
    'paid_plan_comparison',
    'product',
    'paid_ticketing',
    'Paid Ticketing Plan Comparison',
    'Sell Tickets with 0% Platform Commission',
    'Keep 100% of your ticket revenue minus standard payment gateway fees. Starter (₹499/mo) or Pro (₹999/mo) unlock paid ticketing, multi-tier passes, and instant UPI payouts.',
    '0% Platform Cut',
    'Explore Paid Plans',
    '/pricing',
    'Calculate Your Savings',
    '/ticket-fee-calculator',
    0,
    'Direct Razorpay & UPI payouts straight to your bank account'
  ),
  (
    'business_demo_support',
    'value',
    'large_event',
    'Business Demo & Setup Support',
    'Large Event Access Control & Dedicated Support',
    'Hosting 500+ attendees or managing multiple gate turnstiles? Get a live architecture walkthrough, custom hardware recommendations, and assigned engineering support.',
    'Enterprise Readiness',
    'Book Technical Demo',
    '/contact?intent=enterprise_demo',
    'Call Enterprise Desk',
    '/contact',
    0,
    'Tailored for 500 to 10,000+ attendee summits, expos, and festivals'
  ),
  (
    'price_sensitive_help',
    'value',
    'price_sensitive',
    'Free Plan & Consultation',
    'Need Help Choosing the Right Setup?',
    'UrPass includes a 100% Free Forever plan for events up to 50 attendees. Let our team understand your requirements and find the most cost-effective path.',
    'Cost-Conscious Assistance',
    'Start on Free Plan',
    '/create-event',
    'Talk to Event Specialist',
    '/contact?intent=pricing_guidance',
    0,
    'Zero cost entry · We prioritize helpful guidance over forced discounts'
  ),
  (
    'repeat_event_shortcut',
    'product',
    'returning_organizer',
    'Repeat Event Shortcut',
    'Ready for Your Next Event?',
    'Duplicate your past event settings, forms, and ticket design in one click. Or upgrade to a recurring monthly plan for unlimited events.',
    'Returning Organiser Shortcut',
    'Duplicate Previous Event',
    '/create-event?duplicate=recent',
    'View Annual Plans',
    '/pricing?cycle=annual',
    0,
    'Preserves your branding, ticket fields, and gate scanner setup'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  headline = EXCLUDED.headline,
  subtext = EXCLUDED.subtext,
  badge = EXCLUDED.badge,
  primary_cta_label = EXCLUDED.primary_cta_label,
  primary_cta_url = EXCLUDED.primary_cta_url,
  secondary_cta_label = EXCLUDED.secondary_cta_label,
  secondary_cta_url = EXCLUDED.secondary_cta_url,
  helper_note = EXCLUDED.helper_note,
  updated_at = now();

-- 2. Smart Offer Decisions & Tracking
CREATE TABLE IF NOT EXISTS public.smart_offer_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  offer_id TEXT NOT NULL REFERENCES public.smart_offers(id) ON DELETE RESTRICT,
  intent TEXT NOT NULL CHECK (
    intent IN (
      'exploring',
      'first_event',
      'one_time_event',
      'paid_ticketing',
      'large_event',
      'price_sensitive',
      'returning_organizer'
    )
  ),
  trigger_name TEXT NOT NULL CHECK (
    trigger_name IN (
      'new_signup',
      'draft_abandoned',
      'plan_limit_approaching',
      'checkout_abandoned',
      'paid_feature_selected',
      'event_completed',
      'second_event_created',
      'first_visit',
      'pricing_browse',
      'manual_preview'
    )
  ),
  reason TEXT NOT NULL,
  eligibility JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_control_group BOOLEAN NOT NULL DEFAULT false,
  shown_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  interacted_at TIMESTAMPTZ,
  interaction_type TEXT CHECK (
    interaction_type IS NULL OR
    interaction_type IN ('viewed', 'clicked', 'dismissed', 'accepted')
  ),
  converted_at TIMESTAMPTZ,
  conversion_outcome TEXT CHECK (
    conversion_outcome IS NULL OR
    conversion_outcome IN (
      'event_created',
      'event_published',
      'paid_plan_purchased',
      'event_pass_purchased',
      'demo_booked',
      'setup_claimed',
      'draft_resumed'
    )
  ),
  revenue_inr NUMERIC DEFAULT 0 CHECK (revenue_inr >= 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_smart_decisions_user ON public.smart_offer_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_decisions_session ON public.smart_offer_decisions(session_id);
CREATE INDEX IF NOT EXISTS idx_smart_decisions_offer ON public.smart_offer_decisions(offer_id);
CREATE INDEX IF NOT EXISTS idx_smart_decisions_intent ON public.smart_offer_decisions(intent);
CREATE INDEX IF NOT EXISTS idx_smart_decisions_created ON public.smart_offer_decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_smart_decisions_control ON public.smart_offer_decisions(is_control_group);

-- 3. Smart Offer Intent Signals
CREATE TABLE IF NOT EXISTS public.smart_offer_intent_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  event_type TEXT,
  event_date DATE,
  estimated_attendees INTEGER CHECK (estimated_attendees IS NULL OR estimated_attendees >= 0),
  selected_features TEXT[] DEFAULT '{}',
  has_paid_ticketing BOOLEAN DEFAULT false,
  pricing_visits_count INTEGER NOT NULL DEFAULT 0,
  last_pricing_visit_at TIMESTAMPTZ,
  checkout_abandoned_at TIMESTAMPTZ,
  draft_abandoned_at TIMESTAMPTZ,
  usage_ratio NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_signals UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_smart_signals_user ON public.smart_offer_intent_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_signals_session ON public.smart_offer_intent_signals(session_id);

-- 4. Row Level Security
ALTER TABLE public.smart_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_offer_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_offer_intent_signals ENABLE ROW LEVEL SECURITY;

-- smart_offers is readable by anyone
CREATE POLICY "smart_offers_public_read" ON public.smart_offers
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- smart_offer_decisions: users can view and update their own decisions
CREATE POLICY "smart_offer_decisions_user_select" ON public.smart_offer_decisions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "smart_offer_decisions_user_insert" ON public.smart_offer_decisions
  FOR INSERT TO anon, authenticated WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );

CREATE POLICY "smart_offer_decisions_user_update" ON public.smart_offer_decisions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- smart_offer_intent_signals: users can view/manage their own signals
CREATE POLICY "smart_offer_signals_user_all" ON public.smart_offer_intent_signals
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role has full permissions on all tables
GRANT ALL ON public.smart_offers TO service_role;
GRANT ALL ON public.smart_offer_decisions TO service_role;
GRANT ALL ON public.smart_offer_intent_signals TO service_role;
