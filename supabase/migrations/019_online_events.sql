ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'physical'
  CHECK (event_type IN ('physical','online','hybrid'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS meeting_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS meeting_platform TEXT
  CHECK (meeting_platform IN ('zoom','google_meet','teams','custom'));
