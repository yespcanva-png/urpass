# UrPass — Product Features & Technical Functionality Documentation

> **Document Type**: Authoritative Technical & Product Specification  
> **Repository**: `urpass`  
> **Framework Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Supabase (PostgreSQL + Auth + Storage), Vitest  
> **Scope**: **Strictly reflects code, endpoints, database schemas, and workflows that currently exist in the codebase.**

---

## 1. System Overview & Core Architecture

UrPass is a digital event registration, ticketing, credentialing, and gate admission platform. It operates both as an organizer-facing event administration portal and an on-site operational engine for high-throughput entry gates.

### Core Architecture Components:
1. **Next.js 16 App Router**:
   - Organizer Portal: `/events`, `/event/[eventId]/*`
   - Gate Operations: `/scan/[eventId]`, `/ops/*`, `/desk/*`
   - Attendee Portals & Passes: `/pass/[passId]`, `/apply/[eventId]`, `/portal/*`
   - Public Landing & SEO Engine: 150+ programmatic landing pages and comparisons.
2. **Database & Persistence (Supabase / PostgreSQL)**:
   - 102 incremental database migrations.
   - Row-Level Security (RLS) policies.
   - Atomic PL/pgSQL stored procedures (`atomic_check_in_pass`, `atomic_group_entry_checkin`, `atomic_reassign_ticket_credential`).
3. **Hybrid Verification Engine**:
   - Online real-time scans with sub-second RPC resolution.
   - Offline scanning via IndexedDB event manifest cache and queued synchronizer.
4. **Credentialing Engine**:
   - Dynamic QR codes (Single-use, Bulk, Group QR).
   - Apple Wallet (`.pkpass` via `passkit-generator`).
   - Printable Badges & Ticket Studio (`pdf-lib`, canvas rendering).
5. **Payment Gateways**:
   - Razorpay & PayU integration for INR transactions.
   - Cashfree core configuration.

---

## 2. Event Registration & Ticketing

### 2.1 Registration Forms & Custom Builder
- **Registration Workflows**:
  - Direct ticket purchase (`paid`).
  - Approval-based application (`pending_approval`, `approved`, `rejected`).
  - Free RSVP registration.
- **Form Customization**:
  - Built-in attendee fields (Name, Email, Phone, Company, Designation).
  - Dynamic `custom_responses` JSONB field supporting arbitrary inputs, checkbox agreements, and multi-field data.
  - Multi-guest registration and age-wise pricing tiers (Migration `086`).
- **Capacity Reservation**:
  - Concurrent ticket checkout locks managed via `lib/capacity-reservation.ts` to prevent overselling beyond defined limits.

### 2.2 Ticket Types & Tiered Pricing
- **Pricing & Quotas**:
  - Configurable ticket categories (General Admission, VIP, Student, Speaker, Exhibitor).
  - Early-bird, standard, and spot-registration tiers.
  - Capacity caps per ticket type.
- **Group & Family Passes**:
  - `ticket_types.is_group_pass`: Flag specifying group credentials.
  - `included_guests`: Predetermined entitlement capacity per purchase (e.g., family of 4, team of 10).
  - Bulk ticket discounts and tiered discount coupon engine (`app/actions/coupons.ts`).

### 2.3 Payments & Invoicing
- **Supported Providers**:
  - **Razorpay**: Order creation, checkout modal, signature verification, webhook handler (`lib/razorpay-webhook.ts`).
  - **PayU**: Gateway checkout, transaction status verification (`app/actions/payu-settings.ts`).
  - **Cashfree**: Foundation schemas (Migration `084`).
- **GST Compliance & Invoicing**:
  - Automated PDF invoice generation (`lib/invoices.ts`).
  - GSTIN validation, state code detection, CGST/SGST/IGST breakdown.
  - Sequential invoice number generation.

---

## 3. Credentialing & Pass Management

### 3.1 Digital Pass Web App (`/pass/[passId]`)
- **Responsive Pass Rendering**:
  - Modern, Event, and Studio Pass visual templates.
  - Dynamic brand theme colors, logos, and custom background images.
  - Active event information: Date, Venue/Online URL, Rules, and Instructions.
  - Real-time status display: `Valid · Show at entrance`, `Checked In`, `Access Denied`.
- **Pass Personalization**:
  - `PersonalizePassModal` allowing bulk ticket buyers to assign individual guest names and details to unassigned tickets (`isPlaceholder`).

### 3.2 Apple Wallet Integration (`/api/wallet/[passToken]`)
- Generates native Apple Wallet `.pkpass` bundles using `passkit-generator`.
- Configured with barcode format (`PKBarcodeFormatQR`), relevant date, location coordinates for lock-screen pass suggestions, and organizer branding.

### 3.3 Custom Ticket Studio & Badges (`/event/[eventId]/badges`, `/pass-design`)
- **Badge Printing**:
  - Drag-and-drop customizable layout for conference badges.
  - Supports Attendee Name, Organization, Role, Category Badge, Barcode/QR Code.
  - Standard paper formats: A6, A7, 4x6 inches, Thermal roll stickers.
  - Batch PDF generation via `pdf-lib`.
