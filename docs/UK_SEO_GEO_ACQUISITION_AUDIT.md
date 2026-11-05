# UK SEO, AEO & GEO Acquisition Engine: Audit & Implementation Backlog

Date: 5 November 2026  
Status: Verified against codebase. Pre-implementation audit completed.

## 1. Executive Summary

This audit assesses the state of UK organic search acquisition (`/uk/`) across technical SEO, routing, content architecture, commercial readiness, conversion tracking, and regional localization.

The target business outcome is driving qualified UK organizer signups, first-event creation, and demo requests for UrPass without compromising Indian search signals or asserting unverified payment capabilities.

## 2. Key Audit Findings

1. **Routing & Cannibalisation:** 16 legacy routes existed at the root (such as `/event-registration-software-uk` and `/eventbrite-alternative-uk`) competing with `/uk/` pages. Permanent 301 redirects are required.
2. **Commercial Readiness Violations:** 10 existing UK page files contained raw Indian Rupee copy (`₹499/month`) and advertised integrated Stripe/Razorpay checkouts when `uk_paid_ticketing` is false.
3. **Structured Data Discrepancies:** `SEOPage.tsx` emitted Schema.org offers advertising £15 to £79/mo subscription prices that are not live.
4. **Attribution Dropping:** Landing page CTAs forwarded to `/signup` without UTMs, market code (`market=GB`), or referral slug. Onboarding defaulted `countryCode` to `"IN"`.
5. **Cookie Privacy Coverage:** `shouldShowCookieConsent` checked `/pricing` and `/apply` but omitted `/uk/*` routes for UK visitors.
6. **Sitemap Organization:** Monolithic `app/sitemap.ts` contained multiple duplicate arrays registering UK routes multiple times.

## 3. Implementation Plan

- **Stage 1: Core Foundation & Safety:** Fix 301 redirects in `next.config.ts`, sanitize `SEOPage.tsx` and `lib/seo/metadata.ts`, enforce ISO 3166-2 (`GB`), and connect UK attribution in CTAs and onboarding.
- **Stage 2: 10 Priority Product Pages:** Standardize answer-first direct answers, sub-second scanning proof, and truthful Free tier messaging.
- **Stage 3: 10 Priority Sector Pages:** Tailor copy to UK universities, student unions, and conferences with Student ID and committee handover workflows.
- **Stage 4: 10 UK Comparisons & Guides:** Implement honest competitor comparisons (Eventbrite UK fee math) with source citations.
- **Stage 5: 19 UK City Pages:** Ground pages in genuine local venues (ExCeL, Manchester Central, NEC Birmingham, SEC Glasgow, etc.) with zero boilerplate duplication.
- **Stage 6: Conversion & Lead Intake:** Implement dedicated demo request / waitlist capture for UK organizers.
- **Stage 7: Automated Tests:** Add regression and verification tests ensuring valid schemas, zero rupee leaks, and reliable signup handoff.
