# Billing reliability: current state and rollout boundary

## Current state before remediation

| Entry | Provider object | Local activation | Renewal | Cancellation |
| --- | --- | --- | --- | --- |
| `/api/razorpay/order` | Razorpay order and payment | `activatePaidSubscription` or `payment.captured` webhook | None; one paid period | Local period ends |
| `/api/billing/subscriptions` | Razorpay `sub_` | Signed callback plus captured payment and active provider subscription, or `subscription.charged` | Provider-managed `subscription.charged` | Provider cancel at cycle end |
| `/api/billing/autopay/mandate` | Razorpay order and `token_` | Mandate verification | No implemented charge scheduler | Delete customer token |
| Free | No provider payment | `selectFreePlan` | No charge | Not applicable |

`subscriptions` is the effective organizer access row. `getUserPlan` supplies feature limits; `resolveUserSubscriptionAccess` controls onboarding and dashboard access. The two readers currently differ on trial expiration and Free duration. Issued attendee tickets are separate records and must remain valid when organizer access expires.

The provider webhook validates the raw body before parsing, then records a provider event ID in `processed_webhook_events`. It currently processes inline and can strand `processing` rows after a crash. A payment may also reach the callback before the webhook or vice versa; both paths need business-key idempotency.

## Provider and deployment boundary

Razorpay Subscriptions documents provider-managed recurring collection. This repository has no merchant-initiated token charge job, configured cron for billing, or proof of merchant approval for a token charge API. Token mandates are therefore historical authorization records, not proof of a future debit. A charge worker must stay disabled until a supported API, consent terms, and test-mode behavior are verified with the merchant account. Existing provider-managed `sub_` subscriptions remain in place.

Local review cannot establish which migrations, webhook subscriptions, secrets, or customer agreements exist in production. Before rollout, compare database rows by `provider_subscription_id` prefix (`sub_`, payment ID, null) and `autopay_mandate_id` prefix (`token_`, `sub_`), then reconcile against Razorpay test and production dashboards without initiating charges. Keep historical entitlements and payment records intact.

## Recovery order

1. Run the dry-run billing report and review expired trials, pending checkout intents, and successful payments without matching access.
2. Apply additive migrations, then deploy code with renewal collection and webhook worker flags off.
3. Enable webhook worker after replay tests and monitoring; monitor failed and expired leases.
4. Offer token-mandate customers a new, consented provider-managed subscription checkout. Never silently migrate or charge a token.
5. Enable any future renewal collection only after separate provider and legal approval and test-mode verification.

Rollback is to disable the new flags, redeploy the prior application version, and retain the additive tables and audit records. Do not delete billing history or revert a successfully captured payment. Reconcile the provider state before restoring local access after an incident.
