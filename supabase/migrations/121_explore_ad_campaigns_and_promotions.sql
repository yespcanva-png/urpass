-- ============================================================================
-- 121_explore_ad_campaigns_and_promotions.sql
-- UrPass Explore Marketplace Banner Advertising & Promotions System
-- Placements: hero, top_sidebar, in_content, bottom_sidebar, newsletter
-- ============================================================================

-- 1. Create explore_ad_campaigns table
CREATE TABLE IF NOT EXISTS public.explore_ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    placement VARCHAR(50) NOT NULL CHECK (placement IN ('hero', 'top_sidebar', 'in_content', 'bottom_sidebar')),
    campaign_type VARCHAR(50) NOT NULL DEFAULT 'event_promo' CHECK (campaign_type IN ('event_promo', 'brand_sponsor', 'urpass_house', 'external')),
    advertiser_name VARCHAR(255) NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    badge_label VARCHAR(50) DEFAULT 'Sponsored',
    cta_text VARCHAR(100) NOT NULL DEFAULT 'Learn More',
    destination_url TEXT NOT NULL,
    city_targeting TEXT[] DEFAULT ARRAY['All Cities']::TEXT[],
    starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ends_at TIMESTAMPTZ,
    priority INT NOT NULL DEFAULT 10,
    approved_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    impressions_count BIGINT NOT NULL DEFAULT 0,
    clicks_count BIGINT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe on a database where an earlier draft of this migration was applied.
ALTER TABLE public.explore_ad_campaigns
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE public.explore_ad_campaigns ALTER COLUMN status SET DEFAULT 'draft';

-- 2. Create explore_ad_events table (Privacy-conscious, no attendee PII)
CREATE TABLE IF NOT EXISTS public.explore_ad_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.explore_ad_campaigns(id) ON DELETE CASCADE,
    placement VARCHAR(50) NOT NULL,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('impression', 'click')),
    anonymous_session_id VARCHAR(100),
    city VARCHAR(100) DEFAULT 'All Cities',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    event_day DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT explore_ad_event_session_unique UNIQUE (campaign_id, placement, event_type, anonymous_session_id, event_day)
);
ALTER TABLE public.explore_ad_events
  ADD COLUMN IF NOT EXISTS event_day DATE NOT NULL DEFAULT CURRENT_DATE;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'explore_ad_event_session_unique') THEN
    ALTER TABLE public.explore_ad_events ADD CONSTRAINT explore_ad_event_session_unique
      UNIQUE (campaign_id, placement, event_type, anonymous_session_id, event_day);
  END IF;
END $$;

-- 3. Create explore_newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.explore_newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    city VARCHAR(100) DEFAULT 'All Cities',
    consent_given BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE
);

ALTER TABLE public.explore_newsletter_subscriptions
  ADD COLUMN IF NOT EXISTS unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS idx_explore_newsletter_unsubscribe_token
  ON public.explore_newsletter_subscriptions(unsubscribe_token);