- **Custom Ticket ID Sequence**:
  - Configurable ticket prefixes, zero-padded sequences, and suffixes (e.g., `TECH26-0001-VIP`).
  - Managed via `app/actions/custom-ticket-ids.ts` and Migration `099`.

---

## 4. Gate Admission & QR Scanner (`/scan/[eventId]`)

### 4.1 Gate Scanner Hardware & Camera Integration
- **Scanning Methods**:
  - Web camera scanning via `html5-qrcode`.
  - External USB / Bluetooth hardware barcode scanners via keyboard wedge listener (`lib/hardware-scanner.ts`).
  - Manual search and check-in fallback (`app/actions/manual-checkin.ts`).
- **Device & Environment Adaptation**:
  - WakeLock API controller to prevent scanner mobile devices from sleeping during gate duty.
  - Audio and haptic feedback (`lib/scanner-feedback.ts`): Distinct chimes for Valid Pass, Duplicate Scan, Access Denied, Invalid Pass.
  - High-contrast outdoor mode and camera flashlight toggle.

### 4.2 Multi-Gate & Zone Access Control
- **Gates & Zones Management** (`/event/[eventId]/zones`, `/event/[eventId]/access-rules`):
  - Definition of event physical zones (e.g., Main Hall, VIP Lounge, Speaker Green Room, Exhibition Floor).
  - Definition of physical Gates (e.g., Gate 1, Gate 2 East, VIP Turnstile).
  - Access mapping rules (`ticket_zone_access`): Enforces that only authorized ticket categories can be admitted through specific gates.
- **Access Violation Handling**:
  - Rejects unauthorized passes at wrong gates with `ACCESS_DENIED` and exact zone mismatch error.

### 4.3 Atomic Single Passes Check-in
- **Concurrency & Anti-Duplicate Security**:
  - DB stored procedure `atomic_check_in_pass`:
    - Row-level lock (`FOR UPDATE OF p`).
    - Verifies pass status.
    - Idempotency support via `scanOperationId` (prevents double-counting on network retries).
    - Writes durable audit log in `public.check_ins`.
    - Updates `attendees.pass_status = 'checked_in'` and `venue_presence_state = 'inside'`.

### 4.4 Single Group QR & Partial Check-In
- **Automatic Group Detection**:
  - Authoritative resolution via `is_group_master`, `custom_responses.is_single_group_qr`, or order references.
  - Distinguishes between individual tickets and single group QR codes.
- **Partial Entry Flow**:
  - Opens `GroupEntryModal` prompting: *"How many members checking in now?"*
  - Stepper bounded between 1 and `remainingEntries`.
  - Atomic deduction via `atomic_group_entry_checkin`:
    - Admitted batch recorded in `group_entry_admissions`.
    - Individual check-in units recorded in `check_ins` (`scan_operation_id_unit_N`) for accurate gate velocity analytics.
    - Allows multiple successive scans of the same QR code until `remainingEntries === 0`.
    - Rejects scans once exhausted (`EXHAUSTED`).

### 4.5 Offline Scanning & Sync Engine (`lib/offline-scanner.ts`)
- **Pre-Event Manifest Download**:
  - Downloads compressed attendee manifest into browser IndexedDB.
- **Offline Validation**:
  - Validates pass tokens and zone access locally when internet connectivity drops.
  - Local SQLite/IndexedDB mutation queue records offline check-ins.
- **Automatic Reconciliation**:
  - Background worker detects network restoration and syncs queued check-ins to `/api/scan/offline-sync`.
  - Conflict resolution handles duplicate scans that occurred on different offline devices.

### 4.6 Undo Check-in (Supervisor Action)
- Gate supervisors can undo an accidental scan within the scan UI via `undoCheckIn` / `undoCheckInByToken`.

---

## 5. Session & Room Management

### 5.1 Multi-Track Agenda & Sessions (`/event/[eventId]/sessions`, `/event/[eventId]/agenda`)
- Management of multi-day tracks, schedules, and speakers.
- Room allocation and room capacity configuration.

### 5.2 Session-Level Attendance Tracking (`/event/[eventId]/session-attendance`)
- Independent scanning mode for specific rooms or breakout sessions (`selectedSessionId`).
- Records session attendance without modifying or consuming main gate entry credentials.
- Computes room occupancy percentage and session attendance analytics (`lib/session-attendance`).

---

## 6. Exhibitor, Sponsor & Lead Retrieval

### 6.1 Exhibitor & Sponsor Portal (`/event/[eventId]/exhibitors-admin`, `/event/[eventId]/sponsors-admin`)
- Directory of event sponsors and booth spaces.
- Deliverable tracking and asset collection portal.

### 6.2 Lead Retrieval Engine (`/event/[eventId]/lead-retrieval`, `/event/[eventId]/booths`)
- Exhibitor booth staff can scan attendee QR codes to capture contact information.
- Tagging, rating, and note-taking per lead.
- CSV export of leads for exhibitor teams.

---

## 7. Attendee & Data Management

