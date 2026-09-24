import type { Metadata } from "next";
import {
  ScanLine,
  Smartphone,
  Volume2,
  Vibrate,
  ShieldCheck,
  Zap,
  WifiOff,
  Lock,
  Layers,
  CheckCircle2,
  BarChart3,
  QrCode,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Ticket Scanner — Sub-Second Smartphone Browser Gate Scanner",
  description:
    "Turn any iPhone or Android phone into a high-speed event gate scanner. Zero app download, Web Audio chimes, haptic feedback, PIN volunteer access, and offline sync.",
  keywords: [
    "qr ticket scanner",
    "event qr code scanner",
    "phone ticket scanner",
    "event gate check in app",
    "mobile qr scanner for events",
    "offline qr scanner event",
    "web based ticket scanner",
  ],
  alternates: { canonical: "https://urpass.space/qr-ticket-scanner" },
  openGraph: {
    title: "QR Ticket Scanner — Smartphone Browser Gate Check-In | URPASS",
    description:
      "Sub-second gate check-in on any phone browser. Web Audio chimes, haptic vibration, volunteer PIN links, and offline sync.",
    url: "https://urpass.space/qr-ticket-scanner",
    locale: "en_IN",
    type: "website",
  },
};

export default function QrTicketScannerPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/qr-ticket-scanner",
        badge: "HARDWARE-FREE GATE SCANNER",
        h1: "QR Ticket Scanner with Sub-Second Audio & Haptic Feedback",
        description:
          "Turn any volunteer's smartphone into an ultra-fast event entrance scanner. No App Store downloads, instant Web Audio chimes, haptic vibration cues, and offline sync.",
        ctaLabel: "Test scanner free",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is a Web-Based QR Ticket Scanner?",
          summary:
            "A web-based QR ticket scanner is an in-browser event access application that uses a smartphone's native camera to decode and validate digital attendee passes in real time. URPASS eliminates dedicated laser hardware rentals and native app store downloads by delivering a secure PIN-protected web scanner that operates directly inside Safari or Chrome, validating passes in under 0.3 seconds with distinct Web Audio chimes and haptic vibrations.",
          keyPoints: [
            "Sub-second validation (<0.3s) with synthesized Web Audio chimes and vibration cues",
            "Zero app installs: volunteers open a secure 4-digit PIN link in Safari or Chrome",
            "Built-in 1.5-second debounce preventing accidental double-scanning of the same QR",
            "Offline IndexedDB queue keeps gates moving during cellular or Wi-Fi dead zones",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Scanner Performance & Gate Hardware Specifications",
          subtitle: "Technical parameters of the URPASS browser scanner vs. native mobile apps and dedicated barcode guns.",
          headers: ["Operational Parameter", "URPASS Browser Scanner", "Dedicated Laser Scanner Guns"],
          rows: [
            {
              col1: "Hardware Deployment Cost",
              col2: "₹0 (Volunteers use personal iPhones or Android devices)",
              col3: "₹15,000–₹40,000 per event rental cost",
            },
            {
              col1: "Validation Latency",
              col2: "< 0.3 seconds per attendee pass",
              col3: "2.5 to 5.0 seconds per ticket",
            },
            {
              col1: "Audio & Haptic Feedback",
              col2: "Synthesized Web Audio (high chime / double low tone) + Navigator.vibrate",
              col3: "Harsh single-tone beeps with no haptic feedback",
            },
            {
              col1: "Staff Setup & Access",
              col2: "Scan a setup QR or enter 4-digit PIN link; no account login required",
              col3: "App download, user credentials, and 30-minute staff training",
            },
            {
              col1: "Double-Scan Debounce",
              col2: "Automated 1.5s scan lock preventing repeated audio triggers",
              col3: "No debounce; triggers rapid multiple beeps for one code",
            },
            {
              col1: "Offline Queue & Sync",
              col2: "Local IndexedDB check-in queue with automatic conflict reconciliation",
              col3: "Completely freezes when venue network fails",
            },
            {
              col1: "Multi-Gate Anti-Passback",
              col2: "Atomic DB locks prevent duplicate screenshot entry across gates",
              col3: "Delayed batch sync permits duplicate entries at other doors",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: ScanLine,
            title: "Sub-Second In-Browser Scanning",
            desc: "Decodes 2D QR passes in under 0.3 seconds directly inside mobile Safari or Chrome using hardware-accelerated WebAssembly.",
          },
          {
            icon: Volume2,
            title: "Synthesized Web Audio Chimes",
            desc: "High-frequency confirmation chime for valid passes; distinct double low-tone buzz for duplicate or invalid passes. No MP3 lag.",
          },
          {
            icon: Vibrate,
            title: "Haptic Vibration Feedback",
            desc: "Single 80ms tap confirms entry; triple pulse (150ms, 80ms, 150ms) warns of duplicate tickets so volunteers never miss a cue.",
          },
          {
            icon: Lock,
            title: "Secure PIN Volunteer Access",
            desc: "Volunteers access the gate scanner via a temporary 4-digit PIN link without accessing sensitive organizer data or account passwords.",
          },
          {
            icon: ShieldCheck,
            title: "Automated Scan Debounce",
            desc: "A built-in 1.5-second scan lock prevents repeated camera detections from sounding multiple alerts for the same ticket.",
          },
          {
            icon: WifiOff,
            title: "Offline-Resilient Operation",
            desc: "Scan attendees uninterrupted during basement network dropouts. Scans queue locally and sync automatically when signal restores.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Tested at High-Traffic Venue Entrances",
          description:
            "From college auditoriums to open-air festivals, URPASS equips volunteers to process up to 30 attendees per minute per gate lane.",
          type: "scanner",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Engineered for Indian Venues & Crowd Dynamics",
          subtitle: "Designed to overcome noisy lobbies, poor basement connectivity, and student volunteer turnover.",
          items: [
            {
              title: "Basement Auditorium Offline Mode",
              description:
                "Indian university auditoriums and hotel ballrooms often lack cellular service. Offline mode keeps gate lines moving.",
              badge: "Offline Ready",
            },
            {
              title: "Audible in Roaring Lobbies",
              description:
                "High-frequency synthesized audio chimes pierce through noisy crowd chatter, reducing volunteer eye strain.",
              badge: "Web Audio",
            },
            {
              title: "Rapid Volunteer Rotation",
              description:
                "When student volunteers rotate shifts at college fests, onboarding takes 30 seconds via a simple PIN link.",
              badge: "Zero-Install",
            },
            {
              title: "Multi-Gate Sync",
              description:
                "Deploy scanners across 10 gates simultaneously with synchronized anti-passback protection stopping screenshot sharing.",
              badge: "Multi-Gate",
            },
            {
              title: "Sound & Haptic Memory",
              description:
                "Scanner preserves volunteer mute/unmute preferences locally so settings persist across page reloads.",
              badge: "Local State",
            },
            {
              title: "Free Forever Tier",
              description:
                "Full scanner functionality included on the ₹0 free tier for up to 100 registrations per month.",
              badge: "₹0 Free",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "AUDIO & HAPTIC ARCHITECTURE",
            title: "Why Web Audio & Haptics Dramatically Accelerate Gate Check-In",
            paragraphs: [
              "At high-capacity event entrances, volunteer fatigue is the number one cause of gate delays. When volunteers are forced to keep their eyes locked on a phone screen to read tiny text confirmation messages, their scanning rhythm slows to 6 to 10 seconds per attendee, creating massive lines outside the venue.",
              "URPASS solves this by pairing visual indicators with instant audio and physical cues. Using the Web Audio API (synthesized directly on the device with zero network lag), valid scans emit a bright confirmation chime, while duplicates emit a double low tone. Concurrently, the browser triggers the device vibration motor: a crisp 80ms tap for entry, or an unmistakable 150-80-150ms warning pulse for fraud.",
              "This multisensory feedback allows volunteers to keep their eyes on the approaching queue and crowd flow, glancing at the phone screen only when an amber or red warning occurs. Gate throughput immediately increases to 25–30 attendees per minute per volunteer lane.",
            ],
            bullets: [
              "Web Audio API generates tones instantly without fetching heavy MP3 files",
              "Audio context unlocked seamlessly when volunteer taps 'Start Scanning'",
              "80ms haptic confirmation provides physical feedback in loud environments",
              "1.5-second debounce stops jitter and repeated camera triggers on the same pass",
            ],
            takeaway:
              "Clear audible and haptic feedback cuts volunteer cognitive load and doubles entrance throughput in loud, crowded venue environments.",
          },
          {
            badge: "VOLUNTEER SECURITY",
            title: "Hardware-Free Gate Access Without Sharing Admin Passwords",
            paragraphs: [
              "Event organizers frequently face a security dilemma: they need 15 temporary volunteers to scan tickets at the door, but they do not want to give volunteers access to ticket revenue, attendee contact databases, or event settings.",
              "URPASS provides gate-specific, PIN-protected scanner access links. Organizers generate a scanner link with an optional 4-digit PIN code. Volunteers open this link on their personal iPhones or Android devices. The interface displays only the camera viewfinder, sound controls, and immediate scan validation results. Volunteers cannot edit event settings, view financials, or access other gates.",
            ],
            bullets: [
              "Volunteers use their existing phones; zero hardware rental fees",
              "Access restricted exclusively to the camera viewfinder and gate verification",
              "PIN-protected links can be revoked or regenerated instantly from the dashboard",
              "Gate assignment tags route VIPs, General attendees, and Press to specific doors",
            ],
            takeaway:
              "Role-based scanner links give organizers military-grade security while empowering volunteer teams to scan passes with zero friction.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS Scanner vs. Native Check-In Apps & Hardware Guns",
          subtitle: "Compare scanner setup time, hardware costs, battery consumption, and offline sync.",
          competitorName: "Native Apps / Dedicated Hardware",
          sourceCitations: [
            "Official competitor app store requirements",
            "URPASS benchmark metrics & offline scanner specifications",
          ],
          rows: [
            {
              criteria: "Installation Requirement",
              urpass: "Zero install — opens directly in mobile Safari or Chrome",
              competitor: "Mandatory App Store/Play Store download (50MB+)",
              urpassAdvantage: true,
            },
            {
              criteria: "Staff Account Creation",
              urpass: "None (Secure 4-digit PIN link access)",
              competitor: "Requires individual staff accounts and password logins",
              urpassAdvantage: true,
            },
            {
              criteria: "Audio & Vibration Cues",
              urpass: "Web Audio chime + Navigator.vibrate haptic pulses",
              competitor: "Generic phone notification beeps or silent",
              urpassAdvantage: true,
            },
            {
              criteria: "Validation Speed",
              urpass: "< 0.3s sub-second optical detection",
              competitor: "2.0 to 4.0 seconds per ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "Offline Gate Operation",
              urpass: "IndexedDB buffer with automatic conflict reconciliation",
              competitor: "Stops functioning when venue internet drops",
              urpassAdvantage: true,
            },
            {
              criteria: "Hardware Cost",
              urpass: "₹0 (Any smartphone browser)",
              competitor: "₹15,000–₹40,000 hardware rental fees",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "College Cultural Fests & Symposiums",
          "Tech Conferences & Summits",
          "Inter-College Hackathons",
          "Hands-On Masterclasses & Bootcamps",
          "Music Festivals & Stadium Concerts",
          "Corporate Townhalls & Annual Meets",
          "Exhibitions & Industry Trade Expos",
          "Community Meetups & Sports Tournaments",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "QR Ticketing System (Master Pillar)",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "How QR Ticket Validation Works",
            href: "/how-qr-ticket-validation-works",
            category: "Guide",
          },
          {
            title: "Event Ticketing Software",
            href: "/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Event Registration Software",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "College Event Ticketing Platform",
            href: "/event-ticketing-platform-for-college-events",
            category: "Use Case",
          },
          {
            title: "Guide: Check in 1,000 Attendees Quickly",
            href: "/guides/how-to-check-in-1000-attendees-quickly",
            category: "Guide",
          },
          {
            title: "Guide: Prevent Duplicate Event Entry",
            href: "/guides/prevent-duplicate-event-entry",
            category: "Guide",
          },
          {
            title: "Event Ticketing Software India",
            href: "/in",
            category: "Location",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Do gate staff need to download an app from Google Play or the App Store?",
            a: "No! The URPASS QR ticket scanner operates entirely inside any modern mobile browser, including Safari on iOS and Chrome on Android. Volunteers simply open a secure link or scan a PIN setup code provided by the organizer.",
          },
          {
            q: "How does the scanner provide sound and vibration feedback?",
            a: "The scanner uses the native Web Audio API to synthesize tones directly on the device with zero lag (a bright confirmation chime for success, or a double low warning tone for duplicate/invalid passes) and triggers the device vibration motor (80ms tap for entry, or 150-80-150ms for errors).",
          },
          {
            q: "Can volunteers accidentally scan the same QR code five times in a row?",
            a: "No. URPASS includes an automatic 1.5-second scan lock/debounce immediately following a scan result. This prevents the camera from repeatedly scanning the same QR code and producing redundant sounds or duplicate alerts.",
          },
          {
            q: "What happens if the entrance lobby loses Wi-Fi or cellular signal?",
            a: "The scanner features an offline mode. When online, the scanner caches the attendee manifest locally in IndexedDB. If the connection drops, passes continue to be scanned and verified locally, and all check-in logs sync back to the cloud automatically once signal returns.",
          },
          {
            q: "Can volunteers see private event revenue or sensitive attendee information?",
            a: "No. Scanner PIN links grant access exclusively to the optical scanning viewfinder and immediate pass verification results. Volunteers cannot view event revenue, access settings, or export attendee data.",
          },
          {
            q: "Can I mute the scanner audio if the venue requires silence?",
            a: "Yes. There is a speaker toggle (🔊 / 🔇) in the scanner header. Tapping it mutes audio playback while maintaining visual alerts and haptic vibration, and the preference is saved locally on the volunteer's phone.",
          },
        ],

        ctaTitle: "Equip your gate volunteers in 30 seconds",
        ctaDescription:
          "Zero app installs · Sub-second audio/haptic feedback · Works offline · Built for speed",
      }}
    />
  );
}
