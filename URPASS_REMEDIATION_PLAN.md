# URPASS — Prioritized Remediation Plan & Release Roadmap

**Document Version:** 1.0.0  
**Target Release Phase:** Production Readiness Gate  

---

## 1. Remediation Matrix & Priorities

| ID | Issue Description | Priority | Effort | Dependency | Target Target Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REM-01** | Resolve WhatsApp WABA Verification or Configure Meta Cloud API | **P1** | 1-2 hours | AiSensy / Meta Dashboard | Production Ready |
| **REM-02** | Fix JSDOM Placeholder in `__tests__/components.test.tsx` | **P2** | 15 mins | None | Test Green |
| **REM-03** | Resolve Test Mock Divergence (`api.test.ts`, `duplicate-event.test.ts`) | **P3** | 30 mins | None | Test Green |
| **REM-04** | Run ESLint Auto-Fix & Configure `.eslintignore` for Scripts | **P2** | 45 mins | None | CI Clean |
| **REM-05** | Perform Staging End-to-End Sandbox Payment & Invoicing Cycle | **P1** | 1 hour | Razorpay Sandbox | Release Verified |

---

## 2. Detailed Action Items

### REM-01: WhatsApp Provider Gateway Activation
- **Problem:** AiSensy API responds with `WABA is not verified`.
- **Action Plan:**
  1. Complete business verification in the AiSensy console: submit organization documents and verify phone OTP.
  2. If Meta Direct Cloud API is preferred, generate a Permanent System User Token in Meta Business Manager with `whatsapp_business_messaging` permissions.
  3. Set environment variables in production:
     ```bash
     WHATSAPP_CLOUD_ACCESS_TOKEN=EAA...
     WHATSAPP_CLOUD_PHONE_NUMBER_ID=10...
     WHATSAPP_TEMPLATE_NAME=ticket_confirmation
     WHATSAPP_TEMPLATE_LANG=en
     ```
- **Acceptance Criteria:**
  - Sending a test ticket dispatch to a verified mobile number via `POST /api/communications/test` returns `HTTP 200` with `provider: "aisensy"` or `"whatsapp_cloud"` and a valid `messageId`.
- **Regression Test:**
  - `npx vitest run __tests__/communications.test.ts`
  - Run `__tests__/production-readiness-workflows.test.ts` (Workflow E).

---

### REM-02: Fix `components.test.tsx` JSDOM Hang
- **Problem:** Test runner hangs because `AddAttendeeModal.tsx` uses `placeholder="Attendee name"` while test looks for `/srinithin/i`.
- **Action Plan:**
  1. Open `__tests__/components.test.tsx`.
  2. Replace all instances of `screen.getByPlaceholderText(/srinithin/i)` with `screen.getByPlaceholderText(/attendee name/i)`.
  3. Ensure `userEvent.type` targets the updated placeholder.
- **Acceptance Criteria:**
  - `npx vitest run __tests__/components.test.tsx` executes and passes all 23 component tests in under 3 seconds.
- **Regression Test:**
  - `npx vitest run __tests__/components.test.tsx`

---

### REM-03: Align Legacy Test Mocks
- **Problem:** 13 legacy tests fail due to mock differences rather than production code defects.
- **Action Plan:**
  1. In `__tests__/api.test.ts`: add `maybeSingle: vi.fn().mockResolvedValue({ data: mockEvent, error: null })` to the mocked Supabase event query builder.
  2. In `__tests__/duplicate-event.test.ts`: update the mocked user subscription in `lib/plan.ts` mock to `{ tier: "pro", is_trial: false, status: "active" }`.
  3. In `__tests__/auth-flows-and-password-reset.test.ts`: update the expected callback redirect location to `/onboarding/subscription` or mock an active subscription on the test user.
- **Acceptance Criteria:**
  - `npx vitest run` passes 102/102 test files (100% pass rate).
- **Regression Test:**
  - Run full suite: `npm test`

---

### REM-04: Code Hygiene & ESLint Cleanup
- **Problem:** 494 ESLint errors and 1830 warnings prevent clean CI runs.
- **Action Plan:**
  1. Add `scripts/` and legacy definition files to `.eslintignore`.
  2. Run `npm run lint -- --fix` to automatically repair formatting, const assignments, and import statements.
  3. Replace `@typescript-eslint/no-explicit-any` with appropriate generic interfaces in webhook handlers.
- **Acceptance Criteria:**
  - `npm run lint` exits with exit code 0.
- **Regression Test:**
  - `npm run lint && npm run build`

---

### REM-05: Staging Gateway Order & Invoice Verification
- **Problem:** Ensure live Razorpay sandbox webhooks trigger end-to-end receipting and invoice PDF generation.
- **Action Plan:**
  1. Execute a synthetic checkout using test card / test UPI.
  2. Confirm webhook `payment.captured` arrives at `/api/webhook/razorpay`.
  3. Verify attendance row in `attendees` updates to `application_status: "approved"`, `passes` row created.
  4. Verify PDF invoice generated and stored in Supabase storage bucket `invoices`.
- **Acceptance Criteria:**
  - Complete order record visible in organizer finance dashboard with correct tax splits (GST 18% / VAT 20%).
- **Regression Test:**
  - `npx vitest run __tests__/finance-payouts.test.ts`
  - `npx vitest run __tests__/invoices.test.ts`
