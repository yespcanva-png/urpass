-- Consent-only, first-party acquisition data. No IP addresses or raw URLs are stored.
CREATE TABLE IF NOT EXISTS public.traffic_visitors (
  id uuid PRIMARY KEY,
  first_source text NOT NULL,
  last_source text NOT NULL,
  first_referrer_host text,
  last_referrer_host text,
  first_utm_source text,
  last_utm_source text,
  first_utm_medium text,
  last_utm_medium text,
  first_utm_campaign text,
  last_utm_campaign text,
  first_landing_path text,
  last_landing_path text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS traffic_visitors_first_seen_idx ON public.traffic_visitors(first_seen_at DESC);
CREATE INDEX IF NOT EXISTS traffic_visitors_last_seen_idx ON public.traffic_visitors(last_seen_at);
CREATE INDEX IF NOT EXISTS traffic_visitors_first_source_idx ON public.traffic_visitors(first_source);
ALTER TABLE public.traffic_visitors ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.traffic_visitor_days (
  visitor_id uuid NOT NULL REFERENCES public.traffic_visitors(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  source text NOT NULL,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (visitor_id, visit_date)
);
CREATE INDEX IF NOT EXISTS traffic_visitor_days_date_idx ON public.traffic_visitor_days(visit_date DESC, source);
ALTER TABLE public.traffic_visitor_days ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_traffic_visitor_id uuid REFERENCES public.traffic_visitors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_traffic_visitor_id uuid REFERENCES public.traffic_visitors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS first_touch_source text,
  ADD COLUMN IF NOT EXISTS first_touch_referrer_host text,
  ADD COLUMN IF NOT EXISTS first_touch_utm_source text,
  ADD COLUMN IF NOT EXISTS first_touch_utm_medium text,
  ADD COLUMN IF NOT EXISTS first_touch_utm_campaign text,
  ADD COLUMN IF NOT EXISTS first_touch_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_touch_source text,
  ADD COLUMN IF NOT EXISTS last_touch_referrer_host text,
  ADD COLUMN IF NOT EXISTS last_touch_utm_source text,
  ADD COLUMN IF NOT EXISTS last_touch_utm_medium text,
  ADD COLUMN IF NOT EXISTS last_touch_utm_campaign text,
  ADD COLUMN IF NOT EXISTS last_touch_at timestamptz;
CREATE INDEX IF NOT EXISTS profiles_first_traffic_visitor_idx ON public.profiles(first_traffic_visitor_id);
CREATE INDEX IF NOT EXISTS profiles_last_traffic_visitor_idx ON public.profiles(last_traffic_visitor_id);
CREATE INDEX IF NOT EXISTS profiles_first_touch_source_idx ON public.profiles(first_touch_source);

CREATE TABLE IF NOT EXISTS public.traffic_retention_state (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  last_run_at timestamptz NOT NULL DEFAULT 'epoch'::timestamptz
);
INSERT INTO public.traffic_retention_state(id) VALUES (true) ON CONFLICT DO NOTHING;
ALTER TABLE public.traffic_retention_state ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.purge_old_traffic_visitors()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service role required'; END IF;
  UPDATE public.profiles SET first_traffic_visitor_id = NULL, first_touch_source = NULL,
    first_touch_referrer_host = NULL, first_touch_utm_source = NULL,
    first_touch_utm_medium = NULL, first_touch_utm_campaign = NULL, first_touch_at = NULL
  WHERE first_traffic_visitor_id IN (
    SELECT id FROM public.traffic_visitors WHERE last_seen_at < now() - interval '180 days');
  UPDATE public.profiles SET last_traffic_visitor_id = NULL, last_touch_source = NULL,
    last_touch_referrer_host = NULL, last_touch_utm_source = NULL,
    last_touch_utm_medium = NULL, last_touch_utm_campaign = NULL, last_touch_at = NULL
  WHERE last_traffic_visitor_id IN (
    SELECT id FROM public.traffic_visitors WHERE last_seen_at < now() - interval '180 days');
  DELETE FROM public.traffic_visitors WHERE last_seen_at < now() - interval '180 days';
END $$;
REVOKE ALL ON FUNCTION public.purge_old_traffic_visitors() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_old_traffic_visitors() TO service_role;

CREATE OR REPLACE FUNCTION public.record_traffic_visit(
  p_visitor_id uuid, p_source text, p_referrer_host text, p_utm_source text,
  p_utm_medium text, p_utm_campaign text, p_landing_path text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service role required'; END IF;
  INSERT INTO public.traffic_visitors AS v
    (id, first_source, last_source, first_referrer_host, last_referrer_host,
     first_utm_source, last_utm_source, first_utm_medium, last_utm_medium,
     first_utm_campaign, last_utm_campaign, first_landing_path, last_landing_path)
  VALUES (p_visitor_id, p_source, p_source, p_referrer_host, p_referrer_host,
    p_utm_source, p_utm_source, p_utm_medium, p_utm_medium,
    p_utm_campaign, p_utm_campaign, p_landing_path, p_landing_path)
  ON CONFLICT (id) DO UPDATE SET
    last_source = EXCLUDED.last_source,
    last_referrer_host = EXCLUDED.last_referrer_host,
    last_utm_source = EXCLUDED.last_utm_source,
    last_utm_medium = EXCLUDED.last_utm_medium,
    last_utm_campaign = EXCLUDED.last_utm_campaign,
    last_landing_path = EXCLUDED.last_landing_path,
    last_seen_at = now();

  INSERT INTO public.traffic_visitor_days (visitor_id, visit_date, source)
  VALUES (p_visitor_id, (now() AT TIME ZONE 'UTC')::date, p_source)
  ON CONFLICT (visitor_id, visit_date) DO UPDATE SET last_seen_at = now();

  UPDATE public.traffic_retention_state SET last_run_at = now()
  WHERE id = true AND last_run_at < now() - interval '1 day';
  IF FOUND THEN PERFORM public.purge_old_traffic_visitors(); END IF;
END $$;
REVOKE ALL ON FUNCTION public.record_traffic_visit(uuid,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_traffic_visit(uuid,text,text,text,text,text,text) TO service_role;

CREATE OR REPLACE FUNCTION public.link_traffic_visitor(p_visitor_id uuid, p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v public.traffic_visitors%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service role required'; END IF;
  SELECT * INTO v FROM public.traffic_visitors WHERE id = p_visitor_id;
  IF NOT FOUND THEN RETURN; END IF;
  UPDATE public.profiles AS p SET
    first_traffic_visitor_id = COALESCE(p.first_traffic_visitor_id, v.id),
    first_touch_source = COALESCE(p.first_touch_source, v.first_source),
    first_touch_referrer_host = COALESCE(p.first_touch_referrer_host, v.first_referrer_host),
    first_touch_utm_source = COALESCE(p.first_touch_utm_source, v.first_utm_source),
    first_touch_utm_medium = COALESCE(p.first_touch_utm_medium, v.first_utm_medium),
    first_touch_utm_campaign = COALESCE(p.first_touch_utm_campaign, v.first_utm_campaign),
    first_touch_at = COALESCE(p.first_touch_at, v.first_seen_at),
    last_traffic_visitor_id = v.id,
    last_touch_source = v.last_source,
    last_touch_referrer_host = v.last_referrer_host,
    last_touch_utm_source = v.last_utm_source,
    last_touch_utm_medium = v.last_utm_medium,
    last_touch_utm_campaign = v.last_utm_campaign,
    last_touch_at = v.last_seen_at
  WHERE p.user_id = p_user_id;
END $$;
REVOKE ALL ON FUNCTION public.link_traffic_visitor(uuid,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.link_traffic_visitor(uuid,uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.delete_traffic_visitor(p_visitor_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service role required'; END IF;
  UPDATE public.profiles SET
    first_traffic_visitor_id = NULL, first_touch_source = NULL,
    first_touch_referrer_host = NULL, first_touch_utm_source = NULL,
    first_touch_utm_medium = NULL, first_touch_utm_campaign = NULL,
    first_touch_at = NULL
  WHERE first_traffic_visitor_id = p_visitor_id;
  UPDATE public.profiles SET
    last_traffic_visitor_id = NULL, last_touch_source = NULL,
    last_touch_referrer_host = NULL, last_touch_utm_source = NULL,
    last_touch_utm_medium = NULL, last_touch_utm_campaign = NULL,
    last_touch_at = NULL
  WHERE last_traffic_visitor_id = p_visitor_id;
  DELETE FROM public.traffic_visitors WHERE id = p_visitor_id;
END $$;
REVOKE ALL ON FUNCTION public.delete_traffic_visitor(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_traffic_visitor(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.traffic_source_report(p_days integer, p_grain text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  IF auth.role() <> 'service_role' THEN RAISE EXCEPTION 'service role required'; END IF;
  IF p_days NOT BETWEEN 1 AND 180 OR p_grain NOT IN ('day','week','month') THEN
    RAISE EXCEPTION 'invalid report range';
  END IF;

  WITH cohort AS (
    SELECT v.*
    FROM public.traffic_visitors v
    WHERE v.first_seen_at >= now() - make_interval(days => p_days)
  ), outcomes AS (
    SELECT c.*,
      (SELECT count(*) FROM public.profiles p WHERE p.first_traffic_visitor_id = c.id) AS signups,
      (SELECT count(*) FROM public.events e JOIN public.profiles p ON p.user_id = e.organizer_id
        WHERE p.first_traffic_visitor_id = c.id) AS events_created,
      (SELECT count(DISTINCT i.user_id) FROM public.invoices i
        JOIN public.profiles p ON p.user_id = i.user_id
        WHERE p.first_traffic_visitor_id = c.id
          AND i.subscription_id IS NOT NULL AND i.payment_status = 'paid') AS paid_subscriptions
    FROM cohort c
  ), sources AS (
    SELECT first_source AS source, count(*) AS visitors,
      sum(signups) AS signups, sum(events_created) AS events_created,
      sum(paid_subscriptions) AS paid_subscriptions,
      count(*) FILTER (WHERE signups > 0) AS signed_up_visitors,
      count(*) FILTER (WHERE paid_subscriptions > 0) AS paying_visitors
    FROM outcomes GROUP BY first_source
  ), period_visits AS (
    SELECT date_trunc(p_grain, d.visit_date::timestamp)::date AS bucket,
      d.visitor_id, d.source,
      row_number() OVER (PARTITION BY date_trunc(p_grain, d.visit_date::timestamp), d.visitor_id
        ORDER BY d.visit_date, d.first_seen_at) AS source_rank
    FROM public.traffic_visitor_days d
    WHERE d.visit_date >= (now() AT TIME ZONE 'UTC')::date - (p_days - 1)
  ), series AS (
    SELECT bucket, source, count(*) AS visitors
    FROM period_visits WHERE source_rank = 1
    GROUP BY 1, 2
  )
  SELECT jsonb_build_object(
    'sources', COALESCE((SELECT jsonb_agg(jsonb_build_object(
      'source', source, 'visitors', visitors, 'signups', signups,
      'eventsCreated', events_created, 'paidSubscriptions', paid_subscriptions,
      'signupRate', round(100.0 * signed_up_visitors / NULLIF(visitors, 0), 1),
      'paidRate', round(100.0 * paying_visitors / NULLIF(visitors, 0), 1)
    ) ORDER BY visitors DESC) FROM sources), '[]'::jsonb),
    'series', COALESCE((SELECT jsonb_agg(jsonb_build_object(
      'bucket', bucket, 'source', source, 'visitors', visitors)
      ORDER BY bucket, source) FROM series), '[]'::jsonb),
    'visitors', COALESCE((SELECT jsonb_agg(jsonb_build_object(
      'id', id, 'firstSource', first_source, 'lastSource', last_source,
      'firstReferrerHost', first_referrer_host, 'firstUtmSource', first_utm_source,
      'firstUtmMedium', first_utm_medium, 'firstUtmCampaign', first_utm_campaign,
      'firstLandingPath', first_landing_path, 'firstSeenAt', first_seen_at,
      'lastSeenAt', last_seen_at, 'signups', signups,
      'eventsCreated', events_created, 'paidSubscriptions', paid_subscriptions)
    ORDER BY first_seen_at DESC) FROM (SELECT * FROM outcomes ORDER BY first_seen_at DESC LIMIT 100) recent), '[]'::jsonb)
  ) INTO result;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.traffic_source_report(integer,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.traffic_source_report(integer,text) TO service_role;
