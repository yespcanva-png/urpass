import type { Metadata } from "next";
import { Banknote, BarChart3, FileText, Lock, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Conference Registration Software with QR Check-In | URPASS",
  description: "Conference registration software with custom delegate passes, multi-tier ticket categories, B2B invoicing, sub-second QR check-in, and real-time attendance.",
  keywords: ["conference registration software", "conference ticketing platform", "delegate registration software", "conference badge check-in", "academic conference registration", "b2b summit ticketing", "conference qr code scanner"],
  alternates: {
    canonical: "https://urpass.space/conference-registration-software",
  },
  openGraph: {
    title: "Conference Registration Software with QR Check-In | URPASS",
    description: "Conference registration software with custom delegate passes, multi-tier ticket categories, B2B invoicing, sub-second QR check-in, and real-time attendance.",
    url: "https://urpass.space/conference-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function ConferenceRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "CONFERENCE & SUMMIT EDITION",
  "h1": "Conference Registration Software with QR Check-In",
  "canonicalUrl": "https://urpass.space/conference-registration-software",
  "description": "Conference registration software with custom delegate passes, multi-tier ticket categories, B2B invoicing, sub-second QR check-in, and real-time attendance.",
  "ctaLabel": "Create Your Conference Free →",
  "ctaTitle": "Power Frictionless Entry at Your Next Conference",
  "ctaDescription": "Set up multi-tier delegate registration, issue dynamic digital QR passes, and admit hundreds of attendees per minute with volunteer phones. Zero commission.",
  "directAnswer": {
    "title": "What is URPASS Conference Registration Software?",
    "summary": "URPASS is conference registration and QR check-in software that streamlines delegate registration, multi-tier ticket categories, approval workflows, digital badge passes, and multi-door entrance scanning. Built for academic summits, medical congresses, and B2B conventions, it eliminates foyer bottlenecks with sub-0.3s smartphone camera scanning and live attendance analytics.",
    "keyPoints": [
      "Multi-tier registration: General, VIP, Speaker, Sponsor, and Student delegate categories",
      "Instant digital QR badge delivery via email, web link, or mobile wallet",
      "Sub-second (<0.3s) camera check-in across multiple auditorium doors",
      "0% platform ticketing commission with automated B2B tax receipts"
    ]
  },
  "whatIs": {
    "title": "What is Conference Registration Software?",
    "definition": "Conference registration software is a digital event management solution designed to handle complex delegate workflows. It manages multi-track agendas, tiered pricing, custom intake questions (such as dietary needs, institutional affiliations, and session tracks), automated pass issuance, and high-speed door credential verification.",
    "details": [
      "Replaces paper badge tables with digital mobile credentials and instant smartphone check-in",
      "Provides role-based access for conference organizers, session chairs, and volunteer door staff",
      "Synchronizes multiple entrance gates in real time to prevent pass duplication or pass sharing",
      "Captures verified arrival timestamps to generate accredited CPD and attendance certificates"
    ]
  },
  "howItWorksTitle": "How URPASS Works for Conference Registration",
  "howItWorksSubtitle": "From delegate signup to synchronized hall check-in in six steps.",
  "steps": [
    {
      "n": "01",
      "title": "Configure conference tiers",
      "desc": "Set VIP, speaker, regular delegate, and student ticket categories with custom registration fields."
    },
    {
      "n": "02",
      "title": "Delegates register online",
      "desc": "Attendees register through a branded, mobile-responsive page with instant confirmation."
    },
    {
      "n": "03",
      "title": "Approve or accept payment",
      "desc": "Process payments with 0% platform commission or route through an organizer approval queue."
    },
    {
      "n": "04",
      "title": "Issue digital QR passes",
      "desc": "Each delegate receives a personalized digital pass with their name, tier, and encrypted QR code."
    },
    {
      "n": "05",
      "title": "Scan at multiple gates",
      "desc": "Door teams scan delegate passes using phone cameras in <0.3s across all hall entrances."
    },
    {
      "n": "06",
      "title": "Track live attendance",
      "desc": "Monitor arrival curves, room capacities, and track check-ins live from your organizer dashboard."
    }
  ],
  "featuresTitle": "Conference Capabilities Engineered for Scale",
  "featuresSubtitle": "Everything needed to manage delegate credentials and venue entrances.",
  "features": [
    {
      icon: Users,
      "title": "Multi-Tier Delegate Passes",
      "desc": "Configure distinct pass types for keynote speakers, VIPs, regular delegates, exhibitors, and press with visual tier badges."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Camera Check-In",
      "desc": "Turn any volunteer phone into a high-speed scanner. Validate 45+ delegates per minute per scanner line without foyer queues."
    },
    {
      icon: Lock,
      "title": "Atomic Multi-Gate Sync",
      "desc": "Synchronize scanning across 20+ entrance doors in under 150ms. Passes scanned at Gate A cannot be reused at Gate B."
    },
    {
      icon: FileText,
      "title": "Custom Delegate Intake",
      "desc": "Capture organization names, job titles, dietary preferences, accessibility needs, and workshop session selections."
    },
    {
      icon: BarChart3,
      "title": "Real-Time Room Capacities",
      "desc": "Track session room headcounts live to ensure compliance with venue fire regulations and hall capacity limits."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Keep 100% of high-value conference ticket revenue. No per-ticket percentage cuts eating into summit budgets."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use Conference Registration Software?",
    "subtitle": "Trusted across academic, corporate, and scientific summit organizers.",
    "personas": [
      {
        "badge": "ACADEMIC",
        "title": "Academic & Scientific Congresses",
        "desc": "Peer-reviewed research conferences, university symposiums, and faculty colloquiums needing verified attendance."
      },
      {
        "badge": "B2B TECH",
        "title": "Developer & Tech Summits",
        "desc": "Multi-track developer conferences, cloud summits, and AI expos requiring fast morning entrance throughput."
      },
      {
        "badge": "MEDICAL",
        "title": "Medical & Healthcare Conventions",
        "desc": "CME-accredited medical congresses requiring audit-ready check-in logs and custom specialty credentials."
      },
      {
        "badge": "ASSOCIATIONS",
        "title": "Industry Associations & Institutes",
        "desc": "Annual member conventions, leadership forums, and trade symposiums with member-rate ticket validation."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Conference QR Check-In Works",
    "subtitle": "Sub-second camera scanning with multi-gate atomic locks.",
    "description": "Each registered delegate receives an encrypted 2D QR pass containing their unique registration ID and credential tier. Volunteer door staff open the scanner URL in Safari or Chrome on their smartphones. When pointed at a delegate's screen or printed lanyard badge, the camera validates the pass in <0.3s, displays their name and tier (e.g., 'VIP Delegate'), sounds an audible chime, and records the gate arrival timestamp in the central cloud registry.",
    "points": [
      "Zero scanner hardware rentals: runs smoothly on any smartphone camera.",
      "Atomic row-locking prevents shared pass screenshots between delegates.",
      "Offline resilience allows continued check-in during convention hall Wi-Fi outages.",
      "Instant search bar enables rapid manual lookup by name or organization."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Traditional Conference Check-In",
    "subtitle": "How URPASS replaces badge printing chaos and rented scanners.",
    "headers": [
      "Conference Metric",
      "Traditional Badge Desks / Rented Scanners",
      "Connected URPASS Workflow"
    ],
    "rows": [
      {
        "col1": "Morning Entrance Queue",
        "col2": "15 to 45 minute bottleneck searching badge alphabets",
        "col3": "Continuous flow; <0.3s camera scan per delegate"
      },
      {
        "col1": "Scanner Hardware Cost",
        "col2": "£50 to £150 per laser scanner rental per day",
        "col3": "£0 hardware cost; uses volunteers' existing phones"
      },
      {
        "col1": "Multi-Door Duplication",
        "col2": "High risk of pass-backs between halls and gates",
        "col3": "Atomic database locks block duplicate entries instantly"
      },
      {
        "col1": "Ticketing Commission",
        "col2": "3% to 7% per ticket on legacy enterprise platforms",
        "col3": "0% commission; keep 100% of delegate revenues"
      },
      {
        "col1": "Attendance Verification",
        "col2": "Estimated headcount based on leftover printed badges",
        "col3": "Verified digital check-in records with exact timestamps"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is conference registration software?",
      "a": "Conference registration software is a digital platform that manages attendee registration, ticket categories, payment processing, digital pass generation, and entrance gate check-in for professional conferences."
    },
    {
      "q": "Can URPASS handle multi-tier delegate passes (VIP, Speaker, Attendee)?",
      "a": "Yes. Organizers can configure unlimited pass tiers with distinct badge titles, colors, access privileges, and custom registration questions."
    },
    {
      "q": "How does URPASS prevent delegates from sharing QR passes?",
      "a": "When a pass is scanned at any entrance, URPASS atomically updates its status in under 150ms. Any subsequent scan displays an immediate red warning and audible buzz."
    },
    {
      "q": "Do conference volunteers need training or app downloads?",
      "a": "No. Volunteers simply open a private web scanner link in their mobile browser. They can begin scanning delegate passes within 15 seconds."
    },
    {
      "q": "Can URPASS function if convention center Wi-Fi drops?",
      "a": "Yes. URPASS pre-caches delegate manifests in browser memory, enabling uninterrupted scanning even when exhibition halls experience cellular dead zones."
    },
    {
      "q": "Can we collect corporate tax details and issue B2B invoices?",
      "a": "Yes. URPASS registration forms can capture company names, tax IDs (like VAT or GSTIN), and billing addresses, delivering automated corporate receipts."
    },
    {
      "q": "How many gates can scan delegates simultaneously?",
      "a": "URPASS supports unlimited simultaneous entrance gates with real-time cloud synchronization, ensuring zero sync delays across large convention centers."
    },
    {
      "q": "Can we export verified attendance data for CPD accreditation?",
      "a": "Yes. Complete attendance rosters with check-in timestamps and gate identifiers can be exported to CSV in one click from the dashboard."
    }
  ],
  "relatedLinks": [
    {
      "title": "Event Registration with QR Code Tickets",
      "href": "/event-registration-with-qr-code",
      "category": "Product"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    },
    {
      "title": "Real-Time Event Attendance Tracking Software",
      "href": "/event-attendance-tracking-software",
      "category": "Product"
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
      "category": "Product"
    },
    {
      "title": "Corporate Event Registration & Attendee Check-In",
      "href": "/corporate-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "University Event Registration & QR Check-In Software",
      "href": "/university-event-management-software",
      "category": "Use Case"
    }
  ]
}}
    />
  );
}
