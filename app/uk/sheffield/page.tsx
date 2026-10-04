import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & Digital QR Passes Sheffield | URPASS",
  description: "Fast event registration and digital QR pass check-in software for Sheffield conferences, university student fests, and City Hall events. 0% ticket fees.",
  keywords: ["event registration software Sheffield", "digital QR passes Sheffield", "QR check-in Sheffield", "University of Sheffield society ticketing", "Sheffield Hallam event registration", "Sheffield City Hall check-in", "Eventbrite alternative Sheffield"],
  alternates: {
    canonical: "https://urpass.space/uk/sheffield",
  },
  openGraph: {
    title: "Event Registration & Digital QR Passes Sheffield | URPASS",
    description: "Fast event registration and digital QR pass check-in software for Sheffield conferences, university student fests, and City Hall events. 0% ticket fees.",
    url: "https://urpass.space/uk/sheffield",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-SHF",
    "geo.placename": "Sheffield",
    "geo.position": "53.3811;-1.4701",
    "ICBM": "53.3811, -1.4701",
  },
};

export default function UkSheffieldPage() {
  return (
    <SEOPage
      config={{
  "badge": "SHEFFIELD EVENT TECH · FAST QR PASSES",
  "h1": "Event Registration & Digital QR Passes Sheffield",
  "canonicalUrl": "https://urpass.space/uk/sheffield",
  "description": "Fast event registration and digital QR pass check-in software for Sheffield conferences, university student fests, and City Hall events. 0% ticket fees.",
  "ctaLabel": "Start Free in Sheffield →",
  "ctaTitle": "Power Seamless Event Entry in Sheffield",
  "ctaDescription": "From Sheffield City Hall and Octagon Centre conferences to student union formals, URPASS turns any phone into a sub-second entrance scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Sheffield Events?",
    "summary": "URPASS is modern event registration and digital QR pass software built for Sheffield conferences, engineering summits, and university societies. It replaces slow paper guest lists with sub-second QR scanning on volunteer smartphones. It features 0% ticketing commission, offline resilience, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual verification",
      "Zero app downloads needed: door staff scan directly using mobile web browsers",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by University of Sheffield, Sheffield Hallam, and South Yorkshire summits"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software Sheffield?",
    "definition": "Event registration software in Sheffield is a cloud platform for managing attendee bookings, ticket sales in GBP, automated digital pass distribution, and rapid entrance scanning for South Yorkshire events.",
    "details": [
      "Streamlines attendee registration for engineering summits, tech meetups, and student balls",
      "Replaces printed ticket stubs and paper checklists with paperless digital passes",
      "Operates directly on standard mobile browsers with zero software downloads",
      "Prevents ticket fraud and duplicate entry attempts across multiple venue gates"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Sheffield Events",
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
  "featuresTitle": "Features for Sheffield Engineering & Campus Events",
  "featuresSubtitle": "Sub-second camera scans, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer phone with instant green audio and visual feedback."
    },
    {
      icon: Building2,
      "title": "Sheffield Universities",
      "desc": "Tailored for University of Sheffield and Sheffield Hallam student union balls, career fairs, and society nights."
    },
    {
      icon: Users,
      "title": "Multi-Gate Sync",
      "desc": "Managing multiple doors across Sheffield City Hall or Octagon Centre? Scans sync within 150ms."
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
    "title": "Who Should Use URPASS in Sheffield?",
    "subtitle": "From South Yorkshire engineering conferences to student union formals.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "University of Sheffield & Hallam Societies",
        "desc": "Sheffield Students' Union societies, engineering symposiums, and sports club balls."
      },
      {
        "badge": "INDUSTRY",
        "title": "Advanced Manufacturing & Engineering",
        "desc": "AMRC conferences, industrial symposiums, and technology innovation showcases."
      },
      {
        "badge": "CONFERENCES",
        "title": "Sheffield City Hall & Venues",
        "desc": "Regional business summits, public sector meetings, and awards ceremonies."
      },
      {
        "badge": "COMMUNITY",
        "title": "South Yorkshire Community & Music",
        "desc": "Tramlines fringe events, indie music gigs, and community sports tournaments."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Sheffield QR Check-In Works",
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
    "title": "Sheffield Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Sheffield venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Sheffield",
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
      "q": "What is event registration software Sheffield?",
      "a": "It is an event registration and smartphone check-in platform designed for Sheffield organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Sheffield events at Sheffield City Hall?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for civic halls and auditoriums."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Sheffield?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Sheffield student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across the University of Sheffield and Sheffield Hallam use URPASS for seamless ball and festival check-ins."
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
      "title": "Leeds QR Event Registration & Check-In",
      "href": "/uk/leeds",
      "category": "Location"
    },
    {
      "title": "Nottingham Event Registration Platform",
      "href": "/uk/nottingham",
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
    "region": "GB-SHF",
    "placename": "Sheffield",
    "position": "53.3811;-1.4701",
    "latitude": 53.3811,
    "longitude": -1.4701,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
