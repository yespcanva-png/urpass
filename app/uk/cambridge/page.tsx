import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration for Cambridge Conferences & Events | URPASS",
  description: "Collegiate event registration and sub-second QR check-in software for Cambridge academic colloquiums, Science Park summits, and May balls. 0% ticket fees.",
  keywords: ["event registration software Cambridge", "Cambridge conference registration", "QR check-in Cambridge", "Cambridge collegiate event ticketing", "Cambridge Science Park conference software", "Cambridge May ball ticketing", "Eventbrite alternative Cambridge"],
  alternates: {
    canonical: "https://urpass.space/uk/cambridge",
  },
  openGraph: {
    title: "Event Registration for Cambridge Conferences & Events | URPASS",
    description: "Collegiate event registration and sub-second QR check-in software for Cambridge academic colloquiums, Science Park summits, and May balls. 0% ticket fees.",
    url: "https://urpass.space/uk/cambridge",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-CAM",
    "geo.placename": "Cambridge",
    "geo.position": "52.2053;0.1218",
    "ICBM": "52.2053, 0.1218",
  },
};

export default function UkCambridgePage() {
  return (
    <SEOPage
      config={{
  "badge": "CAMBRIDGE EVENT TECH · SUB-SECOND ENTRY",
  "h1": "Event Registration for Cambridge Conferences & Events",
  "canonicalUrl": "https://urpass.space/uk/cambridge",
  "description": "Collegiate event registration and sub-second QR check-in software for Cambridge academic colloquiums, Science Park summits, and May balls. 0% ticket fees.",
  "ctaLabel": "Start Free in Cambridge →",
  "ctaTitle": "Run Prestigious Cambridge Conferences & Balls",
  "ctaDescription": "From Cambridge Science Park biotech symposiums and Judge Business School conferences to collegiate May balls, URPASS provides flawless entrance validation.",
  "directAnswer": {
    "title": "Why Choose URPASS for Cambridge Events & Conferences?",
    "summary": "URPASS is high-precision event registration and QR check-in software designed for Cambridge academic colloquiums, collegiate societies, and biotech summits. It replaces slow paper lists with sub-second QR scanning on volunteer smartphones. It features 0% ticketing commission, offline resilience for historic college halls, and strict UK GDPR data protection.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant green/red verification",
      "Tailored for collegiate societies with college affiliation and Student ID fields",
      "Offline caching designed for ancient stone chapels and historic college dining halls",
      "0% per-ticket commission with flat GBP subscriptions"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration for Cambridge Events?",
    "definition": "Event registration software in Cambridge is an entrance management platform tailored for the unique collegiate, research, and biotech ecosystem of Cambridge. It coordinates delegate accreditation, academic ticket tiers, digital QR pass issuance, and rapid smartphone gate check-in.",
    "details": [
      "Manages collegiate society formals, May balls, and international academic congresses",
      "Handles custom delegate data including college affiliation, faculty, and dietary needs",
      "Operates hardware-free on volunteer phones with zero app downloads required",
      "Syncs multi-entrance scanning to protect exclusive collegiate events from pass duplication"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Cambridge Events",
  "howItWorksSubtitle": "From online registration to high-speed entrance flow.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Set your event details, ticket categories, and custom fields in GBP."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Send your clean URL to delegates, performers, or students."
    },
    {
      "n": "03",
      "title": "Attendees register",
      "desc": "Guests register with zero friction or forced account signups."
    },
    {
      "n": "04",
      "title": "Automated digital passes",
      "desc": "Instant scannable mobile QR passes arrive in attendees' inboxes."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Door volunteers scan passes with phone cameras in <0.3s."
    },
    {
      "n": "06",
      "title": "Live attendance analytics",
      "desc": "Monitor arrival throughput and hall capacities in real time."
    }
  ],
  "featuresTitle": "Features for Cambridge Colleges & Science Parks",
  "featuresSubtitle": "Sub-second camera scans, stone hall offline mode, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Building2,
      "title": "Cambridge Collegiate Fields",
      "desc": "Capture college affiliations (Trinity, St John's, King's, etc.), matriculation status, and dietary requirements."
    },
    {
      icon: Zap,
      "title": "Historic Stone Hall Offline Mode",
      "desc": "Ancient stone college dining halls often block mobile reception. URPASS offline mode keeps scanning uninterrupted."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party marketing brokers."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Coordinating multiple entrance gates for May balls or West Road Concert Hall? Scans sync within 150ms."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Cambridge?",
    "subtitle": "From collegiate committees to Science Park tech summits.",
    "personas": [
      {
        "badge": "COLLEGIATE",
        "title": "College Committees & May Balls",
        "desc": "Exclusive collegiate balls, garden parties, bops, and formal hall guest lists."
      },
      {
        "badge": "ACADEMIC",
        "title": "Academic Departments & Colloquiums",
        "desc": "Cambridge Judge Business School, Cavendish Laboratory, and faculty conferences."
      },
      {
        "badge": "BIOTECH",
        "title": "Cambridge Science Park & Silicon Fen",
        "desc": "Biotech summits, AI conferences, and tech startup pitch showcases."
      },
      {
        "badge": "STUDENTS",
        "title": "Cambridge Student Societies",
        "desc": "Cambridge Union Society, athletic clubs, and musical societies with member ticket tiers."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Cambridge QR Check-In Works",
    "subtitle": "Pure speed on any volunteer smartphone.",
    "description": "Staff open the scanner link in Safari or Chrome. The camera reads the attendee's QR pass from 30cm away in under 0.3s, checks the pass against the event registry, produces an audible chime, and records the gate arrival. If venue Wi-Fi drops, the local browser cache continues verifying passes uninterrupted.",
    "points": [
      "Zero equipment costs: no need to rent expensive laser scanner hardware.",
      "Fast volunteer onboarding: staff begin scanning within 15 seconds of receiving the link.",
      "Atomic row-locking prevents shared pass screenshots across different entrances.",
      "Manual guest lookup available if an attendee's phone battery runs out."
    ]
  },
  "keyFactsTable": {
    "title": "Cambridge Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Cambridge venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Cambridge",
      "Legacy Ticketing Apps"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s per scan (45+ attendees/min)",
        "col3": "2.5 to 4.0s (slow camera tap confirmations)"
      },
      {
        "col1": "Stone Hall Reception",
        "col2": "Local offline memory validation",
        "col3": "Freezes or times out on low signal"
      },
      {
        "col1": "Hardware Demands",
        "col2": "Any volunteer phone browser",
        "col3": "Proprietary apps or rented hardware"
      },
      {
        "col1": "Multi-Gate Sync",
        "col2": "Sub-150ms atomic state replication",
        "col3": "Periodic sync allows duplicate entries"
      },
      {
        "col1": "Ticket Fee Model",
        "col2": "0% commission; flat GBP plan",
        "col3": "Up to 6.95% + £0.59 deducted per ticket"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is event registration software Cambridge?",
      "a": "It is an event registration and smartphone check-in platform designed for Cambridge organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can Cambridge college committees use URPASS for May balls?",
      "a": "Yes. May ball and collegiate committees use URPASS to manage thousands of ticket holders, guest quotas, and multi-entrance scanning."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Cambridge?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Does URPASS work inside historic Cambridge stone colleges without Wi-Fi?",
      "a": "Yes. URPASS pre-caches the guest registry in memory, enabling seamless validation even inside thick stone dining halls and chapels."
    },
    {
      "q": "How fast can volunteers start scanning at the door?",
      "a": "Volunteers just click a link on their smartphone browser and can start scanning within 15 seconds. No app download or account creation required."
    },
    {
      "q": "Does URPASS prevent people from sharing screenshots of tickets?",
      "a": "Yes. Once a ticket is scanned at any door, the system atomically invalidates it. Subsequent attempts display an immediate red alert."
    }
  ],
  "relatedLinks": [
    {
      "title": "UK Event Registration Software",
      "href": "/uk",
      "category": "Location"
    },
    {
      "title": "Oxford Event Registration & QR Check-In",
      "href": "/uk/oxford",
      "category": "Location"
    },
    {
      "title": "London Event Registration & QR Check-In",
      "href": "/uk/london",
      "category": "Location"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "University Event Registration & QR Check-In Software",
      "href": "/university-event-management-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-CAM",
    "placename": "Cambridge",
    "position": "52.2053;0.1218",
    "latitude": 52.2053,
    "longitude": 0.1218,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
