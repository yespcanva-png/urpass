import type { Metadata } from "next";
import { BadgeCheck, BarChart3, Calendar, QrCode, Send, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Dealer Meet Registration Software | UrPass",
  description: "Distribute personalized digital passes to distributor networks and dealers with RSVP tracking, multi-session check-in and live counts.",
  keywords: [
    "dealer meet registration software",
    "organize dealer meets with online registration",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/dealer-meet-registration-software" },
  openGraph: {
    title: "Dealer Meet Registration Software | UrPass",
    description: "Distribute personalized digital passes to distributor networks and dealers with RSVP tracking, multi-session check-in and live counts.",
    url: "https://urpass.space/dealer-meet-registration-software",
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
        badge: "DISTRIBUTOR & DEALER CONVENTIONS",
        h1: "Organize Dealer Meets with Online Registration",
        canonicalUrl: "https://urpass.space/dealer-meet-registration-software",
        description: "Distribute personalized digital passes to distributor networks and dealers with RSVP tracking, multi-session check-in and live counts.",
        ctaLabel: "Organize Dealer Meet",
        directAnswer: {
          title: "How Does UrPass Simplify Dealer Meet Registration?",
          summary: "UrPass allows corporate brands and automotive/FMCG manufacturers to import dealer directories, dispatch personalized WhatsApp invites, track RSVP confirmations, and manage multi-session access across keynotes, product demonstrations, and gala award dinners using a single QR pass.",
          keyPoints: ["Bulk CSV import of authorized dealers, distributors, and franchise partners", "Personalized WhatsApp and SMS digital pass distribution with direct QR access", "Multi-session scanning tracking attendance at strategy sessions, lunches, and awards", "Real-time attendance dashboard showing regional dealer arrival status"],
        },
        keyFactsTable: {
          title: "Dealer Meet Management: UrPass vs Manual Lists",
          subtitle: "Efficiency benchmarks for national dealer conventions.",
          headers: ["Convention Need", "UrPass Dealer System", "Manual Guest Registers & Printed Folders"],
          rows: [
            {
                        "col1": "Invite Delivery Method",
                        "col2": "Direct WhatsApp & Email with personal QR pass",
                        "col3": "Couriers and manual phone calls with uncertain RSVPs"
            },
            {
                        "col1": "Banquet & Award Check-In",
                        "col2": "<0.3s phone scan at ballroom entrance",
                        "col3": "Paper search through alphabetical dealer binder lists"
            },
            {
                        "col1": "Gala Gift / Kit Handout",
                        "col2": "Scan QR pass to mark kit claimed (zero double claims)",
                        "col3": "Ticking off paper rosters prone to duplicate gift claims"
            },
            {
                        "col1": "Regional Head Telemetry",
                        "col2": "Live dashboard by territory / sales region",
                        "col3": "Zero visibility until manual count hours later"
            },
            {
                        "col1": "Spouse / Plus-One Support",
                        "col2": "Configurable group quotas linked to one dealer pass",
                        "col3": "Confusion at front desk over unlisted guest entry"
            }
],
        },
        features: [
          { icon: Users, title: "Distributor Network Import", desc: "Import thousands of authorized dealers with territory codes, dealership names, and phone numbers in seconds." },
          { icon: Send, title: "WhatsApp Pass Dispatch", desc: "Send branded event invitations and dynamic QR passes directly to dealer WhatsApp numbers." },
          { icon: Calendar, title: "Multi-Session Access", desc: "Track dealer attendance across daytime business presentations, executive roundtables, and evening galas." },
          { icon: BadgeCheck, title: "Gift & Welcome Kit Validation", desc: "Scan dealer passes to track gift kit distribution, ensuring each dealership receives exactly one allotment." },
          { icon: BarChart3, title: "Zone & Region Analytics", desc: "Monitor check-in velocity filtered by North, South, East, and West sales zones in real time." },
          { icon: QrCode, title: "Group Quota Tickets", desc: "Issue passes allowing the dealer plus their spouse or general manager to scan in together or separately." }
        ],
        steps: [
          { n: "01", title: "Upload Dealer Directory", desc: "Upload your dealer master list with dealership names, contact numbers, and region codes." },
          { n: "02", title: "Dispatch WhatsApp Passes", desc: "Send personalized event passes with venue directions and dynamic QR access codes." },
          { n: "03", title: "Track RSVP Confirmations", desc: "View confirmed, pending, and declined RSVPs in real time on your organizer screen." },
          { n: "04", title: "Scan at Convention Hall", desc: "Door staff scan passes on arrival for sub-second badge verification and welcome." },
          { n: "05", title: "Manage Sessions & Kits", desc: "Re-scan passes at lunch, strategy breakout rooms, and the gala dinner door." }
        ],
        callout: {
          badge: "ZERO EMBARRASSMENT",
          title: "Welcome your top revenue partners with the VIP experience they deserve.",
          description: "Dealers who generate millions in revenue should never wait in a crowded lobby while staff flip through printed Excel sheets. Give your partners a seamless, prestigious digital check-in.",
          bullets: ["Deliver prestigious digital passes directly to their personal WhatsApp", "Instant check-in in under 0.3 seconds with personalized screen greeting", "Prevent duplicate claims on expensive gift kits and merchandise", "Real-time visibility for executive management on regional dealer presence"],
        },
        faqs: [
          { q: "Can we send event passes directly via WhatsApp in bulk?", a: "Yes! UrPass features built-in WhatsApp Cloud API integration to send personalized digital passes and QR codes directly to dealer phone numbers." },
          { q: "Can a dealer bring their spouse or partner on the same pass?", a: "Yes. UrPass supports group quotas where a single pass can admit 2, 3, or more people, decrementing entries as they enter." },
          { q: "Can we track who attended the strategy session vs who only came for dinner?", a: "Yes. UrPass supports session-wise attendance tracking so you can scan passes at individual conference rooms and evening banquets." },
          { q: "Can we export dealer attendance records by sales territory?", a: "Yes. All attendance records retain custom metadata (such as dealer code, territory, and tier) and can be exported with a single click." }
        ],
        relatedLinks: [
          { title: "WhatsApp Event Tickets", href: "/whatsapp-event-tickets", category: "Product" },
          { title: "Group QR Ticket Check-In", href: "/group-qr-ticket-check-in", category: "Product" },
          { title: "Session-Wise Attendance Tracking", href: "/session-wise-attendance-tracking", category: "Product" },
          { title: "Bulk Attendee CSV Import", href: "/event-attendee-csv-import", category: "Product" }
        ],
      }}
    />
  );
}
