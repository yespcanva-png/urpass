# ⚡ UrPass One — Mobile Operations, Gate Management & Check-In

**UrPass One** is the dedicated mobile operations app built for event entry staff, gate supervisors, and organizers. It is focused strictly on real-time field operations, atomic duplicate scan prevention, hardware scanner management, and offline-resilient gate control.

---

## 🏗️ Architecture & Domain Structure

```text
urpass-one/
├── App.tsx                          # Root App wrapper with all operational providers
├── app.json                         # Expo & Mobile Application configuration
├── package.json                     # Native dependencies (Navigation, Storage, Lucide)
├── tsconfig.json                    # Strict TypeScript configuration
├── __tests__/                       # Operations test suite
│   └── urpass-one-operations.test.ts # 13 Unit & Integration tests (RBAC, Scans, Sync)
└── src/
    ├── constants/
    │   ├── colors.ts                # High-contrast dark theme & status palette
    │   └── config.ts                # Telemetry & sync thresholds
    ├── types/
    │   └── index.ts                 # Full domain types (Roles, Gates, Scans, Telemetry)
    ├── services/
    │   ├── rbacService.ts           # 6-Role granular permission engine
    │   ├── validationService.ts     # Atomic sub-0.3s QR validation & duplicate engine
    │   ├── offlineDb.ts             # Local manifest cache & IndexedDB/AsyncStorage
    │   ├── queueService.ts          # Offline scan queue with retry logic
    │   ├── syncService.ts           # Background sync & telemetry batching
    │   ├── hapticsService.ts        # Instant tactile & acoustic feedback
    │   └── storage.ts               # Universal key-value storage engine
    ├── context/
    │   ├── AuthContext.tsx          # OTP / Role session & hardware device ID
    │   ├── EventContext.tsx         # Org & Event switching, gate assignments
    │   ├── ScannerContext.tsx       # Viewfinder state, torch, laser & override modal
    │   ├── OfflineContext.tsx       # Real-time online/offline detector & queue ticker
    │   └── AlertContext.tsx         # Security alerts, capacity warnings, duplicate spikes
    ├── components/
    │   ├── common/                  # Buttons, Badges, Cards, MetricCards, Headers
    │   └── scanner/                 # CameraViewfinder reticle, ScanFeedbackBanner
    ├── screens/
    │   ├── auth/                    # LoginScreen (OTP/Presets), OrgEventSelectScreen
    │   ├── operations/              # EventOperationsHomeScreen, LiveGateDashboardScreen,
    │   │                            # GateManagementScreen, ActivityFeedScreen, DeviceManagementScreen
    │   ├── scanner/                 # QRScannerScreen, ManualOverrideModal
    │   ├── attendees/               # AttendeeSearchScreen, AttendeeProfileScreen
    │   ├── staff/                   # GateStaffManagementScreen
    │   └── audit/                   # ScanAuditLogScreen
    └── navigation/
        └── AppNavigator.tsx         # Central 5-Tab Bar & full screen navigation
```

---

## 🎯 20 Core Feature Areas Built in V1

1. **Authentication & Organization / Event Selection**:
   - Email/password + OTP 2-step verification.
   - Fast field role switcher (Super Admin, Org Admin, Event Manager, Gate Manager, Gate Staff, View-Only).
   - Multi-organization and multi-event switcher with persistent preference memory.
   - Hardware device ID pairing banner (`OP-XXXX`).

2. **Role-Based Access Control (RBAC)**:
   - Granular permission matrix across 6 discrete operational roles.
   - Controls event access, gate operation, attendee lookup, supervisor overrides, check-out permissions, and analytics visibility.

3. **Event Operations Cockpit**:
   - Real-time venue capacity protection bar (Live Inside vs Venue Limit with 80%/90%/100% threshold color shifts).
   - KPI metrics: Total Registrations, Approved, Checked In, Inside, Scans/Min rate, Pending Sync count.
   - Active gates status overview.
   - Quick operational launcher buttons.

