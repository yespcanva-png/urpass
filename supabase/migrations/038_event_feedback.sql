-- ============================================================
-- Migration 038: Event Creator Feedback Form Builder & Attendee Feedback
-- ============================================================

-- 1. Event Feedback Form Configuration
CREATE TABLE IF NOT EXISTS public.event_feedback_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL DEFAULT 'Share Your Event Feedback',
  description TEXT DEFAULT 'We would love to hear your thoughts and suggestions so we can make our next event even better!',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  allow_anonymous BOOLEAN NOT NULL DEFAULT true,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme JSONB NOT NULL DEFAULT '{"primaryColor": "#6D28D9", "themePreset": "violet", "submitButtonText": "Submit Event Feedback"}'::jsonb,
  thank_you JSONB NOT NULL DEFAULT '{"headline": "Thank You for Your Feedback!", "message": "Your response has been delivered directly to the event organizers."}'::jsonb,
  aspects JSONB NOT NULL DEFAULT '[
    {"id": "overall", "label": "Overall Experience", "type": "rating", "enabled": true},
    {"id": "organization", "label": "Organization & Flow", "type": "rating", "enabled": true},
    {"id": "venue", "label": "Venue & Facilities", "type": "rating", "enabled": true},
    {"id": "content", "label": "Speakers & Content", "type": "rating", "enabled": true}
  ]'::jsonb,
  enable_nps BOOLEAN NOT NULL DEFAULT true,
  nps_question TEXT NOT NULL DEFAULT 'How likely are you to recommend our events to a friend or colleague?',
  custom_questions JSONB NOT NULL DEFAULT '[
    {"id": "highlight", "label": "What was the highlight or most valuable part for you?", "type": "text", "required": false},
    {"id": "improvements", "label": "What could we improve for our next event?", "type": "text", "required": false}
  ]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_feedback_forms_event 
  ON public.event_feedback_forms(event_id);

-- 2. Attendee Feedback Submissions
CREATE TABLE IF NOT EXISTS public.event_feedback_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  form_id UUID REFERENCES public.event_feedback_forms(id) ON DELETE SET NULL,
  attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
  attendee_name TEXT,
  attendee_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  feedback_text TEXT,
  aspects JSONB DEFAULT '{}'::jsonb,
  answers JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_feedback_responses_event 
  ON public.event_feedback_responses(event_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.event_feedback_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_feedback_responses ENABLE ROW LEVEL SECURITY;

-- Form RLS: anyone can view enabled event feedback forms; organizers can insert/update/delete
CREATE POLICY "Public can view enabled event feedback forms"
  ON public.event_feedback_forms
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Organizers can manage their event feedback form"
  ON public.event_feedback_forms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_feedback_forms.event_id
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

-- Response RLS: anyone can insert feedback (public attendees); organizers can read/delete
CREATE POLICY "Anyone can submit event feedback"
  ON public.event_feedback_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Organizers can view feedback for their events"
  ON public.event_feedback_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_feedback_responses.event_id
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

CREATE POLICY "Organizers can delete feedback for their events"
  ON public.event_feedback_responses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_feedback_responses.event_id
        AND (
          e.organizer_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = e.organization_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
              AND om.role IN ('owner', 'admin')
          )
        )
    )
  );
