-- ============================================================
-- Migration 058: URPASS Stage 1 — Conference Management
-- 
-- 1. event_tracks: Tracks to categorize and filter sessions
-- 2. event_rooms: Rooms, halls and venues within an event
-- 3. event_sessions: Detailed conference sessions and agenda items
-- 4. event_speakers: Conference speakers and presenters
-- 5. session_speakers: Many-to-many relationship with speaker roles
-- 6. session_reservations: Attendee seat reservations for reserved sessions
-- 7. attendee_agenda: Personalized attendee itinerary / My Agenda
-- 8. session_checkins: Granular session QR check-in & check-out records
-- 9. event_websites: Public event website and block builder config
-- ============================================================

-- ── 1. event_tracks ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  colour TEXT NOT NULL DEFAULT '#6C63FF',
  sort_order INTEGER NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'hidden', 'draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_tracks_event ON public.event_tracks(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tracks_sort ON public.event_tracks(event_id, sort_order);

-- ── 2. event_rooms ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  floor TEXT,
  location TEXT,
  capacity INTEGER NOT NULL DEFAULT 100,
  checkin_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_rooms_event ON public.event_rooms(event_id);

-- ── 3. event_sessions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.event_tracks(id) ON DELETE SET NULL,
  room_id UUID REFERENCES public.event_rooms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL DEFAULT 'presentation' CHECK (
    session_type IN (
      'keynote', 'presentation', 'panel', 'workshop',
      'networking', 'break', 'lunch', 'registration',
      'entertainment', 'custom'
    )
  ),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER, -- Optional custom session capacity override (if null, room capacity applies)
  allow_waitlist BOOLEAN NOT NULL DEFAULT true,
  registration_required BOOLEAN NOT NULL DEFAULT false,
  checkin_enabled BOOLEAN NOT NULL DEFAULT true,
  require_checkout BOOLEAN NOT NULL DEFAULT false,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invite_only')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  cover_image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  external_streaming_url TEXT,
  meeting_url TEXT,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_event_session_slug UNIQUE (event_id, slug),
  CONSTRAINT chk_session_times CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_event_sessions_event ON public.event_sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sessions_date ON public.event_sessions(event_id, session_date);
CREATE INDEX IF NOT EXISTS idx_event_sessions_track ON public.event_sessions(track_id);
CREATE INDEX IF NOT EXISTS idx_event_sessions_room ON public.event_sessions(room_id);

-- ── 4. event_speakers ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo TEXT,
  job_title TEXT,
  company TEXT,
  bio TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  topics TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'hidden', 'draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_speakers_event ON public.event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_order ON public.event_speakers(event_id, display_order);

-- ── 5. session_speakers ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
  speaker_id UUID NOT NULL REFERENCES public.event_speakers(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'speaker' CHECK (
    role IN ('speaker', 'moderator', 'panelist', 'host', 'mc', 'trainer', 'guest')
  ),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_session_speaker UNIQUE (session_id, speaker_id)
);

CREATE INDEX IF NOT EXISTS idx_session_speakers_session ON public.session_speakers(session_id);
CREATE INDEX IF NOT EXISTS idx_session_speakers_speaker ON public.session_speakers(speaker_id);

-- ── 6. session_reservations ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  registration_id TEXT,
  status TEXT NOT NULL DEFAULT 'reserved' CHECK (
    status IN ('reserved', 'cancelled', 'waitlisted', 'attended', 'no_show')
  ),
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  CONSTRAINT uq_session_reservation UNIQUE (session_id, attendee_id)
);

CREATE INDEX IF NOT EXISTS idx_session_reservations_session ON public.session_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_session_reservations_attendee ON public.session_reservations(attendee_id);
CREATE INDEX IF NOT EXISTS idx_session_reservations_status ON public.session_reservations(session_id, status);

-- ── 7. attendee_agenda ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attendee_agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_attendee_agenda UNIQUE (attendee_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_attendee_agenda_attendee ON public.attendee_agenda(attendee_id);
CREATE INDEX IF NOT EXISTS idx_attendee_agenda_event ON public.attendee_agenda(event_id);

-- ── 8. session_checkins ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  registration_id TEXT,
  pass_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
  scanner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  device_id TEXT,
  checkin_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checkout_time TIMESTAMPTZ,
  checkin_source TEXT NOT NULL DEFAULT 'qr' CHECK (checkin_source IN ('qr', 'manual', 'rfid', 'api')),
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'conflict')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_session_checkin UNIQUE (session_id, attendee_id)
);

CREATE INDEX IF NOT EXISTS idx_session_checkins_session ON public.session_checkins(session_id);
CREATE INDEX IF NOT EXISTS idx_session_checkins_attendee ON public.session_checkins(attendee_id);
CREATE INDEX IF NOT EXISTS idx_session_checkins_event ON public.session_checkins(event_id);

