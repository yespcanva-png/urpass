import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software for Manchester Events | URPASS",
  description: "Fast event registration and sub-second QR check-in software for Manchester conferences, student unions, and music events. Victoria Warehouse offline mode, 0% ticket fees.",
  keywords: ["event registration software Manchester", "Manchester event check-in", "QR check-in Manchester", "Manchester conference registration", "University of Manchester ticketing", "Victoria Warehouse event scanner", "Eventbrite alternative Manchester"],
  alternates: {
    canonical: "https://urpass.space/uk/manchester",
  },
  openGraph: {
    title: "Event Registration Software for Manchester Events | URPASS",
    description: "Fast event registration and sub-second QR check-in software for Manchester conferences, student unions, and music events. Victoria Warehouse offline mode, 0% ticket fees.",
    url: "https://urpass.space/uk/manchester",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-MAN",
    "geo.placename": "Manchester",
    "geo.position": "53.4808;-2.2426",
    "ICBM": "53.4808, -2.2426",
  },
};

export default function UkManchesterPage() {
  return (
    <SEOPage
      config={{
  "badge": "MANCHESTER EVENT TECH · SUB-SECOND ENTRY",
  "h1": "Event Registration Software for Manchester Events",
  "canonicalUrl": "https://urpass.space/uk/manchester",
  "description": "Fast event registration and sub-second QR check-in software for Manchester conferences, student unions, and music events. Victoria Warehouse offline mode, 0% ticket fees.",
  "ctaLabel": "Start Free in Manchester →",
  "ctaTitle": "Power Fast Event Entry in Manchester",
  "ctaDescription": "From Manchester Central and Victoria Warehouse to University of Manchester student union venues, URPASS keeps your entry lines flowing smoothly.",
  "directAnswer": {
    "title": "Why Use URPASS for Manchester Events & Summits?",
    "summary": "URPASS is modern event registration and gate check-in software built for Manchester conferences, university societies, and music festivals. It replaces paper checklists and expensive equipment with sub-second QR scanning on volunteer smartphones. With offline caching for converted mill spaces, 0% ticketing commission, and UK GDPR compliance, URPASS streamlines Manchester events.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual verification",
      "Offline resilience designed for historic brick and warehouse venues across Manchester",
      "0% platform commission on ticket sales with transparent GBP flat pricing",
      "Used by University of Manchester, MMU societies, and northern tech summits"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Manchester?",
    "definition": "Event registration software in Manchester is an entrance management platform that combines online registration, automated digital pass issuance, and rapid smartphone check-in for events in the North West. It eliminates queues at venues like Manchester Central, Bowlers Exhibition Centre, and Oxford Road campus auditoriums.",
    "details": [
      "Streamlines student society events, corporate conferences, and creative masterclasses",
      "Prevents ticket fraud and duplicate scans across multiple warehouse entrances",
      "Works completely hardware-free on existing Android and iOS mobile devices",
      "Provides live arrival counts and gate velocity curves for venue crowd management"
    ]
  },
  "howItWorksTitle": "How URPASS Works for Manchester Events",
  "howItWorksSubtitle": "Simple setup, instant pass delivery, and rapid gate scanning.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Set your event capacity, registration questions, and ticket pricing in GBP."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Distribute your event URL via WhatsApp, student portals, or social media."
    },
    {
      "n": "03",
      "title": "Attendees register",
      "desc": "Delegates sign up in seconds without having to download native apps."
    },
    {
      "n": "04",
      "title": "Digital QR passes sent",
      "desc": "Unique digital passes are emailed or linked directly to attendee smartphones."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Volunteers scan QR passes in under 0.3 seconds for instant green verification."
    },
    {
      "n": "06",
      "title": "Live attendance tracking",
      "desc": "Monitor check-in velocity and total headcount live on your dashboard."
    }
  ],
  "featuresTitle": "Built for Manchester's Premier Event Spaces",
  "featuresSubtitle": "Sub-second camera scans, offline warehouse resilience, and multi-door sync.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40+ attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Zap,
      "title": "Warehouse & Mill Offline Mode",
      "desc": "Victoria Warehouse and converted mill venues often have thick brick walls. URPASS offline mode keeps scanning uninterrupted."
    },
    {
      icon: Building2,
      "title": "Manchester Universities",
      "desc": "Perfect for UoM, Manchester Met, and Salford student events with custom Student ID and department fields."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party marketing brokers."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Coordinating multiple doors across Manchester Central? Scans sync within 150ms to prevent duplicate pass usage."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Manchester?",
    "subtitle": "From Northern Quarter creative meetups to MediaCityUK corporate summits.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "University Societies & Student Unions",
        "desc": "UoM, MMU, and RNCM balls, society nights, career fairs, and guest speaker events."
      },
      {
        "badge": "TECH",
        "title": "Northern Tech & Startup Summits",
        "desc": "Tech Manchester conferences, developer meetups, and hackathons with instant badge entry."
      },
      {
        "badge": "CONFERENCES",
        "title": "Manchester Central Expos",
        "desc": "Large-scale industry summits and B2B expos needing multi-entrance coordination."
      },
      {
        "badge": "MUSIC & ARTS",
        "title": "Warehouse Festivals & Gigs",
        "desc": "Independent music promoters and arts collectives operating in industrial event spaces."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Manchester Event QR Check-In Works",
    "subtitle": "Fast, reliable, and completely hardware-free entry.",
    "description": "Door volunteers open the scanner link in their mobile browser (Safari or Chrome). No app installation or logins required. The camera detects the attendee's QR pass from 30cm away in under 0.3s, validates the ticket in memory, chimes green, and records the gate arrival. If mobile reception drops inside thick brick walls, local browser caching ensures entry never stops.",
    "points": [
      "Zero equipment rentals: volunteers use their personal smartphones.",
      "Atomic duplicate protection blocks forwarded or screenshot tickets immediately.",
      "Offline engine verifies passes without active 4G/5G or Wi-Fi.",
      "Fast manual search option for dead-phone situations."
    ]
  },
  "keyFactsTable": {
    "title": "Manchester Event Check-In Comparison",
    "subtitle": "How URPASS solves entrance bottlenecks compared to traditional methods.",
    "headers": [
      "Evaluation Criteria",
      "URPASS Manchester",
      "Paper Lists / Eventbrite"
    ],
    "rows": [
      {
        "col1": "Gate Check-In Speed",
        "col2": "<0.3s per attendee camera scan",
        "col3": "3 to 5s manual list searching or app lags"
      },
      {
        "col1": "Warehouse Brick Resilience",
        "col2": "Local offline memory validation",
        "col3": "App crashes or shows 'Network Error'"
      },
      {
        "col1": "Hardware Requirements",
        "col2": "Any volunteer smartphone browser",
        "col3": "Rented laser guns or bulky laptops"
      },
      {
        "col1": "Ticketing Fees",
        "col2": "0% commission; flat GBP subscription",
        "col3": "Up to 6.95% + £0.59 cut on every ticket"
      },
      {
        "col1": "Multi-Door Protection",
        "col2": "Atomic locks block duplicate reuse",
        "col3": "Sync delays permit duplicate entry"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is event registration software Manchester?",
      "a": "It is an event registration and smartphone check-in platform designed for Manchester organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS scan passes in Manchester warehouse venues without Wi-Fi?",
      "a": "Yes. URPASS has built-in offline caching that pre-loads attendee records, allowing phones to scan passes in venues like Victoria Warehouse even when mobile signal drops."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Manchester?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Manchester student societies use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Manchester, MMU, and Salford use URPASS for seamless ball and festival check-ins."
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
      "title": "London Event Registration & QR Check-In",
      "href": "/uk/london",
      "category": "Location"
    },
    {
      "title": "Birmingham Event Registration & Check-In",
      "href": "/uk/birmingham",
      "category": "Location"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Eventbrite Alternative UK",
      "href": "/eventbrite-alternative-uk",
      "category": "Comparison"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-MAN",
    "placename": "Manchester",
    "position": "53.4808;-2.2426",
    "latitude": 53.4808,
    "longitude": -2.2426,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
