import type { Metadata } from "next";
import { BadgeCheck, BarChart3, DoorOpen, FileSpreadsheet, Layers, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Session-Wise Attendance Tracking | UrPass",
  description: "Scan attendee QR passes at breakout rooms, keynote stages and workshops to record precise session attendance and track engagement.",
  keywords: [
    "session wise attendance tracking",
    "track every conference session with a single qr pass",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/session-wise-attendance-tracking" },
  openGraph: {
    title: "Session-Wise Attendance Tracking | UrPass",
    description: "Scan attendee QR passes at breakout rooms, keynote stages and workshops to record precise session attendance and track engagement.",
    url: "https://urpass.space/session-wise-attendance-tracking",
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
        badge: "MULTI-TRACK CONFERENCE OPERATIONS",
        h1: "Track Every Conference Session with a Single QR Pass",
        canonicalUrl: "https://urpass.space/session-wise-attendance-tracking",
        description: "Scan attendee QR passes at breakout rooms, keynote stages and workshops to record precise session attendance and track engagement.",
        ctaLabel: "Track Sessions Free",
        directAnswer: {
          title: "How Does Session-Wise Attendance Tracking Work on UrPass?",
          summary: "UrPass enables conference organizers to track attendance across multiple breakout rooms, keynote stages, and workshop tracks using a single persistent QR pass per attendee. Door marshals select the active session in their mobile browser scanner, recording timestamped attendance per track for CEU/CME credits, room popularity, and sponsor reporting.",
          keyPoints: ["Single QR pass valid across all conference tracks and breakout sessions", "Door hosts switch session scanner modes with 1 click on standard mobile phones", "Timestamped session entry logs for professional accreditation and CEU/CME certificates", "Real-time breakout room capacity monitoring preventing overcrowded workshop rooms"],
        },
        keyFactsTable: {
          title: "Session Tracking Comparison",
          subtitle: "Single-pass multi-track scanning vs separate session tickets.",
          headers: ["Session Tracking Capability", "UrPass Unified Session System", "Manual Paper Rosters / Separate Tickets"],
          rows: [
            {
                        "col1": "Attendee Convenience",
                        "col2": "1 single QR pass scanned across all breakout rooms",
                        "col3": "Multiple printed tickets or wristbands per session"
            },
            {
                        "col1": "Accreditation & CEU Audit",
                        "col2": "Exact digital entry timestamp for every session attended",
                        "col3": "Illegible paper signature sheets prone to audit rejection"
            },
            {
                        "col1": "Room Capacity Control",
                        "col2": "Scanners warn door hosts when workshop room reaches capacity",
                        "col3": "Overcrowded rooms with attendees sitting on floors"
            },
            {
                        "col1": "Door Scanner Setup",
                        "col2": "Volunteer selects room from dropdown in mobile browser",
                        "col3": "Expensive fixed barcode scanners bolted to doorframes"
            },
            {
                        "col1": "Session Popularity Analytics",
                        "col2": "Live chart comparing attendance across all parallel tracks",
                        "col3": "Days spent manually tabulating paper sheets post-event"
            }
],
        },
        features: [
          { icon: Layers, title: "Single Pass Multi-Track", desc: "Attendees use their main conference QR badge across unlimited parallel breakout sessions." },
          { icon: DoorOpen, title: "Room Capacity Monitoring", desc: "Enforce maximum seating limits per breakout room to prevent dangerous fire code overcrowding." },
          { icon: BadgeCheck, title: "Continuing Education (CEU/CME)", desc: "Generate verifiable attendance records for accredited medical, legal, and engineering certifications." },
          { icon: Smartphone, title: "1-Click Scanner Room Switching", desc: "Door volunteers switch between 'Keynote A', 'Track 2', and 'Workshop B' in seconds." },
          { icon: BarChart3, title: "Popularity & Drop-Off Analytics", desc: "Compare attendance counts across all tracks to see which speakers and topics resonated most." },
          { icon: FileSpreadsheet, title: "Session Export for Sponsors", desc: "Export verified session attendee lists to demonstrate value to workshop room sponsors." }
        ],
        steps: [
          { n: "01", title: "Configure Conference Tracks", desc: "Add your agenda tracks, room names, and seating capacities in the event schedule builder." },
          { n: "02", title: "Issue Unified Passes", desc: "Attendees receive a single digital QR badge valid for the entire conference." },
          { n: "03", title: "Assign Room Door Marshals", desc: "Volunteers open the scanner URL and select their designated room from the dropdown." },
          { n: "04", title: "Scan at Breakout Doors", desc: "Marshals scan badges as attendees enter each session in under 300ms." },
          { n: "05", title: "Certify Attendance", desc: "Export timestamped session attendance logs for continuing education credits and sponsors." }
        ],
        callout: {
          badge: "ACCREDITATION READY",
          title: "Deliver verifiable, audit-proof attendance for accredited educational conferences.",
          description: "Medical congresses, legal symposiums, and engineering conventions require precise proof of session attendance for professional credits. UrPass delivers tamper-proof digital tracking.",
          bullets: ["Legally defensible digital timestamps proving attendance at specific tracks", "Eliminate paper signature clipboards that circulate clumsily during lectures", "Prevent attendees from crowding into rooms exceeding safety capacities", "Provide workshop sponsors with precise data on who attended their sponsored session"],
        },
        faqs: [
          { q: "Does an attendee need a different QR code for each session?", a: "No! Attendees use their single primary conference pass. When scanned at a session door, UrPass automatically logs attendance for that specific room." },
          { q: "Can we prevent attendees from entering a session if the room is full?", a: "Yes. You can assign room capacity limits. The scanner alerts door marshals when the room's maximum seating capacity has been reached." },
          { q: "Can we export which delegates attended a specific sponsor's workshop?", a: "Yes. You can export verified attendance rosters for each individual session with attendee names, job titles, and companies." },
          { q: "Can volunteers switch rooms on their scanner easily?", a: "Yes. A simple dropdown at the top of the scanner screen lets volunteers switch between rooms or sessions in one tap." }
        ],
        relatedLinks: [
          { title: "Conference Badge Scanning Software", href: "/conference-badge-scanning-software", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Event Entry and Exit Tracking", href: "/event-entry-exit-tracking", category: "Product" }
        ],
      }}
    />
  );
}
