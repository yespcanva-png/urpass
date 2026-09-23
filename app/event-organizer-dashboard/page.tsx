import type { Metadata } from "next";
import { LayoutDashboard, Users, Ticket, BarChart3, QrCode, ShieldCheck, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Organizer Dashboard Software | URPASS",
  description: "Manage your entire event from one unified dashboard. Configure registration forms, monitor live check-ins, track ticket sales, and export attendee rosters.",
  keywords: [
    "event organizer dashboard software",
    "event organizer dashboard",
    "event management console",
    "organizer command center",
    "event administration dashboard",
    "event software for organizers",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-organizer-dashboard" },
  openGraph: {
    title: "Event Organizer Dashboard Software | URPASS",
    description: "Manage your entire event from one unified dashboard.",
    url: "https://urpass.space/event-organizer-dashboard",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ALL-IN-ONE CONSOLE",
        h1: "Manage Your Entire Event from One Dashboard",
        canonicalUrl: "https://urpass.space/event-organizer-dashboard",
        description:
          "An event organizer dashboard centralizes event setup, custom registration questionnaire builder, ticket tier inventory, live entrance check-in tracking, revenue settlements, and attendee communication into one intuitive console. URPASS gives solo organizers, college committees, and enterprise operations teams complete control from any browser.",
        ctaLabel: "Explore Organizer Dashboard",
        features: [
          { icon: LayoutDashboard, title: "Unified Event Overview", desc: "View key health metrics across all your active, draft, and completed events on a single clean interface." },
          { icon: Users, title: "Live Attendee Management", desc: "Search, filter, approve, check in, or resend passes to any attendee in seconds with zero delay." },
          { icon: Ticket, title: "Multi-Tier Ticket Controls", desc: "Adjust ticket pricing, seat allocations, release schedules, and discount codes on the fly without republishing." },
          { icon: QrCode, title: "Scanner Fleet Deployment", desc: "Generate secure volunteer scanner links for gate staff in one click with zero software downloads or logins needed." },
          { icon: BarChart3, title: "Integrated Revenue & Settlements", desc: "Track gross ticket sales, Razorpay bank payouts, refund requests, and tax invoices in real time." },
          { icon: ShieldCheck, title: "Role-Based Team Permissions", desc: "Assign specific roles (Owner, Admin, Member, Gate Volunteer) to keep sensitive financial and attendee data secure." },
        ],
        steps: [
          { n: "01", title: "Create Your Event", desc: "Set event name, dates, location, banner visuals, and ticket categories in under 3 minutes." },
          { n: "02", title: "Share Registration Link", desc: "Distribute your fast, responsive registration URL across marketing and communication channels." },
          { n: "03", title: "Monitor Incoming Signups", desc: "Watch attendee records, payments, and application questionnaires arrive in real time." },
          { n: "04", title: "Run Event-Day Operations", desc: "Track multi-door arrivals, check-in velocity, and venue capacity on the live command board." },
          { n: "05", title: "Review Post-Event Reports", desc: "Download complete attendee datasets, survey responses, and financial reconciliation statements." },
        ],
        callout: {
          badge: "OPERATIONAL SIMPLICITY",
          title: "Say goodbye to juggling 6 different disconnected tools.",
          description: "Traditional event management forces organizers to juggle Google Forms for registrations, Razorpay dashboard for payments, Canva for tickets, WhatsApp for volunteer coordination, and paper sheets for door check-in. URPASS replaces this fragmentation with a single, elegant console.",
          bullets: [
            "Zero clunky software installs: fully responsive on mobile, tablet, and desktop",
            "Real-time database sync ensures team members never work with outdated information",
            "Built-in post-event feedback survey engine to capture attendee NPS ratings",
            "Automatic GST-compliant tax invoices and customer receipts generated seamlessly",
          ],
        },
        deepDiveSections: [
          {
            badge: "ARCHITECTURE",
            title: "What makes the URPASS organizer dashboard fast and responsive?",
            paragraphs: [
              "Event operations move quickly. When thousands of attendees are checking in simultaneously, organizers cannot wait 10 seconds for a dashboard page to reload.",
              "URPASS is built on Next.js, modern WebSockets, and low-latency database architecture. Changes made by gate staff on their mobile phones appear on the organizer dashboard within 300 milliseconds, giving you instant command and control without screen refreshes.",
            ],
            takeaway: "Sub-second real-time responsiveness ensures you make operational decisions with accurate, live data.",
          },
          {
            badge: "COLLABORATION",
            title: "How do team members and volunteers collaborate inside the dashboard?",
            paragraphs: [
              "Organizers can invite committee members, registration staff, and coordinators to their organization account. Team members can be granted administrative rights to edit events, while temporary volunteers can be provided with secure, restricted scanner links that only allow scanning passes without exposing attendee email lists or financial data.",
            ],
            takeaway: "Granular access controls allow large teams to collaborate without compromising privacy or security.",
          },
        ],
        faqs: [
          {
            q: "Can I manage multiple different events from the same organizer account?",
            a: "Yes. The dashboard supports managing unlimited concurrent events across multiple organizations and workspaces.",
          },
          {
            q: "Does the organizer dashboard work properly on mobile phones?",
            a: "Yes. The URPASS dashboard is fully responsive and optimized for mobile browsers, allowing you to manage events from anywhere on the venue floor.",
          },
          {
            q: "Can I export all event data directly from the dashboard?",
            a: "Yes. You can export attendee rosters, check-in logs, and financial settlement statements to CSV and PDF with 1 click.",
          },
        ],
        relatedLinks: [
          { title: "Live Event Check-in Dashboard", href: "/event-check-in-dashboard", category: "Product" },
          { title: "Event Registration Analytics", href: "/event-registration-analytics", category: "Product" },
          { title: "Event Team Management", href: "/event-team-management", category: "Product" },
          { title: "Multi-Event Management", href: "/multi-event-management", category: "Product" },
        ],
      }}
    />
  );
}
