import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Event Registration & Check-In Birmingham | URPASS",
  description: "High-speed event registration and QR check-in software for Birmingham expos, NEC conferences, and university societies. Sub-second scanning, 0% ticket commission.",
  keywords: ["event registration software Birmingham", "QR check-in Birmingham", "Birmingham event ticketing", "NEC Birmingham event check-in", "ICC Birmingham conference registration", "Aston University event ticketing", "Eventbrite alternative Birmingham"],
  alternates: {
    canonical: "https://urpass.space/uk/birmingham",
  },
  openGraph: {
    title: "QR Event Registration & Check-In Birmingham | URPASS",
    description: "High-speed event registration and QR check-in software for Birmingham expos, NEC conferences, and university societies. Sub-second scanning, 0% ticket commission.",
    url: "https://urpass.space/uk/birmingham",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-BIR",
    "geo.placename": "Birmingham",
    "geo.position": "52.4862;-1.8904",
    "ICBM": "52.4862, -1.8904",
  },
};

export default function UkBirminghamPage() {
  return (
    <SEOPage
      config={{
  "badge": "BIRMINGHAM EVENT TECH · FAST ENTRY",
  "h1": "QR Event Registration & Check-In Birmingham",
  "canonicalUrl": "https://urpass.space/uk/birmingham",
  "description": "High-speed event registration and QR check-in software for Birmingham expos, NEC conferences, and university societies. Sub-second scanning, 0% ticket commission.",
  "ctaLabel": "Start Free in Birmingham →",
  "ctaTitle": "Run High-Capacity Birmingham Events with URPASS",
  "ctaDescription": "From NEC Birmingham trade shows and ICC conventions to Digbeth creative events, URPASS turns any phone into a sub-second entrance scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Birmingham Events?",
    "summary": "URPASS is high-speed event registration and QR check-in software engineered for Birmingham trade expos, conventions, and campus gatherings. It enables organisers to create branded registration pages, issue digital QR passes, and validate entries in under 0.3s on volunteer phones without renting expensive scanners. Features 0% ticket fees, offline resilience, and UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant green/red verification",
      "Proven for large Birmingham venue throughput (NEC, ICC, Vox)",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by University of Birmingham, Aston, and BCU event teams"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Birmingham?",
    "definition": "Event registration software in Birmingham is a complete digital attendance system designed for West Midlands event organisers. It coordinates attendee signups, ticket categories, digital credential delivery, and rapid entrance verification across single or multiple venue doors.",
    "details": [
      "Coordinates high-volume delegate throughput at major national exhibition centers",
      "Replaces paper printouts and slow pen-and-paper desk check-in",
      "Works directly in mobile web browsers without requiring native app installations",
      "Syncs multi-entrance scanning to block counterfeit or duplicated passes"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Birmingham Events",
  "howItWorksSubtitle": "From online registration to high-speed entrance flow.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Set your event details, delegate ticket tiers, and custom fields in GBP."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Send your clean URL to delegates, exhibitors, or students."
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
  "featuresTitle": "Built for Birmingham Trade Expos & Summits",
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
      "desc": "Managing multiple hall doors at the NEC or ICC? Scans sync within 150ms to block duplicate entries."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "Crowded exhibition halls can overload Wi-Fi. URPASS offline mode ensures gate staff never stop scanning."
    },
    {
      icon: Building2,
      "title": "Birmingham Universities",
      "desc": "Tailored for UoB, Aston, and BCU student balls, symposiums, and departmental conferences."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party advertising brokers."
    },
    {
      icon: Banknote,
      "title": "0% Commission on Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat monthly GBP plans and no per-ticket penalty fees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in Birmingham?",
    "subtitle": "From NEC trade expos to Digbeth creative festivals.",
    "personas": [
      {
        "badge": "EXPOS",
        "title": "Trade Show & Expo Organisers",
        "desc": "Manage visitor badging and multi-hall door scanning at NEC Birmingham and ICC."
      },
      {
        "badge": "CAMPUS",
        "title": "University Societies & Student Unions",
        "desc": "University of Birmingham Guild of Students and Aston student union events."
      },
      {
        "badge": "CREATIVE",
        "title": "Digbeth Creative & Music Festivals",
        "desc": "Warehouse events, indie markets, and art exhibitions requiring quick phone entry."
      },
      {
        "badge": "CORPORATE",
        "title": "West Midlands Corporate Summits",
        "desc": "Business conferences, supplier days, and regional economic forums with branded passes."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Birmingham QR Check-In Works",
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
    "title": "Birmingham Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Birmingham venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Birmingham",
      "Legacy Ticketing Apps"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s per scan (45+ attendees/min)",
        "col3": "2.5 to 4.0s (slow camera tap confirmations)"
      },
      {
        "col1": "Expo Hall Wi-Fi Drops",
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
      "q": "What is event registration software Birmingham?",
      "a": "It is an event registration and smartphone check-in platform designed for Birmingham organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Birmingham exhibitions at the NEC?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for large trade shows."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Birmingham?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Birmingham student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Birmingham, Aston, and BCU use URPASS for seamless ball and festival check-ins."
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
      "title": "Trade Show Registration & Visitor Check-In Software",
      "href": "/trade-show-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-BIR",
    "placename": "Birmingham",
    "position": "52.4862;-1.8904",
    "latitude": 52.4862,
    "longitude": -1.8904,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
