-- ====================================================================
-- Migration 138: UrPass Special Diwali Campaign (70% Flash Sale)
-- Code: DIWALI70
-- Window: Nov 7, 2026, 12:00 PM IST to Nov 9, 2026, 12:00 PM IST (48 Hours)
-- ====================================================================

INSERT INTO public.coupons (
  code,
  description,
  discount_type,
  discount_value,
  applicable_plans,
  applicable_products,
  duration_months,
  start_date,
  expiry_date,
  per_customer_limit,
  new_customers_only,
  is_active
) VALUES (
  'DIWALI70',
  'Diwali Flash Sale — 70% off first payment on all plans',
  'percentage',
  70,
  ARRAY['starter', 'pro', 'business'],
  ARRAY['subscription'],
  1,
  '2026-11-07 12:00:00+05:30',
  '2026-11-09 12:00:00+05:30',
  1,
  false,
  true
) ON CONFLICT (code) DO UPDATE SET
  discount_type = 'percentage',
  discount_value = 70,
  applicable_plans = ARRAY['starter', 'pro', 'business'],
  applicable_products = ARRAY['subscription'],
  duration_months = 1,
  start_date = '2026-11-07 12:00:00+05:30',
  expiry_date = '2026-11-09 12:00:00+05:30',
  is_active = true;

