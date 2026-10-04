import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software Liverpool | URPASS",
  description: "Sub-second event registration and QR check-in software for Liverpool conferences, Baltic Triangle creative events, and university societies. 0% ticket fees.",
  keywords: ["event registration software Liverpool", "Liverpool event check-in", "QR check-in Liverpool", "ACC Liverpool conference registration", "University of Liverpool ticketing", "Baltic Triangle event registration", "Eventbrite alternative Liverpool"],
  alternates: {
    canonical: "https://urpass.space/uk/liverpool",
  },
  openGraph: {
    title: "Event Registration Software Liverpool | URPASS",
    description: "Sub-second event registration and QR check-in software for Liverpool conferences, Baltic Triangle creative events, and university societies. 0% ticket fees.",
    url: "https://urpass.space/uk/liverpool",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-LIV",
    "geo.placename": "Liverpool",
    "geo.position": "53.4084;-2.9916",
    "ICBM": "53.4084, -2.9916",
  },
};

export default function UkLiverpoolPage() {
  return (
    <SEOPage
      config={{
  "badge": "LIVERPOOL EVENT TECH · FAST ENTRY",
  "h1": "Event Registration Software Liverpool",
  "canonicalUrl": "https://urpass.space/uk/liverpool",
  "description": "Sub-second event registration and QR check-in software for Liverpool conferences, Baltic Triangle creative events, and university societies. 0% ticket fees.",
  "ctaLabel": "Start Free in Liverpool →",
  "ctaTitle": "Power Seamless Event Entry in Liverpool",
  "ctaDescription": "From ACC Liverpool waterfront conferences and Exhibition Centre events to Baltic Triangle creative showcases, URPASS keeps entrance lines moving.",
  "directAnswer": {
    "title": "Why Choose URPASS for Liverpool Events?",
    "summary": "URPASS is high-speed event registration and QR check-in software built for Liverpool conferences, university societies, and waterfront exhibitions. It replaces paper checklists with sub-second QR scanning on volunteer smartphones. It features offline caching for converted warehouse venues, 0% ticketing commission, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual verification",
      "Offline resilience designed for converted docks and warehouse spaces",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by University of Liverpool, LJMU, and Liverpool Hope student teams"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Liverpool?",
    "definition": "Event registration software in Liverpool is a digital system for managing delegate registrations, ticket sales, digital QR pass issuance, and rapid entrance scanning across Merseyside venues.",
    "details": [
      "Streamlines attendee registration for conferences, creative showcases, and student balls",
      "Replaces printed guest lists with real-time digital pass verification",
      "Operates directly in mobile web browsers on volunteers' existing phones",
      "Prevents duplicate entry attempts across multiple entrance gates"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Liverpool Events",
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
  "featuresTitle": "Features for Liverpool Waterfront Venues",
  "featuresSubtitle": "Sub-second camera scans, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Zap,
      "title": "Docks & Warehouse Offline Mode",
      "desc": "Historic dock warehouses can have weak cellular signals. URPASS offline mode ensures gate staff never stop scanning."
    },
    {
      icon: Building2,
      "title": "Liverpool Universities",
      "desc": "Tailored for University of Liverpool, LJMU, and Hope societies with custom Student ID fields."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party marketing brokers."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Managing multiple doors across ACC Liverpool? Scans sync within 150ms to prevent duplicate pass usage."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Liverpool?",
    "subtitle": "From waterfront conventions to Baltic Triangle arts events.",
    "personas": [
      {
        "badge": "CONVENTIONS",
        "title": "ACC Liverpool Conferences",
        "desc": "Major medical, business, and political conventions at Kings Dock requiring synchronized multi-door entry."
      },
      {
        "badge": "CAMPUS",
        "title": "University of Liverpool & LJMU",
        "desc": "Student union societies, formal balls, sports club socials, and graduation celebration events."
      },
      {
        "badge": "CREATIVE",
        "title": "Baltic Triangle Events",
        "desc": "Creative agencies, music venues, and tech meetups in converted industrial spaces."
      },
      {
        "badge": "COMMUNITY",
        "title": "Community & Sports Tournaments",
        "desc": "Local football tournaments, charity galas, and community festivals needing simple QR check-in."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Liverpool QR Check-In Works",
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
    "title": "Liverpool Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Liverpool venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Liverpool",
      "Legacy Ticketing Apps"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s per scan (45+ attendees/min)",
        "col3": "2.5 to 4.0s (slow camera tap confirmations)"
      },
      {
        "col1": "Dock Warehouse Network",
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
      "q": "What is event registration software Liverpool?",
      "a": "It is an event registration and smartphone check-in platform designed for Liverpool organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large conferences at ACC Liverpool?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for waterfront convention halls."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Liverpool?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Liverpool student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Liverpool and LJMU use URPASS for seamless ball and festival check-ins."
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
    "region": "GB-LIV",
    "placename": "Liverpool",
    "position": "53.4084;-2.9916",
    "latitude": 53.4084,
    "longitude": -2.9916,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
