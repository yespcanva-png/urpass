-- Migration 137: User Intelligence Dashboard & Full-Lifecycle Event Analytics
-- Tracks full organizer journey from first-touch acquisition (ChatGPT, Google, Product Hunt, etc.)
-- to signup, first event activation, and paid subscription.

CREATE TABLE IF NOT EXISTS public.traffic_lifecycle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid REFERENCES public.traffic_visitors(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  properties jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS traffic_lifecycle_events_name_idx ON public.traffic_lifecycle_events(event_name);
CREATE INDEX IF NOT EXISTS traffic_lifecycle_events_visitor_idx ON public.traffic_lifecycle_events(visitor_id);
CREATE INDEX IF NOT EXISTS traffic_lifecycle_events_user_idx ON public.traffic_lifecycle_events(user_id);
CREATE INDEX IF NOT EXISTS traffic_lifecycle_events_created_idx ON public.traffic_lifecycle_events(created_at DESC);

ALTER TABLE public.traffic_lifecycle_events ENABLE ROW LEVEL SECURITY;

-- 1. Secure RPC to record lifecycle events from server or API endpoint
CREATE OR REPLACE FUNCTION public.record_lifecycle_event(
  p_visitor_id uuid,
  p_user_id uuid,
  p_event_name text,
  p_properties jsonb DEFAULT '{}'::jsonb
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required';
  END IF;

  INSERT INTO public.traffic_lifecycle_events (visitor_id, user_id, event_name, properties)
  VALUES (p_visitor_id, p_user_id, p_event_name, COALESCE(p_properties, '{}'::jsonb));
END $$;

REVOKE ALL ON FUNCTION public.record_lifecycle_event(uuid, uuid, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_lifecycle_event(uuid, uuid, text, jsonb) TO service_role;

-- 2. Secure RPC to generate comprehensive User Intelligence Report for UrPass Ops
CREATE OR REPLACE FUNCTION public.user_intelligence_report(p_days integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_result jsonb;
  v_visitors_count bigint;
  v_signups_count bigint;
  v_activated_count bigint;
  v_paying_count bigint;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required';
  END IF;

  IF p_days NOT BETWEEN 1 AND 180 THEN
    RAISE EXCEPTION 'invalid days range (must be 1-180)';
  END IF;

  -- High-level Funnel Metrics in period
  SELECT count(*) INTO v_visitors_count
  FROM public.traffic_visitors
  WHERE first_seen_at >= now() - make_interval(days => p_days);

  SELECT count(DISTINCT p.user_id) INTO v_signups_count
  FROM public.profiles p
  WHERE p.created_at >= now() - make_interval(days => p_days);

  -- Activated: Organisers who signed up in period and created at least 1 event
  SELECT count(DISTINCT p.user_id) INTO v_activated_count
  FROM public.profiles p
  JOIN public.events e ON e.organizer_id = p.user_id
  WHERE p.created_at >= now() - make_interval(days => p_days);

  -- Paying: Organisers who signed up in period and have a paid subscription or paid event pass
  SELECT count(DISTINCT p.user_id) INTO v_paying_count
  FROM public.profiles p
  WHERE p.created_at >= now() - make_interval(days => p_days)
    AND (
      EXISTS (
        SELECT 1 FROM public.invoices i
        WHERE i.user_id = p.user_id AND i.payment_status = 'paid'
      )
      OR EXISTS (
        SELECT 1 FROM public.subscriptions s
        WHERE s.user_id = p.user_id AND s.status = 'active' AND s.plan_id NOT IN ('free', 'plan_free')
      )
    );

  WITH cohort_visitors AS (
    SELECT v.*
    FROM public.traffic_visitors v
    WHERE v.first_seen_at >= now() - make_interval(days => p_days)
  ),
  source_breakdown AS (
    SELECT
      v.first_source AS source,
      count(DISTINCT v.id) AS visitors,
      count(DISTINCT p.user_id) AS signups,
      count(DISTINCT CASE WHEN e.id IS NOT NULL THEN p.user_id END) AS activated,
      count(DISTINCT CASE WHEN (inv.id IS NOT NULL OR (sub.id IS NOT NULL AND sub.status = 'active' AND sub.plan_id NOT IN ('free', 'plan_free'))) THEN p.user_id END) AS paying
    FROM cohort_visitors v
    LEFT JOIN public.profiles p ON p.first_traffic_visitor_id = v.id
    LEFT JOIN public.events e ON e.organizer_id = p.user_id
    LEFT JOIN public.invoices inv ON inv.user_id = p.user_id AND inv.payment_status = 'paid'
    LEFT JOIN public.subscriptions sub ON sub.user_id = p.user_id
    GROUP BY v.first_source
  ),
  organizers_journey AS (
    SELECT
      p.user_id,
      COALESCE(NULLIF(p.full_name, ''), NULLIF(p.org_name, ''), 'Organiser ' || substr(p.user_id::text, 1, 6)) AS name,
      COALESCE(p.first_touch_source, v.first_source, 'Direct / Unknown') AS first_source,
      COALESCE(p.last_touch_source, v.last_source, p.first_touch_source, 'Direct / Unknown') AS last_source,
      p.first_touch_referrer_host AS referrer_host,
      p.first_touch_utm_source AS utm_source,
      p.first_touch_utm_campaign AS utm_campaign,
      p.created_at AS signed_up_at,
      p.last_touch_at,
      count(DISTINCT e.id) AS events_count,
      bool_or(inv.payment_status = 'paid' OR (sub.status = 'active' AND sub.plan_id NOT IN ('free', 'plan_free'))) AS is_paying,
      max(sub.plan_id) AS plan_id
    FROM public.profiles p
    LEFT JOIN public.traffic_visitors v ON v.id = p.first_traffic_visitor_id
    LEFT JOIN public.events e ON e.organizer_id = p.user_id
    LEFT JOIN public.invoices inv ON inv.user_id = p.user_id AND inv.payment_status = 'paid'
    LEFT JOIN public.subscriptions sub ON sub.user_id = p.user_id
    WHERE p.created_at >= now() - make_interval(days => p_days)
    GROUP BY p.user_id, p.full_name, p.org_name, p.first_touch_source, p.last_touch_source,
             v.first_source, v.last_source, p.first_touch_referrer_host, p.first_touch_utm_source,
             p.first_touch_utm_campaign, p.created_at, p.last_touch_at
    ORDER BY p.created_at DESC
    LIMIT 100
  ),
  abandoned_visitors AS (
    SELECT
      v.id::text AS user_id,
      'Visitor ' || substr(v.id::text, 1, 6) AS name,
      v.first_source,
      v.last_source,
      v.first_referrer_host AS referrer_host,
      v.first_utm_source AS utm_source,
      v.first_utm_campaign AS utm_campaign,
      v.first_seen_at AS signed_up_at,
      v.last_seen_at AS last_touch_at,
      0::bigint AS events_count,
      false AS is_paying,
      NULL::text AS plan_id,
      CASE
        WHEN v.last_landing_path LIKE '%pricing%' THEN 'Left at pricing'
        WHEN v.last_landing_path LIKE '%signup%' THEN 'Left at signup'
        WHEN v.last_landing_path LIKE '%billing%' OR v.last_landing_path LIKE '%checkout%' THEN 'Left at checkout'
        ELSE 'Visited ' || COALESCE(v.last_landing_path, 'landing')
      END AS abandoned_action
    FROM public.traffic_visitors v
    WHERE v.first_seen_at >= now() - make_interval(days => p_days)
      AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.first_traffic_visitor_id = v.id)
      AND (v.last_landing_path LIKE '%pricing%' OR v.last_landing_path LIKE '%signup%' OR v.last_landing_path LIKE '%billing%')
    ORDER BY v.last_seen_at DESC
    LIMIT 25
  )
  SELECT jsonb_build_object(
    'overview', jsonb_build_object(
      'visitors', v_visitors_count,
      'signups', v_signups_count,
      'activated', v_activated_count,
      'paying', v_paying_count,
      'visitorToSignupRate', round(100.0 * v_signups_count / NULLIF(v_visitors_count, 0), 1),
      'signupToActivationRate', round(100.0 * v_activated_count / NULLIF(v_signups_count, 0), 1),
      'activationToPaidRate', round(100.0 * v_paying_count / NULLIF(v_activated_count, 0), 1),
      'overallConversionRate', round(100.0 * v_paying_count / NULLIF(v_visitors_count, 0), 2)
    ),
    'sources', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'source', s.source,
        'visitors', s.visitors,
        'signups', s.signups,
        'activated', s.activated,
        'paying', s.paying,
        'signupRate', round(100.0 * s.signups / NULLIF(s.visitors, 0), 1),
        'paidRate', round(100.0 * s.paying / NULLIF(s.visitors, 0), 1)
      ) ORDER BY s.visitors DESC)
      FROM source_breakdown s
    ), '[]'::jsonb),
    'users', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'userId', oj.user_id,
        'name', oj.name,
        'firstSource', oj.first_source,
        'lastSource', oj.last_source,
        'referrerHost', oj.referrer_host,
        'utmSource', oj.utm_source,
        'utmCampaign', oj.utm_campaign,
        'stage', CASE
          WHEN oj.is_paying THEN 'Paying'
          WHEN oj.events_count > 0 THEN 'Activated'
          ELSE 'Signed up'
        END,
        'action', CASE
          WHEN oj.is_paying THEN COALESCE(INITCAP(REPLACE(oj.plan_id, '_', ' ')) || ' subscription', 'Paid subscription')
          WHEN oj.events_count > 0 THEN 'Created ' || oj.events_count || ' event' || (CASE WHEN oj.events_count = 1 THEN '' ELSE 's' END)
          ELSE 'Event not created'
        END,
        'eventsCount', oj.events_count,
        'signedUpAt', oj.signed_up_at,
        'lastSeenAt', COALESCE(oj.last_touch_at, oj.signed_up_at)
      ))
      FROM organizers_journey oj
    ), '[]'::jsonb),
    'abandoned', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'visitorId', av.user_id,
        'name', av.name,
        'firstSource', av.first_source,
        'lastSource', av.last_source,
        'referrerHost', av.referrer_host,
        'stage', 'Abandoned',
        'action', av.abandoned_action,
        'lastSeenAt', av.last_touch_at
      ))
      FROM abandoned_visitors av
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END $$;

REVOKE ALL ON FUNCTION public.user_intelligence_report(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.user_intelligence_report(integer) TO service_role;

