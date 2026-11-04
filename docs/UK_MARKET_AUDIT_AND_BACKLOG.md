# UK market expansion: repository audit and backlog

Status: verified against the local worktree on 2026-11-04. The worktree already contained uncommitted UK changes when this audit began. This is a code audit, not a live database or provider certification.

## Architecture and dependencies

| Flow | Existing implementation | Finding |
| --- | --- | --- |
| Auth and onboarding | `app/signup`, `app/onboarding`, `app/actions/organizations.ts`, Supabase Auth | Onboarding wizard fixes event currency and timezone to INR/Kolkata; organization creation has no country choice. Organization creation is gated by subscription entitlements. |
| Tenancy and RBAC | `organizations`, `organization_members`, `organization_settings`, `lib/rbac`, migration 041 | Organization membership and role checks exist. New market fields need the existing tenant RLS model. |
| Events and tickets | `app/actions/events.ts`, `app/actions/ticket-types.ts`, `lib/validations`, `events`, `ticket_types` | Legacy events store date and time without a timezone or UTC instant. Ticket tier `price` is integer minor units; event `ticket_price` is major units. Existing UK changes add timezone labels but no verified UTC conversion. |
| Registration and passes | `app/actions/attendees.ts`, `app/apply/[eventId]`, `passes`, `check_ins`, scanner services | Reusable free registration, approval, pass, and scanner paths exist. Paid application still launches Razorpay. |
| Payments and settlement | `app/api/razorpay/ticket-order`, `lib/payments`, provider adapters for Razorpay/PayU/Cashfree, `payments`, `ticket_orders`, `organization_payment_accounts` | Existing provider interface is India-specific (`amountINR`, IFSC and split transfers). UK GBP requests must fail closed until a provider and connected accounts are approved. |
| Billing | `app/actions/billing.ts`, `lib/billing`, migrations 105/129, Razorpay webhooks | Existing AutoPay and entitlement code is extensive. `activateUkPlan` accepts a client-supplied provider-looking ID and writes an active subscription without verification; a `UK_DIRECT_` fallback remains. |
| Invoices and payouts | `lib/invoices.ts`, `app/actions/finance-payouts.ts`, `billing_invoices` | Invoice PDF has an Indian supplier/GSTIN fallback. Payout code includes India-specific methods, with partial UK field additions in the worktree. Supplier and tax responsibility remain unresolved. |
| Communications | `lib/email.ts`, `lib/email-engine`, `lib/communications` | Multiple emails still use Asia/Kolkata and Razorpay wording. Partial timezone parameters were added to pass emails. |
| Explore | `lib/explore`, `app/explore`, `app/actions/explore.ts` | Shared listing and eligibility services exist; detail page hardcodes rupee formatting and guesses country from London city. |
| Privacy and analytics | `components/ui/CookieConsentBanner.tsx`, `app/api/privacy/data-deletion`, conversion/analytics code | Banner is route-limited; no proof all optional scripts are consent-gated. Deletion endpoint currently mutates attendee data from an unverified email submission. New privacy RLS policy grants all roles broad access. |

## Verified reported issues

All eight reported issues are present or partially addressed: `UK_DIRECT_` remains in billing; `ApplyForm` still uses Razorpay; finance payout logic remains India-centric; invoice supplier/GSTIN is hardcoded; event timestamps lack reliable timezone persistence; email has Kolkata defaults; cookie controls cover only selected routes; and privacy erasure lacks requester verification and transfer inventory. The UK changes already in the worktree do not establish provider approval or legal compliance.

## Implementation checklist and release gates

| Priority | Work | State |
| --- | --- | --- |
| P0 | Remove client-asserted UK paid activation, disable UK paid flags and fail GBP Razorpay requests closed | Implemented; targeted tests passed |
| P0 | Replace open privacy RLS policy and unverified destructive erasure with request tracking | Implemented intake; identity-verification workflow pending |
| P1 | Add strict market config, explicit organization country, minor-unit currency helpers, and validated local-to-UTC conversion | Implemented; timezone tests passed |
| P1 | Add additive migration with explicit legacy backfill and no guessed UTC instants | Implemented; local transaction validation passed; staging pending |
| P1 | Verify UK free creation/registration/pass/scanning and India regression with automated tests | Partially tested; live Supabase end-to-end pending |
| P2 | Globalize Explore, emails, ticket/pass renderers and registration forms | Partially implemented; remaining templates and passes pending |
| P0 | Correct existing UK marketing pages that claim live paid ticketing, GBP subscriptions, or full UK GDPR compliance | Blocked for launch; 37 UK route files contain such claims and require content review |
| P2 | Extend existing provider interface, payment ledgers, webhook and refund reconciliation for an approved UK arrangement | Requires Provider Approval |
| P2 | GBP subscriptions, correct supplier-specific invoices and tax rules | Requires Provider Approval / Requires Legal Approval |
| P2 | Consent records, access/export/correction/erasure workflow, retention and international transfer inventory | Requires Legal Approval for policy decisions |
| P3 | Staging migration validation, production monitoring, staged rollout and rollback rehearsal | Blocked on staging access and approvals |