### 7.1 Attendees Table (`/event/[eventId]/attendees`)
- **Real-Time Data Table**:
  - Subscribed to Supabase Realtime changes for instant live admission updates.
  - Multi-filter search (Status, Ticket Type, Gate, Payment Status, Search Query).
- **Group Pass Visualization**:
  - Displays Group Pass badges with live ratio (e.g., `6/10 Admitted`).
  - Historical admission batches accordion showing exact entry times and gates.
- **Manual Operations**:
  - Manual check-in / check-out.
  - Pass regeneration and resending via email.
  - Status transitions (`approved`, `rejected`, `revoked`).

### 7.2 Ticket Reassignment & Transfer (`app/actions/ticket-credentials.ts`)
- Allows organizers or ticket holders to reassign a ticket to another person.
- Executed via atomic stored procedure `atomic_reassign_ticket_credential` (Migration `100`):
  - Invalidates previous pass token.
  - Generates fresh digital pass and QR code for the new recipient.
  - Updates attendee profile while maintaining audit trail.

### 7.3 Data Import & Export (`/event/[eventId]/csv-management`)
- **CSV & Excel Importer**:
  - Bulk attendee upload with automatic column mapping.
  - Validation against duplicate emails and invalid values.
  - Automatic pass generation upon import.
- **Exporting**:
  - Export full attendee manifest, check-in timestamps, gate audit logs to CSV and XLSX.
- **Google Sheets Two-Way Sync** (`lib/google-sheets`):
  - Live background sync connecting attendee registrations to external Google Sheets.

---

## 8. Communications & Marketing

### 8.1 Automated Email Engine (`lib/email.ts`, `lib/email-engine`)
- Integrated with **Resend** and **Nodemailer (SMTP fallback)**.
- Automated triggers:
  - Ticket confirmation with pass link and embedded QR code.
  - Application received and approval status updates.
  - Payment invoices.
  - Event reminders and venue instructions.

### 8.2 Event Feedback Engine (`/event/[eventId]/feedback`)
- Post-event automated feedback surveys.
- NPS rating and satisfaction score calculation.
- Feedback analytics dashboard.

---

## 9. Operations, Analytics & Reporting

### 9.1 Live Event Overview & Analytics (`/event/[eventId]/analytics`)
- **KPI Metrics**:
  - Total Registered, Total Approved, Total Passes Generated.
  - Total Checked-in vs. No-Show Rate.
  - Revenue Gross, Net, and Ticket Tier Breakdown.
- **Gate Velocity & Real-time Flow**:
  - Check-in velocity per hour / 15-minute intervals.
  - Gate distribution breakdown (identifying bottleneck entrances).
  - In-venue presence count (`inside` vs. `outside` tracking).

### 9.2 Audit Logs & Compliance (`/event/[eventId]/settings`)
- Durable audit trail (`audit_logs` table) tracking organizer actions:
  - Ticket price edits, attendee approvals, manual check-ins, supervisor corrections.
- Scanner device and operator tracking on every scan.

---

## 10. Organization, Security & Enterprise Features

### 10.1 Role-Based Access Control (RBAC)
- Multi-tier team roles (`organization_members`):
  - `owner`: Full billing, organization, and event access.
  - `admin`: Event management and organization settings.
  - `event_manager`: Management of assigned events.
  - `gate_manager`: Gate management, scanner devices, access rules.
  - `checkin_staff`: Scan-only gate access without dashboard administrative rights.

### 10.2 Enterprise Single Sign-On & SCIM
- **SSO Integration** (`lib/sso`):
  - SAML 2.0 / OIDC enterprise authentication via WorkOS/Supabase.
  - Custom domain SSO enforcement.
- **SCIM 2.0 User Provisioning** (`app/api/scim`):
  - Automated directory sync from Okta / Azure AD for enterprise event staff.

### 10.3 Custom Domains & White-Labeling (`lib/dns`, `app/actions/custom-domains.ts`)
- Custom domain mapping for event landing and pass pages (e.g., `tickets.myconference.com`).
- DNS verification and automated SSL provisioning.
- Removal of UrPass branding on Pro and Enterprise tiers.

---

## 11. Model Context Protocol (MCP) Server Integration

- UrPass ships with a native **Model Context Protocol (MCP)** server (`bin/urpass-mcp.mjs`, `lib/mcp`):
  - Enables AI assistants (Claude, Antigravity, Cursor) to manage UrPass events programmatically.
  - Exposed MCP tools:
    - `get_event_overview`: Query event stats, attendee counts, gate velocity.
    - `list_attendees`: Search attendee records and check-in statuses.
    - `check_in_attendee`: Perform automated pass check-ins via AI agent workflows.
    - `create_ticket_type`: Configure ticket inventory and tiers.

---

## 12. Verification & Test Suite Summary

- **Test Framework**: Vitest with React Testing Library.
- **Coverage**:
  - **95 test suites** across unit, integration, and security layers.
  - **930 passing tests** covering atomic stored procedures, group entry calculations, gate authorization, and offline reconciliation.
- **Build Status**: Production Next.js 16 build compiles with 0 type errors.
