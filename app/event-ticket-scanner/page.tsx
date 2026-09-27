import type { Metadata } from "next";
import {
  ScanLine,
  Smartphone,
  Volume2,
  Vibrate,
  ShieldCheck,
  Zap,
  WifiOff,
  Flashlight,
  Sliders,
  CheckCircle2,
  BarChart3,
  QrCode,
  Laptop,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Scanner — In-Browser QR & Barcode Scanner for Gates | URPASS",
  description:
    "High-speed event ticket scanner software for iOS, Android, and USB/Bluetooth hardware scanners. Sub-second verification, zero app downloads, multi-gate duplicate prevention, and offline sync.",
  keywords: [
    "event ticket scanner",
    "event ticket scanner software",
    "online event qr scanner",
    "qr ticket scanner for events",
    "event gate scanner app",
    "bluetooth barcode ticket scanner",
    "offline event ticket scanner",
    "event entry scanner",
    "mobile ticket scanner",
    "URPASS ticket scanner",
  ],
  alternates: { canonical: "https://urpass.space/event-ticket-scanner" },
  openGraph: {
    title: "Event Ticket Scanner — Sub-Second Multi-Gate Verification | URPASS",
    description:
      "Turn any smartphone or laptop into an enterprise event ticket scanner. Fast camera scanning, laser barcode gun mode, audio-haptic cues, and instant duplicate pass detection.",
    url: "https://urpass.space/event-ticket-scanner",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventTicketScannerPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticket-scanner",
        badge: "ENTERPRISE GATE SCANNER",
        h1: "High-Speed Event Ticket Scanner Software for Multi-Gate Venues",
        description:
          "Validate digital passes and badges in under 0.3 seconds. Works directly inside mobile browsers with zero app downloads, supports Bluetooth laser barcode guns, and operates seamlessly during venue network dropouts.",
        ctaLabel: "Launch Free Scanner Demo",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "How Does URPASS Event Ticket Scanner Work?",
          summary:
            "URPASS is an in-browser event ticket scanner that turns any smartphone, tablet, or laptop into a commercial-grade entrance validator without requiring app store downloads. Gate staff simply enter an event PIN link in Safari or Chrome to decode attendee QR codes in under 0.3 seconds. The scanner provides instant Web Audio chime feedback, haptic vibration cues, multi-gate duplicate entry blocking, and automated offline sync when connectivity drops.",
          keyPoints: [
            "Sub-second verification (<0.3s) with synthesized audio chimes and haptic vibrations",
            "Zero app installation: volunteers open a secure PIN URL in any mobile browser",
            "Hardware barcode gun support: plug-and-play USB and Bluetooth laser scanners",
            "Multi-gate sync with atomic locking to prevent screenshot and duplicate pass reuse",
            "Offline check-in mode keeps lines moving through cellular network dead zones",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Event Ticket Scanner Operational Specifications",
          subtitle: "Technical benchmarks comparing URPASS browser scanning against traditional rental handhelds.",
          headers: ["Capability", "URPASS Event Ticket Scanner", "Traditional Rental Scanner Terminals"],
          rows: [
            {
              col1: "Setup Time per Gate",
              col2: "< 10 seconds (Enter 4-digit PIN link in phone browser)",
              col3: "25–45 minutes (Configuring proprietary hardware/networks)",
            },
            {
              col1: "Scan Throughput Latency",
              col2: "< 300 milliseconds per ticket validation",
              col3: "2.0 to 4.5 seconds per barcode",
            },
            {
              col1: "Hardware Compatibility",
              col2: "Any iOS/Android camera + USB/Bluetooth HID laser guns",
              col3: "Locked to manufacturer's proprietary ruggedized devices",
            },
            {
              col1: "Audio & Haptic Feedback",
              col2: "Multi-frequency Web Audio chimes + haptic motor pulses",
              col3: "Monotone buzzer with no tactile confirmation",
            },
            {
              col1: "Torch / Flashlight Control",
              col2: "1-tap camera torch toggle for dark auditoriums and night venues",
              col3: "Requires external gate spotlights",
            },
            {
              col1: "Screen Wake Lock API",
              col2: "Screen stays illuminated automatically during active gate shifts",
              col3: "Screen dims or auto-locks unless manually disabled in OS settings",
            },
            {
              col1: "Hardware Rental Cost",
              col2: "₹0 (Use existing organizer and volunteer smartphones)",
              col3: "₹1,500–₹3,500 per device / per day + security deposits",
            },
            {
              col1: "Network Resilience",
              col2: "Local IndexedDB queue with automatic background server sync",
              col3: "Fails completely or creates unmerged duplicate entries",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: ScanLine,
            title: "Sub-Second In-Browser Scanning",
            desc: "Zero app downloads required. Volunteers open a secure PIN link in Safari or Chrome to scan digital passes in under 300ms with smooth 60fps video feed.",
          },
          {
            icon: Laptop,
            title: "Bluetooth & USB Barcode Gun Support",
            desc: "Connect physical laser barcode guns or handheld Bluetooth scanners directly to laptops and check-in desks for ultra-fast continuous queue clearance.",
          },
          {
            icon: ShieldCheck,
            title: "Multi-Gate Duplicate Blocking",
            desc: "Atomic database locking guarantees that a screenshot or forwarded pass cannot be redeemed at another gate, even if scanned at the exact same millisecond.",
          },
          {
            icon: Flashlight,
            title: "Built-In Torch & Wake Lock",
            desc: "Integrated flashlight toggle illuminates dark venue entrances while the Screen Wake Lock API prevents phone displays from sleeping during busy rushes.",
          },
          {
            icon: WifiOff,
            title: "Offline-First Gate Continuity",
            desc: "When Wi-Fi or 5G drops inside dense convention halls, scans queue securely in browser memory and sync automatically when signal restores.",
          },
          {
            icon: Volume2,
            title: "Web Audio & Haptic Verification",
            desc: "Distinct high-pitch chimes and vibrations signal valid passes, while harsh low tones alert security staff to already-used or invalid passes instantly.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "LIVE SCANNER PROOF",
          title: "Engineered for 1,000+ Attendee Gate Rushes",
          description:
            "Watch our high-speed validation pipeline process passes in real time. Designed with a 1.5s debounce lock to prevent accidental double-scanning.",
          type: "scanner",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Built for Real Indian Event Gate Conditions",
          subtitle: "Designed to excel in noisy auditoriums, remote festival grounds, and intermittent network venues across India.",
          items: [
            {
              title: "Overcoming Crowded Venue Cellular Jams",
              description:
                "At college fests and tech summits in Bengaluru, Mumbai, or Delhi, 3,000 attendees overload local cell towers. URPASS offline scan queues ensure zero gate bottlenecks.",
              badge: "Offline Ready",
            },
            {
              title: "BYOD Volunteer Deployment",
              description:
                "Equip 30 college student volunteers or event temporary staff in 60 seconds without creating individual staff accounts or distributing expensive hardware.",
              badge: "4-Digit PIN Access",
            },
            {
              title: "Night Venues & Dark Auditoriums",
              description:
                "From dimly lit comedy clubs to open-ground cultural concerts, the 1-click camera torch toggle illuminates passes without needing external phone flashlights.",
              badge: "Camera Torch Toggle",
            },
            {
              title: "Sunlight & Glare Handling",
              description:
                "High-contrast scanner target reticle and dynamic exposure handling decode screens even under harsh midday outdoor sunlight.",
              badge: "High Dynamic Range",
            },
          ],
        },

        // Step-by-Step Workflow
        steps: [
          {
            n: "01",
            title: "Generate Secure Scanner PIN",
            desc: "Inside your event dashboard, enable volunteer gate access with a temporary 4-digit security PIN or scan-to-launch QR code.",
          },
          {
            n: "02",
            title: "Open Browser on Any Device",
            desc: "Gate staff navigate to the scanner URL on iOS, Android, or laptop. No account creation, App Store download, or APK install needed.",
          },
          {
            n: "03",
            title: "Point, Verify & Check In",
            desc: "Aim the camera at the attendee's QR code. In <0.3s, hear the verification chime, feel the haptic pulse, and view real-time attendee details.",
          },
        ],

        // Deep Dive Educational Sections
        deepDiveSections: [
          {
            badge: "HARDWARE FLEXIBILITY",
            title: "Why In-Browser Scanning Beats Proprietary Hardware Rentals",
            paragraphs: [
              "Historically, event organizers handling over 500 attendees were forced to rent heavy barcode scanner terminals costing tens of thousands of rupees. These devices required proprietary charging cradles, serial cables, and complex network pairing protocols that regularly failed on event morning.",
              "URPASS modernizes entrance operations by executing the computer vision scanning pipeline directly within modern mobile web browsers via WebAssembly and HTML5 MediaDevices APIs. By utilizing the 48-megapixel sensors already present in volunteers' pockets, organizers achieve faster scan speeds with zero capital expense.",
              "For seated conferences and registration desks where laser guns are preferred, URPASS features native HID keyboard wedge mode. Plug any USB or 2.4GHz wireless barcode scanner into a laptop running URPASS, and every scanned barcode triggers instant server validation without touching the keyboard.",
            ],
            bullets: [
              "Zero device rental costs or freight shipping delays",
              "Volunteers operate devices they already know and feel comfortable using",
              "Works across iPhone, iPad, Android phones, Chromebooks, and Mac/Windows laptops",
              "Instant device scaling: if gate queues spike, open 5 more phones in 30 seconds",
            ],
            takeaway:
              "Browser-based scanning eliminates rental logistics while delivering equal or superior sub-second scan reliability.",
          },
          {
            badge: "FRAUD DEFENSE",
            title: "Multi-Gate Synchronization and Real-Time Duplicate Prevention",
            paragraphs: [
              "One of the biggest revenue leaks at paid concerts and college fests is pass sharing: an attendee enters through Gate A, screenshots their QR pass, and WhatsApps it to a friend waiting outside Gate B.",
              "URPASS defeats pass reuse through atomic database transaction locks. When a QR pass is recognized, the system locks the pass record in the database before completing validation. If the same pass code is scanned at another entrance gate even 50 milliseconds later, Gate B immediately triggers a loud red double-low error tone displaying 'ALREADY CHECKED IN' with the exact gate name and check-in timestamp.",
              "Organizers can track entrance velocity live from the organizer dashboard, monitoring gate load distribution and real-time arrival counts.",
            ],
            bullets: [
              "Atomic database locks eliminate race conditions between multiple gates",
              "Audit trail records timestamp, gate number, and volunteer ID for every scan",
              "Visual color coding: Emerald Green for valid passes, Crimson Red for duplicates",
              "Attendee profile modal displays ticket tier, seat number, and custom fields",
            ],
            takeaway:
              "Real-time atomic locking prevents fraudulent double-entry across all venue doors automatically.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS Event Ticket Scanner vs Traditional Alternatives",
          subtitle: "How our web-based scanning engine compares to native event apps and dedicated barcode rentals.",
          competitorName: "Traditional Event Check-In Systems",
          rows: [
            {
              criteria: "App Installation Required",
              urpass: "No (100% in-browser Safari / Chrome)",
              competitor: "Yes (Requires 80MB+ native app store downloads)",
              urpassAdvantage: true,
            },
            {
              criteria: "Laser Barcode Gun Support",
              urpass: "Native HID mode for USB & Bluetooth laser scanners",
              competitor: "Usually requires expensive proprietary vendor hardware",
              urpassAdvantage: true,
            },
            {
              criteria: "Scan Verification Latency",
              urpass: "< 0.3 seconds per scan",
              competitor: "1.5 to 4.0 seconds per ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "Screen Wake Lock API",
              urpass: "Built-in (Prevents screen auto-lock during shifts)",
              competitor: "Rarely supported or drains battery without sleep control",
              urpassAdvantage: true,
            },
            {
              criteria: "Camera Flashlight Control",
              urpass: "1-tap integrated torch toggle for dark halls",
              competitor: "Staff must carry separate physical flashlights",
              urpassAdvantage: true,
            },
            {
              criteria: "Volunteer Access Security",
              urpass: "Temporary 4-digit PIN link (Zero account logins)",
              competitor: "Requires inviting staff emails and granting full admin rights",
              urpassAdvantage: true,
            },
            {
              criteria: "Cost for 10 Entrance Gates",
              urpass: "₹0 extra (Included in all URPASS plans)",
              competitor: "₹20,000–₹50,000 in rental fees and scanner licenses",
              urpassAdvantage: true,
            },
          ],
        },

        // Target Event Formats
        useCases: [
          "College Technical Symposiums & Cultural Fests",
          "Developer Hackathons & Tech Conferences",
          "Music Concerts & Night Comedy Shows",
          "Business Summits & Corporate Townhalls",
          "Trade Shows, Expos & Exhibition Halls",
          "Marathons, Sports Meets & Campus Tournaments",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Check-In Software Pillar",
            href: "/event-check-in-software",
            category: "Product",
          },
          {
            title: "Multi-Gate Event Check-In Guide",
            href: "/multi-gate-event-check-in",
            category: "Product",
          },
          {
            title: "QR Event Check-In App",
            href: "/qr-event-check-in",
            category: "Product",
          },
          {
            title: "Event Access Control Software",
            href: "/event-access-control",
            category: "Product",
          },
          {
            title: "Prevent Duplicate Event Entry Guide",
            href: "/guides/prevent-duplicate-event-entry",
            category: "Guide",
          },
          {
            title: "How to Check In 1,000 Attendees Quickly",
            href: "/guides/how-to-check-in-1000-attendees-quickly",
            category: "Guide",
          },
          {
            title: "Event Registration Software Pillar",
            href: "/event-registration-software",
            category: "Product",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "What devices can run the URPASS event ticket scanner?",
            a: "Any modern smartphone (iPhone running iOS 14.3+ or Android running Chrome 88+), iPad, Android tablet, Chromebook, or laptop with an integrated or external webcam. No native app installation is required.",
          },
          {
            q: "Can I connect physical laser barcode guns or Bluetooth ring scanners?",
            a: "Yes. URPASS features native HID keyboard wedge scanner support. Any USB or Bluetooth handheld barcode scanner that inputs keystrokes can scan tickets continuously without gate staff ever needing to click buttons.",
          },
          {
            q: "What happens if our venue loses Internet connectivity during gate entry?",
            a: "URPASS includes an offline-first scanning architecture. Scans validated offline are recorded in local IndexedDB storage and automatically synchronized to the cloud once network connectivity is reestablished.",
          },
          {
            q: "How do I prevent volunteers from seeing sensitive attendee data or revenue?",
            a: "Volunteers access the scanner using a secure 4-digit PIN link. They cannot view your event revenue, financial settings, or full attendee contact lists; they only see the attendee's name, ticket tier, and pass status.",
          },
          {
            q: "How does the scanner alert staff when a pass is already used?",
            a: "The scanner screen immediately flashes high-contrast crimson red, plays a low-frequency double-buzz error tone via Web Audio, and vibrates the volunteer's phone, showing the exact time and entrance gate where the pass was previously checked in.",
          },
          {
            q: "Is there a limit on how many scanner devices can operate simultaneously?",
            a: "No. You can operate 2, 10, or 50+ scanner devices concurrently across multiple entrance gates, VIP doors, and meal counters with real-time atomic synchronization.",
          },
        ],
      }}
    />
  );
}
