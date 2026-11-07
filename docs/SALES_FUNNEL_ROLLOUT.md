# UrPass sales funnel rollout

## Available paths

- Self-service: signup, first-event draft, plan selection, event settings and publish. The quick first-event path remains behind `NEXT_PUBLIC_FIRST_EVENT_CONVERSION_ENABLED` and `FIRST_EVENT_ROLLOUT_PERCENT`.
- Enterprise: `/demo` collects a qualified request with contact consent, event requirements and attribution. Ops can manage stages, owner, deal value and follow-up in `/ops/sales`.
- Managed setup: the existing `/managed-event-setup` inquiry and `/ops/campaigns` pipeline remain separate.

## Release order

1. Apply migration `133_sales_pipeline.sql` before exposing `/demo` in production. Verify service-role access and the Ops session gate.
2. Confirm the first-event migration (`124`) and billing setup, then enable the first-event flag for a small cohort. Check signup → draft → publish → purchase in `/ops/conversion`.
3. Confirm first-event reminder opt-ins from email signup and the account email-preferences screen. Schedule authenticated GET `/api/cron/sales-lifecycle` daily with `Authorization: Bearer <CRON_SECRET>`, then set `SALES_LIFECYCLE_EMAIL_ENABLED=true`. The cron requires explicit user metadata consent and respects an off setting in `email_preferences`. It sends setup, draft recovery, workflow, published-share and 14-day reactivation messages only when their current goal still applies. Each send is claimed once in `sales_lifecycle_dispatches`. Google signups must opt in through account settings before receiving these messages.
4. Track acquisition by UTM source and landing page. Keep UK inquiries on the demo route until UK billing is verified.

## Forecast

`/ops/sales` includes an editable scenario calculator. Its output estimates **new monthly subscription revenue before GST**, and does not represent observed sales or account for churn, failed payments, discounts, annual contracts, event passes or services.

## Remaining sequence work

Capacity upgrade and WhatsApp journeys need separate event triggers, opt-in checks, approved templates and suppression rules before enabling outbound messages. The dashboard now shows Refer & Earn after two completed events. The existing event-completion action already sends an organiser summary; review its consent handling before using it as a marketing journey.
