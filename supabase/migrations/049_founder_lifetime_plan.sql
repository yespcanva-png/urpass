-- ============================================================
-- Migration 049: Seed Founder Lifetime Plan
-- Plan price in paise: ₹19,999 = 1999900 paise
-- ============================================================

INSERT INTO plans (
  name,
  slug,
  price_monthly,
  price_yearly,
  max_events,
  max_attendees,
  features,
  is_active
) VALUES (
  'Founder Lifetime',
  'founder',
  1999900,
  1999900,
  999999,
  999999,
  ARRAY[
    'unlimited_events',
    'unlimited_registrations',
    'organizer_seats_50',
    'custom_pass_design',
    'remove_branding',
    'advanced_analytics',
    'cross_event_analytics',
    'custom_domain',
    'api_access',
    'webhooks',
    'priority_support',
    'paid_events',
    'lifetime_license'
  ],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  max_events = EXCLUDED.max_events,
  max_attendees = EXCLUDED.max_attendees,
  features = EXCLUDED.features,
  is_active = true;
