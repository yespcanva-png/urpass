import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Platform Nottingham | URPASS",
  description: "Fast event registration and sub-second QR check-in software for Nottingham conferences, university student fests, and Motorpoint Arena events. 0% ticket fees.",
  keywords: ["event registration software Nottingham", "Nottingham event registration platform", "QR check-in Nottingham", "University of Nottingham society ticketing", "Nottingham Trent event registration", "Motorpoint Arena Nottingham check-in", "Eventbrite alternative Nottingham"],
  alternates: {
    canonical: "https://urpass.space/uk/nottingham",
  },
  openGraph: {
    title: "Event Registration Platform Nottingham | URPASS",
    description: "Fast event registration and sub-second QR check-in software for Nottingham conferences, university student fests, and Motorpoint Arena events. 0% ticket fees.",
    url: "https://urpass.space/uk/nottingham",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-NGM",
    "geo.placename": "Nottingham",
    "geo.position": "52.9548;-1.1581",
    "ICBM": "52.9548, -1.1581",
  },
};

export default function UkNottinghamPage() {
  return (
    <SEOPage
      config={{
  "badge": "NOTTINGHAM EVENT TECH · FAST QR ENTRY",
  "h1": "Event Registration Platform Nottingham",
  "canonicalUrl": "https://urpass.space/uk/nottingham",
  "description": "Fast event registration and sub-second QR check-in software for Nottingham conferences, university student fests, and Motorpoint Arena events. 0% ticket fees.",
  "ctaLabel": "Start Free in Nottingham →",
  "ctaTitle": "Power High-Speed Event Entry in Nottingham",
  "ctaDescription": "From University of Nottingham and Nottingham Trent student union events to Motorpoint Arena summits, URPASS turns any phone into a sub-second scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Nottingham Events?",
    "summary": "URPASS is modern event registration and QR check-in software built for Nottingham conferences, student societies, and regional expos. It replaces slow paper guest lists with sub-second QR scanning on volunteer smartphones. It features 0% ticketing commission, offline resilience, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual verification",
      "Zero app downloads needed: door staff scan directly using mobile web browsers",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by University of Nottingham, Nottingham Trent, and East Midlands summits"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Platform Nottingham?",
    "definition": "An event registration platform in Nottingham is a digital software system that coordinates delegate registration, ticket booking in GBP, dynamic digital pass issuance, and rapid mobile QR scanning for events across the East Midlands.",
    "details": [
      "Manages attendee booking for university campus events, student balls, and business conferences",
      "Replaces printed ticket stubs and paper checklists with paperless digital passes",
      "Operates directly on standard mobile browsers with zero software downloads",
      "Prevents ticket fraud and duplicate entry attempts across multiple venue gates"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Nottingham Events",
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
  "featuresTitle": "Features for Nottingham Campus & Arena Events",
  "featuresSubtitle": "Sub-second camera scans, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Building2,
      "title": "Nottingham Universities",
      "desc": "Tailored for University of Nottingham and NTU student union balls, career fairs, and society nights."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Managing multiple doors across Motorpoint Arena or Albert Hall? Scans sync within 150ms."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "Dense crowds can jam local cellular networks. URPASS offline mode keeps scanning uninterrupted."
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
    "title": "Who Should Use URPASS in Nottingham?",
    "subtitle": "From East Midlands conferences to student union formals.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "University of Nottingham & NTU Societies",
        "desc": "Student union societies, summer balls, academic symposiums, and sports club formals."
      },
      {
        "badge": "CONFERENCES",
        "title": "Nottingham Conference Centers",
        "desc": "Regional business summits, healthcare symposiums, and corporate roundtables."
      },
      {
        "badge": "TECH",
        "title": "East Midlands Tech & Creative Meets",
        "desc": "Creative Quarter meetups, developer groups, and startup pitch events."
      },
      {
        "badge": "COMMUNITY",
        "title": "Community & Cultural Festivals",
        "desc": "Nottingham Castle events, charity galas, and local community gatherings."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Nottingham QR Check-In Works",
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
    "title": "Nottingham Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Nottingham venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Nottingham",
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
      "q": "What is event registration platform Nottingham?",
      "a": "It is an event registration and smartphone check-in platform designed for Nottingham organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Nottingham events at Motorpoint Arena?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for large arena events."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Nottingham?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Nottingham student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Nottingham and Nottingham Trent use URPASS for seamless ball and festival check-ins."
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
      "title": "Sheffield Event Registration & Digital QR Passes",
      "href": "/uk/sheffield",
      "category": "Location"
    },
    {
      "title": "Birmingham QR Event Registration & Check-In",
      "href": "/uk/birmingham",
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
    "region": "GB-NGM",
    "placename": "Nottingham",
    "position": "52.9548;-1.1581",
    "latitude": 52.9548,
    "longitude": -1.1581,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
