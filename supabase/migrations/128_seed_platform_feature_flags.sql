-- Migration 128: Seed All Platform Feature Flags
-- Ensures all feature keys defined in application logic exist in platform_feature_flags
-- to satisfy foreign key constraint event_feature_settings_platform_key_fk.

-- 1. Ensure module_code can be nullable for future dynamic features
ALTER TABLE public.platform_feature_flags ALTER COLUMN module_code DROP NOT NULL;

-- 2. Upsert all platform feature flags with deterministic module codes
INSERT INTO public.platform_feature_flags (feature_key, module_code, name, platform_available)
VALUES
  ('bulk_ticket_booking', 'M01', 'Bulk Ticket Booking', TRUE),
  ('ticket_distribution', 'M02', 'Ticket Distribution & Member Management', TRUE),
  ('member_registration_forms', 'M03', 'Member Registration Forms', TRUE),
  ('serial_number_validation', 'M04', 'Serial Number Management', TRUE),
  ('ticket_reassignment', 'M05', 'Digital QR & Ticket Reassignment', TRUE),
  ('advanced_entry_tracking', 'M06', 'Event Entry, Exit & Multi-Gate Tracking', TRUE),
  ('session_attendance', 'M07', 'Session-Wise Attendance', TRUE),
  ('csv_management', 'M08', 'CSV Import & Export', TRUE),
  ('google_sheets', 'M09', 'Google Sheets Integration', TRUE),
  ('offline_scanning', 'M10', 'Offline Scanning & Synchronization', TRUE),
  ('advanced_analytics', 'M11', 'Advanced Analytics & Reporting', TRUE),
  ('ai_agenda', 'M12', 'AI Agenda & Schedule Optimizer', TRUE),
  ('face_checkin', 'M13', 'Facial Recognition Check-in', TRUE),
  ('group_entry', 'M14', 'Bulk Group QR Entry & Partial Check-In', TRUE),
  ('ticket_cancellation', 'M15', 'Self-Service Ticket Cancellation', TRUE),
  ('sponsor_deliverables', 'M16', 'Sponsor Deliverables & ROI Tracker', TRUE),
  ('b2b_matchmaking', 'M17', 'B2B Matchmaking & 1:1 Meetings', TRUE),
  ('custom_domain', 'M18', 'Custom Event Domain', TRUE),
  ('webhooks', 'M19', 'Real-time Event Webhooks', TRUE),
  ('sms_reminders', 'M20', 'SMS Alerts & Reminders', TRUE),
  ('custom_pass_design', 'M21', 'Custom Pass Designer', TRUE),
  ('white_label_portal', 'M22', 'White-Label Attendee Portal', TRUE),
  ('offline_mesh_sync', 'M23', 'Offline Multi-Gate Mesh Sync', TRUE),
  ('waitlist_priority_queue', 'M24', 'Automated Waitlist Priority Queue', TRUE)
ON CONFLICT (feature_key) DO UPDATE SET
  module_code = COALESCE(EXCLUDED.module_code, platform_feature_flags.module_code),
  name = EXCLUDED.name,
  platform_available = EXCLUDED.platform_available,
  updated_at = now();
