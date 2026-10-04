import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Platform Bristol | URPASS",
  description: "Fast event registration and sub-second QR check-in software for Bristol conferences, creative masterclasses, and university societies. 0% ticket fees.",
  keywords: ["event registration software Bristol", "Bristol event registration platform", "QR check-in Bristol", "Bristol Beacon event ticketing", "University of Bristol society ticketing", "UWE event registration software", "Eventbrite alternative Bristol"],
  alternates: {
    canonical: "https://urpass.space/uk/bristol",
  },
  openGraph: {
    title: "Event Registration Platform Bristol | URPASS",
    description: "Fast event registration and sub-second QR check-in software for Bristol conferences, creative masterclasses, and university societies. 0% ticket fees.",
    url: "https://urpass.space/uk/bristol",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-BST",
    "geo.placename": "Bristol",
    "geo.position": "51.4545;-2.5879",
    "ICBM": "51.4545, -2.5879",
  },
};

export default function UkBristolPage() {
  return (
    <SEOPage
      config={{
  "badge": "BRISTOL EVENT TECH · FAST QR ENTRY",
  "h1": "Event Registration Platform Bristol",
  "canonicalUrl": "https://urpass.space/uk/bristol",
  "description": "Fast event registration and sub-second QR check-in software for Bristol conferences, creative masterclasses, and university societies. 0% ticket fees.",
  "ctaLabel": "Start Free in Bristol →",
  "ctaTitle": "Power Fast Event Entry in Bristol",
  "ctaDescription": "From Bristol Beacon conferences and Harbourside workshops to University of Bristol & UWE student union formals, URPASS turns any phone into a sub-second scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Bristol Events?",
    "summary": "URPASS is modern event registration and QR check-in software built for Bristol creative agencies, sustainability summits, and university societies. It replaces cumbersome paper sheets and third-party apps with sub-second QR scanning on volunteer smartphones. It features 0% ticketing commission, offline resilience, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant green/red verification",
      "0% platform commission on ticket sales with transparent GBP flat pricing",
      "Offline resilience designed for Harbourside warehouses and historic venues",
      "Used by University of Bristol, UWE societies, and creative tech communities"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Platform Bristol?",
    "definition": "An event registration platform in Bristol is a digital software system that coordinates delegate registration, ticket booking in GBP, dynamic digital pass issuance, and rapid mobile QR scanning for events across the South West.",
    "details": [
      "Manages attendee booking for creative masterclasses, tech summits, and university formals",
      "Replaces printed ticket stubs and paper checklists with paperless digital passes",
      "Operates directly on standard mobile browsers with zero software downloads",
      "Prevents ticket fraud and duplicate entry attempts across multiple venue gates"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Bristol Events",
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
  "featuresTitle": "Features for Bristol Creative & Campus Events",
  "featuresSubtitle": "Sub-second camera scans, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Zap,
      "title": "Harbourside & Vaults Offline Mode",
      "desc": "Historic warehouse venues can suffer from signal blackouts. URPASS offline mode keeps scanning uninterrupted."
    },
    {
      icon: Building2,
      "title": "Bristol Universities",
      "desc": "Tailored for University of Bristol and UWE student union balls, career fairs, and society nights."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party marketing brokers."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Managing multiple doors across Bristol Beacon or Passenger Shed? Scans sync within 150ms."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Bristol?",
    "subtitle": "From Harbourside tech meetups to Clifton student society formals.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "University of Bristol & UWE Societies",
        "desc": "Student union societies, summer balls, academic symposiums, and sports club formals."
      },
      {
        "badge": "CREATIVE",
        "title": "Bristol Creative & Tech Collectives",
        "desc": "Bristol Media meetups, design festivals, and startup pitch events in Harbourside spaces."
      },
      {
        "badge": "SUMMITS",
        "title": "Sustainability & Green Conferences",
        "desc": "Environmental conferences and climate summits needing clean, paperless digital passes."
      },
      {
        "badge": "MUSIC & ARTS",
        "title": "Independent Music & Culture Events",
        "desc": "Independent promoters and arts centers across Stokes Croft and Old Market."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Bristol QR Check-In Works",
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
    "title": "Bristol Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Bristol venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Bristol",
      "Legacy Ticketing Apps"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s per scan (45+ attendees/min)",
        "col3": "2.5 to 4.0s (slow camera tap confirmations)"
      },
      {
        "col1": "Offline Support",
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
      "q": "What is event registration platform Bristol?",
      "a": "It is an event registration and smartphone check-in platform designed for Bristol organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Bristol conferences at Bristol Beacon?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for major Bristol convention halls."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Bristol?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Bristol student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Bristol and UWE use URPASS for seamless ball and festival check-ins."
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
      "title": "Cardiff Event Ticketing & QR Check-In",
      "href": "/uk/cardiff",
      "category": "Location"
    },
    {
      "title": "London Event Registration & QR Check-In",
      "href": "/uk/london",
      "category": "Location"
    },
    {
      "title": "Workshop Registration & Digital Ticketing Software",
      "href": "/workshop-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-BST",
    "placename": "Bristol",
    "position": "51.4545;-2.5879",
    "latitude": 51.4545,
    "longitude": -2.5879,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
