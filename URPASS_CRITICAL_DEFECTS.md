# URPASS — Confirmed Defects & Vulnerability Report

This document records confirmed defects, reproduction steps, expected vs actual behavior, and severity classifications identified during the production readiness audit.

---

### Defect 1: WhatsApp Gateway Block — AiSensy WABA Unverified & Missing Meta Credentials
- **Severity:** **P1 — High**
- **Affected Module:** `lib/communications/providers/whatsapp/aisensy.ts`, `lib/communications/providers/whatsapp/provider.ts`, `app/actions/bulk-whatsapp.ts`
- **Expected Behavior:** When an organizer dispatches transactional ticket passes or bulk WhatsApp invitations to attendees, the message should be transmitted via AiSensy API v2 or fail over cleanly to Meta WhatsApp Cloud API.
- **Actual Behavior:** 
  Calling `https://backend.aisensy.com/campaign/t1/api/v2` with the configured `AISENSY_API_KEY` returns:
  ```json
  {"message":"WABA is not verified","name":"ERR400","errorCode":400,"errorMessage":"WABA is not verified","aisTraceId":"ais_mvcjs2lc_cb03774b"}
  ```
  Fallback Meta Cloud API variables (`WHATSAPP_CLOUD_ACCESS_TOKEN`, `WHATSAPP_CLOUD_PHONE_NUMBER_ID`) are absent from environment variables. Messages therefore fail or fall back to simulation mode without reaching recipients.
- **Reproduction Steps:**
  1. Load `.env` with `AISENSY_API_KEY`.
  2. Invoke `POST https://backend.aisensy.com/campaign/t1/api/v2` with payload `{ destination: "+919876543210", campaignName: "ticket_confirmation", templateParams: [...] }`.
  3. Observe HTTP 400 with message `"WABA is not verified"`.
- **Remediation:** Complete WhatsApp Business Account (WABA) verification inside the AiSensy console, or configure direct Meta Cloud API credentials in production.

---

### Defect 2: Component Test Hanging Under JSDOM in `components.test.tsx`
- **Severity:** **P2 — Medium**
- **Affected Module:** `__tests__/components.test.tsx`, `components/event/AddAttendeeModal.tsx`
- **Expected Behavior:** `npx vitest run __tests__/components.test.tsx` should render UI modals, assert form validation, and exit within ~2 seconds.
- **Actual Behavior:** Vitest execution hangs indefinitely (exceeding 240 seconds) on `__tests__/components.test.tsx`.
- **Root Cause:** In `components/event/AddAttendeeModal.tsx` (line 89), the name input placeholder is `placeholder="Attendee name"`. The test in `__tests__/components.test.tsx` queries `screen.getByPlaceholderText(/srinithin/i)`. The query fails, causing the test runner to wait and hold the JSDOM process open with high memory usage.
- **Reproduction Steps:**
  1. Run `npx vitest run __tests__/components.test.tsx`.
  2. Observe test process hanging at `0/23` passed tests and consuming >1.8 GB RAM.
- **Remediation:** Update `__tests__/components.test.tsx` to search for `/attendee name/i` instead of `/srinithin/i`.

---

### Defect 3: Mock Divergence in `duplicate-event.test.ts`
- **Severity:** **P3 — Low**
- **Affected Module:** `__tests__/duplicate-event.test.ts`, `app/actions/events.ts`
- **Expected Behavior:** Unit tests for `duplicateEvent` should verify event cloning logic and authorization checks.
- **Actual Behavior:** Tests fail with:
  ```
  AssertionError: expected 'Paid subscription required to duplicate events. Please activate your subscription at /onboarding/subscription.' to be 'Source event not found.'
  ```
- **Root Cause:** A plan gate (`canUseFeature(userPlan, "advancedPermissions")`) was added to `duplicateEvent` to restrict duplication to paid tiers. The mock user in the test has a Free tier, so execution aborts before reaching event lookup.
- **Remediation:** Update test mock in `__tests__/duplicate-event.test.ts` to mock a Pro or Business user subscription.

---

### Defect 4: ESLint Rule Violations (494 Errors, 1830 Warnings)
- **Severity:** **P2 — Medium**
- **Affected Module:** Repository-wide (`scripts/`, `lib/`, `types/`)
- **Expected Behavior:** `npm run lint` should exit with code 0.
- **Actual Behavior:** ESLint exits with code 1, reporting 2,324 problems (494 errors, 1,830 warnings). Primary rules violated: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`, and `prefer-const`.
- **Root Cause:** Accumulation of loose typings in legacy migration scripts and webhook payload parsers.
- **Remediation:** Run `npm run lint -- --fix` to automatically correct 38 fixable problems, add explicit typings for payment payloads, and ignore scratch/migration scripts in `.eslintignore`.

---

### Defect 5: Missing `.maybeSingle()` in `api.test.ts` Supabase Mock
- **Severity:** **P3 — Low**
- **Affected Module:** `__tests__/api.test.ts`, `app/api/verify/route.ts`
- **Expected Behavior:** `POST /api/verify` unit test should return HTTP 200 on valid pass scan.
- **Actual Behavior:** Test throws `TypeError: eventQuery.maybeSingle is not a function`.
- **Root Cause:** `app/api/verify/route.ts` (line 104) calls `await eventQuery.maybeSingle()`. The mocked Supabase client chain in `__tests__/api.test.ts` provides `.single()` but omitted `.maybeSingle()`.
- **Remediation:** Add `maybeSingle: vi.fn().mockResolvedValue(...)` to the Supabase mock in `__tests__/api.test.ts`.
