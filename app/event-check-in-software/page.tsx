import type { Metadata } from "next";
import { ScanLine, Smartphone, ShieldCheck, Users, Clock, BarChart3, Zap, Lock, AlertTriangle } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Check-In Software with QR Scanning | URPASS",
  description: "Check in attendees using QR codes, validate event passes and track attendance with URPASS event check-in software.",
  keywords: [
    "event check-in software",
    "QR check-in system",
    "attendee check-in",
    "event check-in app",
    "QR ticket scanner",
    "gate check-in software",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-check-in-software" },
  openGraph: {
    title: "Event Check-In Software with QR Scanning | URPASS",
    description: "Check in attendees using QR codes, validate event passes and track attendance with URPASS event check-in software.",
    url: "https://urpass.space/event-check-in-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT CHECK-IN SOFTWARE",
        h1: "Faster Event Check-In. Shorter Queues.",
        canonicalUrl: "https://urpass.space/event-check-in-software",
        description: "Scan attendee QR passes, validate entry and record attendance through a simple event-day check-in workflow.",
        ctaLabel: "Set Up QR Check-In",
        features: [
          { icon: ScanLine, title: "Browser-Based QR Camera Scanner", desc: "No App Store or Google Play download required. Staff open a secure scanner link directly in mobile Safari or Chrome." },
          { icon: Smartphone, title: "Sub-0.3s Verification Speed", desc: "High-contrast QR recognition decodes passes instantaneously, even on dim phone screens, cracked glass, or printed badges." },
          { icon: ShieldCheck, title: "Cryptographic Duplicate Lockout", desc: "If an attendee shares or screenshots a pass, subsequent scan attempts trigger an immediate high-contrast duplicate warning." },
          { icon: Users, title: "Multi-Gate Cloud Sync", desc: "Deploy 2, 5, or 20 scanning lanes simultaneously with instant real-time synchronization across all volunteer devices." },
          { icon: Clock, title: "Instant Name & Email Fallback", desc: "If an attendee's phone battery runs out, staff can search by name, email, or registration ID to check them in manually." },
          { icon: BarChart3, title: "Live Headcount Dashboard", desc: "Track entrance velocity, peak arrival curves, and remaining venue capacity in real time from any organizer screen." },
        ],
        steps: [
          { n: "01", title: "Open Scanner URL", desc: "Access the scanner interface or send staff a PIN-protected scanner link." },
          { n: "02", title: "Allow Camera Access", desc: "Enable camera permission in the mobile browser with zero app installation." },
          { n: "03", title: "Point at Pass", desc: "Aim phone camera at attendee digital pass or printed badge for instant capture." },
          { n: "04", title: "Instant Visual Confirmation", desc: "Screen displays green banner with attendee name and ticket tier." },
          { n: "05", title: "Live Attendance Logged", desc: "Arrival timestamp is permanently recorded, preventing duplicate reuse." },
        ],
        callout: {
          badge: "ZERO BOTTLENECK ENTRY",
          title: "Eliminate entrance chaos, printed paper sheets, and rented hardware.",
          description: "Manual paper checklists cause massive entrance queues, misplaced attendee names, and unauthorized entries. URPASS turns any volunteer's personal smartphone into an enterprise-grade check-in scanner capable of processing 1,000 attendees in minutes.",
          bullets: [
            "Sub-0.3 second scanning speed — check in up to 30 attendees per minute per lane",
            "Zero equipment rental costs — works on any modern iOS or Android smartphone",
            "Multi-gate coordination with immediate global duplicate pass lockout",
            "Timestamped audit trails with downloadable CSV attendance logs",
          ],
        },
        deepDiveSections: [
          {
            badge: "SCANNING VELOCITY",
            title: "The Anatomy of a Sub-Second QR Check-In",
            paragraphs: [
              "Entrance queues form when scanner software is slow, cameras fail to focus quickly, or devices lag while communicating with slow databases. At a 1,000-person conference or college fest, a delay of just 5 seconds per attendee creates a 30-minute queue outside your venue doors.",
              "URPASS check-in software is engineered for maximum throughput. Built on lightweight client-side QR decoding, the camera stream continuously analyzes video frames in the browser without sending uncompressed video to a server.",
              "The moment a valid QR token is detected, an encrypted payload verifies against the live cloud database in under 0.3 seconds. Staff receive an immediate high-contrast visual cue (green banner for valid admission, red banner with duplicate warning) allowing uninterrupted line progression."
            ],
            bullets: [
              "Continuous camera stream decoding without manual shutter clicks",
              "Audible feedback tones for rapid, eyes-free gate processing",
              "Works under bright daylight, outdoor sunlight, or dim indoor halls",
              "Zero latency penalty when scaling to dozens of concurrent scanners"
            ],
            takeaway: "High-speed camera decoding allows gate volunteers to process 1,000 attendees across 4 volunteer phones in roughly 10 minutes."
          },
          {
            badge: "EVENT SECURITY",
            title: "Multi-Gate Synchronization and Anti-Fraud Guard",
            paragraphs: [
              "Pass sharing is the most common vulnerability at ticketed and capacity-limited events. Attendees frequently screenshot their digital pass and message it to friends waiting outside or at another entrance gate.",
              "URPASS solves this through atomic state management. Every pass contains an encrypted single-use token. When Gate 1 scans the code, the pass record is atomically marked as used in the database.",
              "If the same QR pass is presented at Gate 2 three seconds later, Gate 2's scanner instantly flashes red, displaying the exact timestamp, device, and entrance gate where the pass was originally admitted. Gate crashers and shared passes are stopped dead at the door."
            ],
            bullets: [
              "Atomic database locking prevents simultaneous entry at multiple gates",
              "Displays original check-in timestamp and staff device on re-scan",
              "Restricted volunteer access links protect financial and sensitive attendee records",
              "Full compliance logs showing check-in velocity and gate load"
            ],
            takeaway: "Cryptographic single-use validation completely eliminates pass forwarding, forged credentials, and gate-jumping fraud."
          }
        ],
        useCases: [
          "Conference Registration Desks",
          "College Fest Main Gate Entrances",
          "Auditorium & Keynote Turnstiles",
          "Hands-On Workshop Entrances",
          "VIP Backstage & Speaker Lounges",
          "Trade Show & Exhibition Halls",
          "Hackathon Late-Night Access Checkpoints",
        ],
        relatedLinks: [
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Event Registration Platform", href: "/event-registration-platform", category: "Product" },
          { title: "Event Access Control", href: "/event-access-control", category: "Product" },
          { title: "How to Check In 1,000 Attendees Quickly", href: "/guides/how-to-check-in-1000-attendees-quickly", category: "Guide" },
          { title: "How Does QR Event Check-In Work?", href: "/guides/how-does-qr-event-check-in-work", category: "Guide" },
          { title: "Event Check-In Software Mumbai", href: "/in/mumbai", category: "Location" },
        ],
        faqs: [
          { q: "What is event check-in software?", a: "Event check-in software is a digital platform used by event staff to verify tickets, check in attendees at venue doors, prevent duplicate admissions, and record real-time attendance figures." },
          { q: "Do volunteers need to install an app from the App Store or Google Play?", a: "No. URPASS runs completely within mobile web browsers (Safari, Chrome, Firefox). Volunteers simply open a secure link, allow camera access, and begin scanning immediately." },
          { q: "What happens if an attendee presents a screenshot of a used pass?", a: "The moment a pass is scanned, its status permanently changes to 'Checked In'. Any subsequent scan attempt triggers an immediate red 'Already Checked In' warning with the original check-in timestamp." },
          { q: "Can we have staff scanning at multiple doors simultaneously?", a: "Yes. You can deploy unlimited scanning devices across multiple entrance gates. All check-ins synchronize in real time across the cloud database." },
          { q: "What happens if an attendee's phone battery is dead?", a: "Staff can use the built-in manual lookup feature inside the scanner interface to search by attendee name, email address, or registration ID and check them in manually." },
          { q: "Is there a limit on how many attendees we can check in?", a: "The permanent free tier includes 100 registrations per month. Paid plans scale from 500 up to unlimited registrations and check-ins." },
        ],
        ctaTitle: "Experience sub-second check-in today",
        ctaDescription: "Set up in 5 minutes · Permanent free tier · 30-day free trial on paid plans",
      }}
    />
  );
}
