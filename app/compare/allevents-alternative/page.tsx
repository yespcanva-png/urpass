import type { Metadata } from "next";
import { CheckCircle2, Ticket, ShieldCheck, Percent, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "AllEvents Alternative for Direct Ticketing & QR Check-In",
  description: "Looking for an AllEvents.in alternative? Host clean, white-labeled registration pages without distracting competitor ads, high commissions, or third-party event discovery noise.",
  keywords: [
    "allevents alternative",
    "event ticketing alternative",
    "event registration software",
    "QR event check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/compare/allevents-alternative" },
  openGraph: {
    title: "AllEvents Alternative for Direct Ticketing & QR Check-In | URPASS",
    description: "Looking for an AllEvents.in alternative? Host clean, white-labeled registration pages without distracting competitor ads, high commissions, or third-party event discovery noise.",
    url: "https://urpass.space/compare/allevents-alternative",
    locale: "en_IN",
    type: "article",
  },
};

export default function ComparisonPage() {
  return (
    <SEOPage
      config={{
        badge: "DIRECT TICKETING ALTERNATIVE",
        h1: "AllEvents Alternative for Direct Event Registration & Ticketing",
        canonicalUrl: "https://urpass.space/compare/allevents-alternative",
        description: "Looking for an AllEvents.in alternative? Host clean, white-labeled registration pages without distracting competitor ads, high commissions, or third-party event discovery noise.",
        ctaLabel: "Host events directly free",
        features: [
          { icon: Ticket, title: "Ad-Free Dedicated Pages", desc: "Host clean, distraction-free event registration pages that showcase your brand without promoting competing events." },
          { icon: ShieldCheck, title: "Zero Ticket Commission", desc: "Keep 100% of your ticket revenue without paying high per-ticket ticketing platform fees." },
          { icon: Percent, title: "Direct Attendee Ownership", desc: "Your attendee database is 100% private to your organization — never marketed to or shared with competitors." },
          { icon: ScanLine, title: "Sub-Second Door Check-In", desc: "Verify attendee QR passes in under 0.3s using standard smartphone browsers without hardware rentals." },
          { icon: Users, title: "Custom Pass Designer", desc: "Design bespoke digital tickets with your organization logo, brand colors, and Apple Wallet compatibility." },
          { icon: BarChart3, title: "Native UPI Payments", desc: "Accept ticket payments in India via Google Pay, PhonePe, Paytm, and net banking through Razorpay." },
        ],
        steps: [
          { n: "01", title: "Create Event", desc: "Set up ticket classes, capacity limits, and custom registration fields." },
          { n: "02", title: "Share Direct Link", desc: "Promote your dedicated, ad-free event registration URL." },
          { n: "03", title: "Issue Digital Passes", desc: "Attendees receive unique digital QR passes immediately upon booking." },
          { n: "04", title: "Scan at the Gate", desc: "Volunteers scan passes with mobile browsers in under 0.3 seconds." },
          { n: "05", title: "Retain Your Data", desc: "Export full attendee contact lists and timestamped check-in logs." },
        ],
        callout: {
          badge: "BRAND OWNERSHIP",
          title: "Own your event brand and attendee relationships.",
          description: "Aggregator sites like AllEvents prioritize discovery and promote competing events on your event page. URPASS gives you a dedicated, professional ticketing page with zero distractions.",
          bullets: [
            "Zero competitor advertisements on your event pages",
            "Zero per-ticket percentage cuts on ticket sales",
            "Full ownership of your customer and attendee database",
            "Sub-0.3s door check-in with duplicate pass lockout",
          ],
        },
        useCases: [
          "College Cultural & Tech Fests",
          "Conferences & Summits",
          "Professional Masterclasses",
          "Creator Community Meets",
          "Hackathons & Buildathons",
          "Corporate Dinners",
        ],
        faqs: [
          { q: "Why should I use URPASS instead of an event discovery site?", a: "Event discovery sites charge high commissions and show competitor events on your listing. URPASS gives you a clean, dedicated page with zero per-ticket cuts." },
          { q: "Does URPASS charge per-ticket transaction fees?", a: "No. URPASS operates on transparent flat monthly plans with zero per-ticket commission." },
          { q: "Can attendees show their tickets on mobile phones?", a: "Yes. Tickets open directly in mobile Safari or Chrome and can be saved to Apple Wallet or screenshot." },
          { q: "Can we use URPASS for free community events?", a: "Yes. Our permanent free tier allows you to host up to 2 events per month with 100 registrations per month for ₹0." },
        ],
        ctaTitle: "Experience the URPASS difference today",
        ctaDescription: "Permanent free tier · Zero ticket commission · Sub-second door check-in",
      }}
    />
  );
}
