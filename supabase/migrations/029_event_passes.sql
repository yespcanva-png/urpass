-- 029: One-event pass purchases
-- Organizers can buy a single-event pass instead of a subscription.

CREATE TABLE IF NOT EXISTS public.event_passes (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users(id),
  pass_type         text        NOT NULL CHECK (pass_type IN ('event', 'event_plus', 'event_pro')),
  registration_limit int        NOT NULL,
  price_rupees      numeric     NOT NULL,
  status            text        NOT NULL DEFAULT 'available'
                                CHECK (status IN ('available', 'attached', 'expired')),
  event_id          uuid        REFERENCES public.events(id) ON DELETE SET NULL,
  payment_id        text,
  purchased_at      timestamptz NOT NULL DEFAULT now(),
  attached_at       timestamptz
);

ALTER TABLE public.event_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_passes_own_select"
  ON public.event_passes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "event_passes_own_insert"
  ON public.event_passes FOR INSERT
  WITH CHECK (user_id = auth.uid());
