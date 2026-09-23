import type { Metadata } from "next";
import { CalendarRange, Layers, BarChart3, Users, ShieldCheck, ArrowRight, CheckCircle2, RefreshCw, FolderGit2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Event Management Software | URPASS",
  description: "Manage multiple events simultaneously from one unified platform. Centralize registration forms, ticket inventory, team roles, and cross-event analytics.",
  keywords: [
    "multi event management software",
    "manage multiple events",
    "multi event platform",
    "event portfolio software",
    "event series management",
    "annual conference management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/multi-event-management" },
  openGraph: {
    title: "Multi-Event Management Software | URPASS",
    description: "Manage multiple events simultaneously from one unified platform.",
    url: "https://urpass.space/multi-event-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PORTFOLIO MANAGEMENT",
        h1: "Manage Multiple Events from One Platform",
        canonicalUrl: "https://urpass.space/multi-event-management",
        description:
          "Multi-event management software allows event agencies, university councils, and enterprise teams to administer dozens of concurrent events, multi-city roadshows, shared attendee databases, and decentralized volunteer teams from a single master dashboard. URPASS provides global analytics, reusable templates, and centralized billing across your entire event portfolio.",
        ctaLabel: "Manage Event Series",
        features: [
          { icon: CalendarRange, title: "Centralized Event Hub", desc: "Supervise active, scheduled, and past events in one portfolio view with real-time status and ticket telemetry." },
          { icon: FolderGit2, title: "Reusable Event Templates", desc: "Clone previous successful registration forms, pass designs, and ticket tiers in one click to launch new dates in minutes." },
          { icon: Users, title: "Cross-Event Attendee Profiles", desc: "Recognize repeat attendees across events, track multi-session loyalty, and build unified customer profiles." },
          { icon: BarChart3, title: "Portfolio-Wide Rollup Analytics", desc: "Compare registration curves, check-in percentages, and total revenue across multiple cities or campus chapters." },
          { icon: Layers, title: "Multi-Organization Workspaces", desc: "Switch seamlessly between separate brand entities, university departments, or client workspaces under one login." },
          { icon: ShieldCheck, title: "Centralized Financial Invoicing", desc: "Consolidate subscription billing, payouts, and automated GST tax invoices across your entire portfolio." },
        ],
        steps: [
          { n: "01", title: "Create Organization Workspace", desc: "Establish your central agency or corporate account and configure global branding assets." },
          { n: "02", title: "Launch Multiple Events", desc: "Create multiple city stops, multi-track summits, or annual festival editions from templates." },
          { n: "03", title: "Delegate Regional Teams", desc: "Assign specific city leads or club coordinators to manage designated events independently." },
          { n: "04", title: "Track Portfolio Progress", desc: "Monitor registrations and gate admissions across all events live on your central executive dashboard." },
          { n: "05", title: "Unified Post-Event Insights", desc: "Aggregate total attendee reach, revenue figures, and feedback scores for stakeholders." },
        ],
        callout: {
          badge: "AGENCY & CAMPUS EFFICIENCY",
          title: "Stop creating 10 different accounts on 10 different platforms.",
          description: "Managing recurring meetups, college cultural fests, or multi-city roadshows with separate accounts leads to scattered attendee lists, duplicate billing, and lost revenue metrics. URPASS unifies your entire calendar under one high-performance dashboard.",
          bullets: [
            "Switch between different client or club events with zero login friction",
            "Clone event settings, custom questions, and pass styling in under 60 seconds",
            "Consolidated attendee search across all past and upcoming event rosters",
            "Predictable, flat monthly pricing that scales across your entire event series",
          ],
        },
        deepDiveSections: [
          {
            badge: "SCALING ROADSHOWS",
            title: "How does URPASS streamline multi-city event roadshows and tours?",
            paragraphs: [
              "When organizing a multi-city technology tour (e.g. Bangalore, Mumbai, Delhi, Hyderabad), setting up distinct registration forms from scratch for each city creates massive operational overhead.",
              "With URPASS, you create a master event template with your standardized registration questionnaire and custom branded pass design. You then clone the event for each tour stop, simply updating the venue and local date. All attendee registrations flow into a unified database, making cross-city comparisons seamless.",
            ],
            takeaway: "Template cloning reduces multi-city event launch times from days to minutes.",
          },
          {
            badge: "CROSS-EVENT RETENTION",
            title: "How do cross-event insights improve attendee retention and ticket sales?",
            paragraphs: [
              "Understanding which attendees regularly participate across your recurring workshops or monthly developer meetups enables targeted VIP loyalty programs and early-bird promotions.",
              "URPASS aggregates attendee engagement across events, letting you export high-intent alumni lists to announce ticket sales before public drops.",
            ],
            takeaway: "Cross-event attendee intelligence transforms one-off participants into long-term community members.",
          },
        ],
        faqs: [
          {
            q: "Is there a limit on how many events I can run simultaneously on URPASS?",
            a: "Starter plans support up to 10 events/month, while Pro and Business plans include unlimited concurrent events.",
          },
          {
            q: "Can team members only see the events they are assigned to?",
            a: "Yes. Role-based permissions allow you to restrict coordinators and volunteers to specific event views.",
          },
          {
            q: "Can attendees register for multiple events in a series with one profile?",
            a: "Yes. Attendees can easily register across multiple dates or workshops without re-entering basic contact information.",
          },
        ],
        relatedLinks: [
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Event Team Management", href: "/event-team-management", category: "Product" },
          { title: "Event Organizer Dashboard", href: "/event-organizer-dashboard", category: "Product" },
          { title: "Multi-Location Event Management", href: "/multi-location-event-management", category: "Product" },
        ],
      }}
    />
  );
}
