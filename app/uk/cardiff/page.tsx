import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing & QR Check-In Cardiff | URPASS",
  description: "Fast event registration and sub-second QR check-in software for Cardiff conferences, university societies, and arena events. 0% ticket fees, UK GDPR compliant.",
  keywords: ["event registration software Cardiff", "event ticketing Cardiff", "QR check-in Cardiff", "Principality Stadium event check-in", "Cardiff University society ticketing", "Wales Millennium Centre conference ticketing", "Eventbrite alternative Cardiff"],
  alternates: {
    canonical: "https://urpass.space/uk/cardiff",
  },
  openGraph: {
    title: "Event Ticketing & QR Check-In Cardiff | URPASS",
    description: "Fast event registration and sub-second QR check-in software for Cardiff conferences, university societies, and arena events. 0% ticket fees, UK GDPR compliant.",
    url: "https://urpass.space/uk/cardiff",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-CRF",
    "geo.placename": "Cardiff",
    "geo.position": "51.4816;-3.1791",
    "ICBM": "51.4816, -3.1791",
  },
};

export default function UkCardiffPage() {
  return (
    <SEOPage
      config={{
  "badge": "CARDIFF EVENT TECH · FAST QR ENTRY",
  "h1": "Event Ticketing & QR Check-In Cardiff",
  "canonicalUrl": "https://urpass.space/uk/cardiff",
  "description": "Fast event registration and sub-second QR check-in software for Cardiff conferences, university societies, and arena events. 0% ticket fees, UK GDPR compliant.",
  "ctaLabel": "Start Free in Cardiff →",
  "ctaTitle": "Power High-Speed Event Entry in Cardiff",
  "ctaDescription": "From Wales Millennium Centre conferences and Principality Stadium events to Cardiff University student union formals, URPASS turns any phone into a sub-second scanner.",
  "directAnswer": {
    "title": "Why Choose URPASS for Cardiff Events?",
    "summary": "URPASS is high-speed event registration and QR check-in software built for Cardiff conferences, arena gatherings, and university societies across South Wales. It replaces slow paper guest lists with sub-second QR scanning on volunteer smartphones. It features 0% ticketing commission, offline resilience, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual verification",
      "Offline resilience designed for dense crowds in stadium and arena concourses",
      "0% per-ticket commission with flat GBP subscriptions",
      "Used by Cardiff University, USW, and Cardiff Met student societies"
    ]
  },
  "whatIs": {
    "title": "What is Event Ticketing & Registration Cardiff?",
    "definition": "Event registration software in Cardiff is a complete digital ticketing and entrance management system. It coordinates delegate registrations, ticket booking in GBP, digital pass delivery, and rapid smartphone door scanning across Wales.",
    "details": [
      "Streamlines attendee registration for Welsh business summits, tech meetups, and student balls",
      "Eliminates printed paper lists and foyer congestion at Cardiff event spaces",
      "Operates directly in mobile web browsers on volunteers' existing phones",
      "Syncs multi-entrance check-ins in real time to prevent duplicate entry attempts"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Cardiff Events",
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
  "featuresTitle": "Features for Cardiff Venues & Summits",
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
      "desc": "Managing multiple doors across Wales Millennium Centre or Motorpoint Arena? Scans sync within 150ms."
    },
    {
      icon: Building2,
      "title": "Cardiff Universities",
      "desc": "Tailored for Cardiff University, USW, and Cardiff Met societies with custom Student ID fields."
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
    "title": "Who Should Use URPASS in Cardiff?",
    "subtitle": "From Welsh capital conferences to student union formals.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "Cardiff University & USW Societies",
        "desc": "Cardiff Students' Union societies, athletic union balls, and departmental formals."
      },
      {
        "badge": "CONFERENCES",
        "title": "Wales Millennium Centre Summits",
        "desc": "National Welsh business conferences, life sciences summits, and public sector symposiums."
      },
      {
        "badge": "TECH",
        "title": "Cardiff Tech & Media Collectives",
        "desc": "Tramshed Tech meetups, creative media showcases, and startup demo days."
      },
      {
        "badge": "COMMUNITY",
        "title": "South Wales Community Events",
        "desc": "Charity galas, cultural celebrations, and sports festivals needing frictionless gate check-in."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Cardiff QR Check-In Works",
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
    "title": "Cardiff Event Check-In Comparison",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in Cardiff venues.",
    "headers": [
      "Feature / Metric",
      "URPASS Cardiff",
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
      "q": "What is event registration software Cardiff?",
      "a": "It is an event registration and smartphone check-in platform designed for Cardiff organisers to create registration pages, issue digital QR passes, and admit attendees quickly."
    },
    {
      "q": "Can URPASS handle large Cardiff events at Principality Stadium or WMC?",
      "a": "Yes. URPASS supports high-throughput multi-gate scanning with sub-150ms sync and offline fallback, making it ideal for arena-scale events."
    },
    {
      "q": "Does URPASS charge per-ticket commission in Cardiff?",
      "a": "No. URPASS charges 0% commission on ticket sales. Organisers pay a transparent flat GBP monthly subscription."
    },
    {
      "q": "Can Cardiff student unions use URPASS for balls and fests?",
      "a": "Yes. Student societies across Cardiff University and USW use URPASS for seamless ball and festival check-ins."
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
      "title": "Bristol Event Registration Platform",
      "href": "/uk/bristol",
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
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-CRF",
    "placename": "Cardiff",
    "position": "51.4816;-3.1791",
    "latitude": 51.4816,
    "longitude": -3.1791,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
