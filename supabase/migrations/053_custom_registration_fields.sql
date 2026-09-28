-- 053: Add custom registration fields support
-- Allows organizers to define dynamic registration questions per event (text, number, select, checkbox)
-- Stores answers in attendees.custom_responses

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS custom_fields jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.attendees
  ADD COLUMN IF NOT EXISTS custom_responses jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.events.custom_fields IS 'Array of custom question definitions: [{ id, label, type, placeholder, required, options }]';
COMMENT ON COLUMN public.attendees.custom_responses IS 'Key-value map of custom field answers keyed by field id or label';