## Migration and rollback constraints

Legacy `events.event_date/start_time/end_time` are local wall-clock values with no recorded zone. They must not be silently converted into UTC. Existing `ticket_types.price` and `payments.*_paise` are integer minor units, while `events.ticket_price` is major units. Preserve historical invoices and payment references. Additive columns may be rolled back only after confirming no new rows depend on them; financial records should be retained. No production migration or payment activation is authorized by this task.

## Launch sign-off

Record provider confirmation of merchant country, connected-account eligibility, merchant of record, refunds, disputes, fees and settlement. Obtain UK tax advice for each supplier/document type, privacy and PECR advice for cookie categories/retention, and transfer mechanism review for each subprocessor before a UK paid launch. Do not describe the platform as legally compliant from technical features alone.

Legal advisers should sign off on: (1) supplier/merchant identity for SaaS fees, platform fees and ticket sales; (2) VAT registration and place-of-supply treatment, including whether tax applies to each line; (3) organiser and platform privacy roles, notices, lawful bases, retention and identity checks for rights requests; (4) PECR cookie classification and evidence requirements; (5) UK international-transfer mechanisms, subprocessors and transfer assessments; (6) consumer cancellation/refund wording and dispute responsibility. Record the advice and effective date before any related feature flag is enabled.

## Stage execution record

| Stage | Modified files | Verification | Outstanding |
| --- | --- | --- | --- |
| A Audit | This report | Code paths and migration units inspected; eight findings verified | Live production schema and provider state are unknown |
| B Foundation | `lib/market.ts`, `lib/markets/*`, `lib/currency.ts`, `app/actions/events.ts`, migration 131, organisation creation/forms | TypeScript passed; UTC transition tests passed; migration ran against representative legacy rows in a local PostgreSQL transaction and rolled back | Apply migration to staging and test actual schema/RLS there |
| C UK free event | Onboarding, event creation, ticket tier actions, attendee registration guard, public apply page | Targeted tests passed; GB paid creation and checkout guarded | Browser end-to-end with UK test organiser, free attendee, email and scan |
| D Payment safety | Billing action, Razorpay order routes, managed payment service, flags, Stripe settings action | Focused billing/Razorpay tests passed | Approved provider, connected accounts, refund/dispute/settlement integration |
| E Billing | GBP paid activation disabled | Existing India billing security tests passed | GBP subscriptions and supplier/tax design require approvals |
| F Privacy | Privacy request endpoint, migration RLS, consent analytics loader/banner | TypeScript passed; consent helper tests passed | Verified identity, retention execution, server-side consent ledger, transfers inventory and legal sign-off |
| G Explore | Listing action, eligibility timezone, city catalog, detail display | Explore action tests passed | Region filters, UK marketing claim review and full UX validation |
| H Testing and release | Added timezone/market tests; updated stale duplicate-event fixture | 75 targeted tests passed across 10 files; full suite attempted and interrupted after many unrelated failures and a hang | Resolve baseline failures and complete staging rollout gates |

The full `npm test` run on 2026-11-04 reported failures in older auth, SEO, webhook, pricing and other suites before hanging. Relevant Explore test expectations were updated for the new currency read and pass. The standalone `duplicate-event` fixture was updated to mock the existing entitlement resolver; its three tests now pass. Other observed failures include tests with stale dates, outdated fixture shapes and pre-existing expectation drift. No claim is made that the full suite passes.

## Staging and rollback runbook

1. Back up the staging database and record row counts, event financial amounts, payment references, invoice references, and existing RLS policies. Confirm migration 131 has not been applied under a different name.
2. Apply migration 131 to staging before deploying code that selects the new fields. Confirm legacy event UTC columns remain NULL, legacy prices and payment minor units are unchanged, organization defaults are IN/INR, and no browser role can read privacy requests.
3. Deploy the code with `uk_paid_ticketing` and `uk_organizer_mor` disabled. Exercise Indian paid order, AutoPay renewal, refund and scanner flows; then create a UK free organisation/event and register/scan an attendee.
4. Observe order/webhook failure rates, pass issuance duplicates, scanner errors, migration errors and privacy request intake. Do not enable GBP checkout from a publishable key alone.
5. To roll back application behavior, redeploy the previous application version. Leave additive financial and privacy columns in place until a reviewed data-retention decision; do not delete recorded requests or financial rows. If staging migration rollback is necessary before any UK rows exist, drop only newly added columns and the new privacy table in a separate reviewed migration after backups.
