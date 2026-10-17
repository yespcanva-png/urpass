import type { Metadata } from "next";
import { BarChart3, DoorOpen, Lock, Maximize2, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Capacity Management Software | UrPass",
  description: "Enforce strict venue capacity limits with real-time ticket counters, automated waitlists, and instant scan-in gate controls.",
  keywords: [
    "event capacity management software",
    "control event capacity and prevent overbooking",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/event-capacity-management-software" },
  openGraph: {
    title: "Event Capacity Management Software | UrPass",
    description: "Enforce strict venue capacity limits with real-time ticket counters, automated waitlists, and instant scan-in gate controls.",
    url: "https://urpass.space/event-capacity-management-software",
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
        badge: "CAPACITY & OCCUPANCY ENFORCEMENT",
        h1: "Control Event Capacity and Prevent Overbooking",
        canonicalUrl: "https://urpass.space/event-capacity-management-software",
        description: "Enforce strict venue capacity limits with real-time ticket counters, automated waitlists, and instant scan-in gate controls.",
        ctaLabel: "Control Event Capacity",
        directAnswer: {
          title: "How Does UrPass Enforce Event Capacity Management?",
          summary: "UrPass guarantees strict event capacity limits across web registration, CSV imports, and gate entry operations. For events with strict capacity caps (such as a 300-guest maximum limit), the platform automatically shuts down registration the moment the limit is reached and alerts gate staff to prevent unauthorized overbooking.",
          keyPoints: ["Strict global capacity limits (e.g. hard 300-guest cap) locking registration automatically", "Real-time atomic inventory counters preventing race conditions and duplicate allocations", "Live gate admission telemetry tracking checked-in guests against statutory venue limits", "Automated waitlist management to capture excess demand without exceeding capacity"],
        },
        keyFactsTable: {
          title: "Capacity Enforcement: UrPass vs Generic Registration Tools",
          subtitle: "Statutory fire safety and venue occupancy guarantees.",
          headers: ["Capacity Control Feature", "UrPass Capacity Engine", "Generic Forms (Google Forms / Typeform)"],
          rows: [
            {
                        "col1": "Atomic Concurrency Protection",
                        "col2": "Zero overbooking; atomic row locks prevent exceeding limits",
                        "col3": "Simultaneous submissions breach limits causing overbooking"
            },
            {
                        "col1": "Automatic Sold-Out Locking",
                        "col2": "Instantaneous form shutdown the exact millisecond cap is met",
                        "col3": "Requires manual monitoring to close forms after the fact"
            },
            {
                        "col1": "Gate Check-In Limit Enforcement",
                        "col2": "Scanners display live total checked-in vs venue capacity",
                        "col3": "Gate staff unaware of current in-venue headcount"
            },
            {
                        "col1": "Group Ticket Quota Deduction",
                        "col2": "Group tickets decrement exact quota from global capacity",
                        "col3": "Counts group as 1 submission, causing massive crowd overflow"
            },
            {
                        "col1": "Automated Waitlist Activation",
                        "col2": "Seamless waitlist opens automatically when tickets sell out",
                        "col3": "Users simply see an error with lost lead contact data"
            }
],
        },
        features: [
          { icon: Maximize2, title: "Strict Global Capacity Caps", desc: "Set your venue maximum (e.g. exactly 300 attendees); registrations close automatically when reached." },
          { icon: Lock, title: "Atomic Race-Condition Protection", desc: "Database transactions prevent multiple simultaneous shoppers from oversubscribing final tickets." },
          { icon: BarChart3, title: "Live Occupancy Telemetry", desc: "Observe live check-in counts against total capacity on organizer screens and gate scanner devices." },
          { icon: Users, title: "Smart Group Quota Accounting", desc: "When issuing group passes (e.g., 5 entries), the system decrements 5 spots from total capacity." },
          { icon: ShieldCheck, title: "Statutory Fire Safety Compliance", desc: "Generate verified proof of occupancy for venue managers, local fire marshals, and municipal licensing." },
          { icon: DoorOpen, title: "Gate Overcrowding Alerts", desc: "Receive real-time alerts when check-ins reach 90%, 95%, and 100% of permitted room capacity." }
        ],
        steps: [
          { n: "01", title: "Set Venue Capacity Cap", desc: "Input your maximum allowable attendee count (e.g., 300 guests) in event settings." },
          { n: "02", title: "Atomic Seat Booking", desc: "Attendees register or buy tickets; atomic counters decrement capacity in real time." },
          { n: "03", title: "Instant Sold-Out Lock", desc: "The moment the 300th ticket is claimed, registration locks and waitlist opens." },
          { n: "04", title: "Gate Check-In Tracking", desc: "Door staff scan passes; dashboard displays live checked-in percentage." },
          { n: "05", title: "Venue Compliance Report", desc: "Download certified timestamped attendance logs demonstrating compliance with venue safety limits." }
        ],
        callout: {
          badge: "STRICT OCCUPANCY CONTROL",
          title: "Never risk venue shut-downs or fire code violations due to overbooking.",
          description: "Venue managers and municipal fire marshals will shut down an event immediately if physical capacity is breached. UrPass guarantees your registration and gate counts never exceed statutory limits.",
          bullets: ["Guaranteed protection against overbooking with atomic database counters", "Ideal for private corporate celebrations, NGO galas, and licensed venues", "Real-time occupancy tracking visible to security and venue management", "Automated waitlist captures interested guests for subsequent sessions"],
        },
        faqs: [
          { q: "Can I enforce a strict limit of exactly 300 guests for our event?", a: "Yes. UrPass enforces strict global capacity limits. The moment 300 successful passes are issued, the system locks further registrations automatically." },
          { q: "How does the system account for group passes?", a: "If you issue a group pass for 5 guests, UrPass decrements 5 from your remaining global capacity, ensuring total admissions never exceed the limit." },
          { q: "What happens if two people register for the final ticket at the exact same millisecond?", a: "UrPass uses atomic database transactions with row-level locks. The first transaction succeeds and the second is safely informed that the event is sold out." },
          { q: "Can gate staff see how many total guests have entered so far?", a: "Yes! The mobile scanner interface and live organizer dashboard display the real-time checked-in count alongside the maximum venue capacity." }
        ],
        relatedLinks: [
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Group QR Ticket Check-In", href: "/group-qr-ticket-check-in", category: "Product" },
          { title: "Event Entry and Exit Tracking", href: "/event-entry-exit-tracking", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" }
        ],
      }}
    />
  );
}
