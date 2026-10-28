-- Optional registration window for the existing event registration flow.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS registration_opens_at timestamptz,
  ADD COLUMN IF NOT EXISTS registration_closes_at timestamptz;

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_registration_window_order;
ALTER TABLE public.events ADD CONSTRAINT events_registration_window_order
  CHECK (registration_opens_at IS NULL OR registration_closes_at IS NULL
    OR registration_closes_at > registration_opens_at) NOT VALID;
