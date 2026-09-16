-- 030: Link event_passes to events
-- Allows tracking which event pass is powering a specific event.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS event_pass_id uuid REFERENCES public.event_passes(id) ON DELETE SET NULL;
