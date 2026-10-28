# First event and subscription conversion audit

Date: 28 October 2026. Scope: repository code and migrations. The deployed Supabase schema, Razorpay account configuration, and production analytics were not accessible during this audit; migration presence does not prove deployment.

## Existing journey and reusable components

| Area | Current implementation | Integration decision |
| --- | --- | --- |
| Signup | `app/signup/page.tsx` supports email/password, Google and SSO, then routes new organizers to `/onboarding/subscription`. Auth callbacks also use that destination. | Preserve authentication and attribution across the new first-event route. |
| First event | `app/onboarding/OnboardingClient.tsx` collects organization, gateway, event, pass and test-scan choices. `app/create-event/page.tsx` and `app/actions/events.ts` create the real event and default ticket tier. | Reuse `events`, ticket types and the existing event settings and publish action. |
| Draft storage | `events` already has `draft` status, but migration `001_initial_schema.sql` makes `event_date`, `start_time`, `end_time` and `venue` non-null. `eventSchema` and `createEvent` require those values. | A quick name-and-capacity-only draft needs a safe schema and action change; do not insert fake dates, venues or meeting links. |
| Publish | `updateEventStatus` calls `validateEventPreflightReadiness`, checks ownership and plan event limits. | Keep this as the publication gate and add explicit subscription/registration-limit checks as needed. |
| Free plan | `selectFreePlan` in `app/actions/billing.ts` writes an active `subscriptions` row with provider `free` and no billing cycle. | Keep free activation outside Razorpay and return to the saved draft. |
| Plans | `plans`, `billing_plans`, `billing_plan_prices`, `STATIC_V2_PLANS`, `V2_PLAN_LIMITS`, and `lib/billing/catalog.ts` coexist. `/api/billing/plans` currently returns static prices. `SubscriptionOnboardingClient` and `CheckoutButton` also hardcode prices and limits. | Resolve one server-side catalog tied to the amount the checkout actually charges; expose only enabled cycles and verified entitlements. |
| Paid checkout | `/api/billing/subscriptions` creates a Razorpay subscription. `CheckoutModal` and `/api/billing/subscriptions/verify` perform authorization and server-side verification. An alternative mandate path exists at `/api/billing/autopay/mandate`. | Reuse one supported checkout path and its Razorpay subscription; keep checkout identity in durable storage. |
| Billing lifecycle | `lib/razorpay-webhook.ts` handles subscription webhooks and `processed_webhook_events`; `app/actions/billing.ts` handles cancellation/reactivation; `lib/billing/reconciliation.ts` audits provider discrepancies. | Preserve these paths, extend their verified transitions with conversion events. |
| Conversion tracking | `lib/seo/analytics.ts` sends browser events to `/api/analytics/conversion`, which writes `marketing_campaign_conversions`. Migration `123_signup_conversion_agent.sql` proposes `conversion_visitor_sessions` and `conversion_events`, but is currently untracked and no application code uses these tables. | Verify deployment and access policies before wiring a shared funnel. Count activation from verified server outcomes only. |

## P0 blockers

1. **A true quick draft cannot be saved with only the requested fields.** The base `events` schema and `eventSchema` require schedule and venue. The current onboarding wizard supplies a date 14 days away and `Main Venue` or a sample meeting URL. Those placeholders must not become an organizer's real event details.
2. **Price and entitlement disclosures can diverge from actual checkout.** The onboarding UI, `CheckoutButton`, static pricing engine and database catalogs contain different price and limit definitions. `/api/billing/subscriptions` currently supports monthly INR despite other UI showing annual or GBP. The new flow must display only the supported offer returned by a server-side quote, including tax, first charge, recurrence and renewal.
3. **Paid checkout is not retry-safe.** Each successful call to `/api/billing/subscriptions` creates a new Razorpay subscription before any durable checkout intent is recorded. A double click or interrupted authorization can leave multiple provider subscriptions. Create a unique checkout intent per user/plan/cycle and reuse the same pending provider ID. Reconcile pending state before entitlement activation.
4. **The proposed conversion migration is not yet integrated.** `123_signup_conversion_agent.sql` is an untracked worktree file. Its policies named “Admins can view...” grant broad access to all authenticated users; do not deploy those policies as written. A new onboarding funnel must use server-validated identities, least-privilege RLS, and idempotent event keys.

## P1 gaps

