import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Ticketing Glasgow | URPASS",
  description: "Fast event registration and sub-second QR ticketing for Glasgow concerts, SEC conferences, and university societies. Hydro arena scale, 0% ticket commission.",
  keywords: ["event registration software Glasgow", "QR ticketing Glasgow", "Glasgow event check-in", "SEC Glasgow conference registration", "University of Glasgow event ticketing", "Strathclyde union check-in", "Eventbrite alternative Glasgow"],
  alternates: {
    canonical: "https://urpass.space/uk/glasgow",
  },
  openGraph: {
    title: "Event Registration & QR Ticketing Glasgow | URPASS",
    description: "Fast event registration and sub-second QR ticketing for Glasgow concerts, SEC conferences, and university societies. Hydro arena scale, 0% ticket commission.",
    url: "https://urpass.space/uk/glasgow",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-GLG",
    "geo.placename": "Glasgow",
    "geo.position": "55.8642;-4.2518",
    "ICBM": "55.8642, -4.2518",
  },
};

export default function UkGlasgowPage() {
  return (
    <SEOPage
      config={{
  "badge": "GLASGOW EVENT TECH · FAST QR ENTRY",
  "h1": "Event Registration & QR Ticketing Glasgow",
  "canonicalUrl": "https://urpass.space/uk/glasgow",
  "description": "Fast event registration and sub-second QR ticketing for Glasgow concerts, SEC conferences, and university societies. Hydro arena scale, 0% ticket commission.",
  "ctaLabel": "Start Free in Glasgow →",
  "ctaTitle": "Power Fast Event Entry in Glasgow",
  "ctaDescription": "From SEC Glasgow summits and Hydro arena gatherings to University of Glasgow student events, URPASS turns any phone into a sub-second scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Glasgow Events?",
    "summary": "URPASS is high-speed event registration and QR check-in software built for Glasgow concerts, academic conferences, and university events. It replaces slow paper guest lists with sub-second QR scanning on volunteer smartphones. Featuring offline caching for crowded venues, 0% ticket fees, and full UK GDPR compliance, URPASS keeps Glasgow entrance lines moving.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant green/red verification",
      "Proven for high-capacity venue throughput across SEC, Hydro, and SWG3",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by University of Glasgow, Strathclyde, and GCU student teams"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Glasgow?",
    "definition": "Event registration software in Glasgow is a complete digital event pass and gate management platform. It streamlines delegate registrations, processes ticket fees in GBP, issues unique digital QR passes, and verifies entry across multiple venue doors simultaneously.",
    "details": [
      "Handles morning arrival surges at major Clyde-side conference centers",
      "Eliminates paper guest lists and manual pen ticking at entrance gates",
      "Runs on standard mobile browsers with zero software downloads needed",
      "Blocks duplicate entry attempts in real time across all venue doors"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Glasgow Events",
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
  "featuresTitle": "Features for Glasgow Music Venues & Summits",
  "featuresSubtitle": "Sub-second camera scans, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Managing multiple doors across SEC or SWG3? Scans sync within 150ms to prevent duplicate pass usage."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "Dense crowds can jam local cellular networks. URPASS offline mode keeps scanning uninterrupted."
    },
    {
      icon: Building2,
      "title": "Glasgow Universities",
      "desc": "Tailored for University of Glasgow, Strathclyde, and GCU societies with custom Student ID fields."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party marketing brokers."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Glasgow?",
    "subtitle": "From Clyde-side conferences to West End student formals.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "University Societies & Student Unions",
        "desc": "UofG, Strathclyde, and GCU student union formals, freshers' fairs, and society nights."
      },
      {
        "badge": "CONFERENCES",
        "title": "SEC Glasgow Conferences",
        "desc": "National and international industry summits, medical congresses, and exhibitions."
      },
      {
        "badge": "MUSIC & ARTS",
        "title": "SWG3 & Live Gigs",
        "desc": "Music venues, club nights, and cultural arts festivals needing rapid mobile ticket entry."
      },
      {
        "badge": "COMMUNITY",
        "title": "Community Gatherings & Sports",
        "desc": "Local charity runs, sports tournaments, and community hall events with free registration."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Glasgow QR Check-In Works",
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
    "title": "Glasgow Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Glasgow venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Glasgow",
      "Legacy Ticketing Apps"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s per scan (45+ attendees/min)",
        "col3": "2.5 to 4.0s (slow camera tap confirmations)"
      },
      {
        "col1": "Crowded Venue Network",
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
      "q": "What is event registration software Glasgow?",
      "a": "It is an event registration and smartphone check-in platform designed for Glasgow organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Glasgow events at the SEC or Hydro?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for large arena events."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Glasgow?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Glasgow university societies use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Glasgow, Strathclyde, and GCU use URPASS for seamless ball and festival check-ins."
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
      "title": "Edinburgh Event Registration & QR Check-In",
      "href": "/uk/edinburgh",
      "category": "Location"
    },
    {
      "title": "Manchester Event Registration Software",
      "href": "/uk/manchester",
      "category": "Location"
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
    "region": "GB-GLG",
    "placename": "Glasgow",
    "position": "55.8642;-4.2518",
    "latitude": 55.8642,
    "longitude": -4.2518,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
