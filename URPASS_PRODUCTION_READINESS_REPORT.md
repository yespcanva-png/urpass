# URPASS — Production Readiness & Architectural Audit Report

**Date of Audit:** October 18, 2026  
**Auditor Roles:** Senior Software Architect, QA Automation Engineer, Application Security Auditor, DevOps Engineer  
**Codebase:** `URPASS (urpass)`  
**Release Verdict:** **`READY AFTER FIXES`**

---

## 1. Executive Summary

A comprehensive architectural, code-level, security, and runtime audit of the **URPASS** platform was conducted. The audit evaluated source files, database migrations (001–109), environment configurations, build pipelines, and executed automated test suites across 102 test files.

### Key Headline Metrics:
- **TypeScript Type Check (`tsc --noEmit`)**: **PASSED** (Exit code `0`, 0 compilation errors across 54 server actions, 42 `lib` modules, and 539 application routes).
- **Production Build (`npm run build`)**: **PASSED** (Exit code `0`, compiled in 8.6s with Turbopack, static page prerendering and dynamic API bundling succeeded without failure).
- **Automated Vitest Suite**: **975 Tests Passed** across 98 test files; 13 tests failed across 4 test files due to mock divergence.
- **Workflow Verification Suite (`__tests__/production-readiness-workflows.test.ts`)**: **15 / 15 PASSED (100%)** covering all 10 critical business flows (A through J).
- **ESLint (`npm run lint`)**: **FAILED** (494 errors, 1830 warnings, predominantly `@typescript-eslint/no-explicit-any` and unused variables).

---

## 2. Release Recommendation: `READY AFTER FIXES`

The system exhibits high structural integrity, robust database constraints, transaction safety, and comprehensive business logic for event ticketing, multi-gate scanning, conference management, and tax invoicing.

However, the application cannot be declared unconditionally **`READY`** today due to the following specific issues:
1. **WhatsApp External Gateway Block**: The configured AiSensy WhatsApp Business Account (WABA) returned `HTTP 400: WABA is not verified` when called with the live API key. Meta WhatsApp Cloud API credentials (`WHATSAPP_CLOUD_ACCESS_TOKEN`, `WHATSAPP_CLOUD_PHONE_NUMBER_ID`) are currently not set in `.env`. Live WhatsApp pass deliveries will fail until WABA is verified in AiSensy or Meta Cloud credentials are provided.
2. **Component Test Hang in JSDOM**: `__tests__/components.test.tsx` hangs during execution due to input placeholder drift in `AddAttendeeModal.tsx` (`Attendee name` vs `/srinithin/i`).
3. **Mock Divergence in 4 Legacy Test Files**: 13 unit tests failed due to outdated mock expectations (e.g., expecting `/dashboard` redirect instead of active `/onboarding/subscription` flow, and missing `.maybeSingle()` on Supabase test mock).

---

## 3. Critical Business Workflows Audit (A through J)

| Workflow | Description | Observed Result | Status |
| :--- | :--- | :--- | :--- |
| **A. Event Creation & Registration** | Schema validation, unique slug reservation, custom form fields, and attendee persistence. | Sanitized slug check and Zod attendee validation passed cleanly in runtime. | **PASS — VERIFIED** |
| **B. Individual QR Pass** | Opaque token generation, URL parsing, and PII masking (`maskPhone`, `maskEmail`). | Verified token extraction; phone/email masked to prevent client credential leakage. | **PASS — VERIFIED** |
| **C. Group Pass & Partial Entry** | Multi-guest admissions, real-time balance tracking, and over-admission prevention (M14). | Stepwise admission (2 + 2 + 1) admitted cleanly; subsequent attempt returned `EXHAUSTED` with 0 remaining. | **PASS — VERIFIED** |
| **D. Session-Wise Attendance** | Multi-track isolation (e.g. Autism vs ADHD) and schedule conflict detection (M07). | Verified session totals remain completely isolated; same attendee can attend multiple sessions without count inflation. Room/time overlap checks passed. | **PASS — VERIFIED** |
| **E. Bulk Invitations & Delivery** | Phone normalization to E.164, provider dispatch, and SMS fallback. | E.164 normalization verified (`+919876543210`). WhatsApp live API blocked by unverified WABA. | **PARTIAL** |
| **F. Payments & Invoices** | GST (18%) and VAT (20%) tax calculations, Razorpay webhook signature verification, PDF invoice generation. | Intra-state CGST (9%) + SGST (9%) and UK VAT (20%) computed without rounding drift. Constant-time webhook verification verified. | **PASS — VERIFIED** |
| **G. Offline Scanning** | Token normalization and IndexedDB manifest synchronization (M10). | Token normalization preserves case and strips URL scheme. Offline scan queue serialization verified. | **PASS — VERIFIED** |
| **H. Permissions & Security** | Role-based access control (RBAC), protected owners, and CIDR IP allowlisting. | Organization owners cannot be downgraded or removed; `gate_staff` restricted from billing; CIDR validation verified. | **PASS — VERIFIED** |
| **I. Operational Analytics** | Net in-venue presence, entry/exit direction tracking, and velocity curves. | Verified net headcount equals entries minus exits; re-entries do not inflate total turnout count. | **PASS — VERIFIED** |
| **J. Resilience & Injection Protection** | CSV formula injection protection and error recovery. | Formula characters (`=`, `+`, `-`, `@`) prepended with single quotes (`'`) preventing spreadsheet code execution. | **PASS — VERIFIED** |

