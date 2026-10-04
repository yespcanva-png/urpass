import type { Metadata } from "next";
import { BarChart3, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Gate QR Check-In for Large Events | URPASS",
  description: "Multi-gate event check-in software with atomic duplicate blocking across 20+ venue gates. Sub-second phone scanning, offline resilience, and live gate telemetry.",
  keywords: ["multi gate event check in", "multiple entrance event check in", "synchronized event check-in", "prevent duplicate event tickets", "arena gate scanning software", "multi door qr ticket scanner"],
  alternates: {
    canonical: "https://urpass.space/multi-gate-event-check-in",
  },
  openGraph: {
    title: "Multi-Gate QR Check-In for Large Events | URPASS",
    description: "Multi-gate event check-in software with atomic duplicate blocking across 20+ venue gates. Sub-second phone scanning, offline resilience, and live gate telemetry.",
    url: "https://urpass.space/multi-gate-event-check-in",
    locale: "en_US",
    type: "website",
  },
};

export default function MultiGateEventCheckInPage() {
  return (
    <SEOPage
      config={{
  "badge": "MULTI-GATE & VENUE SCALE",
  "h1": "Multi-Gate QR Check-In for Large Events",
  "canonicalUrl": "https://urpass.space/multi-gate-event-check-in",
  "description": "Multi-gate event check-in software with atomic duplicate blocking across 20+ venue gates. Sub-second phone scanning, offline resilience, and live gate telemetry.",
  "ctaLabel": "Configure Multi-Gate Entry Free →",
  "ctaTitle": "Coordinate Multiple Venue Entrances Without Duplication",
  "ctaDescription": "Synchronize check-ins across 20+ gates in real time. Prevent screenshotted pass reuse with atomic row locks and sub-second phone scanning.",
  "directAnswer": {
    "title": "How Does Multi-Gate QR Check-In Work?",
    "summary": "Multi-gate event check-in is an entrance management architecture that synchronizes ticket validation across dozens of simultaneous venue entrances in real time. URPASS utilizes atomic database row locking to replicate scan states in under 150 milliseconds. Once a ticket is scanned at Gate 1, it cannot be reused seconds later at Gate 5 or shared via mobile screenshot.",
    "keyPoints": [
      "Atomic state replication (<150ms) across all active gates and mobile scanners",
      "Immediate visual and audible warnings for duplicate, reused, or invalid passes",
      "Full offline resilience allowing continued scanning during venue network drops",
      "Gate-by-gate arrival velocity tracking to detect bottlenecks and rebalance queues"
    ]
  },
  "whatIs": {
    "title": "What is Multi-Gate Event Check-In?",
    "definition": "Multi-gate event check-in is a synchronized access control solution designed for stadiums, convention centers, and multi-entrance venues. It coordinates multiple scanning devices running concurrently, ensuring that a single ticket cannot be admitted more than once across different physical entry points.",
    "details": [
      "Solves the critical operational vulnerability where attendees share ticket screenshots across doors",
      "Eliminates expensive server turnstiles by using volunteer mobile phone cameras",
      "Distributes crowd flow evenly across multiple gates to prevent localized foyer congestion",
      "Logs exact gate identifiers and timestamps for every scanned attendee"
    ]
  },
  "howItWorksTitle": "How Multi-Gate Synchronization Works",
  "howItWorksSubtitle": "Atomic database locking and instant cross-door replication.",
  "steps": [
    {
      "n": "01",
      "title": "Deploy entrance gates",
      "desc": "Configure Gate A, Gate B, VIP Gate, and Staff Entrance on the dashboard."
    },
    {
      "n": "02",
      "title": "Staff open scanner link",
      "desc": "Door volunteers open the scanner URL on their own phones at their assigned gates."
    },
    {
      "n": "03",
      "title": "Attendee presents QR pass",
      "desc": "The pass is scanned in <0.3s by the volunteer's mobile camera."
    },
    {
      "n": "04",
      "title": "Atomic row lock applied",
      "desc": "The central database atomically marks the ticket used in under 150ms."
    },
    {
      "n": "05",
      "title": "Duplicate attempt blocked",
      "desc": "If the same pass is presented at another gate, an immediate red alert sounds."
    },
    {
      "n": "06",
      "title": "Live gate telemetry",
      "desc": "Monitor arrival throughput gate-by-gate on the central organizer screen."
    }
  ],
  "featuresTitle": "Architecture Built for High-Volume Venue Entrances",
  "featuresSubtitle": "Atomic duplicate locks, sub-150ms sync, and offline resilience.",
  "features": [
    {
      icon: Lock,
      "title": "Atomic Row-Level Locking",
      "desc": "State changes replicate in <150ms. A pass scanned at Gate 1 cannot be reused moments later at Gate 4."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Camera Scanning",
      "desc": "Admit 45+ attendees per minute per volunteer phone. Clear multi-lane concourses without delays."
    },
    {
      icon: Zap,
      "title": "Offline Queue Sync",
      "desc": "If a gate loses cellular connection, local browser memory caches scans and synchronizes upon reconnecting."
    },
    {
      icon: Users,
      "title": "Unlimited Concurrent Gates",
      "desc": "Deploy 5, 10, or 50 scanning lines simultaneously with zero performance degradation or licensing penalties."
    },
    {
      icon: BarChart3,
      "title": "Gate-by-Gate Throughput",
      "desc": "Track arrival velocity curves per gate to dynamically move security staff to overloaded entrances."
    },
    {
      icon: ShieldCheck,
      "title": "Zero Hardware Rentals",
      "desc": "Eliminate expensive proprietary scanner rentals. Run professional multi-gate entry on personal smartphones."
    }
  ],
  "whoShouldUse": {
    "title": "Who Needs Multi-Gate Check-In?",
    "subtitle": "Built for large venues with multiple physical access doors.",
    "personas": [
      {
        "badge": "CONVENTIONS",
        "title": "Convention Centers & Expos",
        "desc": "ExCeL, NEC, or convention halls managing multiple exhibition halls and external entrances."
      },
      {
        "badge": "STADIUMS",
        "title": "Arenas & Sports Grounds",
        "desc": "Stadiums admitting thousands of fans across North, South, East, and West concourses."
      },
      {
        "badge": "COLLEGES",
        "title": "University Fests & Campus Balls",
        "desc": "Prevent campus gatecrashers and shared screenshots at multi-gate college events."
      },
      {
        "badge": "FESTIVALS",
        "title": "Outdoor Music Festivals",
        "desc": "Coordinate Main Gate, VIP Camping, and Backstage access points across festival fields."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Multi-Gate QR Scanning Operates",
    "subtitle": "Sub-second camera scanning on volunteer phones.",
    "description": "Volunteers open the scanner URL on their own smartphone browser (Safari or Chrome). No app download or account creation required. Pointing the camera at an attendee's QR pass decodes and verifies the ticket in under 0.3 seconds with an audible green chime and instant name confirmation, admitting 45+ attendees per minute per volunteer.",
    "points": [
      "Zero equipment costs: volunteers use their personal mobile phones.",
      "Offline engine pre-loads ticket databases to validate passes with zero network connectivity.",
      "Atomic row-locking prevents shared pass screenshots across different gate tents.",
      "Rapid manual lookup by name if an attendee's phone battery has died."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS Multi-Gate Sync vs Traditional Scanners",
    "subtitle": "Why atomic synchronization is required for large venues.",
    "headers": [
      "Operational Dimension",
      "Legacy Scanners / Periodic Sync",
      "URPASS Atomic Multi-Gate"
    ],
    "rows": [
      {
        "col1": "Cross-Door Sync Speed",
        "col2": "Polling every 30-60 seconds allows ticket sharing",
        "col3": "Atomic state replication in under 150ms"
      },
      {
        "col1": "Hardware Demands",
        "col2": "Rented proprietary hardware costing thousands",
        "col3": "Any volunteer smartphone browser; £0 hardware cost"
      },
      {
        "col1": "Network Drop Resilience",
        "col2": "System freezes or allows untracked duplicates",
        "col3": "IndexedDB offline cache continues validating"
      },
      {
        "col1": "Gate Telemetry",
        "col2": "Aggregate numbers only after returning devices",
        "col3": "Live gate-by-gate arrival curves and throughput"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is multi-gate event check-in?",
      "a": "It is an entrance management architecture that synchronizes ticket validation across multiple venue entrances simultaneously, preventing tickets from being used more than once."
    },
    {
      "q": "How does URPASS prevent people from sharing screenshots of tickets across gates?",
      "a": "When a ticket is scanned at Gate 1, URPASS atomically updates its status across all active gates in under 150ms. If someone presents a screenshot at Gate 2, the scanner immediately triggers a vibrant red alert."
    },
    {
      "q": "How many gates can scan simultaneously?",
      "a": "URPASS supports unlimited concurrent gates and mobile scanners without performance slowdowns or per-scanner fees."
    },
    {
      "q": "What happens if one gate loses internet connectivity?",
      "a": "URPASS uses local browser caching to continue scanning offline. Once connectivity is restored, all offline scans synchronize seamlessly with the central database."
    },
    {
      "q": "Can we see which gate each attendee checked into?",
      "a": "Yes. Every scan records the exact timestamp and assigned gate name (e.g. 'Gate 3 - North Entrance') in the exportable attendance log."
    },
    {
      "q": "How do multiple scanners stay in sync across different venue gates?",
      "a": "Scanners communicate via real-time WebSocket connections. When Gate 1 scans a pass, Gate 2 and Gate 3 receive the check-in event in under 100ms."
    },
    {
      "q": "What if one gate loses cellular internet connection?",
      "a": "The gate falls back to local IndexedDB storage to continue scanning, queueing check-ins and synchronizing immediately once connectivity is restored."
    }
  ],
  "relatedLinks": [
    {
      "title": "Event Entry Management & QR Access Control",
      "href": "/event-entry-management-software",
      "category": "Product"
    },
    {
      "title": "Event Check-In App with QR Scanner",
      "href": "/event-check-in-app",
      "category": "Product"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Real-Time Event Attendance Tracking Software",
      "href": "/event-attendance-tracking-software",
      "category": "Product"
    },
    {
      "title": "Event Registration with QR Code Tickets",
      "href": "/event-registration-with-qr-code",
      "category": "Product"
    }
  ]
}}
    />
  );
}
