import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Event Registration & Check-In Leeds | URPASS",
  description: "Fast event registration and sub-second QR check-in software for Leeds conferences, university societies, and tech meetups. Royal Armouries & First Direct Arena, 0% fees.",
  keywords: ["event registration software Leeds", "QR check-in Leeds", "Leeds event ticketing", "Royal Armouries Leeds check-in", "University of Leeds society ticketing", "Leeds Beckett event registration", "Eventbrite alternative Leeds"],
  alternates: {
    canonical: "https://urpass.space/uk/leeds",
  },
  openGraph: {
    title: "QR Event Registration & Check-In Leeds | URPASS",
    description: "Fast event registration and sub-second QR check-in software for Leeds conferences, university societies, and tech meetups. Royal Armouries & First Direct Arena, 0% fees.",
    url: "https://urpass.space/uk/leeds",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-LDS",
    "geo.placename": "Leeds",
    "geo.position": "53.8008;-1.5491",
    "ICBM": "53.8008, -1.5491",
  },
};

export default function UkLeedsPage() {
  return (
    <SEOPage
      config={{
  "badge": "LEEDS EVENT TECH · FAST ENTRY",
  "h1": "QR Event Registration & Check-In Leeds",
  "canonicalUrl": "https://urpass.space/uk/leeds",
  "description": "Fast event registration and sub-second QR check-in software for Leeds conferences, university societies, and tech meetups. Royal Armouries & First Direct Arena, 0% fees.",
  "ctaLabel": "Start Free in Leeds →",
  "ctaTitle": "Run High-Speed Leeds Events with URPASS",
  "ctaDescription": "From Royal Armouries Hall conferences and First Direct Arena gatherings to University of Leeds student union events, URPASS turns any phone into a sub-second scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Leeds Events?",
    "summary": "URPASS is high-speed event registration and QR check-in software built for Leeds conferences, digital agencies, and university societies. It replaces slow paper guest lists with sub-second QR scanning on volunteer smartphones. It features offline caching, 0% ticketing commission, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual verification",
      "Zero app downloads needed: door staff scan directly using mobile web browsers",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by University of Leeds, Leeds Beckett, and Yorkshire tech summits"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Leeds?",
    "definition": "Event registration software in Leeds is a cloud-based platform that allows Yorkshire organisers to create custom registration forms, process ticket sales in GBP, issue digital QR passes, and check attendees in at the door using standard smartphones.",
    "details": [
      "Coordinates registration for digital summits, academic symposiums, and student formals",
      "Eliminates paper lists and long queues outside Yorkshire event venues",
      "Functions on any phone or tablet without renting expensive laser scanners",
      "Syncs multi-entrance check-ins in real time to prevent duplicate entry attempts"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Leeds Events",
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
  "featuresTitle": "Features for Leeds Tech & Academic Events",
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
      "desc": "Managing multiple doors across Royal Armouries or First Direct Arena? Scans sync within 150ms."
    },
    {
      icon: Building2,
      "title": "Leeds Universities",
      "desc": "Tailored for University of Leeds and Leeds Beckett societies with custom Student ID fields."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "High crowd density can overload venue Wi-Fi. URPASS offline mode ensures uninterrupted gate scanning."
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
    "title": "Who Should Use URPASS in Leeds?",
    "subtitle": "From digital agency summits to student union formals.",
    "personas": [
      {
        "badge": "TECH",
        "title": "Leeds Tech & Digital Agency Meets",
        "desc": "Leeds Digital Festival meetups, fintech conferences, and developer hackathons."
      },
      {
        "badge": "CAMPUS",
        "title": "University of Leeds & Leeds Beckett",
        "desc": "Leeds University Union (LUU) society balls, career days, and student fests."
      },
      {
        "badge": "CONFERENCES",
        "title": "Royal Armouries Hall Conferences",
        "desc": "Regional business summits, trade expos, and annual general meetings."
      },
      {
        "badge": "COMMUNITY",
        "title": "Yorkshire Community Festivals",
        "desc": "Charity runs, community markets, and cultural festivals needing simple entrance management."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Leeds QR Check-In Works",
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
    "title": "Leeds Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Leeds venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Leeds",
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
      "q": "What is event registration software Leeds?",
      "a": "It is an event registration and smartphone check-in platform designed for Leeds organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Leeds conferences at Royal Armouries?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for major Leeds convention centers."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Leeds?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Leeds student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Leeds and Leeds Beckett use URPASS for seamless ball and festival check-ins."
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
      "title": "Manchester Event Registration Software",
      "href": "/uk/manchester",
      "category": "Location"
    },
    {
      "title": "Sheffield Event Registration & Digital QR Passes",
      "href": "/uk/sheffield",
      "category": "Location"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-LDS",
    "placename": "Leeds",
    "position": "53.8008;-1.5491",
    "latitude": 53.8008,
    "longitude": -1.5491,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
