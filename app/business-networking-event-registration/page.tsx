import type { Metadata } from "next";
import { Briefcase, CreditCard, FileSpreadsheet, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Networking Event Registration Software | UrPass",
  description: "Simplify registration, badge generation, and attendee check-in for business meetups, breakfast roundtables and networking mixers.",
  keywords: [
    "business networking event registration",
    "register and welcome business networking guests",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/business-networking-event-registration" },
  openGraph: {
    title: "Networking Event Registration Software | UrPass",
    description: "Simplify registration, badge generation, and attendee check-in for business meetups, breakfast roundtables and networking mixers.",
    url: "https://urpass.space/business-networking-event-registration",
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
        badge: "BUSINESS MIXERS & ROUNDTABLES",
        h1: "Register and Welcome Business Networking Guests",
        canonicalUrl: "https://urpass.space/business-networking-event-registration",
        description: "Simplify registration, badge generation, and attendee check-in for business meetups, breakfast roundtables and networking mixers.",
        ctaLabel: "Create Networking Event",
        directAnswer: {
          title: "How Does UrPass Handle Business Networking Event Registration?",
          summary: "UrPass makes organizing business networking breakfasts, chamber of commerce mixers, and executive roundtables seamless. Attendees register quickly, capture job titles and LinkedIn profiles, receive digital passes, and check in in <0.3s so guests spend their time networking rather than waiting in lines.",
          keyPoints: ["Fast, mobile-friendly registration collecting company, designation, and LinkedIn profile", "Automated digital passes and instant printable attendee name badges", "Sub-300ms phone camera scanning at the venue door to eliminate check-in bottlenecks", "Exportable attendee directory for post-event delegate follow-ups"],
        },
        keyFactsTable: {
          title: "Networking Event Management Comparison",
          subtitle: "Facilitating high-value B2B connections without administrative friction.",
          headers: ["Networking Operational Need", "UrPass Digital System", "Manual Paper Rosters & Name Tags"],
          rows: [
            {
                        "col1": "Lobby Arrival Flow",
                        "col2": "<0.3s phone scan directly into networking floor",
                        "col3": "10-minute wait while host searches through pre-printed tags"
            },
            {
                        "col1": "Walk-In Registrations",
                        "col2": "Instant self-serve QR registration on mobile in 45s",
                        "col3": "Manual handwriting on blank tags slowing everyone down"
            },
            {
                        "col1": "Attendee Contact Capture",
                        "col2": "Structured LinkedIn, company, and email records",
                        "col3": "Illegible handwritten business cards or sign-in sheets"
            },
            {
                        "col1": "Post-Event Networking List",
                        "col2": "One-click export of verified attendees for follow-up",
                        "col3": "Days spent transcribing paper sign-in sheets into Excel"
            },
            {
                        "col1": "Platform Ticketing Fee",
                        "col2": "0% per-ticket platform commission",
                        "col3": "5% to 8% aggregator tax on paid breakfast tickets"
            }
],
        },
        features: [
          { icon: Briefcase, title: "B2B Profile Collection", desc: "Capture company name, industry vertical, LinkedIn profile URL, and job title during registration." },
          { icon: QrCode, title: "Instant Mobile Pass", desc: "Registrants receive clean digital passes on WhatsApp and email, ready for quick entrance." },
          { icon: ScanLine, title: "Sub-0.3s Door Check-In", desc: "Scan passes on any smartphone or tablet to welcome delegates without hallway congestion." },
          { icon: Users, title: "Live Attendee Headcount", desc: "Track attendance percentage and observe when key industry sponsors and speakers arrive." },
          { icon: CreditCard, title: "Paid Networking Tickets", desc: "Collect breakfast and luncheon seat fees via instant UPI and cards with 0% platform commission." },
          { icon: FileSpreadsheet, title: "Post-Event Follow-Up Export", desc: "Export verified attendee records with full profile metadata for seamless follow-up communications." }
        ],
        steps: [
          { n: "01", title: "Create Networking Page", desc: "Set date, breakfast venue, attendee seat limit, and ticket pricing (or free RSVP)." },
          { n: "02", title: "Share Registration Link", desc: "Distribute your registration link across LinkedIn, email newsletters, and WhatsApp groups." },
          { n: "03", title: "Collect Professional Profiles", desc: "Attendees register their job titles, company names, and contact credentials in under a minute." },
          { n: "04", title: "Rapid Door Check-In", desc: "Host scans passes with their phone at the entrance; guests step immediately into conversations." },
          { n: "05", title: "Share Follow-Up Roster", desc: "Export checked-in attendees to send post-event connection notes and presentation decks." }
        ],
        callout: {
          badge: "FRICTIONLESS CONNECTIONS",
          title: "Attendees come to build relationships, not wait in hotel hallway lines.",
          description: "Nothing dampens enthusiasm at a breakfast mixer like waiting 15 minutes at a cramped registration table. UrPass ensures guests walk through the door and straight into conversations.",
          bullets: ["Under 0.3s check-in ensures smooth flow into the networking room", "Capture accurate, verified company titles and LinkedIn profiles", "Collect ticket fees directly into your bank account with 0% platform cuts", "Instant post-event data export for community building and follow-ups"],
        },
        faqs: [
          { q: "Can attendees register on their phone if they show up at the door as walk-ins?", a: "Yes! You can display a QR code at the entrance. Walk-ins scan it, register and pay in 45 seconds, and receive an instant scannable pass." },
          { q: "Can we charge for breakfast or lunch tickets?", a: "Yes. UrPass connects directly with Razorpay or Stripe to accept UPI, credit cards, and debit cards with 0% platform commission." },
          { q: "Can we share the attendee list with participants after the event?", a: "Yes. Organizers can export attendee names, companies, and LinkedIn profiles to share networking rosters with consent." },
          { q: "Does the organizer need to buy ticket scanning hardware?", a: "No. Any volunteer or committee member can open the scanner link on their smartphone camera with zero downloads." }
        ],
        relatedLinks: [
          { title: "Event Registration with Payment Gateway", href: "/event-registration-with-payment-gateway", category: "Product" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Smartphone QR Ticket Scanner", href: "/smartphone-qr-ticket-scanner", category: "Product" },
          { title: "Corporate Visitor Registration", href: "/corporate-visitor-registration-software", category: "Product" }
        ],
      }}
    />
  );
}
