import type { Metadata } from "next";
import { BarChart3, CalendarCheck, ClipboardList, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Organizer Software | UrPass",
  description:
    "Manage guest applications, tickets and arrivals without juggling separate tools. Start organizing with UrPass.",
  keywords: [
    "event organizer software",
    "software for event organizers",
    "event operations software",
    "event registration and check-in",
    "event guest management",
  ],
  alternates: { canonical: "https://urpass.space/event-organizer-software" },
  openGraph: {
    title: "Event Organizer Software | UrPass",
    description:
      "Manage guest applications, tickets and arrivals without juggling separate tools. Start organizing with UrPass.",
    url: "https://urpass.space/event-organizer-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventOrganizerSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "FOR EVENT ORGANIZERS",
        h1: "Event Organizer Software for Tickets and Guests",
        canonicalUrl: "https://urpass.space/event-organizer-software",
        description:
          "UrPass helps event organizers create registrations, manage attendees, issue QR passes and run fast venue check-in without stitching together forms, spreadsheets and scanner apps.",
        ctaLabel: "Start Organizing",
        ctaHref: "/signup",
        secondaryCtaLabel: "Talk to Us",
        secondaryCtaHref: "/contact",
        directAnswer: {
          title: "What software do event organizers need?",
          summary:
            "Event organizers need a system to publish registration, collect attendee details, manage payments or approvals, issue credentials and verify entry at the venue. UrPass combines the registration-to-entry workflow in one organizer dashboard, making it easier to run college events, workshops, conferences, summits and paid ticketed events.",
          keyPoints: [
            "Create event pages and registration forms",
            "Manage attendee applications, ticket categories and approvals",
            "Issue secure digital QR passes",
            "Scan attendees and track attendance in real time",
          ],
        },
        features: [
          { icon: CalendarCheck, title: "Event Setup", desc: "Configure event details, capacity, registration rules and ticket options." },
          { icon: ClipboardList, title: "Attendee Applications", desc: "Collect attendee details and organize responses in one dashboard." },
          { icon: Users, title: "Guest Management", desc: "Search, filter, approve and export attendee records without manual spreadsheets." },
          { icon: QrCode, title: "Digital Passes", desc: "Give every valid attendee a scannable QR credential for event access." },
          { icon: ScanLine, title: "Venue Check-In", desc: "Use phone-based scanning to admit attendees and prevent duplicate entry." },
          { icon: BarChart3, title: "Operational Reporting", desc: "Review check-in totals, arrival activity and attendance data after the event." },
        ],
        steps: [
          { n: "01", title: "Create event", desc: "Set up your event page and registration workflow." },
          { n: "02", title: "Invite attendees", desc: "Share the registration link through your promotion channels." },
          { n: "03", title: "Manage guests", desc: "Approve, update and export attendee records from the organizer dashboard." },
          { n: "04", title: "Run entry", desc: "Scan QR passes at the venue with staff phones." },
          { n: "05", title: "Close the loop", desc: "Use attendance data for reporting, certificates or future campaigns." },
        ],
        relatedLinks: [
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Event Registration Software", href: "/event-registration-software", category: "Product" },
          { title: "Event Attendee Management Software", href: "/event-attendee-management-software", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
        ],
        faqs: [
          { q: "Who should use UrPass?", a: "UrPass is built for organizers running registrations, ticketing, attendee credentials and event entry operations." },
          { q: "Can UrPass handle guest approvals?", a: "Yes. Organizers can use approval workflows before issuing valid attendee passes." },
          { q: "Does UrPass support QR check-in?", a: "Yes. Staff can scan attendee QR passes using mobile devices." },
          { q: "Can I export attendee records?", a: "Yes. Organizer dashboards support attendee data exports for operational and reporting needs." },
        ],
        ctaTitle: "Organize registrations, passes and entry together",
        ctaDescription: "Launch your event workflow with UrPass in minutes.",
      }}
    />
  );
}
