-- Allow the first-event onboarding flow to save honest, incomplete event drafts.
-- Existing public registration and publication remain gated by active status.
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_active_details_required;
ALTER TABLE public.events
  ALTER COLUMN event_date DROP NOT NULL,
  ALTER COLUMN start_time DROP NOT NULL,
  ALTER COLUMN end_time DROP NOT NULL,
  ALTER COLUMN venue DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS onboarding_category text,
  ADD COLUMN IF NOT EXISTS onboarding_objective text,
  ADD COLUMN IF NOT EXISTS expected_registrations integer,
  ADD COLUMN IF NOT EXISTS is_onboarding_draft boolean NOT NULL DEFAULT false;

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_expected_registrations_positive;
ALTER TABLE public.events
  ADD CONSTRAINT events_active_details_required
  CHECK (
    status <> 'active' OR
    (event_date IS NOT NULL AND start_time IS NOT NULL AND end_time IS NOT NULL
      AND venue IS NOT NULL AND length(btrim(venue)) > 0)
  ) NOT VALID;

CREATE UNIQUE INDEX IF NOT EXISTS events_one_open_onboarding_draft_per_owner
  ON public.events (organizer_id)
  WHERE is_onboarding_draft = true AND status = 'draft';

ALTER TABLE public.events
  ADD CONSTRAINT events_expected_registrations_positive
  CHECK (expected_registrations IS NULL OR expected_registrations BETWEEN 1 AND 100000) NOT VALID;
