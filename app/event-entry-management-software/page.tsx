import type { Metadata } from "next";
import { BarChart3, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Entry Management & QR Access Control | URPASS",
  description: "Event entry management software for crowd flow, multi-gate access control, VIP tier validation, and sub-second QR phone scanning. Prevent foyer bottlenecks.",
  keywords: ["event entry management software", "event access control software", "event gate management system", "venue entry management", "qr code entry management", "event door check-in system"],
  alternates: {
    canonical: "https://urpass.space/event-entry-management-software",
  },
  openGraph: {
    title: "Event Entry Management & QR Access Control | URPASS",
    description: "Event entry management software for crowd flow, multi-gate access control, VIP tier validation, and sub-second QR phone scanning. Prevent foyer bottlenecks.",
    url: "https://urpass.space/event-entry-management-software",
    locale: "en_US",
    type: "website",
  },
};

export default function EventEntryManagementSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "ACCESS CONTROL & GATE OPERATIONS",
  "h1": "Event Entry Management & QR Access Control",
  "canonicalUrl": "https://urpass.space/event-entry-management-software",
  "description": "Event entry management software for crowd flow, multi-gate access control, VIP tier validation, and sub-second QR phone scanning. Prevent foyer bottlenecks.",
  "ctaLabel": "Manage Event Entry Free →",
  "ctaTitle": "Eradicate Entrance Queues with High-Speed QR Control",
  "ctaDescription": "Coordinate entrance gates, validate credential tiers, prevent duplicate entry, and monitor venue crowd flow with sub-second smartphone check-in.",
  "directAnswer": {
    "title": "What is Event Entry Management Software?",
    "summary": "Event entry management software is an access control system that coordinates crowd arrivals, gate security, and credential validation at event entrances. URPASS replaces slow paper guest lists and expensive rented scanners with sub-0.3s smartphone camera scanning, multi-gate atomic duplicate locking, and real-time venue crowd analytics.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning on any smartphone with zero hardware rentals",
      "Atomic duplicate blocking across all entrances within 150 milliseconds",
      "Tiered access control for VIPs, General Admission, Press, and Staff",
      "Live gate-by-gate crowd velocity telemetry and occupancy monitoring"
    ]
  },
  "whatIs": {
    "title": "What is Event Entry Management Software?",
    "definition": "Event entry management software is a specialized operational solution that controls the physical flow of attendees into a venue. It validates digital tickets, verifies access permissions (such as VIP or backstage passes), records arrival timestamps, and prevents unauthorized entry or pass reuse.",
    "details": [
      "Prevents dangerous foyer bottlenecks and crowd surges at venue gates",
      "Replaces bulky rented laser turnstiles with agile, handheld volunteer smartphones",
      "Maintains entrance speed during peak morning or evening arrival windows",
      "Ensures strict compliance with venue capacity and local fire authority regulations"
    ]
  },
  "howItWorksTitle": "How URPASS Controls Event Entry",
  "howItWorksSubtitle": "From gate deployment to live crowd monitoring.",
  "steps": [
    {
      "n": "01",
      "title": "Configure access tiers",
      "desc": "Set VIP, General Admission, Speaker, and Staff access privileges."
    },
    {
      "n": "02",
      "title": "Deploy gate staff",
      "desc": "Send volunteer door staff a private scanner URL on their mobile phones."
    },
    {
      "n": "03",
      "title": "Attendees arrive at gates",
      "desc": "Guests present their mobile QR passes as they approach the entrance."
    },
    {
      "n": "04",
      "title": "Sub-0.3s camera scan",
      "desc": "Phones scan passes instantly, displaying green for valid and red for invalid."
    },
    {
      "n": "05",
      "title": "Atomic duplicate lockout",
      "desc": "Pass status updates across all gates within 150ms to prevent pass sharing."
    },
    {
      "n": "06",
      "title": "Monitor gate velocity",
      "desc": "Track entries per minute per gate to reallocate door staff dynamically."
    }
  ],
  "featuresTitle": "Entry Operations Built for Maximum Throughput",
  "featuresSubtitle": "Sub-second camera scans, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-0.3s Gate Validation",
      "desc": "Admit 40 to 50 attendees per minute per volunteer. High-contrast screens ensure readability in sunlight or dark clubs."
    },
    {
      icon: Lock,
      "title": "Atomic Duplicate Lockout",
      "desc": "Instantly blocks screenshotted, forwarded, or duplicated passes across all venue doors in under 150ms."
    },
    {
      icon: Users,
      "title": "Tiered Access Control",
      "desc": "Ensure General Admission pass holders cannot enter VIP lounges, speaker rooms, or backstage zones."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "Dense crowds can jam local cellular networks. URPASS offline mode keeps scanning uninterrupted."
    },
    {
      icon: BarChart3,
      "title": "Gate-by-Gate Telemetry",
      "desc": "Monitor check-in velocity at each entrance to identify bottlenecks and balance queue lines."
    },
    {
      icon: ShieldCheck,
      "title": "Hardware-Free Deployment",
      "desc": "Eliminate expensive laser scanner rentals. Volunteer staff scan using their personal mobile phones."
    }
  ],
  "whoShouldUse": {
    "title": "Who Needs Event Entry Management?",
    "subtitle": "From arena concerts to multi-hall convention centers.",
    "personas": [
      {
        "badge": "ARENAS",
        "title": "Stadium & Arena Operations",
        "desc": "Manage thousands of arrivals across multiple external concourse gates smoothly."
      },
      {
        "badge": "CONVENTIONS",
        "title": "Exhibition & Convention Centers",
        "desc": "Coordinate multi-hall entrances and separate VIP buyer access points."
      },
      {
        "badge": "CAMPUS",
        "title": "Collegiate Balls & Fests",
        "desc": "Stop gatecrashers and duplicate pass sharing at high-volume student events."
      },
      {
        "badge": "CONCERTS",
        "title": "Music Festivals & Nightclubs",
        "desc": "Rapid door verification in dim lighting with clear visual and audio feedback."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Entry Access Validation Works",
    "subtitle": "Sub-second camera scanning on volunteer phones.",
    "description": "Attendees display their mobile QR pass on their phone screen. Volunteer staff open the scanner URL in Safari or Chrome on their smartphones. Pointing the camera at the pass validates the ticket in under 0.3 seconds with an audible green chime, verifying their registration without needing a paper roster.",
    "points": [
      "Zero equipment costs: volunteers use their personal mobile phones.",
      "Offline engine pre-loads ticket databases to validate passes with zero network connectivity.",
      "Atomic row-locking prevents shared pass screenshots across different gate tents.",
      "Rapid manual lookup by name if an attendee's phone battery has died."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Traditional Gate Hardware",
    "subtitle": "How mobile entry software outperforms rented laser scanners.",
    "headers": [
      "Gate Operational Metric",
      "Rented Handheld Laser Guns",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Hardware Rental Cost",
        "col2": "£50 to £150 per scanner per day",
        "col3": "£0 hardware cost; uses volunteers' phones"
      },
      {
        "col1": "Staff Onboarding",
        "col2": "30 minutes training on proprietary scanner buttons",
        "col3": "15 seconds; open a link in mobile Safari/Chrome"
      },
      {
        "col1": "Multi-Door Duplication",
        "col2": "Sync delays often permit duplicate ticket reuse",
        "col3": "Sub-150ms atomic state replication blocks reuse"
      },
      {
        "col1": "Gate Telemetry",
        "col2": "Total count only available after returning scanners",
        "col3": "Live real-time gate velocity and headcount graphs"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is event entry management software?",
      "a": "It is an operational software system that controls attendee access at event entrances, validating tickets, verifying tiers, and recording entry timestamps."
    },
    {
      "q": "How does URPASS prevent ticket sharing at the door?",
      "a": "When a ticket is scanned at any entrance, URPASS atomically updates its status in under 150ms. Any subsequent attempt to scan the same pass displays an immediate red duplicate alert."
    },
    {
      "q": "Can different doors validate different ticket tiers (e.g. VIP vs General)?",
      "a": "Yes. You can configure scanners to only admit specific pass tiers (such as VIP Lounge access only) to prevent unauthorized entry."
    },
    {
      "q": "Do door staff need to download an app on their phones?",
      "a": "No. Door staff open a secure web link in their mobile browser (Safari or Chrome) and start scanning passes immediately."
    },
    {
      "q": "What happens if our venue Wi-Fi goes down during entry?",
      "a": "URPASS includes an offline scanning engine that pre-loads attendee records, continuing validation smoothly even during total network blackouts."
    },
    {
      "q": "What happens if an attendee shows an unapproved or cancelled ticket?",
      "a": "The scanner screen turns red with a prominent warning message showing the cancellation status and timestamp, preventing unauthorized entry."
    },
    {
      "q": "Can entrance staff see attendee notes during check-in?",
      "a": "Yes. Dietary restrictions, VIP status, or outstanding payment balances display directly on the scanning screen upon QR verification."
    }
  ],
  "relatedLinks": [
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    },
    {
      "title": "Event Check-In App with QR Scanner",
      "href": "/event-check-in-app",
      "category": "Product"
    },
    {
      "title": "Event Registration with QR Code Tickets",
      "href": "/event-registration-with-qr-code",
      "category": "Product"
    },
    {
      "title": "Real-Time Event Attendance Tracking Software",
      "href": "/event-attendance-tracking-software",
      "category": "Product"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    }
  ]
}}
    />
  );
}
