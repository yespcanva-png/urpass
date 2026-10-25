-- Explore listing lifecycle, durable audit trail and privacy-conscious attribution.
-- Existing events, orders, attendees and passes remain the source of truth.

ALTER TABLE public.explore_marketplace_listings
  DROP CONSTRAINT IF EXISTS explore_marketplace_listings_status_check;
ALTER TABLE public.explore_marketplace_listings
  ADD CONSTRAINT explore_marketplace_listings_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested', 'suspended', 'unlisted'));

ALTER TABLE public.explore_marketplace_listings
  ADD COLUMN IF NOT EXISTS last_actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.explore_listing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.explore_marketplace_listings(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_explore_listing_history_event ON public.explore_listing_history(event_id, created_at DESC);
ALTER TABLE public.explore_listing_history ENABLE ROW LEVEL SECURITY;
REVOKE INSERT, UPDATE, DELETE ON public.explore_listing_history FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.audit_explore_listing_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  INSERT INTO public.explore_listing_history
    (listing_id, event_id, actor_user_id, action, old_status, new_status, snapshot)
  VALUES
    (NEW.id, NEW.event_id, NEW.last_actor_id,
     CASE WHEN TG_OP = 'INSERT' THEN 'submitted'
          WHEN OLD.status IS DISTINCT FROM NEW.status THEN NEW.status
          ELSE 'updated' END,
     CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
     NEW.status,
     jsonb_build_object('category', NEW.category, 'city', NEW.city,
       'editorial_summary', NEW.editorial_summary, 'rejection_reason', NEW.rejection_reason));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_explore_listing_history ON public.explore_marketplace_listings;
CREATE TRIGGER trg_explore_listing_history
  AFTER INSERT OR UPDATE ON public.explore_marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.audit_explore_listing_change();

-- Mutations run through server actions that verify the organizer or ops session.
DROP POLICY IF EXISTS "Organizers can apply for explore listings" ON public.explore_marketplace_listings;
DROP POLICY IF EXISTS "Organizers can update pending explore listings" ON public.explore_marketplace_listings;
REVOKE INSERT, UPDATE, DELETE ON public.explore_marketplace_listings FROM anon, authenticated;

DROP POLICY IF EXISTS "Public can view approved explore listings" ON public.explore_marketplace_listings;
CREATE POLICY "Public can view approved explore listings"
  ON public.explore_marketplace_listings FOR SELECT
  USING (
    status = 'approved' AND approved_at IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = explore_marketplace_listings.event_id AND e.status = 'active'
        AND e.application_enabled = true AND e.event_date >= ((now() AT TIME ZONE 'UTC')::date - 1)
    )
  );

CREATE TABLE IF NOT EXISTS public.explore_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('listing_view', 'detail_view', 'ticket_selection', 'registration_start')),
  session_hash TEXT NOT NULL,
  event_day DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT explore_interactions_once_per_session_day UNIQUE (event_id, event_type, session_hash, event_day)
);
CREATE INDEX IF NOT EXISTS idx_explore_interactions_event ON public.explore_interactions(event_id, event_type, event_day);
ALTER TABLE public.explore_interactions ENABLE ROW LEVEL SECURITY;
REVOKE INSERT, UPDATE, DELETE ON public.explore_interactions FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.explore_booking_attributions (
  attendee_id UUID PRIMARY KEY REFERENCES public.attendees(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'explore' CHECK (source = 'explore'),
  provider_order_id TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_explore_booking_attributions_event ON public.explore_booking_attributions(event_id, confirmed_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_explore_booking_attributions_order
  ON public.explore_booking_attributions(provider_order_id) WHERE provider_order_id IS NOT NULL;
ALTER TABLE public.explore_booking_attributions ENABLE ROW LEVEL SECURITY;
REVOKE INSERT, UPDATE, DELETE ON public.explore_booking_attributions FROM anon, authenticated;
