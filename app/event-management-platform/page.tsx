import type { Metadata } from "next";
import { BarChart3, CalendarDays, ClipboardList, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Management Platform for Organizers | UrPass",
  description:
    "Run registrations, tickets, passes and attendee entry from one workspace. Discover a simpler event management workflow.",
  keywords: [
    "event management platform",
    "event registration platform",
    "event ticketing platform",
    "event check-in platform",
    "event organizer software",
  ],
  alternates: { canonical: "https://urpass.space/event-management-platform" },
  openGraph: {
    title: "Event Management Platform for Organizers | UrPass",
    description:
      "Run registrations, tickets, passes and attendee entry from one workspace. Discover a simpler event management workflow.",
    url: "https://urpass.space/event-management-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventManagementPlatformPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT MANAGEMENT PLATFORM",
        h1: "One Platform to Manage Registrations, Tickets and Entry",
        canonicalUrl: "https://urpass.space/event-management-platform",
        description:
          "UrPass gives organizers one practical workspace for event setup, registrations, ticketing, QR passes, attendee operations and live entrance visibility.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        directAnswer: {
          title: "What does an event management platform do?",
          summary:
            "An event management platform brings the organizer workflow into one system: publish an event page, collect registrations, manage ticket types, issue attendee passes, scan entry credentials and review attendance data. UrPass focuses on the registration-to-entry workflow for colleges, conferences, workshops, summits and community events.",
          keyPoints: [
            "Hosted event pages and registration forms",
            "Ticket categories, attendee records and digital QR passes",
            "Browser-based QR scanning for venue entry",
            "Live dashboards for operations and post-event reporting",
          ],
        },
        features: [
          { icon: CalendarDays, title: "Event Setup", desc: "Create event pages with key details, ticket options, registration questions and capacity rules." },
          { icon: ClipboardList, title: "Registration Workflows", desc: "Collect applications, approve attendees and keep records organized without spreadsheet chaos." },
          { icon: QrCode, title: "Digital Pass Issuance", desc: "Generate mobile-ready QR passes that connect each attendee to a secure entry credential." },
          { icon: ScanLine, title: "QR Entry Operations", desc: "Verify passes at the venue, flag duplicates and keep entrances moving." },
          { icon: Users, title: "Attendee Management", desc: "Search, filter, export and update attendee records from one central dashboard." },
          { icon: BarChart3, title: "Live Attendance Visibility", desc: "Track arrivals, check-in totals and operational activity as your event runs." },
        ],
        steps: [
          { n: "01", title: "Build the event", desc: "Add event details, registration questions, ticket types and branding." },
          { n: "02", title: "Collect registrations", desc: "Share the public page and capture attendee details in real time." },
          { n: "03", title: "Issue passes", desc: "Approve attendees or ticket buyers and send digital QR passes." },
          { n: "04", title: "Manage entry", desc: "Scan passes at one or multiple entrances with mobile devices." },
          { n: "05", title: "Report outcomes", desc: "Review attendance, no-shows and check-in records after the event." },
        ],
        relatedLinks: [
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Event Registration Software", href: "/event-registration-software", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "All-in-One Event Platform", href: "/all-in-one-event-platform", category: "Product" },
        ],
        faqs: [
          { q: "Is UrPass a full event management platform?", a: "UrPass focuses on the core organizer workflow: event registration, ticketing, digital passes, attendee management, QR check-in and attendance reporting." },
          { q: "Can I use UrPass for both free and paid events?", a: "Yes. UrPass supports free registration workflows and paid event ticketing workflows." },
          { q: "Can multiple staff members scan at the same event?", a: "Yes. Staff can scan from different devices while check-in status updates across the event." },
          { q: "Does UrPass replace spreadsheets?", a: "For registration, attendee records and check-in tracking, UrPass centralizes the data so organizers do not need manual spreadsheet reconciliation." },
        ],
        ctaTitle: "Run the complete registration-to-entry workflow",
        ctaDescription: "Create your event, issue passes and manage the entrance with one connected platform.",
      }}
    />
  );
}
