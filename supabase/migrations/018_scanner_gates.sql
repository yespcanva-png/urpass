-- ============================================================
-- URPASS — Scanner Gates & Multi-Device Check-in
-- ============================================================

-- Named scanner gates per event (Gate 1, Gate 2, VIP Gate, etc.)
CREATE TABLE scanner_gates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  zone_id    UUID REFERENCES event_zones(id) ON DELETE SET NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scanner_gates_event ON scanner_gates(event_id);

-- Add gate info to check_ins
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS gate_id UUID REFERENCES scanner_gates(id) ON DELETE SET NULL;
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS check_in_method TEXT NOT NULL DEFAULT 'qr'
  CHECK (check_in_method IN ('qr', 'manual', 'search'));

-- RLS for scanner_gates
ALTER TABLE scanner_gates ENABLE ROW LEVEL SECURITY;

-- SELECT: event organizer OR org member
CREATE POLICY "scanner_gates_select" ON scanner_gates FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = scanner_gates.event_id AND events.organizer_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM events
    WHERE events.id = scanner_gates.event_id
      AND events.organization_id IS NOT NULL
      AND is_org_member(events.organization_id)
  )
);

-- INSERT: event organizer OR org owner/admin
CREATE POLICY "scanner_gates_insert" ON scanner_gates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = scanner_gates.event_id AND events.organizer_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM events
    WHERE events.id = scanner_gates.event_id
      AND events.organization_id IS NOT NULL
      AND get_user_org_role(events.organization_id) IN ('owner','admin')
  )
);

-- UPDATE: event organizer OR org owner/admin
CREATE POLICY "scanner_gates_update" ON scanner_gates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = scanner_gates.event_id AND events.organizer_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM events
    WHERE events.id = scanner_gates.event_id
      AND events.organization_id IS NOT NULL
      AND get_user_org_role(events.organization_id) IN ('owner','admin')
  )
);

-- DELETE: event organizer OR org owner/admin
CREATE POLICY "scanner_gates_delete" ON scanner_gates FOR DELETE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = scanner_gates.event_id AND events.organizer_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM events
    WHERE events.id = scanner_gates.event_id
      AND events.organization_id IS NOT NULL
      AND get_user_org_role(events.organization_id) IN ('owner','admin')
  )
);
