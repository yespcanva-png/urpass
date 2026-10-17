import type { Metadata } from "next";
import { BadgeCheck, Clock, Layers, Lock, QrCode, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multiple Event Ticket Types Software | UrPass",
  description: "Configure tiered ticket types (Early Bird, VIP, Student, Group) with individual pricing, capacity limits and access permissions.",
  keywords: [
    "event ticket types management",
    "create general, vip and custom ticket categories",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/event-ticket-types-management" },
  openGraph: {
    title: "Multiple Event Ticket Types Software | UrPass",
    description: "Configure tiered ticket types (Early Bird, VIP, Student, Group) with individual pricing, capacity limits and access permissions.",
    url: "https://urpass.space/event-ticket-types-management",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TIERED ADMISSION ARCHITECTURE",
        h1: "Create General, VIP and Custom Ticket Categories",
        canonicalUrl: "https://urpass.space/event-ticket-types-management",
        description: "Configure tiered ticket types (Early Bird, VIP, Student, Group) with individual pricing, capacity limits and access permissions.",
        ctaLabel: "Create Ticket Tiers",
        directAnswer: {
          title: "How Does UrPass Manage Multiple Event Ticket Types?",
          summary: "UrPass enables event directors to create unlimited ticket categories with independent pricing, capacity caps, sale schedules, and gate access permissions. Configure Early Bird discounts, VIP passes, Student tickets requiring ID verification, and Group Passes from a single unified event dashboard.",
          keyPoints: ["Unlimited custom ticket categories (Early Bird, General Admission, VIP, Student, Sponsor)", "Independent capacity quotas preventing overselling in exclusive ticket tiers", "Automated scheduled sales windows with auto-opening and closing dates", "Tier-specific door access rules enforced instantly by gate smartphone scanners"],
        },
        keyFactsTable: {
          title: "Ticket Tier Management Comparison",
          subtitle: "Granular ticket control and door access enforcement.",
          headers: ["Tier Management Capability", "UrPass Ticket Architecture", "Basic Ticketing Forms"],
          rows: [
            {
                        "col1": "Tier Quota Enforcement",
                        "col2": "Strict individual capacity caps per ticket category",
                        "col3": "Global cap only; impossible to limit VIP vs General seats"
            },
            {
                        "col1": "Gate Scanner Feedback",
                        "col2": "Clear color-coded tier badge display on scanner screen",
                        "col3": "Generic validation; door staff cannot distinguish ticket tier"
            },
            {
                        "col1": "Time-Scheduled Tiers",
                        "col2": "Early bird tiers auto-expire; standard tiers auto-open",
                        "col3": "Manual price changes required at midnight"
            },
            {
                        "col1": "Group & Multi-Person Tiers",
                        "col2": "Native group ticket quotas admitting 2, 5, or 10 guests",
                        "col3": "Must purchase multiple individual tickets separately"
            },
            {
                        "col1": "Platform Fees on Tiers",
                        "col2": "0% commission across all free and paid categories",
                        "col3": "Aggregators take higher percentage cuts on VIP tiers"
            }
],
        },
        features: [
          { icon: Layers, title: "Unlimited Ticket Tiers", desc: "Create as many ticket categories as your event requires without arbitrary platform limitations." },
          { icon: Clock, title: "Automated Early Bird Deadlines", desc: "Schedule Early Bird tiers to close automatically at midnight on your selected date, activating standard pricing." },
          { icon: BadgeCheck, title: "VIP & Backstage Permissions", desc: "Gate scanners clearly display 'VIP', 'Speaker', or 'General' badges for instant door clearance." },
          { icon: Users, title: "Student & Concession Passes", desc: "Offer discounted student passes with mandatory college ID upload or student roll number capture." },
          { icon: Lock, title: "Hidden & Private Tiers", desc: "Create hidden sponsor or speaker tiers that only unlock with a specific private link or access code." },
          { icon: QrCode, title: "Bespoke Pass Designs", desc: "Assign custom visual pass layouts and badge colors for VIP vs General Admission attendees." }
        ],
        steps: [
          { n: "01", title: "Add Ticket Categories", desc: "Click 'Add Ticket Tier' to create General Admission, VIP Pass, Early Bird, or Student Pass." },
          { n: "02", title: "Set Prices & Quotas", desc: "Assign individual prices, currency, and strict capacity caps (e.g. 50 VIP, 250 General)." },
          { n: "03", title: "Configure Sale Windows", desc: "Set opening and closing dates for promotional tiers like Early Bird or Flash Sales." },
          { n: "04", title: "Publish Checkout Page", desc: "Attendees view a clear comparison of tier benefits and select their desired ticket." },
          { n: "05", title: "Door Scanners Verify Tiers", desc: "Gate staff see instant color-coded tier confirmation when scanning passes in <0.3s." }
        ],
        callout: {
          badge: "TIERED REVENUE STRATEGY",
          title: "Maximize event profitability with structured tier pricing.",
          description: "Conferences and festivals generate up to 40% more revenue by offering structured Early Bird, VIP, and Group ticket tiers. UrPass gives you full control over ticket rules and quotas.",
          bullets: ["Drive early cash flow with urgency-driven Early Bird pricing deadlines", "Monetize premium experiences with high-value VIP and Backstage tiers", "Ensure gate marshals instantly identify VIP vs General Admission passes", "Keep 100% of your earnings with 0% platform commission on all tiers"],
        },
        faqs: [
          { q: "Can I set a separate quota for VIP tickets without affecting General Admission?", a: "Yes. Each ticket tier has its own independent capacity cap. When VIP sells out, General Admission remains available." },
          { q: "Can Early Bird tickets automatically switch to regular pricing when a deadline passes?", a: "Yes. You can configure automated start and end timestamps so pricing transitions automatically without manual intervention." },
          { q: "Can I create secret or hidden ticket tiers for sponsors and speakers?", a: "Yes. You can generate private ticket links or require specific promo codes to reveal hidden VIP or sponsor tiers." },
          { q: "How does gate staff know which tier an attendee purchased?", a: "The smartphone scanner screen flashes the exact ticket tier name in bold, color-coded text immediately upon scanning." }
        ],
        relatedLinks: [
          { title: "Bulk Event Ticket Booking", href: "/bulk-event-ticket-booking", category: "Product" },
          { title: "Paid Workshop Registration Software", href: "/paid-workshop-registration-software", category: "Product" },
          { title: "Conference Ticketing Software", href: "/conference-ticketing-platform", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" }
        ],
      }}
    />
  );
}
