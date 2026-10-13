import type { Metadata } from "next";
import { BarChart3, CreditCard, Globe, QrCode, ScanLine, Ticket } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Ticketing Software | UrPass",
  description:
    "Create paid tickets, manage ticket categories and track registrations in one dashboard. Explore UrPass for your next event.",
  keywords: [
    "online event ticketing software",
    "event ticketing software",
    "sell event tickets online",
    "event ticket categories",
    "QR ticket check-in",
  ],
  alternates: { canonical: "https://urpass.space/online-event-ticketing-software" },
  openGraph: {
    title: "Online Event Ticketing Software | UrPass",
    description:
      "Create paid tickets, manage ticket categories and track registrations in one dashboard. Explore UrPass for your next event.",
    url: "https://urpass.space/online-event-ticketing-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function OnlineEventTicketingSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "ONLINE EVENT TICKETING",
        h1: "Online Event Ticketing Software for Paid Events",
        canonicalUrl: "https://urpass.space/online-event-ticketing-software",
        description:
          "Create paid tickets, manage ticket categories, accept online payments, issue digital QR passes and track registrations from one UrPass dashboard.",
        ctaLabel: "Create Ticketed Event",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is online event ticketing software?",
          summary:
            "Online event ticketing software helps organizers create paid ticket types, collect attendee payments, issue digital admission passes and validate those passes at the venue. UrPass connects ticket sales with QR pass delivery, attendee records and live check-in so event teams do not need separate tools for checkout, passes and entry.",
          keyPoints: [
            "Create Early Bird, General, VIP and custom ticket categories",
            "Issue digital QR passes automatically after registration or payment",
            "Track registrations, ticket inventory and attendance in one dashboard",
            "Scan tickets at the door using standard phone cameras",
          ],
        },
        features: [
          { icon: Ticket, title: "Ticket Categories", desc: "Create paid or free ticket categories with names, prices, capacity limits and attendee information fields." },
          { icon: CreditCard, title: "Payment-Ready Checkout", desc: "Route attendees through a mobile-friendly checkout flow and keep registration records organized after purchase." },
          { icon: QrCode, title: "Digital QR Passes", desc: "Generate scannable passes for every valid attendee so online sales connect directly to venue access." },
          { icon: ScanLine, title: "Fast Door Scanning", desc: "Use the UrPass scanner to validate tickets, flag duplicates and monitor admissions in real time." },
          { icon: Globe, title: "Hosted Event Page", desc: "Share one public event link across email, WhatsApp, social posts and partner websites." },
          { icon: BarChart3, title: "Live Ticket Reports", desc: "See registration pace, attendance status and attendee data without spreadsheet reconciliation." },
        ],
        steps: [
          { n: "01", title: "Create ticket types", desc: "Set names, prices, quantities and registration fields for each ticket category." },
          { n: "02", title: "Publish the event link", desc: "Share your hosted UrPass registration page with attendees." },
          { n: "03", title: "Issue digital passes", desc: "Send attendees their QR passes after registration or approval." },
          { n: "04", title: "Scan at entry", desc: "Validate every ticket at the gate with phone-based QR scanning." },
          { n: "05", title: "Review attendance", desc: "Export attendee and check-in data after the event." },
        ],
        relatedLinks: [
          { title: "Online Event Ticketing", href: "/online-event-ticketing", category: "Product" },
          { title: "Event Ticket Booking System", href: "/event-ticket-booking-system", category: "Product" },
          { title: "Paid Event Registration Software", href: "/paid-event-registration-software", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
        ],
        faqs: [
          { q: "Can UrPass manage multiple ticket categories?", a: "Yes. Organizers can create ticket categories for different access levels, pricing tiers, capacities and attendee requirements." },
          { q: "Do attendees receive QR tickets automatically?", a: "Yes. UrPass generates digital QR passes for valid attendees so they can be scanned at the venue entrance." },
          { q: "Can ticket sales and check-in be tracked together?", a: "Yes. Registration data, ticket details and live check-in status stay connected inside the event dashboard." },
          { q: "Do gate staff need a separate scanner app?", a: "No. UrPass scanning works in a mobile browser using the device camera." },
        ],
        ctaTitle: "Start selling and scanning tickets with UrPass",
        ctaDescription: "Create your event, share your registration link and manage entry from one dashboard.",
      }}
    />
  );
}
