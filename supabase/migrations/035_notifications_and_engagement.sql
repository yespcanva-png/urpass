-- ============================================================
-- Migration 035: In-App Notifications & Event Engagement Communications
-- ============================================================

-- 1. Organizer In-App Notifications
CREATE TABLE IF NOT EXISTS public.organizer_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system', -- 'registration', 'milestone', 'checkin', 'payment', 'feedback', 'system'
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizer_notifications_user_read 
  ON public.organizer_notifications(user_id, is_read, created_at DESC);

ALTER TABLE public.organizer_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.organizer_notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.organizer_notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
  ON public.organizer_notifications
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service and authenticated can insert notifications"
  ON public.organizer_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 2. Event Engagement Communications Broadcast Log
CREATE TABLE IF NOT EXISTS public.event_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'reminder_24h', 'thank_you_post_event', 'custom_broadcast'
  subject TEXT NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_communications_event_type 
  ON public.event_communications(event_id, type, sent_at DESC);

ALTER TABLE public.event_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can view their event communications"
  ON public.event_communications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_communications.event_id
        AND (
          e.organizer_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = e.organization_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
          )
        )
    )
  );

CREATE POLICY "Organizers can insert their event communications"
  ON public.event_communications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_communications.event_id
        AND (
          e.organizer_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = e.organization_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
              AND om.role IN ('owner', 'admin', 'event_manager')
          )
        )
    )
  );
