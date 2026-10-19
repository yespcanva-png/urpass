import type { Metadata } from "next";
import { BarChart3, DoorOpen, Layers, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Gate QR Entry Management | UrPass",
  description: "Coordinate multiple venue entrances, validate QR tickets and monitor attendee movement across gates with UrPass event entry management.",
  keywords: ["multi gate event entry management","manage multiple event entry gates qr scanning","multi entrance event check in","multi door qr ticket scanner","event gate management software","venue access control qr"],
  alternates: {
    canonical: "https://urpass.space/multi-gate-event-entry-management",
  },
  openGraph: {
    title: "Multi-Gate QR Entry Management | UrPass",
    description: "Coordinate multiple venue entrances, validate QR tickets and monitor attendee movement across gates with UrPass event entry management.",
    url: "https://urpass.space/multi-gate-event-entry-management",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Gate QR Entry Management | UrPass",
    description: "Coordinate multiple venue entrances, validate QR tickets and monitor attendee movement across gates with UrPass event entry management.",
  },
};

export default function MultiGateEventEntryManagementPage() {
  return (
    <SEOPage
      config={{
        badge: "MULTI-GATE ENTRY ACCESS",
        h1: "Manage Multiple Event Entry Gates with QR Scanning",
        canonicalUrl: "https://urpass.space/multi-gate-event-entry-management",
        description: "Coordinate multiple venue entrances, validate QR tickets and monitor attendee movement across gates with UrPass event entry management.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=multi-gate-event-entry-management",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Synchronize Unlimited Venue Entrances in Real Time",
        ctaDescription: "Eliminate gate confusion and ticket sharing across multiple doors. Deploy smartphone scanners with atomic row locking.",
        directAnswer: {
        "title": "What is Multi-Gate Event Entry Management?",
        "summary": "Multi-gate event entry management coordinates check-in operations across multiple venue entrances simultaneously. Using database-level atomic row locks, any ticket scanned at Gate A is immediately invalidated at Gate B in milliseconds, preventing duplicate entry and credential sharing across busy venue access points.",
        "keyPoints": [
                "Real-time synchronization across unlimited venue gates and volunteer scanners",
                "Atomic database row locking prevents pass reuse across multiple doors in <150ms",
                "Gate-specific analytics to monitor entrance traffic, bottlenecks, and staff throughput",
                "Role-based scanner authorization with zero access to organizer billing data"
        ]
},
        whatIs: {
        "title": "How UrPass Manages Multiple Event Gates",
        "definition": "UrPass multi-gate entry management provides centralized venue access control without complex networking hardware. Organizers create distinct entrance zones (such as Main Entrance, VIP Gate, North Hall, and Exhibitor Door), assign volunteer scanners to each gate, and monitor real-time arrival counts on a central dashboard.",
        "details": [
                "Eliminates duplicate admissions when attendees forward pass screenshots to friends at other gates",
                "Tracks throughput per gate to help organizers reallocate door staff during peak arrival surges",
                "Supports gate-restricted ticket tiers (e.g., VIP passes admitted only at VIP Lounge Gate)",
                "Operates over cellular data (4G/5G) or venue Wi-Fi with automatic offline recovery"
        ]
},
        keyFactsTable: {
        "title": "UrPass Multi-Gate Cloud Sync vs Traditional Offline Handhelds",
        "subtitle": "Why disconnected scanners fail at multi-entrance venues.",
        "headers": [
                "Access Control Dimension",
                "Disconnected Handheld Scanners",
                "UrPass Multi-Gate Cloud Engine"
        ],
        "rows": [
                {
                        "col1": "Multi-Gate Fraud Risk",
                        "col2": "High; screenshot shared between gates succeeds until offline batch sync",
                        "col3": "Zero; atomic row locks invalidate tickets globally in <150ms"
                },
                {
                        "col1": "Gate Staff Rebalancing",
                        "col2": "Blind; organizers have no live visibility into which gate is congested",
                        "col3": "Real-time gate telemetry reveals arrival surges and wait times"
                },
                {
                        "col1": "Zone-Based Access Rules",
                        "col2": "Difficult to configure; requires manual barcode filter rules",
                        "col3": "One-click ticket tier gate routing (VIP, General, Media, Crew)"
                },
                {
                        "col1": "Equipment Logistics",
                        "col2": "Heavy logistics managing cables, docks, and radio transmitters",
                        "col3": "Zero hardware; volunteers scan with their personal smartphones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CONCURRENCY ARCHITECTURE",
                "title": "Sub-150ms Atomic Row Locking Blocks Cross-Gate Fraud",
                "paragraphs": [
                        "The primary vulnerability of multi-door venues is the screenshot attack: Attendee A enters through the South Gate and immediately sends a screenshot of their QR code to Attendee B waiting at the North Gate. With legacy barcode scanners that rely on periodic batch syncing, both attendees gain entry undetected.",
                        "UrPass eliminates this vulnerability using database-level atomic row transactions (`SELECT FOR UPDATE`). The instant a ticket is scanned at the South Gate, the record is locked and marked admitted. If that same QR code is scanned at the North Gate even 200 milliseconds later, the scanner flashes an amber duplicate alert displaying the exact entry time, scanner name, and gate location of the initial check-in."
                ],
                "bullets": [
                        "Atomic row locking prevents race condition admissions across multiple doors",
                        "Amber duplicate alert shows first-scan timestamp, gate name, and volunteer ID",
                        "Audible warning chime alerts security personnel to unauthorized reuse attempts",
                        "Complete tamper-proof digital audit log of every scan attempt"
                ],
                "takeaway": "Real-time atomic locking guarantees that each ticket admits exactly one attendee, regardless of how many gates are open."
        },
        {
                "badge": "TRAFFIC BALANCING",
                "title": "Live Gate Telemetry Prevents Bottlenecks and Surges",
                "paragraphs": [
                        "At major venues, attendees naturally gravitate toward the closest entrance, creating a massive queue at Gate 1 while Gates 2 and 3 remain virtually empty. Without live gate analytics, organizers cannot detect this imbalance until frustrated attendees start complaining on social media.",
                        "UrPass provides a live multi-gate command dashboard showing real-time scan velocity, cumulative arrivals, and remaining expected attendees per entrance. Organizers can immediately direct queue marshals to redirect attendees to underutilized gates and reassign volunteer scanners where traffic is heaviest."
                ],
                "bullets": [
                        "Live scan velocity tracker displays scans-per-minute for each entrance",
                        "Cumulative arrival counters show gate occupancy and total venue capacity",
                        "Volunteer performance telemetry identifies slow scanner lanes that need assistance",
                        "Exportable post-event ingress curve graphs for future venue planning"
                ],
                "takeaway": "Real-time gate telemetry gives organizers full operational control over venue crowd dynamics."
        }
],
        featuresTitle: "Core Capabilities Built for Event Organizers",
        featuresSubtitle: "Engineered for speed, reliability, and zero ticketing commission.",
        features: [
          {
            icon: DoorOpen,
            title: "Unlimited Entrance Gates",
            desc: "Configure Main, VIP, Backstage, and Exhibitor gates with dedicated volunteer teams.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Row-Level Locking",
            desc: "Invalidate tickets across all gates within 150ms to eliminate cross-door screenshot sharing.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Scanning",
            desc: "Volunteers scan attendee passes using smartphone browsers with zero app installation.",
          },
          {
            icon: Layers,
            title: "Zone Access Permissions",
            desc: "Restrict specific ticket tiers (VIP, Media, Crew) to authorized entrance gates.",
          },
          {
            icon: BarChart3,
            title: "Live Multi-Gate Telemetry",
            desc: "Monitor ingress velocity and door counts across every venue entrance in real time.",
          },
          {
            icon: Users,
            title: "Secure Volunteer Delegation",
            desc: "Authorize gate staff with time-limited scanner links without sharing master account logins.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Define Entrance Gates",
                "desc": "Create your gate zones (e.g., Gate 1, Gate 2, VIP Door) in your UrPass control panel."
        },
        {
                "n": "02",
                "title": "Assign Ticket Tiers",
                "desc": "Set zone rules specifying which ticket tiers are authorized for each gate."
        },
        {
                "n": "03",
                "title": "Authorize Volunteer Phones",
                "desc": "Gate volunteers scan a setup QR code to activate their smartphone camera scanner."
        },
        {
                "n": "04",
                "title": "Scan Attendees Simultaneously",
                "desc": "Volunteers at all doors scan incoming digital passes with real-time atomic sync."
        },
        {
                "n": "05",
                "title": "Monitor Ingress Live",
                "desc": "Track crowd arrival flow and rebalance gate staff from your central dashboard."
        }
],
        whoShouldUse: {
        "title": "Who Needs Multi-Gate Entry Management?",
        "subtitle": "Large venues and multi-door events requiring coordinated access control.",
        "personas": [
                {
                        "badge": "CAMPUSES",
                        "title": "College Fests & University Arenas",
                        "desc": "Manage multiple campus gates, auditorium doors, and dining hall entrances with student volunteers."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "Convention Centers & Expo Halls",
                        "desc": "Coordinate delegate, VIP, and exhibitor entrances across massive multi-hall venues."
                },
                {
                        "badge": "STADIUMS",
                        "title": "Sports Tournaments & Concerts",
                        "desc": "Process thousands of ticket holders across dozens of turnstiles with sub-second phone scanning."
                },
                {
                        "badge": "FESTIVALS",
                        "title": "Multi-Stage Outdoor Festivals",
                        "desc": "Control perimeter gates, VIP lounges, and backstage areas with cellular-connected smartphones."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Multi-Gate Scanning Coordinates in Real Time",
        "subtitle": "Cloud-native synchronization engineered for high-concurrency venues.",
        "description": "When an attendee arrives at any entrance, the volunteer points their smartphone camera at the attendee's QR pass. The browser scanner fires an atomic check-in transaction. If valid, the ticket status updates immediately across all other gate scanners. If another attendee tries scanning a screenshot at a different gate, the system instantly alerts the door guard with an amber duplicate warning.",
        "points": [
                "Sub-150 millisecond cross-gate synchronization over standard 4G/5G mobile data.",
                "Audible green chime for valid entry; distinctive amber chime for duplicate scans.",
                "Gate marshals see the exact time and door location of any previous check-in.",
                "Zero expensive hardware terminals; uses staff and volunteer smartphones."
        ]
},
        faqs: [
        {
                "q": "How many gates can I manage simultaneously in UrPass?",
                "a": "You can configure an unlimited number of entrance gates and connect dozens of volunteer smartphone scanners simultaneously. UrPass's cloud infrastructure scales effortlessly to handle massive concurrent check-in volume."
        },
        {
                "q": "What prevents an attendee from sharing a ticket screenshot with a friend at another gate?",
                "a": "UrPass uses database-level atomic row locking. The moment a ticket is scanned at Gate 1, it is marked admitted in our central database. If that same QR code is scanned at Gate 2, the scanner immediately displays an amber duplicate warning showing the exact time and gate of the first check-in."
        },
        {
                "q": "Do volunteer scanners need to be connected to the internet?",
                "a": "To ensure real-time cross-gate duplicate prevention, scanners need active internet connectivity (cellular 4G/5G or venue Wi-Fi). If connectivity temporarily drops, the scanner continues offline verification and synchronizes its check-in queue once connectivity is restored."
        },
        {
                "q": "Can I restrict certain ticket tiers to specific gates?",
                "a": "Yes. You can assign gate access rules, such as allowing VIP passes only at the VIP Entrance, or restricting general admission attendees to Main Gates 1 and 2."
        },
        {
                "q": "How do I set up volunteer smartphones as gate scanners?",
                "a": "Organizers generate a secure scanner link or QR code from the UrPass dashboard. Gate volunteers simply scan this code with their personal phone cameras to launch the scanner in Safari or Chrome, requiring zero app downloads or account logins."
        }
],
      }}
    />
  );
}
