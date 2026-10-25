-- Migration 120: UrPass Explore Marketplace Listings & Applications
-- Additive migration for curated public event discovery at /explore

CREATE TABLE IF NOT EXISTS explore_marketplace_listings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status              TEXT NOT NULL DEFAULT 'pending' 
                        CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  featured            BOOLEAN NOT NULL DEFAULT false,
  category            TEXT NOT NULL DEFAULT 'general',
  city                TEXT,
  venue_address       TEXT,
  editorial_summary   TEXT,
  min_price_paise     INTEGER DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'INR',
  is_free             BOOLEAN NOT NULL DEFAULT true,
  published_at        TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  approved_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rejection_reason    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT explore_marketplace_listings_event_id_key UNIQUE (event_id)
);

-- Indexes for lightning-fast public discovery queries without N+1 joins
CREATE INDEX IF NOT EXISTS idx_explore_listings_status_approved 
  ON explore_marketplace_listings(status, approved_at DESC);

CREATE INDEX IF NOT EXISTS idx_explore_listings_featured 
  ON explore_marketplace_listings(featured, status);

CREATE INDEX IF NOT EXISTS idx_explore_listings_category 
  ON explore_marketplace_listings(category, status);

CREATE INDEX IF NOT EXISTS idx_explore_listings_city 
  ON explore_marketplace_listings(city, status);

CREATE INDEX IF NOT EXISTS idx_explore_listings_event_id 
  ON explore_marketplace_listings(event_id);

-- Enable Row Level Security
ALTER TABLE explore_marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can view approved explore listings for published active events
DROP POLICY IF EXISTS "Public can view approved explore listings" ON explore_marketplace_listings;
CREATE POLICY "Public can view approved explore listings"
  ON explore_marketplace_listings FOR SELECT
  USING (
    status = 'approved' AND approved_at IS NOT NULL AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = explore_marketplace_listings.event_id
        AND events.status = 'active'
    )
  );

-- Policy 2: Organizers can view listing application for their own events
DROP POLICY IF EXISTS "Organizers can view own event explore listings" ON explore_marketplace_listings;
CREATE POLICY "Organizers can view own event explore listings"
  ON explore_marketplace_listings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = explore_marketplace_listings.event_id
        AND (events.organizer_id = auth.uid() OR events.organization_id IN (
          SELECT organization_id FROM organization_members
          WHERE user_id = auth.uid() AND status = 'active'
        ))
    )
  );

-- Policy 3: Organizers can submit listing application for their own events
DROP POLICY IF EXISTS "Organizers can apply for explore listings" ON explore_marketplace_listings;
CREATE POLICY "Organizers can apply for explore listings"
  ON explore_marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    status = 'pending' AND featured = false AND approved_at IS NULL AND approved_by IS NULL
    AND
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = explore_marketplace_listings.event_id
        AND (events.organizer_id = auth.uid() OR events.organization_id IN (
          SELECT organization_id FROM organization_members
          WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'event_manager')
        ))
    )
  );

-- Policy 4: Organizers can update pending listing applications for their own events
DROP POLICY IF EXISTS "Organizers can update pending explore listings" ON explore_marketplace_listings;
CREATE POLICY "Organizers can update pending explore listings"
  ON explore_marketplace_listings FOR UPDATE
  TO authenticated
  USING (
    status = 'pending' AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = explore_marketplace_listings.event_id
        AND (events.organizer_id = auth.uid() OR events.organization_id IN (
          SELECT organization_id FROM organization_members
          WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'event_manager')
        ))
    )
  )
  WITH CHECK (
    status = 'pending' AND featured = false AND approved_at IS NULL AND approved_by IS NULL
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = explore_marketplace_listings.event_id
        AND (events.organizer_id = auth.uid() OR events.organization_id IN (
          SELECT organization_id FROM organization_members
          WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'event_manager')
        ))
    )
  );
