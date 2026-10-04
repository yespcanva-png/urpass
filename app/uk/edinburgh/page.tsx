import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Edinburgh | URPASS",
  description: "Fast event registration and sub-second QR check-in software for Edinburgh conferences, festivals, and university societies. EICC & Fringe satellite events, 0% ticket fees.",
  keywords: ["event registration software Edinburgh", "QR check-in Edinburgh", "Edinburgh event ticketing", "EICC conference check-in", "Edinburgh Fringe event registration", "University of Edinburgh society ticketing", "Eventbrite alternative Edinburgh"],
  alternates: {
    canonical: "https://urpass.space/uk/edinburgh",
  },
  openGraph: {
    title: "Event Registration & QR Check-In Edinburgh | URPASS",
    description: "Fast event registration and sub-second QR check-in software for Edinburgh conferences, festivals, and university societies. EICC & Fringe satellite events, 0% ticket fees.",
    url: "https://urpass.space/uk/edinburgh",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-EDH",
    "geo.placename": "Edinburgh",
    "geo.position": "55.9533;-3.1883",
    "ICBM": "55.9533, -3.1883",
  },
};

export default function UkEdinburghPage() {
  return (
    <SEOPage
      config={{
  "badge": "EDINBURGH EVENT TECH · SUB-SECOND ENTRY",
  "h1": "Event Registration & QR Check-In Edinburgh",
  "canonicalUrl": "https://urpass.space/uk/edinburgh",
  "description": "Fast event registration and sub-second QR check-in software for Edinburgh conferences, festivals, and university societies. EICC & Fringe satellite events, 0% ticket fees.",
  "ctaLabel": "Start Free in Edinburgh →",
  "ctaTitle": "Streamline Your Edinburgh Event Entrances",
  "ctaDescription": "From EICC academic symposiums and Fringe satellite showcases to University of Edinburgh student balls, URPASS ensures frictionless entrance validation.",
  "directAnswer": {
    "title": "Why Choose URPASS for Edinburgh Events?",
    "summary": "URPASS is high-speed event registration and QR check-in software built for Edinburgh conferences, cultural festivals, and university societies. It replaces paper checklists and bulky scanners with sub-second QR scanning on volunteer smartphones. It features offline caching for historic stone venues, 0% ticketing commission, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual entry verification",
      "Offline resilience designed for historic stone buildings across Old Town and New Town",
      "0% per-ticket commission, saving Scottish organisers significant ticketing costs",
      "Used by University of Edinburgh, Heriot-Watt, and Napier student societies"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Edinburgh?",
    "definition": "Event registration software in Edinburgh is a modern digital platform that automates attendee booking, digital QR ticket generation, and rapid smartphone door scanning for events across Scotland's capital. It keeps queues moving at venues like EICC, Assembly Rooms, and university halls.",
    "details": [
      "Manages academic conferences, cultural performances, and student society formals",
      "Operates completely hardware-free on existing smartphones with zero app downloads",
      "Maintains check-in performance in historic stone venues without reliable mobile signal",
      "Syncs multi-entrance check-ins to block forwarded or duplicated ticket passes"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Edinburgh Events",
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
  "featuresTitle": "Features for Edinburgh Conferences & Festivals",
  "featuresSubtitle": "Sub-second camera scans, stone venue offline mode, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Zap,
      "title": "Stone Venue Offline Mode",
      "desc": "Edinburgh's historic stone vaults and venues often block cellular signals. URPASS offline mode ensures uninterrupted check-in."
    },
    {
      icon: Building2,
      "title": "Edinburgh Universities",
      "desc": "Tailored for University of Edinburgh, Heriot-Watt, and Napier societies with custom Student ID fields."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party marketing brokers."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Managing multiple doors across EICC? Scans sync within 150ms to prevent duplicate pass usage."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Edinburgh?",
    "subtitle": "From academic colloquiums to Fringe festival showcases.",
    "personas": [
      {
        "badge": "ACADEMIC",
        "title": "University Societies & Academic Conferences",
        "desc": "University of Edinburgh and Heriot-Watt symposiums, student balls, and debates."
      },
      {
        "badge": "CONFERENCES",
        "title": "EICC & Business Summits",
        "desc": "International medical, scientific, and financial conferences held in Scotland's capital."
      },
      {
        "badge": "CULTURAL",
        "title": "Fringe & Festival Showcases",
        "desc": "Independent theatre groups, comedy shows, and pop-up events needing rapid door check-in."
      },
      {
        "badge": "TECH",
        "title": "Scottish Tech & Innovation Meets",
        "desc": "CodeBase meetups, startup pitch nights, and developer hackathons across Edinburgh."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Edinburgh QR Check-In Works",
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
    "title": "Edinburgh Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Edinburgh venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Edinburgh",
      "Legacy Ticketing Apps"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s per scan (45+ attendees/min)",
        "col3": "2.5 to 4.0s (slow camera tap confirmations)"
      },
      {
        "col1": "Stone Venue Reception",
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
      "q": "What is event registration software Edinburgh?",
      "a": "It is an event registration and smartphone check-in platform designed for Edinburgh organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS work in Edinburgh historic venues with thick stone walls?",
      "a": "Yes. URPASS has built-in offline caching that pre-loads attendee records, allowing phones to scan passes in historic venues even when mobile signal drops."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Edinburgh?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Edinburgh university societies use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Edinburgh and Heriot-Watt use URPASS for seamless ball and festival check-ins."
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
      "title": "Glasgow Event Registration & QR Ticketing",
      "href": "/uk/glasgow",
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
      "title": "Festival Registration, Tickets & QR Entry",
      "href": "/festival-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-EDH",
    "placename": "Edinburgh",
    "position": "55.9533;-3.1883",
    "latitude": 55.9533,
    "longitude": -3.1883,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
