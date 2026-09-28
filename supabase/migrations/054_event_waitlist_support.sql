-- 054_event_waitlist_support.sql
-- Enable waitlisting on events and update application_status check constraint

-- 1. Update attendees application_status check constraint to include 'waitlisted'
ALTER TABLE attendees DROP CONSTRAINT IF EXISTS attendees_application_status_check;
ALTER TABLE attendees ADD CONSTRAINT attendees_application_status_check
  CHECK (application_status IN ('pending', 'approved', 'rejected', 'waitlisted'));

-- 2. Add waitlist_enabled column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS waitlist_enabled boolean NOT NULL DEFAULT true;

-- 3. Add index on event_id, application_status, created_at for fast queue lookups
CREATE INDEX IF NOT EXISTS idx_attendees_waitlist_queue
  ON attendees (event_id, application_status, created_at)
  WHERE application_status = 'waitlisted';