CREATE TABLE IF NOT EXISTS public.explore_ad_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.explore_ad_campaigns(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'ops_admin',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.explore_ad_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_explore_ad_audit_campaign
  ON public.explore_ad_audit_logs(campaign_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.audit_explore_ad_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.explore_ad_audit_logs(campaign_id, action, details)
    VALUES (NEW.id, 'status_changed', jsonb_build_object(
      'previous_status', CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
      'status', NEW.status));
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_audit_explore_ad_status ON public.explore_ad_campaigns;
CREATE TRIGGER trg_audit_explore_ad_status
  AFTER INSERT OR UPDATE OF status ON public.explore_ad_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.audit_explore_ad_status();

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_explore_ads_active 
ON public.explore_ad_campaigns(placement, status, priority DESC, starts_at);

CREATE INDEX IF NOT EXISTS idx_explore_ads_city 
ON public.explore_ad_campaigns USING GIN (city_targeting);

CREATE INDEX IF NOT EXISTS idx_explore_ad_events_campaign 
ON public.explore_ad_events(campaign_id, event_type, timestamp);

CREATE INDEX IF NOT EXISTS idx_explore_newsletter_email 
ON public.explore_newsletter_subscriptions(email);

-- 5. Enable RLS
ALTER TABLE public.explore_ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. Visitors can read only approved, scheduled campaigns. All writes use
-- server-side service-role actions after authorization and validation.
DROP POLICY IF EXISTS "Public can view active explore campaigns" ON public.explore_ad_campaigns;
DROP POLICY IF EXISTS "Public can log ad events" ON public.explore_ad_events;
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.explore_newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.explore_ad_campaigns;
DROP POLICY IF EXISTS "Admins can view ad events" ON public.explore_ad_events;
DROP POLICY IF EXISTS "Public can view approved explore campaigns" ON public.explore_ad_campaigns;
CREATE POLICY "Public can view approved explore campaigns"
ON public.explore_ad_campaigns FOR SELECT TO anon, authenticated
USING (status = 'active' AND approved_at IS NOT NULL
  AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

-- Storage uploads are made through the authorized server action only.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('explore-ad-creatives', 'explore-ad-creatives', true, 4194304,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read explore ad creatives" ON storage.objects;
CREATE POLICY "Public read explore ad creatives"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'explore-ad-creatives');

-- Atomic deduplicated telemetry. Only the service role can call this function.
CREATE OR REPLACE FUNCTION public.record_explore_ad_event(
  p_campaign_id uuid, p_placement text, p_event_type text,
  p_session_id text, p_city text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_inserted uuid;
BEGIN
  IF p_event_type NOT IN ('impression', 'click')
     OR length(p_session_id) < 16 OR length(p_session_id) > 100
     OR p_placement NOT IN ('hero', 'top_sidebar', 'in_content', 'bottom_sidebar') THEN
    RETURN false;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.explore_ad_campaigns c
    WHERE c.id = p_campaign_id AND c.placement = p_placement
      AND c.status = 'active' AND c.approved_at IS NOT NULL
      AND c.starts_at <= now() AND (c.ends_at IS NULL OR c.ends_at > now())
      AND (p_city = 'All Cities' OR 'All Cities' = ANY(c.city_targeting)
           OR p_city = ANY(c.city_targeting))
  ) THEN RETURN false; END IF;

  INSERT INTO public.explore_ad_events
    (campaign_id, placement, event_type, anonymous_session_id, city)
  VALUES (p_campaign_id, p_placement, p_event_type, p_session_id, left(p_city, 100))
  ON CONFLICT ON CONSTRAINT explore_ad_event_session_unique DO NOTHING
  RETURNING id INTO v_inserted;
  IF v_inserted IS NULL THEN RETURN false; END IF;

  IF p_event_type = 'impression' THEN
    UPDATE public.explore_ad_campaigns
    SET impressions_count = impressions_count + 1 WHERE id = p_campaign_id;
  ELSE
    UPDATE public.explore_ad_campaigns
    SET clicks_count = clicks_count + 1 WHERE id = p_campaign_id;
  END IF;
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.record_explore_ad_event(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_explore_ad_event(uuid, text, text, text, text) TO service_role;

-- Run daily from the existing scheduler to limit raw telemetry retention.
CREATE OR REPLACE FUNCTION public.purge_explore_ad_events()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count bigint;
BEGIN
  DELETE FROM public.explore_ad_events WHERE timestamp < now() - interval '90 days';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END $$;
REVOKE ALL ON FUNCTION public.purge_explore_ad_events() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_explore_ad_events() TO service_role;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    BEGIN
      EXECUTE 'SELECT cron.schedule(''explore-ad-event-retention'', ''17 3 * * *'', ''SELECT public.purge_explore_ad_events()'')';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Schedule explore ad event retention in the database scheduler: %', SQLERRM;
    END;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.explore_ad_performance()
RETURNS TABLE(placement text, city text, impressions bigint, clicks bigint)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT e.placement::text, e.city::text,
    count(*) FILTER (WHERE e.event_type = 'impression')::bigint,
    count(*) FILTER (WHERE e.event_type = 'click')::bigint
  FROM public.explore_ad_events e
  WHERE e.timestamp >= now() - interval '90 days'
  GROUP BY e.placement, e.city
  ORDER BY e.placement, e.city;
$$;
REVOKE ALL ON FUNCTION public.explore_ad_performance() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.explore_ad_performance() TO service_role;