---

## 4. Architectural Strengths & High-Assurance Implementations

1. **Atomic Capacity Reservation**:
   - `lib/capacity-reservation.ts` implements a 900-second reservation window (`RESERVATION_WINDOW_SECONDS = 900`). In-flight checkouts atomically lock tickets in the database, preventing race-condition overselling.
2. **Group QR Partial Admission (M14)**:
   - `lib/group-entry/index.ts` and Supabase migration `101_group_entry_partial_checkin.sql` implement atomic Postgres procedures to decrement group balances safely under concurrent multi-gate scans.
3. **Hardened Multi-Tenancy & RBAC (M13)**:
   - Protected owner semantics prevent lockouts. Roles (`owner`, `event_manager`, `gate_supervisor`, `gate_staff`) enforce strict privilege separation.
4. **GST & VAT Compliant Invoicing Engine**:
   - `lib/invoices.ts` handles statutory GSTIN rules, SAC codes (997331), intra-state vs inter-state tax splits, UK VAT rules, and sequential FY invoice numbering (`INV/2026-27/0001`).
5. **Model Context Protocol (MCP) Server**:
   - Fully implemented official MCP server (`lib/mcp/server.ts`) providing 17 event, attendee, and conference tools to LLMs and development environments.

---

## 5. Outstanding Risks & Environmental Gaps

| Risk | Impact | Likelihood | Mitigation |
| :--- | :--- | :--- | :--- |
| **WhatsApp WABA Unverified** | Organizers cannot send bulk or transactional WhatsApp invitations to real numbers. | High | Complete Meta Business Verification in AiSensy dashboard, or configure fallback `WHATSAPP_CLOUD_ACCESS_TOKEN` in `.env`. |
| **ESLint Warnings & Any Types** | Potential future regression due to loose typing in legacy files. | Low | Run targeted lint auto-fix (`npm run lint -- --fix`) and replace explicit `any` in core payment handlers. |
| **Offline Scanner Browser Storage Limits** | If IndexedDB quota is exceeded during large (10,000+) attendee caching, manifests fail. | Low | Manifest generator limits cached fields to essential verification data (name, token, zone rules). |

---

## 6. Priority Next Actions (Top 5)

1. **Verify WhatsApp WABA / Provide Meta Cloud Credentials**:
   - Complete WhatsApp Business Verification in AiSensy, or supply `WHATSAPP_CLOUD_ACCESS_TOKEN` and `WHATSAPP_CLOUD_PHONE_NUMBER_ID` in production environment variables.
2. **Fix `AddAttendeeModal` Placeholder in `__tests__/components.test.tsx`**:
   - Align test placeholder selector from `/srinithin/i` to `/attendee name/i` so the test suite finishes without hanging in JSDOM.
3. **Update Legacy Test Mocks**:
   - Align `__tests__/api.test.ts` (add `.maybeSingle()`), `__tests__/auth-flows-and-password-reset.test.ts` (redirect URL), and `__tests__/duplicate-event.test.ts` (mock paid plan tier).
4. **Execute Sandbox Payment Cycle in Staging**:
   - Trigger a simulated end-to-end Razorpay order (`order_created` -> webhook -> ticket generated -> invoice PDF generated) using Razorpay test mode credentials.
5. **Lint Auto-Fix Run**:
   - Execute `npm run lint -- --fix` to resolve the 38 auto-fixable syntax issues and remove unused variable warnings.
