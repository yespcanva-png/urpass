import type { Metadata } from "next";
import {
  DoorClosed,
  ScanLine,
  ShieldAlert,
  Smartphone,
  WifiOff,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  BarChart3,
  Network,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "URPASS Multiple Gate Event Check-In | Multi-Entrance QR Scanner & Sync",
  description:
    "Manage multi-door QR event check-in without duplicate entries. Sync multiple entrance gates in real-time on volunteer phone browsers with offline fallback and sub-second validation.",
  keywords: [
    "multiple gate event check-in",
    "multi-entrance qr ticket scanner",
    "prevent duplicate qr ticket entry",
    "multi-gate scanning software",
    "concurrent event check-in",
    "URPASS multiple gate event check-in",
    "college fest gate management",
    "conference entrance check-in",
  ],
  alternates: { canonical: "https://urpass.space/multiple-gate-event-check-in" },
  openGraph: {
    title: "Multiple Gate Event Check-In | Zero Duplicate Entry | URPASS",
    description:
      "Can multiple volunteers scan tickets at once? Yes. URPASS powers real-time synchronized QR check-in across unlimited event gates using standard smartphone browsers.",
    url: "https://urpass.space/multiple-gate-event-check-in",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function MultipleGateEventCheckInPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/multiple-gate-event-check-in",
        badge: "MULTI-GATE ACCESS CONTROL",
        h1: "Multiple Gate Event Check-In: How to Manage Multi-Door QR Scanning Without Duplicate Entry",
        description:
          "Equip 5, 10, or 20 entrance volunteers with instant browser-based QR scanners. URPASS synchronizes check-in states globally in <0.3s to block duplicate tickets across every entrance, even in patchy venue Wi-Fi.",
        ctaLabel: "Set up multi-gate check-in",

        // Direct Answer (40–60 words) immediately beneath H1
        directAnswer: {
          title: "How does multiple gate event check-in work?",
          summary:
            "Multiple gate event check-in is an entry control architecture that enables staff at different venue entrances, VIP zones, and turnstiles to scan attendee QR passes concurrently. URPASS synchronizes scan states in real time across all volunteer phone browsers. When a QR ticket is scanned at Gate 1, it is globally invalidated within 300 milliseconds across Gates 2, 3, and 4, preventing pass sharing or duplicate entry.",
          keyPoints: [
            "Concurrent multi-volunteer scanning: unlimited scanners active simultaneously",
            "Sub-300ms global ticket invalidation prevents screenshot sharing across gates",
            "No hardware to rent: volunteers scan directly in Chrome or Safari on their own phones",
            "Offline-first sync engine: scans queue locally in IndexedDB if gate Wi-Fi drops",
            "Real-time breakdown: track attendance, capacity, and hourly throughput per gate",
          ],
        },

        // Key facts & technical specifications table
        keyFactsTable: {
          title: "Multi-Gate Check-In Architecture Comparison",
          subtitle: "How URPASS browser-based gate sync outperforms paper lists and legacy handheld hardware.",
          headers: ["Capability", "URPASS Multiple Gate Check-In", "Traditional Barcode Scanners / Paper Lists"],
          rows: [
            {
              col1: "Setup Time per Gate",
              col2: "< 1 minute (open secure link on volunteer phone)",
              col3: "2–4 hours (cable routing, hardware pairing, app installs)",
            },
            {
              col1: "Duplicate Entry Prevention Across Gates",
              col2: "Sub-300ms cloud lock + offline atomic local queue",
              col3: "Manual radio communication or batch sync every 15–30 min",
            },
            {
              col1: "Concurrent Scanner Capacity",
              col2: "Unlimited gates, volunteers, and scanning points",
              col3: "Limited by rented scanner hardware units ($100–$250/unit)",
            },
            {
              col1: "Network Fault Resilience",
              col2: "Full offline caching; scans queue locally and sync on reconnect",
              col3: "Fails completely or creates untracked duplicate admissions",
            },
            {
              col1: "Gate-Specific Analytics",
              col2: "Live throughput per gate, peak congestion alerts, staff audits",
              col3: "Post-event manual reconciliation of printed attendance sheets",
            },
          ],
        },

        productProof: {
          badge: "REAL-TIME GATE CONCURRENCY",
          title: "Instant Visual and Audio Feedback at Every Entrance",
          description:
            "When a pass is scanned, the scanner flashes bright green with a distinct chime and displays the guest name, ticket tier, and seating zone. If the pass was already scanned at another gate, it immediately flashes bright red with the exact timestamp and entrance where it was first validated.",
          type: "scanner",
        },

        features: [
          {
            icon: DoorClosed,
            title: "Dedicated Gate Assignment",
            desc: "Create named entrances like Main Gate, VIP West, Speaker Lounge, and Backstage. Assign staff PINs or restricted links to each.",
          },
          {
            icon: ShieldAlert,
            title: "Zero Duplicate Entry",
            desc: "The moment a ticket is scanned at Gate A, it is invalidated everywhere. Attendees cannot pass their phone to friends at Gate B.",
          },
          {
            icon: Smartphone,
            title: "Zero App Download for Staff",
            desc: "Volunteers don't need to download apps from Google Play or App Store. They simply open urpass.space/scan in their mobile browser.",
          },
          {
            icon: WifiOff,
            title: "Offline-Resilient Gate Sync",
            desc: "If stadium Wi-Fi or 4G drops at Gate 3, our offline engine caches verified tickets and atomic counters locally in IndexedDB.",
          },
          {
            icon: Zap,
            title: "Sub-0.3s Scan Latency",
            desc: "Optimized WebAssembly QR decoder processes high-contrast passes instantly without needing to hold the camera steady.",
          },
          {
            icon: BarChart3,
            title: "Live Gate Throughput Analytics",
            desc: "See which gates have lines, track check-ins per minute, and reassign volunteer staff to busy entrances dynamically.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Create Gates & Tiers",
            desc: "Define your venue doors in URPASS (e.g., Gate 1 — General, Gate 2 — VIP, Gate 3 — Student Entry).",
          },
          {
            n: "02",
            title: "Share Gate Links with Staff",
            desc: "Generate instant access links or QR codes for your volunteers. No staff passwords or email invites required.",
          },
          {
            n: "03",
            title: "Scan Concurrently",
            desc: "Volunteers point their phone cameras at attendee passes. Green means valid; red means already used or invalid ticket.",
          },
          {
            n: "04",
            title: "Live Dashboard Tracking",
            desc: "Watch real-time attendee flow across all gates on your organizer dashboard with auto-updating charts.",
          },
        ],

        deepDiveSections: [
          {
            badge: "CORE ARCHITECTURE",
            title: "How URPASS Prevents Screenshot Sharing Across 5+ Entrances",
            paragraphs: [
              "A common vulnerability in college fests and music festivals is the screenshot fraud trick: Attendee A enters through North Gate, takes a screenshot of their QR ticket, WhatsApps it to Attendee B waiting outside South Gate, who attempts to enter 2 minutes later.",
              "Traditional event platforms fail here because their scanning apps sync in batches every few minutes to save battery. In contrast, URPASS utilizes real-time distributed state locking over lightweight WebSockets. The second Attendee A's QR code is captured, the record is locked atomically. When Attendee B presents the screenshot at South Gate, the scanner immediately flashes red: 'ALREADY CHECKED IN at North Gate (14:32:08)'.",
            ],
            bullets: [
              "Atomic database transactions prevent race conditions even on simultaneous scans",
              "Exact audit trail records scanner staff ID, gate name, and millisecond timestamp",
              "Optional dynamic rotating QR code mode prevents screenshot theft entirely",
            ],
            takeaway: "Eliminate duplicate admissions and revenue leakage across all venue perimeter doors.",
          },
          {
            badge: "VENUE SCENARIO",
            title: "Real-World Setup: Managing a 4,000-Attendee College Fest with 4 Gates",
            paragraphs: [
              "At a premier technical symposium in Chennai with 4,000 participants, the organizing committee deployed 12 student volunteers across 4 gates: 4 at Main Gate (General), 4 at North Gate (Colleges), 2 at Auditorium Entry, and 2 at the Food Court.",
              "Instead of renting 12 dedicated barcode guns at ₹1,500/day, the organizers sent a WhatsApp message with the gate link to the volunteers. Within 45 minutes of gates opening, 3,200 attendees were checked in with an average scan speed of 2.1 seconds per person including physical badge issuance.",
            ],
            bullets: [
              "Zero hardware rental cost: ₹18,000 saved on dedicated handheld scanners",
              "Peak arrival handled: 68 attendees per minute across all 4 gates",
              "Zero duplicate entries recorded despite high crowd density",
            ],
          },
        ],

        useCases: [
          "College cultural fests & technical symposiums with multiple campus gates",
          "Tech conferences with General, VIP, and Speaker entrances",
          "Music concerts and stadium events with turnstiles and perimeter gates",
          "Hackathons with separate registration, dorm, and cafeteria access gates",
          "Exhibitions and trade shows with continuous multi-hall re-entry",
        ],

        relatedLinks: [
          { title: "High-Volume Event Check-In for 5,000 Attendees", href: "/event-check-in-for-5000-attendees", category: "Product" },
          { title: "Offline QR Event Check-In", href: "/offline-qr-event-check-in", category: "Product" },
          { title: "Prevent Duplicate Event Entry", href: "/guides/prevent-duplicate-event-entry", category: "Guide" },
          { title: "Event Capacity Management", href: "/event-capacity-management", category: "Product" },
          { title: "Event Ticketing Software India", href: "/event-ticketing-software-india", category: "Product" },
        ],

        faqs: [
          {
            q: "Can multiple volunteers scan tickets at the same time?",
            a: "Yes. URPASS supports unlimited concurrent volunteer scanners. You can have 5, 20, or 50 volunteers scanning tickets simultaneously across different gates or lanes, and all scans are synchronized in real time in under 0.3 seconds.",
          },
          {
            q: "How do I manage 5 entrances at an event?",
            a: "In your URPASS dashboard, navigate to your event settings and create 5 gates (e.g. North Gate, South Gate, East Gate, VIP Entrance, Media Desk). URPASS generates a unique scanner link or QR PIN for each gate. Volunteers open the link on their mobile browser and begin scanning immediately.",
          },
          {
            q: "Can one QR ticket be scanned twice across different gates?",
            a: "No. URPASS uses atomic validation locks. The exact millisecond a pass is scanned at Gate 1, its state changes to 'checked_in'. If someone tries to scan the same pass or a forwarded screenshot at Gate 2, the scanner immediately sounds a warning tone, vibrates, and shows 'ALREADY CHECKED IN' with the first scan time and gate location.",
          },
          {
            q: "What happens if internet connectivity drops at one gate?",
            a: "URPASS features an offline-first scanning engine. The complete guest list and ticket hashes are cached locally in the scanner browser's IndexedDB. If connection is lost, passes are validated offline and queued securely. As soon as connectivity resumes, the offline queue syncs automatically.",
          },
          {
            q: "Do volunteers need to create URPASS accounts or download an app?",
            a: "No. Volunteers do not need an account, password, or mobile app installation. Organizers simply share a secure scanner link or display a QR code that staff scan with their phone camera to instantly launch the browser scanning portal.",
          },
          {
            q: "Can I restrict certain ticket tiers to specific gates?",
            a: "Yes. You can configure gate access rules. For example, configure the VIP Gate to only allow VIP ticket holders, while routing General Admission attendees to Main Gates. If an attendee arrives at the wrong gate, the scanner alerts the staff member to redirect them.",
          },
          {
            q: "What is URPASS?",
            a: "URPASS is an event registration, ticketing, digital pass, QR check-in and attendance management platform for colleges, conferences, workshops and large-scale events.",
          },
        ],
      }}
    />
  );
}
