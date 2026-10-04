import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Oxford | URPASS",
  description: "Collegiate event registration and sub-second QR check-in software for Oxford academic colloquiums, Sa\u00efd Business School summits, and college balls. 0% ticket fees.",
  keywords: ["event registration software Oxford", "Oxford conference registration", "QR check-in Oxford", "Oxford collegiate event ticketing", "Oxford union event ticketing", "Sa\u00efd Business School conference software", "Eventbrite alternative Oxford"],
  alternates: {
    canonical: "https://urpass.space/uk/oxford",
  },
  openGraph: {
    title: "Event Registration & QR Check-In Oxford | URPASS",
    description: "Collegiate event registration and sub-second QR check-in software for Oxford academic colloquiums, Sa\u00efd Business School summits, and college balls. 0% ticket fees.",
    url: "https://urpass.space/uk/oxford",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-OXF",
    "geo.placename": "Oxford",
    "geo.position": "51.7520;-1.2577",
    "ICBM": "51.7520, -1.2577",
  },
};

export default function UkOxfordPage() {
  return (
    <SEOPage
      config={{
  "badge": "OXFORD EVENT TECH · SUB-SECOND ENTRY",
  "h1": "Event Registration & QR Check-In Oxford",
  "canonicalUrl": "https://urpass.space/uk/oxford",
  "description": "Collegiate event registration and sub-second QR check-in software for Oxford academic colloquiums, Saïd Business School summits, and college balls. 0% ticket fees.",
  "ctaLabel": "Start Free in Oxford →",
  "ctaTitle": "Power Prestigious Oxford Conferences & Balls",
  "ctaDescription": "From Saïd Business School summits and Oxford Science Park symposiums to collegiate balls, URPASS delivers flawless entrance validation.",
  "directAnswer": {
    "title": "Why Choose URPASS for Oxford Events & Conferences?",
    "summary": "URPASS is high-precision event registration and QR check-in software designed for Oxford collegiate societies, academic conferences, and research symposiums. It replaces cumbersome paper sheets with sub-second QR scanning on volunteer smartphones. It features 0% ticketing commission, offline resilience for historic stone colleges, and strict UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant green/red verification",
      "Tailored for collegiate societies with college affiliation and Student ID fields",
      "Offline caching designed for ancient stone colleges and historic dining halls",
      "0% per-ticket commission with flat GBP subscriptions"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Oxford?",
    "definition": "Event registration software in Oxford is an entrance management platform tailored for Oxford's collegiate, academic, and scientific ecosystem. It automates attendee signups, collects delegate details, issues digital QR passes, and checks attendees in at college and conference entrances.",
    "details": [
      "Manages academic conferences, collegiate balls, and guest speaker debates",
      "Captures custom delegate data including college affiliation and dietary needs",
      "Operates hardware-free on volunteer phones with zero app downloads needed",
      "Syncs multi-entrance check-ins to block forwarded or duplicated passes"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Oxford Events",
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
  "featuresTitle": "Features for Oxford Colleges & Academic Summits",
  "featuresSubtitle": "Sub-second camera scans, stone hall offline mode, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Building2,
      "title": "Oxford Collegiate Fields",
      "desc": "Capture college affiliations (Christ Church, Balliol, Magdalen, etc.), matriculation status, and dietary requirements."
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
      "desc": "Coordinating multiple entrance gates for college balls or Oxford Town Hall? Scans sync within 150ms."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Oxford?",
    "subtitle": "From collegiate committees to Science Park tech summits.",
    "personas": [
      {
        "badge": "COLLEGIATE",
        "title": "College Committees & Balls",
        "desc": "Exclusive collegiate balls, garden parties, bops, and formal hall guest lists across Oxford colleges."
      },
      {
        "badge": "ACADEMIC",
        "title": "Academic Departments & Colloquiums",
        "desc": "Saïd Business School, Blavatnik School of Government, and faculty conferences."
      },
      {
        "badge": "RESEARCH",
        "title": "Oxford Science Park & BioEscalator",
        "desc": "Life sciences summits, medical research symposiums, and startup showcases."
      },
      {
        "badge": "STUDENTS",
        "title": "Oxford Student Societies",
        "desc": "Oxford Union debates, collegiate rowing clubs, and theatrical societies with member ticket tiers."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Oxford QR Check-In Works",
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
    "title": "Oxford Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Oxford venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Oxford",
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
      "q": "What is event registration software Oxford?",
      "a": "It is an event registration and smartphone check-in platform designed for Oxford organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can Oxford college committees use URPASS for balls and fests?",
      "a": "Yes. College ball committees use URPASS to manage ticket tiers, guest quotas, and multi-entrance scanning."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Oxford?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Does URPASS work inside historic Oxford stone colleges without Wi-Fi?",
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
      "title": "Cambridge Event Registration for Conferences",
      "href": "/uk/cambridge",
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
    "region": "GB-OXF",
    "placename": "Oxford",
    "position": "51.7520;-1.2577",
    "latitude": 51.752,
    "longitude": -1.2577,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
