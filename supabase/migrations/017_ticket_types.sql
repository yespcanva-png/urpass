-- ============================================================
-- URPASS — Ticket Types & Event Zones
-- ============================================================

-- ============================================================
-- ticket_types: multiple ticket types per event
-- ============================================================
CREATE TABLE ticket_types (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  category       TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general','vip','student','early_bird','workshop','staff','speaker','custom')),
  price          INTEGER NOT NULL DEFAULT 0,  -- in paise (0 = free)
  capacity       INTEGER,                      -- NULL = shares event attendee_limit
  sales_start    TIMESTAMPTZ,
  sales_end      TIMESTAMPTZ,
  max_per_person INTEGER NOT NULL DEFAULT 1,
  status         TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','on_sale','closed')),
  position       INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- event_zones: access areas within an event
-- ============================================================
CREATE TABLE event_zones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ticket_zone_access: which zones a ticket type grants access to
-- ============================================================
CREATE TABLE ticket_zone_access (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
  zone_id        UUID NOT NULL REFERENCES event_zones(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ticket_zone_access_unique UNIQUE (ticket_type_id, zone_id)
);

-- ============================================================
-- Link attendees and passes to ticket types
-- ============================================================
ALTER TABLE attendees ADD COLUMN IF NOT EXISTS ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE SET NULL;
ALTER TABLE passes    ADD COLUMN IF NOT EXISTS ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE SET NULL;

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ticket_types_event    ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_status   ON ticket_types(status);
CREATE INDEX IF NOT EXISTS idx_event_zones_event     ON event_zones(event_id);
CREATE INDEX IF NOT EXISTS idx_attendees_ticket_type ON attendees(ticket_type_id);

-- ============================================================
-- updated_at trigger for ticket_types
-- ============================================================
CREATE TRIGGER trg_ticket_types_updated_at
  BEFORE UPDATE ON ticket_types
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- RLS — ticket_types
-- ============================================================
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;

-- SELECT: event organizer OR any active org member for the event's org
CREATE POLICY "ticket_types_select" ON ticket_types
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organization_id IS NOT NULL
        AND is_org_member(events.organization_id)
    )
  );

-- INSERT: event organizer OR org owner/admin
CREATE POLICY "ticket_types_insert" ON ticket_types
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organization_id IS NOT NULL
        AND get_user_org_role(events.organization_id) IN ('owner','admin')
    )
  );

-- UPDATE: event organizer OR org owner/admin
CREATE POLICY "ticket_types_update" ON ticket_types
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organization_id IS NOT NULL
        AND get_user_org_role(events.organization_id) IN ('owner','admin')
    )
  );

-- DELETE: event organizer OR org owner/admin
CREATE POLICY "ticket_types_delete" ON ticket_types
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organization_id IS NOT NULL
        AND get_user_org_role(events.organization_id) IN ('owner','admin')
    )
  );

-- ============================================================
-- RLS — event_zones
-- ============================================================
ALTER TABLE event_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_zones_select" ON event_zones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organization_id IS NOT NULL
        AND is_org_member(events.organization_id)
    )
  );

CREATE POLICY "event_zones_insert" ON event_zones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organization_id IS NOT NULL
        AND get_user_org_role(events.organization_id) IN ('owner','admin')
    )
  );

CREATE POLICY "event_zones_update" ON event_zones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organization_id IS NOT NULL
        AND get_user_org_role(events.organization_id) IN ('owner','admin')
    )
  );

CREATE POLICY "event_zones_delete" ON event_zones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organizer_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_zones.event_id
        AND events.organization_id IS NOT NULL
        AND get_user_org_role(events.organization_id) IN ('owner','admin')
    )
  );

-- ============================================================
-- RLS — ticket_zone_access
-- ============================================================
ALTER TABLE ticket_zone_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ticket_zone_access_select" ON ticket_zone_access
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ticket_types tt
      JOIN events e ON e.id = tt.event_id
      WHERE tt.id = ticket_zone_access.ticket_type_id
        AND (
          e.organizer_id = auth.uid()
          OR (e.organization_id IS NOT NULL AND is_org_member(e.organization_id))
        )
    )
  );

CREATE POLICY "ticket_zone_access_insert" ON ticket_zone_access
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM ticket_types tt
      JOIN events e ON e.id = tt.event_id
      WHERE tt.id = ticket_zone_access.ticket_type_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND get_user_org_role(e.organization_id) IN ('owner','admin')
          )
        )
    )
  );

CREATE POLICY "ticket_zone_access_delete" ON ticket_zone_access
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM ticket_types tt
      JOIN events e ON e.id = tt.event_id
      WHERE tt.id = ticket_zone_access.ticket_type_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND get_user_org_role(e.organization_id) IN ('owner','admin')
          )
        )
    )
  );
