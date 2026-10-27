# UrPass SEO and GEO implementation audit

Date: 26 October 2026. Scope: repository implementation only. Search Console, analytics accounts, live index coverage, and production traffic were not available for verification.

## P0 — indexing and factual accuracy

| Finding | Evidence | Action |
| --- | --- | --- |
| The sitemap listed every Explore collection, including collections whose metadata returned `noindex` when no approved event matched. | `app/sitemap.ts`; `app/explore/[slug]/page.tsx` | Fixed: collection sitemap entries now require at least three matching approved marketplace events. |
| The Explore keyword fallback could return an event outside a collection's city, category, date, or price filter. That could cause a collection to appear populated and become indexable with the wrong events. | `lib/explore/service.ts` | Fixed: retry queries preserve the original filters. |
| The sitemap listed all active direct-registration events without checking private visibility or registration state, and listed event feedback URLs. | `app/sitemap.ts`; `lib/explore/eligibility.ts` | Fixed: only public, registration-enabled events are included; feedback URLs are excluded. Private direct-registration pages now receive `noindex` metadata. |
| Explore collection registry copy made claims about specific venues, institutional partnerships, delivery speed, and availability without live listing evidence. | `lib/explore/seo-pages.ts`; `app/explore/[slug]/page.tsx` | Fixed in public rendering: collection summaries, highlights, and booking answers now use approved listing data and safe workflow facts. Historical registry copy remains for editorial review and is not rendered. |

## P1 — architecture and content quality

| Finding | Evidence | Next step |
| --- | --- | --- |
| The repository has 873 route page files, including many public marketing routes. Adding the proposed 70 routes verbatim would overlap existing search intent. | `app/`; `app/sitemap.ts`; `lib/seo/pages.ts` | Map each proposed intent to an existing canonical page first. Improve the strongest page and consolidate duplicates. |
| Explore collection indexing previously started with one match. A single listing can leave a thin city or category page. | `app/explore/[slug]/page.tsx` | Fixed provisionally: collections need three matching approved events for indexing. Pages now render current listing data at request time. Review the threshold against real inventory and unique page content. |
| Event JSON-LD uses local date and time strings without a timezone offset. | `app/explore/event/[slug]/page.tsx` | Emit an offset only after the event timezone is reliably available; validate online and physical location fields. |
| Sitemap `lastModified` was set to the current request time for most static pages and Explore listings. | `app/sitemap.ts` | Fixed: known event and job update times remain; entries without a reliable timestamp omit `lastModified`. |
| The main sitemap and Explore queries return at most 50 approved event URLs per query. | `app/sitemap.ts`; `lib/explore/service.ts` | Paginate or split dynamic event sitemaps when inventory exceeds the current limit. |

## P2 — measurement and operations

| Finding | Evidence | Next step |
| --- | --- | --- |
| The repo has Explore attribution and analytics code, but no verified Search Console or GA4 account data was supplied for an organic baseline. | `lib/explore/analytics.ts`; `lib/seo/analytics.ts` | Connect measured search performance before prioritizing new keywords or reporting rankings. |
| Existing marketing and Explore pages use separate content registries and metadata patterns. | `lib/seo/`; `lib/explore/seo-pages.ts` | Build a canonical intent map and shared factual content review process before expanding page count. |

## Launch order

1. Keep private, empty, and unapproved events out of public discovery and sitemaps.
2. Verify and rewrite the first five organizer acquisition pages already present in the repository, including pricing and product claims.
3. Review the highest-priority Explore collections against genuine listings, then allow indexing only where the content answers a distinct search intent.
4. Validate event structured data and connect Search Console before publishing additional pages.

The proposed 70-page inventory is a backlog, not a publication target. No payment, billing, ticket validation, or event authorization logic was changed in this SEO phase.

The first five organizer intents and existing canonical routes are recorded in `docs/SEO_GEO_PRIORITY_INTENT_MAP_2026-10-26.md`. The priority page copy has been updated to remove several unsupported performance and pricing claims; original screenshots, customer proof, Search Console data, and editorial sign-off remain outstanding.
