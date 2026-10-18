# URPASS — Test Execution & Engineering Validation Report

**Execution Date:** October 18, 2026  
**Environment:** macOS (Darwin arm64), Node.js v25.2.1 / Node.js v22.23.2, npm 11.2.0  
**Test Runners:** Vitest v4.1.11, Next.js 16.3.3 Turbopack, TypeScript 5, ESLint 9  

---

## 1. Summary of Executed Commands

| Command | Working Directory | Exit Code | Duration | Outcome Summary |
| :--- | :--- | :--- | :--- | :--- |
| `npx vitest run` | `/Users/srinithinsomasundaram/Downloads/urpass` | 1 | ~24s | 98 test files passed, 4 test files failed (975 passed, 13 failed out of 988 tests). |
| `npx tsc --noEmit` | `/Users/srinithinsomasundaram/Downloads/urpass` | 0 | 3.5s | **PASSED**: 0 TypeScript compilation errors. |
| `npm run lint` | `/Users/srinithinsomasundaram/Downloads/urpass` | 1 | 38s | **FAILED**: 494 errors, 1830 warnings (primarily `@typescript-eslint/no-explicit-any` and unused variables). |
| `npx vitest run __tests__/production-readiness-workflows.test.ts` | `/Users/srinithinsomasundaram/Downloads/urpass` | 0 | 1.28s | **PASSED**: 15 / 15 tests passed across Workflows A through J. |
| `npm run build` (`next build`) | `/Users/srinithinsomasundaram/Downloads/urpass` | 0 | 19.8s | **PASSED**: Turbopack compiled successfully, generated static pages and dynamic routes with 0 errors. |

---

## 2. Test Execution Breakdown

### 2.1 Full Vitest Suite Execution
- **Total Test Files Evaluated:** 102
- **Passed Files:** 98
- **Failed Files:** 4
- **Total Tests:** 988
- **Passed Tests:** 975
- **Failed Tests:** 13
- **Test File Duration:** 23.14s

#### Failed Test Breakdown:
1. **`__tests__/api.test.ts`** (2 tests failed):
   - `POST /api/verify > returns success: true on successful first check-in`:  
     `TypeError: eventQuery.maybeSingle is not a function`. Cause: Mock query builder chain in `__tests__/api.test.ts` did not define `.maybeSingle()` on the branch when `isEventUuid` is false.
   - `POST /api/verify > normalizes pass URL from email QR code to raw token`:  
     Same `eventQuery.maybeSingle` mock issue.
2. **`__tests__/auth-flows-and-password-reset.test.ts`** (1 test failed):
   - `Auth Callback with Password Reset Token Hash > handles code exchange and redirects to dashboard`:  
     Expected `"http://localhost:3000/dashboard"`, received `"http://localhost:3000/onboarding/subscription"`. Cause: Active onboarding redirection logic automatically routes new users without an active subscription to `/onboarding/subscription`.
3. **`__tests__/country-config.test.ts`** (3 tests failed):
   - `detects UK from accept-language header when geo headers are absent`: Expected `GB`, received `IN` due to language header priority order.
   - `never falsely classifies Indian user as UK`: `TypeError: window.localStorage.removeItem is not a function` in JSDOM environment without localStorage shim.
   - `persists country choice and dispatches urpass_country_changed custom event`: `TypeError: window.localStorage.getItem is not a function`.
4. **`__tests__/duplicate-event.test.ts`** (3 tests failed):
   - `returns error if source event is not found`: Expected `"Source event not found."`, received `"Paid subscription required to duplicate events. Please activate your subscription at /onboarding/subscription."` Cause: Plan entitlement check `canUseFeature(userPlan, "advancedPermissions")` executes prior to event existence check; test mock user was on Free plan.
   - `returns error if user is not authorized to duplicate the event`: Same subscription guard error.
   - `duplicates event details and associated ticket tiers into a draft event`: Expected cloned event ID, received subscription guard rejection.
5. **`__tests__/components.test.tsx`** (Hanging issue):
   - Test hung during JSDOM execution because `AddAttendeeModal.tsx` changed its name input placeholder from `e.g. Srinithin` to `Attendee name`, causing `screen.getByPlaceholderText(/srinithin/i)` to fail and block `waitFor`.

---

### 2.2 Critical Workflows Verification Suite (`__tests__/production-readiness-workflows.test.ts`)
A dedicated automated test suite executed all 10 critical operational workflows against pure deterministic runtime modules:

| Test Group | Test Case | Duration | Status |
| :--- | :--- | :--- | :--- |
| **Workflow A** | enforces unique sanitized event slugs and validation | 156ms | **PASS** |
| **Workflow A** | validates attendee schema with required fields and rejects invalid emails/phones | 3ms | **PASS** |
| **Workflow B** | generates opaque pass tokens and extracts clean token from URLs | 2ms | **PASS** |
| **Workflow B** | hardens public pass views by masking attendee PII (`maskPhone`, `maskEmail`) | 4ms | **PASS** |
| **Workflow C** | calculates group admission accurately across multiple partial entries (M14) | 6ms | **PASS** |
| **Workflow D** | isolates attendance between distinct sessions (e.g., Autism vs ADHD) | 6ms | **PASS** |
| **Workflow D** | detects conference session scheduling and room overlaps on the same day | 3ms | **PASS** |
| **Workflow E** | normalizes phone numbers to E.164 and validates format | 11ms | **PASS** |
| **Workflow F** | computes GST 18% (CGST 9% + SGST 9%) and VAT 20% accurately without rounding drift | 100ms | **PASS** |
| **Workflow F** | verifies Razorpay webhook candidate secrets resolution | 149ms | **PASS** |
| **Workflow G** | serializes and normalizes tokens for offline IndexedDB matching | 9ms | **PASS** |
| **Workflow H** | enforces protected organization owners against downgrade or removal | 3ms | **PASS** |
| **Workflow H** | validates enterprise CIDR IPv4 blocks correctly | 5ms | **PASS** |
| **Workflow I** | computes net in-venue presence from scan entry and exit sequences | 5ms | **PASS** |
| **Workflow J** | sanitizes CSV cells to prevent Formula Injection Attacks (`=`, `+`, `-`, `@`) | 9ms | **PASS** |

**Workflow Suite Result:** 15 passed, 0 failed (Total execution time: 1.28s).

---

### 2.3 Next.js 16.3.3 Production Build Output
Executed command: `npm run build`
```
▲ Next.js 16.3.3 (Turbopack)
- Environments: .env.local, .env
✓ Running next.config.ts took 126ms

  Creating an optimized production build ...
✓ Compiled successfully in 8.6s
  Finished TypeScript in 3.5s    ✓ Finished TypeScript in 3.5s 
  Collecting page data using 7 workers in 2.5s    ✓ Collecting page data using 7 workers in 2.5s 
  Generating static pages (539) ...
✓ Generating static pages (539) in 7.2s
```
**Build Verdict:** Fully compliant Next.js Turbopack production bundle generated without errors.
