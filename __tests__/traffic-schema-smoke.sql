BEGIN;
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE service_role;
CREATE SCHEMA auth;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS $$ SELECT 'service_role'::text $$;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE TABLE public.profiles (user_id uuid PRIMARY KEY, created_at timestamptz DEFAULT now());
CREATE TABLE public.events (id uuid PRIMARY KEY, organizer_id uuid);
CREATE TABLE public.invoices (id uuid PRIMARY KEY, user_id uuid, subscription_id uuid, payment_status text);
\i supabase/migrations/136_traffic_source_analytics.sql
INSERT INTO auth.users VALUES ('22222222-2222-4222-8222-222222222222');
INSERT INTO public.profiles(user_id) VALUES ('22222222-2222-4222-8222-222222222222');
SELECT public.record_traffic_visit('11111111-1111-4111-8111-111111111111','ChatGPT','chatgpt.com',NULL,NULL,NULL,'/');
SELECT public.record_traffic_visit('11111111-1111-4111-8111-111111111111','Google','google.com',NULL,NULL,NULL,'/signup');
SELECT public.link_traffic_visitor('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222');
INSERT INTO public.events VALUES ('33333333-3333-4333-8333-333333333333','22222222-2222-4222-8222-222222222222');
INSERT INTO public.invoices VALUES ('44444444-4444-4444-8444-444444444444','22222222-2222-4222-8222-222222222222','55555555-5555-4555-8555-555555555555','paid');
DO $$
DECLARE row jsonb;
BEGIN
  row := public.traffic_source_report(30,'day')->'sources'->0;
  IF row->>'source' <> 'ChatGPT' OR (row->>'visitors')::int <> 1
     OR (row->>'signups')::int <> 1 OR (row->>'eventsCreated')::int <> 1
     OR (row->>'paidSubscriptions')::int <> 1 THEN
    RAISE EXCEPTION 'traffic cohort report failed: %', row;
  END IF;
  IF (SELECT count(*) FROM public.traffic_visitor_days) <> 1 THEN
    RAISE EXCEPTION 'visitor was counted twice in one day';
  END IF;
END $$;
SELECT public.delete_traffic_visitor('11111111-1111-4111-8111-111111111111');
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.traffic_visitors) OR
     EXISTS (SELECT 1 FROM public.traffic_visitor_days) OR
     EXISTS (SELECT 1 FROM public.profiles WHERE first_touch_source IS NOT NULL OR last_touch_source IS NOT NULL) THEN
    RAISE EXCEPTION 'traffic consent withdrawal did not erase attribution';
  END IF;
END $$;
ROLLBACK;