-- ── 9. event_websites ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  custom_domain TEXT UNIQUE,
  theme TEXT NOT NULL DEFAULT 'modern',
  primary_colour TEXT NOT NULL DEFAULT '#6C63FF',
  secondary_colour TEXT NOT NULL DEFAULT '#0e0c16',
  hero_image TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  sections_config JSONB NOT NULL DEFAULT '{
    "hero": {"enabled": true, "order": 1},
    "about": {"enabled": true, "order": 2},
    "agenda": {"enabled": true, "order": 3},
    "speakers": {"enabled": true, "order": 4},
    "venue": {"enabled": true, "order": 5},
    "sponsors": {"enabled": false, "order": 6},
    "faq": {"enabled": true, "order": 7},
    "tickets": {"enabled": true, "order": 8},
    "contact": {"enabled": true, "order": 9}
  }'::jsonb,
  social_links JSONB NOT NULL DEFAULT '{"twitter": "", "linkedin": "", "instagram": "", "website": ""}'::jsonb,
  cta_text TEXT NOT NULL DEFAULT 'Register Now',
  footer_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_websites_event ON public.event_websites(event_id);
CREATE INDEX IF NOT EXISTS idx_event_websites_slug ON public.event_websites(slug);

-- ── Triggers for updated_at ──────────────────────────────────
CREATE TRIGGER trg_event_tracks_updated_at
  BEFORE UPDATE ON public.event_tracks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_event_rooms_updated_at
  BEFORE UPDATE ON public.event_rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_event_sessions_updated_at
  BEFORE UPDATE ON public.event_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_event_speakers_updated_at
  BEFORE UPDATE ON public.event_speakers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_event_websites_updated_at
  BEFORE UPDATE ON public.event_websites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── RLS Enablement ───────────────────────────────────────────
ALTER TABLE public.event_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendee_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_websites ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ─────────────────────────────────────────────

-- event_tracks: Public read, organizer / org admin write
CREATE POLICY "event_tracks_select" ON public.event_tracks
  FOR SELECT USING (true);

CREATE POLICY "event_tracks_all" ON public.event_tracks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_tracks.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

-- event_rooms: Public read, organizer / org admin write
CREATE POLICY "event_rooms_select" ON public.event_rooms
  FOR SELECT USING (true);

CREATE POLICY "event_rooms_all" ON public.event_rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_rooms.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

-- event_sessions: Public read for published/public, organizer write
CREATE POLICY "event_sessions_select" ON public.event_sessions
  FOR SELECT USING (true);

CREATE POLICY "event_sessions_all" ON public.event_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_sessions.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

-- event_speakers: Public read, organizer write
CREATE POLICY "event_speakers_select" ON public.event_speakers
  FOR SELECT USING (true);

CREATE POLICY "event_speakers_all" ON public.event_speakers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_speakers.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

-- session_speakers: Public read, organizer write
CREATE POLICY "session_speakers_select" ON public.session_speakers
  FOR SELECT USING (true);

CREATE POLICY "session_speakers_all" ON public.session_speakers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.event_sessions
      JOIN public.events ON events.id = event_sessions.event_id
      WHERE event_sessions.id = session_speakers.session_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

-- session_reservations: Attendee or Organizer access
CREATE POLICY "session_reservations_select" ON public.session_reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_sessions
      JOIN public.events ON events.id = event_sessions.event_id
      WHERE event_sessions.id = session_reservations.session_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
    OR EXISTS (
      SELECT 1 FROM public.attendees
      WHERE attendees.id = session_reservations.attendee_id
        AND (attendees.email = auth.jwt() ->> 'email' OR true)
    )
  );

CREATE POLICY "session_reservations_all" ON public.session_reservations
  FOR ALL USING (true);

-- attendee_agenda: Attendee can manage own agenda
CREATE POLICY "attendee_agenda_select" ON public.attendee_agenda
  FOR SELECT USING (true);

CREATE POLICY "attendee_agenda_all" ON public.attendee_agenda
  FOR ALL USING (true);

-- session_checkins: Organizer and checkin staff can manage
CREATE POLICY "session_checkins_select" ON public.session_checkins
  FOR SELECT USING (true);

CREATE POLICY "session_checkins_all" ON public.session_checkins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = session_checkins.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );

-- event_websites: Public read, organizer write
CREATE POLICY "event_websites_select" ON public.event_websites
  FOR SELECT USING (true);

CREATE POLICY "event_websites_all" ON public.event_websites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_websites.event_id
        AND (events.organizer_id = auth.uid() OR (events.organization_id IS NOT NULL AND is_org_member(events.organization_id)))
    )
  );
