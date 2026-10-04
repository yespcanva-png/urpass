import type { Metadata } from "next";
import { BarChart3, Lock, ScanLine, Smartphone, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Check-In App with QR Scanner | URPASS",
  description: "Fast event check-in app with QR code scanner. Turn volunteer smartphones into instant entrance scanners with <0.3s validation and zero app downloads.",
  keywords: ["event check in app", "qr code scanner for events", "event check-in software", "mobile ticket scanner app", "event entrance scanner", "smartphone qr check-in"],
  alternates: {
    canonical: "https://urpass.space/event-check-in-app",
  },
  openGraph: {
    title: "Event Check-In App with QR Scanner | URPASS",
    description: "Fast event check-in app with QR code scanner. Turn volunteer smartphones into instant entrance scanners with <0.3s validation and zero app downloads.",
    url: "https://urpass.space/event-check-in-app",
    locale: "en_US",
    type: "website",
  },
};

export default function EventCheckInAppPage() {
  return (
    <SEOPage
      config={{
  "badge": "ZERO-DOWNLOAD SCANNER APP",
  "h1": "Event Check-In App with QR Scanner",
  "canonicalUrl": "https://urpass.space/event-check-in-app",
  "description": "Fast event check-in app with QR code scanner. Turn volunteer smartphones into instant entrance scanners with <0.3s validation and zero app downloads.",
  "ctaLabel": "Start Scanning Tickets Free →",
  "ctaTitle": "Turn Any Smartphone into an Instant Event Scanner",
  "ctaDescription": "No app store downloads, no account setup for volunteers, and sub-0.3s camera check-in directly in mobile web browsers. Free to use.",
  "directAnswer": {
    "title": "What is the URPASS Event Check-In App?",
    "summary": "The URPASS event check-in app is a lightweight, browser-based QR scanner that turns any volunteer's smartphone into an entrance scanner in seconds. It requires zero app store downloads, validates digital and printed QR passes in under 0.3 seconds, blocks duplicate entries atomically, and works offline during venue Wi-Fi drops.",
    "keyPoints": [
      "Zero app store downloads: volunteers simply open a secure web link",
      "Sub-second (<0.3s) camera recognition from up to 30cm away",
      "Instant audio chime and visual confirmation (green valid / red invalid)",
      "Full offline memory caching for venues with poor cellular reception"
    ]
  },
  "whatIs": {
    "title": "What is an Event Check-In App?",
    "definition": "An event check-in app is an entrance access management tool that scans and verifies attendee credentials at venue doors. While traditional check-in apps require downloading heavy native applications from app stores, modern web-based scanner apps run directly in mobile Safari or Chrome.",
    "details": [
      "Eliminates 30 minutes of volunteer setup and app store download friction",
      "Replaces bulky rented barcode scanners with volunteers' personal smartphones",
      "Synchronizes multi-door scanning in real time to prevent duplicate ticket reuse",
      "Provides live arrival stats and gate velocity telemetry on the organizer dashboard"
    ]
  },
  "howItWorksTitle": "How the Scanner App Works",
  "howItWorksSubtitle": "From volunteer setup to live gate scanning in 15 seconds.",
  "steps": [
    {
      "n": "01",
      "title": "Generate scanner link",
      "desc": "Create a private scanner link from your organizer dashboard."
    },
    {
      "n": "02",
      "title": "Send link to volunteers",
      "desc": "Share the link with door staff via WhatsApp, SMS, or Slack."
    },
    {
      "n": "03",
      "title": "Open in phone browser",
      "desc": "Staff open the link in Safari or Chrome. No app download or logins required."
    },
    {
      "n": "04",
      "title": "Allow camera access",
      "desc": "Grant one-click camera permissions to activate the high-speed viewfinder."
    },
    {
      "n": "05",
      "title": "Scan attendee passes",
      "desc": "Point the camera at passes. Validates in <0.3s with green audio and visual feedback."
    },
    {
      "n": "06",
      "title": "Sync across all gates",
      "desc": "Scans sync in under 150ms to prevent duplicate ticket sharing across doors."
    }
  ],
  "featuresTitle": "Built for Entrance Speed and Volunteer Simplicity",
  "featuresSubtitle": "Sub-second camera scans, offline resilience, and zero hardware costs.",
  "features": [
    {
      icon: Smartphone,
      "title": "Zero App Store Downloads",
      "desc": "Runs smoothly in mobile Safari and Chrome. Volunteers start scanning within 15 seconds of receiving the link."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Camera Scan Speed",
      "desc": "Camera decodes QR passes from 30cm away in under 0.3 seconds. Admit 45+ attendees per minute per volunteer."
    },
    {
      icon: Lock,
      "title": "Atomic Duplicate Protection",
      "desc": "Scanned passes are immediately locked in the cloud. Duplicate attempts display a vibrant red screen and buzz."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "Pre-cached guest manifests ensure volunteers can continue scanning passes during venue signal drops."
    },
    {
      icon: Users,
      "title": "Manual Search Fallback",
      "desc": "Built-in search bar allows door staff to look up attendees by name, email, or booking reference if their phone dies."
    },
    {
      icon: BarChart3,
      "title": "Live Headcount Updates",
      "desc": "Real-time count of checked-in guests versus total registrants displayed directly on the scanner screen."
    }
  ],
  "whoShouldUse": {
    "title": "Who Needs an Event Check-In App?",
    "subtitle": "Built for event teams who want frictionless door operations.",
    "personas": [
      {
        "badge": "CONFERENCES",
        "title": "Conference Organizers",
        "desc": "Clear morning foyer crowds quickly and verify delegate credential tiers."
      },
      {
        "badge": "UNIVERSITIES",
        "title": "College Fests & Student Balls",
        "desc": "Stop ticket fraud and student pass-sharing with atomic QR check-in locks."
      },
      {
        "badge": "WORKSHOPS",
        "title": "Workshop Instructors & Trainers",
        "desc": "Verify reserved seat holders in seconds so instructional classes start on time."
      },
      {
        "badge": "COMMUNITY",
        "title": "Meetup & Community Leaders",
        "desc": "Welcome members professionally with digital passes instead of paper clipboards."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How the Scanner Validates Passes",
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
    "title": "URPASS Browser App vs Native Check-In Apps",
    "subtitle": "Why browser-based mobile scanning is faster for event teams.",
    "headers": [
      "Feature / Metric",
      "URPASS Browser Scanner",
      "Legacy Native Scanner Apps"
    ],
    "rows": [
      {
        "col1": "App Store Download",
        "col2": "Zero downloads; runs in mobile browser",
        "col3": "Requires 100MB+ app store download"
      },
      {
        "col1": "Volunteer Setup Time",
        "col2": "15 seconds; click a web link and scan",
        "col3": "15 to 30 minutes creating accounts and passwords"
      },
      {
        "col1": "Scan Response Time",
        "col2": "<0.3s instant camera recognition",
        "col3": "2 to 4s requiring screen tap confirmations"
      },
      {
        "col1": "Offline Resilience",
        "col2": "Automatic memory caching",
        "col3": "Prone to crashing or displaying sync errors"
      }
    ]
  },
  "faqs": [
    {
      "q": "Do volunteers need to download an app from the App Store or Google Play?",
      "a": "No! URPASS operates as a high-performance web app directly in mobile Safari or Chrome. Volunteers just open a secure link and start scanning."
    },
    {
      "q": "How fast does the camera scan tickets?",
      "a": "URPASS scans QR passes in under 0.3 seconds from up to 30cm away, enabling door volunteers to admit 40 to 50 attendees per minute."
    },
    {
      "q": "Does the scanner app work if the venue loses internet connection?",
      "a": "Yes. The scanner app pre-loads attendee records into browser memory, allowing volunteers to continue scanning offline without interruption."
    },
    {
      "q": "Can multiple volunteers scan tickets at the same time?",
      "a": "Yes. You can deploy unlimited volunteer scanners across multiple doors. Scans sync in real time to prevent duplicate entry attempts."
    },
    {
      "q": "What if an attendee's phone battery dies?",
      "a": "The scanner includes a fast manual search bar that lets volunteers look up attendees by name or email in seconds."
    },
    {
      "q": "Does the check-in app require downloading from the App Store or Google Play?",
      "a": "No. It is a Progressive Web App (PWA) that runs instantly in Safari, Chrome, or any mobile browser, saving volunteers from downloading large apps."
    },
    {
      "q": "Does the check-in app drain phone battery quickly?",
      "a": "No. The scanning engine is optimized for low CPU and GPU usage with smart camera sleep intervals between attendees."
    }
  ],
  "relatedLinks": [
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    },
    {
      "title": "Event Entry Management & QR Access Control",
      "href": "/event-entry-management-software",
      "category": "Product"
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
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
      "category": "Product"
    }
  ]
}}
    />
  );
}
