# Explore advertising implementation

## Local setup

Apply migrations `120_explore_marketplace_listings.sql` and `121_explore_ad_campaigns_and_promotions.sql` in order in a Supabase development project. Set `SUPABASE_SERVICE_ROLE_KEY` and either `OPS_SESSION_SECRET` or the service role key for Ops session signing. Visit `/ops/promotions` after signing in through Ops. The public Explore page remains usable without campaigns.

The migration creates a public bucket for approved JPEG, PNG, WebP, and AVIF creatives. The admin uploader accepts at most 4 MB and checks the file signature. Campaigns created in the admin start as drafts. Activating one is the approval step; only an authenticated Ops session can call campaign actions, and public RLS exposes only approved active campaigns within their schedule. Event promotions must reference a live, approved Explore listing.

## Delivery

Delivery is deterministic: campaigns sort by descending priority, then ascending creation time and ID. Up to four eligible hero campaigns rotate in that order every 12 seconds, with one visible at a time. Rotation pauses on hover and focus and stops under reduced motion. Other placements take the first eligible campaign. A campaign is not reused in a different placement within a page response. No paid campaign fallback is fabricated. The normal Explore hero and an owned organizer card remain when appropriate.

Eligibility checks status, approval, schedule, selected city, creative host, destination URL, and linked listing approval. Image URLs are limited to the Explore storage bucket and Unsplash; destinations may be a relative site path or an HTTPS URL without credentials. All paid campaigns display Sponsored. Newsletter content is owned content.

## Metrics and privacy

An impression requires at least half of the creative visible continuously for one second. The browser records a session-scoped anonymous ID. The server checks campaign eligibility again, deduplicates each event type once per campaign and session per day, and atomically updates campaign counters. The admin dashboard shows campaign totals plus 90-day placement and city counts. Clicks mean ad CTA clicks, not verified page visits. Registration and purchase attribution are not implemented, so they are not shown. Raw events contain no email or account ID and are kept for 90 days. If `pg_cron` is installed, the migration schedules the daily purge; otherwise call `public.purge_explore_ad_events()` from a daily database job.

Newsletter records are private to the service role and require explicit consent. Duplicate emails update the existing preference. A token-based unsubscribe action is available from the signup confirmation link. There is no email sending job in this change; a future digest sender must include the unsubscribe URL in each email. The local per-instance request limits reduce casual abuse, but a shared rate-limit store is needed for consistent limits across multiple app instances.

## Verification scope

The migrations were executed against a local PostgreSQL stub schema inside a transaction that ended in `ROLLBACK`. No Supabase development or production schema was modified. Browser screenshots show the current local page without paid campaigns because no campaign migration or approved campaign has been applied to the connected Supabase project. The four paid placements were also rendered with test campaign data in the component test suite.
