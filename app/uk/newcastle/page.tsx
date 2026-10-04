import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Ticketing Newcastle | URPASS",
  description: "Fast event registration and sub-second QR ticketing for Newcastle conferences, university societies, and Utilita Arena events. 0% ticket fees, UK GDPR compliant.",
  keywords: ["event registration software Newcastle", "QR ticketing Newcastle", "Newcastle event check-in", "Newcastle University society ticketing", "Northumbria University event registration", "Utilita Arena Newcastle check-in", "Eventbrite alternative Newcastle"],
  alternates: {
    canonical: "https://urpass.space/uk/newcastle",
  },
  openGraph: {
    title: "Event Registration & QR Ticketing Newcastle | URPASS",
    description: "Fast event registration and sub-second QR ticketing for Newcastle conferences, university societies, and Utilita Arena events. 0% ticket fees, UK GDPR compliant.",
    url: "https://urpass.space/uk/newcastle",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-NET",
    "geo.placename": "Newcastle upon Tyne",
    "geo.position": "54.9783;-1.6178",
    "ICBM": "54.9783, -1.6178",
  },
};

export default function UkNewcastlePage() {
  return (
    <SEOPage
      config={{
  "badge": "NEWCASTLE EVENT TECH · FAST QR ENTRY",
  "h1": "Event Registration & QR Ticketing Newcastle",
  "canonicalUrl": "https://urpass.space/uk/newcastle",
  "description": "Fast event registration and sub-second QR ticketing for Newcastle conferences, university societies, and Utilita Arena events. 0% ticket fees, UK GDPR compliant.",
  "ctaLabel": "Start Free in Newcastle →",
  "ctaTitle": "Power Seamless Event Entry in Newcastle",
  "ctaDescription": "From Quayside conferences and Utilita Arena gatherings to Newcastle and Northumbria student union balls, URPASS turns any phone into a sub-second scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Newcastle Events?",
    "summary": "URPASS is high-speed event registration and QR check-in software built for Newcastle conferences, university societies, and arena events across the North East. It replaces slow paper guest lists with sub-second QR scanning on volunteer smartphones. It features 0% ticketing commission, offline resilience, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual verification",
      "Zero app downloads needed: door staff scan directly using mobile web browsers",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by Newcastle University, Northumbria, and North East tech summits"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Newcastle?",
    "definition": "Event registration software in Newcastle is an online platform that coordinates attendee registrations, ticket sales in GBP, automated digital QR pass issuance, and rapid mobile gate check-in for events across the North East.",
    "details": [
      "Manages attendee booking for tech conferences, university balls, and live gigs",
      "Replaces printed ticket stubs and paper checklists with paperless digital passes",
      "Operates directly on standard mobile browsers with zero software downloads",
      "Prevents ticket fraud and duplicate entry attempts across multiple venue gates"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Newcastle Events",
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
  "featuresTitle": "Features for Newcastle Venues & Campus Events",
  "featuresSubtitle": "Sub-second camera scans, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Building2,
      "title": "Newcastle Universities",
      "desc": "Tailored for Newcastle University and Northumbria student union balls, career fairs, and society nights."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Managing multiple doors across Utilita Arena or Baltic Centre? Scans sync within 150ms."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "Crowded venues can jam local cellular networks. URPASS offline mode keeps scanning uninterrupted."
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
    "title": "Who Should Use URPASS in Newcastle?",
    "subtitle": "From Quayside summits to student union formals.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "Newcastle University & Northumbria Societies",
        "desc": "Student union societies, summer balls, academic symposiums, and sports club formals."
      },
      {
        "badge": "CONFERENCES",
        "title": "Quayside & Baltic Centre Summits",
        "desc": "Regional business summits, renewable energy conferences, and public sector symposiums."
      },
      {
        "badge": "TECH",
        "title": "North East Tech & Digital Meets",
        "desc": "Tech Newcastle meetups, software developer groups, and startup pitch nights."
      },
      {
        "badge": "COMMUNITY",
        "title": "North East Cultural & Sports Events",
        "desc": "Charity runs, community galas, and cultural festivals needing frictionless gate check-in."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Newcastle QR Check-In Works",
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
    "title": "Newcastle Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Newcastle venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Newcastle",
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
      "q": "What is event registration software Newcastle?",
      "a": "It is an event registration and smartphone check-in platform designed for Newcastle organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Newcastle events at Utilita Arena?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for arena-scale events."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Newcastle?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Newcastle student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across Newcastle University and Northumbria use URPASS for seamless ball and festival check-ins."
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
      "title": "Leeds QR Event Registration & Check-In",
      "href": "/uk/leeds",
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
    "region": "GB-NET",
    "placename": "Newcastle upon Tyne",
    "position": "54.9783;-1.6178",
    "latitude": 54.9783,
    "longitude": -1.6178,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
