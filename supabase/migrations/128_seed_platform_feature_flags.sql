-- Migration 128: Seed All Platform Feature Flags
-- Ensures all feature keys defined in application logic exist in platform_feature_flags
-- to satisfy foreign key constraint event_feature_settings_platform_key_fk.

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
  ('ai_agenda', NULL, 'AI Agenda & Schedule Optimizer', TRUE),
  ('face_checkin', NULL, 'Facial Recognition Check-in', TRUE),
  ('sponsor_deliverables', NULL, 'Sponsor Deliverables & ROI Tracker', TRUE),
  ('b2b_matchmaking', NULL, 'B2B Matchmaking & 1:1 Meetings', TRUE),
  ('custom_domain', NULL, 'Custom Event Domain', TRUE),
  ('webhooks', NULL, 'Real-time Event Webhooks', TRUE),
  ('sms_reminders', NULL, 'SMS Alerts & Reminders', TRUE),
  ('custom_pass_design', NULL, 'Custom Pass Designer', TRUE),
  ('white_label_portal', NULL, 'White-Label Attendee Portal', TRUE),
  ('offline_mesh_sync', NULL, 'Offline Multi-Gate Mesh Sync', TRUE),
  ('waitlist_priority_queue', NULL, 'Automated Waitlist Priority Queue', TRUE),
  ('group_entry', 'M14', 'Bulk Group QR Entry & Partial Check-In', TRUE),
  ('ticket_cancellation', 'M15', 'Self-Service Ticket Cancellation', TRUE)
ON CONFLICT (feature_key) DO UPDATE SET
  module_code = COALESCE(EXCLUDED.module_code, platform_feature_flags.module_code),
  name = EXCLUDED.name,
  platform_available = EXCLUDED.platform_available,
  updated_at = now();
