# UrPass Advanced Modules - M00 Implementation Map

Date: 2026-10-09

## Repository Audit

- Next.js App Router dashboard lives under `app/event/[eventId]`.
- Event settings UI is `app/event/[eventId]/settings/page.tsx`.
- Shared optional-module registry is `lib/feature-flags.ts`.
- M01-M11 service prototypes already exist in `lib/bulk-booking`, `lib/bulk-distribution`, `lib/member-forms`, `lib/ticket-credentials`, `lib/gate-tracking`, `lib/session-attendance`, `lib/csv-management`, `lib/offline-scanner`, and `lib/advanced-analytics`.
- Server actions for module workflows live in `app/actions/*`.
- Organization role enforcement is centralized in `lib/authorization.ts`; feature configuration writes are limited to event owner, org owner, org admin, and org event manager.
- Current subscriptions and plan entitlements are implemented in `lib/plan.ts`.

## M00 Foundation

Feature usability is resolved as:

```text
Platform Available
AND Organizer Entitled
AND Event Feature Enabled
AND Required Configuration Valid
```

The first-class persistence model is:

- `platform_feature_flags`: platform release state per feature.
- `event_feature_settings`: event-level enabled state, required config validity, validation errors, version, and updater.
- `event_feature_audit_logs`: immutable enable/disable/config validation audit trail.

`events.custom_pass_design._featureFlags` remains a compatibility mirror so existing module services that read event metadata continue working while module code is migrated to first-class reads.

## Module Keys

| Module | Feature key |
| --- | --- |
| M01 Bulk Ticket Booking | `bulk_ticket_booking` |
| M02 Ticket Distribution | `ticket_distribution` |
| M03 Member Registration Forms | `member_registration_forms` |
| M04 Serial Number Management | `serial_number_validation` |
| M05 Digital QR & Ticket Reassignment | `ticket_reassignment` |
| M06 Entry, Exit & Multi-Gate Tracking | `advanced_entry_tracking` |
| M07 Session-Wise Attendance | `session_attendance` |
| M08 CSV Import & Export | `csv_management` |
| M09 Google Sheets Integration | `google_sheets` |
| M10 Offline Scanning | `offline_scanning` |
| M11 Advanced Analytics & Reporting | `advanced_analytics` |

## Next Module Rule

M01 and later modules must call the shared feature guard before creating new advanced records or executing advanced mutations. Disabling a module must block new advanced operations and preserve historical records.
