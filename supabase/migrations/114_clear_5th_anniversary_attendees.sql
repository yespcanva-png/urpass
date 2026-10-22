-- ==============================================================================
-- Script: Clear Attendees for "Festivals for Joy – 5th Anniversary Celebration"
-- Target apply_slug: 5th-anniversary-celebration
-- Organizer Context: niveda / niveditha
-- ==============================================================================

BEGIN;

-- 1. Remove communication logs for this event
DELETE FROM public.communication_deliveries
WHERE event_id IN (
  SELECT id FROM public.events
  WHERE apply_slug = '5th-anniversary-celebration'
     OR name ILIKE '%Festivals for Joy%'
);

-- 2. Remove check-in records for this event
DELETE FROM public.check_ins
WHERE event_id IN (
  SELECT id FROM public.events
  WHERE apply_slug = '5th-anniversary-celebration'
     OR name ILIKE '%Festivals for Joy%'
);

-- 3. Remove attendee consent audit records (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'attendee_consent_audit'
  ) THEN
    DELETE FROM public.attendee_consent_audit
    WHERE attendee_id IN (
      SELECT a.id FROM public.attendees a
      JOIN public.events e ON e.id = a.event_id
      WHERE e.apply_slug = '5th-anniversary-celebration'
         OR e.name ILIKE '%Festivals for Joy%'
    );
  END IF;
END $$;

-- 4. Remove passes issued for this event
DELETE FROM public.passes
WHERE event_id IN (
  SELECT id FROM public.events
  WHERE apply_slug = '5th-anniversary-celebration'
     OR name ILIKE '%Festivals for Joy%'
);

-- 5. Delete all attendees for this event
DELETE FROM public.attendees
WHERE event_id IN (
  SELECT id FROM public.events
  WHERE apply_slug = '5th-anniversary-celebration'
     OR name ILIKE '%Festivals for Joy%'
);

COMMIT;

-- Verification check (should return 0)
SELECT count(*) AS remaining_attendees
FROM public.attendees
WHERE event_id IN (
  SELECT id FROM public.events
  WHERE apply_slug = '5th-anniversary-celebration'
     OR name ILIKE '%Festivals for Joy%'
);
