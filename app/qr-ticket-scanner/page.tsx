import type { Metadata } from "next";
import {
  ScanLine,
  Volume2,
  Vibrate,
  ShieldCheck,
  WifiOff,
  Lock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Ticket Scanner for Event Check-In | UrPass",
  description:
    "Use a supported smartphone browser to scan UrPass event QR tickets. Manage gate access, duplicate scans, and offline synchronization from the existing event workflow.",
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
    title: "QR Ticket Scanner — Smartphone Event Check-In | UrPass",
    description:
      "Scan UrPass passes with a supported smartphone browser, with visual feedback, staff access controls, and offline synchronization.",
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
        h1: "QR Ticket Scanner for Smartphone Gate Check-In",
        description:
          "Use a supported smartphone browser to scan event QR passes. Staff can see validation results, detect duplicate scans, and sync offline check-ins when connectivity returns.",
        ctaLabel: "Test scanner free",
        secondaryCtaLabel: "Read the Check-In Guide",
        secondaryCtaHref: "/guides/how-does-qr-event-check-in-work",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is a Web-Based QR Ticket Scanner?",
          summary:
            "A web-based QR ticket scanner uses a phone camera to read an attendee's digital pass and check its status against the event's records. UrPass offers a browser-based scanner for authorized staff, with visual results and supported audio or vibration cues. Offline scans can be queued for later synchronization; staff should review any conflicts after the device reconnects.",
          keyPoints: [
            "Visual validation with audio and vibration cues on supported devices",
            "Authorized staff can open the scanner in a supported mobile browser",
            "Scan controls reduce accidental repeat reads of the same QR",
            "Offline IndexedDB queue keeps gates moving during cellular or Wi-Fi dead zones",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Scanner Workflow at a Glance",
          subtitle: "Check the device, network, and staff access requirements before event day.",
          headers: ["Operational Parameter", "UrPass Browser Scanner", "Event-day consideration"],
          rows: [
            {
              col1: "Hardware Deployment Cost",
              col2: "Uses a supported smartphone camera",
              col3: "Organizers supply devices and venue staff",
            },
            {
              col1: "Validation Latency",
              col2: "Varies by device, lighting, and network",
              col3: "Test the setup at the actual venue",
            },
            {
              col1: "Audio & Haptic Feedback",
              col2: "Visual feedback, with audio and vibration where supported",
              col3: "Keep the screen visible in noisy areas",
            },
            {
              col1: "Staff Setup & Access",
              col2: "Use organizer-configured staff access",
              col3: "Grant only the access needed for each gate",
            },
            {
              col1: "Double-Scan Debounce",
              col2: "Controls repeated camera detections",
              col3: "Review the result before admitting an attendee",
            },
            {
              col1: "Offline Queue & Sync",
              col2: "Queues supported offline scans for later sync",
              col3: "Resolve any sync conflicts after reconnecting",
            },
            {
              col1: "Multi-Gate Anti-Passback",
              col2: "Flags subsequent use of a checked-in pass when records are synchronized",
              col3: "Offline gates require a conflict review after sync",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: ScanLine,
            title: "In-Browser Scanning",
            desc: "Reads UrPass QR passes with a supported smartphone camera and shows the validation result to staff.",
          },
          {
            icon: Volume2,
            title: "Synthesized Web Audio Chimes",
            desc: "High-frequency confirmation chime for valid passes; distinct double low-tone buzz for duplicate or invalid passes. No MP3 lag.",
          },
          {
            icon: Vibrate,
            title: "Haptic Vibration Feedback",
            desc: "Supported devices can provide vibration feedback alongside the visible scan result.",
          },
          {
            icon: Lock,
            title: "Secure PIN Volunteer Access",
            desc: "Volunteers access the gate scanner via a temporary 4-digit PIN link without accessing sensitive organizer data or account passwords.",
          },
          {
            icon: ShieldCheck,
            title: "Automated Scan Debounce",
            desc: "Scan controls help prevent repeated camera detections from triggering extra alerts.",
          },
          {
            icon: WifiOff,
            title: "Offline-Resilient Operation",
            desc: "Scan attendees uninterrupted during basement network dropouts. Scans queue locally and sync automatically when signal restores.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "SCANNER WORKFLOW",
          title: "Preview the UrPass Gate Scanner",
          description:
            "Review the scanner interface and test your devices, lighting, network, and staff access before the event.",
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
                "Audio cues can help staff notice scan results, but the screen should remain visible in noisy areas.",
              badge: "Web Audio",
            },
            {
              title: "Rapid Volunteer Rotation",
              description:
                "Organizers can prepare staff access before shifts change and train volunteers on valid, duplicate, and offline results.",
              badge: "Zero-Install",
            },
            {
              title: "Multi-Gate Sync",
              description:
                "Multiple authorized gates can use the same event records. Offline scans need conflict review after synchronization.",
              badge: "Multi-Gate",
            },
            {
              title: "Sound & Haptic Memory",
              description:
                "Scanner preserves volunteer mute/unmute preferences locally so settings persist across page reloads.",
              badge: "Local State",
            },
            {
              title: "0% Commission Ticketing",
              description:
                "The Free Forever plan includes QR passes and scanning for up to 100 registrations per event, subject to current plan limits.",
              badge: "₹0 Free",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "AUDIO & HAPTIC ARCHITECTURE",
            title: "How Audio and Vibration Support Gate Staff",
            paragraphs: [
              "At a busy entrance, staff need a clear result for each pass. The scanner presents a visual status and can provide sound or vibration cues when the browser and device support them.",
              "Staff should still read the result before admitting someone. Audio can be hard to hear in a noisy venue, and vibration is not available on every device.",
              "Run a gate rehearsal with the actual phones, lighting, network, and volunteer team to estimate your event's throughput.",
            ],
            bullets: [
              "Visual status remains the primary admission signal",
              "Audio and vibration depend on browser and device support",
              "Scan controls reduce accidental repeated reads",
              "Rehearse the workflow with your venue staff before opening gates",
            ],
            takeaway:
              "Clear feedback helps staff follow a consistent check-in procedure; actual speed varies by event setup.",
          },
          {
            badge: "VOLUNTEER SECURITY",
            title: "Hardware-Free Gate Access Without Sharing Admin Passwords",
            paragraphs: [
              "Organizers may need temporary gate staff to validate tickets without giving them broader dashboard access.",
              "URPASS provides gate-specific, PIN-protected scanner access links. Organizers generate a scanner link with an optional 4-digit PIN code. Volunteers open this link on their personal iPhones or Android devices. The interface displays only the camera viewfinder, sound controls, and immediate scan validation results. Volunteers cannot edit event settings, view financials, or access other gates.",
            ],
            bullets: [
              "Staff can use supported smartphones supplied by the organizer or venue",
              "Access restricted exclusively to the camera viewfinder and gate verification",
              "Organizers can manage scanner access from the dashboard",
              "Gate assignments can be configured for the event's entry workflow",
            ],
            takeaway:
              "Configure staff access in advance and review gate permissions before the event.",
          },
        ],

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
            href: "/event-ticketing-software-india",
            category: "Product",
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
            a: "The scanner shows a visual status and can play audio or vibrate when the device and browser support those cues. Staff should always confirm the visible result before admitting an attendee.",
          },
          {
            q: "Can volunteers accidentally scan the same QR code five times in a row?",
            a: "The scanner has controls that reduce repeated camera reads. A later scan of an already checked-in pass is shown as a duplicate, so staff should review each result.",
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

        ctaTitle: "Prepare your gate scanner before event day",
        ctaDescription:
          "Browser-based scanning · Staff access controls · Offline sync workflow",
      }}
    />
  );
}
