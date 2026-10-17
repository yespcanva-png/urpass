-- Migration 108: 1 Free Event with AutoPay Trial & Anti-Abuse Tracking
-- Enables users to try 1 event for free by activating AutoPay.
-- Permanently tracks consumed free trial events so deleting an event does NOT allow creating another.

CREATE TABLE IF NOT EXISTS public.user_trial_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_id uuid,
  event_name text,
  event_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  event_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  CONSTRAINT user_trial_events_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_trial_events_user_id ON public.user_trial_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trial_events_event_id ON public.user_trial_events(event_id);

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS free_event_trial_active boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS free_event_trial_consumed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS free_event_trial_id uuid,
  ADD COLUMN IF NOT EXISTS trial_events_quota integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS trial_events_created integer DEFAULT 0;

ALTER TABLE public.user_trial_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_trial_events' AND policyname = 'Users can read own trial event'
  ) THEN
    CREATE POLICY "Users can read own trial event" ON public.user_trial_events
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_trial_events' AND policyname = 'Service role manages user_trial_events'
  ) THEN
    CREATE POLICY "Service role manages user_trial_events" ON public.user_trial_events
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
