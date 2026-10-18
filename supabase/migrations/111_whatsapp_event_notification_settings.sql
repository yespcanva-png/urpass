-- ============================================================
-- Migration 111: Granular WhatsApp Event Notification Settings
-- ============================================================

-- Add granular WhatsApp notification preference configuration to events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS whatsapp_settings JSONB NOT NULL DEFAULT '{
    "registration_received": true,
    "ticket_delivery": true,
    "payment_confirmation": true,
    "event_reminders": true,
    "event_cancellation": true
  }'::jsonb;

-- Comment describing the granular switches
COMMENT ON COLUMN public.events.whatsapp_settings IS 'Granular toggles for attendee WhatsApp event notifications: registration_received, ticket_delivery, payment_confirmation, event_reminders, event_cancellation';