1. Signup currently discards its computed post-auth target and sends a new organizer to `/onboarding/subscription`; this would lose a saved first-event destination without a deliberate redirect contract.
2. The plan selector marks Pro as recommended without using expected registrations. Recommendation should use actual plan limits and the organizer's expected usage, without auto-selecting a paid plan.
3. `updateEventStatus` verifies ownership and publish readiness, but the new flow needs an explicit final confirmation and a check that a free/paid entitlement is active at the moment of publish. Confirm registration-period and capacity rules against the existing action.
4. The webhook has a database deduplication insert, but continues processing after a non-duplicate database insert error. This makes deduplication best effort when storage is unavailable; fail closed or queue a verified retry before adding conversion counts.
5. The existing analytics endpoint accepts arbitrary browser event names and silently returns success on insert failure. It cannot be the source of truth for subscription activations or first published events.
6. The existing subscription onboarding route redirects accounts with organizer access to the dashboard, so an event draft return path needs its own route and must also handle invited members and existing organizers.

## Incremental implementation sequence

1. **Quick draft behind a rollout flag:** Permit schedule and venue to be null only for drafts, save name, expected registrations, corporate category and registration objective on the existing `events` row, and ensure the first-event draft action is owner-bound and retry-safe. Keep public routes and registration disabled until the existing publish preflight passes. Add a draft restoration route.
2. **One authoritative offer view:** Read active plan prices and entitlements on the server; align actual Razorpay checkout with that quote. Show Free, Starter, Pro and Business, with annual only when configured and checkout-supported. Show tax and renewal terms. Free calls the existing free action.
3. **Durable paid checkout:** Add a unique pending checkout record and provider subscription ID, reuse it on retries, verify provider state on the server, and resume the saved draft after success or failure. Preserve existing cancellation and webhook lifecycle.
4. **Registration setup and publish:** Link to the existing event settings, registration form, pass, invitation and email configuration. Add a focused final review and confirmation before calling the existing publish action.
5. **Conversion measurement:** Repair/deploy the shared attribution migration; record draft, plan, checkout and publication events with stable idempotency keys. Derive paid activation and revenue from verified billing events. Report cohorts only from actual data.
6. **Rollout:** Feature-flag new signups first, then existing organizers. Test free selection, invited members, retries, webhook duplication, cancellation, failed authorization and draft restoration before increasing exposure.

## Verification needed before rollout

- Compare the deployed `events`, `plans`, `billing_plan_prices`, `subscriptions`, and conversion table schemas with repository migrations.
- Confirm the Razorpay plan IDs, supported mandate methods, exact tax treatment, current charge and renewal timing from the provider account.
- Confirm migration `123` ownership and correct its RLS before deployment.
- Capture a baseline funnel from actual signup, event and subscription records; no conversion figures are assumed in this audit.

## Implementation progress in this worktree

- Added a feature-flagged first-event route with a deterministic rollout percentage. It saves an actual private `events` draft with corporate registration defaults and no fake date, time or venue. Migration `124` supplies nullable draft fields while requiring complete details for active events.
- Added a first-event plan screen using active INR monthly rows from `billing_plan_prices` and the same plan limits used by the publish code. Annual recurring checkout remains unavailable because the current Razorpay subscription endpoint supports monthly INR only. The screen does not select a paid plan.
- Extended the existing Razorpay subscription endpoint with provider-plan price comparison and a unique pending checkout intent in migration `125`. A retry reuses the pending provider subscription. Callback verification now requires the matching intent, signature, captured payment and active provider subscription. The webhook no longer grants access on mandate authentication alone and can retry failed deduplication records.
- Reused the existing event settings, tickets, passes and communications screens. Added an organizer-only preview, a publication confirmation, subscription and registration-allowance checks, and a post-publication share page.
- Added optional registration opening and closing timestamps in migration `126`, with event settings inputs, publish preflight and server-side registration checks.
- Expanded migration `123` with the first-event conversion names and removed its broad authenticated report policies. A first-party session cookie links signup and onboarding attribution for email and Google signups. `scripts/first-event-conversion-report.mjs` generates a read-only weekly signup cohort report by acquisition source, landing page, category, device, interval and plan. No production conversion figures are claimed.

### Remaining rollout gates

1. Apply and inspect migrations `123`–`126` in staging, including the policies and current production rows. The feature flag remains off by default.
   Enable a cohort with `NEXT_PUBLIC_FIRST_EVENT_CONVERSION_ENABLED=true` and `FIRST_EVENT_ROLLOUT_PERCENT` set between 1 and 100 after validation.
2. Run a real Razorpay test-mode subscription through authorization, capture, webhook, retry, cancellation and recovery. The provider may apply tax differently from the catalog estimate; confirm the displayed first and recurring totals against the merchant account before rollout.
3. Run the weekly cohort report against staging data, review segmentation and schedule it only after the migration and attribution path are confirmed. Do not treat unverified browser analytics as paid activation.