4. **Gate Management & Flow Control**:
   - Direction modes: `↓ Entry Only`, `↑ Exit Only`, `⇅ Both Entry + Exit`.
   - On-the-fly gate status switching (`Open` / `Closed`).
   - Gate capacity ceilings.
   - Category and badge type whitelists per gate.

5. **High-Speed QR Scanner Engine**:
   - Instant sub-0.3s validation.
   - Triple feedback status banners:
     - **Green**: Entry / Exit Approved.
     - **Amber**: Duplicate scan detected / Already Inside / Requires Organizer Review.
     - **Red**: Invalid QR / Wrong Event / Cancelled Ticket / Wrong Gate / Capacity Exceeded.
   - Haptic vibration patterns and acoustic feedback.

6. **Atomic Duplicate Scan Protection**:
   - Prevents screenshot re-use, duplicate badge sharing, and rapid double-tapping.
   - Immediately displays previous scan timestamp, previous gate, and scanner device name.

7. **Directional Check-in & Check-out**:
   - Full support for venue entry, exit, re-entry, and multi-session passes.
   - Atomic counter updates (`checkinCount`, `checkoutCount`, `presenceStatus: inside | outside`).

8. **Instant Attendee Search & 1-Tap Manual Check-in**:
   - Full-text search across Name, Email, Ticket #, Registration ID, and Pass Tokens.
   - Filter chips for Pass Type (VIP, Speaker, Delegate, Student, Exhibitor, Staff) and Presence (Inside / Outside).
   - 1-tap manual check-in / check-out button directly from list view.

9. **Attendee Operational Profile**:
   - Full credentials, avatar, phone, company, and registration tier.
   - Real-time presence counter and time in venue.
   - Allowed zone permissions breakdown.
   - Complete scan history audit trail.

10. **Gate Access Control Rules & Zone Whitelisting**:
    - Gate-level allowed badge categories and ticket tier restrictions.
    - Rejects attendees attempting entry at unauthorized gates with detailed explanation.

11. **Offline Scanning Engine & Local Manifest Cache**:
    - Complete event manifest pre-downloading.
    - High-speed local lookups via in-memory and persistent storage.
    - Zero network dependency for gate scanning during internet drops.

12. **Offline Queue & Background Sync Engine**:
    - Queues scans performed while offline.
    - Automatic periodic retry and background synchronization when connectivity is restored.
    - Manual 1-tap sync trigger.

13. **Live Gate Dashboard & Telemetry**:
    - Real-time scans/min throughput rate per gate.
    - Active scanner hardware online per gate.
    - Instant remote gate open/close toggle.

14. **Scanner Hardware Device Management**:
    - Fleet tracking of connected scanner hardware (iOS, Android, Web).
    - Battery percentage monitor with low-battery alerts.
    - Remote access revocation for lost or compromised mobile devices.

15. **Supervisor Manual Override Modal**:
    - Role-gated dialog for Event Managers and Gate Managers.
    - Mandatory override justification selection (e.g., *Physical ID Card Verified*, *VIP Escort*, *QR Glitch*).
    - Permanent security audit trail logging.

16. **Scan Audit Trail & Security Log**:
    - Immutable chronological log of every scan attempt across all gates.
    - Filterable by gate, result (Allowed, Denied, Override), and direction.
    - 1-tap export in CSV / JSON format for compliance.

17. **Operational Security Alerts**:
    - Real-time notification banners for venue capacity (>80%, >90%), duplicate scan spikes, and offline gates.

18. **Gate Staff Crew Management**:
    - Roster of active gate personnel with gate assignments.
    - Fast 4-digit PIN code generation for quick staff shifts.

19. **Venue Capacity Protection**:
    - Prevents overcrowding by monitoring live inside counts against venue maximums.
    - Restricts green entry when capacity ceiling is breached.

20. **Live Activity Stream**:
    - Timestamped real-time event stream showing all entrance/exit transactions with visual severity badges.

---

## 🚀 Running UrPass One

### Run Tests:
```bash
npx vitest run urpass-one/__tests__/urpass-one-operations.test.ts
```

### Start Mobile Development Server:
```bash
cd urpass-one
npm start
```
